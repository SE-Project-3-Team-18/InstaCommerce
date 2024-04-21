const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const CustomLogger = require('./utils/logger')
const { errorHandler, CustomError } = require('./utils/error')
const ServiceRegistryClient = require('./utils/serviceRegistry')
const proxy = require('./proxy')

// Initialise instance of CustomLogger singleton service.
CustomLogger.getInstance()

app.use('/', (req, res, next) => {
  CustomLogger
    .getInstance()
    .logHttpRequest(req, res);
  next();
})

app.use(cors())

app.use('/api/auth/signUp', async (req, res, next) => {
  try {
    const baseUrl = await ServiceRegistryClient.getUrl('User-Management')
    const targetUrl = new URL('/api/signup', baseUrl).toString()
    await proxy(req, res, targetUrl)
  } catch (e) {
    next(e)
  }
})

app.use('/api', errorHandler)

module.exports = app
