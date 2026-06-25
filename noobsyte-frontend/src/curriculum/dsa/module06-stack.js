export default {
  id: 'module06-stack',
  title: 'Module 6: Stacks (LIFO)',
  lessons: [
  {
    "id": "stacks-dsa",
    "title": "Stacks (LIFO)",
    "slug": "stacks-dsa",
    "description": "Learn Stack operations, array/list implementations, and expression evaluations (Infix, Postfix).",
    "difficulty": "Beginner",
    "estTime": "15 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "stack",
    "objectives": [
      "Implement Stack using arrays and linked lists",
      "Explain LIFO behavior (Last In, First Out)",
      "Use Stacks to validate parenthetical expressions"
    ],
    "theory": "<h3>Stacks (LIFO)</h3>\n<p>A **Stack** is a linear data structure that follows the **Last-In-First-Out (LIFO)** protocol. The last element added to the stack is the first one to be removed.</p>\n<h4>1. Core Operations</h4>\n<ul>\n  <li><code>push(x)</code>: Adds element x to the top of the stack. O(1).</li>\n  <li><code>pop()</code>: Removes and returns the top element. O(1).</li>\n  <li><code>peek()</code>: Returns the top element without removing it. O(1).</li>\n</ul>\n<h4>2. Common Applications</h4>\n<p>Stacks are critical for matching structures, tracking backtracking checkpoints, managing call stack activation frames in JVM execution, and reversing sequences.</p>",
    "analogy": "<h3>Real-Life Analogy: The Plate Pile</h3>\n<p>Think of a stack of dinner plates in a cafeteria. You can only place a new plate on the very top (push). When a diner takes a plate, they must take the top plate (pop). Attempting to extract a plate from the bottom breaks the stack.</p>",
    "interviewNotes": "<ul>\n  <li><strong>Q: How do you implement a Stack using a Queue?</strong><br/>A: Use two queues, or a single queue by rotating elements on push so the newly inserted element remains at the front.</li>\n</ul>",
    "commonMistakes": "<p><strong>Stack Underflow:</strong> Calling <code>pop()</code> or <code>peek()</code> on an empty stack triggers a crash. Always verify <code>isEmpty()</code> first.</p>",
    "practiceProblems": [
      {
        "title": "Balanced Parentheses",
        "problemText": "Verify if a string containing parentheses is balanced.",
        "solution": "Push opening characters to a stack, and pop to check matches when hitting closing characters. Return stack.isEmpty() at the end."
      }
    ],
    "quiz": {
      "questions": [
        {
          "questionText": "What is the runtime complexity of the push operation on a linked list stack?",
          "options": [
            {
              "text": "O(1)",
              "isCode": false
            },
            {
              "text": "O(N)",
              "isCode": false
            },
            {
              "text": "O(log N)",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 0,
          "explanation": "Inserting an element at the head of a linked list stack takes constant O(1) time."
        }
      ]
    }
  }
]
};