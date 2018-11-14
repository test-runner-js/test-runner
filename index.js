const TestRunner = require('test-runner')

class TAPView {
  start (count) {
    console.log('TAP version 13')
    console.log(`1..${count}`)
  }
  testPass (test, result) {
    console.log(`ok ${test.id} ${test.name} ${result || ''}`)
  }
  testFail (test, err) {
    console.log(`not ok ${test.id} ${test.name}`)
    console.log(err)
  }
  testSkip (test) {
    console.log(`ok ${test.id} ${test.name} # SKIP`)
  }
}
const runner = new TestRunner({ view: new TAPView() })

module.exports = runner
