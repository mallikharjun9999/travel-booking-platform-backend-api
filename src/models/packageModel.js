const getDBConnection = require('../config/database');
const { v4: uuidv4 } = require('uuid'); // install uuid if not already

/**
 * Search holiday packages based on filters.
 * Schema: holiday_packages with columns:
 *   id, name, duration_days, duration_nights, destinations (JSON text), inclusions (JSON text),
 *   price_per_person, max_group_size, highlights (JSON), images (JSON)
 *
 * Filters may include:
 *   destination (string, substring match in JSON array), 
 *   durationDays (integer), 
 *   maxPrice (integer, price_per_person <= maxPrice),
 *   minPrice (integer, price_per_person >= minPrice),
 *   travelers (integer, <= max_group_size),
 *   startDate not used here (since packages have no date restrictions in schema)
 */
async function searchPackages({ destination, durationDays, minPrice, maxPrice, travelers }) {
  const db = await getDBConnection();
  let query = `SELECT * FROM holiday_packages WHERE 1=1`;
  const params = [];
  if (destination) {
    // crude JSON substring match: destinations is TEXT storing JSON array, e.g. '["City1","City2"]'
    query += ` AND destinations LIKE ?`;
    params.push(`%${destination}%`);
  }
  if (durationDays) {
    query += ` AND duration_days = ?`;
    params.push(durationDays);
  }
  if (minPrice !== undefined) {
    query += ` AND price_per_person >= ?`;
    params.push(minPrice);
  }
  if (maxPrice !== undefined) {
    query += ` AND price_per_person <= ?`;
    params.push(maxPrice);
  }
  if (travelers !== undefined) {
    // ensure package can accommodate group size
    query += ` AND max_group_size >= ?`;
    params.push(travelers);
  }
  const rows = await db.all(query, params);
  // Parse JSON fields
  return rows.map(r => {
    let destArr = [];
    try { destArr = JSON.parse(r.destinations); } catch {}
    let incArr = [];
    try { incArr = JSON.parse(r.inclusions); } catch {}
    let highlightsArr = [];
    try { highlightsArr = JSON.parse(r.highlights); } catch {}
    let imagesArr = [];
    try { imagesArr = JSON.parse(r.images); } catch {}
    return {
      id: r.id,
      name: r.name,
      duration_days: r.duration_days,
      duration_nights: r.duration_nights,
      destinations: destArr,
      inclusions: incArr,
      price_per_person: r.price_per_person,
      max_group_size: r.max_group_size,
      highlights: highlightsArr,
      images: imagesArr
    };
  });
}

/**
 * Get single package by ID
 */
async function getPackageById(id) {
  const db = await getDBConnection();
  const r = await db.get(`SELECT * FROM holiday_packages WHERE id = ?`, [id]);
  if (!r) return null;
  let destArr = [];
  try { destArr = JSON.parse(r.destinations); } catch {}
  let incArr = [];
  try { incArr = JSON.parse(r.inclusions); } catch {}
  let highlightsArr = [];
  try { highlightsArr = JSON.parse(r.highlights); } catch {}
  let imagesArr = [];
  try { imagesArr = JSON.parse(r.images); } catch {}
  return {
    id: r.id,
    name: r.name,
    duration_days: r.duration_days,
    duration_nights: r.duration_nights,
    destinations: destArr,
    inclusions: incArr,
    price_per_person: r.price_per_person,
    max_group_size: r.max_group_size,
    highlights: highlightsArr,
    images: imagesArr
  };
}

/**
 * Create a package booking.
 * - userId: integer
 * - packageId: integer
 * - travelDate: string (YYYY-MM-DD)
 * - travelers: integer
 * Returns inserted booking ID (rowid).
 */
async function createPackageBooking({ userId, packageId, travelDate, travelers }) {
  const db = await getDBConnection();
  // Fetch package price and max_group_size
  const pkg = await db.get(`SELECT price_per_person, max_group_size FROM holiday_packages WHERE id = ?`, [packageId]);
  if (!pkg) {
    throw new Error('Package not found');
  }
  if (travelers > pkg.max_group_size) {
    throw new Error('Number of travelers exceeds package limit');
  }
  const totalCost = pkg.price_per_person * travelers;
  // Generate unique booking reference, e.g., UUID or custom
  const bookingReference = `PKG-${uuidv4()}`;
  const result = await db.run(
    `INSERT INTO package_bookings (booking_reference, user_id, package_id, travel_date, travelers, total_cost)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [bookingReference, userId, packageId, travelDate, travelers, totalCost]
  );
  return {
    bookingId: result.lastID,
    bookingReference,
    totalCost
  };
}

module.exports = {
  searchPackages,
  getPackageById,
  createPackageBooking
};
