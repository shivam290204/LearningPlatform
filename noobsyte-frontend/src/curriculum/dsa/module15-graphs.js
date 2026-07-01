export default {
  id: 'module15-graphs',
  title: 'Module 15: Graphs',
  lessons: [
  {
    "id": "graph-representations",
    "title": "Directed vs. Undirected Graph Representations",
    "slug": "graph-representations",
    "description": "Understand the concept of Directed vs. Undirected Graph Representations for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "visualizations": [],
    "objectives": [
      "Implement Directed vs. Undirected Graph Representations structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>Directed vs. Undirected Graph Representations</h3>\n<p>A **Graph** consists of vertices (nodes) connected by edges:</p>\n<ul>\n  <li><strong>Directed Graph (Digraph):</strong> Edges have a direction (U -> V).</li>\n  <li><strong>Undirected Graph:</strong> Edges are bidirectional (U <-> V).</li>\n</ul>\n<p>Graphs are represented in code using an **Adjacency Matrix** (2D array) or an **Adjacency List** (array of lists).</p>",
    "theory": "<h3>Directed vs. Undirected Graph Representations</h3>\n<p>A **Graph** consists of vertices (nodes) connected by edges:</p>\n<ul>\n  <li><strong>Directed Graph (Digraph):</strong> Edges have a direction (U -> V).</li>\n  <li><strong>Undirected Graph:</strong> Edges are bidirectional (U <-> V).</li>\n</ul>\n<p>Graphs are represented in code using an **Adjacency Matrix** (2D array) or an **Adjacency List** (array of lists).</p>",
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
          "questionText": "Which graph representation is optimal for sparse graphs?",
          "options": [
            {
              "text": "Adjacency Matrix",
              "isCode": false
            },
            {
              "text": "Adjacency List",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Adjacency Lists only store actual edges, saving significant memory over O(V²) matrices in sparse graphs."
        }
      ]
    }
  },
  {
    "id": "graph-bfs-dfs",
    "title": "Graph Traversals: BFS & DFS",
    "slug": "graph-bfs-dfs",
    "description": "Understand the concept of Graph Traversals: BFS & DFS for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "graph-traversal",
    "visualizations": [],
    "objectives": [
      "Implement Graph Traversals: BFS & DFS structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>Graph Traversals: BFS & DFS</h3>\n<p>Traversing a graph involves visiting all its vertices systematically:</p>\n<ul>\n  <li><strong>Breadth-First Search (BFS):</strong> Explores neighbors level by level. Implemented using a **Queue** (FIFO).</li>\n  <li><strong>Depth-First Search (DFS):</strong> Explores paths as deep as possible before backtracking. Implemented using a **Stack** or recursion.</li>\n</ul>",
    "theory": "<h3>Graph Traversals: BFS & DFS</h3>\n<p>Traversing a graph involves visiting all its vertices systematically:</p>\n<ul>\n  <li><strong>Breadth-First Search (BFS):</strong> Explores neighbors level by level. Implemented using a **Queue** (FIFO).</li>\n  <li><strong>Depth-First Search (DFS):</strong> Explores paths as deep as possible before backtracking. Implemented using a **Stack** or recursion.</li>\n</ul>",
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
          "questionText": "What data structure is used to track nodes in a Breadth-First Search (BFS) traversal?",
          "options": [
            {
              "text": "Stack (LIFO)",
              "isCode": false
            },
            {
              "text": "Queue (FIFO)",
              "isCode": false
            },
            {
              "text": "Priority Queue",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "BFS explores node neighbors level by level, tracking visitation order using a Queue."
        }
      ]
    }
  }
]
};