const express = require('express')
const router = express.Router()
const pool = require('../services/db')

const {
  getUsers,
} = require('../controllers/usersController')

router.get('/users', async (req, res) => {
  try {
    const users = await getUsers()
    return res.json(users)
  } catch (err) {
    console.error('Error users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

module.exports = router
