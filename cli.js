#!/usr/bin/env node
const path = require('path')
const commandLineArgs = require('command-line-args')

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
      const runners = []
      for (const file of files) {
        const runner = require(path.resolve(process.cwd(), file))
        runners.push(runner)
        runner.view = new TAPView()
      }
      if (runners.some(r => r.tests.some(t => t.only))) {
        for (const runner of runners) {
          for (const test of runner.tests) {
            if (!test.only) test.skip = true
          }
          runner.start()
        }
      }
    } else {
      console.log('NO FILES')
    }
  }
}
