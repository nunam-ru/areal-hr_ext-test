const pool = require('./../services/db')

async function getEmployees() {
    const connection = await pool.connect()
    try {
      const result = await connection.query(
        "SELECT employees.id, employees.last_name, employees.first_name FROM employees",
      )
      return result.rows
    } catch (err) {
      logger.error(`${fetching} employees: ${err.message}`, {
        stack: err.stack,
      })
      throw err
    } finally {
      connection.release()
    }
  }

  module.exports = {
    getEmployees,
  }