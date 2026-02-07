import React, { useState, useEffect } from 'react';

const ViewSchedule = () => {
  // Modern inline styles
  const styles = {
    container: {
      padding: '24px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    },
    header: {
      marginBottom: '32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    },
    titleSection: {
      flex: 1
    },
    title: {
      fontSize: '32px',
      fontWeight: '800',
      color: '#1e293b',
      margin: '0 0 8px 0',
      letterSpacing: '-0.025em'
    },
    subtitle: {
      fontSize: '16px',
      color: '#64748b',
      margin: '0'
    },
    headerActions: {
      display: 'flex',
      gap: '12px'
    },
    primaryButton: {
      padding: '12px 24px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    secondaryButton: {
      padding: '12px 24px',
      backgroundColor: 'white',
      color: '#475569',
      border: '1px solid #cbd5e1',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    successButton: {
      padding: '12px 24px',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    dangerButton: {
      padding: '12px 24px',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    warningButton: {
      padding: '12px 24px',
      backgroundColor: '#f59e0b',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    
    // Statistics Section (Moved to top)
    statsSection: {
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      padding: '24px',
      marginBottom: '32px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px'
    },
    statItem: {
      textAlign: 'center',
      padding: '20px',
      borderRadius: '12px',
      transition: 'all 0.3s ease'
    },
    statItemHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)'
    },
    statIcon: {
      fontSize: '32px',
      marginBottom: '12px'
    },
    statValue: {
      fontSize: '28px',
      fontWeight: '800',
      color: '#1e293b',
      margin: '0 0 4px 0'
    },
    statLabel: {
      fontSize: '14px',
      color: '#64748b',
      margin: '0'
    },
    
    // Calendar Navigation
    calendarNav: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      marginBottom: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    },
    navControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    navButton: {
      padding: '10px 16px',
      backgroundColor: '#f1f5f9',
      color: '#475569',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    currentMonth: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0'
    },
    viewToggle: {
      display: 'flex',
      gap: '8px'
    },
    viewButton: {
      padding: '10px 20px',
      backgroundColor: '#f1f5f9',
      color: '#475569',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    viewButtonActive: {
      backgroundColor: '#3b82f6',
      color: 'white'
    },
    
    // Calendar Grid
    calendarGrid: {
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      marginBottom: '32px'
    },
    weekDays: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0'
    },
    weekDay: {
      padding: '16px',
      textAlign: 'center',
      fontSize: '14px',
      fontWeight: '700',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    daysGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gridTemplateRows: 'repeat(6, 1fr)',
      minHeight: '600px'
    },
    dayCell: {
      padding: '16px',
      borderRight: '1px solid #e2e8f0',
      borderBottom: '1px solid #e2e8f0',
      position: 'relative',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      backgroundColor: 'white'
    },
    dayCellInactive: {
      backgroundColor: '#f8fafc',
      color: '#94a3b8'
    },
    dayCellToday: {
      backgroundColor: '#dbeafe',
      borderColor: '#3b82f6'
    },
    dayCellSelected: {
      backgroundColor: '#eff6ff',
      borderColor: '#3b82f6'
    },
    dayNumber: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '12px'
    },
    dayTours: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxHeight: '120px',
      overflowY: 'auto'
    },
    tourBadge: {
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '600',
      marginBottom: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      borderLeft: '3px solid'
    },
    pendingTour: {
      backgroundColor: '#fef3c7',
      borderLeftColor: '#f59e0b',
      color: '#92400e'
    },
    confirmedTour: {
      backgroundColor: '#d1fae5',
      borderLeftColor: '#10b981',
      color: '#047857'
    },
    ongoingTour: {
      backgroundColor: '#dbeafe',
      borderLeftColor: '#3b82f6',
      color: '#1e40af'
    },
    completedTour: {
      backgroundColor: '#f1f5f9',
      borderLeftColor: '#64748b',
      color: '#334155'
    },
    rejectedTour: {
      backgroundColor: '#fee2e2',
      borderLeftColor: '#ef4444',
      color: '#991b1b'
    },
    cancelledTour: {
      backgroundColor: '#f1f5f9',
      borderLeftColor: '#94a3b8',
      color: '#475569',
      textDecoration: 'line-through'
    },
    
    // Schedule List
    scheduleList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '24px',
      marginBottom: '32px'
    },
    scheduleCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },
    scheduleCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)'
    },
    scheduleHeader: {
      padding: '20px 24px',
      borderBottom: '1px solid #f1f5f9',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    scheduleTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0'
    },
    scheduleDate: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#3b82f6',
      padding: '6px 12px',
      backgroundColor: '#dbeafe',
      borderRadius: '20px'
    },
    scheduleStatus: {
      fontSize: '12px',
      fontWeight: '600',
      padding: '4px 10px',
      borderRadius: '12px',
      textTransform: 'uppercase'
    },
    scheduleContent: {
      padding: '24px'
    },
    scheduleInfo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      marginBottom: '20px'
    },
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    infoIcon: {
      color: '#64748b',
      fontSize: '16px'
    },
    infoText: {
      fontSize: '14px',
      color: '#475569',
      margin: '0'
    },
    infoValue: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0'
    },
    scheduleActions: {
      display: 'flex',
      gap: '12px',
      paddingTop: '20px',
      borderTop: '1px solid #f1f5f9'
    },
    
    // Upcoming Tours
    upcomingSection: {
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      padding: '24px'
    },
    upcomingList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    upcomingItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      borderLeft: '4px solid',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    upcomingItemHover: {
      backgroundColor: '#f1f5f9',
      transform: 'translateX(4px)'
    },
    upcomingTime: {
      minWidth: '100px',
      textAlign: 'center',
      padding: '8px 12px',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    },
    timeLabel: {
      fontSize: '12px',
      color: '#64748b',
      margin: '0 0 4px 0'
    },
    timeValue: {
      fontSize: '14px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0'
    },
    upcomingDetails: {
      flex: 1
    },
    upcomingTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0 0 4px 0'
    },
    upcomingLocation: {
      fontSize: '14px',
      color: '#64748b',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    
    // Status Badge Colors
    statusPending: {
      backgroundColor: '#fef3c7',
      color: '#92400e'
    },
    statusConfirmed: {
      backgroundColor: '#d1fae5',
      color: '#047857'
    },
    statusOngoing: {
      backgroundColor: '#dbeafe',
      color: '#1e40af'
    },
    statusCompleted: {
      backgroundColor: '#f1f5f9',
      color: '#334155'
    },
    statusRejected: {
      backgroundColor: '#fee2e2',
      color: '#991b1b'
    },
    statusCancelled: {
      backgroundColor: '#f1f5f9',
      color: '#64748b',
      textDecoration: 'line-through'
    }
  };

  // State management
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [tours, setTours] = useState([]);

  // Get current month and year
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Mock data - In real app, this would come from API
  const initialTours = [
    {
      id: 1,
      name: "Colombo City Tour",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
      time: "09:00 AM - 05:00 PM",
      location: "Colombo, Sri Lanka",
      tourists: 8,
      vehicle: "Toyota Hiace",
      duration: "Full Day",
      status: "pending",
      assignedBy: "Manager John",
      assignedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
      managerNotes: "Please ensure vehicle is clean and fuel is full",
      tourType: "city"
    },
    {
      id: 2,
      name: "Kandy Temple Visit",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 18),
      time: "07:00 AM - 02:00 PM",
      location: "Kandy, Sri Lanka",
      tourists: 12,
      vehicle: "Luxury Coach",
      duration: "Morning",
      status: "confirmed",
      assignedBy: "Manager Sarah",
      assignedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 12),
      managerNotes: "Pickup from hotel at 6:30 AM sharp",
      tourType: "cultural"
    },
    {
      id: 3,
      name: "Galle Fort Exploration",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 20),
      time: "02:00 PM - 08:00 PM",
      location: "Galle, Sri Lanka",
      tourists: 6,
      vehicle: "Toyota Hiace",
      duration: "Afternoon",
      status: "ongoing",
      assignedBy: "Manager David",
      assignedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
      managerNotes: "Include light house visit in itinerary",
      tourType: "historical"
    },
    {
      id: 4,
      name: "Negombo Beach Sunset",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 22),
      time: "04:00 PM - 09:00 PM",
      location: "Negombo, Sri Lanka",
      tourists: 4,
      vehicle: "SUV",
      duration: "Evening",
      status: "rejected",
      assignedBy: "Manager Lisa",
      assignedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 18),
      managerNotes: "Family of 4 with children",
      rejectionReason: "Vehicle not available",
      tourType: "leisure"
    },
    {
      id: 5,
      name: "Sigiriya Rock Climb",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 25),
      time: "06:00 AM - 07:00 PM",
      location: "Sigiriya, Sri Lanka",
      tourists: 10,
      vehicle: "Luxury Coach",
      duration: "Full Day",
      status: "completed",
      assignedBy: "Manager John",
      assignedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 20),
      managerNotes: "Include packed lunch and water bottles",
      tourType: "adventure"
    },
    {
      id: 6,
      name: "Ella Nature Walk",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 28),
      time: "08:00 AM - 04:00 PM",
      location: "Ella, Sri Lanka",
      tourists: 8,
      vehicle: "Mini Van",
      duration: "Day Trip",
      status: "cancelled",
      assignedBy: "Manager Sarah",
      assignedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 22),
      managerNotes: "Medium difficulty hike, include first aid",
      cancellationReason: "Personal emergency - family matter",
      tourType: "nature"
    },
    {
      id: 7,
      name: "Bentota Water Sports",
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 30),
      time: "10:00 AM - 04:00 PM",
      location: "Bentota, Sri Lanka",
      tourists: 6,
      vehicle: "Van",
      duration: "Day Trip",
      status: "confirmed",
      assignedBy: "Manager David",
      assignedDate: new Date(new Date().getFullYear(), new Date().getMonth(), 25),
      managerNotes: "Water sports activities included",
      tourType: "adventure"
    }
  ];

  useEffect(() => {
    // In real app, fetch tours from API
    setTours(initialTours);
  }, []);

  // Statistics
  const stats = {
    totalTours: tours.length,
    thisMonth: tours.filter(tour => 
      tour.date.getMonth() === new Date().getMonth() && 
      tour.date.getFullYear() === new Date().getFullYear()
    ).length,
    pending: tours.filter(tour => tour.status === 'pending').length,
    confirmed: tours.filter(tour => tour.status === 'confirmed').length,
    ongoing: tours.filter(tour => tour.status === 'ongoing').length,
    completed: tours.filter(tour => tour.status === 'completed').length,
    cancelled: tours.filter(tour => tour.status === 'cancelled').length
  };

  // Upcoming tours for today
  const today = new Date();
  const upcomingTours = tours
    .filter(tour => {
      const tourDate = new Date(tour.date);
      return tourDate.toDateString() === today.toDateString() && 
             tour.status !== 'completed' && 
             tour.status !== 'rejected' &&
             tour.status !== 'cancelled';
    })
    .sort((a, b) => {
      const timeA = parseInt(a.time.split(':')[0]);
      const timeB = parseInt(b.time.split(':')[0]);
      return timeA - timeB;
    });

  // Generate calendar days
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Add previous month's trailing days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const firstDayOfWeek = firstDay.getDay();
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      days.push({
        date: new Date(year, month - 1, day),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      days.push({
        date: dayDate,
        isCurrentMonth: true,
        isToday: dayDate.toDateString() === today.toDateString()
      });
    }
    
    // Add next month's leading days
    const totalCells = 42; // 6 weeks * 7 days
    const nextMonthDays = totalCells - days.length;
    
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    return days;
  };

  // Get tours for a specific date
  const getToursForDate = (date) => {
    return tours.filter(tour => {
      const tourDate = new Date(tour.date);
      return tourDate.getDate() === date.getDate() &&
             tourDate.getMonth() === date.getMonth() &&
             tourDate.getFullYear() === date.getFullYear();
    });
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  // Get tour badge style based on status
  const getTourBadgeStyle = (status) => {
    switch(status) {
      case 'pending': return { ...styles.tourBadge, ...styles.pendingTour };
      case 'confirmed': return { ...styles.tourBadge, ...styles.confirmedTour };
      case 'ongoing': return { ...styles.tourBadge, ...styles.ongoingTour };
      case 'completed': return { ...styles.tourBadge, ...styles.completedTour };
      case 'rejected': return { ...styles.tourBadge, ...styles.rejectedTour };
      case 'cancelled': return { ...styles.tourBadge, ...styles.cancelledTour };
      default: return styles.tourBadge;
    }
  };

  // Get status badge style
  const getStatusBadgeStyle = (status) => {
    switch(status) {
      case 'pending': return { ...styles.scheduleStatus, ...styles.statusPending };
      case 'confirmed': return { ...styles.scheduleStatus, ...styles.statusConfirmed };
      case 'ongoing': return { ...styles.scheduleStatus, ...styles.statusOngoing };
      case 'completed': return { ...styles.scheduleStatus, ...styles.statusCompleted };
      case 'rejected': return { ...styles.scheduleStatus, ...styles.statusRejected };
      case 'cancelled': return { ...styles.scheduleStatus, ...styles.statusCancelled };
      default: return styles.scheduleStatus;
    }
  };

  // Tour actions
  const handleStartTour = (tourId) => {
    setTours(tours.map(tour => 
      tour.id === tourId ? { ...tour, status: 'ongoing' } : tour
    ));
    alert(`Tour #${tourId} started!`);
  };

  const handleRejectTour = (tourId) => {
    const reason = prompt("Please provide reason for rejecting this tour assignment:");
    if (reason && reason.trim()) {
      setTours(tours.map(tour => 
        tour.id === tourId ? { ...tour, status: 'rejected', rejectionReason: reason } : tour
      ));
      alert(`Tour #${tourId} rejected. Reason: ${reason}`);
    } else if (reason !== null) {
      alert("Please provide a reason for rejection.");
    }
  };

  const handleCancelTour = (tourId) => {
    const reason = prompt("Please provide reason for cancelling this tour:\n\nCommon reasons:\n• Personal emergency\n• Vehicle issues\n• Health problems\n• Family matters\n• Other commitments");
    
    if (reason && reason.trim()) {
      setTours(tours.map(tour => 
        tour.id === tourId ? { ...tour, status: 'cancelled', cancellationReason: reason } : tour
      ));
      alert(`Tour #${tourId} cancelled. Reason: ${reason}\n\nNote: Manager will be notified and may reassign this tour.`);
    } else if (reason !== null) {
      alert("Please provide a reason for cancellation.");
    }
  };

  const handleCompleteTour = (tourId) => {
    setTours(tours.map(tour => 
      tour.id === tourId ? { ...tour, status: 'completed' } : tour
    ));
    alert(`Tour #${tourId} marked as completed!`);
  };

  const handleConfirmTour = (tourId) => {
    setTours(tours.map(tour => 
      tour.id === tourId ? { ...tour, status: 'confirmed' } : tour
    ));
    alert(`Tour #${tourId} confirmed!`);
  };

  const getTourIcon = (tourType) => {
    switch(tourType) {
      case 'city': return '🏙️';
      case 'cultural': return '🕌';
      case 'historical': return '🏰';
      case 'leisure': return '🏖️';
      case 'adventure': return '⛰️';
      case 'nature': return '🌿';
      default: return '📍';
    }
  };

  // Calendar days
  const calendarDays = getDaysInMonth(currentMonth);

  return (
    <div style={styles.container}>
      
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>📅 My Tour Schedule</h1>
          <p style={styles.subtitle}>View and manage tours assigned by managers</p>
        </div>
        <div style={styles.headerActions}>
          <button
            style={hoveredButton === 'refresh' ? { ...styles.primaryButton, ...styles.buttonHover } : styles.primaryButton}
            onMouseEnter={() => setHoveredButton('refresh')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => window.location.reload()}
          >
            <span>🔄</span>
            Refresh Schedule
          </button>
        </div>
      </div>

      {/* Statistics Section - Moved to top */}
      <div style={styles.statsSection}>
        <h2 style={{ ...styles.currentMonth, marginBottom: '24px' }}>📊 My Schedule Statistics</h2>
        <div style={styles.statsGrid}>
          <div 
            style={{
              ...styles.statItem,
              backgroundColor: '#f0f9ff',
              ...(hoveredItem === 'stat-total' && styles.statItemHover)
            }}
            onMouseEnter={() => setHoveredItem('stat-total')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div style={{ ...styles.statIcon, color: '#0ea5e9' }}>🗓️</div>
            <p style={styles.statValue}>{stats.totalTours}</p>
            <p style={styles.statLabel}>Total Assigned</p>
          </div>
          
          <div 
            style={{
              ...styles.statItem,
              backgroundColor: '#fef3c7',
              ...(hoveredItem === 'stat-pending' && styles.statItemHover)
            }}
            onMouseEnter={() => setHoveredItem('stat-pending')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div style={{ ...styles.statIcon, color: '#f59e0b' }}>⏳</div>
            <p style={styles.statValue}>{stats.pending}</p>
            <p style={styles.statLabel}>Pending</p>
          </div>
          
          <div 
            style={{
              ...styles.statItem,
              backgroundColor: '#d1fae5',
              ...(hoveredItem === 'stat-confirmed' && styles.statItemHover)
            }}
            onMouseEnter={() => setHoveredItem('stat-confirmed')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div style={{ ...styles.statIcon, color: '#10b981' }}>✅</div>
            <p style={styles.statValue}>{stats.confirmed}</p>
            <p style={styles.statLabel}>Confirmed</p>
          </div>
          
          <div 
            style={{
              ...styles.statItem,
              backgroundColor: '#dbeafe',
              ...(hoveredItem === 'stat-ongoing' && styles.statItemHover)
            }}
            onMouseEnter={() => setHoveredItem('stat-ongoing')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div style={{ ...styles.statIcon, color: '#3b82f6' }}>🚗</div>
            <p style={styles.statValue}>{stats.ongoing}</p>
            <p style={styles.statLabel}>Ongoing</p>
          </div>
          
          <div 
            style={{
              ...styles.statItem,
              backgroundColor: '#f1f5f9',
              ...(hoveredItem === 'stat-completed' && styles.statItemHover)
            }}
            onMouseEnter={() => setHoveredItem('stat-completed')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div style={{ ...styles.statIcon, color: '#64748b' }}>🏁</div>
            <p style={styles.statValue}>{stats.completed}</p>
            <p style={styles.statLabel}>Completed</p>
          </div>
          
          <div 
            style={{
              ...styles.statItem,
              backgroundColor: '#fee2e2',
              ...(hoveredItem === 'stat-rejected' && styles.statItemHover)
            }}
            onMouseEnter={() => setHoveredItem('stat-rejected')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div style={{ ...styles.statIcon, color: '#ef4444' }}>✗</div>
            <p style={styles.statValue}>{stats.cancelled + stats.rejected}</p>
            <p style={styles.statLabel}>Cancelled/Rejected</p>
          </div>
          
          <div 
            style={{
              ...styles.statItem,
              backgroundColor: '#f8fafc',
              ...(hoveredItem === 'stat-month' && styles.statItemHover)
            }}
            onMouseEnter={() => setHoveredItem('stat-month')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div style={{ ...styles.statIcon, color: '#8b5cf6' }}>📅</div>
            <p style={styles.statValue}>{stats.thisMonth}</p>
            <p style={styles.statLabel}>This Month</p>
          </div>
          
          <div 
            style={{
              ...styles.statItem,
              backgroundColor: '#fdf4ff',
              ...(hoveredItem === 'stat-rate' && styles.statItemHover)
            }}
            onMouseEnter={() => setHoveredItem('stat-rate')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div style={{ ...styles.statIcon, color: '#d946ef' }}>⭐</div>
            <p style={styles.statValue}>
              {stats.totalTours > 0 
                ? Math.round(((stats.completed) / (stats.totalTours - stats.pending)) * 100) || 0
                : 0
              }%
            </p>
            <p style={styles.statLabel}>Completion Rate</p>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div style={styles.calendarNav}>
        <div style={styles.navControls}>
          <button
            style={styles.navButton}
            onClick={goToPreviousMonth}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span>←</span>
            Previous
          </button>
          <h2 style={styles.currentMonth}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          <button
            style={styles.navButton}
            onClick={goToNextMonth}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Next
            <span>→</span>
          </button>
          <button
            style={styles.navButton}
            onClick={goToToday}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span>📌</span>
            Today
          </button>
        </div>
        <div style={styles.viewToggle}>
          <button
            style={viewMode === 'month' ? { ...styles.viewButton, ...styles.viewButtonActive } : styles.viewButton}
            onClick={() => setViewMode('month')}
          >
            Month
          </button>
          <button
            style={viewMode === 'week' ? { ...styles.viewButton, ...styles.viewButtonActive } : styles.viewButton}
            onClick={() => setViewMode('week')}
          >
            Week
          </button>
          <button
            style={viewMode === 'day' ? { ...styles.viewButton, ...styles.viewButtonActive } : styles.viewButton}
            onClick={() => setViewMode('day')}
          >
            Day
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={styles.calendarGrid}>
        <div style={styles.weekDays}>
          {weekDays.map((day, index) => (
            <div key={index} style={styles.weekDay}>
              {day}
            </div>
          ))}
        </div>
        <div style={styles.daysGrid}>
          {calendarDays.map((day, index) => {
            const dayTours = getToursForDate(day.date);
            const isSelected = selectedDate.toDateString() === day.date.toDateString();
            
            return (
              <div
                key={index}
                style={{
                  ...styles.dayCell,
                  ...(!day.isCurrentMonth && styles.dayCellInactive),
                  ...(day.isToday && styles.dayCellToday),
                  ...(isSelected && styles.dayCellSelected)
                }}
                onClick={() => setSelectedDate(day.date)}
                onMouseEnter={(e) => {
                  if (day.isCurrentMonth) {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (day.isCurrentMonth) {
                    e.currentTarget.style.backgroundColor = 
                      isSelected ? '#eff6ff' : 
                      day.isToday ? '#dbeafe' : 'white';
                  }
                }}
              >
                <div style={styles.dayNumber}>
                  {day.date.getDate()}
                  {day.isToday && <span style={{ marginLeft: '4px', fontSize: '10px', color: '#3b82f6' }}>•</span>}
                </div>
                <div style={styles.dayTours}>
                  {dayTours.slice(0, 3).map((tour, idx) => (
                    <div
                      key={idx}
                      style={getTourBadgeStyle(tour.status)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(4px)';
                        setHoveredItem(`tour-${tour.id}`);
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                        setHoveredItem(null);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDate(new Date(tour.date));
                      }}
                    >
                      {getTourIcon(tour.tourType)} {tour.name}
                    </div>
                  ))}
                  {dayTours.length > 3 && (
                    <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center' }}>
                      +{dayTours.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Tours */}
      <h2 style={{ ...styles.currentMonth, marginBottom: '16px' }}>
        Tours for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </h2>
      
      {getToursForDate(selectedDate).length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '16px',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
          <h3 style={{ color: '#64748b', marginBottom: '8px' }}>No tours scheduled</h3>
          <p style={{ color: '#94a3b8' }}>You have no tours assigned for this date</p>
        </div>
      ) : (
        <div style={styles.scheduleList}>
          {getToursForDate(selectedDate).map(tour => (
            <div
              key={tour.id}
              style={{
                ...styles.scheduleCard,
                ...(hoveredItem === `card-${tour.id}` && styles.scheduleCardHover)
              }}
              onMouseEnter={() => setHoveredItem(`card-${tour.id}`)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div style={styles.scheduleHeader}>
                <div>
                  <h3 style={styles.scheduleTitle}>{getTourIcon(tour.tourType)} {tour.name}</h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                    Assigned by: <strong>{tour.assignedBy}</strong> on {tour.assignedDate.toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <div style={styles.scheduleDate}>
                    {tour.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div style={getStatusBadgeStyle(tour.status)}>
                    {tour.status.toUpperCase()}
                  </div>
                </div>
              </div>
              
              <div style={styles.scheduleContent}>
                <div style={styles.scheduleInfo}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoIcon}>⏰</span>
                    <div>
                      <p style={styles.infoText}>Time</p>
                      <p style={styles.infoValue}>{tour.time}</p>
                    </div>
                  </div>
                  
                  <div style={styles.infoRow}>
                    <span style={styles.infoIcon}>📍</span>
                    <div>
                      <p style={styles.infoText}>Location</p>
                      <p style={styles.infoValue}>{tour.location}</p>
                    </div>
                  </div>
                  
                  <div style={styles.infoRow}>
                    <span style={styles.infoIcon}>👥</span>
                    <div>
                      <p style={styles.infoText}>Tourists</p>
                      <p style={styles.infoValue}>{tour.tourists} people</p>
                    </div>
                  </div>
                  
                  <div style={styles.infoRow}>
                    <span style={styles.infoIcon}>🚐</span>
                    <div>
                      <p style={styles.infoText}>Vehicle</p>
                      <p style={styles.infoValue}>{tour.vehicle}</p>
                    </div>
                  </div>
                </div>
                
                {tour.managerNotes && (
                  <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 4px 0' }}>
                      <strong>Manager Notes:</strong>
                    </p>
                    <p style={{ fontSize: '14px', color: '#475569', margin: '0' }}>
                      {tour.managerNotes}
                    </p>
                  </div>
                )}
                
                {tour.rejectionReason && (
                  <div style={{
                    backgroundColor: '#fee2e2',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <p style={{ fontSize: '12px', color: '#991b1b', margin: '0 0 4px 0' }}>
                      <strong>Rejection Reason:</strong>
                    </p>
                    <p style={{ fontSize: '14px', color: '#7f1d1d', margin: '0' }}>
                      {tour.rejectionReason}
                    </p>
                  </div>
                )}
                
                {tour.cancellationReason && (
                  <div style={{
                    backgroundColor: '#f1f5f9',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    borderLeft: '3px solid #94a3b8'
                  }}>
                    <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 4px 0' }}>
                      <strong>Cancellation Reason:</strong>
                    </p>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: '0' }}>
                      {tour.cancellationReason}
                    </p>
                  </div>
                )}
                
                <div style={styles.scheduleActions}>
                  {tour.status === 'pending' && (
                    <>
                      <button
                        style={hoveredButton === `confirm-${tour.id}` ? { ...styles.successButton, ...styles.buttonHover } : styles.successButton}
                        onMouseEnter={() => setHoveredButton(`confirm-${tour.id}`)}
                        onMouseLeave={() => setHoveredButton(null)}
                        onClick={() => handleConfirmTour(tour.id)}
                      >
                        <span>✓</span>
                        Accept
                      </button>
                      <button
                        style={hoveredButton === `reject-${tour.id}` ? { ...styles.dangerButton, ...styles.buttonHover } : styles.dangerButton}
                        onMouseEnter={() => setHoveredButton(`reject-${tour.id}`)}
                        onMouseLeave={() => setHoveredButton(null)}
                        onClick={() => handleRejectTour(tour.id)}
                      >
                        <span>✗</span>
                        Reject
                      </button>
                    </>
                  )}
                  
                  {(tour.status === 'confirmed' || tour.status === 'ongoing') && (
                    <>
                      {tour.status === 'confirmed' && (
                        <button
                          style={hoveredButton === `start-${tour.id}` ? { ...styles.successButton, ...styles.buttonHover } : styles.successButton}
                          onMouseEnter={() => setHoveredButton(`start-${tour.id}`)}
                          onMouseLeave={() => setHoveredButton(null)}
                          onClick={() => handleStartTour(tour.id)}
                        >
                          <span>▶️</span>
                          Start Tour
                        </button>
                      )}
                      
                      {tour.status === 'ongoing' && (
                        <button
                          style={hoveredButton === `complete-${tour.id}` ? { ...styles.primaryButton, ...styles.buttonHover } : styles.primaryButton}
                          onMouseEnter={() => setHoveredButton(`complete-${tour.id}`)}
                          onMouseLeave={() => setHoveredButton(null)}
                          onClick={() => handleCompleteTour(tour.id)}
                        >
                          <span>✓</span>
                          Complete Tour
                        </button>
                      )}
                      
                      <button
                        style={hoveredButton === `cancel-${tour.id}` ? { ...styles.warningButton, ...styles.buttonHover } : styles.warningButton}
                        onMouseEnter={() => setHoveredButton(`cancel-${tour.id}`)}
                        onMouseLeave={() => setHoveredButton(null)}
                        onClick={() => handleCancelTour(tour.id)}
                      >
                        <span>🚫</span>
                        Cancel Tour
                      </button>
                    </>
                  )}
                  
                  <button
                    style={hoveredButton === `view-${tour.id}` ? { ...styles.secondaryButton, ...styles.buttonHover } : styles.secondaryButton}
                    onMouseEnter={() => setHoveredButton(`view-${tour.id}`)}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() => alert(`Viewing full details for: ${tour.name}`)}
                  >
                    <span>👁️</span>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming Tours for Today */}
      <div style={styles.upcomingSection}>
        <h2 style={{ ...styles.currentMonth, marginBottom: '24px' }}>
          <span>🎯</span>
          Today's Upcoming Tours ({today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })})
        </h2>
        
        {upcomingTours.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '32px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>😊</div>
            <h3 style={{ color: '#64748b', marginBottom: '8px' }}>No upcoming tours today</h3>
            <p style={{ color: '#94a3b8' }}>Enjoy your day off or check other dates for scheduled tours</p>
          </div>
        ) : (
          <div style={styles.upcomingList}>
            {upcomingTours.map(tour => (
              <div
                key={tour.id}
                style={{
                  ...styles.upcomingItem,
                  borderLeftColor: tour.status === 'ongoing' ? '#3b82f6' : 
                                 tour.status === 'confirmed' ? '#10b981' : '#f59e0b',
                  ...(hoveredItem === `upcoming-${tour.id}` && styles.upcomingItemHover)
                }}
                onMouseEnter={() => setHoveredItem(`upcoming-${tour.id}`)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div style={styles.upcomingTime}>
                  <p style={styles.timeLabel}>START TIME</p>
                  <p style={styles.timeValue}>{tour.time.split(' - ')[0]}</p>
                </div>
                <div style={styles.upcomingDetails}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h4 style={styles.upcomingTitle}>{tour.name}</h4>
                    <div style={getStatusBadgeStyle(tour.status)}>
                      {tour.status.toUpperCase()}
                    </div>
                  </div>
                  <p style={styles.upcomingLocation}>
                    <span>📍</span>
                    {tour.location}
                  </p>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
                    Tourists: {tour.tourists} • Vehicle: {tour.vehicle}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {tour.status === 'confirmed' && (
                    <button
                      style={hoveredButton === `start-today-${tour.id}` ? { ...styles.successButton, ...styles.buttonHover } : styles.successButton}
                      onMouseEnter={() => setHoveredButton(`start-today-${tour.id}`)}
                      onMouseLeave={() => setHoveredButton(null)}
                      onClick={() => handleStartTour(tour.id)}
                    >
                      <span>▶️</span>
                      Start
                    </button>
                  )}
                  {tour.status === 'pending' && (
                    <>
                      <button
                        style={hoveredButton === `confirm-today-${tour.id}` ? { ...styles.successButton, ...styles.buttonHover } : styles.successButton}
                        onMouseEnter={() => setHoveredButton(`confirm-today-${tour.id}`)}
                        onMouseLeave={() => setHoveredButton(null)}
                        onClick={() => handleConfirmTour(tour.id)}
                      >
                        <span>✓</span>
                        Accept
                      </button>
                      <button
                        style={hoveredButton === `reject-today-${tour.id}` ? { ...styles.dangerButton, ...styles.buttonHover } : styles.dangerButton}
                        onMouseEnter={() => setHoveredButton(`reject-today-${tour.id}`)}
                        onMouseLeave={() => setHoveredButton(null)}
                        onClick={() => handleRejectTour(tour.id)}
                      >
                        <span>✗</span>
                        Reject
                      </button>
                    </>
                  )}
                  {tour.status === 'ongoing' && (
                    <>
                      <button
                        style={hoveredButton === `complete-today-${tour.id}` ? { ...styles.primaryButton, ...styles.buttonHover } : styles.primaryButton}
                        onMouseEnter={() => setHoveredButton(`complete-today-${tour.id}`)}
                        onMouseLeave={() => setHoveredButton(null)}
                        onClick={() => handleCompleteTour(tour.id)}
                      >
                        <span>✓</span>
                        Complete
                      </button>
                      <button
                        style={hoveredButton === `cancel-today-${tour.id}` ? { ...styles.warningButton, ...styles.buttonHover } : styles.warningButton}
                        onMouseEnter={() => setHoveredButton(`cancel-today-${tour.id}`)}
                        onMouseLeave={() => setHoveredButton(null)}
                        onClick={() => handleCancelTour(tour.id)}
                      >
                        <span>🚫</span>
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSchedule;