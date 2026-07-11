export default {
  id: 'module13-python-file-io',
  title: 'Module 13: Python File I/O',
  lessons: [
    {
      id: 'python-file-io',
      title: 'File Handling & Context Managers',
      slug: 'python-file-io',
      description: 'Understand file read/write pipelines, context managers, and parsing structured text streams.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Read and write files in Python",
        "Explain context managers and the with statement",
        "Handle file system errors during I/O"
],
      content: `<h3>File Handling & Context Managers</h3>
<p>Python provides safe, built-in methods to interact with the host operating system's filesystem.</p>
<h4>1. Context Managers (with statement)</h4>
<p>The standard way to open files is using the <code>with</code> context manager. It automatically closes the file stream when exiting the block, even if exceptions occur, preventing file lock descriptor leaks.</p>
<pre><code>with open("data.txt", "r") as file:
    content = file.read()</code></pre>`,
      theory: `<h3>File Handling & Context Managers</h3>
<p>Python provides safe, built-in methods to interact with the host operating system's filesystem.</p>
<h4>1. Context Managers (with statement)</h4>
<p>The standard way to open files is using the <code>with</code> context manager. It automatically closes the file stream when exiting the block, even if exceptions occur, preventing file lock descriptor leaks.</p>
<pre><code>with open("data.txt", "r") as file:
    content = file.read()</code></pre>`,
      analogy: `<h3>Real-Life Analogy: Borrowing a Key</h3>
<p>Opening a file without a context manager is like borrowing a key to a storage vault and forgetting to return it to the office, locking others out. Using <code>with</code> is like a smart key card that automatically locks the door and checks the key back in when you step out.</p>`,
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
            questionText: 'Why is using the "with" statement preferred when opening files in Python?',
            options: [
          {
                    "text": "It speeds up file read/write times.",
                    "isCode": false
          },
          {
                    "text": "It automatically closes the file stream when exiting the block.",
                    "isCode": false
          },
          {
                    "text": "It bypasses filesystem permissions checks.",
                    "isCode": false
          }
],
            correctAnswerIndex: 1,
            explanation: 'The with statement uses context managers to automatically close files, ensuring resource cleanup and preventing file handle leaks.'
          }
        ]
      }
    }
  ]
};
