export default {
  id: 'module10-hashing',
  title: 'Module 10: Hash Tables & Hashing',
  lessons: [
  {
    "id": "hashing-collision",
    "title": "Hash Functions & Collision Resolution",
    "slug": "hashing-collision",
    "description": "Understand the concept of Hash Functions & Collision Resolution for technical coding interviews.",
    "difficulty": "Intermediate",
    "estTime": "20 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "hashmap",
    "visualizations": [],
    "objectives": [
      "Implement Hash Functions & Collision Resolution structure",
      "Explain execution complexity bounds"
    ],
    "content": "<h3>Hash Functions & Collision Resolution</h3>\n<p>A **Hash Table** stores key-value pairs. It computes a key's hashcode to determine its index in an array.</p>\n<p>When different keys yield the same index, a **Collision** occurs. Hash tables resolve collisions using:</p>\n<ul>\n  <li><strong>Separate Chaining:</strong> Each bucket contains a linked list of entries.</li>\n  <li><strong>Open Addressing (Linear Probing):</strong> Searches for the next available slot in the array.</li>\n</ul>",
    "theory": "<h3>Hash Functions & Collision Resolution</h3>\n<p>A **Hash Table** stores key-value pairs. It computes a key's hashcode to determine its index in an array.</p>\n<p>When different keys yield the same index, a **Collision** occurs. Hash tables resolve collisions using:</p>\n<ul>\n  <li><strong>Separate Chaining:</strong> Each bucket contains a linked list of entries.</li>\n  <li><strong>Open Addressing (Linear Probing):</strong> Searches for the next available slot in the array.</li>\n</ul>",
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
          "questionText": "What is Separate Chaining?",
          "options": [
            {
              "text": "Storing elements at subsequent index offsets",
              "isCode": false
            },
            {
              "text": "Maintaining a linked list of entries at each array index bucket",
              "isCode": false
            },
            {
              "text": "Resizing the array by 1.5x",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Separate Chaining stores colliding entries in a linked list at the same bucket index."
        }
      ]
    }
  }
]
};