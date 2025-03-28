const express = require('express')
const router = express.Router()
const pool = require('./../services/db')

const {
  getDepartments,
} = require('../controllers/departments_controller')

router.get('/departments', async (req, res) => {
  try {
    const departments = await getDepartments()
    return res.json(departments)
  } catch (err) {
    console.error('Error departments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

module.exports = router
