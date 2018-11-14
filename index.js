const TestRunner = require('test-runner')

class TAPView {
  start (count) {
    console.log(`1..${count}`)
  }
  testPass (test) {
    console.log(`ok ${test.id} ${test.name}`)
  }
  testFail (test) {
    console.log(`not ok ${test.id} ${test.name}`)
  }
}

const runner = new TestRunner({ view: new TAPView() })

module.exports = runner
