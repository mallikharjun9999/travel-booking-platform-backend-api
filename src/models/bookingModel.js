const getDBConnection = require('../config/database');

/**
 * Get all bookings for a user, grouped by type.
 * Returns an object: { flights: [...], hotels: [...], packages: [...] }
 * 
 * Each array contains summary objects. You may customize fields as needed.
 */
async function getUserBookings(userId) {
  const db = await getDBConnection();

  // Flights
  const flights = await db.all(
    `SELECT fb.id as booking_id, fb.booking_reference, fb.journey_date, fb.travel_class,
            fb.total_fare, fb.status, f.flight_number, a.name as airline_name,
            sa.code as source_code, da.code as dest_code
     FROM flight_bookings fb
     JOIN flights f ON fb.flight_id = f.id
     JOIN airlines a ON f.airline_id = a.id
     JOIN airports sa ON f.source_airport_id = sa.id
     JOIN airports da ON f.destination_airport_id = da.id
     WHERE fb.user_id = ?`,
    [userId]
  );

  // Hotels
  const hotels = await db.all(
    `SELECT hb.id as booking_id, hb.booking_reference, hb.check_in, hb.check_out,
            hb.rooms, hb.total_amount, hb.booking_status as status,
            h.name as hotel_name, hr.room_type
     FROM hotel_bookings hb
     JOIN hotels h ON hb.hotel_id = h.id
     JOIN hotel_rooms hr ON hb.room_type_id = hr.id
     WHERE hb.user_id = ?`,
    [userId]
  );

  // Packages
  const packages = await db.all(
    `SELECT pb.id as booking_id, pb.booking_reference, pb.travel_date, pb.travelers,
            pb.total_cost,    -- no status column in schema, assume 'booked' default
            pb.total_cost,
            ph.name as package_name
     FROM package_bookings pb
     JOIN holiday_packages ph ON pb.package_id = ph.id
     WHERE pb.user_id = ?`,
    [userId]
  );

  return { flights, hotels, packages };
}

/**
 * Fetch a single booking detail by type and bookingId, ensuring it belongs to userId.
 * type: 'flight' | 'hotel' | 'package'
 */
async function getBookingByType(userId, type, bookingId) {
  const db = await getDBConnection();
  if (type === 'flight') {
    const row = await db.get(
      `SELECT fb.id as booking_id, fb.booking_reference, fb.journey_date, fb.travel_class,
              fb.total_fare, fb.status, fb.contact_email, fb.contact_phone,
              f.flight_number, a.name as airline_name,
              sa.code as source_code, sa.city as source_city, da.code as dest_code, da.city as dest_city
       FROM flight_bookings fb
       JOIN flights f ON fb.flight_id = f.id
       JOIN airlines a ON f.airline_id = a.id
       JOIN airports sa ON f.source_airport_id = sa.id
       JOIN airports da ON f.destination_airport_id = da.id
       WHERE fb.user_id = ? AND fb.id = ?`,
      [userId, bookingId]
    );
    if (!row) return null;

    // Fetch passengers
    const passengers = await db.all(
      `SELECT id, title, first_name, last_name, date_of_birth, passport_number
       FROM passengers
       WHERE booking_id = ?`,
      [bookingId]
    );

    return {
      type: 'flight',
      booking: {
        ...row,
        passengers
      }
    };
  } else if (type === 'hotel') {
    const row = await db.get(
      `SELECT hb.id as booking_id, hb.booking_reference, hb.check_in, hb.check_out,
              hb.rooms, hb.total_amount, hb.booking_status as status, hb.special_requests,
              h.name as hotel_name, hr.room_type, hr.price_per_night
       FROM hotel_bookings hb
       JOIN hotels h ON hb.hotel_id = h.id
       JOIN hotel_rooms hr ON hb.room_type_id = hr.id
       WHERE hb.user_id = ? AND hb.id = ?`,
      [userId, bookingId]
    );
    if (!row) return null;
    return {
      type: 'hotel',
      booking: row
    };
  } else if (type === 'package') {
    const row = await db.get(
      `SELECT pb.id as booking_id, pb.booking_reference, pb.travel_date, pb.travelers, pb.total_cost,
              ph.name as package_name
       FROM package_bookings pb
       JOIN holiday_packages ph ON pb.package_id = ph.id
       WHERE pb.user_id = ? AND pb.id = ?`,
      [userId, bookingId]
    );
    if (!row) return null;
    return {
      type: 'package',
      booking: row
    };
  } else {
    throw new Error('Invalid booking type');
  }
}

/**
 * Cancel a booking by type. We update the status field if exists, or delete if no status column.
 * For flight_bookings: update status = 'cancelled'
 * For hotel_bookings: update booking_status = 'cancelled'
 * For package_bookings: no status column in schema; we could add a 'status' column, but since schema lacks it,
 * we can optionally delete the row or ignore. Here we return error if no status column; or you may want to ALTER schema.
 */
async function cancelBooking(userId, type, bookingId) {
  const db = await getDBConnection();

  if (type === 'flight') {
    // Ensure exists
    const existing = await db.get(`SELECT id FROM flight_bookings WHERE user_id = ? AND id = ?`, [userId, bookingId]);
    if (!existing) {
      return false;
    }
    await db.run(`UPDATE flight_bookings SET status = 'cancelled' WHERE id = ?`, [bookingId]);
    return true;
  } else if (type === 'hotel') {
    const existing = await db.get(`SELECT id FROM hotel_bookings WHERE user_id = ? AND id = ?`, [userId, bookingId]);
    if (!existing) {
      return false;
    }
    await db.run(`UPDATE hotel_bookings SET booking_status = 'cancelled' WHERE id = ?`, [bookingId]);
    return true;
  } else if (type === 'package') {
    // Schema has no status column for package_bookings. Two choices:
    //  a) Add a status column in schema (recommended), or
    //  b) Delete the booking row or ignore.
    // Here we'll delete the row to represent cancellation:
    const existing = await db.get(`SELECT id FROM package_bookings WHERE user_id = ? AND id = ?`, [userId, bookingId]);
    if (!existing) {
      return false;
    }
    await db.run(`DELETE FROM package_bookings WHERE id = ?`, [bookingId]);
    return true;
  } else {
    throw new Error('Invalid booking type');
  }
}

module.exports = {
  getUserBookings,
  getBookingByType,
  cancelBooking
};
