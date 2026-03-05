const mongoose = require('mongoose');

const skillTrackerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  selectedCareerPathId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CareerPath'
  },
  completedModules: [{
    type: String
  }],
  dsaProgress: {
    type: Number,
    default: 0
  },
  codingPracticeCount: {
    type: Number,
    default: 0
  },
  githubConnected: {
    type: Boolean,
    default: false
  },
  unlockedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('SkillTracker', skillTrackerSchema);
