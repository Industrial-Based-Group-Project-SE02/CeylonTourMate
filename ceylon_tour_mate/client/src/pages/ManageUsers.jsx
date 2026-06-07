import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';
import DashboardLayout from '../components/DashboardLayout';
import {
  Users, Plus, Search, Filter, ChevronLeft, ChevronRight,
  Edit2, Trash2, Eye, EyeOff, Mail, Phone, UserCheck, UserX,
  AlertCircle, CheckCircle, Loader
} from 'lucide-react';

function ManageUsers() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    search: ''
  });

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: user?.role === 'admin' ? 'manager' : 'driver'
  });

  // View mode
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  useEffect(() => {
    setCurrentPage(1);
    fetchUsers(1);
  }, [filters]);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      params.append('page', page);
      params.append('limit', itemsPerPage);
      
      if (filters.role !== 'all') params.append('role', filters.role);
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.search.trim()) params.append('search', filters.search.trim());

      const response = await axios.get(`${API_BASE_URL}/api/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users || response.data);
      setTotalUsers(response.data.total || response.data.length);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/users`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('User created successfully!');
      setShowCreateModal(false);
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: user?.role === 'admin' ? 'manager' : 'driver'
      });
      setCurrentPage(1);
      fetchUsers(1);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/users/${deleteTarget.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(`User "${deleteTarget.firstName} ${deleteTarget.lastName}" deleted successfully!`);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchUsers(currentPage);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete user');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/users/${id}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('User status updated!');
      fetchUsers(currentPage);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update user status');
      setTimeout(() => setError(null), 3000);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800 border-red-200',
      manager: 'bg-blue-100 text-blue-800 border-blue-200',
      driver: 'bg-purple-100 text-purple-800 border-purple-200',
      hotel_agent: 'bg-green-100 text-green-800 border-green-200',
      tourist: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getAvailableRoles = () => {
    // For filtering, show all roles
    return [
      { value: 'admin', label: 'Admin' },
      { value: 'manager', label: 'Manager' },
      { value: 'driver', label: 'Driver' },
      { value: 'hotel_agent', label: 'Hotel Agent' },
      { value: 'tourist', label: 'Tourist' }
    ];
  };

  const getProfileImageUrl = (picture) => {
    if (!picture) return null;
    return picture.startsWith('http') 
      ? picture 
      : `http://localhost:5000/uploads/profiles/${picture}`;
  };

  // Calculate pagination values
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalUsers);

  return (
    <DashboardLayout>
      <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        {/* Notifications */}
        {error && (
          <div className="flex gap-3 items-center p-4 mb-6 bg-red-50 rounded-lg border-l-4 border-red-500">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-800">{error}</span>
          </div>
        )}
        {success && (
          <div className="flex gap-3 items-center p-4 mb-6 bg-green-50 rounded-lg border-l-4 border-green-500">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">{success}</span>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex gap-6 justify-between items-start mb-6">
            <div>
              <h1 className="flex gap-3 items-center mb-2 text-4xl font-bold text-gray-900">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                System Users
              </h1>
              <p className="text-gray-600">Manage and monitor all system users</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Add New User
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
                </div>
                <Users className="w-12 h-12 text-blue-100" />
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Active</p>
                  <p className="text-3xl font-bold text-green-600">{users.filter(u => u.isActive).length}</p>
                </div>
                <UserCheck className="w-12 h-12 text-green-100" />
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Inactive</p>
                  <p className="text-3xl font-bold text-red-600">{users.filter(u => !u.isActive).length}</p>
                </div>
                <UserX className="w-12 h-12 text-red-100" />
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Page</p>
                  <p className="text-3xl font-bold text-indigo-600">{currentPage} / {totalPages || 1}</p>
                </div>
                <Filter className="w-12 h-12 text-indigo-100" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="p-6 mb-8 bg-white rounded-xl border border-gray-100 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Filters & Search</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Search */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                <Search className="inline mr-1 w-4 h-4" />
                Search by Name or Email
              </label>
              <input
                type="text"
                placeholder="John Doe, john@example.com"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Role</label>
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                {getAvailableRoles().map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ role: 'all', status: 'all', search: '' })}
                className="px-4 py-2 w-full font-medium text-gray-700 bg-gray-100 rounded-lg transition hover:bg-gray-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-16 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
            <Loader className="mx-auto mb-4 w-12 h-12 text-blue-600 animate-spin" />
            <p className="font-medium text-gray-600">Loading users...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && users.length === 0 && (
          <div className="p-16 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
            <Users className="mx-auto mb-4 w-16 h-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No Users Found</h3>
            <p className="mb-6 text-gray-600">Try adjusting your filters or search terms</p>
            <button
              onClick={() => setFilters({ role: 'all', status: 'all', search: '' })}
              className="inline-flex gap-2 items-center px-6 py-2 text-white bg-blue-600 rounded-lg transition hover:bg-blue-700"
            >
              <Filter className="w-4 h-4" />
              Reset Filters
            </button>
          </div>
        )}

        {/* Users Table */}
        {!loading && users.length > 0 && (
          <>
            <div className="overflow-hidden mb-8 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">User</th>
                      <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">Contact</th>
                      <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">Role</th>
                      <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">Status</th>
                      <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u) => (
                      <tr key={u.id} className="transition hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex gap-3 items-center">
                            {u.profilePicture ? (
                              <img
                                src={getProfileImageUrl(u.profilePicture)}
                                alt={`${u.firstName} ${u.lastName}`}
                                className="object-cover w-10 h-10 rounded-full border-2 border-gray-200"
                              />
                            ) : (
                              <div className="flex justify-center items-center w-10 h-10 text-sm font-bold text-white bg-gradient-to-br from-blue-400 to-blue-600 rounded-full">
                                {u.firstName?.[0]}{u.lastName?.[0]}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900">{u.firstName} {u.lastName}</p>
                              <p className="text-sm text-gray-500">ID: {u.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex gap-2 items-center text-gray-700">
                              <Mail className="w-4 h-4 text-blue-500" />
                              <span className="text-sm">{u.email}</span>
                            </div>
                            {u.phone && (
                              <div className="flex gap-2 items-center text-gray-700">
                                <Phone className="w-4 h-4 text-green-500" />
                                <span className="text-sm">{u.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(u.role)}`}>
                            {u.role.replace('_', ' ').charAt(0).toUpperCase() + u.role.replace('_', ' ').slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleStatus(u.id)}
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition ${
                              u.isActive
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            {u.isActive ? (
                              <>
                                <Eye className="w-3 h-3" />
                                Active
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3" />
                                Inactive
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 items-center">
                            <button
                              onClick={() => setDeleteTarget(u)}
                              onClickCapture={() => setShowDeleteModal(true)}
                              className="p-2 text-red-600 rounded-lg transition hover:bg-red-50"
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
              </div>
            </div>

            {/* Pagination Info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-700">
                Showing <span className="font-bold">{totalUsers > 0 ? startIndex : 0}-{endIndex}</span> of <span className="font-bold">{totalUsers}</span> users
              </p>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-wrap gap-2 justify-center items-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex gap-2 items-center px-4 py-2 font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    const isShowPage = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    if (!isShowPage && page !== 2 && page !== totalPages - 1) {
                      return null;
                    }

                    if (!isShowPage) {
                      return (
                        <span key={`ellipsis-${page}`} className="px-3 py-2 text-gray-600">
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg font-semibold transition ${
                          currentPage === page
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex gap-2 items-center px-4 py-2 font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 px-8 py-6 bg-gradient-to-r from-orange-600 to-orange-700 border-b border-orange-800">
                <h2 className="text-2xl font-bold text-white">Create New User</h2>
                <p className="mt-1 text-sm text-blue-100">Add a new system user</p>
              </div>

              <form onSubmit={handleCreateUser} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+94771234567"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Password *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {getAvailableRoles().map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-semibold hover:shadow-lg transition transform hover:-translate-y-0.5"
                  >
                    Create User
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormData({
                        email: '',
                        password: '',
                        firstName: '',
                        lastName: '',
                        phone: '',
                        role: user?.role === 'admin' ? 'manager' : 'driver'
                      });
                    }}
                    className="flex-1 px-6 py-3 font-semibold text-gray-700 bg-gray-100 rounded-lg transition hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && deleteTarget && (
          <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
              <div className="p-8 text-center">
                <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Delete User?</h2>
                <p className="mb-6 text-gray-600">
                  Are you sure you want to delete <strong>{deleteTarget.firstName} {deleteTarget.lastName}</strong>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteUser}
                    className="flex-1 px-4 py-2 font-semibold text-white bg-red-600 rounded-lg transition hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteTarget(null);
                    }}
                    className="flex-1 px-4 py-2 font-semibold text-gray-700 bg-gray-100 rounded-lg transition hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ManageUsers;
