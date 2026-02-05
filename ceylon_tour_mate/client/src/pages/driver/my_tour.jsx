import React, { useState, useEffect } from 'react';

const MyTour = () => {
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
    
    // Stats Cards
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px',
      marginBottom: '32px'
    },
    statCard: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    statCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
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
      fontSize: '28px',
      fontWeight: '800',
      color: '#1e293b',
      margin: '0'
    },
    statIcon: {
      padding: '12px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '48px',
      height: '48px'
    },
    activeIcon: { 
      backgroundColor: '#dbeafe',
      color: '#1d4ed8'
    },
    upcomingIcon: { 
      backgroundColor: '#fef3c7',
      color: '#d97706'
    },
    completedIcon: { 
      backgroundColor: '#d1fae5',
      color: '#047857'
    },
    earningIcon: { 
      backgroundColor: '#f3e8ff',
      color: '#7c3aed'
    },
    
    // Live Trip Tracker
    liveTracker: {
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      padding: '32px',
      marginBottom: '32px',
      position: 'relative',
      overflow: 'hidden'
    },
    trackerHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    trackerTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    liveBadge: {
      padding: '6px 12px',
      backgroundColor: '#fee2e2',
      color: '#dc2626',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      animation: 'pulse 2s infinite'
    },
    '@keyframes pulse': {
      '0%': { opacity: 1 },
      '50%': { opacity: 0.7 },
      '100%': { opacity: 1 }
    },
    trackerContent: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '32px'
    },
    tripDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    detailRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      borderLeft: '4px solid #3b82f6'
    },
    detailIcon: {
      padding: '10px',
      borderRadius: '10px',
      backgroundColor: '#dbeafe',
      color: '#1d4ed8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px'
    },
    detailContent: {
      flex: 1
    },
    detailLabel: {
      fontSize: '12px',
      color: '#64748b',
      margin: '0 0 4px 0',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    detailValue: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0'
    },
    editButton: {
      padding: '8px 16px',
      backgroundColor: 'white',
      color: '#3b82f6',
      border: '1px solid #3b82f6',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    editButtonHover: {
      backgroundColor: '#3b82f6',
      color: 'white'
    },
    
    // Quick Update Section
    quickUpdate: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    updateCard: {
      backgroundColor: '#f8fafc',
      padding: '20px',
      borderRadius: '12px',
      border: '2px solid #e2e8f0'
    },
    updateTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0 0 16px 0'
    },
    updateOptions: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      marginBottom: '16px'
    },
    updateOption: {
      padding: '10px 16px',
      backgroundColor: 'white',
      color: '#475569',
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    updateOptionSelected: {
      backgroundColor: '#3b82f6',
      color: 'white',
      borderColor: '#3b82f6'
    },
    updateTextarea: {
      width: '100%',
      padding: '12px',
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      fontSize: '14px',
      color: '#1e293b',
      backgroundColor: 'white',
      resize: 'vertical',
      minHeight: '80px',
      fontFamily: 'inherit',
      marginBottom: '16px'
    },
    submitUpdate: {
      padding: '12px 24px',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      width: '100%'
    },
    submitUpdateHover: {
      backgroundColor: '#059669',
      transform: 'translateY(-2px)'
    },
    
    // Tour Progress
    progressSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      backgroundColor: '#f8fafc',
      padding: '20px',
      borderRadius: '12px',
      border: '2px solid #e2e8f0'
    },
    progressTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0'
    },
    progressBar: {
      height: '8px',
      backgroundColor: '#e2e8f0',
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '8px'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#10b981',
      transition: 'width 0.5s ease'
    },
    progressText: {
      fontSize: '14px',
      color: '#64748b',
      margin: '0',
      textAlign: 'center'
    },
    progressCheckpoints: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '16px'
    },
    checkpoint: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px'
    },
    checkpointDot: {
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      border: '3px solid #e2e8f0',
      position: 'relative'
    },
    checkpointActive: {
      backgroundColor: '#10b981',
      borderColor: '#10b981'
    },
    checkpointCompleted: {
      backgroundColor: '#10b981',
      borderColor: '#10b981'
    },
    checkpointLabel: {
      fontSize: '12px',
      color: '#64748b',
      textAlign: 'center'
    },
    
    // Tour History
    historySection: {
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      padding: '24px',
      marginBottom: '32px'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 24px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    historyGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '24px'
    },
    historyCard: {
      backgroundColor: '#f8fafc',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },
    historyCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
    },
    historyHeader: {
      padding: '20px',
      backgroundColor: 'white',
      borderBottom: '1px solid #f1f5f9',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    historyTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0'
    },
    historyStatus: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      textTransform: 'uppercase'
    },
    completedStatus: {
      backgroundColor: '#d1fae5',
      color: '#047857'
    },
    cancelledStatus: {
      backgroundColor: '#fee2e2',
      color: '#991b1b'
    },
    historyContent: {
      padding: '20px'
    },
    historyInfo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      marginBottom: '16px'
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    infoIcon: {
      color: '#64748b',
      fontSize: '16px'
    },
    infoText: {
      fontSize: '12px',
      color: '#64748b',
      margin: '0 0 2px 0'
    },
    infoValue: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0'
    },
    historyEarnings: {
      backgroundColor: '#fef3c7',
      padding: '12px',
      borderRadius: '8px',
      textAlign: 'center',
      marginTop: '16px'
    },
    earningsText: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#92400e',
      margin: '0'
    },
    
    // Recent Updates
    updatesSection: {
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      padding: '24px'
    },
    updatesList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    updateItem: {
      padding: '16px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      borderLeft: '4px solid #3b82f6'
    },
    updateTime: {
      fontSize: '12px',
      color: '#94a3b8',
      margin: '0 0 8px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    updateContent: {
      fontSize: '14px',
      color: '#475569',
      margin: '0',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    },
    updateIcon: {
      padding: '6px',
      backgroundColor: '#dbeafe',
      color: '#1d4ed8',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      flexShrink: 0
    },
    
    // Modal Styles
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      width: '100%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },
    modalHeader: {
      marginBottom: '24px'
    },
    modalTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 8px 0'
    },
    modalSubtitle: {
      fontSize: '14px',
      color: '#64748b',
      margin: '0'
    },
    formGroup: {
      marginBottom: '20px'
    },
    formLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#475569',
      margin: '0 0 8px 0',
      display: 'block'
    },
    formInput: {
      width: '100%',
      padding: '12px',
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      fontSize: '14px',
      color: '#1e293b',
      backgroundColor: 'white',
      fontFamily: 'inherit'
    },
    formTextarea: {
      width: '100%',
      padding: '12px',
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      fontSize: '14px',
      color: '#1e293b',
      backgroundColor: 'white',
      resize: 'vertical',
      minHeight: '100px',
      fontFamily: 'inherit'
    },
    formActions: {
      display: 'flex',
      gap: '12px',
      marginTop: '32px'
    },
    modalPrimaryButton: {
      padding: '12px 24px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      flex: 1
    },
    modalPrimaryButtonHover: {
      backgroundColor: '#2563eb'
    },
    modalSecondaryButton: {
      padding: '12px 24px',
      backgroundColor: 'white',
      color: '#475569',
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      flex: 1
    },
    modalSecondaryButtonHover: {
      backgroundColor: '#f8fafc'
    },
    
    // Emergency Actions
    emergencySection: {
      backgroundColor: '#fee2e2',
      borderRadius: '16px',
      border: '1px solid #fecaca',
      padding: '24px',
      marginTop: '32px'
    },
    emergencyHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px'
    },
    emergencyTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#991b1b',
      margin: '0'
    },
    emergencyButtons: {
      display: 'flex',
      gap: '12px'
    },
    emergencyButton: {
      padding: '12px 24px',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flex: 1
    },
    emergencyButtonHover: {
      backgroundColor: '#dc2626',
      transform: 'translateY(-2px)'
    }
  };

  // State management
  const [hoveredStat, setHoveredStat] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredHistory, setHoveredHistory] = useState(null);
  const [activeTour, setActiveTour] = useState(null);
  const [tourUpdates, setTourUpdates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [updateNote, setUpdateNote] = useState('');
  const [selectedUpdateType, setSelectedUpdateType] = useState('location');
  const [tourProgress, setTourProgress] = useState(30);

  // Initial active tour data
  const initialActiveTour = {
    id: 1,
    name: "Colombo City Tour",
    date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    time: "09:00 AM - 05:00 PM",
    currentLocation: "Gangaramaya Temple, Colombo",
    nextStop: "Independence Square",
    tourists: 8,
    vehicle: "Toyota Hiace - ABC-1234",
    fuelLevel: "75%",
    touristSatisfaction: "Excellent",
    temperature: "32°C",
    weather: "Sunny",
    estimatedReturn: "05:30 PM",
    progress: 30,
    checkpoints: [
      { id: 1, label: "Start", completed: true },
      { id: 2, label: "Hotel Pickup", completed: true },
      { id: 3, label: "Gangaramaya Temple", completed: true },
      { id: 4, label: "Independence Square", completed: false },
      { id: 5, label: "Lunch Break", completed: false },
      { id: 6, label: "Galle Face Green", completed: false },
      { id: 7, label: "Hotel Drop-off", completed: false },
      { id: 8, label: "Complete", completed: false }
    ]
  };

  // Tour history (completed/cancelled tours)
  const tourHistory = [
    {
      id: 2,
      name: "Kandy Cultural Tour",
      date: "Jan 10, 2024",
      status: "completed",
      location: "Kandy, Sri Lanka",
      tourists: 12,
      vehicle: "Luxury Coach",
      duration: "10 hours",
      earnings: "$680",
      rating: "4.8/5"
    },
    {
      id: 3,
      name: "Sigiriya Rock Climb",
      date: "Jan 8, 2024",
      status: "completed",
      location: "Sigiriya, Sri Lanka",
      tourists: 10,
      vehicle: "Luxury Coach",
      duration: "12 hours",
      earnings: "$750",
      rating: "4.9/5"
    },
    {
      id: 4,
      name: "Galle Fort Exploration",
      date: "Jan 5, 2024",
      status: "completed",
      location: "Galle, Sri Lanka",
      tourists: 6,
      vehicle: "Toyota Hiace",
      duration: "8 hours",
      earnings: "$380",
      rating: "4.7/5"
    },
    {
      id: 5,
      name: "Ella Nature Walk",
      date: "Jan 2, 2024",
      status: "cancelled",
      location: "Ella, Sri Lanka",
      tourists: 8,
      vehicle: "Mini Van",
      duration: "14 hours",
      earnings: "$0",
      cancellationReason: "Bad weather conditions"
    }
  ];

  // Initial updates
  const initialUpdates = [
    {
      id: 1,
      time: "Just now",
      type: "location",
      icon: "📍",
      content: "Arrived at Gangaramaya Temple"
    },
    {
      id: 2,
      time: "15 minutes ago",
      type: "status",
      icon: "🚗",
      content: "Left hotel after tourist pickup"
    },
    {
      id: 3,
      time: "30 minutes ago",
      type: "tourist",
      icon: "👥",
      content: "All 8 tourists onboard and ready"
    },
    {
      id: 4,
      time: "45 minutes ago",
      type: "vehicle",
      icon: "🚐",
      content: "Vehicle checked and fueled up"
    },
    {
      id: 5,
      time: "1 hour ago",
      type: "start",
      icon: "▶️",
      content: "Tour officially started"
    }
  ];

  // Statistics
  const stats = {
    activeTours: 1,
    totalTours: tourHistory.filter(t => t.status === "completed").length,
    completedTours: tourHistory.filter(t => t.status === "completed").length,
    totalEarnings: tourHistory.reduce((sum, tour) => sum + parseInt(tour.earnings.replace('$', '')), 0)
  };

  // Update types for quick updates
  const updateTypes = [
    { id: 'location', label: '📍 Location Update', placeholder: 'Enter current location or next destination...' },
    { id: 'tourist', label: '👥 Tourist Update', placeholder: 'Update on tourist status, counts, or needs...' },
    { id: 'vehicle', label: '🚐 Vehicle Update', placeholder: 'Report vehicle status, fuel, or issues...' },
    { id: 'delay', label: '⏰ Delay Update', placeholder: 'Report any delays and estimated time...' },
    { id: 'incident', label: '⚠️ Incident Report', placeholder: 'Report any incidents or issues...' },
    { id: 'other', label: '📝 General Update', placeholder: 'Any other tour updates...' }
  ];

  useEffect(() => {
    // Set initial active tour and updates
    setActiveTour(initialActiveTour);
    setTourUpdates(initialUpdates);
    
    // Simulate tour progress (in real app, this would be based on actual time/progress)
    const progressInterval = setInterval(() => {
      if (activeTour && activeTour.progress < 100) {
        setTourProgress(prev => {
          const newProgress = Math.min(prev + 1, 100);
          if (newProgress === 40) {
            // Simulate reaching a checkpoint
            addUpdate('📍', 'Arrived at Independence Square', 'location');
          }
          if (newProgress === 60) {
            // Simulate lunch break
            addUpdate('🍴', 'Lunch break started at Galle Face Hotel', 'status');
          }
          return newProgress;
        });
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(progressInterval);
  }, []);

  // Add a new update
  const addUpdate = (icon, content, type = 'other') => {
    const newUpdate = {
      id: tourUpdates.length + 1,
      time: "Just now",
      type: type,
      icon: icon,
      content: content
    };
    setTourUpdates(prev => [newUpdate, ...prev.slice(0, 9)]); // Keep only last 10 updates
  };

  // Submit quick update
  const handleSubmitUpdate = () => {
    if (!updateNote.trim()) return;
    
    const selectedType = updateTypes.find(type => type.id === selectedUpdateType);
    const icon = selectedType.label.split(' ')[0];
    
    addUpdate(icon, updateNote, selectedUpdateType);
    
    // Update active tour based on update type
    if (selectedUpdateType === 'location') {
      const newLocation = updateNote.split('at ')[1] || updateNote;
      setActiveTour(prev => ({
        ...prev,
        currentLocation: newLocation,
        progress: Math.min(prev.progress + 10, 100)
      }));
    }
    
    setUpdateNote('');
    alert('Update submitted successfully!');
  };

  // Complete active tour
  const handleCompleteTour = () => {
    addUpdate('✅', `Completed ${activeTour.name} tour successfully!`, 'status');
    setActiveTour(null);
    setTourProgress(0);
    alert('Tour marked as completed! Well done!');
  };

  // Emergency actions
  const handleEmergency = (type) => {
    if (type === 'breakdown') {
      addUpdate('🚨', 'Vehicle breakdown reported. Assistance requested.', 'emergency');
      alert('Emergency assistance requested! Help will arrive shortly.');
    } else if (type === 'accident') {
      addUpdate('🚨', 'Accident reported. Emergency services notified.', 'emergency');
      alert('Emergency services have been notified! Stay safe.');
    } else if (type === 'medical') {
      addUpdate('🚨', 'Medical emergency reported. Ambulance dispatched.', 'emergency');
      alert('Medical assistance is on the way!');
    }
  };

  // Open edit modal for a detail
  const openEditModal = (field, value, label) => {
    setModalData({ field, value, label });
    setShowModal(true);
  };

  // Save edited detail
  const handleSaveEdit = () => {
    if (activeTour) {
      setActiveTour(prev => ({
        ...prev,
        [modalData.field]: modalData.value
      }));
      
      addUpdate('✏️', `Updated ${modalData.label.toLowerCase()} to: ${modalData.value}`, 'update');
      setShowModal(false);
    }
  };

  // Progress checkpoint status
  const getCheckpointStatus = (index) => {
    const progressPerCheckpoint = 100 / (activeTour?.checkpoints.length - 1);
    const currentCheckpointIndex = Math.floor(tourProgress / progressPerCheckpoint);
    
    if (index < currentCheckpointIndex) return 'completed';
    if (index === currentCheckpointIndex) return 'active';
    return 'pending';
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>🚗 Live Tour Manager</h1>
          <p style={styles.subtitle}>Update and manage your active tour in real-time</p>
        </div>
        <div style={styles.headerActions}>
          {activeTour && (
            <button
              style={hoveredButton === 'complete' ? { ...styles.modalPrimaryButton, ...styles.modalPrimaryButtonHover } : styles.modalPrimaryButton}
              onMouseEnter={() => setHoveredButton('complete')}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={handleCompleteTour}
            >
              <span>✅</span>
              Complete Tour
            </button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={styles.statsRow}>
        <div 
          style={hoveredStat === 'active' ? { ...styles.statCard, ...styles.statCardHover } : styles.statCard}
          onMouseEnter={() => setHoveredStat('active')}
          onMouseLeave={() => setHoveredStat(null)}
        >
          <div style={styles.statContent}>
            <div style={styles.statText}>
              <p style={styles.statLabel}>Active Tours</p>
              <p style={styles.statValue}>{stats.activeTours}</p>
            </div>
            <div style={{ ...styles.statIcon, ...styles.activeIcon }}>
              <span>🚗</span>
            </div>
          </div>
        </div>

        <div 
          style={hoveredStat === 'total' ? { ...styles.statCard, ...styles.statCardHover } : styles.statCard}
          onMouseEnter={() => setHoveredStat('total')}
          onMouseLeave={() => setHoveredStat(null)}
        >
          <div style={styles.statContent}>
            <div style={styles.statText}>
              <p style={styles.statLabel}>Total Tours</p>
              <p style={styles.statValue}>{stats.totalTours}</p>
            </div>
            <div style={{ ...styles.statIcon, ...styles.upcomingIcon }}>
              <span>📊</span>
            </div>
          </div>
        </div>

        <div 
          style={hoveredStat === 'completed' ? { ...styles.statCard, ...styles.statCardHover } : styles.statCard}
          onMouseEnter={() => setHoveredStat('completed')}
          onMouseLeave={() => setHoveredStat(null)}
        >
          <div style={styles.statContent}>
            <div style={styles.statText}>
              <p style={styles.statLabel}>Completed</p>
              <p style={styles.statValue}>{stats.completedTours}</p>
            </div>
            <div style={{ ...styles.statIcon, ...styles.completedIcon }}>
              <span>✅</span>
            </div>
          </div>
        </div>

        <div 
          style={hoveredStat === 'earnings' ? { ...styles.statCard, ...styles.statCardHover } : styles.statCard}
          onMouseEnter={() => setHoveredStat('earnings')}
          onMouseLeave={() => setHoveredStat(null)}
        >
          <div style={styles.statContent}>
            <div style={styles.statText}>
              <p style={styles.statLabel}>Total Earnings</p>
              <p style={styles.statValue}>${stats.totalEarnings}</p>
            </div>
            <div style={{ ...styles.statIcon, ...styles.earningIcon }}>
              <span>💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Trip Tracker */}
      {activeTour ? (
        <div style={styles.liveTracker}>
          <div style={styles.trackerHeader}>
            <div>
              <h2 style={styles.trackerTitle}>
                <span>📍</span>
                {activeTour.name}
                <span style={styles.liveBadge}>
                  <span style={{fontSize: '8px'}}>●</span>
                  LIVE
                </span>
              </h2>
            </div>
          </div>

          <div style={styles.trackerContent}>
            <div style={styles.tripDetails}>
              {/* Current Location */}
              <div style={styles.detailRow}>
                <div style={styles.detailIcon}>
                  <span>📍</span>
                </div>
                <div style={styles.detailContent}>
                  <p style={styles.detailLabel}>Current Location</p>
                  <p style={styles.detailValue}>{activeTour.currentLocation}</p>
                </div>
                <button
                  style={hoveredButton === 'edit-location' ? { ...styles.editButton, ...styles.editButtonHover } : styles.editButton}
                  onMouseEnter={() => setHoveredButton('edit-location')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => openEditModal('currentLocation', activeTour.currentLocation, 'Current Location')}
                >
                  Edit
                </button>
              </div>

              {/* Next Stop */}
              <div style={styles.detailRow}>
                <div style={styles.detailIcon}>
                  <span>➡️</span>
                </div>
                <div style={styles.detailContent}>
                  <p style={styles.detailLabel}>Next Stop</p>
                  <p style={styles.detailValue}>{activeTour.nextStop}</p>
                </div>
                <button
                  style={hoveredButton === 'edit-next-stop' ? { ...styles.editButton, ...styles.editButtonHover } : styles.editButton}
                  onMouseEnter={() => setHoveredButton('edit-next-stop')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => openEditModal('nextStop', activeTour.nextStop, 'Next Stop')}
                >
                  Edit
                </button>
              </div>

              {/* Tourists */}
              <div style={styles.detailRow}>
                <div style={styles.detailIcon}>
                  <span>👥</span>
                </div>
                <div style={styles.detailContent}>
                  <p style={styles.detailLabel}>Tourists</p>
                  <p style={styles.detailValue}>{activeTour.tourists} people • {activeTour.touristSatisfaction}</p>
                </div>
                <button
                  style={hoveredButton === 'edit-tourists' ? { ...styles.editButton, ...styles.editButtonHover } : styles.editButton}
                  onMouseEnter={() => setHoveredButton('edit-tourists')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => openEditModal('touristSatisfaction', activeTour.touristSatisfaction, 'Tourist Satisfaction')}
                >
                  Edit
                </button>
              </div>

              {/* Vehicle */}
              <div style={styles.detailRow}>
                <div style={styles.detailIcon}>
                  <span>🚐</span>
                </div>
                <div style={styles.detailContent}>
                  <p style={styles.detailLabel}>Vehicle & Fuel</p>
                  <p style={styles.detailValue}>{activeTour.vehicle} • {activeTour.fuelLevel} fuel</p>
                </div>
                <button
                  style={hoveredButton === 'edit-vehicle' ? { ...styles.editButton, ...styles.editButtonHover } : styles.editButton}
                  onMouseEnter={() => setHoveredButton('edit-vehicle')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => openEditModal('fuelLevel', activeTour.fuelLevel, 'Fuel Level')}
                >
                  Edit
                </button>
              </div>

              {/* Weather & ETA */}
              <div style={styles.detailRow}>
                <div style={styles.detailIcon}>
                  <span>⏰</span>
                </div>
                <div style={styles.detailContent}>
                  <p style={styles.detailLabel}>Estimated Return & Conditions</p>
                  <p style={styles.detailValue}>{activeTour.estimatedReturn} • {activeTour.weather} {activeTour.temperature}</p>
                </div>
                <button
                  style={hoveredButton === 'edit-eta' ? { ...styles.editButton, ...styles.editButtonHover } : styles.editButton}
                  onMouseEnter={() => setHoveredButton('edit-eta')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => openEditModal('estimatedReturn', activeTour.estimatedReturn, 'Estimated Return Time')}
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Quick Update Section */}
            <div style={styles.quickUpdate}>
              <div style={styles.updateCard}>
                <h3 style={styles.updateTitle}>Quick Tour Update</h3>
                <div style={styles.updateOptions}>
                  {updateTypes.map(type => (
                    <button
                      key={type.id}
                      style={selectedUpdateType === type.id ? { ...styles.updateOption, ...styles.updateOptionSelected } : styles.updateOption}
                      onClick={() => setSelectedUpdateType(type.id)}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
                <textarea
                  style={styles.updateTextarea}
                  placeholder={updateTypes.find(t => t.id === selectedUpdateType)?.placeholder}
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                />
                <button
                  style={hoveredButton === 'submit-update' ? { ...styles.submitUpdate, ...styles.submitUpdateHover } : styles.submitUpdate}
                  onMouseEnter={() => setHoveredButton('submit-update')}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={handleSubmitUpdate}
                >
                  Submit Update
                </button>
              </div>

              {/* Tour Progress */}
              <div style={styles.progressSection}>
                <h3 style={styles.progressTitle}>Tour Progress</h3>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${tourProgress}%` }}></div>
                </div>
                <p style={styles.progressText}>{tourProgress}% Complete</p>
                
                <div style={styles.progressCheckpoints}>
                  {activeTour.checkpoints.map((checkpoint, index) => (
                    <div key={checkpoint.id} style={styles.checkpoint}>
                      <div style={{
                        ...styles.checkpointDot,
                        ...(getCheckpointStatus(index) === 'completed' && styles.checkpointCompleted),
                        ...(getCheckpointStatus(index) === 'active' && styles.checkpointActive)
                      }}></div>
                      <span style={styles.checkpointLabel}>{checkpoint.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Actions */}
          <div style={styles.emergencySection}>
            <div style={styles.emergencyHeader}>
              <span style={{ fontSize: '24px' }}>🚨</span>
              <h3 style={styles.emergencyTitle}>Emergency Actions</h3>
            </div>
            <p style={{ color: '#991b1b', marginBottom: '16px', fontSize: '14px' }}>
              Only use these buttons in case of real emergencies
            </p>
            <div style={styles.emergencyButtons}>
              <button
                style={hoveredButton === 'breakdown' ? { ...styles.emergencyButton, ...styles.emergencyButtonHover } : styles.emergencyButton}
                onMouseEnter={() => setHoveredButton('breakdown')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => handleEmergency('breakdown')}
              >
                <span>🚐</span>
                Vehicle Breakdown
              </button>
              <button
                style={hoveredButton === 'accident' ? { ...styles.emergencyButton, ...styles.emergencyButtonHover } : styles.emergencyButton}
                onMouseEnter={() => setHoveredButton('accident')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => handleEmergency('accident')}
              >
                <span>⚠️</span>
                Report Accident
              </button>
              <button
                style={hoveredButton === 'medical' ? { ...styles.emergencyButton, ...styles.emergencyButtonHover } : styles.emergencyButton}
                onMouseEnter={() => setHoveredButton('medical')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => handleEmergency('medical')}
              >
                <span>🏥</span>
                Medical Emergency
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          ...styles.liveTracker,
          textAlign: 'center',
          padding: '60px 32px'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🚗</div>
          <h2 style={{ fontSize: '24px', color: '#1e293b', marginBottom: '12px' }}>
            No Active Tour
          </h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>
            You don't have any active tours right now. Check your schedule to start a tour.
          </p>
          <button
            style={hoveredButton === 'check-schedule' ? { ...styles.modalPrimaryButton, ...styles.modalPrimaryButtonHover } : styles.modalPrimaryButton}
            onMouseEnter={() => setHoveredButton('check-schedule')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => window.location.href = '/driver/view_schedule'}
          >
            <span>📅</span>
            View Schedule
          </button>
        </div>
      )}

      {/* Tour History */}
      <div style={styles.historySection}>
        <h2 style={styles.sectionTitle}>
          <span>📊</span>
          Recent Tour History
        </h2>
        <div style={styles.historyGrid}>
          {tourHistory.map(tour => (
            <div
              key={tour.id}
              style={hoveredHistory === tour.id ? { ...styles.historyCard, ...styles.historyCardHover } : styles.historyCard}
              onMouseEnter={() => setHoveredHistory(tour.id)}
              onMouseLeave={() => setHoveredHistory(null)}
            >
              <div style={styles.historyHeader}>
                <h3 style={styles.historyTitle}>{tour.name}</h3>
                <span style={{ 
                  ...styles.historyStatus, 
                  ...(tour.status === 'completed' ? styles.completedStatus : styles.cancelledStatus)
                }}>
                  {tour.status === 'completed' ? 'Completed' : 'Cancelled'}
                </span>
              </div>
              
              <div style={styles.historyContent}>
                <div style={styles.historyInfo}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoIcon}>📅</span>
                    <div>
                      <p style={styles.infoText}>Date</p>
                      <p style={styles.infoValue}>{tour.date}</p>
                    </div>
                  </div>
                  
                  <div style={styles.infoItem}>
                    <span style={styles.infoIcon}>📍</span>
                    <div>
                      <p style={styles.infoText}>Location</p>
                      <p style={styles.infoValue}>{tour.location}</p>
                    </div>
                  </div>
                  
                  <div style={styles.infoItem}>
                    <span style={styles.infoIcon}>👥</span>
                    <div>
                      <p style={styles.infoText}>Tourists</p>
                      <p style={styles.infoValue}>{tour.tourists} people</p>
                    </div>
                  </div>
                  
                  <div style={styles.infoItem}>
                    <span style={styles.infoIcon}>🚐</span>
                    <div>
                      <p style={styles.infoText}>Vehicle</p>
                      <p style={styles.infoValue}>{tour.vehicle}</p>
                    </div>
                  </div>
                </div>
                
                <div style={styles.historyEarnings}>
                  <p style={styles.earningsText}>
                    Earnings: {tour.earnings} • Rating: {tour.rating}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Tour Updates */}
      <div style={styles.updatesSection}>
        <h2 style={styles.sectionTitle}>
          <span>📝</span>
          Recent Tour Updates
        </h2>
        <div style={styles.updatesList}>
          {tourUpdates.map(update => (
            <div key={update.id} style={styles.updateItem}>
              <p style={styles.updateTime}>
                <span>🕒</span>
                {update.time}
              </p>
              <p style={styles.updateContent}>
                <span style={styles.updateIcon}>{update.icon}</span>
                {update.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Edit {modalData.label}</h2>
              <p style={styles.modalSubtitle}>Update this information for the active tour</p>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>{modalData.label}</label>
              <input
                type="text"
                style={styles.formInput}
                value={modalData.value}
                onChange={(e) => setModalData({...modalData, value: e.target.value})}
                placeholder={`Enter new ${modalData.label.toLowerCase()}...`}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Additional Notes (Optional)</label>
              <textarea
                style={styles.formTextarea}
                placeholder="Add any additional details or context..."
              />
            </div>
            
            <div style={styles.formActions}>
              <button
                style={hoveredButton === 'save-edit' ? { ...styles.modalPrimaryButton, ...styles.modalPrimaryButtonHover } : styles.modalPrimaryButton}
                onMouseEnter={() => setHoveredButton('save-edit')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>
              <button
                style={hoveredButton === 'cancel-edit' ? { ...styles.modalSecondaryButton, ...styles.modalSecondaryButtonHover } : styles.modalSecondaryButton}
                onMouseEnter={() => setHoveredButton('cancel-edit')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTour;
