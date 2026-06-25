import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function ServiceDiscoveryVisualizer() {
  const [discoveryType, setDiscoveryType] = useState('CLIENT_SIDE'); // 'CLIENT_SIDE' or 'SERVER_SIDE'
  const [registry, setRegistry] = useState([
    { id: 'usr-1', name: 'User Service', ip: '10.0.1.15', status: 'HEALTHY', heartbeatAge: 0 },
    { id: 'ord-1', name: 'Order Service', ip: '10.0.2.80', status: 'HEALTHY', heartbeatAge: 0 },
    { id: 'ord-2', name: 'Order Service', ip: '10.0.2.81', status: 'HEALTHY', heartbeatAge: 0 }
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const [steps, setSteps] = useState([
    {
      log: 'Service Registry (Consul/Eureka) running. All services registered.',
      currentRegistry: [
        { id: 'usr-1', name: 'User Service', ip: '10.0.1.15', status: 'HEALTHY' },
        { id: 'ord-1', name: 'Order Service', ip: '10.0.2.80', status: 'HEALTHY' },
        { id: 'ord-2', name: 'Order Service', ip: '10.0.2.81', status: 'HEALTHY' }
      ],
      activeNode: null,
      activeEdge: null,
      packet: null
    }
  ]);

  const handleRouteRequest = () => {
    let trace = [];
    const currentRegistry = [...registry];
    const liveOrders = currentRegistry.filter(r => r.name === 'Order Service' && r.status === 'HEALTHY');

    if (liveOrders.length === 0) {
      trace.push({
        log: 'No healthy instances found for Order Service in the registry. Routing fails with 503 Service Unavailable.',
        currentRegistry,
        activeNode: 'Registry',
        activeEdge: null,
        packet: null
      });
      setSteps(trace);
      setCurrentStep(0);
      return;
    }

    const selectedInstance = liveOrders[0]; // Choose first healthy

    if (discoveryType === 'CLIENT_SIDE') {
      // Client-Side: Client queries registry -> Registry returns IPs -> Client calls instance directly
      trace.push({
        log: 'Client-Side: Client queries Service Registry for "Order Service" addresses.',
        currentRegistry,
        activeNode: 'Registry',
        activeEdge: 'Client-Registry',
        packet: { text: 'GET IPs order-service', x: 100, y: 100 }
      });

      trace.push({
        log: `Service Registry returns list: [${liveOrders.map(o => o.ip).join(', ')}].`,
        currentRegistry,
        activeNode: 'Client',
        activeEdge: 'Registry-Client',
        packet: { text: `${selectedInstance.ip}`, x: 100, y: 100 }
      });

      trace.push({
        log: `Client load-balances and sends request directly to Order Service instance at ${selectedInstance.ip}.`,
        currentRegistry,
        activeNode: selectedInstance.id,
        activeEdge: `Client-${selectedInstance.id}`,
        packet: { text: 'POST /orders', x: 230, y: selectedInstance.id === 'ord-1' ? 40 : 160 }
      });
    } else {
      // Server-Side: Client calls Gateway -> Gateway queries registry -> Gateway forwards
      trace.push({
        log: 'Server-Side: Client routes request to the API Gateway/Load Balancer.',
        currentRegistry,
        activeNode: 'Gateway',
        activeEdge: 'Client-Gateway',
        packet: { text: 'POST /orders', x: 80, y: 100 }
      });

      trace.push({
        log: 'API Gateway queries Service Registry internally to discover Order Service IPs.',
        currentRegistry,
        activeNode: 'Registry',
        activeEdge: 'Gateway-Registry',
        packet: { text: 'Find order-service', x: 190, y: 70 }
      });

      trace.push({
        log: `API Gateway receives instances and forwards request to Order Service at ${selectedInstance.ip}.`,
        currentRegistry,
        activeNode: selectedInstance.id,
        activeEdge: `Gateway-${selectedInstance.id}`,
        packet: { text: 'Forward /orders', x: 280, y: selectedInstance.id === 'ord-1' ? 40 : 160 }
      });
    }

    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleAddInstance = () => {
    const newId = `ord-${registry.length + 1}`;
    const newIp = `10.0.2.8${registry.length}`;
    const updated = [
      ...registry,
      { id: newId, name: 'Order Service', ip: newIp, status: 'HEALTHY', heartbeatAge: 0 }
    ];
    setRegistry(updated);
    setSteps([
      {
        log: `New Order Service instance registered dynamically at IP: ${newIp}.`,
        currentRegistry: updated,
        activeNode: null,
        activeEdge: null,
        packet: null
      }
    ]);
    setCurrentStep(0);
  };

  const handleToggleHeartbeat = (id) => {
    const updated = registry.map(inst => {
      if (inst.id === id) {
        return {
          ...inst,
          status: inst.status === 'HEALTHY' ? 'CRASHED' : 'HEALTHY'
        };
      }
      return inst;
    });

    setRegistry(updated);
    const inst = updated.find(i => i.id === id);
    const logStr = inst.status === 'CRASHED'
      ? `${inst.name} (${inst.ip}) stopped heartbeating. Registry marks instance as UNHEALTHY.`
      : `${inst.name} (${inst.ip}) recovered heartbeat. Instance is registered as HEALTHY.`;

    setSteps([
      {
        log: logStr,
        currentRegistry: updated,
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
    const initial = [
      { id: 'usr-1', name: 'User Service', ip: '10.0.1.15', status: 'HEALTHY', heartbeatAge: 0 },
      { id: 'ord-1', name: 'Order Service', ip: '10.0.2.80', status: 'HEALTHY', heartbeatAge: 0 },
      { id: 'ord-2', name: 'Order Service', ip: '10.0.2.81', status: 'HEALTHY', heartbeatAge: 0 }
    ];
    setRegistry(initial);
    setSteps([
      {
        log: 'Service Discovery environment reset.',
        currentRegistry: initial,
        activeNode: null,
        activeEdge: null,
        packet: null
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];
  const activeReg = activeStep.currentRegistry || registry;

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Discovery Mode:</span>
      <select
        value={discoveryType}
        onChange={(e) => {
          setDiscoveryType(e.target.value);
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
        <option value="CLIENT_SIDE">Client-Side Discovery</option>
        <option value="SERVER_SIDE">Server-Side Discovery (Gateway Proxy)</option>
      </select>

      <button className="btn-viz-action btn-add" onClick={handleRouteRequest}>
        Send Request
      </button>

      <button className="btn-viz-action btn-add" onClick={handleAddInstance}>
        Spawn Order Instance
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Service Registry Database</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          {activeReg.map(inst => (
            <div key={inst.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
              <span>{inst.name} ({inst.ip})</span>
              <span
                onClick={() => handleToggleHeartbeat(inst.id)}
                style={{
                  color: inst.status === 'HEALTHY' ? '#10b981' : '#ef4444',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {inst.status} (toggle)
              </span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Architecture Insights</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          <div>Router: <strong>{discoveryType === 'CLIENT_SIDE' ? 'Client App' : 'API Gateway / LB'}</strong></div>
          <div>Registry Pattern: <span>Heartbeat TTL / consul</span></div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
            {discoveryType === 'CLIENT_SIDE' 
              ? 'Client queries registry once, caches result, and load balances internally.'
              : 'Client has no knowledge of service locations; Gateway performs internal checks.'
            }
          </div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>In microservice architectures, service instances scale dynamically with varying IP addresses. <strong>Service Discovery</strong> automates registration and tracking:</p>
      <ul>
        <li><strong>Service Registry:</strong> A highly available database (e.g. Eureka, Consul, ZooKeeper) containing the IPs of all active service instances.</li>
        <li><strong>Dynamic Registration:</strong> When an instance spawns, it posts its IP to the registry. While running, it sends periodic **heartbeats**. If heartbeats stop, the registry removes it.</li>
        <li><strong>Client-Side Discovery:</strong> The client queries the registry for healthy instances, performs load balancing, and talks to services directly.</li>
        <li><strong>Server-Side Discovery:</strong> The client talks to a central Gateway/Load Balancer, which queries the registry internally and proxies/forwards the request.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Service Discovery as **an Airport Rideshare Registry**:</p>
      <ul>
        <li><strong>Drivers (Services):</strong> Arrive at the airport and check into the driver pool app (Registry). They broadcast that they are ready and healthy.</li>
        <li><strong>App Registry:</strong> Tracks which drivers are online, what their license plate (IP) is, and checks their GPS (heartbeats).</li>
        <li><strong>Client-Side Discovery:</strong> You open your passenger app (client), see the list of cars nearby, choose one, and walk directly to it.</li>
        <li><strong>Server-Side Discovery:</strong> You go to a central dispatch lane (Gateway). The dispatcher checks the registry app, fetches a taxi, and routes you to it.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>No Caching on Client Side:</strong> Querying the registry on every single API call during client-side discovery. This creates a severe choke point. Cache the registry list locally and refresh it asynchronously or via WebSockets.</li>
      <li><strong>Missing Health checks:</strong> Registering instances but never checking their heartbeats. Downstream calls will fail repeatedly because of dead IP addresses in the database.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Contrast client-side discovery with server-side discovery.',
      a: 'In client-side discovery, the client directly queries the service registry, handles load-balancing, and issues network calls to instances. In server-side discovery, the client targets a load-balancer/API Gateway which handles the registry queries, load balancing, and request routing behind the scenes.'
    },
    {
      q: 'How does Eureka or Consul know when an instance crashes?',
      a: 'Each service instance sends a small network request (heartbeat) to the registry at regular intervals (e.g., every 30 seconds). If the registry misses several consecutive heartbeats, it declares the instance dead and de-registers its IP.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which component holds the active directory of dynamic IPs in microservices?',
      options: [
        'Load Balancer Cache',
        'Service Registry',
        'Redis Session Storage',
        'Database Primary Node'
      ],
      correctIdx: 1,
      explanation: 'The Service Registry maintains the active network map of all healthy, running microservice instances.'
    },
    {
      question: 'What is the purpose of a heartbeat in service discovery?',
      options: [
        'To speed up CPU clock cycles',
        'To cryptographically sign JWT tokens',
        'To signal health to the Service Registry, preventing premature de-registration',
        'To count incoming HTTP requests'
      ],
      correctIdx: 2,
      explanation: 'Heartbeats are periodic pings sent by microservices to prove they are healthy and running. If a heartbeat is missed, the registry de-lists the IP.'
    }
  ];

  return (
    <VisualizerShell
      title="Service Discovery"
      subtitle="Observe how microservice instances dynamically register IPs, execute heartbeat checks, and get queried by Clients or Gateways."
      timeComplexity="O(1) registry check"
      spaceComplexity="O(N) instance records"
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
          {/* Client queries */}
          <line
            x1="50"
            y1="100"
            x2="150"
            y2="40"
            stroke={activeStep.activeEdge === 'Client-Registry' || activeStep.activeEdge === 'Registry-Client' ? '#f59e0b' : 'var(--bg-tertiary)'}
            strokeWidth="1.5"
            strokeDasharray={activeStep.activeEdge === 'Client-Registry' || activeStep.activeEdge === 'Registry-Client' ? 'none' : '2,2'}
          />

          <line x1="50" y1="100" x2="130" y2="100" stroke={activeStep.activeEdge === 'Client-Gateway' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
          
          {/* Gateway queries Registry */}
          <line
            x1="160"
            y1="100"
            x2="180"
            y2="40"
            stroke={activeStep.activeEdge === 'Gateway-Registry' ? '#f59e0b' : 'var(--bg-tertiary)'}
            strokeWidth="1.5"
          />

          {/* Client/Gateway routes to services */}
          {activeReg.map(inst => {
            if (inst.name === 'User Service') return null;
            const y = inst.id === 'ord-1' ? 45 : 155;
            const isTargeted = activeStep.activeEdge === `Client-${inst.id}` || activeStep.activeEdge === `Gateway-${inst.id}`;
            return (
              <line
                key={`line-${inst.id}`}
                x1={discoveryType === 'CLIENT_SIDE' ? '50' : '190'}
                y1={discoveryType === 'CLIENT_SIDE' ? '100' : '100'}
                x2="330"
                y2={y}
                stroke={isTargeted ? '#10b981' : 'var(--bg-tertiary)'}
                strokeWidth="1.5"
              />
            );
          })}

          {/* Client Node */}
          <g>
            <circle cx="35" cy="100" r="16" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="35" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Client</text>
          </g>

          {/* Service Registry (Eureka/Consul) */}
          <g>
            <rect x="150" y="10" width="70" height="40" fill="var(--bg-secondary)" stroke="#f59e0b" strokeWidth="2.5" rx="3" />
            <text x="185" y="27" textAnchor="middle" fill="#f59e0b" fontSize="0.52rem" fontWeight="bold">Registry</text>
            <text x="185" y="38" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.38rem">(Eureka)</text>
          </g>

          {/* Gateway Node (Server-side only) */}
          {discoveryType === 'SERVER_SIDE' && (
            <g>
              <rect x="130" y="85" width="60" height="30" fill="var(--bg-secondary)" stroke="#1591DC" strokeWidth="2" rx="3" />
              <text x="160" y="103" textAnchor="middle" fill="#1591DC" fontSize="0.5rem" fontWeight="bold">Gateway</text>
            </g>
          )}

          {/* Microservice Instances */}
          {activeReg.map(inst => {
            const y = inst.name === 'User Service' ? 100 : (inst.id === 'ord-1' ? 45 : 155);
            return (
              <g key={inst.id}>
                <rect
                  x="330"
                  y={y - 18}
                  width="95"
                  height="36"
                  fill={inst.status === 'CRASHED' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-secondary)'}
                  stroke={inst.status === 'CRASHED' ? '#ef4444' : 'var(--bg-tertiary)'}
                  strokeWidth="2"
                  rx="3"
                />
                <text x="377" y={y - 6} textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem" fontWeight="bold">{inst.name}</text>
                <text x="377" y={y + 4} textAnchor="middle" fill="var(--text-secondary)" fontSize="0.35rem">IP: {inst.ip}</text>
                <text x="377" y={y + 12} textAnchor="middle" fill={inst.status === 'HEALTHY' ? '#10b981' : '#ef4444'} fontSize="0.35rem">
                  {inst.status === 'HEALTHY' ? '● HEALTHY' : '✕ NO HEARTBEAT'}
                </text>
              </g>
            );
          })}

          {/* Animated Packet */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.35s ease' }}>
              <rect x={activeStep.packet.x - 30} y={activeStep.packet.y - 8} width="60" height="13" fill="var(--bg-primary)" stroke="#f59e0b" strokeWidth="1.2" rx="2" />
              <text x={activeStep.packet.x} y={activeStep.packet.y + 1} textAnchor="middle" fill="#f59e0b" fontSize="0.32rem" fontWeight="bold">
                {activeStep.packet.text}
              </text>
            </g>
          )}
        </svg>
      </div>
    </VisualizerShell>
  );
}
