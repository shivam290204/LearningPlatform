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
            content: `<article class="lesson-content">

  <section class="lesson-intro">
    <h2>What Are Data Structures?</h2>
    <p>
      Imagine you're moving houses. You have hundreds of items — books, clothes, kitchen tools, electronics.
      Now, you could throw everything into random boxes, but that would make unpacking a nightmare.
      Or you could organize things smartly: books in labeled boxes, fragile items in padded containers, clothes sorted by room.
      That organization system you use? That's exactly what a <strong>data structure</strong> is — but for computer memory.
    </p>
    <p>
      A <strong>data structure</strong> is a systematic, organized way to store, manage, and arrange data in a computer's memory so that
      operations like searching, inserting, deleting, and updating can be performed efficiently.
    </p>
    <p>
      Every software application you use — Instagram, Google, Netflix, your banking app — is built on data structures.
      Without them, computers would be forced to scan through millions of records one by one for every single operation.
      The right data structure can make a program run in milliseconds instead of hours.
    </p>
  </section>

  <section class="lesson-section">
    <h3>Why Are Data Structures Important?</h3>
    <p>
      Consider Google Search. When you type "pizza near me", Google doesn't scan through 8 billion web pages
      one by one. It uses specialized data structures (like inverted indexes and hash maps) to locate relevant
      results in milliseconds.
    </p>
    <p>
      Consider your smartphone's contact list. Without a data structure, finding "Priya Sharma" in 500 contacts
      would require checking every single contact. With a sorted data structure and binary search, it can be found
      in under 10 comparisons.
    </p>
    <p>
      Data structures determine the difference between:
    </p>
    <ul>
      <li>A website that loads in 200ms vs. one that times out</li>
      <li>A game that runs at 60fps vs. one that stutters</li>
      <li>A database query that returns instantly vs. one that takes minutes</li>
    </ul>
    <p>
      In every technical interview at top companies (Google, Amazon, Microsoft, Meta), data structures and
      algorithms form the core of coding rounds. Mastering them is non-negotiable for a software engineering career.
    </p>
  </section>

  <section class="lesson-section">
    <h3>Real-Life Analogy: The Library</h3>
    <p>
      Think of a library. A librarian could store all 50,000 books in a giant random pile — technically,
      all the books are "stored", but finding any specific book would take hours.
    </p>
    <p>
      Instead, libraries organize books using the Dewey Decimal System:
    </p>
    <ul>
      <li>Books are grouped by subject (like categories in a data structure)</li>
      <li>Within subjects, they're sorted alphabetically by author (ordering)</li>
      <li>Each shelf is labeled (indexing)</li>
      <li>The catalog maps title/author to shelf location (hash mapping)</li>
    </ul>
    <p>
      Different sections of the library represent different data structures:
    </p>
    <ul>
      <li><strong>Reference shelves</strong> (sorted arrays — fast lookup, hard to rearrange)</li>
      <li><strong>Waiting list for reserved books</strong> (queue — first come, first served)</li>
      <li><strong>Return counter stack</strong> (stack — last returned, first processed)</li>
      <li><strong>Catalog index</strong> (hash map — instant lookup by key)</li>
      <li><strong>Dewey Decimal tree</strong> (tree — hierarchical organization)</li>
    </ul>
  </section>

  <section class="lesson-section">
    <h3>Core Theory: Classification of Data Structures</h3>
    <p>Data structures are broadly divided into two families based on how elements relate to each other:</p>

    <h4>1. Linear Data Structures</h4>
    <p>
      Elements are arranged in a <strong>sequential, one-dimensional order</strong>. Each element has a unique
      predecessor and successor (except for the first and last elements). They are stored in contiguous or
      linked memory locations.
    </p>
    <ul>
      <li><strong>Array:</strong> Fixed-size, indexed collection. Elements stored in contiguous memory. Fast random access O(1).</li>
      <li><strong>Linked List:</strong> Nodes scattered in memory, connected by pointers. Dynamic size. O(N) access.</li>
      <li><strong>Stack:</strong> LIFO (Last-In, First-Out) structure. Like a stack of plates.</li>
      <li><strong>Queue:</strong> FIFO (First-In, First-Out) structure. Like a checkout line.</li>
    </ul>

    <h4>2. Non-Linear Data Structures</h4>
    <p>
      Elements are arranged in a <strong>hierarchical or network (mesh) pattern</strong>. One element can connect to multiple elements.
      These structures model complex real-world relationships that don't fit into a simple sequence.
    </p>
    <ul>
      <li><strong>Tree:</strong> Hierarchical parent-child relationships. File systems, HTML DOM, organization charts.</li>
      <li><strong>Graph:</strong> Nodes (vertices) connected by edges. Social networks, road maps, internet routing.</li>
      <li><strong>Heap:</strong> Specialized tree with priority ordering. Used in scheduling and sorting.</li>
      <li><strong>Trie:</strong> Prefix-based tree optimized for string searches and autocomplete.</li>
    </ul>

    <h4>3. Static vs. Dynamic Data Structures</h4>
    <ul>
      <li>
        <strong>Static:</strong> Fixed size allocated at compile time. Cannot grow or shrink during execution.
        Example: standard arrays in Java — <code>int[] arr = new int[10]</code> always holds exactly 10 integers.
      </li>
      <li>
        <strong>Dynamic:</strong> Size adjusts at runtime as elements are added or removed.
        Example: Java's <code>ArrayList</code> or <code>LinkedList</code> grow and shrink automatically.
      </li>
    </ul>

    <h4>4. Primitive vs. Abstract Data Types</h4>
    <ul>
      <li>
        <strong>Primitive Data Types (PDT):</strong> Basic types built into the language — <code>int</code>,
        <code>char</code>, <code>boolean</code>, <code>double</code>. They store a single value directly.
      </li>
      <li>
        <strong>Abstract Data Types (ADT):</strong> Define behavior (what operations are supported) without
        specifying implementation. A <em>Stack ADT</em> defines push/pop/peek — the internal implementation
        can be an array or linked list. ADTs are the "contracts" that data structures fulfill.
      </li>
    </ul>
  </section>

  <section class="lesson-section">
    <h3>Visual Explanation: Memory Layout Comparison</h3>
    <p>
      One of the most important concepts in understanding data structures is <em>how they actually exist in computer memory</em>.
      Arrays store elements side by side (contiguous), while linked lists scatter them across memory and use pointer chains.
      This physical difference directly causes performance differences.
    </p>
    <p>
      The diagram below shows how an Array and a Linked List store the same sequence [10, 20, 30] differently in RAM.
      Notice that Array elements occupy consecutive addresses, enabling direct index math, while Linked List nodes
      can be anywhere — they're stitched together by pointer references.
    </p>

    <div class="visualization-block">
      <div class="viz-label">Memory Layout: Array vs Linked List (storing values 10, 20, 30)</div>
      <div class="memory-layout">
        <div class="mem-column">
          <div class="mem-title">Array (Contiguous Memory)</div>
          <div class="mem-row">
            <div class="mem-addr">0x1000</div>
            <div class="mem-cell array-cell">10</div>
          </div>
          <div class="mem-row">
            <div class="mem-addr">0x1004</div>
            <div class="mem-cell array-cell">20</div>
          </div>
          <div class="mem-row">
            <div class="mem-addr">0x1008</div>
            <div class="mem-cell array-cell">30</div>
          </div>
          <div class="mem-note">Access arr[2] = 0x1000 + 2×4 = 0x1008 ✓ O(1)</div>
        </div>
        <div class="mem-column">
          <div class="mem-title">Linked List (Scattered Memory)</div>
          <div class="mem-row">
            <div class="mem-addr">0x2F10</div>
            <div class="mem-cell linked-cell">10 | → 0x5A40</div>
          </div>
          <div class="mem-row gap-row">
            <div class="mem-addr">...</div>
            <div class="mem-cell empty-cell">other data</div>
          </div>
          <div class="mem-row">
            <div class="mem-addr">0x5A40</div>
            <div class="mem-cell linked-cell">20 | → 0x8C02</div>
          </div>
          <div class="mem-row gap-row">
            <div class="mem-addr">...</div>
            <div class="mem-cell empty-cell">other data</div>
          </div>
          <div class="mem-row">
            <div class="mem-addr">0x8C02</div>
            <div class="mem-cell linked-cell">30 | → null</div>
          </div>
          <div class="mem-note">Access node[2]: must follow pointer chain → O(N)</div>
        </div>
      </div>
    </div>

    <h4>The Big Picture: Data Structure Taxonomy</h4>
    <p>
      This taxonomy diagram shows all the major data structures you will study, and how they're related to each other.
      Notice how everything branches from the concept of "organizing data" into linear and non-linear families.
    </p>
  </section>

  <section class="lesson-section">
    <h3>Java Implementation: Observing Data Structure Behavior</h3>
    <p>
      Let's look at a practical example demonstrating how different data structures approach the same task — storing
      and retrieving a list of student names — and how their behavior differs:
    </p>
    <pre><code>import java.util.*;

public class DataStructureDemo {

    public static void main(String[] args) {

        // 1. ARRAY — fixed size, fast random access
        // Must declare size upfront. Cannot grow dynamically.
        String[] arrayDemo = new String[3];
        arrayDemo[0] = "Alice";    // Direct assignment to index 0 → O(1)
        arrayDemo[1] = "Bob";      // Direct assignment to index 1 → O(1)
        arrayDemo[2] = "Charlie";  // Direct assignment to index 2 → O(1)
        System.out.println("Array element at index 1: " + arrayDemo[1]); // O(1) access

        // 2. ARRAYLIST — dynamic array (resizes automatically)
        // Backed by an internal array. Doubles when full.
        List&lt;String&gt; listDemo = new ArrayList&lt;&gt;();
        listDemo.add("Alice");     // Adds to end → Amortized O(1)
        listDemo.add("Bob");
        listDemo.add("Charlie");
        listDemo.add("Diana");     // If internal array is full, it resizes (copies) → O(N) occasionally
        System.out.println("List element at index 2: " + listDemo.get(2)); // O(1) access

        // 3. STACK — Last-In, First-Out (LIFO)
        // Think: stack of plates. Last plate placed = first plate removed.
        Deque&lt;String&gt; stackDemo = new ArrayDeque&lt;&gt;();
        stackDemo.push("First");   // Push to top → O(1)
        stackDemo.push("Second");
        stackDemo.push("Third");
        System.out.println("Stack top (peek): " + stackDemo.peek());  // "Third" — O(1)
        System.out.println("Popped from stack: " + stackDemo.pop());  // "Third" removed — O(1)

        // 4. QUEUE — First-In, First-Out (FIFO)
        // Think: checkout line. First person in = first person served.
        Queue&lt;String&gt; queueDemo = new LinkedList&lt;&gt;();
        queueDemo.offer("Alice");  // Enqueue at rear → O(1)
        queueDemo.offer("Bob");
        queueDemo.offer("Charlie");
        System.out.println("Queue front (peek): " + queueDemo.peek());   // "Alice" — O(1)
        System.out.println("Dequeued from queue: " + queueDemo.poll());  // "Alice" removed — O(1)

        // 5. HASHMAP — Key-Value pairs, near-instant lookup
        // Think: dictionary. Key = word, Value = definition.
        Map&lt;String, Integer&gt; mapDemo = new HashMap&lt;&gt;();
        mapDemo.put("Alice", 95);    // Store key-value pair → Amortized O(1)
        mapDemo.put("Bob", 87);
        mapDemo.put("Charlie", 91);
        System.out.println("Bob's score: " + mapDemo.get("Bob"));  // O(1) lookup by key

        // 6. TREESET — Sorted, unique elements
        // Backed by a Red-Black Tree. Always maintains sorted order.
        Set&lt;Integer&gt; treeSetDemo = new TreeSet&lt;&gt;();
        treeSetDemo.add(50);
        treeSetDemo.add(30);
        treeSetDemo.add(80);
        treeSetDemo.add(10);
        System.out.println("TreeSet (always sorted): " + treeSetDemo);  // [10, 30, 50, 80]
    }
}

/*
 * OUTPUT:
 * Array element at index 1: Bob
 * List element at index 2: Charlie
 * Stack top (peek): Third
 * Popped from stack: Third
 * Queue front (peek): Alice
 * Dequeued from queue: Alice
 * Bob's score: 87
 * TreeSet (always sorted): [10, 30, 50, 80]
 */</code></pre>
    <p>
      Notice how each data structure gives us a different "view" and access pattern for the same kind of data.
      The choice of which to use depends entirely on what operations your program needs to perform most frequently.
    </p>
  </section>

  <section class="lesson-section">
    <h3>Dry Run: Step-by-Step Execution Trace</h3>
    <p>Let's trace what happens internally when we use a <code>Stack</code> (using <code>ArrayDeque</code>):</p>

    <div class="drySrun-block">
      <div class="step">
        <span class="step-num">Step 1</span>
        <code>stackDemo.push("First")</code>
        <p>Internal array: <code>["First"]</code> — top pointer at index 0</p>
      </div>
      <div class="step">
        <span class="step-num">Step 2</span>
        <code>stackDemo.push("Second")</code>
        <p>Internal array: <code>["First", "Second"]</code> — top pointer at index 1</p>
      </div>
      <div class="step">
        <span class="step-num">Step 3</span>
        <code>stackDemo.push("Third")</code>
        <p>Internal array: <code>["First", "Second", "Third"]</code> — top pointer at index 2</p>
      </div>
      <div class="step">
        <span class="step-num">Step 4</span>
        <code>stackDemo.peek()</code>
        <p>Returns element at top index (2) → "Third". Array unchanged.</p>
      </div>
      <div class="step">
        <span class="step-num">Step 5</span>
        <code>stackDemo.pop()</code>
        <p>Removes and returns element at top index (2) → "Third". Array: <code>["First", "Second"]</code>. Top pointer moves to index 1.</p>
      </div>
    </div>
  </section>

  <section class="lesson-section">
    <h3>Time and Space Complexity Overview</h3>
    <p>Here's a quick reference for the fundamental operations across core data structures:</p>

    <table class="complexity-table">
      <thead>
        <tr>
          <th>Data Structure</th>
          <th>Access</th>
          <th>Search</th>
          <th>Insertion</th>
          <th>Deletion</th>
          <th>Space</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Array</td>
          <td class="good">O(1)</td>
          <td class="ok">O(N)</td>
          <td class="bad">O(N)</td>
          <td class="bad">O(N)</td>
          <td class="good">O(N)</td>
        </tr>
        <tr>
          <td>Linked List</td>
          <td class="bad">O(N)</td>
          <td class="bad">O(N)</td>
          <td class="good">O(1)*</td>
          <td class="good">O(1)*</td>
          <td class="ok">O(N)</td>
        </tr>
        <tr>
          <td>Stack</td>
          <td class="bad">O(N)</td>
          <td class="bad">O(N)</td>
          <td class="good">O(1)</td>
          <td class="good">O(1)</td>
          <td class="good">O(N)</td>
        </tr>
        <tr>
          <td>Queue</td>
          <td class="bad">O(N)</td>
          <td class="bad">O(N)</td>
          <td class="good">O(1)</td>
          <td class="good">O(1)</td>
          <td class="good">O(N)</td>
        </tr>
        <tr>
          <td>Hash Map</td>
          <td>N/A</td>
          <td class="good">O(1) avg</td>
          <td class="good">O(1) avg</td>
          <td class="good">O(1) avg</td>
          <td class="ok">O(N)</td>
        </tr>
        <tr>
          <td>Binary Search Tree</td>
          <td class="ok">O(log N)</td>
          <td class="ok">O(log N)</td>
          <td class="ok">O(log N)</td>
          <td class="ok">O(log N)</td>
          <td class="ok">O(N)</td>
        </tr>
      </tbody>
    </table>
    <p><em>* At known position, with reference to node already in hand</em></p>
    <p>
      The goal when choosing a data structure is to minimize the complexity of your most frequent operations.
      If you search 90% of the time, a HashMap is usually the best choice. If you insert/delete from both ends
      frequently, a Deque wins. There's no single "best" structure — it always depends on your use case.
    </p>
  </section>

  <section class="lesson-section">
    <h3>Advantages and Disadvantages</h3>
    <h4>Linear Structures</h4>
    <ul>
      <li><strong>Advantages:</strong> Simple to implement, traverse, and reason about. Memory-efficient for sequential access.</li>
      <li><strong>Disadvantages:</strong> Arrays have fixed sizes; linked lists have slow random access; both have linear search time without sorting.</li>
    </ul>
    <h4>Non-Linear Structures</h4>
    <ul>
      <li><strong>Advantages:</strong> Model complex relationships naturally. Provide O(log N) or better operations.</li>
      <li><strong>Disadvantages:</strong> More complex to implement and maintain. Extra memory for pointers/references. Harder to serialize and store.</li>
    </ul>
  </section>

  <section class="lesson-section">
    <h3>Common Beginner Mistakes</h3>
    <ul>
      <li>
        <strong>Choosing Array when size is unknown:</strong> If data grows dynamically, use <code>ArrayList</code>.
        Fixed arrays waste memory if oversized or crash if undersized.
      </li>
      <li>
        <strong>Using <code>LinkedList</code> for random access:</strong> If you frequently access elements by index,
        <code>ArrayList</code> is faster. <code>LinkedList</code> excels at frequent head/tail insertions/removals.
      </li>
      <li>
        <strong>Ignoring space complexity:</strong> A data structure with O(1) time can still be catastrophically slow
        if it exhausts RAM and triggers garbage collection or swapping. Always consider memory trade-offs.
      </li>
      <li>
        <strong>Premature optimization:</strong> Don't jump straight to complex structures like Segment Trees for small datasets.
        Start simple — measure first, optimize if needed.
      </li>
      <li>
        <strong>Confusing ADT with implementation:</strong> <code>List</code> is an ADT (interface). <code>ArrayList</code>
        and <code>LinkedList</code> are implementations. A good engineer thinks in ADTs and chooses implementations based on
        performance requirements.
      </li>
    </ul>
  </section>

  <section class="lesson-section">
    <h3>Interview Preparation</h3>

    <div class="interview-qa">
      <div class="qa-item">
        <h4>Q1: What is the difference between an Array and an ArrayList in Java?</h4>
        <p>
          <strong>Answer:</strong> An Array is a fixed-size, primitive data structure allocated at compile time.
          Its size cannot change after creation. An <code>ArrayList</code> is a dynamic, resizable array backed by
          an internal array. When the internal array fills up, <code>ArrayList</code> creates a new array of 1.5× the
          current size and copies all elements. Arrays can hold primitives directly (<code>int[]</code>), while
          <code>ArrayList</code> requires wrapper types (<code>Integer</code>). Arrays offer slightly faster access
          due to no method call overhead; <code>ArrayList</code> offers flexibility.
        </p>
      </div>

      <div class="qa-item">
        <h4>Q2: When would you use a Stack vs. a Queue?</h4>
        <p>
          <strong>Answer:</strong> Use a <strong>Stack (LIFO)</strong> when the order of processing must be reversed — the last item added
          is the first processed. Examples: browser back button (last visited page pops first), undo operations,
          expression parsing, function call management (call stack), depth-first search (DFS).
          Use a <strong>Queue (FIFO)</strong> when processing must happen in arrival order — first item added is first processed.
          Examples: print job scheduling, request handling in web servers, breadth-first search (BFS),
          task scheduling in operating systems.
        </p>
      </div>

      <div class="qa-item">
        <h4>Q3: What is an Abstract Data Type (ADT)?</h4>
        <p>
          <strong>Answer:</strong> An ADT defines a data model by specifying the type of data, the operations
          that can be performed on it, and the behavior of those operations — <em>without</em> specifying how
          they're implemented. It's a logical description, not a concrete implementation. For example, the
          <em>Stack ADT</em> specifies push, pop, peek, isEmpty operations and their expected behavior.
          Java's <code>Deque</code> interface is the ADT; <code>ArrayDeque</code> and <code>LinkedList</code>
          are two different implementations of that ADT.
        </p>
      </div>

      <div class="qa-item">
        <h4>Q4: Why is HashMap lookup O(1) and what can degrade it?</h4>
        <p>
          <strong>Answer:</strong> HashMap computes a hash code for the key and uses it to directly calculate
          a bucket index, giving O(1) average lookup. This degrades to O(N) in the worst case when all keys
          hash to the same bucket (causing collisions), or in Java's case O(log N) after the bucket converts
          from a linked list to a Red-Black tree (when bucket size exceeds 8 elements). A poorly designed
          <code>hashCode()</code> method that returns the same value for all keys would cause this.
        </p>
      </div>

      <div class="qa-item">
        <h4>Q5: What's the difference between linear and non-linear data structures?</h4>
        <p>
          <strong>Answer:</strong> In linear data structures, elements are arranged sequentially where each
          element has exactly one predecessor and one successor (except the first and last). Memory is typically
          laid out in one dimension. Examples: arrays, linked lists, stacks, queues. In non-linear data
          structures, elements are arranged hierarchically or in a network/mesh pattern. An element can have
          multiple successors (children). They naturally model hierarchical or relational data. Examples:
          trees, graphs, heaps. Non-linear structures generally enable more efficient search operations at
          the cost of more complex implementation and memory overhead for pointers.
        </p>
      </div>
    </div>
  </section>

  <section class="lesson-section">
    <h3>Practice Problems</h3>

    <h4>Easy Level</h4>
    <ol>
      <li>
        <strong>Reverse an Array:</strong> Given an integer array <code>[1, 2, 3, 4, 5]</code>, reverse it
        in-place (without using extra memory for another array). Expected output: <code>[5, 4, 3, 2, 1]</code>.
      </li>
      <li>
        <strong>Balanced Parentheses:</strong> Write a method that takes a string of parentheses like
        <code>"((()))"</code> or <code>"(()"</code> and returns true if all parentheses are properly balanced
        and nested. Use a Stack.
      </li>
      <li>
        <strong>First Non-Repeating Character:</strong> Given a string like <code>"aabccd"</code>, find the
        first character that doesn't repeat (<code>'b'</code> in this case). Use a LinkedHashMap to preserve
        insertion order.
      </li>
    </ol>

    <h4>Medium Level</h4>
    <ol>
      <li>
        <strong>Implement a Queue Using Two Stacks:</strong> Design a class <code>MyQueue</code> that implements
        FIFO queue operations (<code>enqueue</code>, <code>dequeue</code>, <code>peek</code>) using only two
        Stack data structures internally.
      </li>
      <li>
        <strong>Find All Pairs with Target Sum:</strong> Given an unsorted array of integers and a target sum,
        find all pairs that add up to the target. Solve it in O(N) time using a HashSet.
      </li>
      <li>
        <strong>Group Anagrams:</strong> Given a list of strings like <code>["eat", "tea", "tan", "ate", "nat", "bat"]</code>,
        group them into lists of anagrams. Use a HashMap where the key is the sorted version of each word.
      </li>
    </ol>

    <h4>Hard Level</h4>
    <ol>
      <li>
        <strong>LRU Cache Implementation:</strong> Implement an LRU (Least Recently Used) cache with O(1)
        get and put operations. The cache should evict the least recently used item when capacity is reached.
        Hint: Use a combination of a HashMap and a Doubly Linked List.
      </li>
      <li>
        <strong>Sliding Window Maximum:</strong> Given an array and a window of size K that slides from left
        to right, return the maximum value in each window position. Solve in O(N) time using a Deque.
        Example: array = [1,3,-1,-3,5,3,6,7], K=3 → output: [3,3,5,5,6,7].
      </li>
    </ol>
  </section>

  <section class="lesson-section">
    <h3>Coding Assignment</h3>
    <div class="assignment-block">
      <h4>Assignment: Build a Student Grade Tracker</h4>
      <p>
        Create a Java program called <code>StudentGradeTracker</code> that manages student records using
        appropriate data structures. Your solution must demonstrate understanding of when to use different structures:
      </p>
      <ol>
        <li>Use a <code>HashMap&lt;String, List&lt;Integer&gt;&gt;</code> to store each student's name mapped to their list of quiz scores.</li>
        <li>Implement a method <code>addScore(String studentName, int score)</code> that adds a score to a student's record. If the student doesn't exist yet, create their entry.</li>
        <li>Implement a method <code>getAverage(String studentName)</code> that returns the student's average score.</li>
        <li>Implement a method <code>getTopStudents(int topN)</code> that returns the top N students by average score, sorted in descending order. Use a <code>TreeMap</code> or <code>PriorityQueue</code> for this.</li>
        <li>Implement a method <code>getRecentScore(String studentName)</code> that returns the most recently added score (Stack concept — last in, first out).</li>
        <li>Implement a method <code>processGradingQueue(Queue&lt;String&gt; pendingStudents)</code> that processes students for grading in the order they submitted their work.</li>
      </ol>
      <p>
        <strong>Bonus:</strong> Add a method <code>getClassRanking()</code> that returns all students sorted by average score using a data structure that maintains sorted order automatically.
      </p>
      <p>
        <strong>Expected learning outcome:</strong> You will practice selecting the right data structure for each sub-problem based on the access patterns required.
      </p>
    </div>
  </section>

  <section class="lesson-summary">
    <h3>Summary</h3>
    <ul>
      <li>A <strong>data structure</strong> is an organized way to store data in memory to enable efficient operations.</li>
      <li>Data structures are classified as <strong>Linear</strong> (sequential: arrays, lists, stacks, queues) or <strong>Non-Linear</strong> (hierarchical: trees, graphs).</li>
      <li><strong>Arrays</strong> offer O(1) random access via contiguous memory but have fixed size and O(N) insertions.</li>
      <li><strong>Linked Lists</strong> offer dynamic sizing and O(1) head insertion but O(N) random access.</li>
      <li><strong>Stacks (LIFO)</strong> are used for undo operations, parsing, and DFS. <strong>Queues (FIFO)</strong> are used for task scheduling, BFS, and buffering.</li>
      <li><strong>HashMaps</strong> provide average O(1) lookup, insertion, and deletion — ideal for key-value associations.</li>
      <li>An <strong>Abstract Data Type (ADT)</strong> defines what operations a structure supports; a data structure is the concrete implementation.</li>
      <li>Choosing the right data structure directly determines your program's time and space efficiency.</li>
      <li>In interviews, always justify your data structure choice by explaining the time complexity trade-offs.</li>
    </ul>
  </section>

</article>

<style>
.lesson-content { font-family: inherit; color: var(--color-text-primary); line-height: 1.7; }
.lesson-content h2 { font-size: 22px; font-weight: 500; margin: 1.5rem 0 1rem; }
.lesson-content h3 { font-size: 18px; font-weight: 500; margin: 2rem 0 0.75rem; border-bottom: 0.5px solid var(--color-border-tertiary); padding-bottom: 0.4rem; }
.lesson-content h4 { font-size: 16px; font-weight: 500; margin: 1.25rem 0 0.5rem; }
.lesson-content p { margin: 0.75rem 0; }
.lesson-content ul, .lesson-content ol { margin: 0.5rem 0 0.5rem 1.5rem; }
.lesson-content li { margin: 0.4rem 0; }
.lesson-content code { background: var(--color-background-secondary); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 13px; border: 0.5px solid var(--color-border-tertiary); }
.lesson-content pre { background: var(--color-background-secondary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-md); padding: 1.25rem; overflow-x: auto; margin: 1rem 0; }
.lesson-content pre code { background: none; border: none; padding: 0; font-size: 13px; line-height: 1.6; }
.lesson-section { margin: 2rem 0; }
.lesson-intro { background: var(--color-background-secondary); border-left: 3px solid var(--color-border-info); padding: 1rem 1.25rem; border-radius: 0 var(--border-radius-md) var(--border-radius-md) 0; margin-bottom: 2rem; }
.memory-layout { display: flex; gap: 2rem; flex-wrap: wrap; margin: 1rem 0; }
.mem-column { flex: 1; min-width: 260px; background: var(--color-background-secondary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 1rem; }
.mem-title { font-size: 14px; font-weight: 500; margin-bottom: 0.75rem; color: var(--color-text-primary); }
.mem-row { display: flex; align-items: center; gap: 0.5rem; margin: 0.3rem 0; }
.mem-addr { font-family: var(--font-mono); font-size: 11px; color: var(--color-text-secondary); width: 60px; }
.mem-cell { flex: 1; padding: 0.3rem 0.6rem; border-radius: 4px; font-family: var(--font-mono); font-size: 12px; border: 0.5px solid var(--color-border-secondary); }
.array-cell { background: #E6F1FB; color: #0C447C; border-color: #85B7EB; }
.linked-cell { background: #E1F5EE; color: #085041; border-color: #5DCAA5; }
.empty-cell { background: var(--color-background-primary); color: var(--color-text-tertiary); }
.gap-row { opacity: 0.5; }
.mem-note { font-size: 12px; color: var(--color-text-secondary); margin-top: 0.5rem; font-style: italic; }
.complexity-table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 1rem 0; }
.complexity-table th { background: var(--color-background-secondary); padding: 0.5rem 0.75rem; text-align: left; border: 0.5px solid var(--color-border-secondary); font-weight: 500; }
.complexity-table td { padding: 0.45rem 0.75rem; border: 0.5px solid var(--color-border-tertiary); }
.good { color: var(--color-text-success); font-weight: 500; }
.ok { color: var(--color-text-warning); font-weight: 500; }
.bad { color: var(--color-text-danger); font-weight: 500; }
.drySrun-block { border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); overflow: hidden; margin: 1rem 0; }
.step { padding: 0.75rem 1rem; border-bottom: 0.5px solid var(--color-border-tertiary); }
.step:last-child { border-bottom: none; }
.step-num { background: var(--color-background-info); color: var(--color-text-info); font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 20px; margin-right: 8px; }
.step p { margin: 0.3rem 0 0; font-size: 13px; color: var(--color-text-secondary); }
.interview-qa { margin: 1rem 0; }
.qa-item { background: var(--color-background-secondary); border-radius: var(--border-radius-md); padding: 1rem 1.25rem; margin: 0.75rem 0; border: 0.5px solid var(--color-border-tertiary); }
.qa-item h4 { margin: 0 0 0.5rem; color: var(--color-text-primary); font-size: 14px; }
.qa-item p { margin: 0; font-size: 14px; color: var(--color-text-secondary); }
.quiz-section { margin: 1rem 0; }
.quiz-q { padding: 1rem; border-bottom: 0.5px solid var(--color-border-tertiary); }
.quiz-q p { margin: 0 0 0.5rem; }
.quiz-q ul { margin: 0.25rem 0 0.5rem 1rem; }
.quiz-q li { font-size: 14px; margin: 0.2rem 0; }
.explanation { font-size: 13px; color: var(--color-text-secondary); margin: 0.5rem 0 0; padding: 0.5rem 0.75rem; background: var(--color-background-secondary); border-radius: var(--border-radius-md); }
.assignment-block { background: var(--color-background-secondary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 1.25rem; margin: 1rem 0; }
.assignment-block h4 { margin: 0 0 0.75rem; }
.lesson-summary { background: var(--color-background-secondary); border-radius: var(--border-radius-lg); padding: 1.25rem 1.5rem; margin-top: 2rem; border: 0.5px solid var(--color-border-tertiary); }
.lesson-summary h3 { border-bottom: none; margin-top: 0; }
.visualization-block { margin: 1rem 0 1.5rem; }
.viz-label { font-size: 13px; font-weight: 500; color: var(--color-text-secondary); margin-bottom: 0.75rem; }
</style>`,
            quiz: {
          "questions": [
                    {
                              "questionText": "Which data structure is used to model a FIFO (First-In, First-Out) process?",
                              "options": [
                                        {
                                                  "text": "Stack",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "Queue",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "Array",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "HashMap",
                                                  "isCode": false
                                        }
                              ],
                              "correctAnswerIndex": 1,
                              "explanation": "Queue processes elements in the order they arrive. The first element added is the first to be removed, just like a real-world waiting line."
                    },
                    {
                              "questionText": "What is the time complexity of accessing an element at a specific index in an Array?",
                              "options": [
                                        {
                                                  "text": "O(N)",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "O(log N)",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "O(1)",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "O(N log N)",
                                                  "isCode": false
                                        }
                              ],
                              "correctAnswerIndex": 2,
                              "explanation": "Arrays are contiguous in memory. The address of any element can be computed directly: BaseAddress + Index × ElementSize, requiring exactly one calculation regardless of array size."
                    },
                    {
                              "questionText": "Which of the following is a non-linear data structure?",
                              "options": [
                                        {
                                                  "text": "Stack",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "Linked List",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "Binary Tree",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "Queue",
                                                  "isCode": false
                                        }
                              ],
                              "correctAnswerIndex": 2,
                              "explanation": "A Binary Tree is non-linear because each node can have up to two children — the elements are arranged hierarchically, not in a single sequence."
                    },
                    {
                              "questionText": "What distinguishes an Abstract Data Type (ADT) from a data structure?",
                              "options": [
                                        {
                                                  "text": "ADTs define implementation details",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "ADTs define behavior/operations without specifying implementation",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "ADTs only work with primitive types",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "ADTs are faster than data structures",
                                                  "isCode": false
                                        }
                              ],
                              "correctAnswerIndex": 1,
                              "explanation": "An ADT is a logical model specifying what operations exist and how they behave. A data structure is the concrete implementation. Stack is an ADT; ArrayDeque is a data structure implementing it."
                    },
                    {
                              "questionText": "Which data structure provides the best performance for frequent insertion and deletion at both ends?",
                              "options": [
                                        {
                                                  "text": "Array",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "ArrayList",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "Deque (Double-Ended Queue)",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "TreeSet",
                                                  "isCode": false
                                        }
                              ],
                              "correctAnswerIndex": 2,
                              "explanation": "A Deque supports O(1) insertion and removal at both the head and tail. Arrays and ArrayLists require O(N) shifting for head insertions."
                    },
                    {
                              "questionText": "What happens to an ArrayList in Java when its internal array is full?",
                              "options": [
                                        {
                                                  "text": "Throws an exception",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "Creates a new array of 1.5× the size and copies all elements",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "Stops accepting new elements",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "Doubles capacity and never copies",
                                                  "isCode": false
                                        }
                              ],
                              "correctAnswerIndex": 1,
                              "explanation": "Java's ArrayList grows by creating a new backing array at 1.5× the current capacity and copying all existing elements. This makes occasional insertions O(N), but amortized over many insertions, the average cost is O(1)."
                    },
                    {
                              "questionText": "In which memory region are objects (instances) of data structures stored in Java?",
                              "options": [
                                        {
                                                  "text": "Stack Memory",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "Method Area",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "Heap Memory",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "Code Cache",
                                                  "isCode": false
                                        }
                              ],
                              "correctAnswerIndex": 2,
                              "explanation": "All objects in Java — including data structure instances like ArrayList, LinkedList, and HashMap — are allocated on the Heap, managed by the garbage collector."
                    },
                    {
                              "questionText": "What is the worst-case time complexity of lookup in a HashMap when all keys hash to the same bucket?",
                              "options": [
                                        {
                                                  "text": "O(1)",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "O(log N) or O(N)",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "O(N log N)",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "O(N²)",
                                                  "isCode": false
                                        }
                              ],
                              "correctAnswerIndex": 1,
                              "explanation": "When all keys collide into the same bucket, the bucket becomes a linked list of N entries, degrading lookup to O(N). In Java 8+, after 8 entries, the bucket converts to a Red-Black Tree, making worst-case O(log N)."
                    },
                    {
                              "questionText": "Which scenario is best suited for a Stack data structure?",
                              "options": [
                                        {
                                                  "text": "Processing print jobs in order of arrival",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "Finding the shortest path in a graph",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "Implementing an undo/redo feature in a text editor",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "Storing sorted student records",
                                                  "isCode": false
                                        }
                              ],
                              "correctAnswerIndex": 2,
                              "explanation": "Undo/redo is a classic Stack use case. Each action is pushed onto the stack. Ctrl+Z pops the last action and reverses it. LIFO perfectly models \"undo the most recent thing\"."
                    },
                    {
                              "questionText": "What is the main advantage of a Linked List over an Array?",
                              "options": [
                                        {
                                                  "text": "Faster random access by index",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "Dynamic size — no wasted memory for unused slots, O(1) head insertion",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "Better cache performance",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "Simpler implementation",
                                                  "isCode": false
                                        }
                              ],
                              "correctAnswerIndex": 1,
                              "explanation": "Linked Lists grow and shrink dynamically — no memory is wasted for unused capacity. Insertion and deletion at the head (or any known position) runs in O(1) since no shifting is required. Arrays have better cache performance due to contiguous memory but suffer from fixed sizes and O(N) insertions."
                    }
          ]
}
          },
          {
            title: 'Why are Data Structures Important?',
            slug: 'why-data-structures-important',
            order: 2,
            content: `<article class="lesson-content">

  <section class="lesson-intro">
    <h2>Why Are Data Structures Important?</h2>
    <p>
      You might be tempted to think: "I can just use a list or array for everything — why does it matter?"
      This is one of the most common misconceptions in early programming. The answer becomes crystal clear
      when you look at scale. The difference between a poorly chosen and well-chosen data structure is often
      the difference between <em>seconds and hours</em> — and at internet scale, between <em>milliseconds and timeouts</em>.
    </p>
    <p>
      This lesson explores the "why" behind data structures through real numbers, real companies, and concrete
      examples that demonstrate why the right data structure choice is a career-defining skill.
    </p>
  </section>

  <section class="lesson-section">
    <h3>Real-Life Analogy: Searching for a Name in a Phone Book</h3>
    <p>
      Imagine two scenarios for finding "Priya Sharma" in a phone book with 1,000,000 names:
    </p>
    <ul>
      <li>
        <strong>Scenario A — Unsorted list:</strong> You read names one by one from the beginning.
        In the worst case, you read all 1,000,000 names. Average case: 500,000 reads.
        At 1 read per millisecond: roughly <strong>8 minutes</strong>.
      </li>
      <li>
        <strong>Scenario B — Sorted + Binary Search:</strong> You open the middle of the book.
        Is "Sharma" before or after "M"? After. You eliminate the entire first half.
        You repeat this 20 times for 1,000,000 entries (log₂ 1,000,000 ≈ 20).
        At 1 read per millisecond: roughly <strong>20 milliseconds</strong>.
      </li>
    </ul>
    <p>
      <strong>Result: 24,000× faster</strong>, just by using the right data structure (sorted array + binary search
      instead of unsorted list + linear search). Now multiply this by billions of queries per day, and you
      understand why companies like Google obsess over data structure choices.
    </p>
  </section>

  <section class="lesson-section">
    <h3>Core Theory: The Scale Problem</h3>
    <p>
      When programs handle small datasets (10 records, 100 records), almost any approach works because modern
      computers execute billions of operations per second. But real-world applications operate at scale:
    </p>
    <ul>
      <li>Facebook stores profiles for <strong>3 billion</strong> users</li>
      <li>Google indexes over <strong>100 billion</strong> web pages</li>
      <li>Amazon's warehouse system tracks <strong>350 million+</strong> products</li>
      <li>WhatsApp processes <strong>100 billion</strong> messages per day</li>
    </ul>
    <p>
      At this scale, an algorithm running in O(N²) time instead of O(N log N) time isn't just slower — it
      can make the difference between a system that works and one that's completely unusable.
    </p>

    <h4>The Big-O Reality Check</h4>
    <p>
      Let's visualize what different complexities mean with a concrete dataset of 1,000,000 (one million) records,
      assuming 1 billion operations per second (a modern CPU):
    </p>

    <table class="complexity-table">
      <thead>
        <tr>
          <th>Complexity</th>
          <th>Operations (N=1,000,000)</th>
          <th>Time at 10⁹ ops/sec</th>
          <th>Example</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="mono">O(1)</td>
          <td>1</td>
          <td class="good">1 nanosecond</td>
          <td>HashMap lookup</td>
        </tr>
        <tr>
          <td class="mono">O(log N)</td>
          <td>~20</td>
          <td class="good">20 nanoseconds</td>
          <td>Binary search</td>
        </tr>
        <tr>
          <td class="mono">O(N)</td>
          <td>1,000,000</td>
          <td class="ok">1 millisecond</td>
          <td>Linear scan</td>
        </tr>
        <tr>
          <td class="mono">O(N log N)</td>
          <td>~20,000,000</td>
          <td class="ok">20 milliseconds</td>
          <td>Merge Sort</td>
        </tr>
        <tr>
          <td class="mono">O(N²)</td>
          <td>1,000,000,000,000</td>
          <td class="bad">16.7 minutes</td>
          <td>Bubble Sort</td>
        </tr>
        <tr>
          <td class="mono">O(2ᴺ)</td>
          <td>2^1,000,000</td>
          <td class="bad">Longer than universe age</td>
          <td>Naive subset search</td>
        </tr>
      </tbody>
    </table>

    <p>
      Notice that O(N²) turns 1 millisecond into 16 minutes for just 1 million records.
      At 10 million records, that same O(N²) algorithm would take <strong>27 hours</strong>.
      This is why choosing the right data structure and algorithm isn't premature optimization — it's engineering.
    </p>

    <h4>Real-World Impact: Case Studies</h4>

    <h5>Case 1 — Contact Search on a Smartphone</h5>
    <p>
      Without sorted data + binary search: finding a contact in 1,000 names requires scanning up to 1,000 entries.
      With sorted storage + binary search: maximum 10 comparisons. At 100ms latency difference per search,
      and 20 searches per day across 3 billion smartphones: that's <strong>600 million seconds of human time saved daily</strong>.
    </p>

    <h5>Case 2 — Routing the Internet</h5>
    <p>
      Every time you open a website, your request travels through dozens of routers. Each router must find
      the next hop for your packet in milliseconds. Routers use <strong>Trie data structures</strong> to look up
      destination IP addresses in their routing tables. Without Tries, routing would degrade from O(log N)
      to O(N), making internet routing catastrophically slow.
    </p>

    <h5>Case 3 — Autocomplete in Search Engines</h5>
    <p>
      When you type "java" in Google's search bar and see suggestions instantly, that's powered by
      <strong>Trie and Ternary Search Tree</strong> data structures that store billions of search queries
      and retrieve prefix matches in O(L) time (where L is your query length). A naive approach using
      string comparison across billions of queries would take seconds — making autocomplete useless.
    </p>

    <h5>Case 4 — Social Network "Degrees of Separation"</h5>
    <p>
      LinkedIn's "How are you connected?" feature uses <strong>Graph data structures</strong> with BFS traversal
      to find the shortest connection path between two people in a network of 900 million+ users.
      Without a Graph, modeling these connections would be impossible.
    </p>
  </section>

  <section class="lesson-section">
    <h3>Visual Explanation: Performance Comparison</h3>
    <p>
      The chart below shows how the same "find an element" operation scales across different approaches.
      Notice how linear search (O(N)) quickly becomes impractical, while binary search (O(log N)) and
      hash map lookup (O(1)) remain fast even at huge scales.
    </p>

    <div class="perf-chart-wrapper">
      <div class="chart-label">Operations needed to find one element (lower is better)</div>
      <div class="chart-bars">
        <div class="bar-group">
          <div class="bar-label">100 records</div>
          <div class="bar-row"><span class="bar-name">Linear Search</span><div class="bar-fill" style="width: 100px; background: #E24B4A">100</div></div>
          <div class="bar-row"><span class="bar-name">Binary Search</span><div class="bar-fill" style="width: 7px; background: #1D9E75">7</div></div>
          <div class="bar-row"><span class="bar-name">HashMap</span><div class="bar-fill" style="width: 1px; background: #534AB7">~1</div></div>
        </div>
        <div class="bar-group">
          <div class="bar-label">10,000 records</div>
          <div class="bar-row"><span class="bar-name">Linear Search</span><div class="bar-fill bar-truncated" style="width: 200px; background: #E24B4A">10,000 →</div></div>
          <div class="bar-row"><span class="bar-name">Binary Search</span><div class="bar-fill" style="width: 13px; background: #1D9E75">13</div></div>
          <div class="bar-row"><span class="bar-name">HashMap</span><div class="bar-fill" style="width: 1px; background: #534AB7">~1</div></div>
        </div>
        <div class="bar-group">
          <div class="bar-label">1,000,000 records</div>
          <div class="bar-row"><span class="bar-name">Linear Search</span><div class="bar-fill bar-truncated" style="width: 200px; background: #E24B4A">1,000,000 →</div></div>
          <div class="bar-row"><span class="bar-name">Binary Search</span><div class="bar-fill" style="width: 20px; background: #1D9E75">20</div></div>
          <div class="bar-row"><span class="bar-name">HashMap</span><div class="bar-fill" style="width: 1px; background: #534AB7">~1</div></div>
        </div>
      </div>
      <div class="chart-legend">
        <span class="legend-item"><span style="background:#E24B4A"></span>Linear Search (O(N))</span>
        <span class="legend-item"><span style="background:#1D9E75"></span>Binary Search (O(log N))</span>
        <span class="legend-item"><span style="background:#534AB7"></span>HashMap (O(1))</span>
      </div>
    </div>
  </section>

  <section class="lesson-section">
    <h3>Advantages and Disadvantages</h3>
    <p>Choosing data structures is always about trade-offs:</p>
    <ul>
      <li><strong>Arrays / Lists:</strong> Easy to use, but poor search times unless sorted.</li>
      <li><strong>Hash Maps:</strong> Fastest lookup (O(1)), but no sorting or order guarantees, and high memory overhead.</li>
      <li><strong>Trees / Graphs:</strong> Excel at relationships and hierarchy, but complex to implement and traverse.</li>
    </ul>
  </section>

  <section class="lesson-section">
    <h3>Common Beginner Mistakes</h3>
    <ul>
      <li>
        <strong>Defaulting to ArrayList for everything:</strong> If you need to frequently check if items exist,
        ArrayList is O(N) while HashSet is O(1).
      </li>
      <li>
        <strong>Ignoring size limits:</strong> If data gets very large, standard memory storage isn't enough,
        requiring out-of-core data structures (like B-Trees in databases).
      </li>
    </ul>
  </section>

  <section class="lesson-section">
    <h3>Practice Problems</h3>
    <ol>
      <li>
        <strong>Measure Search Time:</strong> Write a Java program that measures the millisecond difference
        between checking a value in an unsorted ArrayList of 100,000 integers vs a HashSet of the same size.
      </li>
      <li>
        <strong>Autocomplete Simulation:</strong> Design a basic program that uses a Prefix Trie or simple list
        filtering to suggest words as a user types.
      </li>
    </ol>
  </section>

  <section class="lesson-summary">
    <h3>Summary</h3>
    <ul>
      <li>Software performance depends directly on the complexity of its underlying data structures.</li>
      <li>Scale turns minor time differences (milliseconds) into hours or complete timeouts.</li>
      <li>Massive companies design their core systems around specialized structures to guarantee quick operations.</li>
      <li>A SDE's primary value is matching a problem's requirements to the correct data structure trade-offs.</li>
    </ul>
  </section>

</article>

<style>
.perf-chart-wrapper { background: var(--color-background-secondary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 1.25rem; margin: 1.5rem 0; }
.chart-label { font-size: 13px; font-weight: 500; color: var(--color-text-secondary); margin-bottom: 1rem; }
.chart-bars { display: flex; flex-direction: column; gap: 1.25rem; }
.bar-group { display: flex; flex-direction: column; gap: 0.4rem; }
.bar-label { font-size: 12px; font-weight: 500; color: var(--color-text-primary); }
.bar-row { display: flex; align-items: center; gap: 0.75rem; }
.bar-name { font-size: 11px; color: var(--color-text-secondary); width: 90px; }
.bar-fill { height: 16px; border-radius: 3px; font-size: 10px; color: #fff; display: flex; align-items: center; padding-left: 6px; font-family: var(--font-mono); }
.bar-truncated { position: relative; overflow: hidden; }
.bar-truncated::after { content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 20px; background: linear-gradient(to right, transparent, var(--color-background-secondary)); }
.chart-legend { display: flex; gap: 1.5rem; margin-top: 1.25rem; border-top: 0.5px solid var(--color-border-secondary); padding-top: 0.75rem; flex-wrap: wrap; }
.legend-item { display: flex; align-items: center; gap: 0.4rem; font-size: 11px; color: var(--color-text-secondary); }
.legend-item span { width: 12px; height: 12px; border-radius: 2px; }
</style>`,
            quiz: {
          "questions": [
                    {
                              "questionText": "Why is matching a problem to the correct data structure critical?",
                              "options": [
                                        {
                                                  "text": "To minimize time and space complexity during operations",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "To ensure the code compiles without exceptions",
                                                  "isCode": false
                                        },
                                        {
                                                  "text": "To convert primitive types to references",
                                                  "isCode": false
                                        }
                              ],
                              "correctAnswerIndex": 0,
                              "explanation": "Using the optimal data structure directly reduces operational complexities, speeding up executions and preserving memory."
                    }
          ]
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
