export default {
  id: 'module16-dynamic-programming',
  title: 'Module 16: Dynamic Programming',
  lessons: [
  {
    "id": "dynamic-programming-dsa",
    "title": "Dynamic Programming",
    "slug": "dynamic-programming-dsa",
    "description": "Understand the concept of Dynamic Programming for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "visualizations": [],
    "objectives": [
      "Implement Dynamic Programming structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>Dynamic Programming</h3>\n<p><strong>Dynamic Programming (DP)</strong> solves complex problems by breaking them down into overlapping subproblems. It solves each subproblem once and stores the result to avoid redundant work.</p>\n<p>DP approaches include:</p>\n<ul>\n  <li><strong>Memoization (Top-Down):</strong> Solves recursively and caches results in a table.</li>\n  <li><strong>Tabulation (Bottom-Up):</strong> Solves iteratively, building up the solution table from the base cases.</li>\n</ul>",
    "theory": "<h3>Dynamic Programming</h3>\n<p><strong>Dynamic Programming (DP)</strong> solves complex problems by breaking them down into overlapping subproblems. It solves each subproblem once and stores the result to avoid redundant work.</p>\n<p>DP approaches include:</p>\n<ul>\n  <li><strong>Memoization (Top-Down):</strong> Solves recursively and caches results in a table.</li>\n  <li><strong>Tabulation (Bottom-Up):</strong> Solves iteratively, building up the solution table from the base cases.</li>\n</ul>",
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
          "questionText": "What is the difference between Memoization and Tabulation?",
          "options": [
            {
              "text": "Memoization is bottom-up (iterative); Tabulation is top-down (recursive)",
              "isCode": false
            },
            {
              "text": "Memoization is top-down (recursive); Tabulation is bottom-up (iterative)",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Memoization uses recursion and caches results. Tabulation solves iteratively, filling a table from base cases up."
        }
      ]
    }
  }
]
};