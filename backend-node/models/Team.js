const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
    maxlength: 80
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CollabProject',
    required: true
  },
  teamLead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['Lead', 'Developer', 'Designer', 'Analyst', 'Marketer', 'Researcher'],
      default: 'Developer'
    },
    domain: {
      type: String,
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  joinRequests: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    domain: String,
    role: String,
    message: String,
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    requestedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['Forming', 'Active', 'Completed', 'Archived'],
    default: 'Forming'
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College'
  },
  maxMembers: {
    type: Number,
    default: 6
  }
}, {
  timestamps: true
});

teamSchema.index({ projectId: 1 });
teamSchema.index({ teamLead: 1 });
teamSchema.index({ 'members.userId': 1 });
teamSchema.index({ status: 1 });

module.exports = mongoose.model('Team', teamSchema);
