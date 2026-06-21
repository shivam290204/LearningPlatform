import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function ClientServerVisualizer() {
  const [urlInput, setUrlInput] = useState('noobsyte.com/api/profile');
  const [requestType, setRequestType] = useState('profile'); // 'profile', 'courses', 'settings'
  
  // Playback state
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [steps, setSteps] = useState([
    {
      log: 'Type a URL or select a request and click Send Request.',
      activeNode: null,
      activeEdge: null,
      stateLabel: 'IDLE',
      packet: null
    }
  ]);

  const generateSteps = () => {
    let trace = [];
    const targetUrl = urlInput.trim();

    trace.push({
      log: `Client initiates request for URL "${targetUrl}". Initiating DNS Lookup to resolve Domain to IP...`,
      activeNode: 'Browser',
      activeEdge: null,
      stateLabel: 'DNS_LOOKUP',
      packet: { text: 'DNS Req', x: 75, y: 70 }
    });

    trace.push({
      log: `DNS Resolver resolved "noobsyte.com" to IP address 104.244.42.1. Returning IP to Browser.`,
      activeNode: 'DNS',
      activeEdge: 'Browser-DNS',
      stateLabel: 'DNS_RESOLVED',
      packet: { text: 'IP: 104.244...', x: 125, y: 35 }
    });

    trace.push({
      log: `Browser sends HTTP GET request to resolved IP. Request hits the Load Balancer first.`,
      activeNode: 'LoadBalancer',
      activeEdge: 'Browser-LB',
      stateLabel: 'LB_ROUTING',
      packet: { text: 'HTTP GET', x: 160, y: 70 }
    });

    trace.push({
      log: `Load Balancer routes the request to Web Server 1 based on Least Connections.`,
      activeNode: 'WebServer',
      activeEdge: 'LB-Server',
      stateLabel: 'SERVER_PROCESSING',
      packet: { text: 'Route -> Srv1', x: 260, y: 70 }
    });

    trace.push({
      log: `Web Server intercepts the route and queries Database for ${requestType.toUpperCase()} record.`,
      activeNode: 'Database',
      activeEdge: 'Server-DB',
      stateLabel: 'DB_QUERY',
      packet: { text: 'SQL Read', x: 360, y: 70 }
    });

    trace.push({
      log: `Database resolves query and returns JSON record payload to Web Server.`,
      activeNode: 'WebServer',
      activeEdge: 'Server-DB',
      stateLabel: 'DB_RESPONDED',
      packet: { text: 'Data Row', x: 360, y: 70 }
    });

    trace.push({
      log: `Web Server serializes data and returns HTTP 200 OK JSON response to Load Balancer.`,
      activeNode: 'LoadBalancer',
      activeEdge: 'LB-Server',
      stateLabel: 'RESPONDING',
      packet: { text: '200 OK', x: 260, y: 70 }
    });

    trace.push({
      log: `Load Balancer forwards HTTP Response packet back to Client Browser.`,
      activeNode: 'Browser',
      activeEdge: 'Browser-LB',
      stateLabel: 'COMPLETED',
      packet: { text: 'Render JSON', x: 160, y: 70 }
    });

    setSteps(trace);
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
    setSteps([
      {
        log: 'Type a URL or select a request and click Send Request.',
        activeNode: null,
        activeEdge: null,
        stateLabel: 'IDLE',
        packet: null
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <input
        type="text"
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        style={{
          width: '200px',
          padding: '0.45rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      />
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Resource:</span>
      <select
        value={requestType}
        onChange={(e) => {
          setRequestType(e.target.value);
          setUrlInput(`noobsyte.com/api/${e.target.value}`);
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
        <option value="profile">User Profile</option>
        <option value="courses">Courses List</option>
        <option value="settings">Account Settings</option>
      </select>
      <button className="btn-viz-action btn-add" onClick={generateSteps}>
        Send Request
      </button>
      <button className="btn-viz-action btn-clear" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
      <div>Active Phase: <strong style={{ color: '#FFFFFF', fontFamily: 'monospace' }}>{activeStep.stateLabel}</strong></div>
      <div>Current Node: <span style={{ color: 'var(--brand-cyan)' }}>{activeStep.activeNode || 'None'}</span></div>
      <div>Request Payload Type: <span style={{ color: '#10b981' }}>{requestType.toUpperCase()}</span></div>
    </div>
  );

  const theory = (
    <div>
      <p>The <strong>Client-Server Architecture</strong> is a distributed application structure that partitions tasks or workloads between resource providers (Servers) and resource requesters (Clients):</p>
      <ul>
        <li><strong>Client (Browser):</strong> Initiates requests, manages user sessions, and renders HTML/CSS/JS payloads into visual interfaces.</li>
        <li><strong>DNS Resolver:</strong> The phonebook of the Internet. Resolves human-readable domain names (e.g. <code>noobsyte.com</code>) to physical IP addresses.</li>
        <li><strong>Load Balancer:</strong> Distributes incoming client traffic across multiple servers to prevent overload and ensure high availability.</li>
        <li><strong>Web Server:</strong> Process controller layer that authenticates sessions, parses API routes, runs business logic, and prepares data.</li>
        <li><strong>Database (DB):</strong> Persistence layer storing tables, collections, or key-value document records securely.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Client-Server Architecture as a **Restaurant Dining Experience**:</p>
      <ul>
        <li><strong>Client:</strong> The customer sitting at the table making food orders from the menu.</li>
        <li><strong>Web Server (Waiter):</strong> Takes the order, validates if items are available, delivers instructions to the kitchen, and returns the food.</li>
        <li><strong>Database (Kitchen/Pantry):</strong> Where all ingredients are kept, organized, and prepared.</li>
        <li><strong>DNS (Hostess):</strong> Welcomes you at the door and tells you which table number (IP) is yours!</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Monolithic Single Point of Failure:</strong> Hosting Server and Database on a single physical machine without DNS backups or replicas.</li>
      <li><strong>Synchronous Blocking I/O:</strong> Forcing servers to block thread loops while waiting on database disk reads, killing performance under scale.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What are the main components involved when you type a URL into a browser and press Enter?',
      a: 'The browser queries local cache, then recursive DNS servers to resolve the domain to an IP. A TCP connection is established via a 3-way handshake. The browser sends an HTTP request, which passes through Load Balancers, reaches the Web Server, executes database queries, and returns an HTTP response containing assets to render.'
    },
    {
      q: 'What is the difference between Stateful and Stateless Client-Server architectures?',
      a: 'In a stateful architecture, the server retains session states (e.g. client profile in local memory), requiring clients to stick to the same server. In a stateless architecture (like REST), every request contains all necessary auth parameters, allowing any server node to resolve it.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which component is responsible for translating domain names into IP addresses?',
      options: [
        'Load Balancer',
        'Domain Name System (DNS)',
        'API Gateway',
        'Database Router'
      ],
      correctIdx: 1,
      explanation: 'DNS matches domain names like google.com to numerical IP addresses so browsers can fetch network resources.'
    },
    {
      question: 'What is the primary objective of a Load Balancer in client-server networks?',
      options: [
        'Store static media files close to the user',
        'Translate SQL queries into MongoDB formats',
        'Distribute incoming network traffic across multiple servers',
        'Encrypt password fields'
      ],
      correctIdx: 2,
      explanation: 'Load Balancers optimize resource usage, maximize throughput, minimize response time, and avoid single-point bottlenecks by sharing requests among servers.'
    }
  ];

  // Node placements for diagram
  const nodes = {
    Browser: { x: 50, y: 70, label: 'Browser' },
    DNS: { x: 130, y: 15, label: 'DNS Server' },
    LoadBalancer: { x: 180, y: 70, label: 'Load Balancer' },
    WebServer: { x: 290, y: 70, label: 'Web Server' },
    Database: { x: 380, y: 70, label: 'Database' }
  };

  return (
    <VisualizerShell
      title="Client-Server Architecture Simulator"
      subtitle="Trace the DNA of a web request from Browser through DNS, Load Balancer, and Database."
      timeComplexity="O(N) network hops"
      spaceComplexity="O(1) connection state"
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%', minHeight: '180px', padding: '1rem 0' }}>
        
        <svg width="420" height="150" style={{ overflow: 'visible' }}>
          {/* Edge lines */}
          <line x1="50" y1="70" x2="130" y2="15" stroke={activeStep.activeEdge === 'Browser-DNS' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth={activeStep.activeEdge === 'Browser-DNS' ? '2.5' : '1.5'} />
          <line x1="50" y1="70" x2="180" y2="70" stroke={activeStep.activeEdge === 'Browser-LB' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth={activeStep.activeEdge === 'Browser-LB' ? '2.5' : '1.5'} />
          <line x1="180" y1="70" x2="290" y2="70" stroke={activeStep.activeEdge === 'LB-Server' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth={activeStep.activeEdge === 'LB-Server' ? '2.5' : '1.5'} />
          <line x1="290" y1="70" x2="380" y2="70" stroke={activeStep.activeEdge === 'Server-DB' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth={activeStep.activeEdge === 'Server-DB' ? '2.5' : '1.5'} />

          {/* Render Nodes */}
          {Object.keys(nodes).map(key => {
            const coords = nodes[key];
            const isActive = activeStep.activeNode === key;
            
            let bg = 'var(--bg-secondary)';
            let stroke = 'var(--bg-tertiary)';
            let color = '#FFFFFF';

            if (isActive) {
              bg = 'rgba(21, 145, 220, 0.15)';
              stroke = '#1591DC';
              color = '#1591DC';
            }

            return (
              <g key={key}>
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="13"
                  fill={bg}
                  stroke={stroke}
                  strokeWidth="2.5"
                  style={{ transition: 'all 0.2s' }}
                />
                <text
                  x={coords.x}
                  y={coords.y + 25}
                  textAnchor="middle"
                  fill={color}
                  style={{ fontSize: '0.6rem', fontWeight: 'bold' }}
                >
                  {coords.label}
                </text>
              </g>
            );
          })}

          {/* Render Animated Packet */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.3s' }}>
              <rect
                x={activeStep.packet.x - 30}
                y={activeStep.packet.y - 12}
                width="60"
                height="16"
                fill="var(--bg-primary)"
                stroke="#f59e0b"
                strokeWidth="1"
                rx="2"
              />
              <text
                x={activeStep.packet.x}
                y={activeStep.packet.y}
                textAnchor="middle"
                fill="#f59e0b"
                style={{ fontSize: '0.52rem', fontWeight: 'bold', fontFamily: 'monospace' }}
              >
                {activeStep.packet.text}
              </text>
            </g>
          )}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '1.5px solid #1591DC', backgroundColor: 'rgba(21, 145, 220, 0.15)' }}></div> Active Phase
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '15px', height: '8px', border: '1px solid #f59e0b', backgroundColor: 'var(--bg-primary)' }}></div> Network Packet
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
