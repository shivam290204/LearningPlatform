import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function DistributedLocksVisualizer() {
  const [lockState, setLockState] = useState({
    status: 'UNLOCKED', // 'LOCKED_C1', 'LOCKED_C2', 'UNLOCKED'
    heldBy: null,
    leaseTimeRemaining: 0
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const [steps, setSteps] = useState([
    {
      log: 'Distributed Lock coordinator idle. Try acquiring the resource lock with Client 1 or Client 2.',
      status: 'UNLOCKED',
      heldBy: null,
      leaseTimeRemaining: 0,
      activeNode: null,
      activeEdge: null,
      packet: null
    }
  ]);

  // Lease ticking timer
  useEffect(() => {
    let timer = null;
    if (lockState.status !== 'UNLOCKED' && lockState.leaseTimeRemaining > 0) {
      timer = setInterval(() => {
        setLockState(prev => {
          if (prev.leaseTimeRemaining <= 1) {
            clearInterval(timer);
            // Released on timeout
            return { status: 'UNLOCKED', heldBy: null, leaseTimeRemaining: 0 };
          }
          return { ...prev, leaseTimeRemaining: prev.leaseTimeRemaining - 1 };
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [lockState.status, lockState.leaseTimeRemaining]);

  const handleAcquire = (clientId) => {
    let trace = [];

    // Check if lock already held
    if (lockState.status !== 'UNLOCKED') {
      const holder = lockState.heldBy;
      trace.push({
        log: `Client ${clientId} attempts to acquire lock. Request denied: lock already leased to ${holder}.`,
        status: lockState.status,
        heldBy: holder,
        leaseTimeRemaining: lockState.leaseTimeRemaining,
        activeNode: `Client-${clientId}`,
        activeEdge: `Client-${clientId}-Lock`,
        packet: { text: 'LOCK DENIED (409)', x: clientId === 1 ? 100 : 350, y: 100 }
      });
      setSteps(trace);
      setCurrentStep(0);
      setIsPlaying(false);
      return;
    }

    // Acquire lock successfully
    const leaseDuration = 10; // 10 seconds lease
    const newStatus = clientId === 1 ? 'LOCKED_C1' : 'LOCKED_C2';
    const clientName = `Client ${clientId}`;

    trace.push({
      log: `${clientName} issues Redlock request to acquire distributed lock lease.`,
      status: 'UNLOCKED',
      heldBy: null,
      leaseTimeRemaining: 0,
      activeNode: `Client-${clientId}`,
      activeEdge: `Client-${clientId}-Lock`,
      packet: { text: 'ACQUIRE', x: clientId === 1 ? 100 : 350, y: 100 }
    });

    trace.push({
      log: `Consensus reached. Distributed lock granted to ${clientName} for a lease of ${leaseDuration} seconds.`,
      status: newStatus,
      heldBy: clientName,
      leaseTimeRemaining: leaseDuration,
      activeNode: 'LockManager',
      activeEdge: null,
      packet: null
    });

    setLockState({ status: newStatus, heldBy: clientName, leaseTimeRemaining: leaseDuration });
    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleRelease = (clientId) => {
    const clientName = `Client ${clientId}`;
    if (lockState.heldBy !== clientName) {
      alert(`Access Denied: Lock is held by ${lockState.heldBy || 'nobody'}, Client ${clientId} cannot release it!`);
      return;
    }

    let trace = [];
    trace.push({
      log: `${clientName} sends lock release request to coordinator.`,
      status: lockState.status,
      heldBy: lockState.heldBy,
      leaseTimeRemaining: lockState.leaseTimeRemaining,
      activeNode: `Client-${clientId}`,
      activeEdge: `Client-${clientId}-Lock`,
      packet: { text: 'RELEASE', x: clientId === 1 ? 100 : 350, y: 100 }
    });

    trace.push({
      log: `Lock released. Lock manager status reset to UNLOCKED. Resource is now available.`,
      status: 'UNLOCKED',
      heldBy: null,
      leaseTimeRemaining: 0,
      activeNode: 'LockManager',
      activeEdge: null,
      packet: null
    });

    setLockState({ status: 'UNLOCKED', heldBy: null, leaseTimeRemaining: 0 });
    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Playback timer for trace stages
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
    setLockState({ status: 'UNLOCKED', heldBy: null, leaseTimeRemaining: 0 });
    setSteps([
      {
        log: 'Distributed Lock coordinator reset. Lock status is UNLOCKED.',
        status: 'UNLOCKED',
        heldBy: null,
        leaseTimeRemaining: 0,
        activeNode: null,
        activeEdge: null,
        packet: null
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <button className="btn-viz-action btn-add" onClick={() => handleAcquire(1)}>
        Client 1: Acquire Lock
      </button>
      <button className="btn-viz-action btn-clear" onClick={() => handleRelease(1)}>
        Client 1: Release Lock
      </button>

      <button className="btn-viz-action btn-add" style={{ backgroundColor: '#a855f7', borderColor: '#a855f7' }} onClick={() => handleAcquire(2)}>
        Client 2: Acquire Lock
      </button>
      <button className="btn-viz-action btn-clear" onClick={() => handleRelease(2)}>
        Client 2: Release Lock
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Lock Manager State</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Lock Status: <strong style={{ color: lockState.status === 'UNLOCKED' ? '#10b981' : '#ef4444' }}>{lockState.status}</strong></div>
          <div>Leased Holder: <span style={{ color: 'var(--brand-cyan)' }}>{lockState.heldBy || 'None'}</span></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Safety Lease timer</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Remaining Lease: <strong style={{ color: lockState.leaseTimeRemaining > 0 ? '#f59e0b' : '#10b981' }}>{lockState.leaseTimeRemaining} seconds</strong></div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
            {lockState.leaseTimeRemaining > 0 ? 'Failsafe lock recovery active' : 'Lock idle and open'}
          </div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>Distributed Lock</strong> prevents race conditions when multiple independent processes (in a microservice network) try to write to a shared resource concurrently:</p>
      <ul>
        <li><strong>Local Locks fail:</strong> Standard Java <code>synchronized</code> blocks or Go Mutex locks only protect resource threads on a single machine. They cannot block writes from separate server nodes in a network.</li>
        <li><strong>Failsafe Leases (TTL):</strong> A lock must be granted with a Time-To-Live expiration clock. If a client acquires a lock and crashes, the lease automatically expires, avoiding a permanent system freeze.</li>
        <li><strong>Redlock Algorithm:</strong> To ensure high availability, Redis Redlock requires client nodes to acquire lock tokens on a majority (N/2 + 1) of independent Redis instances.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of a Distributed Lock as **a single speaking microphone in a conference**:</p>
      <ul>
        <li><strong>Shared Resource:</strong> The meeting agenda (database record).</li>
        <li><strong>Microphone (Lock):</strong> Only the person holding the microphone is permitted to speak and make updates.</li>
        <li><strong>Timeout Lease:</strong> The microphone has an automatic 10-second silent timer. If the speaker falls asleep (crashes), the microphone automatically turns off and releases, so the next speaker can pick it up.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Lease Time Expiry Race:</strong> A worker takes a lock, gets blocked on a slow database write, and the lease expires. A second worker takes the lock and updates the record. Suddenly, Worker 1 wakes up and finishes writing, corrupting the state. <em>Fix: Use fencing tokens.</em></li>
      <li><strong>Single Lock Instance:</strong> Running lock registries on a single Redis master without backups, causing deadlock freezes if that master crashes.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Why do local programming locks (synchronized/Mutex) fail in cloud systems?',
      a: 'Local locks only manage thread execution within a single JVM/process memory space. In distributed systems, multiple servers run separate JVMs on different machines, allowing concurrent edits unless a centralized lock manager (Redis/Zookeeper) is used.'
    },
    {
      q: 'What is a "Fencing Token" and how does it prevent lock race conditions?',
      a: 'A fencing token is a monotonically increasing number returned during lock acquisition. When writing to the resource, the client sends this token. The resource rejects any write request containing an older token than the latest committed token, preventing late-arriving expired write overwrites.'
    }
  ];

  const quizQuestions = [
    {
      question: 'What is the primary purpose of a Time-To-Live (TTL) lease in distributed locks?',
      options: [
        'To speed up network data speeds',
        'To automatically release the lock if the holding client crashes, preventing permanent deadlocks',
        'To encrypt the lock database keys',
        'To balance database reads'
      ],
      correctIdx: 1,
      explanation: 'Without a TTL lease, if a client acquires a lock and immediately crashes, the lock will remain locked forever, freezing the system.'
    },
    {
      question: 'Which tool is commonly used to coordinate distributed lock systems?',
      options: [
        'Local browser memory',
        'Redis (Redlock) or Apache ZooKeeper',
        'DNS servers',
        'CDN caching servers'
      ],
      correctIdx: 1,
      explanation: 'Redis and ZooKeeper are distributed storage engines that coordinate node agreements and maintain lock leases globally.'
    }
  ];

  return (
    <VisualizerShell
      title="Distributed Locks Simulator"
      subtitle="Witness concurrent lock requests, lease timeouts, lock conflicts, and failsafe auto-releases."
      timeComplexity="O(1) lock check"
      spaceComplexity="O(1) lock occupancy record"
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
          {/* Client 1 to Lock Manager line */}
          <line
            x1="50"
            y1="100"
            x2="225"
            y2="100"
            stroke={activeStep.activeEdge === 'Client-1-Lock' ? '#1591DC' : 'var(--bg-tertiary)'}
            strokeWidth={activeStep.activeEdge === 'Client-1-Lock' ? '2.5' : '1.5'}
          />

          {/* Client 2 to Lock Manager line */}
          <line
            x1="400"
            y1="100"
            x2="225"
            y2="100"
            stroke={activeStep.activeEdge === 'Client-2-Lock' ? '#a855f7' : 'var(--bg-tertiary)'}
            strokeWidth={activeStep.activeEdge === 'Client-2-Lock' ? '2.5' : '1.5'}
          />

          {/* Lock Manager to Protected Resource link */}
          <line
            x1="225"
            y1="100"
            x2="225"
            y2="40"
            stroke={lockState.status !== 'UNLOCKED' ? '#ef4444' : '#10b981'}
            strokeWidth="2"
            strokeDasharray={lockState.status !== 'UNLOCKED' ? '0' : '4 4'}
          />

          {/* Client 1 Node */}
          <g>
            <rect x="15" y="80" width="50" height="40" fill="var(--bg-secondary)" stroke="#1591DC" strokeWidth="2.5" rx="3" />
            <text x="40" y="104" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Client 1</text>
          </g>

          {/* Client 2 Node */}
          <g>
            <rect x="385" y="80" width="50" height="40" fill="var(--bg-secondary)" stroke="#a855f7" strokeWidth="2.5" rx="3" />
            <text x="410" y="104" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Client 2</text>
          </g>

          {/* Lock Manager Node */}
          <g>
            <circle
              cx="225"
              cy="100"
              r="22"
              fill={lockState.status === 'UNLOCKED' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}
              stroke={lockState.status === 'UNLOCKED' ? '#10b981' : '#ef4444'}
              strokeWidth="3"
            />
            <text x="225" y="99" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">LOCK</text>
            <text
              x="225"
              y="110"
              textAnchor="middle"
              fill={lockState.status === 'UNLOCKED' ? '#10b981' : '#ef4444'}
              fontSize="0.4rem"
              fontWeight="bold"
            >
              {lockState.status === 'UNLOCKED' ? 'OPEN' : 'LEASED'}
            </text>
          </g>

          {/* Protected Shared Resource DB */}
          <g>
            <rect
              x="180"
              y="10"
              width="90"
              height="24"
              fill="var(--bg-secondary)"
              stroke={lockState.status !== 'UNLOCKED' ? '#ef4444' : '#10b981'}
              strokeWidth="2"
              rx="3"
            />
            <text x="225" y="25" textAnchor="middle" fill="#FFFFFF" fontSize="0.52rem">Shared Database</text>
          </g>

          {/* Lease Countdown Clock floating indicator */}
          {lockState.leaseTimeRemaining > 0 && (
            <g>
              <rect x="205" y="132" width="40" height="15" fill="#f59e0b" rx="2" />
              <text x="225" y="142" textAnchor="middle" fill="#000000" fontSize="0.5rem" fontWeight="bold">
                {lockState.leaseTimeRemaining}s left
              </text>
            </g>
          )}

          {/* Animated Packet */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.35s ease' }}>
              <rect x={activeStep.packet.x - 30} y={activeStep.packet.y - 12} width="60" height="16" fill="var(--bg-primary)" stroke="#f59e0b" strokeWidth="1.2" rx="2" />
              <text x={activeStep.packet.x} y={activeStep.packet.y + 1} textAnchor="middle" fill="#f59e0b" fontSize="0.38rem" fontWeight="bold">
                {activeStep.packet.text}
              </text>
            </g>
          )}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></div> Open (Unlocked)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div> Leased (Locked)
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
