const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Mark a lesson completed
exports.markLessonComplete = asyncHandler(async (req, res, next) => {
  const { lessonId } = req.params;

  // Validate lesson exists
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    return next(new AppError('No lesson found with that ID.', 404));
  }

  // Find or create progress log
  let progress = await Progress.findOne({ user: req.user._id, lesson: lessonId });

  if (!progress) {
    progress = await Progress.create({
      user: req.user._id,
      lesson: lessonId,
      isCompleted: true,
      completedAt: new Date()
    });
  } else if (!progress.isCompleted) {
    progress.isCompleted = true;
    progress.completedAt = new Date();
    await progress.save();
  }

  res.status(200).json({
    status: 'success',
    data: {
      isCompleted: progress.isCompleted,
      completedAt: progress.completedAt,
      xpGained: 50
    }
  });
});

const Quiz = require('../models/Quiz');

// Record quiz submit scores with server-side validation
exports.submitQuizScore = asyncHandler(async (req, res, next) => {
  const { lessonId } = req.params;
  const { selectedOptionIndex, questionIndex = 0 } = req.body;

  if (selectedOptionIndex === undefined) {
    return next(new AppError('Please provide selectedOptionIndex parameter.', 400));
  }

  // Retrieve the actual Quiz document for the lesson
  const quiz = await Quiz.findOne({ lesson: lessonId });
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return next(new AppError('No quiz found for this lesson.', 404));
  }

  // Evaluate correctness against the specified question index
  const activeQuestion = quiz.questions[questionIndex] || quiz.questions[0];
  const isCorrect = selectedOptionIndex === activeQuestion.correctAnswerIndex;
  
  const score = isCorrect ? 1 : 0;
  const passed = isCorrect;

  let progress = await Progress.findOne({ user: req.user._id, lesson: lessonId });

  const newAttempt = {
    attemptNumber: progress ? progress.quizScores.length + 1 : 1,
    score,
    passed,
    timestamp: new Date()
  };

  if (!progress) {
    progress = await Progress.create({
      user: req.user._id,
      lesson: lessonId,
      isCompleted: passed,
      completedAt: passed ? new Date() : null,
      quizScores: [newAttempt]
    });
  } else {
    progress.quizScores.push(newAttempt);
    if (passed && !progress.isCompleted) {
      progress.isCompleted = true;
      progress.completedAt = new Date();
    }
    await progress.save();
  }

  res.status(200).json({
    status: 'success',
    data: {
      progress,
      xpGained: passed ? 50 : 0,
      isCorrect,
      correctAnswerIndex: activeQuestion.correctAnswerIndex,
      explanation: activeQuestion.explanation
    }
  });
});

// Fetch overall progress statistics & streak matrix
exports.getProgressSummary = asyncHandler(async (req, res, next) => {
  const progressLogs = await Progress.find({ user: req.user._id });
  const completedLogs = progressLogs.filter(log => log.isCompleted);

  // Compute total accumulated XP: 50 XP per lesson complete
  const totalXp = completedLogs.length * 50;

  // Streak calculation logic
  let activeStreak = 0;
  if (completedLogs.length > 0) {
    // Extract unique dates of completion
    const completionDates = completedLogs
      .map(log => new Date(log.completedAt).toDateString())
      .map(dateStr => new Date(dateStr));
    
    // Sort dates descending
    completionDates.sort((a, b) => b - a);

    const uniqueDates = [...new Set(completionDates.map(d => d.getTime()))].map(t => new Date(t));

    // Check if the latest completion is today or yesterday
    const today = new Date(new Date().toDateString());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const latestDate = uniqueDates[0];

    if (latestDate >= yesterday) {
      activeStreak = 1;
      let checkDate = latestDate;

      // Iterate backward to check consecutive days
      for (let i = 1; i < uniqueDates.length; i++) {
        const diffTime = checkDate - uniqueDates[i];
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          activeStreak++;
          checkDate = uniqueDates[i];
        } else if (diffDays > 1) {
          break; // Streak broken
        }
      }
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      totalCompletedLessons: completedLogs.length,
      totalXp,
      activeStreak,
      completedLessonIds: completedLogs.map(log => log.lesson)
    }
  });
});
