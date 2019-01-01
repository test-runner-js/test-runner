const CliApp = require('../')
const a = require('assert')
const halt = require('./lib/util').halt

{ /* --help */
  const counts = []
  const origArgs = process.argv
  process.argv = [ 'node', 'cli.js', '--help' ]
  function errorLog (msg) {
    a.ok(/test-runner/.test(msg))
    counts.push('log')
  }
  const cli = new CliApp({ errorLog })
  cli.start()
    .then()
    .catch(halt)
    .finally(() => process.argv = origArgs)
}

{ /* single file run */
  const cli = new CliApp()
  const origArgs = process.argv
  process.argv = [ 'node', 'cli.js', 'test/fixture/one.js' ]
  cli.start()
    .then(results => {
      a.deepStrictEqual(results, [ 1, 2 ])
    })
    .catch(halt)
    .finally(() => process.argv = origArgs)
}

{ /* multiple file run */
  const cli = new CliApp()
  const origArgs = process.argv
  process.argv = [ 'node', 'cli.js', 'test/fixture/three.js', 'test/fixture/two.js' ]
  cli.start()
    .then(results => {
      a.deepStrictEqual(results, [ 5, 6, 3, 4 ])
    })
    .catch(halt)
    .finally(() => process.argv = origArgs)
}

{ /* multiple file run: only */
  const cli = new CliApp()
  const origArgs = process.argv
  process.argv = [ 'node', 'cli.js', 'test/fixture/four.js', 'test/fixture/only.js' ]
  cli.start()
    .then(results => {
      a.deepStrictEqual(results, [ undefined, undefined, undefined, 6 ])
    })
    .catch(halt)
    .finally(() => process.argv = origArgs)
}
