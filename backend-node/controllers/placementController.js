const asyncHandler = require('../utils/asyncHandler');
const AptitudeTest = require('../models/AptitudeTest');
const TestResult = require('../models/TestResult');
const InterviewSession = require('../models/InterviewSession');

// @desc    Get all aptitude tests available for student's college
// @route   GET /api/placement/tests
// @access  Private (4th Year)
exports.getTests = asyncHandler(async (req, res) => {
  const tests = await AptitudeTest.find(req.collegeOrGlobalFilter).sort('-createdAt');
  res.status(200).json({
    success: true,
    data: tests
  });
});

// @desc    Submit result for aptitude test
// @route   POST /api/placement/tests/:id/submit
// @access  Private (4th Year)
exports.submitTestResult = asyncHandler(async (req, res) => {
  const { score, totalPossible, strengths, weaknesses, categoryScores } = req.body;

  const test = await AptitudeTest.findOne({ _id: req.params.id, ...req.collegeOrGlobalFilter });
  if (!test) {
    return res.status(404).json({ success: false, message: 'Test not found or inaccessible.' });
  }

  const result = await TestResult.create({
    userId: req.user.id,
    testId: req.params.id,
    score,
    totalPossible,
    strengths,
    weaknesses,
    categoryScores,
    percentile: Math.floor(Math.random() * 30) + 70 // Placeholder for simulated percentile
  });

  res.status(201).json({
    success: true,
    data: result
  });
});

// @desc    Get user's placement dashboard stats
// @route   GET /api/placement/dashboard
// @access  Private (4th Year)
exports.getStats = asyncHandler(async (req, res) => {
  const [results, interviews] = await Promise.all([
    TestResult.find({ userId: req.user.id }).sort('-createdAt'),
    InterviewSession.find({ userId: req.user.id }).sort('-createdAt')
  ]);

  // Aggregate stats
  const totalTests = results.length;
  const avgScore = totalTests > 0 
    ? (results.reduce((s, r) => s + (r.score / r.totalPossible), 0) / totalTests) * 100 
    : 0;

  const technicalReadiness = interviews.length > 0 
    ? (interviews.reduce((s, i) => s + i.technicalScore, 0) / interviews.length) * 10 
    : 0;

  const hrReadiness = interviews.length > 0
    ? (interviews.reduce((s, i) => s + i.hrScore, 0) / interviews.length) * 10
    : 0;

  // Flatten strengths and weaknesses
  const allStrengths = Array.from(new Set(results.flatMap(r => r.strengths)));
  const allWeaknesses = Array.from(new Set(results.flatMap(r => r.weaknesses)));

  res.status(200).json({
    success: true,
    data: {
      results,
      interviews,
      metrics: {
        totalTests,
        avgScore: Math.round(avgScore),
        readinessScore: Math.round((avgScore + technicalReadiness + hrReadiness) / 3),
        isReadyForPlacement: Math.round((avgScore + technicalReadiness + hrReadiness) / 3) >= 50,
        strengths: allStrengths.slice(0, 5),
        weaknesses: allWeaknesses.slice(0, 5)
      }
    }
  });
});

// @desc    Create/submit interview session result
// @route   POST /api/placement/interviews
// @access  Private (4th Year)
exports.createInterviewSessionResult = asyncHandler(async (req, res) => {
  const { company, technicalScore, hrScore, aiFeedback, categoryScores, rounds } = req.body;

  const session = await InterviewSession.create({
    userId: req.user.id,
    company,
    technicalScore,
    hrScore,
    aiFeedback,
    categoryScores,
    rounds,
    status: 'Completed'
  });

  res.status(201).json({
    success: true,
    data: session
  });
});
