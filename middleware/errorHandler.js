const createHttpError = require('http-errors');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      status: 400,
      message: 'File too large. Maximum size is 5MB.',
      data: {}
    });
  }

  if (err.message === 'Only image files are allowed!') {
    return res.status(400).json({
      status: 400,
      message: 'Only image files are allowed!',
      data: {}
    });
  }

  if (err.isJoi) {
    return res.status(400).json({
      status: 400,
      message: err.message,
      data: {}
    });
  }

  if (err.status) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: {}
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 401,
      message: 'Invalid token.',
      data: {}
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 401,
      message: 'Token expired.',
      data: {}
    });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      status: 400,
      message: messages.join(', '),
      data: {}
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      status: 400,
      message: `${field} already exists.`,
      data: {}
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Internal server error.',
    data: {}
  });
};

module.exports = errorHandler; 