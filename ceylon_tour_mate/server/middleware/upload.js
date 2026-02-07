
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ===== PROFILE UPLOADS =====
// Create uploads directory if it doesn't exist
const profileDir = path.join(__dirname, '../uploads/profiles');
if (!fs.existsSync(profileDir)) {
  fs.mkdirSync(profileDir, { recursive: true });
}

// Configure storage for profiles
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, profileDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename: userId_timestamp.extension
    const userId = req.user ? req.user.id : 'unknown';
    const uniqueName = `user_${userId}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter - only allow images for profiles
const profileFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Configure multer for profile uploads
const profileUpload = multer({
  storage: profileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: profileFileFilter
});

// ===== PAYMENT SLIP UPLOADS =====
// Create payment slips directory if it doesn't exist
const paymentSlipsDir = path.join(__dirname, '../uploads/payment-slips');
if (!fs.existsSync(paymentSlipsDir)) {
  fs.mkdirSync(paymentSlipsDir, { recursive: true });
}

// Configure storage for payment slips
const paymentSlipStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, paymentSlipsDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename: timestamp_originalname
    const uniqueName = `payment_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter - allow images and PDF for payment slips
const paymentSlipFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
  const allowedMimeTypes = /image\/jpeg|image\/jpg|image\/png|image\/gif|image\/webp|application\/pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMimeTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) or PDF are allowed for payment slips'));
  }
};

// Configure multer for payment slip uploads
const paymentSlipUpload = multer({
  storage: paymentSlipStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size for payment slips
  },
  fileFilter: paymentSlipFileFilter
});

// ===== SINGLE UPLOAD CONFIGURATION (for backward compatibility) =====
// This maintains the original single upload configuration for existing code
const uploadDir = path.join(__dirname, '../uploads/profiles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename: userId_timestamp.extension
    const userId = req.user ? req.user.id : 'unknown';
    const uniqueName = `user_${userId}_${Date.now()}${path.extname(file.originalname)}`;
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

// Configure multer for single upload (backward compatible)
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter
});

// Export all configurations
module.exports = upload; // Default export (for backward compatibility)
module.exports.upload = upload; // Alias for default
module.exports.profileUpload = profileUpload; // Profile-specific upload
module.exports.paymentSlipUpload = paymentSlipUpload; // Payment slip-specific upload