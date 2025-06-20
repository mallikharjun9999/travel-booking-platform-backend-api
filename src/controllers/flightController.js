const flightModel = require('../models/flightModel');

const searchFlights = async (req, res) => {
  try {
    const { from, to, departDate } = req.body;
    if (!from || !to || !departDate) {
      return res.status(400).json({ success: false, message: 'Missing search parameters: from, to, departDate required in body' });
    }

    const flights = await flightModel.searchFlights({ from, to, departDate });
    res.json({ success: true, flights });
  } catch (err) {
    console.error('Error in searchFlights:', err);
    res.status(500).json({ success: false, message: 'Error fetching flights', error: err.message });
  }
};

const getFlightDetails = async (req, res) => {
  try {
    const flight = await flightModel.getFlightById(req.params.id);
    if (!flight) return res.status(404).json({ success: false, message: 'Flight not found' });
    res.json({ success: true, flight });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching flight details', error: err.message });
  }
};

module.exports = {
  searchFlights,
  getFlightDetails
};