const pool = require('../config/db');

// Get all drivers with their details and user info
exports.getAllDrivers = async (req, res) => {
  try {
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
      WHERE u.role = 'driver'
      ORDER BY u.created_at DESC
    `;

    const result = await pool.query(query);

    const drivers = result.rows.map(row => ({
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

    res.json(drivers);
  } catch (error) {
    console.error('Get all drivers error:', error);
    res.status(500).json({ error: 'Failed to fetch drivers' });
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