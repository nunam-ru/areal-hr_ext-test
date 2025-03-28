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
        o.id as organization_id \
        FROM departments AS d \
        LEFT JOIN departments AS pd \
        ON d.parent_id = pd.id \
        LEFT JOIN organizations AS o ON d.org_id = o.id;",
      )
      return result.rows
    } catch (err) {
      logger.error(`${fetching} departments: ${err.message}`, {
        stack: err.stack,
      })
      throw err
    } finally {
      connection.release()
    }
  }

  module.exports = {
    getDepartments,
  }