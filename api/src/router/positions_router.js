const express = require('express')
const router = express.Router()
const pool = require('./../services/db')

const {
  getPositions,
} = require('../controllers/positions_controller')

router.get('/positions', async (req, res) => {
  try {
    const positions = await getPositions()
    return res.json(positions)
  } catch (err) {
    console.error('Error positions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

module.exports = router
