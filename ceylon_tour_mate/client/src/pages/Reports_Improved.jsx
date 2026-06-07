import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import Toast from '../components/Toast';
import API_BASE_URL from '../config/api';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, AreaChart, Area
} from 'recharts';
import {
  Download, FileText, TrendingUp, Users, BookOpen, DollarSign,
  Calendar, Filter, RefreshCw, Eye
} from 'lucide-react';

function Reports() {
  const { token } = useAuth();
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');
  const reportContainerRef = useRef(null);

  // Date filters
  const getDefaultStartDate = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  };

  const [dateRange, setDateRange] = useState('monthly');
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Data states
  const [userSummary, setUserSummary] = useState(null);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [activeInactiveData, setActiveInactiveData] = useState([]);
  const [geographicData, setGeographicData] = useState([]);
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [confirmedBookingsSummary, setConfirmedBookingsSummary] = useState(null);
  const [bookingPage, setBookingPage] = useState(1);
  const [bookingTotalPages, setBookingTotalPages] = useState(1);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Quick date filters
  const setQuickDateRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const setThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(now.toISOString().split('T')[0]);
  };

  useEffect(() => {
    fetchAllReports();
  }, [dateRange, startDate, endDate]);

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookingsPage();
    }
  }, [bookingPage, activeTab]);

  // Suppress console warnings
  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (
        args[0]?.includes?.('non-boolean attribute') &&
        (args[0]?.includes?.('jsx') || args[0]?.includes?.('global'))
      ) {
        return;
      }
      originalWarn(...args);
    };
    return () => {
      console.warn = originalWarn;
    };
  }, []);

  const fetchAllReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        startDate,
        endDate,
        dateRange
      });

      const [summaryRes, growthRes, statusRes, geoRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/reports/user-summary`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/reports/user-growth?${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/reports/user-status?${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/reports/geographic-distribution`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/reports/confirmed-bookings-summary?${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/reports/confirmed-bookings?${params}&page=1&limit=10`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setUserSummary(summaryRes.data);
      setUserGrowthData(growthRes.data || []);
      setConfirmedBookingsSummary(summaryRes.data?.summary || null);
      setConfirmedBookings(growthRes.data?.data || []);

      // Format status data
      const statusData = statusRes.data || {};
      setActiveInactiveData(
        Object.entries(statusData).map(([role, data]) => ({
          name: role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' '),
          active: data.active || 0,
          inactive: data.inactive || 0
        }))
      );

      // Format geographic data
      const geoArray = Array.isArray(geoRes.data) ? geoRes.data : [];
      setGeographicData(geoArray.slice(0, 10));

      // Format role distribution
      const roles = summaryRes.data?.byRole || {};
      setRoleDistribution(
        Object.entries(roles).map(([role, count]) => ({
          name: role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' '),
          value: count,
          color: getColorByRole(role)
        }))
      );
    } catch (err) {
      console.error('Error fetching reports:', err);
      showToast('error', 'Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingsPage = async () => {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        page: bookingPage,
        limit: 10
      });

      const res = await axios.get(`${API_BASE_URL}/api/reports/confirmed-bookings?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setConfirmedBookings(res.data?.data || []);
      setBookingTotalPages(res.data?.pages || 1);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      showToast('error', 'Failed to load bookings');
    }
  };

  const getColorByRole = (role) => {
    const colors = {
      'driver': '#3b82f6',
      'hotel_agent': '#8b5cf6',
      'tourist': '#ec4899',
      'admin': '#ef4444',
      'manager': '#f59e0b'
    };
    return colors[role] || '#6b7280';
  };

  const exportToCSV = () => {
    try {
      let csv = 'Ceylon Tour Mate - Complete Reports\n';
      csv += new Date().toLocaleString() + '\n\n';

      // User Summary
      if (userSummary) {
        csv += 'USER SUMMARY\n';
        csv += `Total Users,${userSummary.total || 0}\n`;
        csv += `Active Users,${userSummary.active || 0}\n`;
        csv += `Inactive Users,${userSummary.inactive || 0}\n`;
        csv += `New Users (30 Days),${userSummary.newUsersLast30Days || 0}\n\n`;
      }

      // Growth Data
      if (userGrowthData.length > 0) {
        csv += 'USER GROWTH\nDate,New Users,Total Users\n';
        userGrowthData.forEach(item => {
          csv += `${item.date},${item.newUsers || 0},${item.total || 0}\n`;
        });
        csv += '\n';
      }

      // Bookings Summary
      if (confirmedBookingsSummary?.summary) {
        csv += 'CONFIRMED BOOKINGS\n';
        csv += `Total Bookings,${confirmedBookingsSummary.summary.totalConfirmedBookings || 0}\n`;
        csv += `Total Revenue,${confirmedBookingsSummary.summary.totalRevenue || 0}\n`;
        csv += `Average Price,${confirmedBookingsSummary.summary.averagePrice || 0}\n\n`;
      }

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reports-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      showToast('success', 'Report exported as CSV');
    } catch (err) {
      showToast('error', 'Failed to export CSV');
    }
  };

  const exportToPDF = async () => {
    try {
      showToast('info', 'Generating PDF...');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let y = 15;

      // Title
      pdf.setFontSize(20);
      pdf.text('Ceylon Tour Mate - Reports', 15, y);
      y += 10;

      pdf.setFontSize(11);
      pdf.text(`Period: ${startDate} to ${endDate}`, 15, y);
      y += 10;
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 15, y);
      y += 15;

      // Summary
      if (userSummary) {
        pdf.setFontSize(14);
        pdf.text('User Summary', 15, y);
        y += 8;

        pdf.setFontSize(11);
        const summaryText = [
          `Total Users: ${userSummary.total || 0}`,
          `Active: ${userSummary.active || 0}`,
          `Inactive: ${userSummary.inactive || 0}`,
          `New (30 Days): ${userSummary.newUsersLast30Days || 0}`
        ];

        summaryText.forEach(text => {
          if (y > pageHeight - 20) {
            pdf.addPage();
            y = 15;
          }
          pdf.text(text, 15, y);
          y += 7;
        });
      }

      pdf.save(`Ceylon-TourMate-Reports-${new Date().toISOString().split('T')[0]}.pdf`);
      showToast('success', 'PDF exported successfully');
    } catch (err) {
      console.error('PDF export error:', err);
      showToast('error', 'Failed to export PDF');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="mb-4 text-5xl text-blue-600 animate-spin">
              <RefreshCw size={48} className="inline-block" />
            </div>
            <p className="text-lg text-gray-600">Loading reports...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div ref={reportContainerRef} className="p-8 space-y-6 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        {toast && <Toast type={toast.type} message={toast.message} />}

        {/* Header */}
        <div className="mb-8">
          <div className="flex gap-3 items-center mb-2">
            <div className="p-3 bg-blue-600 rounded-lg">
              <FileText className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600">Comprehensive system analytics and insights</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 space-y-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-200">
            <button
              onClick={() => setQuickDateRange(7)}
              className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
            >
              <Calendar size={14} className="inline mr-1" />7 Days
            </button>
            <button
              onClick={() => setQuickDateRange(30)}
              className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
            >
              <Calendar size={14} className="inline mr-1" />30 Days
            </button>
            <button
              onClick={() => setQuickDateRange(90)}
              className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
            >
              <Calendar size={14} className="inline mr-1" />90 Days
            </button>
            <button
              onClick={setThisMonth}
              className="px-3 py-1 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100"
            >
              <Calendar size={14} className="inline mr-1" />This Month
            </button>
            <button
              onClick={fetchAllReports}
              className="px-3 py-1 ml-auto text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <RefreshCw size={14} className="inline mr-1" />Refresh
            </button>
          </div>

          {/* Date Controls */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Period</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 font-semibold text-white bg-green-600 rounded-lg transition hover:bg-green-700"
              >
                <Download size={16} className="inline mr-2" />CSV
              </button>
              <button
                onClick={exportToPDF}
                className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg transition hover:bg-red-700"
              >
                <FileText size={16} className="inline mr-2" />PDF
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 bg-white rounded-t-xl border-b border-gray-200">
          {[
            { id: 'summary', label: 'Summary', icon: '📊' },
            { id: 'growth', label: 'Growth', icon: '📈' },
            { id: 'status', label: 'Status', icon: '✓' },
            { id: 'geographic', label: 'Geographic', icon: '📍' },
            { id: 'bookings', label: 'Bookings', icon: '🎫' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex gap-2 items-center px-6 py-4 font-semibold transition border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 bg-white rounded-b-xl border border-gray-100 shadow-sm">
          {/* Summary Tab */}
          {activeTab === 'summary' && userSummary && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Total Users</p>
                      <h3 className="mt-2 text-3xl font-bold text-blue-900">{userSummary.total || 0}</h3>
                    </div>
                    <Users size={28} className="text-blue-400" />
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-green-700">Active Users</p>
                      <h3 className="mt-2 text-3xl font-bold text-green-900">{userSummary.active || 0}</h3>
                      <p className="mt-1 text-xs text-green-600">
                        {Math.round((userSummary.active / userSummary.total) * 100)}% active
                      </p>
                    </div>
                    <Eye size={28} className="text-green-400" />
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-red-700">Inactive Users</p>
                      <h3 className="mt-2 text-3xl font-bold text-red-900">{userSummary.inactive || 0}</h3>
                    </div>
                    <Users size={28} className="text-red-400" />
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-purple-700">New (30 Days)</p>
                      <h3 className="mt-2 text-3xl font-bold text-purple-900">
                        {userSummary.newUsersLast30Days || 0}
                      </h3>
                    </div>
                    <TrendingUp size={28} className="text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Role Distribution */}
                <div className="p-6 bg-white rounded-lg border border-gray-200">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">Users by Role</h3>
                  {roleDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={roleDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {roleDistribution.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="py-8 text-center text-gray-400">No data</p>
                  )}
                </div>

                {/* Breakdown Table */}
                <div className="p-6 bg-white rounded-lg border border-gray-200">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">Breakdown</h3>
                  <div className="space-y-3">
                    {roleDistribution.map((role) => (
                      <div key={role.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex gap-3 items-center">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: role.color }}
                          />
                          <span className="font-medium text-gray-900">{role.name}</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{role.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Growth Tab */}
          {activeTab === 'growth' && (
            <div className="space-y-6">
              {userGrowthData.length > 0 ? (
                <>
                  <div className="p-6 bg-white rounded-lg border border-gray-200">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">User Growth Trend</h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={userGrowthData}>
                        <defs>
                          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="total" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTotal)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700">Total New Users</p>
                      <h3 className="text-2xl font-bold text-blue-900">
                        {userGrowthData.reduce((sum, item) => sum + (item.newUsers || 0), 0)}
                      </h3>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700">Avg. Daily Growth</p>
                      <h3 className="text-2xl font-bold text-green-900">
                        {userGrowthData.length > 0 ? Math.round(userGrowthData.reduce((sum, i) => sum + (i.newUsers || 0), 0) / userGrowthData.length) : 0}
                      </h3>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm text-purple-700">Peak Day</p>
                      <h3 className="text-2xl font-bold text-purple-900">
                        {userGrowthData.length > 0 ? Math.max(...userGrowthData.map(i => i.newUsers || 0)) : 0}
                      </h3>
                    </div>
                  </div>
                </>
              ) : (
                <p className="py-12 text-center text-gray-400">No growth data available</p>
              )}
            </div>
          )}

          {/* Status Tab */}
          {activeTab === 'status' && (
            <div className="space-y-6">
              {activeInactiveData.length > 0 ? (
                <>
                  <div className="p-6 bg-white rounded-lg border border-gray-200">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Active vs Inactive by Role</h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={activeInactiveData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="active" fill="#10b981" name="Active" />
                        <Bar dataKey="inactive" fill="#ef4444" name="Inactive" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <p className="py-12 text-center text-gray-400">No status data available</p>
              )}
            </div>
          )}

          {/* Geographic Tab */}
          {activeTab === 'geographic' && (
            <div className="space-y-6">
              {geographicData.length > 0 ? (
                <>
                  <div className="p-6 bg-white rounded-lg border border-gray-200">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Users by Location (Top 10)</h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={geographicData} layout="vertical" margin={{ left: 150 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={140} />
                        <Tooltip />
                        <Bar dataKey="users" fill="#8b5cf6" name="Users" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <p className="py-12 text-center text-gray-400">No geographic data available</p>
              )}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              {confirmedBookings.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-left text-gray-700">ID</th>
                          <th className="px-4 py-3 font-semibold text-left text-gray-700">Name</th>
                          <th className="px-4 py-3 font-semibold text-left text-gray-700">Email</th>
                          <th className="px-4 py-3 font-semibold text-left text-gray-700">Package</th>
                          <th className="px-4 py-3 font-semibold text-left text-gray-700">Price</th>
                          <th className="px-4 py-3 font-semibold text-left text-gray-700">Status</th>
                          <th className="px-4 py-3 font-semibold text-left text-gray-700">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {confirmedBookings.map((booking) => (
                          <tr key={booking.booking_id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-xs text-gray-900">#{booking.booking_id}</td>
                            <td className="px-4 py-3 text-gray-900">
                              {booking.first_name} {booking.last_name}
                            </td>
                            <td className="px-4 py-3 text-gray-600">{booking.email}</td>
                            <td className="px-4 py-3 text-gray-900">{booking.package_name || 'Custom'}</td>
                            <td className="px-4 py-3 font-semibold text-gray-900">
                              ₨{parseInt(booking.estimated_price || 0).toLocaleString()}
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-600">
                              {new Date(booking.booking_created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Page {bookingPage} of {bookingTotalPages}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setBookingPage(Math.max(1, bookingPage - 1))}
                        disabled={bookingPage === 1}
                        className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded disabled:opacity-50"
                      >
                        ← Previous
                      </button>
                      <button
                        onClick={() => setBookingPage(Math.min(bookingTotalPages, bookingPage + 1))}
                        disabled={bookingPage === bookingTotalPages}
                        className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded disabled:opacity-50"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="py-12 text-center text-gray-400">No confirmed bookings available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Reports;
