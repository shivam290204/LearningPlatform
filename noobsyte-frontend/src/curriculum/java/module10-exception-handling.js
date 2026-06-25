export default {
  id: 'module10-exception-handling',
  title: 'Module 10: Exception Handling',
  lessons: [
  {
    "id": "exceptions-hierarchy",
    "title": "Checked vs. Unchecked Exception Hierarchy",
    "slug": "exceptions-hierarchy",
    "description": "Deep dive into Checked vs. Unchecked Exception Hierarchy conceptual implementation structures.",
    "difficulty": "Beginner",
    "estTime": "15 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "objectives": [
      "Master the core rules of Checked vs. Unchecked Exception Hierarchy",
      "Explain structural mechanisms under the hood"
    ],
    "theory": "<h3>Checked vs. Unchecked Exception Hierarchy</h3>\n<p>Exceptions interrupt normal program execution flow. All exceptions inherit from <code>Throwable</code>:</p>\n<ul>\n  <li><strong>Checked:</strong> Compiler verifies handling (e.g. <code>IOException</code>). Forced compile checks.</li>\n  <li><strong>Unchecked (Runtime):</strong> Coding bugs (e.g. <code>NullPointerException</code>, <code>ArithmeticException</code>). Not validated at compile-time.</li>\n</ul>",
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
          "questionText": "Which is a checked exception that must be handled or declared in the signature?",
          "options": [
            {
              "text": "NullPointerException",
              "isCode": false
            },
            {
              "text": "IOException",
              "isCode": false
            },
            {
              "text": "ArrayIndexOutOfBoundsException",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "IOException is checked, meaning the compiler forces try-catch blocks or throws clauses."
        }
      ]
    }
  }
]
};