const University = require('../models/University');
const College = require('../models/College');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all universities
// @route   GET /api/saas/universities
// @access  Public
exports.getUniversities = asyncHandler(async (req, res) => {
  const universities = await University.find().sort('name');
  res.json({
    success: true,
    data: universities
  });
});

// @desc    Get colleges by university
// @route   GET /api/saas/colleges/:universityId
// @access  Public
exports.getColleges = asyncHandler(async (req, res) => {
  const colleges = await College.find({ universityId: req.params.universityId }).sort('name');
  res.json({
    success: true,
    data: colleges
  });
});
