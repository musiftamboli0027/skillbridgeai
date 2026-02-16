const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../utils/cloudinary');
const userController = require('../controllers/userController');

// Public routes
router.get('/portfolio/:username', userController.getPortfolio);
router.get('/trainers', userController.getTrainers);

router.use(protect);

// Profile routes (logged-in user)
router.put('/profile', userController.updateProfile);
router.delete('/profile/github', userController.unlinkGitHub);
router.post('/avatar', upload.single('avatar'), userController.uploadAvatar);
router.post('/resume', authorize('student'), upload.single('resume'), userController.uploadResume);
router.get('/dashboard', userController.getDashboardStats);

// Admin routes
router.get('/students', authorize('admin'), userController.getStudents);
router.get('/students/:id', authorize('admin'), userController.getStudent);

module.exports = router;
