const pool = require('./../services/db')

async function getOrganizations() {
    const connection = await pool.connect()
    try {
      const result = await connection.query(
        "SELECT * FROM organizations",
      )
      return result.rows
    } catch (err) {
      console.log(err)
    } finally {
      connection.release()
    }
  }

  module.exports = {
    getOrganizations,
  }