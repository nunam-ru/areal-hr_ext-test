const express = require('express')
const router = express.Router()
const pool = require('../services/db')
const { StatusCodes } = require('http-status-codes')
const multer = require('multer')

const objectID = 4 //id employees = 4

const {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  countEmpRecords,
} = require('../controllers/employeesController')

const { getChangelog, } = require('../controllers/changelogController')

const employeeSchema = require('../controllers/val/employeesVal')
const { addFile } = require('../controllers/filesController')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.get('/employees', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const employees = await getEmployees(page)
    return res.json(employees)
  } catch (err) {
    console.error('Error employees:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.get('/employees/pages', async (req, res) => {
  try {
    const pages = await countEmpRecords()
    return res.json(pages)
  } catch (err) {
    console.error('Error employees:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.get('/employees/changelog/:id', async (req, res) => {
  try {
    const { id } = req.params
    const empChangelog = await getChangelog(objectID, id)
    return res.json(empChangelog)
  } catch (err) {
    console.error('Error employees:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.post('/employees', upload.array('files', 10), async (req, res) => {
  const connection = await pool.connect()
  try {
    const { error, value } = employeeSchema.validate(req.body, {
      abortEarly: false,
    })

    if (error) {
      const errorMessages = error.details.reduce((acc, detail) => {
        acc[detail.path[0]] = detail.message
        return acc
      }, {})
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errorMessages })
    }

    const {
      last_name,
      first_name,
      third_name,
      birth_date,
      passport_series,
      passport_number,
      passport_code,
      passport_by,
      passport_date,
      address,
      dep_id,
      pos_id,
      salary,
    } = value

    await connection.query('BEGIN')

    const employeeId = await addEmployee(
      req,
      last_name,
      first_name,
      third_name,
      birth_date,
      passport_series,
      passport_number,
      passport_code,
      passport_by,
      passport_date,
      address,
      dep_id,
      pos_id,
      salary,
    )
    for (let file of req.files) {
      await addFile(req, employeeId, file, connection)
    }
    await connection.query('COMMIT')
    return res
      .status(StatusCodes.CREATED)
      .json({ id: employeeId, message: 'Employee added successfully' })
  } catch (err) {
    console.error('Error employees:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release()
  }
})

router.post('/employees/:id', async (req, res) => {
  const { id } = req.params
  try {
    const message = await deleteEmployee(req, id)
    return res.status(StatusCodes.CREATED).json({ message })
  } catch (err) {
    console.log(err)
  }
})

router.put('/employees/:id', async (req, res) => {
  try {
    const { error, value } = employeeSchema.validate(req.body, {
      abortEarly: false,
    })

    if (error) {
      const errorMessages = error.details.reduce((acc, detail) => {
        acc[detail.path[0]] = detail.message
        return acc
      }, {})
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errorMessages })
    }

    const { id } = req.params
    const {
      last_name,
      first_name,
      third_name,
      birth_date,
      passport_series,
      passport_number,
      passport_code,
      passport_by,
      passport_date,
      address,
      dep_id,
      pos_id,
      salary,
    } = value
    const message = await updateEmployee(
      req,
      id,
      last_name,
      first_name,
      third_name,
      birth_date,
      passport_series,
      passport_number,
      passport_code,
      passport_by,
      passport_date,
      address,
      dep_id,
      pos_id,
      salary,
    )
    return res.status(StatusCodes.CREATED).json({ message })
  } catch (err) {
    console.log(err)
  }
})
module.exports = router
