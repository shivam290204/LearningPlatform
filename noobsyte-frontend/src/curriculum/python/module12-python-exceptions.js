export default {
  id: 'module12-python-exceptions',
  title: 'Module 12: Python Exception Handling',
  lessons: [
    {
      id: 'python-exceptions',
      title: 'Exception Handling in Python',
      slug: 'python-exceptions',
      description: 'Master try-except blocks, raising exceptions, assertion checks, and finally execution blocks.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Implement try-except-else-finally logic",
        "Raise exceptions manually using raise",
        "Define custom exception classes"
],
      content: `<h3>Exception Handling in Python</h3>
<p>Python uses Exception blocks to catch and handle runtime errors gracefully, preventing abnormal application exits.</p>
<h4>1. The try-except-else-finally Chain</h4>
<ul>
  <li><code>try</code>: Code that might trigger an error.</li>
  <li><code>except</code>: Code executed if an exception occurs.</li>
  <li><code>else</code>: Code executed only if no exceptions occur.</li>
  <li><code>finally</code>: Code executed under all conditions, usually for cleanup.</li>
</ul>
<h4>2. Raising Exceptions</h4>
<p>Exceptions are raised manually using the <code>raise</code> keyword: <code>raise ValueError("Invalid parameter value")</code>.</p>`,
      theory: `<h3>Exception Handling in Python</h3>
<p>Python uses Exception blocks to catch and handle runtime errors gracefully, preventing abnormal application exits.</p>
<h4>1. The try-except-else-finally Chain</h4>
<ul>
  <li><code>try</code>: Code that might trigger an error.</li>
  <li><code>except</code>: Code executed if an exception occurs.</li>
  <li><code>else</code>: Code executed only if no exceptions occur.</li>
  <li><code>finally</code>: Code executed under all conditions, usually for cleanup.</li>
</ul>
<h4>2. Raising Exceptions</h4>
<p>Exceptions are raised manually using the <code>raise</code> keyword: <code>raise ValueError("Invalid parameter value")</code>.</p>`,
      analogy: `<h3>Real-Life Analogy: The Backup Generator</h3>
<p>Exception handling is like a hospital's power grid. The hospital runs on normal grid power (try). If the grid fails (except), emergency generators turn on to keep critical systems alive. Under all circumstances (finally), the backup status logs are saved.</p>`,
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
            questionText: 'When does the "else" block execute in a Python try-except statement?',
            options: [
          {
                    "text": "Only when an exception is caught.",
                    "isCode": false
          },
          {
                    "text": "Only when no exception is raised inside the try block.",
                    "isCode": false
          },
          {
                    "text": "Before the try block executes.",
                    "isCode": false
          }
],
            correctAnswerIndex: 1,
            explanation: 'The else block runs only if the code in the try block executed successfully without raising any exceptions.'
          }
        ]
      }
    }
  ]
};
