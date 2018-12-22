module.exports = ViewBase => class TAPView extends ViewBase {
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
    process.exitCode = 1
  }
  testSkip (test) {
    console.log(`ok ${test.name} # SKIP`)
  }
  end () {
    const runnerRunner = this.attachedTo
    const stats = {
      passed: 0,
      failed: 0,
      pending: 0
    }
    for (const runner of runnerRunner.runners) {
      for (const test of runner.tests) {
        stats[test.state]++
      }
    }
    console.log(`# Passed: ${stats.passed}, failed: ${stats.failed}, pending: ${stats.pending}`)
  }
}
