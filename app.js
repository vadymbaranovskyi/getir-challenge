const envVars = require('./env-vars')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express')

const Logger = require('./components/Logger')
const controllers = require('./controllers')

const app = express()

app.disable('x-powered-by')
app.set('trust proxy', 'loopback')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(
  cookieParser(envVars.SECRET, {
    httpOnly: true
  })
)

app.use(controllers)

const server = app.listen(envVars.PORT, () => {
  const addr = server.address()
  let addrstr

  if (typeof addr === 'string') {
    addrstr = 'pipe ' + addr
  } else {
    addrstr = 'port ' + addr.port
  }

  Logger.info('Listening on ' + addrstr)
})
