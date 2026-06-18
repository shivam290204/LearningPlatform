const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Enforce authentication protection middleware globally across all user routes
router.use(protect);

router.post('/bookmarks/:lessonId', userController.toggleBookmark);
router.get('/bookmarks', userController.getBookmarks);
router.post('/courses/:courseSlug/certificate', userController.generateCertificate);

module.exports = router;
