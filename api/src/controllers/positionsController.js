const pool = require('../services/db')
const { addChangelog } = require('./changelogController')

async function getPositions() {
    const connection = await pool.connect()
    try {
      const result = await connection.query(
        "SELECT positions.id, \
        positions.name AS position_name, \
        departments.name AS department_name, \
        dep_id \
        FROM positions \
        JOIN departments ON positions.dep_id = departments.id \
        WHERE positions.deleted_at IS NULL",
      )
      return result.rows
    } catch (err) {
      console.log(err)
    } finally {
      connection.release()
    }
  }

async function addPosition(req, name, dep_id) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')

    let changes = {}

    const result = await connection.query(
      `INSERT INTO positions (name, dep_id, created_at) 
        VALUES ($1, $2, current_timestamp) RETURNING *`,
      [name, dep_id],
    )

    const positionId = result.rows[0].id
    const department = await connection.query(
      'SELECT name FROM departments WHERE id = $1',
      [dep_id],
    )
    const newValue = `Название: ${name}\nОтдел: ${department.rows[0].name}`

    changes = { 
      "object" : 3, 
      "record" : positionId,
      "oldValue" : '',
      "newValue" : newValue
    }
    await addChangelog(3, changes, connection, req)

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    console.log(err)
  } finally {
    connection.release()
  }
}

async function updatePosition(req, id, name, dep_id) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')

    let changes = {}

    const oldDataResult = await connection.query(
      'SELECT positions.name as positions_name, departments.name as departments_name FROM positions join departments on positions.dep_id = departments.id WHERE positions.id = $1',
      [id],
    )

    const result = await connection.query(
      `UPDATE positions 
        SET name = $1, dep_id = $2, updated_at = current_timestamp
        WHERE id = $3 RETURNING *`,
      [name, dep_id, id],
    )
    const department = await connection.query(
      'SELECT name FROM departments WHERE id = $1',
      [dep_id],
    )
    let oldValue = ''
    let newValue = ''
    if (oldDataResult.rows[0].positions_name != name) {
      oldValue += `Название: ${oldDataResult.rows[0].positions_name}\n`
      newValue += `Название: ${name}\n`
    }
    if (oldDataResult.rows[0].departments_name != department.rows[0].name) {
      oldValue += `Отдел: ${oldDataResult.rows[0].departments_name}\n`
      newValue += `Отдел: ${department.rows[0].name}\n`
    }

    changes = { 
      "object" : 3, 
      "record" : parseInt(id),
      "oldValue" : oldValue,
      "newValue" : newValue
    }
    await addChangelog(3, changes, connection, req)

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    console.log(err)
  } finally {
    connection.release()
  }
}

async function deletePosition(id) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')
    // const result = await connection.query(
    //   'DELETE FROM positions WHERE id = $1 RETURNING *',
    //   [id],
    // )

    const result = await connection.query(
      'UPDATE positions \
      SET deleted_at = current_timestamp WHERE id = $1 RETURNING *',
      [id],
    )

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
  getPositions,
  addPosition,
  updatePosition,
  deletePosition,
}