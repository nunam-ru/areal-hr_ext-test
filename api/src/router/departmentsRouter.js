const express = require('express')
const router = express.Router()
const pool = require('../services/db')
const { StatusCodes } = require('http-status-codes')

const objectID = 2 //id departments = 2

const {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  countDepRecords,
} = require('../controllers/departmentsController')

const { getChangelog, } = require('../controllers/changelogController')

const departmentSchema = require('../controllers/val/departmentsVal')

router.get('/departments', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const departments = await getDepartments(page)
    return res.json(departments)
  } catch (err) {
    console.error('Error departments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.get('/departments/pages', async (req, res) => {
  try {
    const pages = await countDepRecords()
    return res.json(pages)
  } catch (err) {
    console.error('Error departments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.get('/departments/changelog/:id', async (req, res) => {
  try {
    const { id } = req.params
    const depChangelog = await getChangelog(objectID, id)
    return res.json(depChangelog)
  } catch (err) {
    console.error('Error departments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.post('/departments', async (req, res) => {
  try {
    const { error, value } = departmentSchema.validate(req.body, {
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

    const { name, comment, parent_id, org_id } = value
    const newDepartment = await addDepartment(
      req,
      name,
      comment,
      parent_id,
      org_id,
    )
    return res.status(StatusCodes.CREATED).json(newDepartment)
  } catch (err) {
    console.error('Error departments:', err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: Internal })
  }
})

router.put('/departments/:id', async (req, res) => {
  try {
    const { error, value } = departmentSchema.validate(req.body, {
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
    const { name, comment, parent_id, org_id } = value

    const updatedDepartment = await updateDepartment(
      req,
      id,
      name,
      comment,
      parent_id,
      org_id,
    )
    return res.status(StatusCodes.CREATED).json(updatedDepartment)
  } catch (err) {
    console.log(err)
  }
})

router.delete('/departments/:id', async (req, res) => {
  const { id } = req.params
  try {
    const deletedDepartment = await deleteDepartment(id)
    return res.status(StatusCodes.CREATED).json(deletedDepartment)
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
