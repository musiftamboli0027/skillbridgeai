const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AptitudeTest',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalPossible: {
    type: Number,
    required: true
  },
  percentile: {
    type: Number,
    default: 0
  },
  strengths: [String],
  weaknesses: [String],
  categoryScores: {
    Quantitative: Number,
    Logical: Number,
    Verbal: Number,
    Technical: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

testResultSchema.index({ userId: 1, createdAt: -1 });
testResultSchema.index({ testId: 1 });

module.exports = mongoose.model('TestResult', testResultSchema);
