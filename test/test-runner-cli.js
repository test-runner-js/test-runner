const TestRunnerCli = require('../')
const a = require('assert').strict
const halt = require('./lib/util').halt

{ /* testRunnerCli.getTom() - should default to file names */
  const cli = new TestRunnerCli()
  const files = [
    'test/fixture/no-tom-names/no-name-one.js',
    'test/fixture/no-tom-names/no-name-two.js'
  ]
  cli.getTom(files).then(result => {
    a.equal(result.children[0].name, 'test/fixture/no-tom-names/no-name-one.js')
    a.equal(result.children[1].name, 'test/fixture/no-tom-names/no-name-two.js')
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
    view: 'test/fixture/test-view.js'
  }
  cli.getViewClass(options).then(ViewClass => {
    a.equal(ViewClass.name, 'TestView')
  })
}
