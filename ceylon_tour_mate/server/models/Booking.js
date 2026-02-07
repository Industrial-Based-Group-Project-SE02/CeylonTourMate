const pool = require('../config/db');

class Booking {
  // Create a new booking
  static async create(bookingData) {
    const {
      user_id,
      package_id,
      fullname,
      email,
      phone,
      passport_number,
      flight_number,
      arrival_date,
      arrival_time,
      travel_days,
      vehicle_type,
      vehicle_model,
      pax,
      pickup_location,
      languages,
      notes,
      destinations,
      custom_components,
      estimated_price,
      payment_slip_path,
      status = 'pending'
    } = bookingData;

    const query = `
      INSERT INTO booking_form (
        user_id, package_id, fullname, email, phone, passport_number, 
        flight_number, arrival_date, arrival_time, travel_days, 
        vehicle_type, vehicle_model, pax, pickup_location, languages, 
        notes, destinations, custom_components, estimated_price, 
        payment_slip_path, status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, NOW(), NOW())
      RETURNING *;
    `;

    const values = [
      user_id,
      package_id,
      fullname,
      email,
      phone,
      passport_number,
      flight_number,
      arrival_date,
      arrival_time,
      travel_days,
      vehicle_type,
      vehicle_model,
      pax,
      pickup_location,
      languages,
      notes,
      destinations,
      custom_components,
      estimated_price,
      payment_slip_path,
      status
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating booking: ${error.message}`);
    }
  }

  // Get booking by ID
  static async getById(id) {
    const query = `
      SELECT b.*, p.package_name, u.first_name, u.last_name
      FROM booking_form b
      LEFT JOIN packages p ON b.package_id = p.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.id = $1;
    `;

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error fetching booking: ${error.message}`);
    }
  }

  // Get all bookings with pagination
  static async getAll(filters = {}) {
    const { page = 1, limit = 10, status = '', search = '' } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT b.*, p.package_name, u.first_name, u.last_name, u.email as user_email
      FROM booking_form b
      LEFT JOIN packages p ON b.package_id = p.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (status) {
      query += ` AND b.status = $${paramCount}`;
      values.push(status);
      paramCount++;
    }

    if (search) {
      query += ` AND (b.fullname ILIKE $${paramCount} OR b.email ILIKE $${paramCount})`;
      values.push(`%${search}%`);
      paramCount++;
    }

    query += ` ORDER BY b.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching bookings: ${error.message}`);
    }
  }

  // Get bookings by user ID
  static async getByUserId(userId) {
    const query = `
      SELECT b.*, p.package_name
      FROM booking_form b
      LEFT JOIN packages p ON b.package_id = p.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC;
    `;

    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching user bookings: ${error.message}`);
    }
  }

  // Update booking status
  static async updateStatus(id, status) {
    const query = `
      UPDATE booking_form
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;

    try {
      const result = await pool.query(query, [status, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating booking status: ${error.message}`);
    }
  }

  // Update booking
  static async update(id, updateData) {
    const {
      fullname,
      email,
      phone,
      passport_number,
      flight_number,
      arrival_date,
      arrival_time,
      travel_days,
      vehicle_type,
      vehicle_model,
      pax,
      pickup_location,
      languages,
      notes,
      destinations,
      custom_components,
      estimated_price,
      status
    } = updateData;

    const query = `
      UPDATE booking_form
      SET 
        fullname = COALESCE($1, fullname),
        email = COALESCE($2, email),
        phone = COALESCE($3, phone),
        passport_number = COALESCE($4, passport_number),
        flight_number = COALESCE($5, flight_number),
        arrival_date = COALESCE($6, arrival_date),
        arrival_time = COALESCE($7, arrival_time),
        travel_days = COALESCE($8, travel_days),
        vehicle_type = COALESCE($9, vehicle_type),
        vehicle_model = COALESCE($10, vehicle_model),
        pax = COALESCE($11, pax),
        pickup_location = COALESCE($12, pickup_location),
        languages = COALESCE($13, languages),
        notes = COALESCE($14, notes),
        destinations = COALESCE($15, destinations),
        custom_components = COALESCE($16, custom_components),
        estimated_price = COALESCE($17, estimated_price),
        status = COALESCE($18, status),
        updated_at = NOW()
      WHERE id = $19
      RETURNING *;
    `;

    const values = [
      fullname,
      email,
      phone,
      passport_number,
      flight_number,
      arrival_date,
      arrival_time,
      travel_days,
      vehicle_type,
      vehicle_model,
      pax,
      pickup_location,
      languages,
      notes,
      destinations,
      custom_components,
      estimated_price,
      status,
      id
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating booking: ${error.message}`);
    }
  }

  // Delete booking
  static async delete(id) {
    const query = `
      DELETE FROM booking_form
      WHERE id = $1
      RETURNING id;
    `;

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] ? true : false;
    } catch (error) {
      throw new Error(`Error deleting booking: ${error.message}`);
    }
  }

  // Get booking statistics
  static async getStatistics() {
    const query = `
      SELECT 
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_bookings,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_bookings,
        AVG(CAST(REPLACE(estimated_price, 'USD ', '') AS DECIMAL)) as avg_price
      FROM booking_form;
    `;

    try {
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching booking statistics: ${error.message}`);
    }
  }
}

module.exports = Booking;