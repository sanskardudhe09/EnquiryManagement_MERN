import { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  X,
  User as UserIcon,
  Mail,
  Shield,
  UserCheck,
  Lock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { api } from '../utils/api';
import { auth } from '../utils/auth';
import type { User } from '../types';
import { useToast } from '../hooks/useToast';

interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'staff';
  _id: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // Used in the form rendering
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { showToast, ToastComponent } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = auth.getToken();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.get('/users', token as string);
      console.log(data);
      setUsers(data);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData: UserFormData) => {
    try {
      await api.post('/users', formData, token as string);
      showToast('User created successfully', 'success');
      setShowForm(false);
      fetchUsers();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to create user', 'error');
    }
  };

  const handleUpdate = async (formData: UserFormData) => {
    if (!editingUser) return;
    try {
      await api.put(`/users/${editingUser._id}`, formData, token as string);
      showToast('User updated successfully', 'success');
      setEditingUser(null);
      setShowForm(false); // Close the form after successful update
      fetchUsers();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to update user', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`, token as string);
      showToast('User deleted successfully', 'success');
      fetchUsers();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete user', 'error');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format role for display
  const formatRole = (role: string) => {
    return role === 'admin' ? 'Admin' : 'Staff';
  };

  return (
    <div className="px-0">
      {ToastComponent}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">User Management</h1>
          <p className="text-xs sm:text-sm text-gray-500">Manage system users and permissions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 sm:static z-10 w-14 h-14 sm:w-auto sm:h-auto sm:px-5 sm:py-2.5 flex items-center justify-center sm:justify-start rounded-full sm:rounded-lg shadow-lg sm:shadow-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
          aria-label="Add new user"
        >
          <Plus className="w-6 h-6 sm:w-5 sm:h-5 sm:mr-2" />
          <span className="sr-only sm:not-sr-only">Add User</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-inner">
            <UserIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <p className="text-gray-700 font-semibold text-base sm:text-lg mb-1">No users found</p>
          <p className="text-gray-500 text-xs sm:text-sm">Get started by adding a new user</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-4 mb-6">
            {currentItems.map(user => (
              <div
                key={user._id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-medium text-gray-900 truncate">{user.name}</h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}
                      >
                        {formatRole(user.role)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-1">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 p-1.5 rounded-full hover:bg-blue-50"
                      title="Edit user"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {/* Mobile Pagination */}
            {totalPages >= 1 && (
              <div className="flex justify-between items-center mt-4 px-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-blue-600 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  Previous
                </button>

                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-blue-600 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <style>{`
                table {
                  border-collapse: separate;
                  border-spacing: 0;
                }
                th {
                  background-color: #f9fafb;
                }
                tr:not(:last-child) {
                  border-bottom: 1px solid #e5e7eb;
                }
                th:first-child, td:first-child {
                  padding-left: 1.5rem;
                }
                th:last-child, td:last-child {
                  padding-right: 1.5rem;
                }
              `}</style>
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      <span>Name</span>
                    </div>
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </div>
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>Role</span>
                    </div>
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map(user => (
                  <tr key={user._id} className="hover:bg-blue-50/50 transition-colors duration-150">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-700 border-r border-gray-100 last:border-r-0 hover:bg-gray-50 transition-colors duration-150">
                      <div className="text-sm text-gray-600 truncate max-w-[200px]">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}
                        >
                          {formatRole(user.role)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setShowForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1.5 rounded-full hover:bg-blue-50"
                          title="Edit user"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages >= 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(indexOfLastItem, users.length)}</span>{' '}
                      of <span className="font-medium">{users.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">First</span>
                        <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === pageNum
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages
                            ? 'text-gray-300'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages
                            ? 'text-gray-300'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Last</span>
                        <ChevronsRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {(showForm || editingUser) && (
        <div className="mt-6">
          <UserForm
            user={editingUser || undefined}
            onSubmit={editingUser ? handleUpdate : handleCreate}
            onClose={() => {
              setShowForm(false);
              setEditingUser(null);
            }}
          />
        </div>
      )}
    </div>
  );
}

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormData) => Promise<void>;
  onClose: () => void;
}

function UserForm({ user, onSubmit, onClose }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'staff',
    _id: user?._id.toString() || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!user && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const submitData = { ...formData };
      if (user && !submitData.password) {
        delete submitData.password;
      }
      await onSubmit(submitData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user ? 'Edit User' : 'Add New User'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
            >
              <UserIcon className="w-4 h-4 text-gray-500" />
              Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className={`block w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.name
                  ? 'border-red-300 focus:ring-red-500 focus:border-transparent'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-transparent hover:border-gray-400'
              }`}
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
            >
              <Mail className="w-4 h-4 text-gray-500" />
              Email *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className={`block w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.email
                  ? 'border-red-300 focus:ring-red-500 focus:border-transparent'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-transparent hover:border-gray-400'
              }`}
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
            >
              <Lock className="w-4 h-4 text-gray-500" />
              Password {!user && '*'}
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder={user ? 'Enter the new password' : ''}
              className={`block w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.password
                  ? 'border-red-300 focus:ring-red-500 focus:border-transparent'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-transparent hover:border-gray-400'
              }`}
            />
            {errors.password && (
              <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="role"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
            >
              <Shield className="w-4 h-4 text-gray-500" />
              Role
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={e =>
                setFormData({ ...formData, role: e.target.value as 'admin' | 'staff' })
              }
              className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
            >
              {user ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
