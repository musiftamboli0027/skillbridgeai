const Interview = require('../models/Interview');
const aiInterviewService = require('../services/aiInterviewService');
const asyncHandler = require('../utils/asyncHandler');
const pdf = require('pdf-parse');

exports.generateInterviewQuestions = asyncHandler(async (req, res) => {
  const { role, difficulty, type, resumeText } = req.body;
  
  if (!role || !difficulty || !type) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const result = await aiInterviewService.generateQuestions(role, difficulty, type, resumeText);
  
  // Create an interview session in DB
  const interview = await Interview.create({
    user: req.user.id,
    role,
    difficulty,
    type,
    questions: result.questions.map(q => q.text),
    status: 'created'
  });

  res.json({
    success: true,
    interviewId: interview._id,
    questions: result.questions
  });
});

exports.evaluateInterviewAnswer = asyncHandler(async (req, res) => {
  const { interviewId, questionIndex, question, answer } = req.body;
  
  if (!interviewId || questionIndex === undefined || !answer) {
    return res.status(400).json({ success: false, message: 'Missing evaluation data' });
  }

  const evaluation = await aiInterviewService.evaluateAnswer(question, answer, req.body.role || 'Candidate');
  
  // Update the interview session in DB
  await Interview.findByIdAndUpdate(interviewId, {
    $push: {
      answers: {
        question: typeof question === 'string' ? question : question.text,
        answer,
        score: evaluation.score,
        feedback: evaluation.feedback
      }
    },
    status: 'in_progress'
  });

  res.json({
    success: true,
    evaluation
  });
});

exports.generateInterviewReport = asyncHandler(async (req, res) => {
  const { interviewId, behaviorData } = req.body;
  
  const interview = await Interview.findById(interviewId);
  if (!interview) {
    return res.status(404).json({ success: false, message: 'Interview not found' });
  }

  const report = await aiInterviewService.generateFinalReport({
    questions: interview.questions,
    answers: interview.answers,
    behaviorData,
    role: interview.role,
    type: interview.type
  });

  interview.result = report;
  interview.behaviorData = behaviorData;
  interview.status = 'completed';
  interview.endTime = new Date();
  await interview.save();

  res.json({
    success: true,
    report
  });
});

exports.uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  try {
    const data = await pdf(req.file.buffer);
    const text = data.text;
    
    // You could also use Gemini here to extract structured skills if needed
    // But for now, just return the text
    res.json({
      success: true,
      text: text.substring(0, 3000), // Limit for prompt safety
      message: 'Resume parsed successfully'
    });
  } catch (error) {
    console.error('Resume Parse Error:', error);
    res.status(500).json({ success: false, message: 'Failed to parse resume' });
  }
});

exports.getInterviewHistory = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select('role difficulty type status createdAt result.overallScore');
    
  res.json({
    success: true,
    items: interviews
  });
});

exports.getInterviewDetails = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user.id });
  if (!interview) {
    return res.status(404).json({ success: false, message: 'Interview not found' });
  }
  
  res.json({
    success: true,
    item: interview
  });
});
