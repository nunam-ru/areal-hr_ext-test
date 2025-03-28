const express = require('express')
const router = express.Router()
const pool = require('./../services/db')
const { StatusCodes } = require('http-status-codes')

const {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departments_controller')

const departmentSchema = require('../controllers/departments_val')

router.get('/departments', async (req, res) => {
  try {
    const departments = await getDepartments()
    return res.json(departments)
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
