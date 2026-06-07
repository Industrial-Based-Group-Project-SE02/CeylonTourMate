// C:\Users\U S E R\Desktop\2026-01-29\CeylonTourMateProject\ceylon_tour_mate\ceylon_tour_mate\client\src\pages\hotel_agent\rooms.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Snackbar,
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  CircularProgress,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarMonth as CalendarIcon,
  Hotel as HotelIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Refresh as RefreshIcon,
  CheckCircle as AvailableIcon,
  Cancel as BlockedIcon,
  EventBusy as FullyBookedIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { format, addDays } from 'date-fns';

const RoomsManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openCalendarDialog, setOpenCalendarDialog] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [bookedOverrides, setBookedOverrides] = useState({});
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Room form state
  const [roomForm, setRoomForm] = useState({
    room_type: '',
    total_rooms: 1,
    max_guests: 1,
    price_per_night: ''
  });

  // Availability state
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 30)
  });
  const [bulkStatus, setBulkStatus] = useState('available');

  // Room types
  const roomTypes = [
    'Single',
    'Double',
    'Triple',
    'Family',
  ];

  // Guest options
  const guestOptions = [1, 2, 3, 4, 5, 6];

  // Status options
  const statusOptions = [
    { value: 'available', label: 'Available', color: 'success' },
    { value: 'partially_booked', label: 'Partially Booked', color: 'info' },
    { value: 'fully_booked', label: 'Fully Booked', color: 'error' },
    { value: 'blocked', label: 'Blocked', color: 'warning' }
  ];

  const getInventoryDate = (item) => item?.booking_date || item?.available_date;

  const parseLocalDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(`${dateStr}T00:00:00`);
  };

  const getBookedRooms = (item) => {
    if (typeof item?.rooms_booked === 'number') return item.rooms_booked;
    if (typeof item?.available_rooms === 'number' && selectedRoom?.total_rooms) {
      return Math.max(0, selectedRoom.total_rooms - item.available_rooms);
    }
    return 0;
  };

  const getAvailableRooms = (item) => {
    if (typeof item?.available_rooms === 'number') return item.available_rooms;
    if (selectedRoom?.total_rooms !== undefined) {
      return Math.max(0, selectedRoom.total_rooms - getBookedRooms(item));
    }
    return 0;
  };

  const getEditableBooked = (item) => {
    const dateKey = getInventoryDate(item);
    if (!dateKey) return 0;
    if (bookedOverrides[dateKey] !== undefined) {
      return bookedOverrides[dateKey];
    }
    return getBookedRooms(item);
  };

  const handleBookedChange = (item, value) => {
    const totalRooms = selectedRoom?.total_rooms || 0;
    const dateKey = getInventoryDate(item);
    const parsed = Number.isNaN(parseInt(value, 10)) ? 0 : parseInt(value, 10);
    const clamped = Math.max(0, Math.min(parsed, totalRooms));

    setBookedOverrides((prev) => ({
      ...prev,
      [dateKey]: clamped
    }));
  };

  const updateBookedRooms = async (item) => {
    try {
      const token = localStorage.getItem('token');
      const totalRooms = selectedRoom?.total_rooms || 0;
      const dateKey = getInventoryDate(item);
      const booked = getEditableBooked(item);
      const available_rooms = Math.max(0, totalRooms - booked);

      let status = item.status;
      if (status !== 'blocked') {
        if (booked === 0) status = 'available';
        else if (available_rooms === 0) status = 'fully_booked';
        else status = 'partially_booked';
      }

      await axios.post(
        `http://localhost:5000/api/hotel-rooms/${selectedRoom.id}/availability`,
        {
          booking_date: dateKey,
          rooms_booked: booked,
          available_rooms,
          status
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const updatedData = availabilityData.map((entry) => {
        if (getInventoryDate(entry) === dateKey) {
          return {
            ...entry,
            rooms_booked: booked,
            available_rooms,
            status
          };
        }
        return entry;
      });

      setAvailabilityData(updatedData);
      setSuccess('Booking count updated successfully');
      setShowSnackbar(true);
    } catch (err) {
      console.error('Error updating booked rooms:', err);
      setError(err.response?.data?.error || 'Failed to update booking count');
      setShowSnackbar(true);
    }
  };

  // Fetch hotel rooms from API
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5000/api/hotel-rooms/my-rooms', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setRooms(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError(err.response?.data?.error || 'Failed to load rooms');
      setLoading(false);
    }
  };

  // Fetch room availability
  const fetchRoomAvailability = async (roomId) => {
    try {
      setAvailabilityLoading(true);
      const token = localStorage.getItem('token');
      
      const startDate = format(dateRange.startDate, 'yyyy-MM-dd');
      const endDate = format(dateRange.endDate, 'yyyy-MM-dd');
      
      const response = await axios.get(
        `http://localhost:5000/api/hotel-rooms/${roomId}/availability`,
        {
          params: { startDate, endDate },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setAvailabilityData(response.data);
      setAvailabilityLoading(false);
    } catch (err) {
      console.error('Error fetching availability:', err);
      setError(err.response?.data?.error || 'Failed to load availability');
      setAvailabilityLoading(false);
    }
  };

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setRoomForm({
      ...roomForm,
      [name]: name === 'total_rooms' || name === 'max_guests' 
        ? parseInt(value) 
        : value
    });
  };

  // Validate form
  const validateForm = () => {
    if (!roomForm.room_type.trim()) {
      return 'Room type is required';
    }
    if (roomForm.total_rooms < 1) {
      return 'Total rooms must be at least 1';
    }
    if (roomForm.max_guests < 1) {
      return 'Maximum guests must be at least 1';
    }
    if (!roomForm.price_per_night || parseFloat(roomForm.price_per_night) <= 0) {
      return 'Price per night must be greater than 0';
    }
    return null;
  };

  // Submit room form
  const handleSubmitRoom = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const roomData = {
        ...roomForm,
        price_per_night: parseFloat(roomForm.price_per_night)
      };

      if (editingRoom) {
        // Update existing room
        await axios.put(
          `http://localhost:5000/api/hotel-rooms/${editingRoom.id}`,
          roomData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setSuccess('Room updated successfully');
      } else {
        // Add new room
        await axios.post(
          'http://localhost:5000/api/hotel-rooms',
          roomData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setSuccess('Room added successfully');
      }
      
      handleCloseDialog();
      fetchRooms(); // Refresh rooms list
    } catch (err) {
      console.error('Error saving room:', err);
      setError(err.response?.data?.error || 'Failed to save room');
    }
  };

  // Delete room
  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        const token = localStorage.getItem('token');
        
        await axios.delete(
          `http://localhost:5000/api/hotel-rooms/${roomId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        setSuccess('Room deleted successfully');
        fetchRooms(); // Refresh rooms list
      } catch (err) {
        console.error('Error deleting room:', err);
        setError(err.response?.data?.error || 'Failed to delete room');
      }
    }
  };

  // Open edit dialog
  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({
      room_type: room.room_type,
      total_rooms: room.total_rooms,
      max_guests: room.max_guests,
      price_per_night: room.price_per_night.toString()
    });
    setOpenDialog(true);
  };

  // Open calendar dialog
  const handleOpenCalendar = (room) => {
    setSelectedRoom(room);
    setOpenCalendarDialog(true);
    fetchRoomAvailability(room.id);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRoom(null);
    setRoomForm({
      room_type: '',
      total_rooms: 1,
      max_guests: 1,
      price_per_night: ''
    });
  };

  // Close calendar dialog
  const handleCloseCalendarDialog = () => {
    setOpenCalendarDialog(false);
    setSelectedRoom(null);
    setAvailabilityData([]);
  };

  // Update availability status
  const updateAvailabilityStatus = async (item, status) => {
    try {
      const token = localStorage.getItem('token');
      const totalRooms = selectedRoom?.total_rooms || 0;
      const currentAvailable = getAvailableRooms(item);
      let available_rooms = currentAvailable;
      let rooms_booked = Math.max(0, totalRooms - currentAvailable);

      if (status === 'available') {
        available_rooms = totalRooms;
        rooms_booked = 0;
      } else if (status === 'blocked' || status === 'fully_booked') {
        available_rooms = 0;
        rooms_booked = status === 'fully_booked' ? totalRooms : 0;
      } else if (status === 'partially_booked') {
        available_rooms = Math.min(
          currentAvailable === totalRooms ? Math.max(totalRooms - 1, 0) : currentAvailable,
          Math.max(totalRooms - 1, 0)
        );
        rooms_booked = Math.max(0, totalRooms - available_rooms);
      }
      
      await axios.post(
        `http://localhost:5000/api/hotel-rooms/${selectedRoom.id}/availability`,
        {
          booking_date: getInventoryDate(item),
          rooms_booked,
          status,
          available_rooms
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update local state
      const updatedData = availabilityData.map(entry => {
        if (getInventoryDate(entry) === getInventoryDate(item)) {
          return {
            ...entry,
            status,
            available_rooms,
            rooms_booked
          };
        }
        return entry;
      });
      setAvailabilityData(updatedData);
      setBookedOverrides((prev) => ({
        ...prev,
        [getInventoryDate(item)]: rooms_booked
      }));
      setSuccess('Availability updated successfully');
      setShowSnackbar(true);
    } catch (err) {
      console.error('Error updating availability:', err);
      setError(err.response?.data?.error || 'Failed to update availability');
      setShowSnackbar(true);
    }
  };

  // Bulk update availability
  const handleBulkUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const startDate = format(dateRange.startDate, 'yyyy-MM-dd');
      const endDate = format(dateRange.endDate, 'yyyy-MM-dd');
      const totalRooms = selectedRoom?.total_rooms || 0;
      let available_rooms = totalRooms;

      if (bulkStatus === 'blocked' || bulkStatus === 'fully_booked') {
        available_rooms = 0;
      } else if (bulkStatus === 'partially_booked') {
        available_rooms = Math.max(totalRooms - 1, 0);
      }
      
      await axios.post(
        `http://localhost:5000/api/hotel-rooms/${selectedRoom.id}/availability/bulk`,
        {
          startDate,
          endDate,
          status: bulkStatus,
          available_rooms
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setSuccess('Bulk update completed successfully');
      setShowSnackbar(true);
      fetchRoomAvailability(selectedRoom.id); // Refresh availability data
    } catch (err) {
      console.error('Error bulk updating availability:', err);
      setError(err.response?.data?.error || 'Failed to bulk update availability');
      setShowSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  // Get status chip
  const getStatusChip = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return (
      <Chip
        label={option?.label || status}
        color={option?.color || 'default'}
        size="small"
      />
    );
  };

  // Initialize on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (!availabilityData.length) {
      setBookedOverrides({});
      return;
    }

    const next = {};
    availabilityData.forEach((item) => {
      const dateKey = getInventoryDate(item);
      if (!dateKey) return;
      next[dateKey] = getBookedRooms(item);
    });
    setBookedOverrides(next);
  }, [availabilityData, selectedRoom]);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        if (error) setError('');
        if (success) setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <HotelIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Room Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add New Room
        </Button>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Snackbar
        open={showSnackbar && Boolean(error || success)}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>

      {/* Rooms Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : rooms.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No rooms found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Start by adding your first room
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Add First Room
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {rooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} key={room.id}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {room.room_type}
                    </Typography>
                    <Chip
                      label={`${room.total_rooms} Rooms`}
                      color="primary"
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PeopleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="textSecondary">
                      Max Guests: {room.max_guests}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1" color="primary">
                      DOLLAR {room.price_per_night.toLocaleString()}
                      <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                        /night
                      </Typography>
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                      icon={<CalendarIcon />}
                      label="Manage Availability"
                      size="small"
                      color="secondary"
                      variant="outlined"
                      onClick={() => handleOpenCalendar(room)}
                      sx={{ cursor: 'pointer' }}
                    />
                  </Box>
                </CardContent>
                
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditRoom(room)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteRoom(room.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Room Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingRoom ? 'Edit Room' : 'Add New Room'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Room Type"
                name="room_type"
                value={roomForm.room_type}
                onChange={handleFormChange}
                required
              >
                {roomTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Rooms"
                name="total_rooms"
                type="number"
                value={roomForm.total_rooms}
                onChange={handleFormChange}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Max Guests"
                name="max_guests"
                value={roomForm.max_guests}
                onChange={handleFormChange}
                required
              >
                {guestOptions.map((guests) => (
                  <MenuItem key={guests} value={guests}>
                    {guests} {guests === 1 ? 'Guest' : 'Guests'}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price Per Night ($)"
                name="price_per_night"
                type="number"
                value={roomForm.price_per_night}
                onChange={handleFormChange}
                required
                inputProps={{ min: 0, step: "0.01" }}
                InputProps={{
                  startAdornment: <MoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitRoom} variant="contained">
            {editingRoom ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Calendar Management Dialog */}
      <Dialog 
        open={openCalendarDialog} 
        onClose={handleCloseCalendarDialog} 
        maxWidth="lg" 
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6">
                Availability Calendar - {selectedRoom?.room_type}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Rooms: {selectedRoom?.total_rooms} | 
                Max Guests: {selectedRoom?.max_guests} | 
                Price: $ {selectedRoom?.price_per_night?.toLocaleString()}/night
              </Typography>
            </Box>
            <IconButton onClick={() => fetchRoomAvailability(selectedRoom.id)}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {/* Bulk Update Section */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Bulk Update Availability
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={format(dateRange.startDate, 'yyyy-MM-dd')}
                  onChange={(e) => setDateRange({...dateRange, startDate: new Date(e.target.value)})}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="End Date"
                  type="date"
                  value={format(dateRange.endDate, 'yyyy-MM-dd')}
                  onChange={(e) => setDateRange({...dateRange, endDate: new Date(e.target.value)})}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={bulkStatus}
                    label="Status"
                    onChange={(e) => setBulkStatus(e.target.value)}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleBulkUpdate}
                  fullWidth
                >
                  Apply
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Availability Table */}
          {availabilityLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Day</TableCell>
                    <TableCell align="center">Booked</TableCell>
                    <TableCell align="center">Available Rooms</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availabilityData.map((item) => (
                    <TableRow key={getInventoryDate(item)} hover>
                      <TableCell>
                        {format(parseLocalDate(getInventoryDate(item)), 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell>
                        {format(parseLocalDate(getInventoryDate(item)), 'EEEE')}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <TextField
                            size="small"
                            type="number"
                            value={getEditableBooked(item)}
                            onChange={(e) => handleBookedChange(item, e.target.value)}
                            inputProps={{
                              min: 0,
                              max: selectedRoom?.total_rooms || 0,
                              style: { textAlign: 'center', width: 70 }
                            }}
                            disabled={item.status === 'blocked'}
                          />
                          <IconButton
                            size="small"
                            onClick={() => updateBookedRooms(item)}
                            disabled={item.status === 'blocked'}
                          >
                            <SaveIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {getAvailableRooms(item)} / {selectedRoom?.total_rooms}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {getStatusChip(item.status)}
                      </TableCell>
                      <TableCell align="center">
                        <FormControl size="small">
                          <Select
                            value={item.status}
                            onChange={(e) => updateAvailabilityStatus(item, e.target.value)}
                            sx={{ minWidth: 120 }}
                          >
                            {statusOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {!availabilityLoading && availabilityData.length === 0 && (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No availability data found
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => fetchRoomAvailability(selectedRoom.id)}
              >
                Load Availability
              </Button>
            </Paper>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseCalendarDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RoomsManagement;