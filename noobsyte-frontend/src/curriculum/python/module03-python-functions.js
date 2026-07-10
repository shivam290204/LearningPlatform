export default {
  id: 'module03-python-functions',
  title: 'Module 3: Python Functions',
  lessons: [
    {
      id: 'python-functions',
      title: 'Functions and Call Scope in Python',
      slug: 'python-functions',
      description: 'Master function declarations, parameter passing, scopes, and namespace resolution rules.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Define functions using the def keyword",
        "Explain positional, keyword, and default parameters",
        "Explain LEGB scoping rules"
],
      content: `<h3>Functions and Call Scope in Python</h3>
<p>Functions are modular, reusable blocks of statements declared using the <code>def</code> keyword.</p>
<h4>1. Parameter Passing</h4>
<p>Python supports positional arguments, keyword arguments, and default argument values: <code>def greet(name, msg="Hello"): print(msg, name)</code>. Argument passing in Python is call-by-object-reference.</p>
<h4>2. Scoping Rules (LEGB)</h4>
<p>Namespaces are resolved using the LEGB rule: Local (inside functions), Enclosing (nested functions), Global (module level), and Built-in (built-in functions like len, print).</p>`,
      theory: `<h3>Functions and Call Scope in Python</h3>
<p>Functions are modular, reusable blocks of statements declared using the <code>def</code> keyword.</p>
<h4>1. Parameter Passing</h4>
<p>Python supports positional arguments, keyword arguments, and default argument values: <code>def greet(name, msg="Hello"): print(msg, name)</code>. Argument passing in Python is call-by-object-reference.</p>
<h4>2. Scoping Rules (LEGB)</h4>
<p>Namespaces are resolved using the LEGB rule: Local (inside functions), Enclosing (nested functions), Global (module level), and Built-in (built-in functions like len, print).</p>`,
      analogy: `<h3>Real-Life Analogy: The Company Hierarchy</h3>
<p>Local scope is like an employee's personal desk notes—only they can see them. Global scope is like the company bulletin board, visible to everyone in the building. Built-in scope is like federal labor laws, accessible to all companies and employees in the country.</p>`,
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
            questionText: 'What rule does Python use to resolve variable scopes?',
            options: [
          {
                    "text": "LIFO stack indexing rules",
                    "isCode": false
          },
          {
                    "text": "The LEGB (Local, Enclosing, Global, Built-in) rule",
                    "isCode": false
          },
          {
                    "text": "Static global mapping indexes",
                    "isCode": false
          }
],
            correctAnswerIndex: 1,
            explanation: 'Python resolves variable names in order: Local scope, Enclosing local scope, Global module scope, and Built-in namespace.'
          }
        ]
      }
    }
  ]
};
