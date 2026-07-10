export default {
  id: 'module11-cpp-oop-basics',
  title: 'Module 11: C++ OOP: Classes & Objects',
  lessons: [
    {
      id: 'cpp-oop-basics',
      title: 'Classes, Encapsulation, and Constructors',
      slug: 'cpp-oop-basics',
      description: 'Explore classes, private/public access specifiers, constructors, and objects instantiation.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Create classes and instantiate objects",
        "Implement encapsulation using private/public scopes",
        "Write class constructors and destructors"
],
      content: `<h3>Classes, Encapsulation, and Constructors</h3>
<p>C++ is an object-oriented language that supports modular data encapsulation and strict access control.</p>
<h4>1. Encapsulation Specifiers</h4>
<p>C++ uses access specifiers to control visibility: <code>private</code> (accessible only within class methods) and <code>public</code> (accessible globally). Properties are typically kept private, exposed only via public getters and setters.</p>
<h4>2. Constructors and Destructors</h4>
<p>Constructors initialize object state. Destructors (prefixed with a tilde: <code>~MyClass()</code>) release resources (like database connections or heap allocations) when the object is destroyed.</p>`,
      theory: `<h3>Classes, Encapsulation, and Constructors</h3>
<p>C++ is an object-oriented language that supports modular data encapsulation and strict access control.</p>
<h4>1. Encapsulation Specifiers</h4>
<p>C++ uses access specifiers to control visibility: <code>private</code> (accessible only within class methods) and <code>public</code> (accessible globally). Properties are typically kept private, exposed only via public getters and setters.</p>
<h4>2. Constructors and Destructors</h4>
<p>Constructors initialize object state. Destructors (prefixed with a tilde: <code>~MyClass()</code>) release resources (like database connections or heap allocations) when the object is destroyed.</p>`,
      analogy: `<h3>Real-Life Analogy: The Capsule Pill</h3>
<p>Encapsulation is like a capsule pill. The active chemical ingredients (private data fields) are locked inside the outer shell (class). The user only interacts with the outside of the pill (public interface methods), protecting the active ingredients from contamination.</p>`,
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
            questionText: 'What special class method is automatically invoked when an object goes out of scope or is deleted in C++?',
            options: [
          {
                    "text": "Constructor",
                    "isCode": false
          },
          {
                    "text": "Destructor",
                    "isCode": false
          },
          {
                    "text": "Deallocator",
                    "isCode": false
          }
],
            correctAnswerIndex: 1,
            explanation: 'A destructor (~ClassName) is automatically invoked when an object is destroyed, allowing it to clean up resources it holds.'
          }
        ]
      }
    }
  ]
};
