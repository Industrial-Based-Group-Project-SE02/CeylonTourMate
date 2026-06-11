const pool = require('../config/db');

// Get driver by user ID (alias for compatibility)
exports.getDriverByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const query = `
      SELECT 
        d.id as driver_id,
        d.license_number,
        d.address,
        d.city,
        d.district,
        d.province,
        d.languages,
        d.other_skills,
        d.years_of_experience,
        d.vehicle_type,
        d.vehicle_number,
        d.vehicle_model,
        d.vehicle_year,
        d.vehicle_color,
        d.availability_status,
        d.rating,
        d.total_trips,
        d.emergency_contact_name,
        d.emergency_contact_phone
      FROM driver_details d
      WHERE d.user_id = $1
    `;

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Driver details not found' 
      });
    }

    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        id: row.driver_id,
        licenseNumber: row.license_number,
        address: row.address,
        city: row.city,
        district: row.district,
        province: row.province,
        languages: row.languages || ['English'],
        otherSkills: row.other_skills || [],
        yearsOfExperience: row.years_of_experience,
        vehicleType: row.vehicle_type,
        vehicleNumber: row.vehicle_number,
        vehicleModel: row.vehicle_model,
        vehicleYear: row.vehicle_year,
        vehicleColor: row.vehicle_color,
        availabilityStatus: row.availability_status,
        rating: parseFloat(row.rating) || 0,
        totalTrips: row.total_trips || 0,
        emergencyContactName: row.emergency_contact_name,
        emergencyContactPhone: row.emergency_contact_phone
      }
    });
  } catch (error) {
    console.error('Get driver by user ID error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch driver details' 
    });
  }
};

// Create driver details (after user account is created)
exports.createDriverDetails = async (req, res) => {
  const client = await pool.connect();

  try {
    const { userId } = req.params;
    const {
      licenseNumber,
      address,
      city,
      district,
      province,
      languages,
      otherSkills,
      yearsOfExperience,
      vehicleType,
      vehicleNumber,
      vehicleModel,
      vehicleYear,
      vehicleColor,
      emergencyContactName,
      emergencyContactPhone
    } = req.body;

    // Verify user exists and is a driver
    const userCheck = await client.query(
      'SELECT id, role FROM users WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (userCheck.rows[0].role !== 'driver') {
      return res.status(400).json({ error: 'User is not a driver' });
    }

    // Check if driver details already exist
    const existingDetails = await client.query(
      'SELECT id FROM driver_details WHERE user_id = $1',
      [userId]
    );

    if (existingDetails.rows.length > 0) {
      return res.status(400).json({ error: 'Driver details already exist' });
    }

    // Ensure English is in languages
    const languagesArray = Array.isArray(languages) ? languages : [languages];
    if (!languagesArray.includes('English')) {
      languagesArray.unshift('English');
    }

    const result = await client.query(
      `INSERT INTO driver_details (
        user_id, license_number, address, city, district, province,
        languages, other_skills, years_of_experience,
        vehicle_type, vehicle_number, vehicle_model, vehicle_year, vehicle_color,
        emergency_contact_name, emergency_contact_phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        userId, licenseNumber, address, city, district, province,
        languagesArray, otherSkills || [], yearsOfExperience || 0,
        vehicleType, vehicleNumber, vehicleModel, vehicleYear, vehicleColor,
        emergencyContactName, emergencyContactPhone
      ]
    );

    res.status(201).json({
      message: 'Driver details created successfully',
      driverDetails: {
        id: result.rows[0].id,
        licenseNumber: result.rows[0].license_number,
        address: result.rows[0].address,
        city: result.rows[0].city,
        district: result.rows[0].district,
        province: result.rows[0].province,
        languages: result.rows[0].languages,
        otherSkills: result.rows[0].other_skills,
        yearsOfExperience: result.rows[0].years_of_experience,
        vehicleType: result.rows[0].vehicle_type,
        vehicleNumber: result.rows[0].vehicle_number,
        vehicleModel: result.rows[0].vehicle_model,
        vehicleYear: result.rows[0].vehicle_year,
        vehicleColor: result.rows[0].vehicle_color,
        emergencyContactName: result.rows[0].emergency_contact_name,
        emergencyContactPhone: result.rows[0].emergency_contact_phone
      }
    });
  } catch (error) {
    console.error('Create driver details error:', error);
    
    if (error.code === '23505') {
      if (error.constraint === 'driver_details_license_number_key') {
        return res.status(400).json({ error: 'License number already exists' });
      }
      if (error.constraint === 'driver_details_vehicle_number_key') {
        return res.status(400).json({ error: 'Vehicle number already exists' });
      }
    }
    
    res.status(500).json({ error: 'Failed to create driver details' });
  } finally {
    client.release();
  }
};

// Get all drivers with their details and user info
exports.getAllDrivers = async (req, res) => {
  try {
    const { search, availability, province, vehicleType, page = 1, limit = 10 } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const conditions = ["u.role = 'driver'"];
    const params = [];

    // Search filter (search by name, email, license, phone)
    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      conditions.push(`(
        u.first_name ILIKE $${params.length} OR 
        u.last_name ILIKE $${params.length} OR 
        u.email ILIKE $${params.length} OR 
        u.phone ILIKE $${params.length} OR 
        d.license_number ILIKE $${params.length}
      )`);
    }

    // Availability filter
    if (availability && availability !== 'all') {
      params.push(availability);
      conditions.push(`COALESCE(d.availability_status, 'available') = $${params.length}`);
    }

    // Province filter
    if (province && province !== 'all') {
      params.push(`%${province}%`);
      conditions.push(`d.province ILIKE $${params.length}`);
    }

    // Vehicle type filter
    if (vehicleType && vehicleType !== 'all') {
      params.push(`%${vehicleType}%`);
      conditions.push(`d.vehicle_type ILIKE $${params.length}`);
    }

    // Count total drivers matching filters
    const countQuery = `
      SELECT COUNT(*) as total
      FROM users u
      LEFT JOIN driver_details d ON u.id = d.user_id
      WHERE ${conditions.join(' AND ')}
    `;

    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Fetch paginated results
    const query = `
      SELECT 
        u.id as user_id,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        u.is_active,
        u.profile_picture,
        u.created_at as user_created_at,
        d.id as driver_id,
        d.license_number,
        d.address,
        d.city,
        d.district,
        d.province,
        d.languages,
        d.other_skills,
        d.years_of_experience,
        d.vehicle_type,
        d.vehicle_number,
        d.vehicle_model,
        d.vehicle_year,
        d.vehicle_color,
        d.availability_status,
        d.rating,
        d.total_trips,
        d.emergency_contact_name,
        d.emergency_contact_phone,
        d.created_at as driver_details_created_at
      FROM users u
      LEFT JOIN driver_details d ON u.id = d.user_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY u.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    params.push(limit, offset);
    const result = await pool.query(query, params);

    const drivers = result.rows.map(row => ({
      id: row.user_id,
      userId: row.user_id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone,
      isActive: row.is_active,
      profilePicture: row.profile_picture,
      userCreatedAt: row.user_created_at,
      driverDetails: row.driver_id ? {
        id: row.driver_id,
        licenseNumber: row.license_number,
        address: row.address,
        city: row.city,
        district: row.district,
        province: row.province,
        languages: row.languages || ['English'],
        otherSkills: row.other_skills || [],
        yearsOfExperience: row.years_of_experience,
        vehicleType: row.vehicle_type,
        vehicleNumber: row.vehicle_number,
        vehicleModel: row.vehicle_model,
        vehicleYear: row.vehicle_year,
        vehicleColor: row.vehicle_color,
        availabilityStatus: row.availability_status,
        rating: parseFloat(row.rating) || 0,
        totalTrips: row.total_trips || 0,
        emergencyContactName: row.emergency_contact_name,
        emergencyContactPhone: row.emergency_contact_phone,
        createdAt: row.driver_details_created_at
      } : null
    }));

    res.json({
      drivers,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get all drivers error:', error);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
};

// Get available drivers for a date range and filters
exports.getAvailableDrivers = async (req, res) => {
  try {
    const { start_date, end_date, vehicle_type, province } = req.query;

    // Validate required parameters
    if (!start_date || !end_date) {
      console.warn('Missing date parameters:', { start_date, end_date });
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: start_date and end_date (format: yyyy-MM-dd)'
      });
    }

    const conditions = ["u.role = 'driver'", 'u.is_active = true', 'd.id IS NOT NULL'];
    const params = [];

    if (vehicle_type) {
      params.push(`%${vehicle_type}%`);
      conditions.push(`d.vehicle_type ILIKE $${params.length}`);
    }

    if (province) {
      params.push(`%${province}%`);
      conditions.push(`d.province ILIKE $${params.length}`);
    }

    if (start_date && end_date) {
      params.push(start_date, end_date);
      const startParam = `$${params.length - 1}`;
      const endParam = `$${params.length}`;
      
      // Check for driver unavailability during the date range
      // This checks if there are any assignments/blocks during the requested period
      conditions.push(
        `NOT EXISTS (
          SELECT 1
          FROM driver_availability da
          WHERE da.driver_id = d.id
            AND da.available_date BETWEEN ${startParam} AND ${endParam}
            AND da.status IN ('assigned', 'blocked', 'leave')
        )`
      );
    }

    conditions.push("COALESCE(d.availability_status, 'available') = 'available'");

    const query = `
      SELECT 
        u.id as user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        d.id as driver_id,
        d.license_number,
        d.city,
        d.district,
        d.province,
        d.languages,
        d.years_of_experience,
        d.vehicle_type,
        d.vehicle_number,
        d.vehicle_model,
        d.vehicle_year,
        d.availability_status,
        d.rating,
        d.total_trips
      FROM users u
      LEFT JOIN driver_details d ON u.id = d.user_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY d.rating DESC NULLS LAST, d.total_trips DESC NULLS LAST, u.created_at DESC
    `;

    console.log('📋 Available drivers query:', query);
    console.log('📌 Available drivers params:', params);
    console.log('🔍 Filter - Start:', start_date, 'End:', end_date, 'Vehicle:', vehicle_type, 'Province:', province);

    const result = await pool.query(query, params);

    console.log(`✅ Found ${result.rows.length} available driver(s)`);

    const drivers = result.rows.map(row => ({
      id: row.driver_id,
      license_number: row.license_number,
      years_of_experience: row.years_of_experience,
      rating: parseFloat(row.rating) || 0,
      total_trips: row.total_trips || 0,
      availability_status: row.availability_status || 'available',
      vehicle_type: row.vehicle_type,
      vehicle_model: row.vehicle_model,
      vehicle_year: row.vehicle_year,
      vehicle_number: row.vehicle_number,
      languages: row.languages || ['English'],
      city: row.city,
      district: row.district,
      province: row.province,
      user: {
        id: row.user_id,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        phone: row.phone
      }
    }));

    res.json({ success: true, data: drivers });
  } catch (error) {
    console.error('❌ Get available drivers error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail
    });
    
    // Provide specific error messages based on error type
    let errorMessage = 'Failed to fetch available drivers';
    if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Database connection failed';
    } else if (error.message && error.message.includes('syntax')) {
      errorMessage = 'Query syntax error - contact administrator';
    }

    res.status(500).json({ 
      success: false, 
      error: errorMessage,
      details: error.message 
    });
  }
};

// Get single driver with details
exports.getDriverById = async (req, res) => {
  try {
    const { userId } = req.params;

    const query = `
      SELECT 
        u.id as user_id,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        u.is_active,
        u.profile_picture,
        d.id as driver_id,
        d.license_number,
        d.address,
        d.city,
        d.district,
        d.province,
        d.languages,
        d.other_skills,
        d.years_of_experience,
        d.vehicle_type,
        d.vehicle_number,
        d.vehicle_model,
        d.vehicle_year,
        d.vehicle_color,
        d.availability_status,
        d.rating,
        d.total_trips,
        d.emergency_contact_name,
        d.emergency_contact_phone
      FROM users u
      LEFT JOIN driver_details d ON u.id = d.user_id
      WHERE u.id = $1 AND u.role = 'driver'
    `;

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const row = result.rows[0];
    const driver = {
      userId: row.user_id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone,
      isActive: row.is_active,
      profilePicture: row.profile_picture,
      driverDetails: row.driver_id ? {
        id: row.driver_id,
        licenseNumber: row.license_number,
        address: row.address,
        city: row.city,
        district: row.district,
        province: row.province,
        languages: row.languages || ['English'],
        otherSkills: row.other_skills || [],
        yearsOfExperience: row.years_of_experience,
        vehicleType: row.vehicle_type,
        vehicleNumber: row.vehicle_number,
        vehicleModel: row.vehicle_model,
        vehicleYear: row.vehicle_year,
        vehicleColor: row.vehicle_color,
        availabilityStatus: row.availability_status,
        rating: parseFloat(row.rating) || 0,
        totalTrips: row.total_trips || 0,
        emergencyContactName: row.emergency_contact_name,
        emergencyContactPhone: row.emergency_contact_phone
      } : null
    };

    res.json(driver);
  } catch (error) {
    console.error('Get driver error:', error);
    res.status(500).json({ error: 'Failed to fetch driver' });
  }
};

// Update driver details
exports.updateDriverDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      licenseNumber,
      address,
      city,
      district,
      province,
      languages,
      otherSkills,
      yearsOfExperience,
      vehicleType,
      vehicleNumber,
      vehicleModel,
      vehicleYear,
      vehicleColor,
      availabilityStatus,
      emergencyContactName,
      emergencyContactPhone
    } = req.body;

    // Ensure English is in languages
    const languagesArray = Array.isArray(languages) ? languages : [languages];
    if (!languagesArray.includes('English')) {
      languagesArray.unshift('English');
    }

    const result = await pool.query(
      `UPDATE driver_details SET
        license_number = $1,
        address = $2,
        city = $3,
        district = $4,
        province = $5,
        languages = $6,
        other_skills = $7,
        years_of_experience = $8,
        vehicle_type = $9,
        vehicle_number = $10,
        vehicle_model = $11,
        vehicle_year = $12,
        vehicle_color = $13,
        availability_status = $14,
        emergency_contact_name = $15,
        emergency_contact_phone = $16,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $17
      RETURNING *`,
      [
        licenseNumber, address, city, district, province,
        languagesArray, otherSkills || [], yearsOfExperience || 0,
        vehicleType, vehicleNumber, vehicleModel, vehicleYear, vehicleColor,
        availabilityStatus || 'available',
        emergencyContactName, emergencyContactPhone,
        userId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Driver details not found' });
    }

    res.json({
      message: 'Driver details updated successfully',
      driverDetails: {
        id: result.rows[0].id,
        licenseNumber: result.rows[0].license_number,
        address: result.rows[0].address,
        city: result.rows[0].city,
        district: result.rows[0].district,
        province: result.rows[0].province,
        languages: result.rows[0].languages,
        otherSkills: result.rows[0].other_skills,
        yearsOfExperience: result.rows[0].years_of_experience,
        vehicleType: result.rows[0].vehicle_type,
        vehicleNumber: result.rows[0].vehicle_number,
        vehicleModel: result.rows[0].vehicle_model,
        vehicleYear: result.rows[0].vehicle_year,
        vehicleColor: result.rows[0].vehicle_color,
        availabilityStatus: result.rows[0].availability_status,
        emergencyContactName: result.rows[0].emergency_contact_name,
        emergencyContactPhone: result.rows[0].emergency_contact_phone
      }
    });
  } catch (error) {
    console.error('Update driver details error:', error);
    
    if (error.code === '23505') {
      if (error.constraint === 'driver_details_license_number_key') {
        return res.status(400).json({ error: 'License number already exists' });
      }
      if (error.constraint === 'driver_details_vehicle_number_key') {
        return res.status(400).json({ error: 'Vehicle number already exists' });
      }
    }
    
    res.status(500).json({ error: 'Failed to update driver details' });
  }
};

// Delete driver details
exports.deleteDriverDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      'DELETE FROM driver_details WHERE user_id = $1 RETURNING id',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Driver details not found' });
    }

    res.json({ message: 'Driver details deleted successfully' });
  } catch (error) {
    console.error('Delete driver details error:', error);
    res.status(500).json({ error: 'Failed to delete driver details' });
  }
};

// Update driver availability
exports.updateDriverAvailability = async (req, res) => {
  try {
    const { userId } = req.params;
    const { availabilityStatus } = req.body;

    const validStatuses = ['available', 'busy', 'on_leave'];
    if (!validStatuses.includes(availabilityStatus)) {
      return res.status(400).json({ error: 'Invalid availability status' });
    }

    const result = await pool.query(
      `UPDATE driver_details SET
        availability_status = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
      RETURNING availability_status`,
      [availabilityStatus, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Driver details not found' });
    }

    res.json({
      message: 'Driver availability updated successfully',
      availabilityStatus: result.rows[0].availability_status
    });
  } catch (error) {
    console.error('Update driver availability error:', error);
    res.status(500).json({ error: 'Failed to update driver availability' });
  }
};

// Delete driver and all associated data
exports.deleteDriver = async (req, res) => {
  try {
    const { userId } = req.params;

    // First check if driver exists
    const driverCheck = await pool.query(
      'SELECT id FROM driver_details WHERE user_id = $1',
      [userId]
    );

    if (driverCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Delete driver details first (foreign key constraint)
    await pool.query(
      'DELETE FROM driver_details WHERE user_id = $1',
      [userId]
    );

    // Delete the user
    const userResult = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('Delete driver error:', error);
    res.status(500).json({ error: 'Failed to delete driver' });
  }
};

// Create driver profile (for drivers creating their own profiles)
exports.createOwnDriverProfile = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      user_id,
      license_number,
      address,
      city,
      district,
      province,
      languages,
      other_skills,
      years_of_experience,
      vehicle_type,
      vehicle_number,
      vehicle_model,
      vehicle_year,
      vehicle_color,
      emergency_contact_name,
      emergency_contact_phone
    } = req.body;

    // Verify user exists and is a driver
    const userCheck = await client.query(
      'SELECT id, role FROM users WHERE id = $1',
      [user_id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    if (userCheck.rows[0].role !== 'driver') {
      return res.status(400).json({ 
        success: false,
        error: 'User is not a driver' 
      });
    }

    // Check if driver details already exist
    const existingDetails = await client.query(
      'SELECT id FROM driver_details WHERE user_id = $1',
      [user_id]
    );

    if (existingDetails.rows.length > 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Driver details already exist. Use update instead.' 
      });
    }

    // Process languages array
    const languagesArray = Array.isArray(languages) ? languages : 
                          (typeof languages === 'string' ? languages.split(',').map(s => s.trim()).filter(s => s) : ['English']);
    
    // Process other_skills array
    const otherSkillsArray = Array.isArray(other_skills) ? other_skills : 
                             (typeof other_skills === 'string' ? other_skills.split(',').map(s => s.trim()).filter(s => s) : []);

    const result = await client.query(
      `INSERT INTO driver_details (
        user_id, license_number, address, city, district, province,
        languages, other_skills, years_of_experience,
        vehicle_type, vehicle_number, vehicle_model, vehicle_year, vehicle_color,
        emergency_contact_name, emergency_contact_phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        user_id, license_number, address, city, district, province,
        languagesArray, otherSkillsArray, years_of_experience || 0,
        vehicle_type, vehicle_number, vehicle_model, 
        vehicle_year ? parseInt(vehicle_year) : null, 
        vehicle_color,
        emergency_contact_name, emergency_contact_phone
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Driver profile created successfully',
      data: {
        id: result.rows[0].id,
        licenseNumber: result.rows[0].license_number,
        address: result.rows[0].address,
        city: result.rows[0].city,
        district: result.rows[0].district,
        province: result.rows[0].province,
        languages: result.rows[0].languages,
        otherSkills: result.rows[0].other_skills,
        yearsOfExperience: result.rows[0].years_of_experience,
        vehicleType: result.rows[0].vehicle_type,
        vehicleNumber: result.rows[0].vehicle_number,
        vehicleModel: result.rows[0].vehicle_model,
        vehicleYear: result.rows[0].vehicle_year,
        vehicleColor: result.rows[0].vehicle_color,
        emergencyContactName: result.rows[0].emergency_contact_name,
        emergencyContactPhone: result.rows[0].emergency_contact_phone
      }
    });
  } catch (error) {
    console.error('Create driver profile error:', error);
    
    if (error.code === '23505') {
      if (error.constraint === 'driver_details_license_number_key') {
        return res.status(400).json({ 
          success: false,
          error: 'License number already exists' 
        });
      }
      if (error.constraint === 'driver_details_vehicle_number_key') {
        return res.status(400).json({ 
          success: false,
          error: 'Vehicle number already exists' 
        });
      }
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to create driver profile',
      details: error.message 
    });
  } finally {
    client.release();
  }
};

// Update own driver profile (for drivers updating their own profiles)
exports.updateOwnDriverProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      license_number,
      address,
      city,
      district,
      province,
      languages,
      other_skills,
      years_of_experience,
      vehicle_type,
      vehicle_number,
      vehicle_model,
      vehicle_year,
      vehicle_color,
      emergency_contact_name,
      emergency_contact_phone
    } = req.body;

    // Process languages array
    const languagesArray = Array.isArray(languages) ? languages : 
                          (typeof languages === 'string' ? languages.split(',').map(s => s.trim()).filter(s => s) : ['English']);
    
    // Process other_skills array
    const otherSkillsArray = Array.isArray(other_skills) ? other_skills : 
                             (typeof other_skills === 'string' ? other_skills.split(',').map(s => s.trim()).filter(s => s) : []);

    const result = await pool.query(
      `UPDATE driver_details SET
        license_number = $1,
        address = $2,
        city = $3,
        district = $4,
        province = $5,
        languages = $6,
        other_skills = $7,
        years_of_experience = $8,
        vehicle_type = $9,
        vehicle_number = $10,
        vehicle_model = $11,
        vehicle_year = $12,
        vehicle_color = $13,
        emergency_contact_name = $14,
        emergency_contact_phone = $15,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $16
      RETURNING *`,
      [
        license_number, address, city, district, province,
        languagesArray, otherSkillsArray, years_of_experience || 0,
        vehicle_type, vehicle_number, vehicle_model, 
        vehicle_year ? parseInt(vehicle_year) : null,
        vehicle_color,
        emergency_contact_name, emergency_contact_phone,
        userId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Driver details not found' 
      });
    }

    res.json({
      success: true,
      message: 'Driver profile updated successfully',
      data: {
        id: result.rows[0].id,
        licenseNumber: result.rows[0].license_number,
        address: result.rows[0].address,
        city: result.rows[0].city,
        district: result.rows[0].district,
        province: result.rows[0].province,
        languages: result.rows[0].languages,
        otherSkills: result.rows[0].other_skills,
        yearsOfExperience: result.rows[0].years_of_experience,
        vehicleType: result.rows[0].vehicle_type,
        vehicleNumber: result.rows[0].vehicle_number,
        vehicleModel: result.rows[0].vehicle_model,
        vehicleYear: result.rows[0].vehicle_year,
        vehicleColor: result.rows[0].vehicle_color,
        emergencyContactName: result.rows[0].emergency_contact_name,
        emergencyContactPhone: result.rows[0].emergency_contact_phone
      }
    });
  } catch (error) {
    console.error('Update driver profile error:', error);
    
    if (error.code === '23505') {
      if (error.constraint === 'driver_details_license_number_key') {
        return res.status(400).json({ 
          success: false,
          error: 'License number already exists' 
        });
      }
      if (error.constraint === 'driver_details_vehicle_number_key') {
        return res.status(400).json({ 
          success: false,
          error: 'Vehicle number already exists' 
        });
      }
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to update driver profile',
      details: error.message 
    });
  }
};

// Get assignments for logged-in driver
exports.getMyAssignments = async (req, res) => {
  try {
    const userId = req.user.id;

    const driverResult = await pool.query(
      'SELECT id FROM driver_details WHERE user_id = $1',
      [userId]
    );

    if (driverResult.rows.length === 0) {
      return res.status(404).json({ error: 'Driver profile not found' });
    }

    const driverId = driverResult.rows[0].id;

    const result = await pool.query(
      `SELECT
        a.id AS assignment_id,
        a.booking_id,
        a.driver_id,
        a.start_date,
        a.end_date,
        a.status AS assignment_status,
        a.assigned_at,
        b.arrival_date,
        b.arrival_time,
        b.travel_days,
        b.pickup_location,
        b.pax,
        b.vehicle_type,
        b.vehicle_model,
        b.status AS booking_status,
        b.fullname,
        b.email,
        b.phone,
        p.package_name,
        u.first_name AS manager_first_name,
        u.last_name AS manager_last_name
      FROM driver_package_assignments a
      INNER JOIN booking_form b ON b.id = a.booking_id
      LEFT JOIN packages p ON p.id = a.package_id
      LEFT JOIN users u ON u.id = a.assigned_by
      WHERE a.driver_id = $1
      ORDER BY a.assigned_at DESC`,
      [driverId]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get driver assignments error:', error);
    res.status(500).json({ error: 'Failed to fetch driver assignments' });
  }
};

// Accept or reject an assignment
exports.respondToAssignment = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.id;
    const { assignmentId } = req.params;
    const { response } = req.body;

    if (!['accept', 'reject'].includes(response)) {
      return res.status(400).json({ error: 'Response must be accept or reject' });
    }

    await client.query('BEGIN');

    const assignmentResult = await client.query(
      `SELECT a.id, a.booking_id, a.driver_id, a.start_date, a.end_date, a.status
       FROM driver_package_assignments a
       INNER JOIN driver_details d ON d.id = a.driver_id
       WHERE a.id = $1 AND d.user_id = $2`,
      [assignmentId, userId]
    );

    if (assignmentResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const assignment = assignmentResult.rows[0];

    if (response === 'accept') {
      await client.query(
        `UPDATE booking_form
         SET status = 'completed', updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [assignment.booking_id]
      );

      await client.query(
        `UPDATE driver_package_assignments
         SET status = 'confirmed'
         WHERE id = $1`,
        [assignment.id]
      );

      await client.query(
        `INSERT INTO driver_availability (driver_id, available_date, status)
         SELECT $1, d::date, 'assigned'
         FROM generate_series($2::date, $3::date, '1 day') d
         ON CONFLICT (driver_id, available_date)
         DO UPDATE SET status = 'assigned', updated_at = CURRENT_TIMESTAMP`,
        [assignment.driver_id, assignment.start_date, assignment.end_date]
      );

      await client.query('COMMIT');

      return res.json({
        success: true,
        message: 'Assignment accepted and booking confirmed'
      });
    }

    await client.query(
      `UPDATE driver_package_assignments
       SET status = 'cancelled'
       WHERE id = $1`,
      [assignment.id]
    );

    await client.query(
      `UPDATE driver_availability
       SET status = 'available', updated_at = CURRENT_TIMESTAMP
       WHERE driver_id = $1
         AND available_date BETWEEN $2 AND $3
         AND status = 'assigned'`,
      [assignment.driver_id, assignment.start_date, assignment.end_date]
    );

    await client.query('COMMIT');

    return res.json({
      success: true,
      message: 'Assignment rejected'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Respond to assignment error:', error);
    res.status(500).json({ error: 'Failed to respond to assignment' });
  } finally {
    client.release();
  }
};


// Complete a tour assignment
exports.completeTour = async (req, res) => {
  const { tourId, completionNotes } = req.body;
  const driverId = req.user?.id;

  if (!tourId || !driverId) {
    return res.status(400).json({ error: 'Missing required fields: tourId or driverId' });
  }

  try {
    // 1. Find the assignment
    const assignmentResult = await pool.query(
      `SELECT dpa.*, b.id as booking_id, b.fullname, b.pax
       FROM driver_package_assignments dpa
       LEFT JOIN booking_form b ON dpa.booking_id = b.id
       WHERE dpa.id = $1`,
      [tourId]
    );

    if (assignmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Tour assignment not found' });
    }

    const assignment = assignmentResult.rows[0];

    // 2. Verify driver is the one assigned
    const driverCheckResult = await pool.query(
      `SELECT id FROM driver_details WHERE user_id = $1`,
      [driverId]
    );

    if (driverCheckResult.rows.length === 0) {
      return res.status(403).json({ error: 'Driver details not found' });
    }

    const driverDetails = driverCheckResult.rows[0];

    if (assignment.driver_id !== driverDetails.id) {
      return res.status(403).json({ error: 'You are not assigned to this tour' });
    }

    // 3. Update assignment status to completed
    const updateResult = await pool.query(
      `UPDATE driver_package_assignments
       SET status = 'completed', completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP, completion_notes = $2
       WHERE id = $1
       RETURNING *`,
      [tourId, completionNotes || null]
    );

    // 4. Update booking status to completed
    if (assignment.booking_id) {
      await pool.query(
        `UPDATE booking_form
         SET status = 'completed', updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [assignment.booking_id]
      );
    }

    console.log(`✅ Tour ${tourId} marked as completed by driver ${driverId}`);

    res.json({
      success: true,
      message: 'Tour completed successfully',
      assignment: updateResult.rows[0]
    });
  } catch (error) {
    console.error('Complete tour error:', error);
    res.status(500).json({ 
      error: 'Failed to complete tour',
      details: error.message 
    });
  }
};