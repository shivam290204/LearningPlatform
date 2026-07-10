// Central Curriculum Registry for NoobSyte
import javaModules from './java/index.js';
import dsaModules from './dsa/index.js';
import pythonModules from './python/index.js';
import cppModules from './cpp/index.js';

export const registry = {
  'java-masterclass-core-to-advanced': {
    title: 'Mastering Java: From Zero to Hero',
    slug: 'java-masterclass-core-to-advanced',
    topics: ['OOP', 'Collections', 'Exception Handling', 'Multithreading'],
    difficulty: 'beginner to advanced',
    modules: javaModules
  },
  'java-dsa-masterclass': {
    title: 'Java DSA: Master Data Structures & Algorithms',
    slug: 'java-dsa-masterclass',
    topics: ['Sorting', 'Trees & Graphs', 'Dynamic Programming', 'Big-O Analysis'],
    difficulty: 'intermediate to advanced',
    modules: dsaModules
  },
  'python-fundamentals': {
    title: 'Python Fundamentals',
    slug: 'python-fundamentals',
    topics: ['Data Types', 'Functions', 'OOP', 'File I/O'],
    difficulty: 'beginner',
    modules: pythonModules
  },
  'cpp-fundamentals': {
    title: 'C++ Fundamentals',
    slug: 'cpp-fundamentals',
    topics: ['Pointers', 'Memory Management', 'OOP', 'STL'],
    difficulty: 'beginner to intermediate',
    modules: cppModules
  }
};

// Retrieve a lesson by its slug
export const getLessonBySlug = (slug) => {
  for (const course of Object.values(registry)) {
    for (const mod of course.modules) {
      const lesson = mod.lessons.find(l => l.slug === slug);
      if (lesson) return lesson;
    }
  }
  return null;
};

// Retrieve all courses
export const getCourses = () => {
  return Object.values(registry).map(course => {
    let lessonsCount = 0;
    let quizzesCount = 0;
    course.modules.forEach(m => {
      lessonsCount += m.lessons.length;
      m.lessons.forEach(l => {
        if (l.quizAvailable) quizzesCount++;
      });
    });
    return {
      title: course.title,
      slug: course.slug,
      topics: course.topics,
      difficulty: course.difficulty,
      lessonsCount,
      quizzesCount,
      estTime: course.slug === 'java-dsa-masterclass' ? '30 Hours' : '10 Hours'
    };
  });
};

// Retrieve modules for a course
export const getCourseModules = (courseSlug) => {
  const course = registry[courseSlug];
  return course ? course.modules : [];
};