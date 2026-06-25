export default {
  id: 'module05-linked-list',
  title: 'Module 5: Linked Lists',
  lessons: [
  {
    "id": "linked-lists-types",
    "title": "Singly, Doubly, & Circular Linked Lists",
    "slug": "linked-lists-types",
    "description": "Understand the concept of Singly, Doubly, & Circular Linked Lists for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "linkedlist",
    "objectives": [
      "Implement Singly, Doubly, & Circular Linked Lists structure",
      "Explain execution complexity bounds"
    ],
    "theory": "<h3>Singly, Doubly, & Circular Linked Lists</h3>\n<p>Linked Lists allocate elements (nodes) dynamically on the Heap:</p>\n<ul>\n  <li><strong>Singly Linked List:</strong> Each node points to the <code>next</code> node.</li>\n  <li><strong>Doubly Linked List:</strong> Nodes point to both <code>next</code> and <code>prev</code> nodes.</li>\n  <li><strong>Circular Linked List:</strong> The tail node points back to the <code>head</code> node.</li>\n</ul>",
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
          "questionText": "Which linked list type allows two-way traversal (forward and backward)?",
          "options": [
            {
              "text": "Singly Linked List",
              "isCode": false
            },
            {
              "text": "Doubly Linked List",
              "isCode": false
            },
            {
              "text": "Circular Linked List",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Doubly Linked Lists store both next and prev references in each node, allowing bidirectional traversal."
        }
      ]
    }
  }
]
};