[![view on npm](https://img.shields.io/npm/v/test-runner.svg)](https://www.npmjs.org/package/test-runner)
[![npm module downloads](https://img.shields.io/npm/dt/test-runner.svg)](https://www.npmjs.org/package/test-runner)
[![Build Status](https://travis-ci.org/test-runner-js/test-runner.svg?branch=master)](https://travis-ci.org/test-runner-js/test-runner)
[![Dependency Status](https://badgen.net/david/dep/test-runner-js/test-runner)](https://david-dm.org/test-runner-js/test-runner)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

# test-runner

A command-line interface for test-runner-core, a minimal, isomorphic, run-anywhere test-runner designed for simplicity and extensibility.

This tool is for running a TOM on the command line. You can run your TOM in various ways using various tools: 

| Environment  | Description                          | Tool          |
| -----------  | ------------------------             | ------------- |
| Web          | Run your tests in Chrome from the command line | web-runner    |
| Command-line | Run your test-suite locally or in CI | test-runner   |
| Multi-core   | Run across multiple CPU cores        | mc-runner   |
| ECMAScript Modules | Run an ECM project             | esm-runner   |
| Script       | Programmatic                         | test-runner-core |   


## Synopsis

Create a module which exports a Test Object Model (TOM) containing one or more tests, save it as `test.js`.

```js
const { Tom } = require('test-runner')
const assert = require('assert')

const tom = new Tom('Synopsis')

tom.test('Maths should be quick', function () {
  const result = 2 + 2 - 1
  assert.strictEqual(result, 3)
})

tom.test('Supahot should give the wrong number', function () {
  const wrongNumber = () => true
  assert.strictEqual(wrongNumber(), true)
})

module.exports = tom
```

Run the tests using test-runner.

```
$ test-runner test.js

Running 2 tests

 ✓ Synopsis Maths should be quick
 ✓ Synopsis Supahot should give the wrong number

Completed in: 14ms. Pass: 2, fail: 0, skip: 0.
```

## Install

Install via npm. 

```
$ npm install --save-dev test-runner
```


* * *

&copy; 2016-19 Lloyd Brookes \<75pound@gmail.com\>.
