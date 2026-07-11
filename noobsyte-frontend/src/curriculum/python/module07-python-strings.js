export default {
  id: 'module07-python-strings',
  title: 'Module 7: Python Strings',
  lessons: [
    {
      id: 'python-strings',
      title: 'Strings & Formatting in Python',
      slug: 'python-strings',
      description: 'Master string manipulation methods, indexing, slicing, and modern f-string formats.',
      difficulty: 'Beginner',
      estTime: '12 min',
      quizAvailable: true,
      xpReward: 50,
      visualizer: '',
      visualizations: [],
      objectives: [
        "Perform string slicing operations",
        "Use core string helper methods",
        "Implement f-strings for dynamic formatting"
],
      content: `<h3>Strings & Formatting in Python</h3>
<p>Python treats strings as immutable sequences of Unicode code points.</p>
<h4>1. String Slicing</h4>
<p>Slicing extracts substrings using syntax <code>string[start:stop:step]</code>: <code>s = "Python"; s[0:2]</code> returns <code>"Py"</code>.</p>
<h4>2. F-Strings (Formatted String Literals)</h4>
<p>Prefixing a string with <code>f</code> allows embedding Python expressions directly inside curly braces: <code>name = "Alice"; f"Hello, {name}!"</code>.</p>`,
      theory: `<h3>Strings & Formatting in Python</h3>
<p>Python treats strings as immutable sequences of Unicode code points.</p>
<h4>1. String Slicing</h4>
<p>Slicing extracts substrings using syntax <code>string[start:stop:step]</code>: <code>s = "Python"; s[0:2]</code> returns <code>"Py"</code>.</p>
<h4>2. F-Strings (Formatted String Literals)</h4>
<p>Prefixing a string with <code>f</code> allows embedding Python expressions directly inside curly braces: <code>name = "Alice"; f"Hello, {name}!"</code>.</p>`,
      analogy: `<h3>Real-Life Analogy: The Film Strip</h3>
<p>A Python string is like a sequence of frames on a film strip. You can cut a segment (slice) to create a clip, or examine specific frames (index). However, you cannot paint over a frame in the middle; you must create a new print copy of the strip.</p>`,
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
            questionText: 'What is the value of "s[::2]" if "s = \'Python\'"?',
            options: [
          {
                    "text": "'Pto'",
                    "isCode": false
          },
          {
                    "text": "'yhn'",
                    "isCode": false
          },
          {
                    "text": "'Py'",
                    "isCode": false
          }
],
            correctAnswerIndex: 0,
            explanation: 's[::2] slices the string from start to end with a step size of 2, selecting characters \'P\', \'t\', and \'o\'.'
          }
        ]
      }
    }
  ]
};
