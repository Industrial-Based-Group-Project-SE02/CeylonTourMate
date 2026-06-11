const express = require('express');
const router = express.Router();
const hotelAgentController = require('../controllers/hotelAgentController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);

// Routes for hotel agents to manage their own details
router.get('/my-details', authorizeRoles('hotel_agent'), hotelAgentController.getMyDetails);
router.put('/update-my-details', authorizeRoles('hotel_agent'), hotelAgentController.updateMyDetails);

// Admin/Manager routes for managing all hotel agents
router.use(authorizeRoles('admin', 'manager'));

// Seed endpoint (for development/testing)
router.post('/seed/details', hotelAgentController.seedHotelAgentDetails);

router.get('/', hotelAgentController.getAllHotelAgents);
router.get('/:id', hotelAgentController.getHotelAgent);
router.post('/', hotelAgentController.createHotelAgent);
router.put('/:id', hotelAgentController.updateHotelAgent);
router.delete('/:id', hotelAgentController.deleteHotelAgent);
router.patch('/:id/toggle-status', hotelAgentController.toggleHotelAgentStatus);

module.exports = router;
