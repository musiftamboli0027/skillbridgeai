const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  domainTag: {
    type: String,
    default: 'General'
  },
  status: {
    type: String,
    enum: ['Todo', 'InProgress', 'Done'],
    default: 'Todo'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  dueDate: Date,
  completedAt: Date
}, { _id: true });

const sprintSchema = new mongoose.Schema({
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
  sprintNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  goal: {
    type: String,
    default: ''
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  tasks: [taskSchema],
  status: {
    type: String,
    enum: ['Planning', 'Active', 'Completed'],
    default: 'Planning'
  }
}, {
  timestamps: true
});

sprintSchema.index({ teamId: 1, sprintNumber: 1 });
sprintSchema.index({ projectId: 1 });

module.exports = mongoose.model('Sprint', sprintSchema);
