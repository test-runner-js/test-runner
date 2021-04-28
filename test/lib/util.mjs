export function halt (err) {
  // console.error(require('util').inspect(err, { depth: 6, colors: true }))
  console.error('ERRR', err)
  process.exit(1)
}
