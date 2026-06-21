const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const progressRoutes = require('./routes/progressRoutes');
const userRoutes = require('./routes/userRoutes');
const globalErrorHandler = require('./middlewares/error');

const app = express();

// Enable secure HTTP headers
app.use(helmet());

// Prevent NoSQL query injection
app.use(mongoSanitize());

// Rate Limiting to prevent DoS/brute-force flooding
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  message: 'Too many requests from this IP. Please try again after 15 minutes.'
});
app.use('/api', limiter);

// Hardened CORS Configuration (restrict to local React client)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10kb' })); // Parse incoming JSON request payloads safely
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

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
