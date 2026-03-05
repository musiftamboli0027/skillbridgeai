const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeLink: {
    type: String,
    trim: true,
    default: ''
  },
  portfolioLink: {
    type: String,
    trim: true,
    default: ''
  },
  githubLink: {
    type: String,
    trim: true,
    default: ''
  },
  coverLetter: {
    type: String,
    maxlength: 2000,
    default: ''
  },
  status: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Rejected', 'Hired'],
    default: 'Applied'
  },
  recruiterFeedback: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  // Auto-attached performance metrics at time of application
  performanceSnapshot: {
    communityScore: { type: Number, default: 0 },
    collaborationScore: { type: Number, default: 0 },
    completedCourses: { type: Number, default: 0 },
    projectsCompleted: { type: Number, default: 0 },
    githubCommits: { type: Number, default: 0 },
    xp: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Prevent duplicate applications
applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });
applicationSchema.index({ studentId: 1 });
applicationSchema.index({ jobId: 1, status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
