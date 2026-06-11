// // const Package = require('../models/Package');
// // const pool = require('../config/db');

// // // @desc    Get all packages with filters and pagination
// // // @route   GET /api/packages
// // exports.getAllPackages = async (req, res) => {
// //   try {
// //     const { 
// //       search = '',
// //       status = '',
// //       type = '',
// //       page = 1,
// //       limit = 10
// //     } = req.query;

// //     const filters = {
// //       search,
// //       status: status !== 'All Status' ? status : '',
// //       type: type !== 'All Types' ? type : '',
// //       page: parseInt(page),
// //       limit: parseInt(limit)
// //     };

// //     const packages = await Package.getAll(filters);
    
// //     // Format the response to match frontend (ManagePackage.jsx) expectations
// //     const formattedPackages = packages.map(pkg => ({
// //       id: pkg.id,
// //       name: pkg.name,
// //       type: pkg.type,
// //       price: pkg.base_price,
// //       duration: `${pkg.duration_days} ${pkg.duration_days === 1 ? 'Day' : 'Days'}`,
// //       status: pkg.status,
// //       stats: {
// //         views: pkg.views || 0,
// //         bookings: pkg.bookings || 0
// //       },
// //       updated: new Date(pkg.updated_at || pkg.created_at).toISOString().split('T')[0],
// //       createdAt: new Date(pkg.created_at).toISOString().split('T')[0],
// //       code: pkg.code,
// //       creator: pkg.creator_email ? {
// //         email: pkg.creator_email,
// //         name: `${pkg.creator_first_name || ''} ${pkg.creator_last_name || ''}`.trim()
// //       } : null
// //     }));

// //     // Get total count for pagination (using a high limit to get all for count)
// //     const allPackagesForCount = await Package.getAll({ ...filters, limit: 10000, page: 1 });
// //     const totalCount = allPackagesForCount.length;

// //     res.json({
// //       success: true,
// //       count: formattedPackages.length,
// //       total: totalCount,
// //       data: formattedPackages,
// //       pagination: {
// //         page: filters.page,
// //         limit: filters.limit,
// //         totalPages: Math.ceil(totalCount / filters.limit)
// //       }
// //     });
// //   } catch (error) {
// //     console.error("Error getting packages:", error);
// //     res.status(500).json({
// //       success: false,
// //       error: "Failed to fetch packages"
// //     });
// //   }
// // };

// // // @desc    Get dashboard statistics
// // // @route   GET /api/packages/stats
// // exports.getStatistics = async (req, res) => {
// //   try {
// //     const stats = await Package.getStatistics();
    
// //     res.json({
// //       success: true,
// //       data: {
// //         totalPackages: parseInt(stats.total_packages) || 0,
// //         totalBookings: parseInt(stats.total_bookings) || 0,
// //         activePackages: parseInt(stats.active_packages) || 0,
// //         totalViews: parseInt(stats.total_views) || 0
// //       }
// //     });
// //   } catch (error) {
// //     console.error("Error getting statistics:", error);
// //     res.status(500).json({
// //       success: false,
// //       error: "Failed to fetch statistics"
// //     });
// //   }
// // };

// // // @desc    Get single package by ID
// // // @route   GET /api/packages/:id
// // exports.getPackageById = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const packageData = await Package.getById(id);
    
// //     if (!packageData) {
// //       return res.status(404).json({
// //         success: false,
// //         error: "Package not found"
// //       });
// //     }
    
// //     res.json({
// //       success: true,
// //       data: packageData
// //     });
// //   } catch (error) {
// //     console.error("Error getting package:", error);
// //     res.status(500).json({
// //       success: false,
// //       error: "Failed to fetch package details"
// //     });
// //   }
// // };

// // // @desc    Create new package
// // // @route   POST /api/packages
// // exports.createPackage = async (req, res) => {
// //   try {
// //     // req.user.id should be provided by your auth middleware
// //     const userId = req.user?.id || 1; 
    
// //     // Map frontend camelCase to model expectations
// //     const packageData = {
// //       ...req.body,
// //       basePrice: req.body.basePrice || req.body.price,
// //       durationDays: req.body.durationDays || req.body.duration
// //     };
    
// //     const newPackage = await Package.create(packageData, userId);
    
// //     res.status(201).json({
// //       success: true,
// //       message: "Package created successfully",
// //       data: newPackage
// //     });
// //   } catch (error) {
// //     console.error("Error creating package:", error);
// //     res.status(500).json({
// //       success: false,
// //       error: "Failed to create package: " + error.message
// //     });
// //   }
// // };

// // // @desc    Update package status (Active/Inactive)
// // // @route   PATCH /api/packages/:id/status
// // exports.updatePackageStatus = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { status } = req.body;
    
// //     if (!status) {
// //       return res.status(400).json({ success: false, error: "Status is required" });
// //     }
    
// //     const updatedPackage = await Package.updateStatus(id, status);
    
// //     res.json({
// //       success: true,
// //       message: `Package marked as ${status}`,
// //       data: updatedPackage
// //     });
// //   } catch (error) {
// //     console.error("Error updating status:", error);
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // };

// // // @desc    Delete single package
// // // @route   DELETE /api/packages/:id
// // exports.deletePackage = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const deleted = await Package.delete(id);
    
// //     if (!deleted) {
// //       return res.status(404).json({ success: false, error: "Package not found" });
// //     }
    
// //     res.json({
// //       success: true,
// //       message: "Package deleted successfully"
// //     });
// //   } catch (error) {
// //     console.error("Error deleting package:", error);
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // };

// // // @desc    Bulk delete packages
// // // @route   POST /api/packages/bulk-delete
// // exports.bulkDeletePackages = async (req, res) => {
// //   try {
// //     const { ids } = req.body;
// //     if (!ids || !Array.isArray(ids)) {
// //       return res.status(400).json({ success: false, error: "Invalid IDs provided" });
// //     }
    
// //     // Execute deletions in parallel
// //     await Promise.all(ids.map(id => Package.delete(id)));
    
// //     res.json({
// //       success: true,
// //       message: `${ids.length} packages deleted successfully`
// //     });
// //   } catch (error) {
// //     console.error("Bulk delete error:", error);
// //     res.status(500).json({ success: false, error: "Failed to delete some packages" });
// //   }
// // };


// // // In packageController.js, add this function:

// // // Update package
// // exports.updatePackage = async (req, res) => {
// //   try {
// //     const { id } = req.params;
    
// //     // Get user ID from auth middleware (temporary: use 1 for testing)
// //     const userId = req.user?.id || 1;
    
// //     const packageData = {
// //       name: req.body.name,
// //       type: req.body.type,
// //       season: req.body.season || 'All Year',
// //       base_price: req.body.basePrice || req.body.base_price,
// //       min_price: req.body.minPrice || req.body.min_price,
// //       max_price: req.body.maxPrice || req.body.max_price,
// //       duration_days: req.body.durationDays || req.body.duration_days,
// //       min_travelers: req.body.minTravelers || req.body.min_travelers || 2,
// //       max_travelers: req.body.maxTravelers || req.body.max_travelers || 10,
// //       description: req.body.description || '',
// //       status: req.body.status || 'Active',
// //       features: req.body.features || [],
// //       bestFor: req.body.bestFor || [],
// //       inclusions: req.body.inclusions || [],
// //       exclusions: req.body.exclusions || [],
// //       itinerary: req.body.itinerary || [],
// //       hotels: req.body.hotels || [],
// //       destinations: req.body.destinations || []
// //     };
    
// //     const updatedPackage = await Package.update(id, packageData);
    
// //     res.json({
// //       success: true,
// //       message: "Package updated successfully",
// //       data: updatedPackage
// //     });
// //   } catch (error) {
// //     console.error("Error updating package:", error);
// //     res.status(500).json({
// //       success: false,
// //       error: "Failed to update package: " + error.message
// //     });
// //   }
// // };

// // // Get active packages for booking form
// // exports.getActivePackages = async (req, res) => {
// //   try {
// //     const query = `
// //       SELECT 
// //         p.id,
// //         p.package_name,
// //         p.package_code,
// //         p.category,
// //         p.description,
// //         p.duration_days,
// //         p.duration_nights,
// //         p.hotel_stars,
// //         p.min_travelers,
// //         p.max_travelers,
// //         p.min_price,
// //         p.max_price,
// //         p.single_supplement,
// //         p.inclusions,
// //         p.exclusions,
// //         p.status,
// //         p.created_at,
// //         -- Get destinations as array
// //         COALESCE(
// //           json_agg(
// //             DISTINCT jsonb_build_object(
// //               'id', pd.id,
// //               'destination_code', pd.destination_code,
// //               'destination_name', pd.destination_name
// //             )
// //           ) FILTER (WHERE pd.id IS NOT NULL),
// //           '[]'
// //         ) as destinations,
// //         -- Get itinerary days with activities
// //         COALESCE(
// //           json_agg(
// //             DISTINCT jsonb_build_object(
// //               'id', pid.id,
// //               'day_number', pid.day_number,
// //               'title', pid.title,
// //               'description', pid.description,
// //               'highlights', pid.highlights,
// //               'activities', (
// //                 SELECT json_agg(
// //                   jsonb_build_object(
// //                     'id', pia.id,
// //                     'time_slot', pia.time_slot,
// //                     'activity_type', pia.activity_type,
// //                     'activity_name', pia.activity_name,
// //                     'description', pia.description,
// //                     'duration', pia.duration,
// //                     'is_optional', pia.is_optional
// //                   ) ORDER BY pia.display_order
// //                 )
// //                 FROM package_itinerary_activities pia
// //                 WHERE pia.day_id = pid.id
// //               )
// //             ) ORDER BY pid.day_number
// //           ) FILTER (WHERE pid.id IS NOT NULL),
// //           '[]'
// //         ) as itinerary
// //       FROM packages p
// //       LEFT JOIN package_destinations pd ON p.id = pd.package_id
// //       LEFT JOIN package_itinerary_days pid ON p.id = pid.package_id
// //       WHERE p.status = 'published'
// //       GROUP BY p.id
// //       ORDER BY p.category, p.min_price;
// //     `;

// //     const result = await pool.query(query);
// //     res.json(result.rows);
// //   } catch (error) {
// //     console.error('Error fetching active packages:', error);
// //     res.status(500).json({ 
// //       error: 'Failed to fetch active packages',
// //       details: error.message 
// //     });
// //   }
// // };


// // // Get vehicle information from driver_details
// // exports.getVehicleInfo = async (req, res) => {
// //   try {
// //     const query = `
// //       SELECT 
// //         dd.id,
// //         dd.user_id,
// //         dd.vehicle_type,
// //         dd.vehicle_number,
// //         dd.vehicle_model,
// //         dd.vehicle_year,
// //         dd.vehicle_color,
// //         dd.languages,
// //         dd.years_of_experience,
// //         dd.availability_status,
// //         dd.rating,
// //         u.first_name,
// //         u.last_name,
// //         u.phone
// //       FROM driver_details dd
// //       INNER JOIN users u ON dd.user_id = u.id
// //       WHERE u.is_active = true 
// //         AND dd.availability_status = 'available'
// //         AND dd.vehicle_type IS NOT NULL
// //         AND dd.vehicle_model IS NOT NULL
// //       ORDER BY dd.vehicle_type, dd.vehicle_model;
// //     `;

// //     const result = await pool.query(query);
// //     res.json(result.rows);
// //   } catch (error) {
// //     console.error('Error fetching vehicle info:', error);
// //     res.status(500).json({ 
// //       error: 'Failed to fetch vehicle information',
// //       details: error.message 
// //     });
// //   }
// // };

// // // Get all destinations for custom package selection
// // exports.getDestinations = async (req, res) => {
// //   try {
// //     const query = `
// //       SELECT DISTINCT 
// //         destination_code,
// //         destination_name
// //       FROM package_destinations
// //       ORDER BY destination_name;
// //     `;

// //     const result = await pool.query(query);
// //     res.json(result.rows);
// //   } catch (error) {
// //     console.error('Error fetching destinations:', error);
// //     res.status(500).json({ 
// //       error: 'Failed to fetch destinations',
// //       details: error.message 
// //     });
// //   }
// // };


// const pool = require('../config/db');

// // ============================================
// // DEBUG ENDPOINT
// // ============================================
// exports.debugDatabase = async (req, res) => {
//   try {
//     const diagnostics = {
//       timestamp: new Date().toISOString(),
//       checks: {}
//     };

//     // 1. Check database connection
//     try {
//       await pool.query('SELECT NOW()');
//       diagnostics.checks.database_connection = '✅ Connected';
//     } catch (err) {
//       diagnostics.checks.database_connection = `❌ Failed: ${err.message}`;
//     }

//     // 2. Check if tables exist
//     const tables = ['packages', 'package_destinations', 'package_itinerary_days', 'package_itinerary_activities', 'driver_details', 'users'];
    
//     for (const table of tables) {
//       try {
//         const result = await pool.query(`
//           SELECT EXISTS (
//             SELECT FROM information_schema.tables 
//             WHERE table_name = $1
//           );
//         `, [table]);
        
//         if (result.rows[0].exists) {
//           const countResult = await pool.query(`SELECT COUNT(*) FROM ${table}`);
//           diagnostics.checks[`table_${table}`] = `✅ Exists (${countResult.rows[0].count} rows)`;
//         } else {
//           diagnostics.checks[`table_${table}`] = '❌ Does not exist';
//         }
//       } catch (err) {
//         diagnostics.checks[`table_${table}`] = `❌ Error: ${err.message}`;
//       }
//     }

//     // 3. Check packages status breakdown
//     try {
//       const statusResult = await pool.query(`
//         SELECT 
//           status,
//           COUNT(*) as count
//         FROM packages
//         GROUP BY status;
//       `);
//       diagnostics.checks.package_status = statusResult.rows;
//     } catch (err) {
//       diagnostics.checks.package_status = `❌ Error: ${err.message}`;
//     }

//     // 4. Check driver_details columns
//     try {
//       const columnsResult = await pool.query(`
//         SELECT column_name, data_type
//         FROM information_schema.columns
//         WHERE table_name = 'driver_details'
//           AND column_name IN ('vehicle_type', 'vehicle_model', 'vehicle_year', 'vehicle_color', 'availability_status')
//         ORDER BY column_name;
//       `);
//       diagnostics.checks.driver_vehicle_columns = columnsResult.rows.length > 0 
//         ? `✅ Found ${columnsResult.rows.length} columns: ${columnsResult.rows.map(r => r.column_name).join(', ')}`
//         : '❌ No vehicle columns found';
//       diagnostics.checks.driver_columns_detail = columnsResult.rows;
//     } catch (err) {
//       diagnostics.checks.driver_vehicle_columns = `❌ Error: ${err.message}`;
//     }

//     // 5. Sample published package
//     try {
//       const sampleResult = await pool.query(`
//         SELECT id, package_name, status, category, min_price
//         FROM packages
//         WHERE status = 'published'
//         LIMIT 1;
//       `);
//       diagnostics.checks.sample_published_package = sampleResult.rows.length > 0
//         ? sampleResult.rows[0]
//         : '⚠️ No published packages found';
//     } catch (err) {
//       diagnostics.checks.sample_published_package = `❌ Error: ${err.message}`;
//     }

//     // 6. Check destinations
//     try {
//       const destResult = await pool.query(`
//         SELECT COUNT(DISTINCT destination_code) as unique_destinations
//         FROM package_destinations;
//       `);
//       diagnostics.checks.destinations = `✅ ${destResult.rows[0].unique_destinations} unique destinations`;
//     } catch (err) {
//       diagnostics.checks.destinations = `❌ Error: ${err.message}`;
//     }

//     res.json({
//       success: true,
//       diagnostics
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//       stack: error.stack
//     });
//   }
// };

// // ============================================
// // GET ALL PACKAGES
// // ============================================
// exports.getAllPackages = async (req, res) => {
//   try {
//     const query = `
//       SELECT 
//         p.*,
//         COUNT(DISTINCT pd.id) as destination_count,
//         json_agg(
//           DISTINCT jsonb_build_object(
//             'id', pd.id,
//             'destination_code', pd.destination_code,
//             'destination_name', pd.destination_name
//           )
//         ) FILTER (WHERE pd.id IS NOT NULL) as destinations
//       FROM packages p
//       LEFT JOIN package_destinations pd ON p.id = pd.package_id
//       GROUP BY p.id
//       ORDER BY p.created_at DESC;
//     `;

//     const result = await pool.query(query);
//     res.json({
//       success: true,
//       packages: result.rows
//     });
//   } catch (error) {
//     console.error('Error fetching packages:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Failed to fetch packages',
//       details: error.message 
//     });
//   }
// };

// // ============================================
// // GET ACTIVE PACKAGES (for booking form)
// // ============================================
// exports.getActivePackages = async (req, res) => {
//   try {
//     console.log('📦 Fetching active packages...');
    
//     // Simple query first to check packages table
//     const simpleQuery = `
//       SELECT 
//         id,
//         package_name,
//         package_code,
//         category,
//         description,
//         duration_days,
//         duration_nights,
//         hotel_stars,
//         min_travelers,
//         max_travelers,
//         min_price,
//         max_price,
//         single_supplement,
//         inclusions,
//         exclusions,
//         status,
//         created_at
//       FROM packages
//       WHERE status = 'published'
//       ORDER BY category, min_price;
//     `;

//     const packagesResult = await pool.query(simpleQuery);
//     console.log(`✅ Found ${packagesResult.rows.length} published packages`);

//     if (packagesResult.rows.length === 0) {
//       console.log('⚠️  No published packages found');
//       return res.json([]);
//     }

//     // Get full details for each package
//     const packagesWithDetails = await Promise.all(
//       packagesResult.rows.map(async (pkg) => {
//         try {
//           // Get destinations
//           const destQuery = `
//             SELECT 
//               id,
//               destination_code,
//               destination_name,
//               display_order
//             FROM package_destinations
//             WHERE package_id = $1
//             ORDER BY display_order;
//           `;
//           const destResult = await pool.query(destQuery, [pkg.id]);

//           // Get itinerary days
//           const itinQuery = `
//             SELECT 
//               id,
//               day_number,
//               title,
//               description,
//               highlights,
//               display_order
//             FROM package_itinerary_days
//             WHERE package_id = $1
//             ORDER BY day_number;
//           `;
//           const itinResult = await pool.query(itinQuery, [pkg.id]);

//           // Get activities for each day
//           const itineraryWithActivities = await Promise.all(
//             itinResult.rows.map(async (day) => {
//               const actQuery = `
//                 SELECT 
//                   id,
//                   time_slot,
//                   activity_type,
//                   activity_name,
//                   description,
//                   duration,
//                   is_optional,
//                   optional_cost,
//                   display_order
//                 FROM package_itinerary_activities
//                 WHERE day_id = $1
//                 ORDER BY display_order;
//               `;
//               const actResult = await pool.query(actQuery, [day.id]);
              
//               return {
//                 ...day,
//                 activities: actResult.rows
//               };
//             })
//           );

//           return {
//             ...pkg,
//             destinations: destResult.rows,
//             itinerary: itineraryWithActivities
//           };
//         } catch (err) {
//           console.error(`Error fetching details for package ${pkg.id}:`, err.message);
//           return {
//             ...pkg,
//             destinations: [],
//             itinerary: []
//           };
//         }
//       })
//     );

//     console.log(`✅ Successfully processed ${packagesWithDetails.length} packages`);
//     res.json(packagesWithDetails);

//   } catch (error) {
//     console.error('❌ Error in getActivePackages:', error);
//     console.error('Error details:', error.message);
//     res.status(500).json({ 
//       error: 'Failed to fetch active packages',
//       details: error.message
//     });
//   }
// };

// // ============================================
// // GET VEHICLE INFO (for booking form)
// // ============================================
// exports.getVehicleInfo = async (req, res) => {
//   try {
//     console.log('🚗 Fetching vehicle info...');

//     // Check which columns exist
//     const columnCheckQuery = `
//       SELECT column_name 
//       FROM information_schema.columns 
//       WHERE table_name = 'driver_details' 
//         AND column_name IN ('vehicle_type', 'vehicle_model', 'vehicle_year', 'vehicle_color', 'availability_status');
//     `;
    
//     const columnCheck = await pool.query(columnCheckQuery);
//     const existingColumns = columnCheck.rows.map(row => row.column_name);
//     console.log('✅ Found columns:', existingColumns);

//     // Build query based on existing columns
//     let selectClause = `
//       dd.id,
//       dd.user_id,
//       dd.license_number,
//       dd.languages,
//       dd.years_of_experience,
//       dd.rating,
//       u.first_name,
//       u.last_name,
//       u.phone
//     `;

//     if (existingColumns.includes('vehicle_type')) selectClause += ', dd.vehicle_type';
//     if (existingColumns.includes('vehicle_model')) selectClause += ', dd.vehicle_model';
//     if (existingColumns.includes('vehicle_year')) selectClause += ', dd.vehicle_year';
//     if (existingColumns.includes('vehicle_color')) selectClause += ', dd.vehicle_color';
//     if (existingColumns.includes('availability_status')) selectClause += ', dd.availability_status';

//     const query = `
//       SELECT ${selectClause}
//       FROM driver_details dd
//       INNER JOIN users u ON dd.user_id = u.id
//       WHERE u.is_active = true
//       ORDER BY dd.id;
//     `;

//     const result = await pool.query(query);
//     console.log(`✅ Found ${result.rows.length} drivers`);

//     // Filter only those with vehicle info if column exists
//     let filteredResults = result.rows;
//     if (existingColumns.includes('vehicle_type') && existingColumns.includes('vehicle_model')) {
//       filteredResults = result.rows.filter(row => row.vehicle_type && row.vehicle_model);
//       console.log(`✅ ${filteredResults.length} drivers have vehicle information`);
//     }

//     res.json(filteredResults);

//   } catch (error) {
//     console.error('❌ Error in getVehicleInfo:', error);
//     console.error('Error details:', error.message);
//     res.status(500).json({ 
//       error: 'Failed to fetch vehicle information',
//       details: error.message
//     });
//   }
// };

// // ============================================
// // GET DESTINATIONS (for booking form)
// // ============================================
// exports.getDestinations = async (req, res) => {
//   try {
//     console.log('📍 Fetching destinations...');

//     // Check if table exists
//     const tableCheckQuery = `
//       SELECT EXISTS (
//         SELECT FROM information_schema.tables 
//         WHERE table_name = 'package_destinations'
//       );
//     `;
    
//     const tableCheck = await pool.query(tableCheckQuery);
    
//     if (!tableCheck.rows[0].exists) {
//       console.log('⚠️  package_destinations table does not exist');
//       return res.json([]);
//     }

//     const query = `
//       SELECT DISTINCT 
//         destination_code,
//         destination_name
//       FROM package_destinations
//       WHERE destination_code IS NOT NULL 
//         AND destination_name IS NOT NULL
//       ORDER BY destination_name;
//     `;

//     const result = await pool.query(query);
//     console.log(`✅ Found ${result.rows.length} unique destinations`);

//     res.json(result.rows);

//   } catch (error) {
//     console.error('❌ Error in getDestinations:', error);
//     console.error('Error details:', error.message);
//     res.status(500).json({ 
//       error: 'Failed to fetch destinations',
//       details: error.message
//     });
//   }
// };

// // ============================================
// // GET PACKAGE BY ID
// // ============================================
// exports.getPackageById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const query = `
//       SELECT 
//         p.*,
//         json_agg(
//           DISTINCT jsonb_build_object(
//             'id', pd.id,
//             'destination_code', pd.destination_code,
//             'destination_name', pd.destination_name,
//             'display_order', pd.display_order
//           ) ORDER BY pd.display_order
//         ) FILTER (WHERE pd.id IS NOT NULL) as destinations,
//         json_agg(
//           DISTINCT jsonb_build_object(
//             'id', pid.id,
//             'day_number', pid.day_number,
//             'title', pid.title,
//             'description', pid.description,
//             'highlights', pid.highlights,
//             'activities', (
//               SELECT json_agg(
//                 jsonb_build_object(
//                   'id', pia.id,
//                   'time_slot', pia.time_slot,
//                   'activity_type', pia.activity_type,
//                   'activity_name', pia.activity_name,
//                   'description', pia.description,
//                   'duration', pia.duration,
//                   'is_optional', pia.is_optional,
//                   'optional_cost', pia.optional_cost
//                 ) ORDER BY pia.display_order
//               )
//               FROM package_itinerary_activities pia
//               WHERE pia.day_id = pid.id
//             )
//           ) ORDER BY pid.day_number
//         ) FILTER (WHERE pid.id IS NOT NULL) as itinerary
//       FROM packages p
//       LEFT JOIN package_destinations pd ON p.id = pd.package_id
//       LEFT JOIN package_itinerary_days pid ON p.id = pid.package_id
//       WHERE p.id = $1
//       GROUP BY p.id;
//     `;

//     const result = await pool.query(query, [id]);
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: 'Package not found'
//       });
//     }

//     res.json({
//       success: true,
//       package: result.rows[0]
//     });
//   } catch (error) {
//     console.error('Error fetching package:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Failed to fetch package',
//       details: error.message 
//     });
//   }
// };

// // ============================================
// // CREATE PACKAGE
// // ============================================
// exports.createPackage = async (req, res) => {
//   const client = await pool.connect();
  
//   try {
//     await client.query('BEGIN');
    
//     const {
//       package_name,
//       package_code,
//       category,
//       description,
//       duration_days,
//       duration_nights,
//       hotel_stars,
//       min_travelers,
//       max_travelers,
//       min_price,
//       max_price,
//       single_supplement,
//       valid_from,
//       valid_to,
//       status,
//       inclusions,
//       exclusions,
//       terms_conditions,
//       created_by,
//       destinations,
//       itinerary
//     } = req.body;

//     // Insert package
//     const packageQuery = `
//       INSERT INTO packages (
//         package_name, package_code, category, description,
//         duration_days, duration_nights, hotel_stars,
//         min_travelers, max_travelers, min_price, max_price,
//         single_supplement, valid_from, valid_to, status,
//         inclusions, exclusions, terms_conditions, created_by
//       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
//       RETURNING *;
//     `;

//     const packageResult = await client.query(packageQuery, [
//       package_name, package_code, category, description,
//       duration_days, duration_nights, hotel_stars,
//       min_travelers, max_travelers, min_price, max_price,
//       single_supplement, valid_from, valid_to, status,
//       inclusions, exclusions, terms_conditions, created_by
//     ]);

//     const packageId = packageResult.rows[0].id;

//     // Insert destinations
//     if (destinations && destinations.length > 0) {
//       for (let i = 0; i < destinations.length; i++) {
//         await client.query(
//           `INSERT INTO package_destinations (package_id, destination_code, destination_name, display_order)
//            VALUES ($1, $2, $3, $4)`,
//           [packageId, destinations[i].code, destinations[i].name, i]
//         );
//       }
//     }

//     // Insert itinerary
//     if (itinerary && itinerary.length > 0) {
//       for (const day of itinerary) {
//         const dayResult = await client.query(
//           `INSERT INTO package_itinerary_days (package_id, day_number, title, description, highlights)
//            VALUES ($1, $2, $3, $4, $5)
//            RETURNING id`,
//           [packageId, day.day_number, day.title, day.description, day.highlights]
//         );

//         const dayId = dayResult.rows[0].id;

//         if (day.activities && day.activities.length > 0) {
//           for (let i = 0; i < day.activities.length; i++) {
//             const act = day.activities[i];
//             await client.query(
//               `INSERT INTO package_itinerary_activities (
//                 day_id, time_slot, activity_type, activity_name,
//                 description, duration, is_optional, optional_cost, display_order
//               ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
//               [dayId, act.time_slot, act.activity_type, act.activity_name,
//                act.description, act.duration, act.is_optional, act.optional_cost, i]
//             );
//           }
//         }
//       }
//     }

//     await client.query('COMMIT');

//     res.status(201).json({
//       success: true,
//       message: 'Package created successfully',
//       package: packageResult.rows[0]
//     });
//   } catch (error) {
//     await client.query('ROLLBACK');
//     console.error('Error creating package:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to create package',
//       details: error.message
//     });
//   } finally {
//     client.release();
//   }
// };

// // ============================================
// // UPDATE PACKAGE
// // ============================================
// exports.updatePackage = async (req, res) => {
//   const client = await pool.connect();
  
//   try {
//     await client.query('BEGIN');
    
//     const { id } = req.params;
//     const updateData = req.body;

//     const packageQuery = `
//       UPDATE packages
//       SET 
//         package_name = COALESCE($1, package_name),
//         category = COALESCE($2, category),
//         description = COALESCE($3, description),
//         duration_days = COALESCE($4, duration_days),
//         duration_nights = COALESCE($5, duration_nights),
//         hotel_stars = COALESCE($6, hotel_stars),
//         min_travelers = COALESCE($7, min_travelers),
//         max_travelers = COALESCE($8, max_travelers),
//         min_price = COALESCE($9, min_price),
//         max_price = COALESCE($10, max_price),
//         single_supplement = COALESCE($11, single_supplement),
//         valid_from = COALESCE($12, valid_from),
//         valid_to = COALESCE($13, valid_to),
//         status = COALESCE($14, status),
//         inclusions = COALESCE($15, inclusions),
//         exclusions = COALESCE($16, exclusions),
//         updated_at = CURRENT_TIMESTAMP
//       WHERE id = $17
//       RETURNING *;
//     `;

//     const result = await client.query(packageQuery, [
//       updateData.package_name,
//       updateData.category,
//       updateData.description,
//       updateData.duration_days,
//       updateData.duration_nights,
//       updateData.hotel_stars,
//       updateData.min_travelers,
//       updateData.max_travelers,
//       updateData.min_price,
//       updateData.max_price,
//       updateData.single_supplement,
//       updateData.valid_from,
//       updateData.valid_to,
//       updateData.status,
//       updateData.inclusions,
//       updateData.exclusions,
//       id
//     ]);

//     await client.query('COMMIT');

//     res.json({
//       success: true,
//       message: 'Package updated successfully',
//       package: result.rows[0]
//     });
//   } catch (error) {
//     await client.query('ROLLBACK');
//     console.error('Error updating package:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to update package',
//       details: error.message
//     });
//   } finally {
//     client.release();
//   }
// };

// // ============================================
// // UPDATE PACKAGE STATUS
// // ============================================
// exports.updatePackageStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const query = `
//       UPDATE packages
//       SET status = $1, updated_at = CURRENT_TIMESTAMP
//       WHERE id = $2
//       RETURNING *;
//     `;

//     const result = await pool.query(query, [status, id]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: 'Package not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Package status updated successfully',
//       package: result.rows[0]
//     });
//   } catch (error) {
//     console.error('Error updating package status:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to update package status',
//       details: error.message
//     });
//   }
// };

// // ============================================
// // DELETE PACKAGE
// // ============================================
// exports.deletePackage = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const query = `DELETE FROM packages WHERE id = $1 RETURNING id`;
//     const result = await pool.query(query, [id]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: 'Package not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Package deleted successfully'
//     });
//   } catch (error) {
//     console.error('Error deleting package:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to delete package',
//       details: error.message
//     });
//   }
// };

// // ============================================
// // BULK DELETE PACKAGES
// // ============================================
// exports.bulkDeletePackages = async (req, res) => {
//   try {
//     const { ids } = req.body;

//     if (!ids || !Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'Package IDs are required'
//       });
//     }

//     const query = `DELETE FROM packages WHERE id = ANY($1) RETURNING id`;
//     const result = await pool.query(query, [ids]);

//     res.json({
//       success: true,
//       message: `${result.rows.length} package(s) deleted successfully`,
//       deletedCount: result.rows.length
//     });
//   } catch (error) {
//     console.error('Error bulk deleting packages:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to delete packages',
//       details: error.message
//     });
//   }
// };

// // ============================================
// // GET STATISTICS
// // ============================================
// exports.getStatistics = async (req, res) => {
//   try {
//     const query = `
//       SELECT 
//         COUNT(*) as total_packages,
//         COUNT(CASE WHEN status = 'published' THEN 1 END) as published_packages,
//         COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_packages,
//         AVG(min_price) as avg_price
//       FROM packages;
//     `;

//     const result = await pool.query(query);

//     res.json({
//       success: true,
//       statistics: result.rows[0]
//     });
//   } catch (error) {
//     console.error('Error fetching statistics:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to fetch statistics',
//       details: error.message
//     });
//   }
// };


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
       ORDER BY id DESC 
       LIMIT 1`
    );

    const lastCode = result.rows.length > 0 ? result.rows[0].package_code : 'CTM-000';
    
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
    const query = `
      SELECT 
        p.*,
        COUNT(DISTINCT pd.id) as destination_count,
        json_agg(
          DISTINCT jsonb_build_object(
            'id', pd.id,
            'destination_code', pd.destination_code,
            'destination_name', pd.destination_name
          )
        ) FILTER (WHERE pd.id IS NOT NULL) as destinations
      FROM packages p
      LEFT JOIN package_destinations pd ON p.id = pd.package_id
      GROUP BY p.id
      ORDER BY p.created_at DESC;
    `;

    const result = await pool.query(query);
    res.json({
      success: true,
      packages: result.rows
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
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
    console.log(`📦 Fetching package ${id}...`);
    
    // Simple query first to check basic package exists
    const basicQuery = `
      SELECT * FROM packages WHERE id = $1;
    `;
    
    const basicResult = await pool.query(basicQuery, [id]);
    
    if (basicResult.rows.length === 0) {
      console.log(`❌ Package ${id} not found`);
      return res.status(404).json({
        success: false,
        error: 'Package not found'
      });
    }

    const pkg = basicResult.rows[0];
    console.log(`✅ Found package: ${pkg.package_name}`);
    
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
    const destResult = await pool.query(destQuery, [id]);

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
    const itinResult = await pool.query(itinQuery, [id]);

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

    const packageData = {
      ...pkg,
      destinations: destResult.rows,
      itinerary: itineraryWithActivities
    };

    res.json({
      success: true,
      package: packageData,
      data: packageData  // Include both formats for compatibility
    });

  } catch (error) {
    console.error(`❌ Error fetching package:`, error);
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
  try {
    const { id } = req.params;

    console.log('🗑️ Attempting to delete package with ID:', id);

    // Check if package has associated bookings
    const bookingCheck = await pool.query(
      'SELECT COUNT(*) as count FROM booking_form WHERE package_id = $1',
      [id]
    );

    if (parseInt(bookingCheck.rows[0].count) > 0) {
      console.log('⚠️ Cannot delete package - has associated bookings');
      return res.status(400).json({
        success: false,
        error: 'Cannot delete package with existing bookings',
        message: `This package has ${bookingCheck.rows[0].count} associated booking(s). Please handle those bookings first.`
      });
    }

    const query = `DELETE FROM packages WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      console.log('❌ Package not found with ID:', id);
      return res.status(404).json({
        success: false,
        error: 'Package not found'
      });
    }

    console.log('✅ Package deleted successfully! ID:', id);

    res.json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting package:', error);
    
    // Check if it's a foreign key constraint error
    if (error.code === '23503') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete package',
        message: 'This package is referenced by other records (bookings, itineraries, etc.). Please remove those references first.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to delete package',
      details: error.message
    });
  }
};

// ============================================
// BULK DELETE PACKAGES
// ============================================
exports.bulkDeletePackages = async (req, res) => {
  try {
    // Accept both 'ids' and 'package_ids' for compatibility
    const { ids, package_ids } = req.body;
    const packageIds = ids || package_ids;

    if (!packageIds || !Array.isArray(packageIds) || packageIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Package IDs are required'
      });
    }

    console.log('🗑️ Deleting packages with IDs:', packageIds);

    const query = `DELETE FROM packages WHERE id = ANY($1) RETURNING id`;
    const result = await pool.query(query, [packageIds]);

    console.log(`✅ Successfully deleted ${result.rows.length} package(s)`);

    res.json({
      success: true,
      message: `${result.rows.length} package(s) deleted successfully`,
      deletedCount: result.rows.length
    });
  } catch (error) {
    console.error('❌ Error bulk deleting packages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete packages',
      details: error.message
    });
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