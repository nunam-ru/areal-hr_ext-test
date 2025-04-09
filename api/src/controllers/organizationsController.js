const pool = require('../services/db')
const { addChangelog, compileChangelog } = require('./changelogController')
const objectID = 1 //id organizations = 1

async function getOrganizations() {
    const connection = await pool.connect()
    try {
      const result = await connection.query(
        "SELECT * FROM organizations WHERE deleted_at IS NULL;",
      )
      return result.rows
    } catch (err) {
      console.log(err)
    } finally {
      connection.release()
    }
  }

async function addOrganization(req, name, comment) {
  const connection = await pool.connect()
  try {
    let changes = {}

    await connection.query('BEGIN')
    const result = await connection.query(
      'INSERT INTO organizations (name, comment, created_at) \
      VALUES ($1, $2, current_timestamp) \
      ON CONFLICT (name) DO UPDATE \
      SET deleted_at = null, \
      comment = $2, \
      updated_at = current_timestamp \
      RETURNING id',
      [name, comment],
    )

    const organizationId = result.rows[0].id

    const newValue = `Название: ${name}\nКомментарий: ${comment}`

    changes = { 
      "object" : 'organizations', 
      "record" : organizationId,
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
async function updateOrganization(req, id, name, comment) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')

    let changes = {}

    const oldDataResult = await connection.query(
      'SELECT name, comment FROM organizations WHERE id = $1',
      [id],
    )

    const result = await connection.query(
      'UPDATE organizations SET name = $1, \
      comment = $2, \
      updated_at = current_timestamp WHERE id = $3',
      [name, comment, id],
    )
    let oldValue = ''
    let newValue = ''
    let changelogData = {oldValue, newValue}

    changelogData = await compileChangelog(
      true, 'Название', changelogData,
      oldDataResult.rows[0].name, name
    )

    changelogData = await compileChangelog(
      true, 'Комментарий', changelogData,
      oldDataResult.rows[0].comment, comment
    )

    changes = { 
      "object" : 'organizations', 
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
async function deleteOrganization(id) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')
    // const result = await connection.query(
    //   'DELETE FROM organizations WHERE id = $1',
    //   [id],
    // )

    const result = await connection.query(
      'UPDATE organizations \
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
  getOrganizations,
  addOrganization,
  updateOrganization,
  deleteOrganization,
}
  