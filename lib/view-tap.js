module.exports = ViewBase => class TAPView extends ViewBase {
  start (count) {
    this.log('TAP version 13')
    this.log(`1..${count}`)
  }
  testPass (test, result) {
    this.log(`ok ${test.name} ${result || ''}`)
  }
  testFail (test, err) {
    const yaml = require('js-yaml')
    const error = Object.assign({}, err)
    this.log(`not ok ${test.name}`)
    this.log('  ---')
    this.log(yaml.safeDump(error, { skipInvalid: true }).split('\n').map(l => l ? '  ' + l : '').join('\n'))
    this.log('  ...')
  }
  testSkip (test) {
    this.log(`ok ${test.name} # SKIP`)
  }
  end () {
    const runner = this.attachedTo
    const stats = {
      pass: 0,
      fail: 0,
      skip: 0
    }
    for (const test of runner.tom) {
      stats[test.state]++
    }
    this.log(`# Passed: ${stats.pass}, failed: ${stats.fail}, skip: ${stats.skip}`)
  }
}
