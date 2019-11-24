[![view on npm](https://img.shields.io/npm/v/test-runner.svg)](https://www.npmjs.org/package/test-runner)
[![npm module downloads](https://img.shields.io/npm/dt/test-runner.svg)](https://www.npmjs.org/package/test-runner)
[![Build Status](https://travis-ci.org/test-runner-js/test-runner.svg?branch=master)](https://travis-ci.org/test-runner-js/test-runner)
[![Dependency Status](https://badgen.net/david/dep/test-runner-js/test-runner)](https://david-dm.org/test-runner-js/test-runner)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

***This project and documentation are a WIP***

# test-runner

Minimal, flexible, extensible command-line test runner.

## Synopsis

As input, test-runner takes one or more files each exporting a set of tests. This is the general syntax.

```
$ test-runner [<options>] <file> ...
```

Trivial example. Create a module which exports a [test object model](https://github.com/test-runner-js/test-object-model) instance. Add a test to the model by supplying a name and test function to `tom.test`. If the test function throws or returns a rejected promise it is considered a fail. Save this file as `test.js`.

```js
const { Tom } = require('test-runner')

const tom = new Tom()

tom.test('A successful test', function () {
  return 'This passed'
})

tom.test('A failing test', function () {
  throw new Error('This failed')
})

module.exports = tom
```

In reality, a typical test suite might look more like this.

```js
const { Tom } = require('test-runner')
const assert = require('assert')

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
$ test-runner test.js

Start: 2 tests loaded

✓ synopsis Math.random() should return a number between 0 and 1
✓ synopsis REST API should return the current todo item

Completed in 199ms. Pass: 2, fail: 0, skip: 0.
```

## Install

```
$ npm install --save-dev test-runner
```

## Other runners

Alternatively, you can run your tests with any of the following runners - each is compatible with test-object-model.

| Environment  | Description                          | Tool          |
| -----------  | ------------------------             | ------------- |
| Web          | Run your tests in headless Chrome from the command line | [web-runner](https://github.com/test-runner-js/web-runner)    |
| Multi-core   | Run a test suite across multiple CPU cores | [mc-runner](https://github.com/test-runner-js/mc-runner) |
| ECMAScript Modules | Test an Node.js ESM project natively without transpilation | [esm-runner](https://github.com/test-runner-js/esm-runner) |
| Script       | Programmatic | [test-runner-core](https://github.com/test-runner-js/test-runner-core) |


* * *

&copy; 2016-19 Lloyd Brookes \<75pound@gmail.com\>.
