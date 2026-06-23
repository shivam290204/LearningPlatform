import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function DbCapVisualizer() {
  const [dbSystem, setDbSystem] = useState('CASSANDRA'); // 'CASSANDRA' (AP) or 'HBASE' (CP)
  const [partitionActive, setPartitionActive] = useState(false);
  const [valA, setValA] = useState('X');
  const [valB, setValB] = useState('X');
  const [log, setLog] = useState('CAP Database Simulator online. Mode: AP Eventual Consistency.');
  const [animationStep, setAnimationStep] = useState(null); // 'WRITING', 'REPLICATING', 'STALE_READ', 'FAILED', null

  const handleWrite = () => {
    const nextVal = `D${Math.floor(Math.random() * 90) + 10}`;

    if (partitionActive) {
      if (dbSystem === 'HBASE') {
        // CP Mode: Fail write immediately
        setAnimationStep('FAILED');
        setLog('HBase (CP): Write Rejected! Network partition active. Cannot reach quorum to commit changes. Preserving consistency.');
      } else {
        // AP Mode: Accept write on Node A, Node B remains stale
        setValA(nextVal);
        setAnimationStep('WRITING');
        setLog(`Cassandra (AP): Write Accepted locally on Node A ("${nextVal}"). Replication to Node B blocked by partition. Availability maintained.`);
      }
    } else {
      // Normal write
      setAnimationStep('WRITING');
      setLog(`Writing "${nextVal}" to Node A...`);
      
      setTimeout(() => {
        setValA(nextVal);
        setAnimationStep('REPLICATING');
        setLog(`Node A committed. Replicating updates to Node B...`);

        setTimeout(() => {
          setValB(nextVal);
          setAnimationStep(null);
          setLog(`Replication complete. Node A and Node B synchronized to value "${nextVal}".`);
        }, 1200);

      }, 1000);
    }
  };

  const handleTogglePartition = () => {
    const nextPartition = !partitionActive;
    setPartitionActive(nextPartition);
    setLog(nextPartition ? 'Network partition activated. Node A and B isolated.' : 'Partition healed. Sync restored.');
    setAnimationStep(null);
  };

  const handleReset = () => {
    setPartitionActive(false);
    setValA('X');
    setValB('X');
    setAnimationStep(null);
    setLog('Simulator reset.');
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Database Setup:</span>
      <select
        value={dbSystem}
        onChange={(e) => {
          setDbSystem(e.target.value);
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
        <option value="CASSANDRA">Cassandra (AP - Availability &amp; Eventual Consistency)</option>
        <option value="HBASE">HBase (CP - Consistency &amp; Partition Tolerant)</option>
      </select>

      <button
        className={`btn-viz-action ${partitionActive ? 'btn-clear' : 'btn-add'}`}
        onClick={handleTogglePartition}
      >
        {partitionActive ? 'Heal Connection' : 'Break Replica Link'}
      </button>

      <button className="btn-viz-action btn-add" onClick={handleWrite} disabled={animationStep === 'WRITING' || animationStep === 'REPLICATING'}>
        Write Value
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Replication Link</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Partition status: <strong style={{ color: partitionActive ? '#FFFFFF' : '#1591DC' }}>
            {partitionActive ? 'ISOLATED' : 'CONNECTED'}
          </strong></div>
          <div>Consistency Level: <span>{dbSystem === 'CASSANDRA' ? 'Eventual' : 'Strong'}</span></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Replica Values</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Node A value: <strong style={{ color: '#1591DC' }}>"{valA}"</strong></div>
          <div>Node B value: <strong style={{ color: '#1591DC' }}>"{valB}"</strong></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>The <strong>CAP Theorem</strong> trade-offs dictate how distributed databases handle network partition failures:</p>
      <ul>
        <li><strong>AP Databases (e.g. Apache Cassandra):</strong> Choose Availability over Consistency. Under network partition, write/read operations still succeed, but nodes will serve eventually consistent (stale) data.</li>
        <li><strong>CP Databases (e.g. Apache HBase):</strong> Choose Consistency over Availability. If nodes cannot communicate to establish a quorum write, operations are blocked/rejected.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of CAP trade-offs as **a phone banking query during a power outage**:</p>
      <ul>
        <li><strong>AP Bank (Cassandra):</strong> The teller allows you to withdraw money based on the last recorded account statement they have, acknowledging that the statement might be lagged.</li>
        <li><strong>CP Bank (HBase):</strong> The teller apologizes and blocks all transactions because they cannot verify balance details with the central ledger database.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Assuming Cassandra is Always Inconsistent:</strong> Cassandra supports tunable consistency levels (e.g., QUORUM). Choosing high consistency levels makes it function like a CP database.</li>
      <li><strong>CA Fallacy:</strong> You cannot design a distributed database with CA (Consistency + Availability) because network partitions are physical inevitabilities.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Explain the difference between Cassandra and HBase regarding CAP theorem.',
      a: 'Cassandra is designed as an AP system, preferring Availability and Eventual Consistency during partitions. HBase is designed as a CP system, electing strong consistency via Single-Master coordination and blocking operations if a partition isolates nodes.'
    },
    {
      q: 'What is Tunable Consistency?',
      a: 'Tunable Consistency allows clients to configure the number of replica nodes that must acknowledge a read or write operation (e.g., ONE, QUORUM, ALL) to satisfy specific consistency constraints in NoSQL databases.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which database type is optimized to remain available and return stale data during a network partition?',
      options: [
        'CP Database',
        'AP Database',
        'ACID RDBMS',
        'Single Node SQLite'
      ],
      correctIdx: 1,
      explanation: 'AP databases prioritize availability, allowing reads and writes to succeed at the cost of consistency.'
    },
    {
      question: 'Why does HBase reject writes when a partition isolates its coordinator?',
      options: [
        'To save hard drive space',
        'To enforce strict data consistency and prevent conflicting records',
        'Because the node runs out of RAM memory',
        'To format disk drives'
      ],
      correctIdx: 1,
      explanation: 'HBase chooses Consistency. If replicas cannot reach consensus, writes are blocked to prevent conflicting updates.'
    }
  ];

  return (
    <VisualizerShell
      title="CAP Theorem Simulator"
      subtitle="Break replica connections and contrast Cassandra AP stale returns with HBase CP write failures."
      timeComplexity="O(1) local read/write"
      spaceComplexity="O(N) replicated node records"
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
          
          {/* Replica Connection Link */}
          {partitionActive ? (
            <g>
              <line x1="160" y1="100" x2="290" y2="100" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="5,5" />
              <text x="225" y="93" textAnchor="middle" fill="#FFFFFF" fontSize="0.75rem" fontWeight="bold">✕ Partitioned</text>
            </g>
          ) : (
            <line
              x1="160"
              y1="100"
              x2="290"
              y2="100"
              stroke={animationStep === 'REPLICATING' ? '#1591DC' : 'var(--bg-tertiary)'}
              strokeWidth="2.5"
            />
          )}

          {/* Node A */}
          <g>
            <rect x="70" y="70" width="90" height="60" fill="#000000" stroke="#1591DC" strokeWidth="2.5" rx="3" />
            <text x="115" y="90" textAnchor="middle" fill="#1591DC" fontSize="0.55rem" fontWeight="bold">Node A</text>
            <text x="115" y="112" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Val: "{valA}"</text>
          </g>

          {/* Node B */}
          <g>
            <rect x="290" y="70" width="90" height="60" fill="#000000" stroke="#1591DC" strokeWidth="2.5" rx="3" />
            <text x="335" y="90" textAnchor="middle" fill="#1591DC" fontSize="0.55rem" fontWeight="bold">Node B</text>
            <text x="335" y="112" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Val: "{valB}"</text>
          </g>

          {/* FAILED Status Overlay */}
          {animationStep === 'FAILED' && (
            <g>
              <rect x="135" y="150" width="180" height="30" fill="#000000" stroke="#FFFFFF" strokeWidth="1.5" rx="3" />
              <text x="225" y="169" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">✕ Write Rejected (CP)</text>
            </g>
          )}

        </svg>
      </div>
    </VisualizerShell>
  );
}
