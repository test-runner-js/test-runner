const ansi = require('ansi-escape-sequences')

class TreeView {
  constructor (tom) {
    this.tom = tom
  }

  toString () {
    return Array.from(this.tom).reduce((prev, tom) => {
      const name = tom.testFn ? tom.name : ansi.format(tom.name, 'magenta')
      const maxConcurrency = tom.children.length ? ansi.format(` maxConcurrency: ${tom.maxConcurrency}`, 'grey') : ''
      const text = `${name}${maxConcurrency}`
      return (prev += `${'  '.repeat(tom.level())}- ${text}\n`)
    }, '')
  }
}

module.exports = TreeView
