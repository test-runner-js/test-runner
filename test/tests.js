import('./start.js')
import('./help.js')
import('./test-runner-cli.js')

process.on('unhandledRejection', err => {
  console.error(err)
  process.exitCode = 1
})
