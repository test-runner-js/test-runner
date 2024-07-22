#!/usr/bin/env node

process.on('uncaughtException', (err, origin) => {
  console.error(`\nAn ${origin} was thrown, possibly in a separate tick.\n`)
  console.error(err)
  process.exit(1)
})
process.on('unhandledRejection', (reason, promise) => {
  console.error('\nAn unhandledRejection was thrown. Please ensure the rejecting promise is returned from the test function.\n')
  console.error(reason)
  process.exit(1)
})

const config = {
  files: process.argv.slice(2)
}
const testMaps = []
const skipMaps = []
const onlyMaps = []

function addMap (arr, map) {
  if (map && map.size) {
    arr.push(map)
  }
}

for (const file of config.files) {
  const testModule = await import(path.resolve(file))
  addMap(testMaps, testModule.test)
  addMap(skipMaps, testModule.skip)
  addMap(onlyMaps, testModule.only)
}

if (onlyMaps.length) {
  for (const onlyMap of onlyMaps) {
    for (const [name, testFn] of onlyMap) {
      await testFn()
      console.log(`✔ ${name}`)
    }
  }
} else {
  for (const skipMap of skipMaps) {
    for (const [name] of skipMap) {
      console.log(`- ${name}`)
    }
  }
  for (const testMap of testMaps) {
    for (const [name, testFn] of testMap) {
      await testFn()
      console.log(`✔ ${name}`)
    }
  }
}
