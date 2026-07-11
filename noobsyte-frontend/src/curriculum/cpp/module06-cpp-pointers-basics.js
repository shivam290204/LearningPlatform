export default {
  id: 'module06-cpp-pointers-basics',
  title: 'Module 6: C++ Pointers Basics',
  lessons: [
    {
      id: 'cpp-pointers-basics',
      title: 'Pointers & Address Offsets in C++',
      slug: 'cpp-pointers-basics',
      description: 'Master memory address lookups, pointers declaration, and dereferencing variables pointers.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Declare pointers and perform address lookups using & operator",
        "Dereference pointers using * operator",
        "Initialize null pointers safely using nullptr"
],
      content: `<h3>Pointers & Address Offsets in C++</h3>
<p>A pointer is a variable that stores the raw memory address of another variable.</p>
<h4>1. Address Lookup & Pointer Declaration</h4>
<p>You can get the memory address of a variable using the address-of operator (<code>&</code>). A pointer is declared using the asterisk symbol (<code>*</code>): <code>int* ptr = &val;</code>.</p>
<h4>2. Dereferencing</h4>
<p>To read or modify the value stored at the address a pointer is holding, you dereference it using the asterisk operator: <code>*ptr = 99;</code>. If a pointer points to nothing, it should be initialized to nullptr to prevent dangerous segmentation faults.</p>`,
      theory: `<h3>Pointers & Address Offsets in C++</h3>
<p>A pointer is a variable that stores the raw memory address of another variable.</p>
<h4>1. Address Lookup & Pointer Declaration</h4>
<p>You can get the memory address of a variable using the address-of operator (<code>&</code>). A pointer is declared using the asterisk symbol (<code>*</code>): <code>int* ptr = &val;</code>.</p>
<h4>2. Dereferencing</h4>
<p>To read or modify the value stored at the address a pointer is holding, you dereference it using the asterisk operator: <code>*ptr = 99;</code>. If a pointer points to nothing, it should be initialized to nullptr to prevent dangerous segmentation faults.</p>`,
      analogy: `<h3>Real-Life Analogy: The GPS Coordinates</h3>
<p>A regular variable is like a house. A pointer is like a piece of paper containing the GPS coordinates (memory address) of that house. Dereferencing the pointer is like driving to those coordinates to inspect or renovate the house itself.</p>`,
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
            questionText: 'What does the dereference operator (*) do when applied to a pointer variable?',
            options: [
          {
                    "text": "It returns the memory address of the pointer variable.",
                    "isCode": false
          },
          {
                    "text": "It accesses the value stored at the memory address the pointer is pointing to.",
                    "isCode": false
          },
          {
                    "text": "It allocates new memory on the Heap.",
                    "isCode": false
          }
],
            correctAnswerIndex: 1,
            explanation: 'Dereferencing a pointer accesses the memory location it points to, allowing you to read or modify the value stored there.'
          }
        ]
      }
    }
  ]
};
