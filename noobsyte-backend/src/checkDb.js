require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');
const Module = require('./models/Module');
const Lesson = require('./models/Lesson');
const Quiz = require('./models/Quiz');

const check = async () => {
  const urls = [
    process.env.DATABASE_URL,
    'mongodb://127.0.0.1:27017/noobsyte'
  ].filter(Boolean);

  for (const url of urls) {
    try {
      console.log('Trying to connect to:', url.replace(/:([^:@]+)@/, ':****@'));
      await mongoose.connect(url, { serverSelectionTimeoutMS: 30000 });
      console.log('Successfully connected!');
      
      const courses = await Course.find();
      console.log('Courses count:', courses.length);
      for (const c of courses) {
        console.log(`- Course: ${c.title} (${c.slug})`);
        const modules = await Module.find({ course: c._id }).sort('order');
        console.log(`  Modules count: ${modules.length}`);
      }
      await mongoose.disconnect();
      return; // Stop if we found a working database connection
    } catch (error) {
      console.error('Failed to connect to', url.replace(/:([^:@]+)@/, ':****@'), 'Error:', error.message);
    }
  }
  console.log('Could not connect to any database.');
};

check();
