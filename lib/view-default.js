class DefaultView {
  start (count) {
    console.log(`Running ${count} tests`)
  }
  testPass (test, result) {
    const indent = ' '.repeat(test.level())
    const parent = test.parent ? test.parent.name : ''
    console.log(`${indent}\x1b[32m✓\x1b[0m \x1b[35m${parent}\x1b[0m`, test.name, result ? `[${result}]` : '')
  }
  testFail (test, err) {
    const indent = ' '.repeat(test.level())
    const parent = test.parent ? test.parent.name : ''
    // console.log(`${indent}\x1b[31m⨯\x1b[0m \x1b[35m${parent}\x1b[0m`, test.name, `\x1b[31m${err.message}\x1b[0m`)
    console.log(`${indent}\x1b[31m⨯\x1b[0m \x1b[35m${parent}\x1b[0m`, test.name)
    // console.log(`\n\x1b[31m${err.stack}\x1b[0m\n`)
    const lines = err.stack.split('\n').map(line => {
      const indent = ' '.repeat(test.level() + 2)
      return indent + line
    })
    console.log(`\n${lines.join('\n')}\n`)
  }
  testSkip (test) {
    const indent = ' '.repeat(test.level())
    console.log(`${indent}\x1b[90m-`, test.name, '\x1b[0m')
  }
  testIgnore (test) {
    const indent = ' '.repeat(test.level())
    // console.log(`${indent}\x1b[35m-`, test.name, '\x1b[0m')
  }
  end (stats) {
    console.log(`Completed in: ${stats.timeElapsed()}ms. Pass: ${stats.pass}, fail: ${stats.fail}, skip: ${stats.skip}.`)
  }
}

module.exports = DefaultView
