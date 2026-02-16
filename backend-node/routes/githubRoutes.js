const express = require('express');
const router = express.Router();
const { getAuthUrl, githubCallback, disconnectGithub, getProfile, getRepos, getActivity } = require('../controllers/githubController');
const { protect } = require('../middleware/authMiddleware');

router.get('/auth-url', protect, getAuthUrl);
router.get('/callback', githubCallback); // Public: Auth verified via state param

router.post('/disconnect', protect, disconnectGithub);
router.get('/profile', protect, getProfile);
router.get('/repos', protect, getRepos);
router.get('/activity', protect, getActivity);

module.exports = router;
