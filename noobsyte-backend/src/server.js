// Load environment variables as early as possible
require('dotenv').config();

// Handle uncaught operational anomalies gracefully
process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION! Shutting down server...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

const { execSync } = require('child_process');
const app = require('./app');
const connectDB = require('./config/db');

// Verify Docker daemon availability on startup
try {
  execSync('docker info', { stdio: 'ignore' });
  console.log('🐳 Docker daemon is reachable. Sandbox compiler is active.');
} catch (err) {
  console.error('\n❌ CRITICAL ERROR: Docker daemon is not running or unreachable!');
  console.error('The compiler service requires Docker to execute user code in a secure sandbox.');
  console.error('Please start Docker Desktop and ensure it is accessible.');
  console.error('Shutting down server to prevent un-sandboxed code execution...');
  process.exit(1); // Fail loudly!
}

// Connect to MongoDB Database
connectDB();

// Sweep stale sandbox folders to clean up compilation artifacts
const fs = require('fs');
const path = require('path');

const cleanStaleSandboxes = () => {
  const sandboxDir = path.join(__dirname, 'temp_sandbox');
  if (fs.existsSync(sandboxDir)) {
    try {
      const files = fs.readdirSync(sandboxDir);
      const now = Date.now();
      let count = 0;
      files.forEach(file => {
        const filePath = path.join(sandboxDir, file);
        const stats = fs.statSync(filePath);
        // If directory is older than 5 minutes, clean it up
        if (now - stats.mtimeMs > 5 * 60 * 1000) {
          fs.rmSync(filePath, { recursive: true, force: true });
          count++;
        }
      });
      if (count > 0) {
        console.log(`🧹 Swept ${count} stale compilation sandbox directories.`);
      }
    } catch (err) {
      console.error('Error sweeping sandbox directories:', err.message);
    }
  }
};

// Run sandbox cleanup on startup
cleanStaleSandboxes();
// Periodically sweep every 30 minutes
setInterval(cleanStaleSandboxes, 30 * 60 * 1000);

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
