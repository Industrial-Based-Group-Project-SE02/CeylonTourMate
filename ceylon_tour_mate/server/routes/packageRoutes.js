// // // const express = require('express');
// // // const router = express.Router();
// // // const packageController = require('../controllers/packageController');

// // // // Public routes
// // // router.get('/', packageController.getAllPackages);
// // // router.get('/statistics', packageController.getStatistics);
// // // router.get('/:id', packageController.getPackageById);

// // // // Protected routes (add authentication later)
// // // router.post('/', packageController.createPackage);
// // // router.patch('/:id/status', packageController.updatePackageStatus);
// // // router.delete('/bulk', packageController.bulkDeletePackages);
// // // router.delete('/:id', packageController.deletePackage);



// // // router.put('/:id', packageController.updatePackage);


// // // module.exports = router;


// // const express = require('express');
// // const router = express.Router();
// // const packageController = require('../controllers/packageController');

// // // Public routes
// // router.get('/', packageController.getAllPackages);
// // router.get('/statistics', packageController.getStatistics);

// // // NEW: Routes for booking form
// // router.get('/active-packages', packageController.getActivePackages);
// // router.get('/vehicle-info', packageController.getVehicleInfo);
// // router.get('/destinations', packageController.getDestinations);

// // router.get('/:id', packageController.getPackageById);

// // // Protected routes (add authentication later)
// // router.post('/', packageController.createPackage);
// // router.patch('/:id/status', packageController.updatePackageStatus);
// // router.delete('/bulk', packageController.bulkDeletePackages);
// // router.delete('/:id', packageController.deletePackage);
// // router.put('/:id', packageController.updatePackage);

// // module.exports = router;



// const express = require('express');
// const router = express.Router();
// const packageController = require('../controllers/packageController');

// // ============================================
// // DEBUG ROUTE - Test database connectivity
// // ============================================
// router.get('/debug', packageController.debugDatabase);

// // ============================================
// // PUBLIC ROUTES
// // ============================================
// router.get('/', packageController.getAllPackages);
// router.get('/statistics', packageController.getStatistics);

// // Routes for booking form (MUST come before /:id to avoid conflicts)
// router.get('/active-packages', packageController.getActivePackages);
// router.get('/vehicle-info', packageController.getVehicleInfo);
// router.get('/destinations', packageController.getDestinations);

// // Get single package by ID (MUST come after specific routes)
// router.get('/:id', packageController.getPackageById);

// // ============================================
// // PROTECTED ROUTES (add authentication middleware later)
// // ============================================
// router.post('/', packageController.createPackage);
// router.put('/:id', packageController.updatePackage);
// router.patch('/:id/status', packageController.updatePackageStatus);
// router.delete('/:id', packageController.deletePackage);
// router.delete('/bulk', packageController.bulkDeletePackages);

// module.exports = router;



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

// Bulk delete route - MUST come before /:id to avoid route conflicts
router.post('/bulk-delete', packageController.bulkDeletePackages);

// Single delete route
router.delete('/:id', packageController.deletePackage);

// Test route to verify server has latest code
router.get('/test-delete-route', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Delete routes are loaded!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;