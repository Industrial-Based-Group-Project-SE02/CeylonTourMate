import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const EditPackage = ({ packageData, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Silver',
    season: 'All Year',
    base_price: 0,
    min_price: 0,
    max_price: 0,
    duration_days: 1,
    min_travelers: 2,
    max_travelers: 10,
    description: '',
    status: 'active',
    features: [],
    bestFor: [],
    inclusions: [],
    exclusions: [],
    itinerary: [],
    hotels: [],
    destinations: []
  });

  const [newFeature, setNewFeature] = useState('');
  const [newBestFor, setNewBestFor] = useState('');
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form with package data
  useEffect(() => {
    if (packageData && isOpen) {
      setFormData({
        name: packageData.name || '',
        type: packageData.type || 'Silver',
        season: packageData.season || 'All Year',
        base_price: packageData.base_price || 0,
        min_price: packageData.min_price || packageData.base_price || 0,
        max_price: packageData.max_price || packageData.base_price || 0,
        duration_days: packageData.duration_days || 1,
        min_travelers: packageData.min_travelers || 2,
        max_travelers: packageData.max_travelers || 10,
        description: packageData.description || '',
        status: packageData.status || 'active',
        features: packageData.features || [],
        bestFor: packageData.bestFor || [],
        inclusions: packageData.inclusions || [],
        exclusions: packageData.exclusions || [],
        itinerary: packageData.itinerary?.map(day => ({
          day: day.day_number || day.day || '',
          title: day.title || '',
          description: day.description || ''
        })) || [],
        hotels: packageData.hotels?.map(hotel => ({
          name: hotel.hotel_name || hotel.name || '',
          rating: hotel.rating || 3,
          nights: hotel.nights || 1,
          features: hotel.features || []
        })) || [],
        destinations: packageData.destinations?.map(dest => ({
          name: dest.destination_name || dest.name || '',
          type: dest.destination_type || dest.type || '',
          highlights: dest.highlights || []
        })) || []
      });
    }
  }, [packageData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('_price') || name.includes('_days') || name.includes('travelers') 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleAddArrayItem = (field, value, setValue) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setValue('');
    }
  };

  const handleRemoveArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleAddItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: '', title: '', description: '' }]
    }));
  };

  const handleItineraryChange = (index, field, value) => {
    const updatedItinerary = [...formData.itinerary];
    updatedItinerary[index] = { ...updatedItinerary[index], [field]: value };
    setFormData(prev => ({ ...prev, itinerary: updatedItinerary }));
  };

  const handleRemoveItineraryDay = (index) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index)
    }));
  };

  const handleAddHotel = () => {
    setFormData(prev => ({
      ...prev,
      hotels: [...prev.hotels, { name: '', rating: 3, nights: 1, features: [] }]
    }));
  };

  const handleHotelChange = (index, field, value) => {
    const updatedHotels = [...formData.hotels];
    updatedHotels[index] = { ...updatedHotels[index], [field]: field === 'rating' || field === 'nights' ? parseFloat(value) : value };
    setFormData(prev => ({ ...prev, hotels: updatedHotels }));
  };

  const handleAddHotelFeature = (hotelIndex, feature) => {
    if (feature.trim()) {
      const updatedHotels = [...formData.hotels];
      updatedHotels[hotelIndex].features = [...updatedHotels[hotelIndex].features, feature.trim()];
      setFormData(prev => ({ ...prev, hotels: updatedHotels }));
    }
  };

  const handleRemoveHotelFeature = (hotelIndex, featureIndex) => {
    const updatedHotels = [...formData.hotels];
    updatedHotels[hotelIndex].features = updatedHotels[hotelIndex].features.filter((_, i) => i !== featureIndex);
    setFormData(prev => ({ ...prev, hotels: updatedHotels }));
  };

  const handleRemoveHotel = (index) => {
    setFormData(prev => ({
      ...prev,
      hotels: prev.hotels.filter((_, i) => i !== index)
    }));
  };

  const handleAddDestination = () => {
    setFormData(prev => ({
      ...prev,
      destinations: [...prev.destinations, { name: '', type: '', highlights: [] }]
    }));
  };

  const handleDestinationChange = (index, field, value) => {
    const updatedDestinations = [...formData.destinations];
    updatedDestinations[index] = { ...updatedDestinations[index], [field]: value };
    setFormData(prev => ({ ...prev, destinations: updatedDestinations }));
  };

  const handleAddDestinationHighlight = (destIndex, highlight) => {
    if (highlight.trim()) {
      const updatedDestinations = [...formData.destinations];
      updatedDestinations[destIndex].highlights = [...updatedDestinations[destIndex].highlights, highlight.trim()];
      setFormData(prev => ({ ...prev, destinations: updatedDestinations }));
    }
  };

  const handleRemoveDestinationHighlight = (destIndex, highlightIndex) => {
    const updatedDestinations = [...formData.destinations];
    updatedDestinations[destIndex].highlights = updatedDestinations[destIndex].highlights.filter((_, i) => i !== highlightIndex);
    setFormData(prev => ({ ...prev, destinations: updatedDestinations }));
  };

  const handleRemoveDestination = (index) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.put(
        `${API_BASE_URL}/packages/${packageData.id}`,
        {
          ...formData,
          basePrice: formData.base_price,
          minPrice: formData.min_price,
          maxPrice: formData.max_price,
          durationDays: formData.duration_days,
          minTravelers: formData.min_travelers,
          maxTravelers: formData.max_travelers
        }
      );

      if (response.data.success) {
        onSave(response.data.data);
        onClose();
      }
    } catch (error) {
      console.error('Error updating package:', error);
      setError(error.response?.data?.error || 'Failed to update package');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Edit Package</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6">
          {error && (
            <div className="flex gap-2 items-center p-3 mb-4 text-red-700 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Package Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Package Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Season</label>
                  <select
                    name="season"
                    value={formData.season}
                    onChange={handleInputChange}
                    className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="All Year">All Year</option>
                    <option value="Summer">Summer</option>
                    <option value="Winter">Winter</option>
                    <option value="Spring">Spring</option>
                    <option value="Autumn">Autumn</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Base Price ($) *</label>
                  <input
                    type="number"
                    name="base_price"
                    value={formData.base_price}
                    onChange={handleInputChange}
                    className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Duration (Days) *</label>
                  <input
                    type="number"
                    name="duration_days"
                    value={formData.duration_days}
                    onChange={handleInputChange}
                    className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Min Travelers</label>
                  <input
                    type="number"
                    name="min_travelers"
                    value={formData.min_travelers}
                    onChange={handleInputChange}
                    className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Max Travelers</label>
                  <input
                    type="number"
                    name="max_travelers"
                    value={formData.max_travelers}
                    onChange={handleInputChange}
                    className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Key Features</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => handleAddArrayItem('features', newFeature, setNewFeature)}
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-1 items-center px-3 py-1 text-blue-700 bg-blue-50 rounded-lg">
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem('features', index)}
                      className="text-blue-700 hover:text-blue-900"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Best For */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Best For</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBestFor}
                  onChange={(e) => setNewBestFor(e.target.value)}
                  placeholder="Add target audience"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => handleAddArrayItem('bestFor', newBestFor, setNewBestFor)}
                  className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.bestFor.map((audience, index) => (
                  <div key={index} className="flex gap-1 items-center px-3 py-1 text-green-700 bg-green-50 rounded-lg">
                    {audience}
                    <button
                      type="button"
                      onClick={() => handleRemoveArrayItem('bestFor', index)}
                      className="text-green-700 hover:text-green-900"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Inclusions</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInclusion}
                    onChange={(e) => setNewInclusion(e.target.value)}
                    placeholder="Add inclusion"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddArrayItem('inclusions', newInclusion, setNewInclusion)}
                    className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <ul className="space-y-2">
                  {formData.inclusions.map((item, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveArrayItem('inclusions', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Exclusions</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newExclusion}
                    onChange={(e) => setNewExclusion(e.target.value)}
                    placeholder="Add exclusion"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddArrayItem('exclusions', newExclusion, setNewExclusion)}
                    className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <ul className="space-y-2">
                  {formData.exclusions.map((item, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveArrayItem('exclusions', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Itinerary */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Itinerary</h3>
                <button
                  type="button"
                  onClick={handleAddItineraryDay}
                  className="flex gap-2 items-center px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  <Plus size={16} />
                  Add Day
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.itinerary.map((day, index) => (
                  <div key={index} className="p-4 space-y-3 rounded-lg border">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">Day {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveItineraryDay(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          value={day.title}
                          onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                          className="px-3 py-2 w-full rounded-lg border border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Day Number</label>
                        <input
                          type="number"
                          value={day.day}
                          onChange={(e) => handleItineraryChange(index, 'day', e.target.value)}
                          className="px-3 py-2 w-full rounded-lg border border-gray-300"
                          min="1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={day.description}
                        onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                        rows="2"
                        className="px-3 py-2 w-full rounded-lg border border-gray-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotels */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Hotels</h3>
                <button
                  type="button"
                  onClick={handleAddHotel}
                  className="flex gap-2 items-center px-4 py-2 text-white bg-amber-500 rounded-lg hover:bg-amber-600"
                >
                  <Plus size={16} />
                  Add Hotel
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.hotels.map((hotel, index) => (
                  <div key={index} className="p-4 space-y-3 rounded-lg border">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">Hotel {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveHotel(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Hotel Name</label>
                        <input
                          type="text"
                          value={hotel.name}
                          onChange={(e) => handleHotelChange(index, 'name', e.target.value)}
                          className="px-3 py-2 w-full rounded-lg border border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Rating</label>
                        <select
                          value={hotel.rating}
                          onChange={(e) => handleHotelChange(index, 'rating', e.target.value)}
                          className="px-3 py-2 w-full rounded-lg border border-gray-300"
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
                          value={hotel.nights}
                          onChange={(e) => handleHotelChange(index, 'nights', e.target.value)}
                          className="px-3 py-2 w-full rounded-lg border border-gray-300"
                          min="1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Features</label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add feature"
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddHotelFeature(index, e.target.value);
                                e.target.value = '';
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              const input = e.target.previousSibling;
                              handleAddHotelFeature(index, input.value);
                              input.value = '';
                            }}
                            className="px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {hotel.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex gap-1 items-center px-2 py-1 text-sm text-gray-700 bg-gray-100 rounded">
                              {feature}
                              <button
                                type="button"
                                onClick={() => handleRemoveHotelFeature(index, featureIndex)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destinations */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Destinations</h3>
                <button
                  type="button"
                  onClick={handleAddDestination}
                  className="flex gap-2 items-center px-4 py-2 text-white bg-emerald-500 rounded-lg hover:bg-emerald-600"
                >
                  <Plus size={16} />
                  Add Destination
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.destinations.map((destination, index) => (
                  <div key={index} className="p-4 space-y-3 rounded-lg border">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-900">Destination {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveDestination(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Destination Name</label>
                        <input
                          type="text"
                          value={destination.name}
                          onChange={(e) => handleDestinationChange(index, 'name', e.target.value)}
                          className="px-3 py-2 w-full rounded-lg border border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Type</label>
                        <select
                          value={destination.type}
                          onChange={(e) => handleDestinationChange(index, 'type', e.target.value)}
                          className="px-3 py-2 w-full rounded-lg border border-gray-300"
                        >
                          <option value="">Select Type</option>
                          <option value="City">City</option>
                          <option value="Beach">Beach</option>
                          <option value="Mountain">Mountain</option>
                          <option value="Historical">Historical</option>
                          <option value="Adventure">Adventure</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Highlights</label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add highlight"
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddDestinationHighlight(index, e.target.value);
                                e.target.value = '';
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              const input = e.target.previousSibling;
                              handleAddDestinationHighlight(index, input.value);
                              input.value = '';
                            }}
                            className="px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {destination.highlights.map((highlight, highlightIndex) => (
                            <div key={highlightIndex} className="flex gap-1 items-center px-2 py-1 text-sm text-amber-700 bg-amber-50 rounded">
                              {highlight}
                              <button
                                type="button"
                                onClick={() => handleRemoveDestinationHighlight(index, highlightIndex)}
                                className="text-amber-700 hover:text-amber-900"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 justify-end items-center p-6 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex gap-2 items-center px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-b-2 border-white animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPackage;