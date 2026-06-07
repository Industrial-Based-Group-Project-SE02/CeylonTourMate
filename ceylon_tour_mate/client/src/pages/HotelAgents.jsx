import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import Toast from '../components/Toast';
import API_BASE_URL from '../config/api';

// Province-District mapping for Sri Lanka
const provinceDistrictMap = {
  'Western': ['Colombo', 'Gampaha', 'Kalutara'],
  'Central': ['Kandy', 'Matale', 'Nuwara Eliya'],
  'Southern': ['Galle', 'Matara', 'Hambantota'],
  'Northern': ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
  'Eastern': ['Trincomalee', 'Batticaloa', 'Ampara'],
  'North Western': ['Kurunegala', 'Puttalam'],
  'North Central': ['Anuradhapura', 'Polonnaruwa'],
  'Uva': ['Badulla', 'Monaragala'],
  'Sabaragamuwa': ['Kegalle', 'Ratnapura']
};

const hotelTypeOptions = [
  { value: '3_star', label: '3 Star' },
  { value: '4_star', label: '4 Star' },
  { value: '5_star', label: '5 Star' }
  
];

const provinces = Object.keys(provinceDistrictMap);

function HotelAgents() {
  const { user } = useAuth();
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  
  // Toast notification
  const [toast, setToast] = useState(null);
  
  // View mode
  const [viewMode, setViewMode] = useState('table'); // 'card' or 'table'

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Selected agent
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    province: 'all',
    district: 'all',
    hotelType: 'all',
    status: 'all'
  });

  // Form data for create
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    hotelName: '',
    registrationNumber: '',
    location: '',
    contactPerson: '',
    description: '',
    destinations: '',
    hotelType: '3_star',
    province: '',
    district: ''
  });

  // Form data for edit
  const [editFormData, setEditFormData] = useState({
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    hotelName: '',
    registrationNumber: '',
    location: '',
    contactPerson: '',
    description: '',
    destinations: '',
    hotelType: '3_star',
    province: '',
    district: ''
  });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    // Check user permissions before fetching
    if (!user) {
      setUnauthorized(true);
      setLoading(false);
      return;
    }
    
    if (!['admin', 'manager'].includes(user.role)) {
      setUnauthorized(true);
      setLoading(false);
      return;
    }
    
    fetchAgents();
  }, [user]);

  // Apply filters whenever search or filter changes
  useEffect(() => {
    applyFilters();
  }, [agents, searchTerm, filters]);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      setUnauthorized(false);
      const response = await axios.get(`${API_BASE_URL}/api/hotel-agents`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const agentsData = Array.isArray(response.data) ? response.data : response.data?.data || [];
      setAgents(agentsData);
    } catch (err) {
      if (err.response?.status === 403) {
        setUnauthorized(true);
        console.error('Access denied: You do not have permission to view hotel agents');
      } else {
        showToast('error', 'Failed to load hotel agents');
        console.error('Error fetching agents:', err);
      }
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = agents;

    // Search by name, email, hotel name, registration number
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(a =>
        `${a.firstName} ${a.lastName}`.toLowerCase().includes(term) ||
        a.email.toLowerCase().includes(term) ||
        a.hotelAgent?.hotelName?.toLowerCase().includes(term) ||
        a.hotelAgent?.registrationNumber?.toLowerCase().includes(term)
      );
    }

    // Province filter
    if (filters.province !== 'all') {
      filtered = filtered.filter(a => a.hotelAgent?.province === filters.province);
    }

    // District filter
    if (filters.district !== 'all') {
      filtered = filtered.filter(a => a.hotelAgent?.district === filters.district);
    }

    // Hotel type filter
    if (filters.hotelType !== 'all') {
      filtered = filtered.filter(a => a.hotelAgent?.hotelType === filters.hotelType);
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(a =>
        (filters.status === 'active' && a.isActive) ||
        (filters.status === 'inactive' && !a.isActive)
      );
    }

    setFilteredAgents(filtered);
  };

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/hotel-agents`, {
        ...formData
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      showToast('success', 'Hotel agent created successfully!');
      setShowCreateModal(false);
      resetForm();
      fetchAgents();
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Failed to create hotel agent');
    }
  };

  const handleUpdateAgent = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/hotel-agents/${editFormData.id}`, {
        email: editFormData.email,
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        phone: editFormData.phone,
        hotelName: editFormData.hotelName,
        registrationNumber: editFormData.registrationNumber,
        location: editFormData.location,
        contactPerson: editFormData.contactPerson,
        description: editFormData.description,
        destinations: editFormData.destinations,
        hotelType: editFormData.hotelType,
        province: editFormData.province,
        district: editFormData.district
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      showToast('success', 'Hotel agent updated successfully!');
      setShowEditModal(false);
      fetchAgents();
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Failed to update hotel agent');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/hotel-agents/${id}/toggle-status`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      showToast('success', `Agent ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchAgents();
    } catch (err) {
      showToast('error', 'Failed to update status');
    }
  };

  const handleDeleteAgent = async (id) => {
    if (window.confirm('Are you sure you want to delete this hotel agent?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/hotel-agents/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        showToast('success', 'Hotel agent deleted successfully');
        fetchAgents();
      } catch (err) {
        showToast('error', 'Failed to delete hotel agent');
      }
    }
  };

  const handleViewDetails = (agent) => {
    setSelectedAgent(agent);
    setShowViewModal(true);
  };

  const handleEditDetails = (agent) => {
    setEditFormData({
      id: agent.id,
      email: agent.email || '',
      firstName: agent.firstName || '',
      lastName: agent.lastName || '',
      phone: agent.phone || '',
      hotelName: agent.hotelAgent?.hotelName || '',
      registrationNumber: agent.hotelAgent?.registrationNumber || '',
      location: agent.hotelAgent?.location || '',
      contactPerson: agent.hotelAgent?.contactPerson || '',
      description: agent.hotelAgent?.description || '',
      destinations: Array.isArray(agent.hotelAgent?.destinations) 
        ? agent.hotelAgent.destinations.join(', ')
        : agent.hotelAgent?.destinations || '',
      hotelType: agent.hotelAgent?.hotelType || '3_star',
      province: agent.hotelAgent?.province || '',
      district: agent.hotelAgent?.district || ''
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      hotelName: '',
      registrationNumber: '',
      location: '',
      contactPerson: '',
      description: '',
      destinations: '',
      hotelType: '3_star',
      province: '',
      district: ''
    });
  };

  const getProfileImageUrl = (picturePath) => {
    if (!picturePath) return null;
    return `${API_BASE_URL}${picturePath}`;
  };

  const getUniqueDistricts = () => {
    const districts = new Set();
    agents.forEach(a => {
      if (a.hotelAgent?.district) {
        districts.add(a.hotelAgent.district);
      }
    });
    return Array.from(districts).sort();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <i className="text-4xl text-orange-500 fas fa-spinner fa-spin"></i>
        </div>
      </DashboardLayout>
    );
  }

  if (unauthorized) {
    return (
      <DashboardLayout>
        <div className="p-8 mx-auto max-w-2xl">
          <div className="p-8 text-center bg-red-50 rounded-lg border border-red-200 shadow-md">
            <div className="mb-4 text-5xl">🔒</div>
            <h1 className="mb-2 text-3xl font-bold text-red-700">Access Denied</h1>
            <p className="mb-2 text-red-600">You do not have permission to access this page.</p>
            <p className="text-gray-600">Only administrators and managers can manage hotel agents.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        {toast && <Toast type={toast.type} message={toast.message} />}

        {/* Header */}
        <div className="flex flex-col gap-4 justify-between md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Hotel Agent Management</h1>
            <p className="text-gray-600">Manage hotel agents and their accounts</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex gap-2 items-center px-6 py-3 font-semibold text-white bg-orange-600 rounded-lg shadow-lg transition hover:bg-orange-900"
          >
            <i className="fas fa-user-plus"></i>
            Create Hotel Agent
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('card')}
            className={`flex gap-2 items-center px-4 py-2 rounded-lg transition ${
              viewMode === 'card'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            <i className="fas fa-th-large"></i>
            Card View
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex gap-2 items-center px-4 py-2 rounded-lg transition ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            <i className="fas fa-table"></i>
            Table View
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-6 space-y-4 bg-white rounded-xl shadow-lg">
          {/* Search Box */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              <i className="mr-2 fas fa-search"></i>Search by Name, Email, or Hotel
            </label>
            <input
              type="text"
              placeholder="Search hotel agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Province Filter */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Province</label>
              <select
                value={filters.province}
                onChange={(e) => setFilters({ ...filters, province: e.target.value, district: 'all' })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Provinces</option>
                {provinces.map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">District</label>
              <select
                value={filters.district}
                onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Districts</option>
                {filters.province !== 'all'
                  ? provinceDistrictMap[filters.province]?.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))
                  : getUniqueDistricts().map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))
                }
              </select>
            </div>

            {/* Hotel Type Filter */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Hotel Type</label>
              <select
                value={filters.hotelType}
                onChange={(e) => setFilters({ ...filters, hotelType: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                {hotelTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({
                province: 'all',
                district: 'all',
                hotelType: 'all',
                status: 'all'
              });
            }}
            className="px-4 py-2 text-sm font-semibold text-white bg-gray-500 rounded-lg transition hover:bg-gray-600"
          >
            <i className="mr-2 fas fa-redo"></i>Clear Filters
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 font-bold md:grid-cols-3">
          <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total Agents</p>
                <h3 className="text-2xl font-bold text-gray-900">{agents.length}</h3>
              </div>
              <i className="text-3xl text-blue-400 fas fa-users"></i>
            </div>
          </div>
          <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {agents.filter(a => a.isActive).length}
                </h3>
              </div>
              <i className="text-3xl text-green-400 fas fa-check-circle"></i>
            </div>
          </div>
          <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {agents.filter(a => !a.isActive).length}
                </h3>
              </div>
              <i className="text-3xl text-red-400 fas fa-ban"></i>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing <span className="font-bold">{filteredAgents.length}</span> of <span className="font-bold">{agents.length}</span> agents
        </div>

        {/* Card View */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => (
              <div key={agent.id} className="overflow-hidden bg-white rounded-xl shadow-lg transition hover:shadow-xl">
                {/* Card Header */}
                <div className="p-4 bg-gradient-to-r from-white to-white">
                  <div className="flex gap-4 items-center">
                    {agent.profilePicture ? (
                      <img
                        src={getProfileImageUrl(agent.profilePicture)}
                        alt={`${agent.firstName} ${agent.lastName}`}
                        className="object-cover w-16 h-16 rounded-full border-4 border-black"
                      />
                    ) : (
                      <div className="flex justify-center items-center w-16 h-16 text-xl font-bold text-black bg-white rounded-full border-4 border-black">
                        {agent.firstName?.[0]}{agent.lastName?.[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-black">
                        {agent.firstName} {agent.lastName}
                      </h3>
                      <p className="text-sm text-orange-800">{agent.email}</p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      agent.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {agent.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2 items-center text-sm">
                      <i className="text-gray-400 fas fa-hotel"></i>
                      <span className="text-gray-600">Hotel:</span>
                      <span className="font-semibold text-gray-800">{agent.hotelAgent?.hotelName || '-'}</span>
                    </div>

                    <div className="flex gap-2 items-center text-sm">
                      <i className="text-gray-400 fas fa-map-marker-alt"></i>
                      <span className="text-gray-600">Location:</span>
                      <span className="font-semibold text-gray-800">{agent.hotelAgent?.district || '-'}</span>
                    </div>

                    <div className="flex gap-2 items-center text-sm">
                      <i className="text-gray-400 fas fa-star"></i>
                      <span className="text-gray-600">Type:</span>
                      <span className="font-semibold text-gray-800">
                        {hotelTypeOptions.find(o => o.value === agent.hotelAgent?.hotelType)?.label || '-'}
                      </span>
                    </div>

                    <div className="flex gap-2 items-center text-sm">
                      <i className="text-gray-400 fas fa-phone"></i>
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-semibold text-gray-800">{agent.phone || '-'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => handleViewDetails(agent)}
                      className="flex-1 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg transition hover:bg-blue-100"
                      title="View Details"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      onClick={() => handleEditDetails(agent)}
                      className="flex-1 px-4 py-2 text-sm font-semibold text-green-600 bg-green-50 rounded-lg transition hover:bg-green-100"
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleToggleStatus(agent.id, agent.isActive)}
                      className="flex-1 px-4 py-2 text-sm font-semibold text-orange-600 bg-orange-50 rounded-lg transition hover:bg-orange-100"
                      title={agent.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <i className={`fas ${agent.isActive ? 'fa-ban' : 'fa-check-circle'}`}></i>
                    </button>
                    <button
                      onClick={() => handleDeleteAgent(agent.id)}
                      className="flex-1 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg transition hover:bg-red-100"
                      title="Delete"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="w-full">
              <thead className="text-black bg-gradient-to-r from-white to-white">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold text-left">Agent Name</th>
                  <th className="px-6 py-3 text-sm font-semibold text-left">Email</th>
                  <th className="px-6 py-3 text-sm font-semibold text-left">Hotel</th>
                  <th className="px-6 py-3 text-sm font-semibold text-left">Registration No</th>
                  <th className="px-6 py-3 text-sm font-semibold text-left">Location</th>
                  <th className="px-6 py-3 text-sm font-semibold text-left">Type</th>
                  <th className="px-6 py-3 text-sm font-semibold text-left">Status</th>
                  <th className="px-6 py-3 text-sm font-semibold text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAgents.map((agent, index) => (
                  <tr key={agent.id} className="transition hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-3 items-center">
                        {agent.profilePicture ? (
                          <img
                            src={getProfileImageUrl(agent.profilePicture)}
                            alt={`${agent.firstName} ${agent.lastName}`}
                            className="object-cover w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="flex justify-center items-center w-10 h-10 text-xs font-bold text-white bg-orange-500 rounded-full">
                            {agent.firstName?.[0]}{agent.lastName?.[0]}
                          </div>
                        )}
                        <span className="font-semibold text-gray-800">{agent.firstName} {agent.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{agent.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{agent.hotelAgent?.hotelName || '-'}</td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-800">{agent.hotelAgent?.registrationNumber || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{agent.hotelAgent?.district || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {hotelTypeOptions.find(o => o.value === agent.hotelAgent?.hotelType)?.label || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        agent.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {agent.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(agent)}
                          className="px-3 py-1 text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                          title="View"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          onClick={() => handleEditDetails(agent)}
                          className="px-3 py-1 text-green-600 bg-green-50 rounded hover:bg-green-100"
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleToggleStatus(agent.id, agent.isActive)}
                          className="px-3 py-1 text-orange-600 bg-orange-50 rounded hover:bg-orange-100"
                          title={agent.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <i className={`fas ${agent.isActive ? 'fa-ban' : 'fa-check-circle'}`}></i>
                        </button>
                        <button
                          onClick={() => handleDeleteAgent(agent.id)}
                          className="px-3 py-1 text-red-600 bg-red-50 rounded hover:bg-red-100"
                          title="Delete"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredAgents.length === 0 && (
          <div className="py-12 text-center bg-white rounded-xl shadow">
            <i className="mb-4 text-6xl text-gray-300 fas fa-hotel"></i>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">No Hotel Agents Found</h3>
            <p className="mb-6 text-gray-600">
              {searchTerm || Object.values(filters).some(f => f !== 'all')
                ? 'Try adjusting your search or filters'
                : 'Start by creating a hotel agent account'}
            </p>
            {!(searchTerm || Object.values(filters).some(f => f !== 'all')) && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 font-semibold text-white bg-orange-600 rounded-lg transition hover:bg-orange-700"
              >
                <i className="mr-2 fas fa-plus"></i>
                Create First Agent
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 px-8 py-6 bg-gradient-to-r from-orange-700 to-orange-800">
              <h2 className="text-2xl font-bold text-white">Create Hotel Agent Account</h2>
              <p className="text-orange-100">Add a new hotel agent to the system</p>
            </div>
            
            <form onSubmit={handleCreateAgent} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                  minLength={6}
                />
                <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="+94771234567"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Hotel Name *</label>
                  <input
                    type="text"
                    value={formData.hotelName}
                    onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Registration No. *</label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Location / Address *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Province *</label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value, district: '' })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Select Province</option>
                    {provinces.map(prov => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">District *</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Select District</option>
                    {formData.province && provinceDistrictMap[formData.province]
                      ? provinceDistrictMap[formData.province].map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))
                      : <option disabled>Please select a province first</option>
                    }
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Contact Person</label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Hotel Type</label>
                <select
                  value={formData.hotelType}
                  onChange={(e) => setFormData({ ...formData, hotelType: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {hotelTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Destinations (comma separated)</label>
                <input
                  type="text"
                  value={formData.destinations}
                  onChange={(e) => setFormData({ ...formData, destinations: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Colombo, Kandy, Galle"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 font-semibold text-white bg-orange-700 rounded-lg transition hover:bg-orange-900"
                >
                  <i className="mr-2 fas fa-plus"></i>
                  Create Hotel Agent
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg transition hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewModal && selectedAgent && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700">
              <h2 className="text-2xl font-bold text-white">Hotel Agent Details</h2>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex gap-6 items-center">
                {selectedAgent.profilePicture ? (
                  <img
                    src={getProfileImageUrl(selectedAgent.profilePicture)}
                    alt="Profile"
                    className="object-cover w-24 h-24 rounded-full border-4 border-orange-200"
                  />
                ) : (
                  <div className="flex justify-center items-center w-24 h-24 text-3xl font-bold text-white bg-orange-500 rounded-full border-4 border-orange-200">
                    {selectedAgent.firstName?.[0]}{selectedAgent.lastName?.[0]}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedAgent.firstName} {selectedAgent.lastName}
                  </h3>
                  <p className="text-gray-600">{selectedAgent.email}</p>
                  <p className={selectedAgent.isActive ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                    {selectedAgent.isActive ? '● Active' : '● Inactive'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-900">{selectedAgent.phone || 'N/A'}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-600">Created</p>
                  <p className="font-semibold text-gray-900">{new Date(selectedAgent.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-600">Hotel Name</p>
                  <p className="font-semibold text-gray-900">{selectedAgent.hotelAgent?.hotelName || 'N/A'}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-600">Registration No.</p>
                  <p className="font-semibold text-gray-900">{selectedAgent.hotelAgent?.registrationNumber || 'N/A'}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="mb-3 text-lg font-bold text-gray-800">Location Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Address</p>
                    <p className="text-gray-900">{selectedAgent.hotelAgent?.location || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Province</p>
                    <p className="text-gray-900">{selectedAgent.hotelAgent?.province || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">District</p>
                    <p className="text-gray-900">{selectedAgent.hotelAgent?.district || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Hotel Type</p>
                    <p className="text-gray-900">
                      {hotelTypeOptions.find(o => o.value === selectedAgent.hotelAgent?.hotelType)?.label || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="mb-2 text-lg font-bold text-gray-800">Destinations</h4>
                <p className="text-gray-900">
                  {selectedAgent.hotelAgent?.destinations?.length
                    ? (Array.isArray(selectedAgent.hotelAgent.destinations) 
                        ? selectedAgent.hotelAgent.destinations.join(', ')
                        : selectedAgent.hotelAgent.destinations)
                    : 'N/A'}
                </p>
              </div>

              <div className="pt-4 border-t">
                <h4 className="mb-2 text-lg font-bold text-gray-800">Description</h4>
                <p className="text-gray-900">{selectedAgent.hotelAgent?.description || 'N/A'}</p>
              </div>

              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-3 w-full font-semibold text-gray-700 bg-gray-200 rounded-lg transition hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 px-8 py-6 bg-gradient-to-r from-indigo-700 to-indigo-800">
              <h2 className="text-2xl font-bold text-white">Edit Hotel Agent</h2>
              <p className="text-indigo-100">Update hotel agent details</p>
            </div>

            <form onSubmit={handleUpdateAgent} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">First Name *</label>
                  <input
                    type="text"
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Last Name *</label>
                  <input
                    type="text"
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Email *</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Hotel Name *</label>
                  <input
                    type="text"
                    value={editFormData.hotelName}
                    onChange={(e) => setEditFormData({ ...editFormData, hotelName: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Registration No. *</label>
                  <input
                    type="text"
                    value={editFormData.registrationNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, registrationNumber: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Location / Address *</label>
                <input
                  type="text"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Province *</label>
                  <select
                    value={editFormData.province}
                    onChange={(e) => setEditFormData({ ...editFormData, province: e.target.value, district: '' })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Province</option>
                    {provinces.map(prov => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">District *</label>
                  <select
                    value={editFormData.district}
                    onChange={(e) => setEditFormData({ ...editFormData, district: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select District</option>
                    {editFormData.province && provinceDistrictMap[editFormData.province]
                      ? provinceDistrictMap[editFormData.province].map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))
                      : <option disabled>Please select a province first</option>
                    }
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Contact Person</label>
                <input
                  type="text"
                  value={editFormData.contactPerson}
                  onChange={(e) => setEditFormData({ ...editFormData, contactPerson: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Hotel Type</label>
                <select
                  value={editFormData.hotelType}
                  onChange={(e) => setEditFormData({ ...editFormData, hotelType: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {hotelTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Destinations (comma separated)</label>
                <input
                  type="text"
                  value={editFormData.destinations}
                  onChange={(e) => setEditFormData({ ...editFormData, destinations: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 font-semibold text-white bg-indigo-700 rounded-lg transition hover:bg-indigo-900"
                >
                  <i className="mr-2 fas fa-save"></i>
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg transition hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default HotelAgents;
