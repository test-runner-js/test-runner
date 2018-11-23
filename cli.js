#!/usr/bin/env node
const path = require('path')
const commandLineArgs = require('command-line-args')
const EventEmitter = require('events').EventEmitter

class RunnerRunner extends EventEmitter {
  constructor (options) {
    super()
    options = options || {}
    this.runners = []
    this.view = options.view
    if (this.view.start) this.on('start', this.view.start.bind(this.view))
    if (this.view.testPass) this.on('test-pass', this.view.testPass.bind(this.view))
    if (this.view.testFail) this.on('test-fail', (test, err) => {
      process.exitCode = 1
      this.view.testFail(test, err)
    })
    if (this.view.testSkip) this.on('test-skip', this.view.testSkip.bind(this.view))
  }

  runner (runner) {
    runner.manualStart = true
    runner.view = null
    this.runners.push(runner)
  }

  start () {
    if (this.runners.some(r => r.tests.some(t => t.only))) {
      for (const runner of this.runners) {
        for (const test of runner.tests) {
          if (!test.only) test.skip = true
        }
      }
    }

    const testCount = this.runners.reduce((total, r) => total + r.tests.length, 0)
    this.emit('start', testCount)
    for (const runner of this.runners) {
      runner.on('test-pass', this.view.testPass.bind(this.view))
      runner.on('test-fail', (test, err) => {
        process.exitCode = 1
        this.view.testFail(test, err)
      })
      runner.start()
    }
  }
}

const options = commandLineArgs([
  { name: 'files', type: String, multiple: true, defaultOption: true },
  { name: 'help', type: Boolean, alias: 'h' }
])

if (options.help) {
  const commandLineUsage = require('command-line-usage')
  console.log(commandLineUsage([
    {
      header: 'test-runner',
      content: 'Minimal test runner.'
    },
    {
      header: 'Options',
      optionList: exports.definitions
    }
  ]))
} else {
  if (options.files && options.files.length) {
    const FileSet = require('file-set')
    const path = require('path')
    const flatten = require('reduce-flatten')
    const files = options.files
      .map(glob => {
        const fileSet = new FileSet(glob)
        return fileSet.files
      })
      .reduce(flatten, [])
    if (files.length) {
      const TAPView = require('./view-tap')
      const runnerRunner = new RunnerRunner({ view: new TAPView() })
      for (const file of files) {
        const runner = require(path.resolve(process.cwd(), file))
        runnerRunner.runner(runner)
      }
      runnerRunner.start()
    } else {
      console.log('NO FILES')
    }
  }
}
