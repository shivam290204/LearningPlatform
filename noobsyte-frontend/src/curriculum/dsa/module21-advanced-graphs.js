export default {
  id: 'module21-advanced-graphs',
  title: 'Module 21: Advanced Graph Algorithms',
  lessons: [
  {
    "id": "graph-shortest-paths",
    "title": "Dijkstra's, Bellman-Ford, and A* Algorithms",
    "slug": "graph-shortest-paths",
    "description": "Understand the concept of Dijkstra's, Bellman-Ford, and A* Algorithms for technical coding interviews.",
    "difficulty": "Advanced",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "dijkstra-graph",
    "visualizations": [],
    "objectives": [
      "Implement Dijkstra's, Bellman-Ford, and A* Algorithms structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>Shortest Path Algorithms</h3>\n<p>These algorithms find the shortest path between nodes in a weighted graph:</p>\n<ul>\n  <li><strong>Dijkstra's Algorithm:</strong> Finds the shortest path in graphs with non-negative edge weights using a Priority Queue. Time complexity: <code>O(E log V)</code>.</li>\n  <li><strong>Bellman-Ford Algorithm:</strong> Computes shortest paths in graphs that may have negative edge weights. Can detect negative weight cycles. Time complexity: <code>O(V * E)</code>.</li>\n  <li><strong>A* Search:</strong> Uses a heuristic function to guide pathfinding, commonly used in navigation and maps.</li>\n</ul>",
    "theory": "<h3>Shortest Path Algorithms</h3>\n<p>These algorithms find the shortest path between nodes in a weighted graph:</p>\n<ul>\n  <li><strong>Dijkstra's Algorithm:</strong> Finds the shortest path in graphs with non-negative edge weights using a Priority Queue. Time complexity: <code>O(E log V)</code>.</li>\n  <li><strong>Bellman-Ford Algorithm:</strong> Computes shortest paths in graphs that may have negative edge weights. Can detect negative weight cycles. Time complexity: <code>O(V * E)</code>.</li>\n  <li><strong>A* Search:</strong> Uses a heuristic function to guide pathfinding, commonly used in navigation and maps.</li>\n</ul>",
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
          "questionText": "Which algorithm can detect negative weight cycles in a graph?",
          "options": [
            {
              "text": "Dijkstra's Algorithm",
              "isCode": false
            },
            {
              "text": "Bellman-Ford Algorithm",
              "isCode": false
            },
            {
              "text": "A* Algorithm",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Bellman-Ford relaxes all edges V-1 times. A final iteration that reduces distances indicates a negative cycle."
        }
      ]
    }
  },
  {
    "id": "graph-mst-algorithms",
    "title": "Prim's and Kruskal's Algorithms",
    "slug": "graph-mst-algorithms",
    "description": "Understand the concept of Prim's and Kruskal's Algorithms for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "dijkstra-graph",
    "visualizations": [],
    "objectives": [
      "Implement Prim's and Kruskal's Algorithms structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>Prim's and Kruskal's Algorithms</h3>\n<p>A **Minimum Spanning Tree (MST)** connects all vertices in a weighted graph with the minimum total edge weight, without cycles.</p>\n<ul>\n  <li><strong>Prim's Algorithm:</strong> Starts from a root vertex and grows the tree by adding the cheapest edge to an unvisited vertex. Best for dense graphs.</li>\n  <li><strong>Kruskal's Algorithm:</strong> Sorts all edges by weight and adds the cheapest edge if it doesn't create a cycle. Uses a Disjoint Set (Union-Find) data structure. Best for sparse graphs.</li>\n</ul>",
    "theory": "<h3>Prim's and Kruskal's Algorithms</h3>\n<p>A **Minimum Spanning Tree (MST)** connects all vertices in a weighted graph with the minimum total edge weight, without cycles.</p>\n<ul>\n  <li><strong>Prim's Algorithm:</strong> Starts from a root vertex and grows the tree by adding the cheapest edge to an unvisited vertex. Best for dense graphs.</li>\n  <li><strong>Kruskal's Algorithm:</strong> Sorts all edges by weight and adds the cheapest edge if it doesn't create a cycle. Uses a Disjoint Set (Union-Find) data structure. Best for sparse graphs.</li>\n</ul>",
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
          "questionText": "What helper data structure is used in Kruskal's algorithm to check if adding an edge creates a cycle?",
          "options": [
            {
              "text": "Binary Heap",
              "isCode": false
            },
            {
              "text": "Disjoint Set (Union-Find)",
              "isCode": false
            },
            {
              "text": "Adjacency List",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Union-Find keeps track of connected components, allowing cycle checks in near-constant time."
        }
      ]
    }
  }
]
};