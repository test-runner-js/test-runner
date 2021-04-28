import { loadModuleResolvedFrom, loadModulePathRelativeTo } from 'load-module'
import commandLineArgs from 'command-line-args'
import commandLineUsage from 'command-line-usage'
import path from 'path'
import FileSet from 'file-set'
import flatten from 'reduce-flatten'
import walkBack from 'walk-back'
import Tom from 'test-object-model'
import TestRunnerCore from 'test-runner-core'
import * as fs from 'fs/promises'
import getModulePaths from 'current-module-paths'
import { pathToFileURL } from 'url'

const modulePath = getModulePaths(import.meta.url)
const __dirname = modulePath.__dirname

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
  constructor (options = {}) {
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
      }
    ]

    this.viewOptionDefinitions = []
  }

  /* Encapsulate this in load-module */
  async loadUserModule (moduleId) {
    let mod
    mod = await loadModuleResolvedFrom(moduleId, [process.cwd(), __dirname])
    if (mod === null) {
      mod = await loadModulePathRelativeTo(moduleId, [process.cwd()])
    }
    if (mod === null) {
      throw new Error('Module not found: ' + moduleId)
    }
    return mod
  }

  async loadModule (moduleId) {
    const mod = await import(moduleId)
    return mod.default
  }

  async getViewClass (options = {}) {
    let viewModule
    if (options.view) {
      if (options.view === 'live') {
        viewModule = await this.loadModule('@test-runner/live-view')
      } else if (options.view === 'oneline') {
        viewModule = await this.loadModule('@test-runner/oneline-view')
      } else {
        viewModule = await this.loadUserModule(options.view)
      }
    } else {
      viewModule = await this.loadModule('@test-runner/default-view')
    }
    return viewModule || null
  }

  async getAllOptionDefinitions () {
    const allOptionDefinitions = this.optionDefinitions.slice()
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
    const options = Object.assign({}, this.options, commandLineArgs(this.allOptionDefinitions, { camelCase: true }))
    if (!options.silent) {
      const ViewClass = await this.getViewClass(options)
      const view = new ViewClass(options)
      options._view = view
    }
    return options
  }

  async printUsage () {
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
    const pkgFile = await fs.readFile(path.resolve(__dirname, 'package.json'), 'utf8')
    const pkg = JSON.parse(pkgFileg)
    this.errorLog('pkg.version')
  }

  async printTree (tom) {
    const TreeView = await this.loadModule(pathToFileURL(path.resolve(__dirname, './lib/tree.mjs')))
    const treeView = new TreeView(tom)
    this.errorLog(treeView.toString())
  }

  async expandGlobs (files) {
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
    const packagePath = walkBack(process.cwd(), 'package.json')
    let name
    if (packagePath) {
      const pkgFile = await fs.readFile(packagePath, 'utf8')
      const pkg = JSON.parse(pkgFile)
      name = pkg.name
    }
    return name
  }

  async getTom (files, options) {
    const toms = []
    for (const file of files) {
      const tom = await this.loadModule(pathToFileURL(path.resolve(process.cwd(), file)))
      if (tom) {
        if (tom.name === 'tom') {
          /* use the file basename instead of the default */
          const extname = path.extname(file)
          const basename = path.basename(file, extname)
          tom.name = file
        }
        toms.push(tom)
      } else {
        throw new Error('No TOM exported: ' + file)
      }
    }
    const name = await this.getPackageName()
    return Tom.combine(toms, name, options)
  }

  async runTests (tom, options) {
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
      await this.printUsage()

    /* --version */
    } else if (options.version) {
      await this.printVersion()

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
            await this.printTree(tom)
          } else {
            return this.runTests(tom, options)
          }
        } else {
          this.errorLog('one or more input files required')
          await this.printUsage()
        }
      } else {
        await this.printUsage()
      }
    }
  }
}

TestRunnerCli.Tom = Tom

export default TestRunnerCli
