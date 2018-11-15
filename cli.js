#!/usr/bin/env node
const path = require('path')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

const options = commandLineArgs([
  { name: 'files', type: String, multiple: true, defaultOption: true },
  { name: 'help', type: Boolean, alias: 'h' }
])

if (options.help) {
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
    const arrayify = require('array-back')
    const globs = options.files
    const FileSet = require('file-set')
    const path = require('path')
    const flatten = require('reduce-flatten')
    return globs
      .map(glob => {
        const fileSet = new FileSet(glob)
        return fileSet.files.map(file => require(path.resolve(process.cwd(), file)))
      })
      .reduce(flatten, [])

  }
}
