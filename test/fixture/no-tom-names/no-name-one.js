const Tom = require('test-object-model')

const tom = module.exports = new Tom()
tom.test('one', () => 1)
tom.test('two', () => 2)
