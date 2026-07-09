const express = require("express");
const rateLimit = require("express-rate-limit");
const { protect } = require("../middlewares/auth");
const { runCode } = require("../controllers/compilerController");

const router = express.Router();

// Strict rate limiting specifically for code execution runs (30 reqs per 15 minutes)
const compilerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each user to 30 requests per window
  keyGenerator: (req) => {
    // Limit per authenticated user if available, otherwise by IP
    return req.user ? req.user._id.toString() : req.ip;
  },
  message: 'Too many code execution requests from this account/IP. Please try again after 15 minutes.'
});

router.post("/run", protect, compilerLimiter, runCode);

module.exports = router;
