const progressService = require('../services/progressService');
const Enrollment = require('../models/Enrollment');

// @desc    Update video watch time/progress
// @route   POST /api/progress/video
// @access  Private
exports.updateVideoProgress = async (req, res) => {
    try {
        const { courseId, lessonId, secondsWatched } = req.body;
        await progressService.updateVideoProgress(req.user._id, courseId, lessonId, secondsWatched);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Mark lesson as completed
// @route   POST /api/progress/complete
// @access  Private
exports.completeLesson = async (req, res) => {
    try {
        const { courseId, lessonId, moduleId } = req.body;
        const result = await progressService.markLessonComplete(req.user._id, courseId, lessonId, moduleId);

        res.status(200).json({
            success: true,
            unlocked: result.unlocked,
            certificateIssued: result.certificateIssued,
            nextModuleId: result.nextModuleId,
            message: result.message
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Course Progress (for Dashboard)
// @route   GET /api/progress/:courseId
// @access  Private
exports.getCourseProgress = async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({
            user: req.user._id,
            course: req.params.courseId
        })
            .select('completedLessons completedModules unlockedModules videoWatchTime overallProgress');

        if (!enrollment) {
            return res.status(404).json({ success: false, message: 'Not enrolled' });
        }

        res.status(200).json({
            success: true,
            data: enrollment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
