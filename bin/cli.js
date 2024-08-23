#!/usr/bin/env node
import Cli from '../lib/cli.js'

const cli = new Cli()
await cli.start(process.argv.slice(2))
