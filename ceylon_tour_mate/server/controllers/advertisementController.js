const pool = require('../config/db');
const path = require('path');
const fs = require('fs');

// Get all advertisements (for admin)
exports.getAllAdvertisements = async (req, res) => {
  try {
    const query = `
      SELECT 
        a.*,
        u.first_name || ' ' || u.last_name as created_by_name
      FROM advertisements a
      LEFT JOIN users u ON a.created_by = u.id
      ORDER BY a.display_order ASC, a.created_at DESC
    `;

    const result = await pool.query(query);

    const advertisements = result.rows.map(ad => ({
      id: ad.id,
      title: ad.title,
      description: ad.description,
      imageUrl: ad.image_url,
      linkUrl: ad.link_url,
      linkText: ad.link_text,
      startDate: ad.start_date,
      endDate: ad.end_date,
      isActive: ad.is_active,
      displayOrder: ad.display_order,
      viewCount: ad.view_count,
      clickCount: ad.click_count,
      createdBy: ad.created_by,
      createdByName: ad.created_by_name,
      createdAt: ad.created_at,
      updatedAt: ad.updated_at
    }));

    res.json(advertisements);
  } catch (error) {
    console.error('Get all advertisements error:', error);
    res.status(500).json({ error: 'Failed to fetch advertisements' });
  }
};

// Get active advertisements (for public/homepage)
exports.getActiveAdvertisements = async (req, res) => {
  try {
    const query = `
      SELECT 
        id, title, description, image_url, link_url, link_text,
        start_date, end_date, display_order
      FROM advertisements
      WHERE is_active = true
        AND start_date <= CURRENT_DATE
        AND end_date >= CURRENT_DATE
      ORDER BY display_order ASC, created_at DESC
    `;

    const result = await pool.query(query);

    const advertisements = result.rows.map(ad => ({
      id: ad.id,
      title: ad.title,
      description: ad.description,
      imageUrl: ad.image_url,
      linkUrl: ad.link_url,
      linkText: ad.link_text,
      startDate: ad.start_date,
      endDate: ad.end_date,
      displayOrder: ad.display_order
    }));

    res.json(advertisements);
  } catch (error) {
    console.error('Get active advertisements error:', error);
    res.status(500).json({ error: 'Failed to fetch active advertisements' });
  }
};

// Get single advertisement
exports.getAdvertisementById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        a.*,
        u.first_name || ' ' || u.last_name as created_by_name
      FROM advertisements a
      LEFT JOIN users u ON a.created_by = u.id
      WHERE a.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }

    const ad = result.rows[0];
    res.json({
      id: ad.id,
      title: ad.title,
      description: ad.description,
      imageUrl: ad.image_url,
      linkUrl: ad.link_url,
      linkText: ad.link_text,
      startDate: ad.start_date,
      endDate: ad.end_date,
      isActive: ad.is_active,
      displayOrder: ad.display_order,
      viewCount: ad.view_count,
      clickCount: ad.click_count,
      createdBy: ad.created_by,
      createdByName: ad.created_by_name,
      createdAt: ad.created_at,
      updatedAt: ad.updated_at
    });
  } catch (error) {
    console.error('Get advertisement error:', error);
    res.status(500).json({ error: 'Failed to fetch advertisement' });
  }
};

// Create advertisement
exports.createAdvertisement = async (req, res) => {
  try {
    const {
      title,
      description,
      linkUrl,
      linkText,
      startDate,
      endDate,
      displayOrder
    } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({ error: 'Title, start date, and end date are required' });
    }

    // Check date validity
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    const imageUrl = req.file ? `/uploads/advertisements/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO advertisements (
        title, description, image_url, link_url, link_text,
        start_date, end_date, display_order, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        title,
        description || null,
        imageUrl,
        linkUrl || null,
        linkText || null,
        startDate,
        endDate,
        displayOrder || 0,
        req.user.id
      ]
    );

    res.status(201).json({
      message: 'Advertisement created successfully',
      advertisement: {
        id: result.rows[0].id,
        title: result.rows[0].title,
        description: result.rows[0].description,
        imageUrl: result.rows[0].image_url,
        linkUrl: result.rows[0].link_url,
        linkText: result.rows[0].link_text,
        startDate: result.rows[0].start_date,
        endDate: result.rows[0].end_date,
        displayOrder: result.rows[0].display_order
      }
    });
  } catch (error) {
    console.error('Create advertisement error:', error);
    
    // Delete uploaded file if database insert fails
    if (req.file) {
      const filePath = req.file.path;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({ error: 'Failed to create advertisement' });
  }
};

// Update advertisement
exports.updateAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      linkUrl,
      linkText,
      startDate,
      endDate,
      displayOrder
    } = req.body;

    // Get current advertisement
    const current = await pool.query('SELECT * FROM advertisements WHERE id = $1', [id]);
    
    if (current.rows.length === 0) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }

    // Check date validity
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    let imageUrl = current.rows[0].image_url;

    // If new image uploaded, delete old one and use new
    if (req.file) {
      // Delete old image
      if (imageUrl) {
        const oldImagePath = path.join(__dirname, '..', imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imageUrl = `/uploads/advertisements/${req.file.filename}`;
    }

    const result = await pool.query(
      `UPDATE advertisements SET
        title = $1,
        description = $2,
        image_url = $3,
        link_url = $4,
        link_text = $5,
        start_date = $6,
        end_date = $7,
        display_order = $8,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *`,
      [
        title,
        description || null,
        imageUrl,
        linkUrl || null,
        linkText || null,
        startDate,
        endDate,
        displayOrder || 0,
        id
      ]
    );

    res.json({
      message: 'Advertisement updated successfully',
      advertisement: {
        id: result.rows[0].id,
        title: result.rows[0].title,
        description: result.rows[0].description,
        imageUrl: result.rows[0].image_url,
        linkUrl: result.rows[0].link_url,
        linkText: result.rows[0].link_text,
        startDate: result.rows[0].start_date,
        endDate: result.rows[0].end_date,
        displayOrder: result.rows[0].display_order
      }
    });
  } catch (error) {
    console.error('Update advertisement error:', error);
    res.status(500).json({ error: 'Failed to update advertisement' });
  }
};

// Delete advertisement
exports.deleteAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;

    // Get advertisement to delete image
    const result = await pool.query('SELECT image_url FROM advertisements WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }

    const imageUrl = result.rows[0].image_url;

    // Delete from database
    await pool.query('DELETE FROM advertisements WHERE id = $1', [id]);

    // Delete image file
    if (imageUrl) {
      const imagePath = path.join(__dirname, '..', imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: 'Advertisement deleted successfully' });
  } catch (error) {
    console.error('Delete advertisement error:', error);
    res.status(500).json({ error: 'Failed to delete advertisement' });
  }
};

// Toggle advertisement status
exports.toggleAdvertisementStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE advertisements 
       SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING is_active`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }

    res.json({
      message: 'Advertisement status updated successfully',
      isActive: result.rows[0].is_active
    });
  } catch (error) {
    console.error('Toggle advertisement status error:', error);
    res.status(500).json({ error: 'Failed to update advertisement status' });
  }
};

// Increment view count (when ad is viewed on homepage)
exports.incrementViewCount = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'UPDATE advertisements SET view_count = view_count + 1 WHERE id = $1',
      [id]
    );

    res.json({ message: 'View count incremented' });
  } catch (error) {
    console.error('Increment view count error:', error);
    res.status(500).json({ error: 'Failed to increment view count' });
  }
};

// Increment click count (when ad link is clicked)
exports.incrementClickCount = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'UPDATE advertisements SET click_count = click_count + 1 WHERE id = $1',
      [id]
    );

    res.json({ message: 'Click count incremented' });
  } catch (error) {
    console.error('Increment click count error:', error);
    res.status(500).json({ error: 'Failed to increment click count' });
  }
};