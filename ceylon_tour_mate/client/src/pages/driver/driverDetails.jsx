import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Car, 
  UserCircle, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Languages, 
  Phone, 
  Save,
  PlusCircle,
  Edit3,
  Award,
  Briefcase,
  Palette,
  Calendar,
  AlertTriangle
} from 'lucide-react';

const DriverDetails = () => {
    const [formData, setFormData] = useState({
        license_number: '',
        address: '',
        city: '',
        district: '',
        province: '',
        languages: 'English, Sinhala',
        other_skills: '',
        years_of_experience: 0,
        vehicle_type: '',
        vehicle_number: '',
        vehicle_model: '',
        vehicle_year: '',
        vehicle_color: '',
        emergency_contact_name: '',
        emergency_contact_phone: ''
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isExistingDriver, setIsExistingDriver] = useState(false);
    const [activeSection, setActiveSection] = useState('basic');
    const [progress, setProgress] = useState(0);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    const vehicleTypes = [
        'Car', 'SUV', 'Van', 'Minibus', 'Bus', 'Luxury Car', 'Motorcycle', 'Other'
    ];

    const calculateProgress = () => {
        const requiredFields = ['license_number', 'vehicle_type', 'vehicle_number'];
        const total = requiredFields.length;
        const filled = requiredFields.filter(field => formData[field]?.trim()).length;
        return Math.round((filled / total) * 100);
    };

    useEffect(() => {
        const fetchDriverData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/drivers/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.data.success && response.data.data) {
                    const data = response.data.data;
                    setFormData({
                        license_number: data.licenseNumber || '',
                        address: data.address || '',
                        city: data.city || '',
                        district: data.district || '',
                        province: data.province || '',
                        languages: data.languages ? data.languages.join(', ') : 'English, Sinhala',
                        other_skills: data.otherSkills ? data.otherSkills.join(', ') : '',
                        years_of_experience: data.yearsOfExperience || 0,
                        vehicle_type: data.vehicleType || '',
                        vehicle_number: data.vehicleNumber || '',
                        vehicle_model: data.vehicleModel || '',
                        vehicle_year: data.vehicleYear || '',
                        vehicle_color: data.vehicleColor || '',
                        emergency_contact_name: data.emergencyContactName || '',
                        emergency_contact_phone: data.emergencyContactPhone || ''
                    });
                    setIsExistingDriver(true);
                }
            } catch (error) {
                if (error.response?.status !== 404) {
                    console.error("Error fetching driver details:", error);
                }
            } finally {
                setLoading(false);
            }
        };
        if (userId) fetchDriverData();
    }, [userId, token]);

    useEffect(() => {
        setProgress(calculateProgress());
    }, [formData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: 'Processing your request...', type: 'info' });
        
        // Validate token exists
        if (!token) {
            setMessage({ 
                text: '⚠️ Session expired. Please log in again.', 
                type: 'error' 
            });
            window.location.href = '/login';
            return;
        }

        // Validate userId exists
        if (!userId) {
            setMessage({ 
                text: '⚠️ Error: User ID not found. Please log in again.', 
                type: 'error' 
            });
            return;
        }

        // Validate required fields
        if (!formData.license_number || !formData.vehicle_type || !formData.vehicle_number) {
            setMessage({ 
                text: '⚠️ Please fill in all required fields: License Number, Vehicle Type, and Vehicle Number', 
                type: 'error' 
            });
            return;
        }
        
        try {
            const submissionData = {
                user_id: userId,
                license_number: formData.license_number,
                address: formData.address,
                city: formData.city,
                district: formData.district,
                province: formData.province,
                languages: formData.languages.split(',').map(s => s.trim()).filter(s => s),
                other_skills: formData.other_skills.split(',').map(s => s.trim()).filter(s => s),
                years_of_experience: parseInt(formData.years_of_experience) || 0,
                vehicle_type: formData.vehicle_type,
                vehicle_number: formData.vehicle_number,
                vehicle_model: formData.vehicle_model,
                vehicle_year: formData.vehicle_year ? parseInt(formData.vehicle_year) : null,
                vehicle_color: formData.vehicle_color,
                emergency_contact_name: formData.emergency_contact_name,
                emergency_contact_phone: formData.emergency_contact_phone
            };

            console.log('Submitting data:', submissionData);
            console.log('Endpoint:', isExistingDriver ? `PUT /api/drivers/${userId}` : 'POST /api/drivers');

            let response;
            
            if (isExistingDriver) {
                response = await axios.put(
                    `http://localhost:5000/api/drivers/${userId}`,
                    submissionData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setMessage({ 
                    text: '🎉 Profile updated successfully!', 
                    type: 'success' 
                });
            } else {
                response = await axios.post(
                    'http://localhost:5000/api/drivers',
                    submissionData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setIsExistingDriver(true);
                setMessage({ 
                    text: '✨ Driver profile created successfully!', 
                    type: 'success' 
                });
            }
            
            console.log('Response:', response.data);
            
            // Auto-hide success message after 3 seconds
            if (response.data.success) {
                setTimeout(() => {
                    setMessage({ text: '', type: '' });
                }, 3000);
            }
            
        } catch (err) {
            console.error('API Error:', err);
            
            // Handle token errors
            if (err.response?.status === 401 || err.response?.status === 403) {
                setMessage({ 
                    text: '⚠️ Session expired. Please log in again.', 
                    type: 'error' 
                });
                window.location.href = '/login';
                return;
            }
            
            const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to save profile. Please try again.';
            setMessage({ 
                text: `⚠️ ${errorMsg}`, 
                type: 'error' 
            });
        }
    };

    const renderSectionIcon = (section) => {
        const icons = {
            basic: <UserCircle size={20} />,
            location: <MapPin size={20} />,
            vehicle: <Car size={20} />,
            skills: <Star size={20} />,
            emergency: <ShieldCheck size={20} />
        };
        return icons[section] || <UserCircle size={20} />;
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader">
                    <Car className="spinner" size={48} />
                    <p>Loading your driver profile...</p>
                </div>
                <style>{`
                    .loading-screen {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    }
                    .loader {
                        text-align: center;
                        color: white;
                    }
                    .spinner {
                        animation: spin 2s linear infinite;
                        margin-bottom: 20px;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="driver-profile-container">
            <style>{`
                :root {
                    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    --success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                    --card-shadow: 0 20px 40px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.05);
                    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .driver-profile-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    padding: 20px;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                }

                .header-section {
                    background: var(--primary-gradient);
                    color: white;
                    padding: 40px 30px;
                    border-radius: 24px;
                    margin-bottom: 30px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: var(--card-shadow);
                }

                .header-section::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -50%;
                    width: 100%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
                    background-size: 30px 30px;
                    opacity: 0.2;
                }

                .profile-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: relative;
                    z-index: 2;
                }

                .profile-title {
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin: 0;
                    background: linear-gradient(to right, #fff, #f0f0f0);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .profile-status {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(255,255,255,0.2);
                    padding: 10px 20px;
                    border-radius: 50px;
                    backdrop-filter: blur(10px);
                }

                .profile-badge {
                    font-size: 0.9rem;
                    font-weight: 600;
                    padding: 6px 16px;
                    border-radius: 20px;
                    background: ${isExistingDriver ? 'rgba(16, 185, 129, 0.9)' : 'rgba(59, 130, 246, 0.9)'};
                }

                .profile-progress {
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                    padding: 20px;
                    margin-top: 30px;
                    backdrop-filter: blur(10px);
                }

                .progress-bar {
                    height: 12px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 6px;
                    overflow: hidden;
                    margin-bottom: 10px;
                }

                .progress-fill {
                    height: 100%;
                    background: var(--success-gradient);
                    border-radius: 6px;
                    transition: width 0.5s ease;
                    position: relative;
                }

                .progress-fill::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(90deg, 
                        transparent 0%, 
                        rgba(255,255,255,0.4) 50%, 
                        transparent 100%);
                    animation: shimmer 2s infinite;
                }

                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                .main-content {
                    display: grid;
                    grid-template-columns: 300px 1fr;
                    gap: 30px;
                }

                .sidebar {
                    background: white;
                    border-radius: 20px;
                    padding: 25px;
                    box-shadow: var(--card-shadow);
                    height: fit-content;
                }

                .section-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 15px 20px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: var(--transition);
                    border: 2px solid transparent;
                }

                .nav-item:hover {
                    background: linear-gradient(135deg, #f6f9ff 0%, #edf2ff 100%);
                    transform: translateX(5px);
                }

                .nav-item.active {
                    background: var(--primary-gradient);
                    color: white;
                    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
                    border-color: rgba(255,255,255,0.2);
                }

                .nav-item.active svg {
                    color: white;
                }

                .nav-icon {
                    color: #667eea;
                }

                .content-area {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: var(--card-shadow);
                    animation: slideIn 0.5s ease;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .form-section {
                    display: none;
                }

                .form-section.active {
                    display: block;
                }

                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 30px;
                    padding-bottom: 15px;
                    border-bottom: 3px solid #f0f0f0;
                }

                .section-icon {
                    background: var(--primary-gradient);
                    padding: 15px;
                    border-radius: 12px;
                    color: white;
                }

                .section-title {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: #2d3748;
                    margin: 0;
                }

                .section-description {
                    color: #718096;
                    margin-top: 5px;
                    font-size: 0.95rem;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 25px;
                }

                .input-group {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #a0aec0;
                    z-index: 2;
                }

                .input-group input,
                .input-group select,
                .input-group textarea {
                    width: 100%;
                    padding: 16px 16px 16px 50px;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 1rem;
                    transition: var(--transition);
                    background: #f8fafc;
                }

                .input-group input:focus,
                .input-group select:focus,
                .input-group textarea:focus {
                    outline: none;
                    border-color: #667eea;
                    background: white;
                    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
                }

                .input-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #4a5568;
                    font-size: 0.9rem;
                }

                .chip-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-top: 10px;
                }

                .chip {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .submit-btn {
                    background: var(--secondary-gradient);
                    color: white;
                    padding: 20px 40px;
                    border: none;
                    border-radius: 15px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: var(--transition);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 40px;
                    width: 100%;
                    box-shadow: 0 10px 20px rgba(245, 101, 101, 0.3);
                }

                .submit-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 30px rgba(245, 101, 101, 0.4);
                }

                .message-container {
                    position: fixed;
                    top: 30px;
                    right: 30px;
                    z-index: 1000;
                    animation: slideInRight 0.5s ease;
                }

                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                .message {
                    background: white;
                    padding: 20px 30px;
                    border-radius: 15px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                    border-left: 6px solid;
                    min-width: 300px;
                    animation: float 3s ease-in-out infinite;
                }

                .message.success {
                    border-left-color: #10b981;
                    background: linear-gradient(135deg, #def7ec 0%, #ffffff 100%);
                }

                .message.error {
                    border-left-color: #ef4444;
                    background: linear-gradient(135deg, #fde8e8 0%, #ffffff 100%);
                }

                .message.info {
                    border-left-color: #3b82f6;
                    background: linear-gradient(135deg, #dbeafe 0%, #ffffff 100%);
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .vehicle-preview {
                    background: linear-gradient(135deg, #f6f9ff 0%, #edf2ff 100%);
                    padding: 30px;
                    border-radius: 20px;
                    margin-top: 20px;
                    display: flex;
                    align-items: center;
                    gap: 30px;
                }

                .vehicle-icon {
                    font-size: 4rem;
                    color: #667eea;
                    animation: bounce 2s infinite;
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .vehicle-info h4 {
                    margin: 0 0 10px 0;
                    color: #2d3748;
                }

                .vehicle-info p {
                    margin: 5px 0;
                    color: #718096;
                }

                .skill-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    margin: 5px;
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .emergency-contact {
                    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                    padding: 25px;
                    border-radius: 15px;
                    border: 2px dashed #f59e0b;
                }

                @media (max-width: 1024px) {
                    .main-content {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 768px) {
                    .header-section {
                        padding: 30px 20px;
                    }
                    
                    .profile-header {
                        flex-direction: column;
                        gap: 20px;
                    }
                    
                    .content-area {
                        padding: 25px;
                    }
                }
            `}</style>

            {/* Header Section */}
            <div className="header-section">
                <div className="profile-header">
                    <div>
                        <h1 className="profile-title">
                            {isExistingDriver ? 'Driver Dashboard' : 'Welcome to CeylonTourMate'}
                        </h1>
                        <p className="text-white opacity-90">
                            {isExistingDriver 
                                ? 'Manage your professional driver profile' 
                                : 'Complete your profile to start accepting tours'}
                        </p>
                    </div>
                    <div className="profile-status">
                        <span className="profile-badge">
                            {isExistingDriver ? 'Verified Driver' : 'New Driver'}
                        </span>
                        <ShieldCheck size={20} />
                    </div>
                </div>
                
                <div className="profile-progress">
                    <div className="flex justify-between mb-2">
                        <span className="font-semibold text-white">Profile Completion</span>
                        <span className="font-bold text-white">{progress}%</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="mt-3 text-sm text-white opacity-80">
                        {progress < 50 ? 'Complete more fields to increase your visibility' : 
                         progress < 80 ? 'Great progress! Almost there!' : 
                         'Excellent! Your profile is almost complete!'}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Sidebar Navigation */}
                <div className="sidebar">
                    <nav className="section-nav">
                        {['basic', 'location', 'vehicle', 'skills', 'emergency'].map((section) => (
                            <div
                                key={section}
                                className={`nav-item ${activeSection === section ? 'active' : ''}`}
                                onClick={() => setActiveSection(section)}
                            >
                                <div className="nav-icon">
                                    {renderSectionIcon(section)}
                                </div>
                                <span className="font-medium">
                                    {section.charAt(0).toUpperCase() + section.slice(1)}
                                </span>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Form Content */}
                <div className="content-area">
                    <form onSubmit={handleSubmit}>
                        {/* Basic Information Section */}
                        <div className={`form-section ${activeSection === 'basic' ? 'active' : ''}`}>
                            <div className="section-header">
                                <div className="section-icon">
                                    <UserCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="section-title">Basic Information</h3>
                                    <p className="section-description">Your professional identity and license details</p>
                                </div>
                            </div>
                            
                            <div className="form-grid">
                                <div className="input-group">
                                    <label>License Number</label>
                                    <div className="input-icon">
                                        <Award size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        name="license_number"
                                        value={formData.license_number}
                                        onChange={handleChange}
                                        placeholder="DL-1234567"
                                        required
                                    />
                                </div>
                                
                                <div className="input-group">
                                    <label>Years of Experience</label>
                                    <div className="input-icon">
                                        <Briefcase size={20} />
                                    </div>
                                    <input
                                        type="number"
                                        name="years_of_experience"
                                        value={formData.years_of_experience}
                                        onChange={handleChange}
                                        min="0"
                                        max="50"
                                        placeholder="5"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className={`form-section ${activeSection === 'location' ? 'active' : ''}`}>
                            <div className="section-header">
                                <div className="section-icon">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="section-title">Location Details</h3>
                                    <p className="section-description">Where you're based for tours</p>
                                </div>
                            </div>
                            
                            <div className="form-grid">
                                {['address', 'city', 'district', 'province'].map((field) => (
                                    <div key={field} className="input-group">
                                        <label>{field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}</label>
                                        <div className="input-icon">
                                            <MapPin size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            name={field}
                                            value={formData[field]}
                                            onChange={handleChange}
                                            placeholder={`Enter your ${field.replace('_', ' ')}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Vehicle Section */}
                        <div className={`form-section ${activeSection === 'vehicle' ? 'active' : ''}`}>
                            <div className="section-header">
                                <div className="section-icon">
                                    <Car size={24} />
                                </div>
                                <div>
                                    <h3 className="section-title">Vehicle Information</h3>
                                    <p className="section-description">Details about your tour vehicle</p>
                                </div>
                            </div>
                            
                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Vehicle Type</label>
                                    <div className="input-icon">
                                        <Car size={20} />
                                    </div>
                                    <select
                                        name="vehicle_type"
                                        value={formData.vehicle_type}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select type</option>
                                        {vehicleTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                {['vehicle_number', 'vehicle_model', 'vehicle_year', 'vehicle_color'].map((field) => (
                                    <div key={field} className="input-group">
                                        <label>{field.split('_')[1].charAt(0).toUpperCase() + field.split('_')[1].slice(1)}</label>
                                        <div className="input-icon">
                                            {field.includes('color') ? <Palette size={20} /> : 
                                             field.includes('year') ? <Calendar size={20} /> : 
                                             <Car size={20} />}
                                        </div>
                                        <input
                                            type={field.includes('year') ? 'number' : 'text'}
                                            name={field}
                                            value={formData[field]}
                                            onChange={handleChange}
                                            placeholder={field.includes('number') ? 'ABC-1234' : 
                                                        field.includes('year') ? '2020' : 
                                                        field.includes('color') ? 'White' : 'Toyota Prius'}
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            {formData.vehicle_type && (
                                <div className="vehicle-preview">
                                    <div className="vehicle-icon">
                                        <Car size={48} />
                                    </div>
                                    <div className="vehicle-info">
                                        <h4 className="text-lg font-bold">{formData.vehicle_type}</h4>
                                        <p><strong>Model:</strong> {formData.vehicle_model || 'Not specified'}</p>
                                        <p><strong>Number:</strong> {formData.vehicle_number || 'Not specified'}</p>
                                        <p><strong>Color:</strong> {formData.vehicle_color || 'Not specified'}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Skills Section */}
                        <div className={`form-section ${activeSection === 'skills' ? 'active' : ''}`}>
                            <div className="section-header">
                                <div className="section-icon">
                                    <Star size={24} />
                                </div>
                                <div>
                                    <h3 className="section-title">Skills & Languages</h3>
                                    <p className="section-description">What makes you a great tour driver</p>
                                </div>
                            </div>
                            
                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Languages Spoken</label>
                                    <div className="input-icon">
                                        <Languages size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        name="languages"
                                        value={formData.languages}
                                        onChange={handleChange}
                                        placeholder="English, Sinhala, Tamil"
                                    />
                                </div>
                                
                                <div className="input-group">
                                    <label>Other Skills</label>
                                    <div className="input-icon">
                                        <Award size={20} />
                                    </div>
                                    <textarea
                                        name="other_skills"
                                        value={formData.other_skills}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Tour guiding, First aid, Mechanical knowledge, Photography"
                                    />
                                </div>
                            </div>
                            
                            {(formData.languages || formData.other_skills) && (
                                <div className="mt-8">
                                    <h4 className="mb-4 font-semibold text-gray-700">Your Skills Preview:</h4>
                                    <div className="chip-container">
                                        {formData.languages.split(',').map((lang, index) => (
                                            lang.trim() && (
                                                <span key={index} className="skill-tag">
                                                    <Languages size={14} />
                                                    {lang.trim()}
                                                </span>
                                            )
                                        ))}
                                        {formData.other_skills.split(',').map((skill, index) => (
                                            skill.trim() && (
                                                <span key={index} className="skill-tag">
                                                    <Star size={14} />
                                                    {skill.trim()}
                                                </span>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Emergency Contact Section */}
                        <div className={`form-section ${activeSection === 'emergency' ? 'active' : ''}`}>
                            <div className="section-header">
                                <div className="section-icon">
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <h3 className="section-title">Emergency Contact</h3>
                                    <p className="section-description">Important safety information</p>
                                </div>
                            </div>
                            
                            <div className="emergency-contact">
                                <div className="form-grid">
                                    <div className="input-group">
                                        <label>Contact Name</label>
                                        <div className="input-icon">
                                            <UserCircle size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            name="emergency_contact_name"
                                            value={formData.emergency_contact_name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    
                                    <div className="input-group">
                                        <label>Contact Phone</label>
                                        <div className="input-icon">
                                            <Phone size={20} />
                                        </div>
                                        <input
                                            type="tel"
                                            name="emergency_contact_phone"
                                            value={formData.emergency_contact_phone}
                                            onChange={handleChange}
                                            placeholder="+94 77 123 4567"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="submit-btn">
                            {isExistingDriver ? (
                                <>
                                    <Edit3 size={20} />
                                    Update Profile
                                </>
                            ) : (
                                <>
                                    <PlusCircle size={20} />
                                    Create Driver Profile
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Message Notification */}
            {message.text && (
                <div className="message-container">
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriverDetails;