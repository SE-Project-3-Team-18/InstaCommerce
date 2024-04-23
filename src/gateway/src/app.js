const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const CustomLogger = require('./utils/logger')
const { errorHandler } = require('./utils/error')
const AuthRouter = require('./routes/auth')
const ProfileRouter = require('./routes/profile')
const NotificationRouter = require('./routes/notification')
const ProductRouter = require('./routes/product')
const CartRouter = require('./routes/cart')

// Initialise instance of CustomLogger singleton service.
CustomLogger.getInstance()

app.use('/', (req, res, next) => {
  CustomLogger
    .getInstance()
    .logHttpRequest(req, res);
  next();
})

app.use(cors())

app.use('/api', (req, res, next) => {
  console.log(req.originalUrl)
  next()
})
app.use('/api/auth', AuthRouter)
app.use('/api/profile', ProfileRouter)
app.use('/api/notification', NotificationRouter)
app.use('/api/product', ProductRouter)
app.use('/api/cart', CartRouter)

app.use('/api', errorHandler)

module.exports = app
