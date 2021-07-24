import('./start.mjs')
import('./help.mjs')
import('./test-runner-cli.mjs')

process.on('unhandledRejection', err => {
  console.error(err)
  process.exitCode = 1
})
