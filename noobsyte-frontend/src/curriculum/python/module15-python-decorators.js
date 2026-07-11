export default {
  id: 'module15-python-decorators',
  title: 'Module 15: Python Decorators',
  lessons: [
    {
      id: 'python-decorators',
      title: 'Decorators and Closures in Python',
      slug: 'python-decorators',
      description: 'Master higher-order functions, function wrappers, closures, and clean decorator syntaxes.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Write closures and higher-order functions",
        "Create custom decorators to modify functions behavior",
        "Pass arguments to decorators"
],
      content: `<h3>Decorators and Closures in Python</h3>
<p>Decorators are a powerful Python pattern to modify the behavior of functions dynamically without modifying their source code.</p>
<h4>1. Higher-Order Functions & Closures</h4>
<p>Functions in Python are first-class citizens. They can be passed as arguments and returned from other functions. A closure is an inner function that remembers variables from its enclosing scope.</p>
<h4>2. Decorator Syntax</h4>
<p>A decorator is a function that takes another function, wraps it with additional logic, and returns the wrapper. It is applied using the '@' symbol: '@my_decorator'.</p>`,
      theory: `<h3>Decorators and Closures in Python</h3>
<p>Decorators are a powerful Python pattern to modify the behavior of functions dynamically without modifying their source code.</p>
<h4>1. Higher-Order Functions & Closures</h4>
<p>Functions in Python are first-class citizens. They can be passed as arguments and returned from other functions. A closure is an inner function that remembers variables from its enclosing scope.</p>
<h4>2. Decorator Syntax</h4>
<p>A decorator is a function that takes another function, wraps it with additional logic, and returns the wrapper. It is applied using the '@' symbol: '@my_decorator'.</p>`,
      analogy: `<h3>Real-Life Analogy: Gift Wrapping</h3>
<p>Imagine your function is a plain gift box. A decorator is like wrapping paper. You wrap the gift box with decorative paper and ribbons (adding logging, authorization, or caching) without altering the gift item inside the box itself.</p>`,
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
            questionText: 'What is a decorator in Python?',
            options: [
          {
                    "text": "A syntax validator for module scripts.",
                    "isCode": false
          },
          {
                    "text": "A function that takes another function as an argument and extends its behavior.",
                    "isCode": false
          },
          {
                    "text": "A class method wrapper to delete objects.",
                    "isCode": false
          }
],
            correctAnswerIndex: 1,
            explanation: 'A decorator wraps another function, executing wrapper code before or after the decorated function runs.'
          }
        ]
      }
    }
  ]
};
