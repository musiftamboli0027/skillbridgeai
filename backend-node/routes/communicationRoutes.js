const express = require('express');
const router = express.Router();
const { 
    getSessions, 
    createSession, 
    getResumeTips 
} = require('../controllers/communicationController');
const { protect } = require('../middleware/authMiddleware');
const { yearAccess } = require('../middleware/yearMiddleware');

// Protection to everything
router.use(protect);
const preserveCollegeIsolation = require('../middleware/collegeMiddleware');
router.use(preserveCollegeIsolation);

// Limited to 3rd and 4th years
router.use(yearAccess(['3rd Year', '4th Year']));

router.get('/sessions', getSessions);
router.post('/sessions', createSession);
router.get('/resume-tips', getResumeTips);

module.exports = router;
