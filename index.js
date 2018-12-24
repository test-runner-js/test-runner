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
            if (fileSet.notExisting.length) {
              throw new Error('These files do not exist: ' + fileSet.notExisting.join(', '))
            }
            return fileSet.files
          })
          .reduce(flatten, [])
        if (files.length) {
          const TestRunner = require('test-runner')
          const TAPView = require('./lib/view-tap')
          const toms = files.map(file => {
            const tom = require(path.resolve(process.cwd(), file))
            if (tom) {
              tom.reset(true)
              return tom
            } else {
              throw new Error('No TOM exported: ' + file)
            }
          })
          let tom
          if (toms.length > 1) {
            const Tom = require('test-object-model')
            const walkBack = require('walk-back')
            const process = require('process')
            const packagePath = walkBack(process.cwd(), 'package.json')
            let name
            if (packagePath) {
              const pkg = require(packagePath)
              name = pkg.name
            }
            tom = new Tom(name)
            for (const subTom of toms) {
              tom.add(subTom)
            }
          } else {
            tom = toms[0]
          }
          console.log(tom.tree())
          const runner = new TestRunner({ view: TAPView })
          runner.tom = tom
          return runner.start()
        } else {
          return Promise.reject(new Error('one or more input files required'))
        }
      }
    }

  }
}

module.exports = CliApp
