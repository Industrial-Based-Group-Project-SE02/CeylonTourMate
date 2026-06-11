const express = require('express');
const router = express.Router();
const hotelRoomController = require('../controllers/hotelRoomController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Admin/Manager routes for all rooms (must come before :roomId param routes)
router.get('/all', authorizeRoles('admin', 'manager'), hotelRoomController.getAllRooms);

// Hotel agents can manage their own rooms
router.use(authorizeRoles('hotel_agent', 'admin', 'manager'));

// Room management routes
router.get('/my-rooms', hotelRoomController.getMyRooms);
router.post('/', hotelRoomController.createRoom);
router.put('/:id', hotelRoomController.updateRoom);
router.delete('/:id', hotelRoomController.deleteRoom);

// Availability management routes (after specific routes to prevent conflicts)
router.get('/:roomId/availability', hotelRoomController.getRoomAvailability);
router.post('/:roomId/availability', hotelRoomController.updateAvailability);
router.post('/:roomId/availability/bulk', hotelRoomController.bulkUpdateAvailability);

module.exports = router;