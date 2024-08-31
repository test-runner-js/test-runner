import ansi from 'ansi-escape-sequences'

/* TODO: Factor out node-specific code to enable isomorphism */

class TestRunner {
  tests

  constructor (tests) {
    this.tests = tests
  }

  async * run () {
    for (const test of this.tests) {
      console.log(`${ansi.format(test.metadata.file || '', ['magenta'])} ${test.name}`)
      try {
        await test.run()
        yield test
      } catch (err) {
        console.log(`${ansi.format(test.metadata.file || '', ['magenta'])} ${test.name} - ${ansi.format('Failed', ['red'])}`)
        /* Crash the process */
        throw err
      }
    }
  }

  /* not used by start() */
  async runAll () {
    const result = []
    for await (const test of this.run()) {
      result.push(test)
    }
    return result
  }
}

export default TestRunner

/*
- test other people's projects
- Interchangeable logger
- interchangeable iterators, what else can be interchanged?
- TestRunner has no concept of "skip", if you want to skip a test don't pass it in - same could apply to only. TestRunnerCli handles them.
*/
