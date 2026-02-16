const express = require('express');
const router = express.Router();
const {
    enrollCourse,
    getMyEnrollments,
    getEnrollment,
    updateProgress,
    getEnrollmentStats,
    getAllEnrollments
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, enrollCourse);
router.get('/my', protect, getMyEnrollments);
router.get('/stats', protect, authorize('admin'), getEnrollmentStats);
router.get('/', protect, authorize('admin'), getAllEnrollments);
router.get('/:id', protect, getEnrollment);
router.put('/:id/progress', protect, updateProgress);

module.exports = router;
