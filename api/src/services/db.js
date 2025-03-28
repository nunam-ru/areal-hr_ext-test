require('dotenv').config({ path: '../.env' })
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function testDatabaseConnection() {
  try {
    const client = await pool.connect()
    console.log('Connected to PostgreSQL')
    client.release()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}
testDatabaseConnection()

module.exports = pool
