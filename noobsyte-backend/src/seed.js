require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');
const Module = require('./models/Module');
const Lesson = require('./models/Lesson');
const Quiz = require('./models/Quiz');

const coursesData = [
  {
    title: 'Mastering Java: From Zero to Hero',
    slug: 'java-masterclass-core-to-advanced',
    description: 'Master variables, stack & heap models, parameters passing, object oriented architecture, multithreading, and database integrations without dry textbook jargon.',
    difficulty: 'beginner',
    isPublished: true,
    modules: [
      {
        title: 'Module 1: Java Syntax & Control Flow',
        order: 1,
        isPublished: true,
        lessons: [
          {
            title: 'Language Syntax & Variables',
            slug: 'java-syntax',
            order: 1,
            content: `<h3>Java Language Syntax & Variables</h3>
<p>Java is a strongly typed, class-based language. Every line of executable code must exist inside a class definition.</p>
<p>Variables serve as storage containers holding data during execution. Java classifies data types into:</p>
<ul>
  <li><strong>Primitives:</strong> Store raw values directly in Stack memory (e.g. <code>int</code>, <code>double</code>, <code>boolean</code>, <code>char</code>).</li>
  <li><strong>References:</strong> Store 4-byte or 8-byte memory addresses pointing to objects on the Heap.</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'Where are primitive variables stored in JVM memory when declared inside a method?',
                options: [
                  { text: 'In the Heap space', isCode: false },
                  { text: 'Within the Stack Frame of the active thread', isCode: false },
                  { text: 'In the Method Area', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Local primitive variables are allocated directly within the thread\'s Stack Frame for fast retrieval.'
              }]
            }
          },
          {
            title: 'Control Structures & Conditionals',
            slug: 'control-structures',
            order: 2,
            content: `<h3>Control Structures & Conditionals</h3>
<p>Control flow statement execution is managed using conditional checks and loops:</p>
<ul>
  <li><code>if-else</code> blocks evaluate Boolean expressions to fork paths.</li>
  <li><code>switch</code> statements match values (primitives, Enums, Strings) to labeled code blocks.</li>
  <li>Loops (<code>for</code>, <code>while</code>, <code>do-while</code>) repeat logic paths until their condition evaluates to false.</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'Which conditional check is optimal for matching a single variable against multiple exact constant values?',
                options: [
                  { text: 'Nested if-else statements', isCode: false },
                  { text: 'switch-case blocks', isCode: false },
                  { text: 'for loops', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'The switch-case block is optimized for testing a single variable against multiple discrete, constant cases.'
              }]
            }
          }
        ]
      },
      {
        title: 'Module 2: Problem Solving & Execution',
        order: 2,
        isPublished: true,
        lessons: [
          {
            title: 'Pseudo Code & Logic Building',
            slug: 'pseudo-code',
            order: 1,
            content: `<h3>Pseudo Code & Logic Building</h3>
<p>Before writing code, developers model algorithms using <strong>Pseudo Code</strong>—an informal, language-agnostic way to write programs. It helps focus on logical steps rather than syntactical rules.</p>
<pre><code>// Example Pseudo Code for Binary Search
Function BinarySearch(Array, Target):
    Set low = 0
    Set high = Array.length - 1
    While low <= high:
        mid = low + (high - low) / 2
        If Array[mid] == Target: Return mid
        Else If Array[mid] < Target: low = mid + 1
        Else: high = mid - 1
    Return -1</code></pre>`,
            quiz: {
              questions: [{
                questionText: 'What is the primary objective of writing pseudo code?',
                options: [
                  { text: 'To check compile-time syntax errors', isCode: false },
                  { text: 'To lay out the pure step-by-step logic of an algorithm before syntax coding', isCode: false },
                  { text: 'To allocate Stack frames in advance', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Pseudo code focuses entirely on structuring the logical steps of an algorithm, abstracting away specific syntax limitations.'
              }]
            }
          },
          {
            title: 'Functions & Method Execution',
            slug: 'java-functions',
            order: 2,
            content: `<h3>Functions & Method Execution</h3>
<p>In Java, functions are called **Methods** and must belong to a class. They encapsulate reusable blocks of statements.</p>
<p>Each time a method is called, a new Stack Frame is created containing its parameters and local variables. Java is strictly **pass-by-value**, meaning it passes copies of primitive values or copied object reference pointers.</p>`,
            quiz: {
              questions: [{
                questionText: 'What parameter passing strategy does Java utilize?',
                options: [
                  { text: 'Pass-by-reference', isCode: false },
                  { text: 'Pass-by-value', isCode: false },
                  { text: 'Dynamic binding scope', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Java is strictly pass-by-value. For objects, the value passed is a copy of the memory address reference pointer.'
              }]
            }
          }
        ]
      },
      {
        title: 'Module 3: Object-Oriented Programming (OOP) Foundations',
        order: 3,
        isPublished: true,
        lessons: [
          {
            title: 'OOP Basics (Classes, Objects, Constructors)',
            slug: 'oop-basics',
            order: 1,
            content: `<h3>OOP Basics: Blueprints & Instances</h3>
<p>Object-Oriented Programming models systems using classes and objects:</p>
<ul>
  <li><strong>Class:</strong> The blueprint defining variables and methods.</li>
  <li><strong>Object:</strong> A concrete instance of the class allocated in Heap memory.</li>
  <li><strong>Constructor:</strong> A special method called with the <code>new</code> keyword to initialize new object states.</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'Where are instance variables allocated in JVM memory?',
                options: [
                  { text: 'Directly in the Stack Frame', isCode: false },
                  { text: 'On the shared Heap as part of the allocated object structure', isCode: false },
                  { text: 'Inside the compilation class cache', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Instance variables reside on the Heap, packed inside the memory slot of the object they belong to.'
              }]
            }
          }
        ]
      },
      {
        title: 'Module 4: JVM Internals & Memory Models',
        order: 4,
        isPublished: true,
        lessons: [
          {
            title: 'Compilation vs. Interpretation Mechanics',
            slug: 'compilation-mechanics',
            order: 1,
            content: `<h3>Compilation vs. Interpretation Mechanics</h3>
<p>Java compiles source code (<code>.java</code>) into bytecode (<code>.class</code>). During execution, the JVM interpreter executes the bytecode instructions.</p>
<p>The <strong>JIT (Just-In-Time) compiler</strong> enhances this process by compiling heavily utilized bytecode segments directly into cached native machine code at runtime.</p>`,
            quiz: {
              questions: [{
                questionText: 'What is the role of the JIT compiler?',
                options: [
                  { text: 'Checks compile-time syntax errors', isCode: false },
                  { text: 'Compiles active bytecode blocks to native machine code on-the-fly for optimized speed', isCode: false },
                  { text: 'Garbage collects unreferenced Heap objects', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'JIT optimizes hot-spots in bytecode by compiling them directly to binary machine code dynamically.'
              }]
            }
          },
          {
            title: 'Stack vs. Heap Allocation Models',
            slug: 'jvm-stack-frame',
            order: 2,
            content: `<h3>Stack vs. Heap Allocation Models</h3>
<p>JVM divides runtime memory into two primary areas:</p>
<ul>
  <li><strong>Stack:</strong> Stores short-lived local variables, parameters, and active method frames. Managed in LIFO order; garbage collection does not apply here.</li>
  <li><strong>Heap:</strong> Stores all dynamically allocated objects and arrays. Managed by the garbage collector (GC).</li>
</ul>`,
            visualizations: [
              {
                step: 1,
                label: 'User user1; -> We declare the reference variable user1 inside the Stack frame. Because it is unallocated, it initially holds a null reference address.',
                memorySnapshot: {
                  stack: [{ variable: 'user1', value: 'null' }],
                  heap: []
                }
              },
              {
                step: 2,
                label: "user1 = new User(); -> The 'new' keyword creates a brand new User object on the Heap, assigning it address 0x4482. The pointer 0x4482 is stored inside user1 variable in the Stack frame.",
                memorySnapshot: {
                  stack: [{ variable: 'user1', value: '0x4482' }],
                  heap: [{ address: '0x4482', objectType: 'User', fields: { name: 'Unassigned' } }]
                }
              },
              {
                step: 3,
                label: "user1.name = 'Arjun'; -> We access the fields inside the Heap object referenced by 0x4482 through remote control user1, modifying its name field to 'Arjun'.",
                memorySnapshot: {
                  stack: [{ variable: 'user1', value: '0x4482' }],
                  heap: [{ address: '0x4482', objectType: 'User', fields: { name: 'Arjun' } }]
                }
              }
            ],
            quiz: {
              questions: [{
                questionText: 'What memory area holds dynamically allocated instances created via the new keyword?',
                options: [
                  { text: 'The thread Stack', isCode: false },
                  { text: 'The shared Heap', isCode: false },
                  { text: 'The code execution registry', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'All object instances in Java reside on the Heap, regardless of which thread allocates them.'
              }]
            }
          }
        ]
      },
      {
        title: 'Module 5: Exception Handling & Resource Safety',
        order: 5,
        isPublished: true,
        lessons: [
          {
            title: 'Checked vs. Unchecked Exception Hierarchy',
            slug: 'exceptions-hierarchy',
            order: 1,
            content: `<h3>Checked vs. Unchecked Exception Hierarchy</h3>
<p>Exceptions interrupt normal program execution flow. All exceptions inherit from <code>Throwable</code>:</p>
<ul>
  <li><strong>Checked:</strong> Compiler verifies handling (e.g. <code>IOException</code>). Forced compile checks.</li>
  <li><strong>Unchecked (Runtime):</strong> Coding bugs (e.g. <code>NullPointerException</code>, <code>ArithmeticException</code>). Not validated at compile-time.</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'Which is a checked exception that must be handled or declared in the signature?',
                options: [
                  { text: 'NullPointerException', isCode: false },
                  { text: 'IOException', isCode: false },
                  { text: 'ArrayIndexOutOfBoundsException', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'IOException is checked, meaning the compiler forces try-catch blocks or throws clauses.'
              }]
            }
          }
        ]
      },
      {
        title: 'Module 6: Collections Framework',
        order: 6,
        isPublished: true,
        lessons: [
          {
            title: 'Java Collections Framework',
            slug: 'java-collections',
            order: 1,
            content: `<h3>Java Collections Framework</h3>
<p>The collection framework offers unified data structure implementations:</p>
<ul>
  <li><code>ArrayList</code>: Resizes internally by 1.5x when filled.</li>
  <li><code>LinkedList</code>: Node chains optimized for quick head/tail operations.</li>
  <li><code>HashMap</code>: Keys mapped to values via hashing. Employs separate chaining and Red-Black tree bucket conversions to handle collisions.</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'What hashing collision solution does Java HashMap utilize inside buckets?',
                options: [
                  { text: 'Open Addressing with linear probing', isCode: false },
                  { text: 'Separate Chaining with Linked Lists and Red-Black trees', isCode: false },
                  { text: 'Rehashing arrays', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'HashMap resolves conflicts using separate chaining, converting buckets to Red-Black trees when bucket items exceed 8.'
              }]
            }
          }
        ]
      },
      {
        title: 'Module 7: Multithreading & Concurrency',
        order: 7,
        isPublished: true,
        lessons: [
          {
            title: 'Threads, Runnables & Concurrency Patterns',
            slug: 'threads-runnable',
            order: 1,
            content: `<h3>Threads, Runnables & Concurrency Patterns</h3>
<p>A Thread is an independent path of execution. Concurrency is achieved by sharing CPU attention cycles across active thread stacks.</p>
<p>To avoid **Race Conditions** (threads reading/writing concurrently to shared data), critical segments must be locked using <code>synchronized</code> or the lock API.</p>`,
            quiz: {
              questions: [{
                questionText: 'What term describes two or more threads accessing the same shared variable concurrently resulting in unpredictable outputs?',
                options: [
                  { text: 'Deadlock state', isCode: false },
                  { text: 'Race Condition', isCode: false },
                  { text: 'Thread depletion', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Race conditions happen when concurrent operations on shared states are not synchronized.'
              }]
            }
          }
        ]
      }
    ]
  },
  {
    title: 'Java DSA: Master Data Structures & Algorithms',
    slug: 'java-dsa-masterclass',
    description: 'Master Big-O analysis, sorting algorithms, recursion, linked lists, stacks, queues, trees, heaps, graphs, and dynamic programming in Java.',
    difficulty: 'intermediate',
    isPublished: true,
    modules: [
      {
        title: 'Module 8: Introduction to Data Structures',
        order: 8,
        isPublished: true,
        lessons: [
          {
            title: 'What are Data Structures?',
            slug: 'what-are-data-structures',
            order: 1,
            content: `<h3>What are Data Structures?</h3>
<p>A **Data Structure** is a systematic way of organizing, managing, and storing data in computer memory so that operations (search, insert, delete) can be performed efficiently.</p>
<p>Data structures are divided into:</p>
<ul>
  <li><strong>Linear:</strong> Elements arranged sequentially (Arrays, Linked Lists, Stacks, Queues).</li>
  <li><strong>Non-Linear:</strong> Hierarchical or mesh arrangements (Trees, Graphs).</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'Which of the following is a non-linear data structure?',
                options: [
                  { text: 'Stack', isCode: false },
                  { text: 'Binary Tree', isCode: false },
                  { text: 'Queue', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Binary Trees are non-linear data structures because elements are arranged hierarchically, not sequentially.'
              }]
            }
          },
          {
            title: 'Why are Data Structures Important?',
            slug: 'why-data-structures-important',
            order: 2,
            content: `<h3>Why are Data Structures Important?</h3>
<p>As applications handle massive datasets, choosing the right data structure directly determines program responsiveness. Organized storage profiles reduce CPU processing times and memory footprint.</p>
<p>For example, searching a telephone index takes <code>O(N)</code> with a sequential list, but halves recursively to <code>O(log N)</code> using a sorted array and Binary Search.</p>`,
            quiz: {
              questions: [{
                questionText: 'Why is matching a problem to the correct data structure critical?',
                options: [
                  { text: 'To minimize time and space complexity during operations', isCode: false },
                  { text: 'To ensure the code compiles without exceptions', isCode: false },
                  { text: 'To convert primitive types to references', isCode: false }
                ],
                correctAnswerIndex: 0,
                explanation: 'Using the optimal data structure directly reduces operational complexities, speeding up executions and preserving memory.'
              }]
            }
          }
        ]
      },
      {
        title: 'Module 9: Algorithmic Complexity & Analysis',
        order: 9,
        isPublished: true,
        lessons: [
          {
            title: 'Time vs. Space Complexity & Calculations',
            slug: 'complexity-calculations',
            order: 1,
            content: `<h3>Time vs. Space Complexity & Calculations</h3>
<p>Algorithmic efficiency is measured using complexity parameters:</p>
<ul>
  <li><strong>Time Complexity:</strong> The number of operations executed as input size <code>N</code> scales.</li>
  <li><strong>Space Complexity:</strong> The helper memory allocated during execution.</li>
</ul>
<p>We calculate complexity by counting basic CPU operations and nested iterations, focusing on inputs scaling toward infinity.</p>`,
            quiz: {
              questions: [{
                questionText: 'What does space complexity evaluate?',
                options: [
                  { text: 'The physical size of the source file', isCode: false },
                  { text: 'The helper memory allocated by the algorithm as input sizes grow', isCode: false },
                  { text: 'The total JVM heap limit', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Space complexity measures the temporary memory required by the algorithm in excess of the inputs.'
              }]
            }
          },
          {
            title: 'Asymptotic Notation (Big-O, Big-θ, Big-Ω)',
            slug: 'asymptotic-notations',
            order: 2,
            content: `<h3>Asymptotic Notation (Big-O, Big-θ, Big-Ω)</h3>
<p>We describe scaling using mathematical envelopes:</p>
<ul>
  <li><strong>Big-O (O):</strong> Upper bound (Worst-case limit).</li>
  <li><strong>Big-Omega (Ω):</strong> Lower bound (Best-case floor).</li>
  <li><strong>Big-Theta (θ):</strong> Tight bound (Average/Exact scaling profile).</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'Which notation represents the tight, exact bound of an algorithm\'s complexity?',
                options: [
                  { text: 'Big-O Notation', isCode: false },
                  { text: 'Big-Theta Notation (θ)', isCode: false },
                  { text: 'Big-Omega Notation (Ω)', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Big-Theta represents a tight bound, meaning the algorithm is bounded above and below by the same growth rate.'
              }]
            }
          },
          {
            title: 'Common Runtimes Analysis',
            slug: 'common-runtimes',
            order: 3,
            content: `<h3>Common Runtimes Analysis</h3>
<p>Understand the standard complexity hierarchies in ascending order of growth:</p>
<ul>
  <li><code>O(1)</code>: Constant Time (Array index reads)</li>
  <li><code>O(log N)</code>: Logarithmic Time (Binary Search)</li>
  <li><code>O(N)</code>: Linear Time (Single loop)</li>
  <li><code>O(N log N)</code>: Linearithmic Time (Merge Sort)</li>
  <li><code>O(N²)</code>: Quadratic Time (Double nested loop)</li>
  <li><code>O(2^N)</code>: Exponential Time (Recursive Fibonacci)</li>
  <li><code>O(N!)</code>: Factorial Time (Traveling Salesperson)</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'Which growth rate scales fastest (is least efficient) as N becomes large?',
                options: [
                  { text: 'O(N log N)', isCode: false },
                  { text: 'O(N²)', isCode: false },
                  { text: 'O(2^N)', isCode: false }
                ],
                correctAnswerIndex: 2,
                explanation: 'Exponential runtime O(2^N) grows extremely fast, making algorithms unusable for larger inputs.'
              }]
            }
          }
        ]
      },
      {
        title: 'Module 10: Search Algorithms',
        order: 10,
        isPublished: true,
        lessons: [
          {
            title: 'Linear Search vs. Binary Search',
            slug: 'linear-binary-search',
            order: 1,
            content: `<h3>Linear Search vs. Binary Search</h3>
<p>Searching involves finding a value within a collection:</p>
<ul>
  <li><strong>Linear Search:</strong> Iterates from index 0 to N-1. Operates on unsorted lists in <code>O(N)</code> time.</li>
  <li><strong>Binary Search:</strong> Halves the search space recursively. Requires sorted inputs, achieving log scales: <code>O(log N)</code>.</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'What prerequisite must be satisfied to perform Binary Search on an array?',
                options: [
                  { text: 'The array must be unsorted', isCode: false },
                  { text: 'The array must be sorted in ascending or descending order', isCode: false },
                  { text: 'The array must not contain duplicate keys', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Binary Search depends on order sorting to determine whether to search the left or right half.'
              }]
            }
          }
        ]
      },
      {
        title: 'Module 11: Sorting Algorithms',
        order: 11,
        isPublished: true,
        lessons: [
          {
            title: 'Quadratic Sorts (Bubble, Selection, Insertion)',
            slug: 'quadratic-sorts',
            order: 1,
            content: `<h3>Quadratic Sorts (Bubble, Selection, Insertion)</h3>
<p>Basic sorting algorithms run in <code>O(N²)</code> time and are space-efficient (run in-place):</p>
<ul>
  <li><strong>Bubble Sort:</strong> Swaps adjacent elements if out of order.</li>
  <li><strong>Selection Sort:</strong> Selects the minimum item from the unsorted subarray and swaps it to the front.</li>
  <li><strong>Insertion Sort:</strong> Inserts elements into their correct position in a sorted subarray.</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'Which sorting algorithm selects the minimum element from the unsorted part and swaps it to the front on each step?',
                options: [
                  { text: 'Bubble Sort', isCode: false },
                  { text: 'Selection Sort', isCode: false },
                  { text: 'Insertion Sort', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Selection Sort works by repeatedly finding the minimum element and swapping it into place.'
              }]
            }
          },
          {
            title: 'Divide-and-Conquer Sorts (Merge, Quick)',
            slug: 'divide-and-conquer-sorts',
            order: 2,
            content: `<h3>Divide-and-Conquer Sorts (Merge, Quick)</h3>
<p>Efficient algorithms split arrays into smaller subarrays:</p>
<ul>
  <li><strong>Merge Sort:</strong> Halves arrays, recursively sorts them, and merges them. Runs in <code>O(N log N)</code> time, requiring <code>O(N)</code> space.</li>
  <li><strong>Quick Sort:</strong> Selects a pivot and partitions elements around it. Average runtime is <code>O(N log N)</code>, worst-case is <code>O(N²)</code>.</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'What is the space complexity of Merge Sort?',
                options: [
                  { text: 'O(1) in-place', isCode: false },
                  { text: 'O(N) for merge helper array allocations', isCode: false },
                  { text: 'O(N log N)', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Merge Sort allocates a helper array of size N to merge sorted subarrays, requiring O(N) space.'
              }]
            }
          },
          {
            title: 'Heap Sort',
            slug: 'heap-sort-dsa',
            order: 3,
            content: `<h3>Heap Sort</h3>
<p><strong>Heap Sort</strong> uses a binary heap to sort elements in-place in <code>O(N log N)</code> worst-case time.</p>
<p>It inserts elements into a Max Heap, then repeatedly extracts the maximum element, swapping it with the last element of the array and restoring the heap property (heapifying).</p>`,
            quiz: {
              questions: [{
                questionText: 'What is the time complexity of Heap Sort?',
                options: [
                  { text: 'O(N log N) in all cases', isCode: false },
                  { text: 'O(N²) worst-case', isCode: false },
                  { text: 'O(N) best-case', isCode: false }
                ],
                correctAnswerIndex: 0,
                explanation: 'Heap Sort guarantees O(N log N) runtime in best, average, and worst-case scenarios, running in-place.'
              }]
            }
          }
        ]
      },
      {
        title: 'Module 12: Basic Linear Data Structures',
        order: 12,
        isPublished: true,
        lessons: [
          {
            title: 'Arrays & Memory Mappings',
            slug: 'array-memory-mapping',
            order: 1,
            content: `<h3>Arrays & Memory Mappings</h3>
<p>An **Array** is a contiguous block of memory holding elements of the same type. Accessing an element takes constant time <code>O(1)</code> using an index offset calculation:</p>
<pre><code>Address = BaseAddress + Index * ElementSize</code></pre>
<p>Insertions and deletions require shifting elements, yielding <code>O(N)</code> time complexity.</p>`,
            quiz: {
              questions: [{
                questionText: 'Why do array lookups run in O(1) constant time?',
                options: [
                  { text: 'Because elements are ordered', isCode: false },
                  { text: 'Because elements reside in contiguous memory slots, allowing mathematical offset calculations', isCode: false },
                  { text: 'Because of JIT caching', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Contiguous memory layout allows computing an element\'s address directly from its index in one math step.'
              }]
            }
          },
          {
            title: 'Singly, Doubly, & Circular Linked Lists',
            slug: 'linked-lists-types',
            order: 2,
            content: `<h3>Singly, Doubly, & Circular Linked Lists</h3>
<p>Linked Lists allocate elements (nodes) dynamically on the Heap:</p>
<ul>
  <li><strong>Singly Linked List:</strong> Each node points to the <code>next</code> node.</li>
  <li><strong>Doubly Linked List:</strong> Nodes point to both <code>next</code> and <code>prev</code> nodes.</li>
  <li><strong>Circular Linked List:</strong> The tail node points back to the <code>head</code> node.</li>
</ul>`,
            visualizations: [
              {
                step: 1,
                label: "Singly Linked List: [Head] -> Node(val=10) -> Node(val=20) -> null",
                memorySnapshot: {
                  stack: [{ variable: 'head', value: '0x1005' }],
                  heap: [
                    { address: '0x1005', objectType: 'Node', fields: { data: 10, next: '0x1102' } },
                    { address: '0x1102', objectType: 'Node', fields: { data: 20, next: 'null' } }
                  ]
                }
              }
            ],
            quiz: {
              questions: [{
                questionText: 'Which linked list type allows two-way traversal (forward and backward)?',
                options: [
                  { text: 'Singly Linked List', isCode: false },
                  { text: 'Doubly Linked List', isCode: false },
                  { text: 'Circular Linked List', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Doubly Linked Lists store both next and prev references in each node, allowing bidirectional traversal.'
              }]
            }
          },
          {
            title: 'Stacks (LIFO) & Queues (FIFO)',
            slug: 'stacks-queues-dsa',
            order: 3,
            content: `<h3>Stacks (LIFO) & Queues (FIFO)</h3>
<p>Stacks and Queues restrict data access paths:</p>
<ul>
  <li><strong>Stack:</strong> Last-In, First-Out (LIFO). Elements are pushed and popped from the <code>top</code>.</li>
  <li><strong>Queue:</strong> First-In, First-Out (FIFO). Elements are enqueued at the <code>rear</code> and dequeued from the <code>front</code>.</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'What access pattern defines a Queue?',
                options: [
                  { text: 'LIFO (Last-In, First-Out)', isCode: false },
                  { text: 'FIFO (First-In, First-Out)', isCode: false },
                  { text: 'Random Access', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'A Queue works like a real-world checkout line: the first to enter is the first to leave.'
              }]
            }
          }
        ]
      },
      {
        title: 'Module 13: Hash Tables & Hashing',
        order: 13,
        isPublished: true,
        lessons: [
          {
            title: 'Hash Functions & Collision Resolution',
            slug: 'hashing-collision',
            order: 1,
            content: `<h3>Hash Functions & Collision Resolution</h3>
<p>A **Hash Table** stores key-value pairs. It computes a key\'s hashcode to determine its index in an array.</p>
<p>When different keys yield the same index, a **Collision** occurs. Hash tables resolve collisions using:</p>
<ul>
  <li><strong>Separate Chaining:</strong> Each bucket contains a linked list of entries.</li>
  <li><strong>Open Addressing (Linear Probing):</strong> Searches for the next available slot in the array.</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'What is Separate Chaining?',
                options: [
                  { text: 'Storing elements at subsequent index offsets', isCode: false },
                  { text: 'Maintaining a linked list of entries at each array index bucket', isCode: false },
                  { text: 'Resizing the array by 1.5x', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Separate Chaining stores colliding entries in a linked list at the same bucket index.'
              }]
            }
          }
        ]
      },
      {
        title: 'Module 14: Non-Linear Data Structures: Trees',
        order: 14,
        isPublished: true,
        lessons: [
          {
            title: 'Binary Trees & Tree Traversals',
            slug: 'binary-tree-traversals',
            order: 1,
            content: `<h3>Binary Trees & Tree Traversals</h3>
<p>A **Binary Tree** is a hierarchical structure where each node has at most two children (left and right).</p>
<p>Depth-First search traversals include:</p>
<ul>
  <li><strong>In-Order (Left, Root, Right):</strong> Visits nodes in sorted order for BSTs.</li>
  <li><strong>Pre-Order (Root, Left, Right):</strong> Useful for copying trees.</li>
  <li><strong>Post-Order (Left, Right, Root):</strong> Useful for deleting trees.</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'Which traversal visits the root node first before traversing either subtree?',
                options: [
                  { text: 'In-Order Traversal', isCode: false },
                  { text: 'Pre-Order Traversal', isCode: false },
                  { text: 'Post-Order Traversal', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Pre-Order traversal visits the root first, then the left child, and finally the right child.'
              }]
            }
          },
          {
            title: 'Binary Search Trees (BST) & Balanced AVL Trees',
            slug: 'bst-avl-trees',
            order: 2,
            content: `<h3>Binary Search Trees (BST) & Balanced AVL Trees</h3>
<p>A **Binary Search Tree (BST)** enforces sorting constraints: left children are smaller than the parent node, and right children are larger.</p>
<p>In the worst case (skewed tree), BST operations can degrade to <code>O(N)</code>. **AVL Trees** solve this by maintaining balance. They perform rotations to guarantee <code>O(log N)</code> height during insertions and deletions.</p>`,
            quiz: {
              questions: [{
                questionText: 'How do AVL trees maintain balance?',
                options: [
                  { text: 'By converting buckets into Red-Black trees', isCode: false },
                  { text: 'By performing tree rotations when subtrees height differences exceed 1', isCode: false },
                  { text: 'By linear probing', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'AVL trees calculate a balance factor for nodes and apply rotations to restore O(log N) height limits.'
              }]
            }
          },
          {
            title: 'Heaps & Priority Queues',
            slug: 'heaps-priority-queues',
            order: 3,
            content: `<h3>Heaps & Priority Queues</h3>
<p>A **Heap** is a complete binary tree where the parent node has a higher priority than its children:</p>
<ul>
  <li><strong>Max Heap:</strong> Parent is larger than or equal to its children.</li>
  <li><strong>Min Heap:</strong> Parent is smaller than or equal to its children.</li>
</ul>
<p>Heaps are commonly implemented using arrays to support O(1) access to the minimum/maximum element and O(log N) updates.</p>`,
            quiz: {
              questions: [{
                questionText: 'What is the time complexity of extracting the root element from a Binary Heap containing N elements?',
                options: [
                  { text: 'O(1)', isCode: false },
                  { text: 'O(log N)', isCode: false },
                  { text: 'O(N)', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Removing the root requires swapping the last element to the top and heapifying down, which takes O(log N) time.'
              }]
            }
          }
        ]
      },
      {
        title: 'Module 15: Graph Data Structures',
        order: 15,
        isPublished: true,
        lessons: [
          {
            title: 'Directed vs. Undirected Graph Representations',
            slug: 'graph-representations',
            order: 1,
            content: `<h3>Directed vs. Undirected Graph Representations</h3>
<p>A **Graph** consists of vertices (nodes) connected by edges:</p>
<ul>
  <li><strong>Directed Graph (Digraph):</strong> Edges have a direction (U -> V).</li>
  <li><strong>Undirected Graph:</strong> Edges are bidirectional (U <-> V).</li>
</ul>
<p>Graphs are represented in code using an **Adjacency Matrix** (2D array) or an **Adjacency List** (array of lists).</p>`,
            quiz: {
              questions: [{
                questionText: 'Which graph representation is optimal for sparse graphs?',
                options: [
                  { text: 'Adjacency Matrix', isCode: false },
                  { text: 'Adjacency List', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Adjacency Lists only store actual edges, saving significant memory over O(V²) matrices in sparse graphs.'
              }]
            }
          },
          {
            title: 'Graph Traversals: BFS & DFS',
            slug: 'graph-bfs-dfs',
            order: 2,
            content: `<h3>Graph Traversals: BFS & DFS</h3>
<p>Traversing a graph involves visiting all its vertices systematically:</p>
<ul>
  <li><strong>Breadth-First Search (BFS):</strong> Explores neighbors level by level. Implemented using a **Queue** (FIFO).</li>
  <li><strong>Depth-First Search (DFS):</strong> Explores paths as deep as possible before backtracking. Implemented using a **Stack** or recursion.</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'What data structure is used to track nodes in a Breadth-First Search (BFS) traversal?',
                options: [
                  { text: 'Stack (LIFO)', isCode: false },
                  { text: 'Queue (FIFO)', isCode: false },
                  { text: 'Priority Queue', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'BFS explores node neighbors level by level, tracking visitation order using a Queue.'
              }]
            }
          }
        ]
      },
      {
        title: 'Module 16: Graph Shortest Path Algorithms',
        order: 16,
        isPublished: true,
        lessons: [
          {
            title: "Dijkstra's, Bellman-Ford, and A* Algorithms",
            slug: 'graph-shortest-paths',
            order: 1,
            content: `<h3>Shortest Path Algorithms</h3>
<p>These algorithms find the shortest path between nodes in a weighted graph:</p>
<ul>
  <li><strong>Dijkstra's Algorithm:</strong> Finds the shortest path in graphs with non-negative edge weights using a Priority Queue. Time complexity: <code>O(E log V)</code>.</li>
  <li><strong>Bellman-Ford Algorithm:</strong> Computes shortest paths in graphs that may have negative edge weights. Can detect negative weight cycles. Time complexity: <code>O(V * E)</code>.</li>
  <li><strong>A* Search:</strong> Uses a heuristic function to guide pathfinding, commonly used in navigation and maps.</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'Which algorithm can detect negative weight cycles in a graph?',
                options: [
                  { text: "Dijkstra's Algorithm", isCode: false },
                  { text: 'Bellman-Ford Algorithm', isCode: false },
                  { text: 'A* Algorithm', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Bellman-Ford relaxes all edges V-1 times. A final iteration that reduces distances indicates a negative cycle.'
              }]
            }
          }
        ]
      },
      {
        title: 'Module 17: Graph Algorithms: Minimum Spanning Trees',
        order: 17,
        isPublished: true,
        lessons: [
          {
            title: "Prim's and Kruskal's Algorithms",
            slug: 'graph-mst-algorithms',
            order: 1,
            content: `<h3>Prim's and Kruskal's Algorithms</h3>
<p>A **Minimum Spanning Tree (MST)** connects all vertices in a weighted graph with the minimum total edge weight, without cycles.</p>
<ul>
  <li><strong>Prim's Algorithm:</strong> Starts from a root vertex and grows the tree by adding the cheapest edge to an unvisited vertex. Best for dense graphs.</li>
  <li><strong>Kruskal's Algorithm:</strong> Sorts all edges by weight and adds the cheapest edge if it doesn't create a cycle. Uses a Disjoint Set (Union-Find) data structure. Best for sparse graphs.</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'What helper data structure is used in Kruskal\'s algorithm to check if adding an edge creates a cycle?',
                options: [
                  { text: 'Binary Heap', isCode: false },
                  { text: 'Disjoint Set (Union-Find)', isCode: false },
                  { text: 'Adjacency List', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Union-Find keeps track of connected components, allowing cycle checks in near-constant time.'
              }]
            }
          }
        ]
      },
      {
        title: 'Module 18: Tree Indexing & Database Structures',
        order: 18,
        isPublished: true,
        lessons: [
          {
            title: 'Multi-way Trees (2-3 Trees, B/B+ Trees)',
            slug: 'b-trees-indexing',
            order: 1,
            content: `<h3>Multi-way Trees (2-3 Trees, B/B+ Trees)</h3>
<p>Standard binary search trees don't scale well to disk storage because of height variation. **B-Trees** and **B+ Trees** are self-balancing multi-way search trees designed for storage systems.</p>
<ul>
  <li><strong>2-3 Tree:</strong> A balanced tree where nodes can have 2 or 3 children.</li>
  <li><strong>B-Tree:</strong> Nodes can contain multiple keys and children. Keys are distributed across all levels.</li>
  <li><strong>B+ Tree:</strong> All keys are stored at the leaf level, and leaves are connected in a linked list. This layout supports fast range queries.</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'Why are B+ Trees preferred over standard B-Trees for database indexing?',
                options: [
                  { text: 'Because they are binary trees', isCode: false },
                  { text: 'Because all values are stored in the leaf nodes, which are connected by a linked list to allow fast range scans', isCode: false },
                  { text: 'Because they do not require balancing', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'B+ Tree leaves are linked together, allowing sequential range scans without traversing parent levels.'
              }]
            }
          },
          {
            title: 'Database Indexing: Linear vs. Tree-Based Indexing',
            slug: 'linear-tree-indexing',
            order: 2,
            content: `<h3>Database Indexing: Linear vs. Tree-Based Indexing</h3>
<p>An index speeds up database queries:</p>
<ul>
  <li><strong>Linear Indexing:</strong> A simple ordered list of key-pointer pairs. Search runs in <code>O(log N)</code> using binary search, but updates are slow (<code>O(N)</code>).</li>
  <li><strong>Tree-Based Indexing:</strong> Uses B/B+ trees. Ensures <code>O(log N)</code> runtime for search, insertion, and deletion.</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'What is the update complexity in a linear index database model?',
                options: [
                  { text: 'O(1)', isCode: false },
                  { text: 'O(log N)', isCode: false },
                  { text: 'O(N)', isCode: false }
                ],
                correctAnswerIndex: 2,
                explanation: 'Because linear indexes are kept sorted in contiguous arrays, inserting a new key requires shifting items, which takes O(N) time.'
              }]
            }
          },
          {
            title: 'ISAM (Indexed Sequential Access Method)',
            slug: 'isam-indexing',
            order: 3,
            content: `<h3>ISAM (Indexed Sequential Access Method)</h3>
<p><strong>ISAM</strong> is a static indexing method developed by IBM. It organizes records sequentially on disk and maintains a static index tree to locate blocks of records.</p>
<p>ISAM is fast for read-only tables but struggles with updates because insertions can overflow blocks, leading to chained lookup lists that degrade performance.</p>`,
            quiz: {
              questions: [{
                questionText: 'What is a limitation of ISAM?',
                options: [
                  { text: 'It uses binary heaps', isCode: false },
                  { text: 'The index structure is static, leading to overflow chains and slower lookups after many insertions', isCode: false },
                  { text: 'It cannot be stored on disk', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'ISAM indexes do not automatically re-balance during updates. New records are placed in overflow areas, which slows down search times over time.'
              }]
            }
          }
        ]
      },
      {
        title: 'Module 19: Advanced Data Structures',
        order: 19,
        isPublished: true,
        lessons: [
          {
            title: 'Trie (Prefix Tree)',
            slug: 'trie-prefix-tree',
            order: 1,
            content: `<h3>Trie (Prefix Tree)</h3>
<p>A **Trie** is a specialized tree structure used for storing strings over an alphabet. Each node contains characters, and paths from the root represent prefixes of strings.</p>
<p>Tries are optimal for auto-complete search engines, checking spelling, and prefix matching. Lookup runs in <code>O(L)</code> where L is the length of the query string.</p>`,
            quiz: {
              questions: [{
                questionText: 'What is the lookup time complexity for a string of length L in a Trie containing N strings?',
                options: [
                  { text: 'O(log N)', isCode: false },
                  { text: 'O(L)', isCode: false },
                  { text: 'O(N * L)', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Trie search times depend only on the length of the target string (L), not the total number of words in the Trie.'
              }]
            }
          },
          {
            title: 'Range Query Structures: Segment Trees & Fenwick Trees',
            slug: 'segment-fenwick-trees',
            order: 2,
            content: `<h3>Range Query Structures: Segment Trees & Fenwick Trees</h3>
<p>These structures optimize queries on interval ranges of arrays:</p>
<ul>
  <li><strong>Segment Tree:</strong> A binary tree where each node represents an interval of the array. Supports range queries (e.g. range sum, range minimum) in <code>O(log N)</code> and point updates in <code>O(log N)</code>.</li>
  <li><strong>Fenwick Tree (Binary Indexed Tree):</strong> A space-efficient tree structure represented as an array. Supports prefix sum queries and point updates in <code>O(log N)</code> time.</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'What is the runtime for range sum queries and point updates in a Segment Tree?',
                options: [
                  { text: 'Range sum: O(1), update: O(N)', isCode: false },
                  { text: 'Range sum: O(log N), update: O(log N)', isCode: false },
                  { text: 'Range sum: O(N), update: O(1)', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Segment Trees perform both updates and range queries in O(log N) time by traversing height levels.'
              }]
            }
          },
          {
            title: 'Disjoint Set Union (Union-Find)',
            slug: 'union-find-dsa',
            order: 3,
            content: `<h3>Disjoint Set Union (Union-Find)</h3>
<p>The **Disjoint Set (Union-Find)** data structure manages a collection of disjoint sets. It supports two primary operations:</p>
<ul>
  <li><strong>Find:</strong> Identifies which set a particular element belongs to.</li>
  <li><strong>Union:</strong> Merges two disjoint sets into a single set.</li>
</ul>
<p>By using **Path Compression** and **Union by Rank**, operations run in near-constant time: <code>O(α(N))</code>, where α is the inverse Ackermann function.</p>`,
            quiz: {
              questions: [{
                questionText: 'What optimization compresses path heights in a Disjoint Set?',
                options: [
                  { text: 'Path Compression', isCode: false },
                  { text: 'Union by Rank', isCode: false },
                  { text: 'Binary rotation', isCode: false }
                ],
                correctAnswerIndex: 0,
                explanation: 'Path Compression updates visited nodes to point directly to the set representative node during Find operations, flattening the tree structure.'
              }]
            }
          },
          {
            title: 'Suffix Trees & Suffix Arrays',
            slug: 'suffix-trees-arrays',
            order: 4,
            content: `<h3>Suffix Trees & Suffix Arrays</h3>
<p>These structures analyze substring properties in text:</p>
<ul>
  <li><strong>Suffix Tree:</strong> A compressed trie containing all suffixes of a string. Allows substring searches and pattern matching in <code>O(M)</code> time, where M is the pattern length.</li>
  <li><strong>Suffix Array:</strong> A sorted array of all suffixes of a string. More space-efficient than suffix trees, supporting queries in <code>O(M log N)</code> time.</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'How does a Suffix Array compare to a Suffix Tree?',
                options: [
                  { text: 'Suffix arrays are faster but use more memory', isCode: false },
                  { text: 'Suffix arrays are more space-efficient but require slightly longer search runtimes', isCode: false },
                  { text: 'Suffix arrays cannot search for substrings', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Suffix Arrays use a sorted array layout that saves significant memory over suffix trees, but lookups take O(M log N) instead of O(M) time.'
              }]
            }
          }
        ]
      },
      {
        title: 'Module 20: Complex Structures & Skip Lists',
        order: 20,
        isPublished: true,
        lessons: [
          {
            title: 'Skip Lists: Randomized Hierarchies',
            slug: 'skip-lists-dsa',
            order: 1,
            content: `<h3>Skip Lists: Randomized Hierarchies</h3>
<p>A **Skip List** is a randomized data structure that extends a sorted linked list with multiple layers of express lanes. It acts as an alternative to self-balancing search trees.</p>
<p>The bottom layer is a standard sorted linked list. Higher layers skip elements using a coin-toss randomization algorithm to determine node heights. Search, insertion, and deletion run in <code>O(log N)</code> average time.</p>`,
            quiz: {
              questions: [{
                questionText: 'What design pattern does a Skip List use to build express lanes?',
                options: [
                  { text: 'Deterministic rotation algorithms', isCode: false },
                  { text: 'Randomized coin-toss probability to determine node heights', isCode: false },
                  { text: 'B+ tree leaf pointer links', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Skip Lists use randomization to build higher express lanes, avoiding complex balancing operations.'
              }]
            }
          }
        ]
      },
      {
        title: 'Module 21: Algorithmic Paradigms',
        order: 21,
        isPublished: true,
        lessons: [
          {
            title: 'Brute Force & Recursion',
            slug: 'brute-force-recursion',
            order: 1,
            content: `<h3>Brute Force & Recursion</h3>
<p>Core algorithmic paradigms:</p>
<ul>
  <li><strong>Brute Force:</strong> Systematically evaluates all possible solutions. Easy to implement but slow (often exponential time).</li>
  <li><strong>Recursion:</strong> A function that calls itself to solve smaller subproblems. Requires a **Base Case** to prevent infinite loops and stack overflows.</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'What is the purpose of the base case in a recursive function?',
                options: [
                  { text: 'To initialize variables', isCode: false },
                  { text: 'To define when recursion should stop, preventing stack overflow', isCode: false },
                  { text: 'To allocate Heap objects', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'The base case defines a terminating condition that stops recursive calls, returning back up the call stack.'
              }]
            }
          },
          {
            title: 'Backtracking & Divide-and-Conquer',
            slug: 'backtracking-divide-conquer',
            order: 2,
            content: `<h3>Backtracking & Divide-and-Conquer</h3>
<p>Optimized recursion strategies:</p>
<ul>
  <li><strong>Backtracking:</strong> Explores solutions incrementally, abandoning a path as soon as it violates constraints (e.g. N-Queens, Sudoku).</li>
  <li><strong>Divide-and-Conquer:</strong> Splits a problem into independent subproblems, solves them recursively, and combines their results (e.g. Merge Sort).</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'Which paradigm is best suited for solving constraint satisfaction problems like the N-Queens puzzle?',
                options: [
                  { text: 'Greedy Algorithms', isCode: false },
                  { text: 'Backtracking', isCode: false },
                  { text: 'Divide-and-Conquer', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Backtracking systematically builds and discards candidate paths as soon as they violate constraints.'
              }]
            }
          },
          {
            title: 'Greedy & Randomized Algorithms',
            slug: 'greedy-randomized-algorithms',
            order: 3,
            content: `<h3>Greedy & Randomized Algorithms</h3>
<p>Approaches for optimization problems:</p>
<ul>
  <li><strong>Greedy:</strong> Makes the locally optimal choice at each step, hoping to find a global optimum (e.g. Prim's MST, Huffman Coding). Fast but does not guarantee a global optimum for all problems.</li>
  <li><strong>Randomized:</strong> Uses random numbers to guide choices (e.g. Quick Sort partition pivots). Helps avoid worst-case scenarios.</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'Does a Greedy algorithm always find the globally optimal solution?',
                options: [
                  { text: 'Yes, it guarantees a global optimum', isCode: false },
                  { text: 'No, it makes local choices that do not guarantee a global optimum for all problems', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Greedy algorithms choose the best immediate option, which can sometimes miss the global optimum.'
              }]
            }
          },
          {
            title: 'Dynamic Programming',
            slug: 'dynamic-programming-dsa',
            order: 4,
            content: `<h3>Dynamic Programming</h3>
<p><strong>Dynamic Programming (DP)</strong> solves complex problems by breaking them down into overlapping subproblems. It solves each subproblem once and stores the result to avoid redundant work.</p>
<p>DP approaches include:</p>
<ul>
  <li><strong>Memoization (Top-Down):</strong> Solves recursively and caches results in a table.</li>
  <li><strong>Tabulation (Bottom-Up):</strong> Solves iteratively, building up the solution table from the base cases.</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'What is the difference between Memoization and Tabulation?',
                options: [
                  { text: 'Memoization is bottom-up (iterative); Tabulation is top-down (recursive)', isCode: false },
                  { text: 'Memoization is top-down (recursive); Tabulation is bottom-up (iterative)', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Memoization uses recursion and caches results. Tabulation solves iteratively, filling a table from base cases up.'
              }]
            }
          }
        ]
      },
      {
        title: 'Module 22: Essential Coding Interview Patterns - Part 1',
        order: 22,
        isPublished: true,
        lessons: [
          {
            title: 'Sliding Window & Two Pointer Techniques',
            slug: 'sliding-window-two-pointer',
            order: 1,
            content: `<h3>Sliding Window & Two Pointer Techniques</h3>
<p>These patterns optimize double loops over arrays or lists:</p>
<ul>
  <li><strong>Sliding Window:</strong> Maintains a sub-array (window) over the elements, expanding or shrinking it based on conditions. Used for contiguous sub-array problems.</li>
  <li><strong>Two Pointer:</strong> Uses two pointers traversing the array (often from opposite ends or at different speeds) to solve searching/matching problems in sorted arrays.</li>
</ul>`,
            quiz: {
              questions: [{
                questionText: 'Which pattern is optimal for finding the maximum sum of a contiguous subarray of size K?',
                options: [
                  { text: 'Two Pointer', isCode: false },
                  { text: 'Sliding Window', isCode: false },
                  { text: 'Divide-and-Conquer', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Sliding Window maintains a running sum of a K-element window, avoiding redundant additions.'
              }]
            }
          },
          {
            title: 'Fast & Slow Pointers (Cycle Detection)',
            slug: 'fast-slow-pointers',
            order: 2,
            content: `<h3>Fast & Slow Pointers (Cycle Detection)</h3>
<p>Also known as **Hare & Tortoise algorithm**, this pattern uses two pointers moving at different speeds (slow moves 1 step, fast moves 2 steps).</p>
<p>Commonly used to detect cycles in linked lists or array structures. If a cycle exists, the fast pointer will eventually catch up and meet the slow pointer.</p>`,
            quiz: {
              questions: [{
                questionText: 'What happens if a cycle exists in a linked list traversed by fast and slow pointers?',
                options: [
                  { text: 'The fast pointer reaches null first', isCode: false },
                  { text: 'The fast and slow pointers will meet at the same node', isCode: false },
                  { text: 'The code throws a NullPointerException', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'In a cycle, the fast pointer loops around and eventually meets the slow pointer.'
              }]
            }
          },
          {
            title: 'Merge Intervals',
            slug: 'merge-intervals-pattern',
            order: 3,
            content: `<h3>Merge Intervals</h3>
<p>This pattern is used to solve problems involving overlapping intervals (e.g. meeting room schedules, range unions).</p>
<p>It typically starts by sorting the intervals by their start times. Then, it iterates through the intervals, merging overlapping ones by comparing the start of the current interval with the end of the previous one.</p>`,
            quiz: {
              questions: [{
                questionText: 'What is the first step in solving a Merge Intervals problem?',
                options: [
                  { text: 'Sort the intervals by their start times', isCode: false },
                  { text: 'Compare adjacent end times randomly', isCode: false },
                  { text: 'Allocate a binary heap', isCode: false }
                ],
                correctAnswerIndex: 0,
                explanation: 'Sorting by start times ensures that potentially overlapping intervals are adjacent, enabling O(N) merging.'
              }]
            }
          },
          {
            title: 'Cyclic Sort',
            slug: 'cyclic-sort-pattern',
            order: 4,
            content: `<h3>Cyclic Sort</h3>
<p><strong>Cyclic Sort</strong> is used to solve problems involving arrays containing numbers in a given range (e.g. 1 to N).</p>
<p>It places each number at its correct index: number <code>X</code> should be at index <code>X-1</code>. It swaps elements into place iteratively, solving problems like finding missing numbers in O(N) time and O(1) space.</p>`,
            quiz: {
              questions: [{
                questionText: 'What is the time complexity of Cyclic Sort on an array containing values from 1 to N?',
                options: [
                  { text: 'O(N²)', isCode: false },
                  { text: 'O(N)', isCode: false },
                  { text: 'O(N log N)', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Cyclic Sort places elements in their correct index within at most N swaps, yielding O(N) linear runtime.'
              }]
            }
          }
        ]
      },
      {
        title: 'Module 23: Essential Coding Interview Patterns - Part 2',
        order: 23,
        isPublished: true,
        lessons: [
          {
            title: 'Two Heaps Pattern',
            slug: 'two-heaps-pattern',
            order: 1,
            content: `<h3>Two Heaps Pattern</h3>
<p>This pattern is used to solve problems where we need to split elements into two parts to find running medians or track dynamic partition boundaries.</p>
<p>It maintains a **Max Heap** for the smaller half of the numbers and a **Min Heap** for the larger half. This layout keeps the middle elements at the root of the heaps, supporting median extraction in O(1) time.</p>`,
            quiz: {
              questions: [{
                questionText: 'How does the Two Heaps pattern track running medians?',
                options: [
                  { text: 'By using a balanced AVL tree', isCode: false },
                  { text: 'By storing the smaller half in a Max Heap and the larger half in a Min Heap', isCode: false },
                  { text: 'By sorting the array on every insertion', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Keeping elements balanced across a Max Heap (lower half) and Min Heap (upper half) makes the median values accessible at the roots.'
              }]
            }
          },
          {
            title: 'Kth Element & QuickSelect',
            slug: 'kth-element-pattern',
            order: 2,
            content: `<h3>Kth Element & QuickSelect</h3>
<p>QuickSelect is a selection algorithm used to find the Kth smallest/largest element in an unsorted array without sorting it entirely.</p>
<p>It uses the same partitioning logic as QuickSort. It selects a pivot, partitions the array, and recursively searches only the partition containing the target Kth index. Average runtime: <code>O(N)</code>.</p>`,
            quiz: {
              questions: [{
                questionText: 'What is the average time complexity of finding the Kth element using QuickSelect?',
                options: [
                  { text: 'O(N log N)', isCode: false },
                  { text: 'O(N)', isCode: false },
                  { text: 'O(N²)', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'QuickSelect only recurses into one partition, reducing average runtime from O(N log N) to linear O(N).'
              }]
            }
          },
          {
            title: 'Island Traversal (Matrix DFS/BFS)',
            slug: 'island-traversal-pattern',
            order: 3,
            content: `<h3>Island Traversal (Matrix DFS/BFS)</h3>
<p>This pattern is used to traverse 2D grid/matrix structures where cells represent nodes and adjacent connections represent edges.</p>
<p>It traverses the matrix row-by-row. When it hits a target cell (e.g. land '1'), it triggers DFS/BFS recursion to visit and mark all connected land cells (e.g. setting them to '0' or marking them visited) to count or analyze connected components (islands).</p>`,
            quiz: {
              questions: [{
                questionText: 'What technique is commonly used to avoid infinite loops during grid traversal?',
                options: [
                  { text: 'Heap sorting the grid cells', isCode: false },
                  { text: 'Marking visited cells as you traverse them', isCode: false },
                  { text: 'Linear probing', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'Marking cells as visited (or changing their value) prevents traversing them multiple times.'
              }]
            }
          },
          {
            title: 'Multi-threaded Concurrency Patterns',
            slug: 'concurrency-interview-patterns',
            order: 4,
            content: `<h3>Multi-threaded Concurrency Patterns</h3>
<p>This pattern is used to design parallel algorithms that run safely and efficiently on multi-core systems.</p>
<p>It involves coordinating thread pools, futures, latch barriers, and blocking queues. Common problems include the Producer-Consumer pattern, which coordinates threads using wait/notify or blocking queue structures.</p>`,
            quiz: {
              questions: [{
                questionText: 'Which class handles the Producer-Consumer pattern by managing thread safety and blocking operations automatically?',
                options: [
                  { text: 'ArrayList', isCode: false },
                  { text: 'BlockingQueue (like ArrayBlockingQueue)', isCode: false },
                  { text: 'HashMap', isCode: false }
                ],
                correctAnswerIndex: 1,
                explanation: 'BlockingQueue handles wait/notify synchronization internally, blocking producers when full and consumers when empty.'
              }]
            }
          }
        ]
      }
    ]
  }
];

const seedDB = async () => {
  let connected = false;
  const url = process.env.DATABASE_URL || 'mongodb://localhost:27017/noobsyte';
  try {
    console.log('Connecting to database:', url.replace(/:([^:@]+)@/, ':****@'));
    await mongoose.connect(url, { serverSelectionTimeoutMS: 30000 });
    console.log('Connected to MongoDB cluster.');
    connected = true;
  } catch (error) {
    console.error('Atlas connection failed. Trying local MongoDB...', error.message);
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/noobsyte');
      console.log('Connected to local MongoDB.');
      connected = true;
    } catch (localError) {
      console.error('Failed to connect to local MongoDB:', localError.message);
    }
  }

  if (!connected) {
    console.error('Could not connect to any database. Seeding aborted.');
    return;
  }

  try {
    // Clean existing records
    await Course.deleteMany({});
    await Module.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    console.log('Cleared existing curriculum records.');

    for (const cData of coursesData) {
      // Create Course
      const course = await Course.create({
        title: cData.title,
        description: cData.description,
        difficulty: cData.difficulty,
        isPublished: cData.isPublished
      });
      console.log(`Created Course: ${course.title} (${course.slug})`);

      for (const mData of cData.modules) {
        // Create Module
        const mod = await Module.create({
          course: course._id,
          title: mData.title,
          order: mData.order,
          isPublished: mData.isPublished
        });
        console.log(`  Created Module: ${mod.title}`);

        for (const lData of mData.lessons) {
          // Create Lesson
          const lesson = await Lesson.create({
            module: mod._id,
            title: lData.title,
            content: lData.content,
            visualizations: lData.visualizations || [],
            order: lData.order
          });
          console.log(`    Created Lesson: ${lesson.title} (${lesson.slug})`);

          // Create associated Quiz
          if (lData.quiz) {
            const quiz = await Quiz.create({
              lesson: lesson._id,
              questions: lData.quiz.questions
            });
            console.log(`      Created Quiz for Lesson: ${lesson.title}`);
          }
        }
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Seeding Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
};

seedDB();
