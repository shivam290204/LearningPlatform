const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Course description is required']
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Auto-generate dynamic slugs on save
CourseSchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Course', CourseSchema);
