const TestRunnerCli = require('../')
const a = require('assert')
const halt = require('./lib/util').halt

{ /* no args: print usage guide */
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

{ /* --help: print usage guide */
  const actuals = []
  function errorLog (msg) {
    a.ok(/test-runner/.test(msg))
    actuals.push('log')
  }
  class TestRunnerTest extends TestRunnerCli {
    async getOptions () {
      const commandLineArgs = await this.loadModule('command-line-args')
      return commandLineArgs(this.optionDefinitions, { argv: ['--help'] })
    }
  }
  const cli = new TestRunnerTest({ errorLog })
  cli.start()
    .then(() => {
      a.deepEqual(actuals, ['log'])
    })
    .catch(halt)
}

{ /* --tree: print tom tree */
  const actuals = []
  function errorLog (msg) {
    a.ok(/maxConcurrency/.test(msg))
    actuals.push('tree')
  }
  class TestRunnerTest extends TestRunnerCli {
    async getOptions () {
      const commandLineArgs = await this.loadModule('command-line-args')
      return commandLineArgs(this.optionDefinitions, { argv: ['test/fixture/one.js', '--tree'] })
    }
  }
  const cli = new TestRunnerTest({ errorLog })
  cli.start()
    .then(() => {
      a.deepEqual(actuals, ['tree'])
    })
    .catch(halt)
}
