class TAPView {
  start (count) {
    console.log('TAP version 13')
    console.log(`1..${count}`)
  }

  testPass (test, result) {
    console.log(`ok ${test.name} ${result || ''}`)
  }

  testFail (test, err) {
    const yaml = require('js-yaml')
    const error = Object.assign({}, err)
    console.log(`not ok ${test.name}`)
    console.log('  ---')
    console.log(yaml.safeDump(error, { skipInvalid: true }).split('\n').map(l => l ? '  ' + l : '').join('\n'))
    console.log('  ...')
  }

  testSkip (test) {
    console.log(`ok ${test.name} # SKIP`)
  }

  end (stats) {
    console.log(`# Passed: ${stats.pass}, failed: ${stats.fail}, skip: ${stats.skip}`)
  }
}

module.exports = TAPView
