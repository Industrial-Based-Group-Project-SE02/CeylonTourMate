import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import Toast from '../components/Toast';
import API_BASE_URL from '../config/api';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function Reports() {
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');
  const [errors, setErrors] = useState([]); // Track endpoint errors
  const reportContainerRef = useRef(null);
  
  // Date range filter - initialize with safe defaults
  const [dateRange, setDateRange] = useState('monthly'); // daily, monthly, yearly
  const getDefaultStartDate = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1); // 1 month ago
    return d.toISOString().split('T')[0];
  };
  const getDefaultEndDate = () => new Date().toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());

  // Data states
  const [userSummary, setUserSummary] = useState(null);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [activeInactiveData, setActiveInactiveData] = useState([]);
  const [geographicData, setGeographicData] = useState([]);
  const [engagementData, setEngagementData] = useState([]);
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [confirmedBookingsSummary, setConfirmedBookingsSummary] = useState(null);
  const [bookingPage, setBookingPage] = useState(1);
  const [bookingTotalPages, setBookingTotalPages] = useState(1);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const { user } = useAuth();

  // Quick date filter functions
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

  const setLastMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  // Suppress Recharts React 19 compatibility warnings
  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      // Suppress Recharts attribute warnings
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

  useEffect(() => {
    fetchAllReports();
  }, [dateRange, startDate, endDate]);

  const fetchAllReports = async () => {
    try {
      setLoading(true);
      setErrors([]); // Clear previous errors
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        startDate,
        endDate,
        dateRange
      });

      // Fetch all report data in parallel with error handling per endpoint
      const results = await Promise.allSettled([
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
        axios.get(`${API_BASE_URL}/api/reports/user-engagement?${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/reports/confirmed-bookings-summary?${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/reports/confirmed-bookings?${params}&page=1&limit=10`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      // Handle results
      const [summaryRes, growthRes, statusRes, geoRes, engageRes, bookingsSummaryRes, bookingsRes] = results;
      const endpointNames = ['User Summary', 'User Growth', 'User Status', 'Geographic Distribution', 'User Engagement', 'Bookings Summary', 'Confirmed Bookings'];
      const newErrors = [];

      // Log and track any failures for debugging
      if (summaryRes.status === 'rejected') {
        console.error('User summary failed:', summaryRes.reason);
        newErrors.push('User Summary');
      }
      if (growthRes.status === 'rejected') {
        console.error('User growth failed:', growthRes.reason);
        newErrors.push('User Growth');
      }
      if (statusRes.status === 'rejected') {
        console.error('User status failed:', statusRes.reason);
        newErrors.push('User Status');
      }
      if (geoRes.status === 'rejected') {
        console.error('Geographic distribution failed:', geoRes.reason);
        newErrors.push('Geographic Distribution');
      }
      if (engageRes.status === 'rejected') {
        console.error('Engagement failed:', engageRes.reason);
        newErrors.push('User Engagement');
      }
      if (bookingsSummaryRes.status === 'rejected') {
        console.error('Bookings summary failed:', bookingsSummaryRes.reason);
        newErrors.push('Bookings Summary');
      }
      if (bookingsRes.status === 'rejected') {
        console.error('Bookings failed:', bookingsRes.reason);
        newErrors.push('Confirmed Bookings');
      }

      if (newErrors.length > 0) {
        setErrors(newErrors);
        showToast('warning', `Failed to load: ${newErrors.join(', ')}`);
      }

      if (summaryRes.status === 'fulfilled') {
        setUserSummary(summaryRes.value.data);
        const roles = summaryRes.value.data?.byRole || {};
        setRoleDistribution(
          Object.entries(roles).map(([role, count]) => ({
            name: role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' '),
            value: count,
            color: getColorByRole(role)
          }))
        );
      }

      if (growthRes.status === 'fulfilled') {
        setUserGrowthData(growthRes.value.data || []);
      }

      if (statusRes.status === 'fulfilled') {
        const statusData = statusRes.value.data || {};
        setActiveInactiveData(
          Object.entries(statusData).map(([role, data]) => ({
            name: role,
            active: data.active || 0,
            inactive: data.inactive || 0
          }))
        );
      }

      if (geoRes.status === 'fulfilled') {
        const geoArray = Array.isArray(geoRes.value.data) ? geoRes.value.data : Object.entries(geoRes.value.data || {}).map(([name, count]) => ({
          name,
          users: count
        }));
        setGeographicData(geoArray.slice(0, 10));
      }

      if (engageRes.status === 'fulfilled') {
        const engageArray = Array.isArray(engageRes.value.data) ? engageRes.value.data : engageRes.value.data || [];
        setEngagementData(engageArray);
      }

      if (bookingsSummaryRes.status === 'fulfilled') {
        setConfirmedBookingsSummary(bookingsSummaryRes.value.data);
      }

      if (bookingsRes.status === 'fulfilled') {
        setConfirmedBookings(bookingsRes.value.data?.data || []);
        setBookingTotalPages(bookingsRes.value.data?.pages || 1);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      showToast('error', 'Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings for specific page
  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookingsPage();
    }
  }, [bookingPage, activeTab]);

  const fetchBookingsPage = async () => {
    try {
      const token = localStorage.getItem('token');
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
      console.error('Error fetching bookings page:', err);
      showToast('error', 'Failed to load bookings');
    }
  };

  const getColorByRole = (role) => {
    const colors = {
      'driver': '#3b82f6',
      'hotel_agent': '#8b5cf6',
      'tourist': '#ec4899',
      'admin': '#ef4444'
    };
    return colors[role] || '#6b7280';
  };

  const exportToCSV = () => {
    try {
      let csvContent = 'Ceylon Tour Mate - Complete Reports\n\n';
      
      // User Summary
      if (userSummary) {
        csvContent += 'USER SUMMARY\n';
        csvContent += `Total Users,${userSummary.total || 0}\n`;
        csvContent += `Active Users,${userSummary.active || 0}\n`;
        csvContent += `Inactive Users,${userSummary.inactive || 0}\n\n`;
        
        if (userSummary.byRole) {
          csvContent += 'By Role\n';
          Object.entries(userSummary.byRole).forEach(([role, count]) => {
            csvContent += `${role},${count}\n`;
          });
        }
        csvContent += '\n';
      }

      // User Growth
      if (userGrowthData.length > 0) {
        csvContent += 'USER GROWTH TREND\n';
        csvContent += 'Date,New Users,Total Users\n';
        userGrowthData.forEach(item => {
          csvContent += `${item.date || item.month || item.year},${item.newUsers || 0},${item.total || 0}\n`;
        });
        csvContent += '\n';
      }

      // Geographic Distribution
      if (geographicData.length > 0) {
        csvContent += 'GEOGRAPHIC DISTRIBUTION\n';
        csvContent += 'Location,User Count\n';
        geographicData.forEach(item => {
          csvContent += `${item.name},${item.users}\n`;
        });
        csvContent += '\n';
      }

      // Confirmed Bookings Summary
      if (confirmedBookingsSummary) {
        csvContent += 'CONFIRMED BOOKINGS\n';
        csvContent += `Total Confirmed Bookings,${confirmedBookingsSummary.summary?.totalConfirmedBookings || 0}\n`;
        csvContent += `Total Revenue,Rs. ${(confirmedBookingsSummary.summary?.totalRevenue || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}\n`;
        csvContent += `Average Price,Rs. ${(confirmedBookingsSummary.summary?.averagePrice || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}\n\n`;

        // Bookings by Package
        if (confirmedBookingsSummary.byPackage && confirmedBookingsSummary.byPackage.length > 0) {
          csvContent += 'Bookings by Package\n';
          csvContent += 'Package Name,Booking Count,Average Price\n';
          confirmedBookingsSummary.byPackage.forEach(pkg => {
            csvContent += `"${pkg.package_name || 'Custom Package'}",${pkg.booking_count},${pkg.avg_price || 0}\n`;
          });
          csvContent += '\n';
        }

        // Bookings by Vehicle Type
        if (confirmedBookingsSummary.byVehicleType && confirmedBookingsSummary.byVehicleType.length > 0) {
          csvContent += 'Bookings by Vehicle Type\n';
          csvContent += 'Vehicle Type,Count\n';
          confirmedBookingsSummary.byVehicleType.forEach(vehicle => {
            csvContent += `${vehicle.vehicle_type},${vehicle.booking_count}\n`;
          });
          csvContent += '\n';
        }
      }

      // Confirmed Bookings Details
      if (confirmedBookings.length > 0) {
        csvContent += 'CONFIRMED BOOKINGS DETAILS\n';
        csvContent += 'ID,Full Name,Email,Phone,Package,Vehicle,Price,Status,Date\n';
        confirmedBookings.forEach(booking => {
          const fullName = booking.first_name && booking.last_name 
            ? `${booking.first_name} ${booking.last_name}`
            : booking.fullname || 'N/A';
          csvContent += `${booking.booking_id},"${fullName}","${booking.email || 'N/A'}","${booking.phone || 'N/A'}","${booking.package_name || 'Custom'}","${booking.vehicle_type || 'Standard'}","Rs. ${booking.estimated_price || 0}","${booking.status}","${new Date(booking.booking_created_at).toLocaleDateString('en-US')}"\n`;
        });
      }

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ceylon-tour-mate-reports-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      showToast('success', 'Report exported as CSV');
    } catch (err) {
      showToast('error', 'Failed to export report');
    }
  };

  const exportToPDF = async () => {
    try {
      if (!reportContainerRef.current) return;

      showToast('info', 'Generating PDF...');
      
      // Create a new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 15;

      // Add title
      pdf.setFontSize(20);
      pdf.text('Ceylon Tour Mate - Complete Reports', 15, yPosition);
      yPosition += 10;

      // Add date range info
      pdf.setFontSize(11);
      pdf.text(`Report Period: ${startDate} to ${endDate} (${dateRange})`, 15, yPosition);
      yPosition += 10;
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 15, yPosition);
      yPosition += 15;

      // Add summary section if available
      if (userSummary) {
        pdf.setFontSize(14);
        pdf.text('Summary Statistics', 15, yPosition);
        yPosition += 8;

        pdf.setFontSize(11);
        const summaryData = [
          `Total Users: ${userSummary.total || 0}`,
          `Active Users: ${userSummary.active || 0}`,
          `Inactive Users: ${userSummary.inactive || 0}`,
          `New Users (Last 30 Days): ${userSummary.newUsersLast30Days || 0}`
        ];

        summaryData.forEach(text => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 15;
          }
          pdf.text(text, 15, yPosition);
          yPosition += 7;
        });
        yPosition += 5;
      }

      // Add role breakdown
      if (userSummary && userSummary.byRole && Object.keys(userSummary.byRole).length > 0) {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 15;
        }

        pdf.setFontSize(14);
        pdf.text('Users by Role', 15, yPosition);
        yPosition += 8;

        pdf.setFontSize(11);
        Object.entries(userSummary.byRole).forEach(([role, count]) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 15;
          }
          const roleLabel = role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ');
          pdf.text(`${roleLabel}: ${count}`, 15, yPosition);
          yPosition += 7;
        });
        yPosition += 5;
      }

      // Add growth data if available
      if (userGrowthData.length > 0) {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 15;
        }

        pdf.setFontSize(14);
        pdf.text('Growth Trend', 15, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        const maxRows = 10;
        const displayData = userGrowthData.slice(-maxRows);

        displayData.forEach(item => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 15;
          }
          pdf.text(`${item.date}: New Users: ${item.newUsers}, Total: ${item.total}`, 15, yPosition);
          yPosition += 6;
        });
        yPosition += 5;
      }

      // Add geographic data if available
      if (geographicData.length > 0) {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 15;
        }

        pdf.setFontSize(14);
        pdf.text('Geographic Distribution', 15, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        geographicData.forEach(item => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 15;
          }
          pdf.text(`${item.name}: ${item.users} users`, 15, yPosition);
          yPosition += 6;
        });
        yPosition += 5;
      }

      // Add engagement data if available
      if (engagementData.length > 0) {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 15;
        }

        pdf.setFontSize(14);
        pdf.text('User Engagement', 15, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        const maxEngagementRows = 8;
        const displayEngagement = engagementData.slice(-maxEngagementRows);

        displayEngagement.forEach(item => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 15;
          }
          pdf.text(`${item.date}: Active Users: ${item.activeUsers}, Logins: ${item.totalLogins}`, 15, yPosition);
          yPosition += 6;
        });
        yPosition += 5;
      }

      // Add confirmed bookings summary
      if (confirmedBookingsSummary) {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 15;
        }

        pdf.setFontSize(14);
        pdf.text('Confirmed Bookings Summary', 15, yPosition);
        yPosition += 8;

        pdf.setFontSize(11);
        const bookingSummaryData = [
          `Total Confirmed Bookings: ${confirmedBookingsSummary.summary?.totalConfirmedBookings || 0}`,
          `Total Revenue: Rs. ${(confirmedBookingsSummary.summary?.totalRevenue || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}`,
          `Average Price: Rs. ${(confirmedBookingsSummary.summary?.averagePrice || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}`
        ];

        bookingSummaryData.forEach(text => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 15;
          }
          pdf.text(text, 15, yPosition);
          yPosition += 7;
        });
        yPosition += 8;

        // Add bookings by package
        if (confirmedBookingsSummary.byPackage && confirmedBookingsSummary.byPackage.length > 0) {
          if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = 15;
          }

          pdf.setFontSize(12);
          pdf.text('Bookings by Package', 15, yPosition);
          yPosition += 8;

          pdf.setFontSize(10);
          confirmedBookingsSummary.byPackage.slice(0, 5).forEach(pkg => {
            if (yPosition > pageHeight - 20) {
              pdf.addPage();
              yPosition = 15;
            }
            const pkgName = pkg.package_name || 'Custom Package';
            pdf.text(`• ${pkgName}: ${pkg.booking_count} bookings (Avg: Rs. ${pkg.avg_price || 0})`, 15, yPosition);
            yPosition += 6;
          });
          yPosition += 3;
        }

        // Add bookings by vehicle type
        if (confirmedBookingsSummary.byVehicleType && confirmedBookingsSummary.byVehicleType.length > 0) {
          if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = 15;
          }

          pdf.setFontSize(12);
          pdf.text('Bookings by Vehicle Type', 15, yPosition);
          yPosition += 8;

          pdf.setFontSize(10);
          confirmedBookingsSummary.byVehicleType.forEach(vehicle => {
            if (yPosition > pageHeight - 20) {
              pdf.addPage();
              yPosition = 15;
            }
            pdf.text(`• ${vehicle.vehicle_type}: ${vehicle.booking_count} bookings`, 15, yPosition);
            yPosition += 6;
          });
          yPosition += 5;
        }
      }

      // Add confirmed bookings details if available
      if (confirmedBookings.length > 0) {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 15;
        }

        pdf.setFontSize(14);
        pdf.text('Recent Confirmed Bookings', 15, yPosition);
        yPosition += 8;

        pdf.setFontSize(9);
        const maxBookingRows = 8;
        const displayBookings = confirmedBookings.slice(0, maxBookingRows);

        displayBookings.forEach(booking => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 15;
          }
          const fullName = booking.first_name && booking.last_name 
            ? `${booking.first_name} ${booking.last_name}`
            : booking.fullname || 'N/A';
          pdf.text(`ID: ${booking.booking_id} | ${fullName} | ${booking.package_name || 'Custom'} | Rs. ${booking.estimated_price}`, 15, yPosition);
          yPosition += 5;
        });
      }

      // Add footer
      pdf.setFontSize(9);
      pdf.text('Ceylon Tour Mate - Confidential Report', 15, pageHeight - 10);

      // Save the PDF
      const fileName = `Ceylon-TourMate-Reports-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      showToast('success', 'PDF exported successfully!');
    } catch (err) {
      console.error('Error exporting PDF:', err);
      showToast('error', 'Failed to export PDF');
    }
  };

  const downloadBookingsPdf = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ startDate, endDate, includeStatuses: 'confirmed,completed' });
      const res = await axios.get(`${API_BASE_URL}/api/reports/manager/confirmed-bookings-pdf?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'manager_bookings_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast('success', 'Bookings PDF downloaded');
    } catch (err) {
      console.error('Download failed', err);
      showToast('error', 'Failed to download PDF');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <i className="mb-4 text-5xl text-blue-600 fas fa-spinner fa-spin"></i>
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
          <h1 className="flex gap-3 items-center mb-2 text-4xl font-bold text-gray-900">
            <div className="p-2 bg-blue-600 rounded-lg">
              <i className="text-2xl text-white fas fa-chart-bar"></i>
            </div>
            User & Account Reports
          </h1>
          <p className="text-gray-600">Comprehensive analytics and insights on user accounts and activities</p>
        </div>

        {/* Controls */}
        <div className="p-6 space-y-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          {/* Quick Date Range Buttons */}
          <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-200">
            <button
              onClick={() => setQuickDateRange(7)}
              className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
              title="Last 7 days"
            >
              <i className="mr-1 fas fa-calendar"></i>7 Days
            </button>
            <button
              onClick={() => setQuickDateRange(30)}
              className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
              title="Last 30 days"
            >
              <i className="mr-1 fas fa-calendar"></i>30 Days
            </button>
            <button
              onClick={() => setQuickDateRange(90)}
              className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
              title="Last 90 days"
            >
              <i className="mr-1 fas fa-calendar"></i>90 Days
            </button>
            <button
              onClick={setThisMonth}
              className="px-3 py-1 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition"
              title="This month"
            >
              <i className="mr-1 fas fa-calendar"></i>This Month
            </button>
            <button
              onClick={setLastMonth}
              className="px-3 py-1 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition"
              title="Last month"
            >
              <i className="mr-1 fas fa-calendar"></i>Last Month
            </button>
          </div>

          {/* Date Filter Controls */}
          <div className="flex flex-col gap-4 justify-between md:flex-row md:items-end">
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Date Range Type */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Report Period</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 font-semibold text-white bg-green-600 rounded-lg transition hover:bg-green-700"
                title="Export as CSV"
              >
                <i className="mr-2 fas fa-download"></i>
                CSV
              </button>
              <button
                onClick={exportToPDF}
                className="px-4 py-2 font-semibold text-white bg-red-600 rounded-lg transition hover:bg-red-700"
                title="Export as PDF"
              >
                <i className="mr-2 fas fa-file-pdf"></i>
                PDF
              </button>
              {user?.role === 'manager' && (
                <button
                  onClick={downloadBookingsPdf}
                  className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg transition hover:bg-blue-700"
                  title="Download Bookings PDF"
                >
                  <i className="mr-2 fas fa-file-download"></i>
                  Manager PDF
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 bg-white rounded-t-xl border-b border-gray-200">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex gap-2 items-center px-6 py-4 font-semibold transition border-b-2 ${ 
              activeTab === 'summary'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <i className="fas fa-chart-pie"></i>
            Summary
          </button>
          <button
            onClick={() => setActiveTab('growth')}
            className={`flex gap-2 items-center px-6 py-4 font-semibold transition border-b-2 ${
              activeTab === 'growth'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <i className="fas fa-chart-line"></i>
            Growth Trend
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`flex gap-2 items-center px-6 py-4 font-semibold transition border-b-2 ${
              activeTab === 'status'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <i className="fas fa-check-circle"></i>
            Status
          </button>
          <button
            onClick={() => setActiveTab('geographic')}
            className={`flex gap-2 items-center px-6 py-4 font-semibold transition border-b-2 ${
              activeTab === 'geographic'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <i className="fas fa-map-marker-alt"></i>
            Geographic
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex gap-2 items-center px-6 py-4 font-semibold transition border-b-2 ${
              activeTab === 'bookings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <i className="fas fa-booking"></i>
            Confirmed Bookings
          </button>
          {/* <button
            onClick={() => setActiveTab('engagement')}
            className={`flex gap-2 items-center px-6 py-4 font-semibold transition border-b-2 ${
              activeTab === 'engagement'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <i className="fas fa-user-clock"></i>
            Engagement
          </button> */}
        </div>

        {/* Tab Content */}
        <div className="p-6 bg-white rounded-b-xl border border-gray-100 shadow-sm">
          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {userSummary && (
                <>
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <p className="mb-2 text-sm font-medium text-blue-700">Total Users</p>
                      <h3 className="text-3xl font-bold text-blue-900">{userSummary.total || 0}</h3>
                      <p className="mt-2 text-xs text-blue-600">All registered users</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                      <p className="mb-2 text-sm font-medium text-green-700">Active Users</p>
                      <h3 className="text-3xl font-bold text-green-900">{userSummary.active || 0}</h3>
                      <p className="mt-2 text-xs text-green-600">
                        {userSummary.total ? Math.round((userSummary.active / userSummary.total) * 100) : 0}% of total
                      </p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                      <p className="mb-2 text-sm font-medium text-red-700">Inactive Users</p>
                      <h3 className="text-3xl font-bold text-red-900">{userSummary.inactive || 0}</h3>
                      <p className="mt-2 text-xs text-red-600">
                        {userSummary.total ? Math.round((userSummary.inactive / userSummary.total) * 100) : 0}% of total
                      </p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                      <p className="mb-2 text-sm font-medium text-purple-700">Last 30 Days</p>
                      <h3 className="text-3xl font-bold text-purple-900">{userSummary.newUsersLast30Days || 0}</h3>
                      <p className="mt-2 text-xs text-purple-600">New registrations</p>
                    </div>
                  </div>

                  {/* Users by Role */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Role Distribution Pie Chart */}
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
                              {roleDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="py-8 text-center text-gray-600">No data available</p>
                      )}
                    </div>

                    {/* Role Details Table */}
                    <div className="p-6 bg-white rounded-lg border border-gray-200">
                      <h3 className="mb-4 text-lg font-semibold text-gray-900">Breakdown</h3>
                      <div className="space-y-3">
                        {roleDistribution.map((role) => (
                          <div key={role.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex gap-3 items-center">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: role.color }}
                              ></div>
                              <span className="font-medium text-gray-900">{role.name}</span>
                            </div>
                            <span className="font-bold text-gray-900">{role.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Growth Trend Tab */}
          {activeTab === 'growth' && (
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-lg border border-gray-200">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">User Growth Over Time</h3>
                {userGrowthData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="newUsers"
                        stroke="#3b82f6"
                        name="New Users"
                        dot={{ fill: '#3b82f6' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#10b981"
                        name="Total Users"
                        dot={{ fill: '#10b981' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="py-12 text-center text-gray-600">No growth data available for selected period</p>
                )}
              </div>

              {/* Growth Statistics */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">Total New Users</p>
                  <h3 className="text-2xl font-bold text-blue-900">
                    {userGrowthData.reduce((sum, item) => sum + (item.newUsers || 0), 0)}
                  </h3>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">Avg. Daily Users</p>
                  <h3 className="text-2xl font-bold text-green-900">
                    {userGrowthData.length > 0
                      ? Math.round(
                          userGrowthData.reduce((sum, item) => sum + (item.newUsers || 0), 0) /
                          userGrowthData.length
                        )
                      : 0}
                  </h3>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-700">Peak Day</p>
                  <h3 className="text-2xl font-bold text-purple-900">
                    {userGrowthData.length > 0
                      ? Math.max(...userGrowthData.map(item => item.newUsers || 0))
                      : 0}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {/* Status Tab */}
          {activeTab === 'status' && (
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-lg border border-gray-200">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Active vs Inactive Users by Role</h3>
                {activeInactiveData.length > 0 ? (
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
                ) : (
                  <p className="py-12 text-center text-gray-600">No status data available</p>
                )}
              </div>

              {/* Status Details */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                {activeInactiveData.map((item) => (
                  <div key={item.name} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="mb-3 text-sm font-medium text-gray-700">{item.name}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Active</span>
                        <span className="font-bold text-green-600">{item.active}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Inactive</span>
                        <span className="font-bold text-red-600">{item.inactive}</span>
                      </div>
                      <div className="mt-2 w-full h-2 bg-gray-300 rounded-full">
                        <div
                          className="h-2 bg-green-600 rounded-full"
                          style={{
                            width: `${
                              item.active + item.inactive > 0
                                ? (item.active / (item.active + item.inactive)) * 100
                                : 0
                            }%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Geographic Tab */}
          {activeTab === 'geographic' && (
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-lg border border-gray-200">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Users by Province/District</h3>
                {geographicData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={geographicData}
                      layout="vertical"
                      margin={{ left: 200, right: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={190} />
                      <Tooltip />
                      <Bar dataKey="users" fill="#3b82f6" name="User Count" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="py-12 text-center text-gray-600">No geographic data available</p>
                )}
              </div>

              {/* Top Locations Table */}
              <div className="p-6 bg-white rounded-lg border border-gray-200">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Top Locations</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-left text-gray-900">Rank</th>
                        <th className="px-4 py-3 font-semibold text-left text-gray-900">Location</th>
                        <th className="px-4 py-3 font-semibold text-right text-gray-900">Users</th>
                        <th className="px-4 py-3 font-semibold text-right text-gray-900">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {geographicData.map((item, index) => {
                        const totalUsers = geographicData.reduce((sum, loc) => sum + loc.users, 0);
                        const percentage = totalUsers > 0 ? ((item.users / totalUsers) * 100).toFixed(1) : 0;
                        return (
                          <tr key={item.name} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold text-gray-900">{index + 1}</td>
                            <td className="px-4 py-3 text-gray-900">{item.name}</td>
                            <td className="px-4 py-3 font-semibold text-right text-gray-900">{item.users}</td>
                            <td className="px-4 py-3 text-right text-gray-600">{percentage}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Confirmed Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              {/* Booking Date Filter */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  <i className="mr-2 fas fa-calendar-alt text-blue-600"></i>
                  Filter Confirmed Bookings by Date
                </h3>
                
                {/* Quick Date Filters */}
                <div className="mb-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => setQuickDateRange(7)}
                    className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                    title="Last 7 days"
                  >
                    <i className="mr-1 fas fa-calendar"></i>Last 7 Days
                  </button>
                  <button
                    onClick={() => setQuickDateRange(30)}
                    className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                    title="Last 30 days"
                  >
                    <i className="mr-1 fas fa-calendar"></i>Last 30 Days
                  </button>
                  <button
                    onClick={() => setQuickDateRange(90)}
                    className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                    title="Last 90 days"
                  >
                    <i className="mr-1 fas fa-calendar"></i>Last 90 Days
                  </button>
                  <button
                    onClick={setThisMonth}
                    className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                    title="This month"
                  >
                    <i className="mr-1 fas fa-calendar"></i>This Month
                  </button>
                  <button
                    onClick={setLastMonth}
                    className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                    title="Last month"
                  >
                    <i className="mr-1 fas fa-calendar"></i>Last Month
                  </button>
                </div>

                {/* Date Range Inputs */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Period Type</label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 transition outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-600">
                  <i className="mr-1 fas fa-info-circle"></i>
                  Showing confirmed bookings from <strong>{startDate}</strong> to <strong>{endDate}</strong>
                </p>
              </div>

              {confirmedBookingsSummary && (
                <>
                  {/* Booking Summary Metrics */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <p className="mb-2 text-sm font-medium text-blue-700">Total Confirmed Bookings</p>
                      <h3 className="text-3xl font-bold text-blue-900">{confirmedBookingsSummary.summary?.totalConfirmedBookings || 0}</h3>
                      <p className="mt-2 text-xs text-blue-600">Tours booked and confirmed</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                      <p className="mb-2 text-sm font-medium text-green-700">Total Revenue</p>
                      <h3 className="text-3xl font-bold text-green-900">Rs. {(confirmedBookingsSummary.summary?.totalRevenue || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}</h3>
                      <p className="mt-2 text-xs text-green-600">From confirmed bookings</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                      <p className="mb-2 text-sm font-medium text-purple-700">Average Price</p>
                      <h3 className="text-3xl font-bold text-purple-900">Rs. {(confirmedBookingsSummary.summary?.averagePrice || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}</h3>
                      <p className="mt-2 text-xs text-purple-600">Per booking</p>
                    </div>
                  </div>

                  {/* Bookings by Package */}
                  {confirmedBookingsSummary.byPackage && confirmedBookingsSummary.byPackage.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <div className="p-6 bg-white rounded-lg border border-gray-200">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Bookings by Package</h3>
                        {confirmedBookingsSummary.byPackage.length > 0 ? (
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={confirmedBookingsSummary.byPackage}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="package_name" angle={-45} textAnchor="end" height={100} />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="booking_count" fill="#3b82f6" name="Bookings" />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <p className="py-8 text-center text-gray-600">No package data available</p>
                        )}
                      </div>

                      <div className="p-6 bg-white rounded-lg border border-gray-200">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Package Details</h3>
                        <div className="space-y-3">
                          {confirmedBookingsSummary.byPackage.map((pkg) => (
                            <div key={pkg.package_name || 'unknown'} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-900">{pkg.package_name || 'Custom Package'}</span>
                                <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">{pkg.booking_count}</span>
                              </div>
                              <div className="text-xs text-gray-600">
                                Avg Price: Rs. {(pkg.avg_price || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bookings by Vehicle Type */}
                  {confirmedBookingsSummary.byVehicleType && confirmedBookingsSummary.byVehicleType.length > 0 && (
                    <div className="p-6 bg-white rounded-lg border border-gray-200">
                      <h3 className="mb-4 text-lg font-semibold text-gray-900">Bookings by Vehicle Type</h3>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {confirmedBookingsSummary.byVehicleType.map((vehicle) => (
                          <div key={vehicle.vehicle_type} className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
                            <p className="mb-2 text-sm font-medium text-indigo-700">{vehicle.vehicle_type || 'Not Specified'}</p>
                            <h3 className="text-2xl font-bold text-indigo-900">{vehicle.booking_count}</h3>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Confirmed Bookings List */}
              <div className="p-6 bg-white rounded-lg border border-gray-200">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Confirmed Bookings</h3>
                {confirmedBookings.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 font-semibold text-left text-gray-900">Booking ID</th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-900">User Name</th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-900">Email</th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-900">Package</th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-900">Vehicle</th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-900">Price</th>
                            <th className="px-4 py-3 font-semibold text-left text-gray-900">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {confirmedBookings.map((booking) => (
                            <tr key={booking.booking_id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-semibold text-gray-900">#{booking.booking_id}</td>
                              <td className="px-4 py-3 text-gray-900">
                                {booking.first_name && booking.last_name 
                                  ? `${booking.first_name} ${booking.last_name}`
                                  : booking.fullname || 'N/A'
                                }
                              </td>
                              <td className="px-4 py-3 text-gray-600 text-xs">{booking.email || 'N/A'}</td>
                              <td className="px-4 py-3 text-gray-900">{booking.package_name || 'Custom'}</td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
                                  {booking.vehicle_type || 'Standard'}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-semibold text-gray-900">
                                Rs. {(booking.estimated_price || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}
                              </td>
                              <td className="px-4 py-3 text-gray-600 text-xs">
                                {new Date(booking.booking_created_at).toLocaleDateString('en-US')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center mt-6 gap-2">
                      <button
                        onClick={() => setBookingPage(Math.max(1, bookingPage - 1))}
                        disabled={bookingPage === 1}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {bookingPage} of {bookingTotalPages}
                      </span>
                      <button
                        onClick={() => setBookingPage(Math.min(bookingTotalPages, bookingPage + 1))}
                        disabled={bookingPage === bookingTotalPages}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                      >
                        Next
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="py-12 text-center text-gray-600">No confirmed bookings found</p>
                )}
              </div>
            </div>
          )}

          {/* Engagement Tab */}
          {activeTab === 'engagement' && (
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-lg border border-gray-200">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">User Activity & Engagement</h3>
                {engagementData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="activeUsers"
                        stroke="#3b82f6"
                        name="Daily Active Users"
                        dot={{ fill: '#3b82f6' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="avgLoginFrequency"
                        stroke="#f59e0b"
                        name="Avg Login Frequency"
                        dot={{ fill: '#f59e0b' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="py-12 text-center text-gray-600">No engagement data available</p>
                )}
              </div>

              {/* Engagement Metrics */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="mb-2 text-sm font-medium text-blue-700">Avg Daily Active Users</p>
                  <h3 className="text-3xl font-bold text-blue-900">
                    {engagementData.length > 0
                      ? Math.round(
                          engagementData.reduce((sum, item) => sum + (item.activeUsers || 0), 0) /
                          engagementData.length
                        )
                      : 0}
                  </h3>
                </div>
                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <p className="mb-2 text-sm font-medium text-green-700">Avg Login Frequency</p>
                  <h3 className="text-3xl font-bold text-green-900">
                    {engagementData.length > 0
                      ? (
                          engagementData.reduce((sum, item) => sum + (item.avgLoginFrequency || 0), 0) /
                          engagementData.length
                        ).toFixed(1)
                      : 0}
                  </h3>
                </div>
                <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="mb-2 text-sm font-medium text-purple-700">Last 7 Days Activity</p>
                  <h3 className="text-3xl font-bold text-purple-900">
                    {engagementData.length > 0
                      ? engagementData.slice(-7).reduce((sum, item) => sum + (item.activeUsers || 0), 0)
                      : 0}
                  </h3>
                </div>
              </div>

              {/* Last Activity Table */}
              <div className="p-6 bg-white rounded-lg border border-gray-200">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Daily Activity Log</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-left text-gray-900">Date</th>
                        <th className="px-4 py-3 font-semibold text-right text-gray-900">Active Users</th>
                        <th className="px-4 py-3 font-semibold text-right text-gray-900">Logins</th>
                        <th className="px-4 py-3 font-semibold text-right text-gray-900">Avg Session Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {engagementData.slice(-10).reverse().map((item) => (
                        <tr key={item.date} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-semibold text-gray-900">{item.date}</td>
                          <td className="px-4 py-3 text-right text-gray-900">{item.activeUsers || 0}</td>
                          <td className="px-4 py-3 text-right text-gray-900">{item.totalLogins || 0}</td>
                          <td className="px-4 py-3 text-right text-gray-600">
                            {item.avgSessionDuration ? `${Math.round(item.avgSessionDuration)}m` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Reports;
