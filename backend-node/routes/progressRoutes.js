const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Assuming this exists from previous context
const {
    updateVideoProgress,
    completeLesson,
    getCourseProgress
} = require('../controllers/progressController');

router.use(protect);

router.post('/video', updateVideoProgress);
router.post('/complete', completeLesson);
router.get('/:courseId', getCourseProgress);

module.exports = router;
