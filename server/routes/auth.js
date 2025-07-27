import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateUser } from '../middleware/validation.js';

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

router.post('/register', requireAdmin, validateUser, async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, role = 'faculty' } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      role
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or inactive account'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login error',
      error: error.message
    });
  }
});

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const updates = {};

    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
      updates.email = email;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: {
        users
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

export default router; 