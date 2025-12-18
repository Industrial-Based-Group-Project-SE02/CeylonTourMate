import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    availability: 'all',
    province: 'all',
    vehicleType: 'all'
  });

  const PROVINCES = [
    'all', 'Western', 'Central', 'Southern', 'Northern', 'Eastern',
    'North Western', 'North Central', 'Uva', 'Sabaragamuwa'
  ];

  const VEHICLE_TYPES = [
    'all', 'Car', 'Van', 'SUV', 'Luxury Car', 'Mini Bus', 'Bus'
  ];

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/drivers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      alert('Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (driver) => {
    setSelectedDriver(driver);
    setShowDetailsModal(true);
  };

  const handleUpdateAvailability = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/drivers/${userId}/availability`,
        { availabilityStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDrivers();
      alert('Availability updated successfully!');
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Failed to update availability');
    }
  };

  const getProfileImageUrl = (picturePath) => {
    if (!picturePath) return null;
    return `http://localhost:5000${picturePath}`;
  };

  const getAvailabilityBadge = (status) => {
    const badges = {
      available: 'bg-green-100 text-green-800',
      busy: 'bg-yellow-100 text-yellow-800',
      on_leave: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getAvailabilityIcon = (status) => {
    const icons = {
      available: 'fa-check-circle',
      busy: 'fa-clock',
      on_leave: 'fa-times-circle'
    };
    return icons[status] || 'fa-question-circle';
  };

  // Filter drivers
  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      driver.firstName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      driver.lastName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      driver.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
      driver.driverDetails?.licenseNumber?.toLowerCase().includes(filters.search.toLowerCase()) ||
      driver.driverDetails?.vehicleNumber?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesAvailability = 
      filters.availability === 'all' || 
      driver.driverDetails?.availabilityStatus === filters.availability;

    const matchesProvince = 
      filters.province === 'all' || 
      driver.driverDetails?.province === filters.province;

    const matchesVehicle = 
      filters.vehicleType === 'all' || 
      driver.driverDetails?.vehicleType === filters.vehicleType;

    return matchesSearch && matchesAvailability && matchesProvince && matchesVehicle;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <i className="text-4xl text-orange-500 fas fa-spinner fa-spin"></i>
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
            <h1 className="text-3xl font-bold text-gray-800">
              <i className="mr-3 fas fa-car"></i>
              Driver Management
            </h1>
            <p className="mt-1 text-gray-600">View and manage all registered drivers</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="p-6 text-white bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-blue-100">Total Drivers</p>
                <p className="mt-2 text-3xl font-bold">{drivers.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/20">
                <i className="text-2xl fas fa-users"></i>
              </div>
            </div>
          </div>

          <div className="p-6 text-white bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-green-100">Available</p>
                <p className="mt-2 text-3xl font-bold">
                  {drivers.filter(d => d.driverDetails?.availabilityStatus === 'available').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/20">
                <i className="text-2xl fas fa-check-circle"></i>
              </div>
            </div>
          </div>

          <div className="p-6 text-white bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-yellow-100">Busy</p>
                <p className="mt-2 text-3xl font-bold">
                  {drivers.filter(d => d.driverDetails?.availabilityStatus === 'busy').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/20">
                <i className="text-2xl fas fa-clock"></i>
              </div>
            </div>
          </div>

          <div className="p-6 text-white bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-red-100">On Leave</p>
                <p className="mt-2 text-3xl font-bold">
                  {drivers.filter(d => d.driverDetails?.availabilityStatus === 'on_leave').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/20">
                <i className="text-2xl fas fa-times-circle"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h2 className="mb-4 text-lg font-bold text-gray-800">
            <i className="mr-2 fas fa-filter"></i>
            Filters & Search
          </h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Search */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                <i className="mr-2 fas fa-search"></i>
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Name, email, license..."
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                <i className="mr-2 fas fa-user-check"></i>
                Availability
              </label>
              <select
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>

            {/* Province Filter */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                <i className="mr-2 fas fa-map-marker-alt"></i>
                Province
              </label>
              <select
                value={filters.province}
                onChange={(e) => setFilters({ ...filters, province: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {PROVINCES.map(province => (
                  <option key={province} value={province}>
                    {province === 'all' ? 'All Provinces' : province}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Type Filter */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                <i className="mr-2 fas fa-car"></i>
                Vehicle Type
              </label>
              <select
                value={filters.vehicleType}
                onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {VEHICLE_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Vehicles' : type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.search || filters.availability !== 'all' || filters.province !== 'all' || filters.vehicleType !== 'all') && (
            <div className="flex flex-wrap gap-2 items-center pt-4 mt-4 border-t">
              <span className="text-sm font-semibold text-gray-600">Active Filters:</span>
              {filters.search && (
                <span className="px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
                  Search: "{filters.search}"
                </span>
              )}
              {filters.availability !== 'all' && (
                <span className="px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                  {filters.availability}
                </span>
              )}
              {filters.province !== 'all' && (
                <span className="px-3 py-1 text-sm font-semibold text-purple-800 bg-purple-100 rounded-full">
                  {filters.province}
                </span>
              )}
              {filters.vehicleType !== 'all' && (
                <span className="px-3 py-1 text-sm font-semibold text-orange-800 bg-orange-100 rounded-full">
                  {filters.vehicleType}
                </span>
              )}
              <button
                onClick={() => setFilters({ search: '', availability: 'all', province: 'all', vehicleType: 'all' })}
                className="px-3 py-1 text-sm font-semibold text-red-600 bg-red-50 rounded-full transition hover:bg-red-100"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-bold text-gray-800">{filteredDrivers.length}</span> of{' '}
            <span className="font-bold text-gray-800">{drivers.length}</span> drivers
          </p>
        </div>

        {/* Drivers Grid */}
        {filteredDrivers.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-xl shadow">
            <i className="mb-4 text-6xl text-gray-300 fas fa-car"></i>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">No Drivers Found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDrivers.map((driver) => (
              <div key={driver.userId} className="p-6 bg-white rounded-xl shadow-lg transition hover:shadow-xl">
                {/* Driver Header */}
                <div className="flex gap-4 items-start mb-4">
                  {driver.profilePicture ? (
                    <img
                      src={getProfileImageUrl(driver.profilePicture)}
                      alt={`${driver.firstName} ${driver.lastName}`}
                      className="object-cover w-16 h-16 rounded-full border-2 border-orange-500"
                    />
                  ) : (
                    <div className="flex justify-center items-center w-16 h-16 text-xl font-bold text-white bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full">
                      {driver.firstName?.[0]}{driver.lastName?.[0]}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">
                      {driver.firstName} {driver.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{driver.email}</p>
                    {driver.phone && (
                      <p className="text-sm text-gray-600">
                        <i className="mr-1 fas fa-phone"></i>
                        {driver.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full ${getAvailabilityBadge(driver.driverDetails?.availabilityStatus)}`}>
                    <i className={`fas ${getAvailabilityIcon(driver.driverDetails?.availabilityStatus)}`}></i>
                    {driver.driverDetails?.availabilityStatus?.replace('_', ' ').toUpperCase() || 'N/A'}
                  </span>
                  {!driver.isActive && (
                    <span className="inline-flex gap-2 items-center px-3 py-1 ml-2 text-sm font-semibold text-red-800 bg-red-100 rounded-full">
                      <i className="fas fa-ban"></i>
                      Inactive
                    </span>
                  )}
                </div>

                {/* Driver Details */}
                {driver.driverDetails ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">License:</span>
                      <span className="font-semibold text-gray-800">{driver.driverDetails.licenseNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-semibold text-gray-800">{driver.driverDetails.yearsOfExperience} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-semibold text-yellow-600">
                        <i className="mr-1 fas fa-star"></i>
                        {driver.driverDetails.rating.toFixed(1)} ({driver.driverDetails.totalTrips} trips)
                      </span>
                    </div>
                    {driver.driverDetails.vehicleType && (
                      <div className="pt-2 mt-2 border-t">
                        <div className="flex gap-2 items-center">
                          <i className="text-orange-500 fas fa-car"></i>
                          <span className="font-semibold text-gray-800">
                            {driver.driverDetails.vehicleType}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-600">
                          {driver.driverDetails.vehicleModel} • {driver.driverDetails.vehicleNumber}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-4 text-center text-gray-500">
                    <i className="mb-2 text-2xl fas fa-exclamation-circle"></i>
                    <p className="text-sm">No driver details available</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 mt-4 border-t">
                  <button
                    onClick={() => handleViewDetails(driver)}
                    className="flex-1 px-4 py-2 text-sm font-semibold text-orange-600 bg-orange-50 rounded-lg transition hover:bg-orange-100"
                  >
                    <i className="mr-2 fas fa-eye"></i>
                    View Details
                  </button>
                  
                  {driver.driverDetails && (
                    <div className="relative group">
                      <button className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg transition hover:bg-blue-100">
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      <div className="hidden absolute right-0 z-10 mt-2 w-48 bg-white rounded-lg shadow-lg group-hover:block">
                        <button
                          onClick={() => handleUpdateAvailability(driver.userId, 'available')}
                          className="block px-4 py-2 w-full text-sm text-left text-green-600 hover:bg-gray-50"
                        >
                          <i className="mr-2 fas fa-check-circle"></i>
                          Set Available
                        </button>
                        <button
                          onClick={() => handleUpdateAvailability(driver.userId, 'busy')}
                          className="block px-4 py-2 w-full text-sm text-left text-yellow-600 hover:bg-gray-50"
                        >
                          <i className="mr-2 fas fa-clock"></i>
                          Set Busy
                        </button>
                        <button
                          onClick={() => handleUpdateAvailability(driver.userId, 'on_leave')}
                          className="block px-4 py-2 w-full text-sm text-left text-red-600 hover:bg-gray-50"
                        >
                          <i className="mr-2 fas fa-times-circle"></i>
                          Set On Leave
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedDriver && (
          <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 z-10 px-8 py-6 bg-gradient-to-r from-orange-500 to-yellow-500">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Driver Details</h2>
                    <p className="text-orange-100">{selectedDriver.firstName} {selectedDriver.lastName}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 text-white rounded-lg transition hover:bg-white/20"
                  >
                    <i className="text-2xl fas fa-times"></i>
                  </button>
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="mb-4 text-lg font-bold text-gray-800">
                    <i className="mr-2 fas fa-user"></i>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Email</label>
                      <p className="font-semibold text-gray-800">{selectedDriver.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Phone</label>
                      <p className="font-semibold text-gray-800">{selectedDriver.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {selectedDriver.driverDetails && (
                  <>
                    {/* Driver Information */}
                    <div className="pt-6 border-t">
                      <h3 className="mb-4 text-lg font-bold text-gray-800">
                        <i className="mr-2 fas fa-id-card"></i>
                        Driver Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">License Number</label>
                          <p className="font-semibold text-gray-800">{selectedDriver.driverDetails.licenseNumber}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Experience</label>
                          <p className="font-semibold text-gray-800">{selectedDriver.driverDetails.yearsOfExperience} years</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Languages</label>
                          <p className="font-semibold text-gray-800">
                            {selectedDriver.driverDetails.languages?.join(', ') || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Rating</label>
                          <p className="font-semibold text-yellow-600">
                            <i className="mr-1 fas fa-star"></i>
                            {selectedDriver.driverDetails.rating.toFixed(1)} ({selectedDriver.driverDetails.totalTrips} trips)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="pt-6 border-t">
                      <h3 className="mb-4 text-lg font-bold text-gray-800">
                        <i className="mr-2 fas fa-map-marker-alt"></i>
                        Location
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Address</label>
                          <p className="font-semibold text-gray-800">{selectedDriver.driverDetails.address || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">City</label>
                          <p className="font-semibold text-gray-800">{selectedDriver.driverDetails.city || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">District</label>
                          <p className="font-semibold text-gray-800">{selectedDriver.driverDetails.district || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Province</label>
                          <p className="font-semibold text-gray-800">{selectedDriver.driverDetails.province || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Information */}
                    <div className="pt-6 border-t">
                      <h3 className="mb-4 text-lg font-bold text-gray-800">
                        <i className="mr-2 fas fa-car"></i>
                        Vehicle Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Type</label>
                          <p className="font-semibold text-gray-800">{selectedDriver.driverDetails.vehicleType || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Number</label>
                          <p className="font-semibold text-gray-800">{selectedDriver.driverDetails.vehicleNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Model</label>
                          <p className="font-semibold text-gray-800">{selectedDriver.driverDetails.vehicleModel || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Year & Color</label>
                          <p className="font-semibold text-gray-800">
                            {selectedDriver.driverDetails.vehicleYear || 'N/A'} • {selectedDriver.driverDetails.vehicleColor || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="pt-6 border-t">
                      <h3 className="mb-4 text-lg font-bold text-gray-800">
                        <i className="mr-2 fas fa-phone-alt"></i>
                        Emergency Contact
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Name</label>
                          <p className="font-semibold text-gray-800">{selectedDriver.driverDetails.emergencyContactName || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Phone</label>
                          <p className="font-semibold text-gray-800">{selectedDriver.driverDetails.emergencyContactPhone || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    {selectedDriver.driverDetails.otherSkills && selectedDriver.driverDetails.otherSkills.length > 0 && (
                      <div className="pt-6 border-t">
                        <h3 className="mb-4 text-lg font-bold text-gray-800">
                          <i className="mr-2 fas fa-star"></i>
                          Additional Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedDriver.driverDetails.otherSkills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Drivers;