import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  grade: {
    type: String,
    required: [true, 'Grade is required'],
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'P', 'NP']
  },
  semester: {
    type: String,
    required: [true, 'Semester is required'],
    enum: ['Fall', 'Spring', 'Summer']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [2000, 'Year must be 2000 or later'],
    max: [2030, 'Year must be 2030 or earlier']
  }
}, { _id: false });

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters long']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Other', 'Prefer not to say']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      default: 'USA'
    }
  },
  academicInfo: {
    major: {
      type: String,
      required: [true, 'Major is required'],
      trim: true
    },
    minor: {
      type: String,
      trim: true
    },
    enrollmentDate: {
      type: Date,
      required: [true, 'Enrollment date is required'],
      default: Date.now
    },
    expectedGraduation: {
      type: Date,
      required: [true, 'Expected graduation date is required']
    },
    currentSemester: {
      type: String,
      required: [true, 'Current semester is required'],
      enum: ['Fall', 'Spring', 'Summer']
    },
    currentYear: {
      type: Number,
      required: [true, 'Current year is required'],
      min: [1, 'Year must be at least 1'],
      max: [10, 'Year must be at most 10']
    },
    gpa: {
      type: Number,
      min: [0, 'GPA must be at least 0'],
      max: [4, 'GPA must be at most 4'],
      default: 0
    },
    creditsCompleted: {
      type: Number,
      min: [0, 'Credits completed must be at least 0'],
      default: 0
    },
    totalCredits: {
      type: Number,
      min: [0, 'Total credits must be at least 0'],
      default: 120
    }
  },
  grades: [gradeSchema],
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required'],
      trim: true
    },
    relationship: {
      type: String,
      required: [true, 'Relationship is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required'],
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    email: {
      type: String,
      required: [true, 'Emergency contact email is required'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    }
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Graduated', 'Suspended', 'Withdrawn'],
    default: 'Active'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

studentSchema.index({ studentId: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ 'academicInfo.major': 1 });
studentSchema.index({ status: 1 });

studentSchema.pre('save', function(next) {
  if (this.grades && this.grades.length > 0) {
    const totalPoints = this.grades.reduce((sum, grade) => {
      const gradePoints = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7,
        'F': 0.0, 'P': 2.0, 'NP': 0.0
      };
      return sum + (gradePoints[grade.grade] || 0);
    }, 0);
    
    this.academicInfo.gpa = totalPoints / this.grades.length;
  }
  next();
});

export default mongoose.model('Student', studentSchema); 