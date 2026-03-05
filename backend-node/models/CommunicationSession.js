const mongoose = require('mongoose');

const communicationSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Mock Interview', 'Resume Review', 'LinkedIn Review'],
    default: 'Mock Interview'
  },
  score: {
    type: Number,
    required: true
  },
  feedback: {
    type: String,
    required: true
  },
  strengths: [String],
  improvements: [String],
  hrNotes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CommunicationSession', communicationSessionSchema);
