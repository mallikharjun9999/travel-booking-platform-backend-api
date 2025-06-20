const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authenticateToken = require('../middleware/auth');

// All booking routes require authentication
router.use(authenticateToken);

// GET all bookings for user
router.get('/', bookingController.getAllBookings);

// GET specific booking by type and ID
router.get('/:type/:bookingId', bookingController.getBookingDetails);

// POST cancel booking
router.post('/:type/:bookingId/cancel', bookingController.cancelBooking);

module.exports = router;
