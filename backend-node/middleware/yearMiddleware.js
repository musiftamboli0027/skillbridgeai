const asyncHandler = require('../utils/asyncHandler');

/**
 * Middleware to restrict access based on student's year
 * @param {string[]} allowedYears - Array of years allowed to access the route
 */
const yearAccess = (allowedYears) => {
  return asyncHandler(async (req, res, next) => {
    // Skip check for non-student roles (admin, etc.)
    if (req.user.role !== 'student') {
      return next();
    }

    if (!req.user.year) {
      return res.status(403).json({
        success: false,
        message: 'Student year not specified. Please update your profile.'
      });
    }

    if (!allowedYears.includes(req.user.year)) {
      return res.status(403).json({
        success: false,
        message: `This feature is reserved for ${allowedYears.join(', ')} students only.`
      });
    }

    next();
  });
};

module.exports = { yearAccess };
