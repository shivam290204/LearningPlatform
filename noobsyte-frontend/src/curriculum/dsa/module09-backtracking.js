export default {
  id: 'module09-backtracking',
  title: 'Module 9: Backtracking & DC',
  lessons: [
  {
    "id": "backtracking-divide-conquer",
    "title": "Backtracking & Divide-and-Conquer",
    "slug": "backtracking-divide-conquer",
    "description": "Understand the concept of Backtracking & Divide-and-Conquer for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "objectives": [
      "Implement Backtracking & Divide-and-Conquer structure",
      "Explain execution complexity bounds"
    ],
    "theory": "<h3>Backtracking & Divide-and-Conquer</h3>\n<p>Optimized recursion strategies:</p>\n<ul>\n  <li><strong>Backtracking:</strong> Explores solutions incrementally, abandoning a path as soon as it violates constraints (e.g. N-Queens, Sudoku).</li>\n  <li><strong>Divide-and-Conquer:</strong> Splits a problem into independent subproblems, solves them recursively, and combines their results (e.g. Merge Sort).</li>\n</ul>",
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
          "questionText": "Which paradigm is best suited for solving constraint satisfaction problems like the N-Queens puzzle?",
          "options": [
            {
              "text": "Greedy Algorithms",
              "isCode": false
            },
            {
              "text": "Backtracking",
              "isCode": false
            },
            {
              "text": "Divide-and-Conquer",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Backtracking systematically builds and discards candidate paths as soon as they violate constraints."
        }
      ]
    }
  }
]
};