import React, { useState, useEffect } from "react";

/* ---------------- CONSTANTS ---------------- */

const COMMON_LANGUAGES = [
  { name: "English", flag: "🇬🇧" },
  { name: "Sinhala", flag: "🇱🇰" },
  { name: "Tamil", flag: "🇮🇳" },
  { name: "French", flag: "🇫🇷" },
  { name: "German", flag: "🇩🇪" },
  { name: "Chinese", flag: "🇨🇳" },
  { name: "Japanese", flag: "🇯🇵" },
  { name: "Russian", flag: "🇷🇺" },
  { name: "Arabic", flag: "🇸🇦" },
  { name: "Spanish", flag: "🇪🇸" },
  { name: "Korean", flag: "🇰🇷" },
  { name: "Italian", flag: "🇮🇹" },
];

const VEHICLE_OPTIONS = {
  Car: {
    icon: "🚗",
    brands: ["Toyota", "Honda", "Nissan", "Suzuki", "Mazda", "Ford", "Mercedes", "BMW"],
    color: "bg-blue-100 border-blue-200"
  },
  Van: {
    icon: "🚐",
    brands: ["Toyota HiAce", "Nissan Caravan", "Mazda Bongo", "Mercedes Sprinter", "Ford Transit"],
    color: "bg-green-100 border-green-200"
  },
  SUV: {
    icon: "🚙",
    brands: ["Toyota Land Cruiser", "Mitsubishi Pajero", "Kia Sorento", "Nissan X-Trail", "Range Rover"],
    color: "bg-purple-100 border-purple-200"
  },
  Bus: {
    icon: "🚌",
    brands: ["Ashok Leyland", "Tata", "Isuzu", "Volvo", "Scania"],
    color: "bg-yellow-100 border-yellow-200"
  },
  "Luxury SUV": {
    icon: "🏎️",
    brands: ["Mercedes-Benz G-Class", "BMW X7", "Range Rover", "Lexus LX", "Audi Q8"],
    color: "bg-pink-100 border-pink-200"
  },
  Minibus: {
    icon: "🚐",
    brands: ["Toyota Coaster", "Nissan Civilian", "Mitsubishi Rosa", "Hyundai County"],
    color: "bg-indigo-100 border-indigo-200"
  }
};

const initialDriver = {
  id: "",
  name: "",
  licenseNumber: "",
  phone: "",
  vehicleType: "",
  vehicleBrand: "",
  customBrand: "",
  vehicleNumber: "",
  passengers: "",
  fluentLanguages: [],
  experience: "",
  availability: "Available",
  // Removed: rating: "5.0",
};

const DriverManagement = () => {
  const [driverData, setDriverData] = useState(initialDriver);
  const [drivers, setDrivers] = useState([
    {
      id: "D001",
      name: "Alice Smith",
      licenseNumber: "A12345",
      phone: "+94 77 123 4567",
      vehicleType: "Car",
      vehicleBrand: "Toyota",
      vehicleNumber: "WP-ABC-1234",
      passengers: 4,
      fluentLanguages: ["English", "French"],
      experience: "5 years",
      availability: "Available",
      // Removed: rating: "4.8",
    },
    {
      id: "D002",
      name: "John Perera",
      licenseNumber: "B67890",
      phone: "+94 76 234 5678",
      vehicleType: "SUV",
      vehicleBrand: "Toyota Land Cruiser",
      vehicleNumber: "KD-XYZ-5678",
      passengers: 7,
      fluentLanguages: ["English", "Sinhala", "Tamil"],
      experience: "8 years",
      availability: "On Trip",
      // Removed: rating: "4.9",
    },
    {
      id: "D003",
      name: "Kamal Silva",
      licenseNumber: "C24680",
      phone: "+94 75 345 6789",
      vehicleType: "Van",
      vehicleBrand: "Toyota HiAce",
      vehicleNumber: "CP-DEF-9012",
      passengers: 12,
      fluentLanguages: ["English", "Sinhala"],
      experience: "3 years",
      availability: "Available",
      // Removed: rating: "4.5",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [otherLanguage, setOtherLanguage] = useState("");
  const [showOtherLanguage, setShowOtherLanguage] = useState(false);
  const [useOtherBrand, setUseOtherBrand] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  /* ---------------- NOTIFICATION ---------------- */
  
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  /* ---------------- HANDLERS ---------------- */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDriverData({ ...driverData, [name]: value });
  };

  const handleVehicleTypeChange = (e) => {
    setDriverData({
      ...driverData,
      vehicleType: e.target.value,
      vehicleBrand: "",
      customBrand: "",
    });
    setUseOtherBrand(false);
  };

  const toggleLanguage = (lang) => {
    setDriverData({
      ...driverData,
      fluentLanguages: driverData.fluentLanguages.includes(lang)
        ? driverData.fluentLanguages.filter((l) => l !== lang)
        : [...driverData.fluentLanguages, lang],
    });
  };

  const addOtherLanguage = () => {
    if (
      otherLanguage.trim() &&
      !driverData.fluentLanguages.includes(otherLanguage)
    ) {
      setDriverData({
        ...driverData,
        fluentLanguages: [...driverData.fluentLanguages, otherLanguage.trim()],
      });
      setOtherLanguage("");
      setShowOtherLanguage(false);
      showNotification(`Added language: ${otherLanguage}`, "success");
    }
  };

  /* ---------------- CRUD OPERATIONS ---------------- */

  // CREATE - Add new driver
  const handleAddDriver = (e) => {
    e.preventDefault();

    const finalBrand = useOtherBrand
      ? driverData.customBrand
      : driverData.vehicleBrand;

    const newDriver = {
      ...driverData,
      vehicleBrand: finalBrand,
      // Removed: rating: driverData.rating || "5.0",
      experience: driverData.experience || "1 year",
      id: `D${String(drivers.length + 1).padStart(3, "0")}`,
    };

    setDrivers([...drivers, newDriver]);
    setDriverData(initialDriver);
    setUseOtherBrand(false);
    setShowOtherLanguage(false);
    showNotification(`Driver ${newDriver.name} added successfully!`, "success");
  };

  // READ - View driver details
  const handleViewDriver = (driver) => {
    setSelectedDriver(driver);
    setShowDriverModal(true);
  };

  // UPDATE - Edit driver
  const handleEditDriver = (driver) => {
    setDriverData(driver);
    setIsEditing(true);
    // If editing from custom brand, set useOtherBrand to true
    const isCustomBrand = !VEHICLE_OPTIONS[driver.vehicleType]?.brands.includes(driver.vehicleBrand);
    setUseOtherBrand(isCustomBrand);
    if (isCustomBrand) {
      setDriverData(prev => ({ ...prev, customBrand: driver.vehicleBrand }));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotification(`Editing driver: ${driver.name}`, "info");
  };

  const handleUpdateDriver = (e) => {
    e.preventDefault();

    const finalBrand = useOtherBrand
      ? driverData.customBrand
      : driverData.vehicleBrand;

    const updatedDriver = {
      ...driverData,
      vehicleBrand: finalBrand,
      // Removed: rating: driverData.rating || "5.0",
      experience: driverData.experience || "1 year",
    };

    setDrivers(drivers.map((d) => (d.id === driverData.id ? updatedDriver : d)));
    setDriverData(initialDriver);
    setIsEditing(false);
    setUseOtherBrand(false);
    setShowOtherLanguage(false);
    showNotification(`Driver ${updatedDriver.name} updated successfully!`, "success");
  };

  // DELETE - Remove driver
  const handleDeleteDriver = (id, name) => {
    if (window.confirm(`Are you sure you want to delete driver "${name}"?`)) {
      setDrivers(drivers.filter((d) => d.id !== id));
      showNotification(`Driver ${name} deleted successfully!`, "warning");
    }
  };

  const handleAvailabilityChange = (id, status) => {
    setDrivers(drivers.map(d => {
      if (d.id === id) {
        showNotification(`Driver ${d.name} status changed to ${status}`, "info");
        return { ...d, availability: status };
      }
      return d;
    }));
  };

  /* ---------------- UTILITY FUNCTIONS ---------------- */

  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch = [d.name, d.licenseNumber, d.vehicleType, d.vehicleBrand, d.vehicleNumber]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      activeFilter === "all" || 
      (activeFilter === "available" && d.availability === "Available") ||
      (activeFilter === "ontrip" && d.availability === "On Trip") ||
      (activeFilter === "busy" && d.availability === "Busy");
    
    return matchesSearch && matchesFilter;
  });

  const getAvailabilityColor = (status) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-800 border-green-200";
      case "On Trip": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Busy": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const resetForm = () => {
    setDriverData(initialDriver);
    setIsEditing(false);
    setUseOtherBrand(false);
    setShowOtherLanguage(false);
    setOtherLanguage("");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-slide-in ${
          notification.type === "success" ? "bg-green-100 text-green-800 border border-green-200" :
          notification.type === "warning" ? "bg-yellow-100 text-yellow-800 border border-yellow-200" :
          "bg-blue-100 text-blue-800 border border-blue-200"
        }`}>
          <div className="flex items-center gap-3">
            {notification.type === "success" && "✅"}
            {notification.type === "warning" && "⚠️"}
            {notification.type === "info" && "ℹ️"}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Driver Details Modal */}
      {showDriverModal && selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">👤 Driver Details</h2>
                <button
                  onClick={() => setShowDriverModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-semibold text-lg">{selectedDriver.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">License Number</p>
                      <p className="font-semibold">{selectedDriver.licenseNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-semibold">{selectedDriver.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-semibold">{selectedDriver.experience}</p>
                    </div>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">🚙 Vehicle Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Vehicle Type</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl">{VEHICLE_OPTIONS[selectedDriver.vehicleType]?.icon || "🚗"}</span>
                        <span className="font-semibold">{selectedDriver.vehicleType}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vehicle Brand</p>
                      <p className="font-semibold">{selectedDriver.vehicleBrand}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vehicle Number</p>
                      <p className="font-semibold">{selectedDriver.vehicleNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Passenger Capacity</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl">👥</span>
                        <span className="font-semibold text-lg">{selectedDriver.passengers} seats</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Languages & Status - UPDATED: Removed rating */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">🗣️ Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedDriver.fluentLanguages.map((lang) => {
                          const langData = COMMON_LANGUAGES.find(l => l.name === lang);
                          return (
                            <span key={lang} className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                              {langData?.flag || "🌍"} {lang}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Status</h3>
                      <div className="space-y-3">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getAvailabilityColor(selectedDriver.availability)}`}>
                          {selectedDriver.availability}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => {
                      handleEditDriver(selectedDriver);
                      setShowDriverModal(false);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    ✏️ Edit Driver
                  </button>
                  <button
                    onClick={() => {
                      setShowDriverModal(false);
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🚗 Driver Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your fleet drivers, vehicles, and availability
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                  <span className="font-semibold text-gray-700">{drivers.length}</span>
                  <span className="text-gray-500 ml-2">Total Drivers</span>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                  <span className="font-semibold text-green-600">
                    {drivers.filter(d => d.availability === "Available").length}
                  </span>
                  <span className="text-gray-500 ml-2">Available</span>
                </div>
              </div>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                🔄 Reset
              </button>
            </div>
          </div>

          {/* Stats Cards - UPDATED: Removed Avg. Rating card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Active Vehicles</p>
                  <p className="text-2xl font-bold mt-1">{drivers.length}</p>
                </div>
                <div className="text-3xl">🚙</div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Capacity</p>
                  <p className="text-2xl font-bold mt-1">
                    {drivers.reduce((sum, d) => sum + parseInt(d.passengers), 0)} seats
                  </p>
                </div>
                <div className="text-3xl">👥</div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-5 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">On Trip</p>
                  <p className="text-2xl font-bold mt-1">
                    {drivers.filter(d => d.availability === "On Trip").length}
                  </p>
                </div>
                <div className="text-3xl">🚀</div> {/* Changed from ⭐ to 🚀 */}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isEditing ? (
                    <>
                      ✏️ Update Driver
                      <span className="ml-3 text-sm font-normal bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                        Editing: {driverData.name}
                      </span>
                    </>
                  ) : (
                    "👤 Add New Driver"
                  )}
                </h2>
                {isEditing && (
                  <button
                    onClick={resetForm}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={isEditing ? handleUpdateDriver : handleAddDriver} className="space-y-6">
                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Driver Name *
                    </label>
                    <input
                      name="name"
                      placeholder="Full name"
                      value={driverData.name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Number *
                    </label>
                    <input
                      name="licenseNumber"
                      placeholder="e.g., A12345"
                      value={driverData.licenseNumber}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      name="phone"
                      placeholder="+94 77 123 4567"
                      value={driverData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience
                    </label>
                    <input
                      name="experience"
                      placeholder="e.g., 5 years"
                      value={driverData.experience}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    🚙 Vehicle Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Type *
                      </label>
                      <select
                        value={driverData.vehicleType}
                        onChange={handleVehicleTypeChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="">Select Vehicle Type</option>
                        {Object.entries(VEHICLE_OPTIONS).map(([type, data]) => (
                          <option key={type} value={type}>
                            {data.icon} {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Number *
                      </label>
                      <input
                        name="vehicleNumber"
                        placeholder="e.g., WP-ABC-1234"
                        value={driverData.vehicleNumber}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Passenger Capacity *
                      </label>
                      <input
                        type="number"
                        name="passengers"
                        placeholder="Number of seats"
                        value={driverData.passengers}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Brand *
                      </label>
                      {driverData.vehicleType && !useOtherBrand ? (
                        <select
                          name="vehicleBrand"
                          value={driverData.vehicleBrand}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        >
                          <option value="">Select Brand</option>
                          {VEHICLE_OPTIONS[driverData.vehicleType]?.brands.map((brand) => (
                            <option key={brand}>{brand}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          name="customBrand"
                          placeholder="Enter vehicle brand"
                          value={driverData.customBrand}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required={useOtherBrand}
                        />
                      )}
                      
                      {driverData.vehicleType && (
                        <div className="flex items-center gap-3 mt-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={useOtherBrand}
                              onChange={() => setUseOtherBrand(!useOtherBrand)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">Use custom brand</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Languages Section */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    🗣️ Fluent Languages
                  </h3>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-3">
                      Select languages this driver is fluent in:
                    </p>
                    <div className="language-grid">
                      {COMMON_LANGUAGES.map(({ name, flag }) => (
                        <label
                          key={name}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                            driverData.fluentLanguages.includes(name)
                              ? "bg-blue-50 border border-blue-200"
                              : "bg-white border border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={driverData.fluentLanguages.includes(name)}
                            onChange={() => toggleLanguage(name)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-lg">{flag}</span>
                          <span className="text-sm">{name}</span>
                        </label>
                      ))}
                      
                      <div
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          showOtherLanguage
                            ? "bg-green-50 border border-green-200"
                            : "bg-white border border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => setShowOtherLanguage(!showOtherLanguage)}
                      >
                        <input
                          type="checkbox"
                          checked={showOtherLanguage}
                          onChange={() => setShowOtherLanguage(!showOtherLanguage)}
                          className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                        />
                        <span className="text-lg">🌍</span>
                        <span className="text-sm">Other</span>
                      </div>
                    </div>
                  </div>

                  {showOtherLanguage && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add Custom Language
                      </label>
                      <div className="flex gap-2">
                        <input
                          value={otherLanguage}
                          onChange={(e) => setOtherLanguage(e.target.value)}
                          placeholder="Enter language name"
                          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && addOtherLanguage()}
                        />
                        <button
                          type="button"
                          onClick={addOtherLanguage}
                          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}

                  {driverData.fluentLanguages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Selected Languages:</p>
                      <div className="flex flex-wrap gap-2">
                        {driverData.fluentLanguages.map((lang) => {
                          const langData = COMMON_LANGUAGES.find(l => l.name === lang);
                          return (
                            <span
                              key={lang}
                              className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                            >
                              {langData?.flag || "🌍"} {lang}
                              <button
                                type="button"
                                onClick={() => toggleLanguage(lang)}
                                className="text-blue-500 hover:text-blue-700 ml-1"
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Availability - UPDATED: Removed rating part, kept only availability */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability
                    </label>
                    <select
                      name="availability"
                      value={driverData.availability}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="Available">🟢 Available</option>
                      <option value="On Trip">🔵 On Trip</option>
                      <option value="Busy">🟡 Busy</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isEditing ? (
                      <>
                        💾 Save Changes
                      </>
                    ) : (
                      <>
                        👤 Add Driver
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Driver List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-6">
              {/* Search and Filters */}
              <div className="mb-6">
                <div className="relative mb-4">
                  <input
                    placeholder=" Search drivers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <div className="absolute left-4 top-3.5 text-gray-400">
                    🔍
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeFilter === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All ({drivers.length})
                  </button>
                  <button
                    onClick={() => setActiveFilter("available")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeFilter === "available"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Available ({drivers.filter(d => d.availability === "Available").length})
                  </button>
                  <button
                    onClick={() => setActiveFilter("ontrip")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeFilter === "ontrip"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    On Trip ({drivers.filter(d => d.availability === "On Trip").length})
                  </button>
                </div>
              </div>

              {/* Driver Cards - UPDATED: Removed rating display */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {filteredDrivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-800">{driver.name}</h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                            {driver.id}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{driver.phone}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getAvailabilityColor(driver.availability)}`}>
                          {driver.availability}
                        </span>
                        <div className="flex gap-1">
                          <select
                            value={driver.availability}
                            onChange={(e) => handleAvailabilityChange(driver.id, e.target.value)}
                            className="text-xs border rounded px-1 py-0.5"
                          >
                            <option value="Available">🟢</option>
                            <option value="On Trip">🔵</option>
                            <option value="Busy">🟡</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-white p-2 rounded-lg">
                        <p className="text-xs text-gray-500">Vehicle</p>
                        <p className="font-medium">
                          {VEHICLE_OPTIONS[driver.vehicleType]?.icon || "🚗"} {driver.vehicleType}
                        </p>
                        <p className="text-sm text-gray-600">{driver.vehicleBrand}</p>
                      </div>
                      <div className="bg-white p-2 rounded-lg">
                        <p className="text-xs text-gray-500">Capacity</p>
                        <p className="font-medium text-lg">{driver.passengers} 👥</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Languages</p>
                      <div className="flex flex-wrap gap-1">
                        {driver.fluentLanguages.slice(0, 3).map((lang) => {
                          const langData = COMMON_LANGUAGES.find(l => l.name === lang);
                          return (
                            <span key={lang} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {langData?.flag || "🌍"} {lang}
                            </span>
                          );
                        })}
                        {driver.fluentLanguages.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{driver.fluentLanguages.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {/* Removed: <span className="text-yellow-500">⭐</span>
                        Removed: <span className="font-medium">{driver.rating}</span> */}
                        <span className="text-xs text-gray-500">{driver.experience}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDriver(driver)}
                          className="text-gray-600 hover:text-gray-800 text-sm font-medium px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleEditDriver(driver)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteDriver(driver.id, driver.name)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredDrivers.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">🚗</div>
                    <p className="text-gray-500">No drivers found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white p-5 rounded-2xl">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                📊 Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Active Drivers</span>
                  <span className="font-bold">{drivers.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Languages</span>
                  <span className="font-bold">
                    {Array.from(new Set(drivers.flatMap(d => d.fluentLanguages))).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Vehicle Types</span>
                  <span className="font-bold">
                    {Array.from(new Set(drivers.map(d => d.vehicleType))).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .language-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 8px;
        }
        
        @media (max-width: 640px) {
          .language-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default DriverManagement;