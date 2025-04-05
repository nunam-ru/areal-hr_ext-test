const express = require('express')
const router = express.Router()
const pool = require('../services/db')

const {
  getEmployees,
} = require('../controllers/employeesController')

router.get('/employees', async (req, res) => {
  try {
    const employees = await getEmployees()
    return res.json(employees)
  } catch (err) {
    console.error('Error employees:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

module.exports = router
