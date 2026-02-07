

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================
router.post('/register', authController.register);
router.post('/login', authController.login);

// 🔥 PASSWORD RECOVERY ROUTES - PUBLIC ACCESS
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/verify-reset-token', authController.verifyResetToken);
router.post('/reset-password', authController.resetPassword);

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================
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