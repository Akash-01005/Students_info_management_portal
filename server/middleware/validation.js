import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

export const validateStudent = [
  body('studentId')
    .trim()
    .notEmpty()
    .withMessage('Student ID is required')
    .isLength({ min: 3 })
    .withMessage('Student ID must be at least 3 characters long'),
  
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters long'),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters long'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address'),
  
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please enter a valid phone number'),
  
  body('dateOfBirth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601()
    .withMessage('Please enter a valid date'),
  
  body('gender')
    .trim()
    .notEmpty()
    .withMessage('Gender is required')
    .isIn(['Male', 'Female', 'Other', 'Prefer not to say'])
    .withMessage('Please select a valid gender'),
  
  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  
  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('address.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  
  body('address.zipCode')
    .trim()
    .notEmpty()
    .withMessage('Zip code is required'),
  
  body('academicInfo.major')
    .trim()
    .notEmpty()
    .withMessage('Major is required'),
  
  body('academicInfo.expectedGraduation')
    .notEmpty()
    .withMessage('Expected graduation date is required')
    .isISO8601()
    .withMessage('Please enter a valid date'),
  
  body('academicInfo.currentSemester')
    .trim()
    .notEmpty()
    .withMessage('Current semester is required')
    .isIn(['Fall', 'Spring', 'Summer'])
    .withMessage('Please select a valid semester'),
  
  body('academicInfo.currentYear')
    .isInt({ min: 1, max: 10 })
    .withMessage('Current year must be between 1 and 10'),
  
  body('emergencyContact.name')
    .trim()
    .notEmpty()
    .withMessage('Emergency contact name is required'),
  
  body('emergencyContact.relationship')
    .trim()
    .notEmpty()
    .withMessage('Relationship is required'),
  
  body('emergencyContact.phone')
    .trim()
    .notEmpty()
    .withMessage('Emergency contact phone is required')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please enter a valid phone number'),
  
  body('emergencyContact.email')
    .trim()
    .notEmpty()
    .withMessage('Emergency contact email is required')
    .isEmail()
    .withMessage('Please enter a valid email address'),
  
  handleValidationErrors
];

export const validateGrade = [
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required'),
  
  body('grade')
    .trim()
    .notEmpty()
    .withMessage('Grade is required')
    .isIn(['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'P', 'NP'])
    .withMessage('Please select a valid grade'),
  
  body('semester')
    .trim()
    .notEmpty()
    .withMessage('Semester is required')
    .isIn(['Fall', 'Spring', 'Summer'])
    .withMessage('Please select a valid semester'),
  
  body('year')
    .isInt({ min: 2000, max: 2030 })
    .withMessage('Year must be between 2000 and 2030'),
  
  handleValidationErrors
];

export const validateUser = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  
  body('role')
    .optional()
    .isIn(['admin', 'faculty'])
    .withMessage('Role must be either admin or faculty'),
  
  handleValidationErrors
]; 