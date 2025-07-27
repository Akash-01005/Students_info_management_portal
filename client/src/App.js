import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import Students from './components/students/Students';
import StudentForm from './components/students/StudentForm';
import StudentDetail from './components/students/StudentDetail';
import Users from './components/users/Users';
import Profile from './components/profile/Profile';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/new" element={<StudentForm />} />
        <Route path="/students/:id" element={<StudentDetail />} />
        <Route path="/students/:id/edit" element={<StudentForm />} />
        <Route path="/users" element={<Users />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default App; 