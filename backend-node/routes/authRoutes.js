const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  register,
  login,
  logout,
  getMe,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const OAuthState = require('../models/OAuthState');
const GitIntegration = require('../models/GitIntegration');
const User = require('../models/User');
const axios = require('axios');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/github
// Entry point — builds the GitHub authorize URL with a secure DB-backed state
// ─────────────────────────────────────────────────────────────────────────────
router.get('/github', protect, async (req, res) => {
  try {
    const state = crypto.randomBytes(32).toString('hex');

    // Store state in DB linked to the logged-in user's ID
    await OAuthState.create({
      state,
      userId: req.user._id,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/github/callback`,
      scope: 'repo read:user user:email',
      state
    });

    res.json({
      success: true,
      url: `https://github.com/login/oauth/authorize?${params.toString()}`
    });
  } catch (error) {
    console.error('[GitHub] /auth/github error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/github/callback
// GitHub redirects here after the user authorises the app
// ─────────────────────────────────────────────────────────────────────────────
router.get('/github/callback', async (req, res) => {
  const { code, state } = req.query;
  const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:5173';

  if (!code || !state) {
    return res.redirect(`${FRONTEND}/#/dashboard/settings?github=error&reason=missing_params`);
  }

  try {
    // 1. Verify CSRF state from DB
    const stateEntry = await OAuthState.findOne({ state });
    if (!stateEntry || stateEntry.expiresAt < new Date()) {
      await OAuthState.deleteOne({ state }).catch(() => {});
      return res.redirect(`${FRONTEND}/#/dashboard/settings?github=error&reason=expired_state`);
    }

    const userId = stateEntry.userId;

    // 2. Exchange code for access token
    const { data: tokenData } = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/github/callback`
      },
      { headers: { Accept: 'application/json' } }
    );

    if (tokenData.error) {
      console.error('[GitHub] Token exchange error:', tokenData.error_description);
      return res.redirect(`${FRONTEND}/#/dashboard/settings?github=error&reason=token_exchange`);
    }

    const accessToken = tokenData.access_token;

    // 3. Fetch GitHub profile
    const { data: ghProfile } = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    // 4. Upsert GitIntegration record
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

    // 5. Update User model (githubId + avatar if not set)
    const user = await User.findById(userId);
    if (user) {
      user.githubId = String(ghProfile.id);
      if (ghProfile.avatar_url && !user.avatar) user.avatar = ghProfile.avatar_url;
      await user.save();
    }

    // 6. Clean up state
    await OAuthState.deleteOne({ state });

    // 7. Redirect to frontend settings with success
    return res.redirect(`${FRONTEND}/#/dashboard/settings?github=connected`);

  } catch (error) {
    console.error('[GitHub] Callback error:', error.message);
    return res.redirect(`${FRONTEND}/#/dashboard/settings?github=error&reason=server_error`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Standard Auth Routes
// ─────────────────────────────────────────────────────────────────────────────
router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/resend-verification', resendVerification);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
