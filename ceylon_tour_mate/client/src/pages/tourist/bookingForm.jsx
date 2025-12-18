// Path: client/src/pages/bookingForm.jsx
import React, { useEffect, useMemo, useState } from "react";

export default function BookingForm() {
  /* ===================== CONFIG ===================== */
  const PRICES = useMemo(() => ({
    Gold: 200,
    Platinum: 160,
    Silver: 80,
  }), []);

  const PACKAGE_DESCRIPTIONS = useMemo(() => ({
    Gold: {
      price: 200,
      description: "Premium experience with all luxury amenities included",
      features: [
        "Luxury SUV + chauffeur",
        "4★ - 5★ hotel accommodation",
        "Breakfast & dinner included",
        "VIP meet & greet",
        "All tours included",
        "Local SIM + Pocket Wi-Fi"
      ],
      color: "linear-gradient(135deg, #FFD700 0%, #FFC300 100%)",
      borderColor: "#FFD700",
      textColor: "#8B6914"
    },
    Platinum: {
      price: 160,
      description: "Comfortable experience with essential amenities",
      features: [
        "Private car/van with driver",
        "3★–4★ hotel accommodation",
        "Breakfast included",
        "Airport pick-up",
        "Select tours included",
        "Local SIM card"
      ],
      color: "linear-gradient(135deg, #E5E4E2 0%, #C0C0C0 100%)",
      borderColor: "#C0C0C0",
      textColor: "#4A5568"
    },
    Silver: {
      price: 80,
      description: "Budget-friendly basic package",
      features: [
        "Standard car/shared vehicle",
        "3★ hotel / guesthouse",
        "Basic transfers",
        "Essential services only"
      ],
      color: "linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)",
      borderColor: "#A8A8A8",
      textColor: "#4A5568"
    }
  }), []);

  const COMPONENT_PRICING = useMemo(() => ({
    hotel_3star_guesthouse: { name: "3★ hotel / guesthouse", price: 30, type: "accommodation", icon: "🏨" },
    hotel_3_4star: { name: "3★–4★ hotel", price: 40, type: "accommodation", icon: "🏨" },
    hotel_4_5star: { name: "4★–5★ hotel", price: 60, type: "accommodation", icon: "🏨" },
    breakfast_included: { name: "Breakfast included", price: 5, type: "meal", icon: "🍽️" },
    dinner_upgrade: { name: "Dinner upgrade", price: 25, type: "meal", icon: "🍽️" },
    safari_tour: { name: "Safari / hiking tour", price: 35, type: "tour", icon: "🦁" },
    free_sim_card: { name: "Local SIM card", price: 12, type: "service", icon: "📱" },
    free_wifi: { name: "Pocket Wi-Fi", price: 18, type: "service", icon: "📶" },
    vip_meet_greet: { name: "VIP meet & greet", price: 15, type: "service", icon: "⭐" },
    child_seat: { name: "Child seat", price: 8, type: "service", icon: "👶" },
    extra_stop: { name: "Extra stop", price: 10, type: "service", icon: "📍" },
  }), []);

  // Hotel options for dropdown
  const HOTEL_OPTIONS = useMemo(() => ({
    hotel_3star_guesthouse: [
      "Cinnamon Red Colombo",
      "Fairway Colombo",
      "Garden Hotel Colombo",
      "Other 3★ Guesthouse"
    ],
    hotel_3_4star: [
      "Cinnamon Lakeside Colombo",
      "Hilton Colombo",
      "Cinnamon Grand Colombo",
      "Ramada Colombo"
    ],
    hotel_4_5star: [
      "Shangri-La Colombo",
      "Kingsbury Colombo",
      "Marino Beach Colombo",
      "Cinnamon Bentota Beach"
    ]
  }), []);

  // Vehicle options with brands
  const VEHICLE_OPTIONS = useMemo(() => ({
    sedan: {
      name: "Sedan",
      price: 0,
      icon: "🚗",
      brands: [
        "Toyota Corolla",
        "Honda Civic", 
        "Toyota Camry",
        "Nissan Sunny",
        "Mazda 3",
        "Other Sedan"
      ]
    },
    suv: {
      name: "SUV",
      price: 20,
      icon: "🚙",
      brands: [
        "Toyota Land Cruiser",
        "Mitsubishi Pajero",
        "Toyota Fortuner",
        "Nissan X-Trail",
        "Kia Sorento",
        "Other SUV"
      ]
    },
    van: {
      name: "Van",
      price: 30,
      icon: "🚐",
      brands: [
        "Toyota HiAce",
        "Nissan Caravan",
        "Mercedes-Benz Sprinter",
        "Toyota Hiace Commuter",
        "Other Van"
      ]
    },
    luxury_suv: {
      name: "Luxury SUV",
      price: 50,
      icon: "🏎️",
      brands: [
        "Mercedes-Benz G-Class",
        "BMW X5",
        "Range Rover",
        "Lexus LX",
        "Other Luxury SUV"
      ]
    },
    minibus: {
      name: "Minibus",
      price: 80,
      icon: "🚌",
      brands: [
        "Toyota Coaster (15-20 seater)",
        "Nissan Civilian",
        "Mitsubishi Rosa",
        "Other Minibus"
      ]
    },
    other: {
      name: "Other",
      price: 0,
      icon: "🚘",
      brands: ["Please specify in notes"]
    }
  }), []);

  // Language options with flags
  const LANGUAGE_OPTIONS = useMemo(() => [
    { name: "English", flag: "🇬🇧" },
    { name: "Sinhala", flag: "🇱🇰" },
    { name: "Tamil", flag: "🇮🇳" },
    { name: "Chinese (Mandarin)", flag: "🇨🇳" },
    { name: "Japanese", flag: "🇯🇵" },
    { name: "Korean", flag: "🇰🇷" },
    { name: "French", flag: "🇫🇷" },
    { name: "German", flag: "🇩🇪" },
    { name: "Spanish", flag: "🇪🇸" },
    { name: "Russian", flag: "🇷🇺" },
    { name: "Arabic", flag: "🇸🇦" }
  ], []);

  /* ===================== STATE ===================== */
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    passportNumber: "",
    flightNumber: "",
    arrivalDate: "",
    arrivalTime: "",
    travelDays: "1",
    vehicleType: "",
    vehicleBrand: "",
    pax: "1",
    pickup: "",
    package: "Gold",
    notes: "",
  });

  const [estimatedPrice, setEstimatedPrice] = useState("USD —");
  const [showCustomizeOptions, setShowCustomizeOptions] = useState(false);
  const [isCustomPackage, setIsCustomPackage] = useState(false);
  const [customPackageSelections, setCustomPackageSelections] = useState({});
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [showOtherLanguage, setShowOtherLanguage] = useState(false);
  const [otherLanguage, setOtherLanguage] = useState("");
  const [selectedHotel, setSelectedHotel] = useState({
    type: "",
    specificHotel: ""
  });

  /* ===================== LOGIC ===================== */
  useEffect(() => {
    let base = 0;
    let vehicleExtra = 0;
    let daysMultiplier = parseInt(form.travelDays) || 1;
    
    // Add vehicle cost if specified
    if (form.vehicleType && VEHICLE_OPTIONS[form.vehicleType]) {
      vehicleExtra = VEHICLE_OPTIONS[form.vehicleType].price * daysMultiplier;
    }
    
    if (isCustomPackage) {
      // Calculate custom package price from selected components
      base = Object.keys(customPackageSelections).reduce((sum, key) => {
        const component = COMPONENT_PRICING[key];
        if (!component) return sum;
        return sum + component.price;
      }, 0);
    } else {
      base = PACKAGE_DESCRIPTIONS[form.package]?.price || 0;
    }

    let paxMultiplier = 1;
    if (form.pax === "2") paxMultiplier = 1.15;
    if (form.pax === "3") paxMultiplier = 1.3;
    if (form.pax === "4") paxMultiplier = 1.5;
    if (form.pax === "5+") paxMultiplier = 1.9;

    const total = Math.round((base + vehicleExtra) * paxMultiplier);
    setEstimatedPrice(`USD ${total}`);
  }, [form, PACKAGE_DESCRIPTIONS, COMPONENT_PRICING, isCustomPackage, customPackageSelections, VEHICLE_OPTIONS]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleHotelSelection = (hotelType) => {
    setSelectedHotel({
      type: hotelType,
      specificHotel: ""
    });
  };

  const handleSpecificHotelChange = (value) => {
    setSelectedHotel(prev => ({
      ...prev,
      specificHotel: value
    }));
  };

  const toggleLanguage = (language) => {
    if (language === "Other") {
      setShowOtherLanguage(!showOtherLanguage);
      if (!showOtherLanguage) {
        setSelectedLanguages(prev => [...prev, "Other"]);
      } else {
        setSelectedLanguages(prev => prev.filter(l => l !== "Other"));
        setOtherLanguage("");
      }
    } else {
      setSelectedLanguages(prev =>
        prev.includes(language) 
          ? prev.filter(l => l !== language)
          : [...prev, language]
      );
    }
  };

  const toggleCustomSelection = (key, type) => {
    // For accommodation (hotels), only allow one selection
    if (type === "accommodation") {
      // Deselect all other accommodation options
      const newSelections = {};
      Object.keys(COMPONENT_PRICING).forEach(k => {
        if (COMPONENT_PRICING[k].type === "accommodation") {
          newSelections[k] = false;
        } else {
          newSelections[k] = customPackageSelections[k] || false;
        }
      });
      // Toggle the selected one
      newSelections[key] = !customPackageSelections[key];
      setCustomPackageSelections(newSelections);
    } else {
      // For other types, toggle normally
      setCustomPackageSelections(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    }
  };

  const handlePackageSelect = (pkg) => {
    setForm({ ...form, package: pkg });
    setIsCustomPackage(false);
    setShowCustomizeOptions(false);
  };

  const handleCustomizeClick = () => {
    if (!showCustomizeOptions) {
      setIsCustomPackage(true);
      setForm({ ...form, package: "Custom" });
    }
    setShowCustomizeOptions(!showCustomizeOptions);
  };

  const handleBookClick = () => {
    const bookingDetails = {
      package: form.package,
      price: estimatedPrice,
      name: form.fullname,
      email: form.email,
      flight: form.flightNumber,
      date: form.arrivalDate,
      time: form.arrivalTime,
      days: form.travelDays,
      languages: selectedLanguages
        .filter(l => l !== "Other" || otherLanguage)
        .map(l => l === "Other" && otherLanguage ? otherLanguage : l)
        .join(", ") || "Not specified",
      vehicle: form.vehicleType ? `${VEHICLE_OPTIONS[form.vehicleType]?.name}${form.vehicleBrand ? ` - ${form.vehicleBrand}` : ''}` : "Not specified"
    };
    
    const message = `✨ **Booking Confirmation** ✨

🎯 **Package:** ${bookingDetails.package}
💰 **Total Price:** ${bookingDetails.price}
👤 **Name:** ${bookingDetails.name}
📧 **Email:** ${bookingDetails.email}
✈️ **Flight:** ${bookingDetails.flight}
📅 **Arrival:** ${bookingDetails.date} at ${bookingDetails.time}
⏳ **Duration:** ${bookingDetails.days} days
🗣️ **Languages:** ${bookingDetails.languages}
🚗 **Vehicle:** ${bookingDetails.vehicle}

✅ **Your booking has been submitted successfully!**
📋 A detailed itinerary will be sent to your email within 24 hours.
🤝 Welcome to Sri Lanka!`;

    alert(message);
  };

  /* ===================== UI ===================== */
  return (
    <div className="page">
      <style>{`
        body { 
          margin:0; 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }
        .page { 
          padding:20px; 
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container { 
          max-width:1200px; 
          width: 100%;
          margin:auto; 
          background:#fff; 
          border-radius:24px; 
          box-shadow:0 25px 50px rgba(0,0,0,.15), 0 10px 30px rgba(0,0,0,.1); 
          overflow:hidden;
          animation: slideUp 0.6s ease-out;
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(20px); }
          to { opacity:1; transform:translateY(0); }
        }
        h1 { 
          margin:0 0 10px; 
          color:white; 
          font-size:42px; 
          font-weight:800;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        h2 { 
          color:#1a202c; 
          margin:30px 0 20px; 
          font-size:28px; 
          font-weight:700;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        h2:before {
          content: "";
          display: block;
          width: 6px;
          height: 28px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 3px;
        }
        h3 { 
          color:#2d3748; 
          margin:25px 0 15px; 
          font-size:20px; 
          font-weight:600;
        }
        .header { 
          padding:40px; 
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
          color:white; 
          position: relative;
          overflow: hidden;
        }
        .header:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
          opacity: 0.1;
        }
        .header p { 
          margin:0; 
          opacity:.95; 
          font-size:18px;
          font-weight: 400;
          max-width: 600px;
        }
        .content { 
          padding:40px; 
        }
        label { 
          font-weight:600; 
          display:block; 
          margin-bottom:10px; 
          color:#2d3748; 
          font-size:15px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        label:before {
          content: "•";
          color: #667eea;
          font-weight: bold;
        }
        input, select, textarea {
          width:100%; 
          padding:14px 16px; 
          border:2px solid #e2e8f0;
          border-radius:12px; 
          margin-bottom:25px;
          font-size:16px; 
          transition:all .3s ease;
          background: #f8fafc;
          color: #2d3748;
        }
        input:hover, select:hover, textarea:hover {
          border-color: #cbd5e0;
          background: #fff;
        }
        input:focus, select:focus, textarea:focus {
          outline:none; 
          border-color:#667eea; 
          box-shadow:0 0 0 4px rgba(102, 126, 234, 0.1);
          background: #fff;
        }
        textarea { 
          resize:vertical; 
          min-height:120px;
          line-height: 1.6;
        }
        .grid { 
          display:grid; 
          grid-template-columns:1fr 1fr; 
          gap:30px; 
        }
        .grid-4 { 
          display:grid; 
          grid-template-columns:1fr 1fr 1fr 1fr; 
          gap:25px; 
        }
        .packages { 
          display:grid; 
          grid-template-columns:repeat(3,1fr); 
          gap:25px; 
          margin-top:20px; 
        }
        .package {
          border:2px solid #e2e8f0; 
          border-radius:16px; 
          padding:25px;
          cursor:pointer; 
          transition:all .4s cubic-bezier(0.4, 0, 0.2, 1);
          background:#fff;
          position:relative;
          overflow: hidden;
        }
        .package:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--package-color);
          transition: height 0.3s ease;
        }
        .package:hover { 
          transform:translateY(-8px); 
          box-shadow:0 20px 40px rgba(0,0,0,.1);
        }
        .package:hover:before {
          height: 6px;
        }
        .package.active { 
          border-color:var(--package-border); 
          background:var(--package-bg);
          box-shadow:0 15px 30px rgba(0,0,0,.1);
        }
        .package h4 { 
          margin:0 0 15px; 
          color:var(--package-text); 
          font-size:22px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .package-price { 
          font-size:32px; 
          font-weight:800; 
          color:var(--package-text); 
          margin:15px 0; 
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .package-desc { 
          color:#718096; 
          font-size:15px; 
          margin:15px 0; 
          line-height: 1.6;
        }
        .package-features { 
          list-style:none; 
          padding:0; 
          margin:20px 0 0; 
        }
        .package-features li { 
          padding:8px 0; 
          font-size:14px; 
          color:#4a5568; 
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .package-features li:before { 
          content:"✓"; 
          color:#10b981; 
          font-weight:bold;
          font-size: 16px;
        }
        .package-buttons { 
          display:flex; 
          gap:12px; 
          margin-top:25px; 
        }
        .section { 
          background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
          padding:30px; 
          border-radius:16px; 
          margin:30px 0; 
          border-left: 5px solid #667eea;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .priceBox {
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
          padding:35px; 
          border-radius:16px;
          font-size:36px; 
          font-weight:800; 
          color:white;
          text-align:center; 
          margin-top:35px;
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
          position: relative;
          overflow: hidden;
        }
        .priceBox:before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          right: -50%;
          bottom: -50%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 3s infinite linear;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }
        .actions { 
          display:flex; 
          gap:20px; 
          margin-top:40px; 
          align-items:center;
          flex-wrap: wrap;
        }
        button {
          padding:16px 32px; 
          border:none; 
          border-radius:12px;
          cursor:pointer; 
          font-weight:600; 
          font-size:16px;
          transition:all .3s ease; 
          display:flex; 
          align-items:center; 
          justify-content: center;
          gap:10px;
          min-width: 160px;
          position: relative;
          overflow: hidden;
        }
        button:after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 5px;
          height: 5px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 0;
          border-radius: 100%;
          transform: scale(1, 1) translate(-50%);
          transform-origin: 50% 50%;
        }
        button:focus:not(:active)::after {
          animation: ripple 1s ease-out;
        }
        @keyframes ripple {
          0% { transform: scale(0, 0); opacity: 0.5; }
          100% { transform: scale(20, 20); opacity: 0; }
        }
        .btn-primary { 
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color:#fff;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }
        .btn-primary:hover { 
          background: linear-gradient(135deg, #059669 0%, #047857 100%); 
          transform:translateY(-3px); 
          box-shadow:0 8px 25px rgba(16,185,129,.4);
        }
        .btn-secondary { 
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color:#fff;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
        .btn-secondary:hover { 
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); 
          transform:translateY(-3px); 
          box-shadow:0 8px 25px rgba(59,130,246,.4);
        }
        .btn-outline { 
          background:white; 
          color:#2563eb; 
          border:2px solid #2563eb;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1);
        }
        .btn-outline:hover { 
          background:#e0e7ff; 
          transform:translateY(-3px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
        }
        .btn-reset { 
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color:white;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }
        .btn-reset:hover { 
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
          transform:translateY(-3px);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
        }
        .customize-section { 
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          padding:35px; 
          border-radius:16px; 
          margin:35px 0; 
          border:3px dashed #93c5fd;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { border-color: #93c5fd; }
          50% { border-color: #bfdbfe; }
          100% { border-color: #93c5fd; }
        }
        .customize-grid { 
          display:grid; 
          grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); 
          gap:20px; 
          margin-top:20px;
        }
        .custom-option {
          background:white; 
          padding:20px; 
          border-radius:12px;
          border:2px solid #e2e8f0; 
          cursor:pointer;
          transition:all .3s ease; 
          position:relative;
        }
        .custom-option:hover { 
          border-color:#667eea; 
          transform:translateY(-3px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .custom-option.selected { 
          background:#dbeafe; 
          border-color:#3b82f6; 
          box-shadow:0 0 0 4px rgba(59,130,246,.15);
        }
        .badge { 
          display:inline-block; 
          padding:6px 14px; 
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color:white; 
          border-radius:20px;
          font-size:13px; 
          font-weight:700; 
          margin-left:10px;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }
        .category-label {
          font-size:12px; 
          color:#667eea; 
          background:#e0e7ff;
          padding:6px 12px; 
          border-radius:20px; 
          display:inline-block;
          margin-top:10px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .hotel-dropdown { 
          margin-top:15px; 
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-10px); }
          to { opacity:1; transform:translateY(0); }
        }
        .language-grid { 
          display:grid; 
          grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); 
          gap:15px; 
          margin-top:15px;
        }
        .language-option {
          display:flex; 
          align-items:center; 
          gap:12px; 
          padding:15px;
          border:2px solid #e2e8f0; 
          border-radius:12px; 
          cursor:pointer;
          background:white; 
          transition:all .3s ease;
        }
        .language-option:hover { 
          background:#f8fafc; 
          border-color:#cbd5e0;
          transform: translateX(5px);
        }
        .language-option.selected { 
          background:#e0e7ff; 
          border-color:#3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }
        .language-option .flag {
          font-size: 24px;
        }
        .other-language-input { 
          margin-top:15px; 
          animation: fadeIn 0.4s ease-out; 
        }
        .vehicle-icon {
          font-size: 24px;
          margin-right: 10px;
        }
        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 25px;
        }
        .section-title-icon {
          font-size: 28px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .feature-icon {
          font-size: 20px;
          margin-right: 8px;
        }
        .progress-bar {
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          margin: 30px 0;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 2px;
          width: ${isCustomPackage ? '75%' : form.package === 'Gold' ? '33%' : form.package === 'Platinum' ? '66%' : '100%'};
          transition: width 0.6s ease;
        }
        @keyframes fadeIn {
          from { opacity:0; transform:translateY(-15px); }
          to { opacity:1; transform:translateY(0); }
        }
        @media (max-width: 1024px) {
          .grid-4 { grid-template-columns:1fr 1fr; }
          .packages { grid-template-columns:1fr; }
        }
        @media (max-width: 768px) {
          .page { padding:15px; }
          .container { border-radius:16px; }
          .header { padding:30px 25px; }
          .content { padding:25px; }
          h1 { font-size:32px; }
          h2 { font-size:24px; }
          .grid, .grid-4, .customize-grid { grid-template-columns:1fr; }
          .actions { flex-direction:column; align-items: stretch; }
          .language-grid { grid-template-columns:1fr; }
          button { width: 100%; }
        }
      `}</style>

      <div className="container">
        <div className="header">
          <h1>✈️ Ceylon Tour Mate</h1>
          <p>Design your perfect Sri Lankan adventure with our premium booking experience</p>
        </div>

        <div className="content">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>

          <h2>📋 Personal & Travel Details</h2>
          <p style={{color: '#718096', marginBottom: '25px', fontSize: '16px'}}>
            Please fill in your personal information and travel details to help us create your perfect itinerary.
          </p>
          
          <div className="grid">
            <div>
              <label>Full Name</label>
              <input name="fullname" value={form.fullname} onChange={handleChange} placeholder="John Smith" required />
            </div>

            <div>
              <label>Email Address</label>
              <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="john@example.com" required />
            </div>

            <div>
              <label>Phone Number</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+94 77 123 4567" required />
            </div>

            <div>
              <label>Passport Number</label>
              <input name="passportNumber" value={form.passportNumber} onChange={handleChange} placeholder="A12345678" required />
            </div>

            <div>
              <label>Flight Number</label>
              <input name="flightNumber" value={form.flightNumber} onChange={handleChange} placeholder="UL 123 / EK 456" required />
            </div>

            <div>
              <label>Number of Passengers</label>
              <select name="pax" value={form.pax} onChange={handleChange} required>
                <option value="1">1 Traveler</option>
                <option value="2">2 Travelers</option>
                <option value="3">3 Travelers</option>
                <option value="4">4 Travelers</option>
                <option value="5+">5+ Travelers (Group)</option>
              </select>
            </div>
          </div>

          <div className="grid-4">
            <div>
              <label>Arrival Date</label>
              <input type="date" name="arrivalDate" value={form.arrivalDate} onChange={handleChange} required />
            </div>

            <div>
              <label>Arrival Time</label>
              <input type="time" name="arrivalTime" value={form.arrivalTime} onChange={handleChange} required />
            </div>

            <div>
              <label>Travel Duration</label>
              <select name="travelDays" value={form.travelDays} onChange={handleChange} required>
                <option value="1">1 Day</option>
                <option value="2">2 Days</option>
                <option value="3">3 Days</option>
                <option value="4">4 Days</option>
                <option value="5">5 Days</option>
                <option value="6">6 Days</option>
                <option value="7">7 Days</option>
                <option value="8">8 Days</option>
                <option value="9">9 Days</option>
                <option value="10">10 Days</option>
                <option value="11">11-14 Days</option>
                <option value="15">15+ Days</option>
              </select>
            </div>

            <div>
              <label>Pickup Location</label>
              <input name="pickup" value={form.pickup} onChange={handleChange} placeholder="Bandaranaike International Airport (CMB)" required />
            </div>
          </div>

          <div className="section">
            <div className="section-title">
              <span className="section-title-icon">🚗</span>
              <h3>Vehicle Preferences</h3>
            </div>
            <div className="grid">
              <div>
                <label>Vehicle Type</label>
                <select 
                  name="vehicleType" 
                  value={form.vehicleType} 
                  onChange={(e) => {
                    handleChange(e);
                    setForm(prev => ({ ...prev, vehicleBrand: "" }));
                  }} 
                  required
                >
                  <option value="">Select vehicle type</option>
                  {Object.entries(VEHICLE_OPTIONS).map(([id, vehicle]) => (
                    <option key={id} value={id}>
                      <span className="vehicle-icon">{vehicle.icon}</span>
                      {vehicle.name} {vehicle.price > 0 ? `(+USD ${vehicle.price}/day)` : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label>Vehicle Brand/Model</label>
                <select 
                  name="vehicleBrand" 
                  value={form.vehicleBrand} 
                  onChange={handleChange}
                  disabled={!form.vehicleType}
                  required
                >
                  <option value="">{form.vehicleType ? "Select brand/model" : "Select vehicle type first"}</option>
                  {form.vehicleType && VEHICLE_OPTIONS[form.vehicleType]?.brands.map(brand => (
                    <option key={brand} value={brand}>
                      {VEHICLE_OPTIONS[form.vehicleType].icon} {brand}
                    </option>
                  ))}
                </select>
                {form.vehicleType && (
                  <div style={{fontSize: '14px', color: '#4a5568', marginTop: '-15px', marginBottom: '20px', padding: '8px 12px', background: '#edf2f7', borderRadius: '8px'}}>
                    <strong>Selected:</strong> {VEHICLE_OPTIONS[form.vehicleType]?.icon} {VEHICLE_OPTIONS[form.vehicleType]?.name}
                    {VEHICLE_OPTIONS[form.vehicleType]?.price > 0 && <span style={{color: '#059669', fontWeight: '600'}}> • USD {VEHICLE_OPTIONS[form.vehicleType]?.price}/day</span>}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section-title">
              <span className="section-title-icon">🗣️</span>
              <h3>Language Preferences</h3>
            </div>
            <p style={{color: '#718096', marginBottom: '20px'}}>Select the languages you are fluent in (for guide matching):</p>
            <div className="language-grid">
              {LANGUAGE_OPTIONS.map(({name, flag}) => (
                <div
                  key={name}
                  className={`language-option ${selectedLanguages.includes(name) ? "selected" : ""}`}
                  onClick={() => toggleLanguage(name)}
                >
                  <input
                    type="checkbox"
                    checked={selectedLanguages.includes(name)}
                    onChange={() => {}}
                  />
                  <span className="flag">{flag}</span>
                  <span>{name}</span>
                </div>
              ))}
              <div
                className={`language-option ${selectedLanguages.includes("Other") ? "selected" : ""}`}
                onClick={() => toggleLanguage("Other")}
              >
                <input
                  type="checkbox"
                  checked={selectedLanguages.includes("Other")}
                  onChange={() => {}}
                />
                <span className="flag">🌍</span>
                <span>Other</span>
              </div>
            </div>
            
            {showOtherLanguage && (
              <div className="other-language-input">
                <label>Specify Other Language</label>
                <input 
                  type="text" 
                  value={otherLanguage} 
                  onChange={(e) => setOtherLanguage(e.target.value)}
                  placeholder="Enter language name"
                  required
                />
              </div>
            )}
          </div>

          <h2>🎯 Select Your Package</h2>
          <p style={{color: '#718096', marginBottom: '25px', fontSize: '16px'}}>
            Choose one of our carefully curated packages. Customization is available if you need a tailored experience.
          </p>
          
          <div className="packages">
            {Object.entries(PACKAGE_DESCRIPTIONS).map(([pkg, details]) => {
              const isActive = form.package === pkg && !isCustomPackage;
              return (
                <div
                  key={pkg}
                  className={`package ${isActive ? "active" : ""}`}
                  onClick={() => handlePackageSelect(pkg)}
                  style={{
                    '--package-color': pkg === 'Gold' ? '#FFD700' : pkg === 'Platinum' ? '#C0C0C0' : '#A8A8A8',
                    '--package-border': details.borderColor,
                    '--package-bg': details.color,
                    '--package-text': details.textColor
                  }}
                >
                  <h4>
                    {pkg} Package
                    {isActive && <span style={{fontSize: '16px', color: '#059669'}}>✓ Selected</span>}
                  </h4>
                  <div className="package-price">USD {details.price}</div>
                  <div className="package-desc">{details.description}</div>
                  <ul className="package-features">
                    {details.features.map((feature, idx) => (
                      <li key={idx}>
                        <span className="feature-icon">{feature.includes("SUV") ? "🚙" : feature.includes("hotel") ? "🏨" : feature.includes("Breakfast") ? "🍳" : feature.includes("VIP") ? "⭐" : feature.includes("SIM") ? "📱" : "✨"}</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="package-buttons">
                    <button 
                      className="btn-secondary" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePackageSelect(pkg);
                        handleBookClick();
                      }}
                    >
                      <span>📅 Book This Package</span>
                    </button>
                  </div>
                </div>
              );
            })}
            
            <div 
              className={`package ${isCustomPackage ? "active" : ""}`}
              onClick={handleCustomizeClick}
              style={{
                '--package-color': '#10b981',
                '--package-border': '#10b981',
                '--package-bg': 'linear-gradient(135deg, #f0f9ff 0%, #d1fae5 100%)',
                '--package-text': '#047857'
              }}
            >
              <h4>Custom Package <span className="badge">✨ Flexible</span></h4>
              <div className="package-price">From USD 60</div>
              <div className="package-desc">Build your own package from scratch with complete flexibility</div>
              <ul className="package-features">
                <li><span className="feature-icon">✅</span> Choose exactly what you need</li>
                <li><span className="feature-icon">💰</span> Pay only for selected services</li>
                <li><span className="feature-icon">🎨</span> Mix and match components</li>
                <li><span className="feature-icon">🌟</span> Perfect for unique itineraries</li>
              </ul>
              <button 
                className="btn-secondary" 
                style={{marginTop: '20px'}} 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCustomizeClick();
                }}
              >
                <span>🎨 Design Custom Package</span>
              </button>
            </div>
          </div>

          {showCustomizeOptions && (
            <div className="customize-section">
              <h3>🎨 Customize Your Package</h3>
              <p style={{color: '#4a5568', marginBottom: '20px'}}>
                Select the components you want in your custom package. Mix and match to create your perfect experience!
              </p>
              
              <div style={{marginBottom: '25px', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <strong style={{fontSize: '16px', color: '#2d3748'}}>Travel Duration:</strong>
                    <div style={{fontSize: '18px', color: '#667eea', fontWeight: '600', marginTop: '5px'}}>
                      {form.travelDays} day{form.travelDays > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div style={{fontSize: '14px', color: '#718096', textAlign: 'right'}}>
                    Total estimated: {estimatedPrice}
                  </div>
                </div>
              </div>
              
              {/* Accommodation Section */}
              <div style={{marginBottom: '30px'}}>
                <h4 style={{color: '#2d3748', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <span>🏨</span> Accommodation
                </h4>
                <p style={{color: '#718096', fontSize: '15px', marginBottom: '20px'}}>
                  Select one hotel type for your stay:
                </p>
                <div className="customize-grid">
                  {Object.entries(COMPONENT_PRICING)
                    .filter(([key, detail]) => detail.type === "accommodation")
                    .map(([key, detail]) => {
                      const isSelected = customPackageSelections[key];
                      
                      return (
                        <div
                          key={key}
                          className={`custom-option ${isSelected ? "selected" : ""}`}
                          onClick={() => toggleCustomSelection(key, "accommodation")}
                        >
                          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                              <input
                                type="radio"
                                checked={isSelected}
                                onChange={() => {}}
                                style={{width: '20px', height: '20px'}}
                              />
                              <div style={{fontWeight: '700', fontSize: '16px', color: '#2d3748'}}>
                                {detail.icon} {detail.name}
                              </div>
                            </div>
                            <div style={{color: '#059669', fontWeight: '700', fontSize: '18px'}}>
                              USD {detail.price}
                            </div>
                          </div>
                          <div className="category-label">
                            🏨 Accommodation
                          </div>
                          
                          {isSelected && (
                            <div className="hotel-dropdown">
                              <label style={{fontSize: '14px', marginBottom: '8px', display: 'block', color: '#4a5568'}}>Select specific hotel:</label>
                              <select 
                                value={selectedHotel.specificHotel}
                                onChange={(e) => handleSpecificHotelChange(e.target.value)}
                                style={{fontSize: '14px', padding: '12px', width: '100%', borderRadius: '8px', border: '2px solid #e2e8f0'}}
                              >
                                <option value="">Choose a hotel</option>
                                {HOTEL_OPTIONS[key]?.map(hotel => (
                                  <option key={hotel} value={hotel}>{hotel}</option>
                                ))}
                              </select>
                            </div>
                          )}
                          
                          <div style={{fontSize: '13px', color: isSelected ? '#059669' : '#718096', marginTop: '15px', fontWeight: isSelected ? '600' : '400'}}>
                            {isSelected ? "✓ Selected" : "Click to select this hotel type"}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              
              {/* Other Sections */}
              {Object.entries({
                meal: {label: "🍽️ Meals", icon: "🍽️"},
                tour: {label: "🦁 Tours & Activities", icon: "🦁"},
                service: {label: "⭐ Additional Services", icon: "⭐"}
              }).map(([type, {label, icon}]) => {
                const components = Object.entries(COMPONENT_PRICING)
                  .filter(([key, detail]) => detail.type === type);
                
                if (components.length === 0) return null;
                
                return (
                  <div key={type} style={{marginBottom: '30px'}}>
                    <h4 style={{color: '#2d3748', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <span>{icon}</span> {label}
                    </h4>
                    <div className="customize-grid">
                      {components.map(([key, detail]) => {
                        const isSelected = customPackageSelections[key];
                        
                        return (
                          <div
                            key={key}
                            className={`custom-option ${isSelected ? "selected" : ""}`}
                            onClick={() => toggleCustomSelection(key, type)}
                          >
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {}}
                                  style={{width: '20px', height: '20px'}}
                                />
                                <div style={{fontWeight: '600', fontSize: '15px', color: '#2d3748'}}>
                                  {detail.icon} {detail.name}
                                </div>
                              </div>
                              <div style={{color: '#059669', fontWeight: '700', fontSize: '16px'}}>
                                USD {detail.price}
                              </div>
                            </div>
                            <div className="category-label">
                              {detail.icon} {detail.type.charAt(0).toUpperCase() + detail.type.slice(1)}
                            </div>
                            
                            <div style={{fontSize: '13px', color: isSelected ? '#059669' : '#718096', marginTop: '12px'}}>
                              {isSelected ? "✓ Added to package" : "Click to add to package"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              
              <div style={{marginTop: '35px', display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                <button className="btn-secondary" onClick={() => setCustomPackageSelections({})}>
                  <span>🗑️ Clear All Selections</span>
                </button>
                <button className="btn-outline" onClick={() => setShowCustomizeOptions(false)}>
                  <span>✅ Done Customizing</span>
                </button>
              </div>
            </div>
          )}

          <h2>📝 Special Requests & Notes</h2>
          <p style={{color: '#718096', marginBottom: '15px'}}>
            Any special requirements, dietary needs, or places you'd love to visit?
          </p>
          <textarea 
            rows="6" 
            name="notes" 
            value={form.notes} 
            onChange={handleChange}
            placeholder="Please share any dietary requirements, special accommodations, specific places you'd like to visit, vehicle preferences, or other special requests. Our team will do their best to accommodate your needs!"
          />

          <div className="priceBox">
            ✨ Estimated Total: {estimatedPrice} ✨
            <div style={{fontSize: '16px', opacity: '0.95', marginTop: '10px'}}>
              {isCustomPackage ? '🎨 Custom Package' : `🎯 ${form.package} Package`} • ⏳ {form.travelDays} day{form.travelDays > 1 ? 's' : ''} • 👥 {form.pax} {form.pax === "1" ? 'Traveler' : 'Travelers'}
              {form.vehicleType && ` • 🚗 ${VEHICLE_OPTIONS[form.vehicleType]?.name}`}
            </div>
          </div>

          <div className="actions">
            <button className="btn-primary" onClick={handleBookClick}>
              <span>✅ Complete Booking</span>
            </button>
            <button className="btn-outline" onClick={handleCustomizeClick}>
              <span>{showCustomizeOptions ? '👁️ Hide Customization' : '🎨 Customize Package'}</span>
            </button>
            <button className="btn-reset" type="button" onClick={() => {
              if (window.confirm("Are you sure you want to reset all form data?")) {
                setForm({
                  fullname: "",
                  email: "",
                  phone: "",
                  passportNumber: "",
                  flightNumber: "",
                  arrivalDate: "",
                  arrivalTime: "",
                  travelDays: "1",
                  vehicleType: "",
                  vehicleBrand: "",
                  pax: "1",
                  pickup: "",
                  package: "Gold",
                  notes: "",
                });
                setSelectedLanguages([]);
                setShowOtherLanguage(false);
                setOtherLanguage("");
                setSelectedHotel({
                  type: "",
                  specificHotel: ""
                });
                setIsCustomPackage(false);
                setCustomPackageSelections({});
                setShowCustomizeOptions(false);
              }
            }}>
              <span>🔄 Reset All</span>
            </button>
          </div>
          
          <div style={{marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', textAlign: 'center', color: '#718096', fontSize: '14px'}}>
            <p>Need help? Contact our customer support at 📞 +94 11 234 5678 or 📧 support@ceylontourmate.com</p>
            <p style={{marginTop: '10px'}}>Your information is secure and protected. By booking, you agree to our Terms of Service.</p>
          </div>
        </div>
      </div>
    </div>
  );
}