// const express = require('express');
// const router = express.Router();
// const {
//   getAllUsers,
//   getUserById,
//   createUser,
//   updateUser,
//   deleteUser,
// } = require('../controllers/userController');

// // Routes
// router.get('/', getAllUsers);
// router.get('/:id', getUserById);
// router.post('/', createUser);
// router.put('/:id', updateUser);
// router.delete('/:id', deleteUser);

// module.exports = router;


const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Admin and Manager can manage users
router.get('/', authorizeRoles('admin', 'manager'), userController.getAllUsers);
router.get('/:id', authorizeRoles('admin', 'manager'), userController.getUser);
router.post('/', authorizeRoles('admin', 'manager'), userController.createUser);
router.put('/:id', authorizeRoles('admin', 'manager'), userController.updateUser);
router.delete('/:id', authorizeRoles('admin', 'manager'), userController.deleteUser);
router.patch('/:id/toggle-status', authorizeRoles('admin', 'manager'), userController.toggleUserStatus);

module.exports = router;