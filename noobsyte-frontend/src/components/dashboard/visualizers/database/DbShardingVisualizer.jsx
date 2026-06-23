import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function DbShardingVisualizer() {
  const [userId, setUserId] = useState('');
  const [log, setLog] = useState('Sharding Router active. Enter a User ID (1-2000) and query.');
  const [animationStep, setAnimationStep] = useState(null); // 'ROUTING', 'SHARD_1', 'SHARD_2', null
  const [activeEdge, setActiveEdge] = useState(null);

  const handleQuery = () => {
    const id = parseInt(userId, 10);
    if (isNaN(id) || id < 1 || id > 2000) {
      setLog('Error: Please enter a valid User ID between 1 and 2000.');
      return;
    }

    setLog(`Client requesting record for User ID: ${id}...`);
    setAnimationStep('ROUTING');
    setActiveEdge('Client-Router');

    setTimeout(() => {
      if (id <= 1000) {
        setAnimationStep('SHARD_1');
        setActiveEdge('Router-Shard1');
        setLog(`Routing Decision: ID ${id} <= 1000. Forwarding query to Shard Database 1.`);
      } else {
        setAnimationStep('SHARD_2');
        setActiveEdge('Router-Shard2');
        setLog(`Routing Decision: ID ${id} > 1000. Forwarding query to Shard Database 2.`);
      }

      setTimeout(() => {
        setAnimationStep(null);
        setActiveEdge(null);
        setLog(`Success: Returned record payload for User ${id} from its isolated shard database.`);
      }, 1500);

    }, 1200);
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <input
        type="text"
        placeholder="User ID (1-2000)"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        style={{
          padding: '0.4rem 0.6rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem',
          width: '150px'
        }}
      />
      <button className="btn-viz-action btn-add" onClick={handleQuery} disabled={animationStep !== null}>
        Route Query
      </button>

      <button className="btn-viz-action" onClick={() => { setUserId(''); handleReset(); }} disabled={animationStep !== null}>
        Reset
      </button>
    </div>
  );

  const handleReset = () => {
    setAnimationStep(null);
    setActiveEdge(null);
    setLog('Simulator reset.');
  };

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Router Logic</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Shard 1 range: <strong style={{ color: '#1591DC' }}>1 - 1000</strong></div>
          <div>Shard 2 range: <strong style={{ color: '#1591DC' }}>1001 - 2000</strong></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Cluster Metadata</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          <div>Key Pattern: <span>Range-based Sharding</span></div>
          <div>Scatter-Gather: <strong style={{ color: '#1591DC' }}>Disabled (Single Hash lookup)</strong></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>Database Sharding</strong> is a horizontal database scaling method where rows of a single table are partitioned and distributed across multiple independent database instances (shards):</p>
      <ul>
        <li><strong>Shard Router:</strong> Evaluates incoming query criteria (sharding key) and routes the request directly to the shard hosting that range.</li>
        <li><strong>Range-Based Sharding:</strong> Maps data ranges (e.g. IDs 1-1000) to Shard 1, and (1001-2000) to Shard 2. (Simple, but can lead to uneven load distribution).</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Sharding as **organizing employee files in a large corporation**:</p>
      <ul>
        <li>Instead of squeezing all employee profiles into one single filing cabinet (which breaks under size limits), you buy two cabinets.</li>
        <li><strong>Cabinet 1 (Shard 1):</strong> Stores files for names starting with A-M.</li>
        <li><strong>Cabinet 2 (Shard 2):</strong> Stores files for names starting with N-Z.</li>
        <li>The receptionist (Router) reads the employee\'s name, goes directly to the correct cabinet, and pulls the file (O(1) sharded read).</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Hot Spot Shards:</strong> Selecting a poor sharding key (e.g., date_created) that forces all new inserts to go to the latest shard, leaving older shards completely idle.</li>
      <li><strong>Cross-Shard Joins:</strong> Performing queries that join records across different shards. This triggers a heavy latency penalty because the coordinator must gather data from multiple network nodes.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is the difference between Horizontal Scaling (Sharding) and Vertical Scaling (Replication)?',
      a: 'Sharding partitions the data rows horizontally across nodes (each node holds a unique subset of the dataset). Replication copies the entire database to secondary nodes (each node holds the complete dataset), which is ideal for high read-volumes but does not scale writes.'
    },
    {
      q: 'Explain the "Scatter-Gather" query penalty.',
      a: 'If a query does not specify the sharding key in its WHERE clause, the router has no idea which shard holds the data. It must execute the query on all shards concurrently (scatter) and merge the results (gather), which is slow and resource-heavy.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which component is responsible for redirecting queries to the correct database instance in a sharded cluster?',
      options: [
        'Load Balancer',
        'Shard Router',
        'Redis Cache',
        'Consensus Coordinator'
      ],
      correctIdx: 1,
      explanation: 'The Shard Router evaluates the sharding key from the query and forwards it to the targeted database instance.'
    },
    {
      question: 'What is a primary danger of choosing a sequentially incrementing ID as your sharding key?',
      options: [
        'Data corruption',
        'Hot spot writes (all inserts target the latest active shard)',
        'Too many database joins',
        'Lost transactions isolation'
      ],
      correctIdx: 1,
      explanation: 'Sequentially incrementing keys mean all new rows target the highest active range, overloading a single shard while others remain under-utilized.'
    }
  ];

  return (
    <VisualizerShell
      title="Horizontal Sharding"
      subtitle="Input query keys, evaluate sharding router logic, and watch records retrieve from range-based shards."
      timeComplexity="O(1) routing check"
      spaceComplexity="O(N) partitioned data allocation"
      theoryContent={theory}
      analogyContent={analogy}
      mistakesContent={mistakes}
      interviewQuestions={interviewQuestions}
      quizQuestions={quizQuestions}
      controls={controls}
      logs={[log]}
      stateInspector={stateInspector}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%', minHeight: '235px', padding: '1rem 0' }}>
        <svg width="450" height="200" style={{ overflow: 'visible' }}>
          
          {/* Client to Router Line */}
          <line
            x1="50"
            y1="100"
            x2="150"
            y2="100"
            stroke={activeEdge === 'Client-Router' ? '#1591DC' : 'var(--bg-tertiary)'}
            strokeWidth="1.5"
          />

          {/* Router to Shard 1 Line */}
          <line
            x1="220"
            y1="100"
            x2="330"
            y2="50"
            stroke={activeEdge === 'Router-Shard1' ? '#1591DC' : 'var(--bg-tertiary)'}
            strokeWidth="1.5"
          />

          {/* Router to Shard 2 Line */}
          <line
            x1="220"
            y1="100"
            x2="330"
            y2="150"
            stroke={activeEdge === 'Router-Shard2' ? '#1591DC' : 'var(--bg-tertiary)'}
            strokeWidth="1.5"
          />

          {/* Client Node */}
          <g>
            <circle cx="35" cy="100" r="16" fill="#000000" stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="35" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Client</text>
          </g>

          {/* Shard Router */}
          <g>
            <rect x="150" y="80" width="70" height="40" fill="#000000" stroke="#1591DC" strokeWidth="2.5" rx="3" />
            <text x="185" y="98" textAnchor="middle" fill="#1591DC" fontSize="0.55rem" fontWeight="bold">Router</text>
            <text x="185" y="109" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.38rem">(ID Check)</text>
          </g>

          {/* Shard 1 DB */}
          <g>
            <rect x="330" y="25" width="90" height="45" fill="#000000" stroke={animationStep === 'SHARD_1' ? '#FFFFFF' : 'var(--bg-tertiary)'} strokeWidth="2" rx="3" />
            <text x="375" y="45" textAnchor="middle" fill="#FFFFFF" fontSize="0.52rem" fontWeight="bold">Shard DB 1</text>
            <text x="375" y="56" textAnchor="middle" fill="#1591DC" fontSize="0.45rem">IDs: 1 - 1000</text>
          </g>

          {/* Shard 2 DB */}
          <g>
            <rect x="330" y="125" width="90" height="45" fill="#000000" stroke={animationStep === 'SHARD_2' ? '#FFFFFF' : 'var(--bg-tertiary)'} strokeWidth="2" rx="3" />
            <text x="375" y="145" textAnchor="middle" fill="#FFFFFF" fontSize="0.52rem" fontWeight="bold">Shard DB 2</text>
            <text x="375" y="156" textAnchor="middle" fill="#1591DC" fontSize="0.45rem">IDs: 1001 - 2000</text>
          </g>

        </svg>
      </div>
    </VisualizerShell>
  );
}
