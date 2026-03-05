const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CollabProject',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  commits: {
    type: Number,
    default: 0
  },
  tasksCompleted: {
    type: Number,
    default: 0
  },
  pullRequests: {
    type: Number,
    default: 0
  },
  issuesClosed: {
    type: Number,
    default: 0
  },
  codeReviews: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

contributionSchema.index({ teamId: 1, userId: 1 }, { unique: true });
contributionSchema.index({ projectId: 1 });
contributionSchema.index({ userId: 1 });

module.exports = mongoose.model('Contribution', contributionSchema);
