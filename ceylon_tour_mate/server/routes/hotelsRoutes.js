const express = require('express');
const router = express.Router();
const hotelsController = require('../controllers/hotelsController');
const { authenticateToken } = require('../middleware/auth');

// Public routes - get available hotels and hotel details
router.get('/available', hotelsController.getAvailableHotels);
router.get('/:id', hotelsController.getHotelDetails);
router.get('/:id/rooms', hotelsController.getHotelRooms);

module.exports = router;
