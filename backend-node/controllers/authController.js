const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const asyncHandler = require('../utils/asyncHandler');
const { sendEmail, getVerificationEmailTemplate, getResetPasswordEmailTemplate } = require('../utils/email');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  let { name, email, password, role, universityId, collegeId, year, branch, careerInterest, phone } = req.body;
  email = email.trim().toLowerCase();

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  // Create user
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

  // Find or Create University/College if names are provided instead of IDs
  const University = require('../models/University');
  const College = require('../models/College');

  const mongoose = require('mongoose');
  let uId = universityId;
  let cId = collegeId;

  if (universityId && typeof universityId === 'string' && !mongoose.Types.ObjectId.isValid(universityId)) {
    // If it's a name, find or create
    let uni = await University.findOne({ name: new RegExp(`^${universityId}$`, 'i') });
    if (!uni) uni = await University.create({ name: universityId });
    uId = uni._id;
  }

  if (collegeId && typeof collegeId === 'string' && !mongoose.Types.ObjectId.isValid(collegeId) && uId) {
    let coll = await College.findOne({ name: new RegExp(`^${collegeId}$`, 'i'), universityId: uId });
    if (!coll) coll = await College.create({ name: collegeId, universityId: uId });
    cId = coll._id;
  }

  let recruiterProfile = undefined;
  if (role === 'recruiter') {
    recruiterProfile = {
      companyName: req.body.companyName || '',
      companyWebsite: req.body.companyWebsite || '',
      companyLogo: req.body.companyLogo || '',
      companyDescription: req.body.companyDescription || '',
      verificationStatus: 'Pending',
      isVerified: false
    };
  }

  const user = await User.create({
    name,
    username: req.body.username, // Support username from body
    email,
    password,
    role: role || 'student',
    universityId: uId,
    collegeId: cId,
    year,
    branch,
    careerInterest,
    phone,
    recruiterProfile,
    onboardingComplete: role === 'recruiter' ? true : !!(uId && cId && year && branch),
    isVerified: false,
    emailVerificationToken: hashedToken,
    emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });

  const verificationUrl = `${process.env.FRONTEND_URL}/#/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

  // Non-blocking email sending to avoid delaying response
  sendEmail({
    email: user.email,
    subject: 'Verify Your Email - SkillBridge',
    html: getVerificationEmailTemplate(user.name, verificationUrl)
  }).catch(err => {
    console.error('Registration email background sending error:', err);
    // Log the error but don't crash since the user is already created
  });

  res.status(201).json({
    success: true,
    message: 'Registration successful! Please check your email to verify your account.'
  });
});

// @desc    Verify email address and login directly
// @route   GET /api/auth/verify-email
exports.verifyEmail = asyncHandler(async (req, res) => {
  let { token, email } = req.query;

  if (!token || !email) {
    return res.status(400).json({ success: false, message: 'Missing verification details' });
  }

  email = email.trim().toLowerCase();

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // 1. Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // 2. If already verified, just return success (handles React Strict Mode double-calling)
  if (user.isVerified) {
    const authToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: 'Email verified! Logging you in...',
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        universityId: user.universityId,
        collegeId: user.collegeId,
        year: user.year,
        branch: user.branch,
        careerInterest: user.careerInterest,
        recruiterProfile: user.recruiterProfile,
        onboardingComplete: user.onboardingComplete
      }
    });
  }

  // 3. Validate token
  if (user.emailVerificationToken !== hashedToken || user.emailVerificationExpires < Date.now()) {
    return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
  }

  // Activate user
  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  // Direct login logic
  const authToken = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('token', authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
  });

  res.status(200).json({
    success: true,
    message: 'Email verified! Logging you in...',
    token: authToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      universityId: user.universityId,
      collegeId: user.collegeId,
      year: user.year,
      branch: user.branch,
      careerInterest: user.careerInterest,
      recruiterProfile: user.recruiterProfile,
      onboardingComplete: user.onboardingComplete
    }
  });
});

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
exports.resendVerification = asyncHandler(async (req, res) => {
  let { email } = req.body;
  email = email.trim().toLowerCase();

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (user.isVerified) {
    return res.status(400).json({ success: false, message: 'Account is already verified' });
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = Date.now() + 30 * 60 * 1000;
  await user.save();

  const verificationUrl = `${process.env.FRONTEND_URL}/#/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

  await sendEmail({
    email: user.email,
    subject: 'Email Verification - SkillBridge',
    html: getVerificationEmailTemplate(user.name, verificationUrl)
  });

  res.status(200).json({
    success: true,
    message: 'Verification link sent to your email.'
  });
});

// @desc    Login user - Handles activation trigger
// @route   POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  let { email, password } = req.body;
  const identifier = email.trim();

  const user = await User.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { phone: identifier }
    ]
  }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // IF NOT VERIFIED: Send activation link and block login
  if (!user.isVerified) {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = Date.now() + 30 * 60 * 1000;
    await user.save();

    const verificationUrl = `${process.env.FRONTEND_URL}/#/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    console.log('--- LOGIN ACTIVATION LINK (DEBUG) ---');
    console.log(verificationUrl);
    console.log('--------------------------------------');

    try {
      await sendEmail({
        email: user.email,
        subject: 'Activate Your Account - SkillBridge',
        html: getVerificationEmailTemplate(user.name, verificationUrl)
      });

      return res.status(401).json({
        success: false,
        message: 'Activate account using your registered mail.',
        notVerified: true
      });
    } catch (emailErr) {
      console.error('Email error:', emailErr);
      return res.status(401).json({
        success: false,
        message: 'Account not verified. Failed to send activation link.',
        notVerified: true
      });
    }
  }

  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
  });

  // Populate enrolled courses and SaaS fields before sending response
  await user.populate([
    { path: 'enrolledCourses.course', model: 'Course' },
    { path: 'universityId', select: 'name' },
    { path: 'collegeId', select: 'name' }
  ]);

  res.status(200).json({
    success: true,
    token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        githubId: user.githubId,
        avatar: user.avatar,
        enrolledCourses: user.enrolledCourses || [],
        universityId: user.universityId,
        collegeId: user.collegeId,
        year: user.year,
        branch: user.branch,
        careerInterest: user.careerInterest,
        recruiterProfile: user.recruiterProfile,
        onboardingComplete: user.onboardingComplete
      }
  });
});

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = asyncHandler(async (req, res) => {
  let { email } = req.body;
  email = email.trim().toLowerCase();

  const user = await User.findOne({ email });
  if (!user) {
    // Return success even if user not found for security reasons
    return res.status(200).json({ success: true, message: 'If an account exists with that email, a reset link has been sent.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/#/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request - SkillBridge',
      html: getResetPasswordEmailTemplate(user.name, resetUrl)
    });

    res.status(200).json({
      success: true,
      message: 'If an account exists with that email, a reset link has been sent.'
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return res.status(500).json({ success: false, message: 'Email could not be sent' });
  }
});

// @desc    Reset Password
// @route   POST /api/auth/reset-password
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, email, password } = req.body;

  if (!token || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing required details' });
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successful! You can now login with your new password.'
  });
});

exports.logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate({
      path: 'enrolledCourses.course',
      model: 'Course'
    })
    .populate('universityId', 'name')
    .populate('collegeId', 'name');
  res.status(200).json({ success: true, user });
});
