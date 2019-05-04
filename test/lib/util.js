function halt (err) {
  console.error(require('util').inspect(err, { depth: 6, colors: true }))
  process.exit(1)
}

exports.halt = halt
