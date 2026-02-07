import React, { useState, useEffect } from 'react';


import DashboardLayout from '../../components/DashboardLayout';
const BookingApprovals = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [approvalReason, setApprovalReason] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPaymentSlip, setShowPaymentSlip] = useState(false);

  // Styles
  const styles = {
    container: {
      padding: '30px',
      paddingLeft: '280px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      marginLeft: 0,
      marginTop: 0
    },
    header: {
      marginBottom: '30px',
      textAlign: 'center'
    },
    title: {
      fontSize: '36px',
      fontWeight: '800',
      color: '#2d3748',
      margin: '0 0 10px 0'
    },
    subtitle: {
      fontSize: '16px',
      color: '#718096',
      margin: '0'
    },
    
    // Filter Bar
    filterBar: {
      display: 'flex',
      gap: '12px',
      marginBottom: '30px',
      backgroundColor: 'white',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    filterButton: {
      padding: '10px 20px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      backgroundColor: 'white',
      fontSize: '14px',
      fontWeight: '600',
      color: '#4a5568',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    filterButtonActive: {
      backgroundColor: '#667eea',
      color: 'white',
      borderColor: '#667eea'
    },

    // Booking Cards
    bookingsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    bookingCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      border: '2px solid transparent',
      cursor: 'pointer'
    },
    bookingCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
      borderColor: '#667eea'
    },
    bookingCardHeader: {
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      borderBottom: '3px solid #667eea'
    },
    bookingCardTitle: {
      fontSize: '18px',
      fontWeight: '700',
      margin: '0 0 8px 0'
    },
    bookingCardId: {
      fontSize: '13px',
      opacity: 0.9,
      margin: '0',
      fontWeight: '600'
    },
    bookingCardBody: {
      padding: '20px'
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '12px',
      fontSize: '14px',
      color: '#2d3748'
    },
    infoLabel: {
      fontWeight: '600',
      color: '#4a5568'
    },
    infoValue: {
      fontWeight: '500',
      color: '#2d3748'
    },
    statusBadge: {
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      marginBottom: '12px'
    },
    pendingBadge: {
      backgroundColor: '#fef3c7',
      color: '#92400e'
    },
    
    // Action Buttons
    actionButtons: {
      display: 'flex',
      gap: '10px',
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px solid #e2e8f0'
    },
    approveButton: {
      flex: 1,
      padding: '10px 16px',
      backgroundColor: '#48bb78',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    approveButtonHover: {
      backgroundColor: '#38a169',
      transform: 'translateY(-2px)'
    },
    rejectButton: {
      flex: 1,
      padding: '10px 16px',
      backgroundColor: '#f56565',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    rejectButtonHover: {
      backgroundColor: '#e53e3e',
      transform: 'translateY(-2px)'
    },
    viewButton: {
      flex: 1,
      padding: '10px 16px',
      backgroundColor: '#4299e1',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    viewButtonHover: {
      backgroundColor: '#3182ce',
      transform: 'translateY(-2px)'
    },

    // Modal
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
      zIndex: 1000
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '16px',
      maxWidth: '700px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    modalHeader: {
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '24px',
      fontSize: '22px',
      fontWeight: '700',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    closeButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      fontSize: '24px',
      cursor: 'pointer'
    },
    modalBody: {
      padding: '24px'
    },
    detailSection: {
      marginBottom: '24px'
    },
    detailSectionTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#2d3748',
      marginBottom: '12px',
      paddingBottom: '8px',
      borderBottom: '2px solid #e2e8f0'
    },
    detailGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px'
    },
    detailItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    detailItemLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#718096',
      textTransform: 'uppercase'
    },
    detailItemValue: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#2d3748'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      fontFamily: 'inherit',
      resize: 'vertical',
      minHeight: '80px',
      marginTop: '8px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#718096'
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '16px'
    },
    loadingState: {
      textAlign: 'center',
      padding: '40px',
      color: '#4a5568'
    }
  };

  // Fetch bookings
  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/bookings?status=${filter}&limit=100`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'confirmed' })
      });

      if (!response.ok) {
        throw new Error('Failed to approve booking');
      }

      alert('✅ Booking approved successfully!');
      fetchBookings();
      setSelectedBooking(null);
    } catch (err) {
      console.error('Error approving booking:', err);
      alert('Failed to approve booking');
    }
  };

  const handleReject = async (bookingId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: 'cancelled',
          cancellationReason: rejectionReason
        })
      });

      if (!response.ok) {
        throw new Error('Failed to reject booking');
      }

      alert('❌ Booking rejected successfully!');
      fetchBookings();
      setSelectedBooking(null);
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (err) {
      console.error('Error rejecting booking:', err);
      alert('Failed to reject booking');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📋 Booking Approvals</h1>
        <p style={styles.subtitle}>Manage and approve tourist bookings</p>
      </div>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        {['pending', 'confirmed', 'cancelled'].map(status => (
          <button
            key={status}
            style={{
              ...styles.filterButton,
              ...(filter === status && styles.filterButtonActive)
            }}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div style={styles.loadingState}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
          <p>Loading bookings...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ ...styles.emptyState, backgroundColor: '#fed7d7', color: '#742a2a', padding: '24px', borderRadius: '12px' }}>
          <div>⚠️ {error}</div>
        </div>
      )}

      {/* Bookings Grid */}
      {!loading && !error && bookings.length > 0 && (
        <div style={styles.bookingsGrid}>
          {bookings.map(booking => (
            <div
              key={booking.id}
              style={styles.bookingCard}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.bookingCardHover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.bookingCard)}
            >
              <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', ...styles.bookingCardHeader }}>
                <h3 style={styles.bookingCardTitle}>{booking.name}</h3>
                <p style={styles.bookingCardId}>ID: BK-{booking.id.toString().padStart(6, '0')}</p>
              </div>

              <div style={styles.bookingCardBody}>
                <div style={{ ...styles.statusBadge, ...styles.pendingBadge }}>
                  {booking.status === 'pending' ? '⏳ Pending' : booking.status === 'confirmed' ? '✓ Confirmed' : '✕ Cancelled'}
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Package:</span>
                  <span style={styles.infoValue}>{booking.package || 'Custom'}</span>
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Price:</span>
                  <span style={styles.infoValue}>{booking.price}</span>
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Travel Date:</span>
                  <span style={styles.infoValue}>{booking.arrivalDate}</span>
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Days:</span>
                  <span style={styles.infoValue}>{booking.travelDays}</span>
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Email:</span>
                  <span style={styles.infoValue}>{booking.email}</span>
                </div>

                <div style={styles.actionButtons}>
                  <button
                    style={styles.viewButton}
                    onMouseEnter={(e) => Object.assign(e.target.style, styles.viewButtonHover)}
                    onMouseLeave={(e) => Object.assign(e.target.style, styles.viewButton)}
                    onClick={() => setSelectedBooking(booking)}
                  >
                    👁️ View Details
                  </button>
                  {booking.status === 'pending' && (
                    <>
                      <button
                        style={styles.approveButton}
                        onMouseEnter={(e) => Object.assign(e.target.style, styles.approveButtonHover)}
                        onMouseLeave={(e) => Object.assign(e.target.style, styles.approveButton)}
                        onClick={() => handleApprove(booking.id)}
                      >
                        ✓ Approve
                      </button>
                      <button
                        style={styles.rejectButton}
                        onMouseEnter={(e) => Object.assign(e.target.style, styles.rejectButtonHover)}
                        onMouseLeave={(e) => Object.assign(e.target.style, styles.rejectButton)}
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowRejectModal(true);
                        }}
                      >
                        ✕ Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && bookings.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🎉</div>
          <p style={{ fontSize: '18px', color: '#718096' }}>No {filter} bookings at the moment</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedBooking && !showRejectModal && (
        <div style={styles.modalOverlay} onClick={() => setSelectedBooking(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <span>📋 Booking Details</span>
              <button style={styles.closeButton} onClick={() => setSelectedBooking(null)}>×</button>
            </div>

            <div style={styles.modalBody}>
              {/* Tourist Information */}
              <div style={styles.detailSection}>
                <h3 style={styles.detailSectionTitle}>👤 Tourist Information</h3>
                <div style={styles.detailGrid}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailItemLabel}>Name</span>
                    <span style={styles.detailItemValue}>{selectedBooking.name}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailItemLabel}>Email</span>
                    <span style={styles.detailItemValue}>{selectedBooking.email}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailItemLabel}>Phone</span>
                    <span style={styles.detailItemValue}>{selectedBooking.phone || 'N/A'}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailItemLabel}>Passport</span>
                    <span style={styles.detailItemValue}>{selectedBooking.passport || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Travel Information */}
              <div style={styles.detailSection}>
                <h3 style={styles.detailSectionTitle}>✈️ Travel Information</h3>
                <div style={styles.detailGrid}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailItemLabel}>Package</span>
                    <span style={styles.detailItemValue}>{selectedBooking.packageCategory || selectedBooking.package || 'Custom'}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailItemLabel}>Arrival Date</span>
                    <span style={styles.detailItemValue}>{selectedBooking.arrivalDate}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailItemLabel}>Travel Days</span>
                    <span style={styles.detailItemValue}>{selectedBooking.travelDays}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailItemLabel}>Price</span>
                    <span style={styles.detailItemValue}>{selectedBooking.price}</span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              {selectedBooking.paymentSlipUrl && (
                <div style={styles.detailSection}>
                  <h3 style={styles.detailSectionTitle}>💳 Payment Details</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <div style={styles.detailItem}>
                      <span style={styles.detailItemLabel}>Payment Status</span>
                      <span style={styles.detailItemValue}>{selectedBooking.paymentStatus || 'Pending'}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailItemLabel}>Payment Slip</span>
                      <button
                        onClick={() => setShowPaymentSlip(true)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#667eea',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        👁️ View Slip
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedBooking.status === 'pending' && (
                <div style={styles.actionButtons}>
                  <button
                    style={styles.approveButton}
                    onClick={() => handleApprove(selectedBooking.id)}
                  >
                    ✓ Approve Booking
                  </button>
                  <button
                    style={styles.rejectButton}
                    onClick={() => setShowRejectModal(true)}
                  >
                    ✕ Reject Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div style={styles.modalOverlay} onClick={() => setShowRejectModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <span>❌ Reject Booking</span>
              <button style={styles.closeButton} onClick={() => setShowRejectModal(false)}>×</button>
            </div>

            <div style={styles.modalBody}>
              <p style={{ color: '#4a5568', marginBottom: '16px', fontSize: '15px' }}>
                Are you sure you want to reject this booking? Please provide a reason for the rejection.
              </p>

              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>
                Rejection Reason
              </label>
              <textarea
                style={styles.textarea}
                placeholder="Explain why this booking is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />

              <div style={styles.actionButtons}>
                <button
                  style={{ ...styles.rejectButton, marginTop: '16px' }}
                  onClick={() => handleReject(selectedBooking.id)}
                >
                  ✕ Confirm Rejection
                </button>
                <button
                  style={{ ...styles.viewButton, marginTop: '16px' }}
                  onClick={() => setShowRejectModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Slip Modal */}
      {showPaymentSlip && selectedBooking && (
        <div style={styles.modalOverlay} onClick={() => setShowPaymentSlip(false)}>
          <div style={{ ...styles.modal, maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <span>💳 Payment Slip</span>
              <button style={styles.closeButton} onClick={() => setShowPaymentSlip(false)}>×</button>
            </div>

            <div style={styles.modalBody}>
              {selectedBooking.paymentSlipUrl ? (
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={selectedBooking.paymentSlipUrl}
                    alt="Payment Slip"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '600px',
                      borderRadius: '12px',
                      border: '2px solid #e2e8f0'
                    }}
                  />
                  <p style={{ marginTop: '16px', color: '#718096', fontSize: '14px' }}>
                    📄 Payment Slip for Booking ID: BK-{selectedBooking.id.toString().padStart(6, '0')}
                  </p>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#718096', padding: '40px' }}>
                  <p>No payment slip uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingApprovals;