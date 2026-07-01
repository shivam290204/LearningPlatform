export default {
  id: 'module13-heaps',
  title: 'Module 13: Heaps & Priority Queues',
  lessons: [
  {
    "id": "heaps-priority-queues",
    "title": "Heaps & Priority Queues",
    "slug": "heaps-priority-queues",
    "description": "Understand the concept of Heaps & Priority Queues for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "heap-dsa",
    "visualizations": [],
    "objectives": [
      "Implement Heaps & Priority Queues structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>Heaps & Priority Queues</h3>\n<p>A **Heap** is a complete binary tree where the parent node has a higher priority than its children:</p>\n<ul>\n  <li><strong>Max Heap:</strong> Parent is larger than or equal to its children.</li>\n  <li><strong>Min Heap:</strong> Parent is smaller than or equal to its children.</li>\n</ul>\n<p>Heaps are commonly implemented using arrays to support O(1) access to the minimum/maximum element and O(log N) updates.</p>",
    "theory": "<h3>Heaps & Priority Queues</h3>\n<p>A **Heap** is a complete binary tree where the parent node has a higher priority than its children:</p>\n<ul>\n  <li><strong>Max Heap:</strong> Parent is larger than or equal to its children.</li>\n  <li><strong>Min Heap:</strong> Parent is smaller than or equal to its children.</li>\n</ul>\n<p>Heaps are commonly implemented using arrays to support O(1) access to the minimum/maximum element and O(log N) updates.</p>",
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
          "questionText": "What is the time complexity of extracting the root element from a Binary Heap containing N elements?",
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
          "correctAnswerIndex": 1,
          "explanation": "Removing the root requires swapping the last element to the top and heapifying down, which takes O(log N) time."
        }
      ]
    }
  }
]
};