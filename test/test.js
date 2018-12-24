const CliApp = require('../')
const a = require('assert')

function halt (err) {
  console.log(err)
  process.exitCode = 1
}

{ /* --help */
  const counts = []
  const cli = new CliApp()
  const origArgs = process.argv
  process.argv = [ 'node', 'cli.js', '--help' ]
  function errorLog (msg) {
    a.ok(/test-runner/.test(msg))
    counts.push('log')
  }
  cli.start({ errorLog })
    .then()
    .catch(halt)
    .finally(() => process.argv = origArgs)
}

{ /* simple run */
  const cli = new CliApp()
  const origArgs = process.argv
  process.argv = [ 'node', 'cli.js', 'test/fixture/one.js' ]
  cli.start()
    .then(results => {
      a.deepStrictEqual(results, [ undefined, 1, 2 ])
    })
    .catch(halt)
    .finally(() => process.argv = origArgs)
}
