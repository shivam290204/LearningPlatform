export default {
  id: 'module07-arrays',
  title: 'Module 7: Arrays in Java',
  lessons: [
  {
    "id": "java-arrays",
    "title": "Arrays in Java",
    "slug": "java-arrays",
    "description": "Understand array memory representations, multi-dimensional structures, and common indexing manipulations.",
    "difficulty": "Beginner",
    "estTime": "12 min",
    "quizAvailable": true,
    "xpReward": 50,
    "visualizer": "arraylist",
    "visualizations": [],
    "objectives": [
      "Understand array memory declaration and allocations",
      "Explain contiguous blocks in Heap memory",
      "Code multi-dimensional array structures"
    ],
    "content": "<h3>Arrays in Java</h3>\n<p>An **Array** is a homogenous data structure that stores a fixed-size sequential collection of elements of the same type. In Java, arrays are treated as objects and are allocated on the Heap.</p>\n<h4>1. Heap Allocation & Bounds</h4>\n<p>When you declare an array: <code>int[] arr = new int[5];</code>, the JVM allocates a contiguous block of memory on the Heap. The reference variable <code>arr</code> on the Stack holds the starting address of this Heap block.</p>\n<p>Since memory is contiguous, lookups are extremely fast: <code>Address = BaseAddress + (Index * ElementSize)</code>. Java arrays have fixed sizes; attempting to access an index out of bounds throws an <code>ArrayIndexOutOfBoundsException</code>.</p>",
    "theory": "<h3>Arrays in Java</h3>\n<p>An **Array** is a homogenous data structure that stores a fixed-size sequential collection of elements of the same type. In Java, arrays are treated as objects and are allocated on the Heap.</p>\n<h4>1. Heap Allocation & Bounds</h4>\n<p>When you declare an array: <code>int[] arr = new int[5];</code>, the JVM allocates a contiguous block of memory on the Heap. The reference variable <code>arr</code> on the Stack holds the starting address of this Heap block.</p>\n<p>Since memory is contiguous, lookups are extremely fast: <code>Address = BaseAddress + (Index * ElementSize)</code>. Java arrays have fixed sizes; attempting to access an index out of bounds throws an <code>ArrayIndexOutOfBoundsException</code>.</p>",
    "analogy": "<h3>Real-Life Analogy: The Locker Row</h3>\n<p>An array is like a row of identical lockers numbered consecutively from 0 to N-1. If you know the Locker number, you can open it instantly (O(1) access). However, you cannot append a locker to the row without buying a completely new set of lockers and moving all your items.</p>",
    "interviewNotes": "<ul>\n  <li><strong>Q: Are arrays objects in Java?</strong><br/>A: Yes, arrays are objects. You can call methods on them, check their length attribute, and pass them as reference arguments.</li>\n</ul>",
    "commonMistakes": "<p><strong>Array boundary overflow:</strong> Iterating up to index <code>arr.length</code> instead of <code>arr.length - 1</code> in a loop will throw an <code>ArrayIndexOutOfBoundsException</code>.</p>",
    "practiceProblems": [
      {
        "title": "Find Maximum Element",
        "problemText": "Given an array of integers, find the maximum element.",
        "solution": "Initialize max = arr[0] and iterate through the array, updating max if an element is larger."
      }
    ],
    "quiz": {
      "questions": [
        {
          "questionText": "Where are Java arrays allocated in JVM memory?",
          "options": [
            {
              "text": "On the Stack frame of the calling method",
              "isCode": false
            },
            {
              "text": "In the Heap Area",
              "isCode": false
            },
            {
              "text": "In the JVM Constant Pool",
              "isCode": false
            }
          ],
          "correctAnswerIndex": 1,
          "explanation": "In Java, all arrays (whether primitive or object types) are objects and are allocated on the Heap."
        }
      ]
    }
  }
]
};