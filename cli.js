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
      for (const file of files) {
        require(path.resolve(process.cwd(), file))
      }
    } else {
      console.log('NO FILES')
    }
  }
}
