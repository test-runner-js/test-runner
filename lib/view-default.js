class DefaultView {
  start (count) {
    console.log(`Running ${count} tests`)
  }
  testPass (test, result) {
    const ident = ' '.repeat(test.level())
    console.log(`${ident}\x1b[32m✓\x1b[0m`, test.name, result || 'ok')
  }
  testFail (test, err) {
    const ident = ' '.repeat(test.level())
    console.log(`${ident}\x1b[31m⨯\x1b[0m`, test.name, err.message || 'ok')
  }
  testSkip (test) {
    const ident = ' '.repeat(test.level())
    console.log(`${ident}\x1b[90m-`, test.name, '\x1b[0m')
  }
  testIgnore (test) {
    const ident = ' '.repeat(test.level())
    console.log(`${ident}\x1b[35m-`, test.name, '\x1b[0m')
  }
  end (stats) {
    console.log(`Completed in: ${stats.timeElapsed()}ms. Pass: ${stats.pass}, fail: ${stats.fail}, skip: ${stats.skip}.`)
  }
}

module.exports = DefaultView
