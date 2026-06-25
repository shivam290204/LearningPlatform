import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function DbShardingVisualizer() {
  const [shardingKey, setShardingKey] = useState('RANGE'); // 'RANGE' or 'HASH'
  const [shards, setShards] = useState({
    0: ['Alice', 'Bob'], // A-M in Range, Hash % 3 === 0
    1: ['Jack', 'Mike'], // J-R in Range, Hash % 3 === 1
    2: ['Zack']          // S-Z in Range, Hash % 3 === 2
  });

  const [inputVal, setInputVal] = useState('Charlie');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const [steps, setSteps] = useState([
    {
      log: 'Sharded Database Cluster initialized. Insert a name or perform a query.',
      shards: { 0: ['Alice', 'Bob'], 1: ['Jack', 'Mike'], 2: ['Zack'] },
      activeNode: null,
      activeEdge: null,
      packet: null,
      queryMode: 'IDLE'
    }
  ]);

  const getTargetShard = (name, mode = shardingKey) => {
    if (mode === 'RANGE') {
      const char = name.toUpperCase().charAt(0);
      if (char <= 'I') return 0;
      if (char <= 'R') return 1;
      return 2;
    } else {
      // Simple hash sum
      let sum = 0;
      for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
      return sum % 3;
    }
  };

  const handleInsert = () => {
    const val = inputVal.trim();
    if (!val) {
      alert('Enter a valid string to insert.');
      return;
    }

    let trace = [];
    const target = getTargetShard(val);

    // 1. Send to Router
    trace.push({
      log: `Client issues INSERT request for "${val}". Coordinator evaluates sharding key.`,
      shards: { ...shards },
      activeNode: 'Router',
      activeEdge: 'Client-Router',
      packet: { text: `INSERT ${val}`, x: 45, y: 100 },
      queryMode: 'INSERT'
    });

    // 2. Hash Calculation & Routing
    const routingRule = shardingKey === 'RANGE'
      ? `Range check: First letter "${val.charAt(0)}" maps to Shard ${target}.`
      : `Hash check: hash("${val}") % 3 = ${target}. Routing to Shard ${target}.`;

    trace.push({
      log: `Coordinator executes sharding function. ` + routingRule,
      shards: { ...shards },
      activeNode: 'Router',
      activeEdge: `Router-Shard-${target}`,
      packet: { text: val, x: 180, y: 100 },
      queryMode: 'INSERT'
    });

    // 3. Commit to Shard
    let updatedShards = { ...shards };
    if (!updatedShards[target].includes(val)) {
      updatedShards[target] = [...updatedShards[target], val];
    }

    trace.push({
      log: `Shard ${target} commits record "${val}" locally. Distributed consensus complete.`,
      shards: updatedShards,
      activeNode: `Shard-${target}`,
      activeEdge: null,
      packet: null,
      queryMode: 'INSERT'
    });

    setShards(updatedShards);
    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleQuerySingle = () => {
    const val = inputVal.trim();
    if (!val) {
      alert('Enter a name to search.');
      return;
    }

    let trace = [];
    const target = getTargetShard(val);

    trace.push({
      log: `Client sends lookup query for "${val}" (with Sharding Key). Router inspects key directly.`,
      shards: { ...shards },
      activeNode: 'Router',
      activeEdge: 'Client-Router',
      packet: { text: `SELECT ${val}`, x: 45, y: 100 },
      queryMode: 'SELECT'
    });

    trace.push({
      log: `Direct routing: Query forwarded ONLY to Shard ${target}. No other databases touched. Latency: 5ms.`,
      shards: { ...shards },
      activeNode: `Shard-${target}`,
      activeEdge: `Router-Shard-${target}`,
      packet: { text: `Read Shard ${target}`, x: 230, y: target === 0 ? 40 : (target === 1 ? 100 : 160) },
      queryMode: 'SELECT'
    });

    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleQueryBroadcast = () => {
    let trace = [];

    // Scatter-gather has to query ALL shards
    trace.push({
      log: 'Client issues query WITHOUT sharding key (e.g. SELECT *). Router cannot optimize path.',
      shards: { ...shards },
      activeNode: 'Router',
      activeEdge: 'Client-Router',
      packet: { text: 'SELECT ALL', x: 45, y: 100 },
      queryMode: 'SCATTER_GATHER'
    });

    trace.push({
      log: 'Scatter Phase: Router broadcasts query to ALL shards in parallel. High network usage.',
      shards: { ...shards },
      activeNode: 'Router',
      activeEdge: 'Broadcast-All',
      packet: { text: 'Broadcast', x: 250, y: 100 },
      queryMode: 'SCATTER_GATHER'
    });

    trace.push({
      log: 'Gather Phase: Router waits for all shards to return data, merges lists, and sorts. Latency penalty: 120ms.',
      shards: { ...shards },
      activeNode: 'Router',
      activeEdge: 'Gather-All',
      packet: { text: 'Merge list', x: 250, y: 100 },
      queryMode: 'SCATTER_GATHER'
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
    const initialShards = {
      0: ['Alice', 'Bob'],
      1: ['Jack', 'Mike'],
      2: ['Zack']
    };
    setShards(initialShards);
    setSteps([
      {
        log: 'Sharded Database Cluster reset with 5 initial records.',
        shards: initialShards,
        activeNode: null,
        activeEdge: null,
        packet: null,
        queryMode: 'IDLE'
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];
  const activeShards = activeStep.shards;

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Partition Method:</span>
      <select
        value={shardingKey}
        onChange={(e) => {
          setShardingKey(e.target.value);
          handleReset();
        }}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        <option value="RANGE">Range-Based (0: A-I, 1: J-R, 2: S-Z)</option>
        <option value="HASH">Hash-Based (hashCode % 3)</option>
      </select>

      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Key Value:</span>
      <input
        type="text"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        style={{
          width: '100px',
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      />

      <button className="btn-viz-action btn-add" onClick={handleInsert}>
        Insert Key
      </button>

      <button className="btn-viz-action" onClick={handleQuerySingle}>
        Select with Key (Shard Key Query)
      </button>

      <button className="btn-viz-action btn-clear" onClick={handleQueryBroadcast}>
        Select without Key (Scatter-Gather)
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Shard Record Collections</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem'
        }}>
          <div>Shard 0: <span style={{ color: 'var(--brand-cyan)' }}>[{activeShards[0].join(', ')}]</span></div>
          <div>Shard 1: <span style={{ color: 'var(--brand-cyan)' }}>[{activeShards[1].join(', ')}]</span></div>
          <div>Shard 2: <span style={{ color: 'var(--brand-cyan)' }}>[{activeShards[2].join(', ')}]</span></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Performance Latency metrics</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Query Mode: <strong style={{ color: activeStep.queryMode === 'SCATTER_GATHER' ? '#ef4444' : '#10b981' }}>{activeStep.queryMode}</strong></div>
          <div>Routing: <span>{activeStep.queryMode === 'SCATTER_GATHER' ? 'Broadcast (All Nodes)' : (activeStep.queryMode === 'SELECT' ? 'Direct (1 Node)' : 'None')}</span></div>
          <div>Estimated Latency: <strong style={{ color: activeStep.queryMode === 'SCATTER_GATHER' ? '#ef4444' : '#10b981' }}>
            {activeStep.queryMode === 'SCATTER_GATHER' ? '120ms' : (activeStep.queryMode === 'SELECT' ? '5ms' : '0ms')}
          </strong></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>Database Sharding</strong> is a horizontal scaling technique that partitions a single dataset across multiple physical database servers (shards):</p>
      <ul>
        <li><strong>Shard Key:</strong> A field in the dataset (like User ID or Country) that determines which shard holds a specific record. Finding records via shard key routes the query to exactly 1 server.</li>
        <li><strong>Range-Based Sharding:</strong> Segments data by sequential ranges (e.g. IDs 1-1000 to Shard 0, 1001-2000 to Shard 1). Easy to set up, but risks producing "hot spots" if new sign-ups write continuously to the active range.</li>
        <li><strong>Hash-Based Sharding:</strong> Applies a mathematical hash function to the shard key to spread writes uniformly across server nodes (e.g. <code>hash(UserID) % 3</code>). Balances load but makes expanding shard counts difficult.</li>
        <li><strong>Scatter-Gather Penalty:</strong> Queries that do not contain the shard key must be broadcast to all shard nodes. The router merges the partial results, resulting in slow query performance.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Database Sharding as **Filing Cabinets in an Office**:</p>
      <ul>
        <li><strong>Unsharded Database:</strong> Storing all customer folders in a single giant filing cabinet. If 5 clerks try to retrieve files at the same time, they trip over each other.</li>
        <li><strong>Sharded Database (by last name):</strong> Having three Cabinets. Cabinet 1 stores names A-I, Cabinet 2 J-R, and Cabinet 3 S-Z. If you search for "Alice", you walk straight to Cabinet 1 (Direct Query). If you search for "folders with green labels" (no shard key), you must search all three cabinets (Scatter-Gather).</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Poor Shard Key Selection:</strong> Sharding by a field that is heavily skewed (like country, if 90% of users are from the US), resulting in one overloaded shard (hot spot) and other empty nodes.</li>
      <li><strong>Complex Distributed Joins:</strong> Running SQL joins across sharded tables. Since data lives on separate machines, the database cannot easily join them, necessitating application-layer data merges.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is the scatter-gather query penalty, and how does it happen?',
      a: 'It occurs when a query does not specify the sharding key. The database routing layer is forced to broadcast the request to every single shard node, wait for all databases to return results, and aggregate them, creating heavy network overhead and latency bottlenecks.'
    },
    {
      q: 'How does consistent hashing help with sharding database nodes?',
      a: 'In standard hashing sharding (modulo N), adding or removing a shard node changes the modulo base, causing almost all keys to map to new shards. Consistent hashing maps keys and nodes on a circular ring, minimizing data migrations during server re-sizes.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which query type runs fastest on a sharded database system?',
      options: [
        'A scatter-gather query across all nodes',
        'A SELECT query targeting a record with the shard key explicitly defined',
        'A join query matching tables on separate physical machines',
        'A full table scan'
      ],
      correctIdx: 1,
      explanation: 'Specifying the shard key allows the router coordinator to query exactly one database server node, completing in milliseconds.'
    },
    {
      question: 'What is a "Hot Shard" or hot spot in database design?',
      options: [
        'A shard database that was physically overheated in the rack',
        'A single shard node experiencing disproportionately high write/read traffic due to poor key distribution',
        'A backup backup replica server',
        'An un-indexed table column'
      ],
      correctIdx: 1,
      explanation: 'Hot shards occur when a sharding key concentrates writes on a single server (e.g. range-based sharding with sequential IDs under high write rates).'
    }
  ];

  return (
    <VisualizerShell
      title="Database Sharding Simulator"
      subtitle="Interact with Shard key calculations. Contrast rapid single-shard lookups with high-latency scatter-gather broad queries."
      timeComplexity="O(1) sharded read, O(N) scatter-gather"
      spaceComplexity="O(N) data partitions"
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%', minHeight: '235px', padding: '1rem 0' }}>
        
        <svg width="450" height="200" style={{ overflow: 'visible' }}>
          {/* Client to Router Coordinator link */}
          <line
            x1="50"
            y1="100"
            x2="150"
            y2="100"
            stroke={activeStep.activeEdge === 'Client-Router' ? '#1591DC' : 'var(--bg-tertiary)'}
            strokeWidth={activeStep.activeEdge === 'Client-Router' ? '2.5' : '1.5'}
          />

          {/* Router to Shard 0 path */}
          <line
            x1="180"
            y1="100"
            x2="310"
            y2="40"
            stroke={activeStep.activeEdge === 'Router-Shard-0' || activeStep.activeEdge === 'Broadcast-All' || activeStep.activeEdge === 'Gather-All' ? '#10b981' : 'var(--bg-tertiary)'}
            strokeWidth={activeStep.activeEdge === 'Router-Shard-0' ? '2.5' : '1.5'}
          />

          {/* Router to Shard 1 path */}
          <line
            x1="180"
            y1="100"
            x2="310"
            y2="100"
            stroke={activeStep.activeEdge === 'Router-Shard-1' || activeStep.activeEdge === 'Broadcast-All' || activeStep.activeEdge === 'Gather-All' ? '#10b981' : 'var(--bg-tertiary)'}
            strokeWidth={activeStep.activeEdge === 'Router-Shard-1' ? '2.5' : '1.5'}
          />

          {/* Router to Shard 2 path */}
          <line
            x1="180"
            y1="100"
            x2="310"
            y2="160"
            stroke={activeStep.activeEdge === 'Router-Shard-2' || activeStep.activeEdge === 'Broadcast-All' || activeStep.activeEdge === 'Gather-All' ? '#10b981' : 'var(--bg-tertiary)'}
            strokeWidth={activeStep.activeEdge === 'Router-Shard-2' ? '2.5' : '1.5'}
          />

          {/* Client Node */}
          <g>
            <circle cx="35" cy="100" r="16" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="35" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Client</text>
          </g>

          {/* Router (Sharding Coordinator) */}
          <g>
            <rect x="135" y="80" width="40" height="40" fill="var(--bg-secondary)" stroke="#1591DC" strokeWidth="2.5" rx="4" />
            <text x="155" y="100" textAnchor="middle" fill="#1591DC" fontSize="0.55rem" fontWeight="bold">Router</text>
            <text x="155" y="111" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.38rem">Key Engine</text>
          </g>

          {/* Shards DB blocks */}
          {/* Shard 0 */}
          <g>
            <rect
              x="310"
              y="20"
              width="100"
              height="35"
              fill={activeStep.activeNode === 'Shard-0' ? 'rgba(16,185,129,0.15)' : 'var(--bg-secondary)'}
              stroke={activeStep.activeNode === 'Shard-0' ? '#10b981' : 'var(--bg-tertiary)'}
              strokeWidth="2"
              rx="3"
            />
            <text x="360" y="34" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Shard 0 (A-I)</text>
            <text x="360" y="47" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.4rem">Records: {activeShards[0].length}</text>
          </g>

          {/* Shard 1 */}
          <g>
            <rect
              x="310"
              y="80"
              width="100"
              height="35"
              fill={activeStep.activeNode === 'Shard-1' ? 'rgba(16,185,129,0.15)' : 'var(--bg-secondary)'}
              stroke={activeStep.activeNode === 'Shard-1' ? '#10b981' : 'var(--bg-tertiary)'}
              strokeWidth="2"
              rx="3"
            />
            <text x="360" y="94" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Shard 1 (J-R)</text>
            <text x="360" y="107" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.4rem">Records: {activeShards[1].length}</text>
          </g>

          {/* Shard 2 */}
          <g>
            <rect
              x="310"
              y="140"
              width="100"
              height="35"
              fill={activeStep.activeNode === 'Shard-2' ? 'rgba(16,185,129,0.15)' : 'var(--bg-secondary)'}
              stroke={activeStep.activeNode === 'Shard-2' ? '#10b981' : 'var(--bg-tertiary)'}
              strokeWidth="2"
              rx="3"
            />
            <text x="360" y="154" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Shard 2 (S-Z)</text>
            <text x="360" y="167" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.4rem">Records: {activeShards[2].length}</text>
          </g>

          {/* Animated Packet */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.35s ease' }}>
              <rect x={activeStep.packet.x - 25} y={activeStep.packet.y - 10} width="50" height="15" fill="var(--bg-primary)" stroke="#f59e0b" strokeWidth="1.2" rx="2" />
              <text x={activeStep.packet.x} y={activeStep.packet.y + 1} textAnchor="middle" fill="#f59e0b" fontSize="0.4rem" fontWeight="bold">
                {activeStep.packet.text}
              </text>
            </g>
          )}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--bg-secondary)', border: '1.5px solid var(--bg-tertiary)' }}></div> Shard Instance
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '15px', height: '8px', border: '1.5px solid #10b981', backgroundColor: 'transparent' }}></div> Route Path
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
