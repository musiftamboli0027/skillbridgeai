const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId, paymentId } = req.body;

    // Check if course exists
    let course = await Course.findById(courseId).catch(() => null);
    if (!course) {
      course = await Course.findOne({ slug: courseId });
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const finalCourseId = course._id;

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: req.user.id,
      course: finalCourseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      user: req.user.id,
      course: finalCourseId,
      paymentId: paymentId || 'free-' + Date.now(),
      amount: course.price,
      status: 'active'
    });

    // Update course enrolled count
    course.enrolledStudents += 1;
    await course.save();

    // Add to user's enrolled courses
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        enrolledCourses: {
          course: finalCourseId,
          enrolledAt: new Date()
        }
      }
    });

    res.status(201).json({
      success: true,
      enrollment
    });
  } catch (error) {
    console.error('Enroll course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's enrollments
// @route   GET /api/enrollments/my
// @access  Private
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate('course', 'title image instructor duration modules')
      .populate('course.instructor', 'name avatar')
      .sort('-enrolledAt');

    res.json({
      success: true,
      count: enrollments.length,
      enrollments
    });
  } catch (error) {
    console.error('Get my enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single enrollment
// @route   GET /api/enrollments/:id
// @access  Private
exports.getEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('course');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.json({
      success: true,
      enrollment
    });
  } catch (error) {
    console.error('Get enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update lesson progress
// @route   PUT /api/enrollments/:id/progress
// @access  Private
exports.updateProgress = async (req, res) => {
  try {
    const { moduleId, lessonId, watchTime, duration } = req.body;

    // ... validation ...
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('course');

    if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });

    // 1. Update Video Watch Time
    if (watchTime && duration) {
      const currentWatched = enrollment.videoWatchTime.get(lessonId) || 0;
      if (watchTime > currentWatched) {
        enrollment.videoWatchTime.set(lessonId, watchTime);
      }

      // Mark as completed if > 80%
      const watchPercent = (watchTime / duration) * 100;
      if (watchPercent >= 80) {
        const alreadyCompleted = enrollment.completedLessons.find(
          l => l.lessonId.toString() === lessonId
        );
        if (!alreadyCompleted) {
          enrollment.completedLessons.push({ moduleId, lessonId, completedAt: new Date() });

          // Achievement for unlocking assignment
          enrollment.milestones.push({
            type: 'video_milestone',
            refId: lessonId
          });
        }
      }
    } else if (lessonId && !watchTime) {
      // Manual completion (for reading/projects)
      const alreadyCompleted = enrollment.completedLessons.find(
        l => l.lessonId.toString() === lessonId
      );
      if (!alreadyCompleted) {
        enrollment.completedLessons.push({ moduleId, lessonId, completedAt: new Date() });
      }
    }

    // 2. Recalculate Progress
    const totalLessons = enrollment.course.modules.reduce(
      (acc, module) => acc + (module.lessons?.length || 0), 0
    );

    if (totalLessons > 0) {
      enrollment.overallProgress = Math.min(100, Math.round((enrollment.completedLessons.length / totalLessons) * 100));
    }

    if (enrollment.overallProgress >= 100) {
      enrollment.status = 'completed';
      enrollment.completionDate = new Date();
    }

    enrollment.lastAccessed = new Date();
    await enrollment.save();

    // Optimization: Sync progress to User document for fast dashboard loading
    await User.updateOne(
      { _id: req.user.id, "enrolledCourses.course": enrollment.course._id },
      { $set: { "enrolledCourses.$.progress": enrollment.overallProgress } }
    );

    res.json({
      success: true,
      enrollment
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get enrollment stats
// @route   GET /api/enrollments/stats
// @access  Private (Admin)
exports.getEnrollmentStats = async (req, res) => {
  try {
    const totalEnrollments = await Enrollment.countDocuments();
    const activeEnrollments = await Enrollment.countDocuments({ status: 'active' });
    const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });

    const totalRevenue = await Enrollment.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const monthlyEnrollments = await Enrollment.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      stats: {
        totalEnrollments,
        activeEnrollments,
        completedEnrollments,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyEnrollments
      }
    });
  } catch (error) {
    console.error('Get enrollment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all enrollments (Admin)
// @route   GET /api/enrollments
// @access  Private (Admin)
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('user', 'name email')
      .populate('course', 'title')
      .sort('-createdAt');

    res.json({
      success: true,
      count: enrollments.length,
      enrollments
    });
  } catch (error) {
    console.error('Get all enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
