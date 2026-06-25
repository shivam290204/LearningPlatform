export default {
  id: 'module05-jvm',
  title: 'Module 5: JVM Internals & Memory Models',
  lessons: [
  {
    "id": "compilation-mechanics",
    "title": "Compilation vs. Interpretation Mechanics",
    "slug": "compilation-mechanics",
    "description": "Deep dive into Compilation vs. Interpretation Mechanics conceptual implementation structures.",
    "difficulty": "Beginner",
    "estTime": "15 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": null,
    "objectives": [
      "Master the core rules of Compilation vs. Interpretation Mechanics",
      "Explain structural mechanisms under the hood"
    ],
    "theory": "<h3>Compilation vs. Interpretation Mechanics</h3>\n<p>Java compiles source code (<code>.java</code>) into bytecode (<code>.class</code>). During execution, the JVM interpreter executes the bytecode instructions.</p>\n<p>The <strong>JIT (Just-In-Time) compiler</strong> enhances this process by compiling heavily utilized bytecode segments directly into cached native machine code at runtime.</p>",
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
          "questionText": "What is the role of the JIT compiler?",
          "options": [
            {
              "text": "Checks compile-time syntax errors",
              "isCode": false
            },
            {
              "text": "Compiles active bytecode blocks to native machine code on-the-fly for optimized speed",
              "isCode": false
            },
            {
              "text": "Garbage collects unreferenced Heap objects",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "JIT optimizes hot-spots in bytecode by compiling them directly to binary machine code dynamically."
        }
      ]
    }
  },
  {
    "id": "jvm-stack-frame",
    "title": "Stack vs. Heap Allocation Models",
    "slug": "jvm-stack-frame",
    "description": "Deep dive into Stack vs. Heap Allocation Models conceptual implementation structures.",
    "difficulty": "Beginner",
    "estTime": "15 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "jvm-memory",
    "objectives": [
      "Master the core rules of Stack vs. Heap Allocation Models",
      "Explain structural mechanisms under the hood"
    ],
    "theory": "<h3>Stack vs. Heap Allocation Models</h3>\n<p>JVM divides runtime memory into two primary areas:</p>\n<ul>\n  <li><strong>Stack:</strong> Stores short-lived local variables, parameters, and active method frames. Managed in LIFO order; garbage collection does not apply here.</li>\n  <li><strong>Heap:</strong> Stores all dynamically allocated objects and arrays. Managed by the garbage collector (GC).</li>\n</ul>",
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
          "questionText": "What memory area holds dynamically allocated instances created via the new keyword?",
          "options": [
            {
              "text": "The thread Stack",
              "isCode": false
            },
            {
              "text": "The shared Heap",
              "isCode": false
            },
            {
              "text": "The code execution registry",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "All object instances in Java reside on the Heap, regardless of which thread allocates them."
        }
      ]
    }
  }
]
};