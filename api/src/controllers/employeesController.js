const pool = require('../services/db')

async function getEmployees() {
    const connection = await pool.connect()
    try {
      const result = await connection.query(
        "SELECT employees.id, \
        employees.last_name, \
        employees.first_name, \
        employees.third_name, \
        TO_CHAR(employees.birth_date, 'dd.MM.yyyy') AS birth_date, \
        employees.address, \
        employees.passport_series, \
        employees.passport_number \
        FROM employees  \
        ORDER BY employees.id",
      )
      return result.rows
    } catch (err) {
      console.log(err)
    } finally {
      connection.release()
    }
  }

  module.exports = {
    getEmployees,
  }