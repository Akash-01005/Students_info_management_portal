import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import ConfirmDialog from '../common/ConfirmDialog';
import Modal from '../common/Modal';
import { useForm } from 'react-hook-form';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/auth/users');
      setUsers(response.data.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (data) => {
    try {
      await axios.post('/api/auth/register', data);
      fetchUsers();
      setShowUserModal(false);
      reset();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await axios.delete(`/api/auth/users/${userToDelete._id}`);
      setUsers(users.filter(u => u._id !== userToDelete._id));
      setShowDeleteDialog(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setValue('username', user.username);
    setValue('email', user.email);
    setValue('firstName', user.firstName);
    setValue('lastName', user.lastName);
    setValue('role', user.role);
    setShowUserModal(true);
  };

  const getRoleBadge = (role) => {
    const roleClasses = {
      'admin': 'badge-danger',
      'faculty': 'badge-info'
    };
    return <span className={`badge ${roleClasses[role] || 'badge-info'}`}>{role}</span>;
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="h-64" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        <button
          onClick={() => {
            setEditingUser(null);
            reset();
            setShowUserModal(true);
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">User</th>
                  <th className="table-header-cell">Username</th>
                  <th className="table-header-cell">Email</th>
                  <th className="table-header-cell">Role</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {users.map((user) => (
                  <tr key={user._id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-900">{user.username}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-gray-900">{user.email}</span>
                    </td>
                    <td className="table-cell">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${user.isActive ? 'badge-success' : 'badge-warning'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setUserToDelete(user);
                            setShowDeleteDialog(true);
                          }}
                          className="text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}
        size="md"
      >
        <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-4">
          <div>
            <label className="label">Username *</label>
            <input
              type="text"
              {...register('username', { required: 'Username is required' })}
              className={`input ${errors.username ? 'input-error' : ''}`}
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
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

          <div className="grid grid-cols-2 gap-4">
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
            <label className="label">Role *</label>
            <select
              {...register('role', { required: 'Role is required' })}
              className={`input ${errors.role ? 'input-error' : ''}`}
            >
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="faculty">Faculty</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role}</p>
            )}
          </div>

          {!editingUser && (
            <div>
              <label className="label">Password *</label>
              <input
                type="password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                className={`input ${errors.password ? 'input-error' : ''}`}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowUserModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingUser ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.firstName} ${userToDelete?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default Users; 