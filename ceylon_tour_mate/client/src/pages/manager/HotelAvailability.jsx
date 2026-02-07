import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const ROOM_TYPES = ['Single', 'Double', 'Deluxe', 'Suite'];

const addDays = (dateString, days) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

function HotelAvailability() {
  const [bookings, setBookings] = useState([]);
  const [hotelAgents, setHotelAgents] = useState([]);
  const [hotelRequests, setHotelRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);
  const [form, setForm] = useState({
    bookingId: '',
    hotelAgentId: '',
    roomType: 'Single',
    roomsRequired: 1,
    checkIn: '',
    checkOut: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingBookings, pendingHotelBookings, agentResponse, agents] = await Promise.all([
        axios.get(`${API_BASE_URL}/bookings?status=pending`),
        axios.get(`${API_BASE_URL}/bookings?status=pending_hotel`),
        axios.get(`${API_BASE_URL}/booking-hotels`),
        axios.get(`${API_BASE_URL}/hotel-agents`)
      ]);

      const combinedBookings = [...(pendingBookings.data?.data || []), ...(pendingHotelBookings.data?.data || [])];
      setBookings(combinedBookings);
      setHotelRequests(agentResponse.data?.data || []);
      setHotelAgents(agents.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load hotel availability data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const bookingOptions = useMemo(() => {
    return bookings.map((booking) => ({
      id: booking.id,
      label: `#${booking.id} - ${booking.name} (${booking.package})`,
      arrivalDate: booking.arrivalDate,
      travelDays: Number(booking.travelDays || 1)
    }));
  }, [bookings]);

  const handleBookingSelect = (bookingId) => {
    const selected = bookingOptions.find((b) => String(b.id) === bookingId);
    if (!selected) return;
    const checkIn = selected.arrivalDate;
    const checkOut = addDays(selected.arrivalDate, selected.travelDays || 1);
    setForm((prev) => ({
      ...prev,
      bookingId,
      checkIn,
      checkOut
    }));
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setAssigning(true);
      await axios.post(`${API_BASE_URL}/booking-hotels`, {
        bookingId: Number(form.bookingId),
        hotelAgentId: Number(form.hotelAgentId),
        roomType: form.roomType,
        roomsRequired: Number(form.roomsRequired),
        checkIn: form.checkIn,
        checkOut: form.checkOut
      });
      setForm({
        bookingId: '',
        hotelAgentId: '',
        roomType: 'Single',
        roomsRequired: 1,
        checkIn: '',
        checkOut: ''
      });
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create hotel availability request');
    } finally {
      setAssigning(false);
    }
  };

  const handleConfirm = async (id, status) => {
    try {
      setConfirmingId(id);
      await axios.patch(`${API_BASE_URL}/booking-hotels/${id}/confirm`, { status });
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update manager status');
    } finally {
      setConfirmingId(null);
    }
  };

  const pendingAgentResponses = hotelRequests.filter(
    (req) => req.manager_status === 'pending'
  );

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Hotel Availability Workflow</h1>
        <p className="text-gray-600">Assign hotels for new bookings and confirm after availability</p>
      </div>

      {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

      <div className="p-6 bg-white rounded-xl shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Send Availability Request</h2>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <i className="text-2xl text-orange-600 fas fa-spinner fa-spin"></i>
          </div>
        ) : (
          <form onSubmit={handleAssign} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">Booking</label>
              <select
                value={form.bookingId}
                onChange={(e) => {
                  setForm({ ...form, bookingId: e.target.value });
                  handleBookingSelect(e.target.value);
                }}
                className="px-3 py-2 mt-1 w-full rounded-lg border"
                required
              >
                <option value="">Select booking</option>
                {bookingOptions.map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    {booking.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Hotel Agent</label>
              <select
                value={form.hotelAgentId}
                onChange={(e) => setForm({ ...form, hotelAgentId: e.target.value })}
                className="px-3 py-2 mt-1 w-full rounded-lg border"
                required
              >
                <option value="">Select hotel agent</option>
                {hotelAgents.map((agent) => (
                  <option key={agent.hotelAgent.id} value={agent.hotelAgent.id}>
                    {agent.hotelAgent.hotelName} ({agent.firstName} {agent.lastName})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Room Type</label>
              <select
                value={form.roomType}
                onChange={(e) => setForm({ ...form, roomType: e.target.value })}
                className="px-3 py-2 mt-1 w-full rounded-lg border"
              >
                {ROOM_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Rooms Required</label>
              <input
                type="number"
                min="1"
                value={form.roomsRequired}
                onChange={(e) => setForm({ ...form, roomsRequired: e.target.value })}
                className="px-3 py-2 mt-1 w-full rounded-lg border"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Check In</label>
              <input
                type="date"
                value={form.checkIn}
                onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                className="px-3 py-2 mt-1 w-full rounded-lg border"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Check Out</label>
              <input
                type="date"
                value={form.checkOut}
                onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                className="px-3 py-2 mt-1 w-full rounded-lg border"
                required
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={assigning}
                className="px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-60"
              >
                Send Request
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="p-6 bg-white rounded-xl shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Hotel Agent Responses</h2>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <i className="text-2xl text-orange-600 fas fa-spinner fa-spin"></i>
          </div>
        ) : pendingAgentResponses.length === 0 ? (
          <div className="text-gray-500">No pending responses.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pendingAgentResponses.map((req) => (
              <div key={req.id} className="p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800">Booking #{req.booking_id}</h3>
                  <span className="px-2 py-1 text-xs font-semibold bg-gray-100 rounded-full">
                    {req.availability_status}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-700">
                  <div><strong>Room:</strong> {req.room_type}</div>
                  <div><strong>Rooms:</strong> {req.rooms_required}</div>
                  <div><strong>Check In:</strong> {req.check_in?.split('T')[0]}</div>
                  <div><strong>Check Out:</strong> {req.check_out?.split('T')[0]}</div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleConfirm(req.id, 'confirmed')}
                    disabled={confirmingId === req.id}
                    className="flex-1 px-3 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-60"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleConfirm(req.id, 'rejected')}
                    disabled={confirmingId === req.id}
                    className="flex-1 px-3 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HotelAvailability;
