const express = require('express');
const router = express.Router();
const advertisementController = require('../controllers/advertisementController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Configure multer for advertisements (separate from profiles)
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads/advertisements');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `ad_${Date.now()}_${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Configure multer for advertisements
const uploadAd = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size for ads
  },
  fileFilter: fileFilter
});

// Public routes (no authentication required)
router.get('/', advertisementController.getAllAdvertisements);
router.get('/active', advertisementController.getActiveAdvertisements);
router.get('/:id', advertisementController.getAdvertisementById);
router.post('/:id/view', advertisementController.incrementViewCount);
router.post('/:id/click', advertisementController.incrementClickCount);

// Protected routes (admin only)
router.use(authenticateToken);
router.use(authorizeRoles('admin'));
router.post('/', uploadAd.single('image'), advertisementController.createAdvertisement);
router.put('/:id', uploadAd.single('image'), advertisementController.updateAdvertisement);
router.delete('/:id', advertisementController.deleteAdvertisement);
router.patch('/:id/toggle-status', advertisementController.toggleAdvertisementStatus);

module.exports = router;