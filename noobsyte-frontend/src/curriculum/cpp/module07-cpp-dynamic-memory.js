export default {
  id: 'module07-cpp-dynamic-memory',
  title: 'Module 7: C++ Dynamic Memory',
  lessons: [
    {
      id: 'cpp-dynamic-memory',
      title: 'Heap Allocations using new/delete in C++',
      slug: 'cpp-dynamic-memory',
      description: 'Understand Heap memory allocation using new/delete keywords and preventing memory leaks.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Allocate memory dynamically on the Heap using new",
        "Deallocate Heap memory using delete",
        "Explain and prevent memory leaks"
],
      content: `<h3>Heap Allocations using new/delete in C++</h3>
<p>In C++, dynamic memory is allocated on the Heap and must be managed manually to avoid resource exhaustion.</p>
<h4>1. Heap Allocation via new</h4>
<p>Unlike stack memory, which is automatically deallocated, Heap allocations are requested using the <code>new</code> keyword: <code>int* p = new int;</code>. The pointer <code>p</code> resides on the Stack and stores the Heap address.</p>
<h4>2. Deallocation & Memory Leaks</h4>
<p>When heap memory is no longer needed, you must release it using the <code>delete</code> keyword: <code>delete p;</code>. Failing to do so causes a memory leak, where the allocated memory remains marked as used until the program exits.</p>`,
      theory: `<h3>Heap Allocations using new/delete in C++</h3>
<p>In C++, dynamic memory is allocated on the Heap and must be managed manually to avoid resource exhaustion.</p>
<h4>1. Heap Allocation via new</h4>
<p>Unlike stack memory, which is automatically deallocated, Heap allocations are requested using the <code>new</code> keyword: <code>int* p = new int;</code>. The pointer <code>p</code> resides on the Stack and stores the Heap address.</p>
<h4>2. Deallocation & Memory Leaks</h4>
<p>When heap memory is no longer needed, you must release it using the <code>delete</code> keyword: <code>delete p;</code>. Failing to do so causes a memory leak, where the allocated memory remains marked as used until the program exits.</p>`,
      analogy: `<h3>Real-Life Analogy: Borrowing a Hotel Room</h3>
<p>Allocating heap memory is like checking into a hotel room (new). The room remains yours as long as you have the key. When you leave, you must check out at the desk (delete). If you leave the hotel without checking out (memory leak), the hotel cannot rent the room to other guests, wasting space.</p>`,
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
            questionText: 'What occurs if you allocate memory on the Heap using "new" but never release it using "delete"?',
            options: [
          {
                    "text": "A memory leak occurs, wasting system RAM.",
                    "isCode": false
          },
          {
                    "text": "The operating system automatically frees it when the scope closes.",
                    "isCode": false
          },
          {
                    "text": "A stack overflow crash occurs immediately.",
                    "isCode": false
          }
],
            correctAnswerIndex: 0,
            explanation: 'C++ does not have a built-in garbage collector; heap allocations remain in use until explicitly released using delete, causing memory leaks if forgotten.'
          }
        ]
      }
    }
  ]
};
