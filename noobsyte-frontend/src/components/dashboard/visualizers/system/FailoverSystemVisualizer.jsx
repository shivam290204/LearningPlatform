import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function FailoverSystemVisualizer() {
  const [nodes, setNodes] = useState({
    primary: { status: 'ONLINE', role: 'ACTIVE', label: 'Primary Node (Active)' },
    standby: { status: 'ONLINE', role: 'STANDBY', label: 'Standby Node (Passive)' }
  });
  const [dnsMapping, setDnsMapping] = useState('PRIMARY'); // 'PRIMARY' or 'STANDBY'
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const [steps, setSteps] = useState([
    {
      log: 'Failover system online. All client requests are resolved by the Active Primary Node.',
      nodes: {
        primary: { status: 'ONLINE', role: 'ACTIVE', label: 'Primary Node (Active)' },
        standby: { status: 'ONLINE', role: 'STANDBY', label: 'Standby Node (Passive)' }
      },
      dnsMapping: 'PRIMARY',
      activeNode: null,
      activeEdge: null,
      packet: null
    }
  ]);

  const handleSendRequest = () => {
    let trace = [];
    const destination = dnsMapping === 'PRIMARY' ? 'primary' : 'standby';

    if (nodes[destination].status === 'CRASHED') {
      alert('Request failed! DNS is routing to an offline server. Trigger Failover or Recover nodes.');
      return;
    }

    // 1. DNS Lookup
    trace.push({
      log: `Client initiates HTTP request. DNS Resolver resolves API domain to IP of ${nodes[destination].label}.`,
      nodes: { ...nodes },
      dnsMapping,
      activeNode: 'DNS',
      activeEdge: 'Client-DNS',
      packet: { text: 'DNS IP?', x: 80, y: 100 }
    });

    const targetY = destination === 'primary' ? 45 : 155;

    // 2. Request routes to Target
    trace.push({
      log: `HTTP request routed directly to ${nodes[destination].label}.`,
      nodes: { ...nodes },
      dnsMapping,
      activeNode: destination === 'primary' ? 'PrimaryNode' : 'StandbyNode',
      activeEdge: `DNS-${destination}`,
      packet: { text: 'GET API', x: 250, y: targetY }
    });

    // 3. Response returns
    trace.push({
      log: `Active node processes payload and returns HTTP 200 response to Client.`,
      nodes: { ...nodes },
      dnsMapping,
      activeNode: 'Client',
      activeEdge: null,
      packet: { text: '200 OK Response', x: 120, y: 100 }
    });

    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleCrashPrimary = () => {
    if (nodes.primary.status === 'CRASHED') return;
    const crashedState = {
      primary: { ...nodes.primary, status: 'CRASHED' },
      standby: { ...nodes.standby }
    };
    setNodes(crashedState);

    setSteps([
      {
        log: 'CRITICAL: Primary Server crashed! Heartbeat monitor lost contact.',
        nodes: crashedState,
        dnsMapping,
        activeNode: 'PrimaryNode',
        activeEdge: null,
        packet: null
      }
    ]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleTriggerFailover = () => {
    if (nodes.primary.status !== 'CRASHED') {
      alert('Primary server is online. Failover only runs when the active primary crashed.');
      return;
    }
    if (dnsMapping === 'STANDBY') {
      alert('Failover already complete. Standby node is handling traffic.');
      return;
    }

    let trace = [];
    let stateBefore = { ...nodes };

    // 1. Heartbeat check timeout
    trace.push({
      log: 'Heartbeat Monitor detects missing replies from Primary. Initiating failover checklist...',
      nodes: { ...stateBefore },
      dnsMapping: 'PRIMARY',
      activeNode: 'Heartbeat',
      activeEdge: 'Heartbeat-Line',
      packet: null
    });

    // 2. Promotion
    let stateAfter = {
      primary: { ...stateBefore.primary, role: 'DEAD' },
      standby: { ...stateBefore.standby, role: 'ACTIVE', label: 'Standby Node (Promoted Active)' }
    };

    trace.push({
      log: 'DNS mapping updated: Domain record resolved IP updated to Standby Node. Failover complete.',
      nodes: stateAfter,
      dnsMapping: 'STANDBY',
      activeNode: 'DNS',
      activeEdge: 'DNS-standby',
      packet: { text: 'DNS Update', x: 180, y: 100 }
    });

    setDnsMapping('STANDBY');
    setNodes(stateAfter);
    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleRecoverPrimary = () => {
    // Primary recovered joins as standby backup
    const recoveredState = {
      primary: { status: 'ONLINE', role: 'STANDBY', label: 'Primary Node (Standby Backup)' },
      standby: { status: 'ONLINE', role: 'ACTIVE', label: 'Standby Node (Active)' }
    };
    setNodes(recoveredState);
    setDnsMapping('STANDBY');

    setSteps([
      {
        log: 'Old Primary server recovered. Joining cluster back as Standby Passive Backup. Synchronizing records.',
        nodes: recoveredState,
        dnsMapping: 'STANDBY',
        activeNode: null,
        activeEdge: null,
        packet: null
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
    setDnsMapping('PRIMARY');
    const initialN = {
      primary: { status: 'ONLINE', role: 'ACTIVE', label: 'Primary Node (Active)' },
      standby: { status: 'ONLINE', role: 'STANDBY', label: 'Standby Node (Passive)' }
    };
    setNodes(initialN);
    setSteps([
      {
        log: 'Failover system reset. Primary server online and active.',
        nodes: initialN,
        dnsMapping: 'PRIMARY',
        activeNode: null,
        activeEdge: null,
        packet: null
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];
  const activeNodes = activeStep.nodes;

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <button className="btn-viz-action btn-add" onClick={handleSendRequest}>
        Send Request
      </button>

      {activeNodes.primary.status === 'ONLINE' ? (
        <button className="btn-viz-action btn-clear" onClick={handleCrashPrimary}>
          Crash Primary Server
        </button>
      ) : (
        <button className="btn-viz-action" onClick={handleRecoverPrimary}>
          Recover Crashed Server
        </button>
      )}

      {activeNodes.primary.status === 'CRASHED' && dnsMapping === 'PRIMARY' && (
        <button className="btn-viz-action" style={{ backgroundColor: '#f59e0b', borderColor: '#f59e0b' }} onClick={handleTriggerFailover}>
          Trigger Failover (DNS redirect)
        </button>
      )}

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Failover Health Check</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Primary Status: <strong style={{ color: activeNodes.primary.status === 'ONLINE' ? '#10b981' : '#ef4444' }}>{activeNodes.primary.status}</strong> ({activeNodes.primary.role})</div>
          <div>Standby Status: <strong style={{ color: '#10b981' }}>{activeNodes.standby.status}</strong> ({activeNodes.standby.role})</div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>DNS Resolution Rules</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>DNS Pointer IP: <strong style={{ color: 'var(--brand-cyan)' }}>{dnsMapping === 'PRIMARY' ? 'Primary Server IP' : 'Standby Server IP'}</strong></div>
          <div>Recovery Mode: <span>Cold Standby automated failover</span></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>Failover & Recovery</strong> is a disaster recovery configuration that automatically switches client traffic from a failed primary node to a backup secondary node to maintain High Availability (HA):</p>
      <ul>
        <li># **Active-Passive Configuration:** The primary server handles all request traffic, while the secondary standby server sits idle, periodically syncing data but processing zero user queries.</li>
        <li><strong>Heartbeat Monitor:</strong> A background process that sends regular ping requests to the primary server. If pings time out, it triggers the promotion protocol.</li>
        <li><strong>Failover (Promotions):</strong> The DNS mapping redirects domain resolution IPs to pointing at the standby server, routing subsequent client traffic to it.</li>
        <li><strong>Replications Lag:</strong> Standby nodes might be slightly behind the primary, resulting in minor data losses during unexpected server crashes.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Failover as **a backup generator in a hospital**:</p>
      <ul>
        <li><strong>Primary Node (Active Grid):</strong> The main power grid lines delivering electricity to the hospital.</li>
        <li><strong>Heartbeat Monitor:</strong> The automatic transfer switch sensing line voltage.</li>
        <li><strong>Standby Node (Backup Generator):</strong> The diesel generator sitting idle in the basement. When the main power lines crash (Primary offline), the switch detects it instantly and kicks the generator on (Failover promotion) to supply power.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Split-Brain Configuration:</strong> If the heartbeat link breaks due to a network partition but both servers remain online, the standby server might promote itself, resulting in two active primary servers writing conflicting datasets.</li>
      <li><strong>Untested Failover:</strong> Failing to run regular trial failover drill tests, only to discover that the passive standby node fails to boot up or lacks current records during a real disaster.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Detail the difference between Active-Active and Active-Passive configurations.',
      a: 'In Active-Active, all server nodes process requests simultaneously, maximizing throughput and balance. In Active-Passive, only the primary node serves traffic while secondary standby servers sit idle as silent backups, ready to take over only if the primary fails.'
    },
    {
      q: 'What is a "Split-Brain" scenario in active-passive systems and how is it resolved?',
      a: 'Split-Brain happens when a network link cuts the heartbeat connection but both nodes remain alive. Both servers claim to be the primary active node, causing client writes to diverge. Resolved using consensus algorithms (like Raft/Paxos) or dedicated quorum validation nodes.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which component is responsible for checking primary node health and triggering standby promotions during failures?',
      options: [
        'DNS cache resolvers',
        'Heartbeat monitor loops',
        'Static fallbacks',
        'Distributed lock leases'
      ],
      correctIdx: 1,
      explanation: 'Heartbeat monitors send periodic ping checks. If they fail, they alert the network router to redirect traffic.'
    },
    {
      question: 'What happens to DNS maps during automated failover recovery?',
      options: [
        'The DNS deletes all domain entries permanently',
        'DNS updates its records to point the domain to the standby backup server IP address',
        'DNS maps are not changed; the database resolves it',
        'The client browser is crashed'
      ],
      correctIdx: 1,
      explanation: 'Varying the DNS target IP redirects all client request packets to the promoted standby host server.'
    }
  ];

  return (
    <VisualizerShell
      title="Failover & Recovery System"
      subtitle="Observe Active-Passive setups. Monitor heartbeat pings, simulate server crashes, and trigger DNS reroutings."
      timeComplexity="O(1) DNS update"
      spaceComplexity="O(1) health mapping"
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
          {/* Client to DNS link */}
          <line
            x1="50"
            y1="100"
            x2="150"
            y2="100"
            stroke={activeStep.activeEdge === 'Client-DNS' ? '#1591DC' : 'var(--bg-tertiary)'}
            strokeWidth={activeStep.activeEdge === 'Client-DNS' ? '2.5' : '1.5'}
          />

          {/* DNS to Primary link */}
          <line
            x1="180"
            y1="100"
            x2="310"
            y2="45"
            stroke={activeStep.activeEdge === 'DNS-primary' ? '#1591DC' : 'var(--bg-tertiary)'}
            strokeWidth={activeStep.activeEdge === 'DNS-primary' ? '2.5' : '1.5'}
            strokeDasharray={activeNodes.primary.status === 'CRASHED' ? '4' : '0'}
          />

          {/* DNS to Standby link */}
          <line
            x1="180"
            y1="100"
            x2="310"
            y2="155"
            stroke={activeStep.activeEdge === 'DNS-standby' ? '#10b981' : 'var(--bg-tertiary)'}
            strokeWidth={activeStep.activeEdge === 'DNS-standby' ? '2.5' : '1.5'}
          />

          {/* Heartbeat connection link between nodes */}
          <path
            d="M 360,65 L 360,135"
            stroke={activeStep.activeEdge === 'Heartbeat-Line' ? '#f59e0b' : 'rgba(245, 158, 11, 0.25)'}
            strokeWidth="2"
            strokeDasharray="4 4"
            fill="none"
          />

          {/* Client Node */}
          <g>
            <circle cx="35" cy="100" r="16" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="35" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Client</text>
          </g>

          {/* DNS Resolver */}
          <g>
            <rect x="135" y="80" width="45" height="40" fill="var(--bg-secondary)" stroke="#1591DC" strokeWidth="2.5" rx="3" />
            <text x="157" y="100" textAnchor="middle" fill="#1591DC" fontSize="0.55rem" fontWeight="bold">DNS</text>
            <text x="157" y="112" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.38rem">
              {dnsMapping === 'PRIMARY' ? '-> Prim' : '-> Stby'}
            </text>
          </g>

          {/* Primary Server Box */}
          <g>
            <rect
              x="310"
              y="20"
              width="100"
              height="45"
              fill={activeNodes.primary.status === 'CRASHED' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-secondary)'}
              stroke={activeNodes.primary.status === 'CRASHED' ? '#ef4444' : '#1591DC'}
              strokeWidth="2.5"
              rx="4"
            />
            <text x="360" y="38" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Primary Node</text>
            <text
              x="360"
              y="52"
              textAnchor="middle"
              fill={activeNodes.primary.status === 'ONLINE' ? '#10b981' : '#ef4444'}
              fontSize="0.45rem"
            >
              {activeNodes.primary.status === 'ONLINE' ? 'ONLINE (Active)' : 'DEAD'}
            </text>
          </g>

          {/* Standby Server Box */}
          <g>
            <rect
              x="310"
              y="135"
              width="100"
              height="45"
              fill={dnsMapping === 'STANDBY' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)'}
              stroke={dnsMapping === 'STANDBY' ? '#10b981' : 'var(--bg-tertiary)'}
              strokeWidth="2"
              rx="4"
            />
            <text x="360" y="153" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Standby Node</text>
            <text
              x="360"
              y="167"
              textAnchor="middle"
              fill={dnsMapping === 'STANDBY' ? '#10b981' : 'var(--text-secondary)'}
              fontSize="0.45rem"
            >
              {dnsMapping === 'STANDBY' ? 'ONLINE (Promoted)' : 'PASSIVE (Backup)'}
            </text>
          </g>

          {/* Floating Heartbeat text indicator */}
          <g>
            <rect x="330" y="85" width="60" height="15" fill="var(--bg-primary)" stroke="var(--bg-tertiary)" strokeWidth="1" rx="2" />
            <text
              x="360"
              y="95"
              textAnchor="middle"
              fill={activeNodes.primary.status === 'ONLINE' ? '#10b981' : '#ef4444'}
              fontSize="0.42rem"
              fontWeight="bold"
            >
              {activeNodes.primary.status === 'ONLINE' ? '♥ PING OK' : '✕ TIMEOUT'}
            </text>
          </g>

          {/* Animated Packet */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.35s ease' }}>
              <rect x={activeStep.packet.x - 26} y={activeStep.packet.y - 10} width="52" height="15" fill="var(--bg-primary)" stroke="#f59e0b" strokeWidth="1.2" rx="2" />
              <text x={activeStep.packet.x} y={activeStep.packet.y + 1} textAnchor="middle" fill="#f59e0b" fontSize="0.38rem" fontWeight="bold">
                {activeStep.packet.text}
              </text>
            </g>
          )}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--bg-secondary)', border: '1.5px solid #1591DC' }}></div> Active Master
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--bg-secondary)', border: '1.5px solid var(--bg-tertiary)' }}></div> Standby (Passive)
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
