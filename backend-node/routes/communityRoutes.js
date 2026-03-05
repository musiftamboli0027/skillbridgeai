const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/communityController');

// ═══ PUBLIC ROUTES (no auth) ═══
router.get('/public', ctrl.getPublicFeed);
router.get('/leaderboard', ctrl.getPublicLeaderboard);

// ═══ PRIVATE ROUTES (auth required) ═══
router.post('/create', protect, ctrl.createPost);
router.get('/feed', protect, ctrl.getAuthFeed);
router.get('/stats', protect, ctrl.getCommunityStats);
router.get('/my-posts', protect, ctrl.getMyPosts);
router.post('/like/:postId', protect, ctrl.toggleLike);
router.post('/save/:postId', protect, ctrl.toggleSave);
router.post('/comment/:postId', protect, ctrl.addComment);
router.get('/comments/:postId', ctrl.getComments);
router.post('/comment/:commentId/upvote', protect, ctrl.upvoteComment);
router.patch('/accept-answer/:commentId', protect, ctrl.acceptAnswer);
router.post('/report', protect, ctrl.reportPost);
router.delete('/:postId', protect, ctrl.deletePost);

module.exports = router;
