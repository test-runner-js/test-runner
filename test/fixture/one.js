const Tom = require('test-object-model')

const tom = module.exports = new Tom('Fixture one')
tom.test('one', () => 1)
tom.test('two', () => 2)
