const express = require('express');
const router = express.Router();
const {
  getUniversities,
  getCollegesByUniversity
} = require('../controllers/universityController');

router.get('/universities', getUniversities);
router.get('/colleges/:universityId', getCollegesByUniversity);

module.exports = router;
