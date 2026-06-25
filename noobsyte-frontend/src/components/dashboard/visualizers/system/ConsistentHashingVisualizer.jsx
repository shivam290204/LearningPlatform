import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function ConsistentHashingVisualizer() {
  const [nodes, setNodes] = useState([
    { id: 'Node A', angle: 45, color: '#1591DC' },
    { id: 'Node B', angle: 165, color: '#10b981' },
    { id: 'Node C', angle: 285, color: '#a855f7' }
  ]);
  const [keys, setKeys] = useState([
    { name: 'user_1', angle: 20, assignedTo: 'Node A' },
    { name: 'user_2', angle: 90, assignedTo: 'Node B' },
    { name: 'user_3', angle: 200, assignedTo: 'Node C' },
    { name: 'user_4', angle: 310, assignedTo: 'Node A' }
  ]);
  const [virtualNodeFactor, setVirtualNodeFactor] = useState(1);
  const [newKeyName, setNewKeyName] = useState('user_5');

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const [steps, setSteps] = useState([
    {
      log: 'Consistent Hashing ring active with 3 nodes (A, B, C) and 4 distributed keys.',
      nodes: [
        { id: 'Node A', angle: 45, color: '#1591DC' },
        { id: 'Node B', angle: 165, color: '#10b981' },
        { id: 'Node C', angle: 285, color: '#a855f7' }
      ],
      keys: [
        { name: 'user_1', angle: 20, assignedTo: 'Node A' },
        { name: 'user_2', angle: 90, assignedTo: 'Node B' },
        { name: 'user_3', angle: 200, assignedTo: 'Node C' },
        { name: 'user_4', angle: 310, assignedTo: 'Node A' }
      ],
      activeRingLine: null,
      packet: null
    }
  ]);

  const findAssignedNode = (keyAngle, activeNodesList) => {
    // Sort nodes by angle
    const sorted = [...activeNodesList].sort((a, b) => a.angle - b.angle);
    // Clockwise search: find first node with angle >= keyAngle
    for (let node of sorted) {
      if (node.angle >= keyAngle) {
        return node;
      }
    }
    // Wrap around to first node
    return sorted[0];
  };

  const handleAddKey = () => {
    const name = newKeyName.trim();
    if (!name) {
      alert('Enter a valid key name.');
      return;
    }

    // Generate pseudo-random angle (0 to 359)
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    const keyAngle = (sum * 7) % 360;

    const targetNode = findAssignedNode(keyAngle, nodes);
    const newKey = { name, angle: keyAngle, assignedTo: targetNode.id };
    const updatedKeys = [...keys, newKey];

    let trace = [];

    // 1. Map Key to Ring
    trace.push({
      log: `Hash key("${name}") mapped to angle ${keyAngle}° on the circular ring.`,
      nodes: nodes.map(n => ({ ...n })),
      keys: [...keys],
      activeRingLine: { angle: keyAngle, color: '#f59e0b' },
      packet: { text: name, x: 225 + 70 * Math.cos((keyAngle * Math.PI) / 180), y: 100 + 70 * Math.sin((keyAngle * Math.PI) / 180) }
    });

    // 2. Clockwise Scan
    trace.push({
      log: `Scanning clockwise from ${keyAngle}° to find first node. Target reached: ${targetNode.id} at ${targetNode.angle}°.`,
      nodes: nodes.map(n => ({ ...n })),
      keys: [...keys],
      activeRingLine: { angle: targetNode.angle, color: targetNode.color },
      packet: null
    });

    // 3. Assignment
    trace.push({
      log: `Key "${name}" successfully assigned to node ${targetNode.id}. Dynamic mapping saved in routing cache.`,
      nodes: nodes.map(n => ({ ...n })),
      keys: updatedKeys,
      activeRingLine: null,
      packet: null
    });

    setKeys(updatedKeys);
    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleAddNode = () => {
    if (nodes.length >= 5) {
      alert('Maximum of 5 physical nodes for visual simulation.');
      return;
    }

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nextChar = alphabet.charAt(nodes.length);
    const nodeName = `Node ${nextChar}`;
    const nodeAngle = 200 + (nodes.length * 40) % 160; // Spread out angles
    const colors = ['#1591DC', '#10b981', '#a855f7', '#f43f5e', '#eab308'];
    const nodeColor = colors[nodes.length % colors.length];

    const newNode = { id: nodeName, angle: nodeAngle, color: nodeColor };
    const updatedNodes = [...nodes, newNode];

    // Reallocate keys based on new ring layout
    let trace = [];
    let reallocatedCount = 0;
    const reallocatedKeys = keys.map(k => {
      const prev = k.assignedTo;
      const target = findAssignedNode(k.angle, updatedNodes);
      if (target.id !== prev) reallocatedCount++;
      return { ...k, assignedTo: target.id };
    });

    trace.push({
      log: `Add Node: Node ${nextChar} inserted at ${nodeAngle}° on the consistent hashing ring.`,
      nodes: updatedNodes,
      keys: keys.map(k => ({ ...k })),
      activeRingLine: { angle: nodeAngle, color: nodeColor },
      packet: null
    });

    trace.push({
      log: `Re-balancing: Clockwise nodes updated. Only ${reallocatedCount} out of ${keys.length} keys reallocated! Modulo Hashing would reallocate ~80% of keys.`,
      nodes: updatedNodes,
      keys: reallocatedKeys,
      activeRingLine: null,
      packet: null
    });

    setNodes(updatedNodes);
    setKeys(reallocatedKeys);
    setSteps(trace);
    setCurrentStep(0);
  };

  const handleRemoveNode = () => {
    if (nodes.length <= 1) {
      alert('Minimum 1 active node required.');
      return;
    }

    const removed = nodes[nodes.length - 1];
    const updatedNodes = nodes.slice(0, -1);

    let trace = [];
    let reallocatedCount = 0;
    const reallocatedKeys = keys.map(k => {
      const prev = k.assignedTo;
      const target = findAssignedNode(k.angle, updatedNodes);
      if (target.id !== prev) reallocatedCount++;
      return { ...k, assignedTo: target.id };
    });

    trace.push({
      log: `Remove Node: Node ${removed.id.split(' ')[1]} deleted from the hash ring.`,
      nodes: updatedNodes,
      keys: keys.map(k => ({ ...k })),
      activeRingLine: null,
      packet: null
    });

    trace.push({
      log: `Node removal redistribution: Keys originally on ${removed.id} migrate clockwise to adjacent node. ${reallocatedCount} keys reallocated.`,
      nodes: updatedNodes,
      keys: reallocatedKeys,
      activeRingLine: null,
      packet: null
    });

    setNodes(updatedNodes);
    setKeys(reallocatedKeys);
    setSteps(trace);
    setCurrentStep(0);
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
    const initialN = [
      { id: 'Node A', angle: 45, color: '#1591DC' },
      { id: 'Node B', angle: 165, color: '#10b981' },
      { id: 'Node C', angle: 285, color: '#a855f7' }
    ];
    const initialK = [
      { name: 'user_1', angle: 20, assignedTo: 'Node A' },
      { name: 'user_2', angle: 90, assignedTo: 'Node B' },
      { name: 'user_3', angle: 200, assignedTo: 'Node C' },
      { name: 'user_4', angle: 310, assignedTo: 'Node A' }
    ];
    setNodes(initialN);
    setKeys(initialK);
    setSteps([
      {
        log: 'Consistent Hashing ring reset with 3 physical nodes and 4 keys.',
        nodes: initialN,
        keys: initialK,
        activeRingLine: null,
        packet: null
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];
  const activeNodes = activeStep.nodes;
  const activeKeys = activeStep.keys;

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Add Key:</span>
      <input
        type="text"
        value={newKeyName}
        onChange={(e) => setNewKeyName(e.target.value)}
        style={{
          width: '80px',
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      />
      <button className="btn-viz-action btn-add" onClick={handleAddKey}>
        Hash & Map Key
      </button>

      <button className="btn-viz-action" onClick={handleAddNode}>
        Add Cache Node (+1 Node)
      </button>

      <button className="btn-viz-action btn-clear" onClick={handleRemoveNode}>
        Remove Cache Node (-1 Node)
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Virtual Nodes: {virtualNodeFactor}x</span>
        <input
          type="range"
          min="1"
          max="4"
          value={virtualNodeFactor}
          onChange={(e) => setVirtualNodeFactor(parseInt(e.target.value))}
          style={{ width: '100px', accentColor: 'var(--brand-cyan)' }}
        />
      </div>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Key Partition Mapping</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          maxHeight: '90px',
          overflowY: 'auto'
        }}>
          {activeKeys.map((k, index) => (
            <div key={index}>
              {k.name} (hash angle: {k.angle}°) {'->'} <span style={{ fontWeight: 'bold' }}>{k.assignedTo}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Visualizer Analytics</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Active Nodes: <span>{activeNodes.length} physical hosts</span></div>
          <div>Virtual Multiplier: <span>{virtualNodeFactor} virtual tokens per node</span></div>
          <div>Ring Hash Capacity: <span>2^32 keys space (0° to 359°)</span></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>Consistent Hashing</strong> is a routing algorithm designed to solve cache invalidation problems when resizing distributed caching clusters:</p>
      <ul>
        <li><strong>Standard Modulo Hashing:</strong> Maps keys to servers using <code>hash(key) % N</code>. If a server is added or removed, N changes, and almost all key mappings fail, resulting in massive cache misses and database hits.</li>
        <li><strong>Hash Ring:</strong> Both server nodes and data keys are mapped onto a circular 360-degree mathematical ring using their hash values.</li>
        <li><strong>Clockwise Assignment:</strong> A key is routed to the first database node encountered by traveling clockwise along the ring.</li>
        <li><strong>Virtual Nodes:</strong> To prevent "hot spots" (where servers are spaced unevenly on the ring, causing one node to hold most keys), consistent hashing maps multiple virtual points (tokens) on the ring for each physical machine.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Consistent Hashing as a **Clock of Bus Stops**:</p>
      <ul>
        <li><strong>Clock Face:</strong> The circular 12-hour clock face is the Hash Ring.</li>
        <li><strong>Nodes (Bus Stops):</strong> Stops are built at 2 o'clock, 6 o'clock, and 10 o'clock.</li>
        <li><strong>Keys (Passengers):</strong> A passenger stands at 4 o'clock. They walk clockwise (forward) to find the first stop, which is 6 o'clock (Assignment).</li>
        <li><strong>Adding a Node:</strong> If we build a new stop at 5 o'clock, only passengers standing between 4 and 5 o'clock need to change stops. The passengers at 1 o'clock (who use 2 o'clock) are unaffected.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>No Virtual Nodes:</strong> Setting up consistent hashing without virtual nodes. This causes uneven load partitions where one cache server handles 70% of traffic, crashing due to hotspot overload.</li>
      <li><strong>Unsynchronized Topology:</strong> Different microservice instances having mismatched local layouts of the hash ring, routing requests to incorrect servers and corrupting cache entries.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Why is consistent hashing preferred over standard modulo hashing for web caches?',
      a: 'Modulo hashing (key % N) reallocates almost all keys when N changes (node joins/crashes), resulting in huge cache miss spikes that hit the database. Consistent hashing only reallocates K/N keys (where K is keys, N is nodes), protecting downstream databases.'
    },
    {
      q: 'What is the purpose of Virtual Nodes (VNodes) in a Consistent Hashing ring?',
      a: 'VNodes represent a single physical machine at multiple locations on the hash ring. This ensures a uniform distribution of keys across nodes and prevents hotspots where one node is assigned significantly more keys.'
    }
  ];

  const quizQuestions = [
    {
      question: 'In consistent hashing, which direction does a key scan on the ring to locate its host server?',
      options: [
        'Counter-clockwise',
        'Clockwise',
        'Direct pointer jump',
        'Random selection'
      ],
      correctIdx: 1,
      explanation: 'Consistent hashing scans clockwise along the circular ring to locate the first node with an angle larger than or equal to the key.'
    },
    {
      question: 'What happens to the key-to-node assignments of unchanged servers when a new node joins a consistent hashing ring?',
      options: [
        'All keys on all servers are deleted',
        'Only a small fraction of keys are relocated to the new node; most assignments remain untouched',
        'All keys migrate to the newly added server node',
        'The ring is re-indexed from 0'
      ],
      correctIdx: 1,
      explanation: 'Because keys map to the nearest clockwise node, inserting a new node only intercepts a subset of keys located immediately counter-clockwise from it.'
    }
  ];

  return (
    <VisualizerShell
      title="Consistent Hashing Ring"
      subtitle="Interact with circular hash rings, key routing pathways, node scale events, and VNode multiplier balancers."
      timeComplexity="O(log N) lookup binary search"
      spaceComplexity="O(N + K) ring space complexity"
      theoryContent={theory}
      analogyContent={analogy}
      mistakesContent={mistakes}
      interviewQuestions={interviewQuestions}
      quizQuestions={quizQuestions}
      controls={controls}
      logs={[activeStep.log]}
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%', minHeight: '250px', padding: '1rem 0' }}>
        
        <svg width="450" height="220" style={{ overflow: 'visible' }}>
          {/* Main Hash Ring Circle */}
          <circle cx="225" cy="110" r="80" fill="none" stroke="var(--bg-tertiary)" strokeWidth="3" />
          <text x="225" y="113" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.55rem" fontWeight="bold">Hash Ring Space</text>

          {/* Active scanning radial line */}
          {activeStep.activeRingLine && (
            <line
              x1="225"
              y1="110"
              x2={(225 + 85 * Math.cos((activeStep.activeRingLine.angle * Math.PI) / 180)).toString()}
              y2={(110 + 85 * Math.sin((activeStep.activeRingLine.angle * Math.PI) / 180)).toString()}
              stroke={activeStep.activeRingLine.color}
              strokeWidth="2.5"
            />
          )}

          {/* Render Physical Nodes on Ring */}
          {activeNodes.map(node => {
            const rad = (node.angle * Math.PI) / 180;
            const xVal = 225 + 80 * Math.cos(rad);
            const yVal = 110 + 80 * Math.sin(rad);
            return (
              <g key={node.id}>
                <circle cx={xVal.toString()} cy={yVal.toString()} r="9" fill={node.color} stroke="#FFFFFF" strokeWidth="1.5" />
                <text
                  x={(225 + 98 * Math.cos(rad)).toString()}
                  y={(110 + 98 * Math.sin(rad) + 3).toString()}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="0.52rem"
                  fontWeight="bold"
                >
                  {node.id}
                </text>

                {/* If VNode factor > 1, draw virtual VNode points */}
                {virtualNodeFactor > 1 && Array.from({ length: virtualNodeFactor - 1 }).map((_, vIdx) => {
                  const vAngle = (node.angle + (vIdx + 1) * (360 / (activeNodes.length * virtualNodeFactor))) % 360;
                  const vRad = (vAngle * Math.PI) / 180;
                  const vx = 225 + 80 * Math.cos(vRad);
                  const vy = 110 + 80 * Math.sin(vRad);
                  return (
                    <circle
                      key={vIdx}
                      cx={vx.toString()}
                      cy={vy.toString()}
                      r="5"
                      fill={node.color}
                      stroke="var(--bg-primary)"
                      strokeWidth="1"
                      opacity="0.65"
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Render Keys on Ring */}
          {activeKeys.map((k, index) => {
            const rad = (k.angle * Math.PI) / 180;
            const xVal = 225 + 80 * Math.cos(rad);
            const yVal = 110 + 80 * Math.sin(rad);
            return (
              <g key={index}>
                <circle cx={xVal.toString()} cy={yVal.toString()} r="4.5" fill="#f59e0b" />
                {/* Visual line mapping Key to its Clockwise target Node */}
                <path
                  d={`M ${xVal} ${yVal} L 225 110`}
                  stroke="rgba(245, 158, 11, 0.15)"
                  strokeWidth="0.8"
                />
              </g>
            );
          })}

          {/* Animated Packet */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.35s ease' }}>
              <rect x={activeStep.packet.x - 22} y={activeStep.packet.y - 10} width="44" height="15" fill="var(--bg-primary)" stroke="#f59e0b" strokeWidth="1.2" rx="2" />
              <text x={activeStep.packet.x} y={activeStep.packet.y + 1} textAnchor="middle" fill="#f59e0b" fontSize="0.4rem" fontWeight="bold">
                {activeStep.packet.text}
              </text>
            </g>
          )}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#1591DC' }}></div> Physical Node
          </div>
          {virtualNodeFactor > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1591DC', opacity: '0.65' }}></div> Virtual Node (VNode)
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div> Data Key
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
