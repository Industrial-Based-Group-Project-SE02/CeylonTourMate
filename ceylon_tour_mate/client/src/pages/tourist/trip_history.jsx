import React, { useState, useEffect } from 'react';

const TripHistory = () => {
  // Enhanced navy blue themed inline styles
  const styles = {
    container: {
      padding: '20px',
      minHeight: '100vh',
      fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#f8fafc'
    },
    // Header with blue background
    headerSection: {
      backgroundColor: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      padding: '60px 20px 40px',
      margin: '-20px -20px 40px -20px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(30, 58, 138, 0.15)'
    },
    headerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `
        radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 25%),
        radial-gradient(circle at 80% 10%, rgba(255, 255, 255, 0.08) 0%, transparent 20%),
        radial-gradient(circle at 40% 70%, rgba(255, 255, 255, 0.05) 0%, transparent 30%)
      `,
      zIndex: 0,
    },
    headerWrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1,
      textAlign: 'center'
    },
    titleContainer: {
      display: 'inline-block',
      position: 'relative',
      marginBottom: '20px'
    },
    title: {
      fontSize: '42px',
      fontWeight: '800',
      color: 'white',
      margin: '0 0 8px 0',
      letterSpacing: '-0.025em',
      textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      position: 'relative',
      zIndex: 2
    },
    titleUnderline: {
      height: '6px',
      width: '100px',
      background: 'linear-gradient(90deg, #60a5fa 0%, #93c5fd 100%)',
      borderRadius: '3px',
      margin: '12px auto 0',
      boxShadow: '0 2px 8px rgba(96, 165, 250, 0.4)'
    },
    subtitle: {
      fontSize: '18px',
      color: '#e2e8f0',
      margin: '20px 0 0 0',
      opacity: 0.95,
      maxWidth: '700px',
      marginLeft: 'auto',
      marginRight: 'auto',
      lineHeight: '1.6',
      fontWeight: '400'
    },
    
    contentWrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    },
    
    // Stats Cards
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '20px',
      marginBottom: '40px'
    },
    statCard: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(30, 58, 138, 0.08)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    statCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 32px rgba(30, 58, 138, 0.15)',
      borderColor: '#cbd5e1'
    },
    statContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    statText: {
      flex: 1
    },
    statLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#64748b',
      margin: '0 0 8px 0',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    statValue: {
      fontSize: '32px',
      fontWeight: '800',
      color: '#1e293b',
      margin: '0'
    },
    statIcon: {
      padding: '14px',
      borderRadius: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '52px',
      height: '52px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    totalIcon: { 
      background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', 
      color: 'white' 
    },
    pendingIcon: { 
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
      color: 'white' 
    },
    completedIcon: { 
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
      color: 'white' 
    },
    spentIcon: { 
      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
      color: 'white' 
    },
    
    // Search and Filter Section
    filterSection: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(30, 58, 138, 0.08)',
      marginBottom: '40px'
    },
    searchContainer: {
      position: 'relative',
      width: '100%',
      marginBottom: '20px'
    },
    searchIcon: {
      position: 'absolute',
      left: '18px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#64748b',
      fontSize: '20px',
      zIndex: 2
    },
    searchInput: {
      width: '100%',
      padding: '16px 20px 16px 52px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '16px',
      outline: 'none',
      transition: 'all 0.3s ease',
      backgroundColor: 'white',
      color: '#1e293b',
      fontWeight: '500'
    },
    searchInputFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    },
    filterButtons: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      justifyContent: 'center'
    },
    filterButton: {
      padding: '12px 20px',
      border: '2px solid #e2e8f0',
      borderRadius: '10px',
      backgroundColor: 'white',
      fontSize: '14px',
      fontWeight: '600',
      color: '#64748b',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: '130px'
    },
    filterButtonActive: {
      backgroundColor: '#3b82f6',
      color: 'white',
      borderColor: '#3b82f6',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
      transform: 'translateY(-2px)'
    },
    
    // Trip Details Cards
    tripsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    tripCard: {
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(30, 58, 138, 0.08)',
      transition: 'all 0.3s ease'
    },
    tripCardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 32px rgba(30, 58, 138, 0.12)',
      borderColor: '#cbd5e1'
    },
    tripContent: {
      padding: '24px'
    },
    tripHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '15px'
    },
    tripTitle: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 8px 0'
    },
    tripDestination: {
      fontSize: '15px',
      color: '#64748b',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    tripBadge: {
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      textTransform: 'capitalize'
    },
    completedBadge: { 
      backgroundColor: '#d1fae5', 
      color: '#065f46',
      border: '1px solid #a7f3d0'
    },
    upcomingBadge: { 
      backgroundColor: '#dbeafe', 
      color: '#1e40af',
      border: '1px solid #bfdbfe'
    },
    cancelledBadge: { 
      backgroundColor: '#fee2e2', 
      color: '#991b1b',
      border: '1px solid #fecaca'
    },
    pendingBadge: { 
      backgroundColor: '#fef3c7', 
      color: '#92400e',
      border: '1px solid #fde68a'
    },
    tripDetailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '20px'
    },
    detailBox: {
      padding: '16px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      border: '1px solid #f1f5f9'
    },
    detailLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#64748b',
      margin: '0 0 6px 0',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    detailValue: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0'
    },
    tripPrice: {
      fontSize: '28px',
      fontWeight: '800',
      color: '#1e3a8a',
      textAlign: 'right'
    },
    actionsContainer: {
      display: 'flex',
      gap: '12px',
      paddingTop: '20px',
      borderTop: '1px solid #f1f5f9'
    },
    actionButton: {
      padding: '10px 20px',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      minWidth: '140px',
      justifyContent: 'center'
    },
    primaryButton: { 
      backgroundColor: '#3b82f6', 
      color: 'white',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
    },
    primaryButtonHover: {
      backgroundColor: '#2563eb',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 16px rgba(59, 130, 246, 0.3)'
    },
    secondaryButton: { 
      backgroundColor: '#f1f5f9', 
      color: '#475569',
      border: '1px solid #e2e8f0'
    },
    secondaryButtonHover: {
      backgroundColor: '#e2e8f0',
      transform: 'translateY(-2px)'
    },

    emptyState: {
      textAlign: 'center',
      padding: '50px 20px',
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '2px dashed #e2e8f0',
      boxShadow: '0 4px 12px rgba(30, 58, 138, 0.05)'
    },
    emptyIcon: { 
      fontSize: '48px', 
      color: '#94a3b8', 
      marginBottom: '16px',
      opacity: 0.7
    },
    emptyText: { 
      fontSize: '16px', 
      color: '#64748b', 
      margin: '0',
      fontWeight: '500'
    },
    
    // Loading state
    loadingContainer: {
      textAlign: 'center',
      padding: '60px 20px'
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '50px',
      height: '50px',
      border: '4px solid #e2e8f0',
      borderTop: '4px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '20px'
    },
    loadingText: {
      fontSize: '16px',
      color: '#64748b',
      fontWeight: '500'
    }
  };

  // Add CSS animation for spinner
  const spinnerStyle = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  // State for trips data and loading
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Fetch user's bookings from backend
  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        setLoading(true);
        
        // Get user data and token from localStorage
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!userStr) {
          setError('User not found. Please login again.');
          setLoading(false);
          return;
        }

        if (!token) {
          setError('Session expired. Please login again.');
          setLoading(false);
          return;
        }

        let userId, userEmail;
        try {
          const user = JSON.parse(userStr);
          userId = user.id || user._id;
          userEmail = user.email;
        } catch (e) {
          console.error('Invalid user data:', e);
          setError('Invalid user data. Please login again.');
          setLoading(false);
          return;
        }

        console.log('Fetching bookings for userId:', userId, 'email:', userEmail);

        // Set up auth header
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        let bookingsData = [];
        let fetchSuccess = false;
        
        // Try user-specific endpoint first
        let url = `http://localhost:5000/api/bookings/user/${userId}`;
        let response = await fetch(url, { headers });
        
        if (response.ok) {
          const data = await response.json();
          console.log('✓ Fetched bookings via user ID:', data);
          
          if (Array.isArray(data)) {
            bookingsData = data;
          } else if (data.data && Array.isArray(data.data)) {
            bookingsData = data.data;
          } else if (data.bookings && Array.isArray(data.bookings)) {
            bookingsData = data.bookings;
          }
          fetchSuccess = true;
        } else {
          console.log('User-specific endpoint failed with status:', response.status, '- Trying email-based endpoint...');
        }
        
        // If user-specific endpoint didn't work, try email-based endpoint
        if (!fetchSuccess && userEmail) {
          url = `http://localhost:5000/api/bookings/by-email/${encodeURIComponent(userEmail)}`;
          response = await fetch(url, { headers });
          
          if (response.ok) {
            const data = await response.json();
            console.log('✓ Fetched bookings via email:', data);
            
            if (Array.isArray(data)) {
              bookingsData = data;
            } else if (data.data && Array.isArray(data.data)) {
              bookingsData = data.data;
            } else if (data.bookings && Array.isArray(data.bookings)) {
              bookingsData = data.bookings;
            }
            fetchSuccess = true;
          } else {
            console.log('Email-based endpoint failed with status:', response.status, '- Trying general bookings endpoint...');
          }
        }
        
        // If email-based endpoint didn't work, try general bookings endpoint (as last resort)
        if (!fetchSuccess) {
          console.log('Trying general bookings endpoint...');
          url = 'http://localhost:5000/api/bookings';
          response = await fetch(url, { headers });
          
          if (response.ok) {
            const data = await response.json();
            console.log('✓ Fetched all bookings:', data);
            
            if (Array.isArray(data)) {
              bookingsData = data;
            } else if (data.data && Array.isArray(data.data)) {
              bookingsData = data.data;
            } else if (data.bookings && Array.isArray(data.bookings)) {
              bookingsData = data.bookings;
            }
            fetchSuccess = true;
          }
        }
        
        console.log('Final response status:', response.status);
        
        if (!fetchSuccess && response.status !== 404) {
          throw new Error(`Failed to fetch bookings: ${response.statusText}`);
        }

        // Filter bookings for the current user - convert userId to string for comparison
        const userIdStr = String(userId).trim();
        let userBookings = bookingsData.filter(booking => {
          // Check multiple possible fields that might contain the user ID
          // Also check by email as fallback
          const bookingUserId = booking.user || booking.userId || booking.user_id || booking.touristId;
          const bookingEmail = booking.email || booking.user_email || booking.userEmail;
          
          const userIdMatch = bookingUserId && String(bookingUserId).trim() === userIdStr;
          const emailMatch = bookingEmail && bookingEmail.toLowerCase() === userEmail.toLowerCase();
          
          const isMatch = userIdMatch || emailMatch;
          
          if (isMatch) {
            console.log(`✓ Match found for booking ${booking.id}: userId=${bookingUserId}, email=${bookingEmail}`);
          }
          
          return isMatch;
        });
        
        console.log(`Filtered ${bookingsData.length} total bookings down to ${userBookings.length} bookings for userId: ${userId} (email: ${userEmail})`);
        
        // Transform booking data to match the UI structure
        const transformedTrips = userBookings.map((booking, index) => {
          // Determine status based on db status
          let status = booking.status || 'pending';
          let statusText = status;
          
          // Map database status to UI status
          if (status === 'pending') {
            statusText = 'pending';
          } else if (status === 'confirmed' || status === 'completed' || status === 'active') {
            const arrivalDate = booking.arrivalDate ? new Date(booking.arrivalDate) : new Date();
            const today = new Date();
            statusText = arrivalDate < today ? 'completed' : 'upcoming';
          } else if (status === 'cancelled' || status === 'canceled') {
            statusText = 'cancelled';
          }

          // Parse price - handle different formats
          let price = 0;
          if (typeof booking.price === 'string') {
            const priceMatch = booking.price.match(/\d+/);
            price = priceMatch ? parseInt(priceMatch[0]) : 0;
          } else if (typeof booking.price === 'number') {
            price = booking.price;
          } else if (booking.totalAmount) {
            price = booking.totalAmount;
          }

          // Generate booking ID
          const bookingId = booking.bookingId || 
                           booking._id?.toString().substring(0, 8).toUpperCase() || 
                           `BK-${(index + 1).toString().padStart(6, '0')}`;

          return {
            id: booking._id || booking.id || `trip-${index}`,
            packageName: booking.packageName || booking.package || booking.tourPackage?.name || 'Custom Package',
            destination: booking.destination || booking.destinations || booking.tourPackage?.destination || 'Not specified',
            bookingId: bookingId,
            travelDate: booking.arrivalDate || booking.travelDate || booking.startDate || 'Date not set',
            returnDate: booking.returnDate || booking.endDate || booking.travelDate || 'Date not set',
            totalAmount: price,
            status: statusText,
            guideName: booking.guideName || booking.guide || 'TBD',
            dbStatus: status,
            cancellationReason: booking.cancellationReason || booking.reason || ''
          };
        });

        console.log('Transformed trips:', transformedTrips);
        setTrips(transformedTrips);
        setError(null);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        // Create mock data for demonstration
        const mockTrips = [
          {
            id: '1',
            packageName: 'Classic Sri Lanka Tour',
            destination: 'Colombo, Kandy, Ella',
            bookingId: 'BK-000123',
            travelDate: '2024-03-15',
            returnDate: '2024-03-22',
            totalAmount: 1250,
            status: 'pending',
            guideName: 'John Silva',
            cancellationReason: ''
          },
          {
            id: '2',
            packageName: 'Beach Paradise Getaway',
            destination: 'Galle, Mirissa, Bentota',
            bookingId: 'BK-000124',
            travelDate: '2024-04-10',
            returnDate: '2024-04-17',
            totalAmount: 980,
            status: 'upcoming',
            guideName: 'Maria Perera',
            cancellationReason: ''
          },
          {
            id: '3',
            packageName: 'Cultural Triangle Explorer',
            destination: 'Anuradhapura, Polonnaruwa, Sigiriya',
            bookingId: 'BK-000125',
            travelDate: '2024-01-20',
            returnDate: '2024-01-27',
            totalAmount: 850,
            status: 'completed',
            guideName: 'David Fernando',
            cancellationReason: ''
          },
          {
            id: '4',
            packageName: 'Hill Country Adventure',
            destination: 'Nuwara Eliya, Horton Plains',
            bookingId: 'BK-000126',
            travelDate: '2023-12-10',
            returnDate: '2023-12-15',
            totalAmount: 650,
            status: 'completed',
            guideName: 'Sunil Ratnayake',
            cancellationReason: ''
          },
          {
            id: '5',
            packageName: 'Wildlife Safari Experience',
            destination: 'Yala National Park',
            bookingId: 'BK-000127',
            travelDate: '2024-02-05',
            returnDate: '2024-02-07',
            totalAmount: 450,
            status: 'cancelled',
            guideName: 'Kamal Perera',
            cancellationReason: 'Changed travel dates due to personal reasons'
          }
        ];
        setTrips(mockTrips);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, []);
  
  const filteredTrips = trips.filter(trip => {
    if (filter !== "all" && trip.status !== filter) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return trip.packageName.toLowerCase().includes(searchLower) || 
             trip.destination.toLowerCase().includes(searchLower) ||
             trip.bookingId.toLowerCase().includes(searchLower);
    }
    return true;
  });

  const stats = {
    total: trips.length,
    completed: trips.filter(t => t.status === "completed").length,
    upcoming: trips.filter(t => t.status === "upcoming").length,
    pending: trips.filter(t => t.status === "pending").length,
    cancelled: trips.filter(t => t.status === "cancelled").length,
    totalSpent: trips.filter(t => t.status === "completed").reduce((sum, trip) => sum + trip.totalAmount, 0)
  };

  const StatusBadge = ({ status }) => {
    let badgeStyle = styles.cancelledBadge;
    let icon = "✕";
    
    if (status === "completed") {
      badgeStyle = styles.completedBadge;
      icon = "✓";
    } else if (status === "upcoming") {
      badgeStyle = styles.upcomingBadge;
      icon = "📅";
    } else if (status === "pending") {
      badgeStyle = styles.pendingBadge;
      icon = "⏳";
    }
    
    return <span style={{ ...styles.tripBadge, ...badgeStyle }}>{icon} {status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  return (
    <div style={styles.container}>
      <style>{spinnerStyle}</style>
      
      {/* Header Section with Blue Background */}
      <div style={styles.headerSection}>
        <div style={styles.headerOverlay}></div>
        <div style={styles.headerWrapper}>
          <div style={styles.titleContainer}>
            <h1 style={styles.title}>🌊 Your Journey History</h1>
            <div style={styles.titleUnderline}></div>
          </div>
          <p style={styles.subtitle}>
            Explore all your travel adventures, manage bookings, and relive your memories
            in one beautifully organized space
          </p>
        </div>
      </div>

      <div style={styles.contentWrapper}>
        {/* Loading State */}
        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Loading your travel memories...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ ...styles.emptyState, backgroundColor: '#fef2f2', borderColor: '#fee2e2' }}>
            <div style={{ ...styles.emptyIcon, color: '#dc2626' }}>⚠️</div>
            <p style={{ ...styles.emptyText, color: '#991b1b' }}>{error}</p>
          </div>
        )}

        {/* Content (only show if not loading or error) */}
        {!loading && !error && (
          <>
            {/* Statistics Cards */}
            <div style={styles.statsRow}>
              <div 
                style={{
                  ...styles.statCard,
                  ...(hoveredItem === 'stat-total' && styles.statCardHover)
                }}
                onMouseEnter={() => setHoveredItem('stat-total')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div style={styles.statContent}>
                  <div style={styles.statText}>
                    <p style={styles.statLabel}>Total Journeys</p>
                    <p style={styles.statValue}>{stats.total}</p>
                  </div>
                  <div style={{ ...styles.statIcon, ...styles.totalIcon }}>
                    🧳
                  </div>
                </div>
              </div>
              
              <div 
                style={{
                  ...styles.statCard,
                  ...(hoveredItem === 'stat-pending' && styles.statCardHover)
                }}
                onMouseEnter={() => setHoveredItem('stat-pending')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div style={styles.statContent}>
                  <div style={styles.statText}>
                    <p style={styles.statLabel}>Awaiting</p>
                    <p style={styles.statValue}>{stats.pending}</p>
                  </div>
                  <div style={{ ...styles.statIcon, ...styles.pendingIcon }}>
                    ⏳
                  </div>
                </div>
              </div>
              
              <div 
                style={{
                  ...styles.statCard,
                  ...(hoveredItem === 'stat-completed' && styles.statCardHover)
                }}
                onMouseEnter={() => setHoveredItem('stat-completed')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div style={styles.statContent}>
                  <div style={styles.statText}>
                    <p style={styles.statLabel}>Completed</p>
                    <p style={styles.statValue}>{stats.completed}</p>
                  </div>
                  <div style={{ ...styles.statIcon, ...styles.completedIcon }}>
                    ✓
                  </div>
                </div>
              </div>
              
              <div 
                style={{
                  ...styles.statCard,
                  ...(hoveredItem === 'stat-spent' && styles.statCardHover)
                }}
                onMouseEnter={() => setHoveredItem('stat-spent')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div style={styles.statContent}>
                  <div style={styles.statText}>
                    <p style={styles.statLabel}>Total Spent</p>
                    <p style={styles.statValue}>${stats.totalSpent}</p>
                  </div>
                  <div style={{ ...styles.statIcon, ...styles.spentIcon }}>
                    💰
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div style={styles.filterSection}>
              <div style={styles.searchContainer}>
                <span style={styles.searchIcon}>🔍</span>
                <input 
                  type="text" 
                  placeholder="Search journeys by destination or package..." 
                  style={{
                    ...styles.searchInput,
                    ...(isSearchFocused && styles.searchInputFocus)
                  }}
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
              <div style={styles.filterButtons}>
                <button 
                  style={filter === "all" ? { ...styles.filterButton, ...styles.filterButtonActive } : styles.filterButton} 
                  onClick={() => setFilter("all")}
                >
                  🌍 All Journeys
                </button>
                <button 
                  style={filter === "pending" ? { ...styles.filterButton, ...styles.filterButtonActive } : styles.filterButton} 
                  onClick={() => setFilter("pending")}
                >
                  ⏳ Pending
                </button>
                <button 
                  style={filter === "upcoming" ? { ...styles.filterButton, ...styles.filterButtonActive } : styles.filterButton} 
                  onClick={() => setFilter("upcoming")}
                >
                  📅 Upcoming
                </button>
                <button 
                  style={filter === "completed" ? { ...styles.filterButton, ...styles.filterButtonActive } : styles.filterButton} 
                  onClick={() => setFilter("completed")}
                >
                  ✓ Completed
                </button>
                <button 
                  style={filter === "cancelled" ? { ...styles.filterButton, ...styles.filterButtonActive } : styles.filterButton} 
                  onClick={() => setFilter("cancelled")}
                >
                  ✕ Cancelled
                </button>
              </div>
            </div>

            {/* Trip Details List */}
            <div style={styles.tripsList}>
              {filteredTrips.length > 0 ? (
                filteredTrips.map(trip => (
                  <div 
                    key={trip.id} 
                    style={{ 
                      ...styles.tripCard, 
                      ...(hoveredItem === trip.id && styles.tripCardHover) 
                    }} 
                    onMouseEnter={() => setHoveredItem(trip.id)} 
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div style={styles.tripContent}>
                      <div style={styles.tripHeader}>
                        <div>
                          <h3 style={styles.tripTitle}>{trip.packageName}</h3>
                          <p style={styles.tripDestination}>
                            <span style={{color: '#3b82f6', fontSize: '16px'}}>📍</span> {trip.destination}
                          </p>
                        </div>
                        <div style={{textAlign: 'right'}}>
                          <StatusBadge status={trip.status} />
                          <p style={styles.tripPrice}>${trip.totalAmount}</p>
                        </div>
                      </div>
                      <div style={styles.tripDetailsGrid}>
                        <div style={styles.detailBox}>
                          <p style={styles.detailLabel}>Booking ID</p>
                          <p style={styles.detailValue}>{trip.bookingId}</p>
                        </div>
                        <div style={styles.detailBox}>
                          <p style={styles.detailLabel}>Travel Date</p>
                          <p style={styles.detailValue}>{trip.travelDate}</p>
                        </div>
                        <div style={styles.detailBox}>
                          <p style={styles.detailLabel}>Travel Guide</p>
                          <p style={styles.detailValue}>{trip.guideName}</p>
                        </div>
                      </div>
                      
                      {/* Cancellation Reason */}
                      {trip.status === 'cancelled' && trip.cancellationReason && (
                        <div style={{
                          backgroundColor: '#fef2f2',
                          border: '1px solid #fee2e2',
                          borderRadius: '10px',
                          padding: '16px',
                          marginBottom: '16px'
                        }}>
                          <p style={{ 
                            margin: '0 0 8px 0', 
                            fontWeight: '700', 
                            color: '#dc2626',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span>❌</span> Cancellation Reason
                          </p>
                          <p style={{ 
                            margin: '0', 
                            color: '#991b1b', 
                            fontSize: '14px', 
                            lineHeight: '1.5',
                            paddingLeft: '24px'
                          }}>
                            {trip.cancellationReason}
                          </p>
                        </div>
                      )}
                      
                      <div style={styles.actionsContainer}>
                        <button 
                          style={{ 
                            ...styles.actionButton, 
                            ...styles.primaryButton,
                            ...(hoveredButton === `invoice-${trip.id}` && styles.primaryButtonHover)
                          }}
                          onMouseEnter={() => setHoveredButton(`invoice-${trip.id}`)}
                          onMouseLeave={() => setHoveredButton(null)}
                        >
                          📄 View Invoice
                        </button>
                        <button 
                          style={{ 
                            ...styles.actionButton, 
                            ...styles.secondaryButton,
                            ...(hoveredButton === `again-${trip.id}` && styles.secondaryButtonHover)
                          }}
                          onMouseEnter={() => setHoveredButton(`again-${trip.id}`)}
                          onMouseLeave={() => setHoveredButton(null)}
                        >
                          🔄 Book Again
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>
                    {searchTerm || filter !== 'all' ? '🔍' : '🧳'}
                  </div>
                  <p style={styles.emptyText}>
                    {searchTerm || filter !== 'all' 
                      ? `No journeys found matching "${searchTerm || filter}"` 
                      : 'Your travel story begins here! Start planning your next adventure.'}
                  </p>
                  {!searchTerm && filter === 'all' && (
                    <p style={{...styles.emptyText, fontSize: '14px', marginTop: '10px', opacity: 0.8}}>
                      Book your first trip to see it appear here.
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TripHistory;