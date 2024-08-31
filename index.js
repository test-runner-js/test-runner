import TestRunnerCore from './lib/core.js'
import Test from './lib/test.js'
import ansi from 'ansi-escape-sequences'
import { pathToFileURL } from 'node:url'
import os from 'node:os'
import util from 'node:util'
import { promises as fs } from 'node:fs'

process.on('uncaughtException', (err, origin) => {
  console.error(`\nAn ${origin} was thrown, possibly in a separate tick.\n`)
  console.error(err)
  /* Need to explicity set a non-zero exitCode */
  process.exitCode = 1
})
process.on('unhandledRejection', (reason, promise) => {
  console.error('\nAn unhandledRejection was thrown. Please ensure the rejecting promise is returned from the test function.\n')
  console.error(reason)
  /* Need to explicity set a non-zero exitCode */
  process.exitCode = 1
})

function indent (input, indentWith) {
  const lines = input.split(os.EOL).map(line => {
    return indentWith + line
  })
  return lines.join(os.EOL)
}

function createTests (arr, map, file) {
  for (const [name, testFn] of map) {
    const test = new Test(name, testFn)
    test.metadata.file = file
    arr.push(test)
  }
}

class TestRunner extends TestRunnerCore {
  async start (files) {
    const tests = []
    const only = []

    for (const file of files) {
      const stats = await fs.stat(file)
      if (!stats.isFile()) {
        console.warn(`Not a file: ${file}`)
        continue
      }
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
      if (test.data) {
        console.log(indent(os.EOL + util.inspect(test.data, { colors: true }) + os.EOL, '  '))
      }
    }
  }

  async cli (argv) {
    try {
      await this.start(argv)
    } catch (err) {
      process.exitCode = 1
      console.error(err)
    }
  }
}

export default TestRunner
