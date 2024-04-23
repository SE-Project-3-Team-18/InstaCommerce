const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../config')

const unknownEndpoint = (request, response) => {
  response
    .status(404)
    .send({
      error: 'unknown endpoint',
    })
}

function sendUnauthorizedResponse(res, message) {
  return res
    .status(401)
    .json({
      success: false,
      message,
    })
}

const extractToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization
  if (!authorizationHeader) {
    return sendUnauthorizedResponse(res, 'Invalid/missing token')
  }

  const token = authorizationHeader
  if (!token) {
    return sendUnauthorizedResponse(res, 'Invalid/missing token')
  }

  try {
    const decodedToken = jwt.verify(token, jwtSecret)
    req.tokenPayload = decodedToken
    next()
  } catch (error) {
    return sendUnauthorizedResponse(res, 'Invalid/missing token')
  }
}

const extractUserId = (req, res, next) => {
  if (
    !req.tokenPayload ||
    !req.tokenPayload.userId
  ) {
    return sendUnauthorizedResponse(res, 'Unauthorized')
  }

  req.userId = req.tokenPayload.userId
  req.headers['X-User-Id'] = req.userId
  next()
}

const extractSellerId = (req, res, next) => {
  if (
    !req.tokenPayload ||
    !req.tokenPayload.sellerId
  ) {
    return sendUnauthorizedResponse(res, 'Unauthorized')
  }

  req.sellerId = req.tokenPayload.sellerId
  req.headers['X-Seller-Id'] = req.sellerId
  next()
}

const verifySeller = (req, res, next) => {
  if (req.tokenPayload.role !== 'seller') {
    return sendUnauthorizedResponse(res, 'Unauthorized')
  }

  next()
}

module.exports = {
  unknownEndpoint,
  extractToken,
  extractUserId,
  verifySeller,
  extractSellerId,
}
