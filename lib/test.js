class Test {
  name
  testFn
  result
  metadata = {} // optional associated metadata, consumed by runner user (e.g. to store the test file name) not the runner itself
  data // user context data displayed in the output alongside the text result

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
