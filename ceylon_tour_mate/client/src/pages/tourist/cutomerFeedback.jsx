import React, { useState } from 'react';
import { 
  FaStar, 
  FaSmile, 
  FaFrown, 
  FaMeh, 
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
  FaUser
} from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api/feedback';

const FEEDBACK_TYPES = [
  { 
    value: 'Excellent_Service', 
    label: 'Excellent Service',
    icon: '😊',
    color: '#10B981'
  },
  { 
    value: 'Guide_Performance', 
    label: 'Guide Performance',
    icon: '👨‍🏫',
    color: '#3B82F6'
  },
  { 
    value: 'Accommodation_Quality', 
    label: 'Accommodation Quality',
    icon: '🏨',
    color: '#8B5CF6'
  },
  { 
    value: 'Transport_Experience', 
    label: 'Transport Experience',
    icon: '🚗',
    color: '#F59E0B'
  },
  { 
    value: 'Booking_Process', 
    label: 'Booking Process',
    icon: '📋',
    color: '#EF4444'
  },
  { 
    value: 'General_Complaint', 
    label: 'General Complaint',
    icon: '📝',
    color: '#6B7280'
  },
];

const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
};

const CustomerFeedback = ({ tourId }) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const defaultTourId = tourId || 101;

  const getRatingIcon = (value) => {
    if (value <= 2) return <FaFrown color="#EF4444" />;
    if (value === 3) return <FaMeh color="#F59E0B" />;
    return <FaSmile color="#10B981" />;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (rating === 0 || feedbackType === '' || feedback.trim() === '') {
      setMessage('Please complete all required fields: rating, feedback type, and feedback text.');
      setIsError(true);
      return;
    }

    setIsSubmitting(true);

    const feedbackData = {
      tourId: defaultTourId,
      customerName: name,
      rating: rating,
      feedbackType: feedbackType,
      feedbackText: feedback,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setMessage('Thank you for your valuable feedback! We appreciate your input.');
      setIsError(false);
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setName('');
        setRating(0);
        setFeedbackType('');
        setFeedback('');
        setIsSubmitted(false);
      }, 3000);

    } catch (error) {
      console.error('Submission Error:', error);
      setMessage(`Submission failed: ${error.message}`);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div style={styles.successContainer}>
        <FaCheckCircle size={64} color="#1e3a8a" />
        <h2 style={styles.successTitle}>Feedback Submitted Successfully!</h2>
        <p style={styles.successMessage}>Thank you for sharing your experience with us.</p>
        <p style={styles.successSubMessage}>Your feedback is valuable in helping us improve our services.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <div style={styles.headerOverlay}></div>
        <div style={styles.headerContent}>
          <div style={styles.headerIcon}>🌟</div>
          <h2 style={styles.header}>Share Your Tour Experience</h2>
          <p style={styles.subHeader}>
            Tour #{defaultTourId} • Your feedback helps us improve
          </p>
        </div>
      </div>

      {message && (
        <div style={isError ? styles.errorAlert : styles.successAlert}>
          <FaExclamationCircle style={styles.alertIcon} />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Rating Section */}
        <div style={styles.card}>
          <label style={styles.cardLabel}>
            How would you rate your tour experience? *
          </label>
          <div style={styles.ratingContainer}>
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <button
                  key={ratingValue}
                  type="button"
                  onClick={() => setRating(ratingValue)}
                  onMouseEnter={() => setHoverRating(ratingValue)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={styles.starButton}
                >
                  <FaStar
                    size={36}
                    color={
                      ratingValue <= (hoverRating || rating)
                        ? hoverRating <= 2 && ratingValue <= hoverRating
                          ? '#EF4444'
                          : hoverRating === 3 && ratingValue <= hoverRating
                          ? '#F59E0B'
                          : '#FBBF24'
                        : '#E5E7EB'
                    }
                    style={styles.starIcon}
                  />
                </button>
              );
            })}
          </div>
          {rating > 0 && (
            <div style={styles.ratingFeedback}>
              {getRatingIcon(rating)}
              <span style={styles.ratingText}>
                {RATING_LABELS[rating]} • {rating}/5
              </span>
            </div>
          )}
        </div>

        {/* Feedback Type Section */}
        <div style={styles.card}>
          <label style={styles.cardLabel}>
            What aspect would you like to provide feedback on? *
          </label>
          <div style={styles.feedbackTypeGrid}>
            {FEEDBACK_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFeedbackType(type.value)}
                style={{
                  ...styles.feedbackTypeButton,
                  borderColor: feedbackType === type.value ? type.color : '#E5E7EB',
                  backgroundColor: feedbackType === type.value ? `${type.color}15` : 'white',
                }}
              >
                <span style={styles.typeIcon}>{type.icon}</span>
                <span style={styles.typeLabel}>{type.label}</span>
                {feedbackType === type.value && (
                  <div 
                    style={{
                      ...styles.typeIndicator,
                      backgroundColor: type.color
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Text Section */}
        <div style={styles.card}>
          <label style={styles.cardLabel}>
            Tell us more about your experience *
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What did you enjoy most? What could we improve? Share your thoughts..."
            style={styles.textarea}
            rows="4"
            maxLength={500}
          />
          <div style={styles.charCount}>
            {feedback.length}/500 characters
          </div>
        </div>

        {/* Name Section */}
        <div style={styles.card}>
          <label style={styles.cardLabel}>
            <FaUser style={styles.labelIcon} />
            Your Name (Optional)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            style={styles.nameInput}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || rating === 0 || !feedbackType || !feedback.trim()}
          style={{
            ...styles.submitButton,
            opacity: (rating === 0 || !feedbackType || !feedback.trim()) ? 0.6 : 1,
            cursor: (rating === 0 || !feedbackType || !feedback.trim() || isSubmitting) ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? (
            <>
              <div style={styles.spinner}></div>
              Sending Feedback...
            </>
          ) : (
            <>
              <FaPaperPlane style={styles.buttonIcon} />
              Submit Feedback
            </>
          )}
        </button>

        <div style={styles.footerNote}>
          Your feedback helps us improve the Ceylon Tour Mate experience for everyone.
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  headerSection: {
    position: 'relative',
    textAlign: 'center',
    marginBottom: '40px',
    padding: '40px 20px',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    borderRadius: '20px',
    color: 'white',
    boxShadow: '0 10px 40px rgba(30, 58, 138, 0.3)',
    overflow: 'hidden',
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
  headerContent: {
    position: 'relative',
    zIndex: 1,
  },
  headerIcon: {
    fontSize: '52px',
    marginBottom: '15px',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
  },
  header: {
    fontSize: '34px',
    fontWeight: '700',
    marginBottom: '10px',
    letterSpacing: '-0.5px',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  subHeader: {
    fontSize: '16px',
    opacity: '0.9',
    fontWeight: '400',
    maxWidth: '500px',
    margin: '0 auto',
    lineHeight: '1.5',
  },
  successContainer: {
    maxWidth: '600px',
    margin: '100px auto',
    padding: '60px 40px',
    textAlign: 'center',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(30, 58, 138, 0.1)',
    border: '1px solid #e2e8f0',
  },
  successTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e3a8a',
    margin: '20px 0 10px',
  },
  successMessage: {
    fontSize: '18px',
    color: '#4b5563',
    marginBottom: '10px',
    lineHeight: '1.5',
  },
  successSubMessage: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.5',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 20px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    color: '#dc2626',
    marginBottom: '24px',
    fontSize: '14px',
    fontWeight: '500',
  },
  successAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 20px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '12px',
    color: '#16a34a',
    marginBottom: '24px',
    fontSize: '14px',
    fontWeight: '500',
  },
  alertIcon: {
    flexShrink: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    backgroundColor: 'white',
    padding: '28px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(30, 58, 138, 0.05)',
    border: '1px solid #e2e8f0',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '20px',
  },
  labelIcon: {
    color: '#64748b',
  },
  ratingContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  starButton: {
    background: 'none',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  starButtonHover: {
    transform: 'scale(1.1)',
  },
  starIcon: {
    transition: 'all 0.2s',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
  },
  ratingFeedback: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#374151',
    marginTop: '12px',
    padding: '12px 20px',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    border: '1px solid #f1f5f9',
  },
  ratingText: {
    fontSize: '15px',
    fontWeight: '600',
  },
  feedbackTypeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '12px',
  },
  feedbackTypeButton: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px 12px',
    border: '2px solid',
    borderRadius: '12px',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minHeight: '100px',
  },
  typeIcon: {
    fontSize: '28px',
    marginBottom: '10px',
  },
  typeLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: '1.4',
  },
  typeIndicator: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '3px solid white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  textarea: {
    width: '100%',
    padding: '16px',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '15px',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    backgroundColor: '#f8fafc',
    color: '#1e293b',
  },
  textareaFocus: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    outline: 'none',
  },
  charCount: {
    textAlign: 'right',
    fontSize: '13px',
    color: '#64748b',
    marginTop: '8px',
    fontWeight: '500',
  },
  nameInput: {
    width: '100%',
    padding: '16px',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '15px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    backgroundColor: '#f8fafc',
    color: '#1e293b',
  },
  nameInputFocus: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    outline: 'none',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    width: '100%',
    padding: '18px',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '8px',
    boxShadow: '0 4px 20px rgba(30, 58, 138, 0.3)',
  },
  submitButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 25px rgba(30, 58, 138, 0.4)',
    background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
  },
  buttonIcon: {
    fontSize: '18px',
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  footerNote: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#64748b',
    marginTop: '20px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontWeight: '500',
  },
};

// Add global CSS for spinner animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    button:hover {
      transform: translateY(-1px);
    }
    
    .feedback-type-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
  `;
  document.head.appendChild(style);
}

export default CustomerFeedback;