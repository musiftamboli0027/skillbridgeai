const asyncHandler = require('../utils/asyncHandler');
const CareerPath = require('../models/CareerPath');
const SkillTracker = require('../models/SkillTracker');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get all available career paths
// @route   GET /api/career/paths
// @access  Private (2nd Year)
exports.getCareerPaths = asyncHandler(async (req, res) => {
  const paths = await CareerPath.find({ 
    ...req.collegeOrGlobalFilter,
    isActive: true 
  });
  res.status(200).json({
    success: true,
    data: paths
  });
});

// @desc    Get or create skill tracker for the current user
// @route   GET /api/career/tracker
// @access  Private
exports.getTracker = asyncHandler(async (req, res) => {
  let tracker = await SkillTracker.findOne({ userId: req.user.id });

  if (!tracker) {
    tracker = await SkillTracker.create({
      userId: req.user.id
    });
  }

  res.status(200).json({
    success: true,
    data: tracker
  });
});

// @desc    Select a career path
// @route   POST /api/career/select
// @access  Private (2nd Year)
exports.selectCareerPath = asyncHandler(async (req, res) => {
  const { careerPathId } = req.body;

  const path = await CareerPath.findOne({ _id: careerPathId, ...req.collegeOrGlobalFilter });
  if (!path) {
    return res.status(404).json({ success: false, message: 'Career path not found or inaccessible.' });
  }

  let tracker = await SkillTracker.findOne({ userId: req.user.id });

  if (!tracker) {
    tracker = new SkillTracker({ userId: req.user.id });
  }

  tracker.selectedCareerPathId = careerPathId;
  await tracker.save();

  res.status(200).json({
    success: true,
    message: 'Career path selected successfully',
    data: tracker
  });
});

// @desc    Update tracker progress
// @route   PUT /api/career/progress
// @access  Private
exports.updateProgress = asyncHandler(async (req, res) => {
  const { completedModules, dsaProgress, codingPracticeCount } = req.body;

  let tracker = await SkillTracker.findOne({ userId: req.user.id });

  if (!tracker) {
    tracker = new SkillTracker({ userId: req.user.id });
  }

  if (completedModules) tracker.completedModules = completedModules;
  if (dsaProgress !== undefined) tracker.dsaProgress = dsaProgress;
  if (codingPracticeCount !== undefined) tracker.codingPracticeCount = codingPracticeCount;

  // Check for unlocks
  await checkAndUnlockCourses(req.user.id, tracker);

  await tracker.save();

  res.status(200).json({
    success: true,
    data: tracker
  });
});

/**
 * Logic to unlock courses based on completion
 */
async function checkAndUnlockCourses(userId, tracker) {
  const pythonBasics = await Course.findOne({ title: /Python Basics/i });
  
  if (pythonBasics) {
    const enrollment = await Enrollment.findOne({ 
      user: userId, 
      course: pythonBasics._id,
      status: 'completed' 
    });

    if (enrollment) {
      const interPython = await Course.findOne({ title: /Intermediate Python/i });
      if (interPython && !tracker.unlockedCourses.includes(interPython._id)) {
        tracker.unlockedCourses.push(interPython._id);
        console.log(`Unlocked Intermediate Python for user ${userId}`);
      }
    }
  }
}

// @desc    Get comprehensive skill analytics for dashboard
// @route   GET /api/career/analytics
// @access  Private
exports.getSkillAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Fetch all user data in parallel
  const [user, tracker, enrollments] = await Promise.all([
    User.findById(userId).select('xp rank badges streakCount lastActivityDate primaryDomain secondarySkills domainLevel enrolledCourses certificates collaborationScore technicalScore'),
    SkillTracker.findOne({ userId }),
    Enrollment.find({ user: userId }).populate('course', 'title category duration')
  ]);

  // Calculate course stats
  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter(e => e.status === 'completed').length;
  const inProgressCourses = enrollments.filter(e => e.status === 'active').length;
  const totalLessonsCompleted = user.enrolledCourses.reduce((sum, ec) => sum + (ec.completedLessons?.length || 0), 0);
  const avgProgress = totalCourses > 0 
    ? Math.round(user.enrolledCourses.reduce((sum, ec) => sum + (ec.progress || 0), 0) / totalCourses) 
    : 0;

  // Skill categories from domains
  const skillCategories = [
    { name: 'Technical Skills', skills: user.secondarySkills || [], color: '#00D4FF' },
    { name: 'Primary Domain', skills: user.primaryDomain ? [user.primaryDomain] : [], color: '#7C3AED' },
  ];

  // Learning streak
  const today = new Date();
  const lastActivity = user.lastActivityDate ? new Date(user.lastActivityDate) : null;
  const daysSinceActivity = lastActivity ? Math.floor((today - lastActivity) / 86400000) : -1;
  const isActiveToday = daysSinceActivity <= 1;

  // Build course progress map
  const courseProgress = enrollments.map(e => ({
    courseId: e.course?._id,
    title: e.course?.title,
    category: e.course?.category,
    progress: user.enrolledCourses.find(ec => ec.course?.toString() === e.course?._id?.toString())?.progress || 0,
    status: e.status,
    completedLessons: user.enrolledCourses.find(ec => ec.course?.toString() === e.course?._id?.toString())?.completedLessons?.length || 0
  }));

  // XP level calculation
  const xpLevels = [
    { min: 0, max: 100, title: 'Novice', color: '#94A3B8' },
    { min: 100, max: 500, title: 'Apprentice', color: '#10B981' },
    { min: 500, max: 1500, title: 'Specialist', color: '#00D4FF' },
    { min: 1500, max: 5000, title: 'Expert', color: '#7C3AED' },
    { min: 5000, max: 15000, title: 'Master', color: '#F59E0B' },
    { min: 15000, max: Infinity, title: 'Legend', color: '#EF4444' },
  ];
  const currentLevel = xpLevels.find(l => user.xp >= l.min && user.xp < l.max) || xpLevels[0];
  const xpToNextLevel = currentLevel.max === Infinity ? 0 : currentLevel.max - user.xp;
  const xpProgressPercent = currentLevel.max === Infinity ? 100 : Math.round(((user.xp - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100);

  res.json({
    success: true,
    analytics: {
      // Overview
      xp: user.xp || 0,
      rank: user.rank || 'Novice',
      level: currentLevel,
      xpToNextLevel,
      xpProgressPercent,
      badges: user.badges || [],
      streak: user.streakCount || 0,
      isActiveToday,
      certificates: user.certificates?.length || 0,

      // Course progress
      totalCourses,
      completedCourses,
      inProgressCourses,
      totalLessonsCompleted,
      avgProgress,
      courseProgress,

      // Skills
      primaryDomain: user.primaryDomain || '',
      domainLevel: user.domainLevel || 'Beginner',
      secondarySkills: user.secondarySkills || [],
      skillCategories,

      // Scores
      collaborationScore: user.collaborationScore || 0,
      technicalScore: user.technicalScore || 0,

      // Tracker
      dsaProgress: tracker?.dsaProgress || 0,
      codingPracticeCount: tracker?.codingPracticeCount || 0,
      githubConnected: tracker?.githubConnected || false,
      completedModules: tracker?.completedModules || []
    }
  });
});

// @desc    Update user skills (domain, skills, level)
// @route   PUT /api/career/skills
// @access  Private
exports.updateUserSkills = asyncHandler(async (req, res) => {
  const { primaryDomain, secondarySkills, domainLevel } = req.body;

  const updateData = {};
  if (primaryDomain !== undefined) updateData.primaryDomain = primaryDomain;
  if (secondarySkills !== undefined) updateData.secondarySkills = secondarySkills;
  if (domainLevel !== undefined) updateData.domainLevel = domainLevel;

  const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true })
    .select('primaryDomain secondarySkills domainLevel');

  res.json({ success: true, data: user });
});

