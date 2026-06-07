import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Calendar, Star, Users, CheckCircle2, XCircle, 
    Info, ShieldCheck, Clock, Tag, MapPin, 
    ArrowRight, DollarSign, Award, Coffee, 
    Sparkles, Settings, Palette, Heart, 
    ChevronDown, ChevronUp, Plus, Minus,
    Map, Hotel, Car, Utensils, Camera,
    Globe, Sun, Moon, Wallet, Shield,
    Wifi, Phone, Baby, Home, Navigation
} from 'lucide-react';

const TourPackageDetails = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('platinum');
    const [expandedDay, setExpandedDay] = useState(null);
    
    // Customization states
    const [customization, setCustomization] = useState({
        duration: 3,
        travelers: 1,
        accommodation: null,
        meals: {
            breakfast: { included: true, price: 0 },
            dinner: { included: false, price: 25 }
        },
        services: [],
        extraStops: 0
    });

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/packages/active-packages');
                setPackages(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching packages:", error);
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    const filteredPackages = packages.filter(pkg => pkg.category === activeCategory);

    // Accommodation options (3,4,5 star hotels)
    const accommodationOptions = [
        { id: '5star', name: '5★ Luxury Hotel', price: 120, description: 'Premium luxury experience with all amenities' },
        { id: '4star', name: '4★ Premium Hotel', price: 85, description: 'Comfort with premium facilities' },
        { id: '3star', name: '3★ Standard Hotel', price: 60, description: 'Standard comfort with essential amenities' }
    ];

    // Additional services
    const additionalServices = [
        { id: 'sim', name: 'Local SIM card', price: 12, icon: <Phone /> },
        { id: 'wifi', name: 'Pocket Wi-Fi', price: 18, icon: <Wifi /> },
        { id: 'vip', name: 'VIP meet & greet', price: 15, icon: <Users /> },
        { id: 'child-seat', name: 'Child seat', price: 8, icon: <Baby /> }
    ];

    const handleServiceToggle = (serviceId) => {
        setCustomization(prev => ({
            ...prev,
            services: prev.services.includes(serviceId)
                ? prev.services.filter(id => id !== serviceId)
                : [...prev.services, serviceId]
        }));
    };

    const handleMealToggle = (mealType) => {
        setCustomization(prev => ({
            ...prev,
            meals: {
                ...prev.meals,
                [mealType]: {
                    ...prev.meals[mealType],
                    included: !prev.meals[mealType].included
                }
            }
        }));
    };

    const handleExtraStops = (type) => {
        setCustomization(prev => ({
            ...prev,
            extraStops: type === 'add' 
                ? prev.extraStops + 1
                : Math.max(0, prev.extraStops - 1)
        }));
    };

    const calculateTotal = () => {
        let total = 0;
        
        // Base price per day
        const basePricePerDay = 90; // From your design "From USD 90"
        total += basePricePerDay * customization.duration;
        
        // Accommodation cost
        if (customization.accommodation) {
            const accommodation = accommodationOptions.find(a => a.id === customization.accommodation);
            total += accommodation.price * customization.duration;
        }
        
        // Meals cost
        if (customization.meals.dinner.included) {
            total += customization.meals.dinner.price * customization.duration;
        }
        
        // Additional services
        customization.services.forEach(serviceId => {
            const service = additionalServices.find(s => s.id === serviceId);
            total += service.price;
        });
        
        // Extra stops
        total += customization.extraStops * 10;
        
        // Multiply by number of travelers
        total *= customization.travelers;
        
        return total;
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-orange-50">
            <div className="relative mb-8">
                <div className="w-16 h-16 rounded-full border-t-4 border-b-4 border-orange-500 animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 rounded-full border-t-4 border-b-4 border-blue-900 animate-spin" style={{ animationDirection: 'reverse' }}></div>
            </div>
            <p className="text-base font-bold text-blue-900 animate-pulse">Crafting Your Perfect Sri Lankan Journey...</p>
            <p className="mt-2 text-xs text-slate-500">Loading exclusive experiences</p>
        </div>
    );

    return (
        <div className="pb-20 min-h-screen font-sans bg-gradient-to-b to-blue-50 from-slate-50 selection:bg-orange-200">
            {/* Hero Section with Parallax Effect */}
            <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 h-[400px] flex items-center justify-center text-center px-6 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t via-transparent from-blue-900/80 to-blue-900/40"></div>
                   
                </div>
                <div className="relative z-20">
                    <div className="flex justify-center mb-6">
                        <div className="px-6 py-2 rounded-full border backdrop-blur-sm bg-white/10 border-white/20">
                            <span className="text-xs font-medium text-white/90">✨ Exclusive Packages</span>
                        </div>
                    </div>
                    <h1 className="mb-6 text-3xl font-bold tracking-tight text-white uppercase md:text-4xl">
                        Get Some Idea  <span className="text-orange-400">about Packages</span>
                    </h1>
                    <p className="mx-auto max-w-3xl text-xs font-light leading-relaxed text-orange-100/90 md:text-sm">
                        Experience Sri Lanka through our curated Silver, Gold, and Platinum tiers, or create your own Custom journey
                    </p>
                    <div className="flex gap-4 justify-center mt-8">
                        <div className="flex gap-2 items-center text-white/80">
                            <ShieldCheck size={16} />
                            <span className="text-xs">24/7 Support</span>
                        </div>
                        <div className="flex gap-2 items-center text-white/80">
                            <Star size={16} />
                            <span className="text-xs">Best Price Guarantee</span>
                        </div>
                        <div className="flex gap-2 items-center text-white/80">
                            <Sparkles size={16} />
                            <span className="text-xs">Flexible Customization</span>
                        </div>
                    </div>
                </div>
                
                {/* Animated floating elements */}
                <div className="absolute top-10 left-10 w-6 h-6 rounded-full bg-orange-400/30 animate-float"></div>
                <div className="absolute right-20 bottom-20 w-8 h-8 rounded-full bg-blue-400/30 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute right-32 top-40 w-4 h-4 rounded-full bg-purple-400/30 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Premium Category Switcher - Enhanced */}
            <div className="flex sticky top-0 z-50 justify-center -mt-12 mb-16">
                <div className="flex gap-2 p-1.5 rounded-[30px] border shadow-xl backdrop-blur-xl bg-white/90 border-white/30">
                    {[
                        { id: 'platinum', label: 'Platinum', icon: <Sparkles size={18} />, color: 'from-purple-500 to-pink-500' },
                        { id: 'gold', label: 'Gold', icon: <Star size={18} />, color: 'from-yellow-500 to-orange-500' },
                        { id: 'silver', label: 'Silver', icon: <Award size={18} />, color: 'from-slate-400 to-blue-400' },
                        { id: 'customize', label: 'Customize', icon: <Settings size={18} />, color: 'from-green-500 to-emerald-500' }
                    ].map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-2 px-6 py-3.5 rounded-[22px] font-bold uppercase tracking-tight transition-all duration-300 hover:scale-105 ${
                                activeCategory === cat.id 
                                ? `bg-gradient-to-br ${cat.color} text-white shadow-lg scale-105` 
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                            }`}
                        >
                            {cat.icon}
                            <span className="text-xs">{cat.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="container px-4 mx-auto max-w-7xl">
                {activeCategory !== 'customize' ? (
                    filteredPackages.length > 0 ? (
                        <div className="space-y-24">
                            {filteredPackages.map((pkg) => (
                                <div key={pkg.id} className="transition-all duration-700 group">
                                    {/* Header with Enhanced Floating Badge */}
                                    <div className="flex flex-col gap-6 justify-between items-end mb-10 lg:flex-row">
                                        <div className="max-w-3xl">
                                            <div className="flex flex-wrap gap-3 items-center mb-4">
                                                <span className={`px-4 py-1.5 text-xs font-bold uppercase rounded-full border ${
                                                    pkg.category === 'platinum' 
                                                        ? 'text-purple-700 bg-purple-100 border-purple-200' 
                                                        : pkg.category === 'gold'
                                                        ? 'text-yellow-700 bg-yellow-100 border-yellow-200'
                                                        : 'text-blue-700 bg-blue-100 border-blue-200'
                                                }`}>
                                                    {pkg.category} Tier
                                                </span>
                                                <span className="font-mono text-xs tracking-tighter text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                                                    REF: {pkg.package_code}
                                                </span>
                                                {pkg.isPopular && (
                                                    <span className="px-3 py-0.5 text-[10px] font-bold text-red-700 uppercase bg-red-100 rounded-full border border-red-200 flex items-center gap-1">
                                                        <Heart size={10} /> Popular
                                                    </span>
                                                )}
                                            </div>
                                            <h2 className="text-3xl font-bold leading-tight md:text-4xl text-slate-900">
                                                {pkg.package_name}
                                            </h2>
                                            <p className="mt-3 max-w-2xl text-sm text-slate-600">
                                                {pkg.tagline || "An unforgettable journey through the heart of Sri Lanka"}
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-[30px] shadow-xl border-b-6 border-orange-500 min-w-[280px] transform hover:scale-105 transition-transform duration-500">
                                            <div className="flex gap-2 items-center mb-2">
                                                <Wallet size={18} className="text-orange-500" />
                                                <p className="text-xs font-medium uppercase text-slate-500">Starting Price</p>
                                            </div>
                                            <div className="flex gap-1 items-baseline">
                                                <span className="text-2xl font-bold text-slate-900">${pkg.max_price}</span>
                                                <span className="text-sm font-medium text-slate-400">/ person</span>
                                            </div>
                                            <div className="pt-4 mt-4 space-y-2 border-t border-slate-100">
                                                <div className="flex justify-between text-xs font-medium">
                                                    <span className="text-slate-500">Single Supplement</span>
                                                    <span className="font-bold text-orange-600">${pkg.single_supplement}</span>
                                                </div>
                                                <div className="flex justify-between text-xs font-medium">
                                                    <span className="text-slate-500">Early Bird Discount</span>
                                                    <span className="font-bold text-green-600">Up to 15%</span>
                                                </div>
                                            </div>
                                            <button 
    onClick={() => window.location.href = "/tourist/bookingForm"}
    className="flex gap-2 justify-center items-center py-3 mt-6 w-full text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl transition-all cursor-pointer hover:from-orange-600 hover:to-orange-700 hover:shadow-md"
>
    BOOK NOW <ArrowRight size={16} />
</button>
                                        </div>
                                    </div>

                                    {/* Main Feature Card */}
                                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                                        {/* Left: Stats & Description */}
                                        <div className="space-y-8 lg:col-span-8">
                                            {/* Enhanced Stats Grid */}
                                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                                {[
                                                    { icon: <Clock className="text-blue-600"/>, label: "Duration", val: `${pkg.duration_days}D / ${pkg.duration_nights}N`, bg: 'bg-blue-50' },
                                                    { icon: <Hotel className="text-yellow-600"/>, label: "Hotels", val: `${pkg.hotel_stars} Stars`, bg: 'bg-yellow-50' },
                                                    { icon: <Users className="text-green-600"/>, label: "Group Size", val: `${pkg.min_travelers}-${pkg.max_travelers}`, bg: 'bg-green-50' },
                                                    { icon: <Car className="text-purple-600"/>, label: "Transport", val: "Private AC", bg: 'bg-purple-50' }
                                                ].map((item, i) => (
                                                    <div key={i} className={`p-4 ${item.bg} rounded-2xl border shadow-sm transition-all duration-300 border-transparent hover:border-orange-300 hover:shadow-md hover:-translate-y-1`}>
                                                        <div className="p-2 mb-3 bg-white rounded-xl shadow-sm w-fit">{item.icon}</div>
                                                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">{item.label}</p>
                                                        <p className="text-sm font-bold text-slate-800">{item.val}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Enhanced Experience Section */}
                                            <div className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-[40px] shadow-md border border-slate-100">
                                                <div className="flex gap-3 items-center mb-6">
                                                    <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
                                                        <Info className="text-white" size={20}/>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-slate-900">Journey Highlights</h3>
                                                </div>
                                                <p className="text-sm leading-relaxed text-slate-700 first-letter:text-3xl first-letter:font-bold first-letter:mr-2 first-letter:float-left first-letter:text-orange-500">
                                                    {pkg.description}
                                                </p>
                                                <div className="grid grid-cols-2 gap-4 mt-8">
                                                    {pkg.highlights?.slice(0, 4).map((highlight, i) => (
                                                        <div key={i} className="flex gap-2 items-center">
                                                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                                            <span className="text-sm font-medium text-slate-700">{highlight}</span>
                                                        </div>
                                                    )) || Array(4).fill(0).map((_, i) => (
                                                        <div key={i} className="flex gap-2 items-center">
                                                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                                            <span className="text-sm font-medium text-slate-700">Exclusive local experiences</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Enhanced Inclusions / Exclusions */}
                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-[30px] border-2 border-emerald-200 shadow-md">
                                                    <div className="flex gap-2 items-center mb-6">
                                                        <div className="p-2 bg-emerald-100 rounded-lg">
                                                            <CheckCircle2 size={20} className="text-emerald-600"/>
                                                        </div>
                                                        <h4 className="text-lg font-bold text-emerald-800">What's Included</h4>
                                                    </div>
                                                    <ul className="space-y-3">
                                                        {(pkg.inclusions || '').split('\n').filter(item => item.trim()).map((item, i) => (
                                                            <li key={i} className="flex gap-3 items-start p-2 rounded-lg transition-colors hover:bg-emerald-100/50">
                                                                <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                                                    <CheckCircle2 size={10} className="text-white"/>
                                                                </div>
                                                                <span className="text-sm font-medium text-emerald-900">{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="bg-gradient-to-br from-rose-50 to-white p-8 rounded-[30px] border-2 border-rose-200 shadow-md">
                                                    <div className="flex gap-2 items-center mb-6">
                                                        <div className="p-2 bg-rose-100 rounded-lg">
                                                            <XCircle size={20} className="text-rose-600"/>
                                                        </div>
                                                        <h4 className="text-lg font-bold text-rose-800">Not Included</h4>
                                                    </div>
                                                    <ul className="space-y-3">
                                                        {(pkg.exclusions || '').split('\n').filter(item => item.trim()).map((item, i) => (
                                                            <li key={i} className="flex gap-3 items-start p-2 rounded-lg transition-colors hover:bg-rose-100/50">
                                                                <div className="w-5 h-5 bg-rose-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                                                    <XCircle size={10} className="text-white"/>
                                                                </div>
                                                                <span className="text-sm font-medium text-rose-900 opacity-80">{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Enhanced Quick Itinerary Sidebar */}
                                        <div className="space-y-6 lg:col-span-4">
                                            <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-[40px] p-8 text-white shadow-2xl sticky top-28">
                                                <div className="flex gap-2 items-center pb-4 mb-6 border-b border-slate-700">
                                                    <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                                                        <MapPin size={20}/>
                                                    </div>
                                                    <h3 className="text-lg font-bold">Your Journey Map</h3>
                                                </div>
                                                <div className="relative space-y-8">
                                                    <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-orange-500 via-orange-400 to-orange-500 rounded-full"/>
                                                    {pkg.itinerary?.map((day, idx) => (
                                                        <div key={idx} className="relative pl-10 group/day">
                                                            <div className="absolute left-0 top-1 z-10 w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full border-4 transition-all duration-300 border-slate-900 group-hover/day:scale-125 group-hover/day:shadow-lg"/>
                                                            <div className="cursor-pointer" onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}>
                                                                <p className="text-[10px] font-bold text-orange-400 uppercase mb-1">Day {day.day_number}</p>
                                                                <h5 className="mb-1 text-sm font-bold">{day.title}</h5>
                                                                <div className="flex flex-wrap gap-1.5 mb-1.5">
                                                                    {day.activities?.slice(0,2).map((act, ai) => (
                                                                        <span key={ai} className="text-[9px] bg-slate-800 px-2 py-1 rounded text-slate-300 uppercase tracking-tighter font-medium">
                                                                            {act.activity_name}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                                {expandedDay === idx && day.activities?.slice(2).map((act, ai) => (
                                                                    <div key={ai} className="mt-1.5 pl-3 border-l border-slate-700">
                                                                        <span className="text-xs text-slate-400">{act.activity_name}</span>
                                                                    </div>
                                                                ))}
                                                                <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
                                                                    {expandedDay === idx ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                                                    <span>{expandedDay === idx ? 'Show less' : 'Show more'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button 
    onClick={() => window.location.href = "/tourist/bookingForm"}
    className="flex gap-2 justify-center items-center py-3 mt-6 w-full text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl transition-all cursor-pointer hover:from-orange-600 hover:to-orange-700 hover:shadow-md"
>
    BOOK PACKAGE <ArrowRight size={16} />
</button>
                                            </div>

                                            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-[30px] shadow-md border border-slate-100">
                                                <div className="flex gap-2 items-center mb-4">
                                                    <div className="p-1.5 bg-blue-100 rounded-lg">
                                                        <ShieldCheck size={16} className="text-blue-600"/>
                                                    </div>
                                                    <h4 className="text-xs font-bold uppercase text-slate-700">Validity & Terms</h4>
                                                </div>
                                                <div className="overflow-y-auto pr-3 mb-4 max-h-28 text-xs leading-relaxed text-slate-600 custom-scrollbar">
                                                    {pkg.terms_conditions}
                                                </div>
                                                <div className="pt-4 border-t border-slate-100">
                                                    <div className="flex justify-between text-xs font-medium">
                                                        <div className="text-slate-500">Valid From</div>
                                                        <div className="text-blue-700">{new Date(pkg.valid_from).toLocaleDateString('en-US', { 
                                                            year: 'numeric', 
                                                            month: 'short', 
                                                            day: 'numeric' 
                                                        })}</div>
                                                    </div>
                                                    <div className="flex justify-between mt-2 text-xs font-medium">
                                                        <div className="text-slate-500">Valid Until</div>
                                                        <div className="text-blue-700">{new Date(pkg.valid_to).toLocaleDateString('en-US', { 
                                                            year: 'numeric', 
                                                            month: 'short', 
                                                            day: 'numeric' 
                                                        })}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-gradient-to-br from-white to-slate-50 rounded-[60px] shadow-lg border-4 border-dashed border-slate-200">
                            <div className="inline-block relative mb-6">
                                <Award className="mx-auto text-slate-200" size={80}/>
                                <Sparkles className="absolute -top-2 -right-2 text-orange-400" size={24}/>
                            </div>
                            <p className="mb-3 text-xl font-medium tracking-tight text-slate-400">
                                The <span className="tracking-wider text-blue-900 uppercase">{activeCategory}</span> collection is being updated
                            </p>
                            <p className="mx-auto max-w-md text-sm text-slate-500">
                                Our team is crafting exceptional experiences for this tier. Check back soon or explore other tiers.
                            </p>
                        </div>
                    )
                ) : (
                    /* UPDATED CUSTOMIZE SECTION - Even smaller font sizes */
                    <div className="overflow-hidden bg-white rounded-2xl border shadow-xl border-slate-200">
                        <div className="p-6 bg-gradient-to-r from-blue-600 to-emerald-500">
                            <div className="flex flex-col gap-3 justify-between items-start lg:flex-row lg:items-center">
                                <div>
                                    <h2 className="text-lg font-bold text-white mb-1.5">Custom Package</h2>
                                    <div className="flex items-baseline gap-1 mb-1.5">
                                        <span className="text-xl font-bold text-white">From USD {calculateTotal()}</span>
                                        <span className="text-emerald-100 text-[10px]">/ total</span>
                                    </div>
                                    <p className="max-w-3xl text-xs text-blue-100">
                                        Build your own package from scratch with complete flexibility. Choose exactly what you need, pay only for selected services.
                                    </p>
                                    <div className="flex items-center gap-1 mt-1.5">
                                        <Sparkles size={12} className="text-yellow-300" />
                                        <span className="text-xs font-medium text-yellow-100">Perfect for unique itineraries</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="mb-4 text-base font-bold text-slate-900">Customize Your Package</h3>
                            <p className="mb-6 text-xs text-slate-600">
                                Select the components you want in your custom package. Mix and match to create your perfect experience!
                            </p>

                            {/* 1. Travel Duration (3-7 days) */}
                            <div className="p-5 mb-8 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100">
                                <div className="flex gap-2 items-center mb-3">
                                    <div className="p-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded">
                                        <Calendar className="text-white" size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">Travel Duration</h4>
                                        <p className="text-slate-600 text-[10px]">Select days for your tour (3-7 days)</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-base font-bold text-slate-900">{customization.duration} Days</div>
                                            <div className="text-slate-500 text-[10px]">Selected duration</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-emerald-600">${90 * customization.duration}</div>
                                            <div className="text-slate-500 text-[10px]">Base cost</div>
                                        </div>
                                    </div>
                                    
                                    <input 
                                        type="range" 
                                        min="3" 
                                        max="7" 
                                        value={customization.duration}
                                        onChange={(e) => setCustomization({...customization, duration: parseInt(e.target.value)})}
                                        className="w-full h-1.5 bg-slate-200 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-emerald-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
                                    />
                                    
                                    <div className="flex justify-between text-[10px] text-slate-500 px-0.5">
                                        <span>3 Days</span>
                                        <span>4 Days</span>
                                        <span>5 Days</span>
                                        <span>6 Days</span>
                                        <span>7 Days</span>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Accommodation (3,4,5 star hotels) */}
                            <div className="p-5 mb-8 bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100">
                                <div className="flex gap-2 items-center mb-3">
                                    <div className="p-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded">
                                        <Hotel className="text-white" size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">Accommodation</h4>
                                        <p className="text-slate-600 text-[10px]">Select hotel rating (3, 4, or 5 star)</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2.5">
                                    {accommodationOptions.map((acc) => (
                                        <div 
                                            key={acc.id}
                                            onClick={() => setCustomization({...customization, accommodation: acc.id})}
                                            className={`p-3 rounded border cursor-pointer transition-all duration-200 ${
                                                customization.accommodation === acc.id
                                                    ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-white'
                                                    : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`p-1.5 rounded ${
                                                        customization.accommodation === acc.id
                                                            ? 'bg-emerald-100 text-emerald-600'
                                                            : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        {Array.from({length: parseInt(acc.name[0])}).map((_, i) => (
                                                            <Star key={i} size={10} className="inline-block mx-0.5" />
                                                        ))}
                                                    </div>
                                                    <div>
                                                        <h5 className="text-sm font-bold text-slate-900">{acc.name}</h5>
                                                        <p className="text-xs text-slate-600">{acc.description}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-bold text-slate-900">${acc.price}/night</div>
                                                    <div className="text-slate-500 text-[10px]">Total: ${acc.price * customization.duration}</div>
                                                    <div className={`mt-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                                                        customization.accommodation === acc.id
                                                            ? 'bg-emerald-500 text-white'
                                                            : 'bg-slate-100 text-slate-700'
                                                    }`}>
                                                        {customization.accommodation === acc.id ? '✓ Selected' : 'Click'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 3. Meals & Dining (breakfast and dinner) */}
                            <div className="p-5 mb-8 bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100">
                                <div className="flex gap-2 items-center mb-3">
                                    <div className="p-1.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded">
                                        <Utensils className="text-white" size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">Meals & Dining</h4>
                                        <p className="text-slate-600 text-[10px]">Select meal preferences</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    {/* Breakfast - Always included */}
                                    <div className="p-3 bg-gradient-to-br from-blue-50 to-white rounded border border-blue-200">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <h5 className="text-xs font-bold text-slate-900">Breakfast</h5>
                                            <div className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-medium">
                                                Included
                                            </div>
                                        </div>
                                        <p className="text-slate-600 text-[10px] mb-1.5">Complimentary daily breakfast</p>
                                        <div className="text-xs font-bold text-blue-600">USD 0 / day</div>
                                    </div>
                                    
                                    {/* Dinner - Optional upgrade */}
                                    <div 
                                        onClick={() => handleMealToggle('dinner')}
                                        className={`p-3 rounded border cursor-pointer transition-all duration-200 ${
                                            customization.meals.dinner.included
                                                ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-white'
                                                : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center mb-1.5">
                                            <h5 className="text-xs font-bold text-slate-900">Dinner</h5>
                                            <div className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                                customization.meals.dinner.included
                                                    ? 'bg-orange-100 text-orange-700'
                                                    : 'bg-slate-100 text-slate-700'
                                            }`}>
                                                {customization.meals.dinner.included ? 'Selected' : 'Optional'}
                                            </div>
                                        </div>
                                        <p className="text-slate-600 text-[10px] mb-1.5">Upgrade for daily dinner</p>
                                        <div className="flex justify-between items-center">
                                            <div className="text-xs font-bold text-orange-600">${customization.meals.dinner.price} / day</div>
                                            <div className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                                customization.meals.dinner.included
                                                    ? 'bg-orange-500 text-white'
                                                    : 'bg-slate-100 text-slate-700'
                                            }`}>
                                                {customization.meals.dinner.included ? '✓ Added' : 'Click'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Additional Services */}
                            <div className="p-5 mb-8 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100">
                                <div className="flex gap-2 items-center mb-3">
                                    <div className="p-1.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded">
                                        <Sparkles className="text-white" size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">Additional Services</h4>
                                        <p className="text-slate-600 text-[10px]">Optional enhancement services</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                                    {additionalServices.map((service) => (
                                        <div 
                                            key={service.id}
                                            onClick={() => handleServiceToggle(service.id)}
                                            className={`p-3 rounded border cursor-pointer transition-all duration-200 ${
                                                customization.services.includes(service.id)
                                                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-white'
                                                    : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className="flex flex-col items-center text-center">
                                                <div className={`p-2 rounded-full mb-2 ${
                                                    customization.services.includes(service.id)
                                                        ? 'bg-purple-100 text-purple-600'
                                                        : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {service.icon}
                                                </div>
                                                <h5 className="mb-1 text-xs font-bold text-slate-900">{service.name}</h5>
                                                <div className="text-xs font-bold text-purple-600 mb-1.5">${service.price}</div>
                                                <div className={`w-full py-1.5 rounded text-[10px] font-medium ${
                                                    customization.services.includes(service.id)
                                                        ? 'bg-purple-500 text-white'
                                                        : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                    {customization.services.includes(service.id) ? '✓ Added' : 'Click'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 5. Extra Stop */}
                            <div className="p-5 mb-8 bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-100">
                                <div className="flex gap-2 items-center mb-3">
                                    <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded">
                                        <Navigation className="text-white" size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">Extra Stop</h4>
                                        <p className="text-slate-600 text-[10px]">Add extra stops to itinerary</p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-3 justify-between items-center md:flex-row">
                                    <div className="text-center md:text-left">
                                        <div className="mb-1 text-base font-bold text-slate-900">{customization.extraStops} Stop{customization.extraStops !== 1 ? 's' : ''}</div>
                                        <p className="text-slate-600 text-[10px]">$10 per extra stop</p>
                                    </div>
                                    
                                    <div className="flex gap-3 items-center">
                                        <button 
                                            onClick={() => handleExtraStops('remove')}
                                            className="p-2 rounded transition-colors bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={customization.extraStops === 0}
                                        >
                                            <Minus size={14} className="text-slate-700" />
                                        </button>
                                        <div className="text-center">
                                            <div className="text-base font-bold text-indigo-600">${customization.extraStops * 10}</div>
                                            <div className="text-slate-500 text-[10px]">Total cost</div>
                                        </div>
                                        <button 
                                            onClick={() => handleExtraStops('add')}
                                            className="p-2 bg-indigo-100 rounded transition-colors hover:bg-indigo-200"
                                        >
                                            <Plus size={14} className="text-indigo-700" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Summary Section */}
                            <div className="pt-6 mt-8 border-t border-slate-200">
                                <div className="flex flex-col gap-4 justify-between items-center lg:flex-row">
                                    <div>
                                        <h5 className="mb-1 text-sm font-bold text-slate-900">Package Summary</h5>
                                        <p className="text-slate-600 text-[10px]">Review your custom package</p>
                                    </div>
                                    
                                    <div className="text-right">
                                        <div className="mb-1 text-lg font-bold text-emerald-600">USD {calculateTotal()}</div>
                                        <div className="text-slate-500 text-[10px]">Total for {customization.travelers} traveler{customization.travelers > 1 ? 's' : ''}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add these styles for animations and font family */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                
                * {
                    font-family: 'Inter', sans-serif;
                }
                
                @keyframes parallax {
                    0% { transform: scale(1.05) translateY(0); }
                    50% { transform: scale(1.05) translateY(-10px); }
                    100% { transform: scale(1.05) translateY(0); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .animate-parallax {
                    animation: parallax 20s ease-in-out infinite;
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            `}</style>
        </div>
    );
};

export default TourPackageDetails;