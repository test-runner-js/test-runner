const Test = require('test-runner/dist/test.js')

const root = module.exports = new Test('Fixture one')
root.add(new Test('one', () => 1))
root.add(new Test('two', () => 2))
