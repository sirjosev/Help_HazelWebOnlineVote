const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

// @route   GET api/public/results
// @desc    Get live results for all ongoing events
// @access  Public
router.get('/results', publicController.getLiveResults);

module.exports = router;
