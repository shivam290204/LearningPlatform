const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: [true, 'Lesson must belong to a Module']
  },
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  content: {
    type: String, // Dynamic markdown content
    required: [true, 'Lesson rich content markdown is required']
  },
  visualizations: [{
    step: Number,
    memorySnapshot: {
      stack: [{ variable: String, value: String }],
      heap: [{ address: String, objectType: String, fields: mongoose.Schema.Types.Mixed }]
    },
    label: String
  }],
  order: {
    type: Number,
    required: [true, 'Lesson chronological order is required']
  }
}, { timestamps: true });

LessonSchema.index({ module: 1, order: 1 }, { unique: true });
LessonSchema.index({ title: 'text', content: 'text' }); // High-performance fuzzy text queries index

LessonSchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();
  this.slug = this.title.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
  next();
});

module.exports = mongoose.model('Lesson', LessonSchema);
