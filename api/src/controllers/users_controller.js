const pool = require('./../services/db')

async function getUsers() {
    const connection = await pool.connect()
    try {
      const result = await connection.query(
        "SELECT users.id, \
        last_name, \
        first_name, \
        third_name, \
        login, \
        password, \
        roles.name \
        FROM users \
        JOIN roles ON users.role_id = roles.id",
      )
      return result.rows
    } catch (err) {
      logger.error(`${fetching} users: ${err.message}`, {
        stack: err.stack,
      })
      throw err
    } finally {
      connection.release()
    }
  }

  module.exports = {
    getUsers,
  }