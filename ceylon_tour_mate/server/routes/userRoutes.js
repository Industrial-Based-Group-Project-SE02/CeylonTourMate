const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Public read routes (allow any authenticated user to view user info)
router.use(authenticateToken);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);

// Admin and Manager can manage users (create, update, delete)
router.use(authorizeRoles('admin', 'manager'));
router.post('/', authorizeRoles('admin', 'manager'), userController.createUser);
router.put('/:id', authorizeRoles('admin', 'manager'), userController.updateUser);
router.delete('/:id', authorizeRoles('admin', 'manager'), userController.deleteUser);
router.patch('/:id/toggle-status', authorizeRoles('admin', 'manager'), userController.toggleUserStatus);
router.post('/profile-picture', userController.uploadProfilePicture);
router.delete('/profile-picture', userController.deleteProfilePicture);

module.exports = router;