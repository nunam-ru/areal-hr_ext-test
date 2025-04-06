const pool = require('../services/db')
const path = require('path')

const { addChangelog } = require('./changelogController')

const fs = require('fs').promises
const storagePath = '../files/'

async function getFiles(emp_id) {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      'SELECT files.id as file_id, \
      files.name as file_name, \
      files.path as filepath \
      FROM files \
      JOIN employees ON files.emp_id = employees.id \
      WHERE emp_id = $1',
      [emp_id],
    )
    return result.rows
  } catch (err) {
    console.log(err)
  } finally {
    connection.release()
  }
}

async function addFile(req, emp_id, file, connection) {
  const { last_name } = req.body
  const { first_name } = req.body
  const { third_name } = req.body

  let fileName
  const { numberfile } = await getNumberFilesEmployee(emp_id)
  if (third_name == null) {
    fileName =
      last_name.toLowerCase() +
      '-' +
      first_name.toLowerCase() +
      '-' +
      emp_id +
      '-№' +
      numberfile //+
      //path.extname(file.originalname)
  } else {
    fileName =
      last_name.toLowerCase() +
      '-' +
      first_name.toLowerCase() +
      '-' +
      third_name.toLowerCase() +
      '-' +
      emp_id +
      '-№' +
      numberfile //+
      //path.extname(file.originalname)
  }

  const filePath = await saveFile(file, fileName)
  try {
    await connection.query('BEGIN')
    const result = await connection.query(
      'INSERT INTO files \
      (name, path, emp_id, created_at) \
      VALUES ($1, $2, $3, current_timestamp) RETURNING id',
      [fileName, filePath, emp_id],
    )

    const newValue = `Добавлен файл ${fileName}`

    changes = { 
        "object" : 4, 
        "record" : parseInt(emp_id),
        "oldValue" : '',
        "newValue" : newValue
    }
    await addChangelog(4, changes, connection, req)

    await connection.query('COMMIT')
    return result.rows[0]
  } catch (err) {
        await connection.query('ROLLBACK')
        console.log(err)
  }
}

async function deleteFile(req, fileId, connection) {
  try {
    await connection.query('BEGIN')
    const oldDataResult = await connection.query(
      'SELECT name, emp_id FROM files WHERE id = $1',
      [fileId],
    )
    const result = await connection.query(
      'DELETE FROM files WHERE id = $1',
      [fileId],
    )

    const newValue = `Удален файл ${oldDataResult.rows[0].name}`

    changes = { 
        "object" : 4, 
        "record" : parseInt(oldDataResult.rows[0].emp_id),
        "oldValue" : '',
        "newValue" : newValue
    }
    await addChangelog(4, changes, connection, req)

    await connection.query('COMMIT')
    return result.rowCount
  } catch (err) {
        console.log(err)    
  }
}

async function getNumberFilesEmployee(emp_id) {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      'SELECT (COUNT(files.id)+1) as numberFile \
      FROM files \
      JOIN employees ON files.emp_id = employees.id \
      WHERE emp_id = $1',
      [emp_id],
    )

    return result.rows[0]
  } catch (err) {
        console.log(err)
  } finally {
    connection.release()
  }
}

async function getFileById(fileId) {
  const connection = await pool.connect()
  try {
    const result = await connection.query(
      'SELECT * FROM files WHERE id = $1',
      [fileId],
    )

    return result.rows[0]
  } catch (err) {
        console.log(err)
  } finally {
    connection.release()
  }
}

async function saveFile(file, fileName) {

    const filePath = path.join(
      storagePath,
      fileName + path.extname(file.originalname),
    )
  
    try {
      await fs.access(storagePath)
    } catch {
      await fs.mkdir(storagePath, { recursive: true })
    }
  
    await fs.writeFile(filePath, file.buffer)
    return filePath
}
  
async function deleteFileFromSystem(filepath) {
    try {
      await fs.unlink(filepath)
      return true
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
  getFiles,
  addFile,
  deleteFile,
  getNumberFilesEmployee,
  getFileById,
  saveFile,
  deleteFileFromSystem,
}
