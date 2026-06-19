import React, { useEffect, useContext, useState } from 'react';
import { LearningContext } from '../context/LearningContext';
import { ProgressContext } from '../context/ProgressContext';
import VisualMemoryMap from '../components/lessons/VisualMemoryMap';
import QuizWidget from '../components/lessons/QuizWidget';
import './LessonViewer.css';

const fallbackAnalogies = {
  'java-syntax': {
    title: 'The Parking Lot Analogy',
    html: `
      <h4><i class="fa-solid fa-lightbulb" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i> The Parking Lot Analogy</h4>
      <p>Imagine the computer's memory (RAM) is a massive parking lot. A <strong>variable</strong> is a reserved parking slot with a name tag. The <strong>data type</strong> defines the size limit. You can't park a delivery truck in a scooter spot, and if you try, the compiler (parking attendant) blocks you!</p>
      <div class="analogy-alert">
        <p><strong>Primitives:</strong> Storing the value directly (like parking a bike in its spot).</p>
        <p><strong>References:</strong> Storing a ticket with a GPS coordinate pointing to a warehouse elsewhere (the Heap).</p>
      </div>
    `
  },
  'control-structures': {
    title: 'The Train Tracks and Thermostat',
    html: `
      <h4><i class="fa-solid fa-lightbulb" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i> The Train Tracks and Thermostat</h4>
      <p>Control structures dictate the flow of execution, like switches on a train track or automatic triggers in a smart home.</p>
      <div class="analogy-alert">
        <p><strong>Conditionals (if-else):</strong> Like an automated thermostat. If the temperature is above 24°C, turn on the AC. Else, keep it idle.</p>
        <p><strong>Loops (for/while):</strong> Like a security camera scanning the entry gate. It repeats the scan continuously <em>while</em> the system is powered on.</p>
      </div>
    `
  },
  'pseudo-code': {
    title: 'The Recipe Book',
    html: `
      <h4><i class="fa-solid fa-lightbulb" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i> The Recipe Book</h4>
      <p>Before a chef turns on the stove, they write down the steps of a recipe in plain, simple language. They don't write it in formal legal code or chemistry symbols—just simple steps like 'chop onion, stir, heat for 5 mins'.</p>
      <div class="analogy-alert">
        <p><strong>Pseudo Code:</strong> The recipe. It is language-agnostic and focused entirely on the logic of cooking, not the specific stove model (syntax).</p>
        <p><strong>Actual Code:</strong> The recipe translated to run on a specific model of an automated cooking machine.</p>
      </div>
    `
  },
  'java-functions': {
    title: 'The Calculator Button',
    html: `
      <h4><i class="fa-solid fa-lightbulb" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i> The Calculator Button</h4>
      <p>Instead of rebuilding the circuits to calculate square roots every time, a calculator wraps that complex math inside a single button labeled '√'. You press it, pass in a number, and it returns the result.</p>
      <div class="analogy-alert">
        <p><strong>Method (Function):</strong> The '√' button. It encapsulates a block of reusable code.</p>
        <p><strong>Arguments:</strong> The inputs you pass when pressing the button.</p>
        <p><strong>Return Value:</strong> The resulting output displayed on the screen.</p>
      </div>
    `
  },
  'oop-basics': {
    title: 'The Architect Blueprint',
    html: `
      <h4><i class="fa-solid fa-lightbulb" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i> The Architect Blueprint</h4>
      <p>An architect draws a single detailed blueprint of a house. The blueprint itself has no walls, roof, or furniture—it is just a design. From that single blueprint, builders can construct 50 physical houses in a colony.</p>
      <div class="analogy-alert">
        <p><strong>Class:</strong> The blueprint. It defines the structure and behavior of what a house should be.</p>
        <p><strong>Object (Instance):</strong> The physical houses built on the ground (allocated in Heap memory).</p>
        <p><strong>Constructor:</strong> The construction crew that instantiates the house and paints it.</p>
      </div>
    `
  },
  'compilation-mechanics': {
    title: 'The Translator and Interpreter',
    html: `
      <h4><i class="fa-solid fa-lightbulb" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i> The Translator and Interpreter</h4>
      <p>Imagine writing a book in English (Source Code), but the target audience only understands binary machine code. You have two options: translate the whole book in advance, or hire a live translator to read it line-by-line.</p>
      <div class="analogy-alert">
        <p><strong>Compilation:</strong> Translating the entire English book into a generic intermediate language (Bytecode) beforehand.</p>
        <p><strong>Interpretation:</strong> The JVM reading the bytecode and translating it to local machine language line-by-line during runtime.</p>
        <p><strong>JIT Compiler:</strong> Memorizing frequently spoken phrases (hotspots) so you don't have to translate them again.</p>
      </div>
    `
  },
  'jvm-stack-frame': {
    title: 'The Stack of Plates',
    html: `
      <h4><i class="fa-solid fa-lightbulb" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i> The Stack of Plates</h4>
      <p>Think of the Stack as a physical stack of dinner plates at a buffet. When a method is called, a new plate (frame) containing its variables is pushed to the top of the stack. You can only interact with the top plate.</p>
      <div class="analogy-alert">
        <p><strong>Method Call (Push):</strong> Placing a new plate on top of the stack.</p>
        <p><strong>Method Return (Pop):</strong> Removing the top plate when it finishes. Its variables vanish instantly, and the plate below is now active.</p>
      </div>
    `
  },
  'declaring-references': {
    title: 'The Remote Control and Television',
    html: `
      <h4><i class="fa-solid fa-lightbulb" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i> The Remote Control Analogy</h4>
      <p>To understand objects and references, think of a television set and its remote control.</p>
      <div class="analogy-alert">
        <p><strong>The Television (Heap Object):</strong> Resides in a specific location in Heap memory. Holds state, data, and options.</p>
        <p><strong>The Remote Control (Stack Reference):</strong> Holds the address key of the television. It is the only handle you have to manipulate the TV!</p>
      </div>
      <p>When you assign one reference variable to another, you are not copying the television! You are just buying a second remote control that points to the exact same television address.</p>
    `
  },
  'parameters-passing': {
    title: 'The Photocopy and the Original document',
    html: `
      <h4><i class="fa-solid fa-lightbulb" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i> The Photocopy Analogy</h4>
      <p>Java is strictly pass-by-value. When you pass an argument to a method, the method receives a duplicate copy of the value, never the original variable itself.</p>
      <div class="analogy-alert">
        <p><strong>Primitives:</strong> You make a copy of a cash bill. If the method destroys its copy, your original bill remains safe in your pocket.</p>
        <p><strong>References:</strong> You make a copy of a remote control pointing to a television. If the method uses the copied remote to change the channel, the actual TV changes! But if it throws the copied remote away, your original remote still points to the TV.</p>
      </div>
    `
  },
  'exceptions-hierarchy': {
    title: 'The Fire Alarm System',
    html: `
      <h4><i class="fa-solid fa-lightbulb" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i> The Fire Alarm System</h4>
      <p>Exceptions are warnings that interrupt normal workflow when something goes wrong.</p>
      <div class="analogy-alert">
        <p><strong>Checked Exceptions:</strong> Like a fire drill or standard safety inspection. The system forces you to install smoke detectors (try-catch) before you are allowed to open the building (compile).</p>
        <p><strong>Unchecked Exceptions:</strong> Like dropping a glass beaker in the hallway. It is a runtime accident caused by human error (coding bugs) that couldn't be predicted in advance by inspectors.</p>
      </div>
    `
  },
  'java-collections': {
    title: 'The Storage Lockers',
    html: `
      <h4><i class="fa-solid fa-lightbulb" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i> The Storage Lockers</h4>
      <p>Java collections are different types of storage systems tailored for specific use cases.</p>
      <div class="analogy-alert">
        <p><strong>ArrayList:</strong> A row of lockers that dynamically expands. If you run out of lockers, the manager automatically builds a new block 1.5x larger and copies your things over.</p>
        <p><strong>LinkedList:</strong> A chain of people holding hands. Each person knows only who is in front and behind them. Inserting a new person just requires breaking and rebuilding one handshake.</p>
        <p><strong>HashMap:</strong> A mailroom sorting system. Each letter has a key (ZIP code) that maps directly to a specific bin index for instant lookup.</p>
      </div>
    `
  },
  'threads-runnable': {
    title: 'The Kitchen Cooks',
    html: `
      <h4><i class="fa-solid fa-lightbulb" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i> The Kitchen Cooks</h4>
      <p>A thread is like a cook in a busy restaurant kitchen. If you have only one cook (single thread), they must prepare the soup, chop vegetables, and bake bread sequentially.</p>
      <div class="analogy-alert">
        <p><strong>Concurrency:</strong> Hiring multiple cooks (threads) who share the same kitchen counters, knives, and ingredients (Heap memory).</p>
        <p><strong>Race Condition:</strong> Two cooks trying to grab the same knife at the exact same time, leading to chaos. You need synchronization to enforce lock rules.</p>
      </div>
    `
  },
  'what-are-data-structures': {
    title: 'The Office Organization System',
    html: `
      <h4><i class="fa-solid fa-lightbulb" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i> The Office Organization System</h4>
      <p>Imagine a massive office dealing with thousands of documents. If you pile them all in a heap on the floor, finding one document will take hours.</p>
      <div class="analogy-alert">
        <p><strong>Data Structure:</strong> Organizing documents in filing cabinets, alphabetical folders, or priority trays. It is a structured way of storing information so you can retrieve or modify it efficiently.</p>
      </div>
    `
  },
  'singly-linked-list-dsa': {
    title: 'The Treasure Hunt',
    html: `
      <h4><i class="fa-solid fa-lightbulb" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i> The Treasure Hunt</h4>
      <p>Unlike an array where everyone sits in consecutive seats, a linked list is like a treasure hunt where participants are scattered across a park.</p>
      <div class="analogy-alert">
        <p><strong>Nodes:</strong> The clues. Each node holds some treasure (data) and a note pointing to the next coordinate (next address pointer).</p>
        <p><strong>Head:</strong> The starting clue. If you lose the head pointer, the entire chain is lost in memory forever.</p>
      </div>
    `
  },
  'stacks-queues-dsa': {
    title: 'The Cafeteria Trays and Ticket Line',
    html: `
      <h4><i class="fa-solid fa-lightbulb" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i> The Cafeteria Trays and Ticket Line</h4>
      <p>Stacks and Queues govern the order in which items are processed.</p>
      <div class="analogy-alert">
        <p><strong>Stack (LIFO):</strong> Like a stack of clean trays in a cafeteria. The tray placed last on top is the first one picked up by a customer.</p>
        <p><strong>Queue (FIFO):</strong> Like a queue at a movie ticket counter. The first customer to stand in line is the first one served and checked out.</p>
      </div>
    `
  },
  'graph-bfs-dfs': {
    title: 'The Ripple vs. The Deep Explorer',
    html: `
      <h4><i class="fa-solid fa-lightbulb" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i> The Ripple vs. The Deep Explorer</h4>
      <p>BFS and DFS represent two distinct strategies for exploring a network of connected nodes.</p>
      <div class="analogy-alert">
        <p><strong>BFS (Breadth-First):</strong> Like dropping a stone in a calm pond. Ripples expand outward, visiting all immediate neighbors first before moving to the next level.</p>
        <p><strong>DFS (Depth-First):</strong> Like an explorer in a maze. They pick one direction and walk as deep as possible until they hit a dead end, then backtrack and try the next path.</p>
      </div>
    `
  }
};

const defaultAnalogy = (title) => `
  <h4><i class="fa-solid fa-lightbulb" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i> Real-Life Analogy for ${title}</h4>
  <p>To understand this concept, think of it as organizing real-world physical systems.</p>
  <div class="analogy-alert">
    <p><strong>The Core Idea:</strong> Like dividing tasks in a team, choosing the right structure saves time and resource costs.</p>
    <p><strong>Real-World Efficiency:</strong> Just as sorting books alphabetically makes searching faster, matching data to the right model optimizes computer executions.</p>
  </div>
`;

const splitLessonContent = (htmlContent) => {
  if (!htmlContent) return { theory: '', analogy: '' };
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const children = Array.from(doc.body.children);
    
    let inAnalogy = false;
    const theoryHtml = [];
    const analogyHtml = [];
    
    children.forEach((child) => {
      const tagName = child.tagName;
      const textContent = child.textContent || '';
      
      // Match H2 or H3 headers for Analogy
      if (
        (tagName === 'H2' || tagName === 'H3') &&
        (textContent.toLowerCase().includes('analogy') || textContent.toLowerCase().includes('real-life analogy'))
      ) {
        inAnalogy = true;
        analogyHtml.push(child.outerHTML);
        return;
      }
      
      // If we hit another H2 or H3 heading, stop the Analogy block
      if (inAnalogy && (tagName === 'H2' || tagName === 'H3')) {
        inAnalogy = false;
      }
      
      if (inAnalogy) {
        analogyHtml.push(child.outerHTML);
      } else {
        theoryHtml.push(child.outerHTML);
      }
    });
    
    return {
      theory: theoryHtml.join('\n'),
      analogy: analogyHtml.join('\n')
    };
  } catch (err) {
    console.error('Error parsing lesson content:', err);
    return { theory: htmlContent, analogy: '' };
  }
};

function LessonViewer({ lessonSlug, onCloseViewer }) {
  const { currentLesson, currentQuiz, loading, fetchLesson } = useContext(LearningContext);
  const { submitScore, completedLessons } = useContext(ProgressContext);
  const [activeTab, setActiveTab] = useState('theory');
  const [xpUnlocked, setXpUnlocked] = useState(false);

  useEffect(() => {
    fetchLesson(lessonSlug);
  }, [lessonSlug]);

  // Synchronize dynamic state with backend completion logs
  useEffect(() => {
    if (currentLesson && completedLessons.includes(currentLesson._id)) {
      setXpUnlocked(true);
    } else {
      setXpUnlocked(false);
    }
  }, [currentLesson, completedLessons]);

  const handleQuizPassed = (isServerSynced) => {
    if (!xpUnlocked) {
      setXpUnlocked(true);
      
      if (!isServerSynced) {
        alert('Awesome! You cleared the self-assessment and unlocked +50 XP (Offline Guest Mode)!');
      } else {
        alert('Awesome! You cleared the self-assessment and unlocked +50 XP!');
      }
    }
  };

  // Mock Lesson database seeder fail-safe
  const getMockedLessonData = (slug) => {
    const data = {
      'java-syntax': {
        lesson: {
          title: 'Language Syntax & Variables',
          content: `<h3>Language Syntax & Variables</h3>
<p>Java is a strongly typed, class-based object-oriented language. Every line of executable statement must reside inside a class definition.</p>
<p>Variables serve as storage containers. Java categorizes data types into:</p>
<ul>
  <li><strong>Primitives:</strong> Holds raw data in the Stack frame (e.g. <code>int</code>, <code>double</code>, <code>boolean</code>, <code>char</code>).</li>
  <li><strong>References:</strong> Holds the Heap memory address of an object (e.g. <code>String</code>, <code>User</code>, custom classes).</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "Which variable type is stored directly on the Stack frame?",
            options: [
              { text: "Object Instances", isCode: false },
              { text: "Primitive Types", isCode: false },
              { text: "Thread registries", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Primitives are stored directly on the Stack, whereas references store pointers to objects allocated on the Heap."
          }]
        }
      },
      'control-structures': {
        lesson: {
          title: 'Control Structures & Conditionals',
          content: `<h3>Control Structures & Conditionals</h3>
<p>Control flow statement execution is managed using conditional checks and loops:</p>
<ul>
  <li><code>if-else</code> blocks evaluate Boolean expressions to fork paths.</li>
  <li><code>switch</code> statements match values (primitives, Enums, Strings) to labeled code blocks.</li>
  <li>Loops (<code>for</code>, <code>while</code>, <code>do-while</code>) repeat logic paths until their condition evaluates to false.</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "Which loop evaluates its condition at the bottom of the loop body?",
            options: [
              { text: "while loop", isCode: false },
              { text: "do-while loop", isCode: false },
              { text: "for loop", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "The do-while loop evaluates its condition at the bottom, guaranteeing at least one execution pass."
          }]
        }
      },
      'pseudo-code': {
        lesson: {
          title: 'Pseudo Code & Logic Building',
          content: `<h3>Pseudo Code & Logic Building</h3>
<p>Before writing code, developers model algorithms using <strong>Pseudo Code</strong>—an informal, language-agnostic way to write programs. It helps focus on logical steps rather than syntactical rules.</p>
<pre><code>Function BinarySearch(Array, Target):
    Set low = 0
    Set high = Array.length - 1
    While low <= high:
        mid = low + (high - low) / 2
        If Array[mid] == Target: Return mid
        Else If Array[mid] < Target: low = mid + 1
        Else: high = mid - 1
    Return -1</code></pre>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What is the primary benefit of pseudo code?",
            options: [
              { text: "It runs faster on the JVM", isCode: false },
              { text: "It allows testing logic steps independently of specific programming language syntax", isCode: false },
              { text: "It checks compile-time types", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Pseudo code focuses entirely on structuring logical steps, bypassing language-specific syntax restrictions."
          }]
        }
      },
      'java-functions': {
        lesson: {
          title: 'Functions & Method Execution',
          content: `<h3>Functions & Method Execution</h3>
<p>In Java, functions are called **Methods** and must belong to a class. They encapsulate reusable blocks of statements.</p>
<p>Each time a method is called, a new Stack Frame is created containing its parameters and local variables. Java is strictly **pass-by-value**, meaning it passes copies of primitive values or copied object reference pointers.</p>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What happens when a method is called in Java?",
            options: [
              { text: "A new Stack Frame is pushed onto the thread stack", isCode: false },
              { text: "An object is garbage collected in the heap", isCode: false },
              { text: "Variables are converted to static parameters", isCode: false }
            ],
            correctAnswerIndex: 0,
            explanation: "Each method execution receives a new stack frame that holds local variables and parameter definitions."
          }]
        }
      },
      'oop-basics': {
        lesson: {
          title: 'OOP Basics (Classes, Objects, Constructors)',
          content: `<h3>OOP Basics: Blueprints & Instances</h3>
<p>Object-Oriented Programming models systems using classes and objects:</p>
<ul>
  <li><strong>Class:</strong> The blueprint defining variables and methods.</li>
  <li><strong>Object:</strong> A concrete instance of the class allocated in Heap memory.</li>
  <li><strong>Constructor:</strong> A special method called with the <code>new</code> keyword to initialize new object states.</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What allocates memory for a new object on the Heap in Java?",
            options: [
              { text: "The class keyword", isCode: false },
              { text: "The new keyword combined with a constructor call", isCode: false },
              { text: "A method return statement", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "The 'new' keyword tells the JVM to allocate a new block of memory on the Heap for the specified class instance."
          }]
        }
      },
      'compilation-mechanics': {
        lesson: {
          title: 'Compilation vs. Interpretation Mechanics',
          content: `
            <h3>Compilation vs. Interpretation Mechanics</h3>
            <p>Java uses a hybrid compilation-interpretation approach. First, source files are compiled into bytecode. Then, the JVM's interpreter reads and executes bytecode instructions sequentially.</p>
            <p>To optimize performance, the JVM employs a <strong>JIT (Just-In-Time) compiler</strong>. JIT identifies 'hot spots' (frequently run code segments) and compiles them directly into native machine code to speed up execution.</p>
          `,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What is the role of the JIT compiler inside the JVM?",
            options: [
              { text: "It formats source code before compilation", isCode: false },
              { text: "It compiles frequently-executed bytecode paths directly to native machine code on-the-fly", isCode: false },
              { text: "It manages heap variables allocations", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "The JIT compiler analyzes execution hotspots and translates bytecode into native code for massive performance gains."
          }]
        }
      },
      'jvm-stack-frame': {
        lesson: {
          title: 'Stack vs. Heap Allocation Models',
          content: `
            <h3>Stack vs. Heap Allocation Models</h3>
            <p>Every running thread in Java has its own private Stack memory. Each time a method is invoked, a new <strong>Stack Frame</strong> is pushed onto the thread's stack. This frame stores the method's local variables, arguments, and intermediate operation states.</p>
            <p>When the method finishes execution, its stack frame is popped off the stack, and its local variables are discarded.</p>
          `,
          visualizations: [
            {
              step: 1,
              label: "Method main() called -> Stack Frame created containing its local variables.",
              memorySnapshot: { stack: [{ variable: 'args', value: 'String[]' }], heap: [] }
            }
          ]
        },
        quiz: {
          questions: [{
            questionText: "What happens to method local variables stored on the stack frame when a method returns?",
            options: [
              { text: "They remain in heap storage forever", isCode: false },
              { text: "Their stack frame is popped, immediately reclaiming the memory slot", isCode: false },
              { text: "They are cleaned by the garbage collector at a later time", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Stack frames are popped and reclaimed immediately when the method returns, ensuring fast and automatic cleanup."
          }]
        }
      },
      'declaring-references': {
        lesson: {
          title: 'Declaring References & Allocating Objects',
          content: `
            <h3>Welcome to Java Memory References!</h3>
            <p>In Java, variables never contain objects directly. Instead, reference variables hold <strong>memory addresses (pointers)</strong> pointing to where the actual objects reside inside the shared <strong>JVM Heap space</strong>.</p>
            <p>Think of reference variables as remote controls and objects as televisions. The remote control is not the television; it is just a handle that points to the television from a distance!</p>
            <div className="code-block-banner">
              <pre><code>// Line 1: Declare reference
User user1;

// Line 2: Allocate object
user1 = new User();

// Line 3: Modify attribute
user1.name = "Arjun";</code></pre>
            </div>
          `,
          visualizations: [
            {
              step: 1,
              label: "User user1; -> We declare the reference variable user1 inside the Stack frame. Because it is unallocated, it initially holds a null reference address.",
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
          ]
        },
        quiz: {
          questions: [{
            questionText: "What does a Java reference variable hold directly inside its Stack memory allocation slot?",
            options: [
              { text: "The complete object values and attributes", isCode: false },
              { text: "A remote control reference address pointing to the object in Heap", isCode: false },
              { text: "A static compiler check metadata", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Bingo! A Java reference variable acts as a remote control. It doesn't contain the object itself; it holds the exact pointer address pointing to where the object resides in Heap memory."
          }]
        }
      },
      'parameters-passing': {
        lesson: {
          title: 'Parameters Passing: Value vs References',
          content: `
            <h3>Pass-by-Value Mechanics in Java</h3>
            <p>A common source of confusion in Java is parameter passing. <strong>Java is strictly pass-by-value.</strong> When you pass a variable to a method, Java makes a copy of the value stored in that variable and passes the copy.</p>
            <p>However, when passing an object reference, Java makes a copy of the <strong>memory address (remote control)</strong>! This means both the original and copying reference point to the same Heap object address.</p>
          `,
          visualizations: [
            {
              step: 1,
              label: "User original = new User(); -> We allocate original user at address 0x5501 in the Stack frame.",
              memorySnapshot: {
                stack: [{ variable: 'original', value: '0x5501' }],
                heap: [{ address: '0x5501', objectType: 'User', fields: { name: 'Unassigned' } }]
              }
            }
          ]
        },
        quiz: {
          questions: [{
            questionText: "Is Java pass-by-reference?",
            options: [
              { text: "Yes, objects are passed by reference.", isCode: false },
              { text: "No, Java is strictly pass-by-value. It passes copies of references address pointers.", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Exactly! Java is strictly pass-by-value. When passing reference variables, Java makes a copy of the pointer address itself, passing the handle value."
          }]
        }
      },
      'exceptions-hierarchy': {
        lesson: {
          title: 'Checked vs. Unchecked Exception Hierarchy',
          content: `<h3>Checked vs. Unchecked Exception Hierarchy</h3>
<p>All exceptions derive from the <code>Throwable</code> class. The hierarchy divides into:</p>
<ul>
  <li><strong>Checked Exceptions:</strong> Checked at compile-time (e.g. <code>IOException</code>). The compiler forces you to handle or declare these.</li>
  <li><strong>Unchecked Exceptions (RuntimeExceptions):</strong> Occur during runtime due to coding bugs (e.g. <code>NullPointerException</code>). These are not checked by the compiler.</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "Which exception must be handled or declared at compile-time?",
            options: [
              { text: "NullPointerException", isCode: false },
              { text: "IOException", isCode: false },
              { text: "ArithmeticException", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "IOException is a Checked exception. The compiler mandates handling it using try-catch blocks or a throws clause."
          }]
        }
      },
      'java-collections': {
        lesson: {
          title: 'Java Collections Framework',
          content: `<h3>Java Collections Framework</h3>
<p>The collection framework offers unified data structure implementations:</p>
<ul>
  <li><code>ArrayList</code>: Resizes internally by 1.5x when filled.</li>
  <li><code>LinkedList</code>: Node chains optimized for quick head/tail operations.</li>
  <li><code>HashMap</code>: Keys mapped to values via hashing. Employs separate chaining and Red-Black tree bucket conversions to handle collisions.</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "Which collections structure converts its bucket linked lists to red-black trees when collisions cross 8?",
            options: [
              { text: "ArrayList", isCode: false },
              { text: "HashMap", isCode: false },
              { text: "HashSet", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "HashMap converts long collision chains into self-balancing Red-Black trees to optimize searches to O(log N)."
          }]
        }
      },
      'threads-runnable': {
        lesson: {
          title: 'Threads, Runnables & Concurrency Patterns',
          content: `<h3>Threads, Runnables & Concurrency Patterns</h3>
<p>A Thread is an independent path of execution. Concurrency is achieved by sharing CPU attention cycles across active thread stacks.</p>
<p>To avoid **Race Conditions** (threads reading/writing concurrently to shared data), critical segments must be locked using <code>synchronized</code> or the lock API.</p>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "How can you prevent race conditions on shared resources?",
            options: [
              { text: "By using synchronized blocks or lock objects", isCode: false },
              { text: "By extending the Thread class", isCode: false },
              { text: "By using primitive types instead of references", isCode: false }
            ],
            correctAnswerIndex: 0,
            explanation: "Synchronization blocks enforce mutual exclusion, restricting access to a single thread at a time."
          }]
        }
      },
      'what-are-data-structures': {
        lesson: {
          title: 'What are Data Structures?',
          content: `<h3>What are Data Structures?</h3>
<p>A **Data Structure** is a systematic way of organizing, managing, and storing data in computer memory so that operations (search, insert, delete) can be performed efficiently.</p>
<p>Data structures are divided into:</p>
<ul>
  <li><strong>Linear:</strong> Elements arranged sequentially (Arrays, Linked Lists, Stacks, Queues).</li>
  <li><strong>Non-Linear:</strong> Hierarchical or mesh arrangements (Trees, Graphs).</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "Which is a linear data structure?",
            options: [
              { text: "Binary Search Tree", isCode: false },
              { text: "Queue", isCode: false },
              { text: "Adjacency List Graph", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Queues arrange elements sequentially in FIFO order, making it a linear structure."
          }]
        }
      },
      'complexity-calculations': {
        lesson: {
          title: 'Time vs. Space Complexity & Calculations',
          content: `<h3>Time vs. Space Complexity & Calculations</h3>
<p>Algorithmic efficiency is measured using complexity parameters:</p>
<ul>
  <li><strong>Time Complexity:</strong> The number of operations executed as input size <code>N</code> scales.</li>
  <li><strong>Space Complexity:</strong> The helper memory allocated during execution.</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What does Time Complexity measure?",
            options: [
              { text: "The execution duration in milliseconds on a specific computer", isCode: false },
              { text: "How the number of operations scales relative to input size N", isCode: false },
              { text: "The compiled file size in bytes", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Time complexity abstracts hardware speeds, focusing on how execution operations count increases with input size."
          }]
        }
      },
      'big-o-notation': {
        lesson: {
          title: 'Big O Notation & Growth Analysis',
          content: `
            <h3>Big O Notation & Growth Analysis</h3>
            <p>In computer science, <strong>Big O notation</strong> represents how runtimes or storage requirements scale as input sizes (<code>N</code>) grow toward infinity.</p>
            <p>It provides an upper bound (worst-case scenario), helping us compare performance profiles without depending on local CPU hardware speeds.</p>
            <h4>Common complexities:</h4>
            <ul>
              <li><code>O(1)</code>: Constant Time (HashMap lookups)</li>
              <li><code>O(log N)</code>: Logarithmic Time (Binary Search)</li>
              <li><code>O(N)</code>: Linear Time (Single array loop)</li>
              <li><code>O(N log N)</code>: Linearithmic Time (Merge Sort)</li>
              <li><code>O(N²)</code>: Quadratic Time (Nested loops)</li>
            </ul>
          `,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What is the time complexity of searching an item in a sorted array using Binary Search?",
            options: [
              { text: "O(1)", isCode: false },
              { text: "O(log N)", isCode: false },
              { text: "O(N)", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Binary Search halves the remaining search range on each step, yielding a logarithmic time complexity of O(log N)."
          }]
        }
      },
      'linear-binary-search': {
        lesson: {
          title: 'Linear Search vs. Binary Search',
          content: `<h3>Linear Search vs. Binary Search</h3>
<p>Searching involves finding a value within a collection:</p>
<ul>
  <li><strong>Linear Search:</strong> Iterates from index 0 to N-1. Operates on unsorted lists in <code>O(N)</code> time.</li>
  <li><strong>Binary Search:</strong> Halves the search space recursively. Requires sorted inputs, achieving log scales: <code>O(log N)</code>.</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What is the runtime complexity of Binary Search?",
            options: [
              { text: "O(N)", isCode: false },
              { text: "O(log N)", isCode: false },
              { text: "O(1)", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Because the search range is halved at each step, Binary Search achieves O(log N) runtime."
          }]
        }
      },
      'quadratic-sorts': {
        lesson: {
          title: 'Quadratic Sorts (Bubble, Selection, Insertion)',
          content: `<h3>Quadratic Sorts (Bubble, Selection, Insertion)</h3>
<p>Basic sorting algorithms run in <code>O(N²)</code> time and are space-efficient (run in-place):</p>
<ul>
  <li><strong>Bubble Sort:</strong> Swaps adjacent elements if out of order.</li>
  <li><strong>Selection Sort:</strong> Selects the minimum item from the unsorted subarray and swaps it to the front.</li>
  <li><strong>Insertion Sort:</strong> Inserts elements into their correct position in a sorted subarray.</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "Which sorting algorithm repeatedly swaps adjacent elements if they are in the wrong order?",
            options: [
              { text: "Selection Sort", isCode: false },
              { text: "Bubble Sort", isCode: false },
              { text: "Merge Sort", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Bubble Sort bubbles largest elements to the end by comparing and swapping adjacent items."
          }]
        }
      },
      'array-memory-mapping': {
        lesson: {
          title: 'Arrays & Memory Mappings',
          content: `<h3>Arrays & Memory Mappings</h3>
<p>An **Array** is a contiguous block of memory holding elements of the same type. Accessing an element takes constant time <code>O(1)</code> using an index offset calculation:</p>
<pre><code>Address = BaseAddress + Index * ElementSize</code></pre>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What is the access complexity of looking up a known index in an array?",
            options: [
              { text: "O(N)", isCode: false },
              { text: "O(1)", isCode: false },
              { text: "O(log N)", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Array elements are mapped sequentially in memory, enabling O(1) constant-time direct offset reads."
          }]
        }
      },
      'singly-linked-list-dsa': {
        lesson: {
          title: 'Singly Linked List Nodes & Pointers',
          content: `
            <h3>Singly Linked List Nodes & Pointers</h3>
            <p>Unlike sequential Arrays, a <strong>Linked List</strong> allocates data in isolated Node objects scattered across Heap memory. Nodes are linked together via pointers.</p>
            <p>A Singly Linked List Node holds:
            <ol>
              <li><strong>data:</strong> The value stored in the node.</li>
              <li><strong>next:</strong> A reference address pointer pointing to the next node in the chain.</li>
            </ol>
            <p>The list starts at a <code>head</code> reference. The final node points to <code>null</code>.</p>
          `,
          visualizations: [
            {
              step: 1,
              label: "Linked List: [Head] -> Node(val=10, next=0x1102) -> Node(val=20, next=null)",
              memorySnapshot: {
                stack: [{ variable: 'head', value: '0x1005' }],
                heap: [
                  { address: '0x1005', objectType: 'Node', fields: { data: 10, next: '0x1102' } },
                  { address: '0x1102', objectType: 'Node', fields: { data: 20, next: 'null' } }
                ]
              }
            }
          ]
        },
        quiz: {
          questions: [{
            questionText: "What value does the next reference field of the final node in a Singly Linked List hold?",
            options: [
              { text: "The address of the head node", isCode: false },
              { text: "null", isCode: false },
              { text: "0x0000", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "The final node in a linked list does not point to any subsequent nodes, so its next reference holds null."
          }]
        }
      },
      'stacks-queues-dsa': {
        lesson: {
          title: 'Stacks (LIFO) & Queues (FIFO)',
          content: `<h3>Stacks (LIFO) & Queues (FIFO)</h3>
<p>Stacks and Queues restrict data access paths:</p>
<ul>
  <li><strong>Stack:</strong> Last-In, First-Out (LIFO). Elements are pushed and popped from the <code>top</code>.</li>
  <li><strong>Queue:</strong> First-In, First-Out (FIFO). Elements are enqueued at the <code>rear</code> and dequeued from the <code>front</code>.</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "Which structure operates in Last-In First-Out (LIFO) order?",
            options: [
              { text: "Queue", isCode: false },
              { text: "Stack", isCode: false },
              { text: "Array", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Stacks are LIFO structures. The last element added is the first to be retrieved."
          }]
        }
      },
      'hashing-collision': {
        lesson: {
          title: 'Hash Functions & Collision Resolution',
          content: `<h3>Hash Functions & Collision Resolution</h3>
<p>A **Hash Table** stores key-value pairs. It computes a key\'s hashcode to determine its index in an array.</p>
<p>When different keys yield the same index, a **Collision** occurs. Hash tables resolve collisions using separate chaining or open addressing.</p>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What is a hash collision?",
            options: [
              { text: "When the table capacity overflows", isCode: false },
              { text: "When two distinct keys resolve to the same array index bucket", isCode: false },
              { text: "When key values are garbage collected", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Collisions happen when different keys produce matching index hashes, requiring collision resolution handling."
          }]
        }
      },
      'binary-tree-traversals': {
        lesson: {
          title: 'Binary Trees & Tree Traversals',
          content: `<h3>Binary Trees & Tree Traversals</h3>
<p>A **Binary Tree** is a hierarchical structure where each node has at most two children.</p>
<p>DFS traversals include In-Order (Left, Root, Right), Pre-Order (Root, Left, Right), and Post-Order (Left, Right, Root).</p>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "Which traversal visits the left subtree, then the root node, then the right subtree?",
            options: [
              { text: "Pre-Order Traversal", isCode: false },
              { text: "In-Order Traversal", isCode: false },
              { text: "Post-Order Traversal", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "In-Order traversal visits Left, then Root, then Right."
          }]
        }
      },
      'bst-avl-trees': {
        lesson: {
          title: 'Binary Search Trees (BST) & Balanced AVL Trees',
          content: `<h3>Binary Search Trees (BST) & Balanced AVL Trees</h3>
<p>A BST enforces sorting constraints: left subtree is smaller than root, right is larger.</p>
<p>To prevent performance degradation to O(N), AVL trees automatically balance themselves using rotations when subtree height differences exceed 1.</p>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What is the worst-case search time complexity in a skewed Binary Search Tree?",
            options: [
              { text: "O(log N)", isCode: false },
              { text: "O(N)", isCode: false },
              { text: "O(N log N)", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "If a BST is unbalanced (skewed into a straight line), searching degenerates to linear O(N) traversal."
          }]
        }
      },
      'graph-representations': {
        lesson: {
          title: 'Directed vs. Undirected Graph Representations',
          content: `<h3>Directed vs. Undirected Graph Representations</h3>
<p>Graphs represent connections between vertices. In undirected graphs, edges are bidirectional. In directed graphs, edges have arrows indicating one-way paths.</p>
<p>Representations include Adjacency List (space efficient for sparse connections) and Adjacency Matrix (O(1) edge lookup).</p>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "Which representation requires O(V²) space complexity?",
            options: [
              { text: "Adjacency List", isCode: false },
              { text: "Adjacency Matrix", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Adjacency Matrix uses a 2D array of size V x V, occupying O(V²) space."
          }]
        }
      },
      'graph-shortest-paths': {
        lesson: {
          title: "Dijkstra's, Bellman-Ford, and A* Algorithms",
          content: `<h3>Shortest Path Algorithms</h3>
<p>Algorithms for finding the shortest path in weighted graphs:</p>
<ul>
  <li><strong>Dijkstra's:</strong> Fast, non-negative weights using a priority queue.</li>
  <li><strong>Bellman-Ford:</strong> Handles negative weights, detects negative cycles.</li>
  <li><strong>A*:</strong> Graph traversal using heuristics for optimization.</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "Which algorithm handles negative weights and detects cycles?",
            options: [
              { text: "Dijkstra's", isCode: false },
              { text: "Bellman-Ford", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Bellman-Ford checks all edges V-1 times, making it capable of handling negative weights and identifying negative weight cycles."
          }]
        }
      },
      'trie-prefix-tree': {
        lesson: {
          title: 'Trie (Prefix Tree)',
          content: `<h3>Trie (Prefix Tree)</h3>
<p>A Trie is a specialized search tree used for keys (usually strings) over an alphabet.</p>
<p>Tries are optimized for prefix lookups and spell-checking. Searching a word of length L takes O(L) time regardless of tree size N.</p>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What is a Trie commonly used for?",
            options: [
              { text: "Numerical sorting", isCode: false },
              { text: "Auto-complete prefix matching and dictionary search", isCode: false },
              { text: "Graph cycle checks", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Tries store characters along edge paths, making them ideal for finding strings starting with a specific prefix."
          }]
        }
      },
      'sliding-window-two-pointer': {
        lesson: {
          title: 'Sliding Window & Two Pointer Techniques',
          content: `<h3>Sliding Window & Two Pointer Techniques</h3>
<p>These patterns optimize nested loops on arrays:</p>
<ul>
  <li><strong>Sliding Window:</strong> Tracks sub-array limits. Best for finding subarray properties.</li>
  <li><strong>Two Pointer:</strong> Uses two indexes iterating towards each other or at different speeds to search elements.</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "Which pattern is optimal for matching pairs in a sorted array?",
            options: [
              { text: "Sliding Window", isCode: false },
              { text: "Two Pointer", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Two Pointer technique uses pointers at the head and tail, moving them inward to find target pairs in linear time."
          }]
        }
      },
      'why-data-structures-important': {
        lesson: {
          title: 'Why are Data Structures Important?',
          content: `<h3>Why are Data Structures Important?</h3>
<p>As applications handle massive datasets, choosing the right data structure directly determines program responsiveness. Organized storage profiles reduce CPU processing times and memory footprint.</p>
<p>For example, searching a telephone index takes <code>O(N)</code> with a sequential list, but halves recursively to <code>O(log N)</code> using a sorted array and Binary Search.</p>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "Why is matching a problem to the correct data structure critical?",
            options: [
              { text: "To minimize time and space complexity during operations", isCode: false },
              { text: "To ensure the code compiles without exceptions", isCode: false },
              { text: "To convert primitive types to references", isCode: false }
            ],
            correctAnswerIndex: 0,
            explanation: "Using the optimal data structure directly reduces operational complexities, speeding up executions and preserving memory."
          }]
        }
      },
      'asymptotic-notations': {
        lesson: {
          title: 'Asymptotic Notation (Big-O, Big-θ, Big-Ω)',
          content: `<h3>Asymptotic Notation (Big-O, Big-θ, Big-Ω)</h3>
<p>We describe scaling using mathematical envelopes:</p>
<ul>
  <li><strong>Big-O (O):</strong> Upper bound (Worst-case limit).</li>
  <li><strong>Big-Omega (Ω):</strong> Lower bound (Best-case floor).</li>
  <li><strong>Big-Theta (θ):</strong> Tight bound (Average/Exact scaling profile).</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "Which notation represents the tight, exact bound of an algorithm's complexity?",
            options: [
              { text: "Big-O Notation", isCode: false },
              { text: "Big-Theta Notation (θ)", isCode: false },
              { text: "Big-Omega Notation (Ω)", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Big-Theta represents a tight bound, meaning the algorithm is bounded above and below by the same growth rate."
          }]
        }
      },
      'common-runtimes': {
        lesson: {
          title: 'Common Runtimes Analysis',
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
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "Which growth rate scales fastest (is least efficient) as N becomes large?",
            options: [
              { text: "O(N log N)", isCode: false },
              { text: "O(N²)", isCode: false },
              { text: "O(2^N)", isCode: false }
            ],
            correctAnswerIndex: 2,
            explanation: "Exponential runtime O(2^N) grows extremely fast, making algorithms unusable for larger inputs."
          }]
        }
      },
      'divide-and-conquer-sorts': {
        lesson: {
          title: 'Divide-and-Conquer Sorts (Merge, Quick)',
          content: `<h3>Divide-and-Conquer Sorts (Merge, Quick)</h3>
<p>Efficient algorithms split arrays into smaller subarrays:</p>
<ul>
  <li><strong>Merge Sort:</strong> Halves arrays, recursively sorts them, and merges them. Runs in <code>O(N log N)</code> time, requiring <code>O(N)</code> space.</li>
  <li><strong>Quick Sort:</strong> Selects a pivot and partitions elements around it. Average runtime is <code>O(N log N)</code>, worst-case is <code>O(N²)</code>.</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What is the space complexity of Merge Sort?",
            options: [
              { text: "O(1) in-place", isCode: false },
              { text: "O(N) for merge helper array allocations", isCode: false },
              { text: "O(N log N)", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Merge Sort allocates a helper array of size N to merge sorted subarrays, requiring O(N) space."
          }]
        }
      },
      'heap-sort-dsa': {
        lesson: {
          title: 'Heap Sort',
          content: `<h3>Heap Sort</h3>
<p><strong>Heap Sort</strong> uses a binary heap to sort elements in-place in <code>O(N log N)</code> worst-case time.</p>
<p>It inserts elements into a Max Heap, then repeatedly extracts the maximum element, swapping it with the last element of the array and restoring the heap property (heapifying).</p>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What is the time complexity of Heap Sort?",
            options: [
              { text: "O(N log N) in all cases", isCode: false },
              { text: "O(N²) worst-case", isCode: false },
              { text: "O(N) best-case", isCode: false }
            ],
            correctAnswerIndex: 0,
            explanation: "Heap Sort guarantees O(N log N) runtime in best, average, and worst-case scenarios, running in-place."
          }]
        }
      },
      'linked-lists-types': {
        lesson: {
          title: 'Singly, Doubly, & Circular Linked Lists',
          content: `<h3>Singly, Doubly, & Circular Linked Lists</h3>
<p>Linked Lists allocate elements (nodes) dynamically on the Heap:</p>
<ul>
  <li><strong>Singly Linked List:</strong> Each node points to the <code>next</code> node.</li>
  <li><strong>Doubly Linked List:</strong> Nodes point to both <code>next</code> and <code>prev</code> nodes.</li>
  <li><strong>Circular Linked List:</strong> The tail node points back to the <code>head</code> node.</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "Which linked list type allows two-way traversal (forward and backward)?",
            options: [
              { text: "Singly Linked List", isCode: false },
              { text: "Doubly Linked List", isCode: false },
              { text: "Circular Linked List", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Doubly Linked Lists store both next and prev references in each node, allowing bidirectional traversal."
          }]
        }
      },
      'heaps-priority-queues': {
        lesson: {
          title: 'Heaps & Priority Queues',
          content: `<h3>Heaps & Priority Queues</h3>
<p>A **Heap** is a complete binary tree where the parent node has a higher priority than its children:</p>
<ul>
  <li><strong>Max Heap:</strong> Parent is larger than or equal to its children.</li>
  <li><strong>Min Heap:</strong> Parent is smaller than or equal to its children.</li>
</ul>
<p>Heaps are commonly implemented using arrays to support O(1) access to the minimum/maximum element and O(log N) updates.</p>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What is the time complexity of extracting the root element from a Binary Heap containing N elements?",
            options: [
              { text: "O(1)", isCode: false },
              { text: "O(log N)", isCode: false },
              { text: "O(N)", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Removing the root requires swapping the last element to the top and heapifying down, which takes O(log N) time."
          }]
        }
      },
      'graph-bfs-dfs': {
        lesson: {
          title: 'Graph Traversals: BFS & DFS',
          content: `<h3>Graph Traversals: BFS & DFS</h3>
<p>Traversing a graph involves visiting all its vertices systematically:</p>
<ul>
  <li><strong>Breadth-First Search (BFS):</strong> Explores neighbors level by level using a **Queue** (FIFO).</li>
  <li><strong>Depth-First Search (DFS):</strong> Explores paths as deep as possible before backtracking using a **Stack** or recursion.</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What data structure is used to track nodes in a Breadth-First Search (BFS) traversal?",
            options: [
              { text: "Stack (LIFO)", isCode: false },
              { text: "Queue (FIFO)", isCode: false },
              { text: "Priority Queue", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "BFS explores node neighbors level by level, tracking visitation order using a Queue."
          }]
        }
      },
      'graph-mst-algorithms': {
        lesson: {
          title: "Prim's and Kruskal's Algorithms",
          content: `<h3>Prim's and Kruskal's Algorithms</h3>
<p>A **Minimum Spanning Tree (MST)** connects all vertices in a weighted graph with the minimum total edge weight, without cycles.</p>
<ul>
  <li><strong>Prim's Algorithm:</strong> Starts from a root vertex and grows the tree by adding the cheapest edge to an unvisited vertex. Best for dense graphs.</li>
  <li><strong>Kruskal's Algorithm:</strong> Sorts all edges by weight and adds the cheapest edge if it doesn't create a cycle. Uses a Disjoint Set (Union-Find) data structure. Best for sparse graphs.</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What helper data structure is used in Kruskal's algorithm to check if adding an edge creates a cycle?",
            options: [
              { text: "Binary Heap", isCode: false },
              { text: "Disjoint Set (Union-Find)", isCode: false },
              { text: "Adjacency List", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Union-Find keeps track of connected components, allowing cycle checks in near-constant time."
          }]
        }
      },
      'b-trees-indexing': {
        lesson: {
          title: 'Multi-way Trees (2-3 Trees, B/B+ Trees)',
          content: `<h3>Multi-way Trees (2-3 Trees, B/B+ Trees)</h3>
<p>Standard binary search trees don't scale well to disk storage because of height variation. **B-Trees** and **B+ Trees** are self-balancing multi-way search trees designed for storage systems.</p>
<ul>
  <li><strong>2-3 Tree:</strong> A balanced tree where nodes can have 2 or 3 children.</li>
  <li><strong>B-Tree:</strong> Nodes can contain multiple keys and children. Keys are distributed across all levels.</li>
  <li><strong>B+ Tree:</strong> All keys are stored at the leaf level, and leaves are connected in a linked list. This layout supports fast range queries.</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "Why are B+ Trees preferred over standard B-Trees for database indexing?",
            options: [
              { text: "Because they are binary trees", isCode: false },
              { text: "Because all values are stored in the leaf nodes, which are connected by a linked list to allow fast range scans", isCode: false },
              { text: "Because they do not require balancing", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "B+ Tree leaves are linked together, allowing sequential range scans without traversing parent levels."
          }]
        }
      },
      'linear-tree-indexing': {
        lesson: {
          title: 'Database Indexing: Linear vs. Tree-Based Indexing',
          content: `<h3>Database Indexing: Linear vs. Tree-Based Indexing</h3>
<p>An index speeds up database queries:</p>
<ul>
  <li><strong>Linear Indexing:</strong> A simple ordered list of key-pointer pairs. Search runs in <code>O(log N)</code> using binary search, but updates are slow (<code>O(N)</code>).</li>
  <li><strong>Tree-Based Indexing:</strong> Uses B/B+ trees. Ensures <code>O(log N)</code> runtime for search, insertion, and deletion.</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What is the update complexity in a linear index database model?",
            options: [
              { text: "O(1)", isCode: false },
              { text: "O(log N)", isCode: false },
              { text: "O(N)", isCode: false }
            ],
            correctAnswerIndex: 2,
            explanation: "Because linear indexes are kept sorted in contiguous arrays, inserting a new key requires shifting items, which takes O(N) time."
          }]
        }
      },
      'isam-indexing': {
        lesson: {
          title: 'ISAM (Indexed Sequential Access Method)',
          content: `<h3>ISAM (Indexed Sequential Access Method)</h3>
<p><strong>ISAM</strong> is a static indexing method developed by IBM. It organizes records sequentially on disk and maintains a static index tree to locate blocks of records.</p>
<p>ISAM is fast for read-only tables but struggles with updates because insertions can overflow blocks, leading to chained lookup lists that degrade performance.</p>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What is a limitation of ISAM?",
            options: [
              { text: "It uses binary heaps", isCode: false },
              { text: "The index structure is static, leading to overflow chains and slower lookups after many insertions", isCode: false },
              { text: "It cannot be stored on disk", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "ISAM indexes do not automatically re-balance during updates. New records are placed in overflow areas, which slows down search times over time."
          }]
        }
      },
      'segment-fenwick-trees': {
        lesson: {
          title: 'Range Query Structures: Segment Trees & Fenwick Trees',
          content: `<h3>Range Query Structures: Segment Trees & Fenwick Trees</h3>
<p>These structures optimize queries on interval ranges of arrays:</p>
<ul>
  <li><strong>Segment Tree:</strong> A binary tree where each node represents an interval of the array. Supports range queries in <code>O(log N)</code> and point updates in <code>O(log N)</code>.</li>
  <li><strong>Fenwick Tree (Binary Indexed Tree):</strong> A space-efficient tree structure represented as an array. Supports prefix sum queries and point updates in <code>O(log N)</code> time.</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What is the runtime for range sum queries and point updates in a Segment Tree?",
            options: [
              { text: "Range sum: O(1), update: O(N)", isCode: false },
              { text: "Range sum: O(log N), update: O(log N)", isCode: false },
              { text: "Range sum: O(N), update: O(1)", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Segment Trees perform both updates and range queries in O(log N) time by traversing height levels."
          }]
        }
      },
      'union-find-dsa': {
        lesson: {
          title: 'Disjoint Set Union (Union-Find)',
          content: `<h3>Disjoint Set Union (Union-Find)</h3>
<p>The **Disjoint Set (Union-Find)** data structure manages a collection of disjoint sets. It supports two primary operations:</p>
<ul>
  <li><strong>Find:</strong> Identifies which set a particular element belongs to.</li>
  <li><strong>Union:</strong> Merges two disjoint sets into a single set.</li>
</ul>
<p>By using **Path Compression** and **Union by Rank**, operations run in near-constant time: <code>O(α(N))</code>.</p>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What optimization compresses path heights in a Disjoint Set?",
            options: [
              { text: "Path Compression", isCode: false },
              { text: "Union by Rank", isCode: false },
              { text: "Binary rotation", isCode: false }
            ],
            correctAnswerIndex: 0,
            explanation: "Path Compression updates visited nodes to point directly to the set representative node during Find operations."
          }]
        }
      },
      'suffix-trees-arrays': {
        lesson: {
          title: 'Suffix Trees & Suffix Arrays',
          content: `<h3>Suffix Trees & Suffix Arrays</h3>
<p>These structures analyze substring properties in text:</p>
<ul>
  <li><strong>Suffix Tree:</strong> A compressed trie containing all suffixes of a string. Allows substring searches and pattern matching in <code>O(M)</code> time, where M is the pattern length.</li>
  <li><strong>Suffix Array:</strong> A sorted array of all suffixes of a string. More space-efficient than suffix trees, supporting queries in <code>O(M log N)</code> time.</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "How does a Suffix Array compare to a Suffix Tree?",
            options: [
              { text: "Suffix arrays are faster but use more memory", isCode: false },
              { text: "Suffix arrays are more space-efficient but require slightly longer search runtimes", isCode: false },
              { text: "Suffix arrays cannot search for substrings", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Suffix Arrays use a sorted array layout that saves significant memory over suffix trees, but lookups take O(M log N) instead of O(M) time."
          }]
        }
      },
      'skip-lists-dsa': {
        lesson: {
          title: 'Skip Lists: Randomized Hierarchies',
          content: `<h3>Skip Lists: Randomized Hierarchies</h3>
<p>A **Skip List** is a randomized data structure that extends a sorted linked list with multiple layers of express lanes. It acts as an alternative to self-balancing search trees.</p>
<p>The bottom layer is a standard sorted linked list. Higher layers skip elements using a coin-toss randomization algorithm to determine node heights. Search, insertion, and deletion run in <code>O(log N)</code> average time.</p>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What design pattern does a Skip List use to build express lanes?",
            options: [
              { text: "Deterministic rotation algorithms", isCode: false },
              { text: "Randomized coin-toss probability to determine node heights", isCode: false },
              { text: "B+ tree leaf pointer links", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Skip Lists use randomization to build higher express lanes, avoiding complex balancing operations."
          }]
        }
      },
      'brute-force-recursion': {
        lesson: {
          title: 'Brute Force & Recursion',
          content: `<h3>Brute Force & Recursion</h3>
<p>Core algorithmic paradigms:</p>
<ul>
  <li><strong>Brute Force:</strong> Systematically evaluates all possible solutions. Easy to implement but slow (often exponential time).</li>
  <li><strong>Recursion:</strong> A function that calls itself to solve smaller subproblems. Requires a **Base Case** to prevent infinite loops and stack overflows.</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What is the purpose of the base case in a recursive function?",
            options: [
              { text: "To initialize variables", isCode: false },
              { text: "To define when recursion should stop, preventing stack overflow", isCode: false },
              { text: "To allocate Heap objects", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "The base case defines a terminating condition that stops recursive calls, returning back up the call stack."
          }]
        }
      },
      'backtracking-divide-conquer': {
        lesson: {
          title: 'Backtracking & Divide-and-Conquer',
          content: `<h3>Backtracking & Divide-and-Conquer</h3>
<p>Optimized recursion strategies:</p>
<ul>
  <li><strong>Backtracking:</strong> Explores solutions incrementally, abandoning a path as soon as it violates constraints (e.g. N-Queens, Sudoku).</li>
  <li><strong>Divide-and-Conquer:</strong> Splits a problem into independent subproblems, solves them recursively, and combines their results (e.g. Merge Sort).</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "Which paradigm is best suited for solving constraint satisfaction problems like the N-Queens puzzle?",
            options: [
              { text: "Greedy Algorithms", isCode: false },
              { text: "Backtracking", isCode: false },
              { text: "Divide-and-Conquer", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Backtracking systematically builds and discards candidate paths as soon as they violate constraints."
          }]
        }
      },
      'greedy-randomized-algorithms': {
        lesson: {
          title: 'Greedy & Randomized Algorithms',
          content: `<h3>Greedy & Randomized Algorithms</h3>
<p>Approaches for optimization problems:</p>
<ul>
  <li><strong>Greedy:</strong> Makes the locally optimal choice at each step, hoping to find a global optimum (e.g. Prim's MST, Huffman Coding). Fast but does not guarantee a global optimum for all problems.</li>
  <li><strong>Randomized:</strong> Uses random numbers to guide choices (e.g. Quick Sort partition pivots). Helps avoid worst-case scenarios.</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "Does a Greedy algorithm always find the globally optimal solution?",
            options: [
              { text: "Yes, it guarantees a global optimum", isCode: false },
              { text: "No, it makes local choices that do not guarantee a global optimum for all problems", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Greedy algorithms choose the best immediate option, which can sometimes miss the global optimum."
          }]
        }
      },
      'dynamic-programming-dsa': {
        lesson: {
          title: 'Dynamic Programming',
          content: `<h3>Dynamic Programming</h3>
<p><strong>Dynamic Programming (DP)</strong> solves complex problems by breaking them down into overlapping subproblems. It solves each subproblem once and stores the result to avoid redundant work.</p>
<p>DP approaches include:</p>
<ul>
  <li><strong>Memoization (Top-Down):</strong> Solves recursively and caches results in a table.</li>
  <li><strong>Tabulation (Bottom-Up):</strong> Solves iteratively, building up the solution table from the base cases.</li>
</ul>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What is the difference between Memoization and Tabulation?",
            options: [
              { text: "Memoization is bottom-up (iterative); Tabulation is top-down (recursive)", isCode: false },
              { text: "Memoization is top-down (recursive); Tabulation is bottom-up (iterative)", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Memoization uses recursion and caches results. Tabulation solves iteratively, filling a table from base cases up."
          }]
        }
      },
      'fast-slow-pointers': {
        lesson: {
          title: 'Fast & Slow Pointers (Cycle Detection)',
          content: `<h3>Fast & Slow Pointers (Cycle Detection)</h3>
<p>Also known as **Hare & Tortoise algorithm**, this pattern uses two pointers moving at different speeds (slow moves 1 step, fast moves 2 steps).</p>
<p>Commonly used to detect cycles in linked lists or array structures. If a cycle exists, the fast pointer will eventually catch up and meet the slow pointer.</p>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What happens if a cycle exists in a linked list traversed by fast and slow pointers?",
            options: [
              { text: "The fast pointer reaches null first", isCode: false },
              { text: "The fast and slow pointers will meet at the same node", isCode: false },
              { text: "The code throws a NullPointerException", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "In a cycle, the fast pointer loops around and eventually meets the slow pointer."
          }]
        }
      },
      'merge-intervals-pattern': {
        lesson: {
          title: 'Merge Intervals',
          content: `<h3>Merge Intervals</h3>
<p>This pattern is used to solve problems involving overlapping intervals (e.g. meeting room schedules, range unions).</p>
<p>It typically starts by sorting the intervals by their start times. Then, it iterates through the intervals, merging overlapping ones by comparing the start of the current interval with the end of the previous one.</p>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What is the first step in solving a Merge Intervals problem?",
            options: [
              { text: "Sort the intervals by their start times", isCode: false },
              { text: "Compare adjacent end times randomly", isCode: false },
              { text: "Allocate a binary heap", isCode: false }
            ],
            correctAnswerIndex: 0,
            explanation: "Sorting by start times ensures that potentially overlapping intervals are adjacent, enabling O(N) merging."
          }]
        }
      },
      'cyclic-sort-pattern': {
        lesson: {
          title: 'Cyclic Sort',
          content: `<h3>Cyclic Sort</h3>
<p><strong>Cyclic Sort</strong> is used to solve problems involving arrays containing numbers in a given range (e.g. 1 to N).</p>
<p>It places each number X at index X-1 by swapping elements into place iteratively, solving problems like finding missing numbers in O(N) time and O(1) space.</p>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What is the time complexity of Cyclic Sort on an array containing values from 1 to N?",
            options: [
              { text: "O(N²)", isCode: false },
              { text: "O(N)", isCode: false },
              { text: "O(N log N)", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Cyclic Sort places elements in their correct index within at most N swaps, yielding O(N) linear runtime."
          }]
        }
      },
      'two-heaps-pattern': {
        lesson: {
          title: 'Two Heaps Pattern',
          content: `<h3>Two Heaps Pattern</h3>
<p>This pattern is used to solve problems where we need to split elements into two parts to find running medians or track dynamic partition boundaries.</p>
<p>It maintains a **Max Heap** for the smaller half of the numbers and a **Min Heap** for the larger half. This layout keeps the middle elements at the root of the heaps, supporting median extraction in O(1) time.</p>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "How does the Two Heaps pattern track running medians?",
            options: [
              { text: "By using a balanced AVL tree", isCode: false },
              { text: "By storing the smaller half in a Max Heap and the larger half in a Min Heap", isCode: false },
              { text: "By sorting the array on every insertion", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Keeping elements balanced across a Max Heap (lower half) and Min Heap (upper half) makes the median values accessible at the roots."
          }]
        }
      },
      'kth-element-pattern': {
        lesson: {
          title: 'Kth Element & QuickSelect',
          content: `<h3>Kth Element & QuickSelect</h3>
<p>QuickSelect is a selection algorithm used to find the Kth smallest/largest element in an unsorted array without sorting it entirely.</p>
<p>It uses the same partitioning logic as QuickSort. It selects a pivot, partitions the array, and recursively searches only the partition containing the target Kth index. Average runtime: <code>O(N)</code>.</p>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What is the average time complexity of finding the Kth element using QuickSelect?",
            options: [
              { text: "O(N log N)", isCode: false },
              { text: "O(N)", isCode: false },
              { text: "O(N²)", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "QuickSelect only recurses into one partition, reducing average runtime from O(N log N) to linear O(N)."
          }]
        }
      },
      'island-traversal-pattern': {
        lesson: {
          title: 'Island Traversal (Matrix DFS/BFS)',
          content: `<h3>Island Traversal (Matrix DFS/BFS)</h3>
<p>This pattern is used to traverse 2D grid/matrix structures where cells represent nodes and adjacent connections represent edges.</p>
<p>It traverses the matrix row-by-row. When it hits a target cell (e.g. land '1'), it triggers DFS/BFS recursion to visit and mark all connected land cells (e.g. setting them to '0' or marking them visited) to count or analyze connected components (islands).</p>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "What technique is commonly used to avoid infinite loops during grid traversal?",
            options: [
              { text: "Heap sorting the grid cells", isCode: false },
              { text: "Marking visited cells as you traverse them", isCode: false },
              { text: "Linear probing", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "Marking cells as visited (or changing their value) prevents traversing them multiple times."
          }]
        }
      },
      'concurrency-interview-patterns': {
        lesson: {
          title: 'Multi-threaded Concurrency Patterns',
          content: `<h3>Multi-threaded Concurrency Patterns</h3>
<p>This pattern is used to design parallel algorithms that run safely and efficiently on multi-core systems.</p>
<p>It involves coordinating thread pools, futures, latch barriers, and blocking queues. Common problems include the Producer-Consumer pattern, which coordinates threads using wait/notify or blocking queue structures.</p>`,
          visualizations: []
        },
        quiz: {
          questions: [{
            questionText: "Which class handles the Producer-Consumer pattern by managing thread safety and blocking operations automatically?",
            options: [
              { text: "ArrayList", isCode: false },
              { text: "BlockingQueue (like ArrayBlockingQueue)", isCode: false },
              { text: "HashMap", isCode: false }
            ],
            correctAnswerIndex: 1,
            explanation: "BlockingQueue handles wait/notify synchronization internally, blocking producers when full and consumers when empty."
          }]
        }
      }
    };

    return data[slug] || data['java-syntax'];
  };

  const activeLesson = currentLesson || getMockedLessonData(lessonSlug).lesson;
  const activeQuiz = currentQuiz || getMockedLessonData(lessonSlug).quiz;

  const { theory: theoryContent, analogy: analogyContent } = splitLessonContent(activeLesson.content);
  const hasVisualizations = activeLesson.visualizations && activeLesson.visualizations.length > 0;

  return (
    <div className="viewer-wrapper">
      {/* Lesson Viewer Header Toolbar */}
      <div className="viewer-toolbar">
        <button className="btn-back-catalog" onClick={onCloseViewer}>
          <i className="fa-solid fa-chevron-left"></i> Back to Catalog
        </button>
        <h3>{activeLesson.title}</h3>
        <div className="telemetry-milestone">
          {xpUnlocked ? (
            <><i className="fa-solid fa-circle-check" style={{ color: 'var(--brand-cyan)', marginRight: '0.5rem' }}></i> Passed (+50 XP)</>
          ) : (
            <><i className="fa-solid fa-hourglass-start" style={{ marginRight: '0.5rem' }}></i> Uncompleted</>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Decrypting lesson memory snapshot...</div>
      ) : (
        /* Layout pane switcher based on visualizations presence */
        <div className={hasVisualizations ? "split-pane-layout" : "single-pane-layout"}>
          {/* Left Column: Visual Memory Map Simulator */}
          {hasVisualizations && (
            <div className="left-pane">
              <VisualMemoryMap visualizations={activeLesson.visualizations} />
            </div>
          )}

          {/* Column: Dynamic Narrative Panel & Assessments */}
          <div className={hasVisualizations ? "right-pane" : "right-pane full-width-pane"}>
            <div className="right-pane-tabs-row">
              <button 
                className={`tab-trigger ${activeTab === 'theory' ? 'active' : ''}`}
                onClick={() => setActiveTab('theory')}
              >
                <i className="fa-solid fa-book-open" style={{ marginRight: '0.5rem' }}></i> Theory
              </button>
              <button 
                className={`tab-trigger ${activeTab === 'analogy' ? 'active' : ''}`}
                onClick={() => setActiveTab('analogy')}
              >
                <i className="fa-solid fa-lightbulb" style={{ marginRight: '0.5rem' }}></i> Analogy
              </button>
              <button 
                className={`tab-trigger ${activeTab === 'quiz' ? 'active' : ''}`}
                onClick={() => setActiveTab('quiz')}
              >
                <i className="fa-solid fa-circle-question" style={{ marginRight: '0.5rem' }}></i> Quiz
              </button>
            </div>

            {/* Tabs Content Switcher */}
            <div className="pane-tab-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flexGrow: 1 }}>
              {activeTab === 'theory' && (
                <div 
                  className="theory-narrative-box"
                  dangerouslySetInnerHTML={{ __html: theoryContent || activeLesson.content }}
                />
              )}

              {activeTab === 'analogy' && (
                <div 
                  className="analogy-narrative-box"
                  dangerouslySetInnerHTML={{ 
                    __html: analogyContent || 
                            (fallbackAnalogies[lessonSlug] ? fallbackAnalogies[lessonSlug].html : defaultAnalogy(activeLesson.title)) 
                  }}
                />
              )}

              {activeTab === 'quiz' && (
                <QuizWidget 
                  quiz={activeQuiz} 
                  onQuizPassed={handleQuizPassed} 
                  onSubmitAnswer={currentLesson && currentLesson._id ? (selectedIdx) => submitScore(currentLesson._id, selectedIdx) : null}
                />
              )}
            </div>

            {/* Styled Non-Intrusive Ethical Ad Banner (Platform costs support) */}
            <div className="ethical-ad-banner" style={{
              marginTop: '2rem',
              backgroundColor: 'var(--bg-primary)',
              border: '1px dashed var(--bg-tertiary)',
              borderRadius: 'var(--border-radius-md)',
              padding: '1rem',
              textAlign: 'center',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}>
              <span className="ad-tag" style={{
                fontSize: '0.65rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                color: 'var(--brand-cyan)',
                border: '1px solid var(--brand-cyan-muted)',
                padding: '0.15rem 0.4rem',
                borderRadius: '3px',
                marginRight: '0.75rem'
              }}>Ethical Ad</span>
              Master placements preparation! Unlock detailed resume analyses and verified printable graduation credentials with <a href="#premium" style={{ fontWeight: '600', color: 'var(--brand-cyan)' }}>NoobSyte Premium</a>.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LessonViewer;
