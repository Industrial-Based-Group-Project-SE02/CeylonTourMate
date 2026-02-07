const express = require('express');
const router = express.Router();
const hotelRoomController = require('../controllers/hotelRoomController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);

router.post('/', authorizeRoles('hotel_agent', 'manager', 'admin'), hotelRoomController.createRoom);
router.get('/', authorizeRoles('hotel_agent', 'manager', 'admin'), hotelRoomController.getRooms);
router.put('/:id', authorizeRoles('hotel_agent', 'manager', 'admin'), hotelRoomController.updateRoom);

// Check availability for specific dates
router.post('/check-dates', authorizeRoles('hotel_agent'), hotelRoomController.checkAvailabilityForDates);

router.post('/:id/availability', authorizeRoles('hotel_agent'), hotelRoomController.upsertAvailability);
router.get('/:id/availability', authorizeRoles('hotel_agent', 'manager', 'admin'), hotelRoomController.getAvailability);

module.exports = router;