const AppError = require('../utils/AppError');

const handleCastErrorDB = err => {
  const message = `Invalid format for resource parameter: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  let message = 'This email address is already registered. Please sign in instead.';
  if (err.errmsg && !err.errmsg.includes('email')) {
    const matched = err.errmsg.match(/(["'])(\\?.)*?\1/);
    const value = matched ? matched[0] : '';
    message = `Duplicate field value: ${value}. Please use another value.`;
  }
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = err.errors ? Object.values(err.errors).map(el => el.message) : [];
  const message = `Invalid data input payload parameters: ${errors.join('. ') || err.message}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid user session token. Log in again.', 401);
const handleJWTExpiredError = () => new AppError('User session expired. Log in again.', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error('CRITICAL UNCAUGHT ENGINE SYSTEM FAULT:', err);
    res.status(500).json({
      status: 'error',
      message: 'A critical system anomaly occurred.'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;
  error.name = err.name;
  error.code = err.code;
  error.errmsg = err.errmsg;
  error.errors = err.errors;

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};
