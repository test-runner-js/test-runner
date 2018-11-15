const TestRunner = require('test-runner')
const yaml = require('js-yaml')

class TAPView {
  start (count) {
    console.log('TAP version 13')
    console.log(`1..${count}`)
  }
  testPass (test, result) {
    console.log(`ok ${test.id} ${test.name} ${result || ''}`)
  }
  testFail (test, err) {
    const error = {
      operator: err.operator,
      expected: err.expected,
      actual: err.actual,
      stack: err.stack,
    }
    console.log(`not ok ${test.id} ${test.name}`)
    console.log('  ---')
    console.log(yaml.safeDump(error).split('\n').map(l => l ? '  ' + l : '').join('\n'))
    console.log('  ...')
  }
  testSkip (test) {
    console.log(`ok ${test.id} ${test.name} # SKIP`)
  }
}
const runner = new TestRunner({ view: new TAPView() })
// const runner = new TestRunner()

module.exports = runner
