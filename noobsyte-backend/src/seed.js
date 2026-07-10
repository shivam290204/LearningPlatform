require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Course = require('./models/Course');
const Module = require('./models/Module');
const Lesson = require('./models/Lesson');
const Quiz = require('./models/Quiz');

const frontendCurriculumDir = 'E:/LearningPlatform/noobsyte-frontend/src/curriculum';

// Helper to load and evaluate ES module file in CommonJS
function loadESModule(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Replace export default with return
  const code = content.replace('export default', 'return');
  const fn = new Function(code);
  return fn();
}

const coursesData = [
  {
    title: 'Mastering Java: From Zero to Hero',
    slug: 'java-masterclass-core-to-advanced',
    description: 'Master variables, stack & heap models, parameters passing, object oriented architecture, multithreading, and database integrations without dry textbook jargon.',
    difficulty: 'beginner',
    isPublished: true,
    folder: 'java'
  },
  {
    title: 'Java DSA: Master Data Structures & Algorithms',
    slug: 'java-dsa-masterclass',
    description: 'Master Big-O analysis, sorting algorithms, recursion, linked lists, stacks, queues, trees, heaps, graphs, and dynamic programming in Java.',
    difficulty: 'intermediate',
    isPublished: true,
    folder: 'dsa'
  },
  {
    title: 'Python Fundamentals',
    slug: 'python-fundamentals',
    description: 'Master Python variables, control flow, functions, OOP, collections, file handling, and decorators visually.',
    difficulty: 'beginner',
    isPublished: true,
    folder: 'python'
  },
  {
    title: 'C++ Fundamentals',
    slug: 'cpp-fundamentals',
    description: 'Master C++ syntax, pointers, references, memory management, OOP, and STL containers visually.',
    difficulty: 'beginner',
    isPublished: true,
    folder: 'cpp'
  }
];

const seedDB = async () => {
  let connected = false;
  const url = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/noobsyte';
  try {
    console.log('Connecting to database:', url.replace(/:([^:@]+)@/, ':****@'));
    await mongoose.connect(url, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB cluster.');
    connected = true;
  } catch (error) {
    console.error('Atlas connection failed. Trying local MongoDB...', error.message);
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/noobsyte');
      console.log('Connected to local MongoDB.');
      connected = true;
    } catch (localError) {
      console.error('Failed to connect to local MongoDB:', localError.message);
    }
  }

  if (!connected) {
    console.error('Could not connect to any database. Seeding aborted.');
    return;
  }

  try {
    // Clean existing records
    await Course.deleteMany({});
    await Module.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    console.log('Cleared existing curriculum records.');

    for (const cData of coursesData) {
      // Create Course
      const course = await Course.create({
        title: cData.title,
        slug: cData.slug,
        description: cData.description,
        difficulty: cData.difficulty,
        isPublished: cData.isPublished
      });
      console.log(`Created Course: ${course.title} (${course.slug})`);

      const folderPath = path.join(frontendCurriculumDir, cData.folder);
      if (!fs.existsSync(folderPath)) {
        console.warn(`Folder path does not exist: ${folderPath}`);
        continue;
      }

      // Read module files
      const files = fs.readdirSync(folderPath)
        .filter(f => f.startsWith('module') && f.endsWith('.js'))
        .sort(); // Sort by name so module01, module02 are in order

      let moduleOrder = 1;
      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const mData = loadESModule(filePath);

        // Create Module
        const mod = await Module.create({
          course: course._id,
          title: mData.title,
          order: moduleOrder++,
          isPublished: true
        });
        console.log(`  Created Module: ${mod.title}`);

        let lessonOrder = 1;
        for (const lData of mData.lessons) {
          // Create Lesson
          const lesson = await Lesson.create({
            module: mod._id,
            title: lData.title,
            slug: lData.slug,
            content: lData.content || lData.theory,
            visualizations: lData.visualizations || [],
            order: lessonOrder++
          });
          console.log(`    Created Lesson: ${lesson.title} (${lesson.slug})`);

          // Create associated Quiz
          if (lData.quiz && lData.quiz.questions && lData.quiz.questions.length > 0) {
            const quiz = await Quiz.create({
              lesson: lesson._id,
              questions: lData.quiz.questions
            });
            console.log(`      Created Quiz for Lesson: ${lesson.title}`);
          }
        }
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Seeding Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
};

seedDB();
