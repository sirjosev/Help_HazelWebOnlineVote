const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// All routes in this file are protected and for admins only
router.use(protect, isAdmin);

// Event Management
router.post('/events', adminController.createEvent);
router.put('/events/:eventId', adminController.updateEvent);
router.delete('/events/:eventId', adminController.deleteEvent);
router.get('/events', adminController.getAllEvents); // Get all events
router.get('/events/:eventId/results', adminController.getEventResults);


// Candidate Management
router.post('/events/:eventId/candidates', adminController.addCandidateToEvent);
router.put('/candidates/:candidateId', adminController.updateCandidate);
router.delete('/candidates/:candidateId', adminController.deleteCandidate);

module.exports = router;
