class Test {
  name
  testFn
  result
  state
  data = {} // optional associated metadata, consumed by runner user not the runner

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
