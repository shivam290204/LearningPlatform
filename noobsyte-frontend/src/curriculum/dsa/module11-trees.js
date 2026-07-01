export default {
  id: 'module11-trees',
  title: 'Module 11: Binary Trees',
  lessons: [
  {
    "id": "binary-tree-traversals",
    "title": "Binary Trees & Tree Traversals",
    "slug": "binary-tree-traversals",
    "description": "Understand the concept of Binary Trees & Tree Traversals for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "bst-tree",
    "visualizations": [],
    "objectives": [
      "Implement Binary Trees & Tree Traversals structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>Binary Trees & Tree Traversals</h3>\n<p>A **Binary Tree** is a hierarchical structure where each node has at most two children (left and right).</p>\n<p>Depth-First search traversals include:</p>\n<ul>\n  <li><strong>In-Order (Left, Root, Right):</strong> Visits nodes in sorted order for BSTs.</li>\n  <li><strong>Pre-Order (Root, Left, Right):</strong> Useful for copying trees.</li>\n  <li><strong>Post-Order (Left, Right, Root):</strong> Useful for deleting trees.</li>\n</ul>",
    "theory": "<h3>Binary Trees & Tree Traversals</h3>\n<p>A **Binary Tree** is a hierarchical structure where each node has at most two children (left and right).</p>\n<p>Depth-First search traversals include:</p>\n<ul>\n  <li><strong>In-Order (Left, Root, Right):</strong> Visits nodes in sorted order for BSTs.</li>\n  <li><strong>Pre-Order (Root, Left, Right):</strong> Useful for copying trees.</li>\n  <li><strong>Post-Order (Left, Right, Root):</strong> Useful for deleting trees.</li>\n</ul>",
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
          "questionText": "Which traversal visits the root node first before traversing either subtree?",
          "options": [
            {
              "text": "In-Order Traversal",
              "isCode": false
            },
            {
              "text": "Pre-Order Traversal",
              "isCode": false
            },
            {
              "text": "Post-Order Traversal",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Pre-Order traversal visits the root first, then the left child, and finally the right child."
        }
      ]
    }
  }
]
};