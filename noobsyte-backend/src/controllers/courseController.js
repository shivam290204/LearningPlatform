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

// Fetch all modules for a course including their populated lessons metadata
exports.getCourseModules = asyncHandler(async (req, res, next) => {
  const { courseSlug } = req.params;

  const course = await Course.findOne({ slug: courseSlug });
  if (!course) {
    return next(new AppError('No course found with that slug.', 404));
  }

  // Fetch modules sorted chronologically
  const modules = await Module.find({ course: course._id, isPublished: true }).sort('order');

  // Aggregate lessons inside each module
  const modulesWithLessons = await Promise.all(
    modules.map(async (mod) => {
      const lessons = await Lesson.find({ module: mod._id }).sort('order');
      
      const populatedLessons = await Promise.all(
        lessons.map(async (les) => {
          const lesObj = les.toObject();
          lesObj.sim = !!(les.visualizations && les.visualizations.length > 0);
          const quizExists = await Quiz.exists({ lesson: les._id });
          lesObj.quiz = !!quizExists;
          const wordCount = les.content ? les.content.split(/\s+/).length : 0;
          const readTime = Math.max(5, Math.min(20, Math.round(wordCount / 120)));
          lesObj.time = `${readTime} min`;
          return lesObj;
        })
      );

      const modObj = mod.toObject();
      modObj.lessons = populatedLessons;
      return modObj;
    })
  );

  res.status(200).json({
    status: 'success',
    results: modulesWithLessons.length,
    data: { modules: modulesWithLessons }
  });
});

// Fetch lesson details by slug including its associated Quiz (stripped of answers)
exports.getLessonBySlug = asyncHandler(async (req, res, next) => {
  const { lessonSlug } = req.params;

  const lesson = await Lesson.findOne({ slug: lessonSlug }).populate('module');
  if (!lesson) {
    return next(new AppError('No lesson found with that slug identifier.', 404));
  }

  // Aggregate its 1-to-1 Quiz if it exists
  const quiz = await Quiz.findOne({ lesson: lesson._id });

  let quizData = null;
  if (quiz) {
    const quizObj = quiz.toObject();
    quizObj.questions = quizObj.questions.map(q => {
      const { correctAnswerIndex, explanation, ...strippedQuestion } = q;
      return strippedQuestion;
    });
    quizData = quizObj;
  }

  res.status(200).json({
    status: 'success',
    data: {
      lesson,
      quiz: quizData
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
