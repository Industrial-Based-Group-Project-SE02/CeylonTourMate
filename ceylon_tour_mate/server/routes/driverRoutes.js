const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

// Most specific routes first (avoid wildcard conflicts)
router.get('/available', driverController.getAvailableDrivers);

// Then general routes
router.get('/', driverController.getAllDrivers);
router.get('/user/:userId', driverController.getDriverByUserId);
router.get('/:userId', driverController.getDriverById);

// ============================================
// DRIVER SELF-SERVICE ROUTES (Authentication required)
// ============================================
router.get('/me/assignments', authenticateToken, authorizeRoles('driver'), driverController.getMyAssignments);
router.post('/me/assignments/:assignmentId/respond', authenticateToken, authorizeRoles('driver'), driverController.respondToAssignment);

// Self-service driver profile routes
router.post('/', authenticateToken, authorizeRoles('driver'), driverController.createOwnDriverProfile);
router.put('/:userId', authenticateToken, authorizeRoles('driver'), driverController.updateOwnDriverProfile);

// ============================================
// ADMIN/MANAGER ROUTES (Protected)
// ============================================
router.post('/:userId/details', authenticateToken, authorizeRoles('admin', 'manager'), driverController.createDriverDetails);
router.put('/:userId/details', authenticateToken, authorizeRoles('admin', 'manager'), driverController.updateDriverDetails);
router.delete('/:userId', authenticateToken, authorizeRoles('admin', 'manager'), driverController.deleteDriver);
router.delete('/:userId/details', authenticateToken, authorizeRoles('admin', 'manager'), driverController.deleteDriverDetails);
router.patch('/:userId/availability', authenticateToken, authorizeRoles('admin', 'manager'), driverController.updateDriverAvailability);

module.exports = router;