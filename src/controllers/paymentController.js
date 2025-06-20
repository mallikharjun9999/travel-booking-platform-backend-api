const paymentModel = require('../models/paymentModel');

/**
 * POST /api/payments/initiate
 * Body: { bookingType, bookingId, paymentMethod }
 * Requires authentication to ensure user owns booking? You may check in controller:
 */
const initiatePayment = async (req, res) => {
  try {
    const { bookingType, bookingId, paymentMethod } = req.body;
    if (!bookingType || !bookingId || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Missing fields: bookingType, bookingId, paymentMethod required' });
    }
    
    const { paymentId, transactionId, amount } = await paymentModel.initiatePayment({
      bookingType,
      bookingId: parseInt(bookingId),
      paymentMethod
    });
    // Dummy payment URL (in real scenario, integrate with gateway)
    const paymentUrl = `https://dummy-payment-gateway.example.com/pay?txn=${transactionId}`;
    return res.status(201).json({
      success: true,
      transactionId,
      amount,
      paymentUrl,
      paymentId
    });
  } catch (err) {
    console.error('Error in initiatePayment:', err);
    return res.status(500).json({ success: false, message: 'Error initiating payment', error: err.message });
  }
};

/**
 * POST /api/payments/confirm
 * Body: { transactionId }
 */
const confirmPayment = async (req, res) => {
  try {
    const { transactionId } = req.body;
    if (!transactionId) {
      return res.status(400).json({ success: false, message: 'Missing field: transactionId' });
    }
    const result = await paymentModel.confirmPayment({ transactionId });
    if (result.already) {
      return res.json({ success: true, message: 'Payment already completed' });
    }
    return res.json({ success: true, message: 'Payment confirmed successfully' });
  } catch (err) {
    console.error('Error in confirmPayment:', err);
    return res.status(500).json({ success: false, message: 'Error confirming payment', error: err.message });
  }
};

module.exports = {
  initiatePayment,
  confirmPayment
};
