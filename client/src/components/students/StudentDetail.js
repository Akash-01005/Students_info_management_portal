import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { 
  ArrowLeft, 
  Edit, 
  Plus, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import { format } from 'date-fns';

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isFaculty } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [gradeToDelete, setGradeToDelete] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const fetchStudent = useCallback(async () => {
    try {
      const response = await axios.get(`/api/students/${id}`);
      setStudent(response.data.data.student);
    } catch (error) {
      console.error('Error fetching student:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  const handleAddGrade = async (data) => {
    try {
      await axios.post(`/api/students/${id}/grades`, data);
      fetchStudent();
      setShowGradeModal(false);
      reset();
    } catch (error) {
      console.error('Error adding grade:', error);
    }
  };

  const handleDeleteGrade = async () => {
    if (!gradeToDelete) return;

    try {
      await axios.delete(`/api/students/${id}/grades/${gradeToDelete._id}`);
      fetchStudent();
      setShowDeleteDialog(false);
      setGradeToDelete(null);
    } catch (error) {
      console.error('Error deleting grade:', error);
    }
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

  const getGradeColor = (grade) => {
    const gradeColors = {
      'A+': 'text-green-600',
      'A': 'text-green-600',
      'A-': 'text-green-600',
      'B+': 'text-blue-600',
      'B': 'text-blue-600',
      'B-': 'text-blue-600',
      'C+': 'text-yellow-600',
      'C': 'text-yellow-600',
      'C-': 'text-yellow-600',
      'D+': 'text-orange-600',
      'D': 'text-orange-600',
      'D-': 'text-orange-600',
      'F': 'text-red-600',
      'P': 'text-green-600',
      'NP': 'text-red-600'
    };
    return gradeColors[grade] || 'text-gray-600';
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="h-64" />;
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Student not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/students')}
            className="btn-secondary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {student.firstName} {student.lastName}
          </h1>
          {getStatusBadge(student.status)}
        </div>
        <div className="flex items-center space-x-2">
          {isAdmin() && (
            <button
              onClick={() => navigate(`/students/${id}/edit`)}
              className="btn-primary"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Student ID</label>
                  <p className="mt-1 text-sm text-gray-900">{student.studentId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="mt-1 text-sm text-gray-900">{student.firstName} {student.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="mt-1 flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <a href={`mailto:${student.email}`} className="text-sm text-primary-600 hover:text-primary-700">
                      {student.email}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <div className="mt-1 flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <a href={`tel:${student.phone}`} className="text-sm text-primary-600 hover:text-primary-700">
                      {student.phone}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                  <div className="mt-1 flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {format(new Date(student.dateOfBirth), 'MMMM d, yyyy')}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="mt-1 text-sm text-gray-900">{student.gender}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Address</h3>
            </div>
            <div className="card-body">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-900">{student.address.street}</p>
                  <p className="text-sm text-gray-900">
                    {student.address.city}, {student.address.state} {student.address.zipCode}
                  </p>
                  <p className="text-sm text-gray-900">{student.address.country}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Academic Information</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Major</label>
                  <div className="mt-1 flex items-center">
                    <GraduationCap className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{student.academicInfo.major}</span>
                  </div>
                </div>
                {student.academicInfo.minor && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Minor</label>
                    <p className="mt-1 text-sm text-gray-900">{student.academicInfo.minor}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Current Year</label>
                  <p className="mt-1 text-sm text-gray-900">Year {student.academicInfo.currentYear}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Current Semester</label>
                  <p className="mt-1 text-sm text-gray-900">{student.academicInfo.currentSemester}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">GPA</label>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {student.academicInfo.gpa?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Credits Completed</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {student.academicInfo.creditsCompleted} / {student.academicInfo.totalCredits}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Enrollment Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {format(new Date(student.academicInfo.enrollmentDate), 'MMMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Expected Graduation</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {format(new Date(student.academicInfo.expectedGraduation), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Grades</h3>
                {isFaculty() && (
                  <button
                    onClick={() => setShowGradeModal(true)}
                    className="btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Grade
                  </button>
                )}
              </div>
            </div>
            <div className="card-body">
              {student.grades && student.grades.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead className="table-header">
                      <tr>
                        <th className="table-header-cell">Subject</th>
                        <th className="table-header-cell">Grade</th>
                        <th className="table-header-cell">Semester</th>
                        <th className="table-header-cell">Year</th>
                        {isFaculty() && <th className="table-header-cell">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="table-body">
                      {student.grades.map((grade) => (
                        <tr key={grade._id} className="table-row">
                          <td className="table-cell">
                            <span className="text-sm font-medium text-gray-900">{grade.subject}</span>
                          </td>
                          <td className="table-cell">
                            <span className={`text-sm font-bold ${getGradeColor(grade.grade)}`}>
                              {grade.grade}
                            </span>
                          </td>
                          <td className="table-cell">
                            <span className="text-sm text-gray-900">{grade.semester}</span>
                          </td>
                          <td className="table-cell">
                            <span className="text-sm text-gray-900">{grade.year}</span>
                          </td>
                          {isFaculty() && (
                            <td className="table-cell">
                              <button
                                onClick={() => {
                                  setGradeToDelete(grade);
                                  setShowDeleteDialog(true);
                                }}
                                className="text-red-600 hover:text-red-700"
                                title="Delete Grade"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No grades available</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Emergency Contact</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{student.emergencyContact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Relationship</label>
                  <p className="mt-1 text-sm text-gray-900">{student.emergencyContact.relationship}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <div className="mt-1 flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <a href={`tel:${student.emergencyContact.phone}`} className="text-sm text-primary-600 hover:text-primary-700">
                      {student.emergencyContact.phone}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="mt-1 flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <a href={`mailto:${student.emergencyContact.email}`} className="text-sm text-primary-600 hover:text-primary-700">
                      {student.emergencyContact.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {student.notes && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Notes</h3>
              </div>
              <div className="card-body">
                <p className="text-sm text-gray-900">{student.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showGradeModal}
        onClose={() => setShowGradeModal(false)}
        title="Add Grade"
        size="md"
      >
        <form onSubmit={handleSubmit(handleAddGrade)} className="space-y-4">
          <div>
            <label className="label">Subject *</label>
            <input
              type="text"
              {...register('subject', { required: 'Subject is required' })}
              className={`input ${errors.subject ? 'input-error' : ''}`}
              placeholder="Enter subject name"
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
            )}
          </div>

          <div>
            <label className="label">Grade *</label>
            <select
              {...register('grade', { required: 'Grade is required' })}
              className={`input ${errors.grade ? 'input-error' : ''}`}
            >
              <option value="">Select grade</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="B-">B-</option>
              <option value="C+">C+</option>
              <option value="C">C</option>
              <option value="C-">C-</option>
              <option value="D+">D+</option>
              <option value="D">D</option>
              <option value="F">F</option>
              <option value="P">P (Pass)</option>
              <option value="NP">NP (No Pass)</option>
            </select>
            {errors.grade && (
              <p className="mt-1 text-sm text-red-600">{errors.grade}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Semester *</label>
              <select
                {...register('semester', { required: 'Semester is required' })}
                className={`input ${errors.semester ? 'input-error' : ''}`}
              >
                <option value="">Select semester</option>
                <option value="Fall">Fall</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
              </select>
              {errors.semester && (
                <p className="mt-1 text-sm text-red-600">{errors.semester}</p>
              )}
            </div>

            <div>
              <label className="label">Year *</label>
              <input
                type="number"
                {...register('year', { 
                  required: 'Year is required',
                  min: { value: 2000, message: 'Year must be 2000 or later' },
                  max: { value: 2030, message: 'Year must be 2030 or earlier' }
                })}
                className={`input ${errors.year ? 'input-error' : ''}`}
                placeholder="2024"
                min="2000"
                max="2030"
              />
              {errors.year && (
                <p className="mt-1 text-sm text-red-600">{errors.year}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowGradeModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Grade
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteGrade}
        title="Delete Grade"
        message={`Are you sure you want to delete the grade for ${gradeToDelete?.subject}?`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default StudentDetail; 