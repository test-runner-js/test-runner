const TestRunner = require('test-runner')
const yaml = require('js-yaml')

class TAPView {
  start (count) {
    console.log('TAP version 13')
    console.log(`1..${count}`)
  }
  testPass (test, result) {
    console.log(`ok ${test.index} ${test.name} ${result || ''}`)
  }
  testFail (test, err) {
    const error = Object.assign({}, err)
    // const error = err.code === 'ERR_ASSERTION'
    //   ? {
    //     operator: err.operator,
    //     expected: err.expected,
    //     actual: err.actual,
    //     stack: err.stack,
    //   }
    //   : err
    console.log(`not ok ${test.index} ${test.name}`)
    console.log('  ---')
    console.log(yaml.safeDump(error, { skipInvalid: true }).split('\n').map(l => l ? '  ' + l : '').join('\n'))
    console.log('  ...')
    process.exitCode = 1
  }
  testSkip (test) {
    console.log(`ok ${test.index} ${test.name} # SKIP`)
  }
}

module.exports = new TestRunner({ view: new TAPView() })
