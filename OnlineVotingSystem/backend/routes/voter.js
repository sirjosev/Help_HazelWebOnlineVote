const express = require('express');
const router = express.Router();
const { protect, isVoter } = require('../middleware/authMiddleware');
const voterController = require('../controllers/voterController');

// All routes in this file are for logged-in users
router.use(protect);

// @route   GET api/voter/events
// @desc    Get eligible voting events for the logged-in voter
// @access  Private (Voters and Admins can see, but logic filters for voters)
router.get('/events', voterController.getEligibleEvents);

// @route   GET api/voter/events/:eventId
// @desc    Get a single event by ID with its candidates
// @access  Private
router.get('/events/:eventId', voterController.getEventById);

// @route   POST api/voter/events/:eventId/vote
// @desc    Cast a vote in an event
// @access  Private (Voters only)
router.post('/events/:eventId/vote', isVoter, voterController.castVote);

module.exports = router;
