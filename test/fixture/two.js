const Tom = require('test-object-model')

const tom = module.exports = new Tom('Fixture two')
tom.test('three', () => 3)
tom.test('four', () => 4)
