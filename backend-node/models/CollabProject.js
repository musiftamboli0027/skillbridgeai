const mongoose = require('mongoose');

const collabProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: 120
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: 2000
  },
  problemStatement: {
    type: String,
    required: [true, 'Problem statement is required'],
    maxlength: 3000
  },
  requiredDomains: {
    type: [String],
    required: true,
    validate: {
      validator: v => v.length >= 3,
      message: 'At least 3 distinct domains are required'
    }
  },
  projectType: {
    type: String,
    enum: ['Startup', 'SaaS', 'AI', 'College', 'NGO', 'OpenSource'],
    default: 'Startup'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College'
  },
  mentorAssigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  mentorFeedback: [{
    comment: String,
    score: { type: Number, min: 0, max: 10 },
    createdAt: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ['Proposal', 'Approved', 'Development', 'Demo', 'Completed', 'Rejected'],
    default: 'Proposal'
  },
  rejectionReason: String,
  currentSprintNumber: {
    type: Number,
    default: 0
  },
  githubRepoUrl: {
    type: String,
    default: ''
  },
  deployedUrl: {
    type: String,
    default: ''
  },
  techStack: [String],
  tags: [String],
  finalScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  demoDate: Date,
  completedAt: Date
}, {
  timestamps: true
});

collabProjectSchema.index({ createdBy: 1 });
collabProjectSchema.index({ collegeId: 1, status: 1 });
collabProjectSchema.index({ status: 1 });

module.exports = mongoose.model('CollabProject', collabProjectSchema);
