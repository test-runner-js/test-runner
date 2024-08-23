#!/usr/bin/env node
import Cli from '../lib/cli.js'

const cli = new Cli()
cli.start(process.argv.slice(2))
