import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const SRI_LANKA_PROVINCES = {
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
  { value: '5_star', label: '5 Star' },
  { value: 'boutique', label: 'Boutique' },
  { value: 'villa', label: 'Villa' },
  { value: 'resort', label: 'Resort' }
];

const destinationsToString = (destinations) => {
  if (Array.isArray(destinations)) return destinations.join(', ');
  return destinations || '';
};

function HotelAgents() {
  const { user } = useAuth();
  const [hotelAgents, setHotelAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProvince, setFilterProvince] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterHotelType, setFilterHotelType] = useState('');

  useEffect(() => {
    fetchHotelAgents();
  }, []);

  const fetchHotelAgents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/hotel-agents');
      setHotelAgents(response.data);
    } catch (err) {
      console.error('Error fetching hotel agents:', err);
      alert('Failed to load hotel agents');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/hotel-agents', {
        ...formData
      });
      alert('Hotel agent created successfully!');
      setShowCreateModal(false);
      resetForm();
      fetchHotelAgents();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create hotel agent');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hotel agent?')) {
      try {
        await axios.delete(`http://localhost:5000/api/hotel-agents/${id}`);
        fetchHotelAgents();
        alert('Hotel agent deleted successfully');
      } catch (err) {
        alert('Failed to delete hotel agent');
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/hotel-agents/${id}/toggle-status`);
      fetchHotelAgents();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleViewDetails = async (agent) => {
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
      destinations: destinationsToString(agent.hotelAgent?.destinations),
      hotelType: agent.hotelAgent?.hotelType || '3_star',
      province: agent.hotelAgent?.province || '',
      district: agent.hotelAgent?.district || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateAgent = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/hotel-agents/${editFormData.id}`, {
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
      });
      alert('Hotel agent updated successfully!');
      setShowEditModal(false);
      fetchHotelAgents();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update hotel agent');
    }
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
    return `http://localhost:5000${picturePath}`;
  };

  const filteredAgents = hotelAgents.filter(agent => {
    const matchesSearch =
      agent.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.hotelAgent?.hotelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.hotelAgent?.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && agent.isActive) ||
      (filterStatus === 'inactive' && !agent.isActive);

    const matchesProvince = !filterProvince || agent.hotelAgent?.province === filterProvince;
    const matchesDistrict = !filterDistrict || agent.hotelAgent?.district === filterDistrict;
    const matchesHotelType = !filterHotelType || agent.hotelAgent?.hotelType === filterHotelType;

    return matchesSearch && matchesStatus && matchesProvince && matchesDistrict && matchesHotelType;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <i className="text-4xl text-orange-600 fas fa-spinner fa-spin"></i>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 justify-between md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Hotel Agent Management</h1>
            <p className="text-gray-600">Manage hotel agents and their accounts</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex gap-2 items-center px-6 py-3 font-semibold text-white bg-orange-600 rounded-lg shadow-lg transition hover:bg-orange-700"
          >
            <i className="fas fa-user-plus"></i>
            Create Hotel Agent
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <div className="mb-6">
            <label className="block mb-3 text-sm font-semibold text-gray-700">
              <i className="mr-2 fas fa-search"></i>
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, hotel name, registration number..."
              className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Status Filter */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                <i className="mr-2 fas fa-signal"></i>
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Province Filter */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                <i className="mr-2 fas fa-map"></i>
                Province
              </label>
              <select
                value={filterProvince}
                onChange={(e) => {
                  setFilterProvince(e.target.value);
                  setFilterDistrict('');
                }}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Provinces</option>
                {Object.keys(SRI_LANKA_PROVINCES).map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                <i className="mr-2 fas fa-location-dot"></i>
                District
              </label>
              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Districts</option>
                {filterProvince &&
                  (SRI_LANKA_PROVINCES[filterProvince] || []).map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
              </select>
            </div>

            {/* Hotel Type Filter */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                <i className="mr-2 fas fa-hotel"></i>
                Hotel Type
              </label>
              <select
                value={filterHotelType}
                onChange={(e) => setFilterHotelType(e.target.value)}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Types</option>
                {hotelTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || filterStatus !== 'all' || filterProvince || filterDistrict || filterHotelType) && (
            <div className="flex flex-wrap gap-2 items-center pt-4 mt-4 border-t">
              <span className="text-sm font-semibold text-gray-600">
                <i className="mr-2 fas fa-filter"></i>
                Active Filters:
              </span>
              {searchTerm && (
                <span className="flex gap-2 items-center px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="text-blue-600 hover:text-blue-800">
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              {filterStatus !== 'all' && (
                <span className="flex gap-2 items-center px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                  Status: {filterStatus}
                  <button onClick={() => setFilterStatus('all')} className="text-green-600 hover:text-green-800">
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              {filterProvince && (
                <span className="flex gap-2 items-center px-3 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">
                  Province: {filterProvince}
                  <button onClick={() => setFilterProvince('')} className="text-purple-600 hover:text-purple-800">
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              {filterDistrict && (
                <span className="flex gap-2 items-center px-3 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded-full">
                  District: {filterDistrict}
                  <button onClick={() => setFilterDistrict('')} className="text-indigo-600 hover:text-indigo-800">
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              {filterHotelType && (
                <span className="flex gap-2 items-center px-3 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">
                  Type: {hotelTypeOptions.find((o) => o.value === filterHotelType)?.label}
                  <button onClick={() => setFilterHotelType('')} className="text-orange-600 hover:text-orange-800">
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterProvince('');
                  setFilterDistrict('');
                  setFilterHotelType('');
                }}
                className="px-3 py-1 text-xs font-semibold text-red-600 bg-red-50 rounded-full transition hover:bg-red-100"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-100">Total Agents</p>
                <h3 className="text-2xl font-bold text-white">{hotelAgents.length}</h3>
              </div>
              <i className="text-3xl text-blue-200 fas fa-users"></i>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-green-100">Active</p>
                <h3 className="text-2xl font-bold text-white">
                  {hotelAgents.filter((a) => a.isActive).length}
                </h3>
              </div>
              <i className="text-3xl text-green-200 fas fa-check-circle"></i>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-red-100">Inactive</p>
                <h3 className="text-2xl font-bold text-white">
                  {hotelAgents.filter((a) => !a.isActive).length}
                </h3>
              </div>
              <i className="text-3xl text-red-200 fas fa-ban"></i>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600">
          Showing <span className="font-bold text-gray-800">{filteredAgents.length}</span> hotel agent(s)
        </p>

        {/* Hotel Agents Table */}
        <div className="overflow-hidden bg-white rounded-xl shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-orange-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
                    Agent Name
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
                    Hotel
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
                    Reg. Number
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
                    Province
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
                    District
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {agent.profilePicture ? (
                          <img
                            src={getProfileImageUrl(agent.profilePicture)}
                            alt={`${agent.firstName} ${agent.lastName}`}
                            className="object-cover w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="flex justify-center items-center w-8 h-8 text-xs font-bold text-white bg-orange-500 rounded-full">
                            {agent.firstName?.[0]}{agent.lastName?.[0]}
                          </div>
                        )}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {agent.firstName} {agent.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {agent.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {agent.hotelAgent?.hotelName || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {agent.hotelAgent?.registrationNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {agent.hotelAgent?.province || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {agent.hotelAgent?.district || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {agent.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        agent.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {agent.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2 text-sm font-medium whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(agent)}
                        className="px-2 py-1 text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                        title="View Details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        onClick={() => handleEditDetails(agent)}
                        className="px-2 py-1 text-indigo-600 bg-indigo-50 rounded hover:bg-indigo-100"
                        title="Edit"
                      >
                        <i className="fas fa-pen"></i>
                      </button>
                      <button
                        onClick={() => handleToggleStatus(agent.id)}
                        className="px-2 py-1 text-orange-600 bg-orange-50 rounded hover:bg-orange-100"
                        title={agent.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <i className={`fas ${agent.isActive ? 'fa-ban' : 'fa-check-circle'}`}></i>
                      </button>
                      <button
                        onClick={() => handleDelete(agent.id)}
                        className="px-2 py-1 text-red-600 bg-red-50 rounded hover:bg-red-100"
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* No Results */}
        {filteredAgents.length === 0 && (
          <div className="py-12 text-center bg-white rounded-xl shadow">
            <i className="mb-4 text-6xl text-gray-300 fas fa-hotel"></i>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">No Hotel Agents Found</h3>
            <p className="text-gray-600">Create your first hotel agent to get started</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 px-8 py-6 bg-orange-600">
              <h2 className="text-2xl font-bold text-white">Create Hotel Agent Account</h2>
              <p className="text-orange-100">Add a new hotel agent to the system</p>
            </div>
            
            <form onSubmit={handleCreateAgent} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
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
                    {Object.keys(SRI_LANKA_PROVINCES).map((province) => (
                      <option key={province} value={province}>{province}</option>
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
                    {(SRI_LANKA_PROVINCES[formData.province] || []).map((district) => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
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
                <label className="block mb-2 text-sm font-semibold text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="+94771234567"
                />
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
                <label className="block mb-2 text-sm font-semibold text-gray-700">Hotel Type</label>
                <select
                  value={formData.hotelType}
                  onChange={(e) => setFormData({ ...formData, hotelType: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {hotelTypeOptions.map((option) => (
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
                  className="flex-1 px-6 py-3 font-semibold text-white bg-orange-600 rounded-lg transition hover:bg-orange-700"
                >
                  <i className="mr-2 fas fa-user-plus"></i>
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
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl">
            <div className="px-8 py-6 bg-orange-600">
              <h2 className="text-2xl font-bold text-white">Hotel Agent Details</h2>
            </div>
            
            <div className="p-8 space-y-4">
              <div className="flex gap-4 items-center">
                {selectedAgent.profilePicture ? (
                  <img
                    src={getProfileImageUrl(selectedAgent.profilePicture)}
                    alt="Profile"
                    className="object-cover w-20 h-20 rounded-full"
                  />
                ) : (
                  <div className="flex justify-center items-center w-20 h-20 text-2xl font-bold text-white bg-orange-500 rounded-full">
                    {selectedAgent.firstName?.[0]}{selectedAgent.lastName?.[0]}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedAgent.firstName} {selectedAgent.lastName}
                  </h3>
                  <p className="text-gray-600">{selectedAgent.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500">Phone</p>
                  <p className="text-gray-900">{selectedAgent.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Status</p>
                  <p className={selectedAgent.isActive ? 'text-green-600' : 'text-red-600'}>
                    {selectedAgent.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Created At</p>
                  <p className="text-gray-900">
                    {new Date(selectedAgent.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Role</p>
                  <p className="text-gray-900">Hotel Agent</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Hotel</p>
                  <p className="text-gray-900">{selectedAgent.hotelAgent?.hotelName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Registration No.</p>
                  <p className="text-gray-900">{selectedAgent.hotelAgent?.registrationNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Location</p>
                  <p className="text-gray-900">{selectedAgent.hotelAgent?.location || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Province</p>
                  <p className="text-gray-900">{selectedAgent.hotelAgent?.province || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">District</p>
                  <p className="text-gray-900">{selectedAgent.hotelAgent?.district || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Hotel Type</p>
                  <p className="text-gray-900">{selectedAgent.hotelAgent?.hotelType || 'N/A'}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="mb-2 text-sm font-semibold text-gray-500">Destinations</p>
                <p className="text-gray-900">
                  {selectedAgent.hotelAgent?.destinations?.length
                    ? selectedAgent.hotelAgent.destinations.join(', ')
                    : 'N/A'}
                </p>
              </div>

              <div className="pt-4 border-t">
                <p className="mb-2 text-sm font-semibold text-gray-500">Description</p>
                <p className="text-gray-900">{selectedAgent.hotelAgent?.description || 'N/A'}</p>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="flex-1 px-6 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg transition hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 px-8 py-6 bg-indigo-600">
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
                    {Object.keys(SRI_LANKA_PROVINCES).map((province) => (
                      <option key={province} value={province}>{province}</option>
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
                    {(SRI_LANKA_PROVINCES[editFormData.province] || []).map((district) => (
                      <option key={district} value={district}>{district}</option>
                    ))}
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
                  {hotelTypeOptions.map((option) => (
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
                  className="flex-1 px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg transition hover:bg-indigo-700"
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