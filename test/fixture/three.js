const Tom = require('test-object-model')

const tom = module.exports = new Tom('Fixture three')
tom.test('five', () => 1)
tom.test('six', () => 2)
