const Tom = require('test-object-model')

const tom = module.exports = new Tom('Fixture four')
tom.test('async', async function () {
  await asdf()
})
