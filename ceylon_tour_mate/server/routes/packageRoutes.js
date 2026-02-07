
const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');

// ============================================
// DEBUG ROUTE - Test database connectivity
// ============================================
router.get('/debug', packageController.debugDatabase);

// ============================================
// PUBLIC ROUTES
// ============================================
router.get('/', packageController.getAllPackages);
router.get('/statistics', packageController.getStatistics);
router.get('/last-code', packageController.getLastPackageCode);

// Routes for booking form (MUST come before /:id to avoid conflicts)
router.get('/active-packages', packageController.getActivePackages);
router.get('/vehicle-info', packageController.getVehicleInfo);
router.get('/destinations', packageController.getDestinations);

// Get single package by ID (MUST come after specific routes)
router.get('/:id', packageController.getPackageById);

// ============================================
// PROTECTED ROUTES (add authentication middleware later)
// ============================================
router.post('/', packageController.createPackage);
router.put('/:id', packageController.updatePackage);
router.patch('/:id/status', packageController.updatePackageStatus);
router.post('/bulk-delete', packageController.bulkDeletePackages);
router.delete('/:id', packageController.deletePackage);

module.exports = router;