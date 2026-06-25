import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function JwtAuthVisualizer() {
  const [authAction, setAuthAction] = useState('login'); // 'login' or 'request'
  const [email, setEmail] = useState('arjun@gmail.com');
  const [token, setToken] = useState('');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [steps, setSteps] = useState([
    {
      log: 'Select an action: Login to acquire a JWT, or execute a Protected Request using the active token.',
      activeNode: null,
      activeEdge: null,
      packet: null,
      storageState: 'EMPTY',
      serverState: 'IDLE'
    }
  ]);

  const generateSteps = () => {
    let trace = [];

    if (authAction === 'login') {
      trace.push({
        log: `Client submits login credentials: Email "${email}", Password "****".`,
        activeNode: 'Client',
        activeEdge: null,
        packet: { text: 'Creds', x: 80, y: 70 },
        storageState: token ? 'HAS_TOKEN' : 'EMPTY',
        serverState: 'RECEIVING_CREDS'
      });

      trace.push({
        log: `Server queries Database to validate password hash for user "${email}".`,
        activeNode: 'Server',
        activeEdge: 'Server-DB',
        packet: { text: 'SQL check', x: 300, y: 70 },
        storageState: token ? 'HAS_TOKEN' : 'EMPTY',
        serverState: 'VALIDATING_DB'
      });

      // Signature breakdown
      trace.push({
        log: `Success! Server creates JWT: Header (SHA256), Payload ({email: "${email}", id: 10}), signed with SECRET_KEY.`,
        activeNode: 'Server',
        activeEdge: null,
        packet: null,
        storageState: token ? 'HAS_TOKEN' : 'EMPTY',
        serverState: 'SIGNING_JWT'
      });

      const mockToken = 'eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiQXJqdW4ifQ.signature_123';

      trace.push({
        log: `Server returns generated JWT token inside HTTP response JSON payload back to Client.`,
        activeNode: 'Client',
        activeEdge: 'Client-Server',
        packet: { text: 'JWT Token', x: 190, y: 70 },
        storageState: token ? 'HAS_TOKEN' : 'EMPTY',
        serverState: 'RESPONDING'
      });

      trace.push({
        log: `Client Browser receives JWT and writes it into LocalStorage: localStorage.setItem("jwt_token", "${mockToken.substring(0,18)}...")`,
        activeNode: 'Client',
        activeEdge: null,
        packet: null,
        storageState: 'HAS_TOKEN',
        serverState: 'COMPLETED'
      });

      setToken(mockToken);
    } else {
      // Protected request
      if (!token) {
        alert('Please run the Login action first to generate a token!');
        return;
      }

      trace.push({
        log: `Client initiates API fetch. Attaches JWT to HTTP Header: "Authorization: Bearer ${token.substring(0, 15)}..."`,
        activeNode: 'Client',
        activeEdge: null,
        packet: { text: 'Bearer JWT', x: 80, y: 70 },
        storageState: 'HAS_TOKEN',
        serverState: 'RECEIVING_REQUEST'
      });

      trace.push({
        log: `Server receives request. Decodes JWT and recalculates signature using SECRET_KEY to verify authenticity.`,
        activeNode: 'Server',
        activeEdge: null,
        packet: null,
        storageState: 'HAS_TOKEN',
        serverState: 'VERIFYING_SIGNATURE'
      });

      trace.push({
        log: `Signature matches! User is verified. Server resolves request WITHOUT checking database!`,
        activeNode: 'Server',
        activeEdge: null,
        packet: null,
        storageState: 'HAS_TOKEN',
        serverState: 'AUTHORIZED'
      });

      trace.push({
        log: `Server responds with protected dashboard data payload. HTTP 200 OK.`,
        activeNode: 'Client',
        activeEdge: 'Client-Server',
        packet: { text: 'Secure Data', x: 190, y: 70 },
        storageState: 'HAS_TOKEN',
        serverState: 'RESPONDING'
      });
    }

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
    setToken('');
    setSteps([
      {
        log: 'Select an action: Login to acquire a JWT, or execute a Protected Request using the active token.',
        activeNode: null,
        activeEdge: null,
        packet: null,
        storageState: 'EMPTY',
        serverState: 'IDLE'
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Action:</span>
      <select
        value={authAction}
        onChange={(e) => setAuthAction(e.target.value)}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        <option value="login">1. Login & Token Generation</option>
        <option value="request">2. Access Protected Resource</option>
      </select>

      {authAction === 'login' && (
        <>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email:</span>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '140px',
              padding: '0.45rem',
              borderRadius: '4px',
              border: '1px solid var(--bg-tertiary)',
              backgroundColor: 'var(--bg-primary)',
              color: '#FFFFFF',
              fontSize: '0.85rem'
            }}
          />
        </>
      )}

      <button className="btn-viz-action btn-add" onClick={generateSteps}>
        Run Flow Step
      </button>
      <button className="btn-viz-action btn-clear" onClick={handleReset}>
        Clear State
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Browser Storage (LocalStorage)</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          color: activeStep.storageState === 'HAS_TOKEN' ? '#10b981' : 'var(--text-tertiary)'
        }}>
          {activeStep.storageState === 'HAS_TOKEN' ? (
            <div>
              <strong>Key: jwt_token</strong>
              <div style={{ fontSize: '0.65rem', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '0.2rem' }}>
                Value: eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiQXJqdW4ifQ.signature_123
              </div>
            </div>
          ) : (
            'Empty'
          )}
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Server Status (Stateless)</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          color: 'var(--brand-cyan)'
        }}>
          Phase: {activeStep.serverState}
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>JSON Web Token (JWT)</strong> is an open standard (RFC 7519) that defines a compact, self-contained way for securely transmitting information between parties as a JSON object:</p>
      <ul>
        <li><strong>Three Components:</strong>
          <ul>
            <li><strong>Header:</strong> Specifies algorithm type (e.g. HMAC SHA256) and token type (JWT).</li>
            <li><strong>Payload:</strong> Contains claims (claims are statements about the user, like user ID and roles).</li>
            <li><strong>Signature:</strong> Generated by hashing the encoded Header, encoded Payload, and a SECRET_KEY known only to the server.</li>
          </ul>
        </li>
        <li><strong>Stateless Verification:</strong> Because the token contains a digital signature, the server does not need to query databases to verify the user; it simply recalculates the signature using its private <code>SECRET_KEY</code>.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of JWT Authentication as a **VIP Concert Ticket Wristband**:</p>
      <ul>
        <li>You queue up at the box office, show your passport/ID (Credentials), and pay for the ticket.</li>
        <li>The clerk gives you a colored wristband stamped with a secure official hologram logo stamp (Signature).</li>
        <li>Once you have the wristband on (LocalStorage), you don't show your passport again. Whenever you cross gate security, the guards look at the hologram (Verify Signature) and let you pass instantly!</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Storing Sensitive Data in Payload:</strong> Placing passwords or bank account details in the JWT payload. The payload is ONLY base64-encoded, meaning ANYONE can read its contents!</li>
      <li><strong>Short/Weak Secret Keys:</strong> Utilizing weak secret strings like "mysecretkey123" which can be easily brute-forced, allowing hackers to forge signatures.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is the main architectural difference between Session Cookie Auth and JWT Auth?',
      a: 'Session Auth is stateful: the server stores session IDs in memory/Redis and looks them up on every request. JWT is stateless: all user data is inside the token, and the server verifies it mathematically using a secret key without database lookups.'
    },
    {
      q: 'How do you handle JWT revocation (logouts or token bans) before expiration?',
      a: 'Since JWT is stateless, the server cannot inherently revoke it. To ban tokens early, you can implement a "Blacklist store" (like Redis) checking active requests, or use short-lived Access tokens (15m) paired with stateful Refresh tokens.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which section of a JWT contains user-specific data like User ID or Roles?',
      options: [
        'Header',
        'Payload',
        'Signature',
        'Metadata'
      ],
      correctIdx: 1,
      explanation: 'The Payload section contains user claims such as userId, roles, and token expiration timings.'
    },
    {
      question: 'Is the JWT Payload encrypted by default?',
      options: [
        'Yes, it is securely encrypted',
        'No, it is only Base64 URL-encoded (anyone can decode and read it)',
        'It is encrypted only on the client',
        'It is encrypted only when using cookies'
      ],
      correctIdx: 1,
      explanation: 'JWTs are signed to prevent tampering, but they are NOT encrypted by default. The payload is plain Base64 encoded, so sensitive data should never be stored in it.'
    }
  ];

  return (
    <VisualizerShell
      title="JWT Authentication Flow Simulator"
      subtitle="Step through credential validation, token signature, storage, and stateless Bearer authorization."
      timeComplexity="O(1) crypt verification"
      spaceComplexity="O(1) client storage"
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
          {/* Network Links */}
          <line x1="50" y1="65" x2="200" y2="65" stroke={activeStep.activeNode === 'Client' || activeStep.activeNode === 'Server' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
          <line x1="200" y1="65" x2="350" y2="65" stroke={activeStep.activeEdge === 'Server-DB' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth="1.5" />

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
            <text x="50" y="78" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.5rem">(LocalStorage)</text>
          </g>

          {/* Server Node */}
          <g>
            <rect
              x="165"
              y="40"
              width="70"
              height="50"
              fill={activeStep.activeNode === 'Server' ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)'}
              stroke={activeStep.activeNode === 'Server' ? '#1591DC' : 'var(--bg-tertiary)'}
              strokeWidth="2"
              rx="4"
            />
            <text x="200" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="0.75rem" fontWeight="bold">Server</text>
            <text x="200" y="78" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.5rem">(Secret Keys)</text>
          </g>

          {/* DB Node */}
          <g>
            <rect
              x="315"
              y="40"
              width="70"
              height="50"
              fill={activeStep.activeNode === 'Database' ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)'}
              stroke={activeStep.activeNode === 'Database' ? '#1591DC' : 'var(--bg-tertiary)'}
              strokeWidth="2"
              rx="4"
            />
            <text x="350" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="0.75rem" fontWeight="bold">Database</text>
            <text x="350" y="78" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.5rem">(User Creds)</text>
          </g>

          {/* Packet */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.3s' }}>
              <rect
                x={activeStep.packet.x - 32}
                y={activeStep.packet.y - 12}
                width="64"
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
                style={{ fontSize: '0.52rem', fontWeight: 'bold', fontFamily: 'monospace' }}
              >
                {activeStep.packet.text}
              </text>
            </g>
          )}
        </svg>

      </div>
    </VisualizerShell>
  );
}
