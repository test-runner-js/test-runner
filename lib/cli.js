import TestRunner from 'test-runner'
import path from 'path'
import Test from './test.js'
import ansi from 'ansi-escape-sequences'

class Cli {
  async start (argv) {
    const config = {
      files: argv
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

    const runner = new TestRunner(tests)
    for await (const test of runner.run()) {
      console.log(`${ansi.format('✔', ['green'])} ${ansi.format(test.data.file, ['magenta'])} ${test.name}`)
    }
    return runner
  }
}

export default Cli
