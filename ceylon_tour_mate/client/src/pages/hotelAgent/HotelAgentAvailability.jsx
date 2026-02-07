import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HotelAvailabilityResponseModal from '../../components/HotelAvailabilityResponseModal';

const API_BASE_URL = 'http://localhost:5000/api';

const HotelAgentAvailability = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, available, unavailable
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [hotelRooms, setHotelRooms] = useState([]);

  // Fetch hotel availability requests for this agent
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(
        `${API_BASE_URL}/booking-hotels/agent-requests`
      );

      setRequests(response.data?.data || []);
      setFilteredRequests(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch hotel rooms when request is selected
  const fetchHotelRooms = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/hotel-rooms`);
      setHotelRooms(response.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
    }
  };

  useEffect(() => {
    if (selectedRequest) {
      fetchHotelRooms();
    }
  }, [selectedRequest]);

  // Filter requests based on status
  useEffect(() => {
    let filtered = requests;

    if (filterStatus !== 'all') {
      filtered = requests.filter(r => 
        (filterStatus === 'pending' && r.availability_status === 'pending') ||
        (filterStatus === 'available' && r.availability_status === 'available') ||
        (filterStatus === 'unavailable' && r.availability_status === 'unavailable')
      );
    }

    setFilteredRequests(filtered);
  }, [filterStatus, requests]);

  // Handle approval/rejection
  const handleResponse = async (requestId, isAvailable, notes = '') => {
    try {
      setError('');
      setSuccess('');

      const response = await axios.patch(
        `${API_BASE_URL}/booking-hotels/${requestId}/respond-availability`,
        {
          isAvailable,
          notes
        }
      );

      setSuccess(isAvailable ? 'Room availability confirmed!' : 'Room marked as unavailable');
      setSelectedRequest(null);
      
      setTimeout(() => {
        fetchRequests();
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update availability');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      case 'blocked':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusLabel = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Hotel Availability Requests</h1>
          <p className="text-gray-600">Respond to booking requests from tour managers</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { value: 'all', label: 'All Requests', count: requests.length },
              { value: 'pending', label: 'Pending', count: requests.filter(r => r.availability_status === 'pending').length },
              { value: 'available', label: 'Available', count: requests.filter(r => r.availability_status === 'available').length },
              { value: 'unavailable', label: 'Unavailable', count: requests.filter(r => r.availability_status === 'unavailable').length }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilterStatus(tab.value)}
                className={`flex-1 px-6 py-3 font-medium text-center transition ${
                  filterStatus === tab.value
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-sm font-bold bg-gray-200 rounded-full">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading requests...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredRequests.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 mb-4">
              {filterStatus === 'all' 
                ? 'No availability requests yet' 
                : `No ${filterStatus} requests`}
            </p>
            <p className="text-gray-400 text-sm">
              Requests will appear here when tour managers send availability checks
            </p>
          </div>
        )}

        {/* Requests List */}
        {!loading && filteredRequests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map(request => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Request #{request.id}</h3>
                      <p className="text-sm text-gray-600">Booking #{request.booking_id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.availability_status)}`}>
                      {getStatusLabel(request.availability_status)}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide">Room Type</p>
                        <p className="font-medium text-gray-900">{request.room_type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide">Rooms Needed</p>
                        <p className="font-medium text-gray-900">{request.rooms_required}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Stay Period</p>
                      <p className="text-sm text-gray-900">
                        <strong>{request.check_in}</strong> to <strong>{request.check_out}</strong>
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {Math.ceil((new Date(request.check_out) - new Date(request.check_in)) / (1000 * 60 * 60 * 24))} nights
                      </p>
                    </div>

                    {request.created_at && (
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide">Requested</p>
                        <p className="text-sm text-gray-900">{new Date(request.created_at).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  {request.availability_status === 'pending' && (
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
                    >
                      Check Availability
                    </button>
                  )}

                  {request.availability_status !== 'pending' && (
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg transition"
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Response Modal */}
      {selectedRequest && (
        <HotelAvailabilityResponseModal
          request={selectedRequest}
          hotelRooms={hotelRooms}
          onClose={() => setSelectedRequest(null)}
          onResponse={handleResponse}
        />
      )}
    </div>
  );
};

export default HotelAgentAvailability;
