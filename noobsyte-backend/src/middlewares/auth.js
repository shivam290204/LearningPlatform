const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  
  // Extract token from Bearer authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Access denied. Authentication token is missing.', 401));
  }

  // Verify JWT integrity
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if owner user still exists in database
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('Owner session reference key no longer exists.', 401));
  }

  // Inject authorized user metadata inside request context
  req.user = currentUser;
  next();
});

// Role-Based Access Control middleware generator
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Forbidden: Access permissions insufficient.', 403));
    }
    next();
  };
};
