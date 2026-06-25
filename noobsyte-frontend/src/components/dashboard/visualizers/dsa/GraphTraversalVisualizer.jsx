import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function GraphTraversalVisualizer() {
  const [traversalType, setTraversalType] = useState('BFS'); // 'BFS' or 'DFS'
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  // Switch traversal type resets step
  const handleTypeChange = (type) => {
    setTraversalType(type);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Node coordinates for SVG
  const nodes = {
    A: { x: 150, y: 35 },
    B: { x: 80, y: 105 },
    C: { x: 220, y: 105 },
    D: { x: 40, y: 175 },
    E: { x: 120, y: 175 },
    F: { x: 220, y: 175 }
  };

  const edges = [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'B', to: 'E' },
    { from: 'C', to: 'F' },
    { from: 'E', to: 'F' }
  ];

  // BFS Timeline steps starting at A
  const bfsSteps = [
    {
      log: 'Initialize BFS: Enqueue root Node A.',
      visited: [],
      frontier: ['A'],
      activeNode: null,
      dataStructure: ['A']
    },
    {
      log: 'Dequeue A. Visit A. Enqueue unvisited neighbors B and C.',
      visited: ['A'],
      frontier: ['B', 'C'],
      activeNode: 'A',
      dataStructure: ['B', 'C']
    },
    {
      log: 'Dequeue B. Visit B. Enqueue unvisited neighbors D and E.',
      visited: ['A', 'B'],
      frontier: ['C', 'D', 'E'],
      activeNode: 'B',
      dataStructure: ['C', 'D', 'E']
    },
    {
      log: 'Dequeue C. Visit C. Enqueue unvisited neighbor F.',
      visited: ['A', 'B', 'C'],
      frontier: ['D', 'E', 'F'],
      activeNode: 'C',
      dataStructure: ['D', 'E', 'F']
    },
    {
      log: 'Dequeue D. Visit D. Neighbor B is already visited.',
      visited: ['A', 'B', 'C', 'D'],
      frontier: ['E', 'F'],
      activeNode: 'D',
      dataStructure: ['E', 'F']
    },
    {
      log: 'Dequeue E. Visit E. Neighbor F is already in queue.',
      visited: ['A', 'B', 'C', 'D', 'E'],
      frontier: ['F'],
      activeNode: 'E',
      dataStructure: ['F']
    },
    {
      log: 'Dequeue F. Visit F. All neighbors visited.',
      visited: ['A', 'B', 'C', 'D', 'E', 'F'],
      frontier: [],
      activeNode: 'F',
      dataStructure: []
    },
    {
      log: 'Queue is empty. BFS Traversal Complete. Visited Order: A -> B -> C -> D -> E -> F.',
      visited: ['A', 'B', 'C', 'D', 'E', 'F'],
      frontier: [],
      activeNode: null,
      dataStructure: []
    }
  ];

  // DFS Timeline steps starting at A (Stack based)
  const dfsSteps = [
    {
      log: 'Initialize DFS: Push root Node A onto Stack.',
      visited: [],
      frontier: ['A'],
      activeNode: null,
      dataStructure: ['A']
    },
    {
      log: 'Pop A. Visit A. Push neighbors B and C onto Stack.',
      visited: ['A'],
      frontier: ['C', 'B'],
      activeNode: 'A',
      dataStructure: ['C', 'B']
    },
    {
      log: 'Pop B from top of Stack. Visit B. Push neighbors D and E.',
      visited: ['A', 'B'],
      frontier: ['C', 'E', 'D'],
      activeNode: 'B',
      dataStructure: ['C', 'E', 'D']
    },
    {
      log: 'Pop D from top of Stack. Visit D. All neighbors visited.',
      visited: ['A', 'B', 'D'],
      frontier: ['C', 'E'],
      activeNode: 'D',
      dataStructure: ['C', 'E']
    },
    {
      log: 'Pop E from top of Stack. Visit E. Push neighbor F.',
      visited: ['A', 'B', 'D', 'E'],
      frontier: ['C', 'F'],
      activeNode: 'E',
      dataStructure: ['C', 'F']
    },
    {
      log: 'Pop F from top of Stack. Visit F. All neighbors visited.',
      visited: ['A', 'B', 'D', 'E', 'F'],
      frontier: ['C'],
      activeNode: 'F',
      dataStructure: ['C']
    },
    {
      log: 'Pop C from Stack. Visit C. All neighbors visited.',
      visited: ['A', 'B', 'D', 'E', 'F', 'C'],
      frontier: [],
      activeNode: 'C',
      dataStructure: []
    },
    {
      log: 'Stack is empty. DFS Traversal Complete. Visited Order: A -> B -> D -> E -> F -> C.',
      visited: ['A', 'B', 'D', 'E', 'F', 'C'],
      frontier: [],
      activeNode: null,
      dataStructure: []
    }
  ];

  const activeSteps = traversalType === 'BFS' ? bfsSteps : dfsSteps;

  // Playback timers
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < activeSteps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, speed, activeSteps]);

  const handleStepForward = () => {
    if (currentStep < activeSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const controls = (
    <>
      <button 
        className={`btn-viz-action ${traversalType === 'BFS' ? 'selected' : ''}`}
        onClick={() => handleTypeChange('BFS')}
        disabled={isPlaying}
      >
        Breadth-First Search (BFS)
      </button>
      <button 
        className={`btn-viz-action ${traversalType === 'DFS' ? 'selected' : ''}`}
        onClick={() => handleTypeChange('DFS')}
        disabled={isPlaying}
      >
        Depth-First Search (DFS)
      </button>
    </>
  );

  const stateInspector = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
      <div>Active Node: <strong style={{ color: '#1591DC' }}>{activeSteps[currentStep].activeNode || 'None'}</strong></div>
      <div>Visited order: <span style={{ color: '#10b981', fontWeight: '700' }}>{activeSteps[currentStep].visited.join(' -> ') || 'None'}</span></div>
      <div>{traversalType === 'BFS' ? 'Queue' : 'Stack'} state: <span style={{ color: '#FFFFFF', fontFamily: 'monospace' }}>[{activeSteps[currentStep].dataStructure.join(', ')}]</span></div>
    </div>
  );

  const theory = (
    <div>
      <p>Graph traversal refers to visiting all vertices in a graph graph model:</p>
      <ul>
        <li><strong>Breadth-First Search (BFS):</strong> Explores vertices layer-by-layer (level-order traversal). It uses a <strong>Queue (FIFO)</strong>. It is optimal for finding the shortest path in unweighted graphs.</li>
        <li><strong>Depth-First Search (DFS):</strong> Explores as deep as possible along each branch before backtracking. It uses a <strong>Stack (LIFO)</strong> (or recursion). It is widely used in cycle detection, topological sorting, and solving puzzles.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of traversals as **methods to explore a maze or network**:</p>
      <ul>
        <li><strong>BFS (Queue):</strong> Pouring water into the maze. The water expands evenly in all directions, covering all nearby paths before moving further away.</li>
        <li><strong>DFS (Stack):</strong> A single explorer who walks straight down a corridor until they hit a dead-end, then backtracks to the last intersection to take the other turn.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Infinite Loops:</strong> Failing to track visited nodes on cyclic graphs, causing the algorithm to loop infinitely between nodes.</li>
      <li><strong>Wrong Data Structure:</strong> Accidentally implementing DFS with a queue, or BFS with a stack, which changes search topologies.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Which graph traversal is used to find the shortest path in an unweighted graph, and why?',
      a: 'BFS is used. Since BFS explores nodes level-by-level, the first time it reaches a target node, it is guaranteed to have taken the shortest path containing the fewest edges.'
    },
    {
      q: 'What is the space complexity of BFS vs DFS on a graph with branching factor B and depth D?',
      a: 'BFS has a worst-case space complexity of O(B^D) because it holds all nodes at the current level in the queue. DFS has a space complexity of O(D) representing the maximum depth stack size, which is much lower in thin/deep trees.'
    }
  ];

  const quizQuestions = [
    {
      question: 'What is the helper data structure used in Breadth-First Search (BFS)?',
      options: [
        'Stack',
        'Queue',
        'Priority Queue',
        'Binary Tree'
      ],
      correctIdx: 1,
      explanation: 'BFS uses a Queue (First-In, First-Out) to process nodes level-by-level in the order they are discovered.'
    },
    {
      question: 'Which traversal starting at Node A would visit Node C last in our graph (edges: A-B, A-C, B-D, B-E, C-F, E-F)?',
      options: [
        'BFS (Breadth-First)',
        'DFS (Depth-First)',
        'Both BFS and DFS',
        'Neither'
      ],
      correctIdx: 1,
      explanation: 'In DFS (using LIFO stack), the path digs deep down A -> B -> D -> E -> F first. C is only visited after backtracking from F, making it the last node visited.'
    }
  ];

  // Helper to color nodes dynamically
  const getNodeColor = (nodeKey) => {
    const stepData = activeSteps[currentStep];
    if (stepData.activeNode === nodeKey) return '#1591DC'; // Blue (active)
    if (stepData.visited.includes(nodeKey)) return '#10b981'; // Green (visited)
    if (stepData.frontier.includes(nodeKey)) return '#f59e0b'; // Amber (in queue/stack)
    return 'var(--bg-secondary)';
  };

  return (
    <VisualizerShell
      title="Graph Traversals (BFS vs DFS)"
      subtitle="Witness search algorithms traverse nodes, updating queues/stacks and tracking visited frontiers."
      timeComplexity="O(V + E)"
      spaceComplexity="O(V)"
      theoryContent={theory}
      analogyContent={analogy}
      mistakesContent={mistakes}
      interviewQuestions={interviewQuestions}
      quizQuestions={quizQuestions}
      logs={[activeSteps[currentStep].log]}
      stateInspector={stateInspector}
      playbackProps={{
        play: () => setIsPlaying(true),
        pause: () => setIsPlaying(false),
        stepForward: handleStepForward,
        stepBackward: handleStepBackward,
        reset: handleReset,
        isPlaying,
        speed,
        setSpeed,
        currentStep,
        totalSteps: activeSteps.length
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', width: '100%', minHeight: '260px' }}>
        
        {/* SVG Node Graph */}
        <svg width="280" height="210" style={{ overflow: 'visible' }}>
          {/* Draw Edges */}
          {edges.map((edge, index) => {
            const fromNode = nodes[edge.from];
            const toNode = nodes[edge.to];
            
            // Check if edge is traversed (both endpoints visited)
            const isTraversed = activeSteps[currentStep].visited.includes(edge.from) && 
                                activeSteps[currentStep].visited.includes(edge.to);

            return (
              <line
                key={index}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={isTraversed ? '#10b981' : 'var(--bg-tertiary)'}
                strokeWidth={isTraversed ? '3.5' : '2'}
                transition="stroke-width 0.3s"
              />
            );
          })}

          {/* Draw Nodes */}
          {Object.keys(nodes).map((key) => {
            const node = nodes[key];
            const color = getNodeColor(key);
            const isWordWhite = color !== 'var(--bg-secondary)';

            return (
              <g key={key}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="18"
                  fill={color}
                  stroke={getNodeColor(key) !== 'var(--bg-secondary)' ? color : 'var(--bg-tertiary)'}
                  strokeWidth="2"
                  style={{ transition: 'all 0.3s' }}
                />
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fill={isWordWhite ? '#000000' : '#FFFFFF'}
                  style={{ fontSize: '0.75rem', fontWeight: '800', fontFamily: 'sans-serif' }}
                >
                  {key}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Visual Queue/Stack container */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {traversalType === 'BFS' ? 'Queue (FIFO) Buffer' : 'Stack (LIFO) Buffer'}:
          </span>
          <div style={{ display: 'flex', gap: '0.4rem', border: '1px solid var(--bg-tertiary)', padding: '0.3rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(0,0,0,0.1)', minHeight: '34px', minWidth: '120px', alignItems: 'center', justifyContent: 'center' }}>
            {activeSteps[currentStep].dataStructure.length === 0 ? (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Empty</span>
            ) : (
              activeSteps[currentStep].dataStructure.map((node, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.2rem 0.4rem',
                    backgroundColor: '#f59e0b',
                    color: '#000000',
                    borderRadius: '2px',
                    fontSize: '0.75rem',
                    fontWeight: '800'
                  }}
                >
                  {node}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
