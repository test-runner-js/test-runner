const Tom = require('test-object-model')

const tom = module.exports = new Tom('Fixture four')
tom.test('seven', () => { throw new Error('broken') })
tom.test('eight', () => 8)
