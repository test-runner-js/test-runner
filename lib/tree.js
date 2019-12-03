const ansi = require('ansi-escape-sequences')

class TreeView {
  constructor (tom) {
    this.tom = tom
  }

  toString () {
    return Array.from(this.tom).reduce((prev, tom) => {
      const theme = {
        group: 'magenta',
        skipped: 'grey',
        test: 'white',
        todo: 'grey'
      }
      let name = ''
      let maxConcurrency = ''
      if (tom.testFn && !tom.children.length) {
        if (tom.markedSkip) {
          name = ansi.format(tom.name, theme.skipped)
        } else {
          name = ansi.format(tom.name, theme.test)
        }
      } else if (!tom.testFn && tom.children.length) {
        name = ansi.format(tom.name, theme.group)
        maxConcurrency = ansi.format(` maxConcurrency: ${tom.maxConcurrency}`, 'grey')
      } else {
        name = ansi.format(tom.name, theme.todo)
      }
      const text = `${name}${maxConcurrency}`
      return (prev += `${'  '.repeat(tom.level())}• ${text}\n`)
    }, '')
  }
}

module.exports = TreeView
