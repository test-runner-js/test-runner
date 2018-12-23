class CliApp {
  start (args) {
    args = args || {}
    const log = args.log || console.log
    const errorLog = args.errorLog || console.error

    const commandLineArgs = require('command-line-args')
    const options = commandLineArgs([
      { name: 'files', type: String, multiple: true, defaultOption: true },
      { name: 'help', type: Boolean, alias: 'h' }
    ])

    if (options.help) {
      const commandLineUsage = require('command-line-usage')
      errorLog(commandLineUsage([
        {
          header: 'test-runner',
          content: 'Minimal test runner.'
        },
        {
          header: 'Options',
          optionList: exports.definitions
        }
      ]))
      return Promise.resolve()
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
          const TestRunner = require('test-runner')
          const TAPView = require('./view-tap')
          const runner = new TestRunner({ view: TAPView })
          for (const file of files) {
            const tom = require(path.resolve(process.cwd(), file))
            if (tom) {
              runner.tom = tom
            } else {
              console.log('No TOM exported: ' + file)
            }
          }
          return runner.start()
        } else {
          console.log('NO FILES')
        }
      }
    }

  }
}

module.exports = CliApp
