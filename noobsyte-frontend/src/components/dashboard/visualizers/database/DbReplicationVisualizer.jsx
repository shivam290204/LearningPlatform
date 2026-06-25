import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function DbReplicationVisualizer() {
  const [nodes, setNodes] = useState({
    primary: { name: 'Primary (Node A)', val: 'V1', status: 'HEALTHY' },
    replica1: { name: 'Replica B', val: 'V1', status: 'HEALTHY' },
    replica2: { name: 'Replica C', val: 'V1', status: 'HEALTHY' }
  });
  const [log, setLog] = useState('Replication environment online. Trigger a write or failover.');
  const [animationStep, setAnimationStep] = useState(null); // 'WRITING', 'REPLICATING_B', 'REPLICATING_C', 'READING', 'CRASHED', 'PROMOTING', null
  const [activeEdge, setActiveEdge] = useState(null);

  const handleWrite = () => {
    const nextVal = `V${Math.floor(Math.random() * 90) + 10}`;
    
    if (nodes.primary.status === 'DEAD') {
      setLog('Write Failed: Primary node is offline. Initiate failover election first.');
      return;
    }

    setLog(`Client writes value "${nextVal}" to Primary node.`);
    setAnimationStep('WRITING');
    setActiveEdge('Client-Primary');

    setTimeout(() => {
      // Primary updates
      setNodes(prev => ({
        ...prev,
        primary: { ...prev.primary, val: nextVal }
      }));
      setAnimationStep('REPLICATING_B');
      setActiveEdge('Primary-ReplicaB');
      setLog(`Primary updated to "${nextVal}". Replicating update to Replica B...`);

      setTimeout(() => {
        // Replica B updates
        setNodes(prev => ({
          ...prev,
          replica1: { ...prev.replica1, val: nextVal }
        }));
        setAnimationStep('REPLICATING_C');
        setActiveEdge('Primary-ReplicaC');
        setLog(`Replica B synced. Replicating update to Replica C (Simulating replication lag)...`);

        setTimeout(() => {
          // Replica C updates
          setNodes(prev => ({
            ...prev,
            replica2: { ...prev.replica2, val: nextVal }
          }));
          setAnimationStep(null);
          setActiveEdge(null);
          setLog(`Replication complete. All replicas synchronized to value "${nextVal}".`);
        }, 1800);

      }, 1000);

    }, 1000);
  };

  const handleFailover = () => {
    setLog('Simulating Primary crash. Node A offline.');
    setNodes(prev => ({
      ...prev,
      primary: { ...prev.primary, status: 'DEAD' }
    }));
    setAnimationStep('CRASHED');

    setTimeout(() => {
      setLog('Failover sequence initiated: Replicas running election protocol...');
      setAnimationStep('PROMOTING');

      setTimeout(() => {
        setNodes(prev => ({
          primary: { name: 'Node A (Offline)', val: prev.primary.val, status: 'DEAD' },
          replica1: { name: 'Replica B (Promoted Primary)', val: prev.replica1.val, status: 'HEALTHY' },
          replica2: { name: 'Replica C', val: prev.replica2.val, status: 'HEALTHY' }
        }));
        setAnimationStep(null);
        setLog('Failover complete: Replica B promoted to Primary. Write operations restored.');
      }, 1500);

    }, 1200);
  };

  const handleReset = () => {
    setNodes({
      primary: { name: 'Primary (Node A)', val: 'V1', status: 'HEALTHY' },
      replica1: { name: 'Replica B', val: 'V1', status: 'HEALTHY' },
      replica2: { name: 'Replica C', val: 'V1', status: 'HEALTHY' }
    });
    setAnimationStep(null);
    setActiveEdge(null);
    setLog('Environment reset.');
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <button className="btn-viz-action btn-add" onClick={handleWrite} disabled={animationStep !== null}>
        Write Random Value
      </button>

      <button className="btn-viz-action btn-clear" onClick={handleFailover} disabled={animationStep !== null || nodes.primary.status === 'DEAD'}>
        Simulate Primary Crash &amp; Failover
      </button>

      <button className="btn-viz-action" onClick={handleReset} disabled={animationStep !== null}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Replication Metrics</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Replica B Lag: <span>0ms (Sync)</span></div>
          <div>Replica C Lag: <strong style={{ color: '#1591DC' }}>1500ms (Async Lag)</strong></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Cluster State</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Primary Status: <strong style={{ color: nodes.primary.status === 'DEAD' ? '#FFFFFF' : '#1591DC' }}>{nodes.primary.status}</strong></div>
          <div>Active Leader: <span>{nodes.primary.status === 'DEAD' ? 'Replica B' : 'Primary Node A'}</span></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>Database Replication</strong> involves copying database data across multiple server instances to guarantee high availability and scale reads:</p>
      <ul>
        <li><strong>Primary-Secondary (Master-Replica):</strong> All write transactions target the Primary node. The Primary writes updates to its WAL log and transmits them to Secondary Replicas.</li>
        <li><strong>Replication Lag:</strong> The delay between commits on the Primary and their application on Replicas. Clients reading from lagged replicas may retrieve stale data.</li>
        <li><strong>Automated Failover:</strong> If the primary crashes, heartbeat checks timeout, replicas vote, and a secondary replica is promoted to primary.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Replication as **a Publisher and Bookstores**:</p>
      <ul>
        <li><strong>Primary (Publisher):</strong> Authors edit manuscripts and print updates here.</li>
        <li><strong>Replicas (Bookstores):</strong> Distribute copies of the book to the public (read scaling).</li>
        <li><strong>Replication Lag:</strong> The shipping delay. If a bookstore hasn\'t received the new edition yet, customers buy the older edition (stale read).</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Writing to Replicas:</strong> Client applications attempting to perform SQL inserts directly on secondary replicas, which throws permission/read-only database exceptions.</li>
      <li><strong>Ignoring Replication Lag:</strong> Executing a write to the Primary and immediately querying a Secondary replica for the update. If lag is high, the application displays outdated information.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Explain the difference between Synchronous and Asynchronous replication.',
      a: 'Synchronous replication waits for all replicas to acknowledge the write commit before returning success (strong consistency, higher write latency). Asynchronous replication returns success immediately after writing to the Primary, replication occurring in the background (lower latency, risk of data loss if Primary crashes before sync).'
    },
    {
      q: 'What is a split-brain scenario in database replication?',
      a: 'A split-brain scenario occurs when a network partition isolates primary and replica clusters, causing replicas to mistakenly believe the primary is dead and elect a new primary. This results in two active primary nodes executing conflicting writes, leading to database state corruption.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Where should write operations always be routed in a Master-Replica database setup?',
      options: [
        'To any healthy replica node',
        'Directly to the Primary node',
        'To the Redis cache server',
        'Balanced across all replicas'
      ],
      correctIdx: 1,
      explanation: 'Only the Primary node accepts write operations. Replicas are configured as read-only copies.'
    },
    {
      question: 'What is the risk of Asynchronous database replication?',
      options: [
        'Higher write latency',
        'Data loss if the Primary crashes before updates sync to Replicas',
        'Fewer connections supported',
        'Slower read queries'
      ],
      correctIdx: 1,
      explanation: 'Because writes are acknowledged before replicating, a primary crash can wipe out un-replicated commits permanently.'
    }
  ];

  return (
    <VisualizerShell
      title="Master-Replica Replication"
      subtitle="Verify write propagations, replicate data asynchronously, measure lags, and trigger failover elections."
      timeComplexity="Read: O(1) replica scale; Write: O(R) sync"
      spaceComplexity="O(R * D) complete duplication"
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
          
          {/* Client to Nodes Connection */}
          <line
            x1="50"
            y1="100"
            x2="150"
            y2="100"
            stroke={activeEdge === 'Client-Primary' ? '#1591DC' : 'var(--bg-tertiary)'}
            strokeWidth="1.5"
          />

          {/* Primary to Replicas Lines */}
          <line
            x1="185"
            y1="100"
            x2="330"
            y2="50"
            stroke={activeEdge === 'Primary-ReplicaB' ? '#1591DC' : 'var(--bg-tertiary)'}
            strokeWidth="1.5"
          />
          <line
            x1="185"
            y1="100"
            x2="330"
            y2="150"
            stroke={activeEdge === 'Primary-ReplicaC' ? '#1591DC' : 'var(--bg-tertiary)'}
            strokeWidth="1.5"
            strokeDasharray={activeEdge === 'Primary-ReplicaC' ? '5,5' : 'none'}
          />

          {/* Client */}
          <g>
            <circle cx="35" cy="100" r="16" fill="#000000" stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="35" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Client</text>
          </g>

          {/* Primary Node */}
          <g>
            <rect
              x="130"
              y="75"
              width="90"
              height="50"
              fill="#000000"
              stroke={nodes.primary.status === 'DEAD' ? '#FFFFFF' : '#1591DC'}
              strokeWidth="2.5"
              rx="3"
            />
            <text x="175" y="93" textAnchor="middle" fill={nodes.primary.status === 'DEAD' ? '#FFFFFF' : '#1591DC'} fontSize="0.48rem" fontWeight="bold">
              {nodes.primary.name}
            </text>
            <text x="175" y="112" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Val: "{nodes.primary.val}"</text>
          </g>

          {/* Replica B */}
          <g>
            <rect
              x="330"
              y="25"
              width="90"
              height="50"
              fill="#000000"
              stroke={animationStep === 'PROMOTING' ? '#FFFFFF' : 'var(--bg-tertiary)'}
              strokeWidth="2"
              rx="3"
            />
            <text x="375" y="43" textAnchor="middle" fill="#FFFFFF" fontSize="0.48rem" fontWeight="bold">{nodes.replica1.name}</text>
            <text x="375" y="62" textAnchor="middle" fill="#1591DC" fontSize="0.45rem">Val: "{nodes.replica1.val}"</text>
          </g>

          {/* Replica C */}
          <g>
            <rect x="330" y="125" width="90" height="50" fill="#000000" stroke="var(--bg-tertiary)" strokeWidth="2" rx="3" />
            <text x="375" y="143" textAnchor="middle" fill="#FFFFFF" fontSize="0.48rem" fontWeight="bold">{nodes.replica2.name}</text>
            <text x="375" y="162" textAnchor="middle" fill="#1591DC" fontSize="0.45rem">Val: "{nodes.replica2.val}"</text>
          </g>

        </svg>
      </div>
    </VisualizerShell>
  );
}
