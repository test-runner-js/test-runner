#!/usr/bin/env -S node --no-warnings
const TestRunner = require('../')
const cli = new TestRunner()
cli.start().catch(err => {
  console.error(require('util').inspect(err, { depth: 6, colors: true }))
  process.exitCode = 1
})

process.on('uncaughtException', (err, origin) => {
  cli.errorLog(`\nAn ${origin} was thrown, possibly in a separate tick.\n`)
  cli.errorLog(err)
  process.exit(1)
})
process.on('unhandledRejection', (reason, promise) => {
  cli.errorLog(`\nAn unhandledRejection was thrown. Please ensure the rejecting promise is returned from the test function.\n`)
  cli.errorLog(reason)
  process.exit(1)
})

const warnings = []
process.on('warning', warning => {
  warnings.push(warning)
})

process.on('exit', () => {
  for (const warning of warnings)
  console.log(warning)
})
