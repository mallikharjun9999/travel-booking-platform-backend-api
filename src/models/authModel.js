// ======================
// models/authModel.js
// ======================

const getDBConnection = require('../config/database')

async function createUser({ firstName, lastName, email, hashedPassword, phone, dob, passport }) {
  const db = await getDBConnection()
  const result = await db.run(
    `INSERT INTO users (first_name, last_name, email, password, phone, date_of_birth, passport_number)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [firstName, lastName, email, hashedPassword, phone, dob, passport]
  )
  return result.lastID
}

async function getUserByEmail(email) {
  const db = await getDBConnection()
  return db.get(`SELECT * FROM users WHERE email = ?`, [email])
}

module.exports = {
  createUser,
  getUserByEmail
}
