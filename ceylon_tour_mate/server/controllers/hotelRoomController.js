const pool = require('../config/db');

const getHotelAgentIdForUser = async (userId) => {
  const result = await pool.query('SELECT id FROM hotel_agents WHERE user_id = $1', [userId]);
  return result.rows[0]?.id || null;
};

const buildDateRange = (startDate, endDateExclusive) => {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDateExclusive);
  while (current < end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

// @desc    Create a hotel room type
// @route   POST /api/hotel-rooms
// @access  Private (Hotel Agent / Manager / Admin)
exports.createRoom = async (req, res) => {
  try {
    const { roomType, totalRooms, maxGuests, pricePerNight, hotelAgentId } = req.body;

    if (!roomType || !totalRooms || !maxGuests || !pricePerNight) {
      return res.status(400).json({ error: 'roomType, totalRooms, maxGuests, pricePerNight are required' });
    }

    let agentId = hotelAgentId || null;
    if (req.user.role === 'hotel_agent') {
      agentId = await getHotelAgentIdForUser(req.user.id);
      if (!agentId) {
        console.error(`Hotel agent record not found for user_id: ${req.user.id}`);
        return res.status(400).json({ 
          error: 'Hotel agent profile not found. Please contact admin to set up your hotel agent profile.',
          details: 'No hotel_agents record exists for this user account'
        });
      }
    }

    if (!agentId) {
      return res.status(400).json({ error: 'hotelAgentId is required for admin/manager users' });
    }

    const result = await pool.query(
      `
      INSERT INTO hotel_rooms (hotel_agent_id, room_type, total_rooms, max_guests, price_per_night)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [agentId, roomType, totalRooms, maxGuests, pricePerNight]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Create hotel room error:', error);
    res.status(500).json({ error: 'Failed to create hotel room' });
  }
};

// @desc    Get rooms (by hotel agent)
// @route   GET /api/hotel-rooms
// @access  Private (Hotel Agent / Manager / Admin)
exports.getRooms = async (req, res) => {
  try {
    const { hotelAgentId } = req.query;
    let agentId = hotelAgentId || null;

    if (req.user.role === 'hotel_agent') {
      agentId = await getHotelAgentIdForUser(req.user.id);
      if (!agentId) {
        console.error(`Hotel agent record not found for user_id: ${req.user.id}`);
        return res.status(400).json({ 
          error: 'Hotel agent profile not found. Please contact admin to set up your hotel agent profile.',
          details: 'No hotel_agents record exists for this user account'
        });
      }
    }

    if (!agentId) {
      return res.status(400).json({ error: 'hotelAgentId is required for admin/manager users' });
    }

    const result = await pool.query(
      `SELECT * FROM hotel_rooms WHERE hotel_agent_id = $1 ORDER BY room_type`,
      [agentId]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get hotel rooms error:', error);
    res.status(500).json({ error: 'Failed to fetch hotel rooms' });
  }
};

// @desc    Update room details
// @route   PUT /api/hotel-rooms/:id
// @access  Private (Hotel Agent / Manager / Admin)
exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomType, totalRooms, maxGuests, pricePerNight } = req.body;

    if (req.user.role === 'hotel_agent') {
      const agentId = await getHotelAgentIdForUser(req.user.id);
      const ownsRoom = await pool.query(
        'SELECT id FROM hotel_rooms WHERE id = $1 AND hotel_agent_id = $2',
        [id, agentId]
      );
      if (!ownsRoom.rows.length) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const result = await pool.query(
      `
      UPDATE hotel_rooms
      SET
        room_type = COALESCE($1, room_type),
        total_rooms = COALESCE($2, total_rooms),
        max_guests = COALESCE($3, max_guests),
        price_per_night = COALESCE($4, price_per_night),
        updated_at = NOW()
      WHERE id = $5
      RETURNING *
      `,
      [roomType, totalRooms, maxGuests, pricePerNight, id]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update hotel room error:', error);
    res.status(500).json({ error: 'Failed to update hotel room' });
  }
};

// @desc    Upsert availability for a date or date range
// @route   POST /api/hotel-rooms/:id/availability
// @access  Private (Hotel Agent)
exports.upsertAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, from, to, availableRooms, status = 'available' } = req.body;

    if (availableRooms === undefined) {
      return res.status(400).json({ error: 'availableRooms is required' });
    }

    const agentId = await getHotelAgentIdForUser(req.user.id);
    const ownsRoom = await pool.query(
      'SELECT id FROM hotel_rooms WHERE id = $1 AND hotel_agent_id = $2',
      [id, agentId]
    );
    if (!ownsRoom.rows.length) {
      return res.status(403).json({ error: 'Access denied' });
    }

    let dates = [];
    if (date) {
      dates = [date];
    } else if (from && to) {
      dates = buildDateRange(from, to);
    } else {
      return res.status(400).json({ error: 'date or (from, to) is required' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const d of dates) {
        await client.query(
          `
          INSERT INTO hotel_room_availability (hotel_room_id, available_date, available_rooms, status)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (hotel_room_id, available_date)
          DO UPDATE SET available_rooms = EXCLUDED.available_rooms, status = EXCLUDED.status, updated_at = NOW()
          `,
          [id, d, availableRooms, status]
        );
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    res.json({ success: true, updatedDates: dates.length });
  } catch (error) {
    console.error('Upsert availability error:', error);
    res.status(500).json({ error: 'Failed to update availability' });
  }
};

// @desc    Get availability by date range
// @route   GET /api/hotel-rooms/:id/availability
// @access  Private (Hotel Agent / Manager / Admin)
exports.getAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: 'from and to are required' });
    }

    if (req.user.role === 'hotel_agent') {
      const agentId = await getHotelAgentIdForUser(req.user.id);
      const ownsRoom = await pool.query(
        'SELECT id FROM hotel_rooms WHERE id = $1 AND hotel_agent_id = $2',
        [id, agentId]
      );
      if (!ownsRoom.rows.length) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const result = await pool.query(
      `
      SELECT * FROM hotel_room_availability
      WHERE hotel_room_id = $1 AND available_date >= $2 AND available_date < $3
      ORDER BY available_date
      `,
      [id, from, to]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
};

// @desc    Check room availability for specific dates
// @route   POST /api/hotel-rooms/check-dates
// @access  Private (Hotel Agent)
exports.checkAvailabilityForDates = async (req, res) => {
  try {
    const { roomType, startDate, endDate, roomsNeeded } = req.body;
    const agentId = await getHotelAgentIdForUser(req.user.id);

    if (!agentId) {
      return res.status(400).json({ error: 'Hotel agent profile not found' });
    }

    if (!roomType || !startDate || !endDate || !roomsNeeded) {
      return res.status(400).json({ error: 'roomType, startDate, endDate, roomsNeeded are required' });
    }

    // Get room ID
    const roomResult = await pool.query(
      `SELECT id FROM hotel_rooms WHERE hotel_agent_id = $1 AND room_type = $2`,
      [agentId, roomType]
    );

    if (!roomResult.rows.length) {
      return res.status(404).json({ error: 'Room type not found' });
    }

    const roomId = roomResult.rows[0].id;

    // Build date range
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    while (current < end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    // Check availability for all dates
    const availabilityResult = await pool.query(
      `
      SELECT available_date, available_rooms, status
      FROM hotel_room_availability
      WHERE hotel_room_id = $1 AND available_date = ANY($2)
      ORDER BY available_date
      `,
      [roomId, dates]
    );

    const availabilityMap = new Map(
      availabilityResult.rows.map(row => [
        new Date(row.available_date).toISOString().split('T')[0],
        row
      ])
    );

    // Check if all dates have sufficient rooms
    let isAvailable = true;
    const details = [];
    const unavailableDates = [];

    for (const date of dates) {
      const availability = availabilityMap.get(date);
      if (!availability || availability.status !== 'available' || availability.available_rooms < roomsNeeded) {
        isAvailable = false;
        unavailableDates.push(date);
        details.push(`${date}: Only ${availability?.available_rooms || 0} room(s) available`);
      }
    }

    res.json({
      success: true,
      data: {
        isAvailable,
        roomType,
        roomsNeeded,
        dates: dates.length,
        unavailableDates,
        details: isAvailable ? [`All ${dates.length} nights available`] : details
      }
    });
  } catch (error) {
    console.error('Check availability for dates error:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
};