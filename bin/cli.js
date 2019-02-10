#!/usr/bin/env node
const TestRunner = require('../')
const cli = new TestRunner()
cli.start().catch(err => console.error('RUNNER FAIL', err))
