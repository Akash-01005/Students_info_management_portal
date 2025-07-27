import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import ConfirmDialog from '../common/ConfirmDialog';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    major: searchParams.get('major') || '',
    status: searchParams.get('status') || ''
  });

  const { isAdmin } = useAuth();

  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      const response = await axios.get(`/api/students?${params}`);
      setStudents(response.data.data.students);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newFilters = { ...filters };
    setFilters(newFilters);
    setSearchParams({ page: '1', ...newFilters });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setSearchParams({ page: '1', ...newFilters });
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;

    try {
      await axios.delete(`/api/students/${studentToDelete._id}`);
      setStudents(students.filter(s => s._id !== studentToDelete._id));
      setShowDeleteDialog(false);
      setStudentToDelete(null);
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const confirmDelete = (student) => {
    setStudentToDelete(student);
    setShowDeleteDialog(true);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Active': 'badge-success',
      'Inactive': 'badge-warning',
      'Graduated': 'badge-info',
      'Suspended': 'badge-danger',
      'Withdrawn': 'badge-warning'
    };
    return <span className={`badge ${statusClasses[status] || 'badge-info'}`}>{status}</span>;
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="h-64" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        {isAdmin() && (
          <Link to="/students/new" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Link>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="input pl-10"
                />
              </div>
              <select
                value={filters.major}
                onChange={(e) => handleFilterChange('major', e.target.value)}
                className="input"
              >
                <option value="">All Majors</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Engineering">Engineering</option>
                <option value="Business">Business</option>
                <option value="Arts">Arts</option>
                <option value="Science">Science</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Graduated">Graduated</option>
                <option value="Suspended">Suspended</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
              <button type="submit" className="btn-primary">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
            </div>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Student</th>
                <th className="table-header-cell">ID</th>
                <th className="table-header-cell">Major</th>
                <th className="table-header-cell">Year</th>
                <th className="table-header-cell">GPA</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {students.map((student) => (
                <tr key={student._id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm font-medium text-gray-900">
                      {student.studentId}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm text-gray-900">
                      {student.academicInfo?.major}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm text-gray-900">
                      Year {student.academicInfo?.currentYear}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm font-medium text-gray-900">
                      {student.academicInfo?.gpa?.toFixed(2) || '0.00'}
                    </span>
                  </td>
                  <td className="table-cell">
                    {getStatusBadge(student.status)}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/students/${student._id}`}
                        className="text-primary-600 hover:text-primary-700"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      {isAdmin() && (
                        <>
                          <Link
                            to={`/students/${student._id}/edit`}
                            className="text-blue-600 hover:text-blue-700"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => confirmDelete(student)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {students.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No students found</p>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="card-body border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination.currentPage - 1) * limit) + 1} to{' '}
                {Math.min(pagination.currentPage * limit, pagination.totalStudents)} of{' '}
                {pagination.totalStudents} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: (page - 1).toString() })}
                  disabled={!pagination.hasPrevPage}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: (page + 1).toString() })}
                  disabled={!pagination.hasNextPage}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${studentToDelete?.firstName} ${studentToDelete?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default Students; 