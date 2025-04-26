const express = require('express')
const router = express.Router()
const pool = require('../services/db')
const { StatusCodes } = require('http-status-codes')

const objectID = 3 //id positions = 3

const {
  getPositions,
  addPosition,
  updatePosition,
  deletePosition,
  countPosRecords,
} = require('../controllers/positionsController')

const { getChangelog, } = require('../controllers/changelogController')

const positionSchema = require('../controllers/val/positionsVal')


router.get('/positions', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { 
        page = 1, 
        sort_type = 'id',
        order_by = 'asc' } = req.query;
      const positions = await getPositions(page, sort_type, order_by)
      return res.json(positions)
    } catch (err) {
      console.error('Error positions:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})

router.get('/positions/pages', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const pages = await countPosRecords()
      return res.json(pages)
    } catch (err) {
      console.error('Error positions:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})

router.get('/positions/changelog/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { id } = req.params
      const posChangelog = await getChangelog(objectID, id)
      return res.json(posChangelog)
    } catch (err) {
      console.error('Error positions:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})


router.post('/positions', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { error, value } = positionSchema.validate(req.body, {
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

      const { name, dep_id } = value
      const newPosition = await addPosition(
        req,
        name,
        dep_id,
      )
      return res.status(StatusCodes.CREATED).json(newPosition)
    } catch (err) {
      console.error('Error positions:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})

router.put('/positions/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { error, value } = positionSchema.validate(req.body, {
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
      const { name, dep_id } = value

      const updatedPosition = await updatePosition(
        req,
        id,
        name,
        dep_id,
      )
      return res.status(StatusCodes.CREATED).json(updatedPosition)
    } catch (err) {
      console.log(err)
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})

router.delete('/positions/:id', async (req, res) => {
  if (req.isAuthenticated()) {
  const { id } = req.params
    try {
      const deletedPosition = await deletePosition(id)
      return res.status(StatusCodes.CREATED).json(deletedPosition)
    } catch (err) {
      console.log(err)
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})

module.exports = router
