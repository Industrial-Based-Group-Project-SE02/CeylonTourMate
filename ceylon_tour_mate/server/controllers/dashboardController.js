const pool = require('../config/db');

// Get overall dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get user counts by role
    const userStatsResult = await pool.query(`
      SELECT 
        role,
        COUNT(*) as count
      FROM users
      WHERE is_active = true
      GROUP BY role
    `);

    // Get booking stats
    const bookingStatsResult = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM booking_form
      GROUP BY status
    `);

    // Get advertisement stats
    const adStatsResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active,
        SUM(view_count) as total_views,
        SUM(click_count) as total_clicks
      FROM advertisements
    `);

    // Get package stats
    const packageStatsResult = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM packages
      GROUP BY status
    `);

    // Get tour feedback average rating
    const feedbackStatsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_feedbacks,
        AVG(rating) as average_rating,
        MAX(rating) as max_rating,
        MIN(rating) as min_rating
      FROM tour_feedback
    `);

    // Process user stats
    const userStats = {};
    userStatsResult.rows.forEach(row => {
      userStats[row.role] = parseInt(row.count);
    });

    // Process booking stats
    const bookingStats = {};
    bookingStatsResult.rows.forEach(row => {
      bookingStats[row.status] = parseInt(row.count);
    });

    // Process ad stats
    const adStats = {
      total: parseInt(adStatsResult.rows[0].total) || 0,
      active: parseInt(adStatsResult.rows[0].active) || 0,
      totalViews: parseInt(adStatsResult.rows[0].total_views) || 0,
      totalClicks: parseInt(adStatsResult.rows[0].total_clicks) || 0
    };

    // Process package stats
    const packageStats = {};
    packageStatsResult.rows.forEach(row => {
      packageStats[row.status] = parseInt(row.count);
    });

    // Process feedback stats
    const feedbackStats = {
      totalFeedbacks: parseInt(feedbackStatsResult.rows[0].total_feedbacks) || 0,
      averageRating: parseFloat(feedbackStatsResult.rows[0].average_rating) || 0,
      maxRating: parseInt(feedbackStatsResult.rows[0].max_rating) || 0,
      minRating: parseInt(feedbackStatsResult.rows[0].min_rating) || 0
    };

    res.json({
      success: true,
      data: {
        userStats,
        bookingStats,
        adStats,
        packageStats,
        feedbackStats
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch dashboard statistics' 
    });
  }
};

// Get recent bookings
exports.getRecentBookings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const result = await pool.query(`
      SELECT 
        bf.id,
        bf.fullname,
        bf.email,
        bf.status,
        bf.created_at,
        p.package_name,
        u.first_name || ' ' || u.last_name as tourist_name
      FROM booking_form bf
      LEFT JOIN packages p ON bf.package_id = p.id
      LEFT JOIN users u ON bf.user_id = u.id
      ORDER BY bf.created_at DESC
      LIMIT $1
    `, [limit]);

    const bookings = result.rows.map(row => ({
      id: row.id,
      fullname: row.fullname,
      email: row.email,
      touristName: row.tourist_name,
      packageName: row.package_name,
      status: row.status,
      createdAt: row.created_at
    }));

    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Recent bookings error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch recent bookings' 
    });
  }
};

// Get recent users registered
exports.getRecentUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const result = await pool.query(`
      SELECT 
        id,
        email,
        first_name,
        last_name,
        phone,
        role,
        is_active,
        created_at
      FROM users
      WHERE role IN ('tourist', 'driver', 'hotel_agent')
      ORDER BY created_at DESC
      LIMIT $1
    `, [limit]);

    const users = result.rows.map(row => ({
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone,
      role: row.role,
      isActive: row.is_active,
      createdAt: row.created_at
    }));

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Recent users error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch recent users' 
    });
  }
};

// Get driver statistics
exports.getDriverStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_drivers,
        SUM(CASE WHEN availability_status = 'available' THEN 1 ELSE 0 END) as available,
        SUM(CASE WHEN availability_status = 'busy' THEN 1 ELSE 0 END) as busy,
        SUM(CASE WHEN availability_status = 'on_leave' THEN 1 ELSE 0 END) as on_leave,
        AVG(rating) as average_rating,
        SUM(total_trips) as total_trips
      FROM driver_details
    `);

    const stats = {
      totalDrivers: parseInt(result.rows[0].total_drivers) || 0,
      available: parseInt(result.rows[0].available) || 0,
      busy: parseInt(result.rows[0].busy) || 0,
      onLeave: parseInt(result.rows[0].on_leave) || 0,
      averageRating: parseFloat(result.rows[0].average_rating) || 0,
      totalTrips: parseInt(result.rows[0].total_trips) || 0
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Driver stats error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch driver statistics' 
    });
  }
};

// Get revenue/booking statistics
exports.getBookingStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_bookings,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM booking_form
    `);

    const stats = {
      totalBookings: parseInt(result.rows[0].total_bookings) || 0,
      pending: parseInt(result.rows[0].pending) || 0,
      confirmed: parseInt(result.rows[0].confirmed) || 0,
      completed: parseInt(result.rows[0].completed) || 0,
      cancelled: parseInt(result.rows[0].cancelled) || 0
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Booking stats error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch booking statistics' 
    });
  }
};

// Get hotel agent statistics
exports.getHotelAgentStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_agents,
        AVG(rating) as average_rating
      FROM hotel_agents
    `);

    const stats = {
      totalAgents: parseInt(result.rows[0].total_agents) || 0,
      averageRating: parseFloat(result.rows[0].average_rating) || 0
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Hotel agent stats error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch hotel agent statistics' 
    });
  }
};

// Get revenue by date range
exports.getRevenueStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as bookings,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed
      FROM booking_form
    `;

    const params = [];

    if (startDate && endDate) {
      query += ` WHERE created_at >= $1 AND created_at <= $2`;
      params.push(startDate, endDate);
    }

    query += ` GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30`;

    const result = await pool.query(query, params);

    const revenue = result.rows.map(row => ({
      date: row.date,
      bookings: parseInt(row.bookings),
      completed: parseInt(row.completed),
      confirmed: parseInt(row.confirmed)
    }));

    res.json({
      success: true,
      data: revenue
    });
  } catch (error) {
    console.error('Revenue stats error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch revenue statistics' 
    });
  }
};

// Get top tours/packages
exports.getTopPackages = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const result = await pool.query(`
      SELECT 
        p.id,
        p.package_name,
        p.package_code,
        p.category,
        COUNT(bf.id) as booking_count,
        p.min_price,
        p.max_price
      FROM packages p
      LEFT JOIN booking_form bf ON p.id = bf.package_id
      GROUP BY p.id
      ORDER BY booking_count DESC
      LIMIT $1
    `, [limit]);

    const packages = result.rows.map(row => ({
      id: row.id,
      packageName: row.package_name,
      packageCode: row.package_code,
      category: row.category,
      bookingCount: parseInt(row.booking_count),
      minPrice: parseFloat(row.min_price),
      maxPrice: parseFloat(row.max_price)
    }));

    res.json({
      success: true,
      data: packages
    });
  } catch (error) {
    console.error('Top packages error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch top packages' 
    });
  }
};

// Get all dashboard data (combined)
exports.getFullDashboard = async (req, res) => {
  try {
    // Get all statistics in parallel
    const [userStats, bookingStats, adStats, driverStats, hotelStats, recentBookings, recentUsers, topPackages] = await Promise.all([
      pool.query(`SELECT role, COUNT(*) as count FROM users WHERE is_active = true GROUP BY role`),
      pool.query(`SELECT status, COUNT(*) as count FROM booking_form GROUP BY status`),
      pool.query(`SELECT COUNT(*) as total, SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active FROM advertisements`),
      pool.query(`SELECT COUNT(*) as total, AVG(rating) as avg_rating FROM driver_details`),
      pool.query(`SELECT COUNT(*) as total, AVG(rating) as avg_rating FROM hotel_agents`),
      pool.query(`
        SELECT 
          bf.id, 
          bf.fullname, 
          bf.email,
          bf.status, 
          bf.created_at,
          p.package_name
        FROM booking_form bf
        LEFT JOIN packages p ON bf.package_id = p.id
        ORDER BY bf.created_at DESC 
        LIMIT 5
      `),
      pool.query(`SELECT id, email, first_name, last_name, role, created_at FROM users ORDER BY created_at DESC LIMIT 5`),
      pool.query(`SELECT p.id, p.package_name, COUNT(bf.id) as bookings FROM packages p LEFT JOIN booking_form bf ON p.id = bf.package_id GROUP BY p.id ORDER BY bookings DESC LIMIT 5`)
    ]);

    // Process results
    const users = {};
    userStats.rows.forEach(row => {
      users[row.role] = parseInt(row.count);
    });

    const bookings = {};
    bookingStats.rows.forEach(row => {
      bookings[row.status] = parseInt(row.count);
    });

    res.json({
      success: true,
      data: {
        stats: {
          users,
          bookings,
          advertisements: {
            total: parseInt(adStats.rows[0].total),
            active: parseInt(adStats.rows[0].active)
          },
          drivers: {
            total: parseInt(driverStats.rows[0].total),
            avgRating: parseFloat(driverStats.rows[0].avg_rating) || 0
          },
          hotelAgents: {
            total: parseInt(hotelStats.rows[0].total),
            avgRating: parseFloat(hotelStats.rows[0].avg_rating) || 0
          }
        },
        recentBookings: recentBookings.rows.slice(0, 5),
        recentUsers: recentUsers.rows.slice(0, 5),
        topPackages: topPackages.rows.slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Full dashboard error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch dashboard data' 
    });
  }
};
