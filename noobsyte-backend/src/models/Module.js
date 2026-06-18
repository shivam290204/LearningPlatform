const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Module must belong to a Course']
  },
  title: {
    type: String,
    required: [true, 'Module title is required'],
    trim: true
  },
  order: {
    type: Number,
    required: [true, 'Module chronological order is required']
  },
  isPublished: {
    type: Boolean,
    default: false
  }
});

// Compound index to guarantee uniqueness of order within the same course scope
ModuleSchema.index({ course: 1, order: 1 }, { unique: true });

module.exports = mongoose.model('Module', ModuleSchema);
