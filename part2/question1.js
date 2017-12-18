const sinon = require('sinon')
const expect = require('chai').expect

function doThing (callback) {
  callback(null, 'result')
}

function foo (callback) {
  doThing(function (err, res) {
    if (err) {
      callback(err)
    } else {
      callback(null, res)
    }
  })
}

function test () {

  let e = null
  let r = null
  // BEGIN TEST1 - check error branch

  // callback passes it to outside variables, attach sinon spy to check for call count
  const callback = sinon.spy(function (err, res) {
    e = err
    r = res
  })
  // override doThing to return error
  doThing = function (callback) {
    callback('error')
  }
  foo(callback)
  expect(callback.calledOnce).to.be.true
  expect(e).to.equal('error')
  expect(r).to.be.undefined

  // END TEST1

  // reset values
  e = null
  r = null
  callback.reset()
  // BEGIN TEST2 - check correct result branch
  // override doThing to return correct result
  doThing = function (callback) {
    callback(null, 'result')
  }
  foo(callback)
  expect(callback.calledOnce).to.be.true
  expect(e).to.be.null
  expect(r).to.equal('result')
  // END TEST2
}

foo(function (err, res) {
  console.log('Done!. err=', err, ' : res = ', res)
})

test()