const Tom = require('test-object-model')

const tom = module.exports = new Tom('Fixture three')
tom.test('one', () => 1)
tom.test('two', () => 2)
