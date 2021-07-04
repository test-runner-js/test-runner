import Tom from '@test-runner/tom'
const tom = new Tom('Fixture one')
export default tom
tom.test('seven', () => { throw new Error('broken') })
tom.test('eight', () => 8)
