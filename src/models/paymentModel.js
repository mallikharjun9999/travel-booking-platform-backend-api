const getDBConnection = require('../config/database');
const { v4: uuidv4 } = require('uuid');

/**
 * Initiate payment: verify booking exists and amount, then insert into payments.
 * Returns: { id, transactionId, amount }
 */
async function initiatePayment({ bookingType, bookingId, paymentMethod }) {
  const db = await getDBConnection();
  // Determine amount from booking tables
  let amountRow = null;
  if (bookingType === 'flight') {
    console.log(`Fetching flight booking amount for ID ${bookingId}`);
    amountRow = await db.get(
      `SELECT total_fare as amount FROM flight_bookings WHERE id = ?`,
      [bookingId]
    );
  } else if (bookingType === 'hotel') {
    amountRow = await db.get(
      `SELECT total_amount as amount FROM hotel_bookings WHERE id = ?`,
      [bookingId]
    );
  } else if (bookingType === 'package') {
    amountRow = await db.get(
      `SELECT total_cost as amount FROM package_bookings WHERE id = ?`,
      [bookingId]
    );
  } else {
    throw new Error('Invalid booking type');
  }
  if (!amountRow) {
    throw new Error('Booking not found');
  }
  const amount = amountRow.amount;
  console.log(`Booking amount for ${bookingType} ID ${bookingId}: ${amount}`);
  // Generate unique transaction ID
  const transactionId = `TXN-${uuidv4()}`;
  // Insert payment record
  const result = await db.run(
    `INSERT INTO payments (booking_type, booking_id, payment_method, amount, transaction_id, transaction_status)
     VALUES (?, ?, ?, ?, ?, 'pending')`,
    [bookingType, bookingId, paymentMethod, amount, transactionId]
  );
  return {
    paymentId: result.lastID,
    transactionId,
    amount
  };
}

/**
 * Confirm payment: update status to 'completed'
 */
async function confirmPayment({ transactionId }) {
  const db = await getDBConnection();
  // Check existence
  const payRow = await db.get(
    `SELECT id, transaction_status FROM payments WHERE transaction_id = ?`,
    [transactionId]
  );
  if (!payRow) {
    throw new Error('Transaction not found');
  }
  if (payRow.transaction_status === 'completed') {
    return { already: true };
  }
  // Update to completed
  await db.run(
    `UPDATE payments SET transaction_status = 'completed', transaction_time = CURRENT_TIMESTAMP
     WHERE transaction_id = ?`,
    [transactionId]
  );
  return { updated: true };
}

/**
 * Optionally: fetch payment by transactionId
 */
async function getPaymentByTransactionId(transactionId) {
  const db = await getDBConnection();
  const row = await db.get(
    `SELECT * FROM payments WHERE transaction_id = ?`,
    [transactionId]
  );
  return row;
}

module.exports = {
  initiatePayment,
  confirmPayment,
  getPaymentByTransactionId
};
