export default {
  id: 'module12-bst',
  title: 'Module 12: BST & Balanced Trees',
  lessons: [
  {
    "id": "bst-avl-trees",
    "title": "Binary Search Trees (BST) & Balanced AVL Trees",
    "slug": "bst-avl-trees",
    "description": "Understand the concept of Binary Search Trees (BST) & Balanced AVL Trees for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "avl-tree",
    "visualizations": [],
    "objectives": [
      "Implement Binary Search Trees (BST) & Balanced AVL Trees structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>Binary Search Trees (BST) & Balanced AVL Trees</h3>\n<p>A **Binary Search Tree (BST)** enforces sorting constraints: left children are smaller than the parent node, and right children are larger.</p>\n<p>In the worst case (skewed tree), BST operations can degrade to <code>O(N)</code>. **AVL Trees** solve this by maintaining balance. They perform rotations to guarantee <code>O(log N)</code> height during insertions and deletions.</p>",
    "theory": "<h3>Binary Search Trees (BST) & Balanced AVL Trees</h3>\n<p>A **Binary Search Tree (BST)** enforces sorting constraints: left children are smaller than the parent node, and right children are larger.</p>\n<p>In the worst case (skewed tree), BST operations can degrade to <code>O(N)</code>. **AVL Trees** solve this by maintaining balance. They perform rotations to guarantee <code>O(log N)</code> height during insertions and deletions.</p>",
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
          "questionText": "How do AVL trees maintain balance?",
          "options": [
            {
              "text": "By converting buckets into Red-Black trees",
              "isCode": false
            },
            {
              "text": "By performing tree rotations when subtrees height differences exceed 1",
              "isCode": false
            },
            {
              "text": "By linear probing",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "AVL trees calculate a balance factor for nodes and apply rotations to restore O(log N) height limits."
        }
      ]
    }
  },
  {
    "id": "b-trees-indexing",
    "title": "Multi-way Trees (2-3 Trees, B/B+ Trees)",
    "slug": "b-trees-indexing",
    "description": "Understand the concept of Multi-way Trees (2-3 Trees, B/B+ Trees) for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "visualizations": [],
    "objectives": [
      "Implement Multi-way Trees (2-3 Trees, B/B+ Trees) structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>Multi-way Trees (2-3 Trees, B/B+ Trees)</h3>\n<p>Standard binary search trees don't scale well to disk storage because of height variation. **B-Trees** and **B+ Trees** are self-balancing multi-way search trees designed for storage systems.</p>\n<ul>\n  <li><strong>2-3 Tree:</strong> A balanced tree where nodes can have 2 or 3 children.</li>\n  <li><strong>B-Tree:</strong> Nodes can contain multiple keys and children. Keys are distributed across all levels.</li>\n  <li><strong>B+ Tree:</strong> All keys are stored at the leaf level, and leaves are connected in a linked list. This layout supports fast range queries.</li>\n</ul>",
    "theory": "<h3>Multi-way Trees (2-3 Trees, B/B+ Trees)</h3>\n<p>Standard binary search trees don't scale well to disk storage because of height variation. **B-Trees** and **B+ Trees** are self-balancing multi-way search trees designed for storage systems.</p>\n<ul>\n  <li><strong>2-3 Tree:</strong> A balanced tree where nodes can have 2 or 3 children.</li>\n  <li><strong>B-Tree:</strong> Nodes can contain multiple keys and children. Keys are distributed across all levels.</li>\n  <li><strong>B+ Tree:</strong> All keys are stored at the leaf level, and leaves are connected in a linked list. This layout supports fast range queries.</li>\n</ul>",
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
          "questionText": "Why are B+ Trees preferred over standard B-Trees for database indexing?",
          "options": [
            {
              "text": "Because they are binary trees",
              "isCode": false
            },
            {
              "text": "Because all values are stored in the leaf nodes, which are connected by a linked list to allow fast range scans",
              "isCode": false
            },
            {
              "text": "Because they do not require balancing",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "B+ Tree leaves are linked together, allowing sequential range scans without traversing parent levels."
        }
      ]
    }
  },
  {
    "id": "linear-tree-indexing",
    "title": "Database Indexing: Linear vs. Tree-Based Indexing",
    "slug": "linear-tree-indexing",
    "description": "Understand the concept of Database Indexing: Linear vs. Tree-Based Indexing for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "visualizations": [],
    "objectives": [
      "Implement Database Indexing: Linear vs. Tree-Based Indexing structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>Database Indexing: Linear vs. Tree-Based Indexing</h3>\n<p>An index speeds up database queries:</p>\n<ul>\n  <li><strong>Linear Indexing:</strong> A simple ordered list of key-pointer pairs. Search runs in <code>O(log N)</code> using binary search, but updates are slow (<code>O(N)</code>).</li>\n  <li><strong>Tree-Based Indexing:</strong> Uses B/B+ trees. Ensures <code>O(log N)</code> runtime for search, insertion, and deletion.</li>\n</ul>",
    "theory": "<h3>Database Indexing: Linear vs. Tree-Based Indexing</h3>\n<p>An index speeds up database queries:</p>\n<ul>\n  <li><strong>Linear Indexing:</strong> A simple ordered list of key-pointer pairs. Search runs in <code>O(log N)</code> using binary search, but updates are slow (<code>O(N)</code>).</li>\n  <li><strong>Tree-Based Indexing:</strong> Uses B/B+ trees. Ensures <code>O(log N)</code> runtime for search, insertion, and deletion.</li>\n</ul>",
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
          "questionText": "What is the update complexity in a linear index database model?",
          "options": [
            {
              "text": "O(1)",
              "isCode": false
            },
            {
              "text": "O(log N)",
              "isCode": false
            },
            {
              "text": "O(N)",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 2,
          "explanation": "Because linear indexes are kept sorted in contiguous arrays, inserting a new key requires shifting items, which takes O(N) time."
        }
      ]
    }
  },
  {
    "id": "isam-indexing",
    "title": "ISAM (Indexed Sequential Access Method)",
    "slug": "isam-indexing",
    "description": "Understand the concept of ISAM (Indexed Sequential Access Method) for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "visualizations": [],
    "objectives": [
      "Implement ISAM (Indexed Sequential Access Method) structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>ISAM (Indexed Sequential Access Method)</h3>\n<p><strong>ISAM</strong> is a static indexing method developed by IBM. It organizes records sequentially on disk and maintains a static index tree to locate blocks of records.</p>\n<p>ISAM is fast for read-only tables but struggles with updates because insertions can overflow blocks, leading to chained lookup lists that degrade performance.</p>",
    "theory": "<h3>ISAM (Indexed Sequential Access Method)</h3>\n<p><strong>ISAM</strong> is a static indexing method developed by IBM. It organizes records sequentially on disk and maintains a static index tree to locate blocks of records.</p>\n<p>ISAM is fast for read-only tables but struggles with updates because insertions can overflow blocks, leading to chained lookup lists that degrade performance.</p>",
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
          "questionText": "What is a limitation of ISAM?",
          "options": [
            {
              "text": "It uses binary heaps",
              "isCode": false
            },
            {
              "text": "The index structure is static, leading to overflow chains and slower lookups after many insertions",
              "isCode": false
            },
            {
              "text": "It cannot be stored on disk",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "ISAM indexes do not automatically re-balance during updates. New records are placed in overflow areas, which slows down search times over time."
        }
      ]
    }
  }
]
};