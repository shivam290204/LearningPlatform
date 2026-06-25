import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function TopoSortVisualizer() {
  const nodes = ['A', 'B', 'C', 'D', 'E', 'F'];
  
  const nodeNames = {
    A: 'Intro CS',
    B: 'Data Structures',
    C: 'Web Dev',
    D: 'Algorithms',
    E: 'Operating Systems',
    F: 'Compiler Design'
  };

  const graph = {
    A: ['B', 'C'],
    B: ['D', 'E'],
    C: [],
    D: ['F'],
    E: ['F'],
    F: []
  };

  const nodeCoords = {
    A: { x: 50, y: 90 },
    B: { x: 170, y: 40 },
    C: { x: 170, y: 140 },
    D: { x: 290, y: 40 },
    E: { x: 290, y: 140 },
    F: { x: 390, y: 90 }
  };

  // Playback states
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  
  const [steps, setSteps] = useState([
    {
      inDegrees: { A: 0, B: 1, C: 1, D: 1, E: 1, F: 2 },
      queue: [],
      output: [],
      activeNode: null,
      activeEdges: [],
      log: 'Click Run Topo Sort to execute Kahn\'s BFS dependency algorithm.'
    }
  ]);

  const generateSteps = () => {
    let trace = [];
    
    // Step 1: Initial in-degrees calculation
    let inDegrees = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
    Object.keys(graph).forEach(u => {
      graph[u].forEach(v => {
        inDegrees[v]++;
      });
    });

    trace.push({
      inDegrees: { ...inDegrees },
      queue: [],
      output: [],
      activeNode: null,
      activeEdges: [],
      log: `Initialize: Calculate in-degrees (count of incoming edges) for all nodes.`
    });

    // Step 2: Push in-degree 0 to Queue
    let queue = [];
    Object.keys(inDegrees).forEach(node => {
      if (inDegrees[node] === 0) {
        queue.push(node);
      }
    });

    trace.push({
      inDegrees: { ...inDegrees },
      queue: [...queue],
      output: [],
      activeNode: null,
      activeEdges: [],
      log: `Find all nodes with in-degree = 0: [${queue.join(', ')}]. Push them to the Queue.`
    });

    let output = [];
    let currentInDegrees = { ...inDegrees };

    while (queue.length > 0) {
      const u = queue.shift();
      
      trace.push({
        inDegrees: { ...currentInDegrees },
        queue: [...queue],
        output: [...output],
        activeNode: u,
        activeEdges: [],
        log: `Dequeue node [${nodeNames[u]}] (${u}) and append it to the topological output.`
      });

      output.push(u);

      const neighbors = graph[u];
      if (neighbors.length > 0) {
        // Highlight active edges radiating from u
        trace.push({
          inDegrees: { ...currentInDegrees },
          queue: [...queue],
          output: [...output],
          activeNode: u,
          activeEdges: neighbors.map(v => `${u}-${v}`),
          log: `Inspect dependencies originating from ${u}: [${neighbors.join(', ')}].`
        });

        // Decrement neighbors
        for (let v of neighbors) {
          currentInDegrees[v]--;
          const decremented = currentInDegrees[v];

          if (decremented === 0) {
            queue.push(v);
            trace.push({
              inDegrees: { ...currentInDegrees },
              queue: [...queue],
              output: [...output],
              activeNode: u,
              activeEdges: [`${u}-${v}`],
              log: `Decrement in-degree of neighbor ${v}. It becomes 0! Push ${v} to the Queue.`
            });
          } else {
            trace.push({
              inDegrees: { ...currentInDegrees },
              queue: [...queue],
              output: [...output],
              activeNode: u,
              activeEdges: [`${u}-${v}`],
              log: `Decrement in-degree of neighbor ${v}. New in-degree = ${decremented}.`
            });
          }
        }
      }
    }

    trace.push({
      inDegrees: { ...currentInDegrees },
      queue: [],
      output: [...output],
      activeNode: null,
      activeEdges: [],
      log: `Queue is empty. Kahn's algorithm successfully completed. Topological Order: ${output.join(' -> ')}`
    });

    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Playback timer
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < steps.length - 1) {
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
  }, [isPlaying, speed, steps]);

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setSteps([
      {
        inDegrees: { A: 0, B: 1, C: 1, D: 1, E: 1, F: 2 },
        queue: [],
        output: [],
        activeNode: null,
        activeEdges: [],
        log: 'Topological Sort reset. Click Run Topo Sort to start.'
      }
    ]);
  };

  const activeStepData = steps[currentStep] || steps[0];

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <button className="btn-viz-action btn-add" onClick={generateSteps}>
        Run Topo Sort (Kahn's)
      </button>
      <button className="btn-viz-action btn-clear" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>BFS Queue State</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.4rem 0.6rem',
          fontFamily: 'monospace',
          color: 'var(--brand-cyan)',
          minHeight: '40px'
        }}>
          {activeStepData.queue.length > 0 
            ? activeStepData.queue.map(q => `${q} (${nodeNames[q]})`).join(', ') 
            : 'Empty'}
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Topological Order Output</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.4rem 0.6rem',
          fontFamily: 'monospace',
          color: '#10b981',
          fontSize: '0.8rem',
          minHeight: '40px'
        }}>
          {activeStepData.output.length > 0 
            ? activeStepData.output.join(' ➔ ') 
            : 'Empty'}
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>Topological Sort</strong> (or topo-sort) of a **Directed Acyclic Graph (DAG)** is a linear ordering of its vertices such that for every directed edge <code>u {'->'} v</code>, vertex <code>u</code> comes before <code>v</code> in the ordering:</p>
      <ul>
        <li><strong>DAG Restriction:</strong> Topological sorting is ONLY possible if the graph has **no directed cycles** (is acyclic) and is directed. If a cycle exists, dependencies are circular (e.g. A requires B, B requires A), and no order can exist.</li>
        <li><strong>Kahn\'s Algorithm (BFS-based):</strong>
          <ol>
            <li>Compute the in-degree (number of incoming edges) for each node.</li>
            <li>Enque all nodes with in-degree = 0.</li>
            <li>While the queue is not empty: Dequeue node <code>u</code>, add it to the topological sort. For each neighbor <code>v</code> of <code>u</code>, decrement its in-degree. If its in-degree becomes 0, enqueue it.</li>
          </ol>
        </li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Topological Sort as **University Course Prerequisite Scheduling**:</p>
      <ul>
        <li>You cannot take <em>Algorithms (D)</em> without taking <em>Data Structures (B)</em> first.</li>
        <li>Similarly, you cannot take <em>Compiler Design (F)</em> until you finish both <em>Algorithms (D)</em> and <em>Operating Systems (E)</em>.</li>
        <li>Topological Sort outputs a perfect, semester-by-semester chronological course list that honors all prerequisites!</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Cyclic Graphs:</strong> Trying to run topological sort on a graph with cycles. Kahn\'s algorithm detects this: if the final topological list contains fewer nodes than the total vertices, a cycle exists.</li>
      <li><strong>Incorrect Initial In-degrees:</strong> Forgetting to count all incoming edge connections before inserting nodes to the initial queue.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'How can you detect a cycle in a directed graph using Topological Sort?',
      a: 'If Kahn\'s BFS algorithm terminates and the output list length is less than V (number of vertices), it means some vertices could never enter the queue because their in-degrees never reached 0. This is a direct indication of a cycle.'
    },
    {
      q: 'Can a graph have multiple valid topological sorts?',
      a: 'Yes, absolutely. In our course graph, since Intro CS (A) is independent, taking Web Dev (C) first or DSA (B) first are both valid paths, leading to multiple correct ordering permutations.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which of the following graphs CANNOT be topologically sorted?',
      options: [
        'A directed graph with 3 nodes forming a triangle A -> B -> C -> A',
        'An undirected tree graph',
        'A directed acyclic bipartite graph',
        'A directed graph where all nodes have in-degree <= 1'
      ],
      correctIdx: 0,
      explanation: 'A -> B -> C -> A is a directed cycle. Because of circular dependencies, no node will ever have an in-degree of 0, making topological sorting impossible.'
    },
    {
      question: 'In Kahn\'s algorithm, what does in-degree represent?',
      options: [
        'The number of outgoing edges from a node',
        'The number of incoming edges to a node',
        'The depth of the node from the root',
        'The weight of the shortest path'
      ],
      correctIdx: 1,
      explanation: 'In-degree represents the count of incoming directed edges pointing to a node. In course prerequisites, it represents the count of remaining parent courses required before taking this course.'
    }
  ];

  return (
    <VisualizerShell
      title="Topological Sort Simulator"
      subtitle="Solve course scheduling prerequisites utilizing Kahn's BFS in-degree algorithm."
      timeComplexity="O(V + E)"
      spaceComplexity="O(V + E)"
      theoryContent={theory}
      analogyContent={analogy}
      mistakesContent={mistakes}
      interviewQuestions={interviewQuestions}
      quizQuestions={quizQuestions}
      controls={controls}
      logs={[activeStepData.log]}
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
        totalSteps: steps.length
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%', minHeight: '220px', padding: '1rem 0' }}>
        
        <svg width="430" height="180" style={{ overflow: 'visible' }}>
          {/* Draw directed edges */}
          {Object.keys(graph).map(u => {
            const uCoords = nodeCoords[u];
            return graph[u].map(v => {
              const vCoords = nodeCoords[v];
              const edgeId = `${u}-${v}`;
              const isActive = activeStepData.activeEdges.includes(edgeId);
              
              let stroke = 'var(--bg-tertiary)';
              let strokeWidth = '1.5';
              
              if (isActive) {
                stroke = '#1591DC';
                strokeWidth = '3';
              }

              return (
                <g key={edgeId}>
                  <line
                    x1={uCoords.x}
                    y1={uCoords.y}
                    x2={vCoords.x}
                    y2={vCoords.y}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    style={{ transition: 'all 0.2s' }}
                  />
                  {/* Arrow marker */}
                  <polygon
                    points={`${vCoords.x},${vCoords.y} ${vCoords.x - 6},${vCoords.y - 3} ${vCoords.x - 6},${vCoords.y + 3}`}
                    fill={stroke}
                    transform={`rotate(${Math.atan2(vCoords.y - uCoords.y, vCoords.x - uCoords.x) * 180 / Math.PI}, ${vCoords.x}, ${vCoords.y}) translate(-14, 0)`}
                  />
                </g>
              );
            });
          })}

          {/* Draw Nodes */}
          {nodes.map(n => {
            const coords = nodeCoords[n];
            const isActive = activeStepData.activeNode === n;
            const isProcessed = activeStepData.output.includes(n);
            const inDegree = activeStepData.inDegrees[n];

            let bg = 'var(--bg-secondary)';
            let stroke = 'var(--bg-tertiary)';
            let color = '#FFFFFF';

            if (isActive) {
              bg = 'rgba(21, 145, 220, 0.15)';
              stroke = '#1591DC';
              color = '#1591DC';
            } else if (isProcessed) {
              bg = 'rgba(16, 185, 129, 0.08)';
              stroke = '#10b981';
              color = '#10b981';
            }

            return (
              <g key={n}>
                {/* In-Degree Counter above node */}
                <text
                  x={coords.x}
                  y={coords.y - 18}
                  textAnchor="middle"
                  fill={inDegree === 0 && !isProcessed ? '#1591DC' : 'var(--text-secondary)'}
                  style={{ fontSize: '0.7rem', fontWeight: 'bold', fontFamily: 'monospace' }}
                >
                  In-Degree: {inDegree}
                </text>

                {/* Node Circle */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="13"
                  fill={bg}
                  stroke={stroke}
                  strokeWidth="2.5"
                  style={{ transition: 'all 0.2s' }}
                />

                {/* Node Label (A, B, C...) */}
                <text
                  x={coords.x}
                  y={coords.y + 4.5}
                  textAnchor="middle"
                  fill={color}
                  style={{ fontSize: '0.8rem', fontWeight: '800', fontFamily: 'sans-serif' }}
                >
                  {n}
                </text>

                {/* Course Name tooltip beneath node */}
                <text
                  x={coords.x}
                  y={coords.y + 24}
                  textAnchor="middle"
                  fill="var(--text-tertiary)"
                  style={{ fontSize: '0.55rem', fontWeight: '600' }}
                >
                  {nodeNames[n]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '1.5px solid #1591DC', backgroundColor: 'rgba(21, 145, 220, 0.15)' }}></div> Active
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '1.5px solid #10b981', backgroundColor: 'rgba(16, 185, 129, 0.08)' }}></div> Processed
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '15px', height: '2px', backgroundColor: '#1591DC' }}></div> Decrementing Edge
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
