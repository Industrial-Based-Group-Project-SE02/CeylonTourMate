const Booking = require('../models/Booking');
const path = require('path');
const fs = require('fs');
const pool = require('../config/db');

// @desc    Submit a new booking
// @route   POST /api/bookings/submit
// @access  Public (with payment slip upload)
exports.submitBooking = async (req, res) => {
  try {
    const { bookingDetails } = req.body;
    
    if (!bookingDetails) {
      return res.status(400).json({ error: 'Booking details are required' });
    }

    const booking = JSON.parse(bookingDetails);

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'passport', 'flight', 'date', 'time', 'package'];
    const missingFields = requiredFields.filter(field => !booking[field.toLowerCase()] && booking[field.toLowerCase()] !== '0');
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Handle payment slip file
    let paymentSlipPath = null;
    if (req.file) {
      paymentSlipPath = `/uploads/payment-slips/${req.file.filename}`;
    }

    // Get user ID from booking details (sent from frontend)
    let userId = booking.userId || req.user?.id || null;
    
    // Extract package ID from package name by querying the database
    let packageId = null;
    const packageName = booking.package;
    if (packageName && packageName !== 'Custom') {
      try {
        const packageResult = await pool.query(
          'SELECT id FROM packages WHERE package_name = $1 OR name = $1 LIMIT 1',
          [packageName]
        );
        if (packageResult.rows.length > 0) {
          packageId = packageResult.rows[0].id;
          console.log(`✓ Found package ID ${packageId} for package: ${packageName}`);
        } else {
          console.warn(`⚠ Package not found in database: ${packageName}`);
        }
      } catch (err) {
        console.warn(`Could not find package ID for: ${packageName}`, err.message);
        // Continue without package_id if package not found
      }
    }
    
    // Create booking object
    const bookingData = {
      user_id: userId, // Now gets the actual user ID from frontend
      package_id: packageId, // Now properly queries and sets package ID
      fullname: booking.name,
      email: booking.email,
      phone: booking.phone,
      passport_number: booking.passport,
      flight_number: booking.flight,
      arrival_date: booking.date,
      arrival_time: booking.time,
      travel_days: booking.days || '1',
      vehicle_type: booking.vehicle?.split(' - ')[0] || null,
      vehicle_model: booking.vehicle?.split(' - ')[1]?.split(' (')[0] || null,
      pax: booking.pax || '1',
      pickup_location: booking.pickup || null,
      languages: booking.languages,
      notes: booking.notes || null,
      destinations: booking.destinations,
      custom_components: booking.customComponents,
      estimated_price: booking.price,
      payment_slip_path: paymentSlipPath,
      status: 'pending'
    };

    console.log('📝 Creating booking with data:', {
      user_id: bookingData.user_id,
      package_id: bookingData.package_id,
      fullname: bookingData.fullname,
      email: bookingData.email
    });

    // Save booking to database
    const savedBooking = await Booking.create(bookingData);

    res.status(201).json({
      success: true,
      message: 'Booking submitted successfully',
      bookingId: savedBooking.id,
      booking: savedBooking
    });

  } catch (error) {
    console.error('Booking submission error:', error);
    res.status(500).json({
      error: 'Failed to submit booking',
      details: error.message
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin/Manager)
exports.getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', search = '' } = req.query;

    const filters = {
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      search
    };

    const bookings = await Booking.getAll(filters);
    
    // Format response
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      name: booking.fullname,
      email: booking.email,
      phone: booking.phone,
      package: booking.package_name,
      price: booking.estimated_price,
      status: booking.status,
      arrivalDate: booking.arrival_date,
      travelDays: booking.travel_days,
      createdAt: new Date(booking.created_at).toISOString().split('T')[0],
      paymentSlip: booking.payment_slip_path ? 'Uploaded' : 'Pending'
    }));

    res.json({
      success: true,
      count: formattedBookings.length,
      pagination: {
        page: filters.page,
        limit: filters.limit
      },
      data: formattedBookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      error: 'Failed to fetch bookings',
      details: error.message
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private (Owner or Admin)
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.getById(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      error: 'Failed to fetch booking',
      details: error.message
    });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/user/:userId
// @access  Private (User or Admin)
exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.getByUserId(userId);
    
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      package: booking.package_name,
      destinations: booking.destinations,
      price: booking.estimated_price,
      status: booking.status,
      arrivalDate: booking.arrival_date,
      arrivalTime: booking.arrival_time,
      travelDays: booking.travel_days,
      createdAt: new Date(booking.created_at).toISOString().split('T')[0]
    }));

    res.json({
      success: true,
      count: formattedBookings.length,
      data: formattedBookings
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      error: 'Failed to fetch user bookings',
      details: error.message
    });
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private (Admin/Manager)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const updatedBooking = await Booking.updateStatus(id, status);

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      error: 'Failed to update booking status',
      details: error.message
    });
  }
};

// @desc    Update booking details
// @route   PUT /api/bookings/:id
// @access  Private (Owner or Admin)
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if booking exists
    const booking = await Booking.getById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    const updatedBooking = await Booking.update(id, updateData);

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      error: 'Failed to update booking',
      details: error.message
    });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private (Admin)
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.getById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Delete payment slip file if it exists
    if (booking.payment_slip_path) {
      const filePath = path.join(__dirname, '..', booking.payment_slip_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Booking.delete(id);

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      error: 'Failed to delete booking',
      details: error.message
    });
  }
};

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Private (Admin)
exports.getBookingStats = async (req, res) => {
  try {
    const stats = await Booking.getStatistics();

    res.json({
      success: true,
      data: {
        totalBookings: parseInt(stats.total_bookings) || 0,
        pendingBookings: parseInt(stats.pending_bookings) || 0,
        confirmedBookings: parseInt(stats.confirmed_bookings) || 0,
        cancelledBookings: parseInt(stats.cancelled_bookings) || 0,
        averagePrice: parseFloat(stats.avg_price) || 0
      }
    });
  } catch (error) {
    console.error('Error fetching booking statistics:', error);
    res.status(500).json({
      error: 'Failed to fetch booking statistics',
      details: error.message
    });
  }
};