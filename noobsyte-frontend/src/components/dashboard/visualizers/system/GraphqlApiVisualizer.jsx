import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function GraphqlApiVisualizer() {
  const [apiType, setApiType] = useState('REST'); // 'REST' or 'GRAPHQL'
  const [fields, setFields] = useState({
    profile: true,
    orders: false,
    payments: false
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const [steps, setSteps] = useState([
    {
      log: 'API environment loaded. Select the fields you need and try sending REST or GraphQL requests.',
      activeNode: null,
      activeEdge: null,
      packet: null,
      transferredBytes: 0,
      roundTrips: 0
    }
  ]);

  const handleSendRequest = () => {
    let trace = [];
    const fieldsSelected = Object.keys(fields).filter(k => fields[k]);

    if (apiType === 'REST') {
      // Step 1: Query profile
      trace.push({
        log: 'REST Step 1: Fetching User Profile from GET /users/1.',
        activeNode: 'ProfileEndpoint',
        activeEdge: 'Client-Profile',
        packet: { text: 'GET /users/1', x: 180, y: 50 },
        transferredBytes: 250,
        roundTrips: 1
      });

      let byteCount = 250;
      let trips = 1;

      // Step 2: Query orders if checked
      if (fields.orders) {
        byteCount += 500;
        trips += 1;
        trace.push({
          log: 'REST Step 2 (Under-fetching): Profile did not contain orders. Fetching Orders from GET /users/1/orders.',
          activeNode: 'OrdersEndpoint',
          activeEdge: 'Client-Orders',
          packet: { text: 'GET /orders', x: 180, y: 100 },
          transferredBytes: byteCount,
          roundTrips: trips
        });
      }

      // Step 3: Query payments if checked
      if (fields.payments) {
        byteCount += 400;
        trips += 1;
        trace.push({
          log: 'REST Step 3 (Under-fetching): Fetching Payment history from GET /users/1/payments.',
          activeNode: 'PaymentsEndpoint',
          activeEdge: 'Client-Payments',
          packet: { text: 'GET /payments', x: 180, y: 150 },
          transferredBytes: byteCount,
          roundTrips: trips
        });
      }

      trace.push({
        log: `REST Request finished. Total Roundtrips: ${trips}. Transferred payload size: ${byteCount} bytes.`,
        activeNode: 'Client',
        activeEdge: null,
        packet: null,
        transferredBytes: byteCount,
        roundTrips: trips
      });
    } else {
      // GRAPHQL
      const reqQuery = `query { user { name ${fields.orders ? 'orders' : ''} ${fields.payments ? 'payments' : ''} } }`;
      // GraphQL fetches everything in ONE single request
      trace.push({
        log: `GraphQL: Client submits custom query schema to /graphql endpoint.`,
        activeNode: 'GraphqlEndpoint',
        activeEdge: 'Client-Graphql',
        packet: { text: 'POST /graphql', x: 180, y: 100 },
        transferredBytes: reqQuery.length,
        roundTrips: 1
      });

      // Calculate payload size based on what was selected
      let payloadSize = 100;
      if (fields.profile) payloadSize += 100;
      if (fields.orders) payloadSize += 150;
      if (fields.payments) payloadSize += 150;

      trace.push({
        log: `GraphQL Resolver resolves query fields concurrently. Returns exact payload JSON in ONE single roundtrip.`,
        activeNode: 'Client',
        activeEdge: 'Graphql-Client',
        packet: { text: `JSON: ${payloadSize}B`, x: 180, y: 100 },
        transferredBytes: payloadSize,
        roundTrips: 1
      });
    }

    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleFieldToggle = (f) => {
    setFields(prev => ({
      ...prev,
      [f]: !prev[f]
    }));
    setSteps([
      {
        log: `Modified field requirements.`,
        activeNode: null,
        activeEdge: null,
        packet: null,
        transferredBytes: 0,
        roundTrips: 0
      }
    ]);
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
    setFields({
      profile: true,
      orders: false,
      payments: false
    });
    setSteps([
      {
        log: 'API environment reset.',
        activeNode: null,
        activeEdge: null,
        packet: null,
        transferredBytes: 0,
        roundTrips: 0
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>API Architecture:</span>
      <select
        value={apiType}
        onChange={(e) => {
          setApiType(e.target.value);
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
        <option value="REST">REST APIs (Multiple Endpoints)</option>
        <option value="GRAPHQL">GraphQL (Single Endpoint Query)</option>
      </select>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <label style={{ fontSize: '0.85rem', color: '#fff', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={fields.profile}
            disabled
            style={{ marginRight: '0.25rem' }}
          />
          User Profile
        </label>
        <label style={{ fontSize: '0.85rem', color: '#fff', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={fields.orders}
            onChange={() => handleFieldToggle('orders')}
            style={{ marginRight: '0.25rem' }}
          />
          Orders
        </label>
        <label style={{ fontSize: '0.85rem', color: '#fff', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={fields.payments}
            onChange={() => handleFieldToggle('payments')}
            style={{ marginRight: '0.25rem' }}
          />
          Payments
        </label>
      </div>

      <button className="btn-viz-action btn-add" onClick={handleSendRequest}>
        Execute Request
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Network Metadata</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>HTTP Roundtrips: <strong style={{ color: 'var(--brand-cyan)' }}>{activeStep.roundTrips}</strong></div>
          <div>Transferred Payload: <strong style={{ color: 'var(--brand-cyan)' }}>{activeStep.transferredBytes} bytes</strong></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Client Schema Builder</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          {apiType === 'REST' ? (
            <div>
              <div>Target URLs required:</div>
              <div>• /users/1</div>
              {fields.orders && <div>• /users/1/orders</div>}
              {fields.payments && <div>• /users/1/payments</div>}
            </div>
          ) : (
            <div>
              <div>GraphQL Query payload:</div>
              <div style={{ color: '#10b981', whiteSpace: 'pre-wrap' }}>
                {`{ user(id: 1) {`}
                {`  name`}
                {fields.orders && `\n  orders { id total }`}
                {fields.payments && `\n  payments { status }`}
                {`\n} }`}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>API architectures specify how data is requested and fetched from servers over the network:</p>
      <ul>
        <li><strong>REST (Representational State Transfer):</strong> Organizes resources into multiple static URL endpoints (e.g., /users, /orders). Clients have no control over returned fields, leading to:
          <ul>
            <li><strong>Over-fetching:</strong> Downloading data fields that you do not need (e.g. fetching user metadata when you only wanted their name).</li>
            <li><strong>Under-fetching:</strong> An endpoint lacks the necessary nested relations, forcing the client to make multiple roundtrip requests.</li>
          </ul>
        </li>
        <li><strong>GraphQL:</strong> A query language for APIs that exposes a single entry endpoint (/graphql). Clients submit a declarative schema request, specifying the exact fields needed, which the server resolves in a single roundtrip.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of REST vs GraphQL as **a Fast-food Combo Menu vs a Custom Salad Bar**:</p>
      <ul>
        <li><strong>REST (Combo menu):</strong> You can only order pre-packaged meals (Combo #1, Combo #2). If you want fries, a drink, and a cookie, you have to buy three separate items (under-fetching), and each item might contain things you do not want (over-fetching).</li>
        <li><strong>GraphQL (Salad Bar):</strong> You get a custom bowl and list exactly what you want (2 scoops of chicken, spinach, no tomatoes). The server packs exactly what you asked for in one container.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>N+1 Database Query Problem:</strong> In GraphQL, nested field resolvers can execute a separate SQL query for every single child item returned. Use loaders like DataLoader to batch and cache database retrievals.</li>
      <li><strong>Missing Query depth Limits:</strong> Accepting arbitrary client-defined query payloads, which allows malicious clients to run deep recursive requests (e.g., user {'->'} post {'->'} user {'->'} post...) that crash the server's CPU.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Detail "Over-fetching" and "Under-fetching" in API design.',
      a: 'Over-fetching is when a client receives more fields than it requires, wasting network bandwidth. Under-fetching is when an API endpoint does not provide sufficient data, forcing the client to make sequential API calls to other endpoints to gather the required details.'
    },
    {
      q: 'How does GraphQL mitigate the under-fetching problem?',
      a: 'GraphQL uses a single endpoint (/graphql) and a flexible schema graph. The client specifies nested relations in a single query payload. The server-side engine parses this structure and executes nested field resolvers to fetch and compile all required resources, returning them in a single response.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which problem is directly caused by a REST API endpoint returning 50 unused fields to a mobile app client?',
      options: [
        'Under-fetching',
        'Over-fetching',
        'Database replication lag',
        'Slow disk read speed'
      ],
      correctIdx: 1,
      explanation: 'Over-fetching occurs when the server sends more data than the client actually needs for rendering.'
    },
    {
      question: 'What is the standard mechanism to prevent deep recursive GraphQL queries from crashing a database server?',
      options: [
        'Switching back to REST',
        'Setting maximum query depth limits and cost analysis limits',
        'Increasing RAM capacity',
        'Caching all database queries'
      ],
      correctIdx: 1,
      explanation: 'Setting a maximum query depth ensures the GraphQL parser rejects requests that exceed a specific nesting level before they compile.'
    }
  ];

  return (
    <VisualizerShell
      title="GraphQL vs REST APIs"
      subtitle="Examine under-fetching roundtrips in REST compared to exact-data single-endpoint queries in GraphQL."
      timeComplexity="REST: O(N) endpoints; GraphQL: O(1) query"
      spaceComplexity="REST: Fixed payload; GraphQL: Custom payload size"
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
          {apiType === 'REST' ? (
            <g>
              {/* REST Links */}
              <line x1="50" y1="100" x2="300" y2="50" stroke={activeStep.activeEdge === 'Client-Profile' ? '#f59e0b' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
              <line x1="50" y1="100" x2="300" y2="100" stroke={activeStep.activeEdge === 'Client-Orders' ? '#f59e0b' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
              <line x1="50" y1="100" x2="300" y2="150" stroke={activeStep.activeEdge === 'Client-Payments' ? '#f59e0b' : 'var(--bg-tertiary)'} strokeWidth="1.5" />

              {/* Endpoints */}
              <g>
                <rect x="300" y="35" width="100" height="30" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" rx="3" />
                <text x="350" y="53" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">GET /users/1</text>
              </g>

              <g>
                <rect x="300" y="85" width="100" height="30" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" rx="3" />
                <text x="350" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">GET /orders</text>
              </g>

              <g>
                <rect x="300" y="135" width="100" height="30" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" rx="3" />
                <text x="350" y="153" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">GET /payments</text>
              </g>
            </g>
          ) : (
            <g>
              {/* GraphQL Link */}
              <line x1="50" y1="100" x2="300" y2="100" stroke={activeStep.activeEdge === 'Client-Graphql' || activeStep.activeEdge === 'Graphql-Client' ? '#10b981' : 'var(--bg-tertiary)'} strokeWidth="2" />

              {/* Single Endpoint */}
              <g>
                <rect x="300" y="70" width="110" height="60" fill="var(--bg-secondary)" stroke="#10b981" strokeWidth="2.5" rx="3" />
                <text x="355" y="93" textAnchor="middle" fill="#10b981" fontSize="0.55rem" fontWeight="bold">POST /graphql</text>
                <text x="355" y="110" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.38rem">GraphQL Gateway</text>
                <text x="355" y="120" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.35rem">Single Endpoint</text>
              </g>
            </g>
          )}

          {/* Client Node */}
          <g>
            <circle cx="35" cy="100" r="16" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="35" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Client</text>
          </g>

          {/* Animated Packet */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.35s ease' }}>
              <rect x={activeStep.packet.x - 32} y={activeStep.packet.y - 10} width="64" height="15" fill="var(--bg-primary)" stroke={apiType === 'REST' ? '#f59e0b' : '#10b981'} strokeWidth="1.2" rx="2" />
              <text x={activeStep.packet.x} y={activeStep.packet.y + 1} textAnchor="middle" fill={apiType === 'REST' ? '#f59e0b' : '#10b981'} fontSize="0.35rem" fontWeight="bold">
                {activeStep.packet.text}
              </text>
            </g>
          )}
        </svg>
      </div>
    </VisualizerShell>
  );
}
