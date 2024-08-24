import TestRunner from 'test-runner'
import Test from '../lib/test.js'
import { strict as a } from 'assert'

/* Node.js version 12 compatible - no module-level await. */

/* Sync test passes, storing the result */
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

/* Sync test fails, crashing the process */
async function syncFail () {
  const actuals = []
  const test1 = new Test('one', function one () {
    actuals.push('one')
    throw new Error('broken')
  })
  const runner = new TestRunner([test1])
  try {
    await runner.runAll()
    throw new Error('Should not reach here')
  } catch (err) {
    a.equal(err.message, 'broken')
    a.equal(test1.result, undefined)
    a.deepEqual(actuals, ['one'])
  }
}
syncFail()

{ /* Cli loads and runs a test file, test passes */
  const runner = new TestRunner()
  runner.start(['./test/fixture/one.js'])
}

{ /* Cli loads and runs a test file, test fails */
  const runner = new TestRunner()
  runner.start(['./test/fixture/two.js'])
    .then(() => {
      throw new Error('Should not reach here')
    })
    .catch(err => {
      a.equal(err.message, 'broken')
    })
}
