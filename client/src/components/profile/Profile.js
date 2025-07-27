import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Shield } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setSuccess(false);

    try {
      const result = await updateProfile(data);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const roleClasses = {
      'admin': 'badge-danger',
      'faculty': 'badge-info'
    };
    return <span className={`badge ${roleClasses[role] || 'badge-info'}`}>{role}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </div>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                </div>

                {success && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800">Profile updated successfully!</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-lg">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </h4>
                    <p className="text-sm text-gray-500">{user?.username}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Username</p>
                      <p className="text-sm text-gray-500">{user?.username}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Role</p>
                      <div className="mt-1">{getRoleBadge(user?.role)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Account Status</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Status</span>
                  <span className={`badge ${user?.isActive ? 'badge-success' : 'badge-warning'}`}>
                    {user?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm text-gray-900">
                    {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 