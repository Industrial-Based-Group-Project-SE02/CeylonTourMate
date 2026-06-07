import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BuildingIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

const HotelDetails = () => {
  const [hotelData, setHotelData] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Hotel edit modal
  const [showHotelEditModal, setShowHotelEditModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [hotelFormData, setHotelFormData] = useState({
    hotel_name: '',
    registration_number: '',
    location: '',
    contact_person: '',
    description: '',
    hotel_type: '',
    province: '',
    district: '',
  });

  // Room modal
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomFormData, setRoomFormData] = useState({
    room_type: '',
    total_rooms: 1,
    max_guests: 1,
    price_per_night: '',
  });

  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const roomTypes = ['Single', 'Double', 'Triple', 'Family', 'Deluxe', 'Suite'];
  const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8];
  const hotelTypes = ['Luxury', '5-Star', '4-Star', '3-Star', '2-Star', 'Budget', 'Boutique', 'Resort'];
  const provinces = ['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Central', 'North Western', 'Sabaragamuwa', 'Uva'];

  useEffect(() => {
    fetchHotelData();
    fetchRooms();
  }, []);

  const fetchHotelData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/hotel-agents/my-details',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHotelData(response.data);
      setHotelFormData({
        hotel_name: response.data.hotel_name || '',
        registration_number: response.data.registration_number || '',
        location: response.data.location || '',
        contact_person: response.data.contact_person || '',
        description: response.data.description || '',
        hotel_type: response.data.hotel_type || '',
        province: response.data.province || '',
        district: response.data.district || '',
      });
    } catch (error) {
      console.error('Error fetching hotel data:', error);
      setError(error.response?.data?.error || 'Failed to fetch hotel details');
    }
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/rooms/my-rooms',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setError(error.response?.data?.error || 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateHotel = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/hotel-agents/update-my-details',
        hotelFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Hotel details updated successfully!');
      setShowHotelEditModal(false);
      fetchHotelData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update hotel details');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveRoom = async () => {
    try {
      if (!roomFormData.room_type || !roomFormData.total_rooms || !roomFormData.max_guests || !roomFormData.price_per_night) {
        setError('All room fields are required');
        return;
      }

      setSubmitting(true);
      const token = localStorage.getItem('token');

      if (editingRoom) {
        // Update existing room
        await axios.put(
          `http://localhost:5000/api/rooms/${editingRoom.id}`,
          roomFormData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess('Room updated successfully!');
      } else {
        // Create new room
        await axios.post(
          'http://localhost:5000/api/rooms',
          roomFormData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess('Room created successfully!');
      }

      setShowRoomModal(false);
      setEditingRoom(null);
      resetRoomForm();
      fetchRooms();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save room');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/rooms/${deleteTarget.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Room deleted successfully!');
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchRooms();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete room');
    } finally {
      setSubmitting(false);
    }
  };

  const resetRoomForm = () => {
    setRoomFormData({
      room_type: '',
      total_rooms: 1,
      max_guests: 1,
      price_per_night: '',
    });
  };

  const openEditRoom = (room) => {
    setEditingRoom(room);
    setRoomFormData({
      room_type: room.room_type,
      total_rooms: room.total_rooms,
      max_guests: room.max_guests,
      price_per_night: room.price_per_night,
    });
    setShowRoomModal(true);
  };

  const openAddRoom = () => {
    setEditingRoom(null);
    resetRoomForm();
    setShowRoomModal(true);
  };

  if (!hotelData && loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      {/* Error and Success Alerts */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      {/* Hotel Details Section */}
      {hotelData && (
        <Card sx={{ 
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
          minHeight: '70vh'
        }}>
          <CardHeader
            title={
              <Box display="flex" alignItems="center" gap={1}>
                <BuildingIcon sx={{ color: '#d97706', fontSize: 32 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
                  Hotel Information
                </Typography>
              </Box>
            }
            action={
              <Button
                variant="contained"
                color="warning"
                startIcon={<EditIcon />}
                onClick={() => setShowHotelEditModal(true)}
                size="large"
              >
                Edit Details
              </Button>
            }
            sx={{
              backgroundColor: '#fef3c7',
              borderBottom: '3px solid #fcd34d',
              padding: '24px 32px'
            }}
          />
          <CardContent sx={{ padding: '48px 32px' }}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                  HOTEL NAME
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 1, color: '#1f2937' }}>
                  {hotelData.hotel_name || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                  REGISTRATION NUMBER
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 1, color: '#1f2937' }}>
                  {hotelData.registration_number || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="flex-start" gap={2}>
                  <LocationIcon sx={{ color: '#d97706', fontSize: 28, mt: 0.5 }} />
                  <Box flex={1}>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                      LOCATION
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 1, color: '#1f2937' }}>
                      {hotelData.location || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="flex-start" gap={2}>
                  <PhoneIcon sx={{ color: '#d97706', fontSize: 28, mt: 0.5 }} />
                  <Box flex={1}>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                      CONTACT PERSON
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 1, color: '#1f2937' }}>
                      {hotelData.contact_person || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                  HOTEL TYPE
                </Typography>
                <Box mt={1}>
                  <Chip 
                    label={hotelData.hotel_type || 'N/A'} 
                    color="warning"
                    variant="filled"
                    sx={{ fontWeight: 600, fontSize: '1rem', padding: '24px 12px' }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                  PROVINCE &amp; DISTRICT
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 1, color: '#1f2937' }}>
                  {hotelData.province || 'N/A'} - {hotelData.district || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                  DESCRIPTION
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, color: '#4b5563', lineHeight: 1.8, fontSize: '1rem' }}>
                  {hotelData.description || 'No description provided'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Hotel Edit Modal */}
      <Dialog open={showHotelEditModal} onClose={() => setShowHotelEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#fef3c7', fontWeight: 'bold' }}>
          Edit Hotel Details
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Hotel Name"
            value={hotelFormData.hotel_name}
            onChange={(e) => setHotelFormData({ ...hotelFormData, hotel_name: e.target.value })}
            margin="normal"
            disabled={submitting}
          />
          <TextField
            fullWidth
            label="Registration Number"
            value={hotelFormData.registration_number}
            onChange={(e) => setHotelFormData({ ...hotelFormData, registration_number: e.target.value })}
            margin="normal"
            disabled={submitting}
          />
          <TextField
            fullWidth
            label="Location"
            value={hotelFormData.location}
            onChange={(e) => setHotelFormData({ ...hotelFormData, location: e.target.value })}
            margin="normal"
            disabled={submitting}
          />
          <TextField
            fullWidth
            label="Contact Person"
            value={hotelFormData.contact_person}
            onChange={(e) => setHotelFormData({ ...hotelFormData, contact_person: e.target.value })}
            margin="normal"
            disabled={submitting}
          />
          <TextField
            fullWidth
            label="Hotel Type"
            select
            value={hotelFormData.hotel_type}
            onChange={(e) => setHotelFormData({ ...hotelFormData, hotel_type: e.target.value })}
            margin="normal"
            disabled={submitting}
          >
            {hotelTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Province"
            select
            value={hotelFormData.province}
            onChange={(e) => setHotelFormData({ ...hotelFormData, province: e.target.value })}
            margin="normal"
            disabled={submitting}
          >
            {provinces.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="District"
            value={hotelFormData.district}
            onChange={(e) => setHotelFormData({ ...hotelFormData, district: e.target.value })}
            margin="normal"
            disabled={submitting}
          />
          <TextField
            fullWidth
            label="Description"
            value={hotelFormData.description}
            onChange={(e) => setHotelFormData({ ...hotelFormData, description: e.target.value })}
            margin="normal"
            multiline
            rows={4}
            disabled={submitting}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowHotelEditModal(false)} disabled={submitting}>
            <CancelIcon sx={{ mr: 1 }} />
            Cancel
          </Button>
          <Button
            onClick={handleUpdateHotel}
            variant="contained"
            color="warning"
            disabled={submitting}
          >
            <SaveIcon sx={{ mr: 1 }} />
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Room Modal */}
      <Dialog open={showRoomModal} onClose={() => setShowRoomModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#fef3c7', fontWeight: 'bold' }}>
          {editingRoom ? 'Edit Room' : 'Add New Room'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Room Type"
            select
            value={roomFormData.room_type}
            onChange={(e) => setRoomFormData({ ...roomFormData, room_type: e.target.value })}
            margin="normal"
            disabled={submitting}
          >
            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Total Rooms"
            type="number"
            inputProps={{ min: 1 }}
            value={roomFormData.total_rooms}
            onChange={(e) => setRoomFormData({ ...roomFormData, total_rooms: parseInt(e.target.value) })}
            margin="normal"
            disabled={submitting}
          />
          <TextField
            fullWidth
            label="Max Guests"
            select
            value={roomFormData.max_guests}
            onChange={(e) => setRoomFormData({ ...roomFormData, max_guests: parseInt(e.target.value) })}
            margin="normal"
            disabled={submitting}
          >
            {guestOptions.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Price Per Night (Rs.)"
            type="number"
            inputProps={{ step: '0.01', min: '0' }}
            value={roomFormData.price_per_night}
            onChange={(e) => setRoomFormData({ ...roomFormData, price_per_night: e.target.value })}
            margin="normal"
            disabled={submitting}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowRoomModal(false)} disabled={submitting}>
            <CancelIcon sx={{ mr: 1 }} />
            Cancel
          </Button>
          <Button
            onClick={handleSaveRoom}
            variant="contained"
            color="success"
            disabled={submitting}
          >
            <SaveIcon sx={{ mr: 1 }} />
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DialogTitle sx={{ backgroundColor: '#fee2e2', fontWeight: 'bold' }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>
            Are you sure you want to delete the {deleteTarget?.room_type} room? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowDeleteModal(false)} disabled={submitting}>
            <CancelIcon sx={{ mr: 1 }} />
            Cancel
          </Button>
          <Button
            onClick={handleDeleteRoom}
            variant="contained"
            color="error"
            disabled={submitting}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            {submitting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HotelDetails;
