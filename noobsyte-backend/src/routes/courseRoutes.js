const express = require('express');
const courseController = require('../controllers/courseController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Public routes for course list and module structures
router.get('/', courseController.getCourses);
router.get('/search', courseController.searchLessons);
router.get('/:courseSlug/modules', courseController.getCourseModules);

// Protected route to read detailed lessons and quizzes
router.get('/lessons/:lessonSlug', protect, courseController.getLessonBySlug);

module.exports = router;
