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
    a.equal(result.children[0].name, 'no-name-one')
    a.equal(result.children[1].name, 'no-name-two')
  })
}
