import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function MicroservicesVisualizer() {
  const [archMode, setArchMode] = useState('MICROSERVICES'); // 'MONOLITH' or 'MICROSERVICES'
  const [servicesStatus, setServicesStatus] = useState({
    users: 'ONLINE',
    orders: 'ONLINE',
    payments: 'ONLINE'
  });
  const [activeRequest, setActiveRequest] = useState('/users');

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const [steps, setSteps] = useState([
    {
      log: 'Microservices architecture ready. Try running user, order, or payment operations.',
      activeNode: null,
      activeEdge: null,
      packet: null,
      services: { users: 'ONLINE', orders: 'ONLINE', payments: 'ONLINE' }
    }
  ]);

  const handleSendRequest = () => {
    let trace = [];
    const path = activeRequest;
    const moduleName = path.substring(1); // 'users', 'orders', 'payments'

    if (archMode === 'MONOLITH') {
      const isMonolithDown = servicesStatus.users === 'CRASHED' || servicesStatus.orders === 'CRASHED' || servicesStatus.payments === 'CRASHED';

      trace.push({
        log: `Monolith: Client sends request to GET ${path}. App server attempts to process request within monolithic application process.`,
        activeNode: 'MonolithApp',
        activeEdge: 'Client-Monolith',
        packet: { text: `GET ${path}`, x: 80, y: 100 },
        services: { ...servicesStatus }
      });

      if (isMonolithDown) {
        trace.push({
          log: 'MONOLITH FAILURE: Since all services share the same server process and database, a crash in any module crashes the entire monolith. HTTP 500 Server Error.',
          activeNode: 'MonolithApp',
          activeEdge: null,
          packet: { text: '500 Server Error', x: 230, y: 100 },
          services: { ...servicesStatus }
        });
      } else {
        trace.push({
          log: `Monolith: Monolithic database resolves query. Returns success. HTTP 200 OK.`,
          activeNode: 'MonolithDB',
          activeEdge: 'Monolith-DB',
          packet: { text: '200 OK Response', x: 370, y: 100 },
          services: { ...servicesStatus }
        });
      }
    } else {
      // MICROSERVICES
      trace.push({
        log: `Microservices: Client sends request to GET ${path}. Central API Gateway intercepts request to perform auth check and path routing.`,
        activeNode: 'Gateway',
        activeEdge: 'Client-Gateway',
        packet: { text: `GET ${path}`, x: 60, y: 100 },
        services: { ...servicesStatus }
      });

      let targetY = 40;
      if (moduleName === 'orders') targetY = 100;
      if (moduleName === 'payments') targetY = 160;

      const isTargetDown = servicesStatus[moduleName] === 'CRASHED';

      if (isTargetDown) {
        trace.push({
          log: `API Gateway routes request to ${moduleName} service. Downstream service is offline. Returning HTTP 503 Service Unavailable.`,
          activeNode: 'Gateway',
          activeEdge: `Gateway-${moduleName}`,
          packet: { text: '503 Fail', x: 190, y: targetY },
          services: { ...servicesStatus }
        });

        trace.push({
          log: `Fault Isolation: Downstream service crash is contained. Other services remain fully operational!`,
          activeNode: 'Client',
          activeEdge: null,
          packet: null,
          services: { ...servicesStatus }
        });
      } else {
        trace.push({
          log: `API Gateway routes request to decoupled ${moduleName} service. Service queries its isolated database.`,
          activeNode: `Service-${moduleName}`,
          activeEdge: `Gateway-${moduleName}`,
          packet: { text: 'Query', x: 190, y: targetY },
          services: { ...servicesStatus }
        });

        trace.push({
          log: `${moduleName} service commits transactions and returns data payload to client via API Gateway. HTTP 200 OK.`,
          activeNode: 'Client',
          activeEdge: 'Gateway-Client',
          packet: { text: '200 OK JSON', x: 120, y: 100 },
          services: { ...servicesStatus }
        });
      }
    }

    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleToggleService = (srv) => {
    const updated = {
      ...servicesStatus,
      [srv]: servicesStatus[srv] === 'ONLINE' ? 'CRASHED' : 'ONLINE'
    };
    setServicesStatus(updated);

    const logStr = updated[srv] === 'CRASHED'
      ? `Crashed the ${srv} module/service. Check performance differences.`
      : `Recovered the ${srv} module/service.`;

    setSteps([
      {
        log: logStr,
        activeNode: null,
        activeEdge: null,
        packet: null,
        services: updated
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
    const initS = { users: 'ONLINE', orders: 'ONLINE', payments: 'ONLINE' };
    setServicesStatus(initS);
    setSteps([
      {
        log: 'Architectural environments reset.',
        activeNode: null,
        activeEdge: null,
        packet: null,
        services: initS
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];
  const activeServices = activeStep.services;

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Architecture:</span>
      <select
        value={archMode}
        onChange={(e) => {
          setArchMode(e.target.value);
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
        <option value="MICROSERVICES">Decoupled Microservices</option>
        <option value="MONOLITH">Monolithic Application</option>
      </select>

      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Query Endpoint:</span>
      <select
        value={activeRequest}
        onChange={(e) => setActiveRequest(e.target.value)}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        <option value="/users">GET /users (User Service)</option>
        <option value="/orders">POST /orders (Order Service)</option>
        <option value="/payments">GET /payments (Payment Service)</option>
      </select>

      <button className="btn-viz-action btn-add" onClick={handleSendRequest}>
        Send Request
      </button>

      <button className="btn-viz-action btn-clear" onClick={() => handleToggleService('payments')}>
        Crash/Recover Payments Module
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Deployment Analytics</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Database Pattern: <strong style={{ color: archMode === 'MICROSERVICES' ? '#10b981' : '#f59e0b' }}>
            {archMode === 'MICROSERVICES' ? 'Database-per-Service' : 'Shared Single Database'}
          </strong></div>
          <div>Complexity: <span>{archMode === 'MICROSERVICES' ? 'High (Network dependency)' : 'Low (Single process)'}</span></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Fault Containment status</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Users service: <strong style={{ color: activeServices.users === 'ONLINE' ? '#10b981' : '#ef4444' }}>{activeServices.users}</strong></div>
          <div>Payments service: <strong style={{ color: activeServices.payments === 'ONLINE' ? '#10b981' : '#ef4444' }}>{activeServices.payments}</strong></div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '0.15rem' }}>
            {archMode === 'MICROSERVICES' && activeServices.payments === 'CRASHED' ? 'Isolation Active: Users API is unaffected!' : 'Normal operational flow'}
          </div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>Microservices Architecture</strong> structures an application as a collection of loosely coupled, independently deployable services:</p>
      <ul>
        <li><strong>Monolith:</strong> A single process contains all modules. If one bug (like a memory leak in payments) crashes the thread process, the entire application shuts down (Single Point of Failure).</li>
        <li><strong>Microservices:</strong> Separate modules deploy on separate server instances with their own database (Database-per-Service). Communication occurs via REST, gRPC, or events.</li>
        <li><strong>Fault Isolation:</strong> If the payment service crashes, the checkout API fails, but users can still log in, browse catalogs, and view profile settings safely.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Monolith vs Microservices as **a Cruise Ship vs a Fleet of small boats**:</p>
      <ul>
        <li><strong>Monolith (Cruise Ship):</strong> Everything is built into one giant hull. It is simple to manage, but if the hull gets a large hole (crashes), the entire ship sinks.</li>
        <li><strong>Microservices (Fleet of Boats):</strong> Passengers travel in separate boats. If one boat gets a hole and sinks (crashed payment service), the passengers in that boat are affected, but the other 20 boats continue sailing successfully.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Distributed Monolith:</strong> Building microservices that share a single backend SQL database, coupling services together and losing fault isolation.</li>
      <li><strong>Missing Gateways:</strong> Forcing client applications to query 15 separate microservice IPs directly, creating heavy client coupling.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is the "Database-per-Service" pattern and why is it important in microservices?',
      a: 'It requires each microservice to own its private database, allowing independent schema updates, isolating database crashes to exactly one service, and preventing tight coupling across development teams.'
    },
    {
      q: 'Detail the concept of "Fault Isolation" in distributed systems.',
      a: 'Fault Isolation is the design principle that prevents a crash in one system component from propagating and crashing other components. In microservices, this is achieved by running services in independent processes with dedicated databases.'
    }
  ];

  const quizQuestions = [
    {
      question: 'What happens in a monolithic architecture when a memory leak crashes the Payment module?',
      options: [
        'Only the payment module goes offline',
        'The entire monolithic application process crashes, knocking all features offline',
        'The load balancer splits the traffic',
        'The database automatically restarts'
      ],
      correctIdx: 1,
      explanation: 'Because a monolith runs inside a single process, a crash in any module halts the execution of all other modules.'
    },
    {
      question: 'Which pattern ensures that microservices do not tightly couple at the database layer?',
      options: [
        'Shared database pooling',
        'Database-per-Service pattern',
        'Consistent Hashing',
        'Active-passive replication'
      ],
      correctIdx: 1,
      explanation: 'Database-per-Service ensures services only access their own private databases, communicating via APIs or events to sync data.'
    }
  ];

  return (
    <VisualizerShell
      title="Microservices vs Monolith"
      subtitle="Contrast monolithic failure states with decoupled microservice fault isolation and gateway routing."
      timeComplexity="O(N) network hops"
      spaceComplexity="O(S) service memory pools"
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
        
        {archMode === 'MONOLITH' ? (
          <svg width="450" height="180" style={{ overflow: 'visible' }}>
            {/* Monolith SVG layout */}
            <line x1="50" y1="90" x2="180" y2="90" stroke={activeStep.activeEdge === 'Client-Monolith' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth="2" />
            <line x1="280" y1="90" x2="380" y2="90" stroke={activeStep.activeEdge === 'Monolith-DB' ? '#10b981' : 'var(--bg-tertiary)'} strokeWidth="1.5" />

            {/* Client */}
            <g>
              <circle cx="35" cy="90" r="16" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" />
              <text x="35" y="93" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Client</text>
            </g>

            {/* Monolithic app block */}
            <g>
              <rect
                x="180"
                y="40"
                width="100"
                height="100"
                fill={activeStep.services.payments === 'CRASHED' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-secondary)'}
                stroke={activeStep.services.payments === 'CRASHED' ? '#ef4444' : '#1591DC'}
                strokeWidth="2.5"
                rx="4"
              />
              <text x="230" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Monolith App</text>
              <text x="230" y="75" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.45rem">Users Module</text>
              <text x="230" y="90" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.45rem">Orders Module</text>
              <text x="230" y="105" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.45rem">Payments Module</text>
              <text x="230" y="125" textAnchor="middle" fill={activeStep.services.payments === 'CRASHED' ? '#ef4444' : '#10b981'} fontSize="0.45rem">
                {activeStep.services.payments === 'CRASHED' ? 'CRASHED' : 'PROCESS OK'}
              </text>
            </g>

            {/* Monolithic Database */}
            <g>
              <rect x="380" y="70" width="60" height="40" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" rx="3" />
              <text x="410" y="94" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Shared DB</text>
            </g>

            {/* Animated Packet */}
            {activeStep.packet && (
              <g style={{ transition: 'all 0.35s ease' }}>
                <rect x={activeStep.packet.x - 28} y={activeStep.packet.y - 10} width="56" height="15" fill="var(--bg-primary)" stroke="#f59e0b" strokeWidth="1.2" rx="2" />
                <text x={activeStep.packet.x} y={activeStep.packet.y + 1} textAnchor="middle" fill="#f59e0b" fontSize="0.38rem" fontWeight="bold">
                  {activeStep.packet.text}
                </text>
              </g>
            )}
          </svg>
        ) : (
          <svg width="450" height="200" style={{ overflow: 'visible' }}>
            {/* Microservices SVG layout */}
            <line x1="50" y1="100" x2="120" y2="100" stroke={activeStep.activeEdge === 'Client-Gateway' || activeStep.activeEdge === 'Gateway-Client' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
            
            {/* Gateway to Service lines */}
            <line x1="180" y1="100" x2="280" y2="40" stroke={activeStep.activeEdge === 'Gateway-users' ? '#10b981' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
            <line x1="180" y1="100" x2="280" y2="100" stroke={activeStep.activeEdge === 'Gateway-orders' ? '#10b981' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
            <line x1="180" y1="100" x2="280" y2="160" stroke={activeStep.activeEdge === 'Gateway-payments' ? '#10b981' : 'var(--bg-tertiary)'} strokeWidth="1.5" />

            {/* Client */}
            <g>
              <circle cx="35" cy="100" r="16" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" />
              <text x="35" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Client</text>
            </g>

            {/* Gateway */}
            <g>
              <rect x="120" y="80" width="60" height="40" fill="var(--bg-secondary)" stroke="#1591DC" strokeWidth="2.5" rx="3" />
              <text x="150" y="100" textAnchor="middle" fill="#1591DC" fontSize="0.55rem" fontWeight="bold">Gateway</text>
            </g>

            {/* Users Service */}
            <g>
              <rect x="280" y="25" width="70" height="30" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" rx="3" />
              <text x="315" y="43" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Users Svc</text>
            </g>

            {/* Orders Service */}
            <g>
              <rect x="280" y="85" width="70" height="30" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" rx="3" />
              <text x="315" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Orders Svc</text>
            </g>

            {/* Payments Service */}
            <g>
              <rect
                x="280"
                y="145"
                width="70"
                height="30"
                fill={activeStep.services.payments === 'CRASHED' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-secondary)'}
                stroke={activeStep.services.payments === 'CRASHED' ? '#ef4444' : 'var(--bg-tertiary)'}
                strokeWidth="2"
                rx="3"
              />
              <text x="315" y="163" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Pay Svc</text>
            </g>

            {/* DB per Service references */}
            <circle cx="395" cy="40" r="10" fill="var(--bg-secondary)" stroke="#10b981" />
            <text x="395" y="43" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.38rem">DB</text>
            <line x1="350" y1="40" x2="385" y2="40" stroke="var(--bg-tertiary)" />

            <circle cx="395" cy="100" r="10" fill="var(--bg-secondary)" stroke="#10b981" />
            <text x="395" y="103" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.38rem">DB</text>
            <line x1="350" y1="100" x2="385" y2="100" stroke="var(--bg-tertiary)" />

            <circle cx="395" cy="160" r="10" fill="var(--bg-secondary)" stroke="#10b981" />
            <text x="395" y="163" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.38rem">DB</text>
            <line x1="350" y1="160" x2="385" y2="160" stroke="var(--bg-tertiary)" />

            {/* Animated Packet */}
            {activeStep.packet && (
              <g style={{ transition: 'all 0.35s ease' }}>
                <rect x={activeStep.packet.x - 28} y={activeStep.packet.y - 10} width="56" height="15" fill="var(--bg-primary)" stroke="#f59e0b" strokeWidth="1.2" rx="2" />
                <text x={activeStep.packet.x} y={activeStep.packet.y + 1} textAnchor="middle" fill="#f59e0b" fontSize="0.35rem" fontWeight="bold">
                  {activeStep.packet.text}
                </text>
              </g>
            )}
          </svg>
        )}

      </div>
    </VisualizerShell>
  );
}
