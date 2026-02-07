import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Calendar, Star, Users, CheckCircle2, XCircle, 
    Info, ShieldCheck, Clock, Tag, MapPin, 
    ArrowRight, DollarSign, Award, Coffee
} from 'lucide-react';

const TourPackageDetails = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('platinum');

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

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
            <div className="mb-4 w-12 h-12 rounded-full border-t-2 border-b-2 border-blue-900 animate-spin"></div>
            <p className="font-bold text-blue-900 animate-pulse">Preparing Your Sri Lankan Journey...</p>
        </div>
    );

    return (
        <div className="pb-20 min-h-screen font-sans bg-slate-50 selection:bg-orange-100">
            {/* Hero Section */}
            <div className="relative bg-blue-900 h-[400px] flex items-center justify-center text-center px-6 overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <img src="https://images.unsplash.com/photo-1552423131-4048dc93699b?q=80&w=2000" alt="Sri Lanka" className="object-cover w-full h-full" />
                </div>
                <div className="relative z-10">
                    <h1 className="mb-4 text-5xl font-black tracking-tighter text-white uppercase drop-shadow-lg md:text-7xl">
                        Ceylon <span className="text-orange-500">Tiers</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg font-light text-orange-100 md:text-xl">
                        Experience the teardrop of India through curated Silver, Gold, and Platinum hospitality.
                    </p>
                </div>
            </div>

            {/* Premium Category Switcher */}
            <div className="flex sticky top-0 z-50 justify-center -mt-10 mb-16">
                <div className="flex gap-2 p-2 rounded-3xl border shadow-2xl backdrop-blur-md bg-white/80 border-white/50">
                    {['platinum', 'gold', 'silver'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all duration-500 ${
                                activeCategory === cat 
                                ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-orange-200 shadow-xl scale-105' 
                                : 'text-slate-400 hover:text-blue-900 hover:bg-slate-100'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="container px-4 mx-auto max-w-7xl">
                {filteredPackages.length > 0 ? (
                    <div className="space-y-32">
                        {filteredPackages.map((pkg) => (
                            <div key={pkg.id} className="transition-all duration-700 group">
                                {/* Header with Floating Badge */}
                                <div className="flex flex-col gap-6 justify-between items-end mb-8 lg:flex-row">
                                    <div className="max-w-3xl">
                                        <div className="flex gap-4 items-center mb-4">
                                            <span className="px-4 py-1 text-xs font-black tracking-widest text-orange-700 uppercase bg-orange-100 rounded-full border border-orange-200">
                                                {pkg.category} Experience
                                            </span>
                                            <span className="font-mono text-sm tracking-tighter text-slate-400">REF: {pkg.package_code}</span>
                                        </div>
                                        <h2 className="text-5xl font-black leading-tight md:text-6xl text-slate-900">
                                            {pkg.package_name}
                                        </h2>
                                    </div>
                                    <div className="bg-white p-8 rounded-3xl shadow-xl border-b-4 border-orange-500 min-w-[280px]">
                                        <p className="mb-1 text-xs font-bold uppercase text-slate-400">Starting Price</p>
                                        <div className="flex gap-1 items-baseline">
                                            <span className="text-4xl font-black text-slate-900">${pkg.max_price}</span>
                                            <span className="font-medium text-slate-400">/ person</span>
                                        </div>
                                        <div className="flex justify-between pt-4 mt-4 text-xs font-bold border-t border-slate-100">
                                            <span className="text-slate-500">Single Suppl.</span>
                                            <span className="text-orange-600">${pkg.single_supplement}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Feature Card */}
                                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                                    {/* Left: Stats & Description */}
                                    <div className="space-y-8 lg:col-span-8">
                                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                            {[
                                                { icon: <Clock className="text-blue-500"/>, label: "Duration", val: `${pkg.duration_days}D / ${pkg.duration_nights}N` },
                                                { icon: <Star className="text-yellow-500"/>, label: "Hotels", val: `${pkg.hotel_stars} Stars` },
                                                { icon: <Users className="text-green-500"/>, label: "Capacity", val: `${pkg.min_travelers}-${pkg.max_travelers} pax` },
                                                { icon: <Award className="text-purple-500"/>, label: "Tier", val: pkg.category }
                                            ].map((item, i) => (
                                                <div key={i} className="p-6 bg-white rounded-2xl border shadow-sm transition-colors border-slate-100 hover:border-orange-200">
                                                    <div className="mb-2">{item.icon}</div>
                                                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{item.label}</p>
                                                    <p className="font-bold text-slate-800">{item.val}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
                                            <h3 className="flex gap-3 items-center mb-6 text-2xl font-bold">
                                                <Info className="text-orange-500" size={24}/> The Experience
                                            </h3>
                                            <p className="text-lg leading-relaxed text-slate-600 first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-orange-500">
                                                {pkg.description}
                                            </p>
                                        </div>

                                        {/* Inclusions / Exclusions */}
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="bg-emerald-50/50 p-8 rounded-[32px] border border-emerald-100">
                                                <h4 className="flex gap-2 items-center mb-6 font-bold text-emerald-800">
                                                    <CheckCircle2 size={20}/> Comprehensive Inclusions
                                                </h4>
                                                <ul className="space-y-4">
                                                    {(pkg.inclusions || 'No inclusions specified').split('\n').filter(item => item.trim()).map((item, i) => (
                                                        <li key={i} className="flex gap-3 text-sm font-medium text-emerald-900">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"/> {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="bg-rose-50/50 p-8 rounded-[32px] border border-rose-100">
                                                <h4 className="flex gap-2 items-center mb-6 font-bold text-rose-800">
                                                    <XCircle size={20}/> Exclusions
                                                </h4>
                                                <ul className="space-y-4">
                                                    {(pkg.exclusions || 'No exclusions specified').split('\n').filter(item => item.trim()).map((item, i) => (
                                                        <li key={i} className="flex gap-3 text-sm font-medium text-rose-900 opacity-70">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-300 mt-1.5 shrink-0"/> {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Quick Itinerary Sidebar */}
                                    <div className="space-y-6 lg:col-span-4">
                                        <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl sticky top-28">
                                            <h3 className="flex gap-3 items-center pb-4 mb-8 text-xl font-bold border-b border-slate-800">
                                                <MapPin className="text-orange-500"/> Route Map
                                            </h3>
                                            <div className="relative space-y-8">
                                                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-slate-800"/>
                                                {pkg.itinerary?.map((day, idx) => (
                                                    <div key={idx} className="relative pl-8 group/day">
                                                        <div className="absolute left-0 top-1 z-10 w-4 h-4 bg-orange-500 rounded-full border-4 transition-transform border-slate-900 group-hover/day:scale-125"/>
                                                        <p className="text-[10px] font-black text-orange-500 uppercase">Day {day.day_number}</p>
                                                        <h5 className="mb-1 text-sm font-bold">{day.title}</h5>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {day.activities?.slice(0,2).map((act, ai) => (
                                                                <span key={ai} className="text-[9px] bg-slate-800 px-2 py-1 rounded-md text-slate-400 uppercase tracking-tighter italic">
                                                                    {act.activity_name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="flex gap-2 justify-center items-center py-4 mt-10 w-full font-black text-white bg-orange-500 rounded-2xl transition-all hover:bg-orange-600">
                                                BOOK NOW <ArrowRight size={18}/>
                                            </button>
                                        </div>

                                        <div className="p-6 bg-white rounded-3xl border border-slate-100">
                                            <h4 className="flex gap-2 items-center mb-4 text-xs font-black uppercase text-slate-400">
                                                <ShieldCheck size={14}/> Validity & Terms
                                            </h4>
                                            <div className="text-[10px] text-slate-500 leading-relaxed max-h-24 overflow-y-auto pr-2 custom-scrollbar">
                                                {pkg.terms_conditions}
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between text-[10px] font-bold text-slate-400">
                                                <span>From: {new Date(pkg.valid_from).toLocaleDateString()}</span>
                                                <span>To: {new Date(pkg.valid_to).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 bg-white rounded-[60px] shadow-sm border-2 border-dashed border-slate-200">
                        <Award className="mx-auto mb-6 text-slate-200" size={80}/>
                        <p className="text-2xl italic font-bold tracking-tight text-slate-400">
                            The <span className="tracking-widest text-blue-900 uppercase">{activeCategory}</span> collection is currently being updated.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TourPackageDetails;