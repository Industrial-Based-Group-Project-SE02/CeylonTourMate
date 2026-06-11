const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// All report routes require authentication and admin or manager role
router.use(authenticateToken);
router.use(authorizeRoles('admin', 'manager'));

// User Summary Report - Total, Active, Inactive, By Role
router.get('/user-summary', reportController.getUserSummary);

// User Growth Trend Report - New registrations over time
router.get('/user-growth', reportController.getUserGrowth);

// User Status Report - Active vs Inactive by role
router.get('/user-status', reportController.getUserStatus);

// Geographic Distribution Report - Users by province/district
router.get('/geographic-distribution', reportController.getGeographicDistribution);

// User Engagement Report - Activity trends, login frequency
router.get('/user-engagement', reportController.getUserEngagement);

// Detailed User List Report - With filtering and pagination
router.get('/user-list', reportController.getUserDetailedList);

// Confirmed Bookings Report - Detailed list with user information
router.get('/confirmed-bookings', reportController.getConfirmedBookingsReport);

// Confirmed Bookings Summary - Summary statistics and breakdown
router.get('/confirmed-bookings-summary', reportController.getConfirmedBookingsSummary);

// Confirmed Bookings PDF - generate downloadable PDF report
router.get('/confirmed-bookings-pdf', reportController.generateBookingsPdf);

// Manager-only PDF download (restrict to manager role explicitly)
router.get('/manager/confirmed-bookings-pdf', authenticateToken, authorizeRoles('manager'), reportController.generateBookingsPdf);

// Booking Diagnostics - Debug endpoint to check booking statuses
router.get('/booking-diagnostics', reportController.getBookingDiagnostics);

// Mark Random Bookings as Confirmed (Test Data) - Admin only
router.post('/test/mark-confirmed', authenticateToken, authorizeRoles('admin'), reportController.markRandomBookingsAsConfirmed);

module.exports = router;
