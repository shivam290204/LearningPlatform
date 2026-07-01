export default {
  id: 'module12-multithreading',
  title: 'Module 12: Multithreading & Concurrency',
  lessons: [
  {
    "id": "threads-runnable",
    "title": "Threads, Runnables & Concurrency Patterns",
    "slug": "threads-runnable",
    "description": "Deep dive into Threads, Runnables & Concurrency Patterns conceptual implementation structures.",
    "difficulty": "Advanced",
    "estTime": "15 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "visualizations": [],
    "objectives": [
      "Master the core rules of Threads, Runnables & Concurrency Patterns",
      "Explain structural mechanisms under the hood"
    ],
    "content": "<h3>Threads, Runnables & Concurrency Patterns</h3>\n<p>A Thread is an independent path of execution. Concurrency is achieved by sharing CPU attention cycles across active thread stacks.</p>\n<p>To avoid **Race Conditions** (threads reading/writing concurrently to shared data), critical segments must be locked using <code>synchronized</code> or the lock API.</p>",
    "theory": "<h3>Threads, Runnables & Concurrency Patterns</h3>\n<p>A Thread is an independent path of execution. Concurrency is achieved by sharing CPU attention cycles across active thread stacks.</p>\n<p>To avoid **Race Conditions** (threads reading/writing concurrently to shared data), critical segments must be locked using <code>synchronized</code> or the lock API.</p>",
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
          "questionText": "What term describes two or more threads accessing the same shared variable concurrently resulting in unpredictable outputs?",
          "options": [
            {
              "text": "Deadlock state",
              "isCode": false
            },
            {
              "text": "Race Condition",
              "isCode": false
            },
            {
              "text": "Thread depletion",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Race conditions happen when concurrent operations on shared states are not synchronized."
        }
      ]
    }
  }
]
};