const { HttpError, InternalServerError } = require('http-errors')

const Logger = require('../components/Logger')

module.exports = (fn) => {
  return (...args) => {
    const res = args[1]

    return fn(...args)
      .then((body) => {
        if (typeof body === 'undefined') {
          return
        }

        const data = {
          code: 0,
          msg: 'Success',
          records: body
        }

        return res.status(200).json(data)
      })
      .catch((err) => {
        let message
        let statusCode

        if (err instanceof HttpError) {
          message = err.message
          statusCode = err.statusCode
        } else {
          Logger.error(err)

          const serverError = InternalServerError()

          message = serverError.message
          statusCode = serverError.statusCode
        }

        const data = {
          code: statusCode,
          msg: message
        }

        return res.status(statusCode).json(data)
      })
  }
}
