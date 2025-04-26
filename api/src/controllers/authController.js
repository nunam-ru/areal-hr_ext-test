const pool = require('../services/db')

async function getUserByLogin(login) {
  const connection = await pool.connect()
  try {
    const query = `
    SELECT \
    users.id, last_name, first_name, third_name, \
    password, roles.name AS role_name
    FROM users \
    JOIN roles ON users.role_id = roles.id \
    WHERE login = $1 AND deleted_at IS NULL
  `
    const result = await pool.query(query, [login])
    return result.rows[0]
  } catch (err) {
    console.log(err)
    throw err
  } finally {
    connection.release()
  }
}
async function getUserById(id) {
  const connection = await pool.connect()
  try {
    const query = `
    SELECT \
    users.id, \
    last_name, first_name, third_name, \
    roles.name AS role_name \
    FROM users \
    JOIN roles ON users.role_id = roles.id \
    WHERE users.id = $1 AND deleted_at IS NULL
  `
    const result = await pool.query(query, [id])

    return result.rows[0]
  } catch (err) {
    console.log(err)
    throw err
  } finally {
    connection.release()
  }
}

module.exports = { getUserByLogin, getUserById }
