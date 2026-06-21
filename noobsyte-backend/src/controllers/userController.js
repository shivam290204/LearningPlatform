const crypto = require('crypto');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Progress = require('../models/Progress');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Toggle bookmark status (add / remove lesson from bookmarks array)
exports.toggleBookmark = asyncHandler(async (req, res, next) => {
  const { lessonId } = req.params;

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    return next(new AppError('No lesson found with that ID.', 404));
  }

  const user = await User.findById(req.user._id);

  // Check if bookmark exists
  const isBookmarked = user.bookmarks.includes(lessonId);

  if (isBookmarked) {
    user.bookmarks.pull(lessonId);
  } else {
    user.bookmarks.push(lessonId);
  }

  await user.save();

  res.status(200).json({
    status: 'success',
    isBookmarked: !isBookmarked,
    data: {
      bookmarks: user.bookmarks
    }
  });
});

// Fetch all bookmarked lessons populated with titles & slugs
exports.getBookmarks = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('bookmarks');

  res.status(200).json({
    status: 'success',
    results: user.bookmarks.length,
    data: {
      bookmarks: user.bookmarks
    }
  });
});

// Dynamic course completions verification and cryptographically tracked certificate generation

exports.generateCertificate = asyncHandler(async (req, res, next) => {
  const { courseSlug } = req.params;

  const course = await Course.findOne({ slug: courseSlug });
  if (!course) {
    return next(new AppError('No course found with that slug.', 404));
  }

  // Find all modules under this course
  const modules = await Module.find({ course: course._id });
  const moduleIds = modules.map(m => m._id);

  // Find all lessons under these modules
  const lessons = await Lesson.find({ module: { $in: moduleIds } });
  const lessonIds = lessons.map(l => l._id);

  if (lessonIds.length === 0) {
    return next(new AppError('This syllabus track is currently empty or under curation.', 400));
  }

  // Count user completed lessons logs
  const completions = await Progress.find({
    user: req.user._id,
    lesson: { $in: lessonIds },
    isCompleted: true
  });

  const totalLessons = lessonIds.length;
  const completedLessons = completions.length;

  // Enforce structural graduation locks (Fail-safe)
  // For testing in developmental environments, if no lessons are seeded, we allow unlocking!
  if (completedLessons < totalLessons && totalLessons > 0) {
    // Return standard error locks
    return next(new AppError(`Graduation blocked. You have only completed ${completedLessons} out of ${totalLessons} lessons inside this track.`, 403));
  }

  // Calculate unique verified credential tracking verification hash
  const verificationHash = crypto
    .createHash('sha256')
    .update(`${req.user._id}-${course._id}-${process.env.JWT_SECRET || 'secret-salt-key-noobsyte'}`)
    .digest('hex')
    .substring(0, 16)
    .toUpperCase();

  res.status(200).json({
    status: 'success',
    data: {
      courseTitle: course.title,
      studentName: req.user.name,
      verificationHash,
      issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      totalLessons
    }
  });
});
