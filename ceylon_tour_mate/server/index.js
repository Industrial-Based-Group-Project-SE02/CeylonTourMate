const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 ADD THIS LINE - Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Ceylon Tour Mate Server is running!' });
});

// API routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const driverRoutes = require('./routes/driverRoutes');
const advertisementRoutes = require('./routes/advertisementRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/advertisements', advertisementRoutes);
app.use('/api/feedback', feedbackRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File size is too large. Max size is 10MB' });
  }
  
  if (err.message && err.message.includes('Only image files')) {
    return res.status(400).json({ error: err.message });
  }
  
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log('🚀 Ceylon Tour Mate Server');
  console.log('='.repeat(50));
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`📁 Uploads: http://localhost:${PORT}/uploads`);
  console.log(`📢 Advertisements: http://localhost:${PORT}/api/advertisements`);
  console.log('='.repeat(50) + '\n');
});