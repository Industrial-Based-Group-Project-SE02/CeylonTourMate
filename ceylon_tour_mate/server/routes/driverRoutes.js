
const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Public read routes (no authentication required)
router.get('/', driverController.getAllDrivers);
router.get('/:userId', driverController.getDriverById);

// Protected routes require authentication and manager/admin role
router.use(authenticateToken);
router.use(authorizeRoles('admin', 'manager'));

// Create driver details (after user account created)
router.post('/:userId/details', driverController.createDriverDetails);

// Update driver details
router.put('/:userId/details', driverController.updateDriverDetails);

// Delete driver details
router.delete('/:userId/details', driverController.deleteDriverDetails);

// Update driver availability status
router.patch('/:userId/availability', driverController.updateDriverAvailability);

module.exports = router;