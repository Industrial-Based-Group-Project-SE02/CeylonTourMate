
import React, { useState } from 'react';

const TourPackage = () => {
  // Package data from booking.jsx structure
  const [packages, setPackages] = useState([
    { 
      id: 1, 
      name: "Gold Package", 
      destination: "Sri Lanka", 
      price: 1200, 
      duration: "7 Days", 
      status: "Popular",
      description: "Premium experience with luxury accommodations",
      features: [
        "5-Star Hotel Accommodation",
        "Private Transportation",
        "Professional Tour Guide",
        "All Meals Included",
        "Spa & Wellness Sessions"
      ],
      category: "premium"
    },
    { 
      id: 2, 
      name: "Platinum Package", 
      destination: "Maldives", 
      price: 2500, 
      duration: "10 Days", 
      status: "Luxury",
      description: "Ultimate luxury experience with exclusive services",
      features: [
        "Luxury Villa with Private Pool",
        "Seaplane Transfers",
        "Personal Butler",
        "Gourmet Dining",
        "Private Yacht Excursions"
      ],
      category: "luxury"
    },
    { 
      id: 3, 
      name: "Silver Package", 
      destination: "Thailand", 
      price: 800, 
      duration: "5 Days", 
      status: "Budget Friendly",
      description: "Comfortable travel with essential amenities",
      features: [
        "4-Star Hotel",
        "Group Transportation",
        "Half Board Meals",
        "Local Guide",
        "Basic Sightseeing"
      ],
      category: "standard"
    },
    { 
      id: 4, 
      name: "Customize Package", 
      destination: "Any Destination", 
      price: "Custom", 
      duration: "Flexible", 
      status: "Tailor Made",
      description: "Create your own personalized travel itinerary",
      features: [
        "Choose Your Own Destinations",
        "Flexible Duration",
        "Custom Activities",
        "Budget Control",
        "Personal Preferences"
      ],
      category: "custom"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter packages based on search and category
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || pkg.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get category count
  const categoryCount = {
    all: packages.length,
    premium: packages.filter(p => p.category === "premium").length,
    luxury: packages.filter(p => p.category === "luxury").length,
    standard: packages.filter(p => p.category === "standard").length,
    custom: packages.filter(p => p.category === "custom").length
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="flex flex-col gap-4 justify-between mb-8 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">Tour Packages</h1>
          <p className="text-gray-500">Choose from our curated packages or customize your own adventure</p>
        </div>
        <button className="flex gap-2 items-center px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md transition-all hover:bg-blue-700 hover:shadow-lg">
          <i className="fas fa-plus"></i>
          Create Custom Package
        </button>
      </div>

      {/* Search & Filter Section */}
      <div className="p-6 mb-8 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <i className="absolute left-4 top-1/2 text-gray-400 -translate-y-1/2 fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search packages, destinations, or features..." 
                className="py-3 pr-4 pl-12 w-full rounded-lg border border-gray-200 transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-4 py-2 rounded-lg border transition-all ${selectedCategory === "all" ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
              onClick={() => setSelectedCategory("all")}
            >
              All Packages ({categoryCount.all})
            </button>
            <button 
              className={`px-4 py-2 rounded-lg border transition-all ${selectedCategory === "premium" ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
              onClick={() => setSelectedCategory("premium")}
            >
              Premium ({categoryCount.premium})
            </button>
            <button 
              className={`px-4 py-2 rounded-lg border transition-all ${selectedCategory === "luxury" ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
              onClick={() => setSelectedCategory("luxury")}
            >
              Luxury ({categoryCount.luxury})
            </button>
            <button 
              className={`px-4 py-2 rounded-lg border transition-all ${selectedCategory === "standard" ? 'bg-gray-100 text-gray-700 border-gray-300' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
              onClick={() => setSelectedCategory("standard")}
            >
              Standard ({categoryCount.standard})
            </button>
            <button 
              className={`px-4 py-2 rounded-lg border transition-all ${selectedCategory === "custom" ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
              onClick={() => setSelectedCategory("custom")}
            >
              Custom ({categoryCount.custom})
            </button>
          </div>
        </div>
      </div>

      {/* Package Grid/Table View */}
      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} className="overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
            <div className="p-6">
              {/* Package Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex gap-2 items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{pkg.name}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      pkg.category === 'luxury' ? 'bg-purple-100 text-purple-700' :
                      pkg.category === 'premium' ? 'bg-yellow-100 text-yellow-700' :
                      pkg.category === 'custom' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {pkg.status}
                    </span>
                  </div>
                  <div className="flex items-center mb-2 text-gray-600">
                    <i className="mr-2 text-blue-500 fas fa-map-marker-alt"></i>
                    <span className="font-medium">{pkg.destination}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {pkg.price === "Custom" ? "Custom Price" : `$${pkg.price}`}
                  </div>
                  <div className="text-sm text-gray-500">{pkg.duration}</div>
                </div>
              </div>

              {/* Package Description */}
              <p className="mb-4 text-gray-600">{pkg.description}</p>

              {/* Features */}
              <div className="mb-6">
                <h4 className="mb-2 text-sm font-semibold text-gray-700">Package Includes:</h4>
                <ul className="grid grid-cols-2 gap-1">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <i className="mr-2 text-xs text-green-500 fas fa-check-circle"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <button className="flex gap-2 items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                  <i className="fas fa-info-circle"></i>
                  View Details
                </button>
                <div className="flex gap-3">
                  <button className="px-4 py-2 font-medium text-blue-600 rounded-lg border border-blue-600 transition-colors hover:bg-blue-50">
                    Add to Wishlist
                  </button>
                  <button className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-sm transition-colors hover:bg-blue-700">
                    {pkg.category === 'custom' ? 'Customize' : 'Book Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alternative Table View (for larger screens) */}
      <div className="hidden overflow-hidden mt-8 bg-white rounded-xl border border-gray-200 shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">Package Details</th>
                <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">Destination</th>
                <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">Price</th>
                <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-500 uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-bold tracking-wider text-right text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPackages.map((pkg) => (
                <tr key={pkg.id} className="transition-colors hover:bg-blue-50/30 group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-800 transition-colors group-hover:text-blue-600">{pkg.name}</div>
                    <div className="mt-1 text-sm text-gray-500">{pkg.description.substring(0, 60)}...</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-600">
                      <i className="mr-2 text-blue-500 fas fa-map-marker-alt"></i>
                      {pkg.destination}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{pkg.duration}</td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-gray-900">
                      {pkg.price === "Custom" ? "Custom" : `$${pkg.price}`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      pkg.category === 'luxury' ? 'bg-purple-100 text-purple-700' :
                      pkg.category === 'premium' ? 'bg-yellow-100 text-yellow-700' :
                      pkg.category === 'custom' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {pkg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm transition-all hover:bg-blue-700 hover:shadow-md">
                      {pkg.category === 'custom' ? 'Customize' : 'Book Now'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredPackages.length === 0 && (
        <div className="py-12 text-center bg-white rounded-xl border border-gray-200">
          <i className="mb-4 text-4xl text-gray-300 fas fa-search"></i>
          <h3 className="mb-2 text-xl font-semibold text-gray-600">No packages found</h3>
          <p className="mb-4 text-gray-500">Try adjusting your search or filter criteria</p>
          <button 
            className="font-medium text-blue-600 hover:text-blue-800"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default TourPackage;















        





tourist: [
      { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt' },
      { name: 'Tour Packages', path: '/tourist/tour_package', icon: 'fas fa-suitcase' },
      { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
      { name: 'Book a Trip', path: '/tourist/bookingForm', icon: 'fas fa-calendar-plus' },
      { name: 'My Bookings', path: '/tourist/trip_history', icon: 'fas fa-calendar-check' },
      { name: 'Feed Back', path: '/tourist/cutomerFeedback', icon: 'fas fa-comment-alt' },
    ]