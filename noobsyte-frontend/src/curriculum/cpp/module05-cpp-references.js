export default {
  id: 'module05-cpp-references',
  title: 'Module 5: C++ References',
  lessons: [
    {
      id: 'cpp-references',
      title: 'References & Parameter Passing in C++',
      slug: 'cpp-references',
      description: 'Understand variables alias references, memory locations, and parameters passing by reference.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Declare reference variables using & syntax",
        "Implement pass-by-reference parameter passing",
        "Use const references to prevent modifications and copying"
],
      content: `<h3>References & Parameter Passing in C++</h3>
<p>A reference variable acts as an alias—a different name for an existing variable in memory.</p>
<h4>1. References Syntax</h4>
<p>References are declared using the ampersand (<code>&</code>) symbol: <code>int& ref = original_val;</code>. A reference must be initialized when declared and cannot be reassigned to reference a different variable later.</p>
<h4>2. Pass-by-Reference & const References</h4>
<p>Passing parameters by reference avoids copying overhead: <code>void process(int& val)</code>. For large objects (like vectors or strings), passing by <code>const reference</code> (<code>const std::string& str</code>) prevents both copying and modifications, maximizing efficiency.</p>`,
      theory: `<h3>References & Parameter Passing in C++</h3>
<p>A reference variable acts as an alias—a different name for an existing variable in memory.</p>
<h4>1. References Syntax</h4>
<p>References are declared using the ampersand (<code>&</code>) symbol: <code>int& ref = original_val;</code>. A reference must be initialized when declared and cannot be reassigned to reference a different variable later.</p>
<h4>2. Pass-by-Reference & const References</h4>
<p>Passing parameters by reference avoids copying overhead: <code>void process(int& val)</code>. For large objects (like vectors or strings), passing by <code>const reference</code> (<code>const std::string& str</code>) prevents both copying and modifications, maximizing efficiency.</p>`,
      analogy: `<h3>Real-Life Analogy: The Nickname</h3>
<p>A reference variable is like a nickname. If your friend's name is Robert, you might refer to him by his nickname, Bob. Any action you take on Bob (giving him a book, asking him a question) affects Robert directly because Bob and Robert refer to the exact same physical person.</p>`,
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
            questionText: 'What is the primary benefit of passing a large object as a "const reference"?',
            options: [
          {
                    "text": "It creates a thread-safe copy on the Heap.",
                    "isCode": false
          },
          {
                    "text": "It avoids copying overhead while ensuring the function cannot modify the original object.",
                    "isCode": false
          },
          {
                    "text": "It compiles the object into binary bytecode.",
                    "isCode": false
          }
],
            correctAnswerIndex: 1,
            explanation: 'Passing by const reference passes a direct reference to the object without the cost of copying, while const prevents the function from altering it.'
          }
        ]
      }
    }
  ]
};
