const pool = require('../config/db');

// Get available hotels (with optional filters)
exports.getAvailableHotels = async (req, res) => {
  try {
    const { hotel_stars, province } = req.query;
    
    let query = `
      SELECT 
        h.id,
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
        u.phone,
        u.email,
        h.created_at,
        h.updated_at
      FROM hotel_agents h
      INNER JOIN users u ON h.user_id = u.id
      WHERE u.is_active = true AND u.role = 'hotel_agent'
    `;
    
    const params = [];
    
    // Add filter for hotel stars
    if (hotel_stars) {
      params.push(parseInt(hotel_stars));
      query += ` AND h.rating >= $${params.length}`;
    }
    
    // Add filter for province
    if (province) {
      params.push(province.trim());
      query += ` AND h.province ILIKE $${params.length}`;
    }
    
    query += ` ORDER BY h.rating DESC, h.hotel_name ASC`;
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get available hotels error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch available hotels',
      details: error.message 
    });
  }
};

// Get rooms for a specific hotel with availability data
exports.getHotelRooms = async (req, res) => {
  try {
    const { id: hotelId } = req.params;
    const { startDate, endDate } = req.query;
    
    // Validate hotel exists
    const hotelResult = await pool.query(
      `SELECT id, hotel_name FROM hotel_agents WHERE id = $1`,
      [hotelId]
    );
    
    if (hotelResult.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    
    // Get all rooms for this hotel
    const roomsResult = await pool.query(
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
      ORDER BY room_type ASC`,
      [hotelId]
    );
    
    const rooms = roomsResult.rows;
    
    // If no rooms found, return empty data
    if (rooms.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    // If start date and end date are provided, get availability data
    if (startDate && endDate) {
      const roomsWithAvailability = rooms.map(room => {
        // Parse start and end dates properly
        const startParts = startDate.split('-');
        const endParts = endDate.split('-');
        const start = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]));
        const end = new Date(parseInt(endParts[0]), parseInt(endParts[1]) - 1, parseInt(endParts[2]));
        
        const allDates = [];
        
        // Generate all dates in the range with default availability
        let currentDate = new Date(start);
        while (currentDate <= end) {
          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, '0');
          const day = String(currentDate.getDate()).padStart(2, '0');
          const dateStr = `${year}-${month}-${day}`;
          
          // Default: all rooms available
          allDates.push({
            id: null,
            hotel_room_id: room.id,
            available_date: dateStr,
            available_rooms: room.total_rooms,
            rooms_booked: 0,
            status: 'available'
          });
          
          // Move to next day
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return {
          ...room,
          availability: allDates
        };
      });
      
      return res.json({
        success: true,
        data: roomsWithAvailability
      });
    }
    
    // Return rooms without availability data
    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    console.error('Get hotel rooms error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch hotel rooms',
      details: error.message 
    });
  }
};

// Get single hotel details
exports.getHotelDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT 
        h.id,
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
        u.phone,
        u.email,
        u.is_active,
        h.created_at,
        h.updated_at
      FROM hotel_agents h
      INNER JOIN users u ON h.user_id = u.id
      WHERE h.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get hotel details error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch hotel details',
      details: error.message 
    });
  }
};
