console.log("🚀 Starting Travel Booking Backend...");

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());

// Route Imports
const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const packageRoutes = require('./routes/packageRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
// const airportRoutes = require('./routes/airportRoutes');
// const cityRoutes = require('./routes/cityRoutes');

// Route Mapping
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
// app.use('/api/airports', airportRoutes);
// app.use('/api/cities', cityRoutes);

// Root Health Check
app.get('/', (req, res) => {
  res.send('🌍 Travel Booking Platform Backend is Running!');
});

// Server Boot
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

module.exports = app;
