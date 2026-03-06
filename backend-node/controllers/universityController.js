const University = require('../models/University');
const College = require('../models/College');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all universities
// @route   GET /api/universities
// @access  Public
exports.getUniversities = asyncHandler(async (req, res) => {
  const universities = await University.find().sort('name').select('name _id');
  
  res.status(200).json({
    success: true,
    data: universities
  });
});

// @desc    Get colleges by university ID
// @route   GET /api/colleges/:universityId
// @access  Public
exports.getCollegesByUniversity = asyncHandler(async (req, res) => {
  const { universityId } = req.params;

  const colleges = await College.find({ universityId: universityId })
    .sort('name')
    .select('name _id');

  res.status(200).json({
    success: true,
    data: colleges
  });
});
