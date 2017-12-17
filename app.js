#!/usr/bin/env node
'use strict'

const app = require('express')() // initializing Express
const bodyParser = require('body-parser') // JSON body parsing
const log = require('winston') // logger
const morgan = require('morgan') // morgan request logging
const util = require('./util')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const api = require('./users-api/api')

const yargs = require('yargs')
yargs
  .usage('Usage: $0 [options]')
  .options({
    'import': {
      alias: 'i',
      description: '<filename> Imports data from file to the database',
      type: 'string',
      nargs: 1,
      requiresArg: true
    },
    'clear': {alias: 'c', description: 'clears the database'}
  }).conflicts('import', 'clear')
  .example('./app.js', 'Starts server')
  .example('./app.js --import users.json', 'Imports file users.json to the database')
  .example('./app.js --clear', 'Clears the database')

app.use((req, res, next) => {
  res.header('Content-Type', 'application/json')
  next()
})
app.use(bodyParser.json())
app.use(morgan('dev'))

// set up route for users JSON api
app.use('/users', api)

const argv = yargs.argv
if (argv.import) {
  log.info('import')
  util.importFile(argv.import).then(() => process.exit(0)).catch(err => {
    if (err) {
      log.error(err)
      process.exit(1)
    }
  })
} else if (argv.clear) {
  log.info('clear')
  util.clear().then(() => process.exit(0)).catch(err => {
    if (err) {
      log.error(err)
      process.exit(1)
    }
  })
} else {
  mongoose.connect('mongodb://localhost/users', {
    useMongoClient: true
  }).then(() => {
    app.listen(8080, () => {
      log.info('Listening at http://localhost:8080')
    })
  }).catch(err => {
    log.error(`Failed to connect to MongoDB: ${err}`)
    process.exit(1)
  })
}
