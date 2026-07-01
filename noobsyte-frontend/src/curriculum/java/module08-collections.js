export default {
  id: 'module08-collections',
  title: 'Module 8: Collections Framework',
  lessons: [
  {
    "id": "java-collections",
    "title": "Java Collections Framework",
    "slug": "java-collections",
    "description": "Deep dive into Java Collections Framework conceptual implementation structures.",
    "difficulty": "Beginner",
    "estTime": "15 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "arraylist",
    "visualizations": [],
    "objectives": [
      "Master the core rules of Java Collections Framework",
      "Explain structural mechanisms under the hood"
    ],
    "content": "<h3>Java Collections Framework</h3>\n<p>The collection framework offers unified data structure implementations:</p>\n<ul>\n  <li><code>ArrayList</code>: Resizes internally by 1.5x when filled.</li>\n  <li><code>LinkedList</code>: Node chains optimized for quick head/tail operations.</li>\n  <li><code>HashMap</code>: Keys mapped to values via hashing. Employs separate chaining and Red-Black tree bucket conversions to handle collisions.</li>\n</ul>",
    "theory": "<h3>Java Collections Framework</h3>\n<p>The collection framework offers unified data structure implementations:</p>\n<ul>\n  <li><code>ArrayList</code>: Resizes internally by 1.5x when filled.</li>\n  <li><code>LinkedList</code>: Node chains optimized for quick head/tail operations.</li>\n  <li><code>HashMap</code>: Keys mapped to values via hashing. Employs separate chaining and Red-Black tree bucket conversions to handle collisions.</li>\n</ul>",
    "analogy": "Think of this as structuring standard execution patterns.",
    "interviewNotes": "Explain core operations and visual workflows.",
    "commonMistakes": "Watch for edge cases and initialization triggers.",
    "practiceProblems": [
      {
        "title": "Code Lab",
        "problemText": "Write a basic demo implementation of the concept.",
        "solution": "// Reference the theory above"
      }
    ],
    "quiz": {
      "questions": [
        {
          "questionText": "What hashing collision solution does Java HashMap utilize inside buckets?",
          "options": [
            {
              "text": "Open Addressing with linear probing",
              "isCode": false
            },
            {
              "text": "Separate Chaining with Linked Lists and Red-Black trees",
              "isCode": false
            },
            {
              "text": "Rehashing arrays",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "HashMap resolves conflicts using separate chaining, converting buckets to Red-Black trees when bucket items exceed 8."
        }
      ]
    }
  }
]
};