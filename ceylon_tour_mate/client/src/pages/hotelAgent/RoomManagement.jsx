import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const DEFAULT_ROOM_TYPES = ['Single', 'Double', 'Deluxe', 'Suite'];

function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    roomType: '',
    totalRooms: '',
    maxGuests: '',
    pricePerNight: ''
  });
  const [availabilityForm, setAvailabilityForm] = useState({
    roomId: '',
    date: '',
    from: '',
    to: '',
    availableRooms: '',
    status: 'available'
  });
  const [saving, setSaving] = useState(false);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/hotel-rooms`);
      setRooms(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const roomOptions = useMemo(() => {
    if (!rooms.length) return DEFAULT_ROOM_TYPES;
    const unique = new Set([...DEFAULT_ROOM_TYPES, ...rooms.map((r) => r.room_type)]);
    return Array.from(unique);
  }, [rooms]);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setSaving(true);
      await axios.post(`${API_BASE_URL}/hotel-rooms`, {
        roomType: form.roomType,
        totalRooms: Number(form.totalRooms),
        maxGuests: Number(form.maxGuests),
        pricePerNight: Number(form.pricePerNight)
      });
      setForm({ roomType: '', totalRooms: '', maxGuests: '', pricePerNight: '' });
      await fetchRooms();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create room');
    } finally {
      setSaving(false);
    }
  };

  const handleAvailability = async (e) => {
    e.preventDefault();
    setError('');
    if (!availabilityForm.roomId) {
      setError('Select a room before updating availability');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        availableRooms: Number(availabilityForm.availableRooms),
        status: availabilityForm.status
      };
      if (availabilityForm.date) {
        payload.date = availabilityForm.date;
      } else {
        payload.from = availabilityForm.from;
        payload.to = availabilityForm.to;
      }
      await axios.post(`${API_BASE_URL}/hotel-rooms/${availabilityForm.roomId}/availability`, payload);
      setAvailabilityForm({
        roomId: availabilityForm.roomId,
        date: '',
        from: '',
        to: '',
        availableRooms: '',
        status: 'available'
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update availability');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Room Management</h1>
        <p className="text-gray-600">Manage your room types and availability</p>
      </div>

      {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleCreateRoom} className="p-6 bg-white rounded-xl shadow space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Add / Update Room Type</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-gray-700">Room Type</label>
              <input
                value={form.roomType}
                onChange={(e) => setForm({ ...form, roomType: e.target.value })}
                list="roomTypes"
                className="w-full px-3 py-2 mt-1 border rounded-lg"
                placeholder="Single"
                required
              />
              <datalist id="roomTypes">
                {roomOptions.map((type) => (
                  <option key={type} value={type} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Total Rooms</label>
              <input
                type="number"
                min="1"
                value={form.totalRooms}
                onChange={(e) => setForm({ ...form, totalRooms: e.target.value })}
                className="w-full px-3 py-2 mt-1 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Max Guests</label>
              <input
                type="number"
                min="1"
                value={form.maxGuests}
                onChange={(e) => setForm({ ...form, maxGuests: e.target.value })}
                className="w-full px-3 py-2 mt-1 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Price Per Night (USD)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.pricePerNight}
                onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
                className="w-full px-3 py-2 mt-1 border rounded-lg"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-60"
          >
            Save Room Type
          </button>
        </form>

        <form onSubmit={handleAvailability} className="p-6 bg-white rounded-xl shadow space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Set Availability</h2>
          <div>
            <label className="text-sm font-semibold text-gray-700">Room Type</label>
            <select
              value={availabilityForm.roomId}
              onChange={(e) => setAvailabilityForm({ ...availabilityForm, roomId: e.target.value })}
              className="w-full px-3 py-2 mt-1 border rounded-lg"
              required
            >
              <option value="">Select room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.room_type} (Total: {room.total_rooms})
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-gray-700">Single Date (optional)</label>
              <input
                type="date"
                value={availabilityForm.date}
                onChange={(e) =>
                  setAvailabilityForm({
                    ...availabilityForm,
                    date: e.target.value,
                    from: '',
                    to: ''
                  })
                }
                className="w-full px-3 py-2 mt-1 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Available Rooms</label>
              <input
                type="number"
                min="0"
                value={availabilityForm.availableRooms}
                onChange={(e) => setAvailabilityForm({ ...availabilityForm, availableRooms: e.target.value })}
                className="w-full px-3 py-2 mt-1 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">From (range)</label>
              <input
                type="date"
                value={availabilityForm.from}
                onChange={(e) =>
                  setAvailabilityForm({ ...availabilityForm, from: e.target.value, date: '' })
                }
                className="w-full px-3 py-2 mt-1 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">To (range)</label>
              <input
                type="date"
                value={availabilityForm.to}
                onChange={(e) =>
                  setAvailabilityForm({ ...availabilityForm, to: e.target.value, date: '' })
                }
                className="w-full px-3 py-2 mt-1 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Status</label>
              <select
                value={availabilityForm.status}
                onChange={(e) => setAvailabilityForm({ ...availabilityForm, status: e.target.value })}
                className="w-full px-3 py-2 mt-1 border rounded-lg"
              >
                <option value="available">Available</option>
                <option value="fully_booked">Fully Booked</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-60"
          >
            Update Availability
          </button>
        </form>
      </div>

      <div className="p-6 bg-white rounded-xl shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Room Types</h2>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <i className="text-2xl text-orange-600 fas fa-spinner fa-spin"></i>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-gray-500">No rooms configured yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-gray-600">
                <tr>
                  <th className="py-2">Room Type</th>
                  <th className="py-2">Total Rooms</th>
                  <th className="py-2">Max Guests</th>
                  <th className="py-2">Price / Night</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id} className="border-t">
                    <td className="py-2 font-semibold text-gray-800">{room.room_type}</td>
                    <td className="py-2">{room.total_rooms}</td>
                    <td className="py-2">{room.max_guests}</td>
                    <td className="py-2">${room.price_per_night}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomManagement;
