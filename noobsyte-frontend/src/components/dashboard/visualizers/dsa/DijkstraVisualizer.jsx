import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function DijkstraVisualizer() {
  const nodes = ['A', 'B', 'C', 'D', 'E', 'F'];
  
  const graph = {
    A: { B: 4, C: 2 },
    B: { C: 1, D: 5, E: 3 },
    C: { D: 8, E: 10 },
    D: { E: 2, F: 6 },
    E: { F: 3 },
    F: {}
  };

  const nodeCoords = {
    A: { x: 50, y: 90 },
    B: { x: 170, y: 35 },
    C: { x: 170, y: 145 },
    D: { x: 290, y: 35 },
    E: { x: 290, y: 145 },
    F: { x: 380, y: 90 }
  };

  const [source, setSource] = useState('A');
  const [target, setTarget] = useState('F');

  // Playback states
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [steps, setSteps] = useState([
    {
      distances: { A: 0, B: '∞', C: '∞', D: '∞', E: '∞', F: '∞' },
      visited: [],
      pq: [{ node: 'A', dist: 0 }],
      predecessors: { A: null, B: null, C: null, D: null, E: null, F: null },
      log: 'Click Run Dijkstra to trace shortest paths step-by-step.',
      currentNode: null,
      activeEdge: null,
      pathEdges: []
    }
  ]);

  const generateSteps = () => {
    let trace = [];
    let dist = { A: Infinity, B: Infinity, C: Infinity, D: Infinity, E: Infinity, F: Infinity };
    let visited = [];
    let predecessors = { A: null, B: null, C: null, D: null, E: null, F: null };
    let pq = [];

    dist[source] = 0;
    pq.push({ node: source, dist: 0 });

    trace.push({
      distances: { ...dist },
      visited: [...visited],
      pq: [...pq],
      predecessors: { ...predecessors },
      log: `Initialize: Set distance to source node ${source} as 0 and all other nodes as Infinity. Push ${source} to Priority Queue.`,
      currentNode: null,
      activeEdge: null,
      pathEdges: []
    });

    while (pq.length > 0) {
      // Sort priority queue to extract minimum
      pq.sort((a, b) => a.dist - b.dist);
      const curr = pq.shift();
      const u = curr.node;

      if (visited.includes(u)) continue;

      trace.push({
        distances: { ...dist },
        visited: [...visited],
        pq: [...pq, curr], // Show current being extracted
        predecessors: { ...predecessors },
        log: `Extract node ${u} with minimum distance (${curr.dist}) from Priority Queue.`,
        currentNode: u,
        activeEdge: null,
        pathEdges: []
      });

      // Relaxation
      const neighbors = graph[u];
      for (let v in neighbors) {
        if (visited.includes(v)) continue;

        const weight = neighbors[v];
        const newDist = dist[u] + weight;

        trace.push({
          distances: { ...dist },
          visited: [...visited],
          pq: [...pq],
          predecessors: { ...predecessors },
          log: `Checking edge ${u} ${'->'} ${v} with weight ${weight}. New path distance = dist[${u}] (${dist[u]}) + ${weight} = ${newDist}.`,
          currentNode: u,
          activeEdge: `${u}-${v}`,
          pathEdges: []
        });

        if (newDist < dist[v]) {
          dist[v] = newDist;
          predecessors[v] = u;
          // Check if already in queue or needs insertion
          pq = pq.filter(item => item.node !== v);
          pq.push({ node: v, dist: newDist });

          trace.push({
            distances: { ...dist },
            visited: [...visited],
            pq: [...pq],
            predecessors: { ...predecessors },
            log: `Success! New distance ${newDist} is less than current dist[${v}] (${dist[v] === Infinity ? '∞' : dist[v]}). Update dist[${v}] = ${newDist}, predecessor[${v}] = ${u}.`,
            currentNode: u,
            activeEdge: `${u}-${v}`,
            pathEdges: []
          });
        } else {
          trace.push({
            distances: { ...dist },
            visited: [...visited],
            pq: [...pq],
            predecessors: { ...predecessors },
            log: `No update. New path distance ${newDist} is not shorter than current dist[${v}] (${dist[v]}).`,
            currentNode: u,
            activeEdge: `${u}-${v}`,
            pathEdges: []
          });
        }
      }

      visited.push(u);

      trace.push({
        distances: { ...dist },
        visited: [...visited],
        pq: [...pq],
        predecessors: { ...predecessors },
        log: `Mark node ${u} as visited. Its shortest path distance is finalized at ${dist[u]}.`,
        currentNode: null,
        activeEdge: null,
        pathEdges: []
      });

      // If target node is extracted, we can stop early
      if (u === target) {
        break;
      }
    }

    // Shortest path reconstruction
    let path = [];
    let pathEdges = [];
    let temp = target;
    while (predecessors[temp] !== null) {
      const p = predecessors[temp];
      pathEdges.push(`${p}-${temp}`);
      path.unshift(temp);
      temp = p;
    }
    if (temp === source) {
      path.unshift(source);
    }

    trace.push({
      distances: { ...dist },
      visited: [...visited],
      pq: [...pq],
      predecessors: { ...predecessors },
      log: `Shortest path resolved from ${source} to ${target}: ${path.join(' -> ')} (Total Distance: ${dist[target]}).`,
      currentNode: null,
      activeEdge: null,
      pathEdges: pathEdges
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
        distances: { A: 0, B: '∞', C: '∞', D: '∞', E: '∞', F: '∞' },
        visited: [],
        pq: [{ node: 'A', dist: 0 }],
        predecessors: { A: null, B: null, C: null, D: null, E: null, F: null },
        log: 'Dijkstra simulation reset. Click Run Dijkstra to begin.',
        currentNode: null,
        activeEdge: null,
        pathEdges: []
      }
    ]);
  };

  const activeStepData = steps[currentStep] || steps[0];
  const activeDist = activeStepData.distances;

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Source:</span>
      <select 
        value={source} 
        onChange={(e) => setSource(e.target.value)}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        {nodes.map(n => <option key={n} value={n}>{n}</option>)}
      </select>

      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Target:</span>
      <select 
        value={target} 
        onChange={(e) => setTarget(e.target.value)}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        {nodes.map(n => <option key={n} value={n}>{n}</option>)}
      </select>

      <button className="btn-viz-action btn-add" onClick={generateSteps}>
        Run Dijkstra
      </button>
      <button className="btn-viz-action btn-clear" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Priority Queue State</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.4rem 0.6rem',
          fontFamily: 'monospace',
          color: 'var(--brand-cyan)',
          minHeight: '40px'
        }}>
          {activeStepData.pq.length > 0 
            ? activeStepData.pq.map(item => `[${item.node}: ${item.dist}]`).join(', ') 
            : 'Empty'}
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Predecessors Path mapping</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.4rem 0.6rem',
          fontFamily: 'monospace',
          color: 'var(--text-secondary)',
          fontSize: '0.75rem'
        }}>
          {Object.keys(activeStepData.predecessors).map(k => (
            <div key={k}>{k} {'<-'} {activeStepData.predecessors[k] || 'null'}</div>
          ))}
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>Dijkstra's Algorithm</strong> is a greedy algorithm that solves the **Single-Source Shortest Path** problem on a directed or undirected graph with non-negative edge weights:</p>
      <ul>
        <li><strong>Greedy Strategy:</strong> It maintains a set of visited nodes and a Priority Queue of unvisited node distances. At each step, it extracts the node with the minimum tentative distance.</li>
        <li><strong>Edge Relaxation:</strong> For the extracted node <code>u</code>, it inspects all outgoing edges to adjacent nodes <code>v</code>. If going through <code>u</code> reduces the distance to <code>v</code>, the distance is updated (relaxed): <code>dist[v] = dist[u] + weight(u, v)</code>.</li>
        <li><strong>Predecessors Map:</strong> Storing the predecessor node that relaxed the value allows back-tracing the shortest path once the destination is extracted.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Dijkstra's Algorithm as **spreading liquid ripples on a network of connected pipes**:</p>
      <ul>
        <li>Liquid starts flowing from the source node A.</li>
        <li>It travels through each pipe at a speed inversely proportional to its resistance (edge weight).</li>
        <li>The moment the liquid first reaches a pipe joint (node), that path represents the absolute fastest, shortest route from the start!</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Negative Weights:</strong> Trying to run Dijkstra on a graph with negative edge weights. This breaks the greedy assumption (use Bellman-Ford instead).</li>
      <li><strong>Missing PQ Decrements:</strong> Failing to update the priority queue elements when a shorter path is found, which results in redundant expansions.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is the time complexity of Dijkstra\'s Algorithm utilizing a Binary Heap?',
      a: 'The runtime is O((V + E) log V), where V is the number of vertices and E is the number of edges. Each vertex is extracted from the queue once, and each edge relaxation can trigger a heap decrease-key operation.'
    },
    {
      q: 'Why does Dijkstra\'s Algorithm fail with negative edge weights?',
      a: 'Dijkstra operates on the greedy assumption that once a node is marked visited, its shortest path is permanently finalized. A negative weight edge could later relax a visited node to a smaller value, violating this guarantee.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which data structure is utilized in Dijkstra\'s algorithm to efficiently select the next node to visit?',
      options: [
        'Stack (LIFO)',
        'Queue (FIFO)',
        'Priority Queue (Min-Heap)',
        'Hash Table'
      ],
      correctIdx: 2,
      explanation: 'A Priority Queue (or Min-Heap) is used to extract the unvisited node with the smallest tentative distance in O(log V) time.'
    },
    {
      question: 'Given source node A, dist[B]=4, dist[C]=2, and edge C -> B has weight 1. What will be the relaxed dist[B]?',
      options: [
        '4',
        '3',
        '2',
        '1'
      ],
      correctIdx: 1,
      explanation: 'Relaxation formula: newDist = dist[C] + weight(C->B) = 2 + 1 = 3. Since 3 < 4 (current dist[B]), dist[B] updates to 3.'
    }
  ];

  return (
    <VisualizerShell
      title="Dijkstra Shortest Path Simulator"
      subtitle="Step through greedy node relaxations, priority queue weights, and path reconstructions."
      timeComplexity="O((V + E) log V)"
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
          {/* Draw Directed Edges */}
          {Object.keys(graph).map(u => {
            const uCoords = nodeCoords[u];
            return Object.keys(graph[u]).map(v => {
              const vCoords = nodeCoords[v];
              const edgeId = `${u}-${v}`;
              const isRelaxing = activeStepData.activeEdge === edgeId;
              const isPath = activeStepData.pathEdges.includes(edgeId);
              
              let stroke = 'var(--bg-tertiary)';
              let strokeWidth = '1.5';
              
              if (isRelaxing) {
                stroke = '#1591DC';
                strokeWidth = '3';
              } else if (isPath) {
                stroke = '#10b981';
                strokeWidth = '3';
              }

              // Compute mid-point for weight label placement
              const midX = (uCoords.x + vCoords.x) / 2;
              const midY = (uCoords.y + vCoords.y) / 2;
              const weight = graph[u][v];

              return (
                <g key={edgeId}>
                  {/* Line */}
                  <line
                    x1={uCoords.x}
                    y1={uCoords.y}
                    x2={vCoords.x}
                    y2={vCoords.y}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    style={{ transition: 'all 0.2s' }}
                  />
                  {/* Arrow marker decoration */}
                  <polygon
                    points={`${vCoords.x},${vCoords.y} ${vCoords.x - 6},${vCoords.y - 3} ${vCoords.x - 6},${vCoords.y + 3}`}
                    fill={stroke}
                    transform={`rotate(${Math.atan2(vCoords.y - uCoords.y, vCoords.x - uCoords.x) * 180 / Math.PI}, ${vCoords.x}, ${vCoords.y}) translate(-14, 0)`}
                  />
                  {/* Weight Label */}
                  <rect
                    x={midX - 7}
                    y={midY - 8}
                    width="14"
                    height="12"
                    fill="var(--bg-primary)"
                    rx="2"
                  />
                  <text
                    x={midX}
                    y={midY + 1}
                    textAnchor="middle"
                    fill="var(--text-tertiary)"
                    style={{ fontSize: '0.6rem', fontWeight: 'bold', fontFamily: 'monospace' }}
                  >
                    {weight}
                  </text>
                </g>
              );
            });
          })}

          {/* Draw Nodes */}
          {nodes.map(n => {
            const coords = nodeCoords[n];
            const isActive = activeStepData.currentNode === n;
            const isVisited = activeStepData.visited.includes(n);
            const dist = activeDist[n];

            let bg = 'var(--bg-secondary)';
            let stroke = 'var(--bg-tertiary)';
            let color = '#FFFFFF';

            if (isActive) {
              bg = 'rgba(21, 145, 220, 0.15)';
              stroke = '#1591DC';
              color = '#1591DC';
            } else if (isVisited) {
              bg = 'rgba(16, 185, 129, 0.08)';
              stroke = '#10b981';
              color = '#10b981';
            }

            return (
              <g key={n}>
                {/* Distance Value text above Node */}
                <text
                  x={coords.x}
                  y={coords.y - 18}
                  textAnchor="middle"
                  fill="var(--text-secondary)"
                  style={{ fontSize: '0.7rem', fontWeight: 'bold', fontFamily: 'monospace' }}
                >
                  dist: {dist === Infinity ? '∞' : dist}
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

                {/* Node Name */}
                <text
                  x={coords.x}
                  y={coords.y + 4.5}
                  textAnchor="middle"
                  fill={color}
                  style={{ fontSize: '0.8rem', fontWeight: '800', fontFamily: 'sans-serif' }}
                >
                  {n}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '1.5px solid #1591DC', backgroundColor: 'rgba(21, 145, 220, 0.15)' }}></div> Extracting
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '1.5px solid #10b981', backgroundColor: 'rgba(16, 185, 129, 0.08)' }}></div> Visited
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '15px', height: '2px', backgroundColor: '#1591DC' }}></div> Relaxing Edge
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '15px', height: '2px', backgroundColor: '#10b981' }}></div> Shortest Path Edge
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
