const asyncHandler = require('../utils/asyncHandler');
const Group = require('../models/Group');
const Project = require('../models/Project');
const Internship = require('../models/Internship');

// @desc    Get all internships for a college
// @route   GET /api/hub/internships
// @access  Private
exports.getInternships = asyncHandler(async (req, res) => {
  const internships = await Internship.find({ 
    ...req.collegeOrGlobalFilter,
    isActive: true 
  }).sort('-createdAt');
  res.status(200).json({
    success: true,
    data: internships
  });
});

// @desc    Apply for an internship
// @route   POST /api/hub/internships/:id/apply
// @access  Private (3rd Year)
exports.applyForInternship = asyncHandler(async (req, res) => {
  const internship = await Internship.findOne({ 
    _id: req.params.id,
    ...req.collegeOrGlobalFilter,
    isActive: true
  });

  if (!internship) {
    return res.status(404).json({ success: false, message: 'Internship not found' });
  }

  // Check if already applied
  const alreadyApplied = internship.applicants.some(a => a.user.toString() === req.user.id);
  if (alreadyApplied) {
    return res.status(400).json({ success: false, message: 'Already applied' });
  }

  internship.applicants.push({ user: req.user.id });
  await internship.save();

  res.status(200).json({
    success: true,
    message: 'Application successful'
  });
});

// @desc    Get all groups for a college
// @route   GET /api/hub/groups
// @access  Private
exports.getGroups = asyncHandler(async (req, res) => {
  const groups = await Group.find(req.collegeOrGlobalFilter).populate('members', 'name email');
  res.status(200).json({
    success: true,
    data: groups
  });
});

// @desc    Create a group
// @route   POST /api/hub/groups
// @access  Private (3rd Year)
exports.createGroup = asyncHandler(async (req, res) => {
  const { name, domain } = req.body;

  const group = await Group.create({
    name,
    domain,
    collegeId: req.user.collegeId,
    createdBy: req.user.id,
    members: [req.user.id]
  });

  res.status(201).json({
    success: true,
    data: group
  });
});

// @desc    Get all projects
// @route   GET /api/hub/projects
// @access  Private
exports.getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ 
    $or: [
      { createdBy: req.user.id },
      { 'members.user': req.user.id }
    ]
  }).populate('members.user', 'name');
  
  res.status(200).json({
    success: true,
    data: projects
  });
});

// @desc    Create/Update a project and assign roles
// @route   POST /api/hub/projects
// @access  Private (3rd Year)
exports.createProject = asyncHandler(async (req, res) => {
  const { title, description, githubRepo, groupId, members } = req.body;

  const project = await Project.create({
    title,
    description,
    githubRepo,
    groupId,
    createdBy: req.user.id,
    members: members || [{ user: req.user.id, role: 'Lead' }]
  });

  res.status(201).json({
    success: true,
    data: project
  });
});

// @desc    HR Shortlist (Simplified: owner or admin can update status)
// @route   PATCH /api/hub/internships/:id/status
// @access  Private
exports.updateApplicantStatus = asyncHandler(async (req, res) => {
  const { userId, status } = req.body; // status: 'shortlisted', 'rejected', etc.
  
  const internship = await Internship.findOne({
    _id: req.params.id,
    ...req.collegeOrGlobalFilter
  });
  
  if (!internship) {
    return res.status(404).json({ success: false, message: 'Internship not found' });
  }

  const applicant = internship.applicants.find(a => a.user.toString() === userId);
  
  if (!applicant) {
    return res.status(404).json({ success: false, message: 'Applicant not found' });
  }

  applicant.status = status;
  await internship.save();

  res.status(200).json({
    success: true,
    message: 'Status updated'
  });
});
