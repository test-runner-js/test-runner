const test = new Map()

test.set('two sync', function two () {
  throw new Error('broken')
})

test.set('two async', function twoa () {
  throw new Error('broken')
})

export { test }
