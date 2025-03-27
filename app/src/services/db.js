require('dotenv').config({ path: '../.env' })
const { Pool } = require('pg')
const logger = require('./../logger/logger')
const { connect } = require('../errors/text-errors')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function testDatabaseConnection() {
  try {
    const client = await pool.connect()
    console.log('Connected to PostgreSQL')
    client.release()
  } catch (err) {
    logger.error(`${connect} db: ${err.message}`, {
      stack: err.stack,
    })
    process.exit(1)
  }
}
testDatabaseConnection()

module.exports = pool
