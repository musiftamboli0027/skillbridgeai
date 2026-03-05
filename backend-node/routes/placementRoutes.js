const express = require('express');
const router = express.Router();
const { 
    getTests, 
    submitTestResult, 
    getStats, 
    createInterviewSessionResult 
} = require('../controllers/placementController');
const { protect } = require('../middleware/authMiddleware');
const { yearAccess } = require('../middleware/yearMiddleware');
const preserveCollegeIsolation = require('../middleware/collegeMiddleware');

// Protection to everything
router.use(protect);
router.use(preserveCollegeIsolation);

// Strictly restricted to 4th year
router.use(yearAccess(['4th Year']));

// Dashboard and metric aggregation
router.get('/dashboard', getStats);

// Aptitude Tests
router.get('/tests', getTests);
router.post('/tests/:id/submit', submitTestResult);

// Interview Sessions
router.post('/interviews', createInterviewSessionResult);

module.exports = router;
