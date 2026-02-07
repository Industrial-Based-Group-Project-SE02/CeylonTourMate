const pool = require('../config/db');

class Package {
  // Get all packages with filters
  static async getAll(filters = {}) {
    const {
      search = '',
      status = '',
      type = '',
      page = 1,
      limit = 10
    } = filters;

    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        p.*,
        u.email as creator_email,
        u.first_name as creator_first_name,
        u.last_name as creator_last_name
      FROM packages p
      INNER JOIN users u ON p.created_by = u.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (search) {
      query += ` AND (p.name ILIKE $${paramCount} OR p.code ILIKE $${paramCount})`;
      values.push(`%${search}%`);
      paramCount++;
    }

    if (status) {
      query += ` AND p.status = $${paramCount}`;
      values.push(status);
      paramCount++;
    }

    if (type) {
      query += ` AND p.type = $${paramCount}`;
      values.push(type);
      paramCount++;
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching packages: ${error.message}`);
    }
  }

  // Get package by ID with all details
  static async getById(id) {
    try {
      // Get package basic info
      const packageQuery = `
        SELECT 
          p.*,
          u.email as creator_email,
          u.first_name as creator_first_name,
          u.last_name as creator_last_name
        FROM packages p
        INNER JOIN users u ON p.created_by = u.id
        WHERE p.id = $1
      `;
      const packageResult = await pool.query(packageQuery, [id]);
      
      if (packageResult.rows.length === 0) {
        return null;
      }

      const packageData = packageResult.rows[0];

      // Get all related data
      const [
        itineraryResult,
        featuresResult,
        bestForResult,
        inclusionsResult,
        exclusionsResult,
        hotelsResult,
        destinationsResult
      ] = await Promise.all([
        pool.query('SELECT * FROM package_itinerary WHERE package_id = $1 ORDER BY day_number', [id]),
        pool.query('SELECT feature FROM package_features WHERE package_id = $1', [id]),
        pool.query('SELECT audience FROM package_best_for WHERE package_id = $1', [id]),
        pool.query('SELECT inclusion FROM package_inclusions WHERE package_id = $1 ORDER BY display_order', [id]),
        pool.query('SELECT exclusion FROM package_exclusions WHERE package_id = $1 ORDER BY display_order', [id]),
        pool.query(`
          SELECT 
            ph.*,
            (
              SELECT array_agg(feature)
              FROM package_hotel_features phf
              WHERE phf.hotel_id = ph.id
            ) as features
          FROM package_hotels ph
          WHERE ph.package_id = $1
          ORDER BY ph.display_order
        `, [id]),
        pool.query(`
          SELECT 
            pd.*,
            (
              SELECT array_agg(highlight)
              FROM package_destination_highlights pdh
              WHERE pdh.destination_id = pd.id
            ) as highlights
          FROM package_destinations pd
          WHERE pd.package_id = $1
          ORDER BY pd.display_order
        `, [id])
      ]);

      return {
        ...packageData,
        itinerary: itineraryResult.rows,
        features: featuresResult.rows.map(row => row.feature),
        bestFor: bestForResult.rows.map(row => row.audience),
        inclusions: inclusionsResult.rows.map(row => row.inclusion),
        exclusions: exclusionsResult.rows.map(row => row.exclusion),
        hotels: hotelsResult.rows,
        destinations: destinationsResult.rows,
      };
    } catch (error) {
      throw new Error(`Error fetching package details: ${error.message}`);
    }
  }

  // Create new package
  static async create(packageData, userId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Generate package code
      const codeCount = await client.query(
        `SELECT COUNT(*) FROM packages WHERE type = $1`,
        [packageData.type]
      );
      const count = parseInt(codeCount.rows[0].count) + 1;
      const code = `SL-${packageData.type.toUpperCase()}-${String(count).padStart(3, '0')}`;

      // Insert package
      const packageQuery = `
        INSERT INTO packages (
          name, code, type, season,
          base_price, min_price, max_price,
          duration_days, min_travelers, max_travelers,
          description, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `;
      
      const packageValues = [
        packageData.name,
        code,
        packageData.type,
        packageData.season,
        packageData.basePrice,
        packageData.minPrice,
        packageData.maxPrice,
        packageData.durationDays,
        packageData.minTravelers,
        packageData.maxTravelers,
        packageData.description,
        userId
      ];

      const packageResult = await client.query(packageQuery, packageValues);
      const newPackage = packageResult.rows[0];
      const packageId = newPackage.id;

      // Insert related data
      const insertPromises = [];

      // Insert features
      if (packageData.features && packageData.features.length > 0) {
        for (const feature of packageData.features) {
          insertPromises.push(
            client.query(
              'INSERT INTO package_features (package_id, feature) VALUES ($1, $2)',
              [packageId, feature]
            )
          );
        }
      }

      // Insert best for
      if (packageData.bestFor && packageData.bestFor.length > 0) {
        for (const audience of packageData.bestFor) {
          insertPromises.push(
            client.query(
              'INSERT INTO package_best_for (package_id, audience) VALUES ($1, $2)',
              [packageId, audience]
            )
          );
        }
      }

      // Insert inclusions
      if (packageData.inclusions && packageData.inclusions.length > 0) {
        for (let i = 0; i < packageData.inclusions.length; i++) {
          insertPromises.push(
            client.query(
              'INSERT INTO package_inclusions (package_id, inclusion, display_order) VALUES ($1, $2, $3)',
              [packageId, packageData.inclusions[i], i]
            )
          );
        }
      }

      // Insert exclusions
      if (packageData.exclusions && packageData.exclusions.length > 0) {
        for (let i = 0; i < packageData.exclusions.length; i++) {
          insertPromises.push(
            client.query(
              'INSERT INTO package_exclusions (package_id, exclusion, display_order) VALUES ($1, $2, $3)',
              [packageId, packageData.exclusions[i], i]
            )
          );
        }
      }

      // Insert itinerary
      if (packageData.itinerary && packageData.itinerary.length > 0) {
        for (const day of packageData.itinerary) {
          insertPromises.push(
            client.query(
              'INSERT INTO package_itinerary (package_id, day_number, title, description) VALUES ($1, $2, $3, $4)',
              [packageId, day.day, day.title, day.description]
            )
          );
        }
      }

      // Insert hotels
      if (packageData.hotels && packageData.hotels.length > 0) {
        for (let i = 0; i < packageData.hotels.length; i++) {
          const hotel = packageData.hotels[i];
          const hotelResult = await client.query(
            'INSERT INTO package_hotels (package_id, hotel_name, rating, nights, display_order) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [packageId, hotel.name, hotel.rating, hotel.nights, i]
          );
          
          const hotelId = hotelResult.rows[0].id;
          
          // Insert hotel features
          if (hotel.features && hotel.features.length > 0) {
            for (const feature of hotel.features) {
              insertPromises.push(
                client.query(
                  'INSERT INTO package_hotel_features (hotel_id, feature) VALUES ($1, $2)',
                  [hotelId, feature]
                )
              );
            }
          }
        }
      }

      // Insert destinations
      if (packageData.destinations && packageData.destinations.length > 0) {
        for (let i = 0; i < packageData.destinations.length; i++) {
          const destination = packageData.destinations[i];
          const destinationResult = await client.query(
            'INSERT INTO package_destinations (package_id, destination_name, destination_type, display_order) VALUES ($1, $2, $3, $4) RETURNING id',
            [packageId, destination.name, destination.type, i]
          );
          
          const destinationId = destinationResult.rows[0].id;
          
          // Insert destination highlights
          if (destination.highlights && destination.highlights.length > 0) {
            for (const highlight of destination.highlights) {
              insertPromises.push(
                client.query(
                  'INSERT INTO package_destination_highlights (destination_id, highlight) VALUES ($1, $2)',
                  [destinationId, highlight]
                )
              );
            }
          }
        }
      }

      // Execute all insert promises
      await Promise.all(insertPromises);
      await client.query('COMMIT');
      
      return await this.getById(packageId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Error creating package: ${error.message}`);
    } finally {
      client.release();
    }
  }

  // UPDATE PACKAGE - Added this method
  static async update(id, packageData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Update basic package info
      const updateQuery = `
        UPDATE packages SET 
          name = $1, type = $2, season = $3, 
          base_price = $4, min_price = $5, max_price = $6,
          duration_days = $7, min_travelers = $8, max_travelers = $9,
          description = $10, status = $11, updated_at = CURRENT_TIMESTAMP
        WHERE id = $12
        RETURNING *
      `;
      const values = [
        packageData.name, 
        packageData.type, 
        packageData.season,
        packageData.base_price || packageData.basePrice, 
        packageData.min_price || packageData.minPrice || packageData.base_price || packageData.basePrice, 
        packageData.max_price || packageData.maxPrice || packageData.base_price || packageData.basePrice,
        packageData.duration_days || packageData.durationDays, 
        packageData.min_travelers || packageData.minTravelers || 2, 
        packageData.max_travelers || packageData.maxTravelers || 10,
        packageData.description, 
        packageData.status, 
        id
      ];
      
      await client.query(updateQuery, values);

      // 2. Update features
      await client.query('DELETE FROM package_features WHERE package_id = $1', [id]);
      if (packageData.features && packageData.features.length > 0) {
        for (const feature of packageData.features) {
          await client.query(
            'INSERT INTO package_features (package_id, feature) VALUES ($1, $2)',
            [id, feature]
          );
        }
      }

      // 3. Update best for
      await client.query('DELETE FROM package_best_for WHERE package_id = $1', [id]);
      if (packageData.bestFor && packageData.bestFor.length > 0) {
        for (const audience of packageData.bestFor) {
          await client.query(
            'INSERT INTO package_best_for (package_id, audience) VALUES ($1, $2)',
            [id, audience]
          );
        }
      }

      // 4. Update inclusions
      await client.query('DELETE FROM package_inclusions WHERE package_id = $1', [id]);
      if (packageData.inclusions && packageData.inclusions.length > 0) {
        for (let i = 0; i < packageData.inclusions.length; i++) {
          await client.query(
            'INSERT INTO package_inclusions (package_id, inclusion, display_order) VALUES ($1, $2, $3)',
            [id, packageData.inclusions[i], i]
          );
        }
      }

      // 5. Update exclusions
      await client.query('DELETE FROM package_exclusions WHERE package_id = $1', [id]);
      if (packageData.exclusions && packageData.exclusions.length > 0) {
        for (let i = 0; i < packageData.exclusions.length; i++) {
          await client.query(
            'INSERT INTO package_exclusions (package_id, exclusion, display_order) VALUES ($1, $2, $3)',
            [id, packageData.exclusions[i], i]
          );
        }
      }

      // 6. Update itinerary
      await client.query('DELETE FROM package_itinerary WHERE package_id = $1', [id]);
      if (packageData.itinerary && packageData.itinerary.length > 0) {
        for (const day of packageData.itinerary) {
          await client.query(
            'INSERT INTO package_itinerary (package_id, day_number, title, description) VALUES ($1, $2, $3, $4)',
            [id, day.day || day.day_number, day.title, day.description]
          );
        }
      }

      // 7. Update hotels
      await client.query('DELETE FROM package_hotels WHERE package_id = $1', [id]);
      await client.query('DELETE FROM package_hotel_features WHERE hotel_id IN (SELECT id FROM package_hotels WHERE package_id = $1)', [id]);
      
      if (packageData.hotels && packageData.hotels.length > 0) {
        for (let i = 0; i < packageData.hotels.length; i++) {
          const hotel = packageData.hotels[i];
          const hotelResult = await client.query(
            'INSERT INTO package_hotels (package_id, hotel_name, rating, nights, display_order) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [id, hotel.hotel_name || hotel.name, hotel.rating, hotel.nights, i]
          );
          
          const hotelId = hotelResult.rows[0].id;
          
          // Insert hotel features
          if (hotel.features && hotel.features.length > 0) {
            for (const feature of hotel.features) {
              await client.query(
                'INSERT INTO package_hotel_features (hotel_id, feature) VALUES ($1, $2)',
                [hotelId, feature]
              );
            }
          }
        }
      }

      // 8. Update destinations
      await client.query('DELETE FROM package_destinations WHERE package_id = $1', [id]);
      await client.query('DELETE FROM package_destination_highlights WHERE destination_id IN (SELECT id FROM package_destinations WHERE package_id = $1)', [id]);
      
      if (packageData.destinations && packageData.destinations.length > 0) {
        for (let i = 0; i < packageData.destinations.length; i++) {
          const destination = packageData.destinations[i];
          const destinationResult = await client.query(
            'INSERT INTO package_destinations (package_id, destination_name, destination_type, display_order) VALUES ($1, $2, $3, $4) RETURNING id',
            [id, destination.destination_name || destination.name, destination.destination_type || destination.type, i]
          );
          
          const destinationId = destinationResult.rows[0].id;
          
          // Insert destination highlights
          if (destination.highlights && destination.highlights.length > 0) {
            for (const highlight of destination.highlights) {
              await client.query(
                'INSERT INTO package_destination_highlights (destination_id, highlight) VALUES ($1, $2)',
                [destinationId, highlight]
              );
            }
          }
        }
      }

      // 9. Commit and return updated package
      await client.query('COMMIT');
      return await this.getById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Error updating package: ${error.message}`);
    } finally {
      client.release();
    }
  }

  // Update package status
  static async updateStatus(id, status) {
    const query = `
      UPDATE packages 
      SET status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *
    `;
    try {
      const result = await pool.query(query, [status, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating package status: ${error.message}`);
    }
  }

  // Delete package
  static async delete(id) {
    const query = 'DELETE FROM packages WHERE id = $1 RETURNING *';
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting package: ${error.message}`);
    }
  }

  // Get statistics
  static async getStatistics() {
    const query = `
      SELECT 
        COUNT(*) as total_packages,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_packages,
        SUM(views) as total_views,
        SUM(bookings) as total_bookings
      FROM packages
    `;
    try {
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching statistics: ${error.message}`);
    }
  }
}

module.exports = Package;


const pool = require('../config/db');

class Package {
  // Get all packages with filters
  static async getAll(filters = {}) {
    const {
      search = '',
      status = '',
      type = '',
      page = 1,
      limit = 10
    } = filters;

    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        p.*,
        u.email as creator_email,
        u.first_name as creator_first_name,
        u.last_name as creator_last_name
      FROM packages p
      INNER JOIN users u ON p.created_by = u.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (search) {
      query += ` AND (p.name ILIKE $${paramCount} OR p.code ILIKE $${paramCount})`;
      values.push(`%${search}%`);
      paramCount++;
    }

    if (status) {
      query += ` AND p.status = $${paramCount}`;
      values.push(status);
      paramCount++;
    }

    if (type) {
      query += ` AND p.type = $${paramCount}`;
      values.push(type);
      paramCount++;
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching packages: ${error.message}`);
    }
  }

  // Get package by ID with all details
  static async getById(id) {
    try {
      // Get package basic info
      const packageQuery = `
        SELECT 
          p.*,
          u.email as creator_email,
          u.first_name as creator_first_name,
          u.last_name as creator_last_name
        FROM packages p
        INNER JOIN users u ON p.created_by = u.id
        WHERE p.id = $1
      `;
      const packageResult = await pool.query(packageQuery, [id]);
      
      if (packageResult.rows.length === 0) {
        return null;
      }

      const packageData = packageResult.rows[0];

      // Get all related data
      const [
        itineraryResult,
        featuresResult,
        bestForResult,
        inclusionsResult,
        exclusionsResult,
        hotelsResult,
        destinationsResult
      ] = await Promise.all([
        pool.query('SELECT * FROM package_itinerary WHERE package_id = $1 ORDER BY day_number', [id]),
        pool.query('SELECT feature FROM package_features WHERE package_id = $1', [id]),
        pool.query('SELECT audience FROM package_best_for WHERE package_id = $1', [id]),
        pool.query('SELECT inclusion FROM package_inclusions WHERE package_id = $1 ORDER BY display_order', [id]),
        pool.query('SELECT exclusion FROM package_exclusions WHERE package_id = $1 ORDER BY display_order', [id]),
        pool.query(`
          SELECT 
            ph.*,
            (
              SELECT array_agg(feature)
              FROM package_hotel_features phf
              WHERE phf.hotel_id = ph.id
            ) as features
          FROM package_hotels ph
          WHERE ph.package_id = $1
          ORDER BY ph.display_order
        `, [id]),
        pool.query(`
          SELECT 
            pd.*,
            (
              SELECT array_agg(highlight)
              FROM package_destination_highlights pdh
              WHERE pdh.destination_id = pd.id
            ) as highlights
          FROM package_destinations pd
          WHERE pd.package_id = $1
          ORDER BY pd.display_order
        `, [id])
      ]);

      return {
        ...packageData,
        itinerary: itineraryResult.rows,
        features: featuresResult.rows.map(row => row.feature),
        bestFor: bestForResult.rows.map(row => row.audience),
        inclusions: inclusionsResult.rows.map(row => row.inclusion),
        exclusions: exclusionsResult.rows.map(row => row.exclusion),
        hotels: hotelsResult.rows,
        destinations: destinationsResult.rows,
      };
    } catch (error) {
      throw new Error(`Error fetching package details: ${error.message}`);
    }
  }

  // Create new package
  static async create(packageData, userId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Generate package code
      const codeCount = await client.query(
        `SELECT COUNT(*) FROM packages WHERE type = $1`,
        [packageData.type]
      );
      const count = parseInt(codeCount.rows[0].count) + 1;
      const code = `SL-${packageData.type.toUpperCase()}-${String(count).padStart(3, '0')}`;

      // Insert package
      const packageQuery = `
        INSERT INTO packages (
          name, code, type, season,
          base_price, min_price, max_price,
          duration_days, min_travelers, max_travelers,
          description, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `;
      
      const packageValues = [
        packageData.name,
        code,
        packageData.type,
        packageData.season,
        packageData.basePrice,
        packageData.minPrice,
        packageData.maxPrice,
        packageData.durationDays,
        packageData.minTravelers,
        packageData.maxTravelers,
        packageData.description,
        userId
      ];

      const packageResult = await client.query(packageQuery, packageValues);
      const newPackage = packageResult.rows[0];
      const packageId = newPackage.id;

      // Insert related data
      const insertPromises = [];

      // Insert features
      if (packageData.features && packageData.features.length > 0) {
        for (const feature of packageData.features) {
          insertPromises.push(
            client.query(
              'INSERT INTO package_features (package_id, feature) VALUES ($1, $2)',
              [packageId, feature]
            )
          );
        }
      }

      // Insert best for
      if (packageData.bestFor && packageData.bestFor.length > 0) {
        for (const audience of packageData.bestFor) {
          insertPromises.push(
            client.query(
              'INSERT INTO package_best_for (package_id, audience) VALUES ($1, $2)',
              [packageId, audience]
            )
          );
        }
      }

      // Insert inclusions
      if (packageData.inclusions && packageData.inclusions.length > 0) {
        for (let i = 0; i < packageData.inclusions.length; i++) {
          insertPromises.push(
            client.query(
              'INSERT INTO package_inclusions (package_id, inclusion, display_order) VALUES ($1, $2, $3)',
              [packageId, packageData.inclusions[i], i]
            )
          );
        }
      }

      // Insert exclusions
      if (packageData.exclusions && packageData.exclusions.length > 0) {
        for (let i = 0; i < packageData.exclusions.length; i++) {
          insertPromises.push(
            client.query(
              'INSERT INTO package_exclusions (package_id, exclusion, display_order) VALUES ($1, $2, $3)',
              [packageId, packageData.exclusions[i], i]
            )
          );
        }
      }

      // Insert itinerary
      if (packageData.itinerary && packageData.itinerary.length > 0) {
        for (const day of packageData.itinerary) {
          insertPromises.push(
            client.query(
              'INSERT INTO package_itinerary (package_id, day_number, title, description) VALUES ($1, $2, $3, $4)',
              [packageId, day.day, day.title, day.description]
            )
          );
        }
      }

      // Insert hotels
      if (packageData.hotels && packageData.hotels.length > 0) {
        for (let i = 0; i < packageData.hotels.length; i++) {
          const hotel = packageData.hotels[i];
          const hotelResult = await client.query(
            'INSERT INTO package_hotels (package_id, hotel_name, rating, nights, display_order) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [packageId, hotel.name, hotel.rating, hotel.nights, i]
          );
          
          const hotelId = hotelResult.rows[0].id;
          
          // Insert hotel features
          if (hotel.features && hotel.features.length > 0) {
            for (const feature of hotel.features) {
              insertPromises.push(
                client.query(
                  'INSERT INTO package_hotel_features (hotel_id, feature) VALUES ($1, $2)',
                  [hotelId, feature]
                )
              );
            }
          }
        }
      }

      // Insert destinations
      if (packageData.destinations && packageData.destinations.length > 0) {
        for (let i = 0; i < packageData.destinations.length; i++) {
          const destination = packageData.destinations[i];
          const destinationResult = await client.query(
            'INSERT INTO package_destinations (package_id, destination_name, destination_type, display_order) VALUES ($1, $2, $3, $4) RETURNING id',
            [packageId, destination.name, destination.type, i]
          );
          
          const destinationId = destinationResult.rows[0].id;
          
          // Insert destination highlights
          if (destination.highlights && destination.highlights.length > 0) {
            for (const highlight of destination.highlights) {
              insertPromises.push(
                client.query(
                  'INSERT INTO package_destination_highlights (destination_id, highlight) VALUES ($1, $2)',
                  [destinationId, highlight]
                )
              );
            }
          }
        }
      }

      // Execute all insert promises
      await Promise.all(insertPromises);
      await client.query('COMMIT');
      
      return await this.getById(packageId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Error creating package: ${error.message}`);
    } finally {
      client.release();
    }
  }

  // UPDATE PACKAGE - Added this method
  static async update(id, packageData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Update basic package info
      const updateQuery = `
        UPDATE packages SET 
          name = $1, type = $2, season = $3, 
          base_price = $4, min_price = $5, max_price = $6,
          duration_days = $7, min_travelers = $8, max_travelers = $9,
          description = $10, status = $11, updated_at = CURRENT_TIMESTAMP
        WHERE id = $12
        RETURNING *
      `;
      const values = [
        packageData.name, 
        packageData.type, 
        packageData.season,
        packageData.base_price || packageData.basePrice, 
        packageData.min_price || packageData.minPrice || packageData.base_price || packageData.basePrice, 
        packageData.max_price || packageData.maxPrice || packageData.base_price || packageData.basePrice,
        packageData.duration_days || packageData.durationDays, 
        packageData.min_travelers || packageData.minTravelers || 2, 
        packageData.max_travelers || packageData.maxTravelers || 10,
        packageData.description, 
        packageData.status, 
        id
      ];
      
      await client.query(updateQuery, values);

      // 2. Update features
      await client.query('DELETE FROM package_features WHERE package_id = $1', [id]);
      if (packageData.features && packageData.features.length > 0) {
        for (const feature of packageData.features) {
          await client.query(
            'INSERT INTO package_features (package_id, feature) VALUES ($1, $2)',
            [id, feature]
          );
        }
      }

      // 3. Update best for
      await client.query('DELETE FROM package_best_for WHERE package_id = $1', [id]);
      if (packageData.bestFor && packageData.bestFor.length > 0) {
        for (const audience of packageData.bestFor) {
          await client.query(
            'INSERT INTO package_best_for (package_id, audience) VALUES ($1, $2)',
            [id, audience]
          );
        }
      }

      // 4. Update inclusions
      await client.query('DELETE FROM package_inclusions WHERE package_id = $1', [id]);
      if (packageData.inclusions && packageData.inclusions.length > 0) {
        for (let i = 0; i < packageData.inclusions.length; i++) {
          await client.query(
            'INSERT INTO package_inclusions (package_id, inclusion, display_order) VALUES ($1, $2, $3)',
            [id, packageData.inclusions[i], i]
          );
        }
      }

      // 5. Update exclusions
      await client.query('DELETE FROM package_exclusions WHERE package_id = $1', [id]);
      if (packageData.exclusions && packageData.exclusions.length > 0) {
        for (let i = 0; i < packageData.exclusions.length; i++) {
          await client.query(
            'INSERT INTO package_exclusions (package_id, exclusion, display_order) VALUES ($1, $2, $3)',
            [id, packageData.exclusions[i], i]
          );
        }
      }

      // 6. Update itinerary
      await client.query('DELETE FROM package_itinerary WHERE package_id = $1', [id]);
      if (packageData.itinerary && packageData.itinerary.length > 0) {
        for (const day of packageData.itinerary) {
          await client.query(
            'INSERT INTO package_itinerary (package_id, day_number, title, description) VALUES ($1, $2, $3, $4)',
            [id, day.day || day.day_number, day.title, day.description]
          );
        }
      }

      // 7. Update hotels
      await client.query('DELETE FROM package_hotels WHERE package_id = $1', [id]);
      await client.query('DELETE FROM package_hotel_features WHERE hotel_id IN (SELECT id FROM package_hotels WHERE package_id = $1)', [id]);
      
      if (packageData.hotels && packageData.hotels.length > 0) {
        for (let i = 0; i < packageData.hotels.length; i++) {
          const hotel = packageData.hotels[i];
          const hotelResult = await client.query(
            'INSERT INTO package_hotels (package_id, hotel_name, rating, nights, display_order) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [id, hotel.hotel_name || hotel.name, hotel.rating, hotel.nights, i]
          );
          
          const hotelId = hotelResult.rows[0].id;
          
          // Insert hotel features
          if (hotel.features && hotel.features.length > 0) {
            for (const feature of hotel.features) {
              await client.query(
                'INSERT INTO package_hotel_features (hotel_id, feature) VALUES ($1, $2)',
                [hotelId, feature]
              );
            }
          }
        }
      }

      // 8. Update destinations
      await client.query('DELETE FROM package_destinations WHERE package_id = $1', [id]);
      await client.query('DELETE FROM package_destination_highlights WHERE destination_id IN (SELECT id FROM package_destinations WHERE package_id = $1)', [id]);
      
      if (packageData.destinations && packageData.destinations.length > 0) {
        for (let i = 0; i < packageData.destinations.length; i++) {
          const destination = packageData.destinations[i];
          const destinationResult = await client.query(
            'INSERT INTO package_destinations (package_id, destination_name, destination_type, display_order) VALUES ($1, $2, $3, $4) RETURNING id',
            [id, destination.destination_name || destination.name, destination.destination_type || destination.type, i]
          );
          
          const destinationId = destinationResult.rows[0].id;
          
          // Insert destination highlights
          if (destination.highlights && destination.highlights.length > 0) {
            for (const highlight of destination.highlights) {
              await client.query(
                'INSERT INTO package_destination_highlights (destination_id, highlight) VALUES ($1, $2)',
                [destinationId, highlight]
              );
            }
          }
        }
      }

      // 9. Commit and return updated package
      await client.query('COMMIT');
      return await this.getById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Error updating package: ${error.message}`);
    } finally {
      client.release();
    }
  }

  // Update package status
  static async updateStatus(id, status) {
    const query = `
      UPDATE packages 
      SET status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *
    `;
    try {
      const result = await pool.query(query, [status, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating package status: ${error.message}`);
    }
  }

  // Delete package
  static async delete(id) {
    const query = 'DELETE FROM packages WHERE id = $1 RETURNING *';
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting package: ${error.message}`);
    }
  }

  // Get statistics
  static async getStatistics() {
    const query = `
      SELECT 
        COUNT(*) as total_packages,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_packages,
        SUM(views) as total_views,
        SUM(bookings) as total_bookings
      FROM packages
    `;
    try {
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching statistics: ${error.message}`);
    }
  }
}

module.exports = Package;