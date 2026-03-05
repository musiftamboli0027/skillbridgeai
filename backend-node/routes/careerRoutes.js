const express = require('express');
const router = express.Router();
const { 
    getCareerPaths, 
    getTracker, 
    selectCareerPath, 
    updateProgress,
    getSkillAnalytics,
    updateUserSkills
} = require('../controllers/careerController');
const { protect } = require('../middleware/authMiddleware');
const { yearAccess } = require('../middleware/yearMiddleware');

// Apply protection to all routes
router.use(protect);
const preserveCollegeIsolation = require('../middleware/collegeMiddleware');
router.use(preserveCollegeIsolation);

// Career paths & tracker available to all years
router.get('/paths', getCareerPaths);
router.post('/select', selectCareerPath);
router.get('/tracker', getTracker);
router.put('/progress', updateProgress);
router.get('/analytics', getSkillAnalytics);
router.put('/skills', updateUserSkills);

module.exports = router;
