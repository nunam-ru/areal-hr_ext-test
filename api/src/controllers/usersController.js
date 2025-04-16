const pool = require('../services/db')
const argon2 = require('argon2')
const { addChangelog, compileChangelog } = require('./changelogController')
const objectID = 5 //id users = 5

async function getUsers(page = 1) {
  const connection = await pool.connect()
  try {
    if (!parseInt(page)) {
      page = 1
    }
    const result = await connection.query(
      "SELECT users.id, \
      last_name, \
      first_name, \
      third_name, \
      login, \
      password, \
      roles.name AS roles_name \
      FROM users \
      JOIN roles ON users.role_id = roles.id \
      WHERE deleted_at IS NULL \
      ORDER BY users.id \
      LIMIT 10 OFFSET ($1-1)*10;",
      [page]
    )
    return result.rows
  } catch (err) {
    console.log(err)
  } finally {
    connection.release()
  }
}

async function countUsrRecords() {
  const connection = await pool.connect()
    try {
      await connection.query('BEGIN')
      const result = await connection.query(
        "SELECT COUNT(id) FROM users WHERE deleted_at IS NULL",
      )
      return result.rows
    } catch (err) {
      console.log(err)
    } finally {
      connection.release()
    }
}

async function addUser(
  req,
  last_name,
  first_name,
  third_name,
  login,
  password,
) {
  const connection = await pool.connect()
  try {
    let changes = {}
    await connection.query('BEGIN')
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
    })

    const result = await connection.query(
      `INSERT INTO users \
      (last_name, first_name, third_name, \
      login, password, role_id, created_at) 
        VALUES ($1, $2, $3, $4, $5, 2, current_timestamp) RETURNING *`,
      [last_name, first_name, third_name, login, hashedPassword],
    )

    const Id = result.rows[0].id
    const newValue = `Фамилия: ${last_name}\nИмя: ${first_name}\nОтчество: ${third_name}\nЛогин: ${login}`

    changes = { 
      "object" : 'users', 
      "record" : parseInt(Id),
      "oldValue" : '',
      "newValue" : newValue
    }
    await addChangelog(objectID, changes, connection, req)

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    console.log(err)
  } finally {
    connection.release()
  }
}

async function updateUser(
  req,
  id,
  last_name,
  first_name,
  third_name,
  login,
  password,
  isResetPassword,
) {
  const connection = await pool.connect()
  try {
    let hashedPassword
    let query
    let values
    let newValue = ''
    let oldValue = ''
    let changelogData = {oldValue, newValue}
    let changes = {}
    await connection.query('BEGIN')
    const oldDataResult = await connection.query(
      'SELECT last_name, first_name, third_name, \
      login, roles.name \
      FROM users \
      JOIN roles on users.role_id = roles.id \
      WHERE users.id = $1',
      [id],
    )

    if (isResetPassword == 'true') {
      hashedPassword = await argon2.hash(password, {
        type: argon2.argon2id,
      })
      query = `UPDATE users \
        SET last_name = $1, first_name = $2, third_name = $3, \
        login = $4, password = $5, updated_at = current_timestamp \
        WHERE id = $6 RETURNING *`
      values = [last_name, first_name, third_name, login, hashedPassword, id]
      changelogData.newValue = `Пароль изменен`
    } else {
      query = `UPDATE users \
      SET last_name = $1, first_name = $2, third_name = $3, \
      login = $4, updated_at = current_timestamp \
      WHERE id = $5 RETURNING *`
      values = [last_name, first_name, third_name, login, id]

      changelogData = await compileChangelog(
        true, 'Фамилия', changelogData,
        oldDataResult.rows[0].last_name, last_name
      )
      changelogData = await compileChangelog(
        true, 'Имя', changelogData,
        oldDataResult.rows[0].first_name, first_name
      )
      changelogData = await compileChangelog(
        true, 'Отчество', changelogData,
        oldDataResult.rows[0].third_name, third_name
      )
      changelogData = await compileChangelog(
        true, 'Логин', changelogData,
        oldDataResult.rows[0].login, login
      )
    }

    const result = await connection.query(query, values)

    changes = { 
      "object" : 'users', 
      "record" : parseInt(id),
      "oldValue" : changelogData.oldValue,
      "newValue" : changelogData.newValue
    }
    await addChangelog(objectID, changes, connection, req)

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    console.log(err)
  } finally {
    connection.release()
  }
}

async function deletedUser(id) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')

    // const result = await connection.query(
    //   'DELETE FROM users \
    //   WHERE id = $1 RETURNING *',
    //   [id],
    // )

    const result = await connection.query(
      'UPDATE users \
      SET deleted_at = current_timestamp \
      WHERE id = $1 RETURNING *',
      [id],
    )

    // await connection.query(
    //   `DELETE FROM changelog \
    //   WHERE changes->'record' = $1 and object = '5'`,
    //   [id],
    // )

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    console.log(err)
  } finally {
    connection.release()
  }
}

async function updateRole(req, id) {
  const connection = await pool.connect()
  try {
    let changes = {}
    await connection.query('BEGIN')
    const oldDataResult = await connection.query(
      'SELECT roles.name AS role_name \
      FROM users \
      JOIN roles ON users.role_id = roles.id \
      WHERE users.id = $1',
      [id],
    )
    const result = await connection.query(
      'UPDATE users \
      SET role_id = 1, updated_at = current_timestamp \
      WHERE id = $1 RETURNING *',
      [id],
    )

    const oldValue = `Роль: ${oldDataResult.rows[0].role_name}`
    const newValue = `Роль: Администратор`

    changes = { 
      "object" : 'users', 
      "record" : parseInt(id),
      "oldValue" : oldValue,
      "newValue" : newValue
    }
    await addChangelog(objectID, changes, connection, req)
    
    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    console.log(err)
  } finally {
    connection.release()
  }
}

module.exports = {
  getUsers,
  addUser,
  updateUser,
  deletedUser,
  updateRole,
  countUsrRecords,
}
  