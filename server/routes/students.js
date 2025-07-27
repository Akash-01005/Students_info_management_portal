import express from 'express';
import Student from '../models/Student.js';
import { authenticateToken, requireAdmin, requireFaculty } from '../middleware/auth.js';
import { validateStudent, validateGrade } from '../middleware/validation.js';

const router = express.Router();

router.get('/', authenticateToken, requireFaculty, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, major, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (major) {
      query['academicInfo.major'] = { $regex: major, $options: 'i' };
    }
    
    if (status) {
      query.status = status;
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const skip = (page - 1) * limit;
    
    const students = await Student.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Student.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        students,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalStudents: total,
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
});

router.get('/:id', authenticateToken, requireFaculty, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        student
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
});

router.post('/', authenticateToken, requireAdmin, validateStudent, async (req, res) => {
  try {
    const existingStudent = await Student.findOne({
      $or: [
        { studentId: req.body.studentId },
        { email: req.body.email }
      ]
    });
    
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this ID or email already exists'
      });
    }
    
    const student = new Student(req.body);
    await student.save();
    
    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: {
        student
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating student',
      error: error.message
    });
  }
});

router.put('/:id', authenticateToken, requireAdmin, validateStudent, async (req, res) => {
  try {
    const existingStudent = await Student.findOne({
      $or: [
        { studentId: req.body.studentId },
        { email: req.body.email }
      ],
      _id: { $ne: req.params.id }
    });
    
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this ID or email already exists'
      });
    }
    
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Student updated successfully',
      data: {
        student
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: error.message
    });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message
    });
  }
});

router.post('/:id/grades', authenticateToken, requireFaculty, validateGrade, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    const { subject, grade, semester, year } = req.body;
    
    const existingGradeIndex = student.grades.findIndex(g => 
      g.subject === subject && g.semester === semester && g.year === year
    );
    
    if (existingGradeIndex !== -1) {
      student.grades[existingGradeIndex] = { subject, grade, semester, year };
    } else {
      student.grades.push({ subject, grade, semester, year });
    }
    
    await student.save();
    
    res.json({
      success: true,
      message: 'Grade added/updated successfully',
      data: {
        student
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding grade',
      error: error.message
    });
  }
});

router.delete('/:id/grades/:gradeId', authenticateToken, requireFaculty, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    const gradeIndex = student.grades.findIndex(g => g._id.toString() === req.params.gradeId);
    
    if (gradeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }
    
    student.grades.splice(gradeIndex, 1);
    await student.save();
    
    res.json({
      success: true,
      message: 'Grade deleted successfully',
      data: {
        student
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting grade',
      error: error.message
    });
  }
});

router.get('/stats/overview', authenticateToken, requireFaculty, async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: 'Active' });
    const graduatedStudents = await Student.countDocuments({ status: 'Graduated' });
    
    const majorStats = await Student.aggregate([
      { $group: { _id: '$academicInfo.major', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    const avgGPA = await Student.aggregate([
      { $match: { 'academicInfo.gpa': { $gt: 0 } } },
      { $group: { _id: null, avgGPA: { $avg: '$academicInfo.gpa' } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalStudents,
        activeStudents,
        graduatedStudents,
        majorStats,
        avgGPA: avgGPA[0]?.avgGPA || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

export default router; 