import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function Dashboard() {
  const { user, token } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for tourist dashboard
  const [notifications, setNotifications] = useState([]);
  
  // State for hotel agent dashboard
  const [hotelRooms, setHotelRooms] = useState([
    { id: 1, type: 'Deluxe Double', total: 15, occupied: 12, price: 12000, maxGuests: 2 },
    { id: 2, type: 'Standard Single', total: 15, occupied: 8, price: 8000, maxGuests: 1 },
    { id: 3, type: 'Standard Double', total: 10, occupied: 6, price: 10000, maxGuests: 2 },
    { id: 4, type: 'Suite', total: 5, occupied: 2, price: 18000, maxGuests: 4 }
  ]);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [newRoom, setNewRoom] = useState({
    type: '',
    total: '',
    price: '',
    maxGuests: ''
  });

  const [bookingStats] = useState({
    pending: 2,
    approved: 5,
    completed: 8
  });

  // Show success message
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Handle adding new room type
  const handleAddRoom = async () => {
    if (!newRoom.type || !newRoom.total || !newRoom.price || !newRoom.maxGuests) {
      alert('Please fill all fields');
      return;
    }

    try {
      // TODO: Replace with actual API call
      // const response = await axios.post(`${API_BASE_URL}/api/hotel/rooms`, newRoom, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      const room = {
        id: hotelRooms.length + 1,
        type: newRoom.type,
        total: parseInt(newRoom.total),
        occupied: 0,
        price: parseInt(newRoom.price),
        maxGuests: parseInt(newRoom.maxGuests)
      };

      setHotelRooms([...hotelRooms, room]);
      setNewRoom({ type: '', total: '', price: '', maxGuests: '' });
      setShowAddRoom(false);
      showSuccess(`✓ Room type "${newRoom.type}" added successfully!`);
    } catch (err) {
      console.error('Error adding room:', err);
      alert('Failed to add room');
    }
  };

  // Handle deleting room type
  const handleDeleteRoom = (roomId) => {
    if (window.confirm('Are you sure you want to delete this room type?')) {
      const room = hotelRooms.find(r => r.id === roomId);
      setHotelRooms(hotelRooms.filter(r => r.id !== roomId));
      showSuccess(`✓ Room type "${room.type}" deleted successfully!`);
    }
  };


  // Handle dismissing a notification - send to backend and update local state
  const dismissNotification = async (notificationId) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/api/notifications/${notificationId}/dismiss`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Remove from local state
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('Failed to dismiss notification:', err);
      // Still remove from UI even if request fails
      setNotifications(notifications.filter(n => n.id !== notificationId));
    }
  };

  // Fetch notifications for tourist
  useEffect(() => {
    const fetchNotifications = async () => {
      if (user?.id && user?.role === 'tourist') {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/notifications/${user.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (response.data.success) {
            // Transform backend notification format to frontend format
            const formattedNotifications = response.data.data.map(notif => ({
              id: notif.id,
              type: 'approved',
              message: notif.message,
              timestamp: new Date(notif.created_at).toLocaleString(),
              bookingId: notif.booking_id
            }));
            setNotifications(formattedNotifications);
          }
        } catch (err) {
          console.error('Failed to fetch notifications:', err);
        }
      }
    };

    fetchNotifications();
  }, [user?.id, user?.role, token]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/dashboard/full`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setDashboardData(response.data.data);
          setError(null);
        }
      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err.response?.data?.error || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch admin dashboard data if user is admin or manager
    if (token && user && (user?.role === 'admin' || user?.role === 'manager')) {
      fetchDashboardData();
    } else if (token && user) {
      // For non-admin users, no need to fetch admin data
      setLoading(false);
    }
  }, [token, user?.role]);

  const renderAdminDashboard = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-6 bg-red-100 rounded-lg border border-red-400">
          <p className="text-red-700">{error}</p>
        </div>
      );
    }

    const stats = dashboardData?.stats || {};
    const users = stats.users || {};
    const bookings = stats.bookings || {};
    const advertisements = stats.advertisements || {};
    const drivers = stats.drivers || {};
    const hotelAgents = stats.hotelAgents || {};

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Users */}
          <div className="p-6 text-white bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-orange-100">Total Users</p>
                <h3 className="mt-2 text-3xl font-bold">
                  {(users.tourist || 0) + (users.driver || 0) + (users.hotel_agent || 0)}
                </h3>
                <p className="mt-2 text-sm font-bold text-orange-100">Tourists: {users.tourist || 0}</p>
              </div>
              <i className="text-4xl text-orange-200 fas fa-users"></i>
            </div>
          </div>

          {/* Total Drivers */}
          <div className="p-6 text-white bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-amber-100">Total Drivers</p>
                <h3 className="mt-2 text-3xl font-bold">{drivers.total || 0}</h3>
                <p className="mt-2 text-sm font-bold text-amber-100">Rating: {drivers.avgRating?.toFixed(1) || 0}</p>
              </div>
              <i className="text-4xl text-amber-300 fas fa-id-card"></i>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="p-6 text-white bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-yellow-100">Total Bookings</p>
                <h3 className="mt-2 text-3xl font-bold">
                  {Object.values(bookings).reduce((a, b) => a + b, 0)}
                </h3>
                <p className="mt-2 text-sm font-bold text-yellow-100">Confirmed: {bookings.confirmed || 0}</p>
              </div>
              <i className="text-4xl text-yellow-200 fas fa-calendar-check"></i>
            </div>
          </div>

          {/* Active Advertisements */}
          <div className="p-6 text-white bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-orange-100">Advertisements</p>
                <h3 className="mt-2 text-3xl font-bold">{advertisements.active || 0}</h3>
                <p className="mt-2 text-sm font-bold text-orange-100">Total Views: {advertisements.totalViews || 0}</p>
              </div>
              <i className="text-4xl text-orange-300 fas fa-bullhorn"></i>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Bookings by Status */}
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Bookings by Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { status: 'Pending', count: bookings.pending || 0 },
                { status: 'Confirmed', count: bookings.confirmed || 0 },
                // { status: 'Completed', count: bookings.completed || 0 },
                { status: 'Cancelled', count: bookings.cancelled || 0 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* User Distribution */}
          <div className="p-6 bg-white rounded-xl shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">User Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Tourists', value: users.tourist || 0, color: '#3B82F6' },
                    { name: 'Drivers', value: users.driver || 0, color: '#8B5CF6' },
                    { name: 'Hotel Agents', value: users.hotel_agent || 0, color: '#EC4899' },
                    { name: 'Managers', value: users.manager || 0, color: '#F59E0B' }
                  ]}
                  cx="50%" cy="50%" labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80} fill="#8884d8" dataKey="value"
                >
                  <Cell fill="#3B82F6" />
                  <Cell fill="#8B5CF6" />
                  <Cell fill="#EC4899" />
                  <Cell fill="#F59E0B" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-700 uppercase">Name</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-700 uppercase">Email</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-700 uppercase">Package</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-700 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dashboardData?.recentBookings?.map(booking => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{booking.fullname}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.package_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users */}
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Recent Users</h2>
          <div className="space-y-3">
            {dashboardData?.recentUsers?.map(user => (
              <div key={user.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">{user.first_name} {user.last_name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <span className="px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderManagerDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manager Dashboard 🎯</h1>
          <p className="mt-2 text-gray-600">Welcome, {user?.firstName}! Manage operations and approvals</p>
        </div>
        <div className="text-5xl">📊</div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Pending Approvals */}
        <div className="p-6 text-gray-800 bg-gradient-to-br from-white to-white rounded-xl shadow-lg transition hover:shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-gray-800">PENDING APPROVALS</p>
              <h3 className="mt-2 text-3xl font-bold">12</h3>
              <p className="mt-2 text-xs text-gray-800">Require action</p>
            </div>
            <i className="text-4xl text-orange-100 fas fa-clipboard-list"></i>
          </div>
        </div>

        {/* Active Bookings */}
        <div className="p-6 text-gray-800 bg-gradient-to-br from-white to-white rounded-xl shadow-lg transition hover:shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-gray-800">ACTIVE BOOKINGS</p>
              <h3 className="mt-2 text-3xl font-bold">34</h3>
              <p className="mt-2 text-xs text-gray-800">In progress</p>
            </div>
            <i className="text-4xl text-orange-100 fas fa-calendar-check"></i>
          </div>
        </div>

        {/* Available Drivers */}
        <div className="p-6 text-gray-800 bg-gradient-to-br from-white to-white rounded-xl shadow-lg transition hover:shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-gray-800">AVAILABLE DRIVERS</p>
              <h3 className="mt-2 text-3xl font-bold">18</h3>
              <p className="mt-2 text-xs text-gray-800">Ready to dispatch</p>
            </div>
            <i className="text-4xl text-amber-100 fas fa-car"></i>
          </div>
        </div>

        {/* Daily Revenue */}
        <div className="p-6 text-gray-800 bg-gradient-to-br from-white to-white rounded-xl shadow-lg transition hover:shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-gray-800">TODAY'S REVENUE</p>
              <h3 className="mt-2 text-2xl font-bold">LKR 145.2K</h3>
              <p className="mt-2 text-xs text-gray-800">↑ 12% vs yesterday</p>
            </div>
            <i className="text-4xl text-amber-100 fas fa-money-bill-wave"></i>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Booking Status Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { name: 'Pending', value: 12, fill: '#FCD34D' },
            { name: 'Approved', value: 28, fill: '#10B981' },
            { name: 'Completed', value: 45, fill: '#3B82F6' },
            { name: 'Cancelled', value: 5, fill: '#EF4444' }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pending Approvals Table */}
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-800">⏳ Pending Approvals</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-700 uppercase">Customer</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-700 uppercase">Package</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-700 uppercase">Amount</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-700 uppercase">Date</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-700 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { id: 1, customer: 'John Silva', package: 'Mountain Adventure 5-Day', amount: 'USD 4500', date: '2026-02-09', status: 'pending' },
                { id: 2, customer: 'Sarah Ahmed', package: 'Beach Escape 3-Day', amount: 'USD 3200', date: '2026-02-08', status: 'pending' },
                { id: 3, customer: 'Emma Johnson', package: 'Cultural Tour 4-Day', amount: 'USD 3800', date: '2026-02-08', status: 'pending' },
                { id: 4, customer: 'Michael Chen', package: 'Wildlife Safari 2-Day', amount: 'USD 2800', date: '2026-02-07', status: 'pending' }
              ].map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{booking.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.package}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{booking.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-xs font-semibold text-white bg-green-500 rounded-lg transition hover:bg-green-600">
                        ✓ Approve
                      </button>
                      <button className="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-lg transition hover:bg-red-600">
                        ✕ Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-800">📋 Recent Activity Log</h2>
        <div className="space-y-3">
          {[
            { action: 'Booking approved', details: 'John Silva - Mountain Adventure', time: '2 hours ago', type: 'success' },
            { action: 'Driver assigned', details: 'Kumara - Beach Escape tour', time: '3 hours ago', type: 'info' },
            { action: 'Payment received', details: 'LKR 45,000 from Sarah Ahmed', time: '4 hours ago', type: 'success' },
            { action: 'Support ticket created', details: 'Missing documentation', time: '5 hours ago', type: 'warning' }
          ].map((log, idx) => (
            <div key={idx} className={`flex items-center gap-4 p-3 rounded-lg border-l-4 ${
              log.type === 'success' ? 'bg-green-50 border-green-500' :
              log.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
              'bg-blue-50 border-blue-500'
            }`}>
              <span className={`text-xl ${
                log.type === 'success' ? '✓' :
                log.type === 'warning' ? '⚠️' :
                'ℹ️'
              }`}></span>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{log.action}</p>
                <p className="text-sm text-gray-600">{log.details}</p>
              </div>
              <span className="text-xs font-semibold text-gray-500">{log.time}</span>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );

  const renderTouristDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Welcome back, {user?.firstName}! 🌴</h1>
          <p className="mt-2 text-gray-600">Your Sri Lankan adventure awaits...</p>
        </div>
        <div className="text-6xl">🌟</div>
      </div>

      {/* Booking Notifications */}
      {notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl flex items-start justify-between animate-fadeIn ${
                notif.type === 'approved'
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-l-4 border-green-500'
                  : notif.type === 'rejected'
                  ? 'bg-gradient-to-r from-red-100 to-rose-100 border-l-4 border-red-500'
                  : 'bg-gradient-to-r from-blue-100 to-cyan-100 border-l-4 border-blue-500'
              }`}
            >
              <div className="flex-1">
                <p className={`font-semibold ${
                  notif.type === 'approved'
                    ? 'text-green-800'
                    : notif.type === 'rejected'
                    ? 'text-red-800'
                    : 'text-blue-800'
                }`}>
                  {notif.message}
                </p>
                <p className="mt-1 text-xs text-gray-600">{notif.timestamp}</p>
              </div>
              <button
                onClick={() => dismissNotification(notif.id)}
                className="ml-4 text-xl font-bold text-gray-400 transition hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Pending Bookings */}
        <div className="p-6 text-white bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg transition transform hover:scale-105">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-yellow-100">PENDING APPROVAL</p>
              <h3 className="mt-2 text-4xl font-bold">{bookingStats.pending}</h3>
              <p className="mt-2 text-xs text-yellow-100">Awaiting manager review</p>
            </div>
            <div className="text-5xl">⏳</div>
          </div>
        </div>

        {/* Approved Bookings */}
        <div className="p-6 text-white bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg transition transform hover:scale-105">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-green-100">APPROVED</p>
              <h3 className="mt-2 text-4xl font-bold">{bookingStats.approved}</h3>
              <p className="mt-2 text-xs text-green-100">Ready to explore!</p>
            </div>
            <div className="text-5xl">✅</div>
          </div>
        </div>

        {/* Completed Trips */}
        <div className="p-6 text-white bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl shadow-lg transition transform hover:scale-105">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-blue-100">COMPLETED</p>
              <h3 className="mt-2 text-4xl font-bold">{bookingStats.completed}</h3>
              <p className="mt-2 text-xs text-blue-100">Memories created!</p>
            </div>
            <div className="text-5xl">🏆</div>
          </div>
        </div>
      </div>

      {/* Featured Destinations */}
      <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 shadow-lg">
        <h2 className="mb-2 text-2xl font-bold text-purple-900">✨ Discover Amazing Destinations</h2>
        <p className="mb-6 text-purple-700">Explore Sri Lanka's most beautiful attractions and book your next adventure!</p>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { name: '🏔️ Sigiriya', desc: 'Ancient fortress' },
            { name: '🏖️ Mirissa', desc: 'Pristine beaches' },
            { name: '🍵 Tea Plantations', desc: 'Scenic valleys' },
            { name: '🦣 Safari', desc: 'Wildlife adventure' }
          ].map((dest, idx) => (
            <div key={idx} className="p-4 bg-white rounded-xl border-l-4 border-purple-400 shadow transition hover:shadow-lg">
              <p className="font-bold text-gray-800">{dest.name}</p>
              <p className="text-sm text-gray-600">{dest.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-indigo-900">⚡ Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <button className="p-4 text-left bg-white rounded-lg border-l-4 border-indigo-500 shadow transition hover:shadow-lg">
            <p className="font-bold text-indigo-900">📋 View My Bookings</p>
            <p className="text-sm text-gray-600">Check all your trips</p>
          </button>
          <button className="p-4 text-left bg-white rounded-lg border-l-4 border-indigo-500 shadow transition hover:shadow-lg">
            <p className="font-bold text-indigo-900">🎫 New Booking</p>
            <p className="text-sm text-gray-600">Browse packages</p>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in;
        }
      `}</style>
    </div>
  );

  const renderDriverDashboard = () => (
    <div className="space-y-8">
      <div className="p-6 bg-gradient-to-r from-amber-100 via-rose-100 to-sky-100 rounded-3xl border border-amber-200 shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-700">Driver Command Center</p>
            <h1 className="text-4xl font-bold text-gray-900">Welcome back, {user?.firstName || 'Driver'}!</h1>
            <p className="mt-2 text-gray-700">Keep the day smooth with a clear route, quick checks, and calm driving.</p>
          </div>
          <div className="flex gap-3 items-center">
            <span className="inline-flex gap-2 items-center px-4 py-2 text-sm font-semibold text-emerald-800 bg-emerald-100 rounded-full">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              On duty
            </span>
            <div className="text-4xl">🧭</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="text-white bg-gradient-to-br driver-card from-slate-900 to-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-300">TODAY'S TOURS</p>
              <h3 className="mt-3 text-4xl font-bold">2</h3>
              <p className="mt-2 text-xs text-slate-300">Next pickup in 1h 20m</p>
            </div>
            <div className="text-4xl">🛣️</div>
          </div>
        </div>

        <div className="text-white bg-gradient-to-br from-emerald-500 to-teal-600 driver-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-emerald-100">HOURS DRIVEN</p>
              <h3 className="mt-3 text-4xl font-bold">145</h3>
              <p className="mt-2 text-xs text-emerald-100">This month</p>
            </div>
            <div className="text-4xl">⏱️</div>
          </div>
        </div>

        <div className="text-white bg-gradient-to-br from-orange-400 to-amber-500 driver-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-orange-100">RATING</p>
              <h3 className="mt-3 text-4xl font-bold">4.8</h3>
              <p className="mt-2 text-xs text-orange-100">Last 20 trips</p>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
        </div>

        <div className="text-white bg-gradient-to-br from-sky-500 to-cyan-600 driver-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-sky-100">FUEL CHECK</p>
              <h3 className="mt-3 text-4xl font-bold">Full</h3>
              <p className="mt-2 text-xs text-sky-100">Last update: 20m ago</p>
            </div>
            <div className="text-4xl">⛽</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="p-6 bg-white rounded-2xl border shadow-lg border-slate-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Schedule</h2>
              <span className="text-xs font-semibold text-slate-500">Today</span>
            </div>
            <div className="mt-4 space-y-4">
              {[
                { time: '09:30 AM', route: 'Airport → Kandy', tag: 'Pickup', tone: 'bg-emerald-100 text-emerald-800' },
                { time: '01:00 PM', route: 'Kandy → Nuwara Eliya', tag: 'Transfer', tone: 'bg-sky-100 text-sky-800' },
                { time: '05:45 PM', route: 'Nuwara Eliya → Ella', tag: 'Drop', tone: 'bg-amber-100 text-amber-800' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50 md:flex-row md:items-center md:justify-between">
                  <div className="flex gap-4 items-center">
                    <div className="flex justify-center items-center w-12 h-12 text-lg bg-white rounded-xl shadow">🧭</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.route}</p>
                      <p className="text-xs text-slate-500">Report to dispatch 15 minutes before</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}>{item.tag}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 text-white bg-gradient-to-r rounded-2xl shadow-lg from-slate-900 to-slate-800">
            <h2 className="text-xl font-bold">Daily Checklist</h2>
            <div className="grid grid-cols-1 gap-3 mt-4 md:grid-cols-3">
              {['Vehicle inspection', 'Guest welcome kit', 'Route confirmed'].map((task, idx) => (
                <div key={idx} className="flex gap-3 items-center p-4 rounded-xl bg-white/10">
                  <span className="text-lg">✅</span>
                  <p className="text-sm font-semibold">{task}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white rounded-2xl border shadow-lg border-slate-100">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            <div className="mt-4 space-y-3">
              {[
                { label: 'View My Tours', icon: '🗺️' },
                { label: 'Update Availability', icon: '📆' },
                { label: 'Report Issue', icon: '🛠️' }
              ].map((action, idx) => (
                <button key={idx} className="flex justify-between items-center px-4 py-3 w-full font-semibold text-left text-gray-800 rounded-xl border transition border-slate-200 bg-slate-50 hover:shadow">
                  <span className="flex gap-3 items-center">
                    <span className="text-lg">{action.icon}</span>
                    {action.label}
                  </span>
                  <span className="text-sm text-slate-400">→</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 shadow-lg">
            <h2 className="text-xl font-bold text-amber-900">Earnings Snapshot</h2>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center p-4 bg-white rounded-xl">
                <span className="text-sm font-semibold text-gray-700">Today</span>
                <span className="text-lg font-bold text-gray-900">LKR 8,500</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white rounded-xl">
                <span className="text-sm font-semibold text-gray-700">This Week</span>
                <span className="text-lg font-bold text-gray-900">LKR 46,200</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white rounded-xl">
                <span className="text-sm font-semibold text-gray-700">This Month</span>
                <span className="text-lg font-bold text-gray-900">LKR 182,900</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .driver-card {
          border-radius: 1.5rem;
          padding: 1.5rem;
          box-shadow: 0 15px 40px rgba(15, 23, 42, 0.15);
          transform: translateY(0);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .driver-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2);
        }
      `}</style>
    </div>
  );

  const renderHotelAgentDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Hotel Management Dashboard 🏨</h1>
          <p className="mt-2 text-gray-600">Manage your hotel rooms and bookings efficiently</p>
        </div>
        <div className="text-6xl">🏨</div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Rooms */}
        <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl border border-blue-200 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-blue-900">TOTAL ROOMS</p>
              <h3 className="mt-2 text-3xl font-bold text-blue-700">45</h3>
              <p className="mt-2 text-xs text-blue-600">Available inventory</p>
            </div>
            <i className="text-4xl text-blue-300 fas fa-home"></i>
          </div>
        </div>

        {/* Occupied Rooms */}
        <div className="p-6 bg-gradient-to-br from-green-100 to-green-50 rounded-xl border border-green-200 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-green-900">OCCUPIED ROOMS</p>
              <h3 className="mt-2 text-3xl font-bold text-green-700">28</h3>
              <p className="mt-2 text-xs text-green-600">Currently booked</p>
            </div>
            <i className="text-4xl text-green-300 fas fa-door-open"></i>
          </div>
        </div>

        {/* Available Rooms */}
        <div className="p-6 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl border border-amber-200 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-amber-900">AVAILABLE ROOMS</p>
              <h3 className="mt-2 text-3xl font-bold text-amber-700">17</h3>
              <p className="mt-2 text-xs text-amber-600">Ready to book</p>
            </div>
            <i className="text-4xl text-amber-300 fas fa-check-circle"></i>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="p-6 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl border border-purple-200 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-purple-900">MONTHLY REVENUE</p>
              <h3 className="mt-2 text-2xl font-bold text-purple-700">LKR 850K</h3>
              <p className="mt-2 text-xs text-purple-600">↑ 15% vs last month</p>
            </div>
            <i className="text-4xl text-purple-300 fas fa-coins"></i>
          </div>
        </div>
      </div>

      {/* Pending Bookings */}
      <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-800">📅 Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-700 uppercase">Guest Name</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-700 uppercase">Room Type</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-700 uppercase">Check-In</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-700 uppercase">Check-Out</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-700 uppercase">Price</th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { id: 1, guest: 'John Silva', room: 'Deluxe Double', checkIn: '2026-02-10', checkOut: '2026-02-12', price: 'LKR 24,000', status: 'confirmed' },
                { id: 2, guest: 'Sarah Ahmed', room: 'Standard Single', checkIn: '2026-02-10', checkOut: '2026-02-15', price: 'LKR 50,000', status: 'confirmed' },
                { id: 3, guest: 'Emma Johnson', room: 'Suite', checkIn: '2026-02-11', checkOut: '2026-02-14', price: 'LKR 72,000', status: 'pending' },
                { id: 4, guest: 'Michael Chen', room: 'Standard Double', checkIn: '2026-02-12', checkOut: '2026-02-13', price: 'LKR 18,000', status: 'confirmed' }
              ].map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{booking.guest}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.room}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.checkIn}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.checkOut}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{booking.price}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Room Status Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Room Types */}
        <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-800">🛏️ Room Types</h2>
          <div className="space-y-3">
            {[
              { type: 'Deluxe Double', total: 15, occupied: 12, price: 'LKR 12,000/night' },
              { type: 'Standard Single', total: 15, occupied: 8, price: 'LKR 8,000/night' },
              { type: 'Standard Double', total: 10, occupied: 6, price: 'LKR 10,000/night' },
              { type: 'Suite', total: 5, occupied: 2, price: 'LKR 18,000/night' }
            ].map((room, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200 transition hover:border-blue-300">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-gray-800">{room.type}</p>
                  <span className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded">{room.occupied}/{room.total}</span>
                </div>
                <div className="overflow-hidden w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${(room.occupied / room.total) * 100}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-xs text-gray-600">{room.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-indigo-900">⚡ Quick Actions</h2>
          <div className="space-y-3">
            <button className="p-4 w-full text-left bg-white rounded-lg border border-indigo-200 shadow transition hover:shadow-lg">
              <p className="font-semibold text-indigo-900">➕ New Booking</p>
              <p className="mt-1 text-xs text-gray-600">Add a guest booking</p>
            </button>
            <button className="p-4 w-full text-left bg-white rounded-lg border border-indigo-200 shadow transition hover:shadow-lg">
              <p className="font-semibold text-indigo-900">📊 View Reports</p>
              <p className="mt-1 text-xs text-gray-600">Monthly & Yearly stats</p>
            </button>
            <button 
              onClick={() => setShowAddRoom(!showAddRoom)}
              className="p-4 w-full text-left bg-white rounded-lg border border-indigo-200 shadow transition hover:shadow-lg hover:border-indigo-400">
              <p className="font-semibold text-indigo-900">🔧 Manage Rooms</p>
              <p className="mt-1 text-xs text-gray-600">Add/Edit room details</p>
            </button>
            <button className="p-4 w-full text-left bg-white rounded-lg border border-indigo-200 shadow transition hover:shadow-lg">
              <p className="font-semibold text-indigo-900">📧 Send Messages</p>
              <p className="mt-1 text-xs text-gray-600">Contact guests</p>
            </button>
          </div>
        </div>
      </div>

      {/* Check-In/Check-Out Today */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Check-Ins Today */}
        <div className="p-6 bg-white rounded-xl border border-green-200 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-green-800">📥 Check-Ins Today</h2>
          <div className="space-y-3">
            {[
              { guest: 'John Silva', room: '302', time: '2:00 PM', contact: '+94 77 123 4567' },
              { guest: 'Elena Rodriguez', room: '405', time: '3:30 PM', contact: '+34 91 234 5678' }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-start p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.guest}</p>
                  <p className="text-sm text-gray-600">Room {item.room} • {item.time}</p>
                  <p className="mt-1 text-xs text-gray-500">{item.contact}</p>
                </div>
                <button className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-200 rounded transition hover:bg-green-300">
                  Ready ✓
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Check-Outs Today */}
        <div className="p-6 bg-white rounded-xl border border-orange-200 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-orange-800">📤 Check-Outs Today</h2>
          <div className="space-y-3">
            {[
              { guest: 'Sarah Ahmed', room: '201', time: '11:00 AM', contact: '+20 2 1234 5678' },
              { guest: 'David Brown', room: '304', time: '11:00 AM', contact: '+44 20 7946 0958' }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-start p-4 bg-orange-50 rounded-lg border border-orange-100">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.guest}</p>
                  <p className="text-sm text-gray-600">Room {item.room} • {item.time}</p>
                  <p className="mt-1 text-xs text-gray-500">{item.contact}</p>
                </div>
                <button className="px-3 py-1 text-xs font-semibold text-orange-700 bg-orange-200 rounded transition hover:bg-orange-300">
                  Notify
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hotel Details & Room Management Section */}
      {showAddRoom && (
        <div className="p-6 mt-8 bg-white rounded-xl border-2 border-indigo-200 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-indigo-900">🏨 Hotel Room Management</h2>
            <button
              onClick={() => setShowAddRoom(false)}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg transition hover:bg-gray-300"
            >
              ✕ Close
            </button>
          </div>

          {/* Success Message Toast */}
          {successMessage && (
            <div className="p-4 mb-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-l-4 border-green-500">
              <p className="font-semibold text-green-700">✅ {successMessage}</p>
            </div>
          )}

          {/* Add New Room Form */}
          <div className="p-6 mb-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
            <h3 className="mb-4 text-lg font-bold text-indigo-900">➕ Add New Room Type</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Room Type</label>
                <input
                  type="text"
                  placeholder="e.g., Deluxe, Standard, Suite"
                  value={newRoom.type}
                  onChange={(e) => setNewRoom({...newRoom, type: e.target.value})}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Total Rooms</label>
                <input
                  type="number"
                  placeholder="e.g., 10"
                  value={newRoom.total}
                  onChange={(e) => setNewRoom({...newRoom, total: parseInt(e.target.value) || 0})}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="1"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Price Per Night (₨)</label>
                <input
                  type="number"
                  placeholder="e.g., 5000"
                  value={newRoom.price}
                  onChange={(e) => setNewRoom({...newRoom, price: parseFloat(e.target.value) || 0})}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                  step="100"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Max Guests</label>
                <input
                  type="number"
                  placeholder="e.g., 4"
                  value={newRoom.maxGuests}
                  onChange={(e) => setNewRoom({...newRoom, maxGuests: parseInt(e.target.value) || 1})}
                  className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="1"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddRoom}
                className="flex-1 px-6 py-3 font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg shadow-lg transition hover:from-indigo-700 hover:to-blue-700"
              >
                ✅ Add Room Type
              </button>
              <button
                onClick={() => {
                  setNewRoom({ type: '', total: 0, price: 0, maxGuests: 1 });
                }}
                className="flex-1 px-6 py-3 font-bold text-gray-700 bg-gray-200 rounded-lg transition hover:bg-gray-300"
              >
                ✕ Clear Form
              </button>
            </div>
          </div>

          {/* Room Management Table */}
          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <h3 className="mb-4 text-lg font-bold text-gray-900">📋 Your Room Types</h3>
            {hotelRooms.length === 0 ? (
              <p className="py-8 text-center text-gray-500">No room types added yet. Add your first room type above!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-indigo-50 border-b-2 border-indigo-300">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-left text-indigo-900">Room Type</th>
                      <th className="px-4 py-3 font-semibold text-center text-indigo-900">Total</th>
                      <th className="px-4 py-3 font-semibold text-center text-indigo-900">Occupied</th>
                      <th className="px-4 py-3 font-semibold text-center text-indigo-900">Available</th>
                      <th className="px-4 py-3 font-semibold text-center text-indigo-900">Price (₨)</th>
                      <th className="px-4 py-3 font-semibold text-center text-indigo-900">Max Guests</th>
                      <th className="px-4 py-3 font-semibold text-center text-indigo-900">Occupancy</th>
                      <th className="px-4 py-3 font-semibold text-center text-indigo-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotelRooms.map((room) => {
                      const occupancyPercentage = room.total > 0 ? (room.occupied / room.total) * 100 : 0;
                      return (
                        <tr key={room.id} className="border-b border-gray-200 transition hover:bg-gray-50">
                          <td className="px-4 py-3 font-semibold text-gray-900">{room.type}</td>
                          <td className="px-4 py-3 text-center text-gray-700">{room.total}</td>
                          <td className="px-4 py-3 font-semibold text-center text-red-600">{room.occupied}</td>
                          <td className="px-4 py-3 font-semibold text-center text-green-600">{room.available}</td>
                          <td className="px-4 py-3 font-semibold text-center text-gray-900">₨{room.price.toLocaleString()}</td>
                          <td className="px-4 py-3 text-center text-gray-700">{room.maxGuests}</td>
                          <td className="px-4 py-3">
                            <div className="w-full h-2 bg-gray-200 rounded-full">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  occupancyPercentage > 75
                                    ? 'bg-red-500'
                                    : occupancyPercentage > 50
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                }`}
                                style={{ width: `${occupancyPercentage}%` }}
                              ></div>
                            </div>
                            <p className="mt-1 text-xs text-center text-gray-600">{occupancyPercentage.toFixed(0)}%</p>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex gap-2 justify-center">
                              <button className="px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded transition hover:bg-blue-600">
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDeleteRoom(room.id)}
                                className="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded transition hover:bg-red-600"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Room Statistics Summary */}
          {hotelRooms.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-8 md:grid-cols-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <p className="text-xs font-semibold text-gray-600">Total Rooms</p>
                <p className="mt-2 text-2xl font-bold text-blue-900">
                  {hotelRooms.reduce((sum, room) => sum + room.total, 0)}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg border border-red-200">
                <p className="text-xs font-semibold text-gray-600">Currently Occupied</p>
                <p className="mt-2 text-2xl font-bold text-red-900">
                  {hotelRooms.reduce((sum, room) => sum + room.occupied, 0)}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <p className="text-xs font-semibold text-gray-600">Available Rooms</p>
                <p className="mt-2 text-2xl font-bold text-green-900">
                  {hotelRooms.reduce((sum, room) => sum + room.available, 0)}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                <p className="text-xs font-semibold text-gray-600">Avg Price/Night</p>
                <p className="mt-2 text-2xl font-bold text-purple-900">
                  ₨{Math.round(hotelRooms.reduce((sum, room) => sum + room.price, 0) / hotelRooms.length).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return renderAdminDashboard();
      case 'manager':
        return renderManagerDashboard();
      case 'tourist':
        return renderTouristDashboard();
      case 'driver':
        return renderDriverDashboard();
      case 'hotel_agent':
        return renderHotelAgentDashboard();
      default:
        return <p>Unknown role</p>;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
}

export default Dashboard;