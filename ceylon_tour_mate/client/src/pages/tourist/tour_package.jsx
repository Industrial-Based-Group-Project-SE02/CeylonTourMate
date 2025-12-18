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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Tour Packages</h1>
          <p className="text-gray-500">Choose from our curated packages or customize your own adventure</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
          <i className="fas fa-plus"></i>
          Create Custom Package
        </button>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                placeholder="Search packages, destinations, or features..." 
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Package Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
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
                  <div className="flex items-center text-gray-600 mb-2">
                    <i className="fas fa-map-marker-alt mr-2 text-blue-500"></i>
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
              <p className="text-gray-600 mb-4">{pkg.description}</p>

              {/* Features */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Package Includes:</h4>
                <ul className="grid grid-cols-2 gap-1">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-check-circle text-green-500 mr-2 text-xs"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-2">
                  <i className="fas fa-info-circle"></i>
                  View Details
                </button>
                <div className="flex gap-3">
                  <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors">
                    Add to Wishlist
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-sm">
                    {pkg.category === 'custom' ? 'Customize' : 'Book Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alternative Table View (for larger screens) */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mt-8 hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Package Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPackages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{pkg.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{pkg.description.substring(0, 60)}...</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-600">
                      <i className="fas fa-map-marker-alt mr-2 text-blue-500"></i>
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
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md">
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
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No packages found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <button 
            className="text-blue-600 hover:text-blue-800 font-medium"
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