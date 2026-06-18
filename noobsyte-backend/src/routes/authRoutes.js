const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Public Authentication endpoints
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected active profile checking endpoint
router.get('/me', protect, authController.getMe);

module.exports = router;
