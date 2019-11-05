const TestRunnerCli = require('../')
const a = require('assert')
const halt = require('./lib/util').halt

{ /* single file run */
  class TestRunnerTest extends TestRunnerCli {
    async getOptions () {
      const commandLineArgs = await this.loadModule('command-line-args')
      return commandLineArgs(this.optionDefinitions, { argv: ['test/fixture/one.js', '--silent'] })
    }
  }
  const cli = new TestRunnerTest()
  cli.start()
    .then(runner => {
      a.strictEqual(runner.tom.children[0].result, 1)
      a.strictEqual(runner.tom.children[1].result, 2)
    })
    .catch(halt)
}

{ /* multiple file run */
  class TestRunnerTest extends TestRunnerCli {
    async getOptions () {
      const commandLineArgs = await this.loadModule('command-line-args')
      return commandLineArgs(this.optionDefinitions, { argv: ['--silent', 'test/fixture/three.js', 'test/fixture/two.js'] })
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
      return commandLineArgs(this.optionDefinitions, { argv: ['--silent', 'test/fixture/four.js', 'test/fixture/only.js'] })
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
      return commandLineArgs(this.optionDefinitions, { argv: ['--silent', 'test/fixture/fail.js'] })
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
      return commandLineArgs(this.optionDefinitions, { argv: ['--silent', '--tap', 'test/fixture/tap.js'] })
    }
  }
  const cli = new TestRunnerTest()
  cli.start()
    .then(results => {
      // a.deepStrictEqual(results, [ 1, 2 ])
    })
    .catch(halt)
}

{ /* --tree */
  // TODO
}

{ /* no TOM exported */
  class TestRunnerTest extends TestRunnerCli {
    async getOptions () {
      const commandLineArgs = await this.loadModule('command-line-args')
      return commandLineArgs(this.optionDefinitions, { argv: ['test/fixture/no-tom-exported.js', '--silent'] })
    }
  }
  const cli = new TestRunnerTest()
  cli.start()
    .then(runner => {
      throw new Error('should not reach here')
    })
    .catch(err => {
      a.ok(/valid tom required/i.test(err.message))
    })
    .catch(halt)
}

{ /* test default TOM names (filename if not specified).. Requires cli.start() to resolve with TOM instances run instead of test results. */
  // TODO
}
