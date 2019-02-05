class TestRunner {
  constructor (options) {
    options = options || {}
    this.log = options.log || console.log
    this.errorLog = options.errorLog || console.error
    this.optionDefinitions = [
      { name: 'files', type: String, multiple: true, defaultOption: true },
      { name: 'help', type: Boolean, alias: 'h' },
      { name: 'tree', type: Boolean, alias: 't' },
      { name: 'tap', type: Boolean }
    ]
  }

  async loadModule (moduleId) {
    return require(moduleId)
  }

  async getOptions () {
    const commandLineArgs = await this.loadModule('command-line-args')
    return commandLineArgs(this.optionDefinitions)
  }

  async printUsage () {
    const commandLineUsage = await this.loadModule('command-line-usage')
    this.errorLog(commandLineUsage([
      {
        header: 'test-runner',
        content: 'Minimal test runner.'
      },
      {
        header: 'Synopsis',
        content: '$ test-runner [<options>] {underline file} {underline ...}'
      },
      {
        header: 'Options',
        optionList: this.optionDefinitions
      }
    ]))
  }

  async expandGlobs (files) {
    const FileSet = await this.loadModule('file-set')
    const flatten = await this.loadModule('reduce-flatten')
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

  async getPackageName () {
    const walkBack = await this.loadModule('walk-back')
    const packagePath = walkBack(process.cwd(), 'package.json')
    let name
    if (packagePath) {
      const pkg = await this.loadModule(packagePath)
      name = pkg.name
    }
    return name
  }

  async getTom (files) {
    const path = await this.loadModule('path')
    const toms = []
    for (const file of files) {
      const tom = await this.loadModule(path.resolve(process.cwd(), file))
      if (tom) {
        toms.push(tom)
      } else {
        throw new Error('No TOM exported: ' + file)
      }
    }
    const name = await this.getPackageName()
    const Tom = await this.loadModule('test-object-model')
    return Tom.combine(toms, name)
  }

  async processFiles (files, options) {
    const tom = await this.getTom(files)

    /* --tree */
    if (options.tree) {
      console.log(tom.tree())
    } else {
      const TestRunnerCore = await this.loadModule('test-runner-core')
      const view = options.tap ? await this.loadModule('./lib/view-tap') : undefined
      const runner = new TestRunnerCore({ tom, view })
      runner.on('fail', () => {
        process.exitCode = 1
      })
      return runner.start()
    }
  }

  async start () {
    const options = await this.getOptions()

    /* --help */
    if (options.help) {
      await this.printUsage()
      return Promise.resolve()

    /* --files */
    } else {
      if (options.files && options.files.length) {
        const files = await this.expandGlobs(options.files)
        if (files.length) {
          return this.processFiles(files, options)
        } else {
          this.errorLog('one or more input files required')
          await this.printUsage()
          return Promise.resolve()
        }
      } else {
        await this.printUsage()
        return Promise.resolve()
      }
    }
  }
}

module.exports = TestRunner
