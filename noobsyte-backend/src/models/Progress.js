const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Progress records require an associated User']
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: [true, 'Progress records require an associated Lesson']
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  quizScores: [{
    attemptNumber: Number,
    score: Number,
    passed: Boolean,
    timestamp: { type: Date, default: Date.now }
  }],
  completedAt: Date
}, { timestamps: true });

// Create a compound unique index ensuring a user only has one progress log per lesson
ProgressSchema.index({ user: 1, lesson: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);
