import Test from './lib/test.js'
import ansi from 'ansi-escape-sequences'
import { pathToFileURL } from 'node:url'
import os from 'node:os'
import util from 'node:util'

/* TODO: Factor out node-specific code to enable isomorphism */

function indent (input, indentWith) {
  const lines = input.split(os.EOL).map(line => {
    return indentWith + line
  })
  return lines.join(os.EOL)
}

class TestRunner {
  tests

  constructor (tests) {
    this.tests = tests
  }

  async * run () {
    for (const test of this.tests) {
      console.log(`${ansi.format('●', ['yellow'])} ${ansi.format(test.metadata.file, ['magenta'])} ${test.name}`)
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
    const only = []

    process.on('uncaughtException', (err, origin) => {
      console.error(`\nAn ${origin} was thrown, possibly in a separate tick.\n`)
      console.error(err)
      process.exit(1)
    })
    process.on('unhandledRejection', (reason, promise) => {
      console.error('\nAn unhandledRejection was thrown. Please ensure the rejecting promise is returned from the test function.\n')
      console.error(reason)
      process.exit(1)
    })

    function createTests (arr, map, file) {
      for (const [name, testFn] of map) {
        const test = new Test(name, testFn)
        test.metadata.file = file
        arr.push(test)
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
        createTests(only, testModule.only, file)
      } else if (testModule.test && testModule.test.size) {
        createTests(tests, testModule.test, file)
      }
    }

    this.tests = only.length ? only : tests
    for await (const test of this.run()) {
      process.stdout.write(ansi.cursor.up(1) + ansi.erase.inLine(2))
      console.log(`${ansi.format('✔', ['green'])} ${ansi.format(test.metadata.file, ['magenta'])} ${test.name}`)
      if (test.data) {
        console.log(indent(os.EOL + util.inspect(test.data, { colors: true }) + os.EOL, '  '))
      }
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
