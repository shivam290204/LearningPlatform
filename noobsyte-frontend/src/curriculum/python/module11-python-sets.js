export default {
  id: 'module11-python-sets',
  title: 'Module 11: Python Sets',
  lessons: [
    {
      id: 'python-sets',
      title: 'Sets & Hashing in Python',
      slug: 'python-sets',
      description: 'Understand set collections, hashing checks, unique elements, and mathematical set operations.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Create unique set collections",
        "Perform mathematical operations (union, intersection, difference)",
        "Explain set membership testing time complexity"
],
      content: `<h3>Sets & Hashing in Python</h3>
<p>A <code>set</code> is a mutable, unordered collection of unique, hashable elements.</p>
<h4>1. Unique Elements</h4>
<p>Sets automatically discard duplicate entries. Creating a set from a list is a common way to filter duplicates: <code>unique_set = set([1, 2, 2, 3])</code> yields <code>{1, 2, 3}</code>.</p>
<h4>2. Set Operations</h4>
<p>Sets support mathematical operations: Union (<code>|</code>), Intersection (<code>&</code>), Difference (<code>-</code>), and Symmetric Difference (<code>^</code>).</p>`,
      theory: `<h3>Sets & Hashing in Python</h3>
<p>A <code>set</code> is a mutable, unordered collection of unique, hashable elements.</p>
<h4>1. Unique Elements</h4>
<p>Sets automatically discard duplicate entries. Creating a set from a list is a common way to filter duplicates: <code>unique_set = set([1, 2, 2, 3])</code> yields <code>{1, 2, 3}</code>.</p>
<h4>2. Set Operations</h4>
<p>Sets support mathematical operations: Union (<code>|</code>), Intersection (<code>&</code>), Difference (<code>-</code>), and Symmetric Difference (<code>^</code>).</p>`,
      analogy: `<h3>Real-Life Analogy: The Guest List</h3>
<p>A set is like a party guest list. An invitee's name can only appear once on the sheet. Checking if someone is on the list takes O(1) time—you look up the name alphabetically rather than scanning the entire crowd in the room.</p>`,
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
            questionText: 'What is the average time complexity of checking if an element exists in a Python set?',
            options: [
          {
                    "text": "O(N)",
                    "isCode": true
          },
          {
                    "text": "O(log N)",
                    "isCode": true
          },
          {
                    "text": "O(1)",
                    "isCode": true
          }
],
            correctAnswerIndex: 2,
            explanation: 'Sets are implemented using hash tables, allowing element membership checks to complete in constant O(1) average time.'
          }
        ]
      }
    }
  ]
};
