const pool = require('./../services/db')

async function getDepartments() {
    const connection = await pool.connect()
    try {
      const result = await connection.query(
        "SELECT d.id AS department_id, \
        d.name AS department_name, \
        pd.name AS parent_name, \
        pd.id as parent_id, \
        d.comment AS department_comment, \
        o.name AS organization_name, \
        o.id as org_id \
        FROM departments AS d \
        LEFT JOIN departments AS pd \
        ON d.parent_id = pd.id \
        LEFT JOIN organizations AS o ON d.org_id = o.id;",
      )
      return result.rows
    } catch (err) {
      console.log(err)
    } finally {
      connection.release()
    }
  }

async function addDepartment(req, name, comment, parent_id, org_id) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')
    let query
    let values
    let newValue
    let parent

    const organization = await connection.query(
      'SELECT name FROM organizations WHERE id = $1',
      [org_id],
    )

    if (parent_id) {
      query = `INSERT INTO departments (name, comment, parent_id, org_id, created_at) 
                VALUES ($1, $2, $3, $4, current_timestamp) RETURNING *`
      values = [name, comment, parent_id, org_id]
      parent = await connection.query(
        'SELECT name FROM departments WHERE id = $1',
        [parent_id],
      )
      newValue = `Название: ${name}\nКомментарий: ${comment}\nРодитель: ${parent.rows[0].name}\nОрганизация: ${organization.rows[0].name}`
    } else {
      query = `INSERT INTO departments (name, comment, org_id, created_at) 
                VALUES ($1, $2, $3, current_timestamp) RETURNING *`
      values = [name, comment, org_id]
      newValue = `Название: ${name}\nКомментарий: ${comment}\nОрганизация: ${organization.rows[0].name}`
    }

    const result = await connection.query(query, values)

    const departmentId = result.rows[0].id

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
    await connection.query('ROLLBACK')
    console.log(err)
  } finally {
    connection.release()
  }
}

async function updateDepartment(
  req,
  id,
  name,
  comment,
  parent_id,
  org_id,
) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')
    let query
    let values
    let parent
    let newValue = ''
    let oldValue = ''
    const oldDataResult = await connection.query(
      'SELECT d.name AS department_name, \
      pd.name AS parent_department_name, \
      d.comment AS department_comment, \
      o.name AS organization_name \
      FROM departments AS d \
      LEFT JOIN departments AS pd ON d.parent_id = pd.id \
      LEFT JOIN organizations AS o ON d.org_id = o.id \
      WHERE d.id = $1',
      [id],
    )
    const organization = await connection.query(
      'SELECT name FROM organizations WHERE id = $1',
      [org_id],
    )

    if (oldDataResult.rows[0].department_name != name) {
      oldValue += `Название: ${oldDataResult.rows[0].department_name}\n`
      newValue += `Название: ${name}\n`
    }
    if (oldDataResult.rows[0].department_comment != comment) {
      oldValue += `Комментарий: ${oldDataResult.rows[0].department_comment}\n`
      newValue += `Комментарий: ${comment}\n`
    }

    if (parent_id) {
      query = `UPDATE departments 
                SET name = $1, comment = $2, parent_id = $3, org_id = $4
                WHERE id = $5 RETURNING *`
      values = [name, comment, parent_id, org_id, id]
      parent = await connection.query(
        'SELECT name FROM departments WHERE id = $1',
        [parent_id],
      )
      if (oldDataResult.rows[0].parent_department_name != parent.rows[0].name) {
        oldValue += `Родитель: ${oldDataResult.rows[0].parent_department_name}\n`
        newValue += `Родитель: ${parent.rows[0].name}\n`
      }
    } else {
      query = `UPDATE departments 
                SET name = $1, comment = $2, parent_id = NULL, org_id = $3
                WHERE id = $4 RETURNING *`
      values = [name, comment, org_id, id]
    }
    if (oldDataResult.rows[0].organization_name != organization.rows[0].name) {
      oldValue += `Организация: ${oldDataResult.rows[0].organization_name}\n`
      newValue += `Организация: ${organization.rows[0].name}\n`
    }
    const result = await connection.query(query, values)

    await connection.query(
      `UPDATE departments
      SET org_id = $1
      WHERE parent_id = $2
      RETURNING *`,
      [org_id, id],
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

async function deleteDepartment(id) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')
    const result = await connection.query(
      'DELETE FROM departments WHERE id = $1 RETURNING *',
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
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
}