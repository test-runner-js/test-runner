class Test {
  name
  testFn
  result
  data = {} // optional associated metadata, consumed by runner user (e.g. to store the test file name) not the runner itself

  constructor (name, testFn, options = {}) {
    this.name = name
    this.testFn = testFn
  }

  async run () {
    this.result = await this.testFn()
  }
}

export default Test

/*
- Test
  - properties: name, ended, switch (test/skip/only)
  - behaviours: run(), reset()
  - states: pending, passed, failed, skipped
*/
