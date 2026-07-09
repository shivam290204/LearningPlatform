const express = require('express');
const { askTutor } = require('../controllers/tutorController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Enforce authentication protection across all chat interactions
router.use(protect);

router.post('/chat', askTutor);

module.exports = router;
