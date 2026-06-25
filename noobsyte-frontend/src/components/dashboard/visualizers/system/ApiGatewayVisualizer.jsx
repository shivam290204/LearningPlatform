import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function ApiGatewayVisualizer() {
  const [route, setRoute] = useState('/users/profile');
  const [tokenState, setTokenState] = useState('VALID'); // 'VALID', 'INVALID', 'MISSING'
  const [rateLimitCounter, setRateLimitCounter] = useState(3); // Start with 3 tokens out of 3
  const [logs, setLogs] = useState(['Select options and click Send Request.']);
  
  // Playback states
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  
  const [steps, setSteps] = useState([
    {
      log: 'API Gateway ready. Send a request to see authentication, rate limiting, and routing checks.',
      activeNode: null,
      activeEdge: null,
      packet: null,
      tokens: 3,
      phase: 'IDLE'
    }
  ]);

  const handleSendRequest = () => {
    let trace = [];
    let currentTokens = rateLimitCounter;

    // 1. Client initiates request
    trace.push({
      log: `Client issues HTTP request: GET ${route} (Token: ${tokenState}). Sending to API Gateway.`,
      activeNode: 'Client',
      activeEdge: null,
      packet: { text: `GET ${route.split('/')[1]}`, x: 40, y: 100 },
      tokens: currentTokens,
      phase: 'CLIENT_REQUEST'
    });

    // 2. Gateway Interceptor
    trace.push({
      log: 'Gateway receives packet. Commencing pre-routing filter execution...',
      activeNode: 'Gateway',
      activeEdge: 'Client-Gateway',
      packet: { text: 'Filtering...', x: 180, y: 100 },
      tokens: currentTokens,
      phase: 'GATEWAY_INTERCEPT'
    });

    // 3. Auth Check
    if (tokenState === 'INVALID' || tokenState === 'MISSING') {
      const errStatus = tokenState === 'INVALID' ? '401 Unauthorized' : '400 Bad Request (Missing Token)';
      trace.push({
        log: `Authentication filter failed: JWT signature check returned ${errStatus}. Request rejected immediately.`,
        activeNode: 'Gateway',
        activeEdge: null,
        packet: { text: tokenState === 'INVALID' ? '401 Err' : '400 Err', x: 180, y: 100 },
        tokens: currentTokens,
        phase: 'AUTH_FAILED'
      });
      // Return response to client
      trace.push({
        log: `Gateway returns HTTP error response back to Client.`,
        activeNode: 'Client',
        activeEdge: 'Client-Gateway',
        packet: { text: tokenState === 'INVALID' ? '401 Code' : '400 Code', x: 110, y: 100 },
        tokens: currentTokens,
        phase: 'CLIENT_RESPONSE'
      });
      setSteps(trace);
      setCurrentStep(0);
      setIsPlaying(false);
      return;
    }

    // 4. Rate Limiting Check
    if (currentTokens <= 0) {
      trace.push({
        log: 'Rate Limiter filter failed: Token bucket is empty! Request blocked with HTTP 429 Too Many Requests.',
        activeNode: 'Gateway',
        activeEdge: null,
        packet: { text: '429 Rate', x: 180, y: 100 },
        tokens: 0,
        phase: 'RATE_LIMITED'
      });
      trace.push({
        log: 'Gateway returns HTTP 429 Too Many Requests response to Client.',
        activeNode: 'Client',
        activeEdge: 'Client-Gateway',
        packet: { text: '429 Code', x: 110, y: 100 },
        tokens: 0,
        phase: 'CLIENT_RESPONSE'
      });
      setSteps(trace);
      setCurrentStep(0);
      setIsPlaying(false);
      return;
    }

    // Consume 1 token
    currentTokens -= 1;
    setRateLimitCounter(currentTokens);

    trace.push({
      log: `Auth validation passed. Rate Limiter passed (Consumed 1 token. Remaining: ${currentTokens}/3). Routing request...`,
      activeNode: 'Gateway',
      activeEdge: null,
      packet: { text: 'OK: Route', x: 180, y: 100 },
      tokens: currentTokens,
      phase: 'GATEWAY_ROUTING'
    });

    // Determine target service
    let targetService = '';
    let targetY = 100;
    if (route.startsWith('/users')) {
      targetService = 'UsersService';
      targetY = 40;
    } else if (route.startsWith('/orders')) {
      targetService = 'OrdersService';
      targetY = 100;
    } else {
      targetService = 'PaymentsService';
      targetY = 160;
    }

    // 5. Route to Microservice
    trace.push({
      log: `Gateway routes request to decoupled ${targetService} based on path mapping.`,
      activeNode: targetService,
      activeEdge: `Gateway-${targetService}`,
      packet: { text: `GET data`, x: 280, y: targetY },
      tokens: currentTokens,
      phase: 'SERVICE_PROCESSING'
    });

    // 6. Service Responds
    trace.push({
      log: `${targetService} completed request successfully and returns payload response.`,
      activeNode: 'Gateway',
      activeEdge: `Gateway-${targetService}`,
      packet: { text: 'JSON Body', x: 280, y: targetY },
      tokens: currentTokens,
      phase: 'SERVICE_RESPONDED'
    });

    // 7. Gateway responds back to client
    trace.push({
      log: `Gateway appends headers and returns final HTTP 200 OK response to Client browser.`,
      activeNode: 'Client',
      activeEdge: 'Client-Gateway',
      packet: { text: '200 OK JSON', x: 110, y: 100 },
      tokens: currentTokens,
      phase: 'CLIENT_RESPONSE'
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
    setRateLimitCounter(3);
    setSteps([
      {
        log: 'API Gateway ready. Send a request to see authentication, rate limiting, and routing checks.',
        activeNode: null,
        activeEdge: null,
        packet: null,
        tokens: 3,
        phase: 'IDLE'
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Path:</span>
      <select
        value={route}
        onChange={(e) => setRoute(e.target.value)}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        <option value="/users/profile">GET /users/profile</option>
        <option value="/orders/create">POST /orders/create</option>
        <option value="/payments/charge">POST /payments/charge</option>
      </select>

      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>JWT Token:</span>
      <select
        value={tokenState}
        onChange={(e) => setTokenState(e.target.value)}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        <option value="VALID">Valid Token</option>
        <option value="INVALID">Invalid Signature</option>
        <option value="MISSING">Missing Auth Header</option>
      </select>

      <button className="btn-viz-action btn-add" onClick={handleSendRequest}>
        Send Request
      </button>

      <button className="btn-viz-action btn-clear" onClick={() => setRateLimitCounter(0)}>
        Simulate Rate Limit Overload (Empty Bucket)
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Gateway State</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace'
        }}>
          <div>Phase: <strong style={{ color: 'var(--brand-cyan)' }}>{activeStep.phase}</strong></div>
          <div>Active Node: <span>{activeStep.activeNode || 'None'}</span></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Rate Limiter Status</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace'
        }}>
          <div>Token Bucket: <strong style={{ color: activeStep.tokens === 0 ? '#ef4444' : '#10b981' }}>{activeStep.tokens} / 3 tokens</strong></div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
            {activeStep.tokens === 0 ? 'Bucket empty - requests will be blocked!' : 'Bucket has tokens available'}
          </div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>An <strong>API Gateway</strong> serves as a single entry point for all client requests, routing them to the correct downstream microservices while executing cross-cutting filters:</p>
      <ul>
        <li><strong>Routing:</strong> Inspects the request path (e.g. <code>/users</code> vs <code>/orders</code>) and forwards the request to the appropriate microservice.</li>
        <li><strong>Central Authentication:</strong> Validates user credentials or JWT tokens at the entry layer so microservices do not need to implement redundant authentication logic.</li>
        <li><strong>Rate Limiting:</strong> Tracks incoming request frequencies using algorithms like token buckets, blocking abusers with HTTP 429 Too Many Requests.</li>
        <li><strong>Load Shedding & Security:</strong> Intercepts malicious requests, acts as an SSL termination layer, and monitors error rates.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of an API Gateway as a **Hotel Concierge Desk**:</p>
      <ul>
        <li><strong>Client:</strong> A guest who enters the hotel lobby.</li>
        <li><strong>API Gateway (Concierge):</strong> The lobby desk worker who checks your reservation (Auth), makes sure you aren't asking for 10 room changes a minute (Rate Limiting), and tells you where to find the Spa, Restaurant, or Gym (Routing).</li>
        <li><strong>Microservices:</strong> The specialized hotel departments (Gym staff, Chef in the kitchen, Spa therapist) who do the actual work.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Monolithic Single Point of Failure:</strong> Running a single instance of the Gateway without horizontal scaling, making it the ultimate vulnerability if it crashes.</li>
      <li><strong>Heavy Business Logic:</strong> Writing database queries or complex domain rules inside the gateway code. Gateways should remain lightweight routing/filtering layers.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What are the main benefits of using an API Gateway in a microservice architecture?',
      a: 'It decouples frontend clients from downstream microservices, allows centralized logging, handles authentication/authorization globally, enforces rate limiting, maps endpoints, and allows path translations without forcing client upgrades.'
    },
    {
      q: 'How does an API Gateway differ from a standard Load Balancer?',
      a: 'A load balancer operates primarily at Layers 4 (TCP) or 7 (HTTP) simply distributing identical traffic across server pools. An API Gateway is a application-layer tool that parses routes, validates tokens, intercepts payloads, translates protocols, and makes smart routing choices to different service groups.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which HTTP status code is returned by an API Gateway when a user triggers rate limiting?',
      options: [
        'HTTP 401 Unauthorized',
        'HTTP 403 Forbidden',
        'HTTP 429 Too Many Requests',
        'HTTP 502 Bad Gateway'
      ],
      correctIdx: 2,
      explanation: 'HTTP 429 is the standard response for rate-limiting triggers, letting the client know they have exceeded their allotted request quota.'
    },
    {
      question: 'Why should complex business logic be avoided in an API Gateway?',
      options: [
        'Because gateways can only run on Windows servers',
        'Because business logic slows down the routing path, turning the gateway into a high-latency bottleneck',
        'Because API Gateways do not support databases',
        'Because microservices cannot read JSON responses'
      ],
      correctIdx: 1,
      explanation: 'API Gateways must remain high-throughput, low-latency components. Placing database reads or business logic in the gateway increases request times for all clients.'
    }
  ];

  return (
    <VisualizerShell
      title="API Gateway Simulator"
      subtitle="Witness request interceptors executing Auth validations, Rate Limit checks, and Microservice routing."
      timeComplexity="O(1) routing complexity"
      spaceComplexity="O(N) rate limit tracking state"
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
          {/* Connector paths */}
          <line
            x1="60"
            y1="100"
            x2="150"
            y2="100"
            stroke={activeStep.activeEdge === 'Client-Gateway' ? '#1591DC' : 'var(--bg-tertiary)'}
            strokeWidth={activeStep.activeEdge === 'Client-Gateway' ? '2.5' : '1.5'}
          />
          <line
            x1="220"
            y1="100"
            x2="350"
            y2="40"
            stroke={activeStep.activeEdge === 'Gateway-UsersService' ? '#10b981' : 'var(--bg-tertiary)'}
            strokeWidth={activeStep.activeEdge === 'Gateway-UsersService' ? '2.5' : '1.5'}
          />
          <line
            x1="220"
            y1="100"
            x2="350"
            y2="100"
            stroke={activeStep.activeEdge === 'Gateway-OrdersService' ? '#10b981' : 'var(--bg-tertiary)'}
            strokeWidth={activeStep.activeEdge === 'Gateway-OrdersService' ? '2.5' : '1.5'}
          />
          <line
            x1="220"
            y1="100"
            x2="350"
            y2="160"
            stroke={activeStep.activeEdge === 'Gateway-PaymentsService' ? '#10b981' : 'var(--bg-tertiary)'}
            strokeWidth={activeStep.activeEdge === 'Gateway-PaymentsService' ? '2.5' : '1.5'}
          />

          {/* Client Node */}
          <g>
            <circle
              cx="40"
              cy="100"
              r="20"
              fill={activeStep.activeNode === 'Client' ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)'}
              stroke={activeStep.activeNode === 'Client' ? '#1591DC' : 'var(--bg-tertiary)'}
              strokeWidth="2.5"
            />
            <text x="40" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Client</text>
          </g>

          {/* API Gateway Box */}
          <g>
            <rect
              x="145"
              y="50"
              width="80"
              height="100"
              fill={activeStep.activeNode === 'Gateway' ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)'}
              stroke={activeStep.activeNode === 'Gateway' ? '#1591DC' : 'var(--bg-tertiary)'}
              strokeWidth="2.5"
              rx="4"
            />
            <text x="185" y="68" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem" fontWeight="bold">API Gateway</text>
            
            {/* Embedded filter blocks visual */}
            <rect x="155" y="78" width="60" height="14" fill="var(--bg-primary)" stroke="var(--bg-tertiary)" strokeWidth="1" rx="2" />
            <text x="185" y="87" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.45rem">Auth Filter</text>

            <rect x="155" y="98" width="60" height="14" fill="var(--bg-primary)" stroke="var(--bg-tertiary)" strokeWidth="1" rx="2" />
            <text x="185" y="107" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.45rem">Rate Limit</text>

            <rect x="155" y="118" width="60" height="14" fill="var(--bg-primary)" stroke="var(--bg-tertiary)" strokeWidth="1" rx="2" />
            <text x="185" y="127" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.45rem">Router</text>
          </g>

          {/* Microservices Nodes */}
          {/* Users Service */}
          <g>
            <rect
              x="350"
              y="25"
              width="80"
              height="30"
              fill={activeStep.activeNode === 'UsersService' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-secondary)'}
              stroke={activeStep.activeNode === 'UsersService' ? '#10b981' : 'var(--bg-tertiary)'}
              strokeWidth="2"
              rx="3"
            />
            <text x="390" y="43" textAnchor="middle" fill="#FFFFFF" fontSize="0.58rem">Users Service</text>
          </g>

          {/* Orders Service */}
          <g>
            <rect
              x="350"
              y="85"
              width="80"
              height="30"
              fill={activeStep.activeNode === 'OrdersService' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-secondary)'}
              stroke={activeStep.activeNode === 'OrdersService' ? '#10b981' : 'var(--bg-tertiary)'}
              strokeWidth="2"
              rx="3"
            />
            <text x="390" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.58rem">Orders Service</text>
          </g>

          {/* Payments Service */}
          <g>
            <rect
              x="350"
              y="145"
              width="80"
              height="30"
              fill={activeStep.activeNode === 'PaymentsService' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-secondary)'}
              stroke={activeStep.activeNode === 'PaymentsService' ? '#10b981' : 'var(--bg-tertiary)'}
              strokeWidth="2"
              rx="3"
            />
            <text x="390" y="163" textAnchor="middle" fill="#FFFFFF" fontSize="0.58rem">Payments Svc</text>
          </g>

          {/* Animated Packet */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.35s ease-in-out' }}>
              <rect
                x={activeStep.packet.x - 30}
                y={activeStep.packet.y - 12}
                width="60"
                height="18"
                fill="var(--bg-primary)"
                stroke="#f59e0b"
                strokeWidth="1.5"
                rx="3"
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
            <div style={{ width: '10px', height: '10px', backgroundColor: 'rgba(21, 145, 220, 0.15)', border: '1.5px solid #1591DC' }}></div> Gateway Routing
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1.5px solid #10b981' }}></div> Microservice Node
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '15px', height: '8px', border: '1.5px solid #f59e0b', backgroundColor: 'var(--bg-primary)' }}></div> Active Payload
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
