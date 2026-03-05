const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, default: 'contributor' }
  }],
  githubRepo: {
    type: String
  },
  status: {
    type: String,
    enum: ['idea', 'developing', 'completed', 'archived'],
    default: 'idea'
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

projectSchema.index({ createdBy: 1 });
projectSchema.index({ 'members.user': 1 });
projectSchema.index({ groupId: 1 });

module.exports = mongoose.model('Project', projectSchema);
