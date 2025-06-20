const getDBConnection = require('../config/database');

async function searchHotels({ city, rooms, adults, minPrice, maxPrice, starRating }) {
  const db = await getDBConnection();
  let query = `
    SELECT h.id, h.name, h.location, h.star_rating, h.amenities as hotel_amenities,
           h.check_in_time, h.check_out_time, h.images as hotel_images, h.rating, h.review_count,
           hr.id as room_id, hr.room_type, hr.price_per_night, hr.max_occupancy, hr.available_quantity, hr.amenities as room_amenities
    FROM hotels h
    JOIN hotel_rooms hr ON hr.hotel_id = h.id
    WHERE 1=1
  `;
  const params = [];
  if (city) {
    query += ' AND h.location LIKE ?';
    params.push(`%${city}%`);
  }
  if (starRating) {
    query += ' AND h.star_rating = ?';
    params.push(starRating);
  }
  if (minPrice) {
    query += ' AND hr.price_per_night >= ?';
    params.push(minPrice);
  }
  if (maxPrice) {
    query += ' AND hr.price_per_night <= ?';
    params.push(maxPrice);
  }
  if (rooms) {
    query += ' AND hr.available_quantity >= ?';
    params.push(rooms);
  }
  if (adults) {
    query += ' AND hr.max_occupancy >= ?';
    params.push(adults);
  }
  const rows = await db.all(query, params);
  // Group by hotel
  const hotelsMap = {};
  rows.forEach(row => {
    if (!hotelsMap[row.id]) {
      let amenitiesArr = [];
      try { amenitiesArr = JSON.parse(row.hotel_amenities); } catch {};
      let imagesArr = [];
      try { imagesArr = JSON.parse(row.hotel_images); } catch {};
      hotelsMap[row.id] = {
        id: row.id,
        name: row.name,
        location: row.location,
        star_rating: row.star_rating,
        amenities: amenitiesArr,
        check_in_time: row.check_in_time,
        check_out_time: row.check_out_time,
        images: imagesArr,
        rating: row.rating,
        review_count: row.review_count,
        rooms: []
      };
    }
    // Room info
    let roomAmenities = [];
    try { roomAmenities = JSON.parse(row.room_amenities); } catch {};
    hotelsMap[row.id].rooms.push({
      room_id: row.room_id,
      room_type: row.room_type,
      price_per_night: row.price_per_night,
      max_occupancy: row.max_occupancy,
      available_quantity: row.available_quantity,
      amenities: roomAmenities
    });
  });
  return Object.values(hotelsMap);
}

async function getHotelById(id) {
  const db = await getDBConnection();
  const hotel = await db.get(`SELECT * FROM hotels WHERE id = ?`, [id]);
  if (!hotel) return null;
  // Parse hotel JSON fields
  let amenitiesArr = [];
  try { amenitiesArr = JSON.parse(hotel.amenities); } catch {}
  let imagesArr = [];
  try { imagesArr = JSON.parse(hotel.images); } catch {}
  // Get rooms
  const roomsRows = await db.all(`SELECT * FROM hotel_rooms WHERE hotel_id = ?`, [id]);
  const rooms = roomsRows.map(r => {
    let roomAmenities = [];
    try { roomAmenities = JSON.parse(r.amenities); } catch {}
    return {
      room_id: r.id,
      room_type: r.room_type,
      price_per_night: r.price_per_night,
      max_occupancy: r.max_occupancy,
      available_quantity: r.available_quantity,
      amenities: roomAmenities
    };
  });
  return {
    id: hotel.id,
    name: hotel.name,
    location: hotel.location,
    star_rating: hotel.star_rating,
    amenities: amenitiesArr,
    check_in_time: hotel.check_in_time,
    check_out_time: hotel.check_out_time,
    images: imagesArr,
    rating: hotel.rating,
    review_count: hotel.review_count,
    rooms
  };
}

module.exports = {
  searchHotels,
  getHotelById
};
