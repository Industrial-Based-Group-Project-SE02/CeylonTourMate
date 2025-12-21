// client/src/manager/PackageDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Edit, Share2, Calendar, Users, 
  DollarSign, Hotel, Star, CheckCircle, XCircle,
  MapPin, Globe, Eye, Bed, FileText,
  ChevronDown, ChevronUp, Save, X, Plus, Trash2,
  Clock, Tag, Users as UsersIcon, Sun, Mountain,
  Castle, Camera, Award, Maximize2, Minimize2
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    itinerary: false,
    hotels: false,
    destinations: false,
    inclusions: false,
    features: false,
    bestFor: false
  });
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    fetchPackageDetails();
  }, [id]);

  const fetchPackageDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/packages/${id}`);
      setPackageData(response.data.data);
      setEditedData(response.data.data);
    } catch (error) {
      console.error('Error fetching package details:', error);
      setError('Failed to load package details');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(packageData);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/packages/${id}`, editedData);
      setPackageData(response.data.data);
      setIsEditing(false);
      alert('Package updated successfully!');
    } catch (error) {
      console.error('Error updating package:', error);
      alert('Failed to update package');
    }
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedArrayChange = (field, index, subIndex, value) => {
    setEditedData(prev => {
      const newArray = [...prev[field]];
      if (subIndex !== undefined) {
        newArray[index] = {
          ...newArray[index],
          [subIndex]: value
        };
      } else {
        newArray[index] = value;
      }
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field, defaultValue = '') => {
    setEditedData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), defaultValue]
    }));
  };

  const removeArrayItem = (field, index) => {
    setEditedData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addNestedArrayItem = (field, defaultValue = {}) => {
    setEditedData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), defaultValue]
    }));
  };

  const addNestedSubItem = (field, index, subField, defaultValue = '') => {
    setEditedData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = {
        ...newArray[index],
        [subField]: [...(newArray[index][subField] || []), defaultValue]
      };
      return { ...prev, [field]: newArray };
    });
  };

  const removeNestedSubItem = (field, index, subField, subIndex) => {
    setEditedData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = {
        ...newArray[index],
        [subField]: newArray[index][subField].filter((_, i) => i !== subIndex)
      };
      return { ...prev, [field]: newArray };
    });
  };

  const expandAllSections = () => {
    setExpandedSections({
      overview: true,
      itinerary: true,
      hotels: true,
      destinations: true,
      inclusions: true,
      features: true,
      bestFor: true
    });
  };

  const collapseAllSections = () => {
    setExpandedSections({
      overview: false,
      itinerary: false,
      hotels: false,
      destinations: false,
      inclusions: false,
      features: false,
      bestFor: false
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full border-b-2 border-blue-500 animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="mb-2 text-lg font-semibold text-red-600">Package not found</div>
         // Add this at the top of your main content area
<div className="mb-6">
  <button
    onClick={() => window.location.href = '/packages'}
    className="flex gap-2 items-center px-6 py-2 font-medium text-white bg-blue-500 rounded-lg transition hover:bg-blue-600"
  >
    <ArrowLeft size={16} />
    Back to Packages
  </button>
</div>
        </div>
      </div>
    );
  }

  const currentData = isEditing ? editedData : packageData;

  return (
    <div className="p-4 min-h-screen bg-gray-50 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <button
    onClick={() => window.location.href = '/ManagePackage'}
    className="flex gap-2 items-center px-6 py-2 font-medium text-white bg-blue-500 rounded-lg transition hover:bg-blue-600"
  >
    <ArrowLeft size={16} />
    Back to Packages
  </button>
        
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex flex-col gap-4 justify-between mb-6 md:flex-row md:items-center">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={currentData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="px-3 py-2 w-full max-w-md text-2xl font-bold text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900">{currentData.name}</h1>
              )}
              <div className="flex flex-wrap gap-2 items-center mt-2">
                {isEditing ? (
                  <select
                    value={currentData.type || 'Silver'}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="px-3 py-1 text-xs font-semibold bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                ) : (
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    currentData.type === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                    currentData.type === 'Silver' ? 'bg-gray-100 text-gray-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {currentData.type}
                  </span>
                )}
                <span className="text-sm text-gray-600">{currentData.code}</span>
                {isEditing ? (
                  <select
                    value={currentData.status || 'active'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="flex gap-1 items-center px-2 py-1 text-xs bg-gray-50 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                ) : (
                  <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                    currentData.status === 'active' ? 'bg-green-100 text-green-700' : 
                    currentData.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {currentData.status === 'active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {currentData.status === 'active' ? 'Active' : 
                     currentData.status === 'draft' ? 'Draft' : 'Inactive'}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-3 items-start md:flex-row md:items-center">
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleCancel}
                      className="flex gap-2 items-center px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="flex gap-2 items-center px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
                    >
                      <Save size={16} />
                      Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={handleEdit}
                      className="flex gap-2 items-center px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button className="flex gap-2 items-center px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                      <Share2 size={16} />
                      Share
                    </button>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={expandAllSections}
                  className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                >
                  <Maximize2 size={14} />
                  Expand All
                </button>
                <button
                  onClick={collapseAllSections}
                  className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                >
                  <Minimize2 size={14} />
                  Collapse All
                </button>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex gap-2 items-center text-blue-700">
                <DollarSign size={20} />
                {isEditing ? (
                  <input
                    type="number"
                    value={currentData.base_price || ''}
                    onChange={(e) => handleInputChange('base_price', parseFloat(e.target.value) || 0)}
                    className="px-2 py-1 w-28 text-lg font-bold bg-white rounded border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                ) : (
                  <span className="text-lg font-bold">${currentData.base_price}</span>
                )}
              </div>
              <div className="mt-1 text-sm text-gray-600">Base Price</div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex gap-2 items-center text-green-700">
                <Calendar size={20} />
                {isEditing ? (
                  <input
                    type="number"
                    value={currentData.duration_days || ''}
                    onChange={(e) => handleInputChange('duration_days', parseInt(e.target.value) || 1)}
                    className="px-2 py-1 w-20 text-lg font-bold bg-white rounded border border-green-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="1"
                  />
                ) : (
                  <span className="text-lg font-bold">{currentData.duration_days}</span>
                )}
              </div>
              <div className="mt-1 text-sm text-gray-600">Days</div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex gap-2 items-center text-purple-700">
                <Eye size={20} />
                <span className="text-lg font-bold">{currentData.views || 0}</span>
              </div>
              <div className="mt-1 text-sm text-gray-600">Views</div>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg">
              <div className="flex gap-2 items-center text-amber-700">
                <Users size={20} />
                <span className="text-lg font-bold">{currentData.bookings || 0}</span>
              </div>
              <div className="mt-1 text-sm text-gray-600">Bookings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto space-y-4 max-w-4xl">
        {/* Overview Section */}
        <div className="overflow-hidden bg-white rounded-xl shadow-sm">
          <button
            onClick={() => toggleSection('overview')}
            className="flex justify-between items-center p-6 w-full hover:bg-gray-50"
          >
            <div className="flex gap-3 items-center">
              <Globe className="text-blue-500" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
            </div>
            {expandedSections.overview ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {expandedSections.overview && (
            <div className="px-6 pb-6">
              {isEditing ? (
                <textarea
                  value={currentData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="p-3 mb-6 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  placeholder="Package description..."
                />
              ) : (
                <p className="mb-6 text-gray-700">{currentData.description}</p>
              )}
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-medium text-gray-900">Package Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Season:</span>
                        {isEditing ? (
                          <select
                            value={currentData.season || 'All Year'}
                            onChange={(e) => handleInputChange('season', e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                             <option value="All Year">All Year</option>
                      <option value="Nov-April"> (Nov-April)</option>
                      <option value="May-sep"> (May-sep)</option>
                        </select>
                        ) : (
                          <span className="font-medium">{currentData.season || 'All Year'}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Min Travelers:</span>
                        {isEditing ? (
                          <input
                            type="number"
                            value={currentData.min_travelers || 2}
                            onChange={(e) => handleInputChange('min_travelers', parseInt(e.target.value) || 2)}
                            className="border border-gray-300 rounded px-3 py-1.5 w-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="1"
                          />
                        ) : (
                          <span className="font-medium">{currentData.min_travelers || 2}</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Max Travelers:</span>
                        {isEditing ? (
                          <input
                            type="number"
                            value={currentData.max_travelers || 10}
                            onChange={(e) => handleInputChange('max_travelers', parseInt(e.target.value) || 10)}
                            className="border border-gray-300 rounded px-3 py-1.5 w-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="1"
                          />
                        ) : (
                          <span className="font-medium">{currentData.max_travelers || 10}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-2 font-medium text-gray-900">Pricing</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Base Price:</span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={currentData.base_price || ''}
                          onChange={(e) => handleInputChange('base_price', parseFloat(e.target.value) || 0)}
                          className="border border-gray-300 rounded px-3 py-1.5 w-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        <span className="font-medium">${currentData.base_price}</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Min Price:</span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={currentData.min_price || currentData.base_price || ''}
                          onChange={(e) => handleInputChange('min_price', parseFloat(e.target.value) || currentData.base_price || 0)}
                          className="border border-gray-300 rounded px-3 py-1.5 w-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        <span className="font-medium">${currentData.min_price || currentData.base_price}</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Max Price:</span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={currentData.max_price || currentData.base_price || ''}
                          onChange={(e) => handleInputChange('max_price', parseFloat(e.target.value) || currentData.base_price || 0)}
                          className="border border-gray-300 rounded px-3 py-1.5 w-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        <span className="font-medium">${currentData.max_price || currentData.base_price}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="overflow-hidden bg-white rounded-xl shadow-sm">
          <button
            onClick={() => toggleSection('features')}
            className="flex justify-between items-center p-6 w-full hover:bg-gray-50"
          >
            <div className="flex gap-3 items-center">
              <Award className="text-amber-500" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Key Features</h2>
            </div>
            {expandedSections.features ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {expandedSections.features && (
            <div className="px-6 pb-6">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => addArrayItem('features', 'New Feature')}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      <Plus size={14} />
                      Add Feature
                    </button>
                  </div>
                  <div className="space-y-2">
                    {currentData.features && currentData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleNestedArrayChange('features', index, undefined, e.target.value)}
                          className="flex-1 px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          onClick={() => removeArrayItem('features', index)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {currentData.features && currentData.features.length > 0 ? (
                    currentData.features.map((feature, index) => (
                      <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
                        {feature}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No features listed.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Best For Section */}
        <div className="overflow-hidden bg-white rounded-xl shadow-sm">
          <button
            onClick={() => toggleSection('bestFor')}
            className="flex justify-between items-center p-6 w-full hover:bg-gray-50"
          >
            <div className="flex gap-3 items-center">
              <UsersIcon className="text-green-500" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Best For</h2>
            </div>
            {expandedSections.bestFor ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {expandedSections.bestFor && (
            <div className="px-6 pb-6">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <button
                      onClick={() => addArrayItem('bestFor', 'New Audience')}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      <Plus size={14} />
                      Add Audience
                    </button>
                  </div>
                  <div className="space-y-2">
                    {currentData.bestFor && currentData.bestFor.map((audience, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={audience}
                          onChange={(e) => handleNestedArrayChange('bestFor', index, undefined, e.target.value)}
                          className="flex-1 px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <button
                          onClick={() => removeArrayItem('bestFor', index)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {currentData.bestFor && currentData.bestFor.length > 0 ? (
                    currentData.bestFor.map((audience, index) => (
                      <span key={index} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm">
                        {audience}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No target audience specified.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Itinerary Section */}
        <div className="overflow-hidden bg-white rounded-xl shadow-sm">
          <button
            onClick={() => toggleSection('itinerary')}
            className="flex justify-between items-center p-6 w-full hover:bg-gray-50"
          >
            <div className="flex gap-3 items-center">
              <Calendar className="text-green-500" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Itinerary</h2>
            </div>
            {expandedSections.itinerary ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {expandedSections.itinerary && (
            <div className="px-6 pb-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => addNestedArrayItem('itinerary', {
                        day: '',
                        title: '',
                        description: ''
                      })}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      <Plus size={14} />
                      Add Day
                    </button>
                  </div>
                  {currentData.itinerary && currentData.itinerary.map((day, index) => (
                    <div key={index} className="p-4 space-y-3 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-900">Day {index + 1}</h4>
                        <button
                          onClick={() => removeArrayItem('itinerary', index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Day Number</label>
                          <input
                            type="number"
                            value={day.day || ''}
                            onChange={(e) => handleNestedArrayChange('itinerary', index, 'day', e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
                          <input
                            type="text"
                            value={day.title || ''}
                            onChange={(e) => handleNestedArrayChange('itinerary', index, 'title', e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          value={day.description || ''}
                          onChange={(e) => handleNestedArrayChange('itinerary', index, 'description', e.target.value)}
                          rows="2"
                          className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {currentData.itinerary && currentData.itinerary.length > 0 ? (
                    currentData.itinerary.map((day, index) => (
                      <div key={index} className="py-2 pl-4 border-l-2 border-blue-500">
                        <div className="font-semibold text-gray-900">Day {day.day || index + 1}: {day.title}</div>
                        <p className="mt-1 text-sm text-gray-700">{day.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No itinerary available.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hotels Section */}
        <div className="overflow-hidden bg-white rounded-xl shadow-sm">
          <button
            onClick={() => toggleSection('hotels')}
            className="flex justify-between items-center p-6 w-full hover:bg-gray-50"
          >
            <div className="flex gap-3 items-center">
              <Hotel className="text-amber-500" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Hotels</h2>
            </div>
            {expandedSections.hotels ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {expandedSections.hotels && (
            <div className="px-6 pb-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => addNestedArrayItem('hotels', {
                        name: '',
                        rating: 3,
                        nights: 1,
                        features: []
                      })}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                    >
                      <Plus size={14} />
                      Add Hotel
                    </button>
                  </div>
                  {currentData.hotels && currentData.hotels.map((hotel, index) => (
                    <div key={index} className="p-4 space-y-3 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-900">Hotel {index + 1}</h4>
                        <button
                          onClick={() => removeArrayItem('hotels', index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Hotel Name</label>
                          <input
                            type="text"
                            value={hotel.name || ''}
                            onChange={(e) => handleNestedArrayChange('hotels', index, 'name', e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Rating</label>
                          <select
                            value={hotel.rating || 3}
                            onChange={(e) => handleNestedArrayChange('hotels', index, 'rating', parseInt(e.target.value))}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {[1, 2, 3, 4, 5].map(r => (
                              <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Nights</label>
                          <input
                            type="number"
                            value={hotel.nights || 1}
                            onChange={(e) => handleNestedArrayChange('hotels', index, 'nights', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">Features</label>
                          <button
                            onClick={() => addNestedSubItem('hotels', index, 'features', 'New Feature')}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            <Plus size={12} /> Add Feature
                          </button>
                        </div>
                        <div className="space-y-2">
                          {hotel.features && hotel.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) => {
                                  const newFeatures = [...hotel.features];
                                  newFeatures[featureIndex] = e.target.value;
                                  handleNestedArrayChange('hotels', index, 'features', newFeatures);
                                }}
                                className="flex-1 border border-gray-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                              <button
                                onClick={() => removeNestedSubItem('hotels', index, 'features', featureIndex)}
                                className="p-1 text-red-600 hover:text-red-700"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {currentData.hotels && currentData.hotels.length > 0 ? (
                    currentData.hotels.map((hotel, index) => (
                      <div key={index} className="p-4 rounded-lg border">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-gray-900">{hotel.name || hotel.hotel_name}</div>
                            <div className="flex gap-1 items-center mt-1 text-sm text-amber-500">
                              <Star size={14} fill="currentColor" />
                              {hotel.rating}
                            </div>
                          </div>
                          <div className="flex gap-1 items-center text-gray-600">
                            <Bed size={16} />
                            <span className="text-sm">{hotel.nights} Nights</span>
                          </div>
                        </div>
                        {hotel.features && hotel.features.length > 0 && (
                          <div className="mt-3">
                            <div className="text-sm font-medium text-gray-700">Features:</div>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {hotel.features.map((feature, idx) => (
                                <span key={idx} className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No hotel information available.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Destinations Section */}
        <div className="overflow-hidden bg-white rounded-xl shadow-sm">
          <button
            onClick={() => toggleSection('destinations')}
            className="flex justify-between items-center p-6 w-full hover:bg-gray-50"
          >
            <div className="flex gap-3 items-center">
              <MapPin className="text-emerald-500" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Destinations</h2>
            </div>
            {expandedSections.destinations ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {expandedSections.destinations && (
            <div className="px-6 pb-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => addNestedArrayItem('destinations', {
                        name: '',
                        type: '',
                        highlights: []
                      })}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                    >
                      <Plus size={14} />
                      Add Destination
                    </button>
                  </div>
                  {currentData.destinations && currentData.destinations.map((destination, index) => (
                    <div key={index} className="p-4 space-y-3 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-900">Destination {index + 1}</h4>
                        <button
                          onClick={() => removeArrayItem('destinations', index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Destination Name</label>
                          <input
                            type="text"
                            value={destination.name || ''}
                            onChange={(e) => handleNestedArrayChange('destinations', index, 'name', e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Type</label>
                          <select
                            value={destination.type || ''}
                            onChange={(e) => handleNestedArrayChange('destinations', index, 'type', e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Type</option>
                            <option value="City">City</option>
                            <option value="Beach">Beach</option>
                            <option value="Mountain">Mountain</option>
                            <option value="Historical">Historical</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Cultural">Cultural</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">Highlights</label>
                          <button
                            onClick={() => addNestedSubItem('destinations', index, 'highlights', 'New Highlight')}
                            className="text-xs text-emerald-600 hover:text-emerald-700"
                          >
                            <Plus size={12} /> Add Highlight
                          </button>
                        </div>
                        <div className="space-y-2">
                          {destination.highlights && destination.highlights.map((highlight, highlightIndex) => (
                            <div key={highlightIndex} className="flex gap-2 items-center">
                              <input
                                type="text"
                                value={highlight}
                                onChange={(e) => {
                                  const newHighlights = [...destination.highlights];
                                  newHighlights[highlightIndex] = e.target.value;
                                  handleNestedArrayChange('destinations', index, 'highlights', newHighlights);
                                }}
                                className="flex-1 border border-gray-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                              <button
                                onClick={() => removeNestedSubItem('destinations', index, 'highlights', highlightIndex)}
                                className="p-1 text-red-600 hover:text-red-700"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {currentData.destinations && currentData.destinations.length > 0 ? (
                    currentData.destinations.map((dest, index) => (
                      <div key={index} className="p-4 rounded-lg border">
                        <div className="font-semibold text-gray-900">{dest.name || dest.destination_name}</div>
                        <span className="inline-block px-2 py-1 mt-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                          {dest.type || dest.destination_type}
                        </span>
                        {dest.highlights && dest.highlights.length > 0 && (
                          <div className="mt-3">
                            <div className="text-sm font-medium text-gray-700">Highlights:</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {dest.highlights.map((highlight, idx) => (
                                <span key={idx} className="px-2 py-1 text-xs text-amber-700 bg-amber-50 rounded">
                                  {highlight}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No destination information available.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Inclusions/Exclusions Section */}
        <div className="overflow-hidden bg-white rounded-xl shadow-sm">
          <button
            onClick={() => toggleSection('inclusions')}
            className="flex justify-between items-center p-6 w-full hover:bg-gray-50"
          >
            <div className="flex gap-3 items-center">
              <FileText className="text-purple-500" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Inclusions & Exclusions</h2>
            </div>
            {expandedSections.inclusions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {expandedSections.inclusions && (
            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Inclusions */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="flex gap-2 items-center font-medium text-gray-900">
                      <CheckCircle size={16} className="text-green-500" />
                      Included
                    </h3>
                    {isEditing && (
                      <button
                        onClick={() => addArrayItem('inclusions', 'New Inclusion')}
                        className="flex gap-1 items-center text-sm text-green-600 hover:text-green-700"
                      >
                        <Plus size={12} /> Add
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      {currentData.inclusions && currentData.inclusions.map((item, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleNestedArrayChange('inclusions', index, undefined, e.target.value)}
                            className="flex-1 border border-gray-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                          <button
                            onClick={() => removeArrayItem('inclusions', index)}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    currentData.inclusions && currentData.inclusions.length > 0 ? (
                      <ul className="space-y-2">
                        {currentData.inclusions.map((item, index) => (
                          <li key={index} className="flex gap-2 items-start">
                            <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No inclusions listed.</p>
                    )
                  )}
                </div>
                
                {/* Exclusions */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="flex gap-2 items-center font-medium text-gray-900">
                      <XCircle size={16} className="text-red-500" />
                      Excluded
                    </h3>
                    {isEditing && (
                      <button
                        onClick={() => addArrayItem('exclusions', 'New Exclusion')}
                        className="flex gap-1 items-center text-sm text-red-600 hover:text-red-700"
                      >
                        <Plus size={12} /> Add
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      {currentData.exclusions && currentData.exclusions.map((item, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleNestedArrayChange('exclusions', index, undefined, e.target.value)}
                            className="flex-1 border border-gray-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          />
                          <button
                            onClick={() => removeArrayItem('exclusions', index)}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    currentData.exclusions && currentData.exclusions.length > 0 ? (
                      <ul className="space-y-2">
                        {currentData.exclusions.map((item, index) => (
                          <li key={index} className="flex gap-2 items-start">
                            <XCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No exclusions listed.</p>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;