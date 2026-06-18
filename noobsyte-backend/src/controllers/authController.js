const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Helper to sign JWT payload session keys
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

// Response helper dispatching signed session packages
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Strip password field out from output context payload
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
  });
};

// User Registration endpoint
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('Please provide your name, email, and password parameters.', 400));
  }

  // Create new user schema record
  const newUser = await User.create({
    name,
    email,
    password
  });

  createSendToken(newUser, 201, res);
});

// User Credentials Check & Sign-in endpoint
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate presence of parameters
  if (!email || !password) {
    return next(new AppError('Please provide email and password login parameters.', 400));
  }

  // Find user and explicitly request password field
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Login credentials invalid. Please check email or password.', 401));
  }

  createSendToken(user, 200, res);
});

// Active profile extraction context
exports.getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});
