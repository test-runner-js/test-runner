import Tom from '@test-runner/tom'
const tom = new Tom('Fixture one')
export default tom
tom.test('one', () => 1)
tom.test('two', () => 2)
