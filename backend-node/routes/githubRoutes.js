const express = require('express');
const router = express.Router();
const {
    getAuthUrl,
    githubCallback,
    disconnectGithub,
    getProfile,
    getRepos,
    getActivity,
    saveCode,
    getCommitHistory
} = require('../controllers/githubController');
const { protect } = require('../middleware/authMiddleware');
const { yearAccess } = require('../middleware/yearMiddleware');

// GitHub features available to all years
router.use(protect);
router.use(yearAccess(['1st Year', '2nd Year', '3rd Year', '4th Year']));

// ── OAuth Flow ──
router.get('/auth-url', getAuthUrl);
router.get('/callback', githubCallback);          // Public: verified via state param in DB

// ── Portfolio Management ──
router.post('/save-code', saveCode);     // ← NEW: Save code to GitHub
router.get('/commit-history', getCommitHistory); // ← NEW: Fetch commit log

// ── Profile & Data ──
router.get('/profile', getProfile);
router.get('/repos', getRepos);
router.get('/activity', getActivity);

// ── Disconnect ──
router.post('/disconnect', disconnectGithub);


module.exports = router;
