// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   Edit, Trash2, CheckCircle, XCircle, Search, Plus, 
//   Star, Hotel, MapPin, Users, Calendar, Eye, EyeOff,
//   Download, Upload, MoreVertical, ChevronDown, ChevronUp, Tag,
//   BarChart3, Settings, RefreshCw, Bed, Mountain, Globe, 
//   Castle, Camera, Award, Clock, DollarSign, Share2, X, Sun
// } from 'lucide-react';
// import DashboardLayout from '../components/DashboardLayout';
// const API_BASE_URL = 'http://localhost:5000/api';

// const ManagePackages = () => {
//   const [packages, setPackages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('');
//   const [filterType, setFilterType] = useState('');
//   const [selectedPackages, setSelectedPackages] = useState([]);
//   const [showNewPackageModal, setShowNewPackageModal] = useState(false);
//   const [activeModalTab, setActiveModalTab] = useState('basic');
//   const [stats, setStats] = useState({
//     total: 0,
//     active: 0,
//     totalBookings: 0,
//     totalViews: 0
//   });

//   const AVAILABLE_FEATURES = [
//     "5-Star Hotels",
//     "Private Transport",
//     "English Speaking Guide",
//     "All Meals Included",
//     "Flight Tickets",
//     "Travel Insurance",
//     "Visa Assistance",
//     "Luxury Accommodation",
//     "Spa & Wellness",
//     "Adventure Activities",
//     "Cultural Experiences",
//     "Beach Access",
//     "City Tours",
//     "Mountain Trekking",
//     "Wildlife Safari"
//   ];

//   const BEST_FOR_OPTIONS = [
//     { value: "Couples", label: "Couples" },
//     { value: "Families", label: "Families" },
//     { value: "Adventure Seekers", label: "Adventure Seekers" },
//     { value: "Solo Travelers", label: "Solo Travelers" },
//     { value: "Business Travelers", label: "Business Travelers" },
//     { value: "Luxury Travelers", label: "Luxury Travelers" },
//     { value: "Budget Travelers", label: "Budget Travelers" },
//     { value: "Senior Citizens", label: "Senior Citizens" }
//   ];

//   // Predefined options for dropdowns
//   const ITINERARY_ACTIVITIES = [
//     { value: "arrival", label: "Arrival & Airport Transfer" },
//     { value: "city-tour", label: "City Tour" },
//     { value: "cultural-visit", label: "Cultural Site Visit" },
//     { value: "wildlife-safari", label: "Wildlife Safari" },
//     { value: "beach-day", label: "Beach Day & Relaxation" },
//     { value: "mountain-trek", label: "Mountain Trekking" },
//     { value: "temple-visit", label: "Temple/Religious Site Visit" },
//     { value: "shopping", label: "Shopping & Local Market" },
//     { value: "food-tour", label: "Food & Culinary Tour" },
//     { value: "adventure", label: "Adventure Activities" },
//     { value: "historical-site", label: "Historical Site Visit" },
//     { value: "departure", label: "Departure & Airport Transfer" }
//   ];

//   const HOTEL_OPTIONS = [
//     { value: "Cinnamon Grand Colombo", label: "Cinnamon Grand Colombo" },
//     { value: "Shangri-La Colombo", label: "Shangri-La Colombo" },
//     { value: "Galle Face Hotel", label: "Galle Face Hotel" },
//     { value: "Cinnamon Bentota Beach", label: "Cinnamon Bentota Beach" },
//     { value: "Heritance Kandalama", label: "Heritance Kandalama" },
//     { value: "Cinnamon Lodge Habarana", label: "Cinnamon Lodge Habarana" },
//     { value: "Jetwing Vil Uyana", label: "Jetwing Vil Uyana" },
//     { value: "Earl's Regency Kandy", label: "Earl's Regency Kandy" },
//     { value: "The Fortress Resort & Spa", label: "The Fortress Resort & Spa" },
//     { value: "Araliya Green Hills Hotel", label: "Araliya Green Hills Hotel" }
//   ];

//   const DESTINATION_OPTIONS = [
//     { value: "Sigiriya Rock Fortress", label: "Sigiriya Rock Fortress" },
//     { value: "Temple of the Sacred Tooth Relic", label: "Temple of the Sacred Tooth Relic" },
//     { value: "Yala National Park", label: "Yala National Park" },
//     { value: "Ella Rock", label: "Ella Rock" },
//     { value: "Galle Fort", label: "Galle Fort" },
//     { value: "Dambulla Cave Temple", label: "Dambulla Cave Temple" },
//     { value: "Polonnaruwa Ancient City", label: "Polonnaruwa Ancient City" },
//     { value: "Anuradhapura Sacred City", label: "Anuradhapura Sacred City" },
//     { value: "Mirissa Beach", label: "Mirissa Beach" },
//     { value: "Horton Plains National Park", label: "Horton Plains National Park" },
//     { value: "Adam's Peak", label: "Adam's Peak" },
//     { value: "Bentota Beach", label: "Bentota Beach" }
//   ];

//   const DESTINATION_TYPE_OPTIONS = [
//     { value: "Historical", label: "Historical", icon: <Castle size={16} className="text-amber-600" /> },
//     { value: "Wildlife", label: "Wildlife", icon: <Mountain size={16} className="text-green-600" /> },
//     { value: "Religious", label: "Religious", icon: <Award size={16} className="text-purple-600" /> },
//     { value: "Scenic", label: "Scenic", icon: <Camera size={16} className="text-blue-600" /> },
//     { value: "Beach", label: "Beach", icon: <Sun size={16} className="text-cyan-600" /> },
//     { value: "Cultural", label: "Cultural", icon: <Globe size={16} className="text-indigo-600" /> },
//     { value: "Adventure", label: "Adventure", icon: <Award size={16} className="text-red-600" /> }
//   ];

//   const HOTEL_RATING_OPTIONS = [
//     { value: "5 Star", label: "⭐ ⭐ ⭐ ⭐ ⭐ 5 Star" },
//     { value: "4 Star", label: "⭐ ⭐ ⭐ ⭐ 4 Star" },
//     { value: "3 Star", label: "⭐ ⭐ ⭐ 3 Star" },
//     { value: "Luxury", label: "🏨 Luxury" },
//     { value: "Boutique", label: "🏛️ Boutique" },
//     { value: "Resort", label: "🏖️ Resort" },
//     { value: "Budget", label: "💰 Budget" }
//   ];

//   const HOTEL_FEATURES_OPTIONS = [
//     "Swimming Pool",
//     "Spa & Wellness Center",
//     "Beach Access",
//     "Free WiFi",
//     "Restaurant & Bar",
//     "Fitness Center",
//     "Room Service",
//     "Air Conditioning",
//     "Sea View",
//     "Garden View",
//     "Parking",
//     "Conference Facilities",
//     "Kids Club",
//     "Airport Shuttle"
//   ];

//   // New Package State
//   const [newPackage, setNewPackage] = useState({
//     name: '',
//     type: 'Gold',
//     season: 'All Year',
//     durationDays: '',
//     minTravelers: '',
//     maxTravelers: '',
//     basePrice: '',
//     minPrice: '',
//     maxPrice: '',
//     description: '',
//     selectedFeatures: [],
//     bestFor: 'Couples',
//     itinerary: [{ day: 1, title: '', description: '', activityType: '' }],
//     hotels: [{ name: '', rating: '5 Star', nights: '', features: [], customName: '' }],
//     destinations: [{ name: '', type: 'Historical', highlights: [] }],
//     inclusions: '',
//     exclusions: ''
//   });

//   // Helper functions for feature selection
//   const handleFeatureToggle = (feature) => {
//     setNewPackage(prev => {
//       if (prev.selectedFeatures.includes(feature)) {
//         return {
//           ...prev,
//           selectedFeatures: prev.selectedFeatures.filter(f => f !== feature)
//         };
//       } else {
//         return {
//           ...prev,
//           selectedFeatures: [...prev.selectedFeatures, feature]
//         };
//       }
//     });
//   };

//   const handleBestForChange = (value) => {
//     setNewPackage(prev => ({
//       ...prev,
//       bestFor: value
//     }));
//   };

//   // Helper functions for hotel features
//   const handleHotelFeatureToggle = (index, feature) => {
//     const updatedHotels = [...newPackage.hotels];
//     const hotelFeatures = updatedHotels[index].features;
    
//     if (hotelFeatures.includes(feature)) {
//       updatedHotels[index] = {
//         ...updatedHotels[index],
//         features: hotelFeatures.filter(f => f !== feature)
//       };
//     } else {
//       updatedHotels[index] = {
//         ...updatedHotels[index],
//         features: [...hotelFeatures, feature]
//       };
//     }
    
//     setNewPackage({ ...newPackage, hotels: updatedHotels });
//   };

//   // Helper functions for destination highlights
//   const handleDestinationHighlightToggle = (index, highlight) => {
//     const updatedDestinations = [...newPackage.destinations];
//     const destinationHighlights = updatedDestinations[index].highlights;
    
//     if (destinationHighlights.includes(highlight)) {
//       updatedDestinations[index] = {
//         ...updatedDestinations[index],
//         highlights: destinationHighlights.filter(h => h !== highlight)
//       };
//     } else {
//       updatedDestinations[index] = {
//         ...updatedDestinations[index],
//         highlights: [...destinationHighlights, highlight]
//       };
//     }
    
//     setNewPackage({ ...newPackage, destinations: updatedDestinations });
//   };

//   // Fetch packages on component mount
//   useEffect(() => {
//     fetchPackages();
//     fetchStatistics();
//   }, []);

//   const fetchPackages = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_BASE_URL}/packages`, {
//         params: {
//           search: searchTerm,
//           status: filterStatus,
//           type: filterType,
//           limit: 100
//         }
//       });
      
//       const transformedPackages = response.data.data.map(pkg => ({
//         id: pkg.id,
//         name: pkg.name,
//         code: pkg.code || `PKG-${pkg.id}`,
//         type: pkg.type,
//         priceRange: pkg.price ? `$${pkg.price}` : 'N/A',
//         basePrice: pkg.price || 0,
//         duration: pkg.duration || 'N/A',
//         status: pkg.status ? pkg.status.toLowerCase() : 'inactive',
//         createdAt: pkg.createdAt ? new Date(pkg.createdAt).toISOString().split('T')[0] : 'Pending',
//         lastUpdated: pkg.updated ? new Date(pkg.updated).toISOString().split('T')[0] : 'Pending',
//         views: pkg.views || 0,
//         bookings: pkg.bookings || 0,
//         features: pkg.features || [],
//         popularity: pkg.popularity || 'medium',
//         expanded: false,
//         detailedInfo: {
//           description: pkg.description,
//           season: pkg.season,
//           itinerary: pkg.itinerary || [],
//           hotels: pkg.hotels || [],
//           destinations: pkg.destinations || [],
//           inclusions: pkg.inclusions || [],
//           exclusions: pkg.exclusions || [],
//           bestFor: pkg.best_for || []
//         }
//       }));
      
//       setPackages(transformedPackages);
//     } catch (error) {
//       console.error('Error fetching packages:', error);
//       alert('Failed to fetch packages');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStatistics = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/packages/statistics`);
//       setStats({
//         total: parseInt(response.data.data.total_packages) || 0,
//         active: parseInt(response.data.data.active_packages) || 0,
//         totalBookings: parseInt(response.data.data.total_bookings) || 0,
//         totalViews: parseInt(response.data.data.total_views) || 0
//       });
//     } catch (error) {
//       console.error('Error fetching statistics:', error);
//     }
//   };

//   // Toggle functions
//   const togglePackageExpansion = (id) => {
//     setPackages(packages.map(pkg => 
//       pkg.id === id ? { ...pkg, expanded: !pkg.expanded } : pkg
//     ));
//   };

//   const togglePackageSelection = (id) => {
//     setSelectedPackages(prev => 
//       prev.includes(id) ? prev.filter(pkgId => pkgId !== id) : [...prev, id]
//     );
//   };

//   const toggleAllPackages = () => {
//     setSelectedPackages(prev => 
//       prev.length === filteredPackages.length ? [] : filteredPackages.map(pkg => pkg.id)
//     );
//   };

//   const togglePackageStatus = async (id) => {
//     try {
//       const pkg = packages.find(p => p.id === id);
//       const newStatus = pkg.status === 'active' ? 'inactive' : 'active';
      
//       await axios.patch(`${API_BASE_URL}/packages/${id}/status`, { status: newStatus });
      
//       setPackages(packages.map(p => 
//         p.id === id ? { ...p, status: newStatus } : p
//       ));
      
//       fetchStatistics();
      
//       alert(`Package ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
//     } catch (error) {
//       console.error('Error updating package status:', error);
//       alert('Failed to update package status');
//     }
//   };

//   // Filter packages
//   const filteredPackages = packages.filter(pkg => {
//     const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          pkg.code.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = !filterStatus || pkg.status === filterStatus;
//     const matchesType = !filterType || pkg.type.toLowerCase() === filterType.toLowerCase();
//     return matchesSearch && matchesStatus && matchesType;
//   });

//   // Handle create package
//   const handleCreatePackage = async () => {
//     try {
//       const featuresArray = newPackage.selectedFeatures;
//       const bestForArray = [newPackage.bestFor];
//       const inclusionsArray = newPackage.inclusions.split('\n').map(i => i.trim()).filter(i => i);
//       const exclusionsArray = newPackage.exclusions.split('\n').map(e => e.trim()).filter(e => e);
      
//       const packageData = {
//         name: newPackage.name,
//         type: newPackage.type,
//         season: newPackage.season,
//         basePrice: newPackage.basePrice,
//         minPrice: newPackage.minPrice || newPackage.basePrice,
//         maxPrice: newPackage.maxPrice || newPackage.basePrice,
//         durationDays: newPackage.durationDays,
//         minTravelers: newPackage.minTravelers || 2,
//         maxTravelers: newPackage.maxTravelers || 10,
//         description: newPackage.description,
//         features: featuresArray,
//         bestFor: bestForArray,
//         inclusions: inclusionsArray,
//         exclusions: exclusionsArray,
//         itinerary: newPackage.itinerary.filter(day => day.title && day.description).map(day => ({
//           day: parseInt(day.day),
//           title: day.title,
//           description: day.description,
//           activityType: day.activityType
//         })),
//         hotels: newPackage.hotels.filter(h => h.name && h.nights).map(h => ({
//           name: h.name || h.customName,
//           rating: h.rating,
//           nights: parseInt(h.nights),
//           features: h.features
//         })),
//         destinations: newPackage.destinations.filter(d => d.name).map(d => ({
//           name: d.name,
//           type: d.type,
//           highlights: d.highlights
//         }))
//       };

//       await axios.post(`${API_BASE_URL}/packages`, packageData);
      
//       // Refresh packages and statistics
//       fetchPackages();
//       fetchStatistics();
      
//       // Reset form and close modal
//       setShowNewPackageModal(false);
//       setActiveModalTab('basic');
//       setNewPackage({
//         name: '',
//         type: 'Gold',
//         season: 'All Year',
//         durationDays: '',
//         minTravelers: '',
//         maxTravelers: '',
//         basePrice: '',
//         minPrice: '',
//         maxPrice: '',
//         description: '',
//         selectedFeatures: [],
//         bestFor: 'Couples',
//         itinerary: [{ day: 1, title: '', description: '', activityType: '' }],
//         hotels: [{ name: '', rating: '5 Star', nights: '', features: [], customName: '' }],
//         destinations: [{ name: '', type: 'Historical', highlights: [] }],
//         inclusions: '',
//         exclusions: ''
//       });
      
//       alert('Package created successfully!');
//     } catch (error) {
//       console.error('Error creating package:', error);
//       alert(`Failed to create package: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   // Handle delete package
//   const handleDeletePackage = async (id, name) => {
//     if (window.confirm(`Delete package "${name}"?`)) {
//       try {
//         await axios.delete(`${API_BASE_URL}/packages/${id}`);
        
//         setPackages(packages.filter(p => p.id !== id));
//         setSelectedPackages(selectedPackages.filter(pkgId => pkgId !== id));
        
//         fetchStatistics();
        
//         alert('Package deleted successfully!');
//       } catch (error) {
//         console.error('Error deleting package:', error);
//         alert('Failed to delete package');
//       }
//     }
//   };

//   // Helper functions for dynamic arrays
//   const addItineraryDay = () => {
//     setNewPackage({
//       ...newPackage,
//       itinerary: [...newPackage.itinerary, { 
//         day: newPackage.itinerary.length + 1, 
//         title: '', 
//         description: '', 
//         activityType: '' 
//       }]
//     });
//   };
  
//   const removeItineraryDay = (index) => {
//     const updatedItinerary = newPackage.itinerary.filter((_, i) => i !== index);
//     setNewPackage({
//       ...newPackage,
//       itinerary: updatedItinerary.map((day, idx) => ({ ...day, day: idx + 1 }))
//     });
//   };
  
//   const updateItineraryDay = (index, field, value) => {
//     const updatedItinerary = [...newPackage.itinerary];
//     updatedItinerary[index] = { ...updatedItinerary[index], [field]: value };
//     setNewPackage({ ...newPackage, itinerary: updatedItinerary });
//   };
  
//   const addHotel = () => {
//     setNewPackage({
//       ...newPackage,
//       hotels: [...newPackage.hotels, { 
//         name: '', 
//         rating: '5 Star', 
//         nights: '', 
//         features: [], 
//         customName: '' 
//       }]
//     });
//   };
  
//   const removeHotel = (index) => {
//     setNewPackage({
//       ...newPackage,
//       hotels: newPackage.hotels.filter((_, i) => i !== index)
//     });
//   };
  
//   const updateHotel = (index, field, value) => {
//     const updatedHotels = [...newPackage.hotels];
//     updatedHotels[index] = { ...updatedHotels[index], [field]: value };
//     setNewPackage({ ...newPackage, hotels: updatedHotels });
//   };
  
//   const addDestination = () => {
//     setNewPackage({
//       ...newPackage,
//       destinations: [...newPackage.destinations, { 
//         name: '', 
//         type: 'Historical', 
//         highlights: [] 
//       }]
//     });
//   };
  
//   const removeDestination = (index) => {
//     setNewPackage({
//       ...newPackage,
//       destinations: newPackage.destinations.filter((_, i) => i !== index)
//     });
//   };
  
//   const updateDestination = (index, field, value) => {
//     const updatedDestinations = [...newPackage.destinations];
//     updatedDestinations[index] = { ...updatedDestinations[index], [field]: value };
//     setNewPackage({ ...newPackage, destinations: updatedDestinations });
//   };

//   // Handle search and filter changes
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchPackages();
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [searchTerm, filterStatus, filterType]);
//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex justify-center items-center h-64">
//           <i className="text-4xl text-orange-500 fas fa-spinner fa-spin"></i>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 shadow-sm">
//         <div className="flex flex-col gap-4 justify-between items-start px-8 py-6 md:flex-row md:items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Travel Package Manager</h1>
//             <p className="mt-1 text-gray-600">Manage all your travel packages in one place</p>
//           </div>
//           <div className="flex gap-3">
//             <button 
//               onClick={() => setShowNewPackageModal(true)}
//               className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
//             >
//               <Plus size={20} />
//               <span>New Package</span>
//             </button>
//             <button 
//               onClick={fetchPackages}
//               className="flex gap-2 items-center px-6 py-3 font-medium text-gray-700 bg-white rounded-xl border border-gray-200 transition hover:bg-gray-50"
//             >
//               <RefreshCw size={20} />
//               <span>Refresh</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Quick Stats */}
//       <div className="grid grid-cols-1 gap-4 px-8 py-6 sm:grid-cols-2 lg:grid-cols-4">
//         <div className="flex gap-4 items-center p-5 bg-white rounded-xl shadow-sm transition hover:-translate-y-1">
//           <div className="flex justify-center items-center w-12 h-12 text-white bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
//             <Tag size={24} />
//           </div>
//           <div>
//             <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
//             <div className="text-sm text-gray-600">Total Packages</div>
//           </div>
//         </div>
        
//         <div className="flex gap-4 items-center p-5 bg-white rounded-xl shadow-sm transition hover:-translate-y-1">
//           <div className="flex justify-center items-center w-12 h-12 text-white bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
//             <CheckCircle size={24} />
//           </div>
//           <div>
//             <div className="text-3xl font-bold text-gray-900">{stats.active}</div>
//             <div className="text-sm text-gray-600">Active</div>
//           </div>
//         </div>
        
//         <div className="flex gap-4 items-center p-5 bg-white rounded-xl shadow-sm transition hover:-translate-y-1">
//           <div className="flex justify-center items-center w-12 h-12 text-white bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
//             <Users size={24} />
//           </div>
//           <div>
//             <div className="text-3xl font-bold text-gray-900">{stats.totalBookings}</div>
//             <div className="text-sm text-gray-600">Total Bookings</div>
//           </div>
//         </div>
        
//         <div className="flex gap-4 items-center p-5 bg-white rounded-xl shadow-sm transition hover:-translate-y-1">
//           <div className="flex justify-center items-center w-12 h-12 text-white bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
//             <Eye size={24} />
//           </div>
//           <div>
//             <div className="text-3xl font-bold text-gray-900">{stats.totalViews}</div>
//             <div className="text-sm text-gray-600">Total Views</div>
//           </div>
//         </div>
//       </div>

//       {/* Toolbar */}
//       <div className="px-8 py-4 bg-white border-b border-gray-200">
//         <div className="flex flex-col gap-4 justify-between items-start lg:flex-row lg:items-center">
//           <div className="flex flex-col flex-1 gap-4 items-start w-full sm:flex-row sm:items-center">
//             <div className="relative flex-1 w-full max-w-md">
//               <Search className="absolute left-3 top-1/2 text-gray-400 -translate-y-1/2" size={20} />
//               <input
//                 type="text"
//                 placeholder="Search by name or code..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none text-sm"
//               />
//             </div>
            
//             <select 
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:border-blue-500 focus:outline-none w-full sm:w-auto"
//             >
//               <option value="">All Status</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
            
//             <select 
//               value={filterType}
//               onChange={(e) => setFilterType(e.target.value)}
//               className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:border-blue-500 focus:outline-none w-full sm:w-auto"
//             >
//               <option value="">All Types</option>
//               <option value="Gold">Gold</option>
//               <option value="Silver">Silver</option>
//               <option value="Platinum">Platinum</option>
//             </select>
//           </div>
          
//           <div className="flex gap-2 items-center">
//             <button 
//               onClick={fetchPackages}
//               className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
//             >
//               <RefreshCw size={20} className="text-gray-600" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Packages Table */}
//       <div className="px-8 py-6">
//         {loading ? (
//           <div className="flex justify-center items-center p-8 bg-white rounded-xl shadow-sm">
//             <div className="text-center">
//               <div className="mx-auto w-12 h-12 rounded-full border-b-2 border-blue-500 animate-spin"></div>
//               <p className="mt-4 text-gray-600">Loading packages...</p>
//             </div>
//           </div>
//         ) : (
//           <div className="overflow-hidden bg-white rounded-xl shadow-sm">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b-2 border-gray-200">
//                   <tr>
//                     <th className="px-4 py-3 text-left">
//                       <input
//                         type="checkbox"
//                         checked={selectedPackages.length === filteredPackages.length && filteredPackages.length > 0}
//                         onChange={toggleAllPackages}
//                         className="w-5 h-5 rounded"
//                       />
//                     </th>
//                     <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">Package Name</th>
//                     <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">Type</th>
//                     <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">Price</th>
//                     <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">Duration</th>
//                     <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">Status</th>
//                     <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">Stats</th>
//                     <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">Updated</th>
//                     <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredPackages.length === 0 ? (
//                     <tr>
//                       <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
//                         No packages found. {packages.length === 0 ? 'Create your first package!' : 'Try changing your filters.'}
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredPackages.map((pkg) => (
//                       <React.Fragment key={pkg.id}>
//                         <tr className={`border-b border-gray-100 hover:bg-gray-50 transition ${selectedPackages.includes(pkg.id) ? 'bg-blue-50' : ''}`}>
//                           <td className="px-4 py-4">
//                             <input
//                               type="checkbox"
//                               checked={selectedPackages.includes(pkg.id)}
//                               onChange={() => togglePackageSelection(pkg.id)}
//                               className="w-5 h-5 rounded"
//                             />
//                           </td>
//                           <td className="px-4 py-4">
//                             <div className="flex flex-col gap-2 min-w-[300px]">
//                               <div className="font-semibold text-gray-900">{pkg.name}</div>
//                               <div className="font-mono text-xs text-gray-500">{pkg.code}</div>
//                               <div className="flex flex-wrap gap-1.5">
//                                 {pkg.features.slice(0, 2).map((feature, idx) => (
//                                   <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
//                                     {feature}
//                                   </span>
//                                 ))}
//                                 {pkg.features.length > 2 && (
//                                   <span className="text-xs text-gray-400">+{pkg.features.length - 2} more</span>
//                                 )}
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-4 py-4">
//                             <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide ${
//                               pkg.type === 'Gold' ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800' :
//                               pkg.type === 'Silver' ? 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700' :
//                               'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800'
//                             }`}>
//                               {pkg.type}
//                             </span>
//                           </td>
//                           <td className="px-4 py-4">
//                             <div className="font-semibold text-gray-900">{pkg.priceRange}</div>
//                             <div className="flex gap-1 items-center text-xs text-gray-500">
//                               <DollarSign size={12} />
//                               Base: ${pkg.basePrice}
//                             </div>
//                           </td>
//                           <td className="px-4 py-4">
//                             <div className="flex items-center gap-1.5 font-medium text-gray-900">
//                               <Clock size={14} />
//                               {pkg.duration}
//                             </div>
//                             <div className="flex gap-1 items-center mt-1 text-xs text-gray-500">
//                               <Users size={12} />
//                               {pkg.travelers}
//                             </div>
//                           </td>
//                           <td className="px-4 py-4">
//                             <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${
//                               pkg.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                             }`}>
//                               {pkg.status === 'active' ? <CheckCircle size={14} /> : <XCircle size={14} />}
//                               {pkg.status === 'active' ? 'Active' : 'Inactive'}
//                             </div>
//                           </td>
//                           <td className="px-4 py-4">
//                             <div className="flex flex-col gap-1">
//                               <div className="flex gap-2 items-center text-xs text-gray-600">
//                                 <Eye size={12} />
//                                 <span>{pkg.views}</span>
//                               </div>
//                               <div className="flex gap-2 items-center text-xs text-gray-600">
//                                 <Users size={12} />
//                                 <span>{pkg.bookings}</span>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-4 py-4">
//                             <div className="text-sm font-medium text-gray-900">{pkg.lastUpdated}</div>
//                             <div className="text-xs text-gray-500">Created: {pkg.createdAt}</div>
//                           </td>
//                           <td className="px-4 py-4">
//                             <div className="flex gap-2">
//                               <button 
//                                 onClick={() => window.location.href = `/package/${pkg.id}`}
//                                 className="flex justify-center items-center w-8 h-8 rounded-lg border border-gray-200 transition hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600"
//                                 title="View Details"
//                               >
//                                 <Eye size={16} />
//                               </button>
//                               <button 
//                                 onClick={() => togglePackageStatus(pkg.id)}
//                                 className="flex justify-center items-center w-8 h-8 rounded-lg border border-gray-200 transition hover:bg-gray-50 hover:border-amber-500 hover:text-amber-600"
//                                 title={pkg.status === 'active' ? 'Deactivate' : 'Activate'}
//                               >
//                                 {pkg.status === 'active' ? <EyeOff size={16} /> : <Eye size={16} />}
//                               </button>
//                               <button 
//                                 onClick={() => handleDeletePackage(pkg.id, pkg.name)}
//                                 className="flex justify-center items-center w-8 h-8 rounded-lg border border-gray-200 transition hover:bg-gray-50 hover:border-red-500 hover:text-red-600"
//                                 title="Delete"
//                               >
//                                 <Trash2 size={16} />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
                        
//                         {/* Expanded Details */}
//                         {pkg.expanded && (
//                           <tr className="bg-gray-50">
//                             <td colSpan="9" className="px-4 py-6">
//                               <div className="p-6 bg-white rounded-xl border border-gray-200">
//                                 <div className="flex flex-col gap-4 justify-between items-start pb-4 mb-6 border-b border-gray-200 md:flex-row md:items-center">
//                                   <h3 className="text-xl font-bold text-gray-900">Package Details: {pkg.name}</h3>
//                                 </div>
                                
//                                 <div className="grid grid-cols-1 gap-6">
//                                   {/* Description */}
//                                   <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
//                                     <h4 className="flex gap-2 items-center mb-3 text-base font-semibold text-gray-900">
//                                       <Globe size={18} />
//                                       Description
//                                     </h4>
//                                     <p className="mb-3 leading-relaxed text-gray-700">{pkg.detailedInfo.description}</p>
//                                     <div className="flex flex-wrap gap-2 items-center mb-3">
//                                       <span className="text-sm text-gray-600">Best For:</span>
//                                       {pkg.detailedInfo.bestFor.map((type, idx) => (
//                                         <span key={idx} className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg">
//                                           {type}
//                                         </span>
//                                       ))}
//                                     </div>
//                                     <div className="flex gap-2 items-center pt-3 text-sm text-gray-700 border-t border-gray-200">
//                                       <Sun size={16} className="text-amber-500" />
//                                       <span className="font-medium">Season:</span>
//                                       <span>{pkg.detailedInfo.season}</span>
//                                     </div>
//                                   </div>

//                                   {/* Itinerary */}
//                                   {pkg.detailedInfo.itinerary.length > 0 && (
//                                     <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
//                                       <h4 className="flex gap-2 items-center mb-4 text-base font-semibold text-gray-900">
//                                         <Calendar size={18} />
//                                         Itinerary ({pkg.duration})
//                                       </h4>
//                                       <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                                         {pkg.detailedInfo.itinerary.map((day) => (
//                                           <div key={day.day} className="p-4 bg-white rounded-lg border border-gray-200 transition hover:shadow-md">
//                                             <div className="mb-2 font-bold text-blue-600">Day {day.day_number || day.day}</div>
//                                             <div className="mb-1 text-sm font-semibold text-gray-900">{day.title}</div>
//                                             <div className="text-xs text-gray-600">{day.description}</div>
//                                           </div>
//                                         ))}
//                                       </div>
//                                     </div>
//                                   )}

//                                   {/* Hotels & Destinations */}
//                                   {(pkg.detailedInfo.hotels.length > 0 || pkg.detailedInfo.destinations.length > 0) && (
//                                     <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//                                       {/* Hotels */}
//                                       {pkg.detailedInfo.hotels.length > 0 && (
//                                         <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
//                                           <h4 className="flex gap-2 items-center mb-4 text-base font-semibold text-gray-900">
//                                             <Hotel size={18} />
//                                             Hotels & Accommodation
//                                           </h4>
//                                           <div className="grid gap-3">
//                                             {pkg.detailedInfo.hotels.map((hotel, idx) => (
//                                               <div key={idx} className="p-4 bg-white rounded-lg border border-gray-200 transition hover:shadow-md">
//                                                 <div className="flex justify-between items-start mb-2">
//                                                   <div className="text-sm font-semibold text-gray-900">{hotel.hotel_name}</div>
//                                                   <div className="flex gap-1 items-center text-xs font-semibold text-amber-500">
//                                                     <Star size={14} fill="currentColor" />
//                                                     {hotel.rating}
//                                                   </div>
//                                                 </div>
//                                                 <div className="flex gap-2 items-center mb-2 text-xs text-gray-600">
//                                                   <Bed size={14} />
//                                                   {hotel.nights} Nights
//                                                 </div>
//                                                 {hotel.features && hotel.features.length > 0 && (
//                                                   <div className="flex flex-wrap gap-1.5">
//                                                     {hotel.features.map((feature, fIdx) => (
//                                                       <span key={fIdx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
//                                                         {feature}
//                                                       </span>
//                                                     ))}
//                                                   </div>
//                                                 )}
//                                               </div>
//                                             ))}
//                                           </div>
//                                         </div>
//                                       )}

//                                       {/* Destinations */}
//                                       {pkg.detailedInfo.destinations.length > 0 && (
//                                         <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
//                                           <h4 className="flex gap-2 items-center mb-4 text-base font-semibold text-gray-900">
//                                             <MapPin size={18} />
//                                             Visit Locations
//                                           </h4>
//                                           <div className="grid gap-3">
//                                             {pkg.detailedInfo.destinations.map((dest, idx) => (
//                                               <div key={idx} className="p-4 bg-white rounded-lg border border-gray-200 transition hover:shadow-md">
//                                                 <div className="flex gap-2 items-center mb-2 text-sm font-semibold text-gray-900">
//                                                   {dest.destination_type === 'Historical' && <Castle size={16} className="text-amber-600" />}
//                                                   {dest.destination_type === 'Wildlife' && <Mountain size={16} className="text-green-600" />}
//                                                   {dest.destination_type === 'Religious' && <Award size={16} className="text-purple-600" />}
//                                                   {dest.destination_type === 'Scenic' && <Camera size={16} className="text-blue-600" />}
//                                                   {dest.destination_type === 'Beach' && <Sun size={16} className="text-cyan-600" />}
//                                                   {dest.destination_name}
//                                                 </div>
//                                                 <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium mb-2">
//                                                   {dest.destination_type}
//                                                 </span>
//                                                 {dest.highlights && dest.highlights.length > 0 && (
//                                                   <div className="flex flex-wrap gap-1.5">
//                                                     {dest.highlights.map((highlight, hIdx) => (
//                                                       <span key={hIdx} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs">
//                                                         {highlight}
//                                                       </span>
//                                                     ))}
//                                                   </div>
//                                                 )}
//                                               </div>
//                                             ))}
//                                           </div>
//                                         </div>
//                                       )}
//                                     </div>
//                                   )}

//                                   {/* Inclusions & Exclusions */}
//                                   {(pkg.detailedInfo.inclusions.length > 0 || pkg.detailedInfo.exclusions.length > 0) && (
//                                     <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
//                                       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//                                         {pkg.detailedInfo.inclusions.length > 0 && (
//                                           <div>
//                                             <h4 className="flex gap-2 items-center mb-3 text-base font-semibold text-gray-900">
//                                               <CheckCircle size={18} className="text-green-600" />
//                                               What's Included
//                                             </h4>
//                                             <ul className="space-y-2">
//                                               {pkg.detailedInfo.inclusions.map((item, idx) => (
//                                                 <li key={idx} className="flex gap-2 items-start text-sm text-gray-700">
//                                                   <span className="text-green-600 font-bold mt-0.5">✓</span>
//                                                   {item}
//                                                 </li>
//                                               ))}
//                                             </ul>
//                                           </div>
//                                         )}
//                                         {pkg.detailedInfo.exclusions.length > 0 && (
//                                           <div>
//                                             <h4 className="flex gap-2 items-center mb-3 text-base font-semibold text-gray-900">
//                                               <XCircle size={18} className="text-red-600" />
//                                               What's Excluded
//                                             </h4>
//                                             <ul className="space-y-2">
//                                               {pkg.detailedInfo.exclusions.map((item, idx) => (
//                                                 <li key={idx} className="flex gap-2 items-start text-sm text-gray-700">
//                                                   <span className="text-red-600 font-bold mt-0.5">✗</span>
//                                                   {item}
//                                                 </li>
//                                               ))}
//                                             </ul>
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             </td>
//                           </tr>
//                         )}
//                       </React.Fragment>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Summary Footer */}
//       <div className="px-8 pb-6">
//         <div className="flex flex-col gap-4 justify-between items-start p-6 bg-white rounded-xl shadow-sm md:flex-row md:items-center">
//           <div className="text-sm text-gray-600">
//             Showing {filteredPackages.length} of {packages.length} packages
//             {selectedPackages.length > 0 && ` • ${selectedPackages.length} selected`}
//           </div>
//           <div className="flex gap-3">
//             <button 
//               onClick={() => setShowNewPackageModal(true)}
//               className="flex gap-2 items-center px-6 py-2 font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg transition hover:shadow-lg"
//             >
//               <Plus size={16} />
//               New Package
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* New Package Modal */}
//       {showNewPackageModal && (
//         <div className="flex overflow-y-auto fixed inset-0 z-50 justify-center items-center p-4 bg-black/50">
//           <div className="my-8 w-full max-w-3xl bg-white rounded-2xl">
//             {/* Modal Header */}
//             <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
//               <h3 className="text-xl font-bold text-gray-900">Create New Package</h3>
//               <button 
//                 onClick={() => {
//                   setShowNewPackageModal(false);
//                   setActiveModalTab('basic');
//                 }}
//                 className="flex justify-center items-center w-8 h-8 rounded-lg transition hover:bg-gray-100"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Tabs */}
//             <div className="flex overflow-x-auto px-6 border-b border-gray-200">
//               {[
//                 { key: 'basic', label: 'Basic Info' },
//                 { key: 'itinerary', label: 'Itinerary' },
//                 { key: 'hotels', label: 'Hotels' },
//                 { key: 'destinations', label: 'Destinations' },
//                 { key: 'details', label: 'Details' }
//               ].map(tab => (
//                 <button
//                   key={tab.key}
//                   onClick={() => setActiveModalTab(tab.key)}
//                   className={`px-4 py-3 border-b-2 font-medium transition whitespace-nowrap ${
//                     activeModalTab === tab.key
//                       ? 'border-blue-500 text-blue-600'
//                       : 'border-transparent text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>

//             {/* Modal Body */}
//             <div className="px-6 py-6 max-h-[calc(100vh-250px)] overflow-y-auto">
              
//               {/* Basic Info Tab */}
//               {activeModalTab === 'basic' && (
//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                   <div className="md:col-span-2">
//                     <label className="block mb-1 text-sm font-medium text-gray-700">
//                       Package Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={newPackage.name}
//                       onChange={(e) => setNewPackage({...newPackage, name: e.target.value})}
//                       className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                       placeholder="e.g., Golden Sri Lanka Tour"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 text-sm font-medium text-gray-700">
//                       Package Type <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       value={newPackage.type}
//                       onChange={(e) => setNewPackage({...newPackage, type: e.target.value})}
//                       className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     >
//                       <option value="Gold">Gold</option>
//                       <option value="Silver">Silver</option>
//                       <option value="Platinum">Platinum</option>
//                     </select>
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 text-sm font-medium text-gray-700">
//                       Season <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       value={newPackage.season}
//                       onChange={(e) => setNewPackage({...newPackage, season: e.target.value})}
//                       className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     >
//                       <option value="All Year">All Year</option>
//                       <option value="Winter">Winter (Dec - Feb)</option>
//                       <option value="Summer">Summer (Jun - Aug)</option>
//                       <option value="Spring/Autumn">Spring/Autumn</option>
//                       <option value="Monsoon">Monsoon</option>
//                     </select>
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 text-sm font-medium text-gray-700">
//                       Duration (Days) <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       value={newPackage.durationDays}
//                       onChange={(e) => setNewPackage({...newPackage, durationDays: e.target.value})}
//                       className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                       placeholder="7"
//                       min="1"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 text-sm font-medium text-gray-700">
//                       Min Travelers <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       value={newPackage.minTravelers}
//                       onChange={(e) => setNewPackage({...newPackage, minTravelers: e.target.value})}
//                       className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                       placeholder="2"
//                       min="1"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 text-sm font-medium text-gray-700">
//                       Max Travelers <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       value={newPackage.maxTravelers}
//                       onChange={(e) => setNewPackage({...newPackage, maxTravelers: e.target.value})}
//                       className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                       placeholder="10"
//                       min="1"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 text-sm font-medium text-gray-700">
//                       Base Price ($) <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       value={newPackage.basePrice}
//                       onChange={(e) => setNewPackage({...newPackage, basePrice: e.target.value})}
//                       className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                       placeholder="2000"
//                       min="0"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 text-sm font-medium text-gray-700">
//                       Min Price ($)
//                     </label>
//                     <input
//                       type="number"
//                       value={newPackage.minPrice}
//                       onChange={(e) => setNewPackage({...newPackage, minPrice: e.target.value})}
//                       className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                       placeholder="2000"
//                       min="0"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block mb-1 text-sm font-medium text-gray-700">
//                       Max Price ($)
//                     </label>
//                     <input
//                       type="number"
//                       value={newPackage.maxPrice}
//                       onChange={(e) => setNewPackage({...newPackage, maxPrice: e.target.value})}
//                       className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                       placeholder="3000"
//                       min="0"
//                     />
//                   </div>
                  
//                   {/* Features Section - Dropdown */}
//                   <div className="md:col-span-2">
//                     <label className="block mb-2 text-sm font-medium text-gray-700">
//                       Features
//                     </label>
//                     <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
//                       <div className="mb-2 text-sm text-gray-600">Select features:</div>
//                       <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
//                         {AVAILABLE_FEATURES.map((feature) => (
//                           <div key={feature} className="flex items-center">
//                             <input
//                               type="checkbox"
//                               id={`feature-${feature}`}
//                               checked={newPackage.selectedFeatures.includes(feature)}
//                               onChange={() => handleFeatureToggle(feature)}
//                               className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                             />
//                             <label 
//                               htmlFor={`feature-${feature}`}
//                               className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900"
//                             >
//                               {feature}
//                             </label>
//                           </div>
//                         ))}
//                       </div>
                      
//                       {/* Selected Features Preview */}
//                       {newPackage.selectedFeatures.length > 0 && (
//                         <div className="pt-3 mt-3 border-t border-gray-200">
//                           <div className="mb-2 text-sm text-gray-600">Selected Features:</div>
//                           <div className="flex flex-wrap gap-1.5">
//                             {newPackage.selectedFeatures.map((feature) => (
//                               <span 
//                                 key={feature}
//                                 className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium"
//                               >
//                                 {feature}
//                                 <button
//                                   onClick={() => handleFeatureToggle(feature)}
//                                   className="text-blue-500 hover:text-blue-700"
//                                 >
//                                   <X size={12} />
//                                 </button>
//                               </span>
//                             ))}
//                           </div>
//                           <p className="mt-2 text-xs text-gray-500">
//                             {newPackage.selectedFeatures.length} feature(s) selected
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
                  
//                   {/* Best For Section - Radio Buttons */}
//                   <div className="md:col-span-2">
//                     <label className="block mb-2 text-sm font-medium text-gray-700">
//                       Best For <span className="text-red-500">*</span>
//                     </label>
//                     <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
//                       {BEST_FOR_OPTIONS.map((option) => (
//                         <div key={option.value} className="relative">
//                           <input
//                             type="radio"
//                             id={`bestFor-${option.value}`}
//                             name="bestFor"
//                             value={option.value}
//                             checked={newPackage.bestFor === option.value}
//                             onChange={(e) => handleBestForChange(e.target.value)}
//                             className="sr-only"
//                           />
//                           <label
//                             htmlFor={`bestFor-${option.value}`}
//                             className={`
//                               flex items-center justify-center px-3 py-2.5 border rounded-lg cursor-pointer transition-all
//                               ${newPackage.bestFor === option.value 
//                                 ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium ring-2 ring-blue-100' 
//                                 : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
//                               }
//                             `}
//                           >
//                             <span className="text-sm">{option.label}</span>
//                           </label>
//                           {newPackage.bestFor === option.value && (
//                             <div className="flex absolute -top-1 -right-1 justify-center items-center w-5 h-5 bg-blue-500 rounded-full">
//                               <CheckCircle size={12} className="text-white" />
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
                  
//                   <div className="md:col-span-2">
//                     <label className="block mb-1 text-sm font-medium text-gray-700">
//                       Description <span className="text-red-500">*</span>
//                     </label>
//                     <textarea
//                       value={newPackage.description}
//                       onChange={(e) => setNewPackage({...newPackage, description: e.target.value})}
//                       className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                       rows="4"
//                       placeholder="Describe the package experience in detail..."
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Itinerary Tab */}
//               {activeModalTab === 'itinerary' && (
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <h4 className="text-lg font-semibold text-gray-900">Daily Itinerary</h4>
//                     <button
//                       onClick={addItineraryDay}
//                       className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
//                     >
//                       <Plus size={16} />
//                       Add Day
//                     </button>
//                   </div>
                  
//                   {newPackage.itinerary.map((day, index) => (
//                     <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
//                       <div className="flex justify-between items-center mb-3">
//                         <span className="font-semibold text-blue-600">Day {day.day}</span>
//                         {newPackage.itinerary.length > 1 && (
//                           <button
//                             onClick={() => removeItineraryDay(index)}
//                             className="text-sm text-red-600 hover:text-red-700"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         )}
//                       </div>
//                       <div className="space-y-3">
//                         <div>
//                           <label className="block mb-1 text-sm font-medium text-gray-700">
//                             Activity Type
//                           </label>
//                           <select
//                             value={day.activityType}
//                             onChange={(e) => updateItineraryDay(index, 'activityType', e.target.value)}
//                             className="px-3 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                           >
//                             <option value="">Select activity type</option>
//                             {ITINERARY_ACTIVITIES.map((activity) => (
//                               <option key={activity.value} value={activity.value}>
//                                 {activity.label}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                         <div>
//                           <label className="block mb-1 text-sm font-medium text-gray-700">
//                             Title <span className="text-red-500">*</span>
//                           </label>
//                           <input
//                             type="text"
//                             value={day.title}
//                             onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
//                             className="px-3 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                             placeholder="e.g., Arrival in Colombo"
//                           />
//                         </div>
//                         <div>
//                           <label className="block mb-1 text-sm font-medium text-gray-700">
//                             Description <span className="text-red-500">*</span>
//                           </label>
//                           <textarea
//                             value={day.description}
//                             onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
//                             className="px-3 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                             rows="2"
//                             placeholder="Brief description of the day's activities"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Hotels Tab */}
//               {activeModalTab === 'hotels' && (
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <h4 className="text-lg font-semibold text-gray-900">Hotels & Accommodation</h4>
//                     <button
//                       onClick={addHotel}
//                       className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
//                     >
//                       <Plus size={16} />
//                       Add Hotel
//                     </button>
//                   </div>
                  
//                   {newPackage.hotels.map((hotel, index) => (
//                     <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
//                       <div className="flex justify-between items-center mb-3">
//                         <span className="font-semibold text-gray-900">Hotel {index + 1}</span>
//                         {newPackage.hotels.length > 1 && (
//                           <button
//                             onClick={() => removeHotel(index)}
//                             className="text-sm text-red-600 hover:text-red-700"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         )}
//                       </div>
//                       <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//                         <div className="md:col-span-2">
//                           <label className="block mb-1 text-sm font-medium text-gray-700">
//                             Hotel Name <span className="text-red-500">*</span>
//                           </label>
//                           <div className="flex gap-2">
//                             <select
//                               value={hotel.name}
//                               onChange={(e) => updateHotel(index, 'name', e.target.value)}
//                               className="flex-1 px-3 py-2 rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                             >
//                               <option value="">Select a hotel</option>
//                               {HOTEL_OPTIONS.map((hotelOption) => (
//                                 <option key={hotelOption.value} value={hotelOption.value}>
//                                   {hotelOption.label}
//                                 </option>
//                               ))}
//                             </select>
//                             <div className="flex items-center text-sm text-gray-500"></div>
//                             {/* <input
//                               type="text"
//                               value={hotel.customName}
//                               onChange={(e) => updateHotel(index, 'customName', e.target.value)}
//                               className="flex-1 px-3 py-2 rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                               placeholder="Enter custom hotel name"
//                             /> */}
//                           </div>
//                         </div>
//                         <div>
//                           <label className="block mb-1 text-sm font-medium text-gray-700">
//                             Rating
//                           </label>
//                           <select
//                             value={hotel.rating}
//                             onChange={(e) => updateHotel(index, 'rating', e.target.value)}
//                             className="px-3 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                           >
//                             {HOTEL_RATING_OPTIONS.map((rating) => (
//                               <option key={rating.value} value={rating.value}>
//                                 {rating.label}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                         <div>
//                           <label className="block mb-1 text-sm font-medium text-gray-700">
//                             Nights <span className="text-red-500">*</span>
//                           </label>
//                           <input
//                             type="number"
//                             value={hotel.nights}
//                             onChange={(e) => updateHotel(index, 'nights', e.target.value)}
//                             className="px-3 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                             placeholder="2"
//                             min="1"
//                           />
//                         </div>
//                         <div className="md:col-span-2">
//                           <label className="block mb-1 text-sm font-medium text-gray-700">
//                             Hotel Features
//                           </label>
//                           <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
//                             <div className="mb-2 text-sm text-gray-600">Select features:</div>
//                             <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
//                               {HOTEL_FEATURES_OPTIONS.map((feature) => (
//                                 <div key={feature} className="flex items-center">
//                                   <input
//                                     type="checkbox"
//                                     id={`hotel-${index}-feature-${feature}`}
//                                     checked={hotel.features.includes(feature)}
//                                     onChange={() => handleHotelFeatureToggle(index, feature)}
//                                     className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
//                                   />
//                                   <label 
//                                     htmlFor={`hotel-${index}-feature-${feature}`}
//                                     className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900"
//                                   >
//                                     {feature}
//                                   </label>
//                                 </div>
//                               ))}
//                             </div>
                            
//                             {/* Selected Features Preview */}
//                             {hotel.features.length > 0 && (
//                               <div className="pt-3 mt-3 border-t border-gray-200">
//                                 <div className="mb-2 text-sm text-gray-600">Selected Features:</div>
//                                 <div className="flex flex-wrap gap-1.5">
//                                   {hotel.features.map((feature) => (
//                                     <span 
//                                       key={feature}
//                                       className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium"
//                                     >
//                                       {feature}
//                                       <button
//                                         onClick={() => handleHotelFeatureToggle(index, feature)}
//                                         className="text-green-500 hover:text-green-700"
//                                       >
//                                         <X size={12} />
//                                       </button>
//                                     </span>
//                                   ))}
//                                 </div>
//                                 <p className="mt-2 text-xs text-gray-500">
//                                   {hotel.features.length} feature(s) selected
//                                 </p>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Destinations Tab */}
//               {activeModalTab === 'destinations' && (
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <h4 className="text-lg font-semibold text-gray-900">Visit Locations</h4>
//                     <button
//                       onClick={addDestination}
//                       className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
//                     >
//                       <Plus size={16} />
//                       Add Destination
//                     </button>
//                   </div>
                  
//                   {newPackage.destinations.map((dest, index) => (
//                     <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
//                       <div className="flex justify-between items-center mb-3">
//                         <span className="font-semibold text-gray-900">Destination {index + 1}</span>
//                         {newPackage.destinations.length > 1 && (
//                           <button
//                             onClick={() => removeDestination(index)}
//                             className="text-sm text-red-600 hover:text-red-700"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         )}
//                       </div>
//                       <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//                         <div className="md:col-span-2">
//                           <label className="block mb-1 text-sm font-medium text-gray-700">
//                             Destination Name <span className="text-red-500">*</span>
//                           </label>
//                           <select
//                             value={dest.name}
//                             onChange={(e) => updateDestination(index, 'name', e.target.value)}
//                             className="px-3 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                           >
//                             <option value="">Select a destination</option>
//                             {DESTINATION_OPTIONS.map((destination) => (
//                               <option key={destination.value} value={destination.value}>
//                                 {destination.label}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                         <div className="md:col-span-2">
//                           <label className="block mb-1 text-sm font-medium text-gray-700">
//                             Type
//                           </label>
//                           <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
//                             {DESTINATION_TYPE_OPTIONS.map((type) => (
//                               <div key={type.value} className="relative">
//                                 <input
//                                   type="radio"
//                                   id={`dest-${index}-type-${type.value}`}
//                                   name={`dest-${index}-type`}
//                                   value={type.value}
//                                   checked={dest.type === type.value}
//                                   onChange={(e) => updateDestination(index, 'type', e.target.value)}
//                                   className="sr-only"
//                                 />
//                                 <label
//                                   htmlFor={`dest-${index}-type-${type.value}`}
//                                   className={`
//                                     flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-all
//                                     ${dest.type === type.value 
//                                       ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium ring-2 ring-blue-100' 
//                                       : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
//                                     }
//                                   `}
//                                 >
//                                   <div className="mb-1">{type.icon}</div>
//                                   <span className="text-xs text-center">{type.label}</span>
//                                 </label>
//                                 {dest.type === type.value && (
//                                   <div className="flex absolute -top-1 -right-1 justify-center items-center w-5 h-5 bg-blue-500 rounded-full">
//                                     <CheckCircle size={10} className="text-white" />
//                                   </div>
//                                 )}
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                         <div className="md:col-span-2">
//                           <label className="block mb-1 text-sm font-medium text-gray-700">
//                             Highlights
//                           </label>
//                           <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
//                             <div className="mb-2 text-sm text-gray-600">Select highlights:</div>
//                             <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
//                               {["Ancient Architecture", "Natural Beauty", "Wildlife Viewing", "Photography Spots", 
//                                 "Cultural Significance", "Hiking Trails", "Local Cuisine", "Guided Tours", 
//                                 "Museum", "Gardens", "Viewpoints", "Religious Sites"].map((highlight) => (
//                                 <div key={highlight} className="flex items-center">
//                                   <input
//                                     type="checkbox"
//                                     id={`dest-${index}-highlight-${highlight}`}
//                                     checked={dest.highlights.includes(highlight)}
//                                     onChange={() => handleDestinationHighlightToggle(index, highlight)}
//                                     className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
//                                   />
//                                   <label 
//                                     htmlFor={`dest-${index}-highlight-${highlight}`}
//                                     className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900"
//                                   >
//                                     {highlight}
//                                   </label>
//                                 </div>
//                               ))}
//                             </div>
                            
//                             {/* Selected Highlights Preview */}
//                             {dest.highlights.length > 0 && (
//                               <div className="pt-3 mt-3 border-t border-gray-200">
//                                 <div className="mb-2 text-sm text-gray-600">Selected Highlights:</div>
//                                 <div className="flex flex-wrap gap-1.5">
//                                   {dest.highlights.map((highlight) => (
//                                     <span 
//                                       key={highlight}
//                                       className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium"
//                                     >
//                                       {highlight}
//                                       <button
//                                         onClick={() => handleDestinationHighlightToggle(index, highlight)}
//                                         className="text-amber-500 hover:text-amber-700"
//                                       >
//                                         <X size={12} />
//                                       </button>
//                                     </span>
//                                   ))}
//                                 </div>
//                                 <p className="mt-2 text-xs text-gray-500">
//                                   {dest.highlights.length} highlight(s) selected
//                                 </p>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Details Tab (Inclusions/Exclusions) */}
//               {activeModalTab === 'details' && (
//                 <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//                   <div>
//                     <label className="block mb-2 text-sm font-medium text-gray-700">
//                       <span className="flex gap-2 items-center">
//                         <CheckCircle size={18} className="text-green-600" />
//                         What's Included
//                       </span>
//                     </label>
//                     <textarea
//                       value={newPackage.inclusions}
//                       onChange={(e) => setNewPackage({...newPackage, inclusions: e.target.value})}
//                       className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                       rows="12"
//                       placeholder="Enter each inclusion on a new line:&#10;5-star accommodation&#10;Private AC vehicle with driver&#10;English speaking guide&#10;All entrance fees"
//                     />
//                     <p className="mt-1 text-xs text-gray-500">Enter each item on a new line</p>
//                   </div>
                  
//                   <div>
//                     <label className="block mb-2 text-sm font-medium text-gray-700">
//                       <span className="flex gap-2 items-center">
//                         <XCircle size={18} className="text-red-600" />
//                         What's Excluded
//                       </span>
//                     </label>
//                     <textarea
//                       value={newPackage.exclusions}
//                       onChange={(e) => setNewPackage({...newPackage, exclusions: e.target.value})}
//                       className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                       rows="12"
//                       placeholder="Enter each exclusion on a new line:&#10;International flights&#10;Travel insurance&#10;Personal expenses&#10;Tips for guide & driver"
//                     />
//                     <p className="mt-1 text-xs text-gray-500">Enter each item on a new line</p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
//               <button
//                 onClick={() => {
//                   const tabs = ['basic', 'itinerary', 'hotels', 'destinations', 'details'];
//                   const currentIndex = tabs.indexOf(activeModalTab);
//                   if (currentIndex > 0) {
//                     setActiveModalTab(tabs[currentIndex - 1]);
//                   }
//                 }}
//                 disabled={activeModalTab === 'basic'}
//                 className="px-6 py-2 font-medium rounded-lg border border-gray-300 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Back
//               </button>
              
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => {
//                     setShowNewPackageModal(false);
//                     setActiveModalTab('basic');
//                   }}
//                   className="px-6 py-2 font-medium rounded-lg border border-gray-300 transition hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
                
//                 {activeModalTab === 'details' ? (
//                   <button
//                     onClick={handleCreatePackage}
//                     disabled={!newPackage.name || !newPackage.durationDays || !newPackage.basePrice || !newPackage.description}
//                     className="px-6 py-2 font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg transition hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Create Package
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => {
//                       const tabs = ['basic', 'itinerary', 'hotels', 'destinations', 'details'];
//                       const currentIndex = tabs.indexOf(activeModalTab);
//                       setActiveModalTab(tabs[currentIndex + 1]);
//                     }}
//                     className="px-6 py-2 font-semibold text-white bg-blue-500 rounded-lg transition hover:bg-blue-600"
//                   >
//                     Next
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//     </DashboardLayout>
//   );
// };

// export default ManagePackages;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Edit, Trash2, CheckCircle, XCircle, Search, Plus, 
  Star, Hotel, MapPin, Users, Calendar, Eye, EyeOff,
  Download, Upload, MoreVertical, ChevronDown, ChevronUp, Tag,
  BarChart3, Settings, RefreshCw, Bed, Mountain, Globe, Info,
  Castle, Camera, Award, Clock, DollarSign, Share2, X, Sun
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

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

  const AVAILABLE_FEATURES = [
    "5-Star Hotels",
    "Private Transport",
    "English Speaking Guide",
    "All Meals Included",
    "Flight Tickets",
    "Travel Insurance",
    "Visa Assistance",
    "Luxury Accommodation",
    "Spa & Wellness",
    "Adventure Activities",
    "Cultural Experiences",
    "Beach Access",
    "City Tours",
    "Mountain Trekking",
    "Wildlife Safari"
  ];

  const BEST_FOR_OPTIONS = [
    { value: "Couples", label: "Couples" },
    { value: "Families", label: "Families" },
    { value: "Adventure Seekers", label: "Adventure Seekers" },
    { value: "Solo Travelers", label: "Solo Travelers" },
    { value: "Business Travelers", label: "Business Travelers" },
    { value: "Luxury Travelers", label: "Luxury Travelers" },
    { value: "Budget Travelers", label: "Budget Travelers" },
    { value: "Senior Citizens", label: "Senior Citizens" }
  ];

  // Predefined options for dropdowns
  const ITINERARY_ACTIVITIES = [
    { value: "arrival", label: "Arrival & Airport Transfer" },
    { value: "city-tour", label: "City Tour" },
    { value: "cultural-visit", label: "Cultural Site Visit" },
    { value: "wildlife-safari", label: "Wildlife Safari" },
    { value: "beach-day", label: "Beach Day & Relaxation" },
    { value: "mountain-trek", label: "Mountain Trekking" },
    { value: "temple-visit", label: "Temple/Religious Site Visit" },
    { value: "shopping", label: "Shopping & Local Market" },
    { value: "food-tour", label: "Food & Culinary Tour" },
    { value: "adventure", label: "Adventure Activities" },
    { value: "historical-site", label: "Historical Site Visit" },
    { value: "departure", label: "Departure & Airport Transfer" }
  ];

  const HOTEL_OPTIONS = [
    { value: "Cinnamon Grand Colombo", label: "Cinnamon Grand Colombo" },
    { value: "Shangri-La Colombo", label: "Shangri-La Colombo" },
    { value: "Galle Face Hotel", label: "Galle Face Hotel" },
    { value: "Cinnamon Bentota Beach", label: "Cinnamon Bentota Beach" },
    { value: "Heritance Kandalama", label: "Heritance Kandalama" },
    { value: "Cinnamon Lodge Habarana", label: "Cinnamon Lodge Habarana" },
    { value: "Jetwing Vil Uyana", label: "Jetwing Vil Uyana" },
    { value: "Earl's Regency Kandy", label: "Earl's Regency Kandy" },
    { value: "The Fortress Resort & Spa", label: "The Fortress Resort & Spa" },
    { value: "Araliya Green Hills Hotel", label: "Araliya Green Hills Hotel" }
  ];

  const DESTINATION_OPTIONS = [
    { value: "Sigiriya Rock Fortress", label: "Sigiriya Rock Fortress" },
    { value: "Temple of the Sacred Tooth Relic", label: "Temple of the Sacred Tooth Relic" },
    { value: "Yala National Park", label: "Yala National Park" },
    { value: "Ella Rock", label: "Ella Rock" },
    { value: "Galle Fort", label: "Galle Fort" },
    { value: "Dambulla Cave Temple", label: "Dambulla Cave Temple" },
    { value: "Polonnaruwa Ancient City", label: "Polonnaruwa Ancient City" },
    { value: "Anuradhapura Sacred City", label: "Anuradhapura Sacred City" },
    { value: "Mirissa Beach", label: "Mirissa Beach" },
    { value: "Horton Plains National Park", label: "Horton Plains National Park" },
    { value: "Adam's Peak", label: "Adam's Peak" },
    { value: "Bentota Beach", label: "Bentota Beach" }
  ];

  const DESTINATION_TYPE_OPTIONS = [
    { value: "Historical", label: "Historical", icon: <Castle size={16} className="text-amber-600" /> },
    { value: "Wildlife", label: "Wildlife", icon: <Mountain size={16} className="text-green-600" /> },
    { value: "Religious", label: "Religious", icon: <Award size={16} className="text-purple-600" /> },
    { value: "Scenic", label: "Scenic", icon: <Camera size={16} className="text-blue-600" /> },
    { value: "Beach", label: "Beach", icon: <Sun size={16} className="text-cyan-600" /> },
    { value: "Cultural", label: "Cultural", icon: <Globe size={16} className="text-indigo-600" /> },
    { value: "Adventure", label: "Adventure", icon: <Award size={16} className="text-red-600" /> }
  ];

  const HOTEL_RATING_OPTIONS = [
    { value: "5 Star", label: "⭐ ⭐ ⭐ ⭐ ⭐ 5 Star" },
    { value: "4 Star", label: "⭐ ⭐ ⭐ ⭐ 4 Star" },
    { value: "3 Star", label: "⭐ ⭐ ⭐ 3 Star" },
    { value: "Luxury", label: "🏨 Luxury" },
    { value: "Boutique", label: "🏛️ Boutique" },
    { value: "Resort", label: "🏖️ Resort" },
    { value: "Budget", label: "💰 Budget" }
  ];

  const HOTEL_FEATURES_OPTIONS = [
    "Swimming Pool",
    "Spa & Wellness Center",
    "Beach Access",
    "Free WiFi",
    "Restaurant & Bar",
    "Fitness Center",
    "Room Service",
    "Air Conditioning",
    "Sea View",
    "Garden View",
    "Parking",
    "Conference Facilities",
    "Kids Club",
    "Airport Shuttle"
  ];

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
    selectedFeatures: [],
    bestFor: 'Couples',
    itinerary: [{ day: 1, title: '', description: '', activityType: '' }],
    hotels: [{ name: '', rating: '5 Star', nights: '', features: [], customName: '' }],
    destinations: [{ name: '', type: 'Historical', highlights: [] }],
    inclusions: '',
    exclusions: ''
  });

  // Helper functions for feature selection
  const handleFeatureToggle = (feature) => {
    setNewPackage(prev => {
      if (prev.selectedFeatures.includes(feature)) {
        return {
          ...prev,
          selectedFeatures: prev.selectedFeatures.filter(f => f !== feature)
        };
      } else {
        return {
          ...prev,
          selectedFeatures: [...prev.selectedFeatures, feature]
        };
      }
    });
  };

  const handleBestForChange = (value) => {
    setNewPackage(prev => ({
      ...prev,
      bestFor: value
    }));
  };

  // Helper functions for hotel features
  const handleHotelFeatureToggle = (index, feature) => {
    const updatedHotels = [...newPackage.hotels];
    const hotelFeatures = updatedHotels[index].features;
    
    if (hotelFeatures.includes(feature)) {
      updatedHotels[index] = {
        ...updatedHotels[index],
        features: hotelFeatures.filter(f => f !== feature)
      };
    } else {
      updatedHotels[index] = {
        ...updatedHotels[index],
        features: [...hotelFeatures, feature]
      };
    }
    
    setNewPackage({ ...newPackage, hotels: updatedHotels });
  };

  // Helper functions for destination highlights
  const handleDestinationHighlightToggle = (index, highlight) => {
    const updatedDestinations = [...newPackage.destinations];
    const destinationHighlights = updatedDestinations[index].highlights;
    
    if (destinationHighlights.includes(highlight)) {
      updatedDestinations[index] = {
        ...updatedDestinations[index],
        highlights: destinationHighlights.filter(h => h !== highlight)
      };
    } else {
      updatedDestinations[index] = {
        ...updatedDestinations[index],
        highlights: [...destinationHighlights, highlight]
      };
    }
    
    setNewPackage({ ...newPackage, destinations: updatedDestinations });
  };

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
        code: pkg.code || `PKG-${pkg.id}`,
        type: pkg.type,
        priceRange: pkg.price ? `$${pkg.price}` : 'N/A',
        basePrice: pkg.price || 0,
        duration: pkg.duration || 'N/A',
        status: pkg.status ? pkg.status.toLowerCase() : 'inactive',
        createdAt: pkg.createdAt ? new Date(pkg.createdAt).toISOString().split('T')[0] : 'Pending',
        lastUpdated: pkg.updated ? new Date(pkg.updated).toISOString().split('T')[0] : 'Pending',
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
      
      setPackages(packages.map(p => 
        p.id === id ? { ...p, status: newStatus } : p
      ));
      
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
      const featuresArray = newPackage.selectedFeatures;
      const bestForArray = [newPackage.bestFor];
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
          description: day.description,
          activityType: day.activityType
        })),
        hotels: newPackage.hotels.filter(h => h.name && h.nights).map(h => ({
          name: h.name || h.customName,
          rating: h.rating,
          nights: parseInt(h.nights),
          features: h.features
        })),
        destinations: newPackage.destinations.filter(d => d.name).map(d => ({
          name: d.name,
          type: d.type,
          highlights: d.highlights
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
        selectedFeatures: [],
        bestFor: 'Couples',
        itinerary: [{ day: 1, title: '', description: '', activityType: '' }],
        hotels: [{ name: '', rating: '5 Star', nights: '', features: [], customName: '' }],
        destinations: [{ name: '', type: 'Historical', highlights: [] }],
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
        
        setPackages(packages.filter(p => p.id !== id));
        setSelectedPackages(selectedPackages.filter(pkgId => pkgId !== id));
        
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
      itinerary: [...newPackage.itinerary, { 
        day: newPackage.itinerary.length + 1, 
        title: '', 
        description: '', 
        activityType: '' 
      }]
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
      hotels: [...newPackage.hotels, { 
        name: '', 
        rating: '5 Star', 
        nights: '', 
        features: [], 
        customName: '' 
      }]
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
      destinations: [...newPackage.destinations, { 
        name: '', 
        type: 'Historical', 
        highlights: [] 
      }]
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

    if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <i className="text-4xl text-orange-500 fas fa-spinner fa-spin"></i>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex flex-col gap-4 justify-between items-start px-8 py-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Travel Package Management</h1>
            <p className="mt-1 text-gray-600">Manage all your travel packages in one place</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowNewPackageModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <Plus size={20} />
              <span>New Package</span>
            </button>

<button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0">
  <Plus size={18} />
  <span>Enhance Package</span>
</button>
            
            <button 
              onClick={fetchPackages}
              className="flex gap-2 items-center px-6 py-3 font-medium text-gray-700 bg-white rounded-xl border border-gray-200 transition hover:bg-gray-50"
            >
              <RefreshCw size={20} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 px-8 py-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex gap-4 items-center p-5 bg-white rounded-xl shadow-sm transition hover:-translate-y-1">
          <div className="flex justify-center items-center w-12 h-12 text-white bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            <Tag size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Packages</div>
          </div>
        </div>
        
        <div className="flex gap-4 items-center p-5 bg-white rounded-xl shadow-sm transition hover:-translate-y-1">
          <div className="flex justify-center items-center w-12 h-12 text-white bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">{stats.active}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
        </div>
        
        <div className="flex gap-4 items-center p-5 bg-white rounded-xl shadow-sm transition hover:-translate-y-1">
          <div className="flex justify-center items-center w-12 h-12 text-white bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalBookings}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
        </div>
        
        <div className="flex gap-4 items-center p-5 bg-white rounded-xl shadow-sm transition hover:-translate-y-1">
          <div className="flex justify-center items-center w-12 h-12 text-white bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
            <Eye size={24} />
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalViews}</div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-8 py-4 bg-white border-b border-gray-200">
        <div className="flex flex-col gap-4 justify-between items-start lg:flex-row lg:items-center">
          <div className="flex flex-col flex-1 gap-4 items-start w-full sm:flex-row sm:items-center">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 text-gray-400 -translate-y-1/2" size={20} />
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
          
          <div className="flex gap-2 items-center">
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
          <div className="flex justify-center items-center p-8 bg-white rounded-xl shadow-sm">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full border-b-2 border-blue-500 animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading packages...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden bg-white rounded-xl shadow-sm">
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
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">Package Name</th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">Type</th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">Price</th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">Duration</th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">Updated</th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">Actions</th>
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
                              <div className="font-mono text-xs text-gray-500">{pkg.code}</div>
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
                            <div className="flex gap-1 items-center text-xs text-gray-500">
                              <DollarSign size={12} />
                              Base: ${pkg.basePrice}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 font-medium text-gray-900">
                              <Clock size={14} />
                              {pkg.duration}
                            </div>
                            <div className="flex gap-1 items-center mt-1 text-xs text-gray-500">
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
                            <div className="text-sm font-medium text-gray-900">{pkg.lastUpdated}</div>
                            <div className="text-xs text-gray-500">Created: {pkg.createdAt}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => window.location.href = `/package/${pkg.id}`}
                                className="flex justify-center items-center w-8 h-8 rounded-lg border border-gray-200 transition hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600"
                                title="View Details"
                              >
                                <Info  size={16} />
                              </button>
                              <button 
                                onClick={() => togglePackageStatus(pkg.id)}
                                className="flex justify-center items-center w-8 h-8 rounded-lg border border-gray-200 transition hover:bg-gray-50 hover:border-amber-500 hover:text-amber-600"
                                title={pkg.status === 'active' ? 'Deactivate' : 'Activate'}
                              >
                                {pkg.status === 'active' ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                              <button 
                                onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                                className="flex justify-center items-center w-8 h-8 rounded-lg border border-gray-200 transition hover:bg-gray-50 hover:border-red-500 hover:text-red-600"
                                title="Delete"
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
                              <div className="p-6 bg-white rounded-xl border border-gray-200">
                                <div className="flex flex-col gap-4 justify-between items-start pb-4 mb-6 border-b border-gray-200 md:flex-row md:items-center">
                                  <h3 className="text-xl font-bold text-gray-900">Package Details: {pkg.name}</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-6">
                                  {/* Description */}
                                  <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                                    <h4 className="flex gap-2 items-center mb-3 text-base font-semibold text-gray-900">
                                      <Globe size={18} />
                                      Description
                                    </h4>
                                    <p className="mb-3 leading-relaxed text-gray-700">{pkg.detailedInfo.description}</p>
                                    <div className="flex flex-wrap gap-2 items-center mb-3">
                                      <span className="text-sm text-gray-600">Best For:</span>
                                      {pkg.detailedInfo.bestFor.map((type, idx) => (
                                        <span key={idx} className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg">
                                          {type}
                                        </span>
                                      ))}
                                    </div>
                                    <div className="flex gap-2 items-center pt-3 text-sm text-gray-700 border-t border-gray-200">
                                      <Sun size={16} className="text-amber-500" />
                                      <span className="font-medium">Season:</span>
                                      <span>{pkg.detailedInfo.season}</span>
                                    </div>
                                  </div>

                                  {/* Itinerary */}
                                  {pkg.detailedInfo.itinerary.length > 0 && (
                                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                                      <h4 className="flex gap-2 items-center mb-4 text-base font-semibold text-gray-900">
                                        <Calendar size={18} />
                                        Itinerary ({pkg.duration})
                                      </h4>
                                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {pkg.detailedInfo.itinerary.map((day) => (
                                          <div key={day.day} className="p-4 bg-white rounded-lg border border-gray-200 transition hover:shadow-md">
                                            <div className="mb-2 font-bold text-blue-600">Day {day.day_number || day.day}</div>
                                            <div className="mb-1 text-sm font-semibold text-gray-900">{day.title}</div>
                                            <div className="text-xs text-gray-600">{day.description}</div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Hotels & Destinations */}
                                  {(pkg.detailedInfo.hotels.length > 0 || pkg.detailedInfo.destinations.length > 0) && (
                                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                      {/* Hotels */}
                                      {pkg.detailedInfo.hotels.length > 0 && (
                                        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                                          <h4 className="flex gap-2 items-center mb-4 text-base font-semibold text-gray-900">
                                            <Hotel size={18} />
                                            Hotels & Accommodation
                                          </h4>
                                          <div className="grid gap-3">
                                            {pkg.detailedInfo.hotels.map((hotel, idx) => (
                                              <div key={idx} className="p-4 bg-white rounded-lg border border-gray-200 transition hover:shadow-md">
                                                <div className="flex justify-between items-start mb-2">
                                                  <div className="text-sm font-semibold text-gray-900">{hotel.hotel_name}</div>
                                                  <div className="flex gap-1 items-center text-xs font-semibold text-amber-500">
                                                    <Star size={14} fill="currentColor" />
                                                    {hotel.rating}
                                                  </div>
                                                </div>
                                                <div className="flex gap-2 items-center mb-2 text-xs text-gray-600">
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
                                        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                                          <h4 className="flex gap-2 items-center mb-4 text-base font-semibold text-gray-900">
                                            <MapPin size={18} />
                                            Visit Locations
                                          </h4>
                                          <div className="grid gap-3">
                                            {pkg.detailedInfo.destinations.map((dest, idx) => (
                                              <div key={idx} className="p-4 bg-white rounded-lg border border-gray-200 transition hover:shadow-md">
                                                <div className="flex gap-2 items-center mb-2 text-sm font-semibold text-gray-900">
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
                                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {pkg.detailedInfo.inclusions.length > 0 && (
                                          <div>
                                            <h4 className="flex gap-2 items-center mb-3 text-base font-semibold text-gray-900">
                                              <CheckCircle size={18} className="text-green-600" />
                                              What's Included
                                            </h4>
                                            <ul className="space-y-2">
                                              {pkg.detailedInfo.inclusions.map((item, idx) => (
                                                <li key={idx} className="flex gap-2 items-start text-sm text-gray-700">
                                                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                                                  {item}
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                        {pkg.detailedInfo.exclusions.length > 0 && (
                                          <div>
                                            <h4 className="flex gap-2 items-center mb-3 text-base font-semibold text-gray-900">
                                              <XCircle size={18} className="text-red-600" />
                                              What's Excluded
                                            </h4>
                                            <ul className="space-y-2">
                                              {pkg.detailedInfo.exclusions.map((item, idx) => (
                                                <li key={idx} className="flex gap-2 items-start text-sm text-gray-700">
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
        <div className="flex flex-col gap-4 justify-between items-start p-6 bg-white rounded-xl shadow-sm md:flex-row md:items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredPackages.length} of {packages.length} packages
            {selectedPackages.length > 0 && ` • ${selectedPackages.length} selected`}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowNewPackageModal(true)}
              className="flex gap-2 items-center px-6 py-2 font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg transition hover:shadow-lg"
            >
              <Plus size={16} />
              New Package
            </button>
          </div>
        </div>
      </div>

      {/* New Package Modal */}
      {showNewPackageModal && (
        <div className="flex overflow-y-auto fixed inset-0 z-50 justify-center items-center p-4 bg-black/50">
          <div className="my-8 w-full max-w-3xl bg-white rounded-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Create New Package</h3>
              <button 
                onClick={() => {
                  setShowNewPackageModal(false);
                  setActiveModalTab('basic');
                }}
                className="flex justify-center items-center w-8 h-8 rounded-lg transition hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto px-6 border-b border-gray-200">
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Package Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newPackage.name}
                      onChange={(e) => setNewPackage({...newPackage, name: e.target.value})}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="e.g., Golden Sri Lanka Tour"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Package Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newPackage.type}
                      onChange={(e) => setNewPackage({...newPackage, type: e.target.value})}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="Gold">Gold</option>
                      <option value="Silver">Silver</option>
                      <option value="Platinum">Platinum</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Season <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newPackage.season}
                      onChange={(e) => setNewPackage({...newPackage, season: e.target.value})}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="All Year">All Year</option>
                      <option value="Nov-April"> (Nov-April)</option>
                      <option value="May-sep"> (May-sep)</option>
                         </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Duration (Days) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newPackage.durationDays}
                      onChange={(e) => setNewPackage({...newPackage, durationDays: e.target.value})}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="7"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Min Travelers <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newPackage.minTravelers}
                      onChange={(e) => setNewPackage({...newPackage, minTravelers: e.target.value})}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="2"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Max Travelers <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newPackage.maxTravelers}
                      onChange={(e) => setNewPackage({...newPackage, maxTravelers: e.target.value})}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="10"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Base Price ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newPackage.basePrice}
                      onChange={(e) => setNewPackage({...newPackage, basePrice: e.target.value})}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="2000"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Min Price ($)
                    </label>
                    <input
                      type="number"
                      value={newPackage.minPrice}
                      onChange={(e) => setNewPackage({...newPackage, minPrice: e.target.value})}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="2000"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Max Price ($)
                    </label>
                    <input
                      type="number"
                      value={newPackage.maxPrice}
                      onChange={(e) => setNewPackage({...newPackage, maxPrice: e.target.value})}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="3000"
                      min="0"
                    />
                  </div>
                  
                  {/* Features Section - Dropdown */}
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Features
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
                      <div className="mb-2 text-sm text-gray-600">Select features:</div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {AVAILABLE_FEATURES.map((feature) => (
                          <div key={feature} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`feature-${feature}`}
                              checked={newPackage.selectedFeatures.includes(feature)}
                              onChange={() => handleFeatureToggle(feature)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label 
                              htmlFor={`feature-${feature}`}
                              className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900"
                            >
                              {feature}
                            </label>
                          </div>
                        ))}
                      </div>
                      
                      {/* Selected Features Preview */}
                      {newPackage.selectedFeatures.length > 0 && (
                        <div className="pt-3 mt-3 border-t border-gray-200">
                          <div className="mb-2 text-sm text-gray-600">Selected Features:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {newPackage.selectedFeatures.map((feature) => (
                              <span 
                                key={feature}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium"
                              >
                                {feature}
                                <button
                                  onClick={() => handleFeatureToggle(feature)}
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  <X size={12} />
                                </button>
                              </span>
                            ))}
                          </div>
                          <p className="mt-2 text-xs text-gray-500">
                            {newPackage.selectedFeatures.length} feature(s) selected
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Best For Section - Radio Buttons */}
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Best For <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {BEST_FOR_OPTIONS.map((option) => (
                        <div key={option.value} className="relative">
                          <input
                            type="radio"
                            id={`bestFor-${option.value}`}
                            name="bestFor"
                            value={option.value}
                            checked={newPackage.bestFor === option.value}
                            onChange={(e) => handleBestForChange(e.target.value)}
                            className="sr-only"
                          />
                          <label
                            htmlFor={`bestFor-${option.value}`}
                            className={`
                              flex items-center justify-center px-3 py-2.5 border rounded-lg cursor-pointer transition-all
                              ${newPackage.bestFor === option.value 
                                ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium ring-2 ring-blue-100' 
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                              }
                            `}
                          >
                            <span className="text-sm">{option.label}</span>
                          </label>
                          {newPackage.bestFor === option.value && (
                            <div className="flex absolute -top-1 -right-1 justify-center items-center w-5 h-5 bg-blue-500 rounded-full">
                              <CheckCircle size={12} className="text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newPackage.description}
                      onChange={(e) => setNewPackage({...newPackage, description: e.target.value})}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-blue-600">Day {day.day}</span>
                        {newPackage.itinerary.length > 1 && (
                          <button
                            onClick={() => removeItineraryDay(index)}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Activity Type
                          </label>
                          <select
                            value={day.activityType}
                            onChange={(e) => updateItineraryDay(index, 'activityType', e.target.value)}
                            className="px-3 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          >
                            <option value="">Select activity type</option>
                            {ITINERARY_ACTIVITIES.map((activity) => (
                              <option key={activity.value} value={activity.value}>
                                {activity.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={day.title}
                            onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                            className="px-3 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="e.g., Arrival in Colombo"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={day.description}
                            onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                            className="px-3 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-gray-900">Hotel {index + 1}</span>
                        {newPackage.hotels.length > 1 && (
                          <button
                            onClick={() => removeHotel(index)}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Hotel Name <span className="text-red-500">*</span>
                          </label>
                          <div className="flex gap-2">
                            <select
                              value={hotel.name}
                              onChange={(e) => updateHotel(index, 'name', e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                              <option value="">Select a hotel</option>
                              {HOTEL_OPTIONS.map((hotelOption) => (
                                <option key={hotelOption.value} value={hotelOption.value}>
                                  {hotelOption.label}
                                </option>
                              ))}
                            </select>
                            <div className="flex items-center text-sm text-gray-500"></div>
                            {/* <input
                              type="text"
                              value={hotel.customName}
                              onChange={(e) => updateHotel(index, 'customName', e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              placeholder="Enter custom hotel name"
                            /> */}
                          </div>
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Rating
                          </label>
                          <select
                            value={hotel.rating}
                            onChange={(e) => updateHotel(index, 'rating', e.target.value)}
                            className="px-3 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          >
                            {HOTEL_RATING_OPTIONS.map((rating) => (
                              <option key={rating.value} value={rating.value}>
                                {rating.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Nights <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={hotel.nights}
                            onChange={(e) => updateHotel(index, 'nights', e.target.value)}
                            className="px-3 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="2"
                            min="1"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Hotel Features
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
                            <div className="mb-2 text-sm text-gray-600">Select features:</div>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                              {HOTEL_FEATURES_OPTIONS.map((feature) => (
                                <div key={feature} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`hotel-${index}-feature-${feature}`}
                                    checked={hotel.features.includes(feature)}
                                    onChange={() => handleHotelFeatureToggle(index, feature)}
                                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                  />
                                  <label 
                                    htmlFor={`hotel-${index}-feature-${feature}`}
                                    className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900"
                                  >
                                    {feature}
                                  </label>
                                </div>
                              ))}
                            </div>
                            
                            {/* Selected Features Preview */}
                            {hotel.features.length > 0 && (
                              <div className="pt-3 mt-3 border-t border-gray-200">
                                <div className="mb-2 text-sm text-gray-600">Selected Features:</div>
                                <div className="flex flex-wrap gap-1.5">
                                  {hotel.features.map((feature) => (
                                    <span 
                                      key={feature}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium"
                                    >
                                      {feature}
                                      <button
                                        onClick={() => handleHotelFeatureToggle(index, feature)}
                                        className="text-green-500 hover:text-green-700"
                                      >
                                        <X size={12} />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                                <p className="mt-2 text-xs text-gray-500">
                                  {hotel.features.length} feature(s) selected
                                </p>
                              </div>
                            )}
                          </div>
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
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-gray-900">Destination {index + 1}</span>
                        {newPackage.destinations.length > 1 && (
                          <button
                            onClick={() => removeDestination(index)}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Destination Name <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={dest.name}
                            onChange={(e) => updateDestination(index, 'name', e.target.value)}
                            className="px-3 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          >
                            <option value="">Select a destination</option>
                            {DESTINATION_OPTIONS.map((destination) => (
                              <option key={destination.value} value={destination.value}>
                                {destination.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Type
                          </label>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                            {DESTINATION_TYPE_OPTIONS.map((type) => (
                              <div key={type.value} className="relative">
                                <input
                                  type="radio"
                                  id={`dest-${index}-type-${type.value}`}
                                  name={`dest-${index}-type`}
                                  value={type.value}
                                  checked={dest.type === type.value}
                                  onChange={(e) => updateDestination(index, 'type', e.target.value)}
                                  className="sr-only"
                                />
                                <label
                                  htmlFor={`dest-${index}-type-${type.value}`}
                                  className={`
                                    flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-all
                                    ${dest.type === type.value 
                                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium ring-2 ring-blue-100' 
                                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                                    }
                                  `}
                                >
                                  <div className="mb-1">{type.icon}</div>
                                  <span className="text-xs text-center">{type.label}</span>
                                </label>
                                {dest.type === type.value && (
                                  <div className="flex absolute -top-1 -right-1 justify-center items-center w-5 h-5 bg-blue-500 rounded-full">
                                    <CheckCircle size={10} className="text-white" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Highlights
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
                            <div className="mb-2 text-sm text-gray-600">Select highlights:</div>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                              {["Ancient Architecture", "Natural Beauty", "Wildlife Viewing", "Photography Spots", 
                                "Cultural Significance", "Hiking Trails", "Local Cuisine", "Guided Tours", 
                                "Museum", "Gardens", "Viewpoints", "Religious Sites"].map((highlight) => (
                                <div key={highlight} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`dest-${index}-highlight-${highlight}`}
                                    checked={dest.highlights.includes(highlight)}
                                    onChange={() => handleDestinationHighlightToggle(index, highlight)}
                                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                                  />
                                  <label 
                                    htmlFor={`dest-${index}-highlight-${highlight}`}
                                    className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900"
                                  >
                                    {highlight}
                                  </label>
                                </div>
                              ))}
                            </div>
                            
                            {/* Selected Highlights Preview */}
                            {dest.highlights.length > 0 && (
                              <div className="pt-3 mt-3 border-t border-gray-200">
                                <div className="mb-2 text-sm text-gray-600">Selected Highlights:</div>
                                <div className="flex flex-wrap gap-1.5">
                                  {dest.highlights.map((highlight) => (
                                    <span 
                                      key={highlight}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium"
                                    >
                                      {highlight}
                                      <button
                                        onClick={() => handleDestinationHighlightToggle(index, highlight)}
                                        className="text-amber-500 hover:text-amber-700"
                                      >
                                        <X size={12} />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                                <p className="mt-2 text-xs text-gray-500">
                                  {dest.highlights.length} highlight(s) selected
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Details Tab (Inclusions/Exclusions) */}
              {activeModalTab === 'details' && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      <span className="flex gap-2 items-center">
                        <CheckCircle size={18} className="text-green-600" />
                        What's Included
                      </span>
                    </label>
                    <textarea
                      value={newPackage.inclusions}
                      onChange={(e) => setNewPackage({...newPackage, inclusions: e.target.value})}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      rows="12"
                      placeholder="Enter each inclusion on a new line:&#10;5-star accommodation&#10;Private AC vehicle with driver&#10;English speaking guide&#10;All entrance fees"
                    />
                    <p className="mt-1 text-xs text-gray-500">Enter each item on a new line</p>
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      <span className="flex gap-2 items-center">
                        <XCircle size={18} className="text-red-600" />
                        What's Excluded
                      </span>
                    </label>
                    <textarea
                      value={newPackage.exclusions}
                      onChange={(e) => setNewPackage({...newPackage, exclusions: e.target.value})}
                      className="px-4 py-2 w-full rounded-lg border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      rows="12"
                      placeholder="Enter each exclusion on a new line:&#10;International flights&#10;Travel insurance&#10;Personal expenses&#10;Tips for guide & driver"
                    />
                    <p className="mt-1 text-xs text-gray-500">Enter each item on a new line</p>
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
                className="px-6 py-2 font-medium rounded-lg border border-gray-300 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowNewPackageModal(false);
                    setActiveModalTab('basic');
                  }}
                  className="px-6 py-2 font-medium rounded-lg border border-gray-300 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                
                {activeModalTab === 'details' ? (
                  <button
                    onClick={handleCreatePackage}
                    disabled={!newPackage.name || !newPackage.durationDays || !newPackage.basePrice || !newPackage.description}
                    className="px-6 py-2 font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg transition hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="px-6 py-2 font-semibold text-white bg-blue-500 rounded-lg transition hover:bg-blue-600"
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
    </DashboardLayout>
  );
};

export default ManagePackages;