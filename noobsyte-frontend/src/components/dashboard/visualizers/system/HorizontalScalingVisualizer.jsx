import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function HorizontalScalingVisualizer() {
  const [servers, setServers] = useState([
    { id: 1, status: 'ONLINE', requestsServed: 0 },
    { id: 2, status: 'ONLINE', requestsServed: 0 }
  ]);
  const [sessionMode, setSessionMode] = useState('STATELESS'); // 'STATELESS' or 'STICKY'
  const [activeClient, setActiveClient] = useState('User A'); // 'User A', 'User B'
  const [userSessions, setUserSessions] = useState({
    'User A': { serverId: null, data: 'Cart: 2 items' },
    'User B': { serverId: null, data: 'Cart: Empty' }
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const [steps, setSteps] = useState([
    {
      log: 'Horizontal Scaling pool initialized with 2 servers. Send request or scale the pool.',
      servers: [
        { id: 1, status: 'ONLINE', requestsServed: 0 },
        { id: 2, status: 'ONLINE', requestsServed: 0 }
      ],
      activeNode: null,
      activeEdge: null,
      packet: null,
      userSessions: {
        'User A': { serverId: null, data: 'Cart: 2 items' },
        'User B': { serverId: null, data: 'Cart: Empty' }
      }
    }
  ]);

  const handleSendRequest = () => {
    let trace = [];
    const clientX = activeClient === 'User A' ? 40 : 40;
    const clientY = activeClient === 'User A' ? 50 : 150;
    const targetMode = sessionMode;

    // Determine destination server
    let targetServerId = null;
    const activeServers = servers.filter(s => s.status === 'ONLINE');

    if (activeServers.length === 0) {
      alert('All servers are offline! Scale up or reset.');
      return;
    }

    if (targetMode === 'STICKY') {
      // Sticky session checks if user already mapped to a server
      const existingMapping = userSessions[activeClient].serverId;
      const isMappedServerOnline = existingMapping && servers.find(s => s.id === existingMapping)?.status === 'ONLINE';

      if (isMappedServerOnline) {
        targetServerId = existingMapping;
      } else {
        // Assign new server round robin/random and map
        targetServerId = activeServers[Math.floor(Math.random() * activeServers.length)].id;
      }
    } else {
      // Stateless mode routes to least served or random
      targetServerId = activeServers[Math.floor(Math.random() * activeServers.length)].id;
    }

    // 1. Send to Load Balancer
    trace.push({
      log: `${activeClient} issues HTTP request. Packet reaches the central Load Balancer first.`,
      servers: servers.map(s => ({ ...s })),
      activeNode: 'LoadBalancer',
      activeEdge: 'Client-LB',
      packet: { text: activeClient, x: 120, y: 100 },
      userSessions: { ...userSessions }
    });

    // Determine server Y coordinates for animation
    // Server positions: S1 y:35, S2 y:75, S3 y:115, S4 y:155
    const serverCoords = {
      1: { x: 300, y: 35 },
      2: { x: 300, y: 75 },
      3: { x: 300, y: 115 },
      4: { x: 300, y: 155 }
    };
    const sCoord = serverCoords[targetServerId] || { x: 300, y: 75 };

    // 2. Load Balancer routes to Server
    let sessionLogs = '';
    let updatedSessions = { ...userSessions };

    if (targetMode === 'STICKY') {
      const prevMap = userSessions[activeClient].serverId;
      if (prevMap && prevMap !== targetServerId) {
        sessionLogs = `Session Sticky Mapping broken (Server ${prevMap} was offline). Routing to new Server ${targetServerId}. User session cart reset!`;
        updatedSessions[activeClient] = { serverId: targetServerId, data: 'Cart: Empty (Reset)' };
      } else {
        sessionLogs = `Sticky Session lookup matched. Routing ${activeClient} back to Server ${targetServerId} preserving memory state.`;
        updatedSessions[activeClient] = { ...updatedSessions[activeClient], serverId: targetServerId };
      }
    } else {
      sessionLogs = `Stateless Routing: Load Balancer maps packet to Server ${targetServerId}. Server queries shared Redis DB for session data.`;
      updatedSessions[activeClient] = { ...updatedSessions[activeClient], serverId: targetServerId };
    }

    trace.push({
      log: `Load Balancer routes request to Server ${targetServerId}. ` + sessionLogs,
      servers: servers.map(s => ({ ...s })),
      activeNode: `Server-${targetServerId}`,
      activeEdge: `LB-Server-${targetServerId}`,
      packet: { text: 'Session req', x: 230, y: sCoord.y },
      userSessions: { ...updatedSessions }
    });

    // 3. Shared Cache call in stateless
    if (targetMode === 'STATELESS') {
      trace.push({
        log: `Server ${targetServerId} fetches session state ('${userSessions[activeClient].data}') from central Shared Cache.`,
        servers: servers.map(s => ({ ...s })),
        activeNode: 'SharedCache',
        activeEdge: `Server-${targetServerId}-Cache`,
        packet: { text: 'Cache hit', x: 380, y: 100 },
        userSessions: { ...updatedSessions }
      });
    }

    // 4. Return to Client
    let updatedServers = servers.map(s => {
      if (s.id === targetServerId) {
        return { ...s, requestsServed: s.requestsServed + 1 };
      }
      return s;
    });

    trace.push({
      log: `Server ${targetServerId} completes request and returns HTTP 200 response.`,
      servers: updatedServers,
      activeNode: 'Client',
      activeEdge: 'Client-LB',
      packet: { text: '200 OK', x: 120, y: 100 },
      userSessions: { ...updatedSessions }
    });

    setServers(updatedServers);
    setUserSessions(updatedSessions);
    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleScaleUp = () => {
    if (servers.length >= 4) {
      alert('Maximum pool scale size of 4 servers reached for visual simulation.');
      return;
    }
    const nextId = servers.length + 1;
    const newServers = [...servers, { id: nextId, status: 'ONLINE', requestsServed: 0 }];
    setServers(newServers);
    setSteps([
      {
        log: `Scale Up: Server ${nextId} added to the pool. Traffic distribution capacity increased.`,
        servers: newServers,
        activeNode: null,
        activeEdge: null,
        packet: null,
        userSessions: { ...userSessions }
      }
    ]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleScaleDown = () => {
    if (servers.length <= 1) {
      alert('Cannot scale down below 1 server.');
      return;
    }
    const removed = servers[servers.length - 1];
    const newServers = servers.slice(0, -1);
    setServers(newServers);

    // If session sticky, clean up mapping of anyone who was on the removed server
    let updatedSessions = { ...userSessions };
    Object.keys(updatedSessions).forEach(user => {
      if (updatedSessions[user].serverId === removed.id) {
        updatedSessions[user].serverId = null;
      }
    });

    setUserSessions(updatedSessions);
    setSteps([
      {
        log: `Scale Down: Server ${removed.id} removed from the active pool.`,
        servers: newServers,
        activeNode: null,
        activeEdge: null,
        packet: null,
        userSessions: updatedSessions
      }
    ]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleToggleServerStatus = (id) => {
    const updated = servers.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE' };
      }
      return s;
    });
    setServers(updated);
    setSteps([
      {
        log: `Toggled Server ${id} status. Dynamic routing updates accordingly.`,
        servers: updated,
        activeNode: null,
        activeEdge: null,
        packet: null,
        userSessions: { ...userSessions }
      }
    ]);
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
    const initialS = [
      { id: 1, status: 'ONLINE', requestsServed: 0 },
      { id: 2, status: 'ONLINE', requestsServed: 0 }
    ];
    const initialU = {
      'User A': { serverId: null, data: 'Cart: 2 items' },
      'User B': { serverId: null, data: 'Cart: Empty' }
    };
    setServers(initialS);
    setUserSessions(initialU);
    setSteps([
      {
        log: 'Horizontal Scaling pool reset with 2 active servers.',
        servers: initialS,
        activeNode: null,
        activeEdge: null,
        packet: null,
        userSessions: initialU
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];
  const activeServers = activeStep.servers;

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Client:</span>
      <select
        value={activeClient}
        onChange={(e) => setActiveClient(e.target.value)}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        <option value="User A">User A (Items in Cart)</option>
        <option value="User B">User B (Empty Cart)</option>
      </select>

      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Session Architecture:</span>
      <select
        value={sessionMode}
        onChange={(e) => setSessionMode(e.target.value)}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        <option value="STATELESS">Stateless (Shared Cache DB)</option>
        <option value="STICKY">Stateful (Sticky Load Balancer IP-Hash)</option>
      </select>

      <button className="btn-viz-action btn-add" onClick={handleSendRequest}>
        Send Request
      </button>

      <button className="btn-viz-action" onClick={handleScaleUp}>
        Scale Out (+1 Server)
      </button>

      <button className="btn-viz-action btn-clear" onClick={handleScaleDown}>
        Scale In (-1 Server)
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Active Servers Status</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          {activeServers.map(s => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span>Server {s.id}: <strong style={{ color: s.status === 'ONLINE' ? '#10b981' : '#ef4444' }}>{s.status}</strong></span>
              <button
                style={{ fontSize: '0.6rem', padding: '0.05rem 0.2rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', color: '#FFFFFF', cursor: 'pointer' }}
                onClick={() => handleToggleServerStatus(s.id)}
              >
                Toggle Kill
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>User Sessions Info</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>User A: Mapped to Server <strong>{activeStep.userSessions['User A'].serverId || 'None'}</strong> ({activeStep.userSessions['User A'].data})</div>
          <div>User B: Mapped to Server <strong>{activeStep.userSessions['User B'].serverId || 'None'}</strong> ({activeStep.userSessions['User B'].data})</div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>Horizontal Scaling</strong> involves adding more physical machines/instances to your resource pool rather than upgrading hardware configuration of existing nodes:</p>
      <ul>
        <li><strong>Scale Out (Adding Nodes):</strong> Distributes compute loads, avoids single points of failure, and allows easy scale expansion by adding commodity servers.</li>
        <li><strong>Stateless Architecture:</strong> Server nodes do not store session data (e.g. login tokens, cart info) in local memory. Instead, they fetch states from a shared Redis cache or Database. This allows the Load Balancer to route requests to any healthy node.</li>
        <li><strong>Sticky Sessions (Stateful):</strong> The load balancer hashes the client IP/cookie to ensure the client always reaches the same server. If that server crashes, the client's session state is lost.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Horizontal Scaling as a **Supermarket Checkout system**:</p>
      <ul>
        <li><strong>Vertical Scaling:</strong> Hiring a super-cashier who works faster but gets overwhelmed when hundreds of customers show up. If they take a break, checkout freezes completely.</li>
        <li><strong>Horizontal Scaling:</strong> Opening more checkout lines with extra cashiers. Customers are distributed across lanes. If one cashier goes on break, customers simply use the other open lanes.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Stateful Local Storage:</strong> Storing files or session states in local server filesystems. If the load balancer forwards subsequent queries to another server instance, the user will experience session losses or missing profiles.</li>
      <li><strong>DB Bottleneck:</strong> Scaling application server nodes infinitely without scaling the backing database layer, shifting the performance bottleneck downstream.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What are the main advantages of stateless applications when scaling horizontally?',
      a: 'Stateless apps can route requests to any server node. This makes scaling out simple (just spin up new VMs/containers), permits easy automated scaling rules, and ensures that node crashes do not lose user session state.'
    },
    {
      q: 'How does Sticky Session routing work, and what are its drawbacks?',
      a: 'Sticky Session routing instructs the load balancer to map a user (via IP hash or session cookie) to one specific server. Drawbacks include uneven load distribution, sticky affinity issues during auto-scaling, and complete session loss if that specific server crashes.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Where should session data (like shopping carts) be stored in a stateless horizontally scaled system?',
      options: [
        'In the local memory of Server 1 only',
        'In a shared distributed caching layer (like Redis)',
        'Inside the Load Balancer internal routing logs',
        'Directly in DNS text records'
      ],
      correctIdx: 1,
      explanation: 'A shared cache database allows all scaled server nodes to retrieve user session details dynamically for any incoming request.'
    },
    {
      question: 'What is the effect of scaling out a stateless application pool when one server goes offline?',
      options: [
        'The entire system immediately crashes',
        'All client requests fail with HTTP 404 errors',
        'The Load Balancer redirects traffic to the remaining healthy servers without losing user states',
        'Replication must be triggered manually'
      ],
      correctIdx: 2,
      explanation: 'Because the application is stateless and servers retrieve session details from a shared cache, healthy nodes can seamlessly process redirected queries.'
    }
  ];

  return (
    <VisualizerShell
      title="Horizontal Scaling Simulator"
      subtitle="Witness request routing across a scaled server pool. Contrast stateless shared caching with stateful sticky load balancers."
      timeComplexity="O(1) request routing time"
      spaceComplexity="O(N) shared storage capacity"
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
          {/* Connector paths from Client to LB */}
          <line
            x1="50"
            y1="100"
            x2="150"
            y2="100"
            stroke={activeStep.activeEdge === 'Client-LB' ? '#1591DC' : 'var(--bg-tertiary)'}
            strokeWidth={activeStep.activeEdge === 'Client-LB' ? '2.5' : '1.5'}
          />

          {/* Load Balancer to Server pool paths */}
          {activeServers.map(s => {
            const serverCoords = { 1: 35, 2: 75, 3: 115, 4: 155 };
            const yTarget = serverCoords[s.id];
            return (
              <line
                key={s.id}
                x1="180"
                y1="100"
                x2="280"
                y2={yTarget.toString()}
                stroke={activeStep.activeEdge === `LB-Server-${s.id}` ? '#1591DC' : 'var(--bg-tertiary)'}
                strokeWidth={activeStep.activeEdge === `LB-Server-${s.id}` ? '2.5' : '1.5'}
                strokeDasharray={s.status === 'OFFLINE' ? '3' : '0'}
              />
            );
          })}

          {/* Servers to Shared Redis Cache paths (Only active in stateless mode) */}
          {sessionMode === 'STATELESS' && activeServers.map(s => {
            const serverCoords = { 1: 35, 2: 75, 3: 115, 4: 155 };
            const yTarget = serverCoords[s.id];
            return (
              <line
                key={s.id}
                x1="340"
                y1={yTarget.toString()}
                x2="400"
                y2="100"
                stroke={activeStep.activeEdge === `Server-${s.id}-Cache` ? '#10b981' : 'rgba(16, 185, 129, 0.2)'}
                strokeWidth={activeStep.activeEdge === `Server-${s.id}-Cache` ? '2' : '1'}
                strokeDasharray="2 2"
              />
            );
          })}

          {/* Clients representation */}
          <g>
            <circle cx="35" cy="70" r="14" fill={activeClient === 'User A' ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)'} stroke="var(--bg-tertiary)" strokeWidth="1.5" />
            <text x="35" y="73" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">User A</text>
            
            <circle cx="35" cy="130" r="14" fill={activeClient === 'User B' ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)'} stroke="var(--bg-tertiary)" strokeWidth="1.5" />
            <text x="35" y="133" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">User B</text>
          </g>

          {/* Load Balancer */}
          <g>
            <rect x="135" y="80" width="40" height="40" fill="var(--bg-secondary)" stroke="#1591DC" strokeWidth="2.5" rx="3" />
            <text x="155" y="100" textAnchor="middle" fill="#1591DC" fontSize="0.6rem" fontWeight="bold">LB</text>
            <text x="155" y="112" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.4rem">({sessionMode})</text>
          </g>

          {/* Servers Pool */}
          {activeServers.map(s => {
            const serverCoords = { 1: 20, 2: 60, 3: 100, 4: 140 };
            const yCoord = serverCoords[s.id];
            return (
              <g key={s.id}>
                <rect
                  x="280"
                  y={yCoord.toString()}
                  width="60"
                  height="30"
                  fill={s.status === 'OFFLINE' ? 'rgba(239,68,68,0.1)' : (activeStep.activeNode === `Server-${s.id}` ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)')}
                  stroke={s.status === 'OFFLINE' ? '#ef4444' : (activeStep.activeNode === `Server-${s.id}` ? '#1591DC' : 'var(--bg-tertiary)')}
                  strokeWidth="2"
                  rx="3"
                />
                <text x="310" y={(yCoord + 15).toString()} textAnchor="middle" fill="#FFFFFF" fontSize="0.52rem">Srv {s.id}</text>
                <text x="310" y={(yCoord + 25).toString()} textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.38rem">Served: {s.requestsServed}</text>
              </g>
            );
          })}

          {/* Shared Cache Node */}
          {sessionMode === 'STATELESS' && (
            <g>
              <rect
                x="400"
                y="80"
                width="45"
                height="40"
                fill={activeStep.activeNode === 'SharedCache' ? 'rgba(16,185,129,0.15)' : 'var(--bg-secondary)'}
                stroke="#10b981"
                strokeWidth="2"
                rx="4"
              />
              <text x="422" y="99" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Redis</text>
              <text x="422" y="110" textAnchor="middle" fill="#10b981" fontSize="0.4rem">Cache</text>
            </g>
          )}

          {/* Animated Packet */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.35s ease' }}>
              <circle cx={activeStep.packet.x} cy={activeStep.packet.y} r="8" fill="#f59e0b" />
              <text
                x={activeStep.packet.x}
                y={activeStep.packet.y + 2}
                textAnchor="middle"
                fill="#000000"
                style={{ fontSize: '0.45rem', fontWeight: 'bold' }}
              >
                •
              </text>
            </g>
          )}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--bg-secondary)', border: '1.5px solid var(--bg-tertiary)' }}></div> Server Instance
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1.5px solid #ef4444' }}></div> Offline Node
          </div>
          {sessionMode === 'STATELESS' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '10px', height: '10px', border: '1.5px solid #10b981' }}></div> Shared Redis Store
            </div>
          )}
        </div>

      </div>
    </VisualizerShell>
  );
}
