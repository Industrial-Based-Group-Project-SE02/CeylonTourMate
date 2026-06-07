import React, { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CheckCircle,
  Pending,
  Cancel,
  Visibility,
  AssignmentInd,
  Hotel,
  DirectionsCar,
  Add,
  Remove,
  EventAvailable
} from '@mui/icons-material';
import axios from 'axios';
import { format, addDays } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const steps = ['Review Booking', 'Select Hotel & Book Rooms', 'Assign Driver', 'Confirmation'];

// Helper function to parse date strings correctly (avoids UTC timezone issues)
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const dateOnly = dateStr.split('T')[0]; // Get YYYY-MM-DD format
  const [year, month, day] = dateOnly.split('-').map(Number);
  return new Date(year, month - 1, day); // Month is 0-indexed in Date constructor
};

const makeRoomKey = (dateStr, roomType) => `${dateStr}|${roomType}`;

const parseRoomKey = (key) => {
  const [dateStr, ...rest] = key.split('|');
  return { dateStr, roomType: rest.join('|') };
};

const BookingApprovals = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [notice, setNotice] = useState(null);
  const [packageDetails, setPackageDetails] = useState(null);
  const [loadingPackage, setLoadingPackage] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeStep, setActiveStep] = useState(0);
  const [hotels, setHotels] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState({});
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [availability, setAvailability] = useState({});
  const [availableDates, setAvailableDates] = useState([]);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loadingBookingDetails, setLoadingBookingDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBookings(statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    if (!selectedBooking?.package_id) {
      setPackageDetails(null);
      return;
    }
    fetchPackageDetails(selectedBooking.package_id);
  }, [selectedBooking]);

  useEffect(() => {
    if (selectedBooking && activeStep === 1) {
      fetchHotels();
      calculateAvailableDates();
    }
  }, [selectedBooking, activeStep]);

  useEffect(() => {
    if (selectedBooking && selectedHotel && activeStep === 1) {
      fetchHotelRoomTypes();
    }
  }, [selectedHotel, activeStep]);

  useEffect(() => {
    if (selectedBooking && activeStep === 2) {
      fetchAvailableDrivers();
    }
  }, [selectedBooking, activeStep]);

  const fetchBookings = async (status) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/bookings`, {
        params: {
          status: status === 'all' ? '' : status,
          limit: 100
        }
      });
      const data = response.data?.data || [];
      setBookings(data);
      setNotice(null);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setNotice({ severity: 'error', message: 'Failed to load bookings.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchPackageDetails = async (packageId) => {
    try {
      setLoadingPackage(true);
      const response = await axios.get(`${API_BASE_URL}/api/packages/${packageId}`);
      setPackageDetails(response.data?.package || response.data?.data || response.data || null);
    } catch (error) {
      console.error('Error fetching package details:', error);
      setNotice({ severity: 'warning', message: `Could not load package details for package #${packageId}` });
      setPackageDetails(null);
    } finally {
      setLoadingPackage(false);
    }
  };

  const fetchHotels = async () => {
    try {
      if (!selectedBooking) return;
      
      const params = {};
      
      if (packageDetails?.hotel_stars) {
        params.hotel_stars = packageDetails.hotel_stars;
      }
      
      // Extract province from pickup location
      if (selectedBooking.pickup_location) {
        const locationParts = selectedBooking.pickup_location.split(',');
        if (locationParts.length > 1) {
          params.province = locationParts[locationParts.length - 1].trim();
        }
      }

      const response = await axios.get(`${API_BASE_URL}/api/hotels/available`, { params });
      setHotels(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setNotice({ severity: 'error', message: 'Failed to load available hotels.' });
      setHotels([]);
    }
  };

  const fetchHotelRoomTypes = async () => {
    try {
      const startDate = format(parseDate(selectedBooking.arrival_date), 'yyyy-MM-dd');
      const endDate = format(addDays(parseDate(selectedBooking.arrival_date), selectedBooking.travel_days - 1), 'yyyy-MM-dd');
      
      const response = await axios.get(`${API_BASE_URL}/api/hotels/${selectedHotel.id}/rooms`, {
        params: {
          startDate,
          endDate
        }
      });
      
      const rooms = response.data?.data || [];
      setRoomTypes(rooms);
      
      // Build availability map from room data
      const availabilityData = {};
      rooms.forEach(room => {
        if (room.availability && Array.isArray(room.availability)) {
          room.availability.forEach(avail => {
            const dateStr = avail.available_date;
            if (!availabilityData[dateStr]) {
              availabilityData[dateStr] = {};
            }
            availabilityData[dateStr][room.room_type] = avail.available_rooms;
          });
        }
      });
      
      setAvailability(availabilityData);
    } catch (error) {
      console.error('Error fetching hotel rooms:', error);
      setRoomTypes([]);
      setAvailability({});
    }
  };

  const fetchAvailableDrivers = async () => {
    try {
      setDrivers([]);
      
      // Validate booking data before making request
      if (!selectedBooking?.arrival_date || !selectedBooking?.travel_days) {
        console.error('Invalid booking data:', selectedBooking);
        setNotice({ 
          severity: 'error', 
          message: 'Invalid booking data: missing arrival_date or travel_days' 
        });
        return;
      }

      const startDate = selectedBooking.arrival_date;
      const endDate = format(addDays(parseDate(selectedBooking.arrival_date), selectedBooking.travel_days - 1), 'yyyy-MM-dd');

      const params = {
        start_date: startDate,
        end_date: endDate
      };

      if (selectedBooking.vehicle_type) {
        params.vehicle_type = selectedBooking.vehicle_type;
      }

      const province = selectedBooking.pickup_location?.split(', ')[1] || '';
      if (province) {
        params.province = province;
      }

      console.log('🔍 Fetching available drivers with params:', params);
      console.log('API URL:', `${API_BASE_URL}/api/drivers/available`);

      const response = await axios.get(`${API_BASE_URL}/api/drivers/available`, { params });
      
      console.log('✅ Driver fetch response:', response.data);
      
      const driverData = response.data?.data || response.data || [];
      
      if (Array.isArray(driverData) && driverData.length > 0) {
        setDrivers(driverData);
        console.log(`✨ Loaded ${driverData.length} available driver(s)`);
        setNotice({ 
          severity: 'success', 
          message: `Found ${driverData.length} available driver(s) for selected dates` 
        });
      } else {
        setDrivers([]);
        console.warn('⚠️ No drivers found matching criteria');
        setNotice({ 
          severity: 'warning', 
          message: 'No drivers available for the selected dates. Try different dates or vehicle type.' 
        });
      }
    } catch (error) {
      console.error('❌ Error fetching drivers:', error);
      setDrivers([]);
      
      // Detailed error diagnostics
      const status = error.response?.status;
      const errorData = error.response?.data;
      const errorMsg = errorData?.error || error.message;
      
      console.error('Error status:', status);
      console.error('Error response:', errorData);
      console.error('Error message:', errorMsg);
      
      let displayMessage = `Error: ${errorMsg}`;
      
      if (status === 400) {
        displayMessage = `Invalid request: ${errorMsg}`;
      } else if (status === 500) {
        displayMessage = `Server error: ${errorMsg}. Check server logs.`;
      } else if (error.message === 'Network Error' || !error.response) {
        displayMessage = 'Network error: Cannot connect to server. Is the backend running?';
      }
      
      setNotice({ 
        severity: 'error', 
        message: displayMessage
      });
    }
  };

  const calculateAvailableDates = () => {
    if (!selectedBooking?.arrival_date || !selectedBooking?.travel_days) return;
    
    const dates = [];
    const startDate = parseDate(selectedBooking.arrival_date);
    if (!startDate) return;
    
    const days = parseInt(selectedBooking.travel_days);
    
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      dates.push(currentDate);
    }
    
    setAvailableDates(dates);
  };

  const handleSelectBooking = (booking) => {
    setSelectedBooking(booking);
    setActiveStep(0);
    setSelectedHotel(null);
    setSelectedRooms({});
    setSelectedDriver(null);
    setRoomTypes([]);
    setAvailability({});
    setNotice(null);
    setBookingDetails(null);
    setIsSubmitting(false);
  };

  const fetchBookingDetails = async (bookingId) => {
    try {
      setLoadingBookingDetails(true);
      const response = await axios.get(`${API_BASE_URL}/api/bookings/${bookingId}`);
      setBookingDetails(response.data?.data || null);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setBookingDetails(null);
    } finally {
      setLoadingBookingDetails(false);
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleFinalApproval();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleBackToList = () => {
    setSelectedBooking(null);
    setActiveStep(0);
    setSelectedHotel(null);
    setSelectedRooms({});
    setSelectedDriver(null);
    setPackageDetails(null);
    setIsSubmitting(false);
  };

  const handleHotelSelect = (hotel) => {
    setSelectedHotel(hotel);
    setSelectedRooms({}); // Reset room selections
  };

  const handleRoomChange = (date, roomType, change) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setSelectedRooms(prev => {
      const newRooms = { ...prev };
      const key = makeRoomKey(dateStr, roomType);
      const current = newRooms[key] || 0;
      const available = availability[dateStr]?.[roomType] || 0;
      
      const newCount = Math.max(0, Math.min(current + change, available));
      
      if (newCount === 0) {
        delete newRooms[key];
      } else {
        newRooms[key] = newCount;
      }
      
      return newRooms;
    });
  };

  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver);
  };

  const handleBookHotel = async () => {
    // Prevent double submission
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Validate room selections
      if (Object.keys(selectedRooms).length === 0) {
        setNotice({ severity: 'warning', message: 'Please select at least one room.' });
        setIsSubmitting(false);
        return;
      }

      const roomBookings = [];
      Object.entries(selectedRooms).forEach(([key, count]) => {
        const { dateStr, roomType } = parseRoomKey(key);
        if (count > 0) {
          roomBookings.push({ date: dateStr, roomType, count });
        }
      });

      const response = await axios.post(`${API_BASE_URL}/api/bookings/book-hotel`, {
        bookingId: selectedBooking.id,
        hotelId: selectedHotel.id,
        rooms: roomBookings
      });

      if (response.data.success) {
        setNotice({ severity: 'success', message: 'Hotel rooms booked successfully!' });
        setIsSubmitting(false);
        handleNext();
      }
    } catch (error) {
      const serverMessage = error.response?.data?.error || error.response?.data?.details;
      console.error('Error booking hotel:', error.response?.data || error);
      setNotice({
        severity: 'error',
        message: serverMessage ? `Failed to book hotel rooms: ${serverMessage}` : 'Failed to book hotel rooms.'
      });
      setIsSubmitting(false);
    }
  };

  const handleAssignDriver = async () => {
    // Prevent double submission
    if (isSubmitting) return;

    // Validate driver selection
    if (!selectedDriver) {
      setNotice({ severity: 'warning', message: 'Please select a driver.' });
      return;
    }

    if (!selectedDriver.id) {
      setNotice({ severity: 'error', message: 'Invalid driver data: missing driver ID.' });
      console.error('Invalid driver data:', selectedDriver);
      return;
    }

    try {
      setIsSubmitting(true);

      const assignmentData = {
        bookingId: selectedBooking.id,
        driverId: selectedDriver.id,
        startDate: selectedBooking.arrival_date,
        endDate: format(addDays(parseDate(selectedBooking.arrival_date), selectedBooking.travel_days - 1), 'yyyy-MM-dd')
      };

      console.log('Assigning driver with data:', assignmentData);

      const response = await axios.post(`${API_BASE_URL}/api/bookings/assign-driver`, assignmentData);

      if (response.data.success) {
        setNotice({ 
          severity: 'success', 
          message: `Driver ${selectedDriver.user?.first_name} ${selectedDriver.user?.last_name} assigned successfully!` 
        });
        setIsSubmitting(false);
        handleNext();
      } else {
        setNotice({ 
          severity: 'error', 
          message: response.data.error || 'Failed to assign driver.' 
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error assigning driver:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to assign driver.';
      const conflictInfo = error.response?.data?.conflicts?.length > 0 
        ? ` (Conflicts found on ${error.response.data.conflicts.map(c => c.available_date).join(', ')})` 
        : '';
      
      setNotice({ 
        severity: 'error', 
        message: errorMessage + conflictInfo 
      });
      setIsSubmitting(false);
    }
  };

  const handleFinalApproval = async () => {
    // Prevent double submission
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      await axios.patch(`${API_BASE_URL}/api/bookings/${selectedBooking.id}/status`, {
        status: 'confirmed'
      });
      setNotice({ severity: 'success', message: 'Booking approved successfully!' });
      await fetchBookings(statusFilter);
      setIsSubmitting(false);
      handleBackToList();
    } catch (error) {
      console.error('Error approving booking:', error);
      setNotice({ severity: 'error', message: 'Failed to approve booking.' });
      setIsSubmitting(false);
    }
  };

  const handleRejectBooking = async () => {
    try {
      await axios.patch(`${API_BASE_URL}/api/bookings/${selectedBooking.id}/status`, {
        status: 'cancelled'
      });
      setNotice({ severity: 'success', message: 'Booking rejected successfully!' });
      await fetchBookings(statusFilter);
      handleBackToList();
    } catch (error) {
      console.error('Error rejecting booking:', error);
      setNotice({ severity: 'error', message: 'Failed to reject booking.' });
    }
  };

  const getStatusChip = (status = 'pending') => {
    const statusConfig = {
      pending: { color: 'warning', icon: <Pending /> },
      confirmed: { color: 'success', icon: <CheckCircle /> },
      cancelled: { color: 'error', icon: <Cancel /> },
      completed: { color: 'info', icon: <CheckCircle /> }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Chip
        icon={config.icon}
        label={status.toUpperCase()}
        color={config.color}
        size="small"
      />
    );
  };

  const paymentSlipUrl = useMemo(() => {
    if (!selectedBooking?.payment_slip_path) return null;
    if (selectedBooking.payment_slip_path.startsWith('http')) {
      return selectedBooking.payment_slip_path;
    }
    return `${API_BASE_URL}${selectedBooking.payment_slip_path}`;
  }, [selectedBooking]);

  const getAvailableRoomsCount = (date, roomType) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return availability[dateStr]?.[roomType] || 0;
  };

  const getSelectedRoomsCount = (date, roomType) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const key = makeRoomKey(dateStr, roomType);
    return selectedRooms[key] || 0;
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <BookingDetails
            booking={selectedBooking}
            packageDetails={packageDetails}
            loadingPackage={loadingPackage}
            onShowDetails={() => setDetailsDialogOpen(true)}
            getStatusChip={getStatusChip}
          />
        );
      case 1:
        return (
          <HotelSelectionStep
            hotels={hotels}
            selectedHotel={selectedHotel}
            roomTypes={roomTypes}
            availability={availability}
            availableDates={availableDates}
            selectedRooms={selectedRooms}
            onHotelSelect={handleHotelSelect}
            onRoomChange={handleRoomChange}
            getAvailableRoomsCount={getAvailableRoomsCount}
            getSelectedRoomsCount={getSelectedRoomsCount}
            booking={selectedBooking}
            packageDetails={packageDetails}
            setSelectedRooms={setSelectedRooms}
          />
        );
      case 2:
        return (
          <DriverAssignmentStep
            drivers={drivers}
            selectedDriver={selectedDriver}
            onDriverSelect={handleDriverSelect}
            booking={selectedBooking}
          />
        );
      case 3:
        return (
          <ConfirmationStep
            booking={selectedBooking}
            selectedHotel={selectedHotel}
            selectedDriver={selectedDriver}
            selectedRooms={selectedRooms}
            roomTypes={roomTypes}
            availableDates={availableDates}
            packageDetails={packageDetails}
            getSelectedRoomsCount={getSelectedRoomsCount}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Booking Approvals
      </Typography>

      {notice && (
        <Alert severity={notice.severity} sx={{ mb: 3 }}>
          {notice.message}
        </Alert>
      )}

      {!selectedBooking ? (
        <>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map((status) => (
              <Chip
                key={status}
                label={status.toUpperCase()}
                clickable
                color={statusFilter === status ? 'primary' : 'default'}
                onClick={() => setStatusFilter(status)}
                size="small"
              />
            ))}
          </Box>
          <Typography variant="h6" gutterBottom>
            {statusFilter === 'all' ? 'All Bookings' : `${statusFilter[0].toUpperCase()}${statusFilter.slice(1)} Bookings`} ({bookings.length})
          </Typography>
          <Grid container spacing={3}>
            {bookings.map((booking) => (
              <Grid item xs={12} md={6} lg={4} key={booking.id}>
                <BookingCard
                  booking={booking}
                  onSelect={() => handleSelectBooking(booking)}
                  onViewDetails={() => {
                    setSelectedBooking(booking);
                    setDetailsDialogOpen(true);
                    fetchBookingDetails(booking.id);
                  }}
                />
              </Grid>
            ))}
            {bookings.length === 0 && (
              <Grid item xs={12}>
                <Alert severity="info">
                  No bookings found for the selected status
                </Alert>
              </Grid>
            )}
          </Grid>
        </>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 2 }}>
            {renderStepContent(activeStep)}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button onClick={activeStep === 0 ? handleBackToList : handleBack}>
              {activeStep === 0 ? 'Back to list' : 'Back'}
            </Button>
            <Box>
              {activeStep === 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleRejectBooking}
                  sx={{ mr: 2 }}
                >
                  Reject Booking
                </Button>
              )}
              
              <Button
                variant="contained"
                onClick={activeStep === 1 ? handleBookHotel : 
                       activeStep === 2 ? handleAssignDriver : 
                       activeStep === 3 ? handleFinalApproval : handleNext}
                disabled={
                  isSubmitting ||
                  (activeStep === 1 && (!selectedHotel || Object.keys(selectedRooms).length === 0)) ||
                  (activeStep === 2 && !selectedDriver)
                }
              >
                {isSubmitting ? 'Processing...' : (
                  activeStep === steps.length - 1 ? 'Approve Booking' : 
                  activeStep === 1 ? 'Book Hotel & Continue' :
                  activeStep === 2 ? 'Assign Driver & Continue' : 'Continue'
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      <BookingDetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        booking={selectedBooking}
        bookingDetails={bookingDetails}
        loadingBookingDetails={loadingBookingDetails}
        packageDetails={packageDetails}
        paymentSlipUrl={paymentSlipUrl}
        getStatusChip={getStatusChip}
      />
    </Container>
  );
};

// Sub-components
const BookingCard = ({ booking, onSelect, onViewDetails }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Booking #{booking.id}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          {booking.fullname} • {booking.email}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Package: {booking.package_name || 'Custom Package'}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Arrival: {format(parseDate(booking.arrival_date), 'MMM dd, yyyy')}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Duration: {booking.travel_days} days
        </Typography>
        <Typography variant="body2" gutterBottom>
          Pax: {booking.pax} travelers
        </Typography>
        <Chip
          label={booking.vehicle_type || 'Vehicle not specified'}
          size="small"
          sx={{ mt: 1 }}
        />
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onViewDetails} startIcon={<Visibility />}>
          View Details
        </Button>
        {booking.status === 'pending' && (
          <Button
            size="small"
            variant="contained"
            onClick={onSelect}
            startIcon={<AssignmentInd />}
          >
            Process Approval
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

const BookingDetails = ({ booking, packageDetails, loadingPackage, onShowDetails, getStatusChip }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Booking #{booking.id}</Typography>
        <Button onClick={onShowDetails} startIcon={<Visibility />}>
          View Full Details
        </Button>
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="textSecondary">Customer Information</Typography>
          <Typography>{booking.fullname}</Typography>
          <Typography color="textSecondary">{booking.email}</Typography>
          <Typography color="textSecondary">{booking.phone}</Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="textSecondary">Travel Information</Typography>
          <Typography>Arrival: {format(parseDate(booking.arrival_date), 'MMM dd, yyyy')}</Typography>
          <Typography>Duration: {booking.travel_days} days</Typography>
          <Typography>Travelers: {booking.pax}</Typography>
          <Typography>Vehicle: {booking.vehicle_type || 'Not specified'}</Typography>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 2 }} />
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="textSecondary">Package</Typography>
          {loadingPackage ? (
            <Typography color="textSecondary">Loading package...</Typography>
          ) : (
            <Typography>{packageDetails?.package_name || booking.package_name || 'Custom Package'}</Typography>
          )}
          {packageDetails?.hotel_stars && (
            <Typography color="textSecondary">Hotel Stars: {packageDetails.hotel_stars}</Typography>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="textSecondary">Status</Typography>
          <Box sx={{ mt: 0.5 }}>{getStatusChip(booking.status)}</Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" color="textSecondary">Notes</Typography>
      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
        {booking.notes || 'No additional notes'}
      </Typography>
    </Box>
  );
};

// Enhanced HotelSelectionStep Component
const HotelSelectionStep = ({ 
  hotels, 
  selectedHotel, 
  roomTypes, 
  availability, 
  availableDates, 
  selectedRooms, 
  onHotelSelect, 
  onRoomChange,
  getAvailableRoomsCount,
  getSelectedRoomsCount,
  booking,
  packageDetails,
  setSelectedRooms 
}) => {
  const requiredHotelStars = packageDetails?.hotel_stars || 3;
  const requiredRooms = Math.ceil(parseInt(booking.pax) / 2);
  
  // Calculate total selected rooms per day
  const calculateDailyTotals = () => {
    const totals = {};
    availableDates.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      let total = 0;
      roomTypes.forEach(room => {
        const key = makeRoomKey(dateStr, room.room_type);
        total += selectedRooms[key] || 0;
      });
      totals[dateStr] = total;
    });
    return totals;
  };

  const dailyTotals = calculateDailyTotals();

  // Calculate total cost
  const calculateTotalCost = () => {
    let total = 0;
    Object.entries(selectedRooms).forEach(([key, count]) => {
      const { roomType } = parseRoomKey(key);
      const room = roomTypes.find(r => r.room_type === roomType);
      if (room) {
        // Find which dates this room type is booked for
        availableDates.forEach(date => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const roomKey = makeRoomKey(dateStr, roomType);
          if (selectedRooms[roomKey]) {
            total += room.price_per_night * selectedRooms[roomKey];
          }
        });
      }
    });
    return total;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step 1: Select Hotel & Book Rooms
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Requirements:</strong> {requiredHotelStars}-star hotel • {booking.pax} travelers • {booking.travel_days} nights
        </Typography>
        <Typography variant="body2">
          <strong>Minimum rooms needed:</strong> {requiredRooms} rooms ({Math.ceil(requiredRooms * 2)} beds)
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Hotel Selection */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 3, bgcolor: '#f8f9fa' }}>
            <Typography variant="subtitle1" gutterBottom>
              📋 Hotel Requirements
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Hotel Stars:</Typography>
              <Chip label={requiredHotelStars} size="small" color="primary" />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Travelers:</Typography>
              <Typography variant="body2" fontWeight="bold">{booking.pax}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Nights:</Typography>
              <Typography variant="body2" fontWeight="bold">{booking.travel_days}</Typography>
            </Box>
          </Paper>

          <Typography variant="subtitle1" gutterBottom>
            Available Hotels ({hotels.length})
          </Typography>
          
          {hotels.length === 0 ? (
            <Alert severity="warning">
              No hotels available matching the requirements.
            </Alert>
          ) : (
            <Box sx={{ maxHeight: '500px', overflowY: 'auto', pr: 1 }}>
              {hotels.map((hotel) => (
                <Card
                  key={hotel.id}
                  sx={{
                    mb: 2,
                    border: selectedHotel?.id === hotel.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    cursor: 'pointer',
                    '&:hover': { borderColor: '#1976d2' },
                    transition: 'border-color 0.2s'
                  }}
                  onClick={() => onHotelSelect(hotel)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Hotel color={selectedHotel?.id === hotel.id ? "primary" : "action"} />
                      <Typography variant="h6" sx={{ flexGrow: 1, fontSize: '1rem' }}>
                        {hotel.hotel_name}
                      </Typography>
                      {selectedHotel?.id === hotel.id && (
                        <CheckCircle color="success" fontSize="small" />
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        📍 {hotel.district}, {hotel.province}
                      </Typography>
                    </Box>
                    
                    {hotel.description && (
                      <Typography variant="body2" color="textSecondary" sx={{ 
                        mt: 1, 
                        fontSize: '0.875rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {hotel.description}
                      </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.5 }}>
                      <Chip 
                        label={`${hotel.rating || 'N/A'} ⭐`} 
                        size="small" 
                        color="primary"
                        variant={selectedHotel?.id === hotel.id ? "filled" : "outlined"}
                      />
                      <Chip 
                        label={hotel.hotel_type} 
                        size="small" 
                        variant="outlined"
                      />
                      {hotel.registration_number && (
                        <Tooltip title="Registration Number">
                          <Chip 
                            label={`REG: ${hotel.registration_number.substring(0, 8)}...`} 
                            size="small" 
                            variant="outlined"
                          />
                        </Tooltip>
                      )}
                    </Box>
                    
                    {hotel.contact_person && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
                          👤 {hotel.contact_person}
                        </Typography>
                      </Box>
                    )}
                    
                    {hotel.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
                          📞 {hotel.phone}
                        </Typography>
                      </Box>
                    )}
                    
                    {hotel.destinations && hotel.destinations.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                          🗺️ Covered Destinations:
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {Array.isArray(hotel.destinations) ? hotel.destinations.slice(0, 3).join(', ') : hotel.destinations}
                          {Array.isArray(hotel.destinations) && hotel.destinations.length > 3 && '...'}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Grid>

        {/* Room Selection & Booking */}
        <Grid item xs={12} md={8}>
          {selectedHotel ? (
            <>
              {/* Selected Hotel Header */}
              <Paper sx={{ p: 2, mb: 3, bgcolor: '#e3f2fd' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Hotel color="primary" />
                      {selectedHotel.hotel_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      📍 {selectedHotel.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label={`${selectedHotel.rating || 'N/A'} ⭐`} 
                      color="primary" 
                      size="medium"
                    />
                    <Chip 
                      label={selectedHotel.hotel_type} 
                      variant="outlined"
                      size="medium"
                    />
                  </Box>
                </Box>
              </Paper>

              {roomTypes.length === 0 ? (
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography>Loading room types and availability...</Typography>
                </Alert>
              ) : (
                <>
                  {/* Room Types Summary */}
                  <Paper sx={{ p: 3, mb: 3, bgcolor: '#f9f9f9' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                      📋 Available Room Types ({roomTypes.length})
                    </Typography>
                    <Grid container spacing={2}>
                      {roomTypes.map((room) => {
                        const firstAvailability = room.availability?.[0];
                        const availableCount = firstAvailability?.available_rooms || 0;
                        const totalAvailable = availableCount;
                        
                        return (
                          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={room.id}>
                            <Card 
                              sx={{ 
                                height: '100%',
                                border: '2px solid #e0e0e0',
                                '&:hover': { 
                                  boxShadow: 3,
                                  borderColor: '#1976d2'
                                },
                                transition: 'all 0.3s ease'
                              }}
                            >
                              <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {room.room_type}
                                  </Typography>
                                  <Chip 
                                    label={totalAvailable > 0 ? `${totalAvailable} Available` : 'Full'} 
                                    color={totalAvailable > 0 ? "success" : "error"}
                                    size="small"
                                  />
                                </Box>
                                
                                <Divider sx={{ my: 1 }} />
                                
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                  👥 <strong>Max Guests:</strong> {room.max_guests}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                  🏠 <strong>Total Rooms:</strong> {room.total_rooms}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  💰 <strong>Price:</strong> <span style={{ color: '#d32f2f', fontSize: '1.1em', fontWeight: 'bold' }}>${room.price_per_night}</span>/night
                                </Typography>
                                
                                {room.availability && room.availability.length > 0 && (
                                  <Box sx={{ bgcolor: '#e8f5e9', p: 1, borderRadius: 1, mt: 1 }}>
                                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold', color: '#2e7d32' }}>
                                      Dates Available: {room.availability.length}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                      {firstAvailability?.available_date && (
                                        <>From {format(new Date(firstAvailability.available_date), 'MMM dd')} onwards</>
                                      )}
                                    </Typography>
                                  </Box>
                                )}
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Paper>

                  {/* Room Booking Grid */}
                  <Paper sx={{ p: 2, mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Book Rooms for Each Night
                    </Typography>
                    
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Night #</TableCell>
                            {roomTypes.map((room) => (
                              <TableCell key={room.id} align="center" sx={{ fontWeight: 'bold' }}>
                                <Box>
                                  <Typography variant="subtitle2">{room.room_type}</Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    ${room.price_per_night}
                                  </Typography>
                                </Box>
                              </TableCell>
                            ))}
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Daily Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {availableDates.map((date, index) => {
                            const dateStr = format(date, 'yyyy-MM-dd');
                            const dayTotal = dailyTotals[dateStr] || 0;
                            
                            return (
                              <TableRow 
                                key={dateStr}
                                sx={{ 
                                  bgcolor: dayTotal >= requiredRooms ? '#e8f5e9' : '#fff3e0',
                                  '&:hover': { bgcolor: '#f5f5f5' }
                                }}
                              >
                                <TableCell>
                                  <Typography variant="body2" fontWeight="medium">
                                    {format(date, 'MMM dd, yyyy')}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip 
                                    label={`Night ${index + 1}`} 
                                    size="small" 
                                    color={dayTotal >= requiredRooms ? "success" : "warning"}
                                  />
                                </TableCell>
                                
                                {roomTypes.map((room) => {
                                  const available = getAvailableRoomsCount(date, room.room_type);
                                  const selected = getSelectedRoomsCount(date, room.room_type);
                                  const isAvailable = available > 0;
                                  
                                  return (
                                    <TableCell key={room.id} align="center">
                                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <IconButton 
                                            size="small" 
                                            onClick={() => onRoomChange(date, room.room_type, -1)}
                                            disabled={selected === 0}
                                            sx={{ 
                                              width: 28, 
                                              height: 28,
                                              bgcolor: selected > 0 ? '#e3f2fd' : 'transparent'
                                            }}
                                          >
                                            <Remove fontSize="small" />
                                          </IconButton>
                                          <Typography 
                                            variant="h6" 
                                            sx={{ 
                                              minWidth: '40px',
                                              color: selected > 0 ? '#1976d2' : (!isAvailable ? 'text.disabled' : 'inherit'),
                                              fontWeight: selected > 0 ? 'bold' : 'normal'
                                            }}
                                          >
                                            {selected}
                                          </Typography>
                                          <IconButton 
                                            size="small" 
                                            onClick={() => onRoomChange(date, room.room_type, 1)}
                                            disabled={!isAvailable || selected >= available}
                                            sx={{ 
                                              width: 28, 
                                              height: 28,
                                              bgcolor: isAvailable ? '#e8f5e9' : 'transparent'
                                            }}
                                          >
                                            <Add fontSize="small" />
                                          </IconButton>
                                        </Box>
                                        <Typography 
                                          variant="caption" 
                                          color={isAvailable ? "text.secondary" : "error"}
                                          sx={{ fontSize: '0.7rem' }}
                                        >
                                          {isAvailable ? `${available} left` : 'Sold out'}
                                        </Typography>
                                      </Box>
                                    </TableCell>
                                  );
                                })}
                                
                                <TableCell align="center">
                                  <Typography 
                                    variant="h6" 
                                    color={dayTotal >= requiredRooms ? "success.main" : "warning.main"}
                                    sx={{ fontWeight: 'bold' }}
                                  >
                                    {dayTotal}
                                  </Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    of {requiredRooms} needed
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    
                    {/* Booking Summary */}
                    {Object.keys(selectedRooms).length > 0 && (
                      <Paper sx={{ p: 2, mt: 3, bgcolor: '#f8f9fa' }}>
                        <Typography variant="subtitle1" gutterBottom>
                          📊 Booking Summary
                        </Typography>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" gutterBottom>
                              Room Details
                            </Typography>
                            {roomTypes.map(room => {
                              const totalBooked = availableDates.reduce((sum, date) => {
                                const dateStr = format(date, 'yyyy-MM-dd');
                                const key = makeRoomKey(dateStr, room.room_type);
                                return sum + (selectedRooms[key] || 0);
                              }, 0);
                              
                              if (totalBooked === 0) return null;
                              
                              return (
                                <Box key={room.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                  <Typography variant="body2">
                                    {room.room_type} × {totalBooked}
                                  </Typography>
                                  <Typography variant="body2">
                                    ${(room.price_per_night * totalBooked * availableDates.length).toFixed(2)}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" gutterBottom>
                              Cost Breakdown
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">Room Charges:</Typography>
                              <Typography variant="body2">${calculateTotalCost().toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">Nights:</Typography>
                              <Typography variant="body2">{availableDates.length}</Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body1" fontWeight="bold">Total:</Typography>
                              <Typography variant="h6" color="primary" fontWeight="bold">
                                ${calculateTotalCost().toFixed(2)}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                        
                        {/* Requirements Check */}
                        <Alert 
                          severity={Object.keys(selectedRooms).length > 0 ? "success" : "warning"}
                          sx={{ mt: 2 }}
                        >
                          <Typography variant="body2">
                            {Object.keys(selectedRooms).length > 0 
                              ? `✅ All ${availableDates.length} nights have rooms booked`
                              : `⚠️ Please book rooms for all ${availableDates.length} nights`}
                          </Typography>
                        </Alert>
                      </Paper>
                    )}
                  </Paper>

                  {/* Quick Actions */}
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button 
                      variant="outlined" 
                      onClick={() => {
                        // Clear all selections
                        setSelectedRooms({});
                      }}
                      disabled={Object.keys(selectedRooms).length === 0}
                    >
                      Clear All
                    </Button>
                    <Button 
                      variant="contained" 
                      color="primary"
                      disabled={Object.keys(selectedRooms).length === 0}
                      onClick={() => {
                        // Auto-fill minimum rooms for all dates
                        const newRooms = {};
                        availableDates.forEach(date => {
                          const dateStr = format(date, 'yyyy-MM-dd');
                          const firstRoom = roomTypes[0];
                          if (firstRoom && getAvailableRoomsCount(date, firstRoom.room_type) >= requiredRooms) {
                            newRooms[makeRoomKey(dateStr, firstRoom.room_type)] = requiredRooms;
                          }
                        });
                        setSelectedRooms(newRooms);
                      }}
                    >
                      Auto-fill Minimum Rooms
                    </Button>
                  </Box>
                </>
              )}
            </>
          ) : (
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body1" gutterBottom>
                Please select a hotel from the left panel to view available rooms and make bookings.
              </Typography>
              <Typography variant="body2">
                Once selected, you'll see:
              </Typography>
              <ul>
                <li>Available room types with prices</li>
                <li>Room availability for each night</li>
                <li>Interactive booking grid</li>
                <li>Real-time cost calculation</li>
              </ul>
            </Alert>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

const DriverAssignmentStep = ({ drivers, selectedDriver, onDriverSelect, booking }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step 2: Assign Driver
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Booking Period:</strong> {format(parseDate(booking.arrival_date), 'MMM dd, yyyy')} - {format(addDays(parseDate(booking.arrival_date), booking.travel_days - 1), 'MMM dd, yyyy')}
        </Typography>
        <Typography variant="body2">
          <strong>Vehicle Preference:</strong> {booking.vehicle_type || 'Not specified'}
        </Typography>
      </Alert>

      <Grid container spacing={2}>
        {drivers.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Alert severity="warning">
              No drivers available for the selected dates.
            </Alert>
          </Grid>
        ) : (
          drivers.map((driver) => (
            <Grid size={{ xs: 12, md: 6 }} key={driver.id}>
              <Card
                sx={{
                  border: selectedDriver?.id === driver.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  cursor: 'pointer',
                  '&:hover': { borderColor: '#1976d2' }
                }}
                onClick={() => onDriverSelect(driver)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <DirectionsCar color={selectedDriver?.id === driver.id ? "primary" : "action"} />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {driver.user?.first_name} {driver.user?.last_name}
                    </Typography>
                    <Chip 
                      label={driver.availability_status} 
                      color={driver.availability_status === 'available' ? 'success' : 'warning'}
                      size="small" 
                    />
                  </Box>
                  
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="textSecondary">
                        License: {driver.license_number}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="textSecondary">
                        Experience: {driver.years_of_experience} years
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="textSecondary">
                        Rating: {driver.rating || 'N/A'} ⭐
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2" color="textSecondary">
                        Trips: {driver.total_trips}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="subtitle2" gutterBottom>
                    Vehicle Details
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2">{driver.vehicle_type}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Type
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2">{driver.vehicle_model}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Model
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2">{driver.vehicle_year}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Year
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography variant="body2">{driver.vehicle_number}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Plate
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="subtitle2" gutterBottom>
                    Languages & Location
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2">
                        Languages: {Array.isArray(driver.languages) ? driver.languages.join(', ') : driver.languages || 'English'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2">
                        Location: {[driver.city, driver.district, driver.province].filter(Boolean).join(', ')}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

const ConfirmationStep = ({ 
  booking, 
  selectedHotel, 
  selectedDriver, 
  selectedRooms, 
  roomTypes, 
  availableDates, 
  packageDetails,
  getSelectedRoomsCount 
}) => {
  const calculateRoomCost = () => {
    let total = 0;
    Object.entries(selectedRooms).forEach(([key, count]) => {
      const { roomType } = parseRoomKey(key);
      const room = roomTypes.find(r => r.room_type === roomType);
      if (room) {
        total += room.price_per_night * count * availableDates.length;
      }
    });
    return total;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step 3: Confirmation
      </Typography>
      
      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="body1">
          Ready to approve booking #{booking.id}
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Customer & Travel Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Customer & Travel Summary
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Customer:</strong> {booking.fullname}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Contact:</strong> {booking.email} • {booking.phone}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  <strong>Travel Period:</strong> {format(parseDate(booking.arrival_date), 'MMM dd, yyyy')} - {format(addDays(parseDate(booking.arrival_date), booking.travel_days - 1), 'MMM dd, yyyy')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Travelers:</strong> {booking.pax} people</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Vehicle:</strong> {booking.vehicle_type || 'Not specified'}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Package Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Package Summary
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Package:</strong> {packageDetails?.package_name || 'Custom Package'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Category:</strong> {packageDetails?.category || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Duration:</strong> {packageDetails?.duration_days || booking.travel_days} days</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Hotel Stars:</strong> {packageDetails?.hotel_stars || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Hotel Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              <Hotel sx={{ verticalAlign: 'middle', mr: 1, fontSize: 20 }} />
              Hotel Selection
            </Typography>
            {selectedHotel ? (
              <>
                <Typography variant="body2"><strong>Hotel:</strong> {selectedHotel.hotel_name}</Typography>
                <Typography variant="body2"><strong>Location:</strong> {selectedHotel.location}</Typography>
                <Typography variant="body2"><strong>Rating:</strong> {selectedHotel.rating || 'N/A'} stars</Typography>
                <Typography variant="body2"><strong>Type:</strong> {selectedHotel.hotel_type}</Typography>
                <Typography variant="body2"><strong>Contact:</strong> {selectedHotel.contact_person || 'Not specified'}</Typography>
                
                <Divider sx={{ my: 1 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  Booked Rooms ({availableDates.length} nights):
                </Typography>
                {Object.keys(selectedRooms).map((key) => {
                  const { dateStr, roomType } = parseRoomKey(key);
                  const count = selectedRooms[key];
                  const room = roomTypes.find(r => r.room_type === roomType);
                  return (
                    <Typography key={key} variant="body2">
                      • {format(new Date(dateStr), 'MMM dd')}: {count} {roomType} room(s) 
                      {room && ` ($${(room.price_per_night * count).toFixed(2)}/night)`}
                    </Typography>
                  );
                })}
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                  Total Room Cost: ${calculateRoomCost().toFixed(2)}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No hotel selected
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Driver Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              <DirectionsCar sx={{ verticalAlign: 'middle', mr: 1, fontSize: 20 }} />
              Driver Assignment
            </Typography>
            {selectedDriver ? (
              <>
                <Typography variant="body2"><strong>Driver:</strong> {selectedDriver.user?.first_name} {selectedDriver.user?.last_name}</Typography>
                <Typography variant="body2"><strong>License:</strong> {selectedDriver.license_number}</Typography>
                <Typography variant="body2"><strong>Experience:</strong> {selectedDriver.years_of_experience} years</Typography>
                <Typography variant="body2"><strong>Rating:</strong> {selectedDriver.rating || 'N/A'}</Typography>
                <Typography variant="body2"><strong>Vehicle:</strong> {selectedDriver.vehicle_type} - {selectedDriver.vehicle_model} ({selectedDriver.vehicle_year})</Typography>
                <Typography variant="body2"><strong>Plate:</strong> {selectedDriver.vehicle_number}</Typography>
              </>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No driver assigned
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Pricing Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Final Pricing Summary
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2"><strong>Package Price:</strong> {booking.estimated_price}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2"><strong>Hotel Cost:</strong> ${calculateRoomCost().toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Estimated Total: ${(parseFloat(booking.estimated_price.replace(/[^0-9.-]+/g, '')) || 0 + calculateRoomCost()).toFixed(2)}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Note: Final amount may vary based on additional services
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const BookingDetailsDialog = ({ open, onClose, booking, bookingDetails, loadingBookingDetails, packageDetails, paymentSlipUrl, getStatusChip }) => {
  if (!booking) return null;

  const details = bookingDetails || booking;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Booking Details #{booking.id}
      </DialogTitle>
      <DialogContent dividers>
        {loadingBookingDetails && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Loading full booking details...
          </Alert>
        )}
        {details.driverAssignment?.status === 'confirmed' && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Driver confirmed this assignment.
          </Alert>
        )}
        {details.driverAssignment?.status === 'cancelled' && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Driver rejected this assignment.
          </Alert>
        )}
        <Grid container spacing={2}>
          {/* Customer Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Customer Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2"><strong>Full Name:</strong> {details.fullname}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2"><strong>Email:</strong> {details.email}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2"><strong>Phone:</strong> {details.phone}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2"><strong>Passport Number:</strong> {details.passport_number}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2"><strong>Flight Number:</strong> {details.flight_number}</Typography>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2, width: '100%' }} />

          {/* Travel Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Travel Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  <strong>Arrival Date:</strong> {format(parseDate(details.arrival_date), 'PPP')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  <strong>Arrival Time:</strong> {details.arrival_time}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2"><strong>Travel Days:</strong> {details.travel_days}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2"><strong>Number of Travelers:</strong> {details.pax}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Pickup Location:</strong> {details.pickup_location || 'Not specified'}</Typography>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2, width: '100%' }} />

          {/* Vehicle Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Vehicle Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2"><strong>Vehicle Type:</strong> {details.vehicle_type || 'Not specified'}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2"><strong>Vehicle Model:</strong> {details.vehicle_model || 'Not specified'}</Typography>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2, width: '100%' }} />

          {/* Preferences */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Preferences & Additional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Languages:</strong> {details.languages || 'Not specified'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Destinations:</strong> {details.destinations || 'Not specified'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Custom Components:</strong> {details.custom_components || 'None'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Notes:</strong></Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  {details.notes || 'No additional notes'}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2, width: '100%' }} />

          {/* Package Information */}
          {(booking.package_id || packageDetails) && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom color="primary">
                Package Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2"><strong>Package Name:</strong> {packageDetails?.package_name || details.package_name || 'Custom Package'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2"><strong>Category:</strong> {packageDetails?.category || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2"><strong>Hotel Stars:</strong> {packageDetails?.hotel_stars || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2"><strong>Duration:</strong> {packageDetails?.duration_days ? `${packageDetails.duration_days} days / ${packageDetails.duration_nights} nights` : 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2"><strong>Price Range:</strong> {packageDetails?.min_price ? `${packageDetails.min_price} - ${packageDetails.max_price}` : 'N/A'}</Typography>
                </Grid>
              </Grid>
            </Grid>
          )}

          <Divider sx={{ my: 2, width: '100%' }} />

          {/* Hotel Assignment */}
          <Divider sx={{ my: 2, width: '100%' }} />

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Hotel Assignment
            </Typography>
            {details.hotelBookings && details.hotelBookings.length > 0 ? (
              <>
                <Typography variant="body2">
                  <strong>Hotel:</strong> {details.hotelBookings[0].hotel_name}
                </Typography>
                <Typography variant="body2">
                  <strong>Location:</strong> {details.hotelBookings[0].location}
                </Typography>
                <Typography variant="body2">
                  <strong>Contact:</strong> {details.hotelBookings[0].contact_person || 'Not specified'}
                </Typography>
                <Typography variant="body2">
                  <strong>Type:</strong> {details.hotelBookings[0].hotel_type || 'N/A'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Booked Rooms:</strong>
                </Typography>
                {details.hotelBookings.map((row, index) => (
                  <Typography key={`${row.booking_date}-${index}`} variant="body2">
                    • {format(new Date(row.booking_date), 'MMM dd')}: {row.rooms_booked} {row.room_type} room(s)
                    {row.price_per_night && ` ($${Number(row.price_per_night).toFixed(2)}/night)`}
                  </Typography>
                ))}
              </>
            ) : (
              <Typography variant="body2" color="textSecondary">No hotel assigned</Typography>
            )}
          </Grid>

          {/* Driver Assignment */}
          <Divider sx={{ my: 2, width: '100%' }} />

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Driver Assignment
            </Typography>
            {details.driverAssignment ? (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2"><strong>Driver:</strong> {details.driverAssignment.first_name} {details.driverAssignment.last_name}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2"><strong>Contact:</strong> {details.driverAssignment.phone || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2"><strong>License:</strong> {details.driverAssignment.license_number}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2"><strong>Vehicle:</strong> {details.driverAssignment.vehicle_type} {details.driverAssignment.vehicle_model}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2"><strong>Dates:</strong> {format(new Date(details.driverAssignment.start_date), 'MMM dd, yyyy')} - {format(new Date(details.driverAssignment.end_date), 'MMM dd, yyyy')}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2"><strong>Status:</strong> {details.driverAssignment.status}</Typography>
                </Grid>
              </Grid>
            ) : (
              <Typography variant="body2" color="textSecondary">No driver assigned</Typography>
            )}
          </Grid>

          {/* Pricing */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Pricing & Status
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2"><strong>Estimated Price:</strong> {details.estimated_price}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2"><strong>Status:</strong></Typography>
                <Box sx={{ display: 'inline-block', ml: 1 }}>
                  {getStatusChip(details.status)}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2"><strong>Payment Slip:</strong></Typography>
                {paymentSlipUrl ? (
                  <Link href={paymentSlipUrl} target="_blank" rel="noopener" underline="hover">
                    View payment slip
                  </Link>
                ) : (
                  <Typography variant="body2" color="textSecondary">Not uploaded</Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  <strong>Created At:</strong> {format(new Date(details.created_at), 'PPP p')}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingApprovals;