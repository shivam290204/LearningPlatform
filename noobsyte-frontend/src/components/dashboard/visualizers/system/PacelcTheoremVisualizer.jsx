import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function PacelcTheoremVisualizer() {
  const [pacelcConfig, setPacelcConfig] = useState('PA_EL'); // 'PA_EL' or 'PC_EC'
  const [partitionActive, setPartitionActive] = useState(false);
  const [nodeAValue, setNodeAValue] = useState('V0');
  const [nodeBValue, setNodeBValue] = useState('V0');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const [steps, setSteps] = useState([
    {
      log: 'PACELC System ready. Normal operations. Configuration: PA/EL (DynamoDB/Cassandra).',
      nodeA: 'V0',
      nodeB: 'V0',
      activeNode: null,
      activeEdge: null,
      packet: null,
      metricLatency: '5ms',
      metricConsistency: 'Eventual'
    }
  ]);

  const handleRunTransaction = () => {
    let trace = [];
    const newValue = `V${Math.floor(Math.random() * 90) + 10}`;

    if (partitionActive) {
      // IF PARTITION (P)
      if (pacelcConfig === 'PC_EC') {
        // Choose Consistency (C) -> Reject write or timeout
        trace.push({
          log: 'Partition State (P): Client sends write to Node A. Since config is PC, system rejects write because Node B cannot be reached.',
          nodeA: nodeAValue,
          nodeB: nodeBValue,
          activeNode: 'NodeA',
          activeEdge: null,
          packet: { text: 'Write Blocked (PC)', x: 160, y: 100 },
          metricLatency: 'Timeout',
          metricConsistency: 'Consistent (No Write)'
        });
      } else {
        // Choose Availability (A) -> Accept locally, return old value on Node B
        trace.push({
          log: `Partition State (P): Client writes "${newValue}" to Node A. Config is PA, so Node A accepts write locally and returns success immediately.`,
          nodeA: newValue,
          nodeB: nodeBValue,
          activeNode: 'NodeA',
          activeEdge: 'Client-NodeA',
          packet: { text: `Write "${newValue}"`, x: 70, y: 50 },
          metricLatency: '5ms',
          metricConsistency: 'Stale (Inconsistent)'
        });

        trace.push({
          log: `Partition State (P): Client queries Node B. Node B has no connectivity and returns stale value "${nodeBValue}".`,
          nodeA: newValue,
          nodeB: nodeBValue,
          activeNode: 'NodeB',
          activeEdge: 'Client-NodeB',
          packet: { text: `Stale: "${nodeBValue}"`, x: 300, y: 150 },
          metricLatency: '5ms',
          metricConsistency: 'Inconsistent'
        });
      }
    } else {
      // ELSE NORMAL OPERATIONS (E)
      if (pacelcConfig === 'PC_EC') {
        // Choose Consistency (C) -> Wait for replica confirmation (high latency, high consistency)
        trace.push({
          log: `Normal State (E): Client writes "${newValue}" to Node A. Config is EC, so Node A waits for Node B to commit replication before returning.`,
          nodeA: nodeAValue,
          nodeB: nodeBValue,
          activeNode: 'NodeA',
          activeEdge: 'Replication-Link',
          packet: { text: `Sync: "${newValue}"`, x: 230, y: 100 },
          metricLatency: '45ms',
          metricConsistency: 'Strong (Locked)'
        });

        trace.push({
          log: `Normal State (E): Node B commits value. Response returned to Client. Guarantee: Strong Consistency at cost of higher latency.`,
          nodeA: newValue,
          nodeB: newValue,
          activeNode: 'Client',
          activeEdge: null,
          packet: null,
          metricLatency: '50ms',
          metricConsistency: 'Strong'
        });
      } else {
        // Choose Latency (L) -> Return success immediately, replicate async (low latency, eventual consistency)
        trace.push({
          log: `Normal State (E): Client writes "${newValue}" to Node A. Config is EL, so Node A returns success immediately. Latency is extremely low.`,
          nodeA: newValue,
          nodeB: nodeBValue,
          activeNode: 'NodeA',
          activeEdge: 'Client-NodeA',
          packet: { text: `Success`, x: 70, y: 50 },
          metricLatency: '2ms',
          metricConsistency: 'Eventual (Pending Sync)'
        });

        trace.push({
          log: `Normal State (E): Replication sync packet traverses network in the background while Client goes on.`,
          nodeA: newValue,
          nodeB: nodeBValue,
          activeNode: 'NodeB',
          activeEdge: 'Replication-Link',
          packet: { text: `Async sync`, x: 230, y: 100 },
          metricLatency: '2ms',
          metricConsistency: 'Eventual'
        });

        trace.push({
          log: `Normal State (E): Node B eventually updates value. Synchronization complete.`,
          nodeA: newValue,
          nodeB: newValue,
          activeNode: 'NodeB',
          activeEdge: null,
          packet: null,
          metricLatency: '15ms',
          metricConsistency: 'Consistent (Eventually)'
        });
      }
    }

    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);

    // Apply values locally if replication completed or EL local write completed
    if (!partitionActive) {
      setNodeAValue(newValue);
      setNodeBValue(newValue);
    } else if (pacelcConfig === 'PA_EL') {
      setNodeAValue(newValue);
    }
  };

  const handleTogglePartition = () => {
    const nextPartition = !partitionActive;
    setPartitionActive(nextPartition);
    const logStr = nextPartition
      ? 'Network partition occurred (P). PACELC rules apply.'
      : 'Network partition healed. Re-entering normal state (E).';

    setSteps([
      {
        log: logStr,
        nodeA: nodeAValue,
        nodeB: nodeBValue,
        activeNode: null,
        activeEdge: null,
        packet: null,
        metricLatency: 'N/A',
        metricConsistency: 'N/A'
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
    setNodeAValue('V0');
    setNodeBValue('V0');
    setSteps([
      {
        log: 'PACELC environment reset.',
        nodeA: 'V0',
        nodeB: 'V0',
        activeNode: null,
        activeEdge: null,
        packet: null,
        metricLatency: 'N/A',
        metricConsistency: 'N/A'
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>PACELC Config:</span>
      <select
        value={pacelcConfig}
        onChange={(e) => {
          setPacelcConfig(e.target.value);
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
        <option value="PA_EL">PA/EL (Eventual Consistency, Low Latency - e.g. Cassandra)</option>
        <option value="PC_EC">PC/EC (Strong Consistency, Higher Latency - e.g. Spanner)</option>
      </select>

      <button
        className={`btn-viz-action ${partitionActive ? 'btn-clear' : 'btn-add'}`}
        onClick={handleTogglePartition}
      >
        {partitionActive ? 'Heal Link (E State)' : 'Break Link (P State)'}
      </button>

      <button className="btn-viz-action btn-add" onClick={handleRunTransaction}>
        Execute Write Request
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>PACELC Live Metrics</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          <div>Operation Latency: <strong style={{ color: 'var(--brand-cyan)' }}>{activeStep.metricLatency}</strong></div>
          <div>Consistency Level: <strong style={{ color: 'var(--brand-cyan)' }}>{activeStep.metricConsistency}</strong></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Replica Value State</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          <div>Node A (Leader): <strong style={{ color: '#10b981' }}>"{activeStep.nodeA}"</strong></div>
          <div>Node B (Follower): <strong style={{ color: '#10b981' }}>"{activeStep.nodeB}"</strong></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>The <strong>PACELC Theorem</strong> is an extension of the CAP theorem. It states that in a distributed database system:</p>
      <ul>
        <li>If there is a <strong>Partition (P)</strong>, how does the system trade off <strong>Availability (A)</strong> vs <strong>Consistency (C)</strong>?</li>
        <li><strong>Else (E)</strong>, when the system is running normally without partitions, how does it trade off <strong>Latency (L)</strong> vs <strong>Consistency (C)</strong>?</li>
        <li><strong>PA/EL:</strong> If partitioned, choose Availability. Else, choose Latency. (e.g. Cassandra, DynamoDB, MongoDB config).</li>
        <li><strong>PC/EC:</strong> If partitioned, choose Consistency. Else, choose Consistency. (e.g. Spanner, CockroachDB, ACID Relational Databases).</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of PACELC as **a Retail Store Stock Inventory**:</p>
      <ul>
        <li><strong>Partition state (P):</strong> The internet goes down between store A and store B.
          <ul>
            <li><strong>PA (Available):</strong> Store A keeps selling shoes even if they cannot check if Store B has them.</li>
            <li><strong>PC (Consistent):</strong> Store A refuses to sell shoes until they verify stock with Store B.</li>
          </ul>
        </li>
        <li><strong>Normal state (E):</strong> The internet is working perfectly.
          <ul>
            <li><strong>EL (Latency):</strong> A customer buys shoes at Store A. Store A rings it up instantly. They sync with Store B in the background (eventually consistent, very fast).</li>
            <li><strong>EC (Consistency):</strong> Store A forces the customer to wait at the register while they call Store B to confirm both inventories are updated in real-time before completing the sale.</li>
          </ul>
        </li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Assuming PACELC Replaces CAP:</strong> It does not replace CAP; it extends it. CAP ignores normal operations, whereas PACELC highlights that even under normal states, strong consistency requires higher write latency.</li>
      <li><strong>Assuming Spanner is PA/EC:</strong> Google Spanner guarantees external consistency (EC) and remains consistent under partition (PC). It is a PC/EC system.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What does the E and L stand for in the PACELC theorem?',
      a: 'The "E" stands for "Else" (normal system operation without partitions). The "L" stands for "Latency" (optimizing database response times by writing asynchronously to replicas).'
    },
    {
      q: 'Why does choosing "EC" (Consistency during normal operations) increase API latency?',
      a: 'To guarantee strong consistency (EC), a write request cannot return success to the client until a quorum of replica nodes confirm they have written the update to disk. This network roundtrip latency is added to the write lifecycle.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which database configuration is best suited for an EL (Latency-focused) normal state?',
      options: [
        'Synchronous replication to 5 nodes',
        'Asynchronous replication (eventual consistency)',
        'Locking all read nodes during a write',
        'Two-phase commit on all transactions'
      ],
      correctIdx: 1,
      explanation: 'Asynchronous replication allows write operations to complete immediately, updating replicas in the background to minimize latency.'
    },
    {
      question: 'MongoDB can be configured in multiple ways. In its default write-concern mode, how does it fit PACELC?',
      options: [
        'PA/EL',
        'PC/EC',
        'PA/EC',
        'PC/EL'
      ],
      correctIdx: 0,
      explanation: 'By default, MongoDB chooses Availability under partition (PA) and Latency during normal operations (EL) by acknowledging writes before replicating to all secondaries.'
    }
  ];

  return (
    <VisualizerShell
      title="PACELC Theorem"
      subtitle="Examine the extension of CAP. Analyze Latency (L) vs Consistency (C) trade-offs during normal operations (E)."
      timeComplexity="EL: O(1) write; EC: O(N) sync write"
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
          {/* Client link lines */}
          <line x1="50" y1="100" x2="150" y2="60" stroke={activeStep.activeEdge === 'Client-NodeA' ? '#f59e0b' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
          <line x1="50" y1="100" x2="300" y2="140" stroke={activeStep.activeEdge === 'Client-NodeB' ? '#f59e0b' : 'var(--bg-tertiary)'} strokeWidth="1.5" />

          {/* Replication Link */}
          {partitionActive ? (
            <g>
              <line x1="180" y1="60" x2="220" y2="80" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="5,5" />
              <line x1="260" y1="100" x2="300" y2="140" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="5,5" />
              <text x="245" y="93" textAnchor="middle" fill="#ef4444" fontSize="0.7rem" fontWeight="bold">✕ Partitioned (P)</text>
            </g>
          ) : (
            <g>
              <line
                x1="180"
                y1="60"
                x2="300"
                y2="140"
                stroke={activeStep.activeEdge === 'Replication-Link' ? '#10b981' : '#1591DC'}
                strokeWidth="2.5"
              />
              <text x="245" y="93" textAnchor="middle" fill="#10b981" fontSize="0.65rem">Normal state (E)</text>
            </g>
          )}

          {/* Client Node */}
          <g>
            <circle cx="35" cy="100" r="16" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="35" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Client</text>
          </g>

          {/* Node A */}
          <g>
            <rect x="120" y="30" width="70" height="50" fill="var(--bg-secondary)" stroke="#1591DC" strokeWidth="2.5" rx="3" />
            <text x="155" y="45" textAnchor="middle" fill="#1591DC" fontSize="0.55rem" fontWeight="bold">Node A</text>
            <rect x="130" y="55" width="50" height="15" fill="var(--bg-primary)" stroke="var(--bg-tertiary)" rx="2" />
            <text x="155" y="66" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">"{activeStep.nodeA}"</text>
          </g>

          {/* Node B */}
          <g>
            <rect x="290" y="120" width="70" height="50" fill="var(--bg-secondary)" stroke="#1591DC" strokeWidth="2.5" rx="3" />
            <text x="325" y="135" textAnchor="middle" fill="#1591DC" fontSize="0.55rem" fontWeight="bold">Node B</text>
            <rect x="300" y="145" width="50" height="15" fill="var(--bg-primary)" stroke="var(--bg-tertiary)" rx="2" />
            <text x="325" y="156" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">"{activeStep.nodeB}"</text>
          </g>

          {/* Packet */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.35s ease' }}>
              <rect x={activeStep.packet.x - 30} y={activeStep.packet.y - 10} width="60" height="16" fill="var(--bg-primary)" stroke="#f59e0b" strokeWidth="1.2" rx="2" />
              <text x={activeStep.packet.x} y={activeStep.packet.y + 1} textAnchor="middle" fill="#f59e0b" fontSize="0.3rem" fontWeight="bold">
                {activeStep.packet.text}
              </text>
            </g>
          )}
        </svg>
      </div>
    </VisualizerShell>
  );
}
