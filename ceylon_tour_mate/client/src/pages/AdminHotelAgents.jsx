import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';
import {
  Building2, Search, Filter, ChevronLeft, ChevronRight, Mail, Phone,
  AlertCircle, CheckCircle, Loader, Eye, User, MapPin, Award, Star,
  Grid3x3, List, Trash2, Globe
} from 'lucide-react';

function AdminHotelAgents() {
  const { token } = useAuth();
  const [agents, setAgents] = useState([]);
  const [totalAgents, setTotalAgents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // View Mode
  const [viewMode, setViewMode] = useState('grid');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modals
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: 'all'
  });

  useEffect(() => {
    setCurrentPage(1);
    fetchAgents(1);
  }, [filters]);

  useEffect(() => {
    fetchAgents(currentPage);
  }, [currentPage]);

  const fetchAgents = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      params.append('page', page);
      params.append('limit', itemsPerPage);
      params.append('role', 'hotel_agent');
      
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.search.trim()) params.append('search', filters.search.trim());

      const response = await axios.get(
        `${API_BASE_URL}/api/users?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Hotel Agents Response:', response.data);
      setAgents(response.data.users || response.data);
      setTotalAgents(response.data.total || response.data.length);
      setError(null);
    } catch (error) {
      console.error('Error fetching agents:', error);
      const errorMsg = error.response?.data?.details || error.response?.data?.error || error.message || 'Failed to load hotel agents';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getProfileImageUrl = (picturePath) => {
    if (!picturePath) return null;
    return picturePath.startsWith('http')
      ? picturePath
      : `${API_BASE_URL}${picturePath}`;
  };

  const handleDeleteAgent = async () => {
    if (!deleteTarget) return;
    
    try {
      setDeleting(true);
      await axios.delete(
        `${API_BASE_URL}/api/users/${deleteTarget.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Hotel agent deleted successfully!');
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchAgents(currentPage);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error deleting agent:', error);
      setError('Failed to delete hotel agent');
      setTimeout(() => setError(null), 3000);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (agentId, currentStatus) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/api/users/${agentId}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setSuccess(`Hotel agent status updated to ${response.data.data.status}!`);
        // Update selectedAgent if it's the one being modified
        if (selectedAgent && selectedAgent.id === agentId) {
          setSelectedAgent({
            ...selectedAgent,
            status: response.data.data.status
          });
        }
        fetchAgents(currentPage);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      setError('Failed to update hotel agent status');
      setTimeout(() => setError(null), 3000);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-red-100 text-red-800 border-red-200'
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: <CheckCircle className="w-4 h-4" />,
      inactive: <AlertCircle className="w-4 h-4" />
    };
    return icons[status] || <AlertCircle className="w-4 h-4" />;
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Active',
      inactive: 'Inactive'
    };
    return labels[status] || status;
  };

  // Calculate pagination values
  const totalPages = Math.ceil(totalAgents / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalAgents);

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
          <div className="mb-6">
            <h1 className="flex gap-3 items-center mb-2 text-4xl font-bold text-gray-900">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              Hotel Agents Management
            </h1>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Manage and monitor all hotel agents</p>
              <div className="flex gap-2 p-1 bg-white rounded-lg border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition ${
                    viewMode === 'grid'
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition ${
                    viewMode === 'table'
                      ? 'bg-orange-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Table View"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Total Agents</p>
                  <p className="text-3xl font-bold text-gray-900">{totalAgents}</p>
                </div>
                <Building2 className="w-12 h-12 text-blue-100" />
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Active</p>
                  <p className="text-3xl font-bold text-green-600">
                    {agents.filter(a => a.status === 'active').length}
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-100" />
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Inactive</p>
                  <p className="text-3xl font-bold text-red-600">
                    {agents.filter(a => a.status === 'inactive').length}
                  </p>
                </div>
                <AlertCircle className="w-12 h-12 text-red-100" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="p-6 mb-8 bg-white rounded-xl border border-gray-100 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Filters & Search</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                <Search className="inline mr-1 w-4 h-4" />
                Search Agents
              </label>
              <input
                type="text"
                placeholder="Name, email, hotel..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ search: '', status: 'all' })}
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
            <Loader className="mx-auto mb-4 w-12 h-12 text-orange-600 animate-spin" />
            <p className="font-medium text-gray-600">Loading hotel agents...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && agents.length === 0 && (
          <div className="p-16 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
            <Building2 className="mx-auto mb-4 w-16 h-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No Agents Found</h3>
            <p className="mb-6 text-gray-600">Try adjusting your filters</p>
            <button
              onClick={() => setFilters({ search: '', status: 'all' })}
              className="inline-flex gap-2 items-center px-6 py-2 text-white bg-orange-600 rounded-lg transition hover:bg-orange-700"
            >
              <Filter className="w-4 h-4" />
              Reset Filters
            </button>
          </div>
        )}

        {/* Agents Grid View */}
        {!loading && agents.length > 0 && viewMode === 'grid' && (
          <>
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
              {agents.map((agent) => (
                <div key={agent.id} className="overflow-hidden bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-lg">
                  {/* Header */}
                  <div className="p-6 text-black bg-gradient-to-r from-white to-white">
                    <div className="flex gap-4 items-center">
                      {agent.profilePicture ? (
                        <img
                          src={getProfileImageUrl(agent.profilePicture)}
                          alt={`${agent.firstName} ${agent.lastName}`}
                          className="object-cover w-16 h-16 rounded-full border-4 border-white"
                        />
                      ) : (
                        <div className="flex justify-center items-center w-16 h-16 bg-white rounded-full border-4 border-white">
                          <User className="w-8 h-8 text-black" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold">{agent.firstName} {agent.lastName}</h3>
                        <p className="text-sm text-black">ID: {agent.id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Status Badge */}
                    <div className="flex justify-between items-center">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(agent.status)}`}>
                        {getStatusIcon(agent.status)}
                        {getStatusLabel(agent.status)}
                      </span>
                      {agent.rating && (
                        <div className="flex gap-1 items-center text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-semibold">{agent.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="py-3 space-y-2 border-t border-b border-gray-200">
                      <div className="flex gap-2 items-center text-sm text-gray-700">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <a href={`mailto:${agent.email}`} className="truncate hover:text-blue-600">
                          {agent.email}
                        </a>
                      </div>
                      {agent.phone && (
                        <div className="flex gap-2 items-center text-sm text-gray-700">
                          <Phone className="w-4 h-4 text-green-500" />
                          <a href={`tel:${agent.phone}`} className="hover:text-green-600">
                            {agent.phone}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Hotel Details */}
                    <div className="space-y-2 text-sm">
                      {agent.hotelName && (
                        <div className="flex gap-2 items-center text-gray-700">
                          <Building2 className="w-4 h-4 text-blue-500" />
                          <span>{agent.hotelName}</span>
                        </div>
                      )}
                      {agent.province && (
                        <div className="flex gap-2 items-center text-gray-700">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span>{agent.province}</span>
                        </div>
                      )}
                      {agent.hotelType && (
                        <div className="flex gap-2 items-center text-gray-700">
                          <Award className="w-4 h-4 text-purple-500" />
                          <span>{agent.hotelType}</span>
                        </div>
                      )}
                      {agent.rating && (
                        <div className="flex gap-2 items-center text-gray-700">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{agent.rating}/5 stars</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <button
                        onClick={() => handleToggleStatus(agent.id, agent.status)}
                        className={`flex flex-1 gap-2 justify-center items-center px-3 py-2 font-semibold rounded-lg transition ${
                          agent.status === 'active'
                            ? 'text-orange-600 bg-orange-50 hover:bg-orange-100'
                            : 'text-green-600 bg-green-50 hover:bg-green-100'
                        }`}
                        title={agent.status === 'active' ? 'Deactivate Agent' : 'Activate Agent'}
                      >
                        {agent.status === 'active' ? (
                          <>
                            <AlertCircle className="w-4 h-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Activate
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAgent(agent);
                          setShowDetailsModal(true);
                        }}
                        className="flex flex-1 gap-2 justify-center items-center px-3 py-2 font-semibold text-blue-600 bg-blue-50 rounded-lg transition hover:bg-blue-100"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget(agent);
                          setShowDeleteModal(true);
                        }}
                        className="flex flex-1 gap-2 justify-center items-center px-3 py-2 font-semibold text-red-600 bg-red-50 rounded-lg transition hover:bg-red-100"
                        title="Delete Agent"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-700">
                Showing <span className="font-bold">{totalAgents > 0 ? startIndex : 0}-{endIndex}</span> of <span className="font-bold">{totalAgents}</span> agents
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

        {/* Agents Table View */}
        {!loading && agents.length > 0 && viewMode === 'table' && (
          <>
            <div className="overflow-hidden mb-8 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-black bg-gradient-to-r from-white to-white">
                      <th className="px-6 py-4 font-semibold text-left">Agent</th>
                      <th className="px-6 py-4 font-semibold text-left">Contact</th>
                      <th className="px-6 py-4 font-semibold text-left">Hotel</th>
                      <th className="px-6 py-4 font-semibold text-left">Province</th>
                      <th className="px-6 py-4 font-semibold text-left">Type</th>
                      <th className="px-6 py-4 font-semibold text-center">Rating</th>
                      <th className="px-6 py-4 font-semibold text-center">Status</th>
                      <th className="px-6 py-4 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {agents.map((agent, index) => (
                      <tr key={agent.id} className={`transition hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4">
                          <div className="flex gap-3 items-center">
                            {agent.profilePicture ? (
                              <img
                                src={getProfileImageUrl(agent.profilePicture)}
                                alt={`${agent.firstName} ${agent.lastName}`}
                                className="object-cover w-10 h-10 rounded-full"
                              />
                            ) : (
                              <div className="flex justify-center items-center w-10 h-10 bg-blue-100 rounded-full">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900">{agent.firstName} {agent.lastName}</p>
                              <p className="text-xs text-gray-500">ID: {agent.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <a href={`mailto:${agent.email}`} className="text-sm text-blue-600 hover:underline">
                              {agent.email}
                            </a>
                            {agent.phone && (
                              <a href={`tel:${agent.phone}`} className="block text-sm text-gray-600 hover:text-gray-900">
                                {agent.phone}
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-900">{agent.hotelName || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">{agent.province || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{agent.hotelType || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {agent.rating ? (
                            <div className="flex gap-1 justify-center items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="font-semibold">{agent.rating}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(agent.status)}`}>
                            {getStatusIcon(agent.status)}
                            {getStatusLabel(agent.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleToggleStatus(agent.id, agent.status)}
                              className={`p-2 rounded-lg transition ${
                                agent.status === 'active'
                                  ? 'text-orange-600 bg-orange-50 hover:bg-orange-100'
                                  : 'text-green-600 bg-green-50 hover:bg-green-100'
                              }`}
                              title={agent.status === 'active' ? 'Deactivate Agent' : 'Activate Agent'}
                            >
                              {agent.status === 'active' ? (
                                <AlertCircle className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedAgent(agent);
                                setShowDetailsModal(true);
                              }}
                              className="p-2 text-blue-600 bg-blue-50 rounded-lg transition hover:bg-blue-100"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteTarget(agent);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 text-red-600 bg-red-50 rounded-lg transition hover:bg-red-100"
                              title="Delete Agent"
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
                Showing <span className="font-bold">{totalAgents > 0 ? startIndex : 0}-{endIndex}</span> of <span className="font-bold">{totalAgents}</span> agents
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

        {/* Details Modal */}
        {showDetailsModal && selectedAgent && (
          <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 px-8 py-6 bg-gradient-to-r from-orange-600 to-orange-700 border-b border-blue-800">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Hotel Agent Details</h2>
                    <p className="mt-1 text-sm text-blue-100">{selectedAgent.firstName} {selectedAgent.lastName}</p>
                  </div>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadge(selectedAgent.status)}`}>
                    {getStatusIcon(selectedAgent.status)}
                    {getStatusLabel(selectedAgent.status)}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-600">First Name</h3>
                    <p className="text-lg text-gray-900">{selectedAgent.firstName}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-600">Last Name</h3>
                    <p className="text-lg text-gray-900">{selectedAgent.lastName}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-600">Email</h3>
                    <p className="text-lg text-gray-900 break-all">{selectedAgent.email}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-600">Phone</h3>
                    <p className="text-lg text-gray-900">{selectedAgent.phone || 'N/A'}</p>
                  </div>
                </div>

                {selectedAgent.hotelName && (
                  <>
                    <div className="py-6 mb-6 border-t border-b border-gray-200">
                      <h3 className="mb-4 text-lg font-bold text-gray-900">Hotel Information</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="mb-1 text-sm text-gray-600">Hotel Name</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedAgent.hotelName || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm text-gray-600">Registration Number</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedAgent.registrationNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm text-gray-600">Province</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedAgent.province || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm text-gray-600">District</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedAgent.district || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm text-gray-600">Hotel Type</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedAgent.hotelType || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm text-gray-600">Rating</p>
                          <div className="flex gap-1 items-center">
                            {selectedAgent.rating && (
                              <>
                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                <p className="text-lg font-semibold text-gray-900">{selectedAgent.rating}</p>
                              </>
                            )}
                            {!selectedAgent.rating && <p className="text-gray-500">N/A</p>}
                          </div>
                        </div>
                        <div>
                          <p className="mb-1 text-sm text-gray-600">Contact Person</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedAgent.contactPerson || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm text-gray-600">Location</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedAgent.location || 'N/A'}</p>
                        </div>
                        {selectedAgent.description && (
                          <div className="col-span-2">
                            <p className="mb-1 text-sm text-gray-600">Description</p>
                            <p className="text-gray-700">{selectedAgent.description}</p>
                          </div>
                        )}
                        {selectedAgent.destinations && (
                          <div className="col-span-2">
                            <p className="mb-1 text-sm text-gray-600">Destinations</p>
                            <p className="text-gray-900">{selectedAgent.destinations}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleToggleStatus(selectedAgent.id, selectedAgent.status)}
                    className={`flex flex-1 gap-2 justify-center items-center px-6 py-3 font-semibold rounded-lg transition ${
                      selectedAgent.status === 'active'
                        ? 'text-white bg-orange-600 hover:bg-orange-700'
                        : 'text-white bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {selectedAgent.status === 'active' ? (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        Deactivate Agent
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Activate Agent
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="flex-1 px-6 py-3 font-semibold text-gray-700 bg-gray-100 rounded-lg transition hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && deleteTarget && (
          <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
              <div className="p-8">
                <div className="flex justify-center items-center mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-center text-gray-900">Delete Agent?</h2>
                <p className="mb-6 text-center text-gray-600">
                  Are you sure you want to delete <strong>{deleteTarget.firstName} {deleteTarget.lastName}</strong>? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteAgent}
                    disabled={deleting}
                    className="flex flex-1 gap-2 justify-center items-center px-4 py-2 font-semibold text-white bg-red-600 rounded-lg transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteTarget(null);
                    }}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 font-semibold text-gray-700 bg-gray-100 rounded-lg transition hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default AdminHotelAgents;