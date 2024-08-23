import TestRunner from 'test-runner'
import Test from '../lib/test.js'
import Cli from '../lib/cli.js'
import { strict as a } from 'assert'
import path from 'node:path'
import currentModulePaths from 'current-module-paths'

const { __dirname } = currentModulePaths(import.meta.url)

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
  const actuals = []
  const cli = new Cli()
  const runner = await cli.start([path.resolve(__dirname, 'fixture', 'one.js')])
}
cli()
