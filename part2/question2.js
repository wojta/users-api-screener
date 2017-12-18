const sinon = require('sinon')
const expect = require('chai').expect

const wait = delay => new Promise((cb, j) => setTimeout(cb, delay))

async function remoteMathService (cb) {
  const {err: err1, num: one} = await callOneService()
  const {err: err2, num: two} = await callTwoService()
  const err = err1 || err2
  return cb(err, one + two)
}

async function callOneService () {
  await wait(1000)
  return {err: undefined, num: 1}
}

async function callTwoService () {
  await wait(1500)
  return {err: undefined, num: 2}
}

remoteMathService(function (err, answer) {
  if (err) console.log('error ', err)
  if (answer !== 3) {
    console.log('wrong answer', answer)
  } else {
    console.log('correct')
  }
})

function test () {
  // BEGIN TEST1 - default call check
  remoteMathService(function (err, answer) {

    expect(err).to.be.undefined
    expect(answer).to.equal(3)

    // END TEST1

    // make first call to fail
    const oldCallOneService = callOneService
    callOneService = async () => {
      return {err: 'fail1'}
    }

    // BEGIN TEST2 - service one fail
    remoteMathService(function (err, answer) {
      expect(err).to.equal('fail1')

      // END TEST2
      callOneService = oldCallOneService

      const oldCallTwoService = callTwoService
      callTwoService = async () => {
        return {err: 'fail2'}
      }

      // BEGIN TEST3 - service two fail
      remoteMathService(function (err, answer) {
        expect(err).to.equal('fail2')
        // END TEST3
        callTwoService = oldCallTwoService
      })
    })
  })

}

test()