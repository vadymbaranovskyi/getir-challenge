const fs = require('fs')
const path = require('path')

const basename = path.basename(__filename)
const modules = {}

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
  })
  .map((file) => {
    const modulePath = path.join(__dirname, file)
    const moduleName = path.parse(modulePath).name

    modules[moduleName] = require(modulePath)
  })

module.exports = modules
