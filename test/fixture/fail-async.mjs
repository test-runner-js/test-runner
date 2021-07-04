import Tom from '@test-runner/tom'
const tom = new Tom()
export default tom
tom.test('async', async function () {
  throw new Error('broken')
})
