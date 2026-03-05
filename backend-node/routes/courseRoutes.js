const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourse,
    getCourseBySlug,
    createCourse,
    updateCourse,
    deleteCourse,
    getFeaturedCourses,
    getCategories,
    addReview,
    approveCourse,
    rejectCourse,
    getPendingCourses
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getCourses);
router.get('/featured/list', getFeaturedCourses);
router.get('/categories/list', getCategories);
router.get('/slug/:slug', getCourseBySlug);
router.get('/:id', getCourse);

router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);
router.post('/:id/reviews', protect, addReview);

// Super Admin Routes
router.get('/admin/pending', protect, authorize('super_admin'), getPendingCourses);
router.patch('/:id/approve', protect, authorize('super_admin'), approveCourse);
router.patch('/:id/reject', protect, authorize('super_admin'), rejectCourse);

module.exports = router;
