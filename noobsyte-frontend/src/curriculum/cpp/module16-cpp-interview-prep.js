export default {
  id: 'module16-cpp-interview-prep',
  title: 'Module 16: C++ Interview Prep',
  lessons: [
    {
      id: 'cpp-interview-prep',
      title: 'C++ Interview Preparation & Memory Audits',
      slug: 'cpp-interview-prep',
      description: 'Prepare for technical C++ interviews using pointer arithmetic and memory checks.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Explain pointer arithmetic offsets rules",
        "Identify and prevent common memory leaks",
        "Understand virtual destructors in inheritance hierarchies"
],
      content: `<h3>C++ Interview Preparation & Memory Audits</h3>
<p>C++ interview topics focus on memory management, pointers, and object lifetimes.</p>
<h4>1. Pointer Arithmetic</h4>
<p>Adding an integer to a pointer shifts its address by that integer times the size of the underlying type: <code>ptr + 1</code> shifts by <code>sizeof(type)</code> bytes.</p>
<h4>2. Virtual Destructors</h4>
<p>When deleting a derived class object using a base class pointer: <code>Base* p = new Derived; delete p;</code>, the base class destructor must be declared <code>virtual</code>. If it is not, only the base destructor runs, leaking the derived class resources.</p>`,
      theory: `<h3>C++ Interview Preparation & Memory Audits</h3>
<p>C++ interview topics focus on memory management, pointers, and object lifetimes.</p>
<h4>1. Pointer Arithmetic</h4>
<p>Adding an integer to a pointer shifts its address by that integer times the size of the underlying type: <code>ptr + 1</code> shifts by <code>sizeof(type)</code> bytes.</p>
<h4>2. Virtual Destructors</h4>
<p>When deleting a derived class object using a base class pointer: <code>Base* p = new Derived; delete p;</code>, the base class destructor must be declared <code>virtual</code>. If it is not, only the base destructor runs, leaking the derived class resources.</p>`,
      analogy: `<h3>Real-Life Analogy: The Shared Storage clean up</h3>
<p>Forgetting a virtual destructor is like hired movers clearing out an apartment. If the master inventory list (base pointer) does not include a closet key (virtual destructor), the movers will clear the main living room, but leave the closet full of trash locked up inside, leaking space.</p>`,
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
            questionText: 'Why should a base class destructor always be declared "virtual" when using inheritance in C++?',
            options: [
          {
                    "text": "To allow the derived class destructor to be invoked when deleting a derived object via a base pointer.",
                    "isCode": false
          },
          {
                    "text": "To speed up class instantiation memory allocations.",
                    "isCode": false
          },
          {
                    "text": "To prevent multiple instances of the base class from compiling.",
                    "isCode": false
          }
],
            correctAnswerIndex: 0,
            explanation: 'Declaring a virtual base destructor ensures that when deleting a derived object via a base pointer, the derived class destructor is called first, preventing resource leaks.'
          }
        ]
      }
    }
  ]
};
