import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function CapTheoremVisualizer() {
  const [capMode, setCapMode] = useState('AP'); // 'CP' or 'AP'
  const [partitionActive, setPartitionActive] = useState(false);
  const [nodeAValue, setNodeAValue] = useState('X');
  const [nodeBValue, setNodeBValue] = useState('X');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const [steps, setSteps] = useState([
    {
      log: 'CAP System ready. Mode set to AP (Available / Partition Tolerant). Link is connected.',
      nodeA: 'X',
      nodeB: 'X',
      activeNode: null,
      activeEdge: null,
      packet: null
    }
  ]);

  const handleWrite = (newValue) => {
    let trace = [];

    // Step 1: Write to Node A
    trace.push({
      log: `Client issues Write Request (val: "${newValue}") to Node A.`,
      nodeA: nodeAValue,
      nodeB: nodeBValue,
      activeNode: 'NodeA',
      activeEdge: 'Client-NodeA',
      packet: { text: `Write "${newValue}"`, x: 70, y: 100 }
    });

    if (partitionActive) {
      if (capMode === 'CP') {
        // CP Mode under Partition: Reject write to keep consistency, or fail replication
        trace.push({
          log: `CP Mode: Node A attempts replication to Node B, but the network link is partitioned. Node A rejects/blocks write to maintain consistency. HTTP 500 / Timeout.`,
          nodeA: nodeAValue,
          nodeB: nodeBValue,
          activeNode: 'NodeA',
          activeEdge: null,
          packet: { text: 'Write Failed (Consistency)', x: 190, y: 100 }
        });
      } else {
        // AP Mode under Partition: Accept write locally, but fail replication (return success anyway)
        trace.push({
          log: `AP Mode: Node A attempts replication to Node B, but the network link is broken. Node A commits write locally ("${newValue}") and returns HTTP 200 Success to ensure Availability.`,
          nodeA: newValue,
          nodeB: nodeBValue,
          activeNode: 'NodeA',
          activeEdge: null,
          packet: null
        });

        trace.push({
          log: `Client reads Node B. Since replication is broken, Node B returns stale value ("${nodeBValue}"). Node A has "${newValue}". Consistency is lost!`,
          nodeA: newValue,
          nodeB: nodeBValue,
          activeNode: 'NodeB',
          activeEdge: 'Client-NodeB',
          packet: { text: `Stale: "${nodeBValue}"`, x: 330, y: 100 }
        });
      }
    } else {
      // Normal replication (No Partition)
      trace.push({
        log: `Node A commits write ("${newValue}") and replicates update to Node B over the network.`,
        nodeA: newValue,
        nodeB: nodeBValue,
        activeNode: 'Broker',
        activeEdge: 'Replication-Link',
        packet: { text: `Sync: "${newValue}"`, x: 230, y: 100 }
      });

      trace.push({
        log: `Node B receives sync and updates its value. System is Consistent and Available! HTTP 200.`,
        nodeA: newValue,
        nodeB: newValue,
        activeNode: 'NodeB',
        activeEdge: null,
        packet: null
      });
    }

    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);

    // Apply values locally if replication succeeded or AP local write did
    if (!partitionActive) {
      setNodeAValue(newValue);
      setNodeBValue(newValue);
    } else if (capMode === 'AP') {
      setNodeAValue(newValue);
    }
  };

  const handleTogglePartition = () => {
    const nextPartition = !partitionActive;
    setPartitionActive(nextPartition);
    const logStr = nextPartition
      ? 'A Network Partition is active! Node A and Node B are isolated.'
      : 'Network Partition healed. Re-establishing replication links.';
    
    setSteps([
      {
        log: logStr,
        nodeA: nodeAValue,
        nodeB: nodeBValue,
        activeNode: null,
        activeEdge: null,
        packet: null
      }
    ]);
    setCurrentStep(0);
  };

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
    setPartitionActive(false);
    setNodeAValue('X');
    setNodeBValue('X');
    setSteps([
      {
        log: 'CAP Theorem environment reset.',
        nodeA: 'X',
        nodeB: 'X',
        activeNode: null,
        activeEdge: null,
        packet: null
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Partition Tradeoff Mode:</span>
      <select
        value={capMode}
        onChange={(e) => {
          setCapMode(e.target.value);
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
        <option value="AP">AP Mode (Availability &gt; Consistency)</option>
        <option value="CP">CP Mode (Consistency &gt; Availability)</option>
      </select>

      <button
        className={`btn-viz-action ${partitionActive ? 'btn-clear' : 'btn-add'}`}
        onClick={handleTogglePartition}
      >
        {partitionActive ? 'Heal Network Link' : 'Break Network Link'}
      </button>

      <button className="btn-viz-action btn-add" onClick={() => handleWrite(String.fromCharCode(65 + Math.floor(Math.random() * 26)))}>
        Write Random Value
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Network Link State</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Partition status: <strong style={{ color: partitionActive ? '#ef4444' : '#10b981' }}>
            {partitionActive ? 'PARTITIONED' : 'CONNECTED'}
          </strong></div>
          <div>Link Latency: <span>{partitionActive ? 'Infinite ms' : '15ms'}</span></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Node Database Values</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Node A Database: <strong style={{ color: 'var(--brand-cyan)' }}>"{activeStep.nodeA}"</strong></div>
          <div>Node B Database: <strong style={{ color: 'var(--brand-cyan)' }}>"{activeStep.nodeB}"</strong></div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '0.15rem' }}>
            {activeStep.nodeA === activeStep.nodeB ? 'Consistent' : 'Inconsistent / Stale'}
          </div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>The <strong>CAP Theorem</strong> (Brewer\'s Theorem) states that a distributed data store can simultaneously provide at most two of the following three guarantees:</p>
      <ul>
        <li><strong>Consistency (C):</strong> Every read receives the most recent write or an error.</li>
        <li><strong>Availability (A):</strong> Every non-failing node returns a non-error response, without guaranteeing it contains the most recent write.</li>
        <li><strong>Partition Tolerance (P):</strong> The system continues to operate despite an arbitrary number of messages being dropped or delayed by the network between nodes.</li>
        <li><strong>The Trade-off:</strong> Since networks will inevitably experience partition failures (P), a distributed system MUST choose between Consistency (CP) or Availability (AP) during a partition.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of CAP as **a Telephone Bank Account Balance**:</p>
      <ul>
        <li>You and a business partner share one account, but work at separate branches (Node A and Node B). Under normal circumstances, you call each other to sync records.</li>
        <li><strong>Partition (P):</strong> The phone lines between your branches go down. You cannot talk.</li>
        <li><strong>AP (Available):</strong> A customer comes to Node A to withdraw money. Node A allows it (remains available), but Node B doesn\'t know. The system is available but inconsistent.</li>
        <li><strong>CP (Consistent):</strong> Node A rejects the customer\'s withdraw request because it cannot verify with Node B (maintains consistency by sacrificing availability).</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Assuming "CA" is Possible:</strong> You cannot choose CA in the real world. Network partitions are physical realities; you cannot choose to build a system with "no partitions ever."</li>
      <li><strong>Consistency Misunderstandings:</strong> Confusing CAP consistency (linearizability, where all nodes have the exact same state at the same absolute time) with ACID consistency (database transactions staying within relational rules).</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Why can\'t we design a "CA" (Consistent + Available) system in real-world distributed infrastructure?',
      a: 'Because network links will eventually drop packets, experience fiber cuts, or suffer switch malfunctions. When this happens, a partition exists (P). To remain Available (A), nodes must reply immediately even if they cannot sync, losing Consistency. To remain Consistent (C), nodes must wait or error, losing Availability. Therefore, we must choose AP or CP.'
    },
    {
      q: 'Which database engines choose AP vs CP?',
      a: 'Cassandra, DynamoDB, and CouchDB are designed as AP systems, prioritizing high-write throughput and stale-read acceptance. MongoDB, HBase, Redis, and Spanner choose CP, using consensus algorithms to block updates or reads if nodes cannot reach quorum.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Under a network partition, what does a CP system do when it receives a write request that cannot replicate?',
      options: [
        'It accepts the write locally and ignores consistency',
        'It rejects the write or blocks/timeouts to preserve state consistency',
        'It automatically heals the network',
        'It deletes all stored variables'
      ],
      correctIdx: 1,
      explanation: 'CP systems prioritize absolute Consistency. If they cannot replicate to all necessary nodes, they reject/timeout the write.'
    },
    {
      question: 'Which guarantee is sacrificed in an AP system during a network partition?',
      options: [
        'Partition Tolerance',
        'Availability',
        'Consistency (stale data may be returned)',
        'Speed'
      ],
      correctIdx: 2,
      explanation: 'AP systems guarantee that every healthy node returns a success response immediately, meaning a node will serve stale data if it cannot replicate updates.'
    }
  ];

  return (
    <VisualizerShell
      title="CAP Theorem"
      subtitle="Interact with partitions. See how AP systems return stale data, and CP systems block write operations."
      timeComplexity="O(1) local write, O(N) replication"
      spaceComplexity="O(N) replicated node state"
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
          {/* Client to Node links */}
          <line x1="50" y1="100" x2="150" y2="60" stroke={activeStep.activeEdge === 'Client-NodeA' ? '#f59e0b' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
          <line x1="50" y1="100" x2="300" y2="140" stroke={activeStep.activeEdge === 'Client-NodeB' ? '#f59e0b' : 'var(--bg-tertiary)'} strokeWidth="1.5" />

          {/* Replication Link between Nodes */}
          {partitionActive ? (
            <g>
              {/* Broken Link */}
              <line x1="180" y1="60" x2="220" y2="80" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="5,5" />
              <line x1="260" y1="100" x2="300" y2="140" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="5,5" />
              <text x="240" y="93" textAnchor="middle" fill="#ef4444" fontSize="0.7rem" fontWeight="bold">✕ Partitioned</text>
            </g>
          ) : (
            <line
              x1="180"
              y1="60"
              x2="300"
              y2="140"
              stroke={activeStep.activeEdge === 'Replication-Link' ? '#10b981' : '#1591DC'}
              strokeWidth="2.5"
            />
          )}

          {/* Client Node */}
          <g>
            <circle cx="35" cy="100" r="16" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="35" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Client</text>
          </g>

          {/* Node A (Leader / Writer) */}
          <g>
            <rect x="120" y="30" width="70" height="50" fill="var(--bg-secondary)" stroke="#1591DC" strokeWidth="2.5" rx="3" />
            <text x="155" y="45" textAnchor="middle" fill="#1591DC" fontSize="0.55rem" fontWeight="bold">Node A</text>
            <rect x="130" y="55" width="50" height="15" fill="var(--bg-primary)" stroke="var(--bg-tertiary)" rx="2" />
            <text x="155" y="66" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Val: "{activeStep.nodeA}"</text>
          </g>

          {/* Node B (Follower / Reader) */}
          <g>
            <rect x="290" y="120" width="70" height="50" fill="var(--bg-secondary)" stroke="#1591DC" strokeWidth="2.5" rx="3" />
            <text x="325" y="135" textAnchor="middle" fill="#1591DC" fontSize="0.55rem" fontWeight="bold">Node B</text>
            <rect x="300" y="145" width="50" height="15" fill="var(--bg-primary)" stroke="var(--bg-tertiary)" rx="2" />
            <text x="325" y="156" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Val: "{activeStep.nodeB}"</text>
          </g>

          {/* Animated packets */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.35s ease' }}>
              <rect x={activeStep.packet.x - 30} y={activeStep.packet.y - 10} width="60" height="16" fill="var(--bg-primary)" stroke="#f59e0b" strokeWidth="1.2" rx="2" />
              <text x={activeStep.packet.x} y={activeStep.packet.y + 1} textAnchor="middle" fill="#f59e0b" fontSize="0.32rem" fontWeight="bold">
                {activeStep.packet.text}
              </text>
            </g>
          )}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--bg-secondary)', border: '1.5px solid #1591DC' }}></div> Active node
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--bg-secondary)', border: '1.5px solid #ef4444' }}></div> Partition error
          </div>
        </div>
      </div>
    </VisualizerShell>
  );
}
