class CliApp {
  constructor (options) {
    options = options || {}
    this.log = options.log || console.log
    this.errorLog = options.errorLog || console.error
    this.optionDefinitions = [
      { name: 'files', type: String, multiple: true, defaultOption: true },
      { name: 'help', type: Boolean, alias: 'h' },
      { name: 'tree', type: Boolean, alias: 't' }
    ]
  }
  getOptions () {
    const commandLineArgs = require('command-line-args')
    return commandLineArgs(this.optionDefinitions)
  }

  printUsage () {
    const commandLineUsage = require('command-line-usage')
    this.errorLog(commandLineUsage([
      {
        header: 'test-runner',
        content: 'Minimal test runner.'
      },
      {
        header: 'Options',
        optionList: this.optionDefinitions
      }
    ]))
  }

  expandGlobs (files) {
    const FileSet = require('file-set')
    const flatten = require('reduce-flatten')
    return files
      .map(glob => {
        const fileSet = new FileSet(glob)
        if (fileSet.notExisting.length) {
          throw new Error('These files do not exist: ' + fileSet.notExisting.join(', '))
        }
        return fileSet.files
      })
      .reduce(flatten, [])
  }

  getPackageName () {
    const walkBack = require('walk-back')
    const packagePath = walkBack(process.cwd(), 'package.json')
    let name
    if (packagePath) {
      const pkg = require(packagePath)
      name = pkg.name
    }
    return name
  }

  getTom (files) {
    const path = require('path')
    const toms = files.map(file => {
      const tom = require(path.resolve(process.cwd(), file))
      if (tom) {
        return tom
      } else {
        throw new Error('No TOM exported: ' + file)
      }
    })
    const name = this.getPackageName()
    const Tom = require('test-object-model')
    return Tom.combine(toms, name)
  }

  processFiles (files, options) {
    const tom = this.getTom(files)

    /* --tree */
    if (options.tree) {
      console.log(tom.tree())
    } else {
      const TestRunner = require('test-runner')
      const view = require('./lib/view-tap')
      const runner = new TestRunner({ tom, view })
      return runner.start()
    }
  }

  start () {
    const options = this.getOptions()

    /* --help */
    if (options.help) {
      this.printUsage()
      return Promise.resolve()

    /* --files */
    } else {
      if (options.files && options.files.length) {
        const files = this.expandGlobs(options.files)
        if (files.length) {
          return this.processFiles(files, options)
        } else {
          return Promise.reject(new Error('one or more input files required'))
        }
      }
    }
  }
}

module.exports = CliApp
