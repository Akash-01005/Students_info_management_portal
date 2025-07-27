import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const initializeDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const existingUsers = await User.find({});
    
    if (existingUsers.length === 0) {
      const adminUser = new User({
        username: 'admin',
        email: 'admin@university.edu',
        password: 'admin123',
        firstName: 'System',
        lastName: 'Administrator',
        role: 'admin',
        isActive: true
      });

      const facultyUser = new User({
        username: 'faculty',
        email: 'faculty@university.edu',
        password: 'faculty123',
        firstName: 'John',
        lastName: 'Professor',
        role: 'faculty',
        isActive: true
      });

      await adminUser.save();
      await facultyUser.save();

      console.log('✅ Default users created successfully!');
      console.log('📋 Default Login Credentials:');
      console.log('👨‍💼 Admin User:');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('👨‍🏫 Faculty User:');
      console.log('   Username: faculty');
      console.log('   Password: faculty123');
    } else {
      console.log('ℹ️  Users already exist in the database');
    }

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initializeDatabase(); 