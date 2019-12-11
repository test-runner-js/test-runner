const Tom = require('test-object-model')

const tom = module.exports = new Tom()
tom.todo('seven', () => 7)
tom.skip('eight', () => 8)
