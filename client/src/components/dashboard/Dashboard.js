import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp,
  Plus,
  Eye
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, studentsResponse] = await Promise.all([
        axios.get('/api/students/stats/overview'),
        axios.get('/api/students?limit=5&sortBy=createdAt&sortOrder=desc')
      ]);

      setStats(statsResponse.data.data);
      setRecentStudents(studentsResponse.data.data.students);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="h-64" />;
  }

  const statCards = [
    {
      name: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: Users,
      color: 'bg-blue-500',
      href: '/students'
    },
    {
      name: 'Active Students',
      value: stats?.activeStudents || 0,
      icon: GraduationCap,
      color: 'bg-green-500',
      href: '/students?status=Active'
    },
    {
      name: 'Graduated Students',
      value: stats?.graduatedStudents || 0,
      icon: BookOpen,
      color: 'bg-purple-500',
      href: '/students?status=Graduated'
    },
    {
      name: 'Average GPA',
      value: stats?.avgGPA ? stats.avgGPA.toFixed(2) : '0.00',
      icon: TrendingUp,
      color: 'bg-yellow-500',
      href: '/students'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/students/new"
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              to={stat.href}
              className="card hover:shadow-lg transition-shadow duration-200"
            >
              <div className="card-body">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Top Majors</h3>
          </div>
          <div className="card-body">
            {stats?.majorStats && stats.majorStats.length > 0 ? (
              <div className="space-y-4">
                {stats.majorStats.map((major, index) => (
                  <div key={major._id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {major._id}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {major.count} students
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No major data available</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Recent Students</h3>
          </div>
          <div className="card-body">
            {recentStudents.length > 0 ? (
              <div className="space-y-4">
                {recentStudents.map((student) => (
                  <div key={student._id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {student.studentId} • {student.academicInfo?.major}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/students/${student._id}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent students</p>
            )}
            {recentStudents.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  to="/students"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View all students →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/students/new"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Plus className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Add New Student</p>
                <p className="text-sm text-gray-500">Create a new student record</p>
              </div>
            </Link>
            <Link
              to="/students"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Users className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">View Students</p>
                <p className="text-sm text-gray-500">Browse all student records</p>
              </div>
            </Link>
            <Link
              to="/profile"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Eye className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">My Profile</p>
                <p className="text-sm text-gray-500">Update your profile</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 