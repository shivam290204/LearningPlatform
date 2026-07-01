export default {
  id: 'module07-queue',
  title: 'Module 7: Queues (FIFO)',
  lessons: [
  {
    "id": "queues-dsa",
    "title": "Queues (FIFO) & Deques",
    "slug": "queues-dsa",
    "description": "Learn Queue operations, circular queues, deques, and dynamic queue applications.",
    "difficulty": "Beginner",
    "estTime": "15 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "queue",
    "visualizations": [],
    "objectives": [
      "Implement Queue using arrays and linked lists",
      "Explain FIFO behavior (First In, First Out)",
      "Construct circular queues and double-ended queues (Deques)"
    ],
    "content": "<h3>Queues (FIFO) & Deques</h3>\n<p>A **Queue** is a linear data structure that follows the **First-In-First-Out (FIFO)** protocol. Elements are inserted at the Rear and removed from the Front.</p>\n<h4>1. Core Operations</h4>\n<ul>\n  <li><code>enqueue(x)</code>: Adds element x to the Rear of the queue. O(1).</li>\n  <li><code>dequeue()</code>: Removes and returns the element at the Front. O(1).</li>\n</ul>\n<h4>2. Double-Ended Queue (Deque)</h4>\n<p>A Deque (pronounced \"deck\") is a generalized queue that supports element insertion and removal at both Front and Rear, running in O(1) time.</p>",
    "theory": "<h3>Queues (FIFO) & Deques</h3>\n<p>A **Queue** is a linear data structure that follows the **First-In-First-Out (FIFO)** protocol. Elements are inserted at the Rear and removed from the Front.</p>\n<h4>1. Core Operations</h4>\n<ul>\n  <li><code>enqueue(x)</code>: Adds element x to the Rear of the queue. O(1).</li>\n  <li><code>dequeue()</code>: Removes and returns the element at the Front. O(1).</li>\n</ul>\n<h4>2. Double-Ended Queue (Deque)</h4>\n<p>A Deque (pronounced \"deck\") is a generalized queue that supports element insertion and removal at both Front and Rear, running in O(1) time.</p>",
    "analogy": "<h3>Real-Life Analogy: The Ticket Line</h3>\n<p>Think of a queue as a line of people waiting to buy movie tickets. The person who arrives first stands at the front and gets their ticket first (FIFO). A new person joins at the back of the line (Rear).</p>",
    "interviewNotes": "<ul>\n  <li><strong>Q: What is a Circular Queue?</strong><br/>A: A queue where the last position connects back to the first, forming a ring to optimize memory reuse.</li>\n</ul>",
    "commonMistakes": "<p><strong>Linear array shifts:</strong> Implementing queue dequeue by shifting all array elements forward takes O(N) time. Always use front/rear index pointers to keep it O(1).</p>",
    "practiceProblems": [
      {
        "title": "Implement Stack using Queues",
        "problemText": "Implement LIFO stack operations using two queues.",
        "solution": "Use two queues, moving elements between them to simulate LIFO popping."
      }
    ],
    "quiz": {
      "questions": [
        {
          "questionText": "Which pointer is updated when a new element is added to a queue?",
          "options": [
            {
              "text": "The Front pointer",
              "isCode": false
            },
            {
              "text": "The Rear pointer",
              "isCode": false
            },
            {
              "text": "Both pointers simultaneously",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Elements are enqueued at the back of the queue, updating the Rear index pointer."
        }
      ]
    }
  }
]
};