/**
 * @module test-runner
 */

/**
 * @alias module:test-runner
 */
class TestRunnerCli {
  /**
   * @param {object} [optons]
   * @param {function} [optons.log]
   * @param {function} [optons.errorLog]
   */
  constructor (options) {
    options = options || {}
    this.options = options
    this.log = options.log || console.log
    this.errorLog = options.errorLog || console.error
    this.optionDefinitions = [
      { name: 'files', type: String, multiple: true, defaultOption: true },
      { name: 'help', type: Boolean, alias: 'h' },
      { name: 'version', type: Boolean },
      { name: 'tree', type: Boolean, alias: 't' },
      { name: 'tap', type: Boolean }
    ]
  }

  async loadModule (moduleId) {
    return require(moduleId)
  }

  async getOptions () {
    const commandLineArgs = await this.loadModule('command-line-args')
    return Object.assign({}, this.options, commandLineArgs(this.optionDefinitions))
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

  async printVersion () {
    const path = await this.loadModule('path')
    const pkg = await this.loadModule(path.resolve(__dirname, 'package.json'))
    this.errorLog(pkg.version)
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

  async runTests (tom, options) {
    const TestRunnerCore = await this.loadModule('test-runner-core')
    const path = await this.loadModule('path')
    const View = await this.loadModule(options.tap
      ? path.resolve(__dirname, './lib/view-tap.js')
      : '@test-runner/default-view'
    )
    const view = new View()
    const runner = new TestRunnerCore({ tom, view })
    runner.on('fail', () => {
      process.exitCode = 1
    })
    return runner.start()
  }

  /**
   * Start test-runner.
   * @return {Promise}
   * @fulfil {Array<result>}
   */
  async start () {
    const options = await this.getOptions()

    /* --help */
    if (options.help) {
      return this.printUsage()

    /* --version */
    } else if (options.version) {
      return this.printVersion()

    /* --files */
    } else {
      if (options.files && options.files.length) {
        const files = await this.expandGlobs(options.files)
        if (files.length) {
          const tom = await this.getTom(files)

          /* --tree */
          if (options.tree) {
            console.log(tom.tree())
          } else {
            return this.runTests(tom, options)
          }
        } else {
          this.errorLog('one or more input files required')
          return this.printUsage()
        }
      } else {
        return this.printUsage()
      }
    }
  }
}

TestRunnerCli.Tom = require('test-object-model')

module.exports = TestRunnerCli
