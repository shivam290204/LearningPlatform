import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function RestApiLifecycleVisualizer() {
  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState('/api/v1/courses');
  const [reqBody, setReqBody] = useState('{}');

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [steps, setSteps] = useState([
    {
      log: 'Select a HTTP Method, adjust the path, and click Send API Request.',
      activeNode: null,
      stateLabel: 'IDLE',
      packet: null,
      resStatus: '',
      resBody: ''
    }
  ]);

  const generateSteps = () => {
    let trace = [];

    // Step 1: Client serialization
    trace.push({
      log: `Client serializes request: ${method} ${path}. Attaching header: Accept: application/json. Payload: ${reqBody}`,
      activeNode: 'Client',
      stateLabel: 'SERIALIZE',
      packet: { text: `${method} Req`, x: 70, y: 70 },
      resStatus: '',
      resBody: ''
    });

    // Step 2: Network transit
    trace.push({
      log: `Request packet traveling across TCP network to Web Server...`,
      activeNode: 'Network',
      stateLabel: 'TRANSIT',
      packet: { text: `${method} ${path}`, x: 190, y: 70 },
      resStatus: '',
      resBody: ''
    });

    // Step 3: Server middleware routing
    trace.push({
      log: `Server received request. Matching route pattern for "${path}"... Running auth middleware checks.`,
      activeNode: 'Server',
      stateLabel: 'MIDDLEWARE',
      packet: null,
      resStatus: '',
      resBody: ''
    });

    // Step 4: Controller processing / database
    let mockResult = '';
    let mockStatus = '200 OK';
    if (method === 'GET') {
      mockResult = '{"courses":[{"id":1,"title":"Java Basics"}]}';
    } else if (method === 'POST') {
      mockResult = '{"success":true,"id":102,"message":"Created"}';
      mockStatus = '201 Created';
    } else if (method === 'PUT') {
      mockResult = '{"success":true,"message":"Updated"}';
    } else {
      mockResult = '{"success":true,"message":"Deleted"}';
    }

    trace.push({
      log: `Route matched. Executing controller business logic. Querying Database...`,
      activeNode: 'Server',
      stateLabel: 'CONTROLLER',
      packet: null,
      resStatus: '',
      resBody: ''
    });

    // Step 5: Serialize response
    trace.push({
      log: `Controller finished processing. Serializing response: HTTP ${mockStatus}. Payload: ${mockResult}`,
      activeNode: 'Server',
      stateLabel: 'SERIALIZE_RESPONSE',
      packet: { text: `HTTP ${mockStatus}`, x: 290, y: 70 },
      resStatus: mockStatus,
      resBody: mockResult
    });

    // Step 6: Return transit
    trace.push({
      log: `Response packet traveling back to Client...`,
      activeNode: 'Network',
      stateLabel: 'TRANSIT_RESPONSE',
      packet: { text: `HTTP ${mockStatus}`, x: 195, y: 70 },
      resStatus: mockStatus,
      resBody: mockResult
    });

    // Step 7: Completed
    trace.push({
      log: `Client received response code: HTTP ${mockStatus}. Rendering data.`,
      activeNode: 'Client',
      stateLabel: 'COMPLETED',
      packet: null,
      resStatus: mockStatus,
      resBody: mockResult
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
        log: 'Select a HTTP Method, adjust the path, and click Send API Request.',
        activeNode: null,
        stateLabel: 'IDLE',
        packet: null,
        resStatus: '',
        resBody: ''
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Method:</span>
      <select
        value={method}
        onChange={(e) => {
          setMethod(e.target.value);
          if (e.target.value === 'POST') {
            setPath('/api/v1/courses');
            setReqBody('{"title":"Web Design"}');
          } else if (e.target.value === 'PUT') {
            setPath('/api/v1/courses/1');
            setReqBody('{"title":"Web Design Advanced"}');
          } else if (e.target.value === 'DELETE') {
            setPath('/api/v1/courses/1');
            setReqBody('{}');
          } else {
            setPath('/api/v1/courses');
            setReqBody('{}');
          }
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
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </select>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Path:</span>
      <input
        type="text"
        value={path}
        onChange={(e) => setPath(e.target.value)}
        style={{
          width: '130px',
          padding: '0.45rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      />
      <button className="btn-viz-action btn-add" onClick={generateSteps}>
        Send API Request
      </button>
      <button className="btn-viz-action btn-clear" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>Request Body</span>
        <pre style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.4rem 0.6rem',
          fontFamily: 'monospace',
          color: '#f59e0b',
          margin: 0
        }}>{reqBody}</pre>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>Response Payload</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.4rem 0.6rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          minHeight: '40px'
        }}>
          {activeStep.resStatus ? (
            <div>
              <div style={{ color: activeStep.resStatus.startsWith('2') ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                Status: {activeStep.resStatus}
              </div>
              <div style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', overflowX: 'auto' }}>
                {activeStep.resBody}
              </div>
            </div>
          ) : (
            <span style={{ color: 'var(--text-tertiary)' }}>No response yet</span>
          )}
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>REST API (Representational State Transfer)</strong> is an architectural style for design APIs that utilize standard HTTP operations to manage resources:</p>
      <ul>
        <li><strong>Standard HTTP Methods:</strong>
          <ul>
            <li><code>GET</code>: Read resource details (Safe & Idempotent).</li>
            <li><code>POST</code>: Create a new resource (Non-Idempotent).</li>
            <li><code>PUT</code>: Fully replace/update an existing resource (Idempotent).</li>
            <li><code>DELETE</code>: Remove a resource (Idempotent).</li>
          </ul>
        </li>
        <li><strong>HTTP Response Categories:</strong>
          <ul>
            <li><code>2xx Success</code> (e.g. 200 OK, 201 Created).</li>
            <li><code>4xx Client Error</code> (e.g. 400 Bad Request, 401 Unauthorized, 404 Not Found).</li>
            <li><code>5xx Server Error</code> (e.g. 500 Internal Server Error, 502 Bad Gateway).</li>
          </ul>
        </li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of the REST API Lifecycle as a **Postal Package Delivery Service**:</p>
      <ul>
        <li><strong>GET:</strong> Requesting the post office to mail you a copy of your utility bill catalog (you aren't altering anything).</li>
        <li><strong>POST:</strong> Sending a completed application form to register a new student account (creates a record).</li>
        <li><strong>PUT:</strong> Sending a letter updating your complete home address.</li>
        <li><strong>DELETE:</strong> Sending a request to cancel your account.</li>
        <li><strong>Status Codes:</strong> The mail carrier returning a receipt that says "Delivered" (200), "Address Not Found" (404), or "Refused Signature" (401).</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Incorrect HTTP Methods:</strong> Using <code>GET</code> requests to perform actions that modify server databases (e.g. <code>GET /api/delete-user?id=5</code>). This violates safe-GET requirements.</li>
      <li><strong>Incorrect Status Codes:</strong> Returning <code>200 OK</code> for all requests, even when errors occur, and embedding error codes inside response bodies. This breaks API standards.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What does Idempotency mean in the context of HTTP methods?',
      a: 'An HTTP method is idempotent if executing it multiple times yields the exact same server state as executing it once. GET, PUT, and DELETE are idempotent; POST is not (running POST multiple times creates multiple duplicate resources).'
    },
    {
      q: 'What is the difference between PUT and PATCH methods?',
      a: 'PUT is used to replace the entire resource payload with the new data. PATCH is used to apply partial modifications (e.g., updating only a user\'s email field while leaving password untouched).'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which HTTP status code should a server return when a POST request successfully creates a resource?',
      options: [
        '200 OK',
        '201 Created',
        '204 No Content',
        '302 Found'
      ],
      correctIdx: 1,
      explanation: '201 Created is the standard HTTP status code returned to confirm a resource was successfully created on the server.'
    },
    {
      question: 'Why is POST considered non-idempotent?',
      options: [
        'It is unsafe to transmit parameters',
        'Submitting it multiple times creates multiple new records',
        'It requires token authorization',
        'It does not support JSON payloads'
      ],
      correctIdx: 1,
      explanation: 'POST is non-idempotent because multiple submissions create multiple distinct resource instances on the backend server.'
    }
  ];

  return (
    <VisualizerShell
      title="REST API Lifecycle Simulator"
      subtitle="Interact with HTTP request methods, payload structures, route controllers, and status codes."
      timeComplexity="O(1) request parsing"
      spaceComplexity="O(N) payload data size"
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
        
        <svg width="400" height="130" style={{ overflow: 'visible' }}>
          {/* Edge line linking Client and Server */}
          <line x1="50" y1="65" x2="350" y2="65" stroke={activeStep.activeNode === 'Network' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth={activeStep.activeNode === 'Network' ? '2.5' : '1.5'} />

          {/* Client Node */}
          <g>
            <rect
              x="15"
              y="40"
              width="70"
              height="50"
              fill={activeStep.activeNode === 'Client' ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)'}
              stroke={activeStep.activeNode === 'Client' ? '#1591DC' : 'var(--bg-tertiary)'}
              strokeWidth="2"
              rx="4"
            />
            <text x="50" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="0.75rem" fontWeight="bold">Client</text>
            <text x="50" y="78" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.5rem">(Browser/App)</text>
          </g>

          {/* Server Node */}
          <g>
            <rect
              x="315"
              y="40"
              width="70"
              height="50"
              fill={activeStep.activeNode === 'Server' ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)'}
              stroke={activeStep.activeNode === 'Server' ? '#1591DC' : 'var(--bg-tertiary)'}
              strokeWidth="2"
              rx="4"
            />
            <text x="350" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="0.75rem" fontWeight="bold">Server</text>
            <text x="350" y="78" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.5rem">(Express Node)</text>
          </g>

          {/* Packet animation */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.2s' }}>
              <rect
                x={activeStep.packet.x - 35}
                y={activeStep.packet.y - 12}
                width="70"
                height="16"
                fill="var(--bg-primary)"
                stroke="#f59e0b"
                strokeWidth="1.2"
                rx="2"
              />
              <text
                x={activeStep.packet.x}
                y={activeStep.packet.y.toString()}
                textAnchor="middle"
                fill="#f59e0b"
                style={{ fontSize: '0.55rem', fontWeight: 'bold', fontFamily: 'monospace' }}
              >
                {activeStep.packet.text}
              </text>
            </g>
          )}
        </svg>

        {/* Phase display */}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Active Process Status: <strong style={{ color: 'var(--brand-cyan)' }}>{activeStep.stateLabel}</strong>
        </div>

      </div>
    </VisualizerShell>
  );
}
