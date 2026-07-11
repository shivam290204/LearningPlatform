export default {
  id: 'module04-cpp-functions',
  title: 'Module 4: C++ Functions & Call Stack',
  lessons: [
    {
      id: 'cpp-functions',
      title: 'Functions and the Memory Call Stack',
      slug: 'cpp-functions',
      description: 'Master function signatures, parameter passing by value, and stack frames.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Write function declarations and definitions",
        "Describe parameter passing by value",
        "Analyze call stack frames push/pop behavior"
],
      content: `<h3>Functions and the Memory Call Stack</h3>
<p>Functions represent modular units of executable statements that manage their own local scopes on the call stack.</p>
<h4>1. Pass by Value</h4>
<p>By default, arguments are passed to functions by value. The compiler makes a copy of the argument variable and stores it in the function's Stack frame. Modifications inside the function do not affect the original variable.</p>
<h4>2. The Call Stack</h4>
<p>When a function is called, the OS allocates a new Stack frame to store its parameters, return address, and local variables. When the function returns, its Stack frame is popped and its local memory is deallocated instantly.</p>`,
      theory: `<h3>Functions and the Memory Call Stack</h3>
<p>Functions represent modular units of executable statements that manage their own local scopes on the call stack.</p>
<h4>1. Pass by Value</h4>
<p>By default, arguments are passed to functions by value. The compiler makes a copy of the argument variable and stores it in the function's Stack frame. Modifications inside the function do not affect the original variable.</p>
<h4>2. The Call Stack</h4>
<p>When a function is called, the OS allocates a new Stack frame to store its parameters, return address, and local variables. When the function returns, its Stack frame is popped and its local memory is deallocated instantly.</p>`,
      analogy: `<h3>Real-Life Analogy: The Photocopy Handout</h3>
<p>Pass-by-value is like handing a photocopy of a design document to a team member. They can draw, edit, or shred their copy (local stack frame) as much as they want. Your original master document in your desk drawer remains completely clean and untouched.</p>`,
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
            questionText: 'What happens to local variables declared inside a function when the function returns?',
            options: [
          {
                    "text": "They are moved to the shared Heap memory.",
                    "isCode": false
          },
          {
                    "text": "Their Stack frame is popped and their memory is instantly deallocated.",
                    "isCode": false
          },
          {
                    "text": "They remain accessible until garbage collection runs.",
                    "isCode": false
          }
],
            correctAnswerIndex: 1,
            explanation: 'C++ uses deterministic stack allocation; local variables are destroyed immediately when their enclosing function scope terminates.'
          }
        ]
      }
    }
  ]
};
