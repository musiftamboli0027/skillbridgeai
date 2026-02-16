const axios = require('axios');
const crypto = require('crypto');
const GitIntegration = require('../models/GitIntegration');
const OAuthState = require('../models/OAuthState');
const User = require('../models/User');

/**
 * GET /api/github/auth-url
 * Generates GitHub authorize URL with a secure state
 */
exports.getAuthUrl = async (req, res) => {
    try {
        const state = crypto.randomBytes(32).toString('hex');
        const userId = req.user.id;

        // Save state in DB
        await OAuthState.create({
            state,
            userId,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        });

        const rootUrl = 'https://github.com/login/oauth/authorize';
        const options = {
            client_id: process.env.GITHUB_CLIENT_ID,
            // Use distinct callback for manual connection flow
            redirect_uri: process.env.GITHUB_REDIRECT_URI,
            scope: 'repo read:user user:email',
            state: state
        };

        const qs = new URLSearchParams(options);
        res.json({ url: `${rootUrl}?${qs.toString()}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * GET /api/github/callback
 * Public route to handle GitHub redirect
 */
exports.githubCallback = async (req, res) => {
    const { code, state } = req.query;

    if (!code || !state) {
        return res.status(400).send('Invalid request: missing code or state');
    }

    try {
        // 1. Verify state
        const stateEntry = await OAuthState.findOne({ state });
        if (!stateEntry) {
            return res.status(401).send('Invalid or expired state');
        }

        const userId = stateEntry.userId;

        // 2. Exchange code for access token
        const { data: tokenData } = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
            state
        }, {
            headers: { Accept: 'application/json' }
        });

        if (tokenData.error) {
            return res.status(400).send(tokenData.error_description);
        }

        const accessToken = tokenData.access_token;

        // 3. Fetch User from DB to get their registration email
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // 4. Fetch GitHub Emails to verify match
        const { data: ghEmails } = await axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const hasMatchingEmail = ghEmails.some(emailObj =>
            emailObj.email.toLowerCase() === user.email.toLowerCase() && emailObj.verified
        );

        if (!hasMatchingEmail) {
            // Delete used state since we failed
            await OAuthState.deleteOne({ state });

            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            return res.redirect(`${frontendUrl}/#/dashboard?error=github_email_mismatch&expected=${user.email}#/settings`);
        }

        // 5. Fetch GitHub Profile
        const { data: ghProfile } = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        // 6. Save Integration in DB
        const integration = await GitIntegration.findOneAndUpdate(
            { userId },
            {
                githubUsername: ghProfile.login,
                githubId: ghProfile.id.toString(),
                avatarUrl: ghProfile.avatar_url,
                accessToken: accessToken,
                connectedAt: new Date()
            },
            { upsert: true, new: true }
        );

        // Also update User model for legacy compatibility
        await User.findByIdAndUpdate(userId, {
            'githubId': ghProfile.id.toString(),
            'avatar': ghProfile.avatar_url
        });

        // Delete used state
        await OAuthState.deleteOne({ state });

        // 5. Redirect back to frontend
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/#/dashboard?github=connected`);

    } catch (error) {
        console.error('GitHub Auth Error:', error.message);
        res.status(500).send('Authentication failed');
    }
};

/**
 * POST /api/github/disconnect
 * Removes GitHub integration
 */
exports.disconnectGithub = async (req, res) => {
    try {
        const userId = req.user.id;
        await GitIntegration.deleteOne({ userId });

        await User.findByIdAndUpdate(userId, {
            githubId: null
        });

        res.json({ success: true, message: 'GitHub disconnected' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * GET /api/github/profile
 * Returns connected GitHub profile
 */
exports.getProfile = async (req, res) => {
    try {
        const integration = await GitIntegration.findOne({ userId: req.user.id });
        if (!integration) {
            return res.json({ isConnected: false });
        }
        res.json({
            isConnected: true,
            username: integration.githubUsername,
            avatarUrl: integration.avatarUrl,
            connectedAt: integration.connectedAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * GET /api/github/repos
 * Returns user repositories
 */
exports.getRepos = async (req, res) => {
    try {
        const integration = await GitIntegration.findOne({ userId: req.user.id });
        if (!integration) {
            return res.status(404).json({ message: 'GitHub not connected' });
        }

        const { data: repos } = await axios.get('https://api.github.com/user/repos', {
            headers: { Authorization: `Bearer ${integration.accessToken}` },
            params: { sort: 'updated', per_page: 50 }
        });

        res.json(repos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Placeholder for getActivity
exports.getActivity = async (req, res) => {
    res.json({ commitsThisWeek: 0, streakDays: 0 });
};
