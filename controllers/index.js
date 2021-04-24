const { NotFound: NotFoundError } = require('http-errors')
const { Router } = require('express')

const v1 = require('./v1')
const { wrap } = require('../middlewares')

const routeAll = async () => {
  throw new NotFoundError()
}

module.exports = Router()
  .use('/v1', v1)
  .all('*', wrap(routeAll))
