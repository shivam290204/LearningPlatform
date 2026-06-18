// Load environment variables as early as possible
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

// Handle uncaught operational anomalies gracefully
process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION! Shutting down server...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

// Connect to MongoDB Database
connectDB();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`NoobSyte Server active on Port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});

// Handle unhandled asynchronous promise rejections gracefully
process.on('unhandledRejection', err => {
  console.error('UNHANDLED REJECTION! Gracefully shutting down server...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
