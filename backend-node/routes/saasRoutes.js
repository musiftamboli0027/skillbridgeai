const express = require('express');
const router = express.Router();
const { getUniversities, getColleges } = require('../controllers/saasController');

router.get('/universities', getUniversities);
router.get('/colleges/:universityId', getColleges);

module.exports = router;
