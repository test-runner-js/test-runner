const Tom = require('test-object-model')

const tom = module.exports = new Tom()
tom.before('before', () => 5)
tom.after('after', () => 6)
