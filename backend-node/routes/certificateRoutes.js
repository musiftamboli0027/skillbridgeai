const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Verify certificate via QR
// @route   GET /api/certificates/verify/:enrollmentId
// @access  Public
router.get('/verify/:enrollmentId', async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.enrollmentId)
            .populate('user', 'name rank xp badges')
            .populate('course', 'title category level');

        if (!enrollment || enrollment.overallProgress < 100) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found or course not completed'
            });
        }

        res.json({
            success: true,
            data: {
                studentName: enrollment.user.name,
                courseTitle: enrollment.course.title,
                completedAt: enrollment.completedLessons.sort((a, b) => b.completedAt - a.completedAt)[0].completedAt,
                rank: enrollment.user.rank,
                totalXp: enrollment.user.xp,
                category: enrollment.course.category,
                verified: true
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Verification error' });
    }
});

module.exports = router;
