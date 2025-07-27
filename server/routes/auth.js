import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateUser } from '../middleware/validation.js';
import {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', requireAdmin, validateUser, register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.get('/users', requireAdmin, getAllUsers);

export default router; 