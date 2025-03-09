class Test {
  state // pending, passed, failed
  name
  testFn
  result
  err
  metadata = {} // optional associated metadata, consumed by runner user (e.g. to store the test file name) not the runner itself
  data // user context data displayed in the output alongside the text result

  constructor (name, testFn, options = {}) {
    this.name = name
    this.testFn = testFn
  }

  async execute () {
    try {
      this.result = await this.testFn()
    } catch (err) {
      this.err = err
    }
    return this
  }

  async reset () {
    this.result = await this.testFn()
  }
}

export default Test
