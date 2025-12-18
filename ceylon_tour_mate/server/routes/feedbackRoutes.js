const express = require('express');
const router = express.Router();

const {
  getAllFeedbacks,
  getFeedbackStats,
  getFeedbackById,
  createFeedback,
  deleteFeedback,
  getFeedbacksByTour
} = require('../controllers/feedbackController');

// =====================
// Admin Routes
// =====================

// Get all feedbacks (with filters, pagination)
router.get('/', getAllFeedbacks);

// Get feedback statistics
router.get('/stats', getFeedbackStats);

// Get single feedback by ID
router.get('/:id', getFeedbackById);

// Delete feedback (admin only)
router.delete('/:id', deleteFeedback);

// =====================
// Customer / Public Routes
// =====================

// Create feedback
router.post('/', createFeedback);

// Get feedbacks by tour ID
router.get('/tour/:tourId', getFeedbacksByTour);

module.exports = router;
