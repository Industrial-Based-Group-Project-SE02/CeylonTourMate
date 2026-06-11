const pool = require('../config/db');

// Get all rooms for the logged-in hotel agent
exports.getMyRooms = async (req, res) => {
  try {
    const userId = req.user.id;

    // First, get the hotel_agent_id for this user
    const hotelAgentResult = await pool.query(
      'SELECT id FROM hotel_agents WHERE user_id = $1',
      [userId]
    );

    if (hotelAgentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel agent profile not found' });
    }

    const hotelAgentId = hotelAgentResult.rows[0].id;

    // Get all rooms for this hotel agent
    const result = await pool.query(
      `SELECT 
        id, 
        hotel_agent_id, 
        room_type, 
        total_rooms, 
        max_guests, 
        price_per_night,
        created_at,
        updated_at
      FROM hotel_rooms
      WHERE hotel_agent_id = $1
      ORDER BY created_at DESC`,
      [hotelAgentId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get my rooms error:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

// Get all rooms (admin/manager only)
exports.getAllRooms = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        hr.id, 
        hr.hotel_agent_id, 
        hr.room_type, 
        hr.total_rooms, 
        hr.max_guests, 
        hr.price_per_night,
        hr.created_at,
        hr.updated_at,
        ha.hotel_name,
        u.first_name,
        u.last_name,
        u.email
      FROM hotel_rooms hr
      INNER JOIN hotel_agents ha ON hr.hotel_agent_id = ha.id
      INNER JOIN users u ON ha.user_id = u.id
      ORDER BY hr.created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get all rooms error:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

// Create a new room
exports.createRoom = async (req, res) => {
  try {
    const userId = req.user.id;
    const { room_type, total_rooms, max_guests, price_per_night } = req.body;

    // Validation
    if (!room_type || !total_rooms || !max_guests || !price_per_night) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (total_rooms < 1) {
      return res.status(400).json({ error: 'Total rooms must be at least 1' });
    }

    if (max_guests < 1) {
      return res.status(400).json({ error: 'Max guests must be at least 1' });
    }

    if (price_per_night <= 0) {
      return res.status(400).json({ error: 'Price must be greater than 0' });
    }

    // Get hotel_agent_id
    const hotelAgentResult = await pool.query(
      'SELECT id FROM hotel_agents WHERE user_id = $1',
      [userId]
    );

    if (hotelAgentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel agent profile not found' });
    }

    const hotelAgentId = hotelAgentResult.rows[0].id;

    // Check if room type already exists for this hotel
    const existingRoom = await pool.query(
      'SELECT id FROM hotel_rooms WHERE hotel_agent_id = $1 AND room_type = $2',
      [hotelAgentId, room_type]
    );

    if (existingRoom.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Room type already exists. Please update the existing room instead.' 
      });
    }

    // Create the room
    const result = await pool.query(
      `INSERT INTO hotel_rooms (
        hotel_agent_id, 
        room_type, 
        total_rooms, 
        max_guests, 
        price_per_night
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [hotelAgentId, room_type, total_rooms, max_guests, price_per_night]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
};

// Update a room
exports.updateRoom = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { room_type, total_rooms, max_guests, price_per_night } = req.body;

    // Validation
    if (!room_type || !total_rooms || !max_guests || !price_per_night) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (total_rooms < 1 || max_guests < 1 || price_per_night <= 0) {
      return res.status(400).json({ error: 'Invalid values provided' });
    }

    // Get hotel_agent_id
    const hotelAgentResult = await pool.query(
      'SELECT id FROM hotel_agents WHERE user_id = $1',
      [userId]
    );

    if (hotelAgentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel agent profile not found' });
    }

    const hotelAgentId = hotelAgentResult.rows[0].id;

    // Check if room exists and belongs to this hotel agent
    const roomCheck = await pool.query(
      'SELECT id FROM hotel_rooms WHERE id = $1 AND hotel_agent_id = $2',
      [id, hotelAgentId]
    );

    if (roomCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found or access denied' });
    }

    // Check if updating to a room type that already exists (different room)
    const duplicateCheck = await pool.query(
      'SELECT id FROM hotel_rooms WHERE hotel_agent_id = $1 AND room_type = $2 AND id != $3',
      [hotelAgentId, room_type, id]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Another room with this type already exists' 
      });
    }

    // Update the room
    const result = await pool.query(
      `UPDATE hotel_rooms 
      SET 
        room_type = $1, 
        total_rooms = $2, 
        max_guests = $3, 
        price_per_night = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 AND hotel_agent_id = $6
      RETURNING *`,
      [room_type, total_rooms, max_guests, price_per_night, id, hotelAgentId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ error: 'Failed to update room' });
  }
};

// Delete a room
exports.deleteRoom = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Get hotel_agent_id
    const hotelAgentResult = await pool.query(
      'SELECT id FROM hotel_agents WHERE user_id = $1',
      [userId]
    );

    if (hotelAgentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel agent profile not found' });
    }

    const hotelAgentId = hotelAgentResult.rows[0].id;

    // Check if room exists and belongs to this hotel agent
    const roomCheck = await pool.query(
      'SELECT id FROM hotel_rooms WHERE id = $1 AND hotel_agent_id = $2',
      [id, hotelAgentId]
    );

    if (roomCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found or access denied' });
    }

    // Delete the room (will cascade delete availability records)
    await pool.query(
      'DELETE FROM hotel_rooms WHERE id = $1 AND hotel_agent_id = $2',
      [id, hotelAgentId]
    );

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
};

// Get room availability
exports.getRoomAvailability = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    // Get hotel_agent_id
    const hotelAgentResult = await pool.query(
      'SELECT id FROM hotel_agents WHERE user_id = $1',
      [userId]
    );

    if (hotelAgentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel agent profile not found' });
    }

    const hotelAgentId = hotelAgentResult.rows[0].id;

    // Check if room belongs to this hotel agent
    const roomCheck = await pool.query(
      'SELECT id, total_rooms FROM hotel_rooms WHERE id = $1 AND hotel_agent_id = $2',
      [roomId, hotelAgentId]
    );

    if (roomCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found or access denied' });
    }

    const totalRooms = roomCheck.rows[0].total_rooms;

    // Get availability for date range
    const result = await pool.query(
      `SELECT 
        id,
        hotel_room_id,
        booking_date::text AS booking_date,
        available_rooms,
        rooms_booked,
        status,
        created_at,
        updated_at
      FROM hotel_room_inventory
      WHERE hotel_room_id = $1 
        AND booking_date BETWEEN $2 AND $3
      ORDER BY booking_date ASC`,
      [roomId, startDate, endDate]
    );

    // Generate all dates in range and fill missing ones with default values
    const availabilityMap = new Map();
    result.rows.forEach(row => {
      availabilityMap.set(row.booking_date, row);
    });

    const start = new Date(startDate);
    const end = new Date(endDate);
    const allDates = [];

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      if (availabilityMap.has(dateStr)) {
        allDates.push(availabilityMap.get(dateStr));
      } else {
        // Default: all rooms available
        allDates.push({
          hotel_room_id: parseInt(roomId),
          booking_date: dateStr,
          available_rooms: totalRooms,
          rooms_booked: 0,
          status: 'available'
        });
      }
    }

    res.json(allDates);
  } catch (error) {
    console.error('Get room availability error:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
};

// Update availability for a single date
exports.updateAvailability = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomId } = req.params;
    const { booking_date, available_date, available_rooms, rooms_booked, status } = req.body;
    const inventoryDate = booking_date || available_date;

    if (!inventoryDate) {
      return res.status(400).json({ error: 'Date is required' });
    }

    // Get hotel_agent_id
    const hotelAgentResult = await pool.query(
      'SELECT id FROM hotel_agents WHERE user_id = $1',
      [userId]
    );

    if (hotelAgentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel agent profile not found' });
    }

    const hotelAgentId = hotelAgentResult.rows[0].id;

    // Check if room belongs to this hotel agent
    const roomCheck = await pool.query(
      'SELECT id, hotel_agent_id, room_type, total_rooms, price_per_night FROM hotel_rooms WHERE id = $1 AND hotel_agent_id = $2',
      [roomId, hotelAgentId]
    );

    if (roomCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found or access denied' });
    }

    const totalRooms = roomCheck.rows[0].total_rooms;
    const roomType = roomCheck.rows[0].room_type;
    const pricePerNight = roomCheck.rows[0].price_per_night;

    let finalRoomsBooked;
    let finalAvailableRooms;

    if (rooms_booked !== undefined) {
      finalRoomsBooked = Math.max(0, Math.min(parseInt(rooms_booked, 10), totalRooms));
      finalAvailableRooms = Math.max(0, totalRooms - finalRoomsBooked);
    } else if (available_rooms !== undefined) {
      finalAvailableRooms = Math.max(0, Math.min(parseInt(available_rooms, 10), totalRooms));
      finalRoomsBooked = Math.max(0, totalRooms - finalAvailableRooms);
    } else {
      if (status === 'blocked') {
        finalAvailableRooms = 0;
        finalRoomsBooked = 0;
      } else if (status === 'fully_booked') {
        finalAvailableRooms = 0;
        finalRoomsBooked = totalRooms;
      } else if (status === 'partially_booked') {
        finalAvailableRooms = Math.max(totalRooms - 1, 0);
        finalRoomsBooked = Math.max(0, totalRooms - finalAvailableRooms);
      } else {
        finalAvailableRooms = totalRooms;
        finalRoomsBooked = 0;
      }
    }

    let finalStatus = status;
    if (!finalStatus) {
      if (finalAvailableRooms === totalRooms) finalStatus = 'available';
      else if (finalAvailableRooms === 0 && finalRoomsBooked > 0) finalStatus = 'fully_booked';
      else if (finalAvailableRooms === 0 && finalRoomsBooked === 0) finalStatus = 'blocked';
      else finalStatus = 'partially_booked';
    }

    const result = await pool.query(
      `INSERT INTO hotel_room_inventory (
        hotel_agent_id,
        hotel_room_id,
        booking_id,
        room_type,
        booking_date,
        total_rooms,
        rooms_booked,
        available_rooms,
        price_per_night,
        status
      )
      VALUES ($1, $2, NULL, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (hotel_room_id, booking_date)
      DO UPDATE SET
        hotel_agent_id = EXCLUDED.hotel_agent_id,
        room_type = EXCLUDED.room_type,
        total_rooms = EXCLUDED.total_rooms,
        rooms_booked = EXCLUDED.rooms_booked,
        available_rooms = EXCLUDED.available_rooms,
        price_per_night = EXCLUDED.price_per_night,
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [hotelAgentId, roomId, roomType, inventoryDate, totalRooms, finalRoomsBooked, finalAvailableRooms, pricePerNight, finalStatus]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ error: 'Failed to update availability' });
  }
};

// Bulk update availability
exports.bulkUpdateAvailability = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const userId = req.user.id;
    const { roomId } = req.params;
    const { startDate, endDate, status, available_rooms, rooms_booked } = req.body;

    if (!startDate || !endDate || !status) {
      return res.status(400).json({ error: 'Start date, end date, and status are required' });
    }

    // Get hotel_agent_id
    const hotelAgentResult = await client.query(
      'SELECT id FROM hotel_agents WHERE user_id = $1',
      [userId]
    );

    if (hotelAgentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel agent profile not found' });
    }

    const hotelAgentId = hotelAgentResult.rows[0].id;

    // Check if room belongs to this hotel agent
    const roomCheck = await client.query(
      'SELECT id, hotel_agent_id, room_type, total_rooms, price_per_night FROM hotel_rooms WHERE id = $1 AND hotel_agent_id = $2',
      [roomId, hotelAgentId]
    );

    if (roomCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found or access denied' });
    }

    const totalRooms = roomCheck.rows[0].total_rooms;
    const roomType = roomCheck.rows[0].room_type;
    const pricePerNight = roomCheck.rows[0].price_per_night;

    let finalRoomsBooked;
    let finalAvailableRooms;

    if (rooms_booked !== undefined) {
      finalRoomsBooked = Math.max(0, Math.min(parseInt(rooms_booked, 10), totalRooms));
      finalAvailableRooms = Math.max(0, totalRooms - finalRoomsBooked);
    } else if (available_rooms !== undefined) {
      finalAvailableRooms = Math.max(0, Math.min(parseInt(available_rooms, 10), totalRooms));
      finalRoomsBooked = Math.max(0, totalRooms - finalAvailableRooms);
    } else {
      if (status === 'blocked') {
        finalAvailableRooms = 0;
        finalRoomsBooked = 0;
      } else if (status === 'fully_booked') {
        finalAvailableRooms = 0;
        finalRoomsBooked = totalRooms;
      } else if (status === 'partially_booked') {
        finalAvailableRooms = Math.max(totalRooms - 1, 0);
        finalRoomsBooked = Math.max(0, totalRooms - finalAvailableRooms);
      } else {
        finalAvailableRooms = totalRooms;
        finalRoomsBooked = 0;
      }
    }

    await client.query('BEGIN');

    // Generate all dates in range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const updates = [];

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      
      let finalStatus = status;
      if (!finalStatus) {
        if (finalAvailableRooms === totalRooms) finalStatus = 'available';
        else if (finalAvailableRooms === 0 && finalRoomsBooked > 0) finalStatus = 'fully_booked';
        else if (finalAvailableRooms === 0 && finalRoomsBooked === 0) finalStatus = 'blocked';
        else finalStatus = 'partially_booked';
      }

      const result = await client.query(
        `INSERT INTO hotel_room_inventory (
          hotel_agent_id,
          hotel_room_id,
          booking_id,
          room_type,
          booking_date,
          total_rooms,
          rooms_booked,
          available_rooms,
          price_per_night,
          status
        )
        VALUES ($1, $2, NULL, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (hotel_room_id, booking_date)
        DO UPDATE SET
          hotel_agent_id = EXCLUDED.hotel_agent_id,
          room_type = EXCLUDED.room_type,
          total_rooms = EXCLUDED.total_rooms,
          rooms_booked = EXCLUDED.rooms_booked,
          available_rooms = EXCLUDED.available_rooms,
          price_per_night = EXCLUDED.price_per_night,
          status = EXCLUDED.status,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *`,
        [hotelAgentId, roomId, roomType, dateStr, totalRooms, finalRoomsBooked, finalAvailableRooms, pricePerNight, finalStatus]
      );

      updates.push(result.rows[0]);
    }

    await client.query('COMMIT');

    res.json({ 
      message: 'Bulk update completed successfully',
      updated: updates.length,
      data: updates
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Bulk update availability error:', error);
    res.status(500).json({ error: 'Failed to bulk update availability' });
  } finally {
    client.release();
  }
};

exports.getRoomsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { startDate, endDate } = req.query;

    if (!hotelId) {
      return res.status(400).json({ error: 'Hotel ID is required' });
    }

    const params = [hotelId];
    let joinClause = 'LEFT JOIN hotel_room_availability hra ON hr.id = hra.hotel_room_id';

    if (startDate && endDate) {
      params.push(startDate, endDate);
      joinClause = 'LEFT JOIN hotel_room_availability hra ON hr.id = hra.hotel_room_id AND hra.available_date BETWEEN $2 AND $3';
    }

    let query = `
      SELECT 
        hr.id,
        hr.hotel_agent_id,
        hr.room_type,
        hr.total_rooms,
        hr.max_guests,
        hr.price_per_night,
        hr.created_at,
        hr.updated_at,
        COALESCE(json_agg(
          json_build_object(
            'available_date', hra.available_date,
            'available_rooms', hra.available_rooms,
            'status', hra.status
          ) ORDER BY hra.available_date
        ) FILTER (WHERE hra.id IS NOT NULL), '[]'::json) as availability
      FROM hotel_rooms hr
      ${joinClause}
      WHERE hr.hotel_agent_id = $1
    `;

    query += `
      GROUP BY hr.id, hr.hotel_agent_id, hr.room_type, hr.total_rooms, hr.max_guests, hr.price_per_night, hr.created_at, hr.updated_at
      ORDER BY hr.room_type ASC
    `;

    const result = await pool.query(query, params);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const parseDate = (dateStr) => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    };

    let rows = result.rows;

    if (startDate && endDate) {
      const start = parseDate(startDate);
      const end = parseDate(endDate);

      rows = rows.map((room) => {
        const availabilityMap = new Map();

        if (Array.isArray(room.availability)) {
          room.availability.forEach((entry) => {
            if (entry?.available_date) {
              availabilityMap.set(entry.available_date, entry);
            }
          });
        }

        const fullAvailability = [];
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
          const dateStr = formatDate(date);
          if (availabilityMap.has(dateStr)) {
            fullAvailability.push(availabilityMap.get(dateStr));
          } else {
            fullAvailability.push({
              available_date: dateStr,
              available_rooms: room.total_rooms,
              status: 'available'
            });
          }
        }

        return {
          ...room,
          availability: fullAvailability
        };
      });
    }

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get rooms by hotel error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch hotel rooms' 
    });
  }
};