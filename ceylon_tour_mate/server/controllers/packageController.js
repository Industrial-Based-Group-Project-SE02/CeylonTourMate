const Package = require('../models/Package');

// @desc    Get all packages with filters and pagination
// @route   GET /api/packages
exports.getAllPackages = async (req, res) => {
  try {
    const { 
      search = '',
      status = '',
      type = '',
      page = 1,
      limit = 10
    } = req.query;

    const filters = {
      search,
      status: status !== 'All Status' ? status : '',
      type: type !== 'All Types' ? type : '',
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const packages = await Package.getAll(filters);
    
    // Format the response to match frontend (ManagePackage.jsx) expectations
    const formattedPackages = packages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      type: pkg.type,
      price: pkg.base_price,
      duration: `${pkg.duration_days} ${pkg.duration_days === 1 ? 'Day' : 'Days'}`,
      status: pkg.status,
      stats: {
        views: pkg.views || 0,
        bookings: pkg.bookings || 0
      },
      updated: new Date(pkg.updated_at || pkg.created_at).toISOString().split('T')[0],
      createdAt: new Date(pkg.created_at).toISOString().split('T')[0],
      code: pkg.code,
      creator: pkg.creator_email ? {
        email: pkg.creator_email,
        name: `${pkg.creator_first_name || ''} ${pkg.creator_last_name || ''}`.trim()
      } : null
    }));

    // Get total count for pagination (using a high limit to get all for count)
    const allPackagesForCount = await Package.getAll({ ...filters, limit: 10000, page: 1 });
    const totalCount = allPackagesForCount.length;

    res.json({
      success: true,
      count: formattedPackages.length,
      total: totalCount,
      data: formattedPackages,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(totalCount / filters.limit)
      }
    });
  } catch (error) {
    console.error("Error getting packages:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch packages"
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/packages/stats
exports.getStatistics = async (req, res) => {
  try {
    const stats = await Package.getStatistics();
    
    res.json({
      success: true,
      data: {
        totalPackages: parseInt(stats.total_packages) || 0,
        totalBookings: parseInt(stats.total_bookings) || 0,
        activePackages: parseInt(stats.active_packages) || 0,
        totalViews: parseInt(stats.total_views) || 0
      }
    });
  } catch (error) {
    console.error("Error getting statistics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch statistics"
    });
  }
};

// @desc    Get single package by ID
// @route   GET /api/packages/:id
exports.getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const packageData = await Package.getById(id);
    
    if (!packageData) {
      return res.status(404).json({
        success: false,
        error: "Package not found"
      });
    }
    
    res.json({
      success: true,
      data: packageData
    });
  } catch (error) {
    console.error("Error getting package:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch package details"
    });
  }
};

// @desc    Create new package
// @route   POST /api/packages
exports.createPackage = async (req, res) => {
  try {
    // req.user.id should be provided by your auth middleware
    const userId = req.user?.id || 1; 
    
    // Map frontend camelCase to model expectations
    const packageData = {
      ...req.body,
      basePrice: req.body.basePrice || req.body.price,
      durationDays: req.body.durationDays || req.body.duration
    };
    
    const newPackage = await Package.create(packageData, userId);
    
    res.status(201).json({
      success: true,
      message: "Package created successfully",
      data: newPackage
    });
  } catch (error) {
    console.error("Error creating package:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create package: " + error.message
    });
  }
};

// @desc    Update package status (Active/Inactive)
// @route   PATCH /api/packages/:id/status
exports.updatePackageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ success: false, error: "Status is required" });
    }
    
    const updatedPackage = await Package.updateStatus(id, status);
    
    res.json({
      success: true,
      message: `Package marked as ${status}`,
      data: updatedPackage
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete single package
// @route   DELETE /api/packages/:id
exports.deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Package.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Package not found" });
    }
    
    res.json({
      success: true,
      message: "Package deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Bulk delete packages
// @route   POST /api/packages/bulk-delete
exports.bulkDeletePackages = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ success: false, error: "Invalid IDs provided" });
    }
    
    // Execute deletions in parallel
    await Promise.all(ids.map(id => Package.delete(id)));
    
    res.json({
      success: true,
      message: `${ids.length} packages deleted successfully`
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    res.status(500).json({ success: false, error: "Failed to delete some packages" });
  }
};


// In packageController.js, add this function:

// Update package
exports.updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get user ID from auth middleware (temporary: use 1 for testing)
    const userId = req.user?.id || 1;
    
    const packageData = {
      name: req.body.name,
      type: req.body.type,
      season: req.body.season || 'All Year',
      base_price: req.body.basePrice || req.body.base_price,
      min_price: req.body.minPrice || req.body.min_price,
      max_price: req.body.maxPrice || req.body.max_price,
      duration_days: req.body.durationDays || req.body.duration_days,
      min_travelers: req.body.minTravelers || req.body.min_travelers || 2,
      max_travelers: req.body.maxTravelers || req.body.max_travelers || 10,
      description: req.body.description || '',
      status: req.body.status || 'Active',
      features: req.body.features || [],
      bestFor: req.body.bestFor || [],
      inclusions: req.body.inclusions || [],
      exclusions: req.body.exclusions || [],
      itinerary: req.body.itinerary || [],
      hotels: req.body.hotels || [],
      destinations: req.body.destinations || []
    };
    
    const updatedPackage = await Package.update(id, packageData);
    
    res.json({
      success: true,
      message: "Package updated successfully",
      data: updatedPackage
    });
  } catch (error) {
    console.error("Error updating package:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update package: " + error.message
    });
  }
};