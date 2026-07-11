export default {
  id: 'module08-cpp-smart-pointers',
  title: 'Module 8: C++ Smart Pointers',
  lessons: [
    {
      id: 'cpp-smart-pointers',
      title: 'Smart Pointers & RAII Memory Ownership',
      slug: 'cpp-smart-pointers',
      description: 'Master RAII memory management, unique_ptr, shared_ptr, and weak_ptr ownership models.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Implement Resource Acquisition Is Initialization (RAII)",
        "Use std::unique_ptr for single-owner memory",
        "Use std::shared_ptr and std::weak_ptr for shared-owner memory"
],
      content: `<h3>Smart Pointers & RAII Memory Ownership</h3>
<p>Modern C++ uses Smart Pointers to automate heap memory management, using the Resource Acquisition Is Initialization (RAII) programming paradigm.</p>
<h4>1. std::unique_ptr</h4>
<p>A <code>unique_ptr</code> owns a heap object exclusively. It cannot be copied, only moved. When the <code>unique_ptr</code> goes out of scope, it automatically calls <code>delete</code> on the managed object.</p>
<h4>2. std::shared_ptr & std::weak_ptr</h4>
<p>A <code>shared_ptr</code> tracks how many pointers share ownership of a heap object. The object is destroyed when the last <code>shared_ptr</code> goes out of scope. <code>weak_ptr</code> references a <code>shared_ptr</code> without incrementing its reference count, preventing cyclical dependency leaks.</p>`,
      theory: `<h3>Smart Pointers & RAII Memory Ownership</h3>
<p>Modern C++ uses Smart Pointers to automate heap memory management, using the Resource Acquisition Is Initialization (RAII) programming paradigm.</p>
<h4>1. std::unique_ptr</h4>
<p>A <code>unique_ptr</code> owns a heap object exclusively. It cannot be copied, only moved. When the <code>unique_ptr</code> goes out of scope, it automatically calls <code>delete</code> on the managed object.</p>
<h4>2. std::shared_ptr & std::weak_ptr</h4>
<p>A <code>shared_ptr</code> tracks how many pointers share ownership of a heap object. The object is destroyed when the last <code>shared_ptr</code> goes out of scope. <code>weak_ptr</code> references a <code>shared_ptr</code> without incrementing its reference count, preventing cyclical dependency leaks.</p>`,
      analogy: `<h3>Real-Life Analogy: The Automatic Valet Key</h3>
<p>A raw pointer is like a standard room key—you have to remember to return it. A smart pointer is like a digital key card that detects when you walk out of the building and automatically checks out for you, preventing leaks.</p>`,
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
            questionText: 'Which smart pointer represents exclusive, non-copyable ownership of a heap resource?',
            options: [
          {
                    "text": "std::shared_ptr",
                    "isCode": true
          },
          {
                    "text": "std::unique_ptr",
                    "isCode": true
          },
          {
                    "text": "std::weak_ptr",
                    "isCode": true
          }
],
            correctAnswerIndex: 1,
            explanation: 'std::unique_ptr represents exclusive ownership; it cannot be copied, only moved, guaranteeing that only one pointer manages the resource.'
          }
        ]
      }
    }
  ]
};
