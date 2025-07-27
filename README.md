# Student Information Management Portal

A comprehensive CRUD-based Student Information Management portal built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring role-based access control and modern UI with Tailwind CSS.

## Features

### 🔐 Authentication & Authorization

- **JWT-based authentication** with secure token management
- **Role-based access control** with two user roles:
  - **Admin**: Full CRUD operations on students and user management
  - **Faculty**: View students and update grades only
- **Secure password hashing** using bcryptjs
- **Session management** with automatic token refresh

### 👥 Student Management

- **Complete CRUD operations** for student records
- **Comprehensive student profiles** including:
  - Personal information (name, contact details, demographics)
  - Academic information (major, minor, enrollment dates, GPA)
  - Address information
  - Emergency contact details
  - Academic status tracking
- **Advanced search and filtering** by name, major, status
- **Pagination** for large datasets
- **Responsive data tables** with sorting capabilities

### 📊 Grade Management

- **Grade entry and management** for faculty users
- **Automatic GPA calculation** based on grade points
- **Grade history tracking** with semester and year information
- **Grade validation** with predefined grade scales

### 🎨 Modern UI/UX

- **Responsive design** built with Tailwind CSS
- **Beautiful dashboard** with statistics and overview
- **Modern form components** with validation
- **Interactive modals** for data entry
- **Toast notifications** for user feedback
- **Loading states** and error handling
- **Mobile-friendly** interface

### 🔒 Security Features

- **Input validation** on both client and server
- **Rate limiting** to prevent abuse
- **Helmet.js** for security headers
- **CORS protection**
- **Data sanitization** and validation

## Tech Stack

### Backend

- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **helmet** for security headers
- **express-rate-limit** for rate limiting

### Frontend

- **React.js** with functional components and hooks
- **React Router** for navigation
- **React Hook Form** for form management
- **Axios** for API communication
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **date-fns** for date formatting

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd students_info
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**

   ```bash
   # Copy the environment example file
   cp env.example .env

   # Edit the .env file with your configuration
   MONGODB_URI=mongodb://localhost:27017/student_management
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   PORT=5000
   NODE_ENV=development
   ```

4. **Start MongoDB**

   ```bash
   # Make sure MongoDB is running on your system
   # For Windows: Start MongoDB service
   # For macOS: brew services start mongodb-community
   # For Linux: sudo systemctl start mongod
   ```

5. **Run the application**

   ```bash
   # Development mode (runs both backend and frontend)
   npm run dev

   # Or run separately:
   # Backend only
   npm run server

   # Frontend only (in another terminal)
   npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Default Users

The application comes with demo users for testing:

### Admin User

- **Username**: admin
- **Password**: admin123
- **Role**: Admin (full access)

### Faculty User

- **Username**: faculty
- **Password**: faculty123
- **Role**: Faculty (limited access)

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Create new user (admin only)
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/users` - Get all users (admin only)

### Students

- `GET /api/students` - Get all students (with pagination and filters)
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student (admin only)
- `PUT /api/students/:id` - Update student (admin only)
- `DELETE /api/students/:id` - Delete student (admin only)
- `POST /api/students/:id/grades` - Add/update grade (faculty only)
- `DELETE /api/students/:id/grades/:gradeId` - Delete grade (faculty only)
- `GET /api/students/stats/overview` - Get student statistics

## Project Structure

```
students_info/
├── server/                 # Backend code
│   ├── index.js           # Main server file
│   ├── models/            # MongoDB models
│   │   ├── User.js        # User model
│   │   └── Student.js     # Student model
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication routes
│   │   └── students.js    # Student routes
│   └── middlewares/        # Custom middleware
│   |   ├── auth.js        # Authentication middleware
│   |    ├── validation.js  # Input validation
│   |    └── errorHandler.js # Error handling
│   └── controllers/
│       ├── authController.js # Authentication Controller
│       ├─ studentController.js # Student Controller
│
├── client/                # Frontend code
│   ├── public/            # Static files
│   ├── src/               # React source code
│   │   ├── components/    # React components
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── common/    # Shared components
│   │   │   ├── dashboard/ # Dashboard components
│   │   │   ├── layout/    # Layout components
│   │   │   ├── students/  # Student management
│   │   │   ├── users/     # User management
│   │   │   └── profile/   # Profile components
│   │   ├── contexts/      # React contexts
│   │   └── index.js       # Main React file
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind configuration
├── package.json           # Backend dependencies
├── env.example           # Environment variables example
└── README.md             # This file
```

## Features in Detail

### Role-Based Access Control

#### Admin Permissions

- Create, read, update, and delete student records
- Manage user accounts (create, edit, delete users)
- View all system statistics and reports
- Access to all features and data

#### Faculty Permissions

- View student records and information
- Add and update student grades
- View academic statistics
- Limited to academic operations only

### Student Information Management

#### Personal Information

- Student ID (unique identifier)
- Full name and contact details
- Date of birth and gender
- Complete address information

#### Academic Information

- Major and minor fields of study
- Current academic year and semester
- Enrollment and expected graduation dates
- GPA calculation and credit tracking
- Academic status (Active, Inactive, Graduated, etc.)

#### Emergency Contact

- Contact person details
- Relationship information
- Phone and email contact

### Grade Management System

#### Grade Entry

- Subject-based grade entry
- Semester and year tracking
- Automatic GPA calculation
- Grade validation and error handling

#### Grade Display

- Organized grade history
- Color-coded grade display
- Semester-wise organization
- Easy grade management interface

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments

- Built with modern web technologies
- Inspired by real-world student management systems
- Uses best practices for security and user experience
