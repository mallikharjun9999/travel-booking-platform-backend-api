const getDBConnection = require('../config/database');

async function searchFlights(filters) {
  const db = await getDBConnection();
  const { from, to, departDate } = filters;

  const query = `
    SELECT f.*, a.name as airline_name, 
           sa.code as source_code, sa.city as source_city,
           da.code as dest_code, da.city as dest_city
    FROM flights f
    JOIN airlines a ON f.airline_id = a.id
    JOIN airports sa ON f.source_airport_id = sa.id
    JOIN airports da ON f.destination_airport_id = da.id
    WHERE sa.code = ? AND da.code = ? AND date(f.departure_time) = ?
  `;

  const results = await db.all(query, [from, to, departDate]);
  console.log(results);
  const results2 = await db.get("select * from flights where date(departure_time) = ?", ['2024-07-15']); 
  console.log(results2);
  return results;
}

async function getFlightById(id) {
  const db = await getDBConnection();
  const query = `
    SELECT f.*, a.name as airline_name,
           sa.code as source_code, sa.city as source_city,
           da.code as dest_code, da.city as dest_city
    FROM flights f
    JOIN airlines a ON f.airline_id = a.id
    JOIN airports sa ON f.source_airport_id = sa.id
    JOIN airports da ON f.destination_airport_id = da.id
    WHERE f.id = ?
  `;
  return db.get(query, [id]);
}

module.exports = {
  searchFlights,
  getFlightById
};