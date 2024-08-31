import TestRunnerCore from '../lib/core.js'
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
  const runner = new TestRunnerCore([test1])
  await runner.runAll()
  a.equal(test1.result, 'one')
  a.deepEqual(actuals, ['one'])
}

/* Async test passes, storing the result */
async function onea () {
  const actuals = []
  const test1 = new Test('onea', async function onea () {
    actuals.push('one')
    return 'one'
  })
  const runner = new TestRunnerCore([test1])
  await runner.runAll()
  a.equal(test1.result, 'one')
  a.deepEqual(actuals, ['one'])
}

/* Sync test fails, crashing the process - no exception handling nor exitCodes */
async function syncFail () {
  const actuals = []
  const test1 = new Test('syncFail', function syncFail () {
    actuals.push('syncFail')
    throw new Error('broken')
  })
  const runner = new TestRunnerCore([test1])
  try {
    await runner.runAll()
    throw new Error('Should not reach here')
  } catch (err) {
    a.equal(err.message, 'broken')
    a.equal(test1.result, undefined)
    a.deepEqual(actuals, ['syncFail'])
  }
}

Promise.all([
  one(),
  onea(),
  syncFail()
])
