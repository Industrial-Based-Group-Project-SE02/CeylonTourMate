import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Users, DollarSign, Star, MapPin, 
  CheckCircle2, XCircle, Info, Clock, Award 
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const API_BASE_URL = 'http://localhost:5000/api';

const ViewPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/packages/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('📦 Package response:', response.data);
        const packageData = response.data.package || response.data.data || response.data;
        setPkg(packageData);
        setError('');
      } catch (err) {
        console.error('❌ Error fetching package:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to load package details');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full border-4 border-blue-200 animate-spin border-t-blue-600"></div>
            <p className="text-gray-600">Loading package details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !pkg) {
    return (
      <DashboardLayout>
        <div className="p-6 mx-auto max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="flex gap-2 items-center mb-6 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <div className="p-6 text-red-800 bg-red-50 rounded-lg border border-red-200">
            <p>{error || 'Package not found'}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 mx-auto max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex gap-2 items-center mb-6 font-semibold text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} /> Back
        </button>

        {/* Header */}
        <div className="p-8 mb-6 bg-white rounded-lg shadow-lg">
          <div className="flex flex-col gap-4 justify-between items-start md:flex-row md:items-center">
            <div>
              <div className="flex gap-3 items-center mb-2">
                <h1 className="text-4xl font-bold text-gray-900">{pkg.package_name}</h1>
                <span className="px-4 py-1 text-sm font-semibold text-blue-800 uppercase bg-blue-100 rounded-full">
                  {pkg.category}
                </span>
              </div>
              <p className="text-gray-600">Package Code: {pkg.package_code}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">${pkg.max_price}</p>
              <p className="text-gray-600">Starting price per person</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <Clock className="mb-2 text-blue-500" size={24} />
            <p className="text-sm text-gray-600">Duration</p>
            <p className="text-lg font-bold text-gray-900">
              {pkg.duration_days}D / {pkg.duration_nights}N
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <Star className="mb-2 text-yellow-500" size={24} />
            <p className="text-sm text-gray-600">Hotel Stars</p>
            <p className="text-lg font-bold text-gray-900">{pkg.hotel_stars}⭐</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <Users className="mb-2 text-green-500" size={24} />
            <p className="text-sm text-gray-600">Capacity</p>
            <p className="text-lg font-bold text-gray-900">
              {pkg.min_travelers}-{pkg.max_travelers} pax
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <DollarSign className="mb-2 text-purple-500" size={24} />
            <p className="text-sm text-gray-600">Min Price</p>
            <p className="text-lg font-bold text-gray-900">${pkg.min_price}</p>
          </div>
        </div>

        {/* Description */}
        {pkg.description && (
          <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Overview</h2>
            <p className="leading-relaxed text-gray-700">{pkg.description}</p>
          </div>
        )}

        {/* Inclusions & Exclusions */}
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          {/* Inclusions */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="flex gap-2 items-center mb-4 text-xl font-bold text-gray-900">
              <CheckCircle2 className="text-green-600" size={24} />
              Inclusions
            </h3>
            <ul className="space-y-2">
              {pkg.inclusions
                ?.split('\n')
                .filter((item) => item.trim())
                .map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-gray-700">
                    <CheckCircle2 className="flex-shrink-0 mt-1 text-green-600" size={18} />
                    <span>{item.trim()}</span>
                  </li>
                ))}
            </ul>
          </div>

          {/* Exclusions */}
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="flex gap-2 items-center mb-4 text-xl font-bold text-gray-900">
              <XCircle className="text-red-600" size={24} />
              Exclusions
            </h3>
            <ul className="space-y-2">
              {pkg.exclusions
                ?.split('\n')
                .filter((item) => item.trim())
                .map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-gray-700">
                    <XCircle className="flex-shrink-0 mt-1 text-red-600" size={18} />
                    <span>{item.trim()}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Itinerary */}
        {pkg.itinerary && pkg.itinerary.length > 0 && (
          <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
            <h3 className="flex gap-2 items-center mb-6 text-2xl font-bold text-gray-900">
              <MapPin className="text-red-600" size={24} />
              Daily Itinerary
            </h3>
            <div className="space-y-4">
              {pkg.itinerary.map((day, idx) => (
                <div key={idx} className="pb-4 pl-4 border-l-4 border-blue-600">
                  <h4 className="text-lg font-bold text-gray-900">
                    Day {day.day_number}: {day.title}
                  </h4>
                  <p className="mt-2 text-gray-700">{day.description}</p>
                  {day.activities && day.activities.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-semibold text-gray-800">Activities:</p>
                      <ul className="mt-2 space-y-1">
                        {day.activities.map((activity, aidx) => (
                          <li key={aidx} className="flex gap-2 items-center text-sm text-gray-600">
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            <span>
                              <strong>{activity.time_slot}</strong> - {activity.activity_name}
                              {activity.activity_type && (
                                <span className="ml-2 text-xs text-gray-500">
                                  ({activity.activity_type})
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Details */}
        <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
          <h3 className="mb-4 text-2xl font-bold text-gray-900">Pricing</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Min Price</p>
              <p className="text-2xl font-bold text-blue-600">${pkg.min_price}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Max Price</p>
              <p className="text-2xl font-bold text-blue-600">${pkg.max_price}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Single Supplement</p>
              <p className="text-2xl font-bold text-blue-600">${pkg.single_supplement}</p>
            </div>
          </div>
        </div>

        {/* Validity & Status */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="mb-4 text-xl font-bold text-gray-900">Validity Period</h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-semibold">Valid From:</span>{' '}
                {new Date(pkg.valid_from).toLocaleDateString()}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Valid To:</span>{' '}
                {new Date(pkg.valid_to).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="mb-4 text-xl font-bold text-gray-900">Status</h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-semibold">Package Status:</span>{' '}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    pkg.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {pkg.status?.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        {pkg.terms_conditions && (
          <div className="p-6 mt-6 bg-white rounded-lg shadow-lg">
            <h3 className="mb-4 text-xl font-bold text-gray-900">Terms & Conditions</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{pkg.terms_conditions}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewPackage;
