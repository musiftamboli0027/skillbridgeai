const asyncHandler = require('../utils/asyncHandler');
const CommunicationSession = require('../models/CommunicationSession');

// @desc    Get all sessions for a user
// @route   GET /api/communication/sessions
// @access  Private
exports.getSessions = asyncHandler(async (req, res) => {
  const sessions = await CommunicationSession.find({ userId: req.user.id }).sort('-createdAt');
  res.status(200).json({
    success: true,
    data: sessions
  });
});

// @desc    Create a new communication feedback session
// @route   POST /api/communication/sessions
// @access  Private
exports.createSession = asyncHandler(async (req, res) => {
  const { type, score, feedback, hrNotes, strengths, improvements } = req.body;

  const session = await CommunicationSession.create({
    userId: req.user.id,
    type,
    score,
    feedback,
    hrNotes,
    strengths,
    improvements
  });

  res.status(201).json({
    success: true,
    data: session
  });
});

// @desc    Mock Resume Tips logic
// @route   GET /api/communication/resume-tips
// @access  Private
exports.getResumeTips = asyncHandler(async (req, res) => {
  // Static content for now
  res.status(200).json({
    success: true,
    data: {
      overview: "Your resume is your digital first impression.",
      tips: [
        "Include quantifiable achievements (e.g., 'Reduced load time by 30%')",
        "Use action verbs like Developed, Managed, Integrated",
        "Keep the design clean and ATS-friendly",
        "Include specific SkillBridge projects under Experience"
      ],
      linkedin: [
        "Use a professional headshot",
        "Write a summary that highlights your ed-tech specific growth",
        "List your SkillBridge certifications"
      ]
    }
  });
});
