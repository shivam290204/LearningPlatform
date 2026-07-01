const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const frontendCurriculumDir = 'E:/LearningPlatform/noobsyte-frontend/src/curriculum';

function loadESModule(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const code = content.replace('export default', 'return');
  const fn = new Function(code);
  return fn();
}

const offlineCourses = [
  {
    title: 'Mastering Java: From Zero to Hero',
    slug: 'java-masterclass-core-to-advanced',
    description: 'Master variables, stack & heap models, parameters passing, object oriented architecture, multithreading, and database integrations without dry textbook jargon.',
    difficulty: 'beginner',
    isPublished: true
  },
  {
    title: 'Java DSA: Master Data Structures & Algorithms',
    slug: 'java-dsa-masterclass',
    description: 'Master Big-O analysis, sorting algorithms, recursion, linked lists, stacks, queues, trees, heaps, graphs, and dynamic programming in Java.',
    difficulty: 'intermediate',
    isPublished: true
  }
];

function getOfflineCourseModules(courseSlug) {
  const folder = courseSlug === 'java-dsa-masterclass' ? 'dsa' : 'java';
  const folderPath = path.join(frontendCurriculumDir, folder);
  if (!fs.existsSync(folderPath)) {
    return [];
  }
  const files = fs.readdirSync(folderPath)
    .filter(f => f.startsWith('module') && f.endsWith('.js'))
    .sort();

  return files.map((file, idx) => {
    const mData = loadESModule(path.join(folderPath, file));
    const lessons = (mData.lessons || []).map((l, lesIdx) => {
      return {
        ...l,
        _id: `${courseSlug}-${idx}-${lesIdx}`,
        sim: !!(l.visualizations && l.visualizations.length > 0),
        quiz: !!(l.quiz && l.quiz.questions && l.quiz.questions.length > 0),
        time: l.estTime || '10 min'
      };
    });
    return {
      ...mData,
      _id: `${courseSlug}-${idx}`,
      lessons
    };
  });
}

// Fetch all courses
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(200).json({
      status: 'success',
      results: offlineCourses.length,
      data: { courses: offlineCourses }
    });
  }
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

  if (mongoose.connection.readyState !== 1) {
    const offlineModules = getOfflineCourseModules(courseSlug);
    return res.status(200).json({
      status: 'success',
      results: offlineModules.length,
      data: { modules: offlineModules }
    });
  }

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

  if (mongoose.connection.readyState !== 1) {
    const courses = ['java-masterclass-core-to-advanced', 'java-dsa-masterclass'];
    for (const cSlug of courses) {
      const offlineModules = getOfflineCourseModules(cSlug);
      for (const mod of offlineModules) {
        const lesson = (mod.lessons || []).find(l => l.slug === lessonSlug);
        if (lesson) {
          let quizData = null;
          if (lesson.quiz && lesson.quiz.questions) {
            const strippedQuestions = lesson.quiz.questions.map(q => {
              const { correctAnswerIndex, explanation, ...strippedQuestion } = q;
              return strippedQuestion;
            });
            quizData = {
              lesson: lesson._id,
              questions: strippedQuestions
            };
          }
          return res.status(200).json({
            status: 'success',
            data: {
              lesson,
              quiz: quizData
            }
          });
        }
      }
    }
    return next(new AppError('No lesson found with that slug identifier.', 404));
  }

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
