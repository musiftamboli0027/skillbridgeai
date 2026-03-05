const User = require('../models/User');

// @desc    Get user portfolio
// @route   GET /api/users/portfolio/:username
// @access  Public
exports.getPortfolio = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
            .select('-password -tokens')
            .populate('enrolledCourses.course')
            .populate('universityId', 'name')
            .populate('collegeId', 'name');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get trainers
// @route   GET /api/users/trainers
// @access  Public
exports.getTrainers = async (req, res) => {
    try {
        const trainers = await User.find({ role: 'admin' }).select('name avatar bio');
        res.json({ success: true, trainers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.id, req.body, {
            new: true,
            runValidators: true
        });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Upload avatar
// @route   POST /api/users/avatar
// @access  Private
exports.uploadAvatar = async (req, res) => {
    try {
        // Implementation for Cloudinary upload would go here
        res.json({ success: true, message: 'Avatar uploaded (stub)' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Upload resume
// @route   POST /api/users/resume
// @access  Private (Student only)
exports.uploadResume = async (req, res) => {
    try {
        res.json({ success: true, message: 'Resume uploaded (stub)' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/users/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // Calculate real stats from user data
        const enrolledCount = user.enrolledCourses ? user.enrolledCourses.length : 0;
        const completedCount = user.enrolledCourses ? user.enrolledCourses.filter(c => c.progress >= 100).length : 0;

        // Mock/Gamified stats (since we don't have these models yet)
        const totalXp = (completedCount * 1000) + (enrolledCount * 50) + 120; // Base XP + course XP

        // Determine rank based on XP
        let rank = 'Novice';
        if (totalXp > 500) rank = 'Apprentice';
        if (totalXp > 1000) rank = 'Scholar';
        if (totalXp > 2500) rank = 'Expert';
        if (totalXp > 5000) rank = 'Master';

        const stats = {
            enrolledCount,
            completedCount,
            learningStreak: user.streakCount || 0,
            totalXp: user.xp || 0,
            rank: user.rank || 'Novice',
            badges: user.badges || [],
            upcomingSessions: []
        };

        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all students (Admin)
// @route   GET /api/users/students
// @access  Private (Admin only)
exports.getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' });
        res.json({ success: true, students });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get student by ID (Admin)
// @route   GET /api/users/students/:id
// @access  Private (Admin only)
exports.getStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id)
            .populate('universityId', 'name')
            .populate('collegeId', 'name');
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        res.json({ success: true, student });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const GitIntegration = require('../models/GitIntegration');

// @desc    Unlink GitHub account
// @route   DELETE /api/users/profile/github
// @access  Private
exports.unlinkGitHub = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.githubId = undefined;
        await user.save();

        // Also remove from GitIntegration table
        await GitIntegration.deleteOne({ userId: req.user.id });

        res.json({ success: true, message: 'GitHub account unlinked successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
