const pool = require('./../services/db')

async function getPositions() {
    const connection = await pool.connect()
    try {
      const result = await connection.query(
        "SELECT positions.id, \
        positions.name AS position_name, \
        departments.name AS department_name, \
        dep_id \
        FROM positions \
        JOIN departments ON positions.dep_id = departments.id",
      )
      return result.rows
    } catch (err) {
      logger.error(`${fetching} positions: ${err.message}`, {
        stack: err.stack,
      })
      throw err
    } finally {
      connection.release()
    }
  }

  module.exports = {
    getPositions,
  }