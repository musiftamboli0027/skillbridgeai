const axios = require('axios');
const crypto = require('crypto');
const GitIntegration = require('../models/GitIntegration');
const OAuthState = require('../models/OAuthState');
const User = require('../models/User');
const {
    ensurePortfolioRepo,
    upsertFile,
    getAuthenticatedUser,
    getCommitHistory,
    parseGitHubError,
    PORTFOLIO_REPO
} = require('../services/githubService');

// ─────────────────────────────────────────────────────────────────────────────
// Helper: get integration (always fetching accessToken) or return 404
// Note: accessToken has select:false on schema — must use .select('+accessToken')
// ─────────────────────────────────────────────────────────────────────────────
async function requireIntegration(userId, res) {
    const integration = await GitIntegration.findOne({ userId }).select('+accessToken');
    if (!integration) {
        res.status(404).json({
            success: false,
            code: 'GITHUB_NOT_CONNECTED',
            message: 'GitHub account not connected. Please connect GitHub from Settings.'
        });
        return null;
    }
    return integration;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/github/auth-url
// Delegates to /api/auth/github which is the registered GitHub callback route.
// This ensures redirect_uri always matches what is in GitHub's OAuth App settings.
// ─────────────────────────────────────────────────────────────────────────────
exports.getAuthUrl = async (req, res) => {
    try {
        const state = crypto.randomBytes(32).toString('hex');
        const userId = req.user.id || req.user._id;

        await OAuthState.create({
            state,
            userId,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        });

        // Build the GitHub authorize URL using the REGISTERED callback
        // (registered in GitHub OAuth App as /api/auth/github/callback)
        const BACKEND = process.env.BACKEND_URL || 'http://localhost:5000';
        const redirectUri = `${BACKEND}/api/auth/github/callback`;

        const params = new URLSearchParams({
            client_id: process.env.GITHUB_CLIENT_ID,
            redirect_uri: redirectUri,
            scope: 'repo read:user user:email',
            state
        });

        res.json({ success: true, url: `https://github.com/login/oauth/authorize?${params.toString()}` });
    } catch (error) {
        console.error('[GitHub] getAuthUrl error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/github/callback   (public — no JWT middleware)
// Handles GitHub OAuth redirect, stores token, redirects to frontend
// ─────────────────────────────────────────────────────────────────────────────
exports.githubCallback = async (req, res) => {
    const { code, state } = req.query;
    const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (!code || !state) {
        return res.redirect(`${FRONTEND}/#/dashboard/settings?github=error&reason=missing_params`);
    }

    try {
        // 1. Verify CSRF state
        const stateEntry = await OAuthState.findOne({ state });
        if (!stateEntry || stateEntry.expiresAt < new Date()) {
            await OAuthState.deleteOne({ state });
            return res.redirect(`${FRONTEND}/#/dashboard/settings?github=error&reason=expired_state`);
        }

        const userId = stateEntry.userId;

        // 2. Exchange code → access token
        const BACKEND = process.env.BACKEND_URL || 'http://localhost:5000';
        const { data: tokenData } = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: `${BACKEND}/api/auth/github/callback`,
                state
            },
            { headers: { Accept: 'application/json' } }
        );

        if (tokenData.error) {
            console.error('[GitHub] Token exchange error:', tokenData.error_description);
            return res.redirect(`${FRONTEND}/#/dashboard/settings?github=error&reason=token_exchange`);
        }

        const accessToken = tokenData.access_token;

        // 3. Fetch GitHub profile
        const ghProfile = await getAuthenticatedUser(accessToken);

        // 4. Fetch user from DB
        const user = await User.findById(userId);
        if (!user) {
            return res.redirect(`${FRONTEND}/#/dashboard/settings?github=error&reason=user_not_found`);
        }

        // 5. Email verification (flexible — skips mismatch if user has no public GH email)
        try {
            const { data: ghEmails } = await axios.get('https://api.github.com/user/emails', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const hasMatch = ghEmails.some(
                e => e.email.toLowerCase() === user.email.toLowerCase() && e.verified
            );
            // Only block if GitHub explicitly returns emails and none match
            if (ghEmails.length > 0 && !hasMatch) {
                await OAuthState.deleteOne({ state });
                return res.redirect(
                    `${FRONTEND}/#/dashboard/settings?github=error&reason=email_mismatch&expected=${encodeURIComponent(user.email)}`
                );
            }
        } catch (_) {
            // user:email scope might not return emails in some edge cases — skip check
        }

        // 6. Upsert GitIntegration
        await GitIntegration.findOneAndUpdate(
            { userId },
            {
                githubUsername: ghProfile.login,
                githubId: String(ghProfile.id),
                avatarUrl: ghProfile.avatar_url,
                accessToken,
                connectedAt: new Date()
            },
            { upsert: true, new: true }
        );

        // 7. Update User model (legacy compat + avatar)
        await User.findByIdAndUpdate(userId, {
            githubId: String(ghProfile.id),
            ...(ghProfile.avatar_url && !user.avatar ? { avatar: ghProfile.avatar_url } : {})
        });

        // 8. Clean up state
        await OAuthState.deleteOne({ state });

        // 9. Redirect with success
        return res.redirect(`${FRONTEND}/#/dashboard/settings?github=connected`);

    } catch (error) {
        console.error('[GitHub] Callback error:', error.message);
        return res.redirect(`${FRONTEND}/#/dashboard/settings?github=error&reason=server_error`);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/github/save-code   (protected)
// Saves/updates a code file to the user's skillbridge-portfolio repo
// Body: { filename, folder, code, commitMessage, language }
// ─────────────────────────────────────────────────────────────────────────────
exports.saveCode = async (req, res) => {
    const { filename, folder = 'python', code, commitMessage, language } = req.body;

    // ── Validation ──
    if (!filename || code === undefined || code === null) {
        return res.status(400).json({
            success: false,
            message: 'filename and code are required.'
        });
    }

    // Basic sanitization — prevent path traversal
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const safeFolderName = folder.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${safeFolderName}/${safeFilename}`;

    const autoCommitMsg = commitMessage?.trim() ||
        `feat: save ${safeFilename} via SkillBridge IDE`;

    try {
        const integration = await requireIntegration(req.user.id, res);
        if (!integration) return; // response already sent

        const { accessToken, githubUsername: owner } = integration;

        // ── Ensure portfolio repo exists (creates it + folders on first use) ──
        await ensurePortfolioRepo(accessToken);

        // ── Push the file ──
        const result = await upsertFile({
            accessToken,
            owner,
            repo: PORTFOLIO_REPO,
            filePath,
            content: code,
            commitMessage: autoCommitMsg
        });

        // ── Track activity (fire-and-forget) ──
        GitIntegration.findOneAndUpdate(
            { userId: req.user.id },
            {
                $inc: { totalCommits: 1 },
                $set: { lastCommitAt: new Date() },
                $push: {
                    commitHistory: {
                        $each: [{
                            sha: result.commit?.sha?.slice(0, 7) || '',
                            message: autoCommitMsg,
                            file: filePath,
                            date: new Date()
                        }],
                        $slice: -50  // keep only last 50
                    }
                }
            }
        ).catch(e => console.warn('[GitHub] commit history update failed:', e.message));

        return res.json({
            success: true,
            message: `✅ ${safeFilename} saved to GitHub!`,
            data: {
                filePath,
                repoUrl: `https://github.com/${owner}/${PORTFOLIO_REPO}`,
                fileUrl: `https://github.com/${owner}/${PORTFOLIO_REPO}/blob/main/${filePath}`,
                commitSha: result.commit?.sha?.slice(0, 7) || '',
                commitUrl: result.commit?.html_url || ''
            }
        });

    } catch (error) {
        const ghError = parseGitHubError(error);
        console.error('[GitHub] saveCode error:', ghError);

        const status = ghError.code === 'TOKEN_INVALID' ? 401
            : ghError.code === 'RATE_LIMITED' ? 429
                : 500;

        return res.status(status).json({
            success: false,
            code: ghError.code,
            message: ghError.message
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/github/disconnect   (protected)
// ─────────────────────────────────────────────────────────────────────────────
exports.disconnectGithub = async (req, res) => {
    try {
        await GitIntegration.deleteOne({ userId: req.user.id });
        await User.findByIdAndUpdate(req.user.id, { $unset: { githubId: 1 } });
        res.json({ success: true, message: 'GitHub disconnected successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/github/profile   (protected)
// ─────────────────────────────────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
    try {
        const integration = await GitIntegration.findOne({ userId: req.user.id });
        if (!integration) {
            return res.json({ success: true, isConnected: false });
        }
        res.json({
            success: true,
            isConnected: true,
            username: integration.githubUsername,
            avatarUrl: integration.avatarUrl,
            connectedAt: integration.connectedAt,
            totalCommits: integration.totalCommits || 0,
            lastCommitAt: integration.lastCommitAt,
            repoUrl: `https://github.com/${integration.githubUsername}/${PORTFOLIO_REPO}`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/github/repos   (protected)
// ─────────────────────────────────────────────────────────────────────────────
exports.getRepos = async (req, res) => {
    try {
        const integration = await requireIntegration(req.user.id, res);
        if (!integration) return;

        const { data: repos } = await axios.get('https://api.github.com/user/repos', {
            headers: {
                Authorization: `Bearer ${integration.accessToken}`,
                Accept: 'application/vnd.github.v3+json'
            },
            params: { sort: 'updated', per_page: 50, affiliation: 'owner' }
        });

        res.json({ success: true, repos });
    } catch (error) {
        const ghError = parseGitHubError(error);
        res.status(500).json({ success: false, ...ghError });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/github/commit-history   (protected)
// ─────────────────────────────────────────────────────────────────────────────
exports.getCommitHistory = async (req, res) => {
    try {
        const integration = await requireIntegration(req.user.id, res);
        if (!integration) return;

        const history = await getCommitHistory(
            integration.accessToken,
            integration.githubUsername,
            20
        );

        res.json({ success: true, history });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/github/activity   (protected)
// ─────────────────────────────────────────────────────────────────────────────
exports.getActivity = async (req, res) => {
    try {
        const integration = await GitIntegration.findOne({ userId: req.user.id });
        if (!integration) {
            return res.json({ success: true, commitsThisWeek: 0, streakDays: 0, totalCommits: 0 });
        }
        res.json({
            success: true,
            commitsThisWeek: integration.totalCommits || 0,
            streakDays: 0,
            totalCommits: integration.totalCommits || 0,
            lastCommitAt: integration.lastCommitAt
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
