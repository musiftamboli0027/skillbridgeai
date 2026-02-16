const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    console.log('Auth Middleware: No token found in headers or cookies');
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth Middleware: Token decoded, ID:', decoded.id);

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      console.log('Auth Middleware: User not found for ID:', decoded.id);
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    next();
  } catch (err) {
    console.log('Auth Middleware: Token verification failed:', err.message);
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
