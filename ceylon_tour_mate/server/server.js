// server.js (or index.js) - Backend Code

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===================================
// 1. DATABASE CONFIGURATION
// ===================================
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test DB Connection
pool.connect()
    .then(() => console.log('✅ Database connected successfully'))
    .catch(err => console.error('❌ Database connection error:', err.stack));


// ===================================
// 2. MIDDLEWARE SETUP (CORS WILD CARD APPLIED HERE)
// ===================================

// Use CORS middleware: Temporarily allowing all origins (*) to troubleshoot "Failed to fetch".
// In a production environment, this should be restricted.
app.use(cors({
    origin: '*', // <-- TEMPORARY CHANGE: Allowing all origins
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Use body parser middleware: Essential for Express to read the JSON sent by the frontend.
app.use(express.json()); 


// ===================================
// 3. API ENDPOINT
// ===================================
app.post('/api/feedback', async (req, res) => {
    // Log to confirm the request reached this route
    console.log('📬 Received POST request for /api/feedback');
    console.log('Request Body:', req.body); 

    const { tourId, customerName, rating, feedbackType, feedbackText } = req.body;

    // Basic validation
    if (!tourId || !rating || !feedbackType || !feedbackText) {
        // If this log appears, the error is NOT "Failed to fetch" but frontend validation or 400 response.
        return res.status(400).json({ error: 'Missing required fields.' });
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be an integer between 1 and 5.' });
    }

    try {
        const query = `
            INSERT INTO tour_feedback (tour_id, customer_name, rating, feedback_type, feedback_text)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [tourId, customerName || 'Anonymous', rating, feedbackType, feedbackText];
        
        const result = await pool.query(query, values);
        
        // Log successful insertion
        console.log('📝 Feedback successfully inserted into DB.');
        
        res.status(201).json({ 
            message: 'Feedback submitted successfully!', 
            feedback: result.rows[0] 
        });

    } catch (error) {
        console.error('💣 Error submitting feedback to DB:', error.message);
        res.status(500).json({ 
            error: 'Failed to submit feedback due to a server/database error.',
            details: error.message 
        });
    }
});

// Fallback for all other routes: If the request hits the server but not the route, it should return JSON
app.use((req, res, next) => {
    res.status(404).json({
        error: `Route Not Found: Cannot ${req.method} ${req.originalUrl}`,
        note: 'This is not an HTML page, which means the middleware is working correctly. Check the URL path.'
    });
});


// ===================================
// 4. START SERVER
// ===================================
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  
});