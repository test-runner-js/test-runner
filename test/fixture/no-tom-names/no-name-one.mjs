import Tom from 'test-object-model'
const tom = new Tom()
export default tom
tom.test('one', () => 1)
tom.test('two', () => 2)
