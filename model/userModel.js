'use strict'
const mongoose = require('mongoose')

const User = mongoose.model('User', {
  gender: String,
  name: Object,
  location: Object,
  email: String,
  username: String,
  password: String,
  salt: String,
  md5: String,
  sha1: String,
  sha256: String,
  registered: Number,
  dob: Number,
  phone: String,
  cell: String,
  PPS: String,
  picture: Object
})

module.exports = User
