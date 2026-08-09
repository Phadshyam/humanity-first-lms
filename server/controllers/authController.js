const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const connectDB = require('../config/db');

// Password complexity regex: at least 8 chars, at least one number or special character
const passwordRegex = /^(?=.*[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    await connectDB();

    const { name, email, password, role, preferredLanguage } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    const cleanName = String(name).trim();
    const normalizedEmail = String(email).toLowerCase().trim();
    const cleanPassword = String(password).trim();
    const cleanRole = role ? String(role).toLowerCase().trim().replace(/\s+/g, '_') : 'volunteer';

    if (!passwordRegex.test(cleanPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and contain at least one number or special character.'
      });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    const user = await User.create({
      name: cleanName,
      email: normalizedEmail,
      password: cleanPassword,
      role: cleanRole,
      preferredLanguage: preferredLanguage || 'EN'
    });

    return res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
        token: generateToken(user._id, user.role)
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error registering user',
      error: error.message
    });
  }
};

// @desc    Authenticate user & get JWT token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    await connectDB();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const cleanPassword = String(password).trim();

    // Explicitly select password field to enable matchPassword comparison
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user || !(await user.matchPassword(cleanPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
        token: generateToken(user._id, user.role)
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error logging in',
      error: error.message
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private (Protected)
const getMe = async (req, res) => {
  try {
    await connectDB();

    const user = await User.findById(req.user._id).select('-password');

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving profile',
      error: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
