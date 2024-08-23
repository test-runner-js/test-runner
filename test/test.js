import TestRunner from 'test-runner'
import Test from '../lib/test.js'
import { strict as a } from 'assert'

{ /* Sync tess passes, storing the result */
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
