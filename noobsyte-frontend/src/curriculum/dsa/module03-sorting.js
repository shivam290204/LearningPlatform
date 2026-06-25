export default {
  id: 'module03-sorting',
  title: 'Module 3: Sorting Algorithms',
  lessons: [
  {
    "id": "quadratic-sorts",
    "title": "Quadratic Sorts (Bubble, Selection, Insertion)",
    "slug": "quadratic-sorts",
    "description": "Understand the concept of Quadratic Sorts (Bubble, Selection, Insertion) for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "quick-sort",
    "objectives": [
      "Implement Quadratic Sorts (Bubble, Selection, Insertion) structure",
      "Explain execution complexity bounds"
    ],
    "theory": "<h3>Quadratic Sorts (Bubble, Selection, Insertion)</h3>\n<p>Basic sorting algorithms run in <code>O(N²)</code> time and are space-efficient (run in-place):</p>\n<ul>\n  <li><strong>Bubble Sort:</strong> Swaps adjacent elements if out of order.</li>\n  <li><strong>Selection Sort:</strong> Selects the minimum item from the unsorted subarray and swaps it to the front.</li>\n  <li><strong>Insertion Sort:</strong> Inserts elements into their correct position in a sorted subarray.</li>\n</ul>",
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
          "questionText": "Which sorting algorithm selects the minimum element from the unsorted part and swaps it to the front on each step?",
          "options": [
            {
              "text": "Bubble Sort",
              "isCode": false
            },
            {
              "text": "Selection Sort",
              "isCode": false
            },
            {
              "text": "Insertion Sort",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Selection Sort works by repeatedly finding the minimum element and swapping it into place."
        }
      ]
    }
  },
  {
    "id": "divide-and-conquer-sorts",
    "title": "Divide-and-Conquer Sorts (Merge, Quick)",
    "slug": "divide-and-conquer-sorts",
    "description": "Understand the concept of Divide-and-Conquer Sorts (Merge, Quick) for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "merge-sort",
    "objectives": [
      "Implement Divide-and-Conquer Sorts (Merge, Quick) structure",
      "Explain execution complexity bounds"
    ],
    "theory": "<h3>Divide-and-Conquer Sorts (Merge, Quick)</h3>\n<p>Efficient algorithms split arrays into smaller subarrays:</p>\n<ul>\n  <li><strong>Merge Sort:</strong> Halves arrays, recursively sorts them, and merges them. Runs in <code>O(N log N)</code> time, requiring <code>O(N)</code> space.</li>\n  <li><strong>Quick Sort:</strong> Selects a pivot and partitions elements around it. Average runtime is <code>O(N log N)</code>, worst-case is <code>O(N²)</code>.</li>\n</ul>",
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
          "questionText": "What is the space complexity of Merge Sort?",
          "options": [
            {
              "text": "O(1) in-place",
              "isCode": false
            },
            {
              "text": "O(N) for merge helper array allocations",
              "isCode": false
            },
            {
              "text": "O(N log N)",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Merge Sort allocates a helper array of size N to merge sorted subarrays, requiring O(N) space."
        }
      ]
    }
  },
  {
    "id": "heap-sort-dsa",
    "title": "Heap Sort",
    "slug": "heap-sort-dsa",
    "description": "Understand the concept of Heap Sort for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "heap-dsa",
    "objectives": [
      "Implement Heap Sort structure",
      "Explain execution complexity bounds"
    ],
    "theory": "<h3>Heap Sort</h3>\n<p><strong>Heap Sort</strong> uses a binary heap to sort elements in-place in <code>O(N log N)</code> worst-case time.</p>\n<p>It inserts elements into a Max Heap, then repeatedly extracts the maximum element, swapping it with the last element of the array and restoring the heap property (heapifying).</p>",
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
          "questionText": "What is the time complexity of Heap Sort?",
          "options": [
            {
              "text": "O(N log N) in all cases",
              "isCode": false
            },
            {
              "text": "O(N²) worst-case",
              "isCode": false
            },
            {
              "text": "O(N) best-case",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 0,
          "explanation": "Heap Sort guarantees O(N log N) runtime in best, average, and worst-case scenarios, running in-place."
        }
      ]
    }
  }
]
};