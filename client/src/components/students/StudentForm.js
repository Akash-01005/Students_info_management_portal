import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { ArrowLeft, Save } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [errors, setErrors] = useState({});

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting }
  } = useForm();

  const isEditing = !!id;

  const fetchStudent = useCallback(async () => {
    try {
      const response = await axios.get(`/api/students/${id}`);
      const student = response.data.data.student;
      
      Object.keys(student).forEach(key => {
        if (key === 'dateOfBirth' || key === 'enrollmentDate' || key === 'expectedGraduation') {
          setValue(key, new Date(student[key]).toISOString().split('T')[0]);
        } else if (typeof student[key] === 'object' && student[key] !== null) {
          Object.keys(student[key]).forEach(nestedKey => {
            setValue(`${key}.${nestedKey}`, student[key][nestedKey]);
          });
        } else {
          setValue(key, student[key]);
        }
      });
    } catch (error) {
      console.error('Error fetching student:', error);
    } finally {
      setInitialLoading(false);
    }
  }, [id, setValue]);

  useEffect(() => {
    if (isEditing) {
      fetchStudent();
    }
  }, [isEditing, fetchStudent]);

  const onSubmit = async (data) => {
    setLoading(true);
    setErrors({});

    try {
      const studentData = {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth).toISOString(),
        academicInfo: {
          ...data.academicInfo,
          enrollmentDate: new Date(data.academicInfo.enrollmentDate).toISOString(),
          expectedGraduation: new Date(data.academicInfo.expectedGraduation).toISOString(),
          currentYear: parseInt(data.academicInfo.currentYear),
          creditsCompleted: parseInt(data.academicInfo.creditsCompleted) || 0,
          totalCredits: parseInt(data.academicInfo.totalCredits) || 120
        }
      };

      if (isEditing) {
        await axios.put(`/api/students/${id}`, studentData);
      } else {
        await axios.post('/api/students', studentData);
      }

      navigate('/students');
    } catch (error) {
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.field] = err.message;
        });
        setErrors(serverErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <LoadingSpinner size="lg" className="h-64" />;
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
            {isEditing ? 'Edit Student' : 'Add New Student'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Student ID *</label>
                <input
                  type="text"
                  {...register('studentId', { required: 'Student ID is required' })}
                  className={`input ${errors.studentId ? 'input-error' : ''}`}
                  placeholder="Enter student ID"
                />
                {errors.studentId && (
                  <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>
                )}
              </div>

              <div>
                <label className="label">First Name *</label>
                <input
                  type="text"
                  {...register('firstName', { required: 'First name is required' })}
                  className={`input ${errors.firstName ? 'input-error' : ''}`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="label">Last Name *</label>
                <input
                  type="text"
                  {...register('lastName', { required: 'Last name is required' })}
                  className={`input ${errors.lastName ? 'input-error' : ''}`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="label">Email *</label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`input ${errors.email ? 'input-error' : ''}`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="label">Phone *</label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Phone number is required' })}
                  className={`input ${errors.phone ? 'input-error' : ''}`}
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="label">Date of Birth *</label>
                <input
                  type="date"
                  {...register('dateOfBirth', { required: 'Date of birth is required' })}
                  className={`input ${errors.dateOfBirth ? 'input-error' : ''}`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <label className="label">Gender *</label>
                <select
                  {...register('gender', { required: 'Gender is required' })}
                  className={`input ${errors.gender ? 'input-error' : ''}`}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="label">Street Address *</label>
                <input
                  type="text"
                  {...register('address.street', { required: 'Street address is required' })}
                  className={`input ${errors['address.street'] ? 'input-error' : ''}`}
                  placeholder="Enter street address"
                />
                {errors['address.street'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['address.street']}</p>
                )}
              </div>

              <div>
                <label className="label">City *</label>
                <input
                  type="text"
                  {...register('address.city', { required: 'City is required' })}
                  className={`input ${errors['address.city'] ? 'input-error' : ''}`}
                  placeholder="Enter city"
                />
                {errors['address.city'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['address.city']}</p>
                )}
              </div>

              <div>
                <label className="label">State *</label>
                <input
                  type="text"
                  {...register('address.state', { required: 'State is required' })}
                  className={`input ${errors['address.state'] ? 'input-error' : ''}`}
                  placeholder="Enter state"
                />
                {errors['address.state'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['address.state']}</p>
                )}
              </div>

              <div>
                <label className="label">Zip Code *</label>
                <input
                  type="text"
                  {...register('address.zipCode', { required: 'Zip code is required' })}
                  className={`input ${errors['address.zipCode'] ? 'input-error' : ''}`}
                  placeholder="Enter zip code"
                />
                {errors['address.zipCode'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['address.zipCode']}</p>
                )}
              </div>

              <div>
                <label className="label">Country</label>
                <input
                  type="text"
                  {...register('address.country')}
                  className="input"
                  placeholder="Enter country"
                  defaultValue="USA"
                />
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
                <label className="label">Major *</label>
                <input
                  type="text"
                  {...register('academicInfo.major', { required: 'Major is required' })}
                  className={`input ${errors['academicInfo.major'] ? 'input-error' : ''}`}
                  placeholder="Enter major"
                />
                {errors['academicInfo.major'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['academicInfo.major']}</p>
                )}
              </div>

              <div>
                <label className="label">Minor</label>
                <input
                  type="text"
                  {...register('academicInfo.minor')}
                  className="input"
                  placeholder="Enter minor (optional)"
                />
              </div>

              <div>
                <label className="label">Enrollment Date *</label>
                <input
                  type="date"
                  {...register('academicInfo.enrollmentDate', { required: 'Enrollment date is required' })}
                  className={`input ${errors['academicInfo.enrollmentDate'] ? 'input-error' : ''}`}
                />
                {errors['academicInfo.enrollmentDate'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['academicInfo.enrollmentDate']}</p>
                )}
              </div>

              <div>
                <label className="label">Expected Graduation *</label>
                <input
                  type="date"
                  {...register('academicInfo.expectedGraduation', { required: 'Expected graduation date is required' })}
                  className={`input ${errors['academicInfo.expectedGraduation'] ? 'input-error' : ''}`}
                />
                {errors['academicInfo.expectedGraduation'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['academicInfo.expectedGraduation']}</p>
                )}
              </div>

              <div>
                <label className="label">Current Semester *</label>
                <select
                  {...register('academicInfo.currentSemester', { required: 'Current semester is required' })}
                  className={`input ${errors['academicInfo.currentSemester'] ? 'input-error' : ''}`}
                >
                  <option value="">Select semester</option>
                  <option value="Fall">Fall</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                </select>
                {errors['academicInfo.currentSemester'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['academicInfo.currentSemester']}</p>
                )}
              </div>

              <div>
                <label className="label">Current Year *</label>
                <select
                  {...register('academicInfo.currentYear', { required: 'Current year is required' })}
                  className={`input ${errors['academicInfo.currentYear'] ? 'input-error' : ''}`}
                >
                  <option value="">Select year</option>
                  {[1, 2, 3, 4, 5, 6].map(year => (
                    <option key={year} value={year}>Year {year}</option>
                  ))}
                </select>
                {errors['academicInfo.currentYear'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['academicInfo.currentYear']}</p>
                )}
              </div>

              <div>
                <label className="label">Credits Completed</label>
                <input
                  type="number"
                  {...register('academicInfo.creditsCompleted')}
                  className="input"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="label">Total Credits Required</label>
                <input
                  type="number"
                  {...register('academicInfo.totalCredits')}
                  className="input"
                  placeholder="120"
                  min="0"
                  defaultValue="120"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Emergency Contact</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Contact Name *</label>
                <input
                  type="text"
                  {...register('emergencyContact.name', { required: 'Emergency contact name is required' })}
                  className={`input ${errors['emergencyContact.name'] ? 'input-error' : ''}`}
                  placeholder="Enter contact name"
                />
                {errors['emergencyContact.name'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['emergencyContact.name']}</p>
                )}
              </div>

              <div>
                <label className="label">Relationship *</label>
                <input
                  type="text"
                  {...register('emergencyContact.relationship', { required: 'Relationship is required' })}
                  className={`input ${errors['emergencyContact.relationship'] ? 'input-error' : ''}`}
                  placeholder="e.g., Parent, Spouse, Guardian"
                />
                {errors['emergencyContact.relationship'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['emergencyContact.relationship']}</p>
                )}
              </div>

              <div>
                <label className="label">Contact Phone *</label>
                <input
                  type="tel"
                  {...register('emergencyContact.phone', { required: 'Emergency contact phone is required' })}
                  className={`input ${errors['emergencyContact.phone'] ? 'input-error' : ''}`}
                  placeholder="Enter contact phone"
                />
                {errors['emergencyContact.phone'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['emergencyContact.phone']}</p>
                )}
              </div>

              <div>
                <label className="label">Contact Email *</label>
                <input
                  type="email"
                  {...register('emergencyContact.email', { 
                    required: 'Emergency contact email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`input ${errors['emergencyContact.email'] ? 'input-error' : ''}`}
                  placeholder="Enter contact email"
                />
                {errors['emergencyContact.email'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['emergencyContact.email']}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Status</label>
                <select
                  {...register('status')}
                  className="input"
                  defaultValue="Active"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Graduated">Graduated</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Withdrawn">Withdrawn</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="label">Notes</label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="input"
                  placeholder="Enter any additional notes..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/students')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || isSubmitting}
            className="btn-primary"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Update Student' : 'Create Student'}
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm; 