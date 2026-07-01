export default {
  id: 'module05-linked-list',
  title: 'Module 5: Linked Lists',
  lessons: [
  {
    "id": "singly-linked-list-dsa",
    "title": "Singly Linked List Nodes & Pointers",
    "slug": "singly-linked-list-dsa",
    "description": "Master Singly Linked List Nodes & Pointers conceptual implementation and quiz review.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "linkedlist",
    "visualizations": [
      {
        "step": 1,
        "label": "Linked List: [Head] -> Node(val=10, next=0x1102) -> Node(val=20, next=null)",
        "memorySnapshot": {
          "stack": [
            {
              "variable": "head",
              "value": "0x1005"
            }
          ],
          "heap": [
            {
              "address": "0x1005",
              "objectType": "Node",
              "fields": {
                "data": 10,
                "next": "0x1102"
              }
            },
            {
              "address": "0x1102",
              "objectType": "Node",
              "fields": {
                "data": 20,
                "next": "null"
              }
            }
          ]
        }
      }
    ],
    "objectives": [
      "Understand Singly Linked List Nodes & Pointers fundamentals",
      "Explain structural complexity and dry-run boundaries"
    ],
    "content": "\n            <h3>Singly Linked List Nodes & Pointers</h3>\n            <p>Unlike sequential Arrays, a <strong>Linked List</strong> allocates data in isolated Node objects scattered across Heap memory. Nodes are linked together via pointers.</p>\n            <p>A Singly Linked List Node holds:\n            <ol>\n              <li><strong>data:</strong> The value stored in the node.</li>\n              <li><strong>next:</strong> A reference address pointer pointing to the next node in the chain.</li>\n            </ol>\n            <p>The list starts at a <code>head</code> reference. The final node points to <code>null</code>.</p>\n          ",
    "theory": "\n            <h3>Singly Linked List Nodes & Pointers</h3>\n            <p>Unlike sequential Arrays, a <strong>Linked List</strong> allocates data in isolated Node objects scattered across Heap memory. Nodes are linked together via pointers.</p>\n            <p>A Singly Linked List Node holds:\n            <ol>\n              <li><strong>data:</strong> The value stored in the node.</li>\n              <li><strong>next:</strong> A reference address pointer pointing to the next node in the chain.</li>\n            </ol>\n            <p>The list starts at a <code>head</code> reference. The final node points to <code>null</code>.</p>\n          ",
    "analogy": "",
    "interviewNotes": "",
    "commonMistakes": "",
    "practiceProblems": [],
    "quiz": {
      "questions": [
        {
          "questionText": "What value does the next reference field of the final node in a Singly Linked List hold?",
          "options": [
            {
              "text": "The address of the head node",
              "isCode": false
            },
            {
              "text": "null",
              "isCode": false
            },
            {
              "text": "0x0000",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "The final node in a linked list does not point to any subsequent nodes, so its next reference holds null."
        }
      ]
    }
  },
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
    "visualizations": [
      {
        "step": 1,
        "label": "Singly Linked List: [Head] -> Node(val=10) -> Node(val=20) -> null",
        "memorySnapshot": {
          "stack": [
            {
              "variable": "head",
              "value": "0x1005"
            }
          ],
          "heap": [
            {
              "address": "0x1005",
              "objectType": "Node",
              "fields": {
                "data": 10,
                "next": "0x1102"
              }
            },
            {
              "address": "0x1102",
              "objectType": "Node",
              "fields": {
                "data": 20,
                "next": "null"
              }
            }
          ]
        }
      }
    ],
    "objectives": [
      "Implement Singly, Doubly, & Circular Linked Lists structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>Singly, Doubly, & Circular Linked Lists</h3>\n<p>Linked Lists allocate elements (nodes) dynamically on the Heap:</p>\n<ul>\n  <li><strong>Singly Linked List:</strong> Each node points to the <code>next</code> node.</li>\n  <li><strong>Doubly Linked List:</strong> Nodes point to both <code>next</code> and <code>prev</code> nodes.</li>\n  <li><strong>Circular Linked List:</strong> The tail node points back to the <code>head</code> node.</li>\n</ul>",
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