import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Edit, Trash2, CheckCircle, XCircle, Search, Plus, 
  Star, Hotel, MapPin, Users, Calendar, Eye, EyeOff,
  Download, Upload, MoreVertical, ChevronDown, ChevronUp, Tag,
  BarChart3, Settings, RefreshCw, Bed, Mountain, Globe, 
  Castle, Camera, Award, Clock, DollarSign, Share2, X, Sun
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [showNewPackageModal, setShowNewPackageModal] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('basic');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalBookings: 0,
    totalViews: 0
  });

  // New Package State
  const [newPackage, setNewPackage] = useState({
    name: '',
    type: 'Gold',
    season: 'All Year',
    durationDays: '',
    minTravelers: '',
    maxTravelers: '',
    basePrice: '',
    minPrice: '',
    maxPrice: '',
    description: '',
    features: '',
    bestFor: '',
    itinerary: [{ day: 1, title: '', description: '' }],
    hotels: [{ name: '', rating: '5 Star', nights: '', features: '' }],
    destinations: [{ name: '', type: 'Historical', highlights: '' }],
    inclusions: '',
    exclusions: ''
  });

  // Fetch packages on component mount
  useEffect(() => {
    fetchPackages();
    fetchStatistics();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/packages`, {
        params: {
          search: searchTerm,
          status: filterStatus,
          type: filterType,
          limit: 100
        }
      });
      
      const transformedPackages = response.data.data.map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        code: pkg.code,
        type: pkg.type,
        season: pkg.season,
        priceRange: `$${pkg.min_price} - $${pkg.max_price}`,
        basePrice: pkg.base_price,
        duration: `${pkg.duration_days} Days`,
        status: pkg.status,
        travelers: `${pkg.min_travelers}-${pkg.max_travelers}`,
        createdAt: new Date(pkg.created_at).toISOString().split('T')[0],
        lastUpdated: new Date(pkg.updated_at).toISOString().split('T')[0],
        views: pkg.views || 0,
        bookings: pkg.bookings || 0,
        features: pkg.features || [],
        popularity: pkg.popularity || 'medium',
        expanded: false,
        detailedInfo: {
          description: pkg.description,
          season: pkg.season,
          itinerary: pkg.itinerary || [],
          hotels: pkg.hotels || [],
          destinations: pkg.destinations || [],
          inclusions: pkg.inclusions || [],
          exclusions: pkg.exclusions || [],
          bestFor: pkg.best_for || []
        }
      }));
      
      setPackages(transformedPackages);
    } catch (error) {
      console.error('Error fetching packages:', error);
      alert('Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/packages/statistics`);
      setStats({
        total: parseInt(response.data.data.total_packages) || 0,
        active: parseInt(response.data.data.active_packages) || 0,
        totalBookings: parseInt(response.data.data.total_bookings) || 0,
        totalViews: parseInt(response.data.data.total_views) || 0
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  // Toggle functions
  const togglePackageExpansion = (id) => {
    setPackages(packages.map(pkg => 
      pkg.id === id ? { ...pkg, expanded: !pkg.expanded } : pkg
    ));
  };

  const togglePackageSelection = (id) => {
    setSelectedPackages(prev => 
      prev.includes(id) ? prev.filter(pkgId => pkgId !== id) : [...prev, id]
    );
  };

  const toggleAllPackages = () => {
    setSelectedPackages(prev => 
      prev.length === filteredPackages.length ? [] : filteredPackages.map(pkg => pkg.id)
    );
  };

  const togglePackageStatus = async (id) => {
    try {
      const pkg = packages.find(p => p.id === id);
      const newStatus = pkg.status === 'active' ? 'inactive' : 'active';
      
      await axios.patch(`${API_BASE_URL}/packages/${id}/status`, { status: newStatus });
      
      // Update local state
      setPackages(packages.map(p => 
        p.id === id ? { ...p, status: newStatus } : p
      ));
      
      // Refresh statistics
      fetchStatistics();
      
      alert(`Package ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating package status:', error);
      alert('Failed to update package status');
    }
  };

  // Filter packages
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || pkg.status === filterStatus;
    const matchesType = !filterType || pkg.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  // Handle create package
  const handleCreatePackage = async () => {
    try {
      const featuresArray = newPackage.features.split(',').map(f => f.trim()).filter(f => f);
      const bestForArray = newPackage.bestFor.split(',').map(b => b.trim()).filter(b => b);
      const inclusionsArray = newPackage.inclusions.split('\n').map(i => i.trim()).filter(i => i);
      const exclusionsArray = newPackage.exclusions.split('\n').map(e => e.trim()).filter(e => e);
      
      const packageData = {
        name: newPackage.name,
        type: newPackage.type,
        season: newPackage.season,
        basePrice: newPackage.basePrice,
        minPrice: newPackage.minPrice || newPackage.basePrice,
        maxPrice: newPackage.maxPrice || newPackage.basePrice,
        durationDays: newPackage.durationDays,
        minTravelers: newPackage.minTravelers || 2,
        maxTravelers: newPackage.maxTravelers || 10,
        description: newPackage.description,
        features: featuresArray,
        bestFor: bestForArray,
        inclusions: inclusionsArray,
        exclusions: exclusionsArray,
        itinerary: newPackage.itinerary.filter(day => day.title && day.description).map(day => ({
          day: parseInt(day.day),
          title: day.title,
          description: day.description
        })),
        hotels: newPackage.hotels.filter(h => h.name && h.nights).map(h => ({
          name: h.name,
          rating: h.rating,
          nights: parseInt(h.nights),
          features: h.features.split(',').map(f => f.trim()).filter(f => f)
        })),
        destinations: newPackage.destinations.filter(d => d.name).map(d => ({
          name: d.name,
          type: d.type,
          highlights: d.highlights.split(',').map(h => h.trim()).filter(h => h)
        }))
      };

      await axios.post(`${API_BASE_URL}/packages`, packageData);
      
      // Refresh packages and statistics
      fetchPackages();
      fetchStatistics();
      
      // Reset form and close modal
      setShowNewPackageModal(false);
      setActiveModalTab('basic');
      setNewPackage({
        name: '',
        type: 'Gold',
        season: 'All Year',
        durationDays: '',
        minTravelers: '',
        maxTravelers: '',
        basePrice: '',
        minPrice: '',
        maxPrice: '',
        description: '',
        features: '',
        bestFor: '',
        itinerary: [{ day: 1, title: '', description: '' }],
        hotels: [{ name: '', rating: '5 Star', nights: '', features: '' }],
        destinations: [{ name: '', type: 'Historical', highlights: '' }],
        inclusions: '',
        exclusions: ''
      });
      
      alert('Package created successfully!');
    } catch (error) {
      console.error('Error creating package:', error);
      alert(`Failed to create package: ${error.response?.data?.message || error.message}`);
    }
  };

  // Handle delete package
  const handleDeletePackage = async (id, name) => {
    if (window.confirm(`Delete package "${name}"?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/packages/${id}`);
        
        // Update local state
        setPackages(packages.filter(p => p.id !== id));
        setSelectedPackages(selectedPackages.filter(pkgId => pkgId !== id));
        
        // Refresh statistics
        fetchStatistics();
        
        alert('Package deleted successfully!');
      } catch (error) {
        console.error('Error deleting package:', error);
        alert('Failed to delete package');
      }
    }
  };

  // Helper functions for dynamic arrays
  const addItineraryDay = () => {
    setNewPackage({
      ...newPackage,
      itinerary: [...newPackage.itinerary, { day: newPackage.itinerary.length + 1, title: '', description: '' }]
    });
  };
  
  const removeItineraryDay = (index) => {
    const updatedItinerary = newPackage.itinerary.filter((_, i) => i !== index);
    setNewPackage({
      ...newPackage,
      itinerary: updatedItinerary.map((day, idx) => ({ ...day, day: idx + 1 }))
    });
  };
  
  const updateItineraryDay = (index, field, value) => {
    const updatedItinerary = [...newPackage.itinerary];
    updatedItinerary[index] = { ...updatedItinerary[index], [field]: value };
    setNewPackage({ ...newPackage, itinerary: updatedItinerary });
  };
  
  const addHotel = () => {
    setNewPackage({
      ...newPackage,
      hotels: [...newPackage.hotels, { name: '', rating: '5 Star', nights: '', features: '' }]
    });
  };
  
  const removeHotel = (index) => {
    setNewPackage({
      ...newPackage,
      hotels: newPackage.hotels.filter((_, i) => i !== index)
    });
  };
  
  const updateHotel = (index, field, value) => {
    const updatedHotels = [...newPackage.hotels];
    updatedHotels[index] = { ...updatedHotels[index], [field]: value };
    setNewPackage({ ...newPackage, hotels: updatedHotels });
  };
  
  const addDestination = () => {
    setNewPackage({
      ...newPackage,
      destinations: [...newPackage.destinations, { name: '', type: 'Historical', highlights: '' }]
    });
  };
  
  const removeDestination = (index) => {
    setNewPackage({
      ...newPackage,
      destinations: newPackage.destinations.filter((_, i) => i !== index)
    });
  };
  
  const updateDestination = (index, field, value) => {
    const updatedDestinations = [...newPackage.destinations];
    updatedDestinations[index] = { ...updatedDestinations[index], [field]: value };
    setNewPackage({ ...newPackage, destinations: updatedDestinations });
  };

  // Handle search and filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPackages();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus, filterType]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Travel Package Manager</h1>
            <p className="text-gray-600 mt-1">Manage all your travel packages in one place</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowNewPackageModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <Plus size={20} />
              <span>New Package</span>
            </button>
            <button 
              onClick={fetchPackages}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              <RefreshCw size={20} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm hover:-translate-y-1 transition">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
            <Tag size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Packages</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm hover:-translate-y-1 transition">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">{stats.active}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm hover:-translate-y-1 transition">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white">
            <Users size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalBookings}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm hover:-translate-y-1 transition">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white">
            <Eye size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalViews}</div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 w-full">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none text-sm"
              />
            </div>
            
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:border-blue-500 focus:outline-none w-full sm:w-auto"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:border-blue-500 focus:outline-none w-full sm:w-auto"
            >
              <option value="">All Types</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={fetchPackages}
              className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
            >
              <RefreshCw size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Packages Table */}
      <div className="px-8 py-6">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading packages...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedPackages.length === filteredPackages.length && filteredPackages.length > 0}
                        onChange={toggleAllPackages}
                        className="w-5 h-5 rounded"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Package Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stats</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Updated</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackages.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                        No packages found. {packages.length === 0 ? 'Create your first package!' : 'Try changing your filters.'}
                      </td>
                    </tr>
                  ) : (
                    filteredPackages.map((pkg) => (
                      <React.Fragment key={pkg.id}>
                        <tr className={`border-b border-gray-100 hover:bg-gray-50 transition ${selectedPackages.includes(pkg.id) ? 'bg-blue-50' : ''}`}>
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={selectedPackages.includes(pkg.id)}
                              onChange={() => togglePackageSelection(pkg.id)}
                              className="w-5 h-5 rounded"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-2 min-w-[300px]">
                              <div className="font-semibold text-gray-900">{pkg.name}</div>
                              <div className="text-xs text-gray-500 font-mono">{pkg.code}</div>
                              <div className="flex flex-wrap gap-1.5">
                                {pkg.features.slice(0, 2).map((feature, idx) => (
                                  <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                                    {feature}
                                  </span>
                                ))}
                                {pkg.features.length > 2 && (
                                  <span className="text-xs text-gray-400">+{pkg.features.length - 2} more</span>
                                )}
                              </div>
                              <button 
                                onClick={() => togglePackageExpansion(pkg.id)}
                                className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 font-medium mt-1 w-fit"
                              >
                                {pkg.expanded ? 'Show Less' : 'Read More'} 
                                {pkg.expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide ${
                              pkg.type === 'Gold' ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800' :
                              pkg.type === 'Silver' ? 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700' :
                              'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800'
                            }`}>
                              {pkg.type}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-semibold text-gray-900">{pkg.priceRange}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <DollarSign size={12} />
                              Base: ${pkg.basePrice}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 font-medium text-gray-900">
                              <Clock size={14} />
                              {pkg.duration}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <Users size={12} />
                              {pkg.travelers}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${
                              pkg.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {pkg.status === 'active' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                              {pkg.status === 'active' ? 'Active' : 'Inactive'}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Eye size={12} />
                                <span>{pkg.views}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Users size={12} />
                                <span>{pkg.bookings}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium text-sm text-gray-900">{pkg.lastUpdated}</div>
                            <div className="text-xs text-gray-500">Created: {pkg.createdAt}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition">
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => togglePackageStatus(pkg.id)}
                                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-amber-500 hover:text-amber-600 transition"
                              >
                                {pkg.status === 'active' ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                              <button 
                                onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-red-500 hover:text-red-600 transition"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Expanded Details */}
                        {pkg.expanded && (
                          <tr className="bg-gray-50">
                            <td colSpan="9" className="px-4 py-6">
                              <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                                  <h3 className="text-xl font-bold text-gray-900">Package Details: {pkg.name}</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-6">
                                  {/* Description */}
                                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                    <h4 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-3">
                                      <Globe size={18} />
                                      Description
                                    </h4>
                                    <p className="text-gray-700 leading-relaxed mb-3">{pkg.detailedInfo.description}</p>
                                    <div className="flex items-center flex-wrap gap-2 mb-3">
                                      <span className="text-sm text-gray-600">Best For:</span>
                                      {pkg.detailedInfo.bestFor.map((type, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                                          {type}
                                        </span>
                                      ))}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700 pt-3 border-t border-gray-200">
                                      <Sun size={16} className="text-amber-500" />
                                      <span className="font-medium">Season:</span>
                                      <span>{pkg.detailedInfo.season}</span>
                                    </div>
                                  </div>

                                  {/* Itinerary */}
                                  {pkg.detailedInfo.itinerary.length > 0 && (
                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                      <h4 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-4">
                                        <Calendar size={18} />
                                        Itinerary ({pkg.duration})
                                      </h4>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                        {pkg.detailedInfo.itinerary.map((day) => (
                                          <div key={day.day} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
                                            <div className="font-bold text-blue-600 mb-2">Day {day.day_number || day.day}</div>
                                            <div className="font-semibold text-sm text-gray-900 mb-1">{day.title}</div>
                                            <div className="text-xs text-gray-600">{day.description}</div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Hotels & Destinations */}
                                  {(pkg.detailedInfo.hotels.length > 0 || pkg.detailedInfo.destinations.length > 0) && (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                      {/* Hotels */}
                                      {pkg.detailedInfo.hotels.length > 0 && (
                                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                          <h4 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-4">
                                            <Hotel size={18} />
                                            Hotels & Accommodation
                                          </h4>
                                          <div className="grid gap-3">
                                            {pkg.detailedInfo.hotels.map((hotel, idx) => (
                                              <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
                                                <div className="flex justify-between items-start mb-2">
                                                  <div className="font-semibold text-sm text-gray-900">{hotel.hotel_name}</div>
                                                  <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                                                    <Star size={14} fill="currentColor" />
                                                    {hotel.rating}
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                                  <Bed size={14} />
                                                  {hotel.nights} Nights
                                                </div>
                                                {hotel.features && hotel.features.length > 0 && (
                                                  <div className="flex flex-wrap gap-1.5">
                                                    {hotel.features.map((feature, fIdx) => (
                                                      <span key={fIdx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                                        {feature}
                                                      </span>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Destinations */}
                                      {pkg.detailedInfo.destinations.length > 0 && (
                                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                          <h4 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-4">
                                            <MapPin size={18} />
                                            Visit Locations
                                          </h4>
                                          <div className="grid gap-3">
                                            {pkg.detailedInfo.destinations.map((dest, idx) => (
                                              <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
                                                <div className="flex items-center gap-2 font-semibold text-sm text-gray-900 mb-2">
                                                  {dest.destination_type === 'Historical' && <Castle size={16} className="text-amber-600" />}
                                                  {dest.destination_type === 'Wildlife' && <Mountain size={16} className="text-green-600" />}
                                                  {dest.destination_type === 'Religious' && <Award size={16} className="text-purple-600" />}
                                                  {dest.destination_type === 'Scenic' && <Camera size={16} className="text-blue-600" />}
                                                  {dest.destination_type === 'Beach' && <Sun size={16} className="text-cyan-600" />}
                                                  {dest.destination_name}
                                                </div>
                                                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium mb-2">
                                                  {dest.destination_type}
                                                </span>
                                                {dest.highlights && dest.highlights.length > 0 && (
                                                  <div className="flex flex-wrap gap-1.5">
                                                    {dest.highlights.map((highlight, hIdx) => (
                                                      <span key={hIdx} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs">
                                                        {highlight}
                                                      </span>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Inclusions & Exclusions */}
                                  {(pkg.detailedInfo.inclusions.length > 0 || pkg.detailedInfo.exclusions.length > 0) && (
                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {pkg.detailedInfo.inclusions.length > 0 && (
                                          <div>
                                            <h4 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-3">
                                              <CheckCircle size={18} className="text-green-600" />
                                              What's Included
                                            </h4>
                                            <ul className="space-y-2">
                                              {pkg.detailedInfo.inclusions.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                                                  {item}
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                        {pkg.detailedInfo.exclusions.length > 0 && (
                                          <div>
                                            <h4 className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-3">
                                              <XCircle size={18} className="text-red-600" />
                                              What's Excluded
                                            </h4>
                                            <ul className="space-y-2">
                                              {pkg.detailedInfo.exclusions.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                  <span className="text-red-600 font-bold mt-0.5">✗</span>
                                                  {item}
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="px-8 pb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-sm text-gray-600">
            Showing {filteredPackages.length} of {packages.length} packages
            {selectedPackages.length > 0 && ` • ${selectedPackages.length} selected`}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowNewPackageModal(true)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              <Plus size={16} />
              New Package
            </button>
          </div>
        </div>
      </div>

      {/* New Package Modal */}
      {showNewPackageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl my-8">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Create New Package</h3>
              <button 
                onClick={() => {
                  setShowNewPackageModal(false);
                  setActiveModalTab('basic');
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-6 overflow-x-auto">
              {[
                { key: 'basic', label: 'Basic Info' },
                { key: 'itinerary', label: 'Itinerary' },
                { key: 'hotels', label: 'Hotels' },
                { key: 'destinations', label: 'Destinations' },
                { key: 'details', label: 'Details' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveModalTab(tab.key)}
                  className={`px-4 py-3 border-b-2 font-medium transition whitespace-nowrap ${
                    activeModalTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 max-h-[calc(100vh-250px)] overflow-y-auto">
              
              {/* Basic Info Tab */}
              {activeModalTab === 'basic' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Package Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newPackage.name}
                      onChange={(e) => setNewPackage({...newPackage, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      placeholder="e.g., Golden Sri Lanka Tour"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Package Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newPackage.type}
                      onChange={(e) => setNewPackage({...newPackage, type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    >
                      <option value="Gold">Gold</option>
                      <option value="Silver">Silver</option>
                      <option value="Platinum">Platinum</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Season <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newPackage.season}
                      onChange={(e) => setNewPackage({...newPackage, season: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    >
                      <option value="All Year">All Year</option>
                      <option value="Winter">Winter (Dec - Feb)</option>
                      <option value="Summer">Summer (Jun - Aug)</option>
                      <option value="Spring/Autumn">Spring/Autumn</option>
                      <option value="Monsoon">Monsoon</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (Days) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newPackage.durationDays}
                      onChange={(e) => setNewPackage({...newPackage, durationDays: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      placeholder="7"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Travelers <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newPackage.minTravelers}
                      onChange={(e) => setNewPackage({...newPackage, minTravelers: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      placeholder="2"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Travelers <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newPackage.maxTravelers}
                      onChange={(e) => setNewPackage({...newPackage, maxTravelers: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      placeholder="10"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Base Price ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newPackage.basePrice}
                      onChange={(e) => setNewPackage({...newPackage, basePrice: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      placeholder="2000"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Price ($)
                    </label>
                    <input
                      type="number"
                      value={newPackage.minPrice}
                      onChange={(e) => setNewPackage({...newPackage, minPrice: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      placeholder="2000"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Price ($)
                    </label>
                    <input
                      type="number"
                      value={newPackage.maxPrice}
                      onChange={(e) => setNewPackage({...newPackage, maxPrice: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      placeholder="3000"
                      min="0"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Features (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newPackage.features}
                      onChange={(e) => setNewPackage({...newPackage, features: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      placeholder="e.g., 5-Star Hotels, Private Transport, English Guide"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Best For (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newPackage.bestFor}
                      onChange={(e) => setNewPackage({...newPackage, bestFor: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      placeholder="e.g., Couples, Families, Adventure Seekers"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newPackage.description}
                      onChange={(e) => setNewPackage({...newPackage, description: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      rows="4"
                      placeholder="Describe the package experience in detail..."
                    />
                  </div>
                </div>
              )}

              {/* Itinerary Tab */}
              {activeModalTab === 'itinerary' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-gray-900">Daily Itinerary</h4>
                    <button
                      onClick={addItineraryDay}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
                    >
                      <Plus size={16} />
                      Add Day
                    </button>
                  </div>
                  
                  {newPackage.itinerary.map((day, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-blue-600">Day {day.day}</span>
                        {newPackage.itinerary.length > 1 && (
                          <button
                            onClick={() => removeItineraryDay(index)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={day.title}
                            onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                            placeholder="e.g., Arrival in Colombo"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={day.description}
                            onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                            rows="2"
                            placeholder="Brief description of the day's activities"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Hotels Tab */}
              {activeModalTab === 'hotels' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-gray-900">Hotels & Accommodation</h4>
                    <button
                      onClick={addHotel}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
                    >
                      <Plus size={16} />
                      Add Hotel
                    </button>
                  </div>
                  
                  {newPackage.hotels.map((hotel, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-gray-900">Hotel {index + 1}</span>
                        {newPackage.hotels.length > 1 && (
                          <button
                            onClick={() => removeHotel(index)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hotel Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={hotel.name}
                            onChange={(e) => updateHotel(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                            placeholder="e.g., Cinnamon Grand Colombo"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rating
                          </label>
                          <select
                            value={hotel.rating}
                            onChange={(e) => updateHotel(index, 'rating', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                          >
                            <option value="5 Star">5 Star</option>
                            <option value="4 Star">4 Star</option>
                            <option value="3 Star">3 Star</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Boutique">Boutique</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nights <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={hotel.nights}
                            onChange={(e) => updateHotel(index, 'nights', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                            placeholder="2"
                            min="1"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Features (comma separated)
                          </label>
                          <input
                            type="text"
                            value={hotel.features}
                            onChange={(e) => updateHotel(index, 'features', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                            placeholder="e.g., Pool, Spa, Beach Access"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Destinations Tab */}
              {activeModalTab === 'destinations' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-gray-900">Visit Locations</h4>
                    <button
                      onClick={addDestination}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
                    >
                      <Plus size={16} />
                      Add Destination
                    </button>
                  </div>
                  
                  {newPackage.destinations.map((dest, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-gray-900">Destination {index + 1}</span>
                        {newPackage.destinations.length > 1 && (
                          <button
                            onClick={() => removeDestination(index)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Destination Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={dest.name}
                            onChange={(e) => updateDestination(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                            placeholder="e.g., Sigiriya Rock Fortress"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <select
                            value={dest.type}
                            onChange={(e) => updateDestination(index, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                          >
                            <option value="Historical">Historical</option>
                            <option value="Wildlife">Wildlife</option>
                            <option value="Religious">Religious</option>
                            <option value="Scenic">Scenic</option>
                            <option value="Beach">Beach</option>
                            <option value="Cultural">Cultural</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Highlights (comma separated)
                          </label>
                          <input
                            type="text"
                            value={dest.highlights}
                            onChange={(e) => updateDestination(index, 'highlights', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                            placeholder="e.g., Ancient Palace, Frescoes, Gardens"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Details Tab (Inclusions/Exclusions) */}
              {activeModalTab === 'details' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-green-600" />
                        What's Included
                      </span>
                    </label>
                    <textarea
                      value={newPackage.inclusions}
                      onChange={(e) => setNewPackage({...newPackage, inclusions: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      rows="12"
                      placeholder="Enter each inclusion on a new line:&#10;5-star accommodation&#10;Private AC vehicle with driver&#10;English speaking guide&#10;All entrance fees"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter each item on a new line</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <XCircle size={18} className="text-red-600" />
                        What's Excluded
                      </span>
                    </label>
                    <textarea
                      value={newPackage.exclusions}
                      onChange={(e) => setNewPackage({...newPackage, exclusions: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      rows="12"
                      placeholder="Enter each exclusion on a new line:&#10;International flights&#10;Travel insurance&#10;Personal expenses&#10;Tips for guide & driver"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter each item on a new line</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => {
                  const tabs = ['basic', 'itinerary', 'hotels', 'destinations', 'details'];
                  const currentIndex = tabs.indexOf(activeModalTab);
                  if (currentIndex > 0) {
                    setActiveModalTab(tabs[currentIndex - 1]);
                  }
                }}
                disabled={activeModalTab === 'basic'}
                className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowNewPackageModal(false);
                    setActiveModalTab('basic');
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                
                {activeModalTab === 'details' ? (
                  <button
                    onClick={handleCreatePackage}
                    disabled={!newPackage.name || !newPackage.durationDays || !newPackage.basePrice || !newPackage.description}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Package
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const tabs = ['basic', 'itinerary', 'hotels', 'destinations', 'details'];
                      const currentIndex = tabs.indexOf(activeModalTab);
                      setActiveModalTab(tabs[currentIndex + 1]);
                    }}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePackages;