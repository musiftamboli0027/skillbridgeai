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

// GitHub Auth
// GitHub Auth
router.get('/github', (req, res, next) => {
  const { token, action } = req.query;
  const state = token ? Buffer.from(JSON.stringify({ token, action })).toString('base64') : undefined;
  passport.authenticate('github', {
    scope: ['user:email'],
    state: state
  })(req, res, next);
});

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: `${process.env.FRONTEND_URL}/#/login`, session: false }),
  (req, res) => {
    // Parse state to check for redirect
    let targetPath = '/login';
    if (req.query.state) {
      try {
        const state = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
        if (state.action === 'link') {
          targetPath = '/profile';
        }
      } catch (e) {
        console.error('Error parsing state in callback:', e);
      }
    }

    // Generate token
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const user = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      githubId: req.user.githubId,
      avatar: req.user.avatar
    };

    // Redirect back to frontend
    const githubParam = targetPath === '/profile' ? '&github=success' : '';
    res.redirect(`${process.env.FRONTEND_URL}/#${targetPath}?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}${githubParam}`);
  }
);

router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/resend-verification', resendVerification);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
