const proxy = require('../proxy')
const { extractToken, extractUserId } = require('../utils/middleware')
const ServiceRegistryClient = require('../utils/serviceRegistry')

const OrderRouter = require('express').Router()

OrderRouter.get('/:orderId',
  extractToken,
  extractUserId,
  async (req, res, next) => {
    try {
      const baseUrl = await ServiceRegistryClient.getUrl('Order')
      const targetUrl = new URL('/api/order/:orderId', baseUrl).toString()
      await proxy(req, res, targetUrl)
    } catch (e) {
      next(e)
    }
  }
)

OrderRouter.post('/cancel/:orderId',
  extractToken,
  extractUserId,
  async (req, res, next) => {
    try {
      const baseUrl = await ServiceRegistryClient.getUrl('Order')
      const targetUrl = new URL('/api/order/cancel/:orderId', baseUrl).toString()
      await proxy(req, res, targetUrl)
    } catch (e) {
      next(e)
    }
  }
)

OrderRouter.post('/all',
  extractToken,
  extractUserId,
  async (req, res, next) => {
    try {
      const baseUrl = await ServiceRegistryClient.getUrl('Order')
      const targetUrl = new URL('/api/order/all', baseUrl).toString()
      await proxy(req, res, targetUrl)
    } catch (e) {
      next(e)
    }
  }
)

module.exports = OrderRouter
