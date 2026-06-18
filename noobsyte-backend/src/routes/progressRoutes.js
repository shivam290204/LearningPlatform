const express = require('express');
const progressController = require('../controllers/progressController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Enforce authentication protection middleware globally across all progress telemetry routes
router.use(protect);

router.post('/lessons/:lessonId/complete', progressController.markLessonComplete);
router.post('/lessons/:lessonId/quiz-submit', progressController.submitQuizScore);
router.get('/summary', progressController.getProgressSummary);

module.exports = router;
