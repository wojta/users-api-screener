'use strict'
const User = require('../model/userModel')
const express = require('express')
const router = express.Router()
const escapeRegexp = require('escape-string-regexp')

const wrapExceptions = fn =>
  (req, res) =>
    Promise.resolve(fn(req, res))
      .catch(err => res.status(500).json({error: `Error accessing /users: ${err}`})
      )

// GET /users
// Get a list of users
router.get('/', wrapExceptions(async (req, res) => {
  const username = req.query.username
  let query = User.find({})
  if (username) {
    query = User.find().where({'username': new RegExp(`.*${escapeRegexp(username)}.*`)})
  }
  const users = await query.exec()
  return res.json(users)
}))

// GET /users/:id
// Get a user by ID
router.get('/:id', wrapExceptions(async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id
  }).exec()
  if (!user) {
    return res.status(404).end()
  }
  return res.json(user)
}))

// POST /users
// Creates user, pass user object in request
router.post('/', wrapExceptions(async (req, res) => {
  const userModel = new User(req.body) // creates model usable by mongoose from JSON object in request
  const user = await User.create(userModel)
  return res.json(user)
}))

// PUT /users/:id
// Updates user by ID, pass user object in request
router.put('/:id', wrapExceptions(async (req, res) => {
  if (req.body._id) delete req.body._id // just for sure, don't allow _id to be passed in object, it can't be changed
  const user = await User.update({_id: req.params.id}, req.body).exec()
  return res.json(user)
}))

// DELETE /users/:id
// Deletes user by ID
router.delete('/:id', wrapExceptions(async (req, res) => {
  const removed = await User.remove({_id: req.params.id}).exec()
  res.status(200)
  return res.json({removed: removed})
}))

module.exports = router
