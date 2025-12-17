import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

function Drivers() {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  
  // Selected driver
  const [selectedDriver, setSelectedDriver] = useState(null);
  
  // Form data
  const [userFormData, setUserFormData] = useState({
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

  // Input fields for dynamic arrays
  const [newLanguage, setNewLanguage] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const provinces = [
    'Western', 'Central', 'Southern', 'Northern', 'Eastern',
    'North Western', 'North Central', 'Uva', 'Sabaragamuwa'
  ];

  const vehicleTypes = [
    'Car', 'Van', 'SUV', 'Bus', 'Mini Bus', 'Luxury Car', 'Coaster'
  ];

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/drivers');
      setDrivers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load drivers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create user account (Step 1)
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users', {
        ...userFormData,
        role: 'driver'
      });
      
      alert('Driver account created successfully! Now add driver details.');
      setShowUserModal(false);
      setUserFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: ''
      });
      fetchDrivers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create driver account');
    }
  };

  // Add driver details (Step 2)
  const handleAddDetails = (driver) => {
    setSelectedDriver(driver);
    setShowDetailsModal(true);
  };

  const handleSubmitDetails = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5000/api/drivers/${selectedDriver.userId}/details`,
        detailsFormData
      );
      
      alert('Driver details added successfully!');
      setShowDetailsModal(false);
      setSelectedDriver(null);
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
      fetchDrivers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add driver details');
    }
  };

  // View driver details
  const handleViewDriver = (driver) => {
    setSelectedDriver(driver);
    setShowViewModal(true);
  };

  // Edit driver details
  const handleEditDriver = (driver) => {
    setSelectedDriver(driver);
    setDetailsFormData({
      licenseNumber: driver.driverDetails?.licenseNumber || '',
      address: driver.driverDetails?.address || '',
      city: driver.driverDetails?.city || '',
      district: driver.driverDetails?.district || '',
      province: driver.driverDetails?.province || '',
      languages: driver.driverDetails?.languages || ['English'],
      otherSkills: driver.driverDetails?.otherSkills || [],
      yearsOfExperience: driver.driverDetails?.yearsOfExperience || 0,
      vehicleType: driver.driverDetails?.vehicleType || '',
      vehicleNumber: driver.driverDetails?.vehicleNumber || '',
      vehicleModel: driver.driverDetails?.vehicleModel || '',
      vehicleYear: driver.driverDetails?.vehicleYear || new Date().getFullYear(),
      vehicleColor: driver.driverDetails?.vehicleColor || '',
      availabilityStatus: driver.driverDetails?.availabilityStatus || 'available',
      emergencyContactName: driver.driverDetails?.emergencyContactName || '',
      emergencyContactPhone: driver.driverDetails?.emergencyContactPhone || ''
    });
    setShowDetailsModal(true);
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/drivers/${selectedDriver.userId}/details`,
        detailsFormData
      );
      
      alert('Driver details updated successfully!');
      setShowDetailsModal(false);
      setSelectedDriver(null);
      fetchDrivers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update driver details');
    }
  };

  // Toggle availability
  const handleToggleAvailability = async (driver) => {
    const newStatus = driver.driverDetails?.availabilityStatus === 'available' ? 'busy' : 'available';
    try {
      await axios.patch(
        `http://localhost:5000/api/drivers/${driver.userId}/availability`,
        { availabilityStatus: newStatus }
      );
      fetchDrivers();
    } catch (err) {
      alert('Failed to update availability');
    }
  };

  // Delete driver
  const handleDeleteDriver = async (userId) => {
    if (window.confirm('Are you sure you want to delete this driver? This will remove both the account and all driver details.')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`);
        fetchDrivers();
      } catch (err) {
        alert('Failed to delete driver');
      }
    }
  };

  // Language management
  const handleAddLanguage = () => {
    if (newLanguage && !detailsFormData.languages.includes(newLanguage)) {
      setDetailsFormData({
        ...detailsFormData,
        languages: [...detailsFormData.languages, newLanguage]
      });
      setNewLanguage('');
    }
  };

  const handleRemoveLanguage = (lang) => {
    if (lang === 'English') {
      alert('English is mandatory and cannot be removed');
      return;
    }
    setDetailsFormData({
      ...detailsFormData,
      languages: detailsFormData.languages.filter(l => l !== lang)
    });
  };

  // Skills management
  const handleAddSkill = () => {
    if (newSkill && !detailsFormData.otherSkills.includes(newSkill)) {
      setDetailsFormData({
        ...detailsFormData,
        otherSkills: [...detailsFormData.otherSkills, newSkill]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setDetailsFormData({
      ...detailsFormData,
      otherSkills: detailsFormData.otherSkills.filter(s => s !== skill)
    });
  };

  const getAvailabilityBadge = (status) => {
    const badges = {
      available: 'bg-green-100 text-green-800',
      busy: 'bg-red-100 text-red-800',
      on_leave: 'bg-yellow-100 text-yellow-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getProfileImageUrl = (picturePath) => {
    if (!picturePath) return null;
    return `http://localhost:5000${picturePath}`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <i className="text-4xl text-blue-500 fas fa-spinner fa-spin"></i>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Driver Management</h1>
            <p className="text-gray-600">Manage driver accounts and details</p>
          </div>
          <button
            onClick={() => setShowUserModal(true)}
            className="flex gap-2 items-center px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-lg transition hover:bg-blue-700"
          >
            <i className="fas fa-user-plus"></i>
            Create Driver Account
          </button>
        </div>

        {error && (
          <div className="p-4 text-red-700 bg-red-100 rounded-lg border border-red-300">
            {error}
          </div>
        )}

        
      </div>

      {/* Create User Account Modal */}
      {showUserModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600">
              <h2 className="text-2xl font-bold text-white">Create Driver Account (Step 1/2)</h2>
              <p className="text-blue-100">Create user account first, then add driver details</p>
            </div>
            
            <form onSubmit={handleCreateUser} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={userFormData.firstName}
                    onChange={(e) => setUserFormData({ ...userFormData, firstName: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={userFormData.lastName}
                    onChange={(e) => setUserFormData({ ...userFormData, lastName: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Email *</label>
                <input
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={userFormData.phone}
                  onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+94771234567"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Password *</label>
                <input
                  type="password"
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
                <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg transition hover:bg-blue-700"
                >
                  <i className="mr-2 fas fa-user-plus"></i>
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUserModal(false);
                    setUserFormData({ email: '', password: '', firstName: '', lastName: '', phone: '' });
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

      {/* Add/Edit Driver Details Modal */}
      {showDetailsModal && selectedDriver && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600">
              <h2 className="text-2xl font-bold text-white">
                {selectedDriver.driverDetails ? 'Edit Driver Details' : 'Add Driver Details (Step 2/2)'}
              </h2>
              <p className="text-blue-100">
                {selectedDriver.firstName} {selectedDriver.lastName} - {selectedDriver.email}
              </p>
            </div>
            
            <form onSubmit={selectedDriver.driverDetails ? handleUpdateDetails : handleSubmitDetails} className="p-8 space-y-6">
              {/* License Information */}
              <div>
                <h3 className="mb-4 text-lg font-bold text-gray-800">License Information</h3>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    License Number *
                  </label>
                  <input
                    type="text"
                    value={detailsFormData.licenseNumber}
                    onChange={(e) => setDetailsFormData({ ...detailsFormData, licenseNumber: e.target.value })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Location Information */}
              <div>
                <h3 className="mb-4 text-lg font-bold text-gray-800">Location Information</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Address</label>
                    <textarea
                      value={detailsFormData.address}
                      onChange={(e) => setDetailsFormData({ ...detailsFormData, address: e.target.value })}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">City</label>
                    <input
                      type="text"
                      value={detailsFormData.city}
                      onChange={(e) => setDetailsFormData({ ...detailsFormData, city: e.target.value })}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">District</label>
                    <input
                      type="text"
                      value={detailsFormData.district}
                      onChange={(e) => setDetailsFormData({ ...detailsFormData, district: e.target.value })}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Province</label>
                    <select
                      value={detailsFormData.province}
                      onChange={(e) => setDetailsFormData({ ...detailsFormData, province: e.target.value })}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Province</option>
                      {provinces.map(prov => (
                        <option key={prov} value={prov}>{prov}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div>
                <h3 className="mb-4 text-lg font-bold text-gray-800">Languages (English is mandatory)</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {detailsFormData.languages.map(lang => (
                    <span key={lang} className="flex gap-2 items-center px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
                      {lang}
                      {lang !== 'English' && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLanguage(lang)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Add language (e.g., Sinhala, Tamil, German)"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLanguage())}
                  />
                  <button
                    type="button"
                    onClick={handleAddLanguage}
                    className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg transition hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Other Skills */}
              <div>
                <h3 className="mb-4 text-lg font-bold text-gray-800">Other Skills</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {detailsFormData.otherSkills.map(skill => (
                    <span key={skill} className="flex gap-2 items-center px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add skill (e.g., First Aid, Tour Guide, Photography)"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 font-semibold text-white bg-green-600 rounded-lg transition hover:bg-green-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="mb-4 text-lg font-bold text-gray-800">Professional Information</h3>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Years of Experience</label>
                  <input
                    type="number"
                    value={detailsFormData.yearsOfExperience}
                    onChange={(e) => setDetailsFormData({ ...detailsFormData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>

              {/* Vehicle Information */}
              <div>
                <h3 className="mb-4 text-lg font-bold text-gray-800">Vehicle Information</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Vehicle Type</label>
                    <select
                      value={detailsFormData.vehicleType}
                      onChange={(e) => setDetailsFormData({ ...detailsFormData, vehicleType: e.target.value })}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Vehicle Type</option>
                      {vehicleTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Vehicle Number</label>
                    <input
                      type="text"
                      value={detailsFormData.vehicleNumber}
                      onChange={(e) => setDetailsFormData({ ...detailsFormData, vehicleNumber: e.target.value.toUpperCase() })}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ABC-1234"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Vehicle Model</label>
                    <input
                      type="text"
                      value={detailsFormData.vehicleModel}
                      onChange={(e) => setDetailsFormData({ ...detailsFormData, vehicleModel: e.target.value })}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Toyota HiAce"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Vehicle Year</label>
                    <input
                      type="number"
                      value={detailsFormData.vehicleYear}
                      onChange={(e) => setDetailsFormData({ ...detailsFormData, vehicleYear: parseInt(e.target.value) })}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1990"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Vehicle Color</label>
                    <input
                      type="text"
                      value={detailsFormData.vehicleColor}
                      onChange={(e) => setDetailsFormData({ ...detailsFormData, vehicleColor: e.target.value })}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="White"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Availability Status</label>
                    <select
                      value={detailsFormData.availabilityStatus}
                      onChange={(e) => setDetailsFormData({ ...detailsFormData, availabilityStatus: e.target.value })}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="available">Available</option>
                      <option value="busy">Busy</option>
                      <option value="on_leave">On Leave</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="mb-4 text-lg font-bold text-gray-800">Emergency Contact</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Emergency Contact Name</label>
                    <input
                      type="text"
                      value={detailsFormData.emergencyContactName}
                      onChange={(e) => setDetailsFormData({ ...detailsFormData, emergencyContactName: e.target.value })}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Emergency Contact Phone</label>
                    <input
                      type="tel"
                      value={detailsFormData.emergencyContactPhone}
                      onChange={(e) => setDetailsFormData({ ...detailsFormData, emergencyContactPhone: e.target.value })}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg transition hover:bg-blue-700"
                >
                  <i className="mr-2 fas fa-save"></i>
                  {selectedDriver.driverDetails ? 'Update Details' : 'Save Details'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedDriver(null);
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

      {/* View Driver Modal */}
      {showViewModal && selectedDriver && selectedDriver.driverDetails && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="flex gap-6 items-center">
                {selectedDriver.profilePicture ? (
                  <img
                    src={getProfileImageUrl(selectedDriver.profilePicture)}
                    alt={`${selectedDriver.firstName} ${selectedDriver.lastName}`}
                    className="object-cover w-24 h-24 rounded-full border-4 border-white"
                  />
                ) : (
                  <div className="flex justify-center items-center w-24 h-24 text-3xl font-bold text-purple-600 bg-white rounded-full border-4 border-white">
                    {selectedDriver.firstName?.[0]}{selectedDriver.lastName?.[0]}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedDriver.firstName} {selectedDriver.lastName}
                  </h2>
                  <p className="text-blue-100">{selectedDriver.email}</p>
                  <p className="text-blue-100">{selectedDriver.phone}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* License & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="mb-1 text-sm text-gray-600">License Number</p>
                  <p className="text-lg font-bold text-gray-800">{selectedDriver.driverDetails.licenseNumber}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="mb-1 text-sm text-gray-600">Availability Status</p>
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getAvailabilityBadge(selectedDriver.driverDetails.availabilityStatus)}`}>
                    {selectedDriver.driverDetails.availabilityStatus.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="mb-3 text-lg font-bold text-gray-800">Location</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-800">{selectedDriver.driverDetails.address}</p>
                  <p className="text-gray-600">
                    {selectedDriver.driverDetails.city}, {selectedDriver.driverDetails.district}, {selectedDriver.driverDetails.province}
                  </p>
                </div>
              </div>

              {/* Languages */}
              <div>
                <h3 className="mb-3 text-lg font-bold text-gray-800">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDriver.driverDetails.languages.map(lang => (
                    <span key={lang} className="px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills */}
              {selectedDriver.driverDetails.otherSkills.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-bold text-gray-800">Other Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDriver.driverDetails.otherSkills.map(skill => (
                      <span key={skill} className="px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience & Performance */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 text-center bg-purple-50 rounded-lg">
                  <p className="mb-1 text-sm text-gray-600">Experience</p>
                  <p className="text-2xl font-bold text-purple-600">{selectedDriver.driverDetails.yearsOfExperience} Years</p>
                </div>
                <div className="p-4 text-center bg-yellow-50 rounded-lg">
                  <p className="mb-1 text-sm text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    <i className="mr-1 fas fa-star"></i>
                    {selectedDriver.driverDetails.rating.toFixed(1)}
                  </p>
                </div>
                <div className="p-4 text-center bg-green-50 rounded-lg">
                  <p className="mb-1 text-sm text-gray-600">Total Trips</p>
                  <p className="text-2xl font-bold text-green-600">{selectedDriver.driverDetails.totalTrips}</p>
                </div>
              </div>

              {/* Vehicle Information */}
              <div>
                <h3 className="mb-3 text-lg font-bold text-gray-800">Vehicle Information</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-semibold text-gray-800">{selectedDriver.driverDetails.vehicleType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Number</p>
                      <p className="font-semibold text-gray-800">{selectedDriver.driverDetails.vehicleNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Model</p>
                      <p className="font-semibold text-gray-800">{selectedDriver.driverDetails.vehicleModel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Year & Color</p>
                      <p className="font-semibold text-gray-800">{selectedDriver.driverDetails.vehicleYear} • {selectedDriver.driverDetails.vehicleColor}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              {selectedDriver.driverDetails.emergencyContactName && (
                <div>
                  <h3 className="mb-3 text-lg font-bold text-gray-800">Emergency Contact</h3>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="font-semibold text-gray-800">{selectedDriver.driverDetails.emergencyContactName}</p>
                    <p className="text-gray-600">{selectedDriver.driverDetails.emergencyContactPhone}</p>
                  </div>
                </div>
              )}

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
    </DashboardLayout>
  );
}

export default Drivers;