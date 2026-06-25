import React, { useEffect, useContext, useState } from 'react';
import { LearningContext } from '../context/LearningContext';
import { getLessonBySlug } from '../curriculum/curriculumRegistry';
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
  'classes-objects': {
    title: 'The Aadhaar Blueprint',
    html: `
      <h4><i class="fa-solid fa-lightbulb" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i> The Aadhaar Blueprint</h4>
      <p>UIDAI defines a standard template (Class) for an Aadhaar Card. It dictates that every card must have a name, birth year, and a unique 12-digit number. When UIDAI prints cards for Arjun and Priya, it instantiates physical cards (Objects) with their specific data on plastic cards (Heap Memory).</p>
      <div class="analogy-alert">
        <p><strong>Class:</strong> The Aadhaar template. It specifies fields like name and Aadhaar number, but contains no actual person's data.</p>
        <p><strong>Object:</strong> Arjun's actual physical Aadhaar card with number <code>1234-5678-9012</code>.</p>
        <p><strong>Constructor:</strong> The enrollment and printing system that takes bio-data and manufactures the physical card.</p>
      </div>
    `
  },
  'encapsulation': {
    title: 'The ATM Cash Vault',
    html: `
      <h4><i class="fa-solid fa-lightbulb" style="color: var(--brand-cyan); margin-right: 0.5rem;"></i> The ATM Cash Vault</h4>
      <p>Inside an ATM is a private vault filled with cash. The bank doesn't allow customers to open the vault door directly. Instead, they interact via a limited public interface (keypad, screen, cash dispenser) that performs security validations and constraint checks first.</p>
      <div class="analogy-alert">
        <p><strong>Private State:</strong> The physical cash storage and logs deep inside the vault.</p>
        <p><strong>Public Interface:</strong> The keypad and withdrawal methods (Getters/Setters) which validate PIN and balance limits.</p>
        <p><strong>Defensive Copying:</strong> Handing you printed cash bills rather than giving you access to the cash cassettes, keeping the cassettes intact.</p>
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
    const lesson = getLessonBySlug(slug);
    return lesson ? { lesson, quiz: lesson.quiz } : { lesson: null, quiz: null };
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
