import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const HotelAvailabilityResponseModal = ({ request, hotelRooms, onClose, onResponse }) => {
  const [isAvailable, setIsAvailable] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityData, setAvailabilityData] = useState(null);

  const nights = Math.ceil((new Date(request.check_out) - new Date(request.check_in)) / (1000 * 60 * 60 * 24));

  // Check availability in the system
  useEffect(() => {
    checkRoomAvailability();
  }, []);

  const checkRoomAvailability = async () => {
    try {
      setCheckingAvailability(true);
      
      const response = await axios.post(
        `${API_BASE_URL}/hotel-rooms/check-dates`,
        {
          roomType: request.room_type,
          startDate: request.check_in,
          endDate: request.check_out,
          roomsNeeded: request.rooms_required
        }
      );

      setAvailabilityData(response.data?.data);
    } catch (err) {
      console.error('Error checking availability:', err);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isAvailable === null) {
      setError('Please select availability status');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await onResponse(request.id, isAvailable, notes);
    } catch (err) {
      setError(err.message || 'Failed to submit response');
    } finally {
      setLoading(false);
    }
  };

  const getDatesList = () => {
    const dates = [];
    const current = new Date(request.check_in);
    const end = new Date(request.check_out);
    
    while (current < end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Check & Respond to Availability</h2>
            <p className="text-sm text-gray-600">Request #{request.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Request Details */}
          <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Room Type</p>
              <p className="font-bold text-gray-900">{request.room_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Rooms Needed</p>
              <p className="font-bold text-gray-900">{request.rooms_required} rooms</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Check-in</p>
              <p className="font-bold text-gray-900">{request.check_in}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Check-out</p>
              <p className="font-bold text-gray-900">{request.check_out}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Duration</p>
              <p className="font-bold text-gray-900">{nights} nights</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Status</p>
              <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                {request.availability_status || 'Pending'}
              </span>
            </div>
          </div>

          {/* Availability Check Results */}
          {checkingAvailability ? (
            <div className="text-center py-4">
              <p className="text-gray-600">Checking room availability...</p>
            </div>
          ) : availabilityData ? (
            <div className={`p-4 rounded-lg ${
              availabilityData.isAvailable 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`font-bold text-lg mb-2 ${
                availabilityData.isAvailable 
                  ? 'text-green-800' 
                  : 'text-red-800'
              }`}>
                {availabilityData.isAvailable 
                  ? '✓ Rooms are available for these dates' 
                  : '✗ Insufficient rooms for this period'}
              </p>
              
              {availabilityData.details && (
                <div className="text-sm mt-3 space-y-1">
                  {availabilityData.details.map((detail, idx) => (
                    <p key={idx} className={availabilityData.isAvailable ? 'text-green-700' : 'text-red-700'}>
                      {detail}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {/* Dates Calendar View */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-3">Booking Dates</h3>
            <div className="bg-gray-50 p-3 rounded max-h-48 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {getDatesList().map(date => (
                  <span key={date} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {new Date(date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Availability Status Selection */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-4">Your Response</h3>

            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition" style={{
                borderColor: isAvailable === true ? '#3b82f6' : '#e5e7eb',
                backgroundColor: isAvailable === true ? '#eff6ff' : 'transparent'
              }}>
                <input
                  type="radio"
                  name="availability"
                  value="available"
                  checked={isAvailable === true}
                  onChange={() => setIsAvailable(true)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="ml-3 flex-1">
                  <span className="font-bold text-gray-900">Room is Available</span>
                  <p className="text-sm text-gray-600">I can confirm availability for these dates</p>
                </span>
                <span className="text-green-600 font-bold">✓</span>
              </label>

              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition" style={{
                borderColor: isAvailable === false ? '#ef4444' : '#e5e7eb',
                backgroundColor: isAvailable === false ? '#fef2f2' : 'transparent'
              }}>
                <input
                  type="radio"
                  name="availability"
                  value="unavailable"
                  checked={isAvailable === false}
                  onChange={() => setIsAvailable(false)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="ml-3 flex-1">
                  <span className="font-bold text-gray-900">Room is Not Available</span>
                  <p className="text-sm text-gray-600">Cannot provide rooms for these dates</p>
                </span>
                <span className="text-red-600 font-bold">✗</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes {isAvailable === false && '(Required)'}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isAvailable === false 
                ? "Explain why the room is not available (e.g., fully booked, maintenance, blocked dates)..." 
                : "Any special notes or conditions for the booking..."}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required={isAvailable === false}
            />
            <p className="text-xs text-gray-600 mt-1">
              {notes.length}/500 characters
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> Your response will be sent to the tour manager. If unavailable, provide clear reasons so they can make alternative arrangements.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || isAvailable === null}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
          >
            {loading ? 'Submitting...' : 'Submit Response'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelAvailabilityResponseModal;
