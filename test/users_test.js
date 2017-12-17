#!/usr/bin/env node
'use strict'
const log = require('winston')
const app = require('../app')
const chai = require('chai')
const chaiHttp = require('chai-http')
const chaiJsonEqual = require('chai-json-equal')
const util = require('../util')
const User = require('../model/userModel')
const expect = require('chai').expect
const mongoose = require('mongoose')
let server

chai.should()
chai.use(chaiHttp)
chai.use(chaiJsonEqual)
const url = 'http://127.0.0.1:8081'

describe('Users', () => {
  // Before our test suite
  before(function (done) {
    // Start our app on an alternative port for acceptance tests
    mongoose.connect('mongodb://localhost/users', {
      useMongoClient: true
    }).then(() => {
      server = app.listen(8081, () => {
        log.info(`Listening at ${url} for acceptance tests`)
      })
    }).then(() => util.importFile('./users.json')).then(() => done()).catch(err => {
      log.error(`Failed to connect to MongoDB: ${err}`)
      process.exit(1)
    })
  })

  // test of CRUDL List operation
  describe('/GET users', function () {
    it('should return a list of users', function (done) {
      chai.request(url)
        .get('/users')
        .end(function (err, res) {
          res.body.should.be.a('array')
          res.should.have.status(200)
          res.body.length.should.be.eql(100)
          done()
        })
    })
  })

// test of CRUDL Read operation
  describe('/GET users/:id', function () {
    it('should return a single user', function (done) {
      // Find a user in the DB
      User.findOne({}, function (err, user) {
        var id = user._id

        // Read this user by id
        chai.request(url)
          .get('/users/' + id)
          .end(function (err, res) {
            res.should.have.status(200)
            expect(res.body).to.be.a('object')
            expect(res.body.name.first).to.be.a('string')
            done()
          })
      })
    })
  })

// test of CRUDL Create operation
  describe('/POST users', function () {
    const user = require('./test_user.json')
    let userid
    it('should add a single user', function (done) {
      chai.request(url)
        .post('/users')
        .send(user)
        .end(function (err, res) {
          res.should.have.status(200)
          expect(res.body).to.be.a('object')
          res.body.should.have.property('_id')
          userid = res.body._id
          done()
        })
    })
    it('should check if added user exists', function (done) {
      expect(userid).to.not.be.undefined
      User.findById(userid, function (err, checkedUser) {
        expect(err).to.not.be.true
        var obj = checkedUser.toObject()
        delete obj.__v
        delete obj._id // deletes mongodb columns for comparison
        obj.should.jsonEqual(user)
        done()
      })
    })

  })

// test of CRUDL Update operation
  describe('/PUT users/:id', function () {
    var user = require('./test_user.json')
    var userid
    it('should update a single user', function (done) {
      User.findOne({}, function (err, randomUser) {
        userid = randomUser._id
        chai.request(url)
          .put('/users/' + userid)
          .send(user)
          .end(function (err, res) {
            res.should.have.status(200)
            done()
          })
      })

    })
    it('should check if updated user is equal to data updated', function (done) {
      expect(userid).to.not.be.undefined
      User.findById(userid, function (err, checkedUser) {
        expect(err).to.not.be.true
        var obj = checkedUser.toObject()
        delete obj.__v
        delete obj._id  // deletes mongodb columns for comparison
        obj.should.jsonEqual(user)
        done()
      })
    })
  })

// test of CRUDL DELETE operation
  describe('/DELETE users/:id', function () {
    var userid
    it('should delete a single user', function (done) {
      User.findOne({}, function (err, randomUser) {
        userid = randomUser._id
        chai.request(url)
          .delete('/users/' + userid)
          .end(function (err, res) {
            res.should.have.status(200)
            done()
          })
      })
    })
    it('should check if deleted user doesn\'t exist', function (done) {
      expect(userid).to.not.be.undefined
      User.findById(userid, function (err, checkedUser) {
        expect(checkedUser).to.be.null
        done()
      })
    })
  })

  after(() => server.close(() => log.info('Server closed.')))
})
