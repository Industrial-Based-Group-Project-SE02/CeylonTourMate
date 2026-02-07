const express = require('express');
const router = express.Router();
const hotelAgentController = require('../controllers/hotelAgentController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);
router.use(authorizeRoles('admin', 'manager'));

router.get('/', hotelAgentController.getAllHotelAgents);
router.get('/:id', hotelAgentController.getHotelAgent);
router.post('/', hotelAgentController.createHotelAgent);
router.put('/:id', hotelAgentController.updateHotelAgent);
router.delete('/:id', hotelAgentController.deleteHotelAgent);
router.patch('/:id/toggle-status', hotelAgentController.toggleHotelAgentStatus);

module.exports = router;
