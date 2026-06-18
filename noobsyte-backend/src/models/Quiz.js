const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: [true, 'Quiz must be connected to a specific Lesson'],
    unique: true // 1-to-1 mapping for in-context lesson evaluations
  },
  questions: [{
    questionText: {
      type: String,
      required: [true, 'Question description is required']
    },
    options: [{
      text: { type: String, required: true },
      isCode: { type: Boolean, default: false }
    }],
    correctAnswerIndex: {
      type: Number,
      required: [true, 'Identify the correct index'],
      min: 0
    },
    explanation: {
      type: String,
      required: [true, 'Provide a beginner-friendly logical explanation']
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);
