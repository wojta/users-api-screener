'use strict'
// const mongoose = require('mongoose')
const seeder = require('mongoose-seed')
const log = require('winston')
const asyncy = require('asyncy')

/**
 * Imports JSON file to the database
 * @param filename
 */
async function importFile (filename) {
  await asyncy.inline(seeder, seeder.connect, 'mongodb://localhost/users')
  seeder.loadModels(['./model/userModel.js'])
  await clearModels()
  const documents = require(filename)

  const userModelSeed = [{
    model: 'User',
    documents: documents.users
  }]

  return new Promise((resolve, reject) => {
    try {
      seeder.populateModels(userModelSeed, function (err) {
        if (err) {
          log.error(`Error importing file [${filename}]\n${err}`)
          reject(err)
        }
        log.info(`Successfully imported file [${filename}].`)
        resolve()
      })
    } catch (err) {
      reject(err)
    }
  })
}

async function clear () {
  await asyncy.inline(seeder, seeder.connect, 'mongodb://localhost/users')
  seeder.loadModels(['./model/userModel.js'])
  await clearModels()
}

async function clearModels () {
  await asyncy.inline(seeder, seeder.clearModels, ['User'])
}

module.exports = {importFile: importFile, clear: clear}
