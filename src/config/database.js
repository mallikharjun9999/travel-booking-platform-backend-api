const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
let database = null

const getDBConnection = async () => {
  try {
    database = await open({
      filename: path.join(__dirname, 'app.db'),
      driver: sqlite3.Database,
    })
    return database
    } 
    catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}
module.exports = getDBConnection;