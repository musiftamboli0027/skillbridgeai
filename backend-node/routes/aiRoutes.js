const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { yearAccess } = require('../middleware/yearMiddleware');
const aiController = require('../controllers/aiController');

// Tutor routes
router.get('/tutor/config', protect, aiController.getTutorConfig);
router.post('/tutor', protect, aiController.getTutorResponse);
router.post('/chat', protect, aiController.getTutorChat);

// Debug routes (2nd year+)
router.post('/debug', protect, yearAccess(['2nd Year', '3rd Year', '4th Year']), aiController.debugCode);

// Roadmap routes
router.post('/roadmap/generate', protect, aiController.generateRoadmap);
router.get('/roadmap', protect, aiController.getRoadmap);

module.exports = router;
