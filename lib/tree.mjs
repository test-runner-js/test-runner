import ansi from 'ansi-escape-sequences'

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
        todo: 'cyan'
      }
      let name = ''
      let maxConcurrency = ''
      let beforeAfter = ''
      if (tom.type === 'test') {
        if (tom.toSkip) {
          name = ansi.format(tom.name, theme.skipped)
        } else {
          name = ansi.format(tom.name, theme.test)
        }
      } else if (tom.type === 'group') {
        name = ansi.format(tom.name, theme.group)
        maxConcurrency = ansi.format(` maxConcurrency: ${tom.options.maxConcurrency}`, 'grey')
      } else {
        name = ansi.format(tom.name, theme.todo)
      }
      if (tom.options.before) {
        beforeAfter = ansi.format(' before', 'grey')
      } else if (tom.options.after) {
        beforeAfter = ansi.format(' after', 'grey')
      }
      const text = `${name}${maxConcurrency}${beforeAfter}`
      return (prev += `${'  '.repeat(tom.level())}• ${text}\n`)
    }, '')
  }
}

export default TreeView
