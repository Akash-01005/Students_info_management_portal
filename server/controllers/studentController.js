import Student from '../models/Student.js';

export const getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, major, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const filter = {};
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (major) {
      filter['academicInfo.major'] = { $regex: major, $options: 'i' };
    }

    if (status) {
      filter.status = status;
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [students, total] = await Promise.all([
      Student.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Student.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        students,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
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
};

export const getStudentById = async (req, res) => {
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
};

export const createStudent = async (req, res) => {
  try {
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
};

export const updateStudent = async (req, res) => {
  try {
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
};

export const deleteStudent = async (req, res) => {
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
};

export const addGrade = async (req, res) => {
  try {
    const { course, grade, semester, year } = req.body;
    
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    student.academicInfo.grades.push({
      course,
      grade,
      semester,
      year
    });

    await student.save();

    res.json({
      success: true,
      message: 'Grade added successfully',
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
};

export const updateGrade = async (req, res) => {
  try {
    const { course, grade, semester, year } = req.body;
    
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const gradeIndex = student.academicInfo.grades.findIndex(
      g => g._id.toString() === req.params.gradeId
    );

    if (gradeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }

    student.academicInfo.grades[gradeIndex] = {
      course,
      grade,
      semester,
      year
    };

    await student.save();

    res.json({
      success: true,
      message: 'Grade updated successfully',
      data: {
        student
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating grade',
      error: error.message
    });
  }
};

export const deleteGrade = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const gradeIndex = student.academicInfo.grades.findIndex(
      g => g._id.toString() === req.params.gradeId
    );

    if (gradeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }

    student.academicInfo.grades.splice(gradeIndex, 1);
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
};

export const getStudentStats = async (req, res) => {
  try {
    const [totalStudents, activeStudents, graduatedStudents, avgGPA, majorStats] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ status: 'Active' }),
      Student.countDocuments({ status: 'Graduated' }),
      Student.aggregate([
        { $match: { 'academicInfo.gpa': { $exists: true, $ne: null } } },
        { $group: { _id: null, avgGPA: { $avg: '$academicInfo.gpa' } } }
      ]),
      Student.aggregate([
        { $group: { _id: '$academicInfo.major', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);

    const avgGPAValue = avgGPA.length > 0 ? avgGPA[0].avgGPA : 0;

    res.json({
      success: true,
      data: {
        totalStudents,
        activeStudents,
        graduatedStudents,
        avgGPA: avgGPAValue,
        majorStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student statistics',
      error: error.message
    });
  }
}; 