const test = new Map()

test.set('two', function two () {
  throw new Error('broken')
})

export { test }
