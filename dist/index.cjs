'use strict';

var loadModule = require('load-module');
var commandLineArgs = require('command-line-args');
var commandLineUsage = require('command-line-usage');
var path = require('path');
var FileSet = require('file-set');
var walkBack = require('walk-back');
var Tom = require('@test-runner/tom');
var TestRunnerCore = require('@test-runner/core');
var origFs = require('fs');
var getModulePaths = require('current-module-paths');
var url = require('url');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var commandLineArgs__default = /*#__PURE__*/_interopDefaultLegacy(commandLineArgs);
var commandLineUsage__default = /*#__PURE__*/_interopDefaultLegacy(commandLineUsage);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var FileSet__default = /*#__PURE__*/_interopDefaultLegacy(FileSet);
var walkBack__default = /*#__PURE__*/_interopDefaultLegacy(walkBack);
var Tom__default = /*#__PURE__*/_interopDefaultLegacy(Tom);
var TestRunnerCore__default = /*#__PURE__*/_interopDefaultLegacy(TestRunnerCore);
var origFs__namespace = /*#__PURE__*/_interopNamespace(origFs);
var getModulePaths__default = /*#__PURE__*/_interopDefaultLegacy(getModulePaths);

const modulePath = getModulePaths__default["default"]((typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('index.cjs', document.baseURI).href)));
const __dirname$1 = modulePath.__dirname;
const fs = origFs__namespace.promises;

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
    this.options = options;
    this.errorLog = options.errorLog || console.error;
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
    ];

    this.viewOptionDefinitions = [];
  }

  /* Encapsulate this in load-module */
  async loadUserModule (moduleId) {
    let mod;
    mod = await loadModule.loadModuleResolvedFrom(moduleId, [process.cwd(), __dirname$1]);
    if (mod === null) {
      mod = await loadModule.loadModuleRelativeTo(moduleId, [process.cwd()]);
    }
    if (mod === null) {
      throw new Error('Module not found: ' + moduleId)
    }
    return mod
  }

  async loadModule (moduleId) {
    const mod = await (function (t) { return Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require(t)); }); })(moduleId);
    return mod.default
  }

  async getViewClass (options = {}) {
    let viewModule;
    if (options.view) {
      if (options.view === 'live') {
        viewModule = await this.loadModule('@test-runner/live-view');
      } else if (options.view === 'oneline') {
        viewModule = await this.loadModule('@test-runner/oneline-view');
      } else {
        viewModule = await this.loadUserModule(options.view);
      }
    } else {
      viewModule = await this.loadModule('@test-runner/default-view');
    }
    return viewModule || null
  }

  async getAllOptionDefinitions () {
    const allOptionDefinitions = this.optionDefinitions.slice();
    const coreOptions = commandLineArgs__default["default"](this.optionDefinitions, { camelCase: true, partial: true });
    const ViewClass = await this.getViewClass(coreOptions);
    if (ViewClass && ViewClass.optionDefinitions) {
      this.viewOptionDefinitions = ViewClass.optionDefinitions() || [];
      allOptionDefinitions.push(...this.viewOptionDefinitions);
    }
    this.allOptionDefinitions = allOptionDefinitions;
    return allOptionDefinitions
  }

  async getOptions () {
    const options = Object.assign({}, this.options, commandLineArgs__default["default"](this.allOptionDefinitions, { camelCase: true }));
    if (!options.silent) {
      const ViewClass = await this.getViewClass(options);
      const view = new ViewClass(options);
      options._view = view;
    }
    return options
  }

  async printUsage () {
    this.errorLog(commandLineUsage__default["default"]([
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
    ]));
  }

  async printVersion () {
    const pkgFile = await fs.readFile(path__default["default"].resolve(__dirname$1, 'package.json'), 'utf8');
    const pkg = JSON.parse(pkgFile);
    this.errorLog(pkg.version);
  }

  async printTree (tom) {
    const TreeView = await this.loadModule(url.pathToFileURL(path__default["default"].resolve(__dirname$1, './lib/tree.js')));
    const treeView = new TreeView(tom);
    this.errorLog(treeView.toString());
  }

  async expandGlobs (globs) {
    const result = new Set();
    for (const glob of globs) {
      const fileSet = new FileSet__default["default"]();
      await fileSet.add(glob);
      if (fileSet.notExisting.length) {
        throw new Error('These files do not exist: ' + fileSet.notExisting.join(', '))
      }
      for (const file of fileSet.files) {
        result.add(file);
      }
    }
    return Array.from(result.values())
  }

  async getPackageName () {
    const packagePath = walkBack__default["default"](process.cwd(), 'package.json');
    let name;
    if (packagePath) {
      const pkgFile = await fs.readFile(packagePath, 'utf8');
      const pkg = JSON.parse(pkgFile);
      name = pkg.name;
    }
    return name
  }

  async getTom (files, options) {
    const toms = [];
    for (const file of files) {
      const tom = await this.loadModule(url.pathToFileURL(path__default["default"].resolve(process.cwd(), file)));
      if (tom) {
        if (tom.name === 'tom') {
          tom.name = file;
        }
        toms.push(tom);
      } else {
        throw new Error('No TOM exported: ' + file)
      }
    }
    const name = await this.getPackageName();
    return Tom__default["default"].combine(toms, name, options)
  }

  async runTests (tom, options) {
    const runner = new TestRunnerCore__default["default"](tom, { view: options._view, debug: options.debug });
    runner.on('fail', () => {
      process.exitCode = 1;
    });
    return runner.start().then(() => runner)
  }

  /**
   * Start test-runner.
   * @return {Promise}
   * @fulfil {TestRunnerCore}
   */
  async start () {
    await this.getAllOptionDefinitions();
    const options = await this.getOptions();

    /* --help */
    if (options.help) {
      await this.printUsage();

    /* --version */
    } else if (options.version) {
      await this.printVersion();

    /* --files */
    } else {
      if (options.files && options.files.length) {
        const files = await this.expandGlobs(options.files);
        if (files.length) {
          const tom = await this.getTom(files, { maxConcurrency: options.maxFileConcurrency || 10 });
          if (options.maxConcurrency) {
            for (const test of tom) {
              test.options.maxConcurrency = options.maxConcurrency;
            }
          }
          /* --tree */
          if (options.tree) {
            await this.printTree(tom);
          } else {
            return this.runTests(tom, options)
          }
        } else {
          this.errorLog('one or more input files required');
          await this.printUsage();
        }
      } else {
        await this.printUsage();
      }
    }
  }
}

TestRunnerCli.Tom = Tom__default["default"];

module.exports = TestRunnerCli;
