const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please provide a valid email']
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin', 'university_admin', 'super_admin', 'recruiter'],
    default: 'student'
  },
  // Recruiter-specific fields
  recruiterProfile: {
    companyName: { type: String, trim: true, default: '' },
    companyWebsite: { type: String, trim: true, default: '' },
    companyLogo: { type: String, default: '' },
    companyDescription: { type: String, maxlength: 1000, default: '' },
    isVerified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verificationStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University'
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College'
  },
  year: {
    type: String,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
  },
  branch: {
    type: String,
    trim: true
  },
  careerInterest: {
    type: String,
    trim: true
  },
  onboardingComplete: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  enrolledCourses: [{
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0
    },
    completedLessons: [{
      type: mongoose.Schema.Types.ObjectId
    }],
    lastAccessed: {
      type: Date,
      default: Date.now
    }
  }],
  certificates: [{
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    issuedAt: {
      type: Date,
      default: Date.now
    },
    certificateUrl: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  refreshToken: String,

  // Gamification
  xp: {
    type: Number,
    default: 0
  },
  rank: {
    type: String,
    enum: ['Novice', 'Apprentice', 'Specialist', 'Expert', 'Master', 'Legend'],
    default: 'Novice'
  },
  badges: [{
    name: String,
    icon: String,
    awardedAt: {
      type: Date,
      default: Date.now
    }
  }],
  streakCount: {
    type: Number,
    default: 0
  },
  lastActivityDate: Date,

  // ── Collaboration Module Fields ──
  primaryDomain: {
    type: String,
    enum: ['Software Development', 'AI/ML', 'Design', 'Marketing', 'Business', 'Data', 'DevOps', 'Mobile', 'Cybersecurity', ''],
    default: ''
  },
  secondarySkills: {
    type: [String],
    default: []
  },
  domainLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', ''],
    default: ''
  },
  collaborationScore: {
    type: Number,
    default: 0
  },
  leadershipScore: {
    type: Number,
    default: 0
  },
  technicalScore: {
    type: Number,
    default: 0
  },
  secondYearPerformance: {
    projectsCompleted: { type: Number, default: 0 },
    avgScore: { type: Number, default: 0 },
    totalContributions: { type: Number, default: 0 },
    deployedApps: { type: Number, default: 0 },
    placementReady: { type: Boolean, default: false }
  },
  collaborationHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CollabProject'
  }]
}, {
  timestamps: true
});

userSchema.index({ collegeId: 1, year: 1, role: 1 });
userSchema.index({ universityId: 1 });
userSchema.index({ 'enrolledCourses.course': 1 }); // Optimize checking if user is enrolled in a specific course

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get JWT token method
userSchema.methods.getSignedJwtToken = function () {
  return require('jsonwebtoken').sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

module.exports = mongoose.model('User', userSchema);
