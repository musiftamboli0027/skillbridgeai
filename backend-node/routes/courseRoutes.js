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
    addReview
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

module.exports = router;
