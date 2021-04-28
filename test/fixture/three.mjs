import Tom from 'test-object-model'
const tom = new Tom('Fixture one')
export default tom
tom.test('five', () => 5)
tom.test('six', () => 6)
