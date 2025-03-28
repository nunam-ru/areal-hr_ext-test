const express = require('express')
const router = express.Router()
const pool = require('./../services/db')

const {
  getOrganizations,
} = require('../controllers/organizations_controller')

router.get('/organizations', async (req, res) => {
  try {
    const organizations = await getOrganizations()
    return res.json(organizations)
  } catch (err) {
    console.error('Error organizations:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

module.exports = router
