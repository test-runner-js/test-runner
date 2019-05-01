const TestRunnerCli = require('../')
const a = require('assert')
const halt = require('./lib/util').halt

{ /* single file run */
  class TestRunnerTest extends TestRunnerCli {
    async getOptions () {
      const commandLineArgs = await this.loadModule('command-line-args')
      return commandLineArgs(this.optionDefinitions, { argv: [ 'test/fixture/one.js' ] })
    }
  }
  const cli = new TestRunnerTest()
  cli.start()
    .then(results => {
      // a.deepStrictEqual(results, [ 1, 2 ])
    })
    .catch(halt)
}

{ /* multiple file run */
  class TestRunnerTest extends TestRunnerCli {
    async getOptions () {
      const commandLineArgs = await this.loadModule('command-line-args')
      return commandLineArgs(this.optionDefinitions, { argv: [ 'test/fixture/three.js', 'test/fixture/two.js' ] })
    }
  }
  const cli = new TestRunnerTest()
  cli.start()
    .then(results => {
      // a.deepStrictEqual(results, [ 5, 6, 3, 4 ])
    })
    .catch(halt)
}

{ /* multiple file run: only */
  class TestRunnerTest extends TestRunnerCli {
    async getOptions () {
      const commandLineArgs = await this.loadModule('command-line-args')
      return commandLineArgs(this.optionDefinitions, { argv: [ 'test/fixture/four.js', 'test/fixture/only.js' ] })
    }
  }
  const cli = new TestRunnerTest()
  cli.start()
    .then(results => {
      // a.deepStrictEqual(results, [ undefined, undefined, undefined, 6 ])
    })
    .catch(halt)
}

{ /* exitCode: fail */
  class TestRunnerTest extends TestRunnerCli {
    async getOptions () {
      const commandLineArgs = await this.loadModule('command-line-args')
      return commandLineArgs(this.optionDefinitions, { argv: [ 'test/fixture/fail.js' ] })
    }
  }
  const runnerCli = new TestRunnerTest()
  const origExitCode = process.exitCode
  a.strictEqual(process.exitCode, undefined)
  runnerCli.start()
    .then(results => {
      // a.deepStrictEqual(results, [ undefined, 8 ])
      a.strictEqual(process.exitCode, 1)
      process.exitCode = origExitCode
    })
    .catch(halt)
}

{ /* --tap */
  class TestRunnerTest extends TestRunnerCli {
    async getOptions () {
      const commandLineArgs = await this.loadModule('command-line-args')
      return commandLineArgs(this.optionDefinitions, { argv: [ '--tap', 'test/fixture/tap.js' ] })
    }
  }
  const cli = new TestRunnerTest()
  cli.start()
    .then(results => {
      // a.deepStrictEqual(results, [ 1, 2 ])
    })
    .catch(halt)
}
