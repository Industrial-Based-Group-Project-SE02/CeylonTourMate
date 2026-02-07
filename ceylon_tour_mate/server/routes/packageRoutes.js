const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');

// Public routes
router.get('/', packageController.getAllPackages);
router.get('/statistics', packageController.getStatistics);
router.get('/:id', packageController.getPackageById);

// Protected routes (add authentication later)
router.post('/', packageController.createPackage);
router.patch('/:id/status', packageController.updatePackageStatus);
router.delete('/bulk', packageController.bulkDeletePackages);
router.delete('/:id', packageController.deletePackage);



router.put('/:id', packageController.updatePackage);


module.exports = router;