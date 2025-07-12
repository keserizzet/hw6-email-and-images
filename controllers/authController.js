const jwt = require('jsonwebtoken');
const User = require('../models/User');
const createHttpError = require('http-errors');
const { sendResetPasswordEmail } = require('../services/emailService');

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(400, 'User already exists with this email.');
    }
    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    await user.addSession(token);
    res.status(201).json({
      status: 201,
      message: 'User registered successfully.',
      data: {
        user: {
          id: user._id,
          email: user.email
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(401, 'Invalid email or password.');
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw createHttpError(401, 'Invalid email or password.');
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    await user.addSession(token);
    res.json({
      status: 200,
      message: 'Login successful.',
      data: {
        user: {
          id: user._id,
          email: user.email
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await req.user.removeSession(req.token);
    res.json({
      status: 200,
      message: 'Logout successful.',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }
    const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '5m' });
    await sendResetPasswordEmail(email, resetToken);
    res.json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }
    user.password = password;
    await user.save();
    await user.clearAllSessions();
    res.json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  sendResetEmail,
  resetPassword
}; 