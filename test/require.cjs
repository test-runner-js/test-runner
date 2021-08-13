const TestRunnerCli = require('test-runner')
const a = require('assert').strict
const commandLineArgs = require('command-line-args')

async function start () {
  const { halt } = await import('./lib/util.mjs')

  const actuals = []
  function errorLog (msg) {
    a.ok(/Synopsis/.test(msg))
    actuals.push('log')
  }
  const cli = new TestRunnerCli({ errorLog })
  cli.start()
    .then(() => {
      a.deepEqual(actuals, ['log'])
    })
    .catch(halt)
}

start().catch(console.error)
