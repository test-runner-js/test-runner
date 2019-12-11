/**
 * @module test-runner
 */

/**
 * @alias module:test-runner
 */
class TestRunnerCli {
  /**
   * @param {object} [optons]
   * @param {function} [optons.errorLog]
   */
  constructor (options) {
    options = options || {}
    this.options = options
    this.errorLog = options.errorLog || console.error
    this.optionDefinitions = [
      {
        name: 'files',
        type: String,
        multiple: true,
        defaultOption: true,
        description: 'One of more files, each of which export a test-object-model instance.'
      },
      {
        name: 'tree',
        type: Boolean,
        alias: 't',
        description: 'Inspect the supplied test-object-model structure without running the tests.'
      },
      {
        name: 'silent',
        type: Boolean,
        alias: 's',
        description: 'Run without printing any output. Useful when you\'re only interested in the exit code.'
      },
      {
        name: 'max-file-concurrency',
        type: Number,
        description: 'Maximum number of input files to process concurrently. Defaults to 10.'
      },
      {
        name: 'max-concurrency',
        type: Number,
        alias: 'c',
        description: 'Maximum number of tests to process concurrently. Overrides all values set within the test object model.'
      },
      {
        name: 'view',
        type: String,
        description: 'Attach an alternative view. Specifiy either "oneline", "live", the path to a view class or the name of an installed view module.'
      },
      {
        name: 'help',
        type: Boolean,
        alias: 'h',
        description: 'Print this usage guide.'
      },
      {
        name: 'version',
        type: Boolean,
        description: 'Print the version number and exit.'
      },
      {
        name: 'debug',
        type: Boolean,
        description: "Prints debug output. Use this when a test is misbehaving and you'd like to know why."
      },
    ]

    this.viewOptionDefinitions = []
  }

  async loadModule (moduleId, useLoadModule) {
    if (useLoadModule) {
      const loadModule = require('load-module')
      return loadModule(moduleId, { paths: ['.', __dirname] })
    } else {
      return require(moduleId)
    }
  }

  async getViewClass (options = {}) {
    const path = await this.loadModule('path')
    let viewModule
    if (options.view) {
      if (options.view === 'live') {
        viewModule = await this.loadModule('@test-runner/live-view')
      } else if (options.view === 'oneline') {
        viewModule = await this.loadModule('@test-runner/oneline-view')
      } else {
        viewModule = await this.loadModule(options.view, true)
      }
    } else {
      viewModule = await this.loadModule('@test-runner/default-view')
    }
    return viewModule || null
  }

  async getAllOptionDefinitions () {
    const allOptionDefinitions = this.optionDefinitions.slice()
    const commandLineArgs = await this.loadModule('command-line-args')
    const coreOptions = commandLineArgs(this.optionDefinitions, { camelCase: true, partial: true })
    const ViewClass = await this.getViewClass(coreOptions)
    if (ViewClass && ViewClass.optionDefinitions) {
      this.viewOptionDefinitions = ViewClass.optionDefinitions() || []
      allOptionDefinitions.push(...this.viewOptionDefinitions)
    }
    this.allOptionDefinitions = allOptionDefinitions
    return allOptionDefinitions
  }

  async getOptions () {
    const commandLineArgs = await this.loadModule('command-line-args')
    const options = Object.assign({}, this.options, commandLineArgs(this.allOptionDefinitions, { camelCase: true }))
    if (!options.silent) {
      const ViewClass = await this.getViewClass(options)
      const view = new ViewClass(options)
      options._view = view
    }
    return options
  }

  async printUsage () {
    const commandLineUsage = await this.loadModule('command-line-usage')
    this.errorLog(commandLineUsage([
      {
        header: 'test-runner',
        content: 'Minimal, flexible, extensible command-line test runner.'
      },
      {
        header: 'Synopsis',
        content: '$ test-runner [<options>] {underline file} {underline ...}'
      },
      {
        header: 'Options',
        optionList: this.optionDefinitions,
        hide: 'files'
      },
      {
        header: 'View options',
        optionList: this.viewOptionDefinitions
      },
      {
        content: 'For more information see: {underline https://github.com/test-runner-js/test-runner}'
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

  async getTom (files, options) {
    const path = await this.loadModule('path')
    const toms = []
    for (const file of files) {
      const tom = await this.loadModule(path.resolve(process.cwd(), file))
      if (tom) {
        if (tom.name === 'tom') {
          const path = await this.loadModule('path')
          const extname = path.extname(file)
          const basename = path.basename(file, extname)
          tom.name = basename
        }
        toms.push(tom)
      } else {
        throw new Error('No TOM exported: ' + file)
      }
    }
    const name = await this.getPackageName()
    const Tom = await this.loadModule('test-object-model')
    return Tom.combine(toms, name, options)
  }

  async runTests (tom, options) {
    const TestRunnerCore = await this.loadModule('test-runner-core')
    const path = await this.loadModule('path')
    const runner = new TestRunnerCore(tom, { view: options._view, debug: options.debug })
    runner.on('fail', () => {
      process.exitCode = 1
    })
    return runner.start().then(() => runner)
  }

  /**
   * Start test-runner.
   * @return {Promise}
   * @fulfil {TestRunnerCore}
   */
  async start () {
    await this.getAllOptionDefinitions()
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
          const tom = await this.getTom(files, { maxConcurrency: options.maxFileConcurrency || 10 })
          if (options.maxConcurrency) {
            for (const test of tom) {
              test.options.maxConcurrency = options.maxConcurrency
            }
          }
          /* --tree */
          if (options.tree) {
            const path = await this.loadModule('path')
            const TreeView = await this.loadModule(path.resolve(__dirname, './lib/tree.js'))
            const treeView = new TreeView(tom)
            this.errorLog(treeView.toString())
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
