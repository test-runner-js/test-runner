import Tom from 'test-object-model'
const tom = new Tom()
export default tom
tom.todo('seven', () => 7)
tom.skip('eight', () => 8)
