const envVars = require('../env-vars')

class Logger {
  static error(e) {
    const { error } = console
    const data = []

    if (envVars.NODE.ENV === envVars.ENVS[1]) {
      data.push(e.stack)
    } else {
      data.push(e)
    }

    error.apply(console, data)
  }

  static info(...data) {
    if (envVars.NODE.ENV === envVars.ENVS[1]) {
      return
    }

    const { info } = console

    info.apply(console, data)
  }
}

module.exports = Logger
