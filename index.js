import Test from './lib/test.js'
import ansi from 'ansi-escape-sequences'
import { pathToFileURL } from 'node:url'

class TestRunner {
  tests

  constructor (tests) {
    this.tests = tests
  }

  async * run () {
    for (const test of this.tests) {
      await test.run()
      yield test
    }
  }

  async runAll () {
    const result = []
    for await (const test of this.run()) {
      result.push(test)
    }
    return result
  }

  async start (files) {
    const tests = []

    function createTests (arr, map, file) {
      for (const [name, testFn] of map) {
        const test = new Test(name, testFn)
        test.data.file = file
        tests.push(test)
      }
    }

    for (const file of files) {
      const importPath = pathToFileURL(file).href
      const testModule = await import(importPath)
      if (!testModule) {
        throw new Error(`File did not export any tests: ${file}`)
      }
      if (testModule.skip && testModule.skip.size) {
        for (const [name] of testModule.skip) {
          console.log(`- ${ansi.format(name, ['grey'])}`)
        }
      }
      if (testModule.only && testModule.only.size) {
        createTests(tests, testModule.only, file)
      } else if (testModule.test && testModule.test.size) {
        createTests(tests, testModule.test, file)
      }
    }

    this.tests = tests
    for await (const test of this.run()) {
      console.log(`${ansi.format('✔', ['green'])} ${ansi.format(test.data.file, ['magenta'])} ${test.name}`)
    }
  }
}

export default TestRunner

/*
- return an EventEmitter from test files.. enables test suite to emit progress, performance, state etc information to the runner UI.
- test other people's projects
- interchangeable iterators, what else can be interchanged?
- Runner has no concept of "skip", if you want to skip a test don't pass it in - same could apply to only

- TestSuite/TestRunner
  - states: pending, passed, failed
  - properties: test, skip and only maps, testIterator, logger,
  - behaviours: run()

# Interchange object to get data from the user into the Runner. Neither the Tests nor Runner need to have any concept of where the tests originated from (files, API etc)
- TestMap
  - collection: <test metadata, test Fn> pairs
  - properties: metadata (file source etc)

*/
