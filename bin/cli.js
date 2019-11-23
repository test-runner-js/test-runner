#!/usr/bin/env node --no-warnings
const TestRunner = require('../')
const cli = new TestRunner()
cli.start().catch(err => {
  console.error(require('util').inspect(err, { depth: 6, colors: true }))
  process.exitCode = 1
})
