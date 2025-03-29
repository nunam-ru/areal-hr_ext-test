const express = require('express')
const router = express.Router()
const pool = require('./../services/db')
const { StatusCodes } = require('http-status-codes')

const {
  getPositions,
  addPosition,
  updatePosition,
  deletePosition,
} = require('../controllers/positions_controller')

const positionSchema = require('../controllers/positions_val')


router.get('/positions', async (req, res) => {
  try {
    const positions = await getPositions()
    return res.json(positions)
  } catch (err) {
    console.error('Error positions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.post('/positions', async (req, res) => {
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
})

router.put('/positions/:id', async (req, res) => {
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
})

router.delete('/positions/:id', async (req, res) => {
  const { id } = req.params
  try {
    const deletedPosition = await deletePosition(id)
    return res.status(StatusCodes.CREATED).json(deletedPosition)
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
