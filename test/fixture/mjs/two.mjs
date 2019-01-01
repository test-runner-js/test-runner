import Tom from 'test-object-model'

const tom = new Tom('Fixture two')
tom.test('three', () => 3)
tom.test('four', () => 4)

export default tom
