const express = require('express')
const router = express.Router()
const pool = require('./../services/db')
const { StatusCodes } = require('http-status-codes')

const {
  getOrganizations,
  addOrganization,
  updateOrganization,
  deleteOrganization,
} = require('../controllers/organizations_controller')

const organizationSchema = require('../controllers/organizations_val')

router.get('/organizations', async (req, res) => {
  try {
    const organizations = await getOrganizations()
    return res.json(organizations)
  } catch (err) {
    console.error('Error organizations:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
})


router.post('/organizations', async (req, res) => {
  try {
    const { error, value } = organizationSchema.validate(req.body, {
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

    const { name, comment } = value
    const newOrganization = await addOrganization(
      req,
      name,
      comment,
    )
    return res.status(StatusCodes.CREATED).json(newOrganization)
  } catch (err) {
    console.error('Error organizations:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.put('/organizations/:id', async (req, res) => {
  try {
    const { error, value } = organizationSchema.validate(req.body, {
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
    const { name, comment } = value

    const updatedOrganization = await updateOrganization(
      req,
      id,
      name,
      comment,
    )
    return res.status(StatusCodes.CREATED).json(updatedOrganization)
  } catch (err) {
    console.log(err)
  }
})

router.delete('/organizations/:id', async (req, res) => {
  const { id } = req.params
  try {
    const deletedOrganization = await deleteOrganization(id)
    return res.status(StatusCodes.CREATED).json(deletedOrganization)
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
