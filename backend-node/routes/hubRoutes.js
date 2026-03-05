const express = require('express');
const router = express.Router();
const { 
    getInternships, 
    applyForInternship, 
    getGroups, 
    createGroup, 
    getProjects, 
    createProject, 
    updateApplicantStatus 
} = require('../controllers/hubController');
const { protect } = require('../middleware/authMiddleware');
const { yearAccess } = require('../middleware/yearMiddleware');

// Protection to everything
router.use(protect);
const preserveCollegeIsolation = require('../middleware/collegeMiddleware');
router.use(preserveCollegeIsolation);

// Strictly restricted to 3rd year and above
router.use(yearAccess(['3rd Year', '4th Year']));

// Internships
router.get('/internships', getInternships);
router.post('/internships/:id/apply', applyForInternship);
router.patch('/internships/:id/status', updateApplicantStatus); // HR Shortlist

// Community Groups
router.get('/groups', getGroups);
router.post('/groups', createGroup);

// Project Collaboration
router.get('/projects', getProjects);
router.post('/projects', createProject);

module.exports = router;
