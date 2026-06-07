import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import {
  Car, Search, Filter, ChevronLeft, ChevronRight, MapPin, Phone, Mail,
  Star, AlertCircle, CheckCircle, Loader, Eye, Clock, MapPinOff, User,
  Award, Briefcase, Calendar, Navigation, Grid3x3, List, Trash2
} from 'lucide-react';

function AdminDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // View Mode
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modals
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTarget, setStatusTarget] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    availability: 'all',
    province: 'all',
    vehicleType: 'all'
  });

  const PROVINCES = [
    'Western', 'Central', 'Southern', 'Northern', 'Eastern',
    'North Western', 'North Central', 'Uva', 'Sabaragamuwa'
  ];

  const VEHICLE_TYPES = [
    'Car', 'Van', 'SUV', 'Luxury Car', 'Mini Bus', 'Bus'
  ];

  useEffect(() => {
    setCurrentPage(1);
    fetchDrivers(1);
  }, [filters]);

  useEffect(() => {
    fetchDrivers(currentPage);
  }, [currentPage]);

  const fetchDrivers = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      params.append('page', page);
      params.append('limit', itemsPerPage);
      
      if (filters.search.trim()) params.append('search', filters.search.trim());
      if (filters.availability !== 'all') params.append('availability', filters.availability);
      if (filters.province !== 'all') params.append('province', filters.province);
      if (filters.vehicleType !== 'all') params.append('vehicleType', filters.vehicleType);

      const response = await axios.get(
        `http://localhost:5000/api/drivers?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDrivers(response.data.drivers || response.data);
      setTotalDrivers(response.data.total || response.data.length);
      setError(null);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setError('Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAvailability = async () => {
    if (!statusTarget || !newStatus) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/drivers/${statusTarget.id}/availability`,
        { availabilityStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Driver availability updated successfully!');
      setShowStatusModal(false);
      setStatusTarget(null);
      setNewStatus('');
      fetchDrivers(currentPage);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating availability:', error);
      setError('Failed to update availability');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteDriver = async () => {
    if (!deleteTarget) return;
    
    try {
      setDeleting(true);
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/drivers/${deleteTarget.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Driver deleted successfully!');
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchDrivers(currentPage);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error deleting driver:', error);
      setError('Failed to delete driver');
      setTimeout(() => setError(null), 3000);
    } finally {
      setDeleting(false);
    }
  };

  const getProfileImageUrl = (picturePath) => {
    if (!picturePath) return null;
    return picturePath.startsWith('http')
      ? picturePath
      : `http://localhost:5000${picturePath}`;
  };

  const getAvailabilityBadge = (status) => {
    const badges = {
      available: 'bg-green-100 text-green-800 border-green-200',
      busy: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      on_leave: 'bg-red-100 text-red-800 border-red-200'
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getAvailabilityIcon = (status) => {
    const icons = {
      available: <CheckCircle className="w-4 h-4" />,
      busy: <Clock className="w-4 h-4" />,
      on_leave: <MapPinOff className="w-4 h-4" />
    };
    return icons[status] || <AlertCircle className="w-4 h-4" />;
  };

  const getAvailabilityLabel = (status) => {
    const labels = {
      available: 'Available',
      busy: 'Busy',
      on_leave: 'On Leave'
    };
    return labels[status] || status;
  };

  // Calculate pagination values
  const totalPages = Math.ceil(totalDrivers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalDrivers);

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
                <Car className="w-8 h-8 text-white" />
              </div>
              Driver Management
            </h1>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Manage and monitor all drivers</p>
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Total Drivers</p>
                  <p className="text-3xl font-bold text-gray-900">{totalDrivers}</p>
                </div>
                <Car className="w-12 h-12 text-blue-100" />
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Available</p>
                  <p className="text-3xl font-bold text-green-600">
                    {drivers.filter(d => d.driverDetails?.availabilityStatus === 'available').length}
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-100" />
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Busy</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {drivers.filter(d => d.driverDetails?.availabilityStatus === 'busy').length}
                  </p>
                </div>
                <Clock className="w-12 h-12 text-yellow-100" />
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1 text-sm text-gray-600">On Leave</p>
                  <p className="text-3xl font-bold text-red-600">
                    {drivers.filter(d => d.driverDetails?.availabilityStatus === 'on_leave').length}
                  </p>
                </div>
                <MapPinOff className="w-12 h-12 text-red-100" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="p-6 mb-8 bg-white rounded-xl border border-gray-100 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Filters & Search</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {/* Search */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                <Search className="inline mr-1 w-4 h-4" />
                Search Drivers
              </label>
              <input
                type="text"
                placeholder="Name, email, license..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Availability</label>
              <select
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>

            {/* Province Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Province</label>
              <select
                value={filters.province}
                onChange={(e) => setFilters({ ...filters, province: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Provinces</option>
                {PROVINCES.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>

            {/* Vehicle Type Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Vehicle Type</label>
              <select
                value={filters.vehicleType}
                onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Vehicles</option>
                {VEHICLE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ search: '', availability: 'all', province: 'all', vehicleType: 'all' })}
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
            <p className="font-medium text-gray-600">Loading drivers...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && drivers.length === 0 && (
          <div className="p-16 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
            <Car className="mx-auto mb-4 w-16 h-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No Drivers Found</h3>
            <p className="mb-6 text-gray-600">Try adjusting your filters</p>
            <button
              onClick={() => setFilters({ search: '', availability: 'all', province: 'all', vehicleType: 'all' })}
              className="inline-flex gap-2 items-center px-6 py-2 text-white bg-orange-600 rounded-lg transition hover:bg-orange-700"
            >
              <Filter className="w-4 h-4" />
              Reset Filters
            </button>
          </div>
        )}

        {/* Drivers Grid View */}
        {!loading && drivers.length > 0 && viewMode === 'grid' && (
          <>
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
              {drivers.map((driver) => (
                <div key={driver.id} className="overflow-hidden bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-lg">
                  {/* Header with Avatar */}
                  <div className="p-6 text-black bg-gradient-to-r from-white to-white">
                    <div className="flex gap-4 items-center justify-between mb-3">
                      <div className="flex gap-4 items-center flex-1">
                        {driver.profilePicture ? (
                          <img
                            src={getProfileImageUrl(driver.profilePicture)}
                            alt={`${driver.firstName} ${driver.lastName}`}
                            className="object-cover w-16 h-16 rounded-full border-4 border-white"
                          />
                        ) : (
                          <div className="flex justify-center items-center w-16 h-16 bg-white bg-opacity-20 rounded-full border-4 border-white">
                            <User className="w-8 h-8 text-black" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold">{driver.firstName} {driver.lastName}</h3>
                          <p className="text-xs text-gray-500">User ID: {driver.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 font-semibold">Driver ID</p>
                        <p className="text-sm font-bold text-blue-600">{driver.driverDetails?.id || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Status Badge */}
                    <div className="flex justify-between items-center">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getAvailabilityBadge(driver.driverDetails?.availabilityStatus)}`}>
                        {getAvailabilityIcon(driver.driverDetails?.availabilityStatus)}
                        {getAvailabilityLabel(driver.driverDetails?.availabilityStatus)}
                      </span>
                      {driver.driverDetails?.rating && (
                        <div className="flex gap-1 items-center text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-semibold">{driver.driverDetails.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="py-3 space-y-2 border-t border-b border-gray-200">
                      <div className="flex gap-2 items-center text-sm text-gray-700">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <a href={`mailto:${driver.email}`} className="truncate hover:text-blue-600">
                          {driver.email}
                        </a>
                      </div>
                      {driver.phone && (
                        <div className="flex gap-2 items-center text-sm text-gray-700">
                          <Phone className="w-4 h-4 text-green-500" />
                          <a href={`tel:${driver.phone}`} className="hover:text-green-600">
                            {driver.phone}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Driver Details */}
                    <div className="space-y-2 text-sm">
                      {driver.driverDetails?.licenseNumber && (
                        <div className="flex gap-2 items-center text-gray-700">
                          <Award className="w-4 h-4 text-indigo-500" />
                          <span>License: <span className="font-semibold">{driver.driverDetails.licenseNumber}</span></span>
                        </div>
                      )}
                      {driver.driverDetails?.vehicleModel && (
                        <div className="flex gap-2 items-center text-gray-700">
                          <Car className="w-4 h-4 text-purple-500" />
                          <span>{driver.driverDetails.vehicleType} - {driver.driverDetails.vehicleModel}</span>
                        </div>
                      )}
                      {driver.driverDetails?.yearsOfExperience && (
                        <div className="flex gap-2 items-center text-gray-700">
                          <Briefcase className="w-4 h-4 text-orange-500" />
                          <span>{driver.driverDetails.yearsOfExperience} years experience</span>
                        </div>
                      )}
                      {driver.driverDetails?.languages && (
                        <div className="flex gap-2 items-center text-gray-700">
                          <Navigation className="w-4 h-4 text-red-500" />
                          <span>{driver.driverDetails.languages}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <button
                        onClick={() => {
                          setSelectedDriver(driver);
                          setShowDetailsModal(true);
                        }}
                        className="flex flex-1 gap-2 justify-center items-center px-3 py-2 font-semibold text-blue-600 bg-blue-50 rounded-lg transition hover:bg-blue-100"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          setStatusTarget(driver);
                          setNewStatus(driver.driverDetails?.availabilityStatus || 'available');
                          setShowStatusModal(true);
                        }}
                        className="flex flex-1 gap-2 justify-center items-center px-3 py-2 font-semibold text-indigo-600 bg-indigo-50 rounded-lg transition hover:bg-indigo-100"
                      >
                        <Navigation className="w-4 h-4" />
                        Update Status
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget(driver);
                          setShowDeleteModal(true);
                        }}
                        className="flex flex-1 gap-2 justify-center items-center px-3 py-2 font-semibold text-red-600 bg-red-50 rounded-lg transition hover:bg-red-100"
                        title="Delete Driver"
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
                Showing <span className="font-bold">{totalDrivers > 0 ? startIndex : 0}-{endIndex}</span> of <span className="font-bold">{totalDrivers}</span> drivers
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

        {/* Drivers Table View */}
        {!loading && drivers.length > 0 && viewMode === 'table' && (
          <>
            <div className="overflow-hidden mb-8 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-black bg-gradient-to-r from-white to-white">
                      <th className="px-6 py-4 font-semibold text-left">Driver</th>
                      <th className="px-6 py-4 font-semibold text-left">Driver ID</th>
                      <th className="px-6 py-4 font-semibold text-left">Contact</th>
                      <th className="px-6 py-4 font-semibold text-left">License</th>
                      <th className="px-6 py-4 font-semibold text-left">Vehicle</th>
                      <th className="px-6 py-4 font-semibold text-left">Experience</th>
                      <th className="px-6 py-4 font-semibold text-center">Rating</th>
                      <th className="px-6 py-4 font-semibold text-center">Status</th>
                      <th className="px-6 py-4 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {drivers.map((driver, index) => (
                      <tr key={driver.id} className={`transition hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4">
                          <div className="flex gap-3 items-center">
                            {driver.profilePicture ? (
                              <img
                                src={getProfileImageUrl(driver.profilePicture)}
                                alt={`${driver.firstName} ${driver.lastName}`}
                                className="object-cover w-10 h-10 rounded-full"
                              />
                            ) : (
                              <div className="flex justify-center items-center w-10 h-10 bg-blue-100 rounded-full">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900">{driver.firstName} {driver.lastName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{driver.id}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <a href={`mailto:${driver.email}`} className="text-sm text-blue-600 hover:underline">
                              {driver.email}
                            </a>
                            {driver.phone && (
                              <a href={`tel:${driver.phone}`} className="block text-sm text-gray-600 hover:text-gray-900">
                                {driver.phone}
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-900">{driver.driverDetails?.licenseNumber || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-gray-900">{driver.driverDetails?.vehicleType || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{driver.driverDetails?.vehicleModel || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{driver.driverDetails?.yearsOfExperience || 'N/A'} years</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {driver.driverDetails?.rating ? (
                            <div className="flex gap-1 justify-center items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="font-semibold">{driver.driverDetails.rating}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getAvailabilityBadge(driver.driverDetails?.availabilityStatus)}`}>
                            {getAvailabilityIcon(driver.driverDetails?.availabilityStatus)}
                            {getAvailabilityLabel(driver.driverDetails?.availabilityStatus)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => {
                                setSelectedDriver(driver);
                                setShowDetailsModal(true);
                              }}
                              className="p-2 text-blue-600 bg-blue-50 rounded-lg transition hover:bg-blue-100"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setStatusTarget(driver);
                                setNewStatus(driver.driverDetails?.availabilityStatus || 'available');
                                setShowStatusModal(true);
                              }}
                              className="p-2 text-indigo-600 bg-indigo-50 rounded-lg transition hover:bg-indigo-100"
                              title="Update Status"
                            >
                              <Navigation className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteTarget(driver);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 text-red-600 bg-red-50 rounded-lg transition hover:bg-red-100"
                              title="Delete Driver"
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
                Showing <span className="font-bold">{totalDrivers > 0 ? startIndex : 0}-{endIndex}</span> of <span className="font-bold">{totalDrivers}</span> drivers
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
        )}        {/* Details Modal */}
        {showDetailsModal && selectedDriver && (
          <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 px-8 py-6 bg-gradient-to-r from-orange-600 to-orange-700 border-b border-blue-800">
                <h2 className="text-2xl font-bold text-white">Driver Details</h2>
                <p className="mt-1 text-sm text-blue-100">{selectedDriver.firstName} {selectedDriver.lastName}</p>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-600">First Name</h3>
                    <p className="text-lg text-gray-900">{selectedDriver.firstName}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-600">Last Name</h3>
                    <p className="text-lg text-gray-900">{selectedDriver.lastName}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-600">Email</h3>
                    <p className="text-lg text-gray-900 break-all">{selectedDriver.email}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-600">Phone</h3>
                    <p className="text-lg text-gray-900">{selectedDriver.phone || 'N/A'}</p>
                  </div>
                </div>

                {selectedDriver.driverDetails && (
                  <>
                    <div className="py-6 mb-6 border-t border-b border-gray-200">
                      <h3 className="mb-4 text-lg font-bold text-gray-900">Driver Details</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="mb-1 text-sm text-gray-600">License Number</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedDriver.driverDetails.licenseNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm text-gray-600">Years of Experience</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedDriver.driverDetails.yearsOfExperience || 'N/A'} years</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm text-gray-600">Languages</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedDriver.driverDetails.languages || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm text-gray-600">Rating</p>
                          <div className="flex gap-1 items-center">
                            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <p className="text-lg font-semibold text-gray-900">{selectedDriver.driverDetails.rating || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="py-6 border-t border-b border-gray-200">
                      <h3 className="mb-4 text-lg font-bold text-gray-900">Vehicle Information</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="mb-1 text-sm text-gray-600">Vehicle Type</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedDriver.driverDetails.vehicleType || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm text-gray-600">Vehicle Model</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedDriver.driverDetails.vehicleModel || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm text-gray-600">Vehicle Number</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedDriver.driverDetails.vehicleNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm text-gray-600">Vehicle Color</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedDriver.driverDetails.vehicleColor || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm text-gray-600">Vehicle Year</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedDriver.driverDetails.vehicleYear || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-6">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-6 py-3 w-full font-semibold text-gray-800 bg-gray-100 rounded-lg transition hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && statusTarget && (
          <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
              <div className="p-8">
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Update Availability Status</h2>
                <p className="mb-6 text-gray-600">
                  Change availability for <strong>{statusTarget.firstName} {statusTarget.lastName}</strong>
                </p>

                <div className="mb-6 space-y-3">
                  {['available', 'busy', 'on_leave'].map(status => (
                    <button
                      key={status}
                      onClick={() => setNewStatus(status)}
                      className={`w-full p-3 rounded-lg border-2 text-left font-semibold transition ${
                        newStatus === status
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {getAvailabilityLabel(status)}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleUpdateAvailability}
                    className="flex-1 px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg transition hover:bg-blue-700"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setShowStatusModal(false);
                      setStatusTarget(null);
                      setNewStatus('');
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && deleteTarget && (
          <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
              <div className="p-8">
                <div className="flex justify-center items-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-center text-gray-900">Delete Driver?</h2>
                <p className="mb-6 text-center text-gray-600">
                  Are you sure you want to delete <strong>{deleteTarget.firstName} {deleteTarget.lastName}</strong>? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteDriver}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 font-semibold text-white bg-red-600 rounded-lg transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 justify-center items-center"
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

export default AdminDrivers;
