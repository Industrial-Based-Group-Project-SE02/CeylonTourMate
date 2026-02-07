
const pool = require('../config/db');

// ============================================
// DEBUG ENDPOINT
// ============================================
exports.debugDatabase = async (req, res) => {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      checks: {}
    };

    // 1. Check database connection
    try {
      await pool.query('SELECT NOW()');
      diagnostics.checks.database_connection = '✅ Connected';
    } catch (err) {
      diagnostics.checks.database_connection = `❌ Failed: ${err.message}`;
    }

    // 2. Check if tables exist
    const tables = ['packages', 'package_destinations', 'package_itinerary_days', 'package_itinerary_activities', 'driver_details', 'users'];
    
    for (const table of tables) {
      try {
        const result = await pool.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = $1
          );
        `, [table]);
        
        if (result.rows[0].exists) {
          const countResult = await pool.query(`SELECT COUNT(*) FROM ${table}`);
          diagnostics.checks[`table_${table}`] = `✅ Exists (${countResult.rows[0].count} rows)`;
        } else {
          diagnostics.checks[`table_${table}`] = '❌ Does not exist';
        }
      } catch (err) {
        diagnostics.checks[`table_${table}`] = `❌ Error: ${err.message}`;
      }
    }

    // 3. Check packages status breakdown
    try {
      const statusResult = await pool.query(`
        SELECT 
          status,
          COUNT(*) as count
        FROM packages
        GROUP BY status;
      `);
      diagnostics.checks.package_status = statusResult.rows;
    } catch (err) {
      diagnostics.checks.package_status = `❌ Error: ${err.message}`;
    }

    // 4. Check driver_details columns
    try {
      const columnsResult = await pool.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'driver_details'
          AND column_name IN ('vehicle_type', 'vehicle_model', 'vehicle_year', 'vehicle_color', 'availability_status')
        ORDER BY column_name;
      `);
      diagnostics.checks.driver_vehicle_columns = columnsResult.rows.length > 0 
        ? `✅ Found ${columnsResult.rows.length} columns: ${columnsResult.rows.map(r => r.column_name).join(', ')}`
        : '❌ No vehicle columns found';
      diagnostics.checks.driver_columns_detail = columnsResult.rows;
    } catch (err) {
      diagnostics.checks.driver_vehicle_columns = `❌ Error: ${err.message}`;
    }

    // 5. Sample published package
    try {
      const sampleResult = await pool.query(`
        SELECT id, package_name, status, category, min_price
        FROM packages
        WHERE status = 'published'
        LIMIT 1;
      `);
      diagnostics.checks.sample_published_package = sampleResult.rows.length > 0
        ? sampleResult.rows[0]
        : '⚠️ No published packages found';
    } catch (err) {
      diagnostics.checks.sample_published_package = `❌ Error: ${err.message}`;
    }

    // 6. Check destinations
    try {
      const destResult = await pool.query(`
        SELECT COUNT(DISTINCT destination_code) as unique_destinations
        FROM package_destinations;
      `);
      diagnostics.checks.destinations = `✅ ${destResult.rows[0].unique_destinations} unique destinations`;
    } catch (err) {
      diagnostics.checks.destinations = `❌ Error: ${err.message}`;
    }

    res.json({
      success: true,
      diagnostics
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
};

// ============================================
// GET LAST PACKAGE CODE
// ============================================
exports.getLastPackageCode = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT package_code FROM packages 
       WHERE package_code LIKE 'CTM-%' 
       ORDER BY 
         CASE 
           WHEN package_code ~ '^CTM-[0-9]+$' 
           THEN CAST(SUBSTRING(package_code FROM 5) AS INTEGER)
           ELSE 0
         END DESC,
         created_at DESC
       LIMIT 1`
    );

    const lastCode = result.rows.length > 0 ? result.rows[0].package_code : 'CTM-000';
    
    console.log('Last package code:', lastCode);
    
    res.json({
      success: true,
      lastCode: lastCode
    });
  } catch (error) {
    console.error('Error fetching last package code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch last package code',
      details: error.message
    });
  }
};

// ============================================
// GET ALL PACKAGES
// ============================================
exports.getAllPackages = async (req, res) => {
  try {
    const { status } = req.query; // Get status filter from query params
    
    console.log(`📦 getAllPackages called with status: ${status || 'all'}`);
    
    let query = `
      SELECT 
        id,
        package_name,
        package_code,
        category,
        description,
        duration_days,
        duration_nights,
        hotel_stars,
        min_travelers,
        max_travelers,
        min_price,
        max_price,
        inclusions,
        exclusions,
        status,
        created_at
      FROM packages
    `;
    
    let queryParams = [];
    
    // Only filter by status if explicitly provided
    if (status && status !== 'all') {
      query += ` WHERE status = $1`;
      queryParams.push(status);
    }
    
    query += ` ORDER BY created_at DESC`;
    
    const result = await pool.query(query, queryParams);
    
    console.log(`✅ Found ${result.rows.length} packages`);
    result.rows.forEach((pkg, idx) => {
      console.log(`  ${idx + 1}. ${pkg.package_name} (ID: ${pkg.id}, Status: ${pkg.status}, Category: ${pkg.category})`);
    });
    
    res.json({
      success: true,
      packages: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('❌ Error fetching packages:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch packages',
      details: error.message 
    });
  }
};

// ============================================
// GET ACTIVE PACKAGES (for booking form)
// ============================================
exports.getActivePackages = async (req, res) => {
  try {
    console.log('📦 Fetching active packages...');
    
    // Simple query first to check packages table
    const simpleQuery = `
      SELECT 
        id,
        package_name,
        package_code,
        category,
        description,
        duration_days,
        duration_nights,
        hotel_stars,
        min_travelers,
        max_travelers,
        min_price,
        max_price,
        single_supplement,
        inclusions,
        exclusions,
        status,
        created_at
      FROM packages
      WHERE status = 'published'
      ORDER BY category, min_price;
    `;

    const packagesResult = await pool.query(simpleQuery);
    console.log(`✅ Found ${packagesResult.rows.length} published packages`);

    if (packagesResult.rows.length === 0) {
      console.log('⚠️  No published packages found');
      return res.json([]);
    }

    // Get full details for each package
    const packagesWithDetails = await Promise.all(
      packagesResult.rows.map(async (pkg) => {
        try {
          // Get destinations
          const destQuery = `
            SELECT 
              id,
              destination_code,
              destination_name,
              display_order
            FROM package_destinations
            WHERE package_id = $1
            ORDER BY display_order;
          `;
          const destResult = await pool.query(destQuery, [pkg.id]);

          // Get itinerary days
          const itinQuery = `
            SELECT 
              id,
              day_number,
              title,
              description,
              highlights,
              display_order
            FROM package_itinerary_days
            WHERE package_id = $1
            ORDER BY day_number;
          `;
          const itinResult = await pool.query(itinQuery, [pkg.id]);

          // Get activities for each day
          const itineraryWithActivities = await Promise.all(
            itinResult.rows.map(async (day) => {
              const actQuery = `
                SELECT 
                  id,
                  time_slot,
                  activity_type,
                  activity_name,
                  description,
                  duration,
                  is_optional,
                  optional_cost,
                  display_order
                FROM package_itinerary_activities
                WHERE day_id = $1
                ORDER BY display_order;
              `;
              const actResult = await pool.query(actQuery, [day.id]);
              
              return {
                ...day,
                activities: actResult.rows
              };
            })
          );

          return {
            ...pkg,
            destinations: destResult.rows,
            itinerary: itineraryWithActivities
          };
        } catch (err) {
          console.error(`Error fetching details for package ${pkg.id}:`, err.message);
          return {
            ...pkg,
            destinations: [],
            itinerary: []
          };
        }
      })
    );

    console.log(`✅ Successfully processed ${packagesWithDetails.length} packages`);
    res.json(packagesWithDetails);

  } catch (error) {
    console.error('❌ Error in getActivePackages:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch active packages',
      details: error.message
    });
  }
};

// ============================================
// GET VEHICLE INFO (for booking form)
// ============================================
exports.getVehicleInfo = async (req, res) => {
  try {
    console.log('🚗 Fetching vehicle info...');

    // Check which columns exist
    const columnCheckQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'driver_details' 
        AND column_name IN ('vehicle_type', 'vehicle_model', 'vehicle_year', 'vehicle_color', 'availability_status');
    `;
    
    const columnCheck = await pool.query(columnCheckQuery);
    const existingColumns = columnCheck.rows.map(row => row.column_name);
    console.log('✅ Found columns:', existingColumns);

    // Build query based on existing columns
    let selectClause = `
      dd.id,
      dd.user_id,
      dd.license_number,
      dd.languages,
      dd.years_of_experience,
      dd.rating,
      u.first_name,
      u.last_name,
      u.phone
    `;

    if (existingColumns.includes('vehicle_type')) selectClause += ', dd.vehicle_type';
    if (existingColumns.includes('vehicle_model')) selectClause += ', dd.vehicle_model';
    if (existingColumns.includes('vehicle_year')) selectClause += ', dd.vehicle_year';
    if (existingColumns.includes('vehicle_color')) selectClause += ', dd.vehicle_color';
    if (existingColumns.includes('availability_status')) selectClause += ', dd.availability_status';

    const query = `
      SELECT ${selectClause}
      FROM driver_details dd
      INNER JOIN users u ON dd.user_id = u.id
      WHERE u.is_active = true
      ORDER BY dd.id;
    `;

    const result = await pool.query(query);
    console.log(`✅ Found ${result.rows.length} drivers`);

    // Filter only those with vehicle info if column exists
    let filteredResults = result.rows;
    if (existingColumns.includes('vehicle_type') && existingColumns.includes('vehicle_model')) {
      filteredResults = result.rows.filter(row => row.vehicle_type && row.vehicle_model);
      console.log(`✅ ${filteredResults.length} drivers have vehicle information`);
    }

    res.json(filteredResults);

  } catch (error) {
    console.error('❌ Error in getVehicleInfo:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch vehicle information',
      details: error.message
    });
  }
};

// ============================================
// GET DESTINATIONS (for booking form)
// ============================================
exports.getDestinations = async (req, res) => {
  try {
    console.log('📍 Fetching destinations...');

    // Check if table exists
    const tableCheckQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'package_destinations'
      );
    `;
    
    const tableCheck = await pool.query(tableCheckQuery);
    
    if (!tableCheck.rows[0].exists) {
      console.log('⚠️  package_destinations table does not exist');
      return res.json([]);
    }

    const query = `
      SELECT DISTINCT 
        destination_code,
        destination_name
      FROM package_destinations
      WHERE destination_code IS NOT NULL 
        AND destination_name IS NOT NULL
      ORDER BY destination_name;
    `;

    const result = await pool.query(query);
    console.log(`✅ Found ${result.rows.length} unique destinations`);

    res.json(result.rows);

  } catch (error) {
    console.error('❌ Error in getDestinations:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch destinations',
      details: error.message
    });
  }
};

// ============================================
// GET PACKAGE BY ID
// ============================================
exports.getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        p.*,
        json_agg(
          DISTINCT jsonb_build_object(
            'id', pd.id,
            'destination_code', pd.destination_code,
            'destination_name', pd.destination_name,
            'display_order', pd.display_order
          ) ORDER BY pd.display_order
        ) FILTER (WHERE pd.id IS NOT NULL) as destinations,
        json_agg(
          DISTINCT jsonb_build_object(
            'id', pid.id,
            'day_number', pid.day_number,
            'title', pid.title,
            'description', pid.description,
            'highlights', pid.highlights,
            'activities', (
              SELECT json_agg(
                jsonb_build_object(
                  'id', pia.id,
                  'time_slot', pia.time_slot,
                  'activity_type', pia.activity_type,
                  'activity_name', pia.activity_name,
                  'description', pia.description,
                  'duration', pia.duration,
                  'is_optional', pia.is_optional,
                  'optional_cost', pia.optional_cost
                ) ORDER BY pia.display_order
              )
              FROM package_itinerary_activities pia
              WHERE pia.day_id = pid.id
            )
          ) ORDER BY pid.day_number
        ) FILTER (WHERE pid.id IS NOT NULL) as itinerary
      FROM packages p
      LEFT JOIN package_destinations pd ON p.id = pd.package_id
      LEFT JOIN package_itinerary_days pid ON p.id = pid.package_id
      WHERE p.id = $1
      GROUP BY p.id;
    `;

    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Package not found'
      });
    }

    res.json({
      success: true,
      package: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch package',
      details: error.message 
    });
  }
};

// ============================================
// CREATE PACKAGE
// ============================================
exports.createPackage = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      package_name,
      package_code,
      category,
      description,
      duration_days,
      duration_nights,
      hotel_stars,
      min_travelers,
      max_travelers,
      min_price,
      max_price,
      single_supplement,
      valid_from,
      valid_to,
      status,
      inclusions,
      exclusions,
      terms_conditions,
      created_by,
      destinations,
      itinerary
    } = req.body;

    // Validate required fields
    const errors = [];
    if (!package_name) errors.push('package_name is required');
    if (!package_code) errors.push('package_code is required');
    if (!category) errors.push('category is required');
    if (!duration_days) errors.push('duration_days is required');
    if (!hotel_stars) errors.push('hotel_stars is required');
    if (min_price === undefined || min_price === null) errors.push('min_price is required');
    if (max_price === undefined || max_price === null) errors.push('max_price is required');
    if (!valid_from) errors.push('valid_from is required');
    if (!valid_to) errors.push('valid_to is required');
    if (!created_by) errors.push('created_by is required');

    if (errors.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.join(', ')
      });
    }

    // Insert package
    const packageQuery = `
      INSERT INTO packages (
        package_name, package_code, category, description,
        duration_days, duration_nights, hotel_stars,
        min_travelers, max_travelers, min_price, max_price,
        single_supplement, valid_from, valid_to, status,
        inclusions, exclusions, terms_conditions, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *;
    `;

    const packageResult = await client.query(packageQuery, [
      package_name, package_code, category, description,
      duration_days, duration_nights, hotel_stars,
      min_travelers, max_travelers, min_price, max_price,
      single_supplement, valid_from, valid_to, status,
      inclusions, exclusions, terms_conditions, created_by
    ]);

    const packageId = packageResult.rows[0].id;

    // Insert destinations
    if (destinations && destinations.length > 0) {
      for (let i = 0; i < destinations.length; i++) {
        await client.query(
          `INSERT INTO package_destinations (package_id, destination_code, destination_name, display_order)
           VALUES ($1, $2, $3, $4)`,
          [packageId, destinations[i].code, destinations[i].name, i]
        );
      }
    }

    // Insert itinerary
    if (itinerary && itinerary.length > 0) {
      for (const day of itinerary) {
        const dayResult = await client.query(
          `INSERT INTO package_itinerary_days (package_id, day_number, title, description, highlights)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id`,
          [packageId, day.day_number, day.title, day.description, day.highlights && day.highlights.length > 0 ? day.highlights : null]
        );

        const dayId = dayResult.rows[0].id;

        if (day.activities && day.activities.length > 0) {
          for (let i = 0; i < day.activities.length; i++) {
            const act = day.activities[i];
            await client.query(
              `INSERT INTO package_itinerary_activities (
                day_id, time_slot, activity_type, activity_name,
                description, duration, is_optional, optional_cost, display_order
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
              [dayId, act.time_slot, act.activity_type, act.activity_name,
               act.description || null, act.duration || null, act.is_optional || false, act.optional_cost || 0, i]
            );
          }
        }
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      package: packageResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating package:', error);
    console.error('Error stack:', error.stack);
    
    // Provide more detailed error messages
    let errorMessage = error.message;
    if (error.message.includes('violates unique constraint')) {
      errorMessage = 'Package code already exists. Please use a different code.';
    } else if (error.message.includes('violates check constraint')) {
      errorMessage = 'Invalid data: ' + error.message;
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create package',
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    client.release();
  }
};

// ============================================
// UPDATE PACKAGE
// ============================================
exports.updatePackage = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const updateData = req.body;

    const packageQuery = `
      UPDATE packages
      SET 
        package_name = COALESCE($1, package_name),
        category = COALESCE($2, category),
        description = COALESCE($3, description),
        duration_days = COALESCE($4, duration_days),
        duration_nights = COALESCE($5, duration_nights),
        hotel_stars = COALESCE($6, hotel_stars),
        min_travelers = COALESCE($7, min_travelers),
        max_travelers = COALESCE($8, max_travelers),
        min_price = COALESCE($9, min_price),
        max_price = COALESCE($10, max_price),
        single_supplement = COALESCE($11, single_supplement),
        valid_from = COALESCE($12, valid_from),
        valid_to = COALESCE($13, valid_to),
        status = COALESCE($14, status),
        inclusions = COALESCE($15, inclusions),
        exclusions = COALESCE($16, exclusions),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $17
      RETURNING *;
    `;

    const result = await client.query(packageQuery, [
      updateData.package_name,
      updateData.category,
      updateData.description,
      updateData.duration_days,
      updateData.duration_nights,
      updateData.hotel_stars,
      updateData.min_travelers,
      updateData.max_travelers,
      updateData.min_price,
      updateData.max_price,
      updateData.single_supplement,
      updateData.valid_from,
      updateData.valid_to,
      updateData.status,
      updateData.inclusions,
      updateData.exclusions,
      id
    ]);

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Package updated successfully',
      package: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating package:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update package',
      details: error.message
    });
  } finally {
    client.release();
  }
};

// ============================================
// UPDATE PACKAGE STATUS
// ============================================
exports.updatePackageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const query = `
      UPDATE packages
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;

    const result = await pool.query(query, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Package not found'
      });
    }

    res.json({
      success: true,
      message: 'Package status updated successfully',
      package: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating package status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update package status',
      details: error.message
    });
  }
};

// ============================================
// DELETE PACKAGE
// ============================================
exports.deletePackage = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    
    await client.query('BEGIN');
    
    // Delete related records first
    await client.query('DELETE FROM package_itinerary_activities WHERE day_id IN (SELECT id FROM package_itinerary_days WHERE package_id = $1)', [id]);
    await client.query('DELETE FROM package_itinerary_days WHERE package_id = $1', [id]);
    await client.query('DELETE FROM package_destinations WHERE package_id = $1', [id]);
    
    // Delete the package
    const result = await client.query('DELETE FROM packages WHERE id = $1 RETURNING id, package_name', [id]);

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: 'Package not found'
      });
    }
    
    await client.query('COMMIT');
    
    console.log(`✅ Package deleted: ${result.rows[0].package_name} (ID: ${id})`);

    res.json({
      success: true,
      message: 'Package deleted successfully',
      deletedPackage: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error deleting package:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete package',
      details: error.message
    });
  } finally {
    client.release();
  }
};

// ============================================
// BULK DELETE PACKAGES
// ============================================
exports.bulkDeletePackages = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Package IDs are required'
      });
    }
    
    await client.query('BEGIN');
    
    // Delete related records first
    await client.query(
      'DELETE FROM package_itinerary_activities WHERE day_id IN (SELECT id FROM package_itinerary_days WHERE package_id = ANY($1))',
      [ids]
    );
    await client.query('DELETE FROM package_itinerary_days WHERE package_id = ANY($1)', [ids]);
    await client.query('DELETE FROM package_destinations WHERE package_id = ANY($1)', [ids]);
    
    // Delete packages
    const result = await client.query(
      'DELETE FROM packages WHERE id = ANY($1) RETURNING id, package_name',
      [ids]
    );
    
    await client.query('COMMIT');
    
    console.log(`✅ Bulk deleted ${result.rows.length} packages`);

    res.json({
      success: true,
      message: `${result.rows.length} package(s) deleted successfully`,
      deletedCount: result.rows.length,
      deletedPackages: result.rows
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error bulk deleting packages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete packages',
      details: error.message
    });
  } finally {
    client.release();
  }
};

// ============================================
// GET STATISTICS
// ============================================
exports.getStatistics = async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(*) as total_packages,
        COUNT(CASE WHEN status = 'published' THEN 1 END) as published_packages,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_packages,
        AVG(min_price) as avg_price
      FROM packages;
    `;

    const result = await pool.query(query);

    res.json({
      success: true,
      statistics: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      details: error.message
    });
  }
};