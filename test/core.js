import TestRunnerCore from '../lib/core.js'
import Test from '../lib/test.js'
import { strict as a } from 'assert'

/* Node.js version 12 compatible - no module-level await. */

/* Sync test passes, storing the result on `test.result` */
async function one () {
  const actuals = []
  const test1 = new Test('one', function one () {
    actuals.push('one')
    return 'one'
  })
  const runner = new TestRunnerCore()
  runner.add(test1)
  await runner.process()
  a.equal(test1.result, 'one')
  a.deepEqual(actuals, ['one'])
}

/* Async test passes, storing the result */
async function two () {
  const actuals = []
  const test1 = new Test('two', async function two () {
    actuals.push('two')
    return 'two'
  })
  const runner = new TestRunnerCore()
  runner.add(test1)
  await runner.process()
  a.equal(test1.result, 'two')
  a.deepEqual(actuals, ['two'])
}

/* Sync test fails, crashing the process - no exception handling nor exitCodes */
async function syncFailOld () {
  const actuals = []
  const test1 = new Test('syncFail', function syncFail () {
    actuals.push('syncFail')
    throw new Error('broken')
  })
  const runner = new TestRunnerCore([test1])
  try {
    await runner.process()
    throw new Error('Should not reach here')
  } catch (err) {
    a.equal(err.message, 'broken')
    a.equal(test1.result, undefined)
    a.deepEqual(actuals, ['syncFail'])
  }
}

/* Sync test fails, handles the exception and stores the error */
async function syncFail () {
  const actuals = []
  const test1 = new Test('syncFail', function syncFail () {
    actuals.push('syncFail')
    throw new Error('broken')
  })
  const runner = new TestRunnerCore()
  runner.add(test1)
  await runner.process()

  a.equal(test1.result, undefined)
  a.equal(test1.err.message, 'broken')
  a.deepEqual(actuals, ['syncFail'])
}

Promise.all([
  one(),
  two(),
  syncFail()
])
