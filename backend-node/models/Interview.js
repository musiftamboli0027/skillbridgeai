const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: null
  },
  feedback: {
    type: String,
    default: ''
  }
});

const behaviorDataSchema = new mongoose.Schema({
  eyeContact: [{
    type: Number
  }],
  confidence: [{
    type: Number
  }],
  expressions: [{
    type: String
  }],
  timestamps: [{
    type: Date
  }]
});

const resultSchema = new mongoose.Schema({
  overallScore: Number,
  categoryScores: {
    technical: Number,
    communication: Number,
    confidence: Number,
    clarity: Number
  },
  strengths: [String],
  weaknesses: [String],
  improvements: [{
    area: String,
    suggestion: String
  }],
  behaviorAnalysis: {
    eyeContact: Number,
    confidence: Number,
    dominantExpression: String
  },
  feedback: String
});

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  type: {
    type: String,
    enum: ['technical', 'hr', 'mixed'],
    default: 'technical'
  },
  questions: [{
    type: String
  }],
  answers: [answerSchema],
  behaviorData: behaviorDataSchema,
  result: resultSchema,
  status: {
    type: String,
    enum: ['created', 'in_progress', 'completed'],
    default: 'created'
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  }
}, {
  timestamps: true
});

// Add index for faster queries
interviewSchema.index({ user: 1, createdAt: -1 });
interviewSchema.index({ role: 1 });

module.exports = mongoose.model('Interview', interviewSchema);
