[![view on npm](https://img.shields.io/npm/v/test-runner.svg)](https://www.npmjs.org/package/test-runner)
[![npm module downloads](https://img.shields.io/npm/dt/test-runner.svg)](https://www.npmjs.org/package/test-runner)
[![Build Status](https://travis-ci.org/test-runner-js/test-runner.svg?branch=master)](https://travis-ci.org/test-runner-js/test-runner)
[![Dependency Status](https://badgen.net/david/dep/test-runner-js/test-runner)](https://david-dm.org/test-runner-js/test-runner)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

***This project and documentation are a WIP***

# test-runner

Full-featured, fast, lightweight command-line test runner. Part of a suite of tools to help the full-stack JavaScript engineer create and test isomorphic code.

## Synopsis

As input, test-runner takes one or more files each exporting a set of tests. The tests in each file are run with a controllable order and concurrency, a report is printed and the command exits with a non-zero code if anything failed.

This is the general syntax (see [here](https://github.com/test-runner-js/test-runner/wiki/test-runner-command-line-options) for the full usage guide):

```
$ test-runner [<options>] <file> ...
```

### Test file basics

A test file is a module (either CommonJS or ECMAScript) which must export a [test object model](https://github.com/test-runner-js/test-object-model) instance. This test file can be run natively (no build or transpilation step required) in Node.js, the browser (in headless Chromium) or both (isomorphic). Add tests to the model by invoking [`tom.test`](https://github.com/test-runner-js/test-object-model/blob/master/docs/API.md#module_test-object-model--Tom+test) with a name and test function.

Trivial example. If a test function throws or returns a rejected promise it is considered a fail.

```js
const { Tom } = require('test-runner')

const tom = new Tom()

tom.test('A successful sync test', function () {
  return 'This passed'
})

tom.test('A failing sync test', function () {
  throw new Error('This failed')
})

tom.test('A successful async test', async function () {
  return 'This passed'
})

tom.test('A failing async test', async function () {
  throw new Error('This failed')
})

tom.test('Also a failing async test', async function () {
  return Promise.reject(new Error('This failed'))
})

module.exports = tom
```

### Test CommonJS JavaScript using Node.js

In reality, a typical test suite might look more like this. Save this as `test.js`.

```js
const { Tom } = require('test-runner')
const assert = require('assert').strict
const fetch = require('node-fetch')

const tom = new Tom()

tom.test('Math.random() should return a number between 0 and 1', function () {
  const result = Math.random()
  assert.equal(typeof result, 'number')
  assert.ok(result >= 0 && result <= 1)
})

tom.test('REST API should return the current todo item', async function () {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  const todo = await response.json()
  assert.equal(todo.userId, 1)
  assert.equal(todo.title, 'delectus aut autem')
})

module.exports = tom
```

Run the tests using test-runner.

```
$ npx test-runner test.js

Start: 2 tests loaded

✓ synopsis Math.random() should return a number between 0 and 1
✓ synopsis REST API should return the current todo item

Completed in 199ms. Pass: 2, fail: 0, skip: 0.
```

### More examples

* [How to test ECMAScript modules using Node.js](https://github.com/test-runner-js/test-runner/wiki/How-to-test-ECMAScript-modules-using-Node.js)
* [How to test ECMAScript modules in the browser](https://github.com/test-runner-js/test-runner/wiki/How-to-test-ECMAScript-modules-in-the-browser)


## Install

```
$ npm install --save-dev test-runner
```

## Test-runner tool kit

Alternatively, you can run your tests with any of the following runners - each is compatible with test-object-model.

| Environment  | Description                          | Tool          |
| -----------  | ------------------------             | ------------- |
| Web          | Run your tests in a headless Chromium browser from the command line | [web-runner](https://github.com/test-runner-js/web-runner)    |
| Node.js | Test ECMAScript modules natively in Node.js | [esm-runner](https://github.com/test-runner-js/esm-runner) |

## See also

Please see [the wiki](https://github.com/test-runner-js/test-runner/wiki) for more examples.

* * *

&copy; 2016-20 Lloyd Brookes \<75pound@gmail.com\>.
