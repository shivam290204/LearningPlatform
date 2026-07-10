export default {
  id: 'module02-python-control-flow',
  title: 'Module 2: Python Control Flow',
  lessons: [
    {
      id: 'python-control-flow',
      title: 'Control Flow and Loops in Python',
      slug: 'python-control-flow',
      description: 'Master conditionals, loop iterations, and loop control statements (break, continue, pass).',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Code conditional if-elif-else statements",
        "Implement for-in and while loops",
        "Use break, continue, and pass statements"
],
      content: `<h3>Control Flow and Loops in Python</h3>
<p>Control flow structures control the logical path of execution in a Python program based on boolean conditions.</p>
<h4>1. Conditionals (if, elif, else)</h4>
<p>Python uses <code>if</code>, <code>elif</code> (short for else-if), and <code>else</code>. Condition blocks start with a colon (<code>:</code>) followed by indented statements.</p>
<h4>2. Loops (for, while)</h4>
<p>Python <code>for</code> loops iterate over elements of any sequence (like list, string, or range): <code>for i in range(5): print(i)</code>. <code>while</code> loops continue executing as long as the condition remains true.</p>`,
      theory: `<h3>Control Flow and Loops in Python</h3>
<p>Control flow structures control the logical path of execution in a Python program based on boolean conditions.</p>
<h4>1. Conditionals (if, elif, else)</h4>
<p>Python uses <code>if</code>, <code>elif</code> (short for else-if), and <code>else</code>. Condition blocks start with a colon (<code>:</code>) followed by indented statements.</p>
<h4>2. Loops (for, while)</h4>
<p>Python <code>for</code> loops iterate over elements of any sequence (like list, string, or range): <code>for i in range(5): print(i)</code>. <code>while</code> loops continue executing as long as the condition remains true.</p>`,
      analogy: `<h3>Real-Life Analogy: The Checklist</h3>
<p>A Python <code>for</code> loop is like going down a grocery shopping checklist item by item. When there are no items left on the list, you naturally stop. A <code>while</code> loop is like looking at a rain gauge; you stay indoors <em>while</em> it is raining, checking the condition continuously.</p>`,
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
            questionText: 'What is the purpose of the "pass" statement in Python?',
            options: [
          {
                    "text": "It exits the current loop immediately.",
                    "isCode": false
          },
          {
                    "text": "It is a null operation placeholder used for empty code blocks.",
                    "isCode": false
          },
          {
                    "text": "It skips the current loop iteration and moves to the next.",
                    "isCode": false
          }
],
            correctAnswerIndex: 1,
            explanation: 'The pass statement is used as a syntactic placeholder when a statement is required, but no action needs to be taken.'
          }
        ]
      }
    }
  ]
};
