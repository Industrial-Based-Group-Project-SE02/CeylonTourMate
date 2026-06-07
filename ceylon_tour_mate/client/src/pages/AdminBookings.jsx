import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import {
  BookOpen, Search, Filter, ChevronLeft, ChevronRight,
  AlertCircle, CheckCircle, Clock, XCircle, Loader, Eye,
  Calendar, Users, DollarSign, MapPin, Phone, Mail,
  Grid3x3, List, Download, Plane, User, Home,
  MessageSquare, Banknote, FileText, Package
} from 'lucide-react';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // View mode
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  // Modals
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    averagePrice: 0
  });

  useEffect(() => {
    setCurrentPage(1);
    fetchBookings(1);
    fetchStats();
  }, [filters]);

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/bookings/stats',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setStats({
          total: response.data.data.totalBookings,
          pending: response.data.data.pendingBookings,
          confirmed: response.data.data.confirmedBookings,
          cancelled: response.data.data.cancelledBookings,
          averagePrice: response.data.data.averagePrice
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchBookings = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        page,
        limit: itemsPerPage,
        status: filters.status !== 'all' ? filters.status : '',
        search: filters.search
      });

      const response = await axios.get(
        `http://localhost:5000/api/bookings?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      let allBookings = response.data.data || [];

      // Apply date filters
      if (filters.dateFrom || filters.dateTo) {
        allBookings = allBookings.filter(booking => {
          const bookingDate = new Date(booking.arrival_date);
          const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
          const dateTo = filters.dateTo ? new Date(filters.dateTo) : null;

          if (dateFrom && bookingDate < dateFrom) return false;
          if (dateTo && bookingDate > dateTo) return false;
          return true;
        });
      }

      setTotalBookings(allBookings.length);
      
      // Apply pagination
      const startIndex = (page - 1) * itemsPerPage;
      const paginatedBookings = allBookings.slice(startIndex, startIndex + itemsPerPage);
      
      setBookings(paginatedBookings);
      setError(null);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      const errorMsg = error.response?.data?.details || error.response?.data?.error || error.message || 'Failed to load bookings';
      setError(errorMsg);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      confirmed: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />
    };
    return icons[status] || <AlertCircle className="w-4 h-4" />;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      completed: 'Completed'
    };
    return labels[status] || status;
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '0.00';
    return (Number(price) || 0).toFixed(2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Calculate pagination values
  const totalPages = Math.ceil(totalBookings / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalBookings);

  // Stats calculation
  const pendingCount = stats.pending;
  const confirmedCount = stats.confirmed;
  const cancelledCount = stats.cancelled;

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

        {/* Header Section */}
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="flex gap-3 items-center mb-2 text-4xl font-bold text-gray-900">
              <div className="p-2 bg-sky-500 rounded-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              Booking Management
            </h1>
            <p className="text-gray-600">View and manage all tour bookings</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <BookOpen className="w-12 h-12 text-sky-100" />
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <Clock className="w-12 h-12 text-yellow-100" />
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Confirmed</p>
                  <p className="text-3xl font-bold text-green-600">{confirmedCount}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-100" />
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Cancelled</p>
                  <p className="text-3xl font-bold text-red-600">{cancelledCount}</p>
                </div>
                <XCircle className="w-12 h-12 text-red-100" />
              </div>
            </div>

            {/* <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Avg Value</p>
                  <p className="text-3xl font-bold text-purple-600">
                    ${formatPrice(stats.averagePrice)}
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-purple-100" />
              </div>
            </div> */}
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
                Search Booking
              </label>
              <input
                type="text"
                placeholder="Name, email, phone..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                {/* <option value="completed">Completed</option> */}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                <Calendar className="inline mr-1 w-4 h-4" />
                From Date
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">To Date</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex gap-2 justify-end mt-4">
            <button
              onClick={() => setFilters({ search: '', status: 'all', dateFrom: '', dateTo: '' })}
              className="inline-flex gap-2 items-center px-4 py-2 font-medium text-gray-700 bg-gray-100 rounded-lg transition hover:bg-gray-200"
            >
              <Filter className="w-4 h-4" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2 justify-between items-center mb-6">
          <p className="text-gray-700">
            Showing <span className="font-bold">{totalBookings > 0 ? startIndex : 0}-{endIndex}</span> of <span className="font-bold">{totalBookings}</span> bookings
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`flex gap-2 items-center px-4 py-2 rounded-lg font-medium transition ${
                viewMode === 'table'
                  ? 'bg-sky-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <List className="w-4 h-4" />
              Table
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`flex gap-2 items-center px-4 py-2 rounded-lg font-medium transition ${
                viewMode === 'card'
                  ? 'bg-sky-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
              Card
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-16 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
            <Loader className="mx-auto mb-4 w-12 h-12 text-sky-500 animate-spin" />
            <p className="font-medium text-gray-600">Loading bookings...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && bookings.length === 0 && (
          <div className="p-16 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
            <BookOpen className="mx-auto mb-4 w-16 h-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No Bookings Found</h3>
            <p className="mb-6 text-gray-600">Try adjusting your filters</p>
            <button
              onClick={() => setFilters({ search: '', status: 'all', dateFrom: '', dateTo: '' })}
              className="inline-flex gap-2 items-center px-6 py-2 text-white bg-sky-500 rounded-lg transition hover:bg-sky-600"
            >
              <Filter className="w-4 h-4" />
              Reset Filters
            </button>
          </div>
        )}

        {/* TABLE VIEW */}
        {!loading && bookings.length > 0 && viewMode === 'table' && (
          <>
            <div className="overflow-x-auto mb-8 bg-white rounded-xl border border-gray-100 shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">Guest Name</th>
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">Package</th>
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">Arrival Date</th>
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">Price</th>
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">Persons</th>
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">Status</th>
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-100 transition hover:bg-gray-50">
                      {/* Guest Name */}
                      <td className="px-6 py-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{booking.fullname}</h4>
                          <p className="text-sm text-gray-600">{booking.email}</p>
                        </div>
                      </td>

                      {/* Package */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{booking.package_name || 'Custom'}</span>
                      </td>

                      {/* Arrival Date */}
                      <td className="px-6 py-4">
                        <div className="flex gap-2 items-center text-gray-700">
                          <Calendar className="w-4 h-4 text-sky-500" />
                          <span className="text-sm">{formatDate(booking.arrival_date)}</span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <div className="flex gap-2 items-center text-gray-700">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium">${formatPrice(booking.estimated_price)}</span>
                        </div>
                      </td>

                      {/* Pax */}
                      <td className="px-6 py-4">
                        <div className="flex gap-2 items-center text-gray-700">
                          <Users className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">{booking.pax}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          {getStatusLabel(booking.status)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowDetailsModal(true);
                          }}
                          className="inline-flex gap-2 items-center px-3 py-2 text-sm font-semibold text-sky-600 bg-sky-50 rounded-lg transition hover:bg-sky-100"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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
                        className={`px-3 py-2 font-semibold rounded-lg transition ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
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

        {/* CARD VIEW */}
        {!loading && bookings.length > 0 && viewMode === 'card' && (
          <>
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="overflow-hidden bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-lg hover:border-sky-200"
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start p-6 bg-gradient-to-r from-sky-50 to-blue-100 border-b border-gray-100">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{booking.fullname}</h3>
                      <p className="text-sm text-gray-600">{booking.email}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Package */}
                    <div className="flex gap-3 items-start">
                      <Package className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-600 uppercase">Package</p>
                        <p className="text-sm font-semibold text-gray-900">{booking.package_name || 'Custom Package'}</p>
                      </div>
                    </div>

                    {/* Arrival Date & Time */}
                    <div className="flex gap-3 items-start">
                      <Calendar className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-600 uppercase">Arrival Date</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatDate(booking.arrival_date)} at {booking.arrival_time || 'TBD'}
                        </p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex gap-3 items-start">
                      <Phone className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-600 uppercase">Contact</p>
                        <p className="text-sm font-semibold text-gray-900">{booking.phone}</p>
                      </div>
                    </div>

                    {/* Pax */}
                    <div className="flex gap-3 items-start">
                      <Users className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-600 uppercase">Passengers</p>
                        <p className="text-sm font-semibold text-gray-900">{booking.pax} Person(s)</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex gap-3 items-start">
                      <DollarSign className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-600 uppercase">Estimated Price</p>
                        <p className="text-sm font-semibold text-gray-900">${formatPrice(booking.estimated_price)}</p>
                      </div>
                    </div>

                    {/* Vehicle Type */}
                    {booking.vehicle_type && (
                      <div className="flex gap-3 items-start">
                        <Home className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-600 uppercase">Vehicle</p>
                          <p className="text-sm font-semibold text-gray-900">{booking.vehicle_type} ({booking.vehicle_model})</p>
                        </div>
                      </div>
                    )}

                    {/* Pickup Location */}
                    {booking.pickup_location && (
                      <div className="flex gap-3 items-start">
                        <MapPin className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-600 uppercase">Pickup Location</p>
                          <p className="text-sm font-semibold text-gray-900">{booking.pickup_location}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="flex gap-2 p-6 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowDetailsModal(true);
                      }}
                      className="flex flex-1 gap-2 justify-center items-center px-4 py-2 text-sm font-semibold text-sky-600 bg-sky-50 rounded-lg transition hover:bg-sky-100"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination for Card View */}
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
                        className={`px-3 py-2 font-semibold rounded-lg transition ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
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

        {/* DETAILS MODAL */}
        {showDetailsModal && selectedBooking && (
          <div className="flex overflow-y-auto fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
            <div className="my-8 w-full max-w-4xl bg-white rounded-xl shadow-xl">
              {/* Modal Header */}
              <div className="sticky top-0 p-6 text-white bg-gradient-to-r from-sky-600 to-sky-700">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedBooking.fullname}</h2>
                    <p className="text-sky-100">Booking ID: {selectedBooking.id}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-2xl transition hover:text-sky-100"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="max-h-[70vh] overflow-y-auto p-8 space-y-8">
                {/* Status & Package Info */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border mt-2 ${getStatusBadge(selectedBooking.status)}`}>
                      {getStatusIcon(selectedBooking.status)}
                      {getStatusLabel(selectedBooking.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Package</p>
                    <p className="mt-2 font-semibold text-gray-900">{selectedBooking.package_name || 'Custom Package'}</p>
                  </div>
                </div>

                {/* Guest Information */}
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="flex gap-2 items-center mb-4 text-lg font-bold text-gray-900">
                    <User className="w-5 h-5 text-sky-600" />
                    Guest Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Full Name</p>
                      <p className="mt-1 text-gray-900">{selectedBooking.fullname}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="mt-1 text-gray-900">{selectedBooking.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Phone</p>
                      <p className="mt-1 text-gray-900">{selectedBooking.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Passport Number</p>
                      <p className="mt-1 text-gray-900">{selectedBooking.passport_number || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Travel Details */}
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="flex gap-2 items-center mb-4 text-lg font-bold text-gray-900">
                    <Plane className="w-5 h-5 text-sky-600" />
                    Travel Details
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Flight Number</p>
                      <p className="mt-1 text-gray-900">{selectedBooking.flight_number || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Arrival Date</p>
                      <p className="mt-1 text-gray-900">{formatDate(selectedBooking.arrival_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Arrival Time</p>
                      <p className="mt-1 text-gray-900">{selectedBooking.arrival_time || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Travel Days</p>
                      <p className="mt-1 text-gray-900">{selectedBooking.travel_days} days</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Number of Passengers</p>
                      <p className="mt-1 text-gray-900">{selectedBooking.pax} person(s)</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pickup Location</p>
                      <p className="mt-1 text-gray-900">{selectedBooking.pickup_location || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                {(selectedBooking.vehicle_type || selectedBooking.vehicle_model) && (
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="flex gap-2 items-center mb-4 text-lg font-bold text-gray-900">
                      <Home className="w-5 h-5 text-sky-600" />
                      Vehicle Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Vehicle Type</p>
                        <p className="mt-1 text-gray-900">{selectedBooking.vehicle_type || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Vehicle Model</p>
                        <p className="mt-1 text-gray-900">{selectedBooking.vehicle_model || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Languages & Destinations */}
                {(selectedBooking.languages || selectedBooking.destinations) && (
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="flex gap-2 items-center mb-4 text-lg font-bold text-gray-900">
                      <MapPin className="w-5 h-5 text-sky-600" />
                      Preferences
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {selectedBooking.languages && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Languages</p>
                          <p className="mt-1 text-gray-900">{selectedBooking.languages}</p>
                        </div>
                      )}
                      {selectedBooking.destinations && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Destinations</p>
                          <p className="mt-1 text-gray-900">{selectedBooking.destinations}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Pricing Information */}
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="flex gap-2 items-center mb-4 text-lg font-bold text-gray-900">
                    <Banknote className="w-5 h-5 text-sky-600" />
                    Pricing Information
                  </h3>
                  <div className="p-4 bg-sky-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Estimated Price</p>
                    <p className="mt-2 text-3xl font-bold text-sky-600">${formatPrice(selectedBooking.estimated_price)}</p>
                  </div>
                </div>

                {/* Special Notes */}
                {selectedBooking.notes && (
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="flex gap-2 items-center mb-4 text-lg font-bold text-gray-900">
                    <MessageSquare className="w-5 h-5 text-sky-600" />
                      Special Notes
                    </h3>
                    <p className="p-4 text-gray-700 bg-gray-50 rounded-lg">{selectedBooking.notes}</p>
                  </div>
                )}

                {/* Custom Components */}
                {selectedBooking.custom_components && (
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="flex gap-2 items-center mb-4 text-lg font-bold text-gray-900">
                    <FileText className="w-5 h-5 text-sky-600" />
                      Custom Components
                    </h3>
                    <p className="p-4 text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg">{selectedBooking.custom_components}</p>
                  </div>
                )}

                {/* Payment Slip */}
                {selectedBooking.payment_slip_path && (
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="flex gap-2 items-center mb-4 text-lg font-bold text-gray-900">
                    <Download className="w-5 h-5 text-sky-600" />
                    Payment Slip
                  </h3>
                  <a
                    href={selectedBooking.payment_slip_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex gap-2 items-center px-4 py-2 text-sky-600 bg-sky-50 rounded-lg transition hover:bg-sky-100"
                    >
                      <Download className="w-4 h-4" />
                      Download Payment Slip
                    </a>
                  </div>
                )}

                {/* Dates */}
                <div className="pt-6 text-xs text-gray-600 border-t border-gray-100">
                  <p>Created: {new Date(selectedBooking.created_at).toLocaleString()}</p>
                  {selectedBooking.updated_at && (
                    <p>Last Updated: {new Date(selectedBooking.updated_at).toLocaleString()}</p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 p-6 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 font-medium text-gray-700 bg-gray-100 rounded-lg transition hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AdminBookings;
