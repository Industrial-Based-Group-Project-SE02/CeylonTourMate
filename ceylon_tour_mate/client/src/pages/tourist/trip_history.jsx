import React, { useState } from 'react';

const TripHistory = () => {
  // Cute and compact inline styles
  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#faf7ff',
      minHeight: '100vh',
      fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    },
    header: {
      marginBottom: '30px',
      textAlign: 'center'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#7c3aed',
      margin: '0 0 8px 0',
      letterSpacing: '-0.025em'
    },
    subtitle: {
      fontSize: '16px',
      color: '#8b5cf6',
      margin: '0',
      opacity: 0.8
    },
    
    // Stats Cards
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '30px'
    },
    statCard: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '16px',
      border: '2px solid #f3e8ff',
      boxShadow: '0 6px 20px rgba(124, 58, 237, 0.08)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    },
    statCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 30px rgba(124, 58, 237, 0.15)',
      borderColor: '#c4b5fd'
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
      fontSize: '13px',
      fontWeight: '600',
      color: '#8b5cf6',
      margin: '0 0 6px 0',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    statValue: {
      fontSize: '28px',
      fontWeight: '800',
      color: '#5b21b6',
      margin: '0'
    },
    statIcon: {
      padding: '12px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '48px',
      height: '48px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    totalIcon: { background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)', color: 'white' },
    completedIcon: { background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)', color: 'white' },
    upcomingIcon: { background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', color: 'white' },
    spentIcon: { background: 'linear-gradient(135deg, #f9a8d4 0%, #f472b6 100%)', color: 'white' },
    
    // Search and Filter Section
    filterSection: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '16px',
      border: '2px solid #f3e8ff',
      boxShadow: '0 6px 20px rgba(124, 58, 237, 0.08)',
      marginBottom: '30px'
    },
    searchContainer: {
      position: 'relative',
      width: '100%',
      marginBottom: '20px'
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#a78bfa',
      fontSize: '18px'
    },
    searchInput: {
      width: '100%',
      padding: '14px 16px 14px 48px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '15px',
      outline: 'none',
      transition: 'all 0.3s ease',
      backgroundColor: 'white',
      fontWeight: '500'
    },
    filterButtons: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px'
    },
    filterButton: {
      padding: '10px 20px',
      border: '2px solid #e5e7eb',
      borderRadius: '10px',
      backgroundColor: 'white',
      fontSize: '14px',
      fontWeight: '600',
      color: '#6b7280',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    filterButtonActive: {
      backgroundColor: '#8b5cf6',
      color: 'white',
      borderColor: '#8b5cf6'
    },
    
    // Trip Details Cards
    tripsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    tripCard: {
      backgroundColor: 'white',
      border: '2px solid #f3e8ff',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 6px 20px rgba(124, 58, 237, 0.08)',
      transition: 'all 0.3s ease'
    },
    tripContent: {
      padding: '24px'
    },
    tripHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '20px'
    },
    tripTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#5b21b6',
      margin: '0 0 8px 0'
    },
    tripDestination: {
      fontSize: '14px',
      color: '#8b5cf6',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    tripBadge: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    },
    completedBadge: { backgroundColor: '#d1fae5', color: '#065f46' },
    upcomingBadge: { backgroundColor: '#dbeafe', color: '#1e40af' },
    cancelledBadge: { backgroundColor: '#fee2e2', color: '#991b1b' },
    tripDetailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      marginBottom: '20px'
    },
    detailBox: {
      padding: '16px',
      backgroundColor: '#faf5ff',
      borderRadius: '12px',
      border: '1px solid #f3e8ff'
    },
    detailLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#8b5cf6',
      margin: '0 0 4px 0',
      textTransform: 'uppercase'
    },
    detailValue: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#5b21b6',
      margin: '0'
    },
    tripPrice: {
      fontSize: '28px',
      fontWeight: '800',
      color: '#5b21b6',
      textAlign: 'right'
    },
    actionsContainer: {
      display: 'flex',
      gap: '12px',
      paddingTop: '20px',
      borderTop: '2px solid #f3f4f6'
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
      gap: '6px'
    },
    primaryButton: { backgroundColor: '#8b5cf6', color: 'white' },
    secondaryButton: { backgroundColor: '#f3f4f6', color: '#374151' },

    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '2px dashed #ddd6fe'
    },
    emptyIcon: { fontSize: '48px', color: '#a78bfa', marginBottom: '16px' },
    emptyText: { fontSize: '16px', color: '#6b7280', margin: '0' }
  };

  const [trips] = useState([
    { id: 1, packageName: "Golden Beach Escape", destination: "Galle, Sri Lanka", bookingId: "BK-2024-00123", travelDate: "2024-02-20", returnDate: "2024-02-27", totalAmount: 1250, status: "completed", guideName: "Kamal Perera" },
    { id: 2, packageName: "Cultural Triangle Tour", destination: "Kandy, Sigiriya, Polonnaruwa", bookingId: "BK-2024-00245", travelDate: "2024-03-05", returnDate: "2024-03-10", totalAmount: 1800, status: "completed", guideName: "Saman Silva" },
    { id: 3, packageName: "Hill Country Adventure", destination: "Nuwara Eliya, Ella", bookingId: "BK-2024-00378", travelDate: "2024-04-15", returnDate: "2024-04-22", totalAmount: 2100, status: "upcoming", guideName: "Sunil Fernando" },
    { id: 4, packageName: "Wildlife Safari", destination: "Yala National Park", bookingId: "BK-2024-00456", travelDate: "2024-02-10", returnDate: "2024-02-12", totalAmount: 450, status: "cancelled", guideName: "Rajitha Bandara" },
    { id: 5, packageName: "City Lights Tour", destination: "Colombo, Negombo", bookingId: "BK-2024-00567", travelDate: "2024-05-10", returnDate: "2024-05-15", totalAmount: 900, status: "upcoming", guideName: "Nimal Rathnayake" }
  ]);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);

  const filteredTrips = trips.filter(trip => {
    if (filter !== "all" && trip.status !== filter) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return trip.packageName.toLowerCase().includes(searchLower) || trip.destination.toLowerCase().includes(searchLower);
    }
    return true;
  });

  const stats = {
    total: trips.length,
    completed: trips.filter(t => t.status === "completed").length,
    upcoming: trips.filter(t => t.status === "upcoming").length,
    totalSpent: trips.filter(t => t.status === "completed").reduce((sum, trip) => sum + trip.totalAmount, 0)
  };

  const StatusBadge = ({ status }) => {
    const badgeStyle = status === "completed" ? styles.completedBadge : status === "upcoming" ? styles.upcomingBadge : styles.cancelledBadge;
    return <span style={{ ...styles.tripBadge, ...badgeStyle }}>{status === "completed" ? "✓" : status === "upcoming" ? "📅" : "✕"} {status}</span>;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>✨ Your Trip History</h1>
        <p style={styles.subtitle}>All your travel adventures in one place</p>
      </div>

      {/* Statistics Cards - KEPT */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}><div style={styles.statContent}><div style={styles.statText}><p style={styles.statLabel}>Total Trips</p><p style={styles.statValue}>{stats.total}</p></div><div style={{ ...styles.statIcon, ...styles.totalIcon }}>🧳</div></div></div>
        <div style={styles.statCard}><div style={styles.statContent}><div style={styles.statText}><p style={styles.statLabel}>Completed</p><p style={styles.statValue}>{stats.completed}</p></div><div style={{ ...styles.statIcon, ...styles.completedIcon }}>✓</div></div></div>
        <div style={styles.statCard}><div style={styles.statContent}><div style={styles.statText}><p style={styles.statLabel}>Upcoming</p><p style={styles.statValue}>{stats.upcoming}</p></div><div style={{ ...styles.statIcon, ...styles.upcomingIcon }}>📅</div></div></div>
        <div style={styles.statCard}><div style={styles.statContent}><div style={styles.statText}><p style={styles.statLabel}>Total Spent</p><p style={styles.statValue}>${stats.totalSpent}</p></div><div style={{ ...styles.statIcon, ...styles.spentIcon }}>💰</div></div></div>
      </div>

      {/* Search and Filter - KEPT */}
      <div style={styles.filterSection}>
        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input type="text" placeholder="Search trips..." style={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div style={styles.filterButtons}>
          {['all', 'completed', 'upcoming', 'cancelled'].map(f => (
            <button key={f} style={filter === f ? { ...styles.filterButton, ...styles.filterButtonActive } : styles.filterButton} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)} Trips
            </button>
          ))}
        </div>
      </div>

      {/* Trip Details List - KEPT */}
      <div style={styles.tripsList}>
        {filteredTrips.length > 0 ? (
          filteredTrips.map(trip => (
            <div key={trip.id} style={{ ...styles.tripCard, ...(hoveredItem === trip.id && styles.tripCardHover) }} onMouseEnter={() => setHoveredItem(trip.id)} onMouseLeave={() => setHoveredItem(null)}>
              <div style={styles.tripContent}>
                <div style={styles.tripHeader}>
                  <div><h3 style={styles.tripTitle}>{trip.packageName}</h3><p style={styles.tripDestination}>📍 {trip.destination}</p></div>
                  <div><StatusBadge status={trip.status} /><p style={styles.tripPrice}>${trip.totalAmount}</p></div>
                </div>
                <div style={styles.tripDetailsGrid}>
                  <div style={styles.detailBox}><p style={styles.detailLabel}>Booking ID</p><p style={styles.detailValue}>{trip.bookingId}</p></div>
                  <div style={styles.detailBox}><p style={styles.detailLabel}>Travel Date</p><p style={styles.detailValue}>{trip.travelDate}</p></div>
                  <div style={styles.detailBox}><p style={styles.detailLabel}>Guide</p><p style={styles.detailValue}>{trip.guideName}</p></div>
                </div>
                <div style={styles.actionsContainer}>
                  <button style={{ ...styles.actionButton, ...styles.primaryButton }}>📄 View Invoice</button>
                  <button style={{ ...styles.actionButton, ...styles.secondaryButton }}>🔄 Book Again</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.emptyState}><div style={styles.emptyIcon}>🧳</div><p style={styles.emptyText}>No trips found</p></div>
        )}
      </div>
    </div>
  );
};

export default TripHistory;



