const Tom = require('test-object-model')

const tom = module.exports = new Tom('Fixture three')
tom.test('seven', () => { throw new Error('broken') })
tom.test('eight', () => 2)
