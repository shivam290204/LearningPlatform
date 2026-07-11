export default {
  id: 'module01-python-fundamentals',
  title: 'Module 1: Python Fundamentals',
  lessons: [
    {
      id: 'python-fundamentals',
      title: 'Python Language Syntax & Variables',
      slug: 'python-fundamentals',
      description: 'Understand Python variables, dynamic typing, indentation syntax, and core operations.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Understand dynamic typing in Python",
        "Write basic input/output statements",
        "Explain indentation-based block scopes"
],
      content: `<h3>Python Language Syntax & Variables</h3>
<p>Python is a high-level, interpreted programming language known for its readability. Unlike Java or C++, Python uses dynamic typing and indentation instead of curly braces to define code blocks.</p>
<h4>1. Dynamic Typing</h4>
<p>In Python, you do not need to declare variable types. Variables are created when assigned: <code>x = 10</code>. The interpreter determines the type dynamically at runtime. A variable can reference an integer, and later be reassigned to reference a string: <code>x = "Hello"</code>.</p>
<h4>2. Block Structure via Indentation</h4>
<p>Python uses whitespaces (spaces or tabs) to define blocks of code (functions, loops, classes). Consistency is critical: standard practice is to use 4 spaces per indentation level. Incorrect indentation raises an <code>IndentationError</code>.</p>`,
      theory: `<h3>Python Language Syntax & Variables</h3>
<p>Python is a high-level, interpreted programming language known for its readability. Unlike Java or C++, Python uses dynamic typing and indentation instead of curly braces to define code blocks.</p>
<h4>1. Dynamic Typing</h4>
<p>In Python, you do not need to declare variable types. Variables are created when assigned: <code>x = 10</code>. The interpreter determines the type dynamically at runtime. A variable can reference an integer, and later be reassigned to reference a string: <code>x = "Hello"</code>.</p>
<h4>2. Block Structure via Indentation</h4>
<p>Python uses whitespaces (spaces or tabs) to define blocks of code (functions, loops, classes). Consistency is critical: standard practice is to use 4 spaces per indentation level. Incorrect indentation raises an <code>IndentationError</code>.</p>`,
      analogy: `<h3>Real-Life Analogy: The Sticky Notes</h3>
<p>In Java, variables are like heavy storage boxes with locked labels (types). In Python, variables are like sticky notes. You write a name on a sticky note and slap it onto an object. You can peel the note off and slap it onto another object (dynamic typing) at any time.</p>`,
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
            questionText: 'Which of the following is true about variables in Python?',
            options: [
          {
                    "text": "Variables must have declared types before assignment.",
                    "isCode": false
          },
          {
                    "text": "Variables are dynamically typed and act as object references.",
                    "isCode": false
          },
          {
                    "text": "Python does not support reassigning variables to different types.",
                    "isCode": false
          }
],
            correctAnswerIndex: 1,
            explanation: 'Python uses dynamic typing where variables are references to objects and do not require static type declarations.'
          }
        ]
      }
    }
  ]
};
