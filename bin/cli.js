#!/usr/bin/env node
import TestRunner from 'test-runner'

const runner = new TestRunner()
runner.start(process.argv.slice(2)).catch(err => console.error(err))
