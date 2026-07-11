export default {
  id: 'module09-python-tuples',
  title: 'Module 9: Python Tuples',
  lessons: [
    {
      id: 'python-tuples',
      title: 'Tuples & Immutability in Python',
      slug: 'python-tuples',
      description: 'Explore immutable tuple sequences, packing, unpacking, and dictionary key usage rules.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Define tuples and explain their immutability",
        "Implement tuple packing and unpacking",
        "Explain why tuples can act as dictionary keys"
],
      content: `<h3>Tuples & Immutability in Python</h3>
<p>A <code>tuple</code> is an ordered, immutable collection. Once created, its elements cannot be changed or reassigned.</p>
<h4>1. Tuples vs Lists</h4>
<p>Tuples are defined using parentheses: <code>t = (1, 2, 3)</code>. Since tuples are immutable, they are faster than lists and serve as read-only data structures.</p>
<h4>2. Packing and Unpacking</h4>
<p>Python supports tuple unpacking: <code>x, y = (10, 20)</code>. This makes swapping values clean: <code>a, b = b, a</code>.</p>`,
      theory: `<h3>Tuples & Immutability in Python</h3>
<p>A <code>tuple</code> is an ordered, immutable collection. Once created, its elements cannot be changed or reassigned.</p>
<h4>1. Tuples vs Lists</h4>
<p>Tuples are defined using parentheses: <code>t = (1, 2, 3)</code>. Since tuples are immutable, they are faster than lists and serve as read-only data structures.</p>
<h4>2. Packing and Unpacking</h4>
<p>Python supports tuple unpacking: <code>x, y = (10, 20)</code>. This makes swapping values clean: <code>a, b = b, a</code>.</p>`,
      analogy: `<h3>Real-Life Analogy: The Sealed Shipping Case</h3>
<p>A list is like a shopping basket where you add, remove, or swap items. A tuple is like a sealed, clear shipping crate. The items inside are visible and ordered, but you cannot open the seal to swap or remove elements without building a new crate.</p>`,
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
            questionText: 'Why can tuples be used as keys in Python dictionaries while lists cannot?',
            options: [
          {
                    "text": "Tuples are faster to index in memory.",
                    "isCode": false
          },
          {
                    "text": "Tuples are hashable because they are immutable.",
                    "isCode": false
          },
          {
                    "text": "Tuples take up less space in dictionary memory pools.",
                    "isCode": false
          }
],
            correctAnswerIndex: 1,
            explanation: 'Dictionary keys must be hashable. Because tuples are immutable, they have a stable hash value, whereas lists are mutable and cannot be hashed.'
          }
        ]
      }
    }
  ]
};
