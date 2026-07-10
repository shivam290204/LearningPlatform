export default {
  id: 'module15-cpp-exceptions',
  title: 'Module 15: C++ Exception Handling',
  lessons: [
    {
      id: 'cpp-exceptions',
      title: 'Exception Handling and Stack Unwinding',
      slug: 'cpp-exceptions',
      description: 'Master try-catch hierarchies, throwing exceptions, and stack unwinding safety.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Implement try-catch error management blocks",
        "Throw exceptions using the throw keyword",
        "Explain Stack Unwinding and RAII safety during exceptions"
],
      content: `<h3>Exception Handling and Stack Unwinding</h3>
<p>C++ uses exception blocks to separate error-handling logic from regular execution flow.</p>
<h4>1. Throw and Catch</h4>
<p>Errors are raised using <code>throw</code> and caught inside a matching <code>catch</code> block. It is best practice to catch exceptions by const reference: <code>catch (const std::exception& e)</code>.</p>
<h4>2. Stack Unwinding</h4>
<p>When an exception is thrown, the runtime searches back up the call stack for a handler. As stack frames are popped, the destructors of all local objects are called automatically. This process is called Stack Unwinding and relies on RAII to prevent memory leaks during failures.</p>`,
      theory: `<h3>Exception Handling and Stack Unwinding</h3>
<p>C++ uses exception blocks to separate error-handling logic from regular execution flow.</p>
<h4>1. Throw and Catch</h4>
<p>Errors are raised using <code>throw</code> and caught inside a matching <code>catch</code> block. It is best practice to catch exceptions by const reference: <code>catch (const std::exception& e)</code>.</p>
<h4>2. Stack Unwinding</h4>
<p>When an exception is thrown, the runtime searches back up the call stack for a handler. As stack frames are popped, the destructors of all local objects are called automatically. This process is called Stack Unwinding and relies on RAII to prevent memory leaks during failures.</p>`,
      analogy: `<h3>Real-Life Analogy: The Assembly Line emergency Stop</h3>
<p>Throwing an exception is like pressing an emergency stop button on an assembly line. The line stops immediately. Before restarting, the safety system automatically reverses and clears unfinished parts (calling destructors during stack unwinding) to prevent machinery collisions.</p>`,
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
            questionText: 'What is the process of releasing stack resources and invoking destructors as C++ searches for an exception handler called?',
            options: [
          {
                    "text": "Memory collection sweeping",
                    "isCode": false
          },
          {
                    "text": "Stack Unwinding",
                    "isCode": false
          },
          {
                    "text": "Resource cleanup dispatching",
                    "isCode": false
          }
],
            correctAnswerIndex: 1,
            explanation: 'Stack Unwinding automatically destroys all active local objects in popped stack frames as the runtime searches for a matching catch block.'
          }
        ]
      }
    }
  ]
};
