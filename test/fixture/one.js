const test = new Map()

test.set('one sync', function one () {
  return 'one'
})

test.set('one async', async function onea () {
  return 'one'
})

export { test }
