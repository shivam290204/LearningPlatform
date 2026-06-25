export default {
  id: 'module01-java-fundamentals',
  title: 'Module 1: Java Fundamentals',
  lessons: [
  {
    "id": "java-syntax",
    "title": "Language Syntax & Variables",
    "slug": "java-syntax",
    "description": "Deep dive into Language Syntax & Variables conceptual implementation structures.",
    "difficulty": "Beginner",
    "estTime": "15 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "jvm-memory",
    "objectives": [
      "Master the core rules of Language Syntax & Variables",
      "Explain structural mechanisms under the hood"
    ],
    "theory": "<h3>Java Language Syntax & Variables</h3>\n<p>Java is a strongly typed, class-based language. Every line of executable code must exist inside a class definition.</p>\n<p>Variables serve as storage containers holding data during execution. Java classifies data types into:</p>\n<ul>\n  <li><strong>Primitives:</strong> Store raw values directly in Stack memory (e.g. <code>int</code>, <code>double</code>, <code>boolean</code>, <code>char</code>).</li>\n  <li><strong>References:</strong> Store 4-byte or 8-byte memory addresses pointing to objects on the Heap.</li>\n</ul>",
    "analogy": "Think of this as structuring standard execution patterns.",
    "interviewNotes": "Explain core operations and visual workflows.",
    "commonMistakes": "Watch for edge cases and initialization triggers.",
    "practiceProblems": [
      {
        "title": "Code Lab",
        "problemText": "Write a basic demo implementation of the concept.",
        "solution": "// Reference the theory above"
      }
    ],
    "quiz": {
      "questions": [
        {
          "questionText": "Where are primitive variables stored in JVM memory when declared inside a method?",
          "options": [
            {
              "text": "In the Heap space",
              "isCode": false
            },
            {
              "text": "Within the Stack Frame of the active thread",
              "isCode": false
            },
            {
              "text": "In the Method Area",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Local primitive variables are allocated directly within the thread's Stack Frame for fast retrieval."
        }
      ]
    }
  }
]
};