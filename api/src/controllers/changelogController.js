const pool = require('../services/db')

async function getChangelog(object, id) {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
        `SELECT c.id, \
        to_char(c.date, 'YYYY-MM-DD HH24:MI:SS') \
        as changelog_date, \
        (u.last_name || ' ' || LEFT(u.first_name, 1) \
        || '. ' || left(u.third_name, 1) || '.') as full_name,\
        changes \
        FROM changelog c \
        join users u on c.user_id = u.id \
        where changes @> '{"object" : 1}' and changes @> '{"recordId" : $2}'\
        order by c.id`,
      [object, id],
    )
    return result.rows
  } catch (err) {
    console.log(err)
  } finally {
    connection.release()
  }
}


async function addChangelog(
  object,
  changes,
  connection,
  //req,
) {
  try {
    //const date = new Date()
    //const user_id = req.id
    const user_id = 1

    await connection.query(
      `INSERT INTO changelog \
      (date, \
      object, \
      changes,
      user_id) \
       VALUES (current_timestamp, $1, $2, $3)`,
      [
        object,
        changes,
        user_id,
      ],
    )
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
    getChangelog,
    addChangelog,
}
