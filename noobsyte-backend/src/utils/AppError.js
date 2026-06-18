class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Identifies predicted operational errors versus engine faults

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
