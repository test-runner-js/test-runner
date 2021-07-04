import Tom from '@test-runner/tom'
const tom = new Tom()
export default tom
tom.before('before', () => 5)
tom.after('after', () => 6)
