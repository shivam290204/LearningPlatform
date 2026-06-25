export default {
  id: 'module20-disjoint-set',
  title: 'Module 20: Disjoint Set Union',
  lessons: [
  {
    "id": "union-find-dsa",
    "title": "Disjoint Set Union (Union-Find)",
    "slug": "union-find-dsa",
    "description": "Understand the concept of Disjoint Set Union (Union-Find) for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "objectives": [
      "Implement Disjoint Set Union (Union-Find) structure",
      "Explain execution complexity bounds"
    ],
    "theory": "<h3>Disjoint Set Union (Union-Find)</h3>\n<p>The **Disjoint Set (Union-Find)** data structure manages a collection of disjoint sets. It supports two primary operations:</p>\n<ul>\n  <li><strong>Find:</strong> Identifies which set a particular element belongs to.</li>\n  <li><strong>Union:</strong> Merges two disjoint sets into a single set.</li>\n</ul>\n<p>By using **Path Compression** and **Union by Rank**, operations run in near-constant time: <code>O(α(N))</code>, where α is the inverse Ackermann function.</p>",
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
          "questionText": "What optimization compresses path heights in a Disjoint Set?",
          "options": [
            {
              "text": "Path Compression",
              "isCode": false
            },
            {
              "text": "Union by Rank",
              "isCode": false
            },
            {
              "text": "Binary rotation",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 0,
          "explanation": "Path Compression updates visited nodes to point directly to the set representative node during Find operations, flattening the tree structure."
        }
      ]
    }
  }
]
};