import Tom from 'test-object-model'
const tom = new Tom()
export default tom
tom.test('async', async function () {
  throw new Error('broken')
})
