import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL, { getImageUrl } from '../../config/api';

function DriverManagement() {
  // View state
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Drivers data
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [showAddDetailsModal, setShowAddDetailsModal] = useState(false);
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);

  // Form states
  const [selectedDriver, setSelectedDriver] = useState(null);
  
  const [accountFormData, setAccountFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const [detailsFormData, setDetailsFormData] = useState({
    licenseNumber: '',
    address: '',
    city: '',
    district: '',
    province: '',
    languages: ['English'],
    otherSkills: [],
    yearsOfExperience: 0,
    vehicleType: '',
    vehicleNumber: '',
    vehicleModel: '',
    vehicleYear: new Date().getFullYear(),
    vehicleColor: '',
    availabilityStatus: 'available',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });

  const [newLanguage, setNewLanguage] = useState('');
  const [newSkill, setNewSkill] = useState('');

  // Constants for dropdowns
  const provinces = [
    'Western', 'Central', 'Southern', 'Northern', 'Eastern',
    'North Western', 'North Central', 'Uva', 'Sabaragamuwa'
  ];

  const provinceDistrictMap = {
    'Western': ['Colombo', 'Gampaha', 'Kalutara'],
    'Central': ['Kandy', 'Matara', 'Nuwara Eliya'],
    'Southern': ['Galle', 'Matara', 'Hambantota'],
    'Northern': ['Jaffna', 'Mullaitivu', 'Vavuniya'],
    'Eastern': ['Trincomalee', 'Batticaloa', 'Ampara'],
    'North Western': ['Kurunegala', 'Puttalam'],
    'North Central': ['Polonnaruwa', 'Anuradhapura'],
    'Uva': ['Badulla', 'Monaragala'],
    'Sabaragamuwa': ['Ratnapura', 'Kegalle']
  };

  const vehicleTypes = [
    'Car', 'Van', 'SUV', 'Bus', 'Mini Bus', 'Luxury Car', 'Coaster'
  ];

  const allLanguages = ['English', 'Sinhala', 'Tamil', 'German', 'French', 'Spanish', 'Japanese', 'Chinese'];

  // Fetch drivers on mount
  useEffect(() => {
    fetchDrivers();
  }, []);

  // Filter drivers
  useEffect(() => {
    let filtered = drivers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(driver =>
        `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(driver =>
        driver.driverDetails?.availabilityStatus === statusFilter
      );
    }

    setFilteredDrivers(filtered);
  }, [drivers, searchTerm, statusFilter]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/drivers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const driversData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setDrivers(driversData);
      setError(null);
    } catch (err) {
      setError('Failed to load drivers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!accountFormData.email || !accountFormData.password || !accountFormData.firstName || !accountFormData.lastName) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/users`, {
        ...accountFormData,
        role: 'driver'
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSuccess('Driver account created successfully!');
      setShowCreateAccountModal(false);
      setAccountFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: ''
      });
      fetchDrivers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create driver account');
    }
  };

  const handleAddDetails = (driver) => {
    setSelectedDriver(driver);
    if (driver.driverDetails) {
      setDetailsFormData({
        licenseNumber: driver.driverDetails.licenseNumber || '',
        address: driver.driverDetails.address || '',
        city: driver.driverDetails.city || '',
        district: driver.driverDetails.district || '',
        province: driver.driverDetails.province || '',
        languages: driver.driverDetails.languages || ['English'],
        otherSkills: driver.driverDetails.otherSkills || [],
        yearsOfExperience: driver.driverDetails.yearsOfExperience || 0,
        vehicleType: driver.driverDetails.vehicleType || '',
        vehicleNumber: driver.driverDetails.vehicleNumber || '',
        vehicleModel: driver.driverDetails.vehicleModel || '',
        vehicleYear: driver.driverDetails.vehicleYear || new Date().getFullYear(),
        vehicleColor: driver.driverDetails.vehicleColor || '',
        availabilityStatus: driver.driverDetails.availabilityStatus || 'available',
        emergencyContactName: driver.driverDetails.emergencyContactName || '',
        emergencyContactPhone: driver.driverDetails.emergencyContactPhone || ''
      });
    }
    setShowAddDetailsModal(true);
  };

  const handleSubmitDetails = async (e) => {
    e.preventDefault();
    if (!detailsFormData.licenseNumber) {
      setError('License number is required');
      return;
    }

    try {
      const url = `${API_BASE_URL}/api/drivers/${selectedDriver.id}/details`;
      
      if (selectedDriver.driverDetails) {
        await axios.put(url, detailsFormData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSuccess('Driver details updated successfully!');
      } else {
        await axios.post(url, detailsFormData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSuccess('Driver details added successfully!');
      }

      setShowAddDetailsModal(false);
      setSelectedDriver(null);
      resetDetailsForm();
      fetchDrivers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save driver details');
    }
  };

  const handleViewDetails = (driver) => {
    setSelectedDriver(driver);
    setShowViewDetailsModal(true);
  };

  const handleToggleAvailability = async (driver) => {
    if (!driver.driverDetails) {
      setError('Please add driver details first');
      return;
    }

    const newStatus = driver.driverDetails.availabilityStatus === 'available' ? 'busy' : 'available';
    try {
      await axios.patch(
        `${API_BASE_URL}/api/drivers/${driver.id}/availability`,
        { availabilityStatus: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchDrivers();
    } catch (err) {
      setError('Failed to update availability');
    }
  };

  const handleDeleteDriver = async (driverId, driverName) => {
    setDeleteConfirmation({ driverId, driverName });
  };

  const confirmDeleteDriver = async () => {
    if (!deleteConfirmation) return;
    
    const { driverId, driverName } = deleteConfirmation;
    setIsDeleting(true);
    setError(null);
    
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/users/${driverId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setSuccess(`✅ Driver "${driverName}" has been successfully deleted.`);
      setDeleteConfirmation(null);
      fetchDrivers();
      
      // Auto-clear success message after 4 seconds
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to delete driver';
      setError(`❌ Error deleting driver: ${errorMessage}`);
      console.error('Delete driver error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteDriver = () => {
    setDeleteConfirmation(null);
  };

  const resetDetailsForm = () => {
    setDetailsFormData({
      licenseNumber: '',
      address: '',
      city: '',
      district: '',
      province: '',
      languages: ['English'],
      otherSkills: [],
      yearsOfExperience: 0,
      vehicleType: '',
      vehicleNumber: '',
      vehicleModel: '',
      vehicleYear: new Date().getFullYear(),
      vehicleColor: '',
      availabilityStatus: 'available',
      emergencyContactName: '',
      emergencyContactPhone: ''
    });
    setNewLanguage('');
    setNewSkill('');
  };

  const addLanguage = () => {
    if (newLanguage && !detailsFormData.languages.includes(newLanguage)) {
      setDetailsFormData({
        ...detailsFormData,
        languages: [...detailsFormData.languages, newLanguage]
      });
      setNewLanguage('');
    }
  };

  const removeLanguage = (lang) => {
    setDetailsFormData({
      ...detailsFormData,
      languages: detailsFormData.languages.filter(l => l !== lang)
    });
  };

  const addSkill = () => {
    if (newSkill && !detailsFormData.otherSkills.includes(newSkill)) {
      setDetailsFormData({
        ...detailsFormData,
        otherSkills: [...detailsFormData.otherSkills, newSkill]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setDetailsFormData({
      ...detailsFormData,
      otherSkills: detailsFormData.otherSkills.filter(s => s !== skill)
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      available: 'bg-green-100 text-green-800 border border-green-300',
      busy: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      on_leave: 'bg-red-100 text-red-800 border border-red-300'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Driver Management</h1>
        <p className="text-gray-600">Manage all drivers, create accounts, and update driver information</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 border border-red-300 rounded-lg">
          {error}
          <button onClick={() => setError(null)} className="ml-4 text-red-600 hover:text-red-800">✕</button>
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded-lg">
          {success}
          <button onClick={() => setSuccess(null)} className="ml-4 text-green-600 hover:text-green-800">✕</button>
        </div>
      )}

      {/* Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              viewMode === 'grid'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📊 Grid View
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              viewMode === 'table'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📋 Table View
          </button>
        </div>

        <button
          onClick={() => {
            setAccountFormData({
              email: '',
              password: '',
              firstName: '',
              lastName: '',
              phone: ''
            });
            setShowCreateAccountModal(true);
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          ➕ Create New Driver
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search drivers by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="on_leave">On Leave</option>
        </select>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrivers.map((driver) => (
            <div key={driver.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              {/* Card Header */}
              <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600">
                <div className="flex items-center gap-3">
                  {driver.profilePicture ? (
                    <img
                      src={getImageUrl(driver.profilePicture)}
                      alt={`${driver.firstName} ${driver.lastName}`}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-blue-600">
                      {driver.firstName[0]}{driver.lastName[0]}
                    </div>
                  )}
                  <div className="text-white">
                    <h3 className="font-bold text-lg">{driver.firstName} {driver.lastName}</h3>
                    <p className="text-sm opacity-90">{driver.email}</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-800">{driver.phone || 'Not provided'}</p>
                </div>

                {driver.driverDetails ? (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">License #</p>
                      <p className="font-medium text-gray-800">{driver.driverDetails.licenseNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Vehicle</p>
                      <p className="font-medium text-gray-800">{driver.driverDetails.vehicleType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(driver.driverDetails.availabilityStatus)}`}>
                        {driver.driverDetails.availabilityStatus}
                      </span>
                    </div>
                    {driver.driverDetails.rating > 0 && (
                      <div>
                        <p className="text-sm text-gray-600">Rating</p>
                        <p className="font-medium text-yellow-600">{'⭐'.repeat(Math.round(driver.driverDetails.rating))} {driver.driverDetails.rating}/5</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-3 bg-yellow-50 border border-yellow-300 rounded text-sm text-yellow-800">
                    ⚠️ Driver details not added yet
                  </div>
                )}
              </div>

              {/* Card Actions */}
              <div className="p-4 border-t border-gray-200 flex flex-wrap gap-2">
                <button
                  onClick={() => handleViewDetails(driver)}
                  className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium transition"
                >
                  👁️ View
                </button>
                <button
                  onClick={() => handleAddDetails(driver)}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium transition"
                >
                  ✏️ Details
                </button>
                {driver.driverDetails && (
                  <button
                    onClick={() => handleToggleAvailability(driver)}
                    className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm font-medium transition"
                  >
                    🔄 Toggle
                  </button>
                )}
                <button
                  onClick={() => handleDeleteDriver(driver.id, `${driver.firstName} ${driver.lastName}`)}
                  className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium transition"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">License</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Vehicle</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Rating</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800">{driver.firstName} {driver.lastName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{driver.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{driver.phone || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{driver.driverDetails?.licenseNumber || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{driver.driverDetails?.vehicleType || '—'}</td>
                  <td className="px-4 py-3">
                    {driver.driverDetails ? (
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(driver.driverDetails.availabilityStatus)}`}>
                        {driver.driverDetails.availabilityStatus}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">No details</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {driver.driverDetails?.rating > 0 ? `${driver.driverDetails.rating}/5` : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleViewDetails(driver)}
                        className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition"
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleAddDetails(driver)}
                        className="px-2 py-1 text-xs bg-blue-200 hover:bg-blue-300 rounded transition"
                        title="Edit Details"
                      >
                        ✏️
                      </button>
                      {driver.driverDetails && (
                        <button
                          onClick={() => handleToggleAvailability(driver)}
                          className="px-2 py-1 text-xs bg-green-200 hover:bg-green-300 rounded transition"
                          title="Toggle Availability"
                        >
                          🔄
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteDriver(driver.id, `${driver.firstName} ${driver.lastName}`)}
                        className="px-2 py-1 text-xs bg-red-200 hover:bg-red-300 rounded transition"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredDrivers.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-lg">No drivers found</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Create Account Modal */}
      {showCreateAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-blue-600 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Create Driver Account</h2>
              <button
                onClick={() => setShowCreateAccountModal(false)}
                className="text-2xl hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  value={accountFormData.firstName}
                  onChange={(e) => setAccountFormData({...accountFormData, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  value={accountFormData.lastName}
                  onChange={(e) => setAccountFormData({...accountFormData, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={accountFormData.email}
                  onChange={(e) => setAccountFormData({...accountFormData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  value={accountFormData.password}
                  onChange={(e) => setAccountFormData({...accountFormData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={accountFormData.phone}
                  onChange={(e) => setAccountFormData({...accountFormData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateAccountModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Details Modal */}
      {showAddDetailsModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-blue-600 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {selectedDriver.driverDetails ? 'Edit Driver Details' : 'Add Driver Details'}
              </h2>
              <button
                onClick={() => {
                  setShowAddDetailsModal(false);
                  setSelectedDriver(null);
                  resetDetailsForm();
                }}
                className="text-2xl hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitDetails} className="p-6 space-y-4">
              {/* License Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">License Information</h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">License Number *</label>
                  <input
                    type="text"
                    value={detailsFormData.licenseNumber}
                    onChange={(e) => setDetailsFormData({...detailsFormData, licenseNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Location Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Location Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                    <textarea
                      placeholder="Address"
                      value={detailsFormData.address}
                      onChange={(e) => setDetailsFormData({...detailsFormData, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      placeholder="City"
                      value={detailsFormData.city}
                      onChange={(e) => setDetailsFormData({...detailsFormData, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Province *</label>
                    <select
                      value={detailsFormData.province}
                      onChange={(e) => setDetailsFormData({...detailsFormData, province: e.target.value, district: ''})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option key="empty-prov-select" value="">Select Province</option>
                      {provinces.map(prov => (
                        <option key={prov} value={prov}>{prov}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">District *</label>
                    <select
                      value={detailsFormData.district}
                      onChange={(e) => setDetailsFormData({...detailsFormData, district: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={!detailsFormData.province}
                    >
                      <option key="empty-dist-select" value="">Select District</option>
                      {detailsFormData.province && provinceDistrictMap[detailsFormData.province]
                        ? provinceDistrictMap[detailsFormData.province].map(dist => (
                            <option key={dist} value={dist}>{dist}</option>
                          ))
                        : <option disabled>Please select a province first</option>
                      }
                    </select>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Professional Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Languages</label>
                    <div className="flex gap-2 mb-2">
                      <select
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select language to add</option>
                        {allLanguages.filter(l => !detailsFormData.languages.includes(l)).map(lang => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={addLanguage}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {detailsFormData.languages.map((lang) => (
                        <span
                          key={lang}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                        >
                          {lang}
                          <button
                            type="button"
                            onClick={() => removeLanguage(lang)}
                            className="text-blue-600 hover:text-blue-800 font-bold"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Other Skills</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add skill"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {detailsFormData.otherSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="text-green-600 hover:text-green-800 font-bold"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <input
                    type="number"
                    placeholder="Years of Experience"
                    value={detailsFormData.yearsOfExperience}
                    onChange={(e) => setDetailsFormData({...detailsFormData, yearsOfExperience: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>

              {/* Vehicle Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Vehicle Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={detailsFormData.vehicleType}
                    onChange={(e) => setDetailsFormData({...detailsFormData, vehicleType: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select vehicle type</option>
                    {vehicleTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Vehicle Number"
                    value={detailsFormData.vehicleNumber}
                    onChange={(e) => setDetailsFormData({...detailsFormData, vehicleNumber: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Vehicle Model"
                    value={detailsFormData.vehicleModel}
                    onChange={(e) => setDetailsFormData({...detailsFormData, vehicleModel: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Vehicle Year"
                    value={detailsFormData.vehicleYear}
                    onChange={(e) => setDetailsFormData({...detailsFormData, vehicleYear: parseInt(e.target.value)})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                  <input
                    type="text"
                    placeholder="Vehicle Color"
                    value={detailsFormData.vehicleColor}
                    onChange={(e) => setDetailsFormData({...detailsFormData, vehicleColor: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Status & Emergency */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Status & Emergency Contact</h3>
                <div className="space-y-4">
                  <select
                    value={detailsFormData.availabilityStatus}
                    onChange={(e) => setDetailsFormData({...detailsFormData, availabilityStatus: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="on_leave">On Leave</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Emergency Contact Name"
                    value={detailsFormData.emergencyContactName}
                    onChange={(e) => setDetailsFormData({...detailsFormData, emergencyContactName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Emergency Contact Phone"
                    value={detailsFormData.emergencyContactPhone}
                    onChange={(e) => setDetailsFormData({...detailsFormData, emergencyContactPhone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddDetailsModal(false);
                    setSelectedDriver(null);
                    resetDetailsForm();
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                >
                  {selectedDriver.driverDetails ? 'Update Details' : 'Add Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewDetailsModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-blue-600 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Driver Profile</h2>
              <button
                onClick={() => {
                  setShowViewDetailsModal(false);
                  setSelectedDriver(null);
                }}
                className="text-2xl hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                {selectedDriver.profilePicture ? (
                  <img
                    src={getImageUrl(selectedDriver.profilePicture)}
                    alt={`${selectedDriver.firstName} ${selectedDriver.lastName}`}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
                    {selectedDriver.firstName[0]}{selectedDriver.lastName[0]}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{selectedDriver.firstName} {selectedDriver.lastName}</h3>
                  <p className="text-gray-600">{selectedDriver.email}</p>
                </div>
              </div>

              {/* User Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">User Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-800">{selectedDriver.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-800">{selectedDriver.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="font-medium text-gray-800">{selectedDriver.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className={`font-medium ${selectedDriver.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedDriver.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>

              {selectedDriver.driverDetails && (
                <>
                  {/* License Information */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">License Information</h3>
                    <p className="text-gray-800"><strong>License Number:</strong> {selectedDriver.driverDetails.licenseNumber}</p>
                  </div>

                  {/* Location Information */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Location Information</h3>
                    <div className="space-y-1 text-gray-800">
                      {selectedDriver.driverDetails.address && <p><strong>Address:</strong> {selectedDriver.driverDetails.address}</p>}
                      {selectedDriver.driverDetails.city && <p><strong>City:</strong> {selectedDriver.driverDetails.city}</p>}
                      {selectedDriver.driverDetails.district && <p><strong>District:</strong> {selectedDriver.driverDetails.district}</p>}
                      {selectedDriver.driverDetails.province && <p><strong>Province:</strong> {selectedDriver.driverDetails.province}</p>}
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Professional Information</h3>
                    <div className="space-y-2">
                      {selectedDriver.driverDetails.yearsOfExperience > 0 && (
                        <p className="text-gray-800"><strong>Experience:</strong> {selectedDriver.driverDetails.yearsOfExperience} years</p>
                      )}
                      {selectedDriver.driverDetails.languages?.length > 0 && (
                        <div>
                          <p className="text-gray-800 font-bold">Languages:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedDriver.driverDetails.languages.map((lang) => (
                              <span key={lang} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedDriver.driverDetails.otherSkills?.length > 0 && (
                        <div>
                          <p className="text-gray-800 font-bold">Skills:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedDriver.driverDetails.otherSkills.map((skill) => (
                              <span key={skill} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Vehicle Information</h3>
                    <div className="space-y-1 text-gray-800">
                      {selectedDriver.driverDetails.vehicleType && <p><strong>Type:</strong> {selectedDriver.driverDetails.vehicleType}</p>}
                      {selectedDriver.driverDetails.vehicleModel && <p><strong>Model:</strong> {selectedDriver.driverDetails.vehicleModel}</p>}
                      {selectedDriver.driverDetails.vehicleNumber && <p><strong>Number:</strong> {selectedDriver.driverDetails.vehicleNumber}</p>}
                      {selectedDriver.driverDetails.vehicleYear && <p><strong>Year:</strong> {selectedDriver.driverDetails.vehicleYear}</p>}
                      {selectedDriver.driverDetails.vehicleColor && <p><strong>Color:</strong> {selectedDriver.driverDetails.vehicleColor}</p>}
                    </div>
                  </div>

                  {/* Status & Performance */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Status & Performance</h3>
                    <div className="space-y-2 text-gray-800">
                      <p>
                        <strong>Availability:</strong>{' '}
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedDriver.driverDetails.availabilityStatus)}`}>
                          {selectedDriver.driverDetails.availabilityStatus}
                        </span>
                      </p>
                      {selectedDriver.driverDetails.rating > 0 && (
                        <p><strong>Rating:</strong> {'⭐'.repeat(Math.round(selectedDriver.driverDetails.rating))} {selectedDriver.driverDetails.rating}/5</p>
                      )}
                      {selectedDriver.driverDetails.totalTrips > 0 && (
                        <p><strong>Total Trips:</strong> {selectedDriver.driverDetails.totalTrips}</p>
                      )}
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  {(selectedDriver.driverDetails.emergencyContactName || selectedDriver.driverDetails.emergencyContactPhone) && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3">Emergency Contact</h3>
                      <div className="space-y-1 text-gray-800">
                        {selectedDriver.driverDetails.emergencyContactName && (
                          <p><strong>Name:</strong> {selectedDriver.driverDetails.emergencyContactName}</p>
                        )}
                        {selectedDriver.driverDetails.emergencyContactPhone && (
                          <p><strong>Phone:</strong> {selectedDriver.driverDetails.emergencyContactPhone}</p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={() => {
                    setShowViewDetailsModal(false);
                    setSelectedDriver(null);
                  }}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full mx-4">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                Delete Driver Confirmation
              </h3>
            </div>
            
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete <strong>{deleteConfirmation.driverName}</strong>?
              </p>
              <p className="text-sm text-gray-600">
                This will remove both the account and all driver details.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelDeleteDriver}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✕ Cancel
              </button>
              <button
                onClick={confirmDeleteDriver}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <span className="inline-block animate-spin">⟳</span>
                    Deleting...
                  </>
                ) : (
                  <>
                    🗑️ Delete Driver
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DriverManagement;
