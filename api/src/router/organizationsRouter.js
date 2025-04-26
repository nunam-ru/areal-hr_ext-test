const express = require('express')
const router = express.Router()
const pool = require('../services/db')
const { StatusCodes } = require('http-status-codes')

const objectID = 1 //id organizations = 1

const {
  getOrganizations,
  addOrganization,
  updateOrganization,
  deleteOrganization,
  countOrgRecords,
} = require('../controllers/organizationsController')

const { getChangelog, } = require('../controllers/changelogController')

const organizationSchema = require('../controllers/val/organizationsVal')

router.get('/organizations', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { 
        page = 1, 
        sort_type = 'id',
        order_by = 'asc' } = req.query;
      const organizations = await getOrganizations(page, sort_type, order_by)
      return res.json(organizations)
    } catch (err) {
      console.error('Error organizations:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })

})

router.get('/organizations/pages', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const pages = await countOrgRecords()
      return res.json(pages)
    } catch (err) {
      console.error('Error organizations:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})

router.get('/organizations/changelog/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { id } = req.params
      const orgChangelog = await getChangelog(objectID, id)
      return res.json(orgChangelog)
    } catch (err) {
      console.error('Error organizations:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})


router.post('/organizations', async (req, res) => {
  if (req.isAuthenticated()) {
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
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})

router.put('/organizations/:id', async (req, res) => {
  if (req.isAuthenticated()) {
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
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})

router.delete('/organizations/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    const { id } = req.params
    try {
      const deletedOrganization = await deleteOrganization(id)
      return res.status(StatusCodes.CREATED).json(deletedOrganization)
    } catch (err) {
      console.log(err)
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})

module.exports = router
