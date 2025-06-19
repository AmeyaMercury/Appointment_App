class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

const handleError = (error) => {
  if (error.name === 'ValidationError') {
    return new AppError('Validation Error', 400);
  }
  if (error.code === 11000) {
    return new AppError('Email already exists', 400);
  }
  return new AppError(error.message, 500);
};

module.exports = { AppError, handleError };