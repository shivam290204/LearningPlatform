export default {
  id: 'module04-python-oop',
  title: 'Module 4: Python OOP Principles',
  lessons: [
    {
      id: 'python-oop',
      title: 'Object-Oriented Programming (OOP) in Python',
      slug: 'python-oop',
      description: 'Explore classes, object instantiations, methods, and constructor double-underscore init.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Create classes and instantiate objects",
        "Write constructors using __init__ method",
        "Explain the self parameter"
],
      content: `<h3>Object-Oriented Programming (OOP) in Python</h3>
<p>Python is a multi-paradigm language that fully supports Object-Oriented Programming.</p>
<h4>1. Classes and Constructor</h4>
<p>A class is defined using the <code>class</code> keyword. The class constructor is initialized via the special dunder (double-underscore) method <code>__init__</code>.</p>
<h4>2. The self Parameter</h4>
<p>The <code>self</code> parameter represents the active instance of the class. It must be explicitly included as the first argument in all instance methods to bind variables to the instance.</p>`,
      theory: `<h3>Object-Oriented Programming (OOP) in Python</h3>
<p>Python is a multi-paradigm language that fully supports Object-Oriented Programming.</p>
<h4>1. Classes and Constructor</h4>
<p>A class is defined using the <code>class</code> keyword. The class constructor is initialized via the special dunder (double-underscore) method <code>__init__</code>.</p>
<h4>2. The self Parameter</h4>
<p>The <code>self</code> parameter represents the active instance of the class. It must be explicitly included as the first argument in all instance methods to bind variables to the instance.</p>`,
      analogy: `<h3>Real-Life Analogy: Form Templates</h3>
<p>A class is like an blank passport application form. It specifies fields like first name, birth date, and height. An object is a completed, printed passport belonging to a specific citizen (instantiated with actual data).</p>`,
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
            questionText: 'What is the role of the "self" parameter in Python class methods?',
            options: [
          {
                    "text": "It acts as a static global keyword binding all classes.",
                    "isCode": false
          },
          {
                    "text": "It represents the active object instance calling the method.",
                    "isCode": false
          },
          {
                    "text": "It is a private access keyword to restrict methods.",
                    "isCode": false
          }
],
            correctAnswerIndex: 1,
            explanation: 'In Python, self represents the instance of the object itself, allowing instance variables and methods to be accessed.'
          }
        ]
      }
    }
  ]
};
