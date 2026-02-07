const bcrypt = require('bcrypt');
const pool = require('../config/db');

const normalizeDestinations = (destinations) => {
  if (!destinations) return [];
  if (Array.isArray(destinations)) {
    return destinations.map((d) => String(d).trim()).filter(Boolean);
  }
  if (typeof destinations === 'string') {
    return destinations
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);
  }
  return [];
};

const mapHotelAgentRow = (row) => ({
  id: row.user_id,
  email: row.email,
  firstName: row.first_name,
  lastName: row.last_name,
  phone: row.phone,
  role: row.role,
  isActive: row.is_active,
  profilePicture: row.profile_picture,
  createdAt: row.user_created_at,
  hotelAgent: {
    id: row.hotel_id,
    hotelName: row.hotel_name,
    registrationNumber: row.registration_number,
    location: row.location,
    contactPerson: row.contact_person,
    description: row.description,
    rating: row.rating,
    destinations: row.destinations || [],
    hotelType: row.hotel_type,
    province: row.province,
    district: row.district,
    createdAt: row.hotel_created_at,
    updatedAt: row.hotel_updated_at
  }
});

exports.getAllHotelAgents = async (req, res) => {
  try {
    const { search } = req.query;
    const params = [];
    let whereClause = "WHERE u.role = 'hotel_agent'";

    if (search) {
      params.push(`%${search}%`);
      whereClause += ` AND (
        u.first_name ILIKE $${params.length}
        OR u.last_name ILIKE $${params.length}
        OR u.email ILIKE $${params.length}
        OR h.hotel_name ILIKE $${params.length}
        OR h.registration_number ILIKE $${params.length}
      )`;
    }

    const query = `
      SELECT
        u.id AS user_id,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        u.role,
        u.is_active,
        u.profile_picture,
        u.created_at AS user_created_at,
        h.id AS hotel_id,
        h.hotel_name,
        h.registration_number,
        h.location,
        h.contact_person,
        h.description,
        h.rating,
        h.destinations,
        h.hotel_type,
        h.province,
        h.district,
        h.created_at AS hotel_created_at,
        h.updated_at AS hotel_updated_at
      FROM users u
      INNER JOIN hotel_agents h ON h.user_id = u.id
      ${whereClause}
      ORDER BY u.created_at DESC
    `;

    const result = await pool.query(query, params);
    const agents = result.rows.map(mapHotelAgentRow);

    res.json(agents);
  } catch (error) {
    console.error('Get hotel agents error:', error);
    res.status(500).json({ error: 'Failed to fetch hotel agents' });
  }
};

exports.getHotelAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT
        u.id AS user_id,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        u.role,
        u.is_active,
        u.profile_picture,
        u.created_at AS user_created_at,
        h.id AS hotel_id,
        h.hotel_name,
        h.registration_number,
        h.location,
        h.contact_person,
        h.description,
        h.rating,
        h.destinations,
        h.hotel_type,
        h.province,
        h.district,
        h.created_at AS hotel_created_at,
        h.updated_at AS hotel_updated_at
      FROM users u
      INNER JOIN hotel_agents h ON h.user_id = u.id
      WHERE u.id = $1 AND u.role = 'hotel_agent'
      `,
      [id]
    );

    if (!result.rows.length) return res.status(404).json({ error: 'Hotel agent not found' });

    res.json(mapHotelAgentRow(result.rows[0]));
  } catch (error) {
    console.error('Get hotel agent error:', error);
    res.status(500).json({ error: 'Failed to fetch hotel agent' });
  }
};

exports.createHotelAgent = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      hotelName,
      registrationNumber,
      location,
      contactPerson,
      description,
      destinations,
      hotelType,
      province,
      district
    } = req.body;

    if (!email || !password || !firstName || !lastName || !hotelName || !registrationNumber || !location || !province || !district) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    const userExists = await client.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (userExists.rows.length) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await client.query('BEGIN');

    const userResult = await client.query(
      `
      INSERT INTO users (email, password, first_name, last_name, phone, role, created_by)
      VALUES ($1,$2,$3,$4,$5,'hotel_agent',$6)
      RETURNING id, email, first_name, last_name, phone, role, is_active, profile_picture, created_at
      `,
      [email.toLowerCase(), hashedPassword, firstName, lastName, phone, req.user.id]
    );

    const createdUser = userResult.rows[0];

    const destinationsArray = normalizeDestinations(destinations);

    const hotelResult = await client.query(
      `
      INSERT INTO hotel_agents (
        user_id,
        hotel_name,
        registration_number,
        location,
        contact_person,
        description,
        destinations,
        hotel_type,
        province,
        district
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING id, hotel_name, registration_number, location, contact_person, description, rating, destinations, hotel_type, province, district, created_at, updated_at
      `,
      [
        createdUser.id,
        hotelName,
        registrationNumber,
        location,
        contactPerson || null,
        description || null,
        destinationsArray,
        hotelType || '3_star',
        province,
        district
      ]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Hotel agent created successfully',
      agent: {
        id: createdUser.id,
        email: createdUser.email,
        firstName: createdUser.first_name,
        lastName: createdUser.last_name,
        phone: createdUser.phone,
        role: createdUser.role,
        isActive: createdUser.is_active,
        profilePicture: createdUser.profile_picture,
        createdAt: createdUser.created_at,
        hotelAgent: {
          id: hotelResult.rows[0].id,
          hotelName: hotelResult.rows[0].hotel_name,
          registrationNumber: hotelResult.rows[0].registration_number,
          location: hotelResult.rows[0].location,
          contactPerson: hotelResult.rows[0].contact_person,
          description: hotelResult.rows[0].description,
          rating: hotelResult.rows[0].rating,
          destinations: hotelResult.rows[0].destinations || [],
          hotelType: hotelResult.rows[0].hotel_type,
          province: hotelResult.rows[0].province,
          district: hotelResult.rows[0].district,
          createdAt: hotelResult.rows[0].created_at,
          updatedAt: hotelResult.rows[0].updated_at
        }
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create hotel agent error:', error);
    res.status(500).json({ error: 'Failed to create hotel agent' });
  } finally {
    client.release();
  }
};

exports.updateHotelAgent = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const {
      email,
      firstName,
      lastName,
      phone,
      hotelName,
      registrationNumber,
      location,
      contactPerson,
      description,
      destinations,
      hotelType,
      province,
      district
    } = req.body;

    await client.query('BEGIN');

    if (email) {
      const emailCheck = await client.query('SELECT id FROM users WHERE email = $1 AND id <> $2', [email.toLowerCase(), id]);
      if (emailCheck.rows.length) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Email already registered' });
      }
    }

    const userResult = await client.query(
      `
      UPDATE users
      SET email = COALESCE($1, email),
          first_name = COALESCE($2, first_name),
          last_name = COALESCE($3, last_name),
          phone = COALESCE($4, phone),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 AND role = 'hotel_agent'
      RETURNING id, email, first_name, last_name, phone, role, is_active, profile_picture, created_at
      `,
      [email ? email.toLowerCase() : null, firstName, lastName, phone, id]
    );

    if (!userResult.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Hotel agent not found' });
    }

    const destinationsArray = normalizeDestinations(destinations);

    const hotelResult = await client.query(
      `
      UPDATE hotel_agents
      SET hotel_name = COALESCE($1, hotel_name),
          registration_number = COALESCE($2, registration_number),
          location = COALESCE($3, location),
          contact_person = COALESCE($4, contact_person),
          description = COALESCE($5, description),
          destinations = COALESCE($6, destinations),
          hotel_type = COALESCE($7, hotel_type),
          province = COALESCE($8, province),
          district = COALESCE($9, district),
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $10
      RETURNING id, hotel_name, registration_number, location, contact_person, description, rating, destinations, hotel_type, province, district, created_at, updated_at
      `,
      [
        hotelName,
        registrationNumber,
        location,
        contactPerson,
        description,
        destinationsArray.length ? destinationsArray : null,
        hotelType,
        province,
        district,
        id
      ]
    );

    await client.query('COMMIT');

    res.json({
      message: 'Hotel agent updated successfully',
      agent: {
        id: userResult.rows[0].id,
        email: userResult.rows[0].email,
        firstName: userResult.rows[0].first_name,
        lastName: userResult.rows[0].last_name,
        phone: userResult.rows[0].phone,
        role: userResult.rows[0].role,
        isActive: userResult.rows[0].is_active,
        profilePicture: userResult.rows[0].profile_picture,
        createdAt: userResult.rows[0].created_at,
        hotelAgent: {
          id: hotelResult.rows[0].id,
          hotelName: hotelResult.rows[0].hotel_name,
          registrationNumber: hotelResult.rows[0].registration_number,
          location: hotelResult.rows[0].location,
          contactPerson: hotelResult.rows[0].contact_person,
          description: hotelResult.rows[0].description,
          rating: hotelResult.rows[0].rating,
          destinations: hotelResult.rows[0].destinations || [],
          hotelType: hotelResult.rows[0].hotel_type,
          province: hotelResult.rows[0].province,
          district: hotelResult.rows[0].district,
          createdAt: hotelResult.rows[0].created_at,
          updatedAt: hotelResult.rows[0].updated_at
        }
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update hotel agent error:', error);
    res.status(500).json({ error: 'Failed to update hotel agent' });
  } finally {
    client.release();
  }
};

exports.deleteHotelAgent = async (req, res) => {
  try {
    const { id } = req.params;

    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1 AND role = $2', [id, 'hotel_agent']);
    if (!userCheck.rows.length) return res.status(404).json({ error: 'Hotel agent not found' });

    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    res.json({ message: 'Hotel agent deleted successfully' });
  } catch (error) {
    console.error('Delete hotel agent error:', error);
    res.status(500).json({ error: 'Failed to delete hotel agent' });
  }
};

exports.toggleHotelAgentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      UPDATE users
      SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND role = 'hotel_agent'
      RETURNING id, is_active
      `,
      [id]
    );

    if (!result.rows.length) return res.status(404).json({ error: 'Hotel agent not found' });

    res.json({
      message: 'Hotel agent status updated successfully',
      isActive: result.rows[0].is_active
    });
  } catch (error) {
    console.error('Toggle hotel agent status error:', error);
    res.status(500).json({ error: 'Failed to update hotel agent status' });
  }
};
