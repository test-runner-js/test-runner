import TestRunnerCli from 'test-runner'
import assert from 'assert'
import { halt } from './lib/util.mjs'
const a = assert.strict

{ /* testRunnerCli.getTom() - should default to file names */
  const cli = new TestRunnerCli()
  const files = [
    'test/fixture/no-tom-names/no-name-one.mjs',
    'test/fixture/no-tom-names/no-name-two.mjs'
  ]
  cli.getTom(files).then(result => {
    a.equal(result.children[0].name, 'test/fixture/no-tom-names/no-name-one.mjs')
    a.equal(result.children[1].name, 'test/fixture/no-tom-names/no-name-two.mjs')
  })
}

{ /* testRunnerCli.getViewClass() - live */
  const cli = new TestRunnerCli()
  const options = {
    view: 'live'
  }
  cli.getViewClass(options).then(ViewClass => {
    a.equal(ViewClass.name, 'LiveView')
  })
}

{ /* testRunnerCli.getViewClass() - oneline */
  const cli = new TestRunnerCli()
  const options = {
    view: 'oneline'
  }
  cli.getViewClass(options).then(ViewClass => {
    a.equal(ViewClass.name, 'OnelineView')
  })
}

{ /* testRunnerCli.getViewClass() - test-view */
  const cli = new TestRunnerCli()
  const options = {
    view: 'test/fixture/test-view.mjs'
  }
  cli.getViewClass(options).then(ViewClass => {
    a.equal(ViewClass.name, 'TestView')
  })
}

{ /* testRunnerCli.getViewClass() - view doesn't exist */
  const cli = new TestRunnerCli()
  const options = {
    view: 'broken'
  }
  cli.getViewClass(options)
    .then(() => {
      throw new Error('should not reach here')
    })
    .catch(err => {
      a.ok(/Module not found/i.test(err.message))
    })
    .catch(halt)
}

{ /* testRunnerCli.expandGlobs() */
  const cli = new TestRunnerCli()
  cli.expandGlobs(['package.json'])
    .then(result => {
      a.deepEqual(result, ['package.json'])
    })
}
