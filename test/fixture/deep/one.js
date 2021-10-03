import Tom from '@test-runner/tom'
const tom = new Tom()
export default tom
tom.test('one', () => 1)
tom.test('two', () => 2)
