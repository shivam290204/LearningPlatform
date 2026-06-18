const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Fetch all courses
exports.getCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({ isPublished: true });

  res.status(200).json({
    status: 'success',
    results: courses.length,
    data: { courses }
  });
});

// Fetch all modules for a course
exports.getCourseModules = asyncHandler(async (req, res, next) => {
  const { courseSlug } = req.params;

  const course = await Course.findOne({ slug: courseSlug });
  if (!course) {
    return next(new AppError('No course found with that slug.', 404));
  }

  // Fetch modules sorted chronologically
  const modules = await Module.find({ course: course._id, isPublished: true }).sort('order');

  res.status(200).json({
    status: 'success',
    results: modules.length,
    data: { modules }
  });
});

// Fetch lesson details by slug including its associated Quiz
exports.getLessonBySlug = asyncHandler(async (req, res, next) => {
  const { lessonSlug } = req.params;

  const lesson = await Lesson.findOne({ slug: lessonSlug }).populate('module');
  if (!lesson) {
    return next(new AppError('No lesson found with that slug identifier.', 404));
  }

  // Aggregate its 1-to-1 Quiz if it exists
  const quiz = await Quiz.findOne({ lesson: lesson._id });

  res.status(200).json({
    status: 'success',
    data: {
      lesson,
      quiz: quiz || null
    }
  });
});

// Fuzzy search lessons by keyword query matching text index
exports.searchLessons = asyncHandler(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    return res.status(200).json({
      status: 'success',
      results: 0,
      data: { lessons: [] }
    });
  }

  // Find matching lessons using relevance sorting
  const lessons = await Lesson.find(
    { $text: { $search: q } },
    { score: { $meta: 'textScore' } }
  )
  .sort({ score: { $meta: 'textScore' } })
  .populate('module');

  res.status(200).json({
    status: 'success',
    results: lessons.length,
    data: { lessons }
  });
});
