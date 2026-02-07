const pool = require('../config/db');

// Get all feedbacks (for admin) with filters
exports.getAllFeedbacks = async (req, res) => {
  try {
    const { 
      rating, 
      feedbackType, 
      search, 
      startDate, 
      endDate,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      page = 1,
      limit = 10
    } = req.query;

    let query = 'SELECT * FROM tour_feedback WHERE 1=1';
    const params = [];
    let paramCount = 0;

    // Filter by rating
    if (rating) {
      paramCount++;
      query += ` AND rating = $${paramCount}`;
      params.push(parseInt(rating));
    }

    // Filter by feedback type
    if (feedbackType && feedbackType !== 'all') {
      paramCount++;
      query += ` AND feedback_type = $${paramCount}`;
      params.push(feedbackType);
    }

    // Search by customer name or feedback text
    if (search) {
      paramCount++;
      query += ` AND (customer_name ILIKE $${paramCount} OR feedback_text ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    // Filter by date range
    if (startDate) {
      paramCount++;
      query += ` AND created_at >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      query += ` AND created_at <= $${paramCount}`;
      params.push(endDate);
    }

    // Add sorting
    const validSortColumns = ['created_at', 'rating', 'tour_id'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortColumn} ${order}`;

    // Add pagination
    const offset = (page - 1) * limit;
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(parseInt(limit));
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    // Get feedbacks
    const result = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM tour_feedback WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;

    if (rating) {
      countParamCount++;
      countQuery += ` AND rating = $${countParamCount}`;
      countParams.push(parseInt(rating));
    }

    if (feedbackType && feedbackType !== 'all') {
      countParamCount++;
      countQuery += ` AND feedback_type = $${countParamCount}`;
      countParams.push(feedbackType);
    }

    if (search) {
      countParamCount++;
      countQuery += ` AND (customer_name ILIKE $${countParamCount} OR feedback_text ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    if (startDate) {
      countParamCount++;
      countQuery += ` AND created_at >= $${countParamCount}`;
      countParams.push(startDate);
    }

    if (endDate) {
      countParamCount++;
      countQuery += ` AND created_at <= $${countParamCount}`;
      countParams.push(endDate);
    }

    const countResult = await pool.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      feedbacks: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount: totalCount,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all feedbacks error:', error);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
};

// Get feedback statistics
exports.getFeedbackStats = async (req, res) => {
  try {
    // Overall stats
    const statsQuery = `
      SELECT 
        COUNT(*) as total_feedbacks,
        AVG(rating)::numeric(10,2) as average_rating,
        COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_feedbacks,
        COUNT(CASE WHEN rating <= 2 THEN 1 END) as negative_feedbacks
      FROM tour_feedback
    `;
    const statsResult = await pool.query(statsQuery);

    // Rating distribution
    const ratingDistQuery = `
      SELECT 
        rating,
        COUNT(*) as count
      FROM tour_feedback
      GROUP BY rating
      ORDER BY rating DESC
    `;
    const ratingDistResult = await pool.query(ratingDistQuery);

    // Feedback type distribution
    const typeDistQuery = `
      SELECT 
        feedback_type,
        COUNT(*) as count,
        AVG(rating)::numeric(10,2) as avg_rating
      FROM tour_feedback
      GROUP BY feedback_type
      ORDER BY count DESC
    `;
    const typeDistResult = await pool.query(typeDistQuery);

    // Recent trends (last 30 days)
    const trendsQuery = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count,
        AVG(rating)::numeric(10,2) as avg_rating
      FROM tour_feedback
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;
    const trendsResult = await pool.query(trendsQuery);

    res.json({
      overall: statsResult.rows[0],
      ratingDistribution: ratingDistResult.rows,
      typeDistribution: typeDistResult.rows,
      recentTrends: trendsResult.rows
    });
  } catch (error) {
    console.error('Get feedback stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

// Get single feedback
exports.getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM tour_feedback WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};

// Create feedback (from customer form)
exports.createFeedback = async (req, res) => {
  try {
    const {
      tourId,
      customerName,
      rating,
      feedbackType,
      feedbackText
    } = req.body;

    // Validation
    if (!tourId || !rating || !feedbackType || !feedbackText) {
      return res.status(400).json({ 
        error: 'Tour ID, rating, feedback type, and feedback text are required' 
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const result = await pool.query(
      `INSERT INTO tour_feedback (
        tour_id, customer_name, rating, feedback_type, feedback_text
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [tourId, customerName || 'Anonymous', rating, feedbackType, feedbackText]
    );

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: result.rows[0]
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

// Delete feedback (admin only)
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM tour_feedback WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
};

// Get feedbacks by tour ID
exports.getFeedbacksByTour = async (req, res) => {
  try {
    const { tourId } = req.params;

    const result = await pool.query(
      'SELECT * FROM tour_feedback WHERE tour_id = $1 ORDER BY created_at DESC',
      [tourId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get tour feedbacks error:', error);
    res.status(500).json({ error: 'Failed to fetch tour feedbacks' });
  }
};


