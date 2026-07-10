export default {
  id: 'module16-python-interview-prep',
  title: 'Module 16: Python Interview Prep',
  lessons: [
    {
      id: 'python-interview-prep',
      title: 'Python Interview Preparation & Big-O',
      slug: 'python-interview-prep',
      description: 'Prepare for coding technical interviews using Pythonic optimization and data structures.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Optimize Python loop computations",
        "Utilize collections.deque and collections.defaultdict",
        "Solve common coding interview patterns"
],
      content: `<h3>Python Interview Preparation & Big-O</h3>
<p>Cracking Python interviews requires familiarity with built-in collections and common algorithms.</p>
<h4>1. Standard Library Utilities</h4>
<ul>
  <li><code>collections.defaultdict</code>: Prevents KeyErrors by automatically initializing missing keys.</li>
  <li><code>collections.deque</code>: Double-ended queue that supports fast O(1) appends and pops on both sides (compared to O(N) list insert/pop(0)).</li>
</ul>
<h4>2. Code Optimization</h4>
<p>Avoid looping using raw index maps; use <code>enumerate()</code> and list comprehensions to write clean, optimized code blocks.</p>`,
      theory: `<h3>Python Interview Preparation & Big-O</h3>
<p>Cracking Python interviews requires familiarity with built-in collections and common algorithms.</p>
<h4>1. Standard Library Utilities</h4>
<ul>
  <li><code>collections.defaultdict</code>: Prevents KeyErrors by automatically initializing missing keys.</li>
  <li><code>collections.deque</code>: Double-ended queue that supports fast O(1) appends and pops on both sides (compared to O(N) list insert/pop(0)).</li>
</ul>
<h4>2. Code Optimization</h4>
<p>Avoid looping using raw index maps; use <code>enumerate()</code> and list comprehensions to write clean, optimized code blocks.</p>`,
      analogy: `<h3>Real-Life Analogy: The Tool Belt</h3>
<p>Going to a coding interview without knowing specialized collections is like trying to build a house using only a hammer. Bringing collections like <code>deque</code> and <code>defaultdict</code> is like having an electric drill and screwdriver—it speeds up your execution and makes your work robust.</p>`,
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
            questionText: 'Which collection is preferred for implementing a queue (FIFO) in Python with O(1) insertions/deletions?',
            options: [
          {
                    "text": "list",
                    "isCode": true
          },
          {
                    "text": "collections.deque",
                    "isCode": true
          },
          {
                    "text": "set",
                    "isCode": true
          }
],
            correctAnswerIndex: 1,
            explanation: 'collections.deque supports O(1) appends and pops from both ends, whereas Python lists require O(N) shifts when modifying the front.'
          }
        ]
      }
    }
  ]
};
