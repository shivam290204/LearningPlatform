const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const progressRoutes = require('./routes/progressRoutes');
const userRoutes = require('./routes/userRoutes');
const globalErrorHandler = require('./middlewares/error');

const app = express();

// Global Middleware Configuration
app.use(cors()); // Allow cross-origin requests from the React client
app.use(express.json()); // Parse incoming JSON request payloads
app.use(express.urlencoded({ extended: true }));

// Dynamic Routing mounts
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/users', userRoutes);

// Core Health Check Route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'NoobSyte API Gateway is fully operational.',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// Catch-All 404 Undefined Routes Handler
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Resource endpoint ${req.originalUrl} not found on this server.`
  });
});

// Attach Centralized Express Exception Handling Dispatcher
app.use(globalErrorHandler);

module.exports = app;
