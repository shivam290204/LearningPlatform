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
    "visualizations": [],
    "objectives": [
      "Master the core rules of Compilation vs. Interpretation Mechanics",
      "Explain structural mechanisms under the hood"
    ],
    "content": "<h3>Compilation vs. Interpretation Mechanics</h3>\n<p>Java compiles source code (<code>.java</code>) into bytecode (<code>.class</code>). During execution, the JVM interpreter executes the bytecode instructions.</p>\n<p>The <strong>JIT (Just-In-Time) compiler</strong> enhances this process by compiling heavily utilized bytecode segments directly into cached native machine code at runtime.</p>",
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
    "id": "declaring-references",
    "title": "Declaring References & Allocating Objects",
    "slug": "declaring-references",
    "description": "Master Declaring References & Allocating Objects conceptual implementation and quiz review.",
    "difficulty": "Beginner",
    "estTime": "15 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "jvm-memory",
    "visualizations": [
      {
        "step": 1,
        "label": "User user1; -> We declare the reference variable user1 inside the Stack frame. Because it is unallocated, it initially holds a null reference address.",
        "memorySnapshot": {
          "stack": [
            {
              "variable": "user1",
              "value": "null"
            }
          ],
          "heap": []
        }
      },
      {
        "step": 2,
        "label": "user1 = new User(); -> The 'new' keyword creates a brand new User object on the Heap, assigning it address 0x4482. The pointer 0x4482 is stored inside user1 variable in the Stack frame.",
        "memorySnapshot": {
          "stack": [
            {
              "variable": "user1",
              "value": "0x4482"
            }
          ],
          "heap": [
            {
              "address": "0x4482",
              "objectType": "User",
              "fields": {
                "name": "Unassigned"
              }
            }
          ]
        }
      },
      {
        "step": 3,
        "label": "user1.name = 'Arjun'; -> We access the fields inside the Heap object referenced by 0x4482 through remote control user1, modifying its name field to 'Arjun'.",
        "memorySnapshot": {
          "stack": [
            {
              "variable": "user1",
              "value": "0x4482"
            }
          ],
          "heap": [
            {
              "address": "0x4482",
              "objectType": "User",
              "fields": {
                "name": "Arjun"
              }
            }
          ]
        }
      }
    ],
    "objectives": [
      "Understand Declaring References & Allocating Objects fundamentals",
      "Explain structural complexity and dry-run boundaries"
    ],
    "content": "\n            <h3>Welcome to Java Memory References!</h3>\n            <p>In Java, variables never contain objects directly. Instead, reference variables hold <strong>memory addresses (pointers)</strong> pointing to where the actual objects reside inside the shared <strong>JVM Heap space</strong>.</p>\n            <p>Think of reference variables as remote controls and objects as televisions. The remote control is not the television; it is just a handle that points to the television from a distance!</p>\n            <div className=\"code-block-banner\">\n              <pre><code>// Line 1: Declare reference\nUser user1;\n\n// Line 2: Allocate object\nuser1 = new User();\n\n// Line 3: Modify attribute\nuser1.name = \"Arjun\";</code></pre>\n            </div>\n          ",
    "theory": "\n            <h3>Welcome to Java Memory References!</h3>\n            <p>In Java, variables never contain objects directly. Instead, reference variables hold <strong>memory addresses (pointers)</strong> pointing to where the actual objects reside inside the shared <strong>JVM Heap space</strong>.</p>\n            <p>Think of reference variables as remote controls and objects as televisions. The remote control is not the television; it is just a handle that points to the television from a distance!</p>\n            <div className=\"code-block-banner\">\n              <pre><code>// Line 1: Declare reference\nUser user1;\n\n// Line 2: Allocate object\nuser1 = new User();\n\n// Line 3: Modify attribute\nuser1.name = \"Arjun\";</code></pre>\n            </div>\n          ",
    "analogy": "",
    "interviewNotes": "",
    "commonMistakes": "",
    "practiceProblems": [],
    "quiz": {
      "questions": [
        {
          "questionText": "What does a Java reference variable hold directly inside its Stack memory allocation slot?",
          "options": [
            {
              "text": "The complete object values and attributes",
              "isCode": false
            },
            {
              "text": "A remote control reference address pointing to the object in Heap",
              "isCode": false
            },
            {
              "text": "A static compiler check metadata",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "Bingo! A Java reference variable acts as a remote control. It doesn't contain the object itself; it holds the exact pointer address pointing to where the object resides in Heap memory."
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
    "visualizations": [
      {
        "step": 1,
        "label": "User user1; -> We declare the reference variable user1 inside the Stack frame. Because it is unallocated, it initially holds a null reference address.",
        "memorySnapshot": {
          "stack": [
            {
              "variable": "user1",
              "value": "null"
            }
          ],
          "heap": []
        }
      },
      {
        "step": 2,
        "label": "user1 = new User(); -> The 'new' keyword creates a brand new User object on the Heap, assigning it address 0x4482. The pointer 0x4482 is stored inside user1 variable in the Stack frame.",
        "memorySnapshot": {
          "stack": [
            {
              "variable": "user1",
              "value": "0x4482"
            }
          ],
          "heap": [
            {
              "address": "0x4482",
              "objectType": "User",
              "fields": {
                "name": "Unassigned"
              }
            }
          ]
        }
      },
      {
        "step": 3,
        "label": "user1.name = 'Arjun'; -> We access the fields inside the Heap object referenced by 0x4482 through remote control user1, modifying its name field to 'Arjun'.",
        "memorySnapshot": {
          "stack": [
            {
              "variable": "user1",
              "value": "0x4482"
            }
          ],
          "heap": [
            {
              "address": "0x4482",
              "objectType": "User",
              "fields": {
                "name": "Arjun"
              }
            }
          ]
        }
      }
    ],
    "objectives": [
      "Master the core rules of Stack vs. Heap Allocation Models",
      "Explain structural mechanisms under the hood"
    ],
    "content": "<h3>Stack vs. Heap Allocation Models</h3>\n<p>JVM divides runtime memory into two primary areas:</p>\n<ul>\n  <li><strong>Stack:</strong> Stores short-lived local variables, parameters, and active method frames. Managed in LIFO order; garbage collection does not apply here.</li>\n  <li><strong>Heap:</strong> Stores all dynamically allocated objects and arrays. Managed by the garbage collector (GC).</li>\n</ul>",
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