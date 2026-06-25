import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function SessionAuthVisualizer() {
  const [authAction, setAuthAction] = useState('login'); // 'login' or 'request'
  const [email, setEmail] = useState('sid@gmail.com');
  const [sessionId, setSessionId] = useState('');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [steps, setSteps] = useState([
    {
      log: 'Select an action: Login to create a Session, or execute a Protected Request using the cookie.',
      activeNode: null,
      activeEdge: null,
      packet: null,
      cookieState: 'EMPTY',
      redisState: 'EMPTY',
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
        packet: { text: 'Credentials', x: 70, y: 70 },
        cookieState: sessionId ? 'HAS_COOKIE' : 'EMPTY',
        redisState: sessionId ? 'HAS_SESSION' : 'EMPTY',
        serverState: 'RECEIVING_CREDS'
      });

      trace.push({
        log: `Server queries Database to validate credentials for user "${email}".`,
        activeNode: 'Server',
        activeEdge: 'Server-DB',
        packet: { text: 'SQL check', x: 250, y: 35 },
        cookieState: sessionId ? 'HAS_COOKIE' : 'EMPTY',
        redisState: sessionId ? 'HAS_SESSION' : 'EMPTY',
        serverState: 'VALIDATING_DB'
      });

      const mockSid = 'sess_xyz987';

      trace.push({
        log: `Server generates Session ID "${mockSid}". Writes record to Redis: {"${mockSid}": {"user": "${email}"}}.`,
        activeNode: 'Redis',
        activeEdge: 'Server-Redis',
        packet: { text: 'Set Session', x: 250, y: 110 },
        cookieState: sessionId ? 'HAS_COOKIE' : 'EMPTY',
        redisState: 'HAS_SESSION',
        serverState: 'WRITING_REDIS'
      });

      trace.push({
        log: `Server returns HTTP 200 response with Cookie header: "Set-Cookie: connect.sid=${mockSid}; HttpOnly; Secure".`,
        activeNode: 'Client',
        activeEdge: 'Client-Server',
        packet: { text: 'Set-Cookie', x: 140, y: 70 },
        cookieState: sessionId ? 'HAS_COOKIE' : 'EMPTY',
        redisState: 'HAS_SESSION',
        serverState: 'RESPONDING'
      });

      trace.push({
        log: `Client Browser receives cookie and saves it securely. Cookies will now automatically attach to this domain's requests.`,
        activeNode: 'Client',
        activeEdge: null,
        packet: null,
        cookieState: 'HAS_COOKIE',
        redisState: 'HAS_SESSION',
        serverState: 'COMPLETED'
      });

      setSessionId(mockSid);
    } else {
      if (!sessionId) {
        alert('Please run the Login action first to establish a session cookie!');
        return;
      }

      trace.push({
        log: `Client fetches protected route. Browser automatically attaches header: "Cookie: connect.sid=${sessionId}".`,
        activeNode: 'Client',
        activeEdge: null,
        packet: { text: 'Cookie header', x: 70, y: 70 },
        cookieState: 'HAS_COOKIE',
        redisState: 'HAS_SESSION',
        serverState: 'RECEIVING_REQUEST'
      });

      trace.push({
        log: `Server extracts Cookie. Queries Redis Session Store to look up data for key "${sessionId}".`,
        activeNode: 'Redis',
        activeEdge: 'Server-Redis',
        packet: { text: 'Read Session', x: 250, y: 110 },
        cookieState: 'HAS_COOKIE',
        redisState: 'HAS_SESSION',
        serverState: 'LOOKING_UP_REDIS'
      });

      trace.push({
        log: `Session found! Authenticated as "${email}". Server resolves request successfully.`,
        activeNode: 'Server',
        activeEdge: null,
        packet: null,
        cookieState: 'HAS_COOKIE',
        redisState: 'HAS_SESSION',
        serverState: 'AUTHORIZED'
      });

      trace.push({
        log: `Server returns protected database details in JSON payload.`,
        activeNode: 'Client',
        activeEdge: 'Client-Server',
        packet: { text: 'Protected Data', x: 140, y: 70 },
        cookieState: 'HAS_COOKIE',
        redisState: 'HAS_SESSION',
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
    setSessionId('');
    setSteps([
      {
        log: 'Select an action: Login to create a Session, or execute a Protected Request using the cookie.',
        activeNode: null,
        activeEdge: null,
        packet: null,
        cookieState: 'EMPTY',
        redisState: 'EMPTY',
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
        <option value="login">1. Session Login (Stateful)</option>
        <option value="request">2. Request with Cookie</option>
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
        Clear Session
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Browser Cookies Store</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          color: activeStep.cookieState === 'HAS_COOKIE' ? '#10b981' : 'var(--text-tertiary)'
        }}>
          {activeStep.cookieState === 'HAS_COOKIE' ? (
            <div>
              <strong>Cookie Name: connect.sid</strong>
              <div style={{ fontSize: '0.65rem', marginTop: '0.2rem' }}>
                Value: {sessionId}
              </div>
            </div>
          ) : (
            'No cookies saved for this domain'
          )}
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Redis Session Store (Stateful)</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          color: activeStep.redisState === 'HAS_SESSION' ? 'var(--brand-cyan)' : 'var(--text-tertiary)'
        }}>
          {activeStep.redisState === 'HAS_SESSION' ? (
            <div>
              <strong>Key: {sessionId}</strong>
              <div style={{ fontSize: '0.65rem', marginTop: '0.2rem' }}>
                Value: {`{"user": "${email}"}`}
              </div>
            </div>
          ) : (
            'Empty Session Store'
          )}
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>Session-Based Authentication</strong> is a stateful authentication model where user session states are managed directly by the server:</p>
      <ul>
        <li><strong>Cookie Transmission:</strong> When a user logs in, the server creates a session entry in a database or in-memory store (e.g. Redis) and returns a unique session ID to the client inside a <code>Set-Cookie</code> header.</li>
        <li><strong>Automatic Browser Handling:</strong> Browsers store cookies and automatically attach them to all subsequent requests pointing to that domain.</li>
        <li><strong>Stateful Storage:</strong> Unlike stateless JWTs, the server must query the session database on *every* single incoming request to resolve the user's identity, creating database I/O overhead.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Session Authentication as a **Hotel Luggage Checkroom Service**:</p>
      <ul>
        <li>You hand the porter your bags (Credentials).</li>
        <li>The porter places your bags in a locked cage (Redis Session Store), generates a plastic token ticket labeled "Room 987" (Session ID), and hands you the ticket.</li>
        <li>Every time you want an item from your bag, you present the ticket to the porter. The porter has to walk back to the checkroom, find cage 987 (Database Query), confirm it is yours, and retrieve your coat.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Local Memory Session Storage:</strong> Storing session objects in the server's local RAM. If you scale up to 3 servers behind a load balancer, subsequent requests routed to other servers will fail to find the session (session loss). <em>Fix: Use centralized stores like Redis.</em></li>
      <li><strong>Missing Cookie Protections:</strong> Failing to configure cookie security flags (HttpOnly prevents XSS theft; Secure prevents transmission over un-encrypted HTTP).</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What are the main advantages of Session-based auth over JWT token auth?',
      a: 'Session auth allows instant revocation. Since the server controls the session database, deleting the session from Redis instantly logs the user out. With JWT, tokens are valid until they naturally expire unless complex blacklists are created.'
    },
    {
      q: 'What is CSRF (Cross-Site Request Forgery) and how does it relate to Session cookies?',
      a: 'Since browsers automatically attach cookies to all matching domain requests, a malicious site could trick a user into clicking a link that triggers requests to the bank (e.g. transfer money). The browser attaches the cookie, and the server authorizes it. Fix: Use Anti-CSRF tokens or SameSite cookie flags.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which flag prevents cookies from being accessed via client-side JavaScript (e.g. document.cookie)?',
      options: [
        'Secure',
        'SameSite',
        'HttpOnly',
        'Domain'
      ],
      correctIdx: 2,
      explanation: 'The HttpOnly flag blocks client-side scripts from reading cookie values, mitigating cross-site scripting (XSS) token thefts.'
    },
    {
      question: 'What is the primary scaling bottleneck of Session Authentication?',
      options: [
        'Cookies are too large to transmit',
        'The server must execute a database look-up on every single request to verify the session ID',
        'Browsers reject cookies on mobile devices',
        'Cryptographic hashing is slow'
      ],
      correctIdx: 1,
      explanation: 'Because session data is stored on the server, every request requires checking the session database, adding network/lookup latency to every API call.'
    }
  ];

  return (
    <VisualizerShell
      title="Session Authentication Simulator"
      subtitle="Contrast stateful session cookie lookups in Redis against stateless tokens."
      timeComplexity="O(1) database read lookup"
      spaceComplexity="O(S) session store memory scale"
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
        
        <svg width="400" height="150" style={{ overflow: 'visible' }}>
          {/* Edge links */}
          <line x1="50" y1="65" x2="200" y2="35" stroke={activeStep.activeEdge === 'Client-Server' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
          <line x1="200" y1="35" x2="200" y2="105" stroke={activeStep.activeEdge === 'Server-Redis' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
          <line x1="200" y1="35" x2="350" y2="35" stroke={activeStep.activeEdge === 'Server-DB' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth="1.5" />

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
            <text x="50" y="78" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.5rem">(Cookie Storage)</text>
          </g>

          {/* Server Node */}
          <g>
            <rect
              x="165"
              y="10"
              width="70"
              height="50"
              fill={activeStep.activeNode === 'Server' ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)'}
              stroke={activeStep.activeNode === 'Server' ? '#1591DC' : 'var(--bg-tertiary)'}
              strokeWidth="2"
              rx="4"
            />
            <text x="200" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="0.75rem" fontWeight="bold">Server</text>
            <text x="200" y="45" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.5rem">(Session Mgr)</text>
          </g>

          {/* DB Node */}
          <g>
            <rect
              x="315"
              y="10"
              width="70"
              height="50"
              fill={activeStep.activeNode === 'Database' ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)'}
              stroke={activeStep.activeNode === 'Database' ? '#1591DC' : 'var(--bg-tertiary)'}
              strokeWidth="2"
              rx="4"
            />
            <text x="350" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="0.75rem" fontWeight="bold">Database</text>
            <text x="350" y="45" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.5rem">(User Creds)</text>
          </g>

          {/* Redis Node */}
          <g>
            <rect
              x="165"
              y="95"
              width="70"
              height="45"
              fill={activeStep.activeNode === 'Redis' ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)'}
              stroke={activeStep.activeNode === 'Redis' ? '#1591DC' : 'var(--bg-tertiary)'}
              strokeWidth="2"
              rx="4"
            />
            <text x="200" y="117" textAnchor="middle" fill="#FFFFFF" fontSize="0.75rem" fontWeight="bold">Redis</text>
            <text x="200" y="128" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.5rem">(Session Store)</text>
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
