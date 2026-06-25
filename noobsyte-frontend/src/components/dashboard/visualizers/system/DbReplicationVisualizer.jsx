import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function DbReplicationVisualizer() {
  const [dbState, setDbState] = useState({
    master: { status: 'ONLINE', dataCount: 10, label: 'Master DB (Primary)' },
    replica1: { status: 'ONLINE', dataCount: 10, label: 'Replica DB 1' },
    replica2: { status: 'ONLINE', dataCount: 10, label: 'Replica DB 2' }
  });

  const [promotedReplica, setPromotedReplica] = useState(null); // 'replica1' or 'replica2'
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const [steps, setSteps] = useState([
    {
      log: 'Primary-Secondary replication cluster initialized. Try executing a Write or Read query.',
      nodes: {
        master: { status: 'ONLINE', dataCount: 10, label: 'Master DB (Primary)' },
        replica1: { status: 'ONLINE', dataCount: 10, label: 'Replica DB 1' },
        replica2: { status: 'ONLINE', dataCount: 10, label: 'Replica DB 2' }
      },
      activeNode: null,
      activeEdge: null,
      packet: null,
      promoted: null
    }
  ]);

  const handleWrite = () => {
    let trace = [];
    const isMasterCrashed = dbState.master.status === 'CRASHED' && !promotedReplica;

    if (isMasterCrashed) {
      alert('Write failed! Primary database is offline and no failover has occurred. Please trigger Failover or recovery.');
      return;
    }

    // Determine current writer node
    const writerKey = promotedReplica || 'master';
    const currentWriter = dbState[writerKey];
    const newCount = currentWriter.dataCount + 1;

    let preState = { ...dbState };
    let middleState = { ...dbState };
    middleState[writerKey] = { ...currentWriter, dataCount: newCount };

    // 1. App Server issues write
    trace.push({
      log: `App Server sends SQL Write request (e.g. INSERT) to primary node: ${dbState[writerKey].label}.`,
      nodes: { ...preState },
      activeNode: 'AppServer',
      activeEdge: `App-${writerKey}`,
      packet: { text: 'SQL WRITE', x: 40, y: 110 },
      promoted: promotedReplica
    });

    // 2. Writer Node updates locally
    trace.push({
      log: `${dbState[writerKey].label} commits write to transactional log. Local records: ${newCount}.`,
      nodes: { ...middleState },
      activeNode: writerKey,
      activeEdge: `App-${writerKey}`,
      packet: { text: 'Committing', x: 220, y: writerKey === 'master' ? 50 : 100 },
      promoted: promotedReplica
    });

    // 3. Replicate asynchronously
    let finalNodes = { ...middleState };
    const replicationPackets = [];

    if (writerKey === 'master') {
      if (dbState.replica1.status === 'ONLINE') {
        finalNodes.replica1 = { ...dbState.replica1, dataCount: newCount };
        replicationPackets.push({ text: 'Sync Req', x: 300, y: 50 });
      }
      if (dbState.replica2.status === 'ONLINE') {
        finalNodes.replica2 = { ...dbState.replica2, dataCount: newCount };
        replicationPackets.push({ text: 'Sync Req', x: 300, y: 105 });
      }
    } else {
      // Replica promoted to Master is the writer
      const secondaryKey = writerKey === 'replica1' ? 'replica2' : 'replica1';
      if (dbState[secondaryKey].status === 'ONLINE') {
        finalNodes[secondaryKey] = { ...dbState[secondaryKey], dataCount: newCount };
        replicationPackets.push({ text: 'Sync Req', x: 380, y: 105 });
      }
    }

    trace.push({
      log: 'Primary node broadcasts replication updates asynchronously to online secondary replicas.',
      nodes: { ...middleState },
      activeNode: writerKey,
      activeEdge: 'Replication',
      packet: replicationPackets[0] || null, // represent one node sync visually first
      promoted: promotedReplica
    });

    // 4. Sync done
    trace.push({
      log: `Secondary replicas successfully apply sync logs. Read consistency achieved across nodes.`,
      nodes: { ...finalNodes },
      activeNode: null,
      activeEdge: null,
      packet: null,
      promoted: promotedReplica
    });

    setDbState(finalNodes);
    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleRead = () => {
    let trace = [];

    // Reads are balanced across online replica nodes
    let targetReplica = 'replica1';
    if (dbState.replica1.status === 'ONLINE' && dbState.replica2.status === 'ONLINE') {
      // Round robin toggle or random select
      targetReplica = Math.random() > 0.5 ? 'replica1' : 'replica2';
    } else if (dbState.replica1.status === 'ONLINE') {
      targetReplica = 'replica1';
    } else if (dbState.replica2.status === 'ONLINE') {
      targetReplica = 'replica2';
    } else {
      // Read fallbacks to Master if replicas are both offline
      targetReplica = 'master';
    }

    if (dbState[targetReplica].status === 'CRASHED') {
      alert('Read query failed! No databases are online.');
      return;
    }

    const targetCoords = targetReplica === 'master' ? { x: 220, y: 50 } : (targetReplica === 'replica1' ? { x: 380, y: 50 } : { x: 380, y: 160 });

    trace.push({
      log: `App Server load balances SQL Read query to secondary node: ${dbState[targetReplica].label}.`,
      nodes: { ...dbState },
      activeNode: 'AppServer',
      activeEdge: `App-${targetReplica}`,
      packet: { text: 'SQL SELECT', x: 40, y: 110 },
      promoted: promotedReplica
    });

    trace.push({
      log: `Secondary node resolves query and returns dataset containing ${dbState[targetReplica].dataCount} records to App Server.`,
      nodes: { ...dbState },
      activeNode: targetReplica,
      activeEdge: `App-${targetReplica}`,
      packet: { text: `Data: ${dbState[targetReplica].dataCount} rows`, x: targetCoords.x - 100, y: targetCoords.y + 20 },
      promoted: promotedReplica
    });

    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleCrashMaster = () => {
    if (dbState.master.status === 'CRASHED') return;
    let crashedState = {
      ...dbState,
      master: { ...dbState.master, status: 'CRASHED' }
    };
    setDbState(crashedState);

    setSteps([
      {
        log: 'CRITICAL: Master DB (Primary) crashed! No writes can be accepted in this state.',
        nodes: crashedState,
        activeNode: 'master',
        activeEdge: null,
        packet: null,
        promoted: promotedReplica
      }
    ]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleFailover = () => {
    if (dbState.master.status !== 'CRASHED') {
      alert('Master DB is online. Failover only runs when the Primary crashes.');
      return;
    }
    if (promotedReplica) {
      alert('Failover already completed. Replica 1 is the new active writer.');
      return;
    }

    let trace = [];
    let stateBefore = { ...dbState };

    // 1. Heartbeat check fails
    trace.push({
      log: 'Secondary nodes detect missing heartbeat pings from Master. Split-brain avoidance check runs.',
      nodes: { ...stateBefore },
      activeNode: null,
      activeEdge: null,
      packet: null,
      promoted: null
    });

    // 2. Election phase
    trace.push({
      log: 'Replicas initiate consensus voting. Replica 1 holds the most up-to-date WAL offset.',
      nodes: { ...stateBefore },
      activeNode: 'replica1',
      activeEdge: 'Election',
      packet: { text: 'Vote: Replica 1', x: 380, y: 105 },
      promoted: null
    });

    // 3. Promotion
    let stateAfter = { ...stateBefore };
    stateAfter.replica1 = {
      ...stateBefore.replica1,
      label: 'Promoted Master (Replica 1)'
    };

    trace.push({
      log: 'Replica DB 1 promoted to Primary Master. Traffic routers updated to redirect writes here.',
      nodes: { ...stateAfter },
      activeNode: 'replica1',
      activeEdge: null,
      packet: null,
      promoted: 'replica1'
    });

    setPromotedReplica('replica1');
    setDbState(stateAfter);
    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleRecoverMaster = () => {
    let recoveredState = {
      master: { status: 'ONLINE', dataCount: dbState.replica1.dataCount, label: 'Replica DB (Old Master)' },
      replica1: { ...dbState.replica1 },
      replica2: { ...dbState.replica2 }
    };

    // If replica 1 is master, old master joins as a replica syncing from it
    if (promotedReplica === 'replica1') {
      recoveredState.replica1 = { ...dbState.replica1, label: 'Master DB (Replica 1)' };
    } else {
      recoveredState.master = { status: 'ONLINE', dataCount: 10, label: 'Master DB (Primary)' };
      recoveredState.replica1 = { status: 'ONLINE', dataCount: 10, label: 'Replica DB 1' };
      recoveredState.replica2 = { status: 'ONLINE', dataCount: 10, label: 'Replica DB 2' };
      setPromotedReplica(null);
    }

    setDbState(recoveredState);

    setSteps([
      {
        log: 'Recovered node joins the cluster. Missing log records are synchronized to achieve consensus.',
        nodes: recoveredState,
        activeNode: null,
        activeEdge: null,
        packet: null,
        promoted: promotedReplica === 'replica1' ? 'replica1' : null
      }
    ]);
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
    setPromotedReplica(null);
    const initialNodes = {
      master: { status: 'ONLINE', dataCount: 10, label: 'Master DB (Primary)' },
      replica1: { status: 'ONLINE', dataCount: 10, label: 'Replica DB 1' },
      replica2: { status: 'ONLINE', dataCount: 10, label: 'Replica DB 2' }
    };
    setDbState(initialNodes);
    setSteps([
      {
        log: 'Primary-Secondary replication cluster initialized. Try executing a Write or Read query.',
        nodes: initialNodes,
        activeNode: null,
        activeEdge: null,
        packet: null,
        promoted: null
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];
  const activeNodes = activeStep.nodes;

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <button className="btn-viz-action btn-add" onClick={handleWrite}>
        Write Request (SQL INSERT)
      </button>

      <button className="btn-viz-action" onClick={handleRead}>
        Read Request (SQL SELECT)
      </button>

      {activeNodes.master.status === 'ONLINE' ? (
        <button className="btn-viz-action btn-clear" onClick={handleCrashMaster}>
          Crash Master DB (Primary)
        </button>
      ) : (
        <button className="btn-viz-action btn-add" onClick={handleRecoverMaster}>
          Recover Crashed Node
        </button>
      )}

      {activeNodes.master.status === 'CRASHED' && !promotedReplica && (
        <button className="btn-viz-action btn-clear" style={{ backgroundColor: '#f59e0b' }} onClick={handleFailover}>
          Trigger Failover (Consensus Election)
        </button>
      )}

      <button className="btn-viz-action" onClick={handleReset}>
        Reset Cluster
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Cluster Node States</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Primary (Master): <strong style={{ color: activeNodes.master.status === 'ONLINE' ? '#10b981' : '#ef4444' }}>{activeNodes.master.status}</strong> (Data: {activeNodes.master.dataCount})</div>
          <div>Replica 1: <strong style={{ color: '#10b981' }}>{activeNodes.replica1.status}</strong> (Data: {activeNodes.replica1.dataCount}) {promotedReplica === 'replica1' && '(PROMOTED)'}</div>
          <div>Replica 2: <strong style={{ color: '#10b981' }}>{activeNodes.replica2.status}</strong> (Data: {activeNodes.replica2.dataCount})</div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Query Routing Rules</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Writes Route to: <span style={{ color: 'var(--brand-cyan)' }}>{promotedReplica === 'replica1' ? 'Replica DB 1 (Promoted)' : (activeNodes.master.status === 'ONLINE' ? 'Master DB' : 'Blocked (None)')}</span></div>
          <div>Reads Route to: <span style={{ color: '#10b981' }}>Replica DB 1 or Replica DB 2</span></div>
          <div>Sync Mode: <span style={{ color: '#f59e0b' }}>Asynchronous WAL sync</span></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>Database Replication</strong> maintains copies of database records across multiple server nodes to ensure high availability, redundancy, and scalability:</p>
      <ul>
        <li><strong>Primary (Master):</strong> Handles all write queries (INSERT, UPDATE, DELETE). Commits data locally and streams changes to replicas.</li>
        <li><strong>Secondaries (Replicas):</strong> Receive log updates from the master and apply them locally. They resolve read-only queries (SELECT), offloading reads from the master.</li>
        <li><strong>Asynchronous Sync:</strong> Master confirms writes immediately without waiting for replicas to catch up. Offers low latency but introduces a risk of temporary stale reads (eventual consistency).</li>
        <li><strong>Failover:</strong> If the primary crashes, the cluster detects the failure (via heartbeat ping timeout) and promotes a secondary node to master.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Database Replication as a **Newspaper Publication System**:</p>
      <ul>
        <li><strong>Primary (Master Writer):</strong> The editor in the head office writing and editing articles. All changes must go through them.</li>
        <li><strong>Secondary (Replicas):</strong> The printing presses in various cities receiving copies of the articles. Readers buy from their local city presses to read articles (Read-only operations).</li>
        <li><strong>Failover:</strong> If the head office collapses, the regional press in Chicago is chosen to become the new head office writer.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Split-Brain Scenario:</strong> If the network divides, two halves of a cluster might both elect a master, causing conflicting writes. <em>Fix: Require a quorum (majority vote) for master promotion.</em></li>
      <li><strong>Writing to Replicas:</strong> Client application sends an INSERT statement directly to a read-replica node, causing database state drift or query failures.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is the difference between Synchronous and Asynchronous database replication?',
      a: 'In synchronous replication, the master waits for all replicas to commit the write before returning success to the client (high write latency, strong consistency). In asynchronous replication, the master returns success immediately and replicates background data logs (low latency, eventual consistency).'
    },
    {
      q: 'What is a "Split-Brain" scenario in cluster management?',
      a: 'Split-Brain occurs when a network partition separates nodes, leading replicas on both sides to assume the primary master is dead and promote their own masters. This leads to duplicate active masters writing contradictory states.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which node in a standard master-slave setup executes write queries?',
      options: [
        'Read Replicas only',
        'Primary (Master) node only',
        'Any secondary node',
        'The load balancer cache'
      ],
      correctIdx: 1,
      explanation: 'Only the master database processes writes. Replicas process read operations to offload traffic.'
    },
    {
      question: 'What is the purpose of a heartbeat monitor in a database cluster?',
      options: [
        'To count active client browser connections',
        'To continuously check node health and trigger failover if the primary crashes',
        'To encrypt backups automatically',
        'To balance query counts'
      ],
      correctIdx: 1,
      explanation: 'Heartbeats are regular pings. If the master stops responding, secondary nodes initiate failover elections.'
    }
  ];

  return (
    <VisualizerShell
      title="Database Replication Simulator"
      subtitle="Observe Master-Replica synchronization, read query load distribution, master crashes, and automated failover."
      timeComplexity="O(N) replication lag"
      spaceComplexity="O(1) cluster state mapping"
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%', minHeight: '230px', padding: '1rem 0' }}>
        
        <svg width="450" height="200" style={{ overflow: 'visible' }}>
          {/* Edge lines from App Server to DB nodes */}
          {/* Link to Master */}
          <line
            x1="60"
            y1="110"
            x2="220"
            y2="50"
            stroke={activeStep.activeEdge === 'App-master' ? '#1591DC' : 'var(--bg-tertiary)'}
            strokeWidth={activeStep.activeEdge === 'App-master' ? '2.5' : '1.5'}
            strokeDasharray={activeNodes.master.status === 'CRASHED' ? '4' : '0'}
          />

          {/* Link to Replica 1 */}
          <line
            x1="60"
            y1="110"
            x2="380"
            y2="50"
            stroke={activeStep.activeEdge === 'App-replica1' ? '#10b981' : 'var(--bg-tertiary)'}
            strokeWidth={activeStep.activeEdge === 'App-replica1' ? '2.5' : '1.5'}
          />

          {/* Link to Replica 2 */}
          <line
            x1="60"
            y1="110"
            x2="380"
            y2="160"
            stroke={activeStep.activeEdge === 'App-replica2' ? '#10b981' : 'var(--bg-tertiary)'}
            strokeWidth={activeStep.activeEdge === 'App-replica2' ? '2.5' : '1.5'}
          />

          {/* Replication Sync Links from Master to Replicas */}
          <path
            d="M 220,50 L 380,50"
            stroke={activeStep.activeEdge === 'Replication' ? '#f59e0b' : 'rgba(245, 158, 11, 0.25)'}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            fill="none"
          />
          <path
            d="M 220,50 Q 300,110 380,160"
            stroke={activeStep.activeEdge === 'Replication' ? '#f59e0b' : 'rgba(245, 158, 11, 0.25)'}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            fill="none"
          />

          {/* Election Inter-replica Link */}
          {activeStep.activeEdge === 'Election' && (
            <line
              x1="380"
              y1="50"
              x2="380"
              y2="160"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeDasharray="3 3"
            />
          )}

          {/* App Server Node */}
          <g>
            <circle cx="40" cy="110" r="20" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2.5" />
            <text x="40" y="113" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">App Server</text>
          </g>

          {/* Master DB Node */}
          <g>
            <rect
              x="180"
              y="30"
              width="80"
              height="40"
              fill={activeNodes.master.status === 'CRASHED' ? 'rgba(239, 68, 68, 0.1)' : (promotedReplica === 'replica1' ? 'var(--bg-secondary)' : 'rgba(21, 145, 220, 0.15)')}
              stroke={activeNodes.master.status === 'CRASHED' ? '#ef4444' : (promotedReplica === 'replica1' ? 'var(--bg-tertiary)' : '#1591DC')}
              strokeWidth="2.5"
              rx="4"
            />
            <text x="220" y="48" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Master DB</text>
            <text x="220" y="60" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.45rem">
              {activeNodes.master.status === 'CRASHED' ? 'OFFLINE' : `Count: ${activeNodes.master.dataCount}`}
            </text>
          </g>

          {/* Replica 1 Node */}
          <g>
            <rect
              x="340"
              y="30"
              width="80"
              height="40"
              fill={promotedReplica === 'replica1' ? 'rgba(21, 145, 220, 0.15)' : 'rgba(16, 185, 129, 0.1)'}
              stroke={promotedReplica === 'replica1' ? '#1591DC' : '#10b981'}
              strokeWidth="2"
              rx="4"
            />
            <text x="380" y="48" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Replica DB 1</text>
            <text x="380" y="60" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.45rem">
              {promotedReplica === 'replica1' ? 'Promoted (Master)' : `Count: ${activeNodes.replica1.dataCount}`}
            </text>
          </g>

          {/* Replica 2 Node */}
          <g>
            <rect
              x="340"
              y="140"
              width="80"
              height="40"
              fill="rgba(16, 185, 129, 0.1)"
              stroke="#10b981"
              strokeWidth="2"
              rx="4"
            />
            <text x="380" y="158" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Replica DB 2</text>
            <text x="380" y="170" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.45rem">
              Count: {activeNodes.replica2.dataCount}
            </text>
          </g>

          {/* Animated Packet */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.35s ease' }}>
              <rect
                x={activeStep.packet.x - 30}
                y={activeStep.packet.y - 12}
                width="60"
                height="16"
                fill="var(--bg-primary)"
                stroke="#f59e0b"
                strokeWidth="1.2"
                rx="2"
              />
              <text
                x={activeStep.packet.x}
                y={activeStep.packet.y + 1}
                textAnchor="middle"
                fill="#f59e0b"
                style={{ fontSize: '0.45rem', fontFamily: 'monospace', fontWeight: 'bold' }}
              >
                {activeStep.packet.text}
              </text>
            </g>
          )}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: 'rgba(21, 145, 220, 0.15)', border: '1.5px solid #1591DC' }}></div> Master (Writes)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1.5px solid #10b981' }}></div> Replica (Reads)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '15px', height: '8px', border: '1.5px dashed #f59e0b', backgroundColor: 'transparent' }}></div> Sync Stream
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
