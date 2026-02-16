const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },

  // Payment Details
  paymentId: { type: String },
  amount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'refunded'],
    default: 'pending'
  },

  // High Level Progress
  overallProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'verified'],
    default: 'active'
  },

  // Detailed Progress Tracking
  completedLessons: [{
    lessonId: mongoose.Schema.Types.ObjectId,
    completedAt: { type: Date, default: Date.now }
  }],

  completedModules: [{
    moduleId: mongoose.Schema.Types.ObjectId,
    completedAt: { type: Date, default: Date.now },
    quizScore: Number // If there was a quiz
  }],

  completedWeeks: [{
    weekId: mongoose.Schema.Types.ObjectId,
    completedAt: { type: Date, default: Date.now }
  }],

  // Unlock System
  // We store IDs of items that are explicitly unlocked.
  // Rule: First module of first week is unlocked by default (or upon enrollment).
  unlockedModules: [{
    moduleId: mongoose.Schema.Types.ObjectId,
    unlockedAt: { type: Date, default: Date.now }
  }],

  // Current State
  currentLesson: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'Course.weeks.modules.lessons' // Mongoose refs to subdocs are tricky, usually just store ID
  },
  currentModule: mongoose.Schema.Types.ObjectId,
  currentWeek: mongoose.Schema.Types.ObjectId,

  // Activity Tracking
  videoWatchTime: {
    type: Map,
    of: Number // lessonId -> secondsWatched
  },

  lastAccessed: { type: Date, default: Date.now },
  startDate: { type: Date, default: Date.now },
  completionDate: Date,

  // Certification
  certificateIssued: { type: Boolean, default: false },
  certificateUrl: String

}, {
  timestamps: true
});

// Compound Index: One enrollment per user per course
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
