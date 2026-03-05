const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: true
  },
  technicalScore: {
    type: Number,
    required: true
  },
  hrScore: {
    type: Number,
    required: true
  },
  aiFeedback: {
    type: String,
    required: true
  },
  categoryScores: {
    Knowledge: Number,
    Communication: Number,
    Aptitude: Number,
    Confidence: Number
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed'],
    default: 'Completed'
  },
  rounds: [{
    title: String,
    feedback: String,
    score: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

interviewSessionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
