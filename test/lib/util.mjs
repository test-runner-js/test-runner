import util from 'util'
util.inspect.defaultOptions.depth = 6
util.inspect.defaultOptions.breakLength = process.stdout.columns
util.inspect.defaultOptions.maxArrayLength = Infinity

export function halt (err) {
  console.error(err)
  process.exit(1)
}
