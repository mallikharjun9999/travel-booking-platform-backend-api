const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');


router.post('/search', hotelController.searchHotels);
// GET endpoint for details by ID
router.get('/:id', hotelController.getHotelDetails);

module.exports = router;