const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// All dashboard routes require admin or manager authentication
router.use(authenticateToken);
router.use(authorizeRoles('admin', 'manager'));

// Get combined dashboard data
router.get('/full', dashboardController.getFullDashboard);

// Get overall statistics
router.get('/stats', dashboardController.getDashboardStats);

// Get specific statistics
router.get('/bookings', dashboardController.getBookingStats);
router.get('/drivers', dashboardController.getDriverStats);
router.get('/hotel-agents', dashboardController.getHotelAgentStats);
router.get('/revenue', dashboardController.getRevenueStats);

// Get recent data
router.get('/recent-bookings', dashboardController.getRecentBookings);
router.get('/recent-users', dashboardController.getRecentUsers);
router.get('/top-packages', dashboardController.getTopPackages);

module.exports = router;
