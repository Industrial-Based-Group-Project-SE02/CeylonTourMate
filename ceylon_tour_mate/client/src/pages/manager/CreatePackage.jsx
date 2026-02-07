import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Save,
  X,
  ChevronLeft,
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Package,
  Check,
  Clock,
  AlertCircle,
  Upload,
  Image,
  Globe,
  Hotel,
  FileText,
  Settings
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const API_BASE_URL = 'http://localhost:5000/api';

const CreatePackage = () => {
    const navigate = useNavigate();
    
    // Package state
    const [packageData, setPackageData] = useState({
        package_name: '',
        package_code: '',
        category: '',
        description: '',
        duration_days: 7,
        duration_nights: 6,
        hotel_stars: '',
        min_travelers: 2,
        max_travelers: 12,
        min_price: 1200.00,
        max_price: 2500.00,
        single_supplement: 200.00,
        valid_from: '',
        valid_to: '',
        status: 'draft',
        inclusions: `• Accommodation in hotels\n• Transport in air-conditioned vehicle\n• English-speaking guide services\n• Entrance fees to attractions\n• Airport transfers\n• Meals: Breakfast daily`,
        exclusions: `• International/Domestic flight tickets\n• Travel insurance\n• Visa fees\n• Personal expenses\n• Tips and gratuities\n• Services not mentioned`,
        terms_conditions: '',
        featured_image: ''
    });

    // Itinerary state
    const [itineraryDays, setItineraryDays] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Activity form state
    const [showActivityForm, setShowActivityForm] = useState(false);
    const [currentDayIndex, setCurrentDayIndex] = useState(null);
    const [editingActivityIndex, setEditingActivityIndex] = useState(null);
    const [activityForm, setActivityForm] = useState({
        time_slot: 'morning',
        activity_type: 'attraction',
        activity_name: '',
        description: '',
        duration: '',
        is_optional: false,
        optional_cost: 0
    });

    // Available destinations
    const [allDestinations] = useState([
        { code: 'COL', name: 'Colombo - Commercial Capital' },
        { code: 'KAN', name: 'Kandy - Cultural Heart' },
        { code: 'SIG', name: 'Sigiriya - Ancient Rock Fortress' },
        { code: 'POL', name: 'Polonnaruwa - Ancient City' },
        { code: 'ANU', name: 'Anuradhapura - Sacred City' },
        { code: 'NUW', name: 'Nuwara Eliya - Little England' },
        { code: 'ELL', name: 'Ella - Scenic Highlands' },
        { code: 'MIR', name: 'Mirissa - Beach & Whale Watching' },
        { code: 'GAL', name: 'Galle - Dutch Fort City' },
        { code: 'YAL', name: 'Yala - Wildlife Safari' }
    ]);

    // Time slots
    const timeSlots = [
        { value: 'morning', label: 'Morning', icon: '🌅' },
        { value: 'afternoon', label: 'Afternoon', icon: '☀️' },
        { value: 'evening', label: 'Evening', icon: '🌆' },
        { value: 'night', label: 'Night', icon: '🌙' }
    ];

    // Activity types
    const activityTypes = [
        { value: 'attraction', label: 'Tourist Attraction', color: 'bg-blue-100 text-blue-800' },
        { value: 'hotel', label: 'Hotel/Accommodation', color: 'bg-green-100 text-green-800' },
        { value: 'restaurant', label: 'Restaurant', color: 'bg-red-100 text-red-800' },
        { value: 'transport', label: 'Transport Point', color: 'bg-indigo-100 text-indigo-800' },
        { value: 'activity', label: 'Activity/Experience', color: 'bg-purple-100 text-purple-800' },
        { value: 'shopping', label: 'Shopping', color: 'bg-pink-100 text-pink-800' },
        { value: 'free', label: 'Free Time', color: 'bg-gray-100 text-gray-800' }
    ];

    // Set default dates on mount
    useEffect(() => {
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
        const threeMonthsLater = new Date(today.getFullYear(), today.getMonth() + 4, today.getDate());
        
        setPackageData(prev => ({
            ...prev,
            valid_from: nextMonth.toISOString().split('T')[0],
            valid_to: threeMonthsLater.toISOString().split('T')[0]
        }));

        generateItineraryDays(7);
    }, []);

    // Handle package data changes
    const handlePackageChange = (e) => {
        const { name, value, type } = e.target;
        
        if (type === 'number') {
            const numValue = parseFloat(value) || 0;
            setPackageData(prev => ({
                ...prev,
                [name]: numValue
            }));

            if (name === 'duration_days') {
                const nights = Math.max(0, numValue - 1);
                setPackageData(prev => ({
                    ...prev,
                    duration_nights: nights
                }));
                generateItineraryDays(numValue);
            }
        } else {
            setPackageData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Handle destination selection
    const handleDestinationSelect = (destinationCode) => {
        setDestinations(prev => {
            const existing = prev.find(d => d.code === destinationCode);
            if (existing) {
                return prev.filter(d => d.code !== destinationCode);
            } else {
                const destination = allDestinations.find(d => d.code === destinationCode);
                return [...prev, {
                    code: destination.code,
                    name: destination.name,
                    display_order: prev.length
                }];
            }
        });
    };

    // Generate itinerary days
    const generateItineraryDays = (days) => {
        const newItinerary = [];
        
        for (let i = 1; i <= days; i++) {
            newItinerary.push({
                day_number: i,
                title: `Day ${i}`,
                description: '',
                highlights: [],
                activities: []
            });
        }
        
        setItineraryDays(newItinerary);
    };

    // Add extra day
    const addDay = () => {
        const newDayNumber = itineraryDays.length + 1;
        const newDay = {
            day_number: newDayNumber,
            title: `Day ${newDayNumber}`,
            description: '',
            highlights: [],
            activities: []
        };
        
        const updatedItinerary = [...itineraryDays, newDay];
        setItineraryDays(updatedItinerary);
        setPackageData(prev => ({
            ...prev,
            duration_days: newDayNumber,
            duration_nights: Math.max(0, newDayNumber - 1)
        }));
    };

    // Remove day
    const removeDay = (index) => {
        if (window.confirm('Are you sure you want to remove this day?')) {
            const newItinerary = itineraryDays.filter((_, i) => i !== index);
            
            const updatedItinerary = newItinerary.map((day, idx) => ({
                ...day,
                day_number: idx + 1,
                title: `Day ${idx + 1}`
            }));
            
            setItineraryDays(updatedItinerary);
            setPackageData(prev => ({
                ...prev,
                duration_days: updatedItinerary.length,
                duration_nights: Math.max(0, updatedItinerary.length - 1)
            }));
        }
    };

    // Update day data
    const updateDayData = (index, field, value) => {
        const updatedItinerary = [...itineraryDays];
        updatedItinerary[index][field] = value;
        setItineraryDays(updatedItinerary);
    };

    // Open activity form
    const openActivityForm = (dayIndex, activityIndex = null) => {
        setCurrentDayIndex(dayIndex);
        setEditingActivityIndex(activityIndex);
        
        if (activityIndex !== null) {
            const activity = itineraryDays[dayIndex].activities[activityIndex];
            setActivityForm({
                time_slot: activity.time_slot || 'morning',
                activity_type: activity.activity_type || 'attraction',
                activity_name: activity.activity_name || '',
                description: activity.description || '',
                duration: activity.duration || '',
                is_optional: activity.is_optional || false,
                optional_cost: activity.optional_cost || 0
            });
        } else {
            setActivityForm({
                time_slot: 'morning',
                activity_type: 'attraction',
                activity_name: '',
                description: '',
                duration: '',
                is_optional: false,
                optional_cost: 0
            });
        }
        
        setShowActivityForm(true);
    };

    // Close activity form
    const closeActivityForm = () => {
        setShowActivityForm(false);
        setCurrentDayIndex(null);
        setEditingActivityIndex(null);
        setActivityForm({
            time_slot: 'morning',
            activity_type: 'attraction',
            activity_name: '',
            description: '',
            duration: '',
            is_optional: false,
            optional_cost: 0
        });
    };

    // Save activity
    const saveActivity = () => {
        if (!activityForm.activity_name.trim()) {
            alert('Please enter an activity name');
            return;
        }

        if (currentDayIndex === null) {
            alert('No day selected');
            return;
        }

        const updatedItinerary = [...itineraryDays];
        
        // Ensure activities array exists
        if (!updatedItinerary[currentDayIndex].activities) {
            updatedItinerary[currentDayIndex].activities = [];
        }
        
        const activityData = {
            time_slot: activityForm.time_slot,
            activity_type: activityForm.activity_type,
            activity_name: activityForm.activity_name,
            description: activityForm.description,
            duration: activityForm.duration,
            is_optional: activityForm.is_optional,
            optional_cost: parseFloat(activityForm.optional_cost) || 0
        };

        if (editingActivityIndex !== null) {
            updatedItinerary[currentDayIndex].activities[editingActivityIndex] = activityData;
        } else {
            updatedItinerary[currentDayIndex].activities.push(activityData);
        }

        setItineraryDays(updatedItinerary);
        closeActivityForm();
    };

    // Remove activity
    const removeActivity = (dayIndex, activityIndex) => {
        if (window.confirm('Are you sure you want to remove this activity?')) {
            const updatedItinerary = [...itineraryDays];
            updatedItinerary[dayIndex].activities.splice(activityIndex, 1);
            setItineraryDays(updatedItinerary);
        }
    };

    // Handle activity form changes
    const handleActivityFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            setActivityForm(prev => ({
                ...prev,
                [name]: checked
            }));
        } else if (type === 'number') {
            setActivityForm(prev => ({
                ...prev,
                [name]: parseFloat(value) || 0
            }));
        } else {
            setActivityForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Update highlights
    const updateHighlights = (dayIndex, highlights) => {
        const updatedItinerary = [...itineraryDays];
        updatedItinerary[dayIndex].highlights = highlights;
        setItineraryDays(updatedItinerary);
    };

    // Validate form
    const validateForm = () => {
        const errors = [];
        
        if (!packageData.package_name.trim()) {
            errors.push('Package name is required');
        }
        
        if (!packageData.category) {
            errors.push('Package category is required');
        }
        
        if (!packageData.hotel_stars) {
            errors.push('Hotel star category is required');
        }
        
        if (packageData.min_travelers > packageData.max_travelers) {
            errors.push('Minimum travelers cannot be greater than maximum travelers');
        }
        
        if (packageData.min_travelers < 2) {
            errors.push('Minimum travelers must be at least 2');
        }
        
        if (packageData.max_travelers > 12) {
            errors.push('Maximum travelers cannot exceed 12');
        }
        
        if (packageData.min_price <= 0 || packageData.max_price <= 0) {
            errors.push('Please enter valid prices (greater than 0)');
        }
        
        if (packageData.min_price > packageData.max_price) {
            errors.push('Minimum price cannot be greater than maximum price');
        }
        
        if (destinations.length === 0) {
            errors.push('Please select at least one destination');
        }
        
        if (itineraryDays.length === 0) {
            errors.push('Please create an itinerary with at least one day');
        }
        
        return errors;
    };

    // Generate package code
    const generatePackageCode = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/packages/last-code`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.data.success && response.data.lastCode) {
                const match = response.data.lastCode.match(/\d+/);
                if (match) {
                    const lastNumber = parseInt(match[0]);
                    return `CTM-${String(lastNumber + 1).padStart(3, '0')}`;
                }
            }
        } catch (error) {
            console.error('Error fetching last package code:', error);
        }
        return 'CTM-001';
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const errors = validateForm();
        if (errors.length > 0) {
            setError(errors.join('\n'));
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const userString = localStorage.getItem('user');
            
            let userId;
            if (userString) {
                const userData = JSON.parse(userString);
                userId = userData.id;
            }
            
            // Validate userId
            if (!userId || isNaN(parseInt(userId))) {
                setError('User ID not found. Please log in again.');
                setIsLoading(false);
                return;
            }
            
            // Generate package code if not provided
            const packageCode = packageData.package_code || await generatePackageCode();
            
            const formData = {
                package_name: packageData.package_name,
                package_code: packageCode,
                category: packageData.category,
                description: packageData.description,
                duration_days: parseInt(packageData.duration_days),
                duration_nights: parseInt(packageData.duration_nights),
                hotel_stars: parseInt(packageData.hotel_stars),
                min_travelers: parseInt(packageData.min_travelers),
                max_travelers: parseInt(packageData.max_travelers),
                min_price: parseFloat(packageData.min_price),
                max_price: parseFloat(packageData.max_price),
                single_supplement: parseFloat(packageData.single_supplement),
                valid_from: packageData.valid_from,
                valid_to: packageData.valid_to,
                status: packageData.status,
                inclusions: packageData.inclusions,
                exclusions: packageData.exclusions,
                terms_conditions: packageData.terms_conditions,
                created_by: parseInt(userId, 10),
                destinations: destinations,
                itinerary: itineraryDays.map(day => ({
                    day_number: parseInt(day.day_number),
                    title: day.title,
                    description: day.description,
                    highlights: day.highlights || [],
                    activities: day.activities ? day.activities.map((act, idx) => ({
                        time_slot: act.time_slot,
                        activity_type: act.activity_type,
                        activity_name: act.activity_name,
                        description: act.description,
                        duration: act.duration,
                        is_optional: Boolean(act.is_optional),
                        optional_cost: parseFloat(act.optional_cost) || 0
                    })) : []
                }))
            };

            console.log('Submitting package data:', formData);

            const response = await axios.post(`${API_BASE_URL}/packages`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setSuccess(`✅ Package "${packageData.package_name}" created successfully!`);
                
                // Reset form and redirect after delay
                setTimeout(() => {
                    navigate('/ManagePackage');
                }, 2000);
            } else {
                setError('Failed to create package: ' + (response.data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error creating package:', error);
            const errorMessage = error.response?.data?.details || 
                                error.response?.data?.message || 
                                error.message || 
                                'Error creating package. Please try again.';
            console.error('Error details:', error.response?.data);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Dashboard sidebar items
    const sidebarItems = [
        { icon: <Package className="w-5 h-5" />, label: 'Packages', path: '/ManagePackage' },
        { icon: <Globe className="w-5 h-5" />, label: 'Destinations', path: '/manager/destinations' },
        { icon: <Hotel className="w-5 h-5" />, label: 'Hotels', path: '/manager/hotels' },
        { icon: <Users className="w-5 h-5" />, label: 'Bookings', path: '/manager/bookings' },
        { icon: <FileText className="w-5 h-5" />, label: 'Reports', path: '/manager/reports' },
        { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/manager/settings' },
    ];

    return (
        <DashboardLayout 
            sidebarItems={sidebarItems}
            userRole="manager"
            userName="John Manager"
            userEmail="manager@ceylontourmate.com"
        >
            <div className="p-4 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 md:p-6">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="p-6 mb-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl md:p-8">
                        <div className="flex flex-col gap-6 justify-between items-start md:flex-row md:items-center">
                            <div>
                                <div className="flex gap-3 items-center mb-2">
                                    <button
                                        onClick={() => navigate('/manager/packages')}
                                        className="p-2 rounded-lg transition-colors bg-white/10 hover:bg-white/20"
                                    >
                                        <ChevronLeft className="w-6 h-6 text-white" />
                                    </button>
                                    <div className="p-2 rounded-lg bg-white/20">
                                        <Package className="w-8 h-8 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-white md:text-4xl">
                                        Create New Package
                                    </h1>
                                </div>
                                <p className="text-blue-100">
                                    Design amazing travel experiences with detailed itineraries
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Error and Success Messages */}
                    {error && (
                        <div className="p-4 mb-6 bg-red-50 rounded-xl border border-red-200">
                            <div className="flex gap-2 items-center text-red-800">
                                <AlertCircle className="w-5 h-5" />
                                <p className="font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="p-4 mb-6 bg-green-50 rounded-xl border border-green-200">
                            <div className="flex gap-2 items-center text-green-800">
                                <Check className="w-5 h-5" />
                                <p className="font-medium">{success}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <div className="p-6 bg-white rounded-2xl shadow-lg md:p-8">
                            <h2 className="mb-6 text-2xl font-bold text-gray-800">Basic Information</h2>
                            
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Package Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="package_name"
                                        value={packageData.package_name}
                                        onChange={handlePackageChange}
                                        required
                                        className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., 7-Day Cultural Triangle Adventure"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Package Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={packageData.category}
                                        onChange={handlePackageChange}
                                        required
                                        className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="silver">Silver</option>
                                        <option value="gold">Gold</option>
                                        <option value="platinum">Platinum</option>
                                        <option value="customized">Customized</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Hotel Stars *
                                    </label>
                                    <select
                                        name="hotel_stars"
                                        value={packageData.hotel_stars}
                                        onChange={handlePackageChange}
                                        required
                                        className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select Star Category</option>
                                        <option value="3">3 Star Hotels</option>
                                        <option value="4">4 Star Hotels</option>
                                        <option value="5">5 Star Hotels</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Package Code
                                    </label>
                                    <input
                                        type="text"
                                        name="package_code"
                                        value={packageData.package_code}
                                        onChange={handlePackageChange}
                                        className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Auto-generated (CTM-001)"
                                    />
                                    <p className="mt-2 text-sm text-gray-500">
                                        Leave empty for auto-generation
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Package Description
                                </label>
                                <textarea
                                    name="description"
                                    value={packageData.description}
                                    onChange={handlePackageChange}
                                    className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Describe the package highlights and experience..."
                                    rows="3"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Duration (Days) *
                                    </label>
                                    <input
                                        type="number"
                                        name="duration_days"
                                        value={packageData.duration_days}
                                        onChange={handlePackageChange}
                                        min="1"
                                        max="30"
                                        required
                                        className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Duration (Nights) *
                                    </label>
                                    <input
                                        type="number"
                                        name="duration_nights"
                                        value={packageData.duration_nights}
                                        onChange={handlePackageChange}
                                        readOnly
                                        className="px-4 py-3 w-full bg-gray-50 rounded-lg border border-gray-300"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Valid From *
                                    </label>
                                    <input
                                        type="date"
                                        name="valid_from"
                                        value={packageData.valid_from}
                                        onChange={handlePackageChange}
                                        required
                                        className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Valid To *
                                    </label>
                                    <input
                                        type="date"
                                        name="valid_to"
                                        value={packageData.valid_to}
                                        onChange={handlePackageChange}
                                        required
                                        className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Destinations */}
                        <div className="p-6 bg-white rounded-2xl shadow-lg md:p-8">
                            <h2 className="mb-6 text-2xl font-bold text-gray-800">Destinations Covered *</h2>
                            
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {allDestinations.map((dest) => {
                                    const isSelected = destinations.some(d => d.code === dest.code);
                                    return (
                                        <div key={dest.code} className="relative">
                                            <input
                                                type="checkbox"
                                                id={`dest-${dest.code}`}
                                                checked={isSelected}
                                                onChange={() => handleDestinationSelect(dest.code)}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor={`dest-${dest.code}`}
                                                className={`block p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                                    isSelected
                                                        ? 'bg-blue-50 border-blue-500'
                                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-medium text-gray-800">
                                                        {dest.name.split(' - ')[0]}
                                                    </span>
                                                    {isSelected && (
                                                        <Check className="w-5 h-5 text-blue-600" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {dest.code} - {dest.name.split(' - ')[1]}
                                                </p>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="mt-4 text-sm text-gray-500">
                                {destinations.length} destination(s) selected
                            </p>
                        </div>

                        {/* Itinerary */}
                        <div className="p-6 bg-white rounded-2xl shadow-lg md:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Itinerary ({itineraryDays.length} days)
                                </h2>
                                <button
                                    type="button"
                                    onClick={addDay}
                                    className="flex gap-2 items-center px-4 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Day
                                </button>
                            </div>

                            {itineraryDays.map((day, index) => (
                                <div key={index} className="p-6 mb-4 bg-gray-50 rounded-xl">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex gap-4 items-center">
                                            <div className="flex flex-shrink-0 justify-center items-center w-10 h-10 bg-blue-500 rounded-full">
                                                <span className="font-bold text-white">{day.day_number}</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={day.title}
                                                onChange={(e) => updateDayData(index, 'title', e.target.value)}
                                                className="text-lg font-bold text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0"
                                                placeholder="Day title"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeDay(index)}
                                            className="p-2 rounded-lg hover:bg-red-50"
                                        >
                                            <Trash2 className="w-5 h-5 text-red-500" />
                                        </button>
                                    </div>

                                    <textarea
                                        value={day.description}
                                        onChange={(e) => updateDayData(index, 'description', e.target.value)}
                                        className="p-3 mb-4 w-full rounded-lg border border-gray-300"
                                        placeholder="Day description..."
                                        rows="2"
                                    />

                                    {/* Highlights */}
                                    <div className="mb-4">
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Highlights
                                        </label>
                                        <select
                                            multiple
                                            value={day.highlights}
                                            onChange={(e) => {
                                                const selected = Array.from(e.target.selectedOptions, option => option.value);
                                                updateHighlights(index, selected);
                                            }}
                                            className="p-2 w-full h-32 rounded-lg border border-gray-300"
                                        >
                                            {destinations.map(dest => (
                                                <option key={dest.code} value={dest.name.split(' - ')[0]}>
                                                    {dest.name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Hold Ctrl/Cmd to select multiple highlights
                                        </p>
                                    </div>

                                    {/* Activities */}
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="font-medium text-gray-800">Activities</h3>
                                            <button
                                                type="button"
                                                onClick={() => openActivityForm(index)}
                                                className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Activity
                                            </button>
                                        </div>
                                        
                                        {!day.activities || day.activities.length === 0 ? (
                                            <p className="text-sm italic text-gray-400">No activities added yet</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {day.activities.map((activity, activityIndex) => {
                                                    const activityType = activityTypes.find(t => t.value === activity.activity_type);
                                                    const timeSlot = timeSlots.find(t => t.value === activity.time_slot);
                                                    return (
                                                        <div key={activityIndex} className="p-4 bg-white rounded-lg border border-gray-200">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div>
                                                                    <div className="flex gap-2 items-center mb-1">
                                                                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                                                                            {timeSlot?.icon} {timeSlot?.label}
                                                                        </span>
                                                                        <h4 className="font-medium">{activity.activity_name}</h4>
                                                                        {activity.is_optional && (
                                                                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                                                                                Optional
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    {activityType && (
                                                                        <span className={`text-xs px-2 py-1 rounded ${activityType.color}`}>
                                                                            {activityType.label}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="flex gap-1">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => openActivityForm(index, activityIndex)}
                                                                        className="p-1 rounded hover:bg-gray-100"
                                                                    >
                                                                        <Edit2 className="w-4 h-4 text-gray-500" />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeActivity(index, activityIndex)}
                                                                        className="p-1 rounded hover:bg-red-50"
                                                                    >
                                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            {activity.description && (
                                                                <p className="mb-2 text-sm text-gray-600">{activity.description}</p>
                                                            )}
                                                            <div className="flex gap-4 items-center text-sm text-gray-500">
                                                                {activity.duration && (
                                                                    <span className="flex gap-1 items-center">
                                                                        <Clock className="w-4 h-4" />
                                                                        {activity.duration}
                                                                    </span>
                                                                )}
                                                                {activity.optional_cost > 0 && (
                                                                    <span className="flex gap-1 items-center">
                                                                        <DollarSign className="w-4 h-4" />
                                                                        ${activity.optional_cost} extra
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pricing */}
                        <div className="p-6 bg-white rounded-2xl shadow-lg md:p-8">
                            <h2 className="mb-6 text-2xl font-bold text-gray-800">Pricing Configuration</h2>
                            
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Minimum Travelers *
                                    </label>
                                    <input
                                        type="number"
                                        name="min_travelers"
                                        value={packageData.min_travelers}
                                        onChange={handlePackageChange}
                                        min="2"
                                        max="12"
                                        required
                                        className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Maximum Travelers *
                                    </label>
                                    <input
                                        type="number"
                                        name="max_travelers"
                                        value={packageData.max_travelers}
                                        onChange={handlePackageChange}
                                        min="2"
                                        max="12"
                                        required
                                        className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Single Supplement *
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
                                        <input
                                            type="number"
                                            name="single_supplement"
                                            value={packageData.single_supplement}
                                            onChange={handlePackageChange}
                                            min="0"
                                            step="0.01"
                                            required
                                            className="py-3 pr-4 pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        MIN Price (Per Person) *
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
                                        <input
                                            type="number"
                                            name="min_price"
                                            value={packageData.min_price}
                                            onChange={handlePackageChange}
                                            min="0"
                                            step="0.01"
                                            required
                                            className="py-3 pr-4 pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        MAX Price (Per Person) *
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
                                        <input
                                            type="number"
                                            name="max_price"
                                            value={packageData.max_price}
                                            onChange={handlePackageChange}
                                            min="0"
                                            step="0.01"
                                            required
                                            className="py-3 pr-4 pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inclusions & Exclusions */}
                        <div className="p-6 bg-white rounded-2xl shadow-lg md:p-8">
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                <div>
                                    <h3 className="mb-4 text-lg font-bold text-gray-800">What's Included</h3>
                                    <textarea
                                        name="inclusions"
                                        value={packageData.inclusions}
                                        onChange={handlePackageChange}
                                        required
                                        className="px-4 py-3 w-full h-48 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <h3 className="mb-4 text-lg font-bold text-gray-800">What's Excluded</h3>
                                    <textarea
                                        name="exclusions"
                                        value={packageData.exclusions}
                                        onChange={handlePackageChange}
                                        required
                                        className="px-4 py-3 w-full h-48 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <div className="p-6 bg-white rounded-2xl shadow-lg md:p-8">
                            <h2 className="mb-6 text-2xl font-bold text-gray-800">Terms & Conditions</h2>
                            <textarea
                                name="terms_conditions"
                                value={packageData.terms_conditions}
                                onChange={handlePackageChange}
                                className="px-4 py-3 w-full h-48 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Booking and cancellation policies..."
                            />
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 justify-end">
                            <button
                                type="button"
                                onClick={() => navigate('/manager/packages')}
                                className="flex gap-3 items-center px-8 py-4 text-white bg-gray-600 rounded-xl transition-colors hover:bg-gray-700"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex gap-3 items-center px-8 py-4 text-white bg-blue-600 rounded-xl transition-colors hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 rounded-full border-2 border-white animate-spin border-t-transparent"></div>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Create Package
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Activity Form Modal */}
                    {showActivityForm && (
                        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-2xl font-bold text-gray-800">
                                            {editingActivityIndex !== null ? 'Edit' : 'Add'} Activity
                                        </h3>
                                        <button
                                            onClick={closeActivityForm}
                                            className="p-2 rounded-lg hover:bg-gray-100"
                                        >
                                            <X className="w-6 h-6 text-gray-500" />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                                    Time Slot
                                                </label>
                                                <select
                                                    name="time_slot"
                                                    value={activityForm.time_slot}
                                                    onChange={handleActivityFormChange}
                                                    className="px-4 py-3 w-full rounded-lg border border-gray-300"
                                                >
                                                    {timeSlots.map(slot => (
                                                        <option key={slot.value} value={slot.value}>
                                                            {slot.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                                    Activity Type
                                                </label>
                                                <select
                                                    name="activity_type"
                                                    value={activityForm.activity_type}
                                                    onChange={handleActivityFormChange}
                                                    className="px-4 py-3 w-full rounded-lg border border-gray-300"
                                                >
                                                    {activityTypes.map(type => (
                                                        <option key={type.value} value={type.value}>
                                                            {type.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                                Activity Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="activity_name"
                                                value={activityForm.activity_name}
                                                onChange={handleActivityFormChange}
                                                required
                                                className="px-4 py-3 w-full rounded-lg border border-gray-300"
                                                placeholder="Activity name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                value={activityForm.description}
                                                onChange={handleActivityFormChange}
                                                className="px-4 py-3 w-full rounded-lg border border-gray-300"
                                                rows="3"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                                    Duration
                                                </label>
                                                <input
                                                    type="text"
                                                    name="duration"
                                                    value={activityForm.duration}
                                                    onChange={handleActivityFormChange}
                                                    className="px-4 py-3 w-full rounded-lg border border-gray-300"
                                                    placeholder="e.g., 2 hours"
                                                />
                                            </div>

                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <div className="flex gap-3 items-center mb-3">
                                                    <input
                                                        type="checkbox"
                                                        id="is_optional"
                                                        name="is_optional"
                                                        checked={activityForm.is_optional}
                                                        onChange={handleActivityFormChange}
                                                        className="w-5 h-5 text-blue-600 rounded"
                                                    />
                                                    <label htmlFor="is_optional" className="font-medium text-gray-700">
                                                        Optional Activity
                                                    </label>
                                                </div>
                                                
                                                {activityForm.is_optional && (
                                                    <div>
                                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                                            Additional Cost
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="optional_cost"
                                                            value={activityForm.optional_cost}
                                                            onChange={handleActivityFormChange}
                                                            min="0"
                                                            step="0.01"
                                                            className="px-4 py-3 w-full rounded-lg border border-gray-300"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-3 justify-end pt-4 border-t">
                                            <button
                                                type="button"
                                                onClick={closeActivityForm}
                                                className="px-6 py-3 text-gray-700 rounded-lg border hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={saveActivity}
                                                className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                            >
                                                Save Activity
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CreatePackage;