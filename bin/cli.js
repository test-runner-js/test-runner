#!/usr/bin/env node
import TestRunner from 'test-runner'
import path from 'path'
import Test from '../lib/test.js'
import ansi from 'ansi-escape-sequences'

// process.on('uncaughtException', (err, origin) => {
//   console.error(`\nAn ${origin} was thrown, possibly in a separate tick.\n`)
//   console.error(err)
//   process.exit(1)
// })
// process.on('unhandledRejection', (reason, promise) => {
//   console.error('\nAn unhandledRejection was thrown. Please ensure the rejecting promise is returned from the test function.\n')
//   console.error(reason)
//   process.exit(1)
// })

const config = {
  files: process.argv.slice(2)
}
const tests = []

function createTests (arr, map, file) {
  for (const [name, testFn] of map) {
    const test = new Test(name, testFn)
    test.data.file = file
    tests.push(test)
  }
}

for (const file of config.files) {
  const testModule = await import(path.resolve(file))
  if (testModule?.skip?.size) {
    for (const [name] of testModule.skip) {
      console.log(`- ${ansi.format(name, ['grey'])}`)
    }
  }
  if (testModule?.only?.size) {
    createTests(tests, testModule.only, file)
  } else if (testModule?.test?.size) {
    createTests(tests, testModule.test, file)
  }
}

const runner = new TestRunner(tests)
for await (const test of runner.run()) {
  console.log(`${ansi.format('✔', ['green'])} ${ansi.format(test.data.file, ['magenta'])} ${test.name}`)
}
