const bookingModel = require('../models/bookingModel');

/**
 * GET /api/bookings
 * Requires authentication middleware => req.user.id
 */
const getAllBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await bookingModel.getUserBookings(userId);
    return res.json({ success: true, bookings: result });
  } catch (err) {
    console.error('Error in getAllBookings:', err);
    return res.status(500).json({ success: false, message: 'Error fetching bookings', error: err.message });
  }
};

/**
 * GET /api/bookings/:type/:bookingId
 * type: flight | hotel | package
 */
const getBookingDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, bookingId } = req.params;
    // Validate type
    if (!['flight', 'hotel', 'package'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid booking type' });
    }
    const result = await bookingModel.getBookingByType(userId, type, parseInt(bookingId));
    if (!result) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    return res.json({ success: true, booking: result.booking, type: result.type });
  } catch (err) {
    console.error('Error in getBookingDetails:', err);
    return res.status(500).json({ success: false, message: 'Error fetching booking details', error: err.message });
  }
};

/**
 * POST /api/bookings/:type/:bookingId/cancel
 */
const cancelBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, bookingId } = req.params;
    if (!['flight', 'hotel', 'package'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid booking type' });
    }
    const ok = await bookingModel.cancelBooking(userId, type, parseInt(bookingId));
    if (!ok) {
      return res.status(404).json({ success: false, message: 'Booking not found or cannot cancel' });
    }
    return res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (err) {
    console.error('Error in cancelBooking:', err);
    return res.status(500).json({ success: false, message: 'Error cancelling booking', error: err.message });
  }
};

module.exports = {
  getAllBookings,
  getBookingDetails,
  cancelBooking
};
