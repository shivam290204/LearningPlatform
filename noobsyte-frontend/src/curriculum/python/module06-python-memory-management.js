export default {
  id: 'module06-python-memory-management',
  title: 'Module 6: Python Memory Management',
  lessons: [
    {
      id: 'python-memory-management',
      title: 'Python Memory: References & Garbage Collection',
      slug: 'python-memory-management',
      description: 'Understand mutable vs immutable types, references passing, and reference counting garbage collection.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Differentiate between mutable and immutable data types",
        "Explain reference counting mechanisms",
        "Describe Python garbage collection cycle"
],
      content: `<h3>Python Memory: References & Garbage Collection</h3>
<p>Python manages memory automatically using reference counting and a cyclical garbage collector.</p>
<h4>1. Mutable vs Immutable Types</h4>
<p>Immutable objects (integers, floats, strings, tuples) cannot be altered after creation. Mutable objects (lists, dicts, sets) can be updated in-place. Modifying an immutable type creates a new object in memory.</p>
<h4>2. Reference Counting</h4>
<p>Every object in Python tracks how many references point to it. When an object's reference count drops to 0, Python immediately deallocates its memory.</p>`,
      theory: `<h3>Python Memory: References & Garbage Collection</h3>
<p>Python manages memory automatically using reference counting and a cyclical garbage collector.</p>
<h4>1. Mutable vs Immutable Types</h4>
<p>Immutable objects (integers, floats, strings, tuples) cannot be altered after creation. Mutable objects (lists, dicts, sets) can be updated in-place. Modifying an immutable type creates a new object in memory.</p>
<h4>2. Reference Counting</h4>
<p>Every object in Python tracks how many references point to it. When an object's reference count drops to 0, Python immediately deallocates its memory.</p>`,
      analogy: `<h3>Real-Life Analogy: Library Book Borrowing</h3>
<p>Reference counting is like borrowing a popular reference book from the library. Each student who uses the book represents a reference. As long as at least one student is using the book, it remains on the table. When the last student finishes (references count drops to 0), the librarian returns the book to the shelves.</p>`,
      interviewNotes: '<ul><li><strong>Q: What is a common interview question here?</strong><br/>A: Refer to the lesson text and analogies for typical conceptual questions.</li></ul>',
      commonMistakes: '<p>Ensure you review syntax rules and formatting types to avoid common compilation or runtime errors.</p>',
      practiceProblems: [
        {
          title: 'Basic Practice Challenge',
          problemText: 'Write a basic script to demonstrate the main concepts of this lesson.',
          solution: 'Consult the documentation and code examples above to implement your code.'
        }
      ],
      quiz: {
        questions: [
          {
            questionText: 'Which of the following data types is mutable in Python?',
            options: [
          {
                    "text": "List",
                    "isCode": true
          },
          {
                    "text": "Tuple",
                    "isCode": true
          },
          {
                    "text": "String",
                    "isCode": true
          }
],
            correctAnswerIndex: 0,
            explanation: 'Lists are mutable and can be modified in-place. Strings and Tuples are immutable; modifying them creates new objects.'
          }
        ]
      }
    }
  ]
};
