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
        changes->'newValue' as newValue, \
		    changes->'oldValue' as oldValue \
        FROM changelog c \
        join users u on c.user_id = u.id \
        where object = $1 and changes->'record' = $2\
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
  req,
) {
  try {
    //const date = new Date()
    //const user_id = 1
    const user_id = req.user.id

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

async function compileChangelog(isUpdate, dataType, changelogData, oldData, newData){
  try {
    if (isUpdate === true) {
      if (oldData != newData) {
        changelogData.oldValue += `${dataType}: ${oldData}\n`
        changelogData.newValue += `${dataType}: ${newData}\n`
      }
    }
    else {
      changelogData.newValue += `${dataType}: ${newData}\n`
    }
    return changelogData
  }
  catch(err) {
    console.log(err)
  }
}

module.exports = {
    getChangelog,
    addChangelog,
    compileChangelog,
}
