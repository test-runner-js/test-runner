const chalk = require('chalk')

class DefaultView {
  start (count) {
    console.log(chalk`\n{white Running ${count} tests}\n`)
  }
  testPass (test, result) {
    const indent = ' '.repeat(test.level())
    const parent = test.parent ? test.parent.name : ''
    console.log(chalk`${indent}{green ✓} {magenta ${parent}}`, test.name, result ? `[${result}]` : '')
  }
  testFail (test, err) {
    const indent = ' '.repeat(test.level())
    const parent = test.parent ? test.parent.name : ''
    console.log(chalk`${indent}{red ⨯} {magenta ${parent}}`, test.name)
    const lines = err.stack.split('\n').map(line => {
      const indent = ' '.repeat(test.level() + 2)
      return indent + line
    })
    console.log(`\n${lines.join('\n')}\n`)
  }
  testSkip (test) {
    const indent = ' '.repeat(test.level())
    console.log(chalk`${indent}{gray - ${test.name}}`)
  }
  testIgnore (test) {
    const indent = ' '.repeat(test.level())
  }
  end (stats) {
    console.log(chalk`\n{white Completed in: ${stats.timeElapsed()}ms. Pass: ${stats.pass}, fail: ${stats.fail}, skip: ${stats.skip}.}\n`)
  }
}

module.exports = DefaultView
