import TestRunner from 'test-runner'
import Test from '../lib/test.js'
import { strict as a } from 'assert'

/* Node.js version 12 compatible - no module-level await. */

/* Sync tess passes, storing the result */
async function one () {
  const actuals = []
  const test1 = new Test('one', function one () {
    actuals.push('one')
    return 'one'
  })
  const runner = new TestRunner([test1])
  await runner.runAll()
  a.equal(test1.result, 'one')
  a.deepEqual(actuals, ['one'])
}
one()

/* Cli loads and runs a test file */
async function cli () {
  const runner = new TestRunner()
  await runner.start(['./test/fixture/one.js'])
}
cli()
