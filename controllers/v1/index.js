const { Router } = require('express')

const records = require('./records')

module.exports = Router()
  .use('/records', records)
