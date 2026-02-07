import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const HotelRequestModal = ({ request, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleClose = async (action) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (action === 'cancel') {
        await axios.patch(
          `${API_BASE_URL}/booking-hotels/${request.id}/cancel`,
          {}
        );
        setSuccess('Request cancelled');
      }

      setTimeout(() => {
        onRefresh?.();
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process action');
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Response' },
      available: { bg: 'bg-green-100', text: 'text-green-800', label: 'Available' },
      unavailable: { bg: 'bg-red-100', text: 'text-red-800', label: 'Unavailable' },
      blocked: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Blocked' }
    };
    return statusMap[status] || statusMap.pending;
  };

  const statusDisplay = getStatusDisplay(request.availability_status || 'pending');
  const nights = Math.ceil((new Date(request.check_out) - new Date(request.check_in)) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Hotel Availability Request</h2>
            <p className="text-sm text-gray-600">Request #{request.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className={`p-4 rounded-lg ${statusDisplay.bg}`}>
            <p className={`font-medium ${statusDisplay.text}`}>
              Status: {statusDisplay.label}
            </p>
          </div>

          {/* Booking Information */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Booking ID</p>
              <p className="text-lg font-semibold text-gray-900">#{request.booking_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Hotel Agent ID</p>
              <p className="text-lg font-semibold text-gray-900">#{request.hotel_agent_id}</p>
            </div>
          </div>

          {/* Room Requirements */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-3">Room Requirements</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Room Type</p>
                <p className="font-medium text-gray-900">{request.room_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Quantity</p>
                <p className="font-medium text-gray-900">{request.rooms_required} rooms</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Guests</p>
                <p className="font-medium text-gray-900">{request.rooms_required * 2}+ guests</p>
              </div>
            </div>
          </div>

          {/* Stay Period */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-3">Stay Period</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Check-in:</span>
                <span className="font-semibold text-gray-900">{request.check_in}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Check-out:</span>
                <span className="font-semibold text-gray-900">{request.check_out}</span>
              </div>
              <div className="pt-2 border-t border-blue-200 flex items-center justify-between">
                <span className="text-gray-700 font-medium">Duration:</span>
                <span className="font-semibold text-gray-900">{nights} nights</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Timeline</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span>Request Created:</span>
                <span className="text-gray-900">{new Date(request.created_at).toLocaleString()}</span>
              </div>
              {request.updated_at && (
                <div className="flex items-center justify-between text-gray-600">
                  <span>Last Updated:</span>
                  <span className="text-gray-900">{new Date(request.updated_at).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {request.notes && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-bold text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{request.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={() => handleClose('cancel')}
            disabled={loading || request.availability_status !== 'pending'}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
          >
            Cancel Request
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelRequestModal;
