export default {
  id: 'module08-python-lists',
  title: 'Module 8: Python Lists',
  lessons: [
    {
      id: 'python-lists',
      title: 'Lists & Slicing in Python',
      slug: 'python-lists',
      description: 'Understand dynamic array lists, indexing, slicing, and common list manipulation methods.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Create and manipulate Python lists",
        "Apply indexing and negative slicing",
        "Perform list comprehension operations"
],
      content: `<h3>Lists & Slicing in Python</h3>
<p>Python <code>list</code> objects are ordered, mutable collections that represent dynamic arrays under the hood.</p>
<h4>1. Core List Operations</h4>
<p>Items are accessed via zero-based indexes or negative indexes (e.g. <code>list[-1]</code> returns the last element). Common methods include <code>append()</code>, <code>insert()</code>, <code>pop()</code>, and <code>extend()</code>.</p>
<h4>2. List Slicing</h4>
<p>Slicing lists follows <code>list[start:stop:step]</code>. Modifying a slice can perform bulk replacements: <code>arr[0:2] = [99, 100]</code>.</p>`,
      theory: `<h3>Lists & Slicing in Python</h3>
<p>Python <code>list</code> objects are ordered, mutable collections that represent dynamic arrays under the hood.</p>
<h4>1. Core List Operations</h4>
<p>Items are accessed via zero-based indexes or negative indexes (e.g. <code>list[-1]</code> returns the last element). Common methods include <code>append()</code>, <code>insert()</code>, <code>pop()</code>, and <code>extend()</code>.</p>
<h4>2. List Slicing</h4>
<p>Slicing lists follows <code>list[start:stop:step]</code>. Modifying a slice can perform bulk replacements: <code>arr[0:2] = [99, 100]</code>.</p>`,
      analogy: `<h3>Real-Life Analogy: The Train Cars</h3>
<p>A Python list is like a freight train. You can add new cargo cars to the end (append), unhook cars (pop), or replace the contents of a whole section of cars. The train grows and shrinks dynamically as needed.</p>`,
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
            questionText: 'What is the outcome of "arr[-1]" if "arr = [10, 20, 30]"?',
            options: [
          {
                    "text": "10",
                    "isCode": true
          },
          {
                    "text": "30",
                    "isCode": true
          },
          {
                    "text": "IndexError",
                    "isCode": true
          }
],
            correctAnswerIndex: 1,
            explanation: 'Negative indexing counts backward from the end. -1 represents the last element, which is 30.'
          }
        ]
      }
    }
  ]
};
