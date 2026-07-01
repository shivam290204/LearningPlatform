export default {
  id: 'module22-interview-problems',
  title: 'Module 22: Coding Interview Patterns',
  lessons: [
  {
    "id": "sliding-window-two-pointer",
    "title": "Sliding Window & Two Pointer Techniques",
    "slug": "sliding-window-two-pointer",
    "description": "Understand the concept of Sliding Window & Two Pointer Techniques for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "visualizations": [],
    "objectives": [
      "Implement Sliding Window & Two Pointer Techniques structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>Sliding Window & Two Pointer Techniques</h3>\n<p>These patterns optimize double loops over arrays or lists:</p>\n<ul>\n  <li><strong>Sliding Window:</strong> Maintains a sub-array (window) over the elements, expanding or shrinking it based on conditions. Used for contiguous sub-array problems.</li>\n  <li><strong>Two Pointer:</strong> Uses two pointers traversing the array (often from opposite ends or at different speeds) to solve searching/matching problems in sorted arrays.</li>\n</ul>",
    "theory": "<h3>Sliding Window & Two Pointer Techniques</h3>\n<p>These patterns optimize double loops over arrays or lists:</p>\n<ul>\n  <li><strong>Sliding Window:</strong> Maintains a sub-array (window) over the elements, expanding or shrinking it based on conditions. Used for contiguous sub-array problems.</li>\n  <li><strong>Two Pointer:</strong> Uses two pointers traversing the array (often from opposite ends or at different speeds) to solve searching/matching problems in sorted arrays.</li>\n</ul>",
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
          "questionText": "Which pattern is optimal for finding the maximum sum of a contiguous subarray of size K?",
          "options": [
            {
              "text": "Two Pointer",
              "isCode": false
            },
            {
              "text": "Sliding Window",
              "isCode": false
            },
            {
              "text": "Divide-and-Conquer",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Sliding Window maintains a running sum of a K-element window, avoiding redundant additions."
        }
      ]
    }
  },
  {
    "id": "fast-slow-pointers",
    "title": "Fast & Slow Pointers (Cycle Detection)",
    "slug": "fast-slow-pointers",
    "description": "Understand the concept of Fast & Slow Pointers (Cycle Detection) for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "visualizations": [],
    "objectives": [
      "Implement Fast & Slow Pointers (Cycle Detection) structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>Fast & Slow Pointers (Cycle Detection)</h3>\n<p>Also known as **Hare & Tortoise algorithm**, this pattern uses two pointers moving at different speeds (slow moves 1 step, fast moves 2 steps).</p>\n<p>Commonly used to detect cycles in linked lists or array structures. If a cycle exists, the fast pointer will eventually catch up and meet the slow pointer.</p>",
    "theory": "<h3>Fast & Slow Pointers (Cycle Detection)</h3>\n<p>Also known as **Hare & Tortoise algorithm**, this pattern uses two pointers moving at different speeds (slow moves 1 step, fast moves 2 steps).</p>\n<p>Commonly used to detect cycles in linked lists or array structures. If a cycle exists, the fast pointer will eventually catch up and meet the slow pointer.</p>",
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
          "questionText": "What happens if a cycle exists in a linked list traversed by fast and slow pointers?",
          "options": [
            {
              "text": "The fast pointer reaches null first",
              "isCode": false
            },
            {
              "text": "The fast and slow pointers will meet at the same node",
              "isCode": false
            },
            {
              "text": "The code throws a NullPointerException",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "In a cycle, the fast pointer loops around and eventually meets the slow pointer."
        }
      ]
    }
  },
  {
    "id": "merge-intervals-pattern",
    "title": "Merge Intervals",
    "slug": "merge-intervals-pattern",
    "description": "Understand the concept of Merge Intervals for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "visualizations": [],
    "objectives": [
      "Implement Merge Intervals structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>Merge Intervals</h3>\n<p>This pattern is used to solve problems involving overlapping intervals (e.g. meeting room schedules, range unions).</p>\n<p>It typically starts by sorting the intervals by their start times. Then, it iterates through the intervals, merging overlapping ones by comparing the start of the current interval with the end of the previous one.</p>",
    "theory": "<h3>Merge Intervals</h3>\n<p>This pattern is used to solve problems involving overlapping intervals (e.g. meeting room schedules, range unions).</p>\n<p>It typically starts by sorting the intervals by their start times. Then, it iterates through the intervals, merging overlapping ones by comparing the start of the current interval with the end of the previous one.</p>",
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
          "questionText": "What is the first step in solving a Merge Intervals problem?",
          "options": [
            {
              "text": "Sort the intervals by their start times",
              "isCode": false
            },
            {
              "text": "Compare adjacent end times randomly",
              "isCode": false
            },
            {
              "text": "Allocate a binary heap",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 0,
          "explanation": "Sorting by start times ensures that potentially overlapping intervals are adjacent, enabling O(N) merging."
        }
      ]
    }
  },
  {
    "id": "cyclic-sort-pattern",
    "title": "Cyclic Sort",
    "slug": "cyclic-sort-pattern",
    "description": "Understand the concept of Cyclic Sort for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "visualizations": [],
    "objectives": [
      "Implement Cyclic Sort structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>Cyclic Sort</h3>\n<p><strong>Cyclic Sort</strong> is used to solve problems involving arrays containing numbers in a given range (e.g. 1 to N).</p>\n<p>It places each number at its correct index: number <code>X</code> should be at index <code>X-1</code>. It swaps elements into place iteratively, solving problems like finding missing numbers in O(N) time and O(1) space.</p>",
    "theory": "<h3>Cyclic Sort</h3>\n<p><strong>Cyclic Sort</strong> is used to solve problems involving arrays containing numbers in a given range (e.g. 1 to N).</p>\n<p>It places each number at its correct index: number <code>X</code> should be at index <code>X-1</code>. It swaps elements into place iteratively, solving problems like finding missing numbers in O(N) time and O(1) space.</p>",
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
          "questionText": "What is the time complexity of Cyclic Sort on an array containing values from 1 to N?",
          "options": [
            {
              "text": "O(N²)",
              "isCode": false
            },
            {
              "text": "O(N)",
              "isCode": false
            },
            {
              "text": "O(N log N)",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Cyclic Sort places elements in their correct index within at most N swaps, yielding O(N) linear runtime."
        }
      ]
    }
  },
  {
    "id": "two-heaps-pattern",
    "title": "Two Heaps Pattern",
    "slug": "two-heaps-pattern",
    "description": "Understand the concept of Two Heaps Pattern for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "visualizations": [],
    "objectives": [
      "Implement Two Heaps Pattern structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>Two Heaps Pattern</h3>\n<p>This pattern is used to solve problems where we need to split elements into two parts to find running medians or track dynamic partition boundaries.</p>\n<p>It maintains a **Max Heap** for the smaller half of the numbers and a **Min Heap** for the larger half. This layout keeps the middle elements at the root of the heaps, supporting median extraction in O(1) time.</p>",
    "theory": "<h3>Two Heaps Pattern</h3>\n<p>This pattern is used to solve problems where we need to split elements into two parts to find running medians or track dynamic partition boundaries.</p>\n<p>It maintains a **Max Heap** for the smaller half of the numbers and a **Min Heap** for the larger half. This layout keeps the middle elements at the root of the heaps, supporting median extraction in O(1) time.</p>",
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
          "questionText": "How does the Two Heaps pattern track running medians?",
          "options": [
            {
              "text": "By using a balanced AVL tree",
              "isCode": false
            },
            {
              "text": "By storing the smaller half in a Max Heap and the larger half in a Min Heap",
              "isCode": false
            },
            {
              "text": "By sorting the array on every insertion",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Keeping elements balanced across a Max Heap (lower half) and Min Heap (upper half) makes the median values accessible at the roots."
        }
      ]
    }
  },
  {
    "id": "kth-element-pattern",
    "title": "Kth Element & QuickSelect",
    "slug": "kth-element-pattern",
    "description": "Understand the concept of Kth Element & QuickSelect for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "visualizations": [],
    "objectives": [
      "Implement Kth Element & QuickSelect structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>Kth Element & QuickSelect</h3>\n<p>QuickSelect is a selection algorithm used to find the Kth smallest/largest element in an unsorted array without sorting it entirely.</p>\n<p>It uses the same partitioning logic as QuickSort. It selects a pivot, partitions the array, and recursively searches only the partition containing the target Kth index. Average runtime: <code>O(N)</code>.</p>",
    "theory": "<h3>Kth Element & QuickSelect</h3>\n<p>QuickSelect is a selection algorithm used to find the Kth smallest/largest element in an unsorted array without sorting it entirely.</p>\n<p>It uses the same partitioning logic as QuickSort. It selects a pivot, partitions the array, and recursively searches only the partition containing the target Kth index. Average runtime: <code>O(N)</code>.</p>",
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
          "questionText": "What is the average time complexity of finding the Kth element using QuickSelect?",
          "options": [
            {
              "text": "O(N log N)",
              "isCode": false
            },
            {
              "text": "O(N)",
              "isCode": false
            },
            {
              "text": "O(N²)",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "QuickSelect only recurses into one partition, reducing average runtime from O(N log N) to linear O(N)."
        }
      ]
    }
  },
  {
    "id": "island-traversal-pattern",
    "title": "Island Traversal (Matrix DFS/BFS)",
    "slug": "island-traversal-pattern",
    "description": "Understand the concept of Island Traversal (Matrix DFS/BFS) for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "visualizations": [],
    "objectives": [
      "Implement Island Traversal (Matrix DFS/BFS) structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>Island Traversal (Matrix DFS/BFS)</h3>\n<p>This pattern is used to traverse 2D grid/matrix structures where cells represent nodes and adjacent connections represent edges.</p>\n<p>It traverses the matrix row-by-row. When it hits a target cell (e.g. land '1'), it triggers DFS/BFS recursion to visit and mark all connected land cells (e.g. setting them to '0' or marking them visited) to count or analyze connected components (islands).</p>",
    "theory": "<h3>Island Traversal (Matrix DFS/BFS)</h3>\n<p>This pattern is used to traverse 2D grid/matrix structures where cells represent nodes and adjacent connections represent edges.</p>\n<p>It traverses the matrix row-by-row. When it hits a target cell (e.g. land '1'), it triggers DFS/BFS recursion to visit and mark all connected land cells (e.g. setting them to '0' or marking them visited) to count or analyze connected components (islands).</p>",
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
          "questionText": "What technique is commonly used to avoid infinite loops during grid traversal?",
          "options": [
            {
              "text": "Heap sorting the grid cells",
              "isCode": false
            },
            {
              "text": "Marking visited cells as you traverse them",
              "isCode": false
            },
            {
              "text": "Linear probing",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Marking cells as visited (or changing their value) prevents traversing them multiple times."
        }
      ]
    }
  },
  {
    "id": "concurrency-interview-patterns",
    "title": "Multi-threaded Concurrency Patterns",
    "slug": "concurrency-interview-patterns",
    "description": "Understand the concept of Multi-threaded Concurrency Patterns for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "visualizations": [],
    "objectives": [
      "Implement Multi-threaded Concurrency Patterns structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>Multi-threaded Concurrency Patterns</h3>\n<p>This pattern is used to design parallel algorithms that run safely and efficiently on multi-core systems.</p>\n<p>It involves coordinating thread pools, futures, latch barriers, and blocking queues. Common problems include the Producer-Consumer pattern, which coordinates threads using wait/notify or blocking queue structures.</p>",
    "theory": "<h3>Multi-threaded Concurrency Patterns</h3>\n<p>This pattern is used to design parallel algorithms that run safely and efficiently on multi-core systems.</p>\n<p>It involves coordinating thread pools, futures, latch barriers, and blocking queues. Common problems include the Producer-Consumer pattern, which coordinates threads using wait/notify or blocking queue structures.</p>",
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
          "questionText": "Which class handles the Producer-Consumer pattern by managing thread safety and blocking operations automatically?",
          "options": [
            {
              "text": "ArrayList",
              "isCode": false
            },
            {
              "text": "BlockingQueue (like ArrayBlockingQueue)",
              "isCode": false
            },
            {
              "text": "HashMap",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "BlockingQueue handles wait/notify synchronization internally, blocking producers when full and consumers when empty."
        }
      ]
    }
  }
]
};