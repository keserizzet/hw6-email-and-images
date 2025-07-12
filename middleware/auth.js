const jwt = require('jsonwebtoken');
const User = require('../models/User');
const createHttpError = require('http-errors');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw createHttpError(401, 'Access denied. No token provided.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      throw createHttpError(401, 'Invalid token.');
    }

    const sessionExists = user.sessions.some(session => session.token === token);
    if (!sessionExists) {
      throw createHttpError(401, 'Token has been revoked.');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(createHttpError(401, 'Invalid token.'));
    } else if (error.name === 'TokenExpiredError') {
      next(createHttpError(401, 'Token expired.'));
    } else {
      next(error);
    }
  }
};

module.exports = auth; 