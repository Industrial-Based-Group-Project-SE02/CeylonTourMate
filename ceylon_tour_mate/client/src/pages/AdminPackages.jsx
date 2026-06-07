import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import {
  Package, Search, Filter, ChevronLeft, ChevronRight,
  AlertCircle, CheckCircle, Loader, Eye, Calendar,
  Users, DollarSign, MapPin, Badge
} from 'lucide-react';

function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [totalPackages, setTotalPackages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modals
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: 'all'
  });

  useEffect(() => {
    setCurrentPage(1);
    fetchPackages(1);
  }, [filters]);

  useEffect(() => {
    fetchPackages(currentPage);
  }, [currentPage]);

  const fetchPackages = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        'http://localhost:5000/api/packages',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Packages Response:', response.data);
      
      let allPackages = response.data.packages || response.data || [];
      
      // Apply search filter
      if (filters.search.trim()) {
        const searchLower = filters.search.trim().toLowerCase();
        allPackages = allPackages.filter(pkg =>
          pkg.package_name?.toLowerCase().includes(searchLower) ||
          pkg.package_code?.toLowerCase().includes(searchLower) ||
          pkg.category?.toLowerCase().includes(searchLower) ||
          pkg.description?.toLowerCase().includes(searchLower)
        );
      }

      // Apply status filter
      if (filters.status !== 'all') {
        allPackages = allPackages.filter(pkg => pkg.status === filters.status);
      }

      // Set total
      setTotalPackages(allPackages.length);

      // Apply pagination
      const startIndex = (page - 1) * itemsPerPage;
      const paginatedPackages = allPackages.slice(startIndex, startIndex + itemsPerPage);
      
      setPackages(paginatedPackages);
      setError(null);
    } catch (error) {
      console.error('Error fetching packages:', error);
      const errorMsg = error.response?.data?.details || error.response?.data?.error || error.message || 'Failed to load packages';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      published: 'bg-green-100 text-green-800 border-green-200',
      draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      archived: 'bg-gray-100 text-gray-800 border-gray-200',
      suspended: 'bg-red-100 text-red-800 border-red-200'
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      published: <CheckCircle className="w-4 h-4" />,
      draft: <AlertCircle className="w-4 h-4" />,
      archived: <AlertCircle className="w-4 h-4" />,
      suspended: <AlertCircle className="w-4 h-4" />
    };
    return icons[status] || <AlertCircle className="w-4 h-4" />;
  };

  const getStatusLabel = (status) => {
    const labels = {
      published: 'Published',
      draft: 'Draft',
      archived: 'Archived',
      suspended: 'Suspended'
    };
    return labels[status] || status;
  };

  // Helper function to safely format prices
  const formatPrice = (price) => {
    if (!price && price !== 0) return '0.00';
    return (Number(price) || 0).toFixed(2);
  };

  const getCategoryBadge = (category) => {
    const badges = {
      silver: 'bg-slate-100 text-slate-800',
      gold: 'bg-yellow-100 text-yellow-800',
      platinum: 'bg-purple-100 text-purple-800',
      customized: 'bg-blue-100 text-blue-800'
    };
    return badges[category] || 'bg-gray-100 text-gray-800';
  };

  // Calculate pagination values
  const totalPages = Math.ceil(totalPackages / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalPackages);

  // Stats calculation
  const publishedCount = packages.filter(p => p.status === 'published').length;
  const draftCount = packages.filter(p => p.status === 'draft').length;

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
              <div className="p-2 bg-blue-600 rounded-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              Packages Management
            </h1>
            <p className="text-gray-600">View and manage all tour packages</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Total Packages</p>
                  <p className="text-3xl font-bold text-gray-900">{totalPackages}</p>
                </div>
                <Package className="w-12 h-12 text-blue-100" />
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Published</p>
                  <p className="text-3xl font-bold text-green-600">{publishedCount}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-100" />
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Draft</p>
                  <p className="text-3xl font-bold text-yellow-600">{draftCount}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-yellow-100" />
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Avg Price</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {packages.length > 0 
                      ? `$${Math.round(packages.reduce((sum, p) => sum + (Number(p.min_price) || 0), 0) / packages.length)}`
                      : '$0'
                    }
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-purple-100" />
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
                Search Packages
              </label>
              <input
                type="text"
                placeholder="Name, code, category..."
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
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
                <option value="suspended">Suspended</option>
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
            <p className="font-medium text-gray-600">Loading packages...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && packages.length === 0 && (
          <div className="p-16 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
            <Package className="mx-auto mb-4 w-16 h-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No Packages Found</h3>
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

        {/* Packages Table View */}
        {!loading && packages.length > 0 && (
          <>
            <div className="overflow-x-auto mb-8 bg-white rounded-xl border border-gray-100 shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">Package</th>
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">Category</th>
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">Duration</th>
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">Price Range</th>
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">Travelers</th>
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">Status</th>
                    <th className="px-6 py-4 text-sm font-semibold text-left text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="border-b border-gray-100 transition hover:bg-gray-50">
                      {/* Package Name & Code */}
                      <td className="px-6 py-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{pkg.package_name}</h4>
                          <p className="text-sm text-gray-600">{pkg.package_code}</p>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getCategoryBadge(pkg.category)}`}>
                          {pkg.category?.charAt(0).toUpperCase() + pkg.category?.slice(1)}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="px-6 py-4">
                        <div className="flex gap-2 items-center text-gray-700">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{pkg.duration_days}D/{pkg.duration_nights}N</span>
                        </div>
                      </td>

                      {/* Price Range */}
                      <td className="px-6 py-4">
                        <div className="flex gap-2 items-center text-gray-700">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium">
                            ${formatPrice(pkg.min_price)} - ${formatPrice(pkg.max_price)}
                          </span>
                        </div>
                      </td>

                      {/* Travelers */}
                      <td className="px-6 py-4">
                        <div className="flex gap-2 items-center text-gray-700">
                          <Users className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">{pkg.min_travelers}-{pkg.max_travelers}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(pkg.status)}`}>
                          {getStatusIcon(pkg.status)}
                          {getStatusLabel(pkg.status)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedPackage(pkg);
                            setShowDetailsModal(true);
                          }}
                          className="inline-flex gap-2 items-center px-3 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg transition hover:bg-blue-100"
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

            {/* Pagination Info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-700">
                Showing <span className="font-bold">{totalPackages > 0 ? startIndex : 0}-{endIndex}</span> of <span className="font-bold">{totalPackages}</span> packages
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
                        className={`px-3 py-2 font-semibold rounded-lg transition ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
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

        {/* Details Modal */}
        {showDetailsModal && selectedPackage && (
          <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
            <div className="overflow-y-auto w-full max-w-2xl max-h-96 bg-white rounded-xl shadow-xl">
              {/* Modal Header */}
              <div className="sticky top-0 p-6 text-white bg-gradient-to-r from-orange-600 to-orange-700 mp-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedPackage.package_name}</h2>
                    <p className="text-blue-100">{selectedPackage.package_code}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-2xl hover:text-blue-100"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Status & Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border mt-1 ${getStatusBadge(selectedPackage.status)}`}>
                      {getStatusIcon(selectedPackage.status)}
                      {getStatusLabel(selectedPackage.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Category</p>
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mt-1 ${getCategoryBadge(selectedPackage.category)}`}>
                      {selectedPackage.category?.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Duration & Travelers */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Duration</p>
                    <p className="mt-1 text-gray-900">{selectedPackage.duration_days} Days / {selectedPackage.duration_nights} Nights</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Travelers</p>
                    <p className="mt-1 text-gray-900">{selectedPackage.min_travelers} - {selectedPackage.max_travelers} persons</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Min Price</p>
                    <p className="mt-1 text-lg font-bold text-gray-900">${formatPrice(selectedPackage.min_price)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Max Price</p>
                    <p className="mt-1 text-lg font-bold text-gray-900">${formatPrice(selectedPackage.max_price)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Single Supplement</p>
                    <p className="mt-1 text-lg font-bold text-gray-900">${formatPrice(selectedPackage.single_supplement)}</p>
                  </div>
                </div>

                {/* Hotel & Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Hotel Stars</p>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`w-5 h-5 ${i < selectedPackage.hotel_stars ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Validity</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedPackage.valid_from).toLocaleDateString()} to {new Date(selectedPackage.valid_to).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {selectedPackage.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Description</p>
                    <p className="mt-2 text-gray-700">{selectedPackage.description}</p>
                  </div>
                )}

                {/* Inclusions */}
                {selectedPackage.inclusions && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Inclusions</p>
                    <p className="mt-2 text-gray-700">{selectedPackage.inclusions}</p>
                  </div>
                )}

                {/* Exclusions */}
                {selectedPackage.exclusions && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Exclusions</p>
                    <p className="mt-2 text-gray-700">{selectedPackage.exclusions}</p>
                  </div>
                )}

                {/* Terms & Conditions */}
                {selectedPackage.terms_conditions && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Terms & Conditions</p>
                    <p className="mt-2 text-gray-700">{selectedPackage.terms_conditions}</p>
                  </div>
                )}
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

export default AdminPackages;
