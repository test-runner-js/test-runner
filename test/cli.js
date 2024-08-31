import TestRunner from 'test-runner'
import { strict as a } from 'assert'

/* Node.js version 12 compatible - no module-level await. */

/* Cli loads and runs a test file, test passes */
async function cliPass () {
  const runner = new TestRunner()
  runner.cli(['./test/fixture/one.js'])
}

/* Cli loads and runs a test file, test fails.. `.cli()` handles and sets exitCode. */
async function cliFail () {
  const runner = new TestRunner()
  await runner.cli(['./test/fixture/two.js'])
  a.equal(process.exitCode, 1)
  process.exitCode = 0
}

Promise.all([
  cliPass(),
  cliFail()
])
