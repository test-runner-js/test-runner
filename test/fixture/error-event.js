const Tom = require('test-object-model')
const EventEmitter = require('events')

const tom = module.exports = new Tom()

tom.skip('unhandled error event', () => {
  const emitter = new EventEmitter()
  const err = new Error('broken')
  process.nextTick(function () {
    emitter.emit('error', err)
  })
})

tom.test('unhandled error event fixed', async () => {
  const emitter = new EventEmitter()
  const err = new Error('broken')
  return new Promise((resolve, reject) => {
    process.nextTick(function () {
      emitter.on('error', reject)
      emitter.emit('error', err)
    })
  })
})

tom.skip('nextTick exception', () => {
  const err = new Error('broken')
  process.nextTick(function () {
    throw err
  })
})

tom.test('nextTick exception fixed', async () => {
  const err = new Error('broken')
  return new Promise((resolve, reject) => {
    process.nextTick(function () {
      reject(err)
    })
  })
})

tom.skip('stream fails', function () {
  const { PassThrough } = require('stream')
  const stream = new PassThrough()
  stream.on('readable', function () {
    throw new Error('broken')
  })
  stream.write('whatever')
  stream.on('error', function (err) {
    console.log('fafsdasdf', err)
  })
})

tom.skip('stream fails can\'t be fixed as they run in a separate tick', async function () {
  const { PassThrough } = require('stream')
  const stream = new PassThrough()
  return new Promise((resolve, reject) => {
    stream.on('error', reject)
    stream.on('readable', function () {
      throw new Error('broken')
    })
    try {
      stream.write('whatever')
    } catch (err) {
      reject(err)
    }
  })
})

tom.test('unhandledRejection', async function () {
  const err = new Error('broken')
  Promise.reject(err)
})
