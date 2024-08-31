#!/usr/bin/env node
import TestRunner from 'test-runner'

const runner = new TestRunner()
runner.cli(process.argv.slice(2))
