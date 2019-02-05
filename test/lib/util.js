function halt (err) {
  console.error(require('util').inspect(err, { depth: 6, colors: true }))
  process.exitCode = 1
}

function sleep (ms, result) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(result), ms)
  })
}

exports.halt = halt
exports.sleep = sleep
