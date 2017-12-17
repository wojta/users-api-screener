'use strict'
const User = require('../model/userModel')
const express = require('express')
const router = express.Router()

// GET /users
// Get a list of users
router.get('/', async (req, res) => {
  try {
    const query = User.find({})
    const users = await query.exec()
    return res.json(users)
  } catch (err) {
    return res.status(500).json({
      error: `Error listing users ${err}`
    })
  }
})

module.exports = router
