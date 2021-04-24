const envVars = require('../../../env-vars')

const {
  BadRequest: BadRequestError,
  InternalServerError
} = require('http-errors')
const { MongoClient } = require('mongodb')
const { Router } = require('express')
const { body, validationResult } = require('express-validator')

const Logger = require('../../../components/Logger')
const { wrap } = require('../../../middlewares')

// Generate the error message based on experess-validator errors object
const generateErrorMessage = (errors = []) => {
  let message = ''

  for (const [index, error] of errors.entries()) {
    message += error.msg

    if (index !== errors.length - 1) {
      // If it's not the last item, add delimiter
      message += ' | '
    }
  }

  if (message === '') {
    message = 'Internal Server Error is occured'
  }

  return message
}

// Handle POST request
const routePost = async (req, res) => {
  const { startDate, endDate, minCount, maxCount } = req.body

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    // If there are errors in the request
    throw BadRequestError(generateErrorMessage(errors.errors))
  }

  const uri = envVars.MONGO.URL
  const client = new MongoClient(uri, { useUnifiedTopology: true })

  try {
    await client.connect()
    const database = client.db('getir-case-study') // Connect to database

    const pipeline = [
      {
        $addFields: {
          // Add a new field named "totalCount" that is sum of counts array
          totalCount: { $sum: '$counts' }
        }
      },
      {
        $project: {
          _id: false,
          key: true,
          createdAt: true,
          totalCount: true
        }
      },
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lt: new Date(endDate)
          },
          totalCount: {
            $gte: parseInt(minCount),
            $lt: parseInt(maxCount)
          }
        }
      }
    ]

    const records = await database.collection('records').aggregate(pipeline)
    const response = await records.toArray()

    return response
  } catch (er) {
    Logger.error(er)

    throw InternalServerError(er.message)
  } finally {
    await client.close()
  }
}

module.exports = Router()
  .post('/',
    body('startDate', 'startDate field is required').notEmpty(),
    body('endDate', 'endDate field is required').notEmpty(),
    body('minCount', 'minCount field is required').notEmpty(),
    body('maxCount', 'maxCount field is required').notEmpty(),
    wrap(routePost)
  )
