const hotelModel = require('../models/hotelModel');

// POST /api/hotels/search
const searchHotels = async (req, res) => {
  try {
    const { city, rooms, adults, minPrice, maxPrice, starRating } = req.body;
    // Validate or parse numeric values
    const filters = {
      city,
      rooms: rooms !== undefined ? parseInt(rooms) : undefined,
      adults: adults !== undefined ? parseInt(adults) : undefined,
      minPrice: minPrice !== undefined ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? parseInt(maxPrice) : undefined,
      starRating: starRating !== undefined ? parseInt(starRating) : undefined
    };
    // At least one filter can be optional; proceed with search
    const hotels = await hotelModel.searchHotels(filters);
    res.json({ success: true, hotels });
  } catch (err) {
    console.error('Error in searchHotels:', err);
    res.status(500).json({ success: false, message: 'Error searching hotels', error: err.message });
  }
};

// GET /api/hotels/:id
const getHotelDetails = async (req, res) => {
  try {
    const hotelId = req.params.id;
    const hotel = await hotelModel.getHotelById(hotelId);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    res.json({ success: true, hotel });
  } catch (err) {
    console.error('Error in getHotelDetails:', err);
    res.status(500).json({ success: false, message: 'Error fetching hotel details', error: err.message });
  }
};

module.exports = {
  searchHotels,
  getHotelDetails
};