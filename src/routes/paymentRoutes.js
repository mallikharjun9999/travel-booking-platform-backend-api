const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticateToken = require('../middleware/auth');

// Initiate payment
router.post('/initiate', authenticateToken, paymentController.initiatePayment);

// Confirm payment
router.post('/confirm', authenticateToken, paymentController.confirmPayment);

module.exports = router;
