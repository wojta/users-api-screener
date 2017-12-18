// This is a mock database implementation with just a connect function
// db.connect will need to be called a total of 10 times before it successfully
// connects
let counter = 0
const db = {
  connect: function (cb) {
    console.log('connection attempt', counter + 1)
    if (counter < 92) {
      counter++
      return cb('db not ready yet')
    }
    return cb()
  }
}

const maxAttempts = 15
const exp = 2
let attempts = 0
let delay = 10

const cb = function (err) {
  if (err) {
    console.error(`(${delay}) ${err}`)
    if (attempts < maxAttempts) {
      delay *= exp
      setTimeout(() => db.connect(cb), delay)
    }
    return
  }
  console.log('successfully connected!')
}

db.connect(cb)
