const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const winston = require('winston')
const {
  serviceCheckFrequency,
  serviceAliveTimeout,
  serverPort,
} = require('./config');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: 'app.log',
      handleExceptions: false, // Do not handle uncaught exceptions
      exitOnError: false, // Do not exit on transport errors
      flags: 'a', // Append to the log file
    }),
  ],
});

const app = express();
const port = serverPort;

// In-memory store for registered services
const services = {};

app.use(cors());
app.use(bodyParser.json());

// Endpoint for registering a service
app.post('/register', (req, res) => {
  const {
    serviceName,
    host,
    port,
    metadata,
  } = req.body;

  if (
    !serviceName ||
    !host ||
    !port
  ) {
    return res
      .status(400)
      .json({
        message: 'Missing required fields',
      });
  }

  services[serviceName] = {
    host,
    port,
    metadata,
    lastHeartbeat: Date.now(),
  };
  logger.info({
    timestamp: new Date().toISOString(),
    message: `Registered ${serviceName} at ${host}:${port}`,
  })

  res
    .status(200)
    .json({
      message: 'Service registered successfully',
    });
});

// Endpoint for discovering a service
app.get('/discover/:serviceName', (req, res) => {
  const { serviceName } = req.params;

  const service = services[serviceName];
  if (!service) {
    return res
      .status(404)
      .json({
        message: 'Service not found',
      });
  }

  res
    .status(200)
    .json(service);
});

// Endpoint for receiving heartbeats
app.post('/heartbeat/:serviceName', (req, res) => {
  const { serviceName } = req.params;

  if (!services[serviceName]) {
    return res
      .status(404)
      .json({
        message: 'Service not registered',
      });
  }

  // Update last heartbeat time
  services[serviceName].lastHeartbeat = Date.now();
  logger.info({
    timestamp: new Date().toISOString(),
    message: `Received heartbeat from ${serviceName}`,
  })

  res.status(200).json({ message: 'Heartbeat received' });
});

// Periodically check for expired services and remove them
setInterval(() => {
  const currentTime = Date.now();
  Object.keys(services).forEach(serviceName => {
    const lastHeartbeatTime = services[serviceName].lastHeartbeat
    if (currentTime - lastHeartbeatTime > serviceAliveTimeout) {
      logger.info({
        timestamp: new Date().toISOString(),
        message: `Removing ${serviceName} due to timeout`,
      })
      delete services[serviceName];
    }
  });
}, serviceCheckFrequency);

app.listen(port, () => {
  console.log(`Service registry listening at http://localhost:${port}`);
});
