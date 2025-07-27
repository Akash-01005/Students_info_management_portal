import express from 'express';
import { authenticateToken, requireAdmin, requireFaculty } from '../middleware/auth.js';
import { validateStudent, validateGrade } from '../middleware/validation.js';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  addGrade,
  updateGrade,
  deleteGrade,
  getStudentStats
} from '../controllers/studentController.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Student CRUD operations
router.get('/', getAllStudents);
router.get('/stats/overview', getStudentStats);
router.get('/:id', getStudentById);

// Admin only routes
router.post('/', requireAdmin, validateStudent, createStudent);
router.put('/:id', requireAdmin, validateStudent, updateStudent);
router.delete('/:id', requireAdmin, deleteStudent);

// Grade management (Faculty and Admin)
router.post('/:id/grades', requireFaculty, validateGrade, addGrade);
router.put('/:id/grades/:gradeId', requireFaculty, validateGrade, updateGrade);
router.delete('/:id/grades/:gradeId', requireFaculty, deleteGrade);

export default router; 