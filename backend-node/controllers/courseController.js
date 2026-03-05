const mongoose = require('mongoose');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
  try {
    const {
      category,
      level,
      search,
      minPrice,
      maxPrice,
      sort = '-createdAt',
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = { isPublished: true };

    if (category) query.category = category;
    if (level) query.level = level;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);

    const courses = await Course.find(query)
      .populate('instructor', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      count: courses.length,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      },
      courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res) => {
  try {
    let course;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      course = await Course.findById(req.params.id).populate('instructor', 'name avatar bio role');
    }

    if (!course) {
      course = await Course.findOne({ slug: req.params.id }).populate('instructor', 'name avatar bio role');
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is enrolled
    let isEnrolled = false;
    let enrollment = null;

    if (req.user) {
      enrollment = await Enrollment.findOne({
        user: req.user.id,
        course: course._id
      });
      isEnrolled = !!enrollment;
    }

    res.json({
      success: true,
      course,
      isEnrolled,
      enrollment
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get course by slug
// @route   GET /api/courses/slug/:slug
// @access  Public
exports.getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate('instructor', 'name avatar bio role');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Get course by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Admin/Instructor)
exports.createCourse = async (req, res) => {
  try {
    req.body.instructor = req.user.id;

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Admin/Instructor)
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Make sure user is course instructor or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin/Instructor)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Make sure user is course instructor or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    await course.deleteOne();

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get featured courses
// @route   GET /api/courses/featured/list
// @access  Public
exports.getFeaturedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true, isFeatured: true })
      .populate('instructor', 'name avatar')
      .limit(6);

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error('Get featured courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get course categories
// @route   GET /api/courses/categories/list
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Course.distinct('category');

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add review to course
// @route   POST /api/courses/:id/reviews
// @access  Private
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: course._id
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to leave a review'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = course.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this course'
      });
    }

    // Add review
    course.reviews.push({
      user: req.user.id,
      rating: Number(rating),
      comment
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Approve a course
// @route   PATCH /api/courses/:id/approve
// @access  Private (Super Admin)
exports.approveCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, {
      approvalStatus: 'approved',
      isPublished: true
    }, { new: true });

    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Approval failed' });
  }
};

// @desc    Reject a course
// @route   PATCH /api/courses/:id/reject
// @access  Private (Super Admin)
exports.rejectCourse = async (req, res) => {
  try {
    const { reason } = req.body;
    const course = await Course.findByIdAndUpdate(req.params.id, {
      approvalStatus: 'rejected',
      isPublished: false,
      rejectionReason: reason
    }, { new: true });

    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Rejection failed' });
  }
};

// @desc    Get pending courses
// @route   GET /api/courses/admin/pending
// @access  Private (Super Admin)
exports.getPendingCourses = async (req, res) => {
  try {
    const courses = await Course.find({ approvalStatus: 'pending' }).populate('instructor', 'name email');
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch' });
  }
};

