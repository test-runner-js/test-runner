import Tom from '@test-runner/tom'
const tom = new Tom()
export default tom
tom.test('three', () => 3)
tom.test('four', () => 4)
