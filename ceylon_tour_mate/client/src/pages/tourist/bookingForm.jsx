// Path: client/src/pages/bookingForm.jsx
import React, { useEffect, useMemo, useState } from "react";

export default function BookingForm() {
  /* ===================== DATABASE PACKAGES ===================== */
  const [dbPackages, setDbPackages] = useState([]);
  const [driverVehicles, setDriverVehicles] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPackageId, setExpandedPackageId] = useState(null);

  /* ===================== CONFIG ===================== */
  const COMPONENT_PRICING = useMemo(() => ({
    hotel_5star: { name: "5★ Luxury Hotel", price: 100, type: "accommodation", icon: "⭐" },
    hotel_4star: { name: "4★ Premium Hotel", price: 70, type: "accommodation", icon: "🏨" },
    hotel_3star: { name: "3★ Standard Hotel", price: 50, type: "accommodation", icon: "🏨" },
    hotel_2star: { name: "2★ Budget Hotel", price: 30, type: "accommodation", icon: "🏨" },
    breakfast_included: { name: "Breakfast included", price: 5, type: "meal", icon: "🍽️" },
    dinner_upgrade: { name: "Dinner upgrade", price: 25, type: "meal", icon: "🍽️" },
    free_sim_card: { name: "Local SIM card", price: 12, type: "service", icon: "📱" },
    free_wifi: { name: "Pocket Wi-Fi", price: 18, type: "service", icon: "📶" },
    vip_meet_greet: { name: "VIP meet & greet", price: 15, type: "service", icon: "⭐" },
    child_seat: { name: "Child seat", price: 8, type: "service", icon: "👶" },
    extra_stop: { name: "Extra stop", price: 10, type: "service", icon: "📍" },
  }), []);

  // Vehicle price mapping based on type (default prices)
  const VEHICLE_PRICES = useMemo(() => ({
    'SUV': 80,
    'Sedan': 60,
    'Van': 100,
    'Luxury': 150,
    'Compact': 40,
    'Standard': 50
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
    vehicleModel: "",
    pax: "1",
    pickup: "",
    package: "",
    packageCategory: "",
    notes: "",
  });

  const [estimatedPrice, setEstimatedPrice] = useState("USD —");
  const [showCustomizeOptions, setShowCustomizeOptions] = useState(false);
  const [isCustomPackage, setIsCustomPackage] = useState(false);
  const [customPackageSelections, setCustomPackageSelections] = useState({});
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [showOtherLanguage, setShowOtherLanguage] = useState(false);
  const [otherLanguage, setOtherLanguage] = useState("");
  const [customTravelDays, setCustomTravelDays] = useState("3");
  const [selectedDestinations, setSelectedDestinations] = useState([]);

  /* ===================== PAYMENT SLIP STATE ===================== */
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [paymentSlipPreview, setPaymentSlipPreview] = useState(null);
  const [paymentSlipUploaded, setPaymentSlipUploaded] = useState(false);

  /* ===================== VEHICLE HELPERS ===================== */
  // Get unique vehicle types from driver_details table
  const uniqueVehicleTypes = useMemo(() => {
    if (!driverVehicles || driverVehicles.length === 0) return [];
    const types = [...new Set(driverVehicles
      .filter(vehicle => vehicle.vehicle_type)
      .map(vehicle => vehicle.vehicle_type))];
    return types.sort();
  }, [driverVehicles]);

  // Get filtered vehicle models based on selected vehicle type
  const filteredModels = useMemo(() => {
    if (!form.vehicleType || !driverVehicles || driverVehicles.length === 0) return [];
    
    const availableVehicles = driverVehicles.filter(vehicle => 
      vehicle.vehicle_type === form.vehicleType && 
      vehicle.vehicle_model
    );
    
    // Get unique models with their details
    const uniqueModels = [];
    const seenModels = new Set();
    
    availableVehicles.forEach(vehicle => {
      const modelKey = `${vehicle.vehicle_model}-${vehicle.vehicle_year || ''}-${vehicle.vehicle_color || ''}`;
      if (!seenModels.has(modelKey)) {
        seenModels.add(modelKey);
        uniqueModels.push({
          model: vehicle.vehicle_model,
          year: vehicle.vehicle_year,
          color: vehicle.vehicle_color,
          driverId: vehicle.user_id,
          languages: vehicle.languages || [],
          yearsOfExperience: vehicle.years_of_experience || 0
        });
      }
    });
    
    return uniqueModels.sort((a, b) => a.model.localeCompare(b.model));
  }, [form.vehicleType, driverVehicles]);

  // Get driver details for selected vehicle
  const selectedVehicleDriver = useMemo(() => {
    if (!form.vehicleType || !form.vehicleModel || !driverVehicles.length) return null;
    
    const drivers = driverVehicles.filter(vehicle => 
      vehicle.vehicle_type === form.vehicleType && 
      vehicle.vehicle_model === form.vehicleModel.split(' (')[0] // Extract model name without year/color
    );
    
    if (drivers.length > 0) {
      return drivers[0]; // Return first available driver
    }
    return null;
  }, [form.vehicleType, form.vehicleModel, driverVehicles]);

  // Get vehicle price based on type
  const getVehiclePrice = (vehicleType) => {
    return VEHICLE_PRICES[vehicleType] || 50; // Default to $50 if type not found
  };

  /* ===================== EFFECTS ===================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch packages
        const pkgRes = await fetch('http://localhost:5000/api/packages/active-packages');
        const pkgData = await pkgRes.json();
        setDbPackages(Array.isArray(pkgData) ? pkgData : []);

        // Fetch vehicle info from driver_details table
        const vehicleRes = await fetch('http://localhost:5000/api/packages/vehicle-info');
        const vehicleData = await vehicleRes.json();
        setDriverVehicles(Array.isArray(vehicleData) ? vehicleData : []); 

        // Fetch destinations
        const destRes = await fetch('http://localhost:5000/api/packages/destinations');
        const destData = await destRes.json();
        setDestinations(Array.isArray(destData) ? destData : []);

        setLoading(false);
      } catch (error) {
        console.error("Connection Error:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let base = 0;
    let vehicleExtra = 0;
    let daysMultiplier = isCustomPackage ? parseInt(customTravelDays) || 3 : parseInt(form.travelDays) || 1;
    
    // Add vehicle cost if specified
    if (form.vehicleType) {
      const dailyRate = getVehiclePrice(form.vehicleType);
      vehicleExtra = dailyRate * daysMultiplier;
    }
    
    if (isCustomPackage) {
      // Calculate custom package price from selected components
      let componentPrice = Object.keys(customPackageSelections).reduce((sum, key) => {
        const component = COMPONENT_PRICING[key];
        if (!component) return sum;
        return sum + component.price;
      }, 0);
      
      // Add destination cost (assume $30 per destination per day)
      const destinationCost = selectedDestinations.length * 30 * daysMultiplier;
      
      base = (componentPrice * daysMultiplier) + destinationCost;
    } else {
      // Find selected package from database
      const selectedPkg = dbPackages.find(pkg => pkg.package_name === form.package);
      base = selectedPkg ? selectedPkg.min_price : 0;
    }

    let paxMultiplier = 1;
    if (form.pax === "2") paxMultiplier = 1.15;
    if (form.pax === "3") paxMultiplier = 1.3;
    if (form.pax === "4") paxMultiplier = 1.5;
    if (form.pax === "5+") paxMultiplier = 1.9;

    const total = Math.round((base + vehicleExtra) * paxMultiplier);
    setEstimatedPrice(`USD ${total}`);
  }, [form, dbPackages, driverVehicles, filteredModels, COMPONENT_PRICING, VEHICLE_PRICES, isCustomPackage, customPackageSelections, customTravelDays, selectedDestinations]);

  /* ===================== HANDLERS ===================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If vehicle type changes, reset vehicle model
    if (name === 'vehicleType') {
      setForm({ ...form, [name]: value, vehicleModel: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
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
    if (type === "accommodation") {
      const newSelections = {};
      Object.keys(COMPONENT_PRICING).forEach(k => {
        if (COMPONENT_PRICING[k].type === "accommodation") {
          newSelections[k] = false;
        } else {
          newSelections[k] = customPackageSelections[k] || false;
        }
      });
      newSelections[key] = !customPackageSelections[key];
      setCustomPackageSelections(newSelections);
    } else {
      setCustomPackageSelections(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    }
  };

  const toggleDestination = (destination) => {
    setSelectedDestinations(prev =>
      prev.includes(destination)
        ? prev.filter(d => d !== destination)
        : [...prev, destination]
    );
  };

  const handlePackageSelect = (pkgName) => {
    // Find the package to get its category
    const selectedPkg = dbPackages.find(pkg => pkg.package_name === pkgName);
    const category = selectedPkg ? selectedPkg.category : '';
    
    setForm({ ...form, package: pkgName, packageCategory: category });
    setIsCustomPackage(false);
    setShowCustomizeOptions(false);
  };

  const handleCustomizeClick = () => {
    if (!showCustomizeOptions) {
      setIsCustomPackage(true);
      setForm({ ...form, package: "Custom", packageCategory: "Custom" });
    }
    setShowCustomizeOptions(!showCustomizeOptions);
  };

  /* ===================== PAYMENT SLIP HANDLERS ===================== */
  const handlePaymentSlipUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload an image (JPEG, PNG, GIF, WEBP) or PDF file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB.');
      return;
    }

    setPaymentSlip(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentSlipPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      setPaymentSlipPreview(null);
    }

    setPaymentSlipUploaded(true);
  };

  const removePaymentSlip = () => {
    setPaymentSlip(null);
    setPaymentSlipPreview(null);
    setPaymentSlipUploaded(false);
  };

  /* ===================== STYLE HELPERS ===================== */
  const getPackageStyles = (category) => {
    const styles = {
      gold: { 
        color: "linear-gradient(135deg, #FFD700 0%, #FFC300 100%)", 
        borderColor: "#FFD700", 
        textColor: "#8B6914",
        bgColor: "linear-gradient(135deg, #FFF9C4 0%, #FFF3E0 100%)"
      },
      platinum: { 
        color: "linear-gradient(135deg, #E5E4E2 0%, #C0C0C0 100%)", 
        borderColor: "#C0C0C0", 
        textColor: "#4A5568",
        bgColor: "linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)"
      },
      silver: { 
        color: "linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)", 
        borderColor: "#A8A8A8", 
        textColor: "#4A5568",
        bgColor: "linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)"
      },
      custom: {
        color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        borderColor: "#10b981",
        textColor: "#047857",
        bgColor: "linear-gradient(135deg, #f0f9ff 0%, #d1fae5 100%)"
      }
    };
    return styles[category?.toLowerCase()] || styles.custom;
  };

  const handleBookClick = async () => {
    // ============ REGEX VALIDATION PATTERNS ============
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    const passportRegex = /^[A-Z0-9]{6,20}$/i;
    const flightRegex = /^[A-Z0-9]{2,8}[-\s]?\d{1,6}$/i;
    const fullnameRegex = /^[a-zA-Z\s'-]{2,50}$/;
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

    // ============ FULL NAME VALIDATION ============
    if (!form.fullname) {
      alert('❌ Please enter your full name.');
      return;
    }
    if (!fullnameRegex.test(form.fullname.trim())) {
      alert('❌ Full name must be 2-50 characters (letters, spaces, hyphens, apostrophes only).\nExample: John Smith or Mary-Anne O\'Connor');
      return;
    }

    // ============ EMAIL VALIDATION ============
    if (!form.email) {
      alert('❌ Please enter your email address.');
      return;
    }
    if (!emailRegex.test(form.email.trim())) {
      alert('❌ Invalid email format.\nExample: john@example.com');
      return;
    }

    // ============ PHONE VALIDATION ============
    if (!form.phone) {
      alert('❌ Please enter your phone number.');
      return;
    }
    if (!phoneRegex.test(form.phone.trim())) {
      alert('❌ Invalid phone format.\nExamples: +94711234567 or 0711-234-567 or (071)123-4567');
      return;
    }

    // ============ PASSPORT VALIDATION ============
    if (!form.passportNumber) {
      alert('❌ Please enter your passport number.');
      return;
    }
    if (!passportRegex.test(form.passportNumber.trim())) {
      alert('❌ Passport must be 6-20 alphanumeric characters.\nExample: AB123456');
      return;
    }

    // ============ FLIGHT NUMBER VALIDATION ============
    if (!form.flightNumber) {
      alert('❌ Please enter your flight number.');
      return;
    }
    if (!flightRegex.test(form.flightNumber.trim())) {
      alert('❌ Invalid flight number format.\nExamples: AA123, BA-456, UL 789');
      return;
    }

    // ============ ARRIVAL DATE VALIDATION ============
    if (!form.arrivalDate) {
      alert('❌ Please select your arrival date.');
      return;
    }
    const arrivalDate = new Date(form.arrivalDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (arrivalDate < today) {
      alert('❌ Arrival date cannot be in the past.\nPlease select a future date.');
      return;
    }

    // ============ ARRIVAL TIME VALIDATION ============
    if (!form.arrivalTime) {
      alert('❌ Please select your arrival time.');
      return;
    }
    if (!timeRegex.test(form.arrivalTime)) {
      alert('❌ Invalid time format. Please use HH:MM (24-hour format).\nExample: 14:30');
      return;
    }

    // ============ PACKAGE SELECTION VALIDATION ============
    if (!form.package) {
      alert('❌ Please select a package.');
      return;
    }

    // ============ CUSTOM PACKAGE DESTINATIONS VALIDATION ============
    if (isCustomPackage && selectedDestinations.length === 0) {
      alert('❌ Please select at least one destination for your custom package.');
      return;
    }

    // ============ PAYMENT SLIP VALIDATION ============
    if (!paymentSlip) {
      alert('❌ Please upload your payment slip to confirm booking.');
      return;
    }

    const bookingDetails = {
      package: form.package,
      packageCategory: form.packageCategory,
      price: estimatedPrice,
      name: form.fullname,
      email: form.email,
      phone: form.phone,
      passport: form.passportNumber,
      flight: form.flightNumber,
      date: form.arrivalDate,
      time: form.arrivalTime,
      days: isCustomPackage ? customTravelDays : form.travelDays,
      languages: selectedLanguages
        .filter(l => l !== "Other" || otherLanguage)
        .map(l => l === "Other" && otherLanguage ? otherLanguage : l)
        .join(", ") || "Not specified",
      vehicle: form.vehicleType ? 
        `${form.vehicleType} - ${form.vehicleModel}${selectedVehicleDriver ? ` (Driver ID: ${selectedVehicleDriver.user_id})` : ''}` 
        : "Not specified",
      notes: form.notes,
      destinations: isCustomPackage ? selectedDestinations.join(", ") : "Package-defined",
      customComponents: isCustomPackage ? Object.keys(customPackageSelections).filter(k => customPackageSelections[k]).join(", ") : "N/A",
      paymentSlip: paymentSlip ? paymentSlip.name : 'Not uploaded',
      // Add user info for logged-in users
      userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null,
      userEmail: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : null
    };
    
    try {
      const formData = new FormData();
      formData.append('paymentSlip', paymentSlip);
      formData.append('bookingDetails', JSON.stringify(bookingDetails));

      const response = await fetch('http://localhost:5000/api/bookings/submit', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        
        const confirmationMessage = `✨ **Booking Confirmation** ✨

🎯 **Package:** ${bookingDetails.package}
💰 **Total Price:** ${bookingDetails.price}
👤 **Name:** ${bookingDetails.name}
📧 **Email:** ${bookingDetails.email}
📞 **Phone:** ${bookingDetails.phone}
📇 **Passport:** ${bookingDetails.passport}
✈️ **Flight:** ${bookingDetails.flight}
📅 **Arrival:** ${bookingDetails.date} at ${bookingDetails.time}
⏳ **Duration:** ${bookingDetails.days} days
🗣️ **Languages:** ${bookingDetails.languages}
🚗 **Vehicle:** ${bookingDetails.vehicle}
📍 **Destinations:** ${bookingDetails.destinations}
🎨 **Custom Components:** ${bookingDetails.customComponents}
💳 **Payment Slip:** ${bookingDetails.paymentSlip}
📝 **Notes:** ${bookingDetails.notes || 'None'}

✅ **Booking ID:** ${result.bookingId || 'N/A'}
✅ **Your booking has been submitted successfully!**
📋 A detailed itinerary will be sent to your email within 24 hours.
🤝 Welcome to Sri Lanka!`;

        alert(confirmationMessage);
        
        setTimeout(() => {
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
            vehicleModel: "",
            pax: "1",
            pickup: "",
            package: dbPackages.length > 0 ? dbPackages[0].package_name : "",
            packageCategory: dbPackages.length > 0 ? dbPackages[0].category : "",
            notes: "",
          });
          setSelectedLanguages([]);
          setShowOtherLanguage(false);
          setOtherLanguage("");
          setIsCustomPackage(false);
          setCustomPackageSelections({});
          setShowCustomizeOptions(false);
          setSelectedDestinations([]);
          setPaymentSlip(null);
          setPaymentSlipPreview(null);
          setPaymentSlipUploaded(false);
          setCustomTravelDays("3");
        }, 2000);
      } else {
        throw new Error('Booking submission failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('There was an error submitting your booking. Please try again or contact support.');
    }
  };

  /* ===================== UI ===================== */
  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{textAlign: 'center', color: 'white'}}>
        <div style={{
          width: '80px',
          height: '80px',
          border: '6px solid rgba(255,255,255,0.3)',
          borderTop: '6px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <h2 style={{fontSize: '28px', marginBottom: '10px'}}>✨ Ceylon Tour Mate</h2>
        <p style={{fontSize: '16px', opacity: 0.8}}>Loading your perfect Sri Lankan adventure...</p>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

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
        h4 {
          color:#2d3748;
          margin:20px 0 10px;
          font-size:18px;
          font-weight:600;
        }
        h5 {
          color:#4a5568;
          margin:15px 0 5px;
          font-size:16px;
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
        .package-card {
          border:2px solid #e2e8f0; 
          border-radius:16px;
          padding:25px;
          cursor:pointer; 
          transition:all .4s cubic-bezier(0.4, 0, 0.2, 1);
          background:#fff;
          position:relative;
          overflow: hidden;
          margin-bottom: 20px;
        }
        .package-card:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--package-color);
          transition: height 0.3s ease;
        }
        .package-card:hover { 
          transform:translateY(-5px); 
          box-shadow:0 15px 30px rgba(0,0,0,.1);
        }
        .package-card:hover:before {
          height: 6px;
        }
        .package-card.active { 
          border-color:var(--package-border); 
          background:var(--package-bg);
          box-shadow:0 10px 25px rgba(0,0,0,.1);
        }
        .package-card h4 { 
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
        .btn-expand {
          background: var(--btn-color, #3b82f6);
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        .btn-expand:hover {
          opacity: 0.9;
          transform: translateY(-2px);
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
          width: ${isCustomPackage ? '75%' : '33%'};
          transition: width 0.6s ease;
        }
        .package-highlights {
          display: flex;
          gap: 15px;
          margin-top: 10px;
          color: #718096;
          font-size: 14px;
          flex-wrap: wrap;
        }
        .package-highlights span {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #f8fafc;
          padding: 6px 12px;
          border-radius: 20px;
        }
        .itinerary-details {
          margin-top: 25px;
          border-top: 1px solid #edf2f7;
          padding-top: 20px;
          animation: fadeIn 0.5s ease-out;
        }
        .day-schedule {
          margin-bottom: 20px;
          border-left: 3px solid #cbd5e0;
          padding-left: 15px;
        }
        .day-schedule h5 {
          margin: 0 0 8px 0;
          color: #2d3748;
          font-size: 16px;
          font-weight: 600;
        }
        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-top: 10px;
        }
        .activity-item {
          font-size: 12px;
          background: #f8fafc;
          padding: 8px;
          border-radius: 6px;
          border-left: 3px solid #667eea;
        }
        .inclusions-box {
          background: #f0f9ff;
          padding: 15px;
          border-radius: 8px;
          font-size: 13px;
          margin-top: 10px;
          border: 1px solid #bfdbfe;
        }
        
        /* Payment Slip Styles */
        .payment-slip-container {
          margin-top: 30px;
          padding: 25px;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-radius: 16px;
          border: 3px solid #f59e0b;
        }
        .payment-slip-upload {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px;
          border: 3px dashed #f59e0b;
          border-radius: 12px;
          background: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .payment-slip-upload:hover {
          background: #fffbeb;
          border-color: #d97706;
        }
        .payment-slip-upload-icon {
          font-size: 48px;
          color: #f59e0b;
          margin-bottom: 15px;
        }
        .payment-slip-preview {
          margin-top: 20px;
          text-align: center;
        }
        .payment-slip-image {
          max-width: 300px;
          max-height: 300px;
          border-radius: 12px;
          border: 3px solid #10b981;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .payment-slip-file-info {
          margin-top: 15px;
          padding: 15px;
          background: #f0f9ff;
          border-radius: 10px;
          border: 2px solid #bfdbfe;
        }
        .payment-slip-actions {
          display: flex;
          gap: 15px;
          margin-top: 20px;
          justify-content: center;
        }
        .payment-instructions {
          margin-top: 20px;
          padding: 20px;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          border-radius: 12px;
          border-left: 5px solid #3b82f6;
        }
        .payment-instructions ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .payment-instructions li {
          margin-bottom: 8px;
          color: #4b5563;
        }
        
        /* Hotel Star Rating Styles */
        .hotel-star-rating {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 5px;
        }
        .star-filled {
          color: #FFD700;
          font-size: 18px;
        }
        .star-empty {
          color: #e2e8f0;
          font-size: 18px;
        }
        .price-tag {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 18px;
          display: inline-block;
          margin-top: 10px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        
        /* Destination Selection Styles */
        .destinations-section {
          margin-bottom: 30px;
        }
        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        .destination-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          background: white;
          transition: all 0.3s ease;
        }
        .destination-option:hover {
          background: #f8fafc;
          border-color: #cbd5e0;
          transform: translateY(-2px);
        }
        .destination-option.selected {
          background: #e0e7ff;
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }
        .destination-icon {
          font-size: 24px;
          color: #667eea;
        }
        .destination-price {
          font-size: 14px;
          color: #059669;
          font-weight: 600;
          margin-left: auto;
        }
        .selected-destinations-summary {
          margin-top: 20px;
          padding: 15px;
          background: linear-gradient(135deg, #f0f9ff 0%, #d1fae5 100%);
          border-radius: 12px;
          border: 2px solid #10b981;
        }
        
        /* Vehicle Selection Styles */
        .vehicle-info-note {
          margin-top: 10px;
          padding: 12px;
          background: #f0f9ff;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
          font-size: 14px;
          color: #4b5563;
        }
        .vehicle-details-summary {
          margin-top: 15px;
          padding: 15px;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 12px;
          border: 2px solid #3b82f6;
          display: none;
          animation: slideDown 0.3s ease-out;
        }
        .vehicle-details-summary.visible {
          display: block;
        }
        .vehicle-detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .vehicle-detail-label {
          font-weight: 600;
          color: #4b5563;
        }
        .vehicle-detail-value {
          color: #1e40af;
          font-weight: 500;
        }
        .driver-details {
          margin-top: 10px;
          padding: 10px;
          background: #f0f9ff;
          border-radius: 8px;
          border-left: 3px solid #10b981;
          font-size: 13px;
        }
        .vehicle-price-badge {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 4px 10px;
          border-radius: 15px;
          font-weight: 600;
          font-size: 12px;
          margin-left: 8px;
        }
        
        @media (max-width: 1024px) {
          .grid-4 { grid-template-columns:1fr 1fr; }
          .destinations-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
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
          .destinations-grid { grid-template-columns: 1fr; }
          button { width: 100%; }
          .package-highlights { flex-direction: column; align-items: flex-start; }
          .payment-slip-actions { flex-direction: column; }
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
              <label>Full Name *</label>
              <input name="fullname" value={form.fullname} onChange={handleChange} placeholder="John Smith" required />
            </div>

            <div>
              <label>Email Address *</label>
              <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="john@example.com" required />
            </div>

            <div>
              <label>Phone Number *</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+94 77 123 4567" required />
            </div>

            <div>
              <label>Passport Number *</label>
              <input name="passportNumber" value={form.passportNumber} onChange={handleChange} placeholder="A12345678" required />
            </div>

            <div>
              <label>Flight Number *</label>
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
              <label>Travel Days</label>
              <select name="travelDays" value={form.travelDays} onChange={handleChange} required>
                <option value="1">1 Day</option>
                <option value="2">2 Days</option>
                <option value="3">3 Days</option>
                <option value="4">4 Days</option>
                <option value="5">5 Days</option>
                <option value="6">6 Days</option>
                <option value="7">7 Days</option>
              </select>
            </div>

            <div>
              <label>Pickup Location</label>
              <input name="pickup" value={form.pickup} onChange={handleChange} placeholder="Bandaranaike International Airport (CMB)" required />
            </div>
          </div>

          {/* Updated Vehicle Preferences Section without price_per_day */}
          <div className="section">
            <h3>🚗 Vehicle Preferences</h3>
            <p style={{color: '#718096', marginBottom: '20px', fontSize: '15px'}}>
              Select your preferred vehicle type and model from our available professional drivers. All vehicles are maintained to the highest standards.
            </p>
            
            <div className="grid">
              <div>
                <label>Vehicle Type</label>
                <select name="vehicleType" value={form.vehicleType} onChange={handleChange}>
                  <option value="">Select Vehicle Type</option>
                  {uniqueVehicleTypes.length > 0 ? (
                    uniqueVehicleTypes.map(type => (
                      <option key={type} value={type}>
                        {type} - ${getVehiclePrice(type)}/day
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Loading vehicle types...</option>
                  )}
                </select>
                {uniqueVehicleTypes.length > 0 && (
                  <div className="vehicle-info-note">
                    <strong>Available:</strong> {uniqueVehicleTypes.length} vehicle type(s) from our professional drivers
                  </div>
                )}
              </div>
              
              <div>
                <label>Vehicle Model</label>
                <select 
                  name="vehicleModel" 
                  value={form.vehicleModel} 
                  onChange={handleChange} 
                  disabled={!form.vehicleType}
                >
                  <option value="">{form.vehicleType ? "Select Model" : "Select vehicle type first"}</option>
                  {filteredModels.length > 0 ? (
                    filteredModels.map((vehicle, index) => (
                      <option key={`${vehicle.model}-${index}`} value={vehicle.model}>
                        {vehicle.model} {vehicle.year ? `(${vehicle.year})` : ''} {vehicle.color ? `- ${vehicle.color}` : ''}
                      </option>
                    ))
                  ) : form.vehicleType ? (
                    <option value="" disabled>No available models for this vehicle type</option>
                  ) : null}
                </select>
                
                {form.vehicleType && filteredModels.length > 0 && (
                  <div className="vehicle-info-note">
                    <strong>Models Available:</strong> {filteredModels.length} model(s) for {form.vehicleType}
                    <div style={{marginTop: '5px', fontSize: '13px', color: '#059669'}}>
                      <strong>Price:</strong> ${getVehiclePrice(form.vehicleType)} per day
                      {form.travelDays > 1 && ` ($${getVehiclePrice(form.vehicleType) * parseInt(form.travelDays)} total)`}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Show selected vehicle and driver details */}
            {form.vehicleType && form.vehicleModel && selectedVehicleDriver && (
              <div className="visible vehicle-details-summary">
                <div style={{fontWeight: '700', color: '#1e40af', marginBottom: '10px'}}>
                  ✅ Selected Vehicle & Driver Details
                </div>
                <div className="vehicle-detail-item">
                  <span className="vehicle-detail-label">Vehicle Type:</span>
                  <span className="vehicle-detail-value">{form.vehicleType}</span>
                </div>
                <div className="vehicle-detail-item">
                  <span className="vehicle-detail-label">Vehicle Model:</span>
                  <span className="vehicle-detail-value">{form.vehicleModel}</span>
                </div>
                <div className="vehicle-detail-item">
                  <span className="vehicle-detail-label">Daily Rate:</span>
                  <span className="vehicle-detail-value">
                    ${getVehiclePrice(form.vehicleType)}/day
                    {form.travelDays > 1 && ` ($${getVehiclePrice(form.vehicleType) * parseInt(form.travelDays)} total)`}
                  </span>
                </div>
                <div className="vehicle-detail-item">
                  <span className="vehicle-detail-label">Driver ID:</span>
                  <span className="vehicle-detail-value">{selectedVehicleDriver.user_id}</span>
                </div>
                {selectedVehicleDriver.years_of_experience > 0 && (
                  <div className="vehicle-detail-item">
                    <span className="vehicle-detail-label">Driver Experience:</span>
                    <span className="vehicle-detail-value">{selectedVehicleDriver.years_of_experience} years</span>
                  </div>
                )}
                {selectedVehicleDriver.languages && selectedVehicleDriver.languages.length > 0 && (
                  <div className="vehicle-detail-item">
                    <span className="vehicle-detail-label">Driver Languages:</span>
                    <span className="vehicle-detail-value">{selectedVehicleDriver.languages.join(', ')}</span>
                  </div>
                )}
                <div className="driver-details">
                  <strong>Note:</strong> This vehicle comes with a professional licensed driver. 
                  The driver will assist with navigation, local insights, and ensure a comfortable journey.
                </div>
              </div>
            )}
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
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            {dbPackages.map((pkg) => {
              const style = getPackageStyles(pkg.category);
              const isActive = form.package === pkg.package_name && !isCustomPackage;
              const isExpanded = expandedPackageId === pkg.id;

              return (
                <div 
                  key={pkg.id}
                  className={`package-card ${isActive ? "active" : ""}`}
                  onClick={() => handlePackageSelect(pkg.package_name)}
                  style={{
                    '--package-color': style.borderColor,
                    '--package-border': style.borderColor,
                    '--package-bg': isActive ? style.bgColor : '#fff',
                    '--package-text': style.textColor,
                    '--btn-color': style.borderColor
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ cursor: 'pointer', flex: 1 }}>
                      <h4>
                        {pkg.package_name}
                        {isActive && <span style={{fontSize: '16px', color: '#059669', marginLeft: '10px'}}>✓ Selected</span>}
                      </h4>
                      <div className="package-price">USD {pkg.min_price}</div>
                      
                      <div className="package-highlights">
                        <span>🏨 {pkg.hotel_stars}★ Hotels</span>
                        <span>⏳ {pkg.duration_days} Days</span>
                        <span>📍 {pkg.destinations?.length || 0} Cities</span>
                        {typeof pkg.inclusions === 'string' && pkg.inclusions.includes('Breakfast') && <span>🍽️ Breakfast Included</span>}
                        {typeof pkg.inclusions === 'string' && pkg.inclusions.includes('Wi-Fi') && <span>📶 Free Wi-Fi</span>}
                      </div>
                    </div>
                    
                    <button 
                      className="btn-expand"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedPackageId(isExpanded ? null : pkg.id);
                      }}
                      style={{ '--btn-color': style.borderColor }}
                    >
                      {isExpanded ? "Close Details" : "View Full Itinerary"}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="itinerary-details">
                      <p><strong>Route:</strong> {pkg.destinations?.map(d => d.destination_name).join(" → ")}</p>
                      
                      <h4>🗺️ Daily Schedule:</h4>
                      {pkg.itinerary?.map((day) => (
                        <div key={day.id} className="day-schedule">
                          <h5>Day {day.day_number}: {day.title}</h5>
                          <p style={{fontSize: '13px', color: '#4a5568'}}>{day.description}</p>
                          
                          <div className="activity-list">
                            {day.activities?.map(act => (
                              <div key={act.id} className="activity-item">
                                <strong>{act.time_slot.toUpperCase()}:</strong> {act.activity_name} 
                                <span style={{marginLeft: '10px', color: '#a0aec0'}}>({act.activity_type})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      <div className="inclusions-box">
                        <strong>Inclusions:</strong> {Array.isArray(pkg.inclusions) ? pkg.inclusions.join(', ') : pkg.inclusions}
                      </div>
                      
                      <div className="package-buttons">
                        <button 
                          className="btn-secondary" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePackageSelect(pkg.package_name);
                          }}
                        >
                          <span>✅ Select This Package</span>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {!isExpanded && (
                    <div className="package-buttons">
                      <button 
                        className="btn-secondary" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePackageSelect(pkg.package_name);
                        }}
                      >
                        <span>✅ Select This Package</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Custom Package Option */}
            <div 
              className={`package-card ${isCustomPackage ? "active" : ""}`}
              onClick={handleCustomizeClick}
              style={{
                '--package-color': '#10b981',
                '--package-border': '#10b981',
                '--package-bg': isCustomPackage ? 'linear-gradient(135deg, #f0f9ff 0%, #d1fae5 100%)' : '#fff',
                '--package-text': '#047857'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ cursor: 'pointer', flex: 1 }}>
                  <h4>
                    Custom Package <span className="badge">✨ Flexible</span>
                    {isCustomPackage && <span style={{fontSize: '16px', color: '#059669', marginLeft: '10px'}}>✓ Selected</span>}
                  </h4>
                  <div className="package-price">From USD 90</div>
                  <div className="package-desc">Build your own package from scratch with complete flexibility</div>
                  <div className="package-highlights">
                    <span>✅ Choose exactly what you need</span>
                    <span>💰 Pay only for selected services</span>
                    <span>🎨 Mix and match components</span>
                    <span>🌟 Perfect for unique itineraries</span>
                  </div>
                </div>
                
                <button 
                  className="btn-expand"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCustomizeClick();
                  }}
                  style={{ '--btn-color': '#10b981' }}
                >
                  {showCustomizeOptions ? "Hide Options" : "Design Custom Package"}
                </button>
              </div>
              
              {!showCustomizeOptions && (
                <div className="package-buttons">
                  <button 
                    className="btn-secondary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCustomizeClick();
                    }}
                  >
                    <span>🎨 Design Custom Package</span>
                  </button>
                </div>
              )}
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
                    <label style={{fontSize: '16px', color: '#2d3748'}}>Travel Duration:</label>
                    <select 
                      value={customTravelDays}
                      onChange={(e) => setCustomTravelDays(e.target.value)}
                      style={{
                        fontSize: '18px',
                        color: '#667eea',
                        fontWeight: '600',
                        marginTop: '10px',
                        padding: '12px 20px',
                        border: '2px solid #667eea',
                        borderRadius: '10px',
                        background: '#fff',
                        width: '200px'
                      }}
                    >
                      <option value="3">3 Days</option>
                      <option value="4">4 Days</option>
                      <option value="5">5 Days</option>
                      <option value="6">6 Days</option>
                      <option value="7">7 Days</option>
                    </select>
                  </div>
                  <div style={{fontSize: '14px', color: '#718096', textAlign: 'right'}}>
                    Total estimated: {estimatedPrice}
                  </div>
                </div>
              </div>
              
              {/* Destinations Selection Section */}
              <div className="destinations-section">
                <h4 style={{color: '#2d3748', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <span>📍</span> Select Destinations
                </h4>
                <p style={{color: '#718096', fontSize: '15px', marginBottom: '20px'}}>
                  Choose the destinations you want to visit. Each destination adds $30 per day to your package.
                </p>
                <div className="destinations-grid">
                  {destinations.map((dest) => (
                    <div
                      key={dest.destination_code}
                      className={`destination-option ${selectedDestinations.includes(dest.destination_name) ? "selected" : ""}`}
                      onClick={() => toggleDestination(dest.destination_name)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDestinations.includes(dest.destination_name)}
                        onChange={() => {}}
                        style={{width: '20px', height: '20px'}}
                      />
                      <span className="destination-icon">📍</span>
                      <span style={{fontWeight: '600', color: '#2d3748'}}>{dest.destination_name}</span>
                      <span className="destination-price">+$30/day</span>
                    </div>
                  ))}
                </div>
                
                {selectedDestinations.length > 0 && (
                  <div className="selected-destinations-summary">
                    <div style={{fontWeight: '700', color: '#047857', marginBottom: '10px'}}>
                      ✅ Selected Destinations ({selectedDestinations.length})
                    </div>
                    <div style={{fontSize: '14px', color: '#4a5568'}}>
                      {selectedDestinations.join(", ")}
                    </div>
                    <div style={{fontSize: '13px', color: '#059669', marginTop: '8px'}}>
                      Additional cost: ${selectedDestinations.length * 30 * customTravelDays} ({selectedDestinations.length} destinations × $30 × {customTravelDays} days)
                    </div>
                  </div>
                )}
              </div>
              
              {/* Accommodation Section */}
              <div style={{marginBottom: '30px'}}>
                <h4 style={{color: '#2d3748', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <span>🏨</span> Accommodation (Select One)
                </h4>
                <p style={{color: '#718096', fontSize: '15px', marginBottom: '20px'}}>
                  Choose your preferred hotel star rating. Price is per night.
                </p>
                <div className="customize-grid">
                  {Object.entries(COMPONENT_PRICING)
                    .filter(([key, detail]) => detail.type === "accommodation")
                    .map(([key, detail]) => {
                      const isSelected = customPackageSelections[key];
                      const starCount = parseInt(detail.name.match(/\d+/)?.[0]) || 3;
                      
                      return (
                        <div
                          key={key}
                          className={`custom-option ${isSelected ? "selected" : ""}`}
                          onClick={() => toggleCustomSelection(key, "accommodation")}
                          style={{
                            border: isSelected ? '3px solid #10b981' : '2px solid #e2e8f0',
                            background: isSelected ? 'linear-gradient(135deg, #f0f9ff 0%, #d1fae5 100%)' : '#fff'
                          }}
                        >
                          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                              <input
                                type="radio"
                                checked={isSelected}
                                onChange={() => {}}
                                style={{width: '20px', height: '20px'}}
                              />
                              <div style={{fontWeight: '700', fontSize: '18px', color: '#2d3748'}}>
                                {detail.icon} {detail.name}
                              </div>
                            </div>
                          </div>
                          
                          <div className="hotel-star-rating">
                            {[...Array(5)].map((_, index) => (
                              <span 
                                key={index} 
                                className={index < starCount ? "star-filled" : "star-empty"}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          
                          <div className="price-tag">
                            USD {detail.price}/night
                          </div>
                          
                          <div style={{fontSize: '13px', color: isSelected ? '#059669' : '#718096', marginTop: '15px', fontWeight: isSelected ? '600' : '400'}}>
                            {isSelected ? "✓ Selected" : "Click to select this hotel"}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              
              {/* Meals & Services Sections */}
              {Object.entries({
                meal: {label: "🍽️ Meals & Dining", icon: "🍽️"},
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
                                <div style={{fontWeight: '600', fontSize: '16px', color: '#2d3748'}}>
                                  {detail.icon} {detail.name}
                                </div>
                              </div>
                              <div style={{color: '#059669', fontWeight: '700', fontSize: '18px'}}>
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
                <button className="btn-secondary" onClick={() => {
                  setCustomPackageSelections({});
                  setSelectedDestinations([]);
                }}>
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

          {/* Payment Slip Section */}
          <div className="payment-slip-container">
            <div className="section-title">
              <span className="section-title-icon">💳</span>
              <h3>Payment Slip Upload</h3>
            </div>
            <p style={{color: '#78350f', marginBottom: '20px'}}>
              Please upload your payment slip/bank transfer receipt to confirm your booking. Payment is required to secure your reservation.
            </p>
            
            {!paymentSlipUploaded ? (
              <>
                <label htmlFor="payment-slip-upload" className="payment-slip-upload">
                  <div className="payment-slip-upload-icon">📤</div>
                  <div style={{textAlign: 'center'}}>
                    <div style={{fontSize: '18px', fontWeight: '700', color: '#92400e', marginBottom: '8px'}}>
                      Click to Upload Payment Slip
                    </div>
                    <div style={{fontSize: '14px', color: '#78350f'}}>
                      Supports: JPG, PNG, GIF, WEBP, PDF (Max 5MB)
                    </div>
                  </div>
                </label>
                <input
                  id="payment-slip-upload"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handlePaymentSlipUpload}
                  style={{display: 'none'}}
                />
              </>
            ) : (
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '20px', fontWeight: '700', color: '#059669', marginBottom: '20px'}}>
                  ✅ Payment Slip Uploaded Successfully!
                </div>
                
                {paymentSlipPreview ? (
                  <div className="payment-slip-preview">
                    <img 
                      src={paymentSlipPreview} 
                      alt="Payment Slip Preview" 
                      className="payment-slip-image"
                    />
                  </div>
                ) : (
                  <div className="payment-slip-file-info">
                    <div style={{fontSize: '16px', fontWeight: '600', color: '#1e40af'}}>
                      📄 PDF File Uploaded
                    </div>
                    <div style={{fontSize: '14px', color: '#4b5563', marginTop: '5px'}}>
                      {paymentSlip?.name || 'Payment slip file'}
                    </div>
                  </div>
                )}
                
                <div className="payment-slip-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => document.getElementById('payment-slip-upload').click()}
                  >
                    <span>🔄 Change File</span>
                  </button>
                  <button 
                    className="btn-reset"
                    onClick={removePaymentSlip}
                  >
                    <span>🗑️ Remove File</span>
                  </button>
                </div>
              </div>
            )}
            
            <div className="payment-instructions">
              <h4 style={{color: '#1e40af', marginBottom: '10px'}}>Payment Instructions:</h4>
              <ul>
                <li>Transfer the booking amount to our bank account</li>
                <li><strong>Bank:</strong> Commercial Bank of Ceylon</li>
                <li><strong>Account Name:</strong> Ceylon Tour Mate (Pvt) Ltd</li>
                <li><strong>Account Number:</strong> 123456789012</li>
                <li><strong>Swift Code:</strong> CCEYLKLX</li>
                <li><strong>Branch:</strong> Colombo 03 Main Branch</li>
                <li>Use your passport number as the payment reference</li>
                <li>Upload the payment slip/receipt above</li>
              </ul>
              <p style={{fontSize: '13px', color: '#6b7280', marginTop: '10px'}}>
                Note: Your booking will only be confirmed after payment verification.
              </p>
            </div>
          </div>

          <div className="priceBox">
            ✨ Estimated Total: {estimatedPrice} ✨
            <div style={{fontSize: '16px', opacity: '0.95', marginTop: '10px'}}>
              {isCustomPackage ? '🎨 Custom Package' : form.package ? `🎯 ${form.package}` : '🎯 Select a Package'} • ⏳ {isCustomPackage ? customTravelDays : form.travelDays} day{parseInt(isCustomPackage ? customTravelDays : form.travelDays) > 1 ? 's' : ''} • 👥 {form.pax} {form.pax === "1" ? 'Traveler' : 'Travelers'}
              {isCustomPackage && selectedDestinations.length > 0 && ` • 📍 ${selectedDestinations.length} Destinations`}
              {form.vehicleType && ` • 🚗 ${form.vehicleType}${form.vehicleModel ? ` - ${form.vehicleModel}` : ''}`}
            </div>
          </div>

          <div className="actions">
            <button 
              className="btn-primary" 
              onClick={handleBookClick}
              disabled={!paymentSlip}
              style={!paymentSlip ? {opacity: 0.6, cursor: 'not-allowed'} : {}}
            >
              <span>✅ Complete Booking</span>
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
                  vehicleModel: "",
                  pax: "1",
                  pickup: "",
                  package: dbPackages.length > 0 ? dbPackages[0].package_name : "",
                  notes: "",
                });
                setSelectedLanguages([]);
                setShowOtherLanguage(false);
                setOtherLanguage("");
                setIsCustomPackage(false);
                setCustomPackageSelections({});
                setSelectedDestinations([]);
                setShowCustomizeOptions(false);
                setPaymentSlip(null);
                setPaymentSlipPreview(null);
                setPaymentSlipUploaded(false);
                setCustomTravelDays("3");
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