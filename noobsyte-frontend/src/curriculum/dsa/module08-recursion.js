export default {
  id: 'module08-recursion',
  title: 'Module 8: Recursion',
  lessons: [
  {
    "id": "brute-force-recursion",
    "title": "Brute Force & Recursion",
    "slug": "brute-force-recursion",
    "description": "Understand the concept of Brute Force & Recursion for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "visualizations": [],
    "objectives": [
      "Implement Brute Force & Recursion structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>Brute Force & Recursion</h3>\n<p>Core algorithmic paradigms:</p>\n<ul>\n  <li><strong>Brute Force:</strong> Systematically evaluates all possible solutions. Easy to implement but slow (often exponential time).</li>\n  <li><strong>Recursion:</strong> A function that calls itself to solve smaller subproblems. Requires a **Base Case** to prevent infinite loops and stack overflows.</li>\n</ul>",
    "theory": "<h3>Brute Force & Recursion</h3>\n<p>Core algorithmic paradigms:</p>\n<ul>\n  <li><strong>Brute Force:</strong> Systematically evaluates all possible solutions. Easy to implement but slow (often exponential time).</li>\n  <li><strong>Recursion:</strong> A function that calls itself to solve smaller subproblems. Requires a **Base Case** to prevent infinite loops and stack overflows.</li>\n</ul>",
    "analogy": "Think of this like structural sorting in daily logistics.",
    "interviewNotes": "Explain base cases and complexity boundaries.",
    "commonMistakes": "Watch for null pointers and index boundaries.",
    "practiceProblems": [
      {
        "title": "Solve Coding Challenge",
        "problemText": "Implement the concept and test edge cases.",
        "solution": "// Reference the theory above"
      }
    ],
    "quiz": {
      "questions": [
        {
          "questionText": "What is the purpose of the base case in a recursive function?",
          "options": [
            {
              "text": "To initialize variables",
              "isCode": false
            },
            {
              "text": "To define when recursion should stop, preventing stack overflow",
              "isCode": false
            },
            {
              "text": "To allocate Heap objects",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "The base case defines a terminating condition that stops recursive calls, returning back up the call stack."
        }
      ]
    }
  }
]
};