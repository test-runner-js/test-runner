class TestRunner {
  async * results (testMaps = [], skipMaps = [], onlyMaps = []) {
    if (onlyMaps.length) {
      for (const onlyMap of onlyMaps) {
        for (const [name, testFn] of onlyMap) {
          yield {
            name,
            result: await testFn()
          }
        }
      }
    } else {
      for (const skipMap of skipMaps) {
        for (const [name] of skipMap) {
          yield {
            name,
            skipped: true
          }
        }
      }
      for (const testMap of testMaps) {
        for (const [name, testFn] of testMap) {
          yield {
            name,
            result: await testFn()
          }
        }
      }
    }
  }
}

export default TestRunner
