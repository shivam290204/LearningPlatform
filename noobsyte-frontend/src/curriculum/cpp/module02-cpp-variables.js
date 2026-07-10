export default {
  id: 'module02-cpp-variables',
  title: 'Module 2: C++ Variables & Types',
  lessons: [
    {
      id: 'cpp-variables',
      title: 'Variables, Data Types, and Sizes in C++',
      slug: 'cpp-variables',
      description: 'Understand primitive data types, sizes, constant values, and type casting rules.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Define primitive types (int, float, double, char, bool)",
        "Explain memory sizes of types on different systems",
        "Implement safe static_cast type conversions"
],
      content: `<h3>Variables, Data Types, and Sizes in C++</h3>
<p>C++ variables have fixed, declared types that dictate their memory allocations and operation bounds.</p>
<h4>1. Primitive Data Types</h4>
<p>Common types include <code>char</code> (usually 1 byte), <code>int</code> (usually 4 bytes), <code>double</code> (usually 8 bytes), and <code>bool</code> (1 byte). The exact size is system-dependent; you can check it using the <code>sizeof</code> operator.</p>
<h4>2. Type Casting</h4>
<p>C++ enforces strict typing. Type conversions should use safe, explicit casts like <code>static_cast&lt;double&gt;(integer_val)</code> to avoid silent data truncation.</p>`,
      theory: `<h3>Variables, Data Types, and Sizes in C++</h3>
<p>C++ variables have fixed, declared types that dictate their memory allocations and operation bounds.</p>
<h4>1. Primitive Data Types</h4>
<p>Common types include <code>char</code> (usually 1 byte), <code>int</code> (usually 4 bytes), <code>double</code> (usually 8 bytes), and <code>bool</code> (1 byte). The exact size is system-dependent; you can check it using the <code>sizeof</code> operator.</p>
<h4>2. Type Casting</h4>
<p>C++ enforces strict typing. Type conversions should use safe, explicit casts like <code>static_cast&lt;double&gt;(integer_val)</code> to avoid silent data truncation.</p>`,
      analogy: `<h3>Real-Life Analogy: The Measuring Cups</h3>
<p>Variables types are like measuring cups of different sizes. An <code>int</code> is like a small tea cup, and a <code>double</code> is like a large water pitcher. You can pour tea from a tea cup into a pitcher safely. However, trying to pour a full pitcher into a tea cup will overflow, spilling data.</p>`,
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
            questionText: 'What operator is used to determine the exact memory footprint of a type in C++?',
            options: [
          {
                    "text": "sizeof",
                    "isCode": true
          },
          {
                    "text": "typeof",
                    "isCode": true
          },
          {
                    "text": "memoryof",
                    "isCode": true
          }
],
            correctAnswerIndex: 0,
            explanation: 'The sizeof operator returns the size of a type or variable in bytes on the host system.'
          }
        ]
      }
    }
  ]
};
