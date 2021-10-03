import TestRunnerCli from 'test-runner'
import assert from 'assert'
import { halt } from './lib/util.js'
import commandLineArgs from 'command-line-args'
const a = assert.strict

{ /* single file run */
  class TestRunnerTest extends TestRunnerCli {
    async getOptions () {
      return commandLineArgs(this.optionDefinitions, { argv: ['test/fixture/one.js', '--silent'] })
    }
  }
  const cli = new TestRunnerTest()
  cli.start()
    .then(runner => {
      a.equal(runner.tom.children[0].result, 1)
      a.equal(runner.tom.children[1].result, 2)
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
    .then(runner => {
      const results = Array.from(runner.tom).map(tom => tom.result).filter(r => r)
      a.deepStrictEqual(results, [5, 6, 3, 4])
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
    .then(runner => {
      const results = Array.from(runner.tom).map(tom => tom.result).filter(r => r)
      a.deepStrictEqual(results, [6])
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
  a.equal(process.exitCode, undefined)
  runnerCli.start()
    .then(runner => {
      a.equal(process.exitCode, 1)
      process.exitCode = origExitCode
    })
    .catch(halt)
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
      a.ok(/No TOM exported/i.test(err.message))
    })
    .catch(halt)
}

{ /* test default TOM names (filename if not specified) */
  class TestRunnerTest extends TestRunnerCli {
    async getOptions () {
      const commandLineArgs = await this.loadModule('command-line-args')
      return commandLineArgs(this.optionDefinitions, { argv: ['--debug', 'test/fixture/no-tom-names/no-name-one.js', 'test/fixture/no-tom-names/no-name-two.js'] })
    }
  }
  const cli = new TestRunnerTest()
  cli.start()
    .then(runner => {
      const results = Array.from(runner.tom).map(tom => tom.name)
      a.deepStrictEqual(results, [
        'test-runner',
        'test/fixture/no-tom-names/no-name-one.js',
        'one',
        'two',
        'test/fixture/no-tom-names/no-name-two.js',
        'one',
        'two'
      ])
    })
    .catch(halt)
}

{ /* TOM file doesn't exist */
  class TestRunnerTest extends TestRunnerCli {
    async getOptions () {
      const commandLineArgs = await this.loadModule('command-line-args')
      return commandLineArgs(this.optionDefinitions, { argv: ['broken', '--silent'] })
    }
  }
  const cli = new TestRunnerTest()
  cli.start()
    .then(runner => {
      throw new Error('should not reach here')
    })
    .catch(err => {
      a.ok(/These files do not exist: broken/i.test(err.message))
    })
    .catch(halt)
}
