const pool = require('../config/db');

// @desc    Get all pending notifications for a user
// @route   GET /api/notifications
// @access  Private (User)
exports.getPendingNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user owns these notifications
    if (req.user && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Cannot view other users notifications' 
      });
    }

    const query = `
      SELECT 
        nm.id,
        nm.user_id,
        nm.booking_id,
        nm.message,
        nm.type,
        nm.is_dismissed,
        nm.created_at,
        bf.fullname,
        bf.email,
        bf.arrival_date,
        p.package_name
      FROM notification_messages nm
      LEFT JOIN booking_form bf ON nm.booking_id = bf.id
      LEFT JOIN packages p ON bf.package_id = p.id
      WHERE nm.user_id = $1 AND nm.is_dismissed = FALSE
      ORDER BY nm.created_at DESC
    `;

    const result = await pool.query(query, [userId]);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications',
      details: error.message
    });
  }
};

// @desc    Dismiss a notification
// @route   PATCH /api/notifications/:id/dismiss
// @access  Private (User)
exports.dismissNotification = async (req, res) => {
  try {
    const { id } = req.params;

    // First, get the notification to verify ownership
    const checkQuery = `
      SELECT user_id FROM notification_messages WHERE id = $1
    `;
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    const notification = checkResult.rows[0];

    // Verify user owns this notification
    if (req.user && req.user.id !== notification.user_id) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: Cannot dismiss other users notifications'
      });
    }

    // Update notification to mark as dismissed
    const updateQuery = `
      UPDATE notification_messages
      SET is_dismissed = TRUE, dismissed_at = NOW(), updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [id]);

    res.json({
      success: true,
      message: 'Notification dismissed successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error dismissing notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to dismiss notification',
      details: error.message
    });
  }
};

// @desc    Create a notification for a booking (internal use)
// @route   Used by booking controller
// @access  Private
exports.createNotification = async (userId, bookingId, message, type = 'booking_confirmed') => {
  try {
    const query = `
      INSERT INTO notification_messages (user_id, booking_id, message, type, is_dismissed)
      VALUES ($1, $2, $3, $4, FALSE)
      ON CONFLICT (user_id, booking_id) WHERE is_dismissed = FALSE
      DO UPDATE SET message = EXCLUDED.message, updated_at = NOW()
      RETURNING *
    `;

    const result = await pool.query(query, [userId, bookingId, message, type]);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new Error(`Failed to create notification: ${error.message}`);
  }
};

// @desc    Delete all dismissed notifications older than 30 days (cleanup)
// @route   POST /api/notifications/cleanup
// @access  Private (Admin)
exports.cleanupOldNotifications = async (req, res) => {
  try {
    const query = `
      DELETE FROM notification_messages
      WHERE is_dismissed = TRUE AND dismissed_at < NOW() - INTERVAL '30 days'
    `;

    await pool.query(query);

    res.json({
      success: true,
      message: 'Old notifications cleaned up successfully'
    });
  } catch (error) {
    console.error('Error cleaning up notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cleanup notifications',
      details: error.message
    });
  }
};
