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
    trackerActions: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
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
    startTripButton: {
      padding: '10px 18px',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    startTripButtonHover: {
      backgroundColor: '#059669',
      transform: 'translateY(-2px)'
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
    tripModalContent: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '28px',
      width: '100%',
      maxWidth: '900px',
      maxHeight: '85vh',
      overflowY: 'auto',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },
    tripSection: {
      marginBottom: '20px',
      paddingBottom: '20px',
      borderBottom: '1px solid #e2e8f0'
    },
    tripGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '12px'
    },
    tripLabel: {
      fontSize: '12px',
      color: '#64748b',
      marginBottom: '4px'
    },
    tripValue: {
      fontSize: '14px',
      color: '#1e293b',
      fontWeight: '600'
    },
    tripPill: {
      backgroundColor: '#eef2ff',
      color: '#312e81',
      padding: '6px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: '600'
    },
    tripActivityCard: {
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      padding: '8px 10px'
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
    },
    
    // Completion Checklist Styles
    completionModal: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      width: '100%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    },
    completionHeader: {
      textAlign: 'center',
      marginBottom: '28px'
    },
    completionIcon: {
      fontSize: '56px',
      marginBottom: '16px'
    },
    completionTitle: {
      fontSize: '26px',
      fontWeight: '800',
      color: '#1e293b',
      margin: '0 0 8px 0'
    },
    completionSubtitle: {
      fontSize: '14px',
      color: '#64748b',
      margin: '0'
    },
    checklistContainer: {
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    },
    checklistItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '14px',
      marginBottom: '10px',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    checklistItemHover: {
      borderColor: '#3b82f6',
      backgroundColor: '#eff6ff'
    },
    checklistCheckbox: {
      width: '20px',
      height: '20px',
      border: '2px solid #cbd5e1',
      borderRadius: '6px',
      marginRight: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: 'white'
    },
    checklistCheckboxChecked: {
      backgroundColor: '#10b981',
      borderColor: '#10b981',
      color: 'white'
    },
    checklistLabel: {
      flex: 1,
      fontSize: '14px',
      color: '#1e293b',
      fontWeight: '500',
      margin: '0'
    },
    checklistIcon: {
      marginLeft: 'auto',
      fontSize: '18px',
      opacity: 0.6
    },
    notesContainer: {
      marginBottom: '24px'
    },
    notesLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#475569',
      margin: '0 0 8px 0',
      display: 'block'
    },
    notesInput: {
      width: '100%',
      padding: '12px',
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      fontSize: '14px',
      color: '#1e293b',
      backgroundColor: 'white',
      resize: 'vertical',
      minHeight: '80px',
      fontFamily: 'inherit'
    },
    completionActions: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px'
    },
    completeBtn: {
      flex: 1,
      padding: '12px 24px',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    completeBtnHover: {
      backgroundColor: '#059669',
      transform: 'translateY(-2px)'
    },
    completeBtnDisabled: {
      backgroundColor: '#cbd5e1',
      cursor: 'not-allowed'
    },
    cancelBtn: {
      flex: 1,
      padding: '12px 24px',
      backgroundColor: 'white',
      color: '#475569',
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    cancelBtnHover: {
      backgroundColor: '#f8fafc',
      borderColor: '#94a3b8'
    },
    completionCard: {
      backgroundColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      borderRadius: '12px',
      padding: '24px',
      marginTop: '24px',
      border: '1px solid #ecfdf5',
      textAlign: 'center'
    },
    completionCardIcon: {
      fontSize: '48px',
      marginBottom: '12px'
    },
    completionCardText: {
      color: 'white',
      fontSize: '14px',
      fontWeight: '600'
    },
    
    // Complete Task Card in Live Tracker
    completeTaskCard: {
      backgroundColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      borderRadius: '12px',
      padding: '24px',
      marginTop: '24px',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    completeTaskHeader: {
      fontSize: '18px',
      fontWeight: '700',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    completeTaskButton: {
      backgroundColor: 'white',
      color: '#10b981',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    completeTaskButtonHover: {
      backgroundColor: '#f0f9ff',
      transform: 'translateY(-2px)'
    },
    
    // Loading States
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px'
    },
    loadingSpinner: {
      width: '50px',
      height: '50px',
      border: '5px solid #e2e8f0',
      borderTop: '5px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' }
    },
    loadingText: {
      marginTop: '16px',
      color: '#64748b',
      fontSize: '14px'
    },
    
    // Error States
    errorContainer: {
      backgroundColor: '#fee2e2',
      border: '1px solid #fecaca',
      borderRadius: '12px',
      padding: '24px',
      textAlign: 'center'
    },
    errorIcon: {
      fontSize: '48px',
      color: '#dc2626',
      marginBottom: '16px'
    },
    errorTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#991b1b',
      marginBottom: '8px'
    },
    errorMessage: {
      color: '#dc2626',
      fontSize: '14px',
      marginBottom: '16px'
    },
    retryButton: {
      padding: '10px 20px',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer'
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
  const [tourProgress, setTourProgress] = useState(0);
  const [tourHistory, setTourHistory] = useState([]);
  const [stats, setStats] = useState({
    activeTours: 0,
    totalTours: 0,
    completedTours: 0,
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tripDetailsOpen, setTripDetailsOpen] = useState(false);
  const [tripDetailsLoading, setTripDetailsLoading] = useState(false);
  const [tripDetailsError, setTripDetailsError] = useState('');
  const [tripDetailsData, setTripDetailsData] = useState(null);
  const [tripPackageDetails, setTripPackageDetails] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionChecklist, setCompletionChecklist] = useState([
    { id: 1, label: 'All passengers safely delivered', checked: false, icon: '✅' },
    { id: 2, label: 'Final payment collected/confirmed', checked: false, icon: '💳' },
    { id: 3, label: 'Vehicle condition checked', checked: false, icon: '🚗' },
    { id: 4, label: 'Fuel level recorded', checked: false, icon: '⛽' },
    { id: 5, label: 'Vehicle cleaned/organized', checked: false, icon: '🧹' },
    { id: 6, label: 'All belongings accounted for', checked: false, icon: '🎒' }
  ]);
  const [completionNotes, setCompletionNotes] = useState('');

  // Update types for quick updates
  const updateTypes = [
    { id: 'location', label: '📍 Location Update', placeholder: 'Enter current location or next destination...' },
    { id: 'tourist', label: '👥 Tourist Update', placeholder: 'Update on tourist status, counts, or needs...' },
    { id: 'vehicle', label: '🚐 Vehicle Update', placeholder: 'Report vehicle status, fuel, or issues...' },
    { id: 'delay', label: '⏰ Delay Update', placeholder: 'Report any delays and estimated time...' },
    { id: 'incident', label: '⚠️ Incident Report', placeholder: 'Report any incidents or issues...' },
    { id: 'other', label: '📝 General Update', placeholder: 'Any other tour updates...' }
  ];

  // API Endpoints - Replace with your actual endpoints
  const API_ENDPOINTS = {
    activeTour: '/api/driver/active-tour',
    tourHistory: '/api/driver/tour-history',
    tourUpdates: '/api/driver/tour-updates',
    submitUpdate: '/api/driver/submit-update',
    completeTour: '/api/driver/complete-tour',
    emergency: '/api/driver/emergency',
    updateTourDetail: '/api/driver/update-tour-detail'
  };

  const mapAssignmentToTour = (assignment) => {
    const vehicle = [assignment.vehicle_type, assignment.vehicle_model].filter(Boolean).join(' ');
    return {
      id: assignment.assignment_id,
      assignmentId: assignment.assignment_id,
      bookingId: assignment.booking_id,
      name: assignment.package_name || `Booking #${assignment.booking_id}`,
      status: assignment.assignment_status,
      date: assignment.start_date,
      startDate: assignment.start_date,
      endDate: assignment.end_date,
      location: assignment.pickup_location || 'Not specified',
      currentLocation: assignment.pickup_location || '',
      tourists: parseInt(assignment.pax || '0', 10),
      vehicle: vehicle || 'Not specified',
      earnings: 0,
      rating: null
    };
  };

  const buildDriverTours = (assignments = []) => {
    const activeCandidates = assignments.filter((item) =>
      ['ongoing', 'confirmed', 'assigned'].includes(item.assignment_status)
    );
    const activeAssignment = activeCandidates[0] || null;
    const active = activeAssignment ? mapAssignmentToTour(activeAssignment) : null;

    const history = assignments
      .filter((item) => ['completed', 'cancelled'].includes(item.assignment_status))
      .map(mapAssignmentToTour);

    const completedCount = assignments.filter((item) => item.assignment_status === 'completed').length;
    const activeCount = activeCandidates.length;

    setActiveTour(active);
    setTourHistory(history);
    setStats({
      activeTours: activeCount,
      totalTours: assignments.length,
      completedTours: completedCount,
      totalEarnings: 0
    });
  };

  // Fetch active tour data
  const fetchActiveTour = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/drivers/me/assignments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch driver assignments');
      }

      const data = await response.json();
      const assignments = data?.data || [];
      buildDriverTours(assignments);
      setTourProgress(0);
      setTourUpdates([]);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching active tour:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tour history
  const fetchTourHistory = async () => {
    try {
      const response = await fetch('/api/drivers/me/assignments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch driver assignments');
      }

      const data = await response.json();
      const assignments = data?.data || [];
      buildDriverTours(assignments);
    } catch (err) {
      console.error('Error fetching tour history:', err);
    }
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchActiveTour(),
        fetchTourHistory()
      ]);
    };
    
    initializeData();
    
    // Set up polling for live updates
    const pollInterval = setInterval(fetchActiveTour, 30000); // Poll every 30 seconds
    
    return () => clearInterval(pollInterval);
  }, []);

  // Submit quick update to API
  const handleSubmitUpdate = async () => {
    if (!updateNote.trim()) {
      alert('Please enter an update message');
      return;
    }
    
    try {
      const response = await fetch(API_ENDPOINTS.submitUpdate, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          type: selectedUpdateType,
          message: updateNote,
          tourId: activeTour?.id
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit update');
      }
      
      const result = await response.json();
      
      // Add the update locally
      const selectedType = updateTypes.find(type => type.id === selectedUpdateType);
      const icon = selectedType.label.split(' ')[0];
      
      const newUpdate = {
        id: Date.now(),
        time: "Just now",
        type: selectedUpdateType,
        icon: icon,
        content: updateNote
      };
      
      setTourUpdates(prev => [newUpdate, ...prev.slice(0, 9)]);
      
      // Update active tour if it's a location update
      if (selectedUpdateType === 'location' && activeTour) {
        setActiveTour(prev => ({
          ...prev,
          currentLocation: updateNote
        }));
      }
      
      setUpdateNote('');
      alert('Update submitted successfully!');
    } catch (err) {
      console.error('Error submitting update:', err);
      alert('Failed to submit update. Please try again.');
    }
  };

  // Open completion checklist modal
  const handleCompleteTour = async () => {
    if (!activeTour) return;
    setShowCompletionModal(true);
    // Reset checklist for new completion
    setCompletionChecklist(prev => prev.map(item => ({ ...item, checked: false })));
    setCompletionNotes('');
  };

  // Toggle checklist item
  const toggleChecklistItem = (id) => {
    setCompletionChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Confirm tour completion after checklist
  const confirmCompletion = async () => {
    if (!activeTour) return;
    
    try {
      const response = await fetch(API_ENDPOINTS.completeTour, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          tourId: activeTour.id,
          completionNotes: completionNotes,
          checklist: completionChecklist
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to complete tour');
      }
      
      const result = await response.json();
      
      // Add final update
      const finalUpdate = {
        id: Date.now(),
        time: "Just now",
        type: 'status',
        icon: '✅',
        content: `Completed ${activeTour.name} tour successfully!`
      };
      
      setTourUpdates(prev => [finalUpdate, ...prev.slice(0, 9)]);
      
      // Reset active tour
      setActiveTour(null);
      setTourProgress(0);
      setShowCompletionModal(false);
      
      // Refresh tour history
      await fetchTourHistory();
      
      alert('🎉 Tour marked as completed! Well done!');
    } catch (err) {
      console.error('Error completing tour:', err);
      alert('Failed to complete tour. Please try again.');
    }
  };

  const handleOpenTripDetails = async () => {
    if (!activeTour?.bookingId) return;
    setTripDetailsOpen(true);
    setTripDetailsLoading(true);
    setTripDetailsError('');
    setTripDetailsData(null);
    setTripPackageDetails(null);

    try {
      const bookingResponse = await fetch(`/api/bookings/${activeTour.bookingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!bookingResponse.ok) {
        throw new Error('Failed to load booking details');
      }

      const bookingPayload = await bookingResponse.json();
      const bookingData = bookingPayload?.data || null;
      setTripDetailsData(bookingData);

      const packageId = bookingData?.package_id;
      if (packageId) {
        const packageResponse = await fetch(`/api/packages/${packageId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!packageResponse.ok) {
          throw new Error('Failed to load package details');
        }

        const packagePayload = await packageResponse.json();
        const packageData = packagePayload?.package || packagePayload?.data || packagePayload || null;
        setTripPackageDetails(packageData);
      }
    } catch (err) {
      console.error('Error loading trip details:', err);
      setTripDetailsError(err.message || 'Failed to load trip details');
    } finally {
      setTripDetailsLoading(false);
    }
  };

  const handleCloseTripDetails = () => {
    setTripDetailsOpen(false);
    setTripDetailsLoading(false);
    setTripDetailsError('');
    setTripDetailsData(null);
    setTripPackageDetails(null);
  };

  // Emergency actions
  const handleEmergency = async (type) => {
    if (!window.confirm(`Are you sure you want to report a ${type} emergency? This will notify support immediately.`)) {
      return;
    }
    
    try {
      const response = await fetch(API_ENDPOINTS.emergency, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          emergencyType: type,
          tourId: activeTour?.id,
          location: activeTour?.currentLocation
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to report emergency');
      }
      
      // Add emergency update locally
      const emergencyIcons = {
        breakdown: '🚐',
        accident: '⚠️',
        medical: '🏥'
      };
      
      const emergencyUpdate = {
        id: Date.now(),
        time: "Just now",
        type: 'emergency',
        icon: emergencyIcons[type] || '🚨',
        content: `${type.charAt(0).toUpperCase() + type.slice(1)} emergency reported. Assistance requested.`
      };
      
      setTourUpdates(prev => [emergencyUpdate, ...prev.slice(0, 9)]);
      
      alert('Emergency assistance requested! Help will arrive shortly.');
    } catch (err) {
      console.error('Error reporting emergency:', err);
      alert('Failed to report emergency. Please call support directly.');
    }
  };

  // Open edit modal for a detail
  const openEditModal = (field, value, label) => {
    setModalData({ field, value, label });
    setShowModal(true);
  };

  // Save edited detail
  const handleSaveEdit = async () => {
    if (!activeTour || !modalData.field || !modalData.value) return;
    
    try {
      const response = await fetch(API_ENDPOINTS.updateTourDetail, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          tourId: activeTour.id,
          field: modalData.field,
          value: modalData.value
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update tour detail');
      }
      
      // Update active tour locally
      setActiveTour(prev => ({
        ...prev,
        [modalData.field]: modalData.value
      }));
      
      // Add update notification
      const updateNotification = {
        id: Date.now(),
        time: "Just now",
        type: 'update',
        icon: '✏️',
        content: `Updated ${modalData.label.toLowerCase()} to: ${modalData.value}`
      };
      
      setTourUpdates(prev => [updateNotification, ...prev.slice(0, 9)]);
      
      setShowModal(false);
      setModalData({});
    } catch (err) {
      console.error('Error updating tour detail:', err);
      alert('Failed to update detail. Please try again.');
    }
  };

  // Progress checkpoint status
  const getCheckpointStatus = (index, checkpoints) => {
    if (!checkpoints || !checkpoints.length) return 'pending';
    
    const progressPerCheckpoint = 100 / (checkpoints.length - 1);
    const currentCheckpointIndex = Math.floor(tourProgress / progressPerCheckpoint);
    
    if (index < currentCheckpointIndex) return 'completed';
    if (index === currentCheckpointIndex) return 'active';
    return 'pending';
  };

  // Loading component
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <h1 style={styles.title}>🚗 Live Tour Manager</h1>
            <p style={styles.subtitle}>Loading tour data...</p>
          </div>
        </div>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Fetching tour information...</p>
        </div>
      </div>
    );
  }

  // Error component
  if (error && !activeTour && !tourHistory.length) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <h1 style={styles.title}>🚗 Live Tour Manager</h1>
            <p style={styles.subtitle}>Error loading data</p>
          </div>
        </div>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h3 style={styles.errorTitle}>Failed to Load Tour Data</h3>
          <p style={styles.errorMessage}>{error}</p>
          <button 
            style={styles.retryButton}
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchActiveTour();
              fetchTourHistory();
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
              <p style={styles.statValue}>${stats.totalEarnings.toFixed(2)}</p>
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
            <div style={styles.trackerActions}>
              <button
                style={hoveredButton === 'start-trip' ? { ...styles.startTripButton, ...styles.startTripButtonHover } : styles.startTripButton}
                onMouseEnter={() => setHoveredButton('start-trip')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={handleOpenTripDetails}
              >
                <span>🚀</span>
                Start Trip
              </button>
            </div>
          </div>

          <div style={styles.trackerContent}>
            <div style={styles.tripDetails}>
              {/* Current Location */}
              {activeTour.currentLocation && (
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
              )}

              {/* Next Stop */}
              {activeTour.nextStop && (
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
              )}

              {/* Tourists */}
              {(activeTour.tourists || activeTour.touristSatisfaction) && (
                <div style={styles.detailRow}>
                  <div style={styles.detailIcon}>
                    <span>👥</span>
                  </div>
                  <div style={styles.detailContent}>
                    <p style={styles.detailLabel}>Tourists</p>
                    <p style={styles.detailValue}>
                      {activeTour.tourists ? `${activeTour.tourists} people` : ''}
                      {activeTour.touristSatisfaction ? ` • ${activeTour.touristSatisfaction}` : ''}
                    </p>
                  </div>
                  {activeTour.touristSatisfaction && (
                    <button
                      style={hoveredButton === 'edit-tourists' ? { ...styles.editButton, ...styles.editButtonHover } : styles.editButton}
                      onMouseEnter={() => setHoveredButton('edit-tourists')}
                      onMouseLeave={() => setHoveredButton(null)}
                      onClick={() => openEditModal('touristSatisfaction', activeTour.touristSatisfaction, 'Tourist Satisfaction')}
                    >
                      Edit
                    </button>
                  )}
                </div>
              )}

              {/* Vehicle */}
              {(activeTour.vehicle || activeTour.fuelLevel) && (
                <div style={styles.detailRow}>
                  <div style={styles.detailIcon}>
                    <span>🚐</span>
                  </div>
                  <div style={styles.detailContent}>
                    <p style={styles.detailLabel}>Vehicle & Fuel</p>
                    <p style={styles.detailValue}>
                      {activeTour.vehicle || ''}
                      {activeTour.fuelLevel ? ` • ${activeTour.fuelLevel} fuel` : ''}
                    </p>
                  </div>
                  {activeTour.fuelLevel && (
                    <button
                      style={hoveredButton === 'edit-vehicle' ? { ...styles.editButton, ...styles.editButtonHover } : styles.editButton}
                      onMouseEnter={() => setHoveredButton('edit-vehicle')}
                      onMouseLeave={() => setHoveredButton(null)}
                      onClick={() => openEditModal('fuelLevel', activeTour.fuelLevel, 'Fuel Level')}
                    >
                      Edit
                    </button>
                  )}
                </div>
              )}

              {/* Weather & ETA */}
              {(activeTour.estimatedReturn || activeTour.weather || activeTour.temperature) && (
                <div style={styles.detailRow}>
                  <div style={styles.detailIcon}>
                    <span>⏰</span>
                  </div>
                  <div style={styles.detailContent}>
                    <p style={styles.detailLabel}>Estimated Return & Conditions</p>
                    <p style={styles.detailValue}>
                      {activeTour.estimatedReturn || ''}
                      {activeTour.weather ? ` • ${activeTour.weather}` : ''}
                      {activeTour.temperature ? ` ${activeTour.temperature}` : ''}
                    </p>
                  </div>
                  {activeTour.estimatedReturn && (
                    <button
                      style={hoveredButton === 'edit-eta' ? { ...styles.editButton, ...styles.editButtonHover } : styles.editButton}
                      onMouseEnter={() => setHoveredButton('edit-eta')}
                      onMouseLeave={() => setHoveredButton(null)}
                      onClick={() => openEditModal('estimatedReturn', activeTour.estimatedReturn, 'Estimated Return Time')}
                    >
                      Edit
                    </button>
                  )}
                </div>
              )}

              {/* Additional custom fields */}
              {activeTour.customFields && activeTour.customFields.map((field, index) => (
                <div key={index} style={styles.detailRow}>
                  <div style={styles.detailIcon}>
                    <span>{field.icon || '📝'}</span>
                  </div>
                  <div style={styles.detailContent}>
                    <p style={styles.detailLabel}>{field.label}</p>
                    <p style={styles.detailValue}>{field.value}</p>
                  </div>
                  <button
                    style={hoveredButton === `edit-custom-${index}` ? { ...styles.editButton, ...styles.editButtonHover } : styles.editButton}
                    onMouseEnter={() => setHoveredButton(`edit-custom-${index}`)}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() => openEditModal(`customFields[${index}].value`, field.value, field.label)}
                  >
                    Edit
                  </button>
                </div>
              ))}
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
              {activeTour.checkpoints && activeTour.checkpoints.length > 0 && (
                <div style={styles.progressSection}>
                  <h3 style={styles.progressTitle}>Tour Progress</h3>
                  <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${tourProgress}%` }}></div>
                  </div>
                  <p style={styles.progressText}>{tourProgress}% Complete</p>
                  
                  <div style={styles.progressCheckpoints}>
                    {activeTour.checkpoints.map((checkpoint, index) => (
                      <div key={checkpoint.id || index} style={styles.checkpoint}>
                        <div style={{
                          ...styles.checkpointDot,
                          ...(getCheckpointStatus(index, activeTour.checkpoints) === 'completed' && styles.checkpointCompleted),
                          ...(getCheckpointStatus(index, activeTour.checkpoints) === 'active' && styles.checkpointActive)
                        }}></div>
                        <span style={styles.checkpointLabel}>{checkpoint.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Complete Task Card */}
          <div style={styles.completeTaskCard}>
            <div style={styles.completeTaskHeader}>
              <span>🎯</span>
              Ready to Complete This Tour?
            </div>
            <button
              style={hoveredButton === 'complete-tour-btn' ? { ...styles.completeTaskButton, ...styles.completeTaskButtonHover } : styles.completeTaskButton}
              onMouseEnter={() => setHoveredButton('complete-tour-btn')}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={handleCompleteTour}
            >
              <span>✅</span>
              Complete Task
            </button>
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
      {tourHistory.length > 0 && (
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
                      Earnings: ${parseFloat(tour.earnings || 0).toFixed(2)} • Rating: {tour.rating || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Tour Updates */}
      {tourUpdates.length > 0 && (
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
      )}

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

      {tripDetailsOpen && (
        <div style={styles.modalOverlay} onClick={handleCloseTripDetails}>
          <div style={styles.tripModalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Trip Details</h2>
              <p style={styles.modalSubtitle}>Destination and hotel details for this trip.</p>
            </div>

            {tripDetailsLoading && (
              <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <p style={styles.loadingText}>Loading trip details...</p>
              </div>
            )}

            {!tripDetailsLoading && tripDetailsError && (
              <div style={styles.errorContainer}>
                <div style={styles.errorIcon}>⚠️</div>
                <div style={styles.errorTitle}>Unable to load trip details</div>
                <div style={styles.errorMessage}>{tripDetailsError}</div>
              </div>
            )}

            {!tripDetailsLoading && !tripDetailsError && tripDetailsData && (
              <>
                <div style={styles.tripSection}>
                  <h3 style={styles.sectionTitle}>Booking Details</h3>
                  <div style={styles.tripGrid}>
                    <div>
                      <div style={styles.tripLabel}>Guest Name</div>
                      <div style={styles.tripValue}>{tripDetailsData.fullname || 'N/A'}</div>
                    </div>
                    <div>
                      <div style={styles.tripLabel}>Arrival Date</div>
                      <div style={styles.tripValue}>{tripDetailsData.arrival_date || 'N/A'}</div>
                    </div>
                    <div>
                      <div style={styles.tripLabel}>Pickup Location</div>
                      <div style={styles.tripValue}>{tripDetailsData.pickup_location || 'N/A'}</div>
                    </div>
                    <div>
                      <div style={styles.tripLabel}>Passengers</div>
                      <div style={styles.tripValue}>{tripDetailsData.pax || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                <div style={styles.tripSection}>
                  <h3 style={styles.sectionTitle}>Hotel Details</h3>
                  {tripDetailsData.hotelBookings && tripDetailsData.hotelBookings.length > 0 ? (
                    <div style={styles.tripGrid}>
                      <div>
                        <div style={styles.tripLabel}>Hotel Name</div>
                        <div style={styles.tripValue}>{tripDetailsData.hotelBookings[0].hotel_name}</div>
                      </div>
                      <div>
                        <div style={styles.tripLabel}>Location</div>
                        <div style={styles.tripValue}>{tripDetailsData.hotelBookings[0].location}</div>
                      </div>
                      <div>
                        <div style={styles.tripLabel}>Contact</div>
                        <div style={styles.tripValue}>{tripDetailsData.hotelBookings[0].contact_person || 'N/A'}</div>
                      </div>
                    </div>
                  ) : (
                    <p style={styles.loadingText}>No hotel details found.</p>
                  )}
                </div>

                <div style={styles.tripSection}>
                  <h3 style={styles.sectionTitle}>Package Destinations</h3>
                  {tripPackageDetails?.destinations && tripPackageDetails.destinations.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {tripPackageDetails.destinations.map((destination) => (
                        <div
                          key={`${destination.destination_code}-${destination.destination_name}`}
                          style={styles.tripPill}
                        >
                          {destination.destination_name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={styles.loadingText}>No destinations available.</p>
                  )}
                </div>

                <div style={styles.tripSection}>
                  <h3 style={styles.sectionTitle}>Itinerary Details</h3>
                  {tripPackageDetails?.itinerary && tripPackageDetails.itinerary.length > 0 ? (
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {tripPackageDetails.itinerary.map((day) => (
                        <div key={day.id || day.day_number} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
                          <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
                            Day {day.day_number}: {day.title}
                          </div>
                          {day.description && (
                            <p style={{ margin: '0 0 8px 0', color: '#475569', fontSize: '13px' }}>{day.description}</p>
                          )}
                          {day.activities && day.activities.length > 0 ? (
                            <div style={{ display: 'grid', gap: '6px' }}>
                              {day.activities.map((activity) => (
                                <div key={activity.id} style={styles.tripActivityCard}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                                    <div style={{ color: '#0f172a', fontWeight: '600' }}>{activity.activity_name}</div>
                                    <div style={{ color: '#64748b', fontSize: '12px' }}>{activity.time_slot || 'time'}</div>
                                  </div>
                                  {activity.description && (
                                    <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>
                                      {activity.description}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p style={{ color: '#64748b', fontSize: '12px' }}>No activities listed.</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={styles.loadingText}>No itinerary available.</p>
                  )}
                </div>
              </>
            )}

            <div style={styles.formActions}>
              <button
                style={hoveredButton === 'close-trip' ? { ...styles.modalSecondaryButton, ...styles.modalSecondaryButtonHover } : styles.modalSecondaryButton}
                onMouseEnter={() => setHoveredButton('close-trip')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={handleCloseTripDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Checklist Modal */}
      {showCompletionModal && (
        <div style={styles.modalOverlay} onClick={() => setShowCompletionModal(false)}>
          <div style={styles.completionModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.completionHeader}>
              <div style={styles.completionIcon}>✅</div>
              <h2 style={styles.completionTitle}>Complete Tour</h2>
              <p style={styles.completionSubtitle}>
                Complete your final checklist before marking the tour as done
              </p>
            </div>

            {/* Completion Checklist */}
            <div style={styles.checklistContainer}>
              <p style={{ ...styles.formLabel, marginBottom: '16px' }}>Tour Completion Checklist</p>
              {completionChecklist.map(item => (
                <div
                  key={item.id}
                  style={hoveredButton === `checklist-${item.id}` ? { ...styles.checklistItem, ...styles.checklistItemHover } : styles.checklistItem}
                  onMouseEnter={() => setHoveredButton(`checklist-${item.id}`)}
                  onMouseLeave={() => setHoveredButton(null)}
                  onClick={() => toggleChecklistItem(item.id)}
                >
                  <div style={item.checked ? { ...styles.checklistCheckbox, ...styles.checklistCheckboxChecked } : styles.checklistCheckbox}>
                    {item.checked && '✓'}
                  </div>
                  <label style={styles.checklistLabel}>
                    {item.label}
                  </label>
                  <span style={styles.checklistIcon}>{item.icon}</span>
                </div>
              ))}
            </div>

            {/* Completion Notes */}
            <div style={styles.notesContainer}>
              <label style={styles.notesLabel}>
                📝 Additional Notes (Optional)
              </label>
              <textarea
                style={styles.notesInput}
                placeholder="Add any notes about this tour completion, issues encountered, or special comments..."
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
              />
            </div>

            {/* Checklist Progress */}
            <div style={styles.completionCard}>
              <div style={styles.completionCardIcon}>
                {completionChecklist.filter(item => item.checked).length} / {completionChecklist.length}
              </div>
              <p style={styles.completionCardText}>
                Items completed: {completionChecklist.filter(item => item.checked).length} of {completionChecklist.length}
              </p>
            </div>

            {/* Actions */}
            <div style={styles.completionActions}>
              <button
                style={completionChecklist.filter(item => item.checked).length === completionChecklist.length 
                  ? (hoveredButton === 'confirm-complete' ? { ...styles.completeBtn, ...styles.completeBtnHover } : styles.completeBtn)
                  : { ...styles.completeBtn, ...styles.completeBtnDisabled }
                }
                onMouseEnter={() => setHoveredButton('confirm-complete')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={confirmCompletion}
                disabled={completionChecklist.filter(item => item.checked).length !== completionChecklist.length}
              >
                <span>✅</span>
                {completionChecklist.filter(item => item.checked).length === completionChecklist.length 
                  ? 'Complete Tour' 
                  : `Complete All Items (${completionChecklist.filter(item => item.checked).length}/${completionChecklist.length})`}
              </button>
              <button
                style={hoveredButton === 'cancel-complete' ? { ...styles.cancelBtn, ...styles.cancelBtnHover } : styles.cancelBtn}
                onMouseEnter={() => setHoveredButton('cancel-complete')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => setShowCompletionModal(false)}
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