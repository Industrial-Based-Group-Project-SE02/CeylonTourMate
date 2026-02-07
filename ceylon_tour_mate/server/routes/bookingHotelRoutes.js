const express = require('express');
const router = express.Router();
const bookingHotelController = require('../controllers/bookingHotelController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);

// Manager endpoints
router.post('/check-availability', authorizeRoles('manager', 'admin'), bookingHotelController.checkAvailability);
router.post('/', authorizeRoles('manager', 'admin'), bookingHotelController.createBookingHotel);
router.patch('/:id/confirm', authorizeRoles('manager', 'admin'), bookingHotelController.confirmBookingHotel);

// Hotel Agent endpoints
router.get('/agent-requests', authorizeRoles('hotel_agent'), bookingHotelController.getAgentRequests);
router.patch('/:id/respond-availability', authorizeRoles('hotel_agent'), bookingHotelController.respondAvailability);
router.patch('/:id/availability', authorizeRoles('hotel_agent'), bookingHotelController.updateAvailabilityStatus);

// Shared endpoints
router.get('/', authorizeRoles('hotel_agent', 'manager', 'admin'), bookingHotelController.getBookingHotels);

module.exports = router;