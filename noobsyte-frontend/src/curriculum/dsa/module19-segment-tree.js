export default {
  id: 'module19-segment-tree',
  title: 'Module 19: Segment & Fenwick Trees',
  lessons: [
  {
    "id": "segment-fenwick-trees",
    "title": "Range Query Structures: Segment Trees & Fenwick Trees",
    "slug": "segment-fenwick-trees",
    "description": "Understand the concept of Range Query Structures: Segment Trees & Fenwick Trees for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "objectives": [
      "Implement Range Query Structures: Segment Trees & Fenwick Trees structure",
      "Explain execution complexity bounds"
    ],
    "theory": "<h3>Range Query Structures: Segment Trees & Fenwick Trees</h3>\n<p>These structures optimize queries on interval ranges of arrays:</p>\n<ul>\n  <li><strong>Segment Tree:</strong> A binary tree where each node represents an interval of the array. Supports range queries (e.g. range sum, range minimum) in <code>O(log N)</code> and point updates in <code>O(log N)</code>.</li>\n  <li><strong>Fenwick Tree (Binary Indexed Tree):</strong> A space-efficient tree structure represented as an array. Supports prefix sum queries and point updates in <code>O(log N)</code> time.</li>\n</ul>",
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
          "questionText": "What is the runtime for range sum queries and point updates in a Segment Tree?",
          "options": [
            {
              "text": "Range sum: O(1), update: O(N)",
              "isCode": false
            },
            {
              "text": "Range sum: O(log N), update: O(log N)",
              "isCode": false
            },
            {
              "text": "Range sum: O(N), update: O(1)",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Segment Trees perform both updates and range queries in O(log N) time by traversing height levels."
        }
      ]
    }
  }
]
};