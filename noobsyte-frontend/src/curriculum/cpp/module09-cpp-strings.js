export default {
  id: 'module09-cpp-strings',
  title: 'Module 9: C++ Strings & Char Arrays',
  lessons: [
    {
      id: 'cpp-strings',
      title: 'Strings & Null-Terminated Arrays in C++',
      slug: 'cpp-strings',
      description: 'Understand C-style null-terminated strings and standard std::string methods.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Define C-style strings (null-terminated arrays)",
        "Use std::string and understand dynamic resizing",
        "Apply core std::string methods"
],
      content: `<h3>Strings & Null-Terminated Arrays in C++</h3>
<p>C++ supports two string representations: C-style character arrays and the modern <code>std::string</code> class.</p>
<h4>1. C-Style Strings</h4>
<p>A C-style string is an array of characters terminating with a null character (<code>\0</code>): <code>char name[] = "C++";</code>. The compiler adds the null terminator automatically to mark the end of the string.</p>
<h4>2. std::string</h4>
<p>The standard <code>std::string</code> class wraps raw character arrays, managing memory allocation, resizing, and lookups automatically, which prevents common buffer overflow vulnerabilities.</p>`,
      theory: `<h3>Strings & Null-Terminated Arrays in C++</h3>
<p>C++ supports two string representations: C-style character arrays and the modern <code>std::string</code> class.</p>
<h4>1. C-Style Strings</h4>
<p>A C-style string is an array of characters terminating with a null character (<code>\0</code>): <code>char name[] = "C++";</code>. The compiler adds the null terminator automatically to mark the end of the string.</p>
<h4>2. std::string</h4>
<p>The standard <code>std::string</code> class wraps raw character arrays, managing memory allocation, resizing, and lookups automatically, which prevents common buffer overflow vulnerabilities.</p>`,
      analogy: `<h3>Real-Life Analogy: The Sentence Tape</h3>
<p>A C-style string is like a roll of paper tape with words written on it. The end of the sentence is marked with a red sticker (null terminator). If you cut off the sticker, the reader will keep reading into whatever garbage text lies beyond. std::string is like a smart digital display that automatically scales and knows its own length.</p>`,
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
            questionText: 'What character marks the end of a C-style string in memory?',
            options: [
          {
                    "text": "'\\n'",
                    "isCode": false
          },
          {
                    "text": "'\\0'",
                    "isCode": false
          },
          {
                    "text": "';'",
                    "isCode": false
          }
],
            correctAnswerIndex: 1,
            explanation: 'C-style strings are null-terminated, meaning they use the null character \'\0\' (value 0) to define the end of the text sequence.'
          }
        ]
      }
    }
  ]
};
