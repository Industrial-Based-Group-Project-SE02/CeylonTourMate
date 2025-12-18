const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);
router.put('/change-password', authenticateToken, authController.changePassword);

// Profile picture routes
router.post(
  '/profile-picture',
  authenticateToken,
  upload.single('profilePicture'),
  authController.uploadProfilePicture
);

router.delete(
  '/profile-picture',
  authenticateToken,
  authController.deleteProfilePicture
);

module.exports = router;