import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HotelRequestModal from '../../components/HotelRequestModal';

const API_BASE_URL = 'http://localhost:5000/api';

const HotelAvailabilityCheck = () => {
  const [bookings, setBookings] = useState([]);
  const [hotelAgents, setHotelAgents] = useState([]);
  const [packages, setPackages] = useState([]);
  const [hotelRequests, setHotelRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedModal, setSelectedModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // UI State
  const [step, setStep] = useState(1); // 1: Select Booking, 2: Select Hotel, 3: Review & Send
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at'); // created_at, arrival_date, customer

  // Form states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [roomType, setRoomType] = useState('Double');
  const [roomsRequired, setRoomsRequired] = useState(1);

  const ROOM_TYPES = ['Single', 'Double', 'Deluxe', 'Suite'];

  // Fetch all required data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, agentsRes, packagesRes, requestsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/bookings?status=pending`),
        axios.get(`${API_BASE_URL}/hotel-agents`),
        axios.get(`${API_BASE_URL}/packages`),
        axios.get(`${API_BASE_URL}/booking-hotels`)
      ]);

      setBookings(bookingsRes.data?.data || []);
      setHotelAgents(agentsRes.data || []);
      setPackages(packagesRes.data?.data || []);
      setHotelRequests(requestsRes.data?.data || []);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle sending hotel availability request
  const handleSendRequest = async (e) => {
    e.preventDefault();
    
    if (!selectedBooking || !selectedHotel) {
      setError('Please select a booking and hotel');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const stayDetails = getStayDetails();

      const response = await axios.post(
        `${API_BASE_URL}/booking-hotels/check-availability`,
        {
          bookingId: parseInt(selectedBooking),
          hotelAgentId: parseInt(selectedHotel),
          roomType,
          roomsRequired: parseInt(roomsRequired),
          checkIn: stayDetails.checkIn,
          checkOut: stayDetails.checkOut
        }
      );

      setSuccess('Hotel availability request sent successfully!');
      
      // Reset form
      setTimeout(() => {
        setStep(1);
        setSelectedBooking(null);
        setSelectedHotel(null);
        setRoomType('Double');
        setRoomsRequired(1);
        setSearchTerm('');
        fetchData();
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectHotel = (hotelId) => {
    setSelectedHotel(hotelId);
    setStep(3);
  };

  const getStayDetails = () => {
    if (!selectedBooking) return { checkIn: '', checkOut: '', nights: 0 };
    
    const booking = bookings.find(b => b.id === parseInt(selectedBooking));
    if (!booking) return { checkIn: '', checkOut: '', nights: 0 };

    const checkInDate = booking.arrival_date;
    const travelDays = parseInt(booking.travel_days) || 1;
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + travelDays);
    const checkOutStr = checkOutDate.toISOString().split('T')[0];

    return {
      checkIn: checkInDate,
      checkOut: checkOutStr,
      nights: travelDays
    };
  };

  const getBookingDetails = () => {
    if (!selectedBooking) return null;
    return bookings.find(b => b.id === parseInt(selectedBooking));
  };

  const getPackageInfo = (packageId) => {
    return packages.find(p => p.id === packageId);
  };

  const getHotelDetails = (hotelAgentId) => {
    return hotelAgents.find(h => h.id === hotelAgentId);
  };

  // Filter hotels suitable for package (by hotel stars/type)
  const getSuitableHotels = () => {
    if (!selectedBooking) return [];
    
    const booking = getBookingDetails();
    const packageInfo = getPackageInfo(booking?.package_id);
    
    if (!packageInfo) return hotelAgents;

    // Filter hotels by star rating
    return hotelAgents.filter(hotel => {
      const hotelStarType = hotel.hotel_type; // '3_star', '4_star', '5_star'
      const requiredStars = packageInfo.hotel_stars;
      
      if (hotelStarType === '3_star') return requiredStars === 3;
      if (hotelStarType === '4_star') return requiredStars >= 3;
      if (hotelStarType === '5_star') return requiredStars >= 3;
      
      return true;
    });
  };

  // Filter and sort bookings
  const getFilteredAndSortedBookings = () => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(b =>
        String(b.id).includes(searchTerm) ||
        (b.fullname && b.fullname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (b.email && b.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort
    return filtered.sort((a, b) => {
      if (sortBy === 'created_at') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBy === 'arrival_date') {
        return new Date(a.arrival_date) - new Date(b.arrival_date);
      } else if (sortBy === 'customer') {
        return (a.fullname || '').localeCompare(b.fullname || '');
      }
      return 0;
    });
  };

  const managerRequests = hotelRequests.filter(r => r.manager_status || !r.manager_status);
  const booking = getBookingDetails();
  const packageInfo = getPackageInfo(booking?.package_id);
  const hotel = getHotelDetails(selectedHotel);
  const stayDetails = getStayDetails();
  const suitableHotels = getSuitableHotels();

  const handleSelectBooking = (bookingId) => {
    setSelectedBooking(bookingId);
    setSelectedHotel(null);
    setStep(2);
  };

  const handleBackStep = () => {
    if (step === 2) {
      setSelectedBooking(null);
      setSelectedHotel(null);
      setStep(1);
    } else if (step === 3) {
      setSelectedHotel(null);
      setStep(2);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Hotel Availability Management</h1>
          <p className="text-gray-600">Professional hotel booking request management system</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-start p-4 mb-6 bg-red-50 rounded-lg border-l-4 border-red-500">
            <span className="mr-3 font-bold text-red-600">⚠</span>
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="flex items-start p-4 mb-6 bg-green-50 rounded-lg border-l-4 border-green-500">
            <span className="mr-3 font-bold text-green-600">✓</span>
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Step Indicator */}
          <div className="mb-8 lg:col-span-4">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                {/* Step 1 */}
                <div className="flex flex-1 items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-white ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    1
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">Select Booking</p>
                    <p className="text-sm text-gray-600">Choose a pending booking</p>
                  </div>
                </div>

                {/* Connector Line */}
                <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>

                {/* Step 2 */}
                <div className="flex flex-1 items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-white ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    2
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">Choose Hotel</p>
                    <p className="text-sm text-gray-600">Select suitable hotel</p>
                  </div>
                </div>

                {/* Connector Line */}
                <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>

                {/* Step 3 */}
                <div className="flex flex-1 items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-white ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    3
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">Confirm & Send</p>
                    <p className="text-sm text-gray-600">Review and submit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 1: Select Booking */}
          {step === 1 && (
            <div className="lg:col-span-4">
              <div className="overflow-hidden bg-white rounded-lg shadow-lg">
                {/* Header */}
                <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700">
                  <h2 className="text-2xl font-bold text-white">Step 1: Select a Booking</h2>
                  <p className="mt-1 text-blue-100">Browse and select a pending booking to request hotel availability</p>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Search and Sort */}
                  <div className="flex flex-col gap-4 mb-6 sm:flex-row">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search by booking ID, customer name, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-3 w-full rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="created_at">Latest First</option>
                      <option value="arrival_date">Arrival Date</option>
                      <option value="customer">Customer Name</option>
                    </select>
                  </div>

                  {/* Bookings Table */}
                  {loading ? (
                    <div className="py-12 text-center">
                      <p className="text-gray-600">Loading bookings...</p>
                    </div>
                  ) : getFilteredAndSortedBookings().length === 0 ? (
                    <div className="py-12 text-center bg-gray-50 rounded-lg">
                      <p className="mb-2 text-gray-600">No pending bookings found</p>
                      <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-3 font-semibold text-left text-gray-900">Booking ID</th>
                            <th className="px-6 py-3 font-semibold text-left text-gray-900">Customer</th>
                            <th className="px-6 py-3 font-semibold text-left text-gray-900">Package</th>
                            <th className="px-6 py-3 font-semibold text-left text-gray-900">Check-in</th>
                            <th className="px-6 py-3 font-semibold text-left text-gray-900">Nights</th>
                            <th className="px-6 py-3 font-semibold text-left text-gray-900">Guests</th>
                            <th className="px-6 py-3 font-semibold text-left text-gray-900">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredAndSortedBookings().map((b) => (
                            <tr key={b.id} className="border-b border-gray-200 transition hover:bg-gray-50">
                              <td className="px-6 py-4 font-bold text-blue-600">#{b.id}</td>
                              <td className="px-6 py-4">
                                <div className="font-medium text-gray-900">{b.fullname}</div>
                                <div className="text-sm text-gray-600">{b.email}</div>
                              </td>
                              <td className="px-6 py-4 text-gray-900">{getPackageInfo(b.package_id)?.package_name || 'N/A'}</td>
                              <td className="px-6 py-4 text-gray-900">{new Date(b.arrival_date).toLocaleDateString()}</td>
                              <td className="px-6 py-4">
                                <span className="inline-flex justify-center items-center w-8 h-8 font-semibold text-blue-700 bg-blue-100 rounded-full">
                                  {b.travel_days}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-900">{b.pax}</td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => handleSelectBooking(b.id)}
                                  className="inline-block px-4 py-2 font-medium text-white bg-blue-600 rounded-lg transition hover:bg-blue-700"
                                >
                                  Select
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Select Hotel */}
          {step === 2 && selectedBooking && (
            <div className="lg:col-span-4">
              <div className="overflow-hidden bg-white rounded-lg shadow-lg">
                {/* Header */}
                <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700">
                  <h2 className="text-2xl font-bold text-white">Step 2: Select a Hotel</h2>
                  <p className="mt-1 text-blue-100">Choose a suitable hotel for the booking</p>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Booking Summary */}
                  <div className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <h3 className="mb-4 text-lg font-bold text-gray-900">Booking Summary</h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-sm tracking-wide text-gray-600 uppercase">Booking ID</p>
                        <p className="text-lg font-bold text-blue-600">#{selectedBooking}</p>
                      </div>
                      <div>
                        <p className="text-sm tracking-wide text-gray-600 uppercase">Customer</p>
                        <p className="font-semibold text-gray-900">{booking?.fullname}</p>
                      </div>
                      <div>
                        <p className="text-sm tracking-wide text-gray-600 uppercase">Package</p>
                        <p className="font-semibold text-gray-900">{packageInfo?.package_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm tracking-wide text-gray-600 uppercase">Duration</p>
                        <p className="text-lg font-bold text-blue-600">{stayDetails.nights} Nights</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-4">
                      <div>
                        <p className="text-sm tracking-wide text-gray-600 uppercase">Check-in</p>
                        <p className="font-semibold text-gray-900">{new Date(stayDetails.checkIn).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm tracking-wide text-gray-600 uppercase">Check-out</p>
                        <p className="font-semibold text-gray-900">{new Date(stayDetails.checkOut).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm tracking-wide text-gray-600 uppercase">Hotel Star</p>
                        <p className="font-bold text-yellow-600">{'⭐'.repeat(packageInfo?.hotel_stars || 0)}</p>
                      </div>
                      <div>
                        <p className="text-sm tracking-wide text-gray-600 uppercase">Guests</p>
                        <p className="font-semibold text-gray-900">{booking?.pax}</p>
                      </div>
                    </div>
                  </div>

                  {/* Hotel Selection */}
                  <h3 className="mb-4 text-lg font-bold text-gray-900">Available Hotels ({suitableHotels.length})</h3>

                  {suitableHotels.length === 0 ? (
                    <div className="py-12 text-center bg-gray-50 rounded-lg">
                      <p className="text-gray-600">No suitable hotels found for this package</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {suitableHotels.map((h) => (
                        <div
                          key={h.id}
                          className="p-4 rounded-lg border border-gray-200 transition cursor-pointer hover:shadow-lg hover:border-blue-400"
                          onClick={() => handleSelectHotel(h.id)}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">{h.hotel_name}</h4>
                              <p className="text-sm text-gray-600">{h.location}</p>
                            </div>
                            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                              {h.hotel_type?.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>

                          <p className="mb-3 text-sm text-gray-600 line-clamp-2">{h.description}</p>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                            <div className="flex gap-1 items-center">
                              <span className="text-yellow-500">{'★'.repeat(h.rating || 0)}</span>
                              <span className="text-sm text-gray-600">{h.rating}/5</span>
                            </div>
                            <button className="px-4 py-2 font-medium text-white bg-blue-600 rounded-lg transition hover:bg-blue-700">
                              Select
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Back Button */}
                  <button
                    onClick={handleBackStep}
                    className="px-6 py-2 mt-6 font-medium text-gray-700 rounded-lg border border-gray-300 transition hover:bg-gray-50"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Send */}
          {step === 3 && selectedBooking && selectedHotel && (
            <div className="lg:col-span-4">
              <div className="overflow-hidden bg-white rounded-lg shadow-lg">
                {/* Header */}
                <div className="px-8 py-6 bg-gradient-to-r from-green-600 to-green-700">
                  <h2 className="text-2xl font-bold text-white">Step 3: Review & Send Request</h2>
                  <p className="mt-1 text-green-100">Verify all details before submitting</p>
                </div>

                {/* Content */}
                <div className="p-8">
                  <form onSubmit={handleSendRequest} className="space-y-8">
                    {/* Booking Details - READ ONLY */}
                    <div className="p-6 bg-gray-50 rounded-lg">
                      <h3 className="mb-4 text-lg font-bold text-gray-900">Booking Details (Read-only)</h3>
                      <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                        <div>
                          <p className="mb-1 text-sm tracking-wide text-gray-600 uppercase">Booking ID</p>
                          <p className="text-lg font-bold text-blue-600">#{selectedBooking}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm tracking-wide text-gray-600 uppercase">Customer Name</p>
                          <p className="font-semibold text-gray-900">{booking?.fullname}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm tracking-wide text-gray-600 uppercase">Email</p>
                          <p className="font-semibold text-gray-900">{booking?.email}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm tracking-wide text-gray-600 uppercase">Package</p>
                          <p className="font-semibold text-gray-900">{packageInfo?.package_name}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm tracking-wide text-gray-600 uppercase">Package Category</p>
                          <p className="font-semibold text-gray-900 capitalize">{packageInfo?.category}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm tracking-wide text-gray-600 uppercase">Hotel Star Requirement</p>
                          <p className="font-bold text-yellow-600">{'⭐'.repeat(packageInfo?.hotel_stars || 0)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Stay Details - READ ONLY */}
                    <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="mb-4 text-lg font-bold text-gray-900">Stay Details (Read-only)</h3>
                      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        <div>
                          <p className="mb-1 text-sm tracking-wide text-gray-600 uppercase">Check-in Date</p>
                          <p className="text-lg font-bold text-blue-600">{new Date(stayDetails.checkIn).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm tracking-wide text-gray-600 uppercase">Check-out Date</p>
                          <p className="text-lg font-bold text-blue-600">{new Date(stayDetails.checkOut).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm tracking-wide text-gray-600 uppercase">Number of Nights</p>
                          <p className="text-lg font-bold text-blue-600">{stayDetails.nights}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm tracking-wide text-gray-600 uppercase">Guests</p>
                          <p className="text-lg font-bold text-blue-600">{booking?.pax}</p>
                        </div>
                      </div>
                    </div>

                    {/* Hotel Selection - READ ONLY */}
                    <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
                      <h3 className="mb-4 text-lg font-bold text-gray-900">Hotel Selection (Read-only)</h3>
                      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        <div>
                          <p className="mb-1 text-sm tracking-wide text-gray-600 uppercase">Hotel Name</p>
                          <p className="font-semibold text-gray-900">{hotel?.hotel_name}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm tracking-wide text-gray-600 uppercase">Location</p>
                          <p className="font-semibold text-gray-900">{hotel?.location}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm tracking-wide text-gray-600 uppercase">Hotel Type</p>
                          <p className="font-semibold text-gray-900">{hotel?.hotel_type?.replace('_', ' ').toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm tracking-wide text-gray-600 uppercase">Rating</p>
                          <p className="font-bold text-yellow-600">{'★'.repeat(hotel?.rating || 0)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Room Configuration - EDITABLE */}
                    <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                      <h3 className="mb-4 text-lg font-bold text-gray-900">Room Configuration</h3>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Room Type</label>
                          <select
                            value={roomType}
                            onChange={(e) => setRoomType(e.target.value)}
                            className="px-4 py-3 w-full rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            {ROOM_TYPES.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Rooms Required</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={roomsRequired}
                            onChange={(e) => setRoomsRequired(e.target.value)}
                            className="px-4 py-3 w-full rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={handleBackStep}
                        className="flex-1 px-6 py-3 font-medium text-gray-700 rounded-lg border border-gray-300 transition hover:bg-gray-50"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-6 py-3 text-lg font-bold text-white bg-green-600 rounded-lg transition hover:bg-green-700 disabled:bg-gray-400"
                      >
                        {submitting ? 'Sending...' : '✓ Send Availability Request'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* REQUESTS STATUS - Always Show on Right (when not in steps) */}
          {step === 1 && (
            <div className="lg:col-span-4">
              <div className="overflow-hidden bg-white rounded-lg shadow-lg">
                <div className="px-8 py-6 bg-gradient-to-r from-orange-600 to-orange-700">
                  <h2 className="text-2xl font-bold text-white">Recent Requests</h2>
                  <p className="mt-1 text-orange-100">Track your hotel availability requests</p>
                </div>

                <div className="p-8">
                  {managerRequests.length === 0 ? (
                    <p className="py-8 text-center text-gray-500">No requests yet. Start by selecting a booking above.</p>
                  ) : (
                    <div className="space-y-4">
                      {managerRequests.slice(0, 5).map(request => (
                        <div
                          key={request.id}
                          className="p-4 rounded-lg border border-gray-200 transition hover:shadow-md"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-bold text-gray-900">Request #{request.id}</h3>
                              <p className="text-sm text-gray-600">Booking #{request.booking_id}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              request.availability_status === 'available' ? 'bg-green-100 text-green-800' :
                              request.availability_status === 'unavailable' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {request.availability_status || 'Pending'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                            <div>
                              <p className="text-gray-600">Room Type</p>
                              <p className="font-medium text-gray-900">{request.room_type}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Rooms</p>
                              <p className="font-medium text-gray-900">{request.rooms_required}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Check-in</p>
                              <p className="font-medium text-gray-900">{new Date(request.check_in).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Check-out</p>
                              <p className="font-medium text-gray-900">{new Date(request.check_out).toLocaleDateString()}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => setSelectedModal(request)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            View Details →
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedModal && (
        <HotelRequestModal
          request={selectedModal}
          onClose={() => setSelectedModal(null)}
          onRefresh={fetchData}
        />
      )}
    </div>
  );
};

export default HotelAvailabilityCheck;
