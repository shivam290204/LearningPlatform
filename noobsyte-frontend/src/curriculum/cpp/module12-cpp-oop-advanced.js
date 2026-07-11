export default {
  id: 'module12-cpp-oop-advanced',
  title: 'Module 12: C++ OOP: Polymorphism & Inheritance',
  lessons: [
    {
      id: 'cpp-oop-advanced',
      title: 'Inheritance, Virtual Methods, & Polymorphism',
      slug: 'cpp-oop-advanced',
      description: 'Understand virtual methods, vtables, base classes overrides, and runtime polymorphism.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Implement class inheritance relationships",
        "Define virtual functions for runtime polymorphism",
        "Explain Virtual Tables (vtables) and vptrs"
],
      content: `<h3>Inheritance, Virtual Methods, & Polymorphism</h3>
<p>C++ supports inheritance and runtime polymorphism using virtual functions.</p>
<h4>1. Runtime Polymorphism via virtual</h4>
<p>To allow a derived class to override a base class method and invoke it dynamically at runtime, the base method must be declared with the <code>virtual</code> keyword.</p>
<h4>2. Virtual Tables (vtables)</h4>
<p>When a class declares a virtual function, the compiler creates a Virtual Table (vtable) for it. Each object contains a hidden pointer (vptr) to this table, resolving the correct function address dynamically during execution.</p>`,
      theory: `<h3>Inheritance, Virtual Methods, & Polymorphism</h3>
<p>C++ supports inheritance and runtime polymorphism using virtual functions.</p>
<h4>1. Runtime Polymorphism via virtual</h4>
<p>To allow a derived class to override a base class method and invoke it dynamically at runtime, the base method must be declared with the <code>virtual</code> keyword.</p>
<h4>2. Virtual Tables (vtables)</h4>
<p>When a class declares a virtual function, the compiler creates a Virtual Table (vtable) for it. Each object contains a hidden pointer (vptr) to this table, resolving the correct function address dynamically during execution.</p>`,
      analogy: `<h3>Real-Life Analogy: The Universal Remote Control</h3>
<p>Polymorphism is like a universal remote control. You point the remote at a device and press 'Play'. The remote doesn't care if the device is a DVD player, projector, or TV. The device receives the signal and executes its specific play function dynamically.</p>`,
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
            questionText: 'What keyword must be used in a base class method declaration to enable overriding and runtime polymorphism in C++?',
            options: [
          {
                    "text": "override",
                    "isCode": true
          },
          {
                    "text": "virtual",
                    "isCode": true
          },
          {
                    "text": "polymorphic",
                    "isCode": true
          }
],
            correctAnswerIndex: 1,
            explanation: 'The virtual keyword directs the compiler to use dynamic dispatch (vtable lookups) instead of static compilation binding.'
          }
        ]
      }
    }
  ]
};
