import Tom from 'test-object-model'
const tom = new Tom()
export default tom
tom.before('before', () => 5)
tom.after('after', () => 6)
