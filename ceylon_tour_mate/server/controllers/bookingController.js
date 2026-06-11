// // // const Booking = require('../models/Booking');
// // // const path = require('path');
// // // const fs = require('fs');
// // // const pool = require('../config/db');

// // // // @desc    Submit a new booking
// // // // @route   POST /api/bookings/submit
// // // // @access  Public (with payment slip upload)
// // // exports.submitBooking = async (req, res) => {
// // //   try {
// // //     const { bookingDetails } = req.body;
    
// // //     if (!bookingDetails) {
// // //       return res.status(400).json({ error: 'Booking details are required' });
// // //     }

// // //     const booking = JSON.parse(bookingDetails);

// // //     console.log('📥 Received booking details:', JSON.stringify(booking, null, 2));

// // //     // Validate required fields
// // //     const requiredFields = ['name', 'email', 'phone', 'passport', 'flight', 'date', 'time', 'package'];
// // //     const missingFields = requiredFields.filter(field => !booking[field.toLowerCase()] && booking[field.toLowerCase()] !== '0');
    
// // //     if (missingFields.length > 0) {
// // //       return res.status(400).json({ 
// // //         error: `Missing required fields: ${missingFields.join(', ')}` 
// // //       });
// // //     }

// // //     // Handle payment slip file
// // //     let paymentSlipPath = null;
// // //     if (req.file) {
// // //       paymentSlipPath = `/uploads/payment-slips/${req.file.filename}`;
// // //     }

// // //     // Get user ID from booking details (sent from frontend)
// // //     let userId = booking.userId || req.user?.id || null;
    
// // //     // Extract package ID from package name by querying the database
// // //     let packageId = null;
// // //     // Use raw packageName if available, otherwise extract from formatted package field
// // //     const packageName = booking.packageName || booking.package;
    
// // //     console.log('📦 Package name from booking:', packageName);
// // //     console.log('📦 Package category from booking:', booking.packageCategory);
    
// // //     // Check if it's a custom package
// // //     const isCustomPackage = packageName === 'Custom Package' || booking.packageCategory === 'Custom';
    
// // //     console.log('🎨 Is custom package?', isCustomPackage);
    
// // //     if (packageName && !isCustomPackage) {
// // //       try {
// // //         // If packageName contains " - ", extract the actual package name
// // //         const actualPackageName = packageName.includes(' - ') ? packageName.split(' - ')[1] : packageName;
        
// // //         console.log('🔍 Looking for package:', actualPackageName);
        
// // //         // Try exact match first
// // //         let packageResult = await pool.query(
// // //           'SELECT id, package_name FROM packages WHERE package_name = $1 LIMIT 1',
// // //           [actualPackageName]
// // //         );
        
// // //         if (packageResult.rows.length === 0) {
// // //           // Try case-insensitive match
// // //           console.log('⚠️ Exact match failed, trying case-insensitive...');
// // //           packageResult = await pool.query(
// // //             'SELECT id, package_name FROM packages WHERE LOWER(package_name) = LOWER($1) LIMIT 1',
// // //             [actualPackageName]
// // //           );
// // //         }
        
// // //         if (packageResult.rows.length === 0) {
// // //           // Try with LIKE pattern (partial match)
// // //           console.log('⚠️ Case-insensitive failed, trying partial match...');
// // //           packageResult = await pool.query(
// // //             'SELECT id, package_name FROM packages WHERE package_name ILIKE $1 LIMIT 1',
// // //             [`%${actualPackageName}%`]
// // //           );
// // //         }
        
// // //         if (packageResult.rows.length > 0) {
// // //           packageId = packageResult.rows[0].id;
// // //           console.log(`✅ SUCCESS! Found package ID ${packageId} for package: "${packageResult.rows[0].package_name}"`);
// // //         } else {
// // //           console.error(`❌ FAILED! Package not found in database for: "${actualPackageName}"`);
// // //           // Log all available packages for debugging
// // //           const allPackages = await pool.query('SELECT id, package_name, category FROM packages ORDER BY package_name');
// // //           console.log('📋 Available packages in database:');
// // //           allPackages.rows.forEach(p => console.log(`  - ID: ${p.id}, Name: "${p.package_name}", Category: ${p.category}`));
// // //         }
// // //       } catch (err) {
// // //         console.error(`❌ ERROR looking up package ID for: ${packageName}`, err.message);
// // //         // Continue without package_id if package not found
// // //       }
// // //     } else if (isCustomPackage) {
// // //       console.log('✅ Custom package detected - package_id will be NULL');
// // //     }
    
// // //     // Create booking object
// // //     const bookingData = {
// // //       user_id: userId, // Now gets the actual user ID from frontend
// // //       package_id: packageId, // Now properly queries and sets package ID
// // //       fullname: booking.name,
// // //       email: booking.email,
// // //       phone: booking.phone,
// // //       passport_number: booking.passport,
// // //       flight_number: booking.flight,
// // //       arrival_date: booking.date,
// // //       arrival_time: booking.time,
// // //       travel_days: booking.days || '1',
// // //       vehicle_type: booking.vehicle?.split(' - ')[0] || null,
// // //       vehicle_model: booking.vehicle?.split(' - ')[1]?.split(' (')[0] || null,
// // //       pax: booking.pax || '1',
// // //       pickup_location: booking.pickup || null,
// // //       languages: booking.languages,
// // //       notes: booking.notes || null,
// // //       destinations: booking.destinations,
// // //       custom_components: booking.customComponents,
// // //       estimated_price: booking.price,
// // //       payment_slip_path: paymentSlipPath,
// // //       status: 'pending'
// // //     };

// // //     console.log('📝 Creating booking with data:', {
// // //       user_id: bookingData.user_id,
// // //       package_id: bookingData.package_id,
// // //       fullname: bookingData.fullname,
// // //       email: bookingData.email
// // //     });

// // //     // Save booking to database
// // //     const savedBooking = await Booking.create(bookingData);

// // //     res.status(201).json({
// // //       success: true,
// // //       message: 'Booking submitted successfully',
// // //       bookingId: savedBooking.id,
// // //       booking: savedBooking
// // //     });

// // //   } catch (error) {
// // //     console.error('Booking submission error:', error);
// // //     res.status(500).json({
// // //       error: 'Failed to submit booking',
// // //       details: error.message
// // //     });
// // //   }
// // // };

// // // // @desc    Get all bookings
// // // // @route   GET /api/bookings
// // // // @access  Private (Admin/Manager)
// // // exports.getAllBookings = async (req, res) => {
// // //   try {
// // //     const { page = 1, limit = 10, status = '', search = '' } = req.query;

// // //     const filters = {
// // //       page: parseInt(page),
// // //       limit: parseInt(limit),
// // //       status,
// // //       search
// // //     };

// // //     const bookings = await Booking.getAll(filters);
    
// // //     // Format response
// // //     const formattedBookings = bookings.map(booking => ({
// // //       id: booking.id,
// // //       name: booking.fullname,
// // //       email: booking.email,
// // //       phone: booking.phone,
// // //       package: booking.package_name,
// // //       price: booking.estimated_price,
// // //       status: booking.status,
// // //       arrivalDate: booking.arrival_date,
// // //       travelDays: booking.travel_days,
// // //       createdAt: new Date(booking.created_at).toISOString().split('T')[0],
// // //       paymentSlip: booking.payment_slip_path ? 'Uploaded' : 'Pending'
// // //     }));

// // //     res.json({
// // //       success: true,
// // //       count: formattedBookings.length,
// // //       pagination: {
// // //         page: filters.page,
// // //         limit: filters.limit
// // //       },
// // //       data: formattedBookings
// // //     });
// // //   } catch (error) {
// // //     console.error('Error fetching bookings:', error);
// // //     res.status(500).json({
// // //       error: 'Failed to fetch bookings',
// // //       details: error.message
// // //     });
// // //   }
// // // };

// // // // @desc    Get booking by ID
// // // // @route   GET /api/bookings/:id
// // // // @access  Private (Owner or Admin)
// // // exports.getBookingById = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;

// // //     const booking = await Booking.getById(id);
    
// // //     if (!booking) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         error: 'Booking not found'
// // //       });
// // //     }

// // //     res.json({
// // //       success: true,
// // //       data: booking
// // //     });
// // //   } catch (error) {
// // //     console.error('Error fetching booking:', error);
// // //     res.status(500).json({
// // //       error: 'Failed to fetch booking',
// // //       details: error.message
// // //     });
// // //   }
// // // };

// // // // @desc    Get user's bookings
// // // // @route   GET /api/bookings/user/:userId
// // // // @access  Private (User or Admin)
// // // exports.getUserBookings = async (req, res) => {
// // //   try {
// // //     const { userId } = req.params;

// // //     const bookings = await Booking.getByUserId(userId);
    
// // //     const formattedBookings = bookings.map(booking => ({
// // //       id: booking.id,
// // //       package: booking.package_name,
// // //       destinations: booking.destinations,
// // //       price: booking.estimated_price,
// // //       status: booking.status,
// // //       arrivalDate: booking.arrival_date,
// // //       arrivalTime: booking.arrival_time,
// // //       travelDays: booking.travel_days,
// // //       createdAt: new Date(booking.created_at).toISOString().split('T')[0]
// // //     }));

// // //     res.json({
// // //       success: true,
// // //       count: formattedBookings.length,
// // //       data: formattedBookings
// // //     });
// // //   } catch (error) {
// // //     console.error('Error fetching user bookings:', error);
// // //     res.status(500).json({
// // //       error: 'Failed to fetch user bookings',
// // //       details: error.message
// // //     });
// // //   }
// // // };

// // // // @desc    Update booking status
// // // // @route   PATCH /api/bookings/:id/status
// // // // @access  Private (Admin/Manager)
// // // exports.updateBookingStatus = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;
// // //     const { status } = req.body;

// // //     if (!status) {
// // //       return res.status(400).json({ error: 'Status is required' });
// // //     }

// // //     const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
// // //     if (!validStatuses.includes(status)) {
// // //       return res.status(400).json({ 
// // //         error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
// // //       });
// // //     }

// // //     const updatedBooking = await Booking.updateStatus(id, status);

// // //     if (!updatedBooking) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         error: 'Booking not found'
// // //       });
// // //     }

// // //     res.json({
// // //       success: true,
// // //       message: 'Booking status updated successfully',
// // //       data: updatedBooking
// // //     });
// // //   } catch (error) {
// // //     console.error('Error updating booking status:', error);
// // //     res.status(500).json({
// // //       error: 'Failed to update booking status',
// // //       details: error.message
// // //     });
// // //   }
// // // };

// // // // @desc    Update booking details
// // // // @route   PUT /api/bookings/:id
// // // // @access  Private (Owner or Admin)
// // // exports.updateBooking = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;
// // //     const updateData = req.body;

// // //     // Check if booking exists
// // //     const booking = await Booking.getById(id);
// // //     if (!booking) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         error: 'Booking not found'
// // //       });
// // //     }

// // //     const updatedBooking = await Booking.update(id, updateData);

// // //     res.json({
// // //       success: true,
// // //       message: 'Booking updated successfully',
// // //       data: updatedBooking
// // //     });
// // //   } catch (error) {
// // //     console.error('Error updating booking:', error);
// // //     res.status(500).json({
// // //       error: 'Failed to update booking',
// // //       details: error.message
// // //     });
// // //   }
// // // };

// // // // @desc    Delete booking
// // // // @route   DELETE /api/bookings/:id
// // // // @access  Private (Admin)
// // // exports.deleteBooking = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;

// // //     const booking = await Booking.getById(id);
// // //     if (!booking) {
// // //       return res.status(404).json({
// // //         success: false,
// // //         error: 'Booking not found'
// // //       });
// // //     }

// // //     // Delete payment slip file if it exists
// // //     if (booking.payment_slip_path) {
// // //       const filePath = path.join(__dirname, '..', booking.payment_slip_path);
// // //       if (fs.existsSync(filePath)) {
// // //         fs.unlinkSync(filePath);
// // //       }
// // //     }

// // //     await Booking.delete(id);

// // //     res.json({
// // //       success: true,
// // //       message: 'Booking deleted successfully'
// // //     });
// // //   } catch (error) {
// // //     console.error('Error deleting booking:', error);
// // //     res.status(500).json({
// // //       error: 'Failed to delete booking',
// // //       details: error.message
// // //     });
// // //   }
// // // };

// // // // @desc    Get booking statistics
// // // // @route   GET /api/bookings/stats
// // // // @access  Private (Admin)
// // // exports.getBookingStats = async (req, res) => {
// // //   try {
// // //     const stats = await Booking.getStatistics();

// // //     res.json({
// // //       success: true,
// // //       data: {
// // //         totalBookings: parseInt(stats.total_bookings) || 0,
// // //         pendingBookings: parseInt(stats.pending_bookings) || 0,
// // //         confirmedBookings: parseInt(stats.confirmed_bookings) || 0,
// // //         cancelledBookings: parseInt(stats.cancelled_bookings) || 0,
// // //         averagePrice: parseFloat(stats.avg_price) || 0
// // //       }
// // //     });
// // //   } catch (error) {
// // //     console.error('Error fetching booking statistics:', error);
// // //     res.status(500).json({
// // //       error: 'Failed to fetch booking statistics',
// // //       details: error.message
// // //     });
// // //   }
// // // };


// // const Booking = require('../models/Booking');
// // const path = require('path');
// // const fs = require('fs');
// // const pool = require('../config/db');

// // // @desc    Submit a new booking
// // // @route   POST /api/bookings/submit
// // // @access  Public (with payment slip upload)
// // exports.submitBooking = async (req, res) => {
// //   try {
// //     const { bookingDetails } = req.body;
    
// //     if (!bookingDetails) {
// //       return res.status(400).json({ error: 'Booking details are required' });
// //     }

// //     const booking = JSON.parse(bookingDetails);

// //     // Validate required fields
// //     const requiredFields = ['name', 'email', 'phone', 'passport', 'flight', 'date', 'time', 'package'];
// //     const missingFields = requiredFields.filter(field => !booking[field.toLowerCase()] && booking[field.toLowerCase()] !== '0');
    
// //     if (missingFields.length > 0) {
// //       return res.status(400).json({ 
// //         error: `Missing required fields: ${missingFields.join(', ')}` 
// //       });
// //     }

// //     // Handle payment slip file
// //     let paymentSlipPath = null;
// //     if (req.file) {
// //       paymentSlipPath = `/uploads/payment-slips/${req.file.filename}`;
// //     }

// //     // Get user ID from booking details (sent from frontend)
// //     let userId = booking.userId || req.user?.id || null;
    
// //     // Extract package ID from payload or package name by querying the database
// //     let packageId = booking.packageId || null;
// //     const packageName = booking.package;
// //     if (!packageId && packageName && packageName !== 'Custom') {
// //       try {
// //         const packageResult = await pool.query(
// //           'SELECT id FROM packages WHERE package_name ILIKE $1 OR name ILIKE $1 LIMIT 1',
// //           [packageName.trim()]
// //         );
// //         if (packageResult.rows.length > 0) {
// //           packageId = packageResult.rows[0].id;
// //           console.log(`✓ Found package ID ${packageId} for package: ${packageName}`);
// //         } else {
// //           console.warn(`⚠ Package not found in database: ${packageName}`);
// //         }
// //       } catch (err) {
// //         console.warn(`Could not find package ID for: ${packageName}`, err.message);
// //         // Continue without package_id if package not found
// //       }
// //     }
    
// //     // Create booking object
// //     const bookingData = {
// //       user_id: userId, // Now gets the actual user ID from frontend
// //       package_id: packageId, // Now properly queries and sets package ID
// //       fullname: booking.name,
// //       email: booking.email,
// //       phone: booking.phone,
// //       passport_number: booking.passport,
// //       flight_number: booking.flight,
// //       arrival_date: booking.date,
// //       arrival_time: booking.time,
// //       travel_days: booking.days || '1',
// //       vehicle_type: booking.vehicle?.split(' - ')[0] || null,
// //       vehicle_model: booking.vehicle?.split(' - ')[1]?.split(' (')[0] || null,
// //       pax: booking.pax || '1',
// //       pickup_location: booking.pickup || null,
// //       languages: booking.languages,
// //       notes: booking.notes || null,
// //       destinations: booking.destinations,
// //       custom_components: booking.customComponents,
// //       estimated_price: booking.price,
// //       payment_slip_path: paymentSlipPath,
// //       status: 'pending'
// //     };

// //     console.log('📝 Creating booking with data:', {
// //       user_id: bookingData.user_id,
// //       package_id: bookingData.package_id,
// //       fullname: bookingData.fullname,
// //       email: bookingData.email
// //     });

// //     // Save booking to database
// //     const savedBooking = await Booking.create(bookingData);

// //     res.status(201).json({
// //       success: true,
// //       message: 'Booking submitted successfully',
// //       bookingId: savedBooking.id,
// //       booking: savedBooking
// //     });

// //   } catch (error) {
// //     console.error('Booking submission error:', error);
// //     res.status(500).json({
// //       error: 'Failed to submit booking',
// //       details: error.message
// //     });
// //   }
// // };

// // // @desc    Get all bookings
// // // @route   GET /api/bookings
// // // @access  Private (Admin/Manager)
// // exports.getAllBookings = async (req, res) => {
// //   try {
// //     const { page = 1, limit = 10, status = '', search = '' } = req.query;

// //     const filters = {
// //       page: parseInt(page),
// //       limit: parseInt(limit),
// //       status,
// //       search
// //     };

// //     const bookings = await Booking.getAll(filters);
    
// //     // Format response
// //     const formattedBookings = bookings.map(booking => ({
// //       id: booking.id,
// //       name: booking.fullname,
// //       email: booking.email,
// //       phone: booking.phone,
// //       package: booking.package_name,
// //       price: booking.estimated_price,
// //       status: booking.status,
// //       arrivalDate: booking.arrival_date,
// //       travelDays: booking.travel_days,
// //       createdAt: new Date(booking.created_at).toISOString().split('T')[0],
// //       paymentSlip: booking.payment_slip_path ? 'Uploaded' : 'Pending'
// //     }));

// //     res.json({
// //       success: true,
// //       count: formattedBookings.length,
// //       pagination: {
// //         page: filters.page,
// //         limit: filters.limit
// //       },
// //       data: formattedBookings
// //     });
// //   } catch (error) {
// //     console.error('Error fetching bookings:', error);
// //     res.status(500).json({
// //       error: 'Failed to fetch bookings',
// //       details: error.message
// //     });
// //   }
// // };

// // // @desc    Get booking by ID
// // // @route   GET /api/bookings/:id
// // // @access  Private (Owner or Admin)
// // exports.getBookingById = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const booking = await Booking.getById(id);
    
// //     if (!booking) {
// //       return res.status(404).json({
// //         success: false,
// //         error: 'Booking not found'
// //       });
// //     }

// //     res.json({
// //       success: true,
// //       data: booking
// //     });
// //   } catch (error) {
// //     console.error('Error fetching booking:', error);
// //     res.status(500).json({
// //       error: 'Failed to fetch booking',
// //       details: error.message
// //     });
// //   }
// // };

// // // @desc    Get user's bookings
// // // @route   GET /api/bookings/user/:userId
// // // @access  Private (User or Admin)
// // exports.getUserBookings = async (req, res) => {
// //   try {
// //     const { userId } = req.params;

// //     const bookings = await Booking.getByUserId(userId);
    
// //     const formattedBookings = bookings.map(booking => ({
// //       id: booking.id,
// //       package: booking.package_name,
// //       destinations: booking.destinations,
// //       price: booking.estimated_price,
// //       status: booking.status,
// //       arrivalDate: booking.arrival_date,
// //       arrivalTime: booking.arrival_time,
// //       travelDays: booking.travel_days,
// //       createdAt: new Date(booking.created_at).toISOString().split('T')[0]
// //     }));

// //     res.json({
// //       success: true,
// //       count: formattedBookings.length,
// //       data: formattedBookings
// //     });
// //   } catch (error) {
// //     console.error('Error fetching user bookings:', error);
// //     res.status(500).json({
// //       error: 'Failed to fetch user bookings',
// //       details: error.message
// //     });
// //   }
// // };

// // // @desc    Update booking status
// // // @route   PATCH /api/bookings/:id/status
// // // @access  Private (Admin/Manager)
// // exports.updateBookingStatus = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { status } = req.body;

// //     if (!status) {
// //       return res.status(400).json({ error: 'Status is required' });
// //     }

// //     const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
// //     if (!validStatuses.includes(status)) {
// //       return res.status(400).json({ 
// //         error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
// //       });
// //     }

// //     const updatedBooking = await Booking.updateStatus(id, status);

// //     if (!updatedBooking) {
// //       return res.status(404).json({
// //         success: false,
// //         error: 'Booking not found'
// //       });
// //     }

// //     res.json({
// //       success: true,
// //       message: 'Booking status updated successfully',
// //       data: updatedBooking
// //     });
// //   } catch (error) {
// //     console.error('Error updating booking status:', error);
// //     res.status(500).json({
// //       error: 'Failed to update booking status',
// //       details: error.message
// //     });
// //   }
// // };

// // // @desc    Update booking details
// // // @route   PUT /api/bookings/:id
// // // @access  Private (Owner or Admin)
// // exports.updateBooking = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const updateData = req.body;

// //     // Check if booking exists
// //     const booking = await Booking.getById(id);
// //     if (!booking) {
// //       return res.status(404).json({
// //         success: false,
// //         error: 'Booking not found'
// //       });
// //     }

// //     const updatedBooking = await Booking.update(id, updateData);

// //     res.json({
// //       success: true,
// //       message: 'Booking updated successfully',
// //       data: updatedBooking
// //     });
// //   } catch (error) {
// //     console.error('Error updating booking:', error);
// //     res.status(500).json({
// //       error: 'Failed to update booking',
// //       details: error.message
// //     });
// //   }
// // };

// // // @desc    Delete booking
// // // @route   DELETE /api/bookings/:id
// // // @access  Private (Admin)
// // exports.deleteBooking = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const booking = await Booking.getById(id);
// //     if (!booking) {
// //       return res.status(404).json({
// //         success: false,
// //         error: 'Booking not found'
// //       });
// //     }

// //     // Delete payment slip file if it exists
// //     if (booking.payment_slip_path) {
// //       const filePath = path.join(__dirname, '..', booking.payment_slip_path);
// //       if (fs.existsSync(filePath)) {
// //         fs.unlinkSync(filePath);
// //       }
// //     }

// //     await Booking.delete(id);

// //     res.json({
// //       success: true,
// //       message: 'Booking deleted successfully'
// //     });
// //   } catch (error) {
// //     console.error('Error deleting booking:', error);
// //     res.status(500).json({
// //       error: 'Failed to delete booking',
// //       details: error.message
// //     });
// //   }
// // };

// // // @desc    Get booking statistics
// // // @route   GET /api/bookings/stats
// // // @access  Private (Admin)
// // exports.getBookingStats = async (req, res) => {
// //   try {
// //     const stats = await Booking.getStatistics();

// //     res.json({
// //       success: true,
// //       data: {
// //         totalBookings: parseInt(stats.total_bookings) || 0,
// //         pendingBookings: parseInt(stats.pending_bookings) || 0,
// //         confirmedBookings: parseInt(stats.confirmed_bookings) || 0,
// //         cancelledBookings: parseInt(stats.cancelled_bookings) || 0,
// //         averagePrice: parseFloat(stats.avg_price) || 0
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Error fetching booking statistics:', error);
// //     res.status(500).json({
// //       error: 'Failed to fetch booking statistics',
// //       details: error.message
// //     });
// //   }
// // };




// const Booking = require('../models/Booking');
// const path = require('path');
// const fs = require('fs');
// const pool = require('../config/db');

// // @desc    Submit a new booking
// // @route   POST /api/bookings/submit
// // @access  Public (with payment slip upload)
// exports.submitBooking = async (req, res) => {
//   try {
//     const { bookingDetails } = req.body;
    
//     if (!bookingDetails) {
//       return res.status(400).json({ error: 'Booking details are required' });
//     }

//     const booking = JSON.parse(bookingDetails);

//     // Validate required fields
//     const requiredFields = ['name', 'email', 'phone', 'passport', 'flight', 'date', 'time', 'package'];
//     const missingFields = requiredFields.filter(field => !booking[field.toLowerCase()] && booking[field.toLowerCase()] !== '0');
    
//     if (missingFields.length > 0) {
//       return res.status(400).json({ 
//         error: `Missing required fields: ${missingFields.join(', ')}` 
//       });
//     }

//     // Handle payment slip file
//     let paymentSlipPath = null;
//     if (req.file) {
//       paymentSlipPath = `/uploads/payment-slips/${req.file.filename}`;
//     }

//     // Get user ID from booking details (sent from frontend)
//     let userId = booking.userId || req.user?.id || null;
    
//     // Extract package ID - use packageId from frontend if provided, otherwise lookup by name
//     let packageId = booking.packageId || null;
//     const packageName = booking.package;
    
//     // Only lookup by name if packageId is not provided
//     if (!packageId && packageName && packageName !== 'Custom') {
//       try {
//         const packageResult = await pool.query(
//           'SELECT id FROM packages WHERE package_name = $1 OR name = $1 LIMIT 1',
//           [packageName]
//         );
//         if (packageResult.rows.length > 0) {
//           packageId = packageResult.rows[0].id;
//           console.log(`✓ Found package ID ${packageId} for package: ${packageName}`);
//         } else {
//           console.warn(`⚠ Package not found in database: ${packageName}`);
//         }
//       } catch (err) {
//         console.warn(`Could not find package ID for: ${packageName}`, err.message);
//         // Continue without package_id if package not found
//       }
//     }
    
//     // Create booking object
//     const bookingData = {
//       user_id: userId, // Now gets the actual user ID from frontend
//       package_id: packageId, // Now properly queries and sets package ID
//       fullname: booking.name,
//       email: booking.email,
//       phone: booking.phone,
//       passport_number: booking.passport,
//       flight_number: booking.flight,
//       arrival_date: booking.date,
//       arrival_time: booking.time,
//       travel_days: booking.days || '1',
//       vehicle_type: booking.vehicle?.split(' - ')[0] || null,
//       vehicle_model: booking.vehicle?.split(' - ')[1]?.split(' (')[0] || null,
//       pax: booking.pax || '1',
//       pickup_location: booking.pickup || null,
//       languages: booking.languages,
//       notes: booking.notes || null,
//       destinations: booking.destinations,
//       custom_components: booking.customComponents,
//       estimated_price: booking.price,
//       payment_slip_path: paymentSlipPath,
//       status: 'pending'
//     };

//     console.log('📝 Creating booking with data:', {
//       user_id: bookingData.user_id,
//       package_id: bookingData.package_id,
//       pickup_location: bookingData.pickup_location,
//       fullname: bookingData.fullname,
//       email: bookingData.email
//     });

//     // Save booking to database
//     const savedBooking = await Booking.create(bookingData);

//     res.status(201).json({
//       success: true,
//       message: 'Booking submitted successfully',
//       bookingId: savedBooking.id,
//       booking: savedBooking
//     });

//   } catch (error) {
//     console.error('Booking submission error:', error);
//     res.status(500).json({
//       error: 'Failed to submit booking',
//       details: error.message
//     });
//   }
// };

// // @desc    Get all bookings
// // @route   GET /api/bookings
// // @access  Private (Admin/Manager)
// exports.getAllBookings = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, status = '', search = '' } = req.query;

//     const filters = {
//       page: parseInt(page),
//       limit: parseInt(limit),
//       status,
//       search
//     };

//     const bookings = await Booking.getAll(filters);
    
//     // Return bookings with original field names from database
//     const formattedBookings = bookings.map(booking => ({
//       id: booking.id,
//       user_id: booking.user_id,
//       package_id: booking.package_id,
//       fullname: booking.fullname,
//       email: booking.email,
//       phone: booking.phone,
//       passport_number: booking.passport_number,
//       flight_number: booking.flight_number,
//       arrival_date: booking.arrival_date,
//       arrival_time: booking.arrival_time,
//       travel_days: booking.travel_days,
//       pax: booking.pax,
//       pickup_location: booking.pickup_location,
//       vehicle_type: booking.vehicle_type,
//       vehicle_model: booking.vehicle_model,
//       languages: booking.languages,
//       destinations: booking.destinations,
//       notes: booking.notes,
//       custom_components: booking.custom_components,
//       estimated_price: booking.estimated_price,
//       payment_slip_path: booking.payment_slip_path,
//       package_name: booking.package_name,
//       status: booking.status,
//       created_at: booking.created_at,
//       updated_at: booking.updated_at
//     }));

//     res.json({
//       success: true,
//       count: formattedBookings.length,
//       pagination: {
//         page: filters.page,
//         limit: filters.limit
//       },
//       data: formattedBookings
//     });
//   } catch (error) {
//     console.error('Error fetching bookings:', error);
//     res.status(500).json({
//       error: 'Failed to fetch bookings',
//       details: error.message
//     });
//   }
// };

// // @desc    Get booking by ID
// // @route   GET /api/bookings/:id
// // @access  Private (Owner or Admin)
// exports.getBookingById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const booking = await Booking.getById(id);
    
//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         error: 'Booking not found'
//       });
//     }

//     const hotelBookingsResult = await pool.query(
//       `SELECT
//         hrb.booking_date,
//         hrb.rooms_booked,
//         hrb.price_per_night,
//         hrb.total_price,
//         hr.room_type,
//         ha.id as hotel_id,
//         ha.hotel_name,
//         ha.location,
//         ha.contact_person,
//         ha.rating,
//         ha.hotel_type
//       FROM hotel_room_bookings hrb
//       INNER JOIN hotel_rooms hr ON hrb.hotel_room_id = hr.id
//       INNER JOIN hotel_agents ha ON hrb.hotel_agent_id = ha.id
//       WHERE hrb.booking_id = $1
//       ORDER BY hrb.booking_date ASC`,
//       [id]
//     );

//     const driverAssignmentResult = await pool.query(
//       `SELECT
//         dpa.id,
//         dpa.start_date,
//         dpa.end_date,
//         dpa.status,
//         d.license_number,
//         d.vehicle_type,
//         d.vehicle_model,
//         d.vehicle_number,
//         d.vehicle_year,
//         d.rating,
//         d.total_trips,
//         u.first_name,
//         u.last_name,
//         u.email,
//         u.phone
//       FROM driver_package_assignments dpa
//       INNER JOIN driver_details d ON dpa.driver_id = d.id
//       INNER JOIN users u ON d.user_id = u.id
//       WHERE dpa.booking_id = $1
//       LIMIT 1`,
//       [id]
//     );

//     res.json({
//       success: true,
//       data: {
//         ...booking,
//         hotelBookings: hotelBookingsResult.rows,
//         driverAssignment: driverAssignmentResult.rows[0] || null
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching booking:', error);
//     res.status(500).json({
//       error: 'Failed to fetch booking',
//       details: error.message
//     });
//   }
// };

// // @desc    Get user's bookings
// // @route   GET /api/bookings/user/:userId
// // @access  Private (User or Admin)
// exports.getUserBookings = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const bookings = await Booking.getByUserId(userId);
    
//     const formattedBookings = bookings.map(booking => ({
//       id: booking.id,
//       package: booking.package_name,
//       destinations: booking.destinations,
//       price: booking.estimated_price,
//       status: booking.status,
//       arrivalDate: booking.arrival_date,
//       arrivalTime: booking.arrival_time,
//       travelDays: booking.travel_days,
//       createdAt: new Date(booking.created_at).toISOString().split('T')[0]
//     }));

//     res.json({
//       success: true,
//       count: formattedBookings.length,
//       data: formattedBookings
//     });
//   } catch (error) {
//     console.error('Error fetching user bookings:', error);
//     res.status(500).json({
//       error: 'Failed to fetch user bookings',
//       details: error.message
//     });
//   }
// };

// // @desc    Update booking status
// // @route   PATCH /api/bookings/:id/status
// // @access  Private (Admin/Manager)
// exports.updateBookingStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!status) {
//       return res.status(400).json({ error: 'Status is required' });
//     }

//     const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ 
//         error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
//       });
//     }

//     const updatedBooking = await Booking.updateStatus(id, status);

//     if (!updatedBooking) {
//       return res.status(404).json({
//         success: false,
//         error: 'Booking not found'
//       });
//     }

//     // Create notification if booking is confirmed
//     if (status === 'confirmed' && updatedBooking.user_id) {
//       try {
//         const notificationController = require('./notificationController');
//         const packageName = updatedBooking.package_name || 'Your Tour';
//         const message = `🎉 Your booking for "${packageName}" has been confirmed! Your trip is ready to go.`;
        
//         await notificationController.createNotification(
//           updatedBooking.user_id,
//           id,
//           message,
//           'booking_confirmed'
//         );
//       } catch (notificationError) {
//         // Log error but don't fail the booking status update
//         console.error('Failed to create notification:', notificationError);
//       }
//     }

//     res.json({
//       success: true,
//       message: 'Booking status updated successfully',
//       data: updatedBooking
//     });
//   } catch (error) {
//     console.error('Error updating booking status:', error);
//     res.status(500).json({
//       error: 'Failed to update booking status',
//       details: error.message
//     });
//   }
// };

// // @desc    Update booking details
// // @route   PUT /api/bookings/:id
// // @access  Private (Owner or Admin)
// exports.updateBooking = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     // Check if booking exists
//     const booking = await Booking.getById(id);
//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         error: 'Booking not found'
//       });
//     }

//     const updatedBooking = await Booking.update(id, updateData);

//     res.json({
//       success: true,
//       message: 'Booking updated successfully',
//       data: updatedBooking
//     });
//   } catch (error) {
//     console.error('Error updating booking:', error);
//     res.status(500).json({
//       error: 'Failed to update booking',
//       details: error.message
//     });
//   }
// };

// // @desc    Delete booking
// // @route   DELETE /api/bookings/:id
// // @access  Private (Admin)
// exports.deleteBooking = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const booking = await Booking.getById(id);
//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         error: 'Booking not found'
//       });
//     }

//     // Delete payment slip file if it exists
//     if (booking.payment_slip_path) {
//       const filePath = path.join(__dirname, '..', booking.payment_slip_path);
//       if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath);
//       }
//     }

//     await Booking.delete(id);

//     res.json({
//       success: true,
//       message: 'Booking deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting booking:', error);
//     res.status(500).json({
//       error: 'Failed to delete booking',
//       details: error.message
//     });
//   }
// };

// // @desc    Get booking statistics
// // @route   GET /api/bookings/stats
// // @access  Private (Admin)
// exports.getBookingStats = async (req, res) => {
//   try {
//     const stats = await Booking.getStatistics();

//     res.json({
//       success: true,
//       data: {
//         totalBookings: parseInt(stats.total_bookings) || 0,
//         pendingBookings: parseInt(stats.pending_bookings) || 0,
//         confirmedBookings: parseInt(stats.confirmed_bookings) || 0,
//         cancelledBookings: parseInt(stats.cancelled_bookings) || 0,
//         averagePrice: parseFloat(stats.avg_price) || 0
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching booking statistics:', error);
//     res.status(500).json({
//       error: 'Failed to fetch booking statistics',
//       details: error.message
//     });
//   }
// };

// // @desc    Book hotel rooms for a booking
// // @route   POST /api/bookings/book-hotel
// // @access  Private (Manager/Admin)
// exports.bookHotelRooms = async (req, res) => {
//   const client = await pool.connect();

//   try {
//     const { bookingId, hotelId, rooms } = req.body;

//     if (!bookingId || !hotelId || !rooms || rooms.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'Missing required fields: bookingId, hotelId, rooms'
//       });
//     }

//     await client.query('BEGIN');

//     const bookingResult = await client.query(
//       'SELECT id FROM booking_form WHERE id = $1',
//       [bookingId]
//     );

//     if (bookingResult.rows.length === 0) {
//       await client.query('ROLLBACK');
//       return res.status(404).json({
//         success: false,
//         error: 'Booking not found'
//       });
//     }

//     const hotelResult = await client.query(
//       'SELECT id FROM hotel_agents WHERE id = $1',
//       [hotelId]
//     );

//     if (hotelResult.rows.length === 0) {
//       await client.query('ROLLBACK');
//       return res.status(404).json({
//         success: false,
//         error: 'Hotel not found'
//       });
//     }

//     const bookingSummary = [];

//     for (const bookingRoom of rooms) {
//       const { date, roomType, count } = bookingRoom;

//       if (!date || !roomType || !count || count <= 0) {
//         await client.query('ROLLBACK');
//         return res.status(400).json({
//           success: false,
//           error: 'Each room entry must include date, roomType, and count'
//         });
//       }

//       const roomResult = await client.query(
//         `SELECT id, total_rooms, price_per_night
//          FROM hotel_rooms
//          WHERE hotel_agent_id = $1 AND room_type = $2`,
//         [hotelId, roomType]
//       );

//       if (roomResult.rows.length === 0) {
//         await client.query('ROLLBACK');
//         return res.status(404).json({
//           success: false,
//           error: `Room type ${roomType} not found for selected hotel`
//         });
//       }

//       const roomRow = roomResult.rows[0];

//       const availabilityResult = await client.query(
//         `SELECT id, available_rooms, status
//          FROM hotel_room_availability
//          WHERE hotel_room_id = $1 AND available_date = $2
//          FOR UPDATE`,
//         [roomRow.id, date]
//       );

//       const existingAvailability = availabilityResult.rows[0];
//       const currentAvailable = existingAvailability?.available_rooms ?? roomRow.total_rooms;
//       const currentStatus = existingAvailability?.status || 'available';

//       if (currentStatus === 'blocked') {
//         await client.query('ROLLBACK');
//         return res.status(409).json({
//           success: false,
//           error: `Rooms are blocked for ${roomType} on ${date}`
//         });
//       }

//       if (currentAvailable < count) {
//         await client.query('ROLLBACK');
//         return res.status(409).json({
//           success: false,
//           error: `Not enough ${roomType} rooms available on ${date}`
//         });
//       }

//       const newAvailable = Math.max(currentAvailable - count, 0);
//       const finalStatus = newAvailable === 0 ? 'fully_booked' : 'available';

//       await client.query(
//         `INSERT INTO hotel_room_availability (
//           hotel_room_id,
//           available_date,
//           available_rooms,
//           status
//         )
//         VALUES ($1, $2, $3, $4)
//         ON CONFLICT (hotel_room_id, available_date)
//         DO UPDATE SET
//           available_rooms = EXCLUDED.available_rooms,
//           status = EXCLUDED.status,
//           updated_at = CURRENT_TIMESTAMP`,
//         [
//           roomRow.id,
//           date,
//           newAvailable,
//           finalStatus
//         ]
//       );

//       // Insert booking record into hotel_room_bookings table
//       // Check if booking already exists for this room/date combination
//       const totalPrice = count * roomRow.price_per_night;
      
//       const existingBookingResult = await client.query(
//         `SELECT id FROM hotel_room_bookings
//          WHERE booking_id = $1 AND hotel_room_id = $2 AND booking_date = $3`,
//         [bookingId, roomRow.id, date]
//       );

//       if (existingBookingResult.rows.length > 0) {
//         // Update existing booking
//         await client.query(
//           `UPDATE hotel_room_bookings
//            SET rooms_booked = $1, total_price = $2, updated_at = CURRENT_TIMESTAMP
//            WHERE booking_id = $3 AND hotel_room_id = $4 AND booking_date = $5`,
//           [count, totalPrice, bookingId, roomRow.id, date]
//         );
//       } else {
//         // Insert new booking
//         await client.query(
//           `INSERT INTO hotel_room_bookings (
//             booking_id,
//             hotel_room_id,
//             hotel_agent_id,
//             booking_date,
//             rooms_booked,
//             price_per_night,
//             total_price,
//             created_at,
//             updated_at
//           )
//           VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
//           [bookingId, roomRow.id, hotelId, date, count, roomRow.price_per_night, totalPrice]
//         );
//       }

//       bookingSummary.push({
//         date,
//         roomType,
//         roomsBooked: count,
//         availableRooms: newAvailable
//       });
//     }

//     await client.query('COMMIT');

//     res.json({
//       success: true,
//       message: 'Hotel rooms booked successfully',
//       bookingId,
//       hotelId,
//       roomCount: bookingSummary.length,
//       roomDetails: bookingSummary
//     });
//   } catch (error) {
//     await client.query('ROLLBACK');
//     console.error('Error booking hotel rooms:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to book hotel rooms',
//       details: error.message
//     });
//   } finally {
//     client.release();
//   }
// };

// // @desc    Assign a driver to a booking
// // @route   POST /api/bookings/assign-driver
// // @access  Private (Manager/Admin)
// exports.assignDriver = async (req, res) => {
//   const client = await pool.connect();
//   try {
//     const { bookingId, driverId, startDate, endDate } = req.body;

//     if (!bookingId || !driverId || !startDate || !endDate) {
//       return res.status(400).json({
//         success: false,
//         error: 'Missing required fields: bookingId, driverId, startDate, endDate'
//       });
//     }

//     await client.query('BEGIN');

//     // Verify booking exists
//     const bookingResult = await client.query(
//       'SELECT id, package_id FROM booking_form WHERE id = $1',
//       [bookingId]
//     );

//     if (bookingResult.rows.length === 0) {
//       await client.query('ROLLBACK');
//       return res.status(404).json({
//         success: false,
//         error: 'Booking not found'
//       });
//     }

//     // Verify driver exists
//     const driverResult = await client.query(
//       'SELECT id, user_id FROM driver_details WHERE id = $1',
//       [driverId]
//     );

//     if (driverResult.rows.length === 0) {
//       await client.query('ROLLBACK');
//       return res.status(404).json({
//         success: false,
//         error: 'Driver not found'
//       });
//     }

//     // Check existing assignment for this booking
//     const existingAssignment = await client.query(
//       'SELECT id, driver_id, start_date, end_date FROM driver_package_assignments WHERE booking_id = $1',
//       [bookingId]
//     );

//     // Check driver availability conflicts
//     const conflictResult = await client.query(
//       `SELECT available_date, status
//        FROM driver_availability
//        WHERE driver_id = $1
//          AND available_date BETWEEN $2 AND $3
//          AND status IN ('assigned', 'blocked', 'leave')`,
//       [driverId, startDate, endDate]
//     );

//     if (conflictResult.rows.length > 0) {
//       await client.query('ROLLBACK');
//       return res.status(409).json({
//         success: false,
//         error: 'Driver is not available for the selected dates',
//         conflicts: conflictResult.rows
//       });
//     }

//     // Free old driver availability if reassigned
//     if (existingAssignment.rows.length > 0 && existingAssignment.rows[0].driver_id !== driverId) {
//       const oldAssignment = existingAssignment.rows[0];
//       await client.query(
//         `UPDATE driver_availability
//          SET status = 'available', updated_at = CURRENT_TIMESTAMP
//          WHERE driver_id = $1
//            AND available_date BETWEEN $2 AND $3
//            AND status = 'assigned'`,
//         [oldAssignment.driver_id, oldAssignment.start_date, oldAssignment.end_date]
//       );
//     }

//     const packageId = bookingResult.rows[0]?.package_id;

//     const assignResult = await client.query(
//       `INSERT INTO driver_package_assignments 
//        (booking_id, package_id, driver_id, start_date, end_date, assigned_by, status)
//        VALUES ($1, $2, $3, $4, $5, $6, $7)
//        ON CONFLICT (booking_id) DO UPDATE
//        SET driver_id = $3, start_date = $4, end_date = $5, status = 'assigned'
//        RETURNING id, booking_id, driver_id, start_date, end_date`,
//       [bookingId, packageId, driverId, startDate, endDate, req.user?.id || 1, 'assigned']
//     );

//     // Mark driver availability as assigned for the date range
//     await client.query(
//       `INSERT INTO driver_availability (driver_id, available_date, status)
//        SELECT $1, d::date, 'assigned'
//        FROM generate_series($2::date, $3::date, interval '1 day') d
//        ON CONFLICT (driver_id, available_date)
//        DO UPDATE SET status = 'assigned', updated_at = CURRENT_TIMESTAMP`,
//       [driverId, startDate, endDate]
//     );

//     await client.query('COMMIT');

//     console.log(`✅ Driver ${driverId} assigned to booking ${bookingId}`);

//     res.json({
//       success: true,
//       message: 'Driver assigned successfully',
//       assignment: assignResult.rows[0]
//     });
//   } catch (error) {
//     await client.query('ROLLBACK');
//     console.error('Error assigning driver:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to assign driver',
//       details: error.message
//     });
//   } finally {
//     client.release();
//   }
// };



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
    
    console.log('📥 Booking submission received:');
    console.log('   Frontend userId:', booking.userId);
    console.log('   Middleware userId:', req.user?.id);
    console.log('   Final userId:', userId);
    console.log('   Email:', booking.email);
    console.log('   Frontend packageId:', booking.packageId);
    console.log('   Pickup location:', booking.pickup);
    
    // Use package ID from frontend if available, otherwise try to look it up by name
    let packageId = booking.packageId || null;
    const packageName = booking.package;
    
    if (!packageId && packageName && packageName !== 'Custom') {
      try {
        console.log(`🔍 Looking up package ID for: ${packageName}`);
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
    } else if (packageId) {
      console.log(`✓ Using package ID from frontend: ${packageId}`);
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
      pickup_location: bookingData.pickup_location,
      fullname: bookingData.fullname,
      email: bookingData.email
    });

    // Save booking to database
    const savedBooking = await Booking.create(bookingData);

    console.log('✓ Booking saved to database with ID:', savedBooking.id, 'user_id:', savedBooking.user_id, 'package_id:', savedBooking.package_id);

    res.status(201).json({
      success: true,
      message: 'Booking submitted successfully',
      bookingId: savedBooking.id,
      userId: savedBooking.user_id,
      email: savedBooking.email,
      packageId: savedBooking.package_id,
      pickupLocation: savedBooking.pickup_location,
      booking: savedBooking
    });

  } catch (error) {
    console.error('❌ Booking submission error:', error);
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
    
    // Return bookings with original field names from database
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      user_id: booking.user_id,
      package_id: booking.package_id,
      fullname: booking.fullname,
      email: booking.email,
      phone: booking.phone,
      passport_number: booking.passport_number,
      flight_number: booking.flight_number,
      arrival_date: booking.arrival_date,
      arrival_time: booking.arrival_time,
      travel_days: booking.travel_days,
      pax: booking.pax,
      pickup_location: booking.pickup_location,
      vehicle_type: booking.vehicle_type,
      vehicle_model: booking.vehicle_model,
      languages: booking.languages,
      destinations: booking.destinations,
      notes: booking.notes,
      custom_components: booking.custom_components,
      estimated_price: booking.estimated_price,
      payment_slip_path: booking.payment_slip_path,
      package_name: booking.package_name,
      status: booking.status,
      created_at: booking.created_at,
      updated_at: booking.updated_at
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

    const hotelBookingsResult = await pool.query(
      `SELECT
        hrb.booking_date,
        hrb.rooms_booked,
        hrb.price_per_night,
        hrb.total_price,
        hr.room_type,
        ha.id as hotel_id,
        ha.hotel_name,
        ha.location,
        ha.contact_person,
        ha.rating,
        ha.hotel_type
      FROM hotel_room_bookings hrb
      INNER JOIN hotel_rooms hr ON hrb.hotel_room_id = hr.id
      INNER JOIN hotel_agents ha ON hrb.hotel_agent_id = ha.id
      WHERE hrb.booking_id = $1
      ORDER BY hrb.booking_date ASC`,
      [id]
    );

    const driverAssignmentResult = await pool.query(
      `SELECT
        dpa.id,
        dpa.start_date,
        dpa.end_date,
        dpa.status,
        d.license_number,
        d.vehicle_type,
        d.vehicle_model,
        d.vehicle_number,
        d.vehicle_year,
        d.rating,
        d.total_trips,
        u.first_name,
        u.last_name,
        u.email,
        u.phone
      FROM driver_package_assignments dpa
      INNER JOIN driver_details d ON dpa.driver_id = d.id
      INNER JOIN users u ON d.user_id = u.id
      WHERE dpa.booking_id = $1
      LIMIT 1`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...booking,
        hotelBookings: hotelBookingsResult.rows,
        driverAssignment: driverAssignmentResult.rows[0] || null
      }
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
      user_id: booking.user_id,
      package: booking.package_name,
      packageName: booking.package_name,
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

// @desc    Get user's bookings by email
// @route   GET /api/bookings/by-email/:email
// @access  Private (User or Admin)
exports.getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const bookings = await Booking.getByEmail(email);
    
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      user_id: booking.user_id,
      email: booking.email,
      package: booking.package_name,
      packageName: booking.package_name,
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
    console.error('Error fetching bookings by email:', error);
    res.status(500).json({
      error: 'Failed to fetch bookings by email',
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

// @desc    Book hotel rooms for a booking
// @route   POST /api/bookings/book-hotel
// @access  Private (Manager/Admin)
exports.bookHotelRooms = async (req, res) => {
  let client;

  try {
    client = await pool.connect();
    const { bookingId, hotelId, rooms } = req.body;

    console.log('🏨 Book Hotel Request:', { bookingId, hotelId, roomsCount: rooms?.length });

    if (!bookingId || !hotelId || !rooms || rooms.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: bookingId, hotelId, rooms'
      });
    }

    await client.query('BEGIN');

    // Verify booking exists
    const bookingResult = await client.query(
      'SELECT id FROM booking_form WHERE id = $1',
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Verify hotel exists
    const hotelResult = await client.query(
      'SELECT id, hotel_name FROM hotel_agents WHERE id = $1',
      [hotelId]
    );

    if (hotelResult.rows.length === 0) {
      await client.query('ROLLBACK');
      console.warn(`⚠️ Hotel not found with ID: ${hotelId}`);
      return res.status(404).json({
        success: false,
        error: `Hotel with ID ${hotelId} not found`
      });
    }

    const hotelName = hotelResult.rows[0].hotel_name;
    console.log(`✅ Hotel found: ${hotelName}`);

    const bookingSummary = [];

    for (const bookingRoom of rooms) {
      const { date, roomType, count } = bookingRoom;

      console.log(`📅 Processing room booking: ${roomType} × ${count} on ${date}`);

      if (!date || !roomType || !count || count <= 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          error: 'Each room entry must include date, roomType, and count'
        });
      }

      // Get room details
      const roomResult = await client.query(
        `SELECT id, total_rooms, price_per_night
         FROM hotel_rooms
         WHERE hotel_agent_id = $1 AND room_type = $2`,
        [hotelId, roomType]
      );

      if (roomResult.rows.length === 0) {
        await client.query('ROLLBACK');
        console.warn(`⚠️ Room type ${roomType} not found for hotel ${hotelId}`);
        return res.status(404).json({
          success: false,
          error: `Room type "${roomType}" not found for this hotel`
        });
      }

      const roomRow = roomResult.rows[0];
      console.log(`✅ Room found: ID=${roomRow.id}, Total=${roomRow.total_rooms}, Price=${roomRow.price_per_night}`);

      // Check availability
      const availabilityResult = await client.query(
        `SELECT id, available_rooms, status
         FROM hotel_room_availability
         WHERE hotel_room_id = $1 AND available_date = $2::date
         FOR UPDATE`,
        [roomRow.id, date]
      );

      const existingAvailability = availabilityResult.rows[0];
      const currentAvailable = existingAvailability?.available_rooms ?? roomRow.total_rooms;
      const currentStatus = existingAvailability?.status || 'available';

      console.log(`📊 Availability: Current=${currentAvailable}, Status=${currentStatus}`);

      if (currentStatus === 'blocked') {
        await client.query('ROLLBACK');
        return res.status(409).json({
          success: false,
          error: `Rooms are blocked for ${roomType} on ${date}`
        });
      }

      if (currentAvailable < count) {
        await client.query('ROLLBACK');
        console.warn(`⚠️ Not enough rooms: Need ${count}, Available=${currentAvailable}`);
        return res.status(409).json({
          success: false,
          error: `Not enough ${roomType} rooms available on ${date}. Available: ${currentAvailable}, Requested: ${count}`
        });
      }

      const newAvailable = Math.max(currentAvailable - count, 0);
      const finalStatus = newAvailable === 0 ? 'fully_booked' : 'available';

      // Update room availability
      await client.query(
        `INSERT INTO hotel_room_availability (
          hotel_room_id,
          available_date,
          available_rooms,
          status
        )
        VALUES ($1, $2::date, $3, $4)
        ON CONFLICT (hotel_room_id, available_date)
        DO UPDATE SET
          available_rooms = EXCLUDED.available_rooms,
          status = EXCLUDED.status,
          updated_at = CURRENT_TIMESTAMP`,
        [
          roomRow.id,
          date,
          newAvailable,
          finalStatus
        ]
      );

      console.log(`✅ Room availability updated: ${newAvailable} rooms left`);

      // Record the booking
      await client.query(
        `INSERT INTO hotel_room_bookings (
          booking_id,
          hotel_agent_id,
          hotel_room_id,
          booking_date,
          rooms_booked,
          price_per_night,
          total_price,
          status
        )
        VALUES ($1, $2, $3, $4::date, $5, $6, $7, 'reserved')
        ON CONFLICT (booking_id, hotel_room_id, booking_date)
        DO UPDATE SET
          rooms_booked = EXCLUDED.rooms_booked,
          price_per_night = EXCLUDED.price_per_night,
          total_price = EXCLUDED.total_price,
          status = EXCLUDED.status,
          updated_at = CURRENT_TIMESTAMP`,
        [
          bookingId,
          hotelId,
          roomRow.id,
          date,
          count,
          roomRow.price_per_night,
          count * roomRow.price_per_night
        ]
      );

      console.log(`✅ Booking recorded for ${count} ${roomType} rooms`);

      bookingSummary.push({
        date,
        roomType,
        roomsBooked: count,
        availableRooms: newAvailable
      });
    }

    await client.query('COMMIT');

    console.log(`✅ Hotel booking committed successfully for booking #${bookingId}`);

    res.json({
      success: true,
      message: 'Hotel rooms booked successfully',
      bookingId,
      hotelId,
      hotelName,
      roomCount: bookingSummary.length,
      roomDetails: bookingSummary
    });
  } catch (error) {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError);
      }
    }
    console.error('❌ Error booking hotel rooms:', error);
    console.error('Error type:', error.code, error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to book hotel rooms',
      details: error.message,
      code: error.code
    });
  } finally {
    if (client) {
      client.release();
    }
  }
};

// @desc    Assign a driver to a booking
// @route   POST /api/bookings/assign-driver
// @access  Private (Manager/Admin)
exports.assignDriver = async (req, res) => {
  const client = await pool.connect();
  try {
    const { bookingId, driverId, startDate, endDate } = req.body;

    if (!bookingId || !driverId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: bookingId, driverId, startDate, endDate'
      });
    }

    await client.query('BEGIN');

    // Verify booking exists
    const bookingResult = await client.query(
      'SELECT id, package_id FROM booking_form WHERE id = $1',
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Verify driver exists
    const driverResult = await client.query(
      'SELECT id, user_id FROM driver_details WHERE id = $1',
      [driverId]
    );

    if (driverResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: 'Driver not found'
      });
    }

    // Check existing assignment for this booking
    const existingAssignment = await client.query(
      'SELECT id, driver_id, start_date, end_date FROM driver_package_assignments WHERE booking_id = $1',
      [bookingId]
    );

    // Check driver availability conflicts
    const conflictResult = await client.query(
      `SELECT available_date, status
       FROM driver_availability
       WHERE driver_id = $1
         AND available_date BETWEEN $2 AND $3
         AND status IN ('assigned', 'blocked', 'leave')`,
      [driverId, startDate, endDate]
    );

    if (conflictResult.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        error: 'Driver is not available for the selected dates',
        conflicts: conflictResult.rows
      });
    }

    // Free old driver availability if reassigned
    if (existingAssignment.rows.length > 0 && existingAssignment.rows[0].driver_id !== driverId) {
      const oldAssignment = existingAssignment.rows[0];
      await client.query(
        `UPDATE driver_availability
         SET status = 'available', updated_at = CURRENT_TIMESTAMP
         WHERE driver_id = $1
           AND available_date BETWEEN $2 AND $3
           AND status = 'assigned'`,
        [oldAssignment.driver_id, oldAssignment.start_date, oldAssignment.end_date]
      );
    }

    const packageId = bookingResult.rows[0]?.package_id;

    // Note: packageId can be null for custom packages, which is acceptable
    if (packageId === undefined) {
      console.warn(`⚠️  Booking ${bookingId} has no package_id (may be custom package)`);
    }

    const assignResult = await client.query(
      `INSERT INTO driver_package_assignments 
       (booking_id, package_id, driver_id, start_date, end_date, assigned_by, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (booking_id) DO UPDATE
       SET driver_id = $3, start_date = $4, end_date = $5, status = 'assigned'
       RETURNING id, booking_id, driver_id, start_date, end_date`,
      [bookingId, packageId || null, driverId, startDate, endDate, req.user?.id || 1, 'assigned']
    );

    // Mark driver availability as assigned for the date range
    await client.query(
      `INSERT INTO driver_availability (driver_id, available_date, status)
       SELECT $1, d::date, 'assigned'
       FROM generate_series($2::date, $3::date, interval '1 day') d
       ON CONFLICT (driver_id, available_date)
       DO UPDATE SET status = 'assigned', updated_at = CURRENT_TIMESTAMP`,
      [driverId, startDate, endDate]
    );

    await client.query('COMMIT');

    console.log(`✅ Driver ${driverId} assigned to booking ${bookingId}`);

    res.json({
      success: true,
      message: 'Driver assigned successfully',
      assignment: assignResult.rows[0]
    });
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Error during rollback:', rollbackError);
    }
    console.error('❌ Error assigning driver:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to assign driver',
      details: error.message
    });
  } finally {
    client.release();
  }
};