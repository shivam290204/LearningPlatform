const express = require('express');
const rateLimit = require('express-rate-limit');
const { submitContactMessage } = require('../controllers/contactController');

const router = express.Router();

// Dedicated rate limiter: max 5 messages per hour per IP address (100 in dev)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: process.env.NODE_ENV === 'development' ? 100 : 5, // Limit each IP to 5 requests per hour (100 in development)
  message: {
    status: 'fail',
    message: 'Too many support messages sent from this IP. Please try again after an hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', contactLimiter, submitContactMessage);

module.exports = router;
