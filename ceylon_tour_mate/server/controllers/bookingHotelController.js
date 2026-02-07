const pool = require('../config/db');

const getHotelAgentIdForUser = async (userId) => {
  const result = await pool.query('SELECT id FROM hotel_agents WHERE user_id = $1', [userId]);
  if (!result.rows[0]?.id) {
    console.error(`No hotel_agents record found for user_id: ${userId}`);
  }
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

// Helper to send notification
const sendNotification = async (userId, type, message, relatedId) => {
  try {
    // This would integrate with your notification system
    console.log(`Notification to user ${userId}: ${message}`);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// @desc    Check hotel availability and create request
// @route   POST /api/booking-hotels/check-availability
// @access  Private (Manager/Admin)
exports.checkAvailability = async (req, res) => {
  const client = await pool.connect();
  try {
    const { bookingId, hotelAgentId, roomType, roomsRequired, checkIn, checkOut } = req.body;

    if (!bookingId || !hotelAgentId || !roomType || !roomsRequired || !checkIn || !checkOut) {
      return res.status(400).json({ 
        error: 'Missing required fields: bookingId, hotelAgentId, roomType, roomsRequired, checkIn, checkOut' 
      });
    }

    await client.query('BEGIN');

    // Verify booking exists and belongs to manager
    const bookingCheck = await client.query(
      'SELECT id, package_id, arrival_date, travel_days FROM booking_form WHERE id = $1',
      [bookingId]
    );

    if (!bookingCheck.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Verify hotel agent exists
    const hotelCheck = await client.query(
      'SELECT id, hotel_name FROM hotel_agents WHERE id = $1',
      [hotelAgentId]
    );

    if (!hotelCheck.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Hotel agent not found' });
    }

    // Create availability request
    const result = await client.query(
      `
      INSERT INTO booking_hotels (
        booking_id, hotel_agent_id, room_type, rooms_required, check_in, check_out,
        availability_status, manager_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'pending', 'pending')
      RETURNING *
      `,
      [bookingId, hotelAgentId, roomType, roomsRequired, checkIn, checkOut]
    );

    // Update booking status
    await client.query(
      `UPDATE booking_form SET status = 'pending_hotel', updated_at = NOW() WHERE id = $1`,
      [bookingId]
    );

    // Get hotel agent user to send notification
    const hotelAgentUser = await client.query(
      'SELECT user_id FROM hotel_agents WHERE id = $1',
      [hotelAgentId]
    );

    await client.query('COMMIT');

    // Send notification to hotel agent
    if (hotelAgentUser.rows.length) {
      await sendNotification(
        hotelAgentUser.rows[0].user_id,
        'hotel_availability_request',
        `New availability request for ${hotelCheck.rows[0].hotel_name}`,
        result.rows[0].id
      );
    }

    res.status(201).json({ 
      success: true, 
      message: 'Availability request sent to hotel agent',
      data: result.rows[0] 
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Check availability error:', error);
    res.status(500).json({ error: 'Failed to check hotel availability' });
  } finally {
    client.release();
  }
};

// @desc    Create booking-hotel request (manager)
// @route   POST /api/booking-hotels
// @access  Private (Manager/Admin)
exports.createBookingHotel = async (req, res) => {
  try {
    const { bookingId, hotelAgentId, roomType, roomsRequired, checkIn, checkOut } = req.body;

    if (!bookingId || !hotelAgentId || !roomType || !roomsRequired || !checkIn || !checkOut) {
      return res.status(400).json({ error: 'bookingId, hotelAgentId, roomType, roomsRequired, checkIn, checkOut are required' });
    }

    const result = await pool.query(
      `
      INSERT INTO booking_hotels (
        booking_id, hotel_agent_id, room_type, rooms_required, check_in, check_out,
        availability_status, manager_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'pending', 'pending')
      RETURNING *
      `,
      [bookingId, hotelAgentId, roomType, roomsRequired, checkIn, checkOut]
    );

    await pool.query(
      `UPDATE booking_form SET status = 'pending_hotel', updated_at = NOW() WHERE id = $1`,
      [bookingId]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Create booking hotel error:', error);
    res.status(500).json({ error: 'Failed to create booking hotel request' });
  }
};

// @desc    List booking-hotel requests
// @route   GET /api/booking-hotels
// @access  Private (Hotel Agent / Manager / Admin)
exports.getBookingHotels = async (req, res) => {
  try {
    const { status, hotelAgentId, bookingId } = req.query;
    const values = [];
    let whereClause = 'WHERE 1=1';

    if (req.user.role === 'hotel_agent') {
      const agentId = await getHotelAgentIdForUser(req.user.id);
      values.push(agentId);
      whereClause += ` AND hotel_agent_id = $${values.length}`;
    } else if (hotelAgentId) {
      values.push(hotelAgentId);
      whereClause += ` AND hotel_agent_id = $${values.length}`;
    }

    if (bookingId) {
      values.push(bookingId);
      whereClause += ` AND booking_id = $${values.length}`;
    }

    if (status) {
      values.push(status);
      whereClause += ` AND availability_status = $${values.length}`;
    }

    const result = await pool.query(
      `SELECT * FROM booking_hotels ${whereClause} ORDER BY created_at DESC`,
      values
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get booking hotels error:', error);
    res.status(500).json({ error: 'Failed to fetch booking hotel requests' });
  }
};

// @desc    Get availability requests for hotel agent
// @route   GET /api/booking-hotels/agent-requests
// @access  Private (Hotel Agent)
exports.getAgentRequests = async (req, res) => {
  try {
    const agentId = await getHotelAgentIdForUser(req.user.id);

    if (!agentId) {
      return res.status(400).json({ error: 'Hotel agent profile not found' });
    }

    const result = await pool.query(
      `
      SELECT 
        bh.*,
        b.fullname,
        b.email,
        b.package_id,
        p.package_name
      FROM booking_hotels bh
      JOIN booking_form b ON bh.booking_id = b.id
      LEFT JOIN packages p ON b.package_id = p.id
      WHERE bh.hotel_agent_id = $1
      ORDER BY bh.created_at DESC
      `,
      [agentId]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get agent requests error:', error);
    res.status(500).json({ error: 'Failed to fetch agent requests' });
  }
};

// @desc    Hotel agent responds with availability
// @route   PATCH /api/booking-hotels/:id/respond-availability
// @access  Private (Hotel Agent)
exports.respondAvailability = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { isAvailable, notes } = req.body;

    if (isAvailable === null || isAvailable === undefined) {
      return res.status(400).json({ error: 'isAvailable is required' });
    }

    const agentId = await getHotelAgentIdForUser(req.user.id);

    if (!agentId) {
      return res.status(400).json({ error: 'Hotel agent profile not found' });
    }

    // Get the booking hotel request
    const bookingResult = await client.query(
      `SELECT * FROM booking_hotels WHERE id = $1 AND hotel_agent_id = $2`,
      [id, agentId]
    );

    if (!bookingResult.rows.length) {
      return res.status(404).json({ error: 'Booking hotel request not found' });
    }

    const bookingHotel = bookingResult.rows[0];

    await client.query('BEGIN');

    const availabilityStatus = isAvailable ? 'available' : 'unavailable';

    if (isAvailable) {
      // Check and update room availability
      const roomResult = await client.query(
        `SELECT id FROM hotel_rooms WHERE hotel_agent_id = $1 AND room_type = $2`,
        [agentId, bookingHotel.room_type]
      );

      if (!roomResult.rows.length) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Room type not found for this hotel' });
      }

      const hotelRoomId = roomResult.rows[0].id;
      const dates = buildDateRange(bookingHotel.check_in, bookingHotel.check_out);

      // Check availability for all dates
      const availabilityRows = await client.query(
        `
        SELECT available_date, available_rooms, status
        FROM hotel_room_availability
        WHERE hotel_room_id = $1 AND available_date = ANY($2)
        `,
        [hotelRoomId, dates]
      );

      const availabilityMap = new Map(
        availabilityRows.rows.map((row) => [
          new Date(row.available_date).toISOString().split('T')[0],
          row
        ])
      );

      // Verify all dates have sufficient rooms
      for (const d of dates) {
        const row = availabilityMap.get(d);
        if (!row || row.status !== 'available' || row.available_rooms < bookingHotel.rooms_required) {
          await client.query('ROLLBACK');
          return res.status(409).json({ 
            error: 'Not enough rooms available for all selected dates',
            unavailableDate: d
          });
        }
      }

      // Reserve rooms for all dates
      for (const d of dates) {
        await client.query(
          `
          UPDATE hotel_room_availability
          SET available_rooms = available_rooms - $1,
              status = CASE WHEN available_rooms - $1 <= 0 THEN 'fully_booked' ELSE status END,
              updated_at = NOW()
          WHERE hotel_room_id = $2 AND available_date = $3
          `,
          [bookingHotel.rooms_required, hotelRoomId, d]
        );
      }
    }

    // Update booking hotel status
    const updated = await client.query(
      `
      UPDATE booking_hotels
      SET availability_status = $1, notes = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
      `,
      [availabilityStatus, notes || null, id]
    );

    // Get booking info for notification
    const bookingInfo = await client.query(
      `
      SELECT b.user_id, b.fullname, ha.user_id as hotel_agent_user_id
      FROM booking_form b
      LEFT JOIN hotel_agents ha ON ha.id = $1
      WHERE b.id = $2
      `,
      [agentId, bookingHotel.booking_id]
    );

    await client.query('COMMIT');

    // Send notifications
    if (bookingInfo.rows.length && bookingInfo.rows[0].user_id) {
      const message = isAvailable 
        ? `Your requested hotel rooms are available for your booking`
        : `Unfortunately, requested hotel rooms are not available. Please check alternative dates.`;
      
      await sendNotification(
        bookingInfo.rows[0].user_id,
        'hotel_availability_response',
        message,
        id
      );
    }

    res.json({ 
      success: true, 
      message: isAvailable ? 'Availability confirmed' : 'Unavailability noted',
      data: updated.rows[0] 
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Respond availability error:', error);
    res.status(500).json({ error: 'Failed to respond to availability request' });
  } finally {
    client.release();
  }
};

// @desc    Hotel agent responds availability (old endpoint - compatibility)
// @route   PATCH /api/booking-hotels/:id/availability
// @access  Private (Hotel Agent)
exports.updateAvailabilityStatus = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { availabilityStatus } = req.body;

    if (!availabilityStatus) {
      return res.status(400).json({ error: 'availabilityStatus is required' });
    }

    const agentId = await getHotelAgentIdForUser(req.user.id);

    const bookingResult = await client.query(
      `SELECT * FROM booking_hotels WHERE id = $1 AND hotel_agent_id = $2`,
      [id, agentId]
    );

    if (!bookingResult.rows.length) {
      return res.status(404).json({ error: 'Booking hotel request not found' });
    }

    const bookingHotel = bookingResult.rows[0];

    await client.query('BEGIN');

    if (availabilityStatus === 'available') {
      const roomResult = await client.query(
        `SELECT id FROM hotel_rooms WHERE hotel_agent_id = $1 AND room_type = $2`,
        [agentId, bookingHotel.room_type]
      );

      if (!roomResult.rows.length) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Room type not found for this hotel' });
      }

      const hotelRoomId = roomResult.rows[0].id;
      const dates = buildDateRange(bookingHotel.check_in, bookingHotel.check_out);

      const availabilityRows = await client.query(
        `
        SELECT available_date, available_rooms, status
        FROM hotel_room_availability
        WHERE hotel_room_id = $1 AND available_date = ANY($2)
        `,
        [hotelRoomId, dates]
      );

      const availabilityMap = new Map(
        availabilityRows.rows.map((row) => [
          new Date(row.available_date).toISOString().split('T')[0],
          row
        ])
      );

      for (const d of dates) {
        const row = availabilityMap.get(d);
        if (!row || row.status !== 'available' || row.available_rooms < bookingHotel.rooms_required) {
          await client.query('ROLLBACK');
          return res.status(409).json({ error: 'Not enough rooms available for selected dates' });
        }
      }

      for (const d of dates) {
        await client.query(
          `
          UPDATE hotel_room_availability
          SET available_rooms = available_rooms - $1,
              status = CASE WHEN available_rooms - $1 <= 0 THEN 'fully_booked' ELSE status END,
              updated_at = NOW()
          WHERE hotel_room_id = $2 AND available_date = $3
          `,
          [bookingHotel.rooms_required, hotelRoomId, d]
        );
      }
    }

    const updated = await client.query(
      `
      UPDATE booking_hotels
      SET availability_status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [availabilityStatus, id]
    );

    await client.query('COMMIT');

    res.json({ success: true, data: updated.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update availability status error:', error);
    res.status(500).json({ error: 'Failed to update availability status' });
  } finally {
    client.release();
  }
};

// @desc    Manager confirms or rejects booking after hotel availability
// @route   PATCH /api/booking-hotels/:id/confirm
// @access  Private (Manager/Admin)
exports.confirmBookingHotel = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { status } = req.body; // confirmed | rejected

    if (!status || !['confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'status must be confirmed or rejected' });
    }

    const bookingResult = await client.query('SELECT * FROM booking_hotels WHERE id = $1', [id]);
    if (!bookingResult.rows.length) {
      return res.status(404).json({ error: 'Booking hotel request not found' });
    }

    const bookingHotel = bookingResult.rows[0];

    await client.query('BEGIN');

    if (status === 'confirmed') {
      if (bookingHotel.availability_status !== 'available') {
        await client.query('ROLLBACK');
        return res.status(409).json({ error: 'Hotel availability is not approved yet' });
      }

      await client.query(
        `UPDATE booking_form SET status = 'confirmed', updated_at = NOW() WHERE id = $1`,
        [bookingHotel.booking_id]
      );
    }

    if (status === 'rejected' && bookingHotel.availability_status === 'available') {
      const roomResult = await client.query(
        `SELECT id FROM hotel_rooms WHERE hotel_agent_id = $1 AND room_type = $2`,
        [bookingHotel.hotel_agent_id, bookingHotel.room_type]
      );

      if (roomResult.rows.length) {
        const hotelRoomId = roomResult.rows[0].id;
        const dates = buildDateRange(bookingHotel.check_in, bookingHotel.check_out);
        for (const d of dates) {
          await client.query(
            `
            UPDATE hotel_room_availability
            SET available_rooms = available_rooms + $1,
                status = 'available',
                updated_at = NOW()
            WHERE hotel_room_id = $2 AND available_date = $3
            `,
            [bookingHotel.rooms_required, hotelRoomId, d]
          );
        }
      }

      await client.query(
        `UPDATE booking_form SET status = 'rejected', updated_at = NOW() WHERE id = $1`,
        [bookingHotel.booking_id]
      );
    }

    const updated = await client.query(
      `UPDATE booking_hotels SET manager_status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );

    await client.query('COMMIT');
    res.json({ success: true, data: updated.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Confirm booking hotel error:', error);
    res.status(500).json({ error: 'Failed to confirm booking hotel' });
  } finally {
    client.release();
  }
};