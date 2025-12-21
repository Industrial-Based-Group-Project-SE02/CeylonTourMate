import { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { 
  FaStar, 
  FaSearch, 
  FaTrash, 
  FaFilter,
  FaChartLine,
  FaSmile,
  FaMeh,
  FaFrown,
  FaCalendar,
  FaUser
} from 'react-icons/fa';

const FEEDBACK_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'Excellent_Service', label: 'Excellent Service' },
  { value: 'Guide_Performance', label: 'Guide Performance' },
  { value: 'Accommodation_Quality', label: 'Accommodation Quality' },
  { value: 'Transport_Experience', label: 'Transport Experience' },
  { value: 'Booking_Process', label: 'Booking Process' },
  { value: 'General_Complaint', label: 'General Complaint' }
];

function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    rating: 'all',
    feedbackType: 'all',
    startDate: '',
    endDate: '',
    sortBy: 'created_at',
    sortOrder: 'DESC'
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchFeedbacks();
  }, [filters, currentPage]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.rating !== 'all') params.append('rating', filters.rating);
      if (filters.feedbackType !== 'all') params.append('feedbackType', filters.feedbackType);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('sortBy', filters.sortBy);
      params.append('sortOrder', filters.sortOrder);
      params.append('page', currentPage);
      params.append('limit', 10);

      const response = await axios.get(
        `http://localhost:5000/api/feedback?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFeedbacks(response.data.feedbacks);
      setTotalPages(response.data.pagination.totalPages);
      setTotalCount(response.data.pagination.totalCount);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/feedback/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFeedbacks();
      fetchStats();
      alert('Feedback deleted successfully');
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Failed to delete feedback');
    }
  };

  const getRatingIcon = (rating) => {
    if (rating <= 2) return <FaFrown className="text-red-500" />;
    if (rating === 3) return <FaMeh className="text-yellow-500" />;
    return <FaSmile className="text-green-500" />;
  };

  const getRatingColor = (rating) => {
    if (rating <= 2) return 'bg-red-100 text-red-800';
    if (rating === 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      rating: 'all',
      feedbackType: 'all',
      startDate: '',
      endDate: '',
      sortBy: 'created_at',
      sortOrder: 'DESC'
    });
    setCurrentPage(1);
  };

  if (loading && !feedbacks.length) {
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
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            <i className="mr-3 fas fa-comments"></i>
            Customer Feedbacks
          </h1>
          <p className="mt-1 text-gray-600">View and manage customer tour feedback</p>
        </div>

        {/* Statistics Cards */}
        {!statsLoading && stats && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="p-6 text-black bg-gradient-to-br rounded-xl shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-black">Total Feedbacks</p>
                  <p className="mt-2 text-3xl font-bold">{stats.overall.total_feedbacks}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/20">
                  <i className="text-2xl fas fa-comments"></i>
                </div>
              </div>
            </div>

            <div className="p-6 text-black bg-gradient-to-br rounded-xl shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-black">Average Rating</p>
                  <p className="mt-2 text-3xl font-bold">{stats.overall.average_rating || 0} / 5</p>
                </div>
                <div className="p-3 rounded-lg bg-white/20">
                  <FaStar className="text-2xl" />
                </div>
              </div>
            </div>

            <div className="p-6 text-black bg-gradient-to-br rounded-xl shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-black">Positive (4-5★)</p>
                  <p className="mt-2 text-3xl font-bold">{stats.overall.positive_feedbacks}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/20">
                  <FaSmile className="text-2xl" />
                </div>
              </div>
            </div>

            <div className="p-6 text-black bg-gradient-to-br rounded-xl shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-black">Negative (1-2★)</p>
                  <p className="mt-2 text-3xl font-bold">{stats.overall.negative_feedbacks}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/20">
                  <FaFrown className="text-2xl" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h2 className="mb-4 text-lg font-bold text-gray-800">
            <FaFilter className="inline mr-2" />
            Filters & Search
          </h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                <FaSearch className="inline mr-2" />
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search by name or feedback..."
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                <FaStar className="inline mr-2" />
                Rating
              </label>
              <select
                value={filters.rating}
                onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            {/* Feedback Type */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Feedback Type
              </label>
              <select
                value={filters.feedbackType}
                onChange={(e) => setFilters({ ...filters, feedbackType: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {FEEDBACK_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="created_at">Date</option>
                <option value="rating">Rating</option>
                <option value="tour_id">Tour ID</option>
              </select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                <FaCalendar className="inline mr-2" />
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex gap-2 items-end">
              <button
                onClick={fetchFeedbacks}
                className="flex-1 px-6 py-2 font-semibold text-white bg-orange-500 rounded-lg transition hover:bg-orange-600"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg transition hover:bg-gray-300"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-bold text-gray-800">{feedbacks.length}</span> of{' '}
            <span className="font-bold text-gray-800">{totalCount}</span> feedbacks
          </p>
        </div>

        {/* Feedbacks List */}
        <div className="space-y-4">
          {feedbacks.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-xl shadow">
              <i className="mb-4 text-6xl text-gray-300 fas fa-comments"></i>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">No Feedbacks Found</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          ) : (
            feedbacks.map((feedback) => (
              <div key={feedback.id} className="p-6 bg-white rounded-xl shadow-lg transition hover:shadow-xl">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex gap-3 items-start mb-3">
                      <div className="flex justify-center items-center w-12 h-12 text-lg font-bold text-white bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full">
                        {feedback.customer_name?.[0] || 'A'}
                      </div>
                      <div className="flex-1">
                        <div className="flex gap-3 items-center">
                          <h3 className="text-lg font-bold text-gray-800">
                            {feedback.customer_name || 'Anonymous'}
                          </h3>
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${getRatingColor(feedback.rating)}`}>
                            {feedback.rating} <FaStar className="inline ml-1" size={10} />
                          </span>
                        </div>
                        <div className="flex gap-4 items-center mt-1 text-sm text-gray-500">
                          <span>
                            <i className="mr-1 fas fa-hashtag"></i>
                            Tour #{feedback.tour_id}
                          </span>
                          <span>
                            <FaCalendar className="inline mr-1" />
                            {new Date(feedback.created_at).toLocaleDateString()}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded">
                            {feedback.feedback_type.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex gap-1 items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                      <span className="flex gap-1 items-center ml-2">
                        {getRatingIcon(feedback.rating)}
                      </span>
                    </div>

                    {/* Feedback Text */}
                    <p className="leading-relaxed text-gray-700">
                      {feedback.feedback_text}
                    </p>
                  </div>

                  {/* Actions */}
                  {/* <button
                    onClick={() => handleDelete(feedback.id)}
                    className="p-2 text-red-600 rounded-lg transition hover:bg-red-50"
                    title="Delete feedback"
                  >
                    <FaTrash />
                  </button> */}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex gap-2 justify-center items-center">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 font-semibold text-gray-700 bg-white rounded-lg border border-gray-300 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 font-semibold rounded-lg transition ${
                  currentPage === i + 1
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 font-semibold text-gray-700 bg-white rounded-lg border border-gray-300 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Feedbacks;