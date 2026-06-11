const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// @route   GET /api/notifications/:userId
// @desc    Get all pending notifications for a user
// @access  Private (User)
router.get('/:userId', notificationController.getPendingNotifications);

// @route   PATCH /api/notifications/:id/dismiss
// @desc    Dismiss a notification
// @access  Private (User)
router.patch('/:id/dismiss', notificationController.dismissNotification);

// @route   POST /api/notifications/cleanup
// @desc    Cleanup old dismissed notifications (admin only)
// @access  Private (Admin)
router.post('/cleanup', notificationController.cleanupOldNotifications);

module.exports = router;
