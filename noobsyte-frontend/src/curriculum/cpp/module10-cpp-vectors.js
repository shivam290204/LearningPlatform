export default {
  id: 'module10-cpp-vectors',
  title: 'Module 10: C++ Arrays & Vectors',
  lessons: [
    {
      id: 'cpp-vectors',
      title: 'Arrays and std::vector Dynamic Resizing',
      slug: 'cpp-vectors',
      description: 'Master fixed arrays bounds and dynamic arrays resizing via std::vector.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Declare fixed-size arrays and explain bounds checks",
        "Implement dynamic arrays using std::vector",
        "Analyze std::vector capacity growth and O(1) amortized appends"
],
      content: `<h3>Arrays and std::vector Dynamic Resizing</h3>
<p>C++ provides fixed-size raw arrays and standard template library dynamic arrays (vectors).</p>
<h4>1. Fixed-Size Arrays</h4>
<p>Raw arrays have fixed sizes allocated contiguously in memory. C++ does not perform runtime boundary checks on raw arrays; writing past array bounds causes memory corruption.</p>
<h4>2. std::vector Dynamic Arrays</h4>
<p>A <code>std::vector</code> manages a dynamic heap array. When it is full, it automatically allocates a new, larger block (usually 2x capacity), copies existing elements, and frees the old block.</p>`,
      theory: `<h3>Arrays and std::vector Dynamic Resizing</h3>
<p>C++ provides fixed-size raw arrays and standard template library dynamic arrays (vectors).</p>
<h4>1. Fixed-Size Arrays</h4>
<p>Raw arrays have fixed sizes allocated contiguously in memory. C++ does not perform runtime boundary checks on raw arrays; writing past array bounds causes memory corruption.</p>
<h4>2. std::vector Dynamic Arrays</h4>
<p>A <code>std::vector</code> manages a dynamic heap array. When it is full, it automatically allocates a new, larger block (usually 2x capacity), copies existing elements, and frees the old block.</p>`,
      analogy: `<h3>Real-Life Analogy: The expandable Bench</h3>
<p>A raw array is like a fixed wooden park bench that fits exactly 3 people. You cannot add a 4th person without building a new bench. A <code>std::vector</code> is like an expandable bench that automatically expands when more people arrive, moving everyone to a larger seating area.</p>`,
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
            questionText: 'What is the average time complexity of appending an element to the end of a std::vector?',
            options: [
          {
                    "text": "O(N)",
                    "isCode": true
          },
          {
                    "text": "O(log N)",
                    "isCode": true
          },
          {
                    "text": "O(1) amortized",
                    "isCode": true
          }
],
            correctAnswerIndex: 2,
            explanation: 'Appending to a vector is O(1) on average (amortized) because resizing and copying occur occasionally (doubling capacity each time).'
          }
        ]
      }
    }
  ]
};
