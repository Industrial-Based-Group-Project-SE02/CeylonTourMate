const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { paymentSlipUpload } = require('../middleware/upload');

// @route   POST /api/bookings/submit
// @desc    Submit a new booking with payment slip
// @access  Public
router.post('/submit', (req, res, next) => {
  paymentSlipUpload.single('paymentSlip')(req, res, (err) => {
    if (err) {
      // Handle multer errors
      return res.status(400).json({
        error: 'File upload error',
        details: err.message || 'Invalid file uploaded'
      });
    }
    next();
  });
}, bookingController.submitBooking);

// @route   GET /api/bookings/debug/all
// @desc    Get ALL bookings (DEBUG ONLY)
// @access  Public (DEBUG)
router.get('/debug/all', bookingController.getAllBookings);

// @route   GET /api/bookings/stats
// @desc    Get booking statistics
// @access  Private (Admin)
router.get('/stats', bookingController.getBookingStats);

// @route   GET /api/bookings
// @desc    Get all bookings with pagination and filters
// @access  Private (Admin/Manager)
router.get('/', bookingController.getAllBookings);

// @route   GET /api/bookings/:id
// @desc    Get single booking by ID
// @access  Private (Owner or Admin)
router.get('/:id', bookingController.getBookingById);

// @route   GET /api/bookings/user/:userId
// @desc    Get all bookings for a specific user
// @access  Private (User or Admin)
router.get('/user/:userId', bookingController.getUserBookings);

// @route   PUT /api/bookings/:id
// @desc    Update booking details
// @access  Private (Owner or Admin)
router.put('/:id', bookingController.updateBooking);

// @route   PATCH /api/bookings/:id/status
// @desc    Update booking status
// @access  Private (Admin/Manager)
router.patch('/:id/status', bookingController.updateBookingStatus);

// @route   DELETE /api/bookings/:id
// @desc    Delete booking
// @access  Private (Admin)
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;