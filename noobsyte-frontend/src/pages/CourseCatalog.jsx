import React, { useEffect, useContext, useState, useRef } from 'react';
import { LearningContext } from '../context/LearningContext';
import { ProgressContext } from '../context/ProgressContext';
import { AuthContext } from '../context/AuthContext';
import JavaSandbox from '../components/dashboard/JavaSandbox';
import InteractiveVisualizer from '../components/dashboard/InteractiveVisualizer';

function CourseCatalog({ 
  onSelectLesson, 
  onClaimCertificate,
  activeCatalogTab,
  setActiveCatalogTab,
  selectedCourseSlug,
  setSelectedCourseSlug
}) {
  const { courses, modules, loading, fetchCourses, fetchCourseModules } = useContext(LearningContext);
  const { completedLessons, activeStreak, totalXp } = useContext(ProgressContext);
  const { user } = useContext(AuthContext);

  const [activeRoadmapMod, setActiveRoadmapMod] = useState(1);
  const [simStep, setSimStep] = useState('declare'); // 'declare' or 'allocate'

  // Ref for roadmap scrolling
  const roadmapRef = useRef(null);
  const modulesRef = useRef(null);

  // Load courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCourseClick = async (courseSlug) => {
    if (selectedCourseSlug === courseSlug) {
      setSelectedCourseSlug(null);
    } else {
      setSelectedCourseSlug(courseSlug);
      await fetchCourseModules(courseSlug);
      if (modulesRef.current) {
        modulesRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToSection = (elementRef) => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Hybrid Java & DSA Curriculum structure
  const roadmapModules = [
    { num: 1, title: 'Java Syntax & Control Flow', desc: 'Variables, primitive vs reference types, conditionals, and execution loops.' },
    { num: 2, title: 'Problem Solving & Functions', desc: 'Pseudo code logic building, methods declaration, and call stack parameters.' },
    { num: 3, title: 'OOP Foundations', desc: 'Classes, objects, constructors, and heap instance allocations.' },
    { num: 4, title: 'JVM Internals & Memory Models', desc: 'Compilation vs interpretation mechanics, JIT, and Stack vs Heap frames.' },
    { num: 5, title: 'Exception Handling & Resource Safety', desc: 'Checked/unchecked exception hierarchies and robust try-catch blocks.' },
    { num: 6, title: 'Collections & Generic Programming', desc: 'ArrayList, LinkedList, HashMap collision mechanics, and type safety.' },
    { num: 7, title: 'Multithreading & Concurrency', desc: 'Thread executions, runnable interfaces, race conditions, and synchronization.' },
    { num: 8, title: 'Introduction to Data Structures', desc: 'What are data structures, why organization is critical, and basic categories.' },
    { num: 9, title: 'Algorithmic Complexity', desc: 'Time and space complexity calculations, Big-O, Big-θ, Big-Ω, and common runtimes.' },
    { num: 10, title: 'Search Algorithms', desc: 'Linear search and binary search halving recursively.' },
    { num: 11, title: 'Sorting Algorithms', desc: 'Quadratic sorts (Bubble, Selection, Insertion) and Divide-and-Conquer sorts (Merge, Quick, Heap sort).' },
    { num: 12, title: 'Basic Linear Data Structures', desc: 'Arrays, Singly/Doubly/Circular Linked Lists, Stacks, and Queues.' },
    { num: 13, title: 'Hash Tables & Hashing', desc: 'Hash functions, separate chaining, and linear probing collision resolutions.' },
    { num: 14, title: 'Trees & Traversals', desc: 'Binary Trees, BST, AVL Trees, Heap priority queues, and In/Pre/Post-Order traversals.' },
    { num: 15, title: 'Graph Representations & Traversals', desc: 'Adjacency list vs matrix representations, directed vs undirected graph structures, BFS, and DFS.' },
    { num: 16, title: 'Graph Shortest Paths', desc: "Dijkstra's, Bellman-Ford, and A* pathfinding algorithms." },
    { num: 17, title: 'Minimum Spanning Trees', desc: "Prim's and Kruskal's MST algorithms with Union-Find check." },
    { num: 18, title: 'Multi-way Indexing Structures', desc: '2-3 Trees, B/B+ Trees, Database indexing, and ISAM storage methods.' },
    { num: 19, title: 'Advanced Range Queries & Strings', desc: 'Tries, Segment Trees, Fenwick Trees, Disjoint Set Union, Suffix Trees, and Suffix Arrays.' },
    { num: 20, title: 'Skip Lists', desc: 'Randomized coin-toss sorted linked lists express lanes.' },
    { num: 21, title: 'Algorithmic Paradigms', desc: 'Brute Force, recursion base cases, backtracking, greedy choices, and dynamic programming memoization.' },
    { num: 22, title: 'Interview Patterns - Part 1', desc: 'Sliding window, Two pointer, fast & slow pointers, merge intervals, and cyclic sort.' },
    { num: 23, title: 'Interview Patterns - Part 2', desc: 'Two heaps medians, QuickSelect Kth element, island grid traversals, and concurrency patterns.' }
  ];

  const getMockedCurriculum = () => {
    return [
      {
        title: 'Mastering Java: From Zero to Hero',
        slug: 'java-masterclass-core-to-advanced',
        description: 'Master variables, stack & heap models, parameters passing, object oriented architecture, multithreading, and database integrations without dry textbook jargon.',
        difficulty: 'beginner to advanced',
        lessonsCount: 10,
        quizzesCount: 10,
        estTime: '10 Hours'
      },
      {
        title: 'Java DSA: Master Data Structures & Algorithms',
        slug: 'java-dsa-masterclass',
        description: 'Master Big-O analysis, sorting algorithms, recursion, linked lists, stacks, queues, trees, heaps, graphs, and dynamic programming in Java.',
        difficulty: 'intermediate to advanced',
        lessonsCount: 37,
        quizzesCount: 37,
        estTime: '30 Hours'
      }
    ];
  };

  const getMockedModules = (courseSlug) => {
    if (courseSlug === 'java-masterclass-core-to-advanced') {
      return [
        {
          title: 'Module 1: Java Syntax & Control Flow',
          lessons: [
            { title: 'Language Syntax & Variables', slug: 'java-syntax', time: '8 min', sim: false, quiz: true },
            { title: 'Control Structures & Conditionals', slug: 'control-structures', time: '12 min', sim: false, quiz: true }
          ]
        },
        {
          title: 'Module 2: Problem Solving & Execution',
          lessons: [
            { title: 'Pseudo Code & Logic Building', slug: 'pseudo-code', time: '10 min', sim: false, quiz: true },
            { title: 'Functions & Method Execution', slug: 'java-functions', time: '14 min', sim: false, quiz: true }
          ]
        },
        {
          title: 'Module 3: Object-Oriented Programming (OOP) Foundations',
          lessons: [
            { title: 'OOP Basics (Classes, Objects, Constructors)', slug: 'oop-basics', time: '10 min', sim: false, quiz: true }
          ]
        },
        {
          title: 'Module 4: JVM Internals & Memory Models',
          lessons: [
            { title: 'Compilation vs. Interpretation Mechanics', slug: 'compilation-mechanics', time: '10 min', sim: true, quiz: true },
            { title: 'Stack vs. Heap Allocation Models', slug: 'jvm-stack-frame', time: '14 min', sim: true, quiz: true }
          ]
        },
        {
          title: 'Module 5: Exception Handling & Resource Safety',
          lessons: [
            { title: 'Checked vs. Unchecked Exception Hierarchy', slug: 'exceptions-hierarchy', time: '10 min', sim: false, quiz: true }
          ]
        },
        {
          title: 'Module 6: Collections Framework',
          lessons: [
            { title: 'Java Collections Framework', slug: 'java-collections', time: '12 min', sim: true, quiz: true }
          ]
        },
        {
          title: 'Module 7: Multithreading & Concurrency',
          lessons: [
            { title: 'Threads, Runnables & Concurrency Patterns', slug: 'threads-runnable', time: '11 min', sim: false, quiz: true }
          ]
        }
      ];
    } else if (courseSlug === 'java-dsa-masterclass') {
      return [
        {
          title: 'Module 8: Introduction to Data Structures',
          lessons: [
            { title: 'What are Data Structures?', slug: 'what-are-data-structures', time: '8 min', sim: false, quiz: true },
            { title: 'Why are Data Structures Important?', slug: 'why-data-structures-important', time: '10 min', sim: false, quiz: true }
          ]
        },
        {
          title: 'Module 9: Algorithmic Complexity & Common Runtimes',
          lessons: [
            { title: 'Time vs. Space Complexity & Calculations', slug: 'complexity-calculations', time: '12 min', sim: false, quiz: true },
            { title: 'Asymptotic Notation (Big-O, Big-θ, Big-Ω)', slug: 'asymptotic-notations', time: '11 min', sim: false, quiz: true },
            { title: 'Common Runtimes Analysis', slug: 'common-runtimes', time: '14 min', sim: false, quiz: true }
          ]
        },
        {
          title: 'Module 10: Search Algorithms',
          lessons: [
            { title: 'Linear Search vs. Binary Search', slug: 'linear-binary-search', time: '10 min', sim: false, quiz: true }
          ]
        },
        {
          title: 'Module 11: Sorting Algorithms',
          lessons: [
            { title: 'Quadratic Sorts (Bubble, Selection, Insertion)', slug: 'quadratic-sorts', time: '15 min', sim: false, quiz: true },
            { title: 'Divide-and-Conquer Sorts (Merge, Quick)', slug: 'divide-and-conquer-sorts', time: '18 min', sim: false, quiz: true },
            { title: 'Heap Sort', slug: 'heap-sort-dsa', time: '14 min', sim: false, quiz: true }
          ]
        },
        {
          title: 'Module 12: Basic Linear Data Structures',
          lessons: [
            { title: 'Arrays & Memory Mappings', slug: 'array-memory-mapping', time: '11 min', sim: false, quiz: true },
            { title: 'Singly, Doubly, & Circular Linked Lists', slug: 'linked-lists-types', time: '16 min', sim: true, quiz: true },
            { title: 'Stacks (LIFO) & Queues (FIFO)', slug: 'stacks-queues-dsa', time: '12 min', sim: true, quiz: true }
          ]
        },
        {
          title: 'Module 13: Hash Tables & Hashing',
          lessons: [
            { title: 'Hash Functions & Collision Resolution', slug: 'hashing-collision', time: '12 min', sim: false, quiz: true }
          ]
        },
        {
          title: 'Module 14: Non-Linear Data Structures: Trees',
          lessons: [
            { title: 'Binary Trees & Tree Traversals', slug: 'binary-tree-traversals', time: '14 min', sim: false, quiz: true },
            { title: 'Binary Search Trees (BST) & Balanced AVL Trees', slug: 'bst-avl-trees', time: '16 min', sim: false, quiz: true },
            { title: 'Heaps & Priority Queues', slug: 'heaps-priority-queues', time: '12 min', sim: true, quiz: true }
          ]
        },
        {
          title: 'Module 15: Graph Data Structures',
          lessons: [
            { title: 'Directed vs. Undirected Graph Representations', slug: 'graph-representations', time: '12 min', sim: false, quiz: true },
            { title: 'Graph Traversals: BFS & DFS', slug: 'graph-bfs-dfs', time: '15 min', sim: false, quiz: true }
          ]
        },
        {
          title: 'Module 16: Graph Shortest Path Algorithms',
          lessons: [
            { title: "Dijkstra's, Bellman-Ford, and A* Algorithms", slug: 'graph-shortest-paths', time: '18 min', sim: false, quiz: true }
          ]
        },
        {
          title: 'Module 17: Graph Algorithms: Minimum Spanning Trees',
          lessons: [
            { title: "Prim's and Kruskal's Algorithms", slug: 'graph-mst-algorithms', time: '16 min', sim: false, quiz: true }
          ]
        },
        {
          title: 'Module 18: Tree Indexing & Database Structures',
          lessons: [
            { title: 'Multi-way Trees (2-3 Trees, B/B+ Trees)', slug: 'b-trees-indexing', time: '18 min', sim: false, quiz: true },
            { title: 'Database Indexing: Linear vs. Tree-Based Indexing', slug: 'linear-tree-indexing', time: '15 min', sim: false, quiz: true },
            { title: 'ISAM (Indexed Sequential Access Method)', slug: 'isam-indexing', time: '14 min', sim: false, quiz: true }
          ]
        },
        {
          title: 'Module 19: Advanced Data Structures',
          lessons: [
            { title: 'Trie (Prefix Tree)', slug: 'trie-prefix-tree', time: '15 min', sim: false, quiz: true },
            { title: 'Range Query Structures: Segment Trees & Fenwick Trees', slug: 'segment-fenwick-trees', time: '18 min', sim: false, quiz: true },
            { title: 'Disjoint Set Union (Union-Find)', slug: 'union-find-dsa', time: '14 min', sim: false, quiz: true },
            { title: 'Suffix Trees & Suffix Arrays', slug: 'suffix-trees-arrays', time: '16 min', sim: false, quiz: true }
          ]
        },
        {
          title: 'Module 20: Complex Structures & Skip Lists',
          lessons: [
            { title: 'Skip Lists: Randomized Hierarchies', slug: 'skip-lists-dsa', time: '15 min', sim: false, quiz: true }
          ]
        },
        {
          title: 'Module 21: Algorithmic Paradigms',
          lessons: [
            { title: 'Brute Force & Recursion', slug: 'brute-force-recursion', time: '12 min', sim: false, quiz: true },
            { title: 'Backtracking & Divide-and-Conquer', slug: 'backtracking-divide-conquer', time: '16 min', sim: false, quiz: true },
            { title: 'Greedy & Randomized Algorithms', slug: 'greedy-randomized-algorithms', time: '15 min', sim: false, quiz: true },
            { title: 'Dynamic Programming', slug: 'dynamic-programming-dsa', time: '18 min', sim: false, quiz: true }
          ]
        },
        {
          title: 'Module 22: Essential Coding Interview Patterns - Part 1',
          lessons: [
            { title: 'Sliding Window & Two Pointer Techniques', slug: 'sliding-window-two-pointer', time: '15 min', sim: false, quiz: true },
            { title: 'Fast & Slow Pointers (Cycle Detection)', slug: 'fast-slow-pointers', time: '12 min', sim: false, quiz: true },
            { title: 'Merge Intervals', slug: 'merge-intervals-pattern', time: '14 min', sim: false, quiz: true },
            { title: 'Cyclic Sort', slug: 'cyclic-sort-pattern', time: '14 min', sim: false, quiz: true }
          ]
        },
        {
          title: 'Module 23: Essential Coding Interview Patterns - Part 2',
          lessons: [
            { title: 'Two Heaps Pattern', slug: 'two-heaps-pattern', time: '15 min', sim: false, quiz: true },
            { title: 'Kth Element & QuickSelect', slug: 'kth-element-pattern', time: '12 min', sim: false, quiz: true },
            { title: 'Island Traversal (Matrix DFS/BFS)', slug: 'island-traversal-pattern', time: '15 min', sim: false, quiz: true },
            { title: 'Multi-threaded Concurrency Patterns', slug: 'concurrency-interview-patterns', time: '16 min', sim: false, quiz: true }
          ]
        }
      ];
    }
    return [];
  };

  const displayedCourses = courses && courses.length > 0 ? courses : getMockedCurriculum();
  
  // Calculate completed modules dynamically based on completed lessons
  const topicsMasteredCount = Math.min(Math.floor(completedLessons.length / 2), 23);

  return (
    <div className="catalog-wrapper">
      
      {/* Workspace Tabs Navigation Row */}
      <div className="workspace-tabs-row">
        <button
          className={`workspace-tab-btn ${activeCatalogTab === 'learning' ? 'active' : ''}`}
          onClick={() => setActiveCatalogTab('learning')}
        >
          <i className="fa-solid fa-graduation-cap" style={{ marginRight: '0.5rem' }}></i> Learn & Roadmap
        </button>
        <button
          className={`workspace-tab-btn ${activeCatalogTab === 'syllabus' ? 'active' : ''}`}
          onClick={() => setActiveCatalogTab('syllabus')}
        >
          <i className="fa-solid fa-cubes" style={{ marginRight: '0.5rem' }}></i> Syllabus
        </button>
        <button
          className={`workspace-tab-btn ${activeCatalogTab === 'jvm' ? 'active' : ''}`}
          onClick={() => setActiveCatalogTab('jvm')}
        >
          <i className="fa-solid fa-brain" style={{ marginRight: '0.5rem' }}></i> Visualizer
        </button>
        <button
          className={`workspace-tab-btn ${activeCatalogTab === 'sandbox' ? 'active' : ''}`}
          onClick={() => setActiveCatalogTab('sandbox')}
        >
          <i className="fa-solid fa-terminal" style={{ marginRight: '0.5rem' }}></i> Coding Sandbox
        </button>
        <button
          className={`workspace-tab-btn ${activeCatalogTab === 'certificate' ? 'active' : ''}`}
          onClick={() => setActiveCatalogTab('certificate')}
        >
          <i className="fa-solid fa-award" style={{ marginRight: '0.5rem' }}></i> Get Certificate
        </button>
      </div>

      {activeCatalogTab === 'learning' && (
        <>
          {/* ==================================
              SECTION 1: HERO SECTION
              ================================== */}
          <section className="hero-section">
            <div className="hero-badge">
              <span className="badge-glow-dot"></span> PURE JAVA VISUAL ACCELERATOR
            </div>
            <h1 className="hero-title">
              Master Java <span className="highlight-text">the Visual Way</span>
            </h1>
            <p className="hero-subtitle">
              Zero boring textbooks, 100% execution-based depth.
            </p>

            {/* Highlights Deck */}
            <div className="hero-highlights-deck">
              <div className="hero-highlight-item">
                <span className="highlight-icon"><i className="fa-solid fa-book-open"></i></span>
                <div className="highlight-info">
                  <span className="info-title">120+ Lessons</span>
                  <span className="info-sub">Core to Advanced</span>
                </div>
              </div>
              <div className="hero-highlight-item">
                <span className="highlight-icon"><i className="fa-solid fa-bullseye"></i></span>
                <div className="highlight-info">
                  <span className="info-title">Beginner to Expert</span>
                  <span className="info-sub">Career Oriented</span>
                </div>
              </div>
              <div className="hero-highlight-item">
                <span className="highlight-icon"><i className="fa-solid fa-bolt"></i></span>
                <div className="highlight-info">
                  <span className="info-title">XP System</span>
                  <span className="info-sub">Active Rewards</span>
                </div>
              </div>
              <div className="hero-highlight-item">
                <span className="highlight-icon"><i className="fa-solid fa-trophy"></i></span>
                <div className="highlight-info">
                  <span className="info-title">Certificates</span>
                  <span className="info-sub">Verified Credentials</span>
                </div>
              </div>
              <div className="hero-highlight-item">
                <span className="highlight-icon"><i className="fa-solid fa-brain"></i></span>
                <div className="highlight-info">
                  <span className="info-title">JVM Visuals</span>
                  <span className="info-sub">Stack & Heap SIMs</span>
                </div>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="hero-cta-group">
              <button 
                className="btn-primary btn-hero-primary" 
                onClick={() => setActiveCatalogTab('syllabus')}
              >
                Start Learning <i className="fa-solid fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
              </button>
              <button 
                className="btn-secondary btn-hero-secondary"
                onClick={() => scrollToSection(roadmapRef)}
              >
                Explore Roadmap <i className="fa-solid fa-diagram-project" style={{ marginLeft: '0.5rem' }}></i>
              </button>
            </div>
          </section>

          {/* ==================================
              SECTION 2: LEARNING STATS
              ================================== */}
          <section className="dashboard-stats-section">
            <div className="section-title-wrap">
              <div className="stats-header-group">
                <i className="fa-solid fa-chart-line stats-icon-brand"></i>
                <h3>Your Learning Telemetry</h3>
              </div>
              <p className="stats-subtitle">Real-time tracking of your Java core and execution milestones.</p>
            </div>

            <div className="stats-dashboard-grid">
              <div className="stats-card">
                <div className="stats-card-main">
                  <span className="stats-value">{completedLessons.length}</span>
                  <span className="stats-label">Lessons Completed</span>
                </div>
                <div className="stats-card-footer">
                  <i className="fa-solid fa-circle-check"></i> Out of 120 lessons
                </div>
              </div>

              <div className="stats-card">
                <div className="stats-card-main">
                  <span className="stats-value">{totalXp}</span>
                  <span className="stats-label">XP Earned</span>
                </div>
                <div className="stats-card-footer">
                  <i className="fa-solid fa-bolt"></i> Boosted by perfect quizzes
                </div>
              </div>

              <div className="stats-card">
                <div className="stats-card-main">
                  <span className="stats-value">{activeStreak} Days</span>
                  <span className="stats-label">Current Streak</span>
                </div>
                <div className="stats-card-footer">
                  <i className="fa-solid fa-fire"></i> Keep practicing daily
                </div>
              </div>

              <div className="stats-card">
                <div className="stats-card-main">
                  <span className="stats-value">{completedLessons.length >= 4 ? 1 : 0}</span>
                  <span className="stats-label">Certificates Earned</span>
                </div>
                <div className="stats-card-footer">
                  <i className="fa-solid fa-graduation-cap"></i> Verified credentials
                </div>
              </div>

              <div className="stats-card">
                <div className="stats-card-main">
                  <span className="stats-value">{topicsMasteredCount}/23</span>
                  <span className="stats-label">Topics Mastered</span>
                </div>
                <div className="stats-card-footer">
                  <i className="fa-solid fa-cubes"></i> Core roadmap milestones
                </div>
              </div>
            </div>

            {!user && (
              <div className="guest-tracker-callout">
                <span><i className="fa-solid fa-lock" style={{ marginRight: '0.5rem', color: 'var(--brand-cyan)' }}></i> Progress tracking is currently paused. <strong>Sign In</strong> or <strong>Register</strong> to save your streak and unlock certificates!</span>
              </div>
            )}
          </section>

          {/* ==================================
              SECTION 3: JAVA ROADMAP
              ================================== */}
          <section className="roadmap-section" ref={roadmapRef}>
            <div className="section-title-wrap text-center">
              <div className="badge-roadmap">TIMELINE ROADMAP</div>
              <h2>The Ultimate Java Learning Path</h2>
              <p className="section-desc max-w-600">
                A comprehensive, step-by-step career path mapping out your progression from basic syntax to enterprise systems.
              </p>
            </div>

            <div className="roadmap-layout-container">
              {/* Timeline Scroll Tracker */}
              <div className="roadmap-timeline-tracker">
                <div className="roadmap-track-line">
                  <div 
                    className="roadmap-track-fill" 
                    style={{ height: `${((activeRoadmapMod - 1) / 22) * 100}%` }}
                  ></div>
                </div>

                <div className="roadmap-nodes-container">
                  {roadmapModules.map((m) => {
                    const isActive = activeRoadmapMod === m.num;
                    const isCompleted = m.num <= topicsMasteredCount;
                    return (
                      <div 
                        key={m.num} 
                        className={`roadmap-node-row ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                        onClick={() => setActiveRoadmapMod(m.num)}
                      >
                        <div className="node-bullet-circle">
                          {isCompleted ? <i className="fa-solid fa-check"></i> : m.num}
                        </div>
                        <div className="node-content">
                          <span className="node-module-num">Module {m.num}</span>
                          <h4 className="node-module-title">{m.title}</h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Module Focused Details */}
              <div className="roadmap-focused-panel">
                <div className="focused-panel-glow"></div>
                <div className="focused-header">
                  <span className="focused-tag">ACTIVE SELECTION MODULE {activeRoadmapMod}</span>
                  <h3>{roadmapModules[activeRoadmapMod - 1].title}</h3>
                </div>
                <p className="focused-desc">
                  {roadmapModules[activeRoadmapMod - 1].desc}
                </p>
                
                <div className="focused-milestones-box">
                  <h5>Target Mastery Goals:</h5>
                  <div className="milestones-checklist">
                    <div className="milestone-check-row">
                      <i className="fa-solid fa-circle-check"></i>
                      <span>Deep dive JVM mechanics and byte-code patterns</span>
                    </div>
                    <div className="milestone-check-row">
                      <i className="fa-solid fa-circle-check"></i>
                      <span>Explain pointers, memory allocations, and scopes</span>
                    </div>
                    <div className="milestone-check-row">
                      <i className="fa-solid fa-circle-check"></i>
                      <span>Code-along execution models and debugging labs</span>
                    </div>
                  </div>
                </div>

                <button 
                  className="btn-primary btn-roadmap-focused"
                  onClick={() => setActiveCatalogTab('syllabus')}
                >
                  Go to Syllabus Module <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </div>
          </section>

          {/* ==================================
              SECTION 4: WHAT YOU WILL LEARN
              ================================== */}
          <section className="objectives-section">
            <div className="section-title-wrap">
              <h2>What You Will Master</h2>
              <p className="section-desc">By completing this track, you will develop industrial competence in core and advanced Java.</p>
            </div>

            <div className="learn-objectives-grid">
              <div className="objective-item">
                <div className="objective-icon-wrap">
                  <i className="fa-solid fa-check"></i>
                </div>
                <div className="objective-text">
                  <h4>Understand JVM Architecture</h4>
                  <p>Learn how execution engines, classloaders, and garbage collectors orchestrate memory under the hood.</p>
                </div>
              </div>

              <div className="objective-item">
                <div className="objective-icon-wrap">
                  <i className="fa-solid fa-check"></i>
                </div>
                <div className="objective-text">
                  <h4>Master Heap/Stack Models</h4>
                  <p>See exactly how primitives, objects references, stack frames, and dereferenced heap boundaries allocate memory.</p>
                </div>
              </div>

              <div className="objective-item">
                <div className="objective-icon-wrap">
                  <i className="fa-solid fa-check"></i>
                </div>
                <div className="objective-text">
                  <h4>Implement Object Oriented Architectures</h4>
                  <p>Apply real inheritance models, polymorphic dispatches, encapsulation rules, and dynamic binding contracts.</p>
                </div>
              </div>

              <div className="objective-item">
                <div className="objective-icon-wrap">
                  <i className="fa-solid fa-check"></i>
                </div>
                <div className="objective-text">
                  <h4>Write Bulletproof Multithreaded Core</h4>
                  <p>Understand race conditions, volatile variables, synchronisation barriers, and executors service scopes.</p>
                </div>
              </div>

              <div className="objective-item">
                <div className="objective-icon-wrap">
                  <i className="fa-solid fa-check"></i>
                </div>
                <div className="objective-text">
                  <h4>Leverage Collections Framework</h4>
                  <p>Compare ArrayList, LinkedList, HashMap, and HashSet architectures based on lookup, insertion, and memory parameters.</p>
                </div>
              </div>

              <div className="objective-item">
                <div className="objective-icon-wrap">
                  <i className="fa-solid fa-check"></i>
                </div>
                <div className="objective-text">
                  <h4>Build Real Database Connections</h4>
                  <p>Establish structural JDBC pipelines, statement buffers, prepared transactions, and connection wrappers.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ==================================
              SECTION 5: PLATFORM FEATURES
              ================================== */}
          <section className="features-section">
            <div className="section-title-wrap text-center">
              <div className="badge-features">FEATURES</div>
              <h2>Interactive Visual Learning Features</h2>
              <p className="section-desc max-w-600">
                Engineered from the ground up to guarantee a state-of-the-art interactive study flow.
              </p>
            </div>

            <div className="features-deck-grid">
              <div className="feature-card">
                <div className="feature-icon"><i className="fa-solid fa-brain"></i></div>
                <h4>JVM Simulations</h4>
                <p>Step inside JVM memory stack and heap blocks. Watch references allocation, parameters passing, and heap dereferencing occur in real-time.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon"><i className="fa-solid fa-earth-americas"></i></div>
                <h4>Real-Life Analogies</h4>
                <p>No dry syntax charts. Complex OOP rules and concurrency models explained through intuitive real-world structures.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon"><i className="fa-solid fa-code"></i></div>
                <h4>Interactive Examples</h4>
                <p>Run, modify, and dissect actual code snippets inside modular execution containers right in your browser tab.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon"><i className="fa-solid fa-circle-question"></i></div>
                <h4>Conceptual Quizzes</h4>
                <p>Validate your knowledge at the end of each lesson with challenging quizzes focused on memory rules and structural outcomes.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon"><i className="fa-solid fa-bolt"></i></div>
                <h4>Reward-Driven XP</h4>
                <p>Climb milestones and gain reputation by keeping streaks alive, completing lessons, and answering quizzes cleanly.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon"><i className="fa-solid fa-graduation-cap"></i></div>
                <h4>Verified Certificates</h4>
                <p>Unlock, view, print, and share your graduation certificate to highlight your core Java expertise on platforms like LinkedIn.</p>
              </div>
            </div>
          </section>
        </>
      )}

      {activeCatalogTab === 'syllabus' && (
        /* ==================================
            SECTION 6: COURSE CARDS (MODULES CATALOG)
            ================================== */
        <section className="catalog-grid-section" ref={modulesRef}>
          <div className="section-title-wrap">
            <div className="stats-header-group">
              <i className="fa-solid fa-cubes stats-icon-brand"></i>
              <h3>Interactive Syllabus Courses</h3>
            </div>
            <p className="stats-subtitle">Select a course to inspect its comprehensive syllabus modules and start learning.</p>
          </div>

          {loading && !selectedCourseSlug ? (
            <div className="loading-spinner">Hydrating syllabus tracks...</div>
          ) : (
            <div className="catalog-grid">
              {displayedCourses.map((course) => {
                const isExpanded = selectedCourseSlug === course.slug;
                return (
                  <div
                    key={course.slug}
                    className={`catalog-card-container ${isExpanded ? 'expanded' : ''}`}
                  >
                    <div 
                      className="catalog-course-card"
                      onClick={() => handleCourseClick(course.slug)}
                    >
                      <div className="catalog-badge">Mastery Track</div>
                      <h3>{course.title}</h3>
                      <p>{course.description}</p>
                      
                      {/* Visual metadata metrics */}
                      <div className="course-card-metrics">
                        <span className="metric-row"><i className="fa-solid fa-book"></i> {course.lessonsCount || 120} Lessons</span>
                        <span className="metric-row"><i className="fa-solid fa-circle-question"></i> {course.quizzesCount || 40} Quizzes</span>
                        <span className="metric-row"><i className="fa-solid fa-clock"></i> {course.estTime || '35 Hours'}</span>
                      </div>

                      <div className="card-footer">
                        <span className="difficulty advanced">
                          Beginner to Advanced
                        </span>
                        <div className="card-actions-group" style={{ display: 'flex', gap: '0.75rem' }}>
                          <button 
                            className="btn-claim-cert"
                            onClick={(e) => {
                              e.stopPropagation();
                              onClaimCertificate(course.slug);
                            }}
                            style={{
                              backgroundColor: 'var(--brand-cyan-muted)',
                              color: 'var(--brand-cyan)',
                              border: '1px solid var(--brand-cyan)',
                              padding: '0.5rem 1rem',
                              borderRadius: 'var(--border-radius-sm)',
                              fontSize: '0.85rem',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            Claim Cert <i className="fa-solid fa-graduation-cap" style={{ marginLeft: '0.25rem' }}></i>
                          </button>
                          <button className="btn-explore-modules">
                            {isExpanded ? 'Hide Modules ▲' : 'View Modules ▼'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Sliding Syllabus Module Directory */}
                    {isExpanded && (
                      <div className="modules-directory-tree">
                        {loading ? (
                          <div className="loading-spinner-small">Loading syllabus modules...</div>
                        ) : (
                          (modules && modules.length > 0 ? modules : getMockedModules(course.slug)).map((mod, idx) => (
                            <div key={idx} className="directory-module-block">
                              <h5>{mod.title}</h5>
                              <div className="lessons-slugs-list">
                                {(mod.lessons || []).map((les) => (
                                  <button
                                    key={les.slug}
                                    className="lesson-link-row"
                                    onClick={() => onSelectLesson(les.slug)}
                                  >
                                    <span className="play-icon">▶</span>
                                    <div className="lesson-link-main-details" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                      <span className="lesson-link-title">{les.title}</span>
                                      <div className="lesson-metadata-tags">
                                        {les.sim && <span className="sim-pill"><i className="fa-solid fa-brain"></i> Visual SIM</span>}
                                        {les.quiz && <span className="quiz-pill"><i className="fa-solid fa-circle-question"></i> Quiz Included</span>}
                                      </div>
                                    </div>
                                    <span className="read-badge">{les.time || '10 min'} read</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {activeCatalogTab === 'jvm' && (
        <section className="visualizer-tab-section" style={{ padding: '2rem 0' }}>
          <InteractiveVisualizer />
        </section>
      )}

      {activeCatalogTab === 'sandbox' && (
        <section className="sandbox-tab-section" style={{ padding: '2rem 0' }}>
          <div className="section-title-wrap text-center mb-4">
            <div className="badge-features">LIVE CODING SANDBOX</div>
            <h2>Write and Execute Java Code Live</h2>
            <p className="section-desc max-w-600">
              Run real-time Java syntax checks, evaluate logic streams, and inspect dynamically updated JVM Stack and Heap states.
            </p>
          </div>
          <JavaSandbox />
        </section>
      )}

      {activeCatalogTab === 'certificate' && (
        /* ==================================
            SECTION 8: CERTIFICATION SECTION
            ================================== */
        <section className="certification-promo-section">
          <div className="certificate-showcase-panel">
            <div className="certificate-mock-glow"></div>
            
            <div className="certificate-mock-frame">
              <div className="cert-border-accent"></div>
              <div className="cert-header">
                <div className="cert-logo">noob<span>Syte</span></div>
                <span className="cert-doc-type">VERIFIED ACADEMIC CREDENTIAL</span>
              </div>
              
              <div className="cert-body">
                <span className="cert-presentation">This is to certify that</span>
                <h4>[ YOUR FULL NAME ]</h4>
                <p>has successfully completed the complete visual and interactive track of the</p>
                <h5 className="cert-course-title">Java Fundamentals & Advanced JVM Architecture</h5>
                <p>comprising 120+ interactive lessons, 40+ memory assessments, and JVM Heap allocations mastery labs.</p>
              </div>

              <div className="cert-footer">
                <div className="cert-seal-wrap">
                  <div className="cert-seal">
                    <i className="fa-solid fa-graduation-cap"></i>
                  </div>
                  <span>VERIFIED SYSTEM ID</span>
                </div>
                <div className="cert-date-wrap">
                  <span className="cert-signature-line">Antigravity Architect</span>
                  <span className="cert-date">Date: June 1, 2026</span>
                </div>
              </div>
            </div>

            <div className="certificate-details-info">
              <span className="badge-features">CREDENTIAL OVERVIEW</span>
              <h2>Earn Your Verified Java Fundamentals Certificate</h2>
              <p>
                Highlight your visual Java execution credentials. Complete all modules, solve quizzes perfectly, maintain streaks to rack up XP points, and claim your shared verified graduation certificate.
              </p>
              
              <div className="milestones-checklist mb-4">
                <div className="milestone-check-row">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Complete 120 visual lessons</span>
                </div>
                <div className="milestone-check-row">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Secure passing scores on all module quizzes</span>
                </div>
                <div className="milestone-check-row">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Unlock professional PDF printing and active URLs</span>
                </div>
              </div>

              <button 
                className="btn-primary btn-cert-cta"
                onClick={() => {
                  setActiveCatalogTab('syllabus');
                  setTimeout(() => {
                    if (modulesRef.current) {
                      modulesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                }}
              >
                Start Course & Claim Certificate <i className="fa-solid fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
              </button>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}

export default CourseCatalog;
