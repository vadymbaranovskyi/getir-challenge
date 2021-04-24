require('dotenv').config()

const envs = ['development', 'production', 'test']
const env = process.env.NODE_ENV || envs[0]
const port = process.env.PORT

module.exports = {
  MONGO: {
    URL: process.env.MONGO_URL || ''
  },
  NODE: {
    ENV: envs.indexOf(env) !== -1 ? env : envs[0]
  },
  ENVS: envs,
  PORT: Number.parseInt(port) || 8080,
  SECRET: process.env.SECRET
}
