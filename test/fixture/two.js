import Tom from '@test-runner/tom'
const tom = new Tom('Fixture one')
export default tom
tom.test('three', () => 3)
tom.test('four', () => 4)
