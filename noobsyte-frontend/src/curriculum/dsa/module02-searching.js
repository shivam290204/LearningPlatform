export default {
  id: 'module02-searching',
  title: 'Module 2: Search Algorithms',
  lessons: [
  {
    "id": "linear-binary-search",
    "title": "Linear Search vs. Binary Search",
    "slug": "linear-binary-search",
    "description": "Understand the concept of Linear Search vs. Binary Search for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "binary-search",
    "objectives": [
      "Implement Linear Search vs. Binary Search structure",
      "Explain execution complexity bounds"
    ],
    "theory": "<h3>Linear Search vs. Binary Search</h3>\n<p>Searching involves finding a value within a collection:</p>\n<ul>\n  <li><strong>Linear Search:</strong> Iterates from index 0 to N-1. Operates on unsorted lists in <code>O(N)</code> time.</li>\n  <li><strong>Binary Search:</strong> Halves the search space recursively. Requires sorted inputs, achieving log scales: <code>O(log N)</code>.</li>\n</ul>",
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
          "questionText": "What prerequisite must be satisfied to perform Binary Search on an array?",
          "options": [
            {
              "text": "The array must be unsorted",
              "isCode": false
            },
            {
              "text": "The array must be sorted in ascending or descending order",
              "isCode": false
            },
            {
              "text": "The array must not contain duplicate keys",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Binary Search depends on order sorting to determine whether to search the left or right half."
        }
      ]
    }
  }
]
};