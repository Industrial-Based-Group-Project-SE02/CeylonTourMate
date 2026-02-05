import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function HotelBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('pending');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/booking-hotels`);
      setBookings(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load hotel booking requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    if (filter === 'all') return bookings;
    return bookings.filter((b) => b.availability_status === filter);
  }, [bookings, filter]);

  const updateAvailability = async (id, availabilityStatus) => {
    try {
      setUpdatingId(id);
      await axios.patch(`${API_BASE_URL}/booking-hotels/${id}/availability`, {
        availabilityStatus
      });
      await fetchBookings();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update availability');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Hotel Booking Requests</h1>
          <p className="text-gray-600">Confirm room availability for manager requests</p>
        </div>
        <div className="flex gap-2">
          {['pending', 'available', 'unavailable', 'blocked', 'all'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-2 text-sm font-semibold rounded-lg border ${
                filter === status
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <i className="text-3xl text-orange-600 fas fa-spinner fa-spin"></i>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow">
          No booking requests found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="p-5 bg-white rounded-xl shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800">Booking #{booking.booking_id}</h3>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    booking.availability_status === 'available'
                      ? 'bg-green-100 text-green-700'
                      : booking.availability_status === 'unavailable'
                      ? 'bg-red-100 text-red-700'
                      : booking.availability_status === 'blocked'
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {booking.availability_status}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <div><strong>Room Type:</strong> {booking.room_type}</div>
                <div><strong>Rooms Required:</strong> {booking.rooms_required}</div>
                <div><strong>Check In:</strong> {booking.check_in?.split('T')[0]}</div>
                <div><strong>Check Out:</strong> {booking.check_out?.split('T')[0]}</div>
                <div><strong>Manager Status:</strong> {booking.manager_status}</div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => updateAvailability(booking.id, 'available')}
                  disabled={updatingId === booking.id}
                  className="flex-1 px-3 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-60"
                >
                  Available
                </button>
                <button
                  onClick={() => updateAvailability(booking.id, 'unavailable')}
                  disabled={updatingId === booking.id}
                  className="flex-1 px-3 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60"
                >
                  Unavailable
                </button>
                <button
                  onClick={() => updateAvailability(booking.id, 'blocked')}
                  disabled={updatingId === booking.id}
                  className="flex-1 px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-60"
                >
                  Block
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HotelBookings;
