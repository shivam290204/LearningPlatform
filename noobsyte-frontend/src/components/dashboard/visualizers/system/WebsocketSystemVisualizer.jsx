import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function WebsocketSystemVisualizer() {
  const [connectionMode, setConnectionMode] = useState('WEBSOCKET'); // 'POLLING' or 'WEBSOCKET'
  const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED'); // 'DISCONNECTED', 'HTTP_HANDSHAKE', 'CONNECTED'
  const [logs, setLogs] = useState(['Select connection type and interact.']);
  const [messages, setMessages] = useState(['Welcome to Chat!']);

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const [steps, setSteps] = useState([
    {
      log: 'WebSocket simulator ready. Select mode and trigger handshake or polling requests.',
      status: 'DISCONNECTED',
      activeNode: null,
      activeEdge: null,
      packet: null,
      messages: ['Welcome to Chat!']
    }
  ]);

  const handleConnect = () => {
    if (connectionMode === 'POLLING') {
      alert('HTTP Polling is stateless. No persistent handshake connection is created!');
      return;
    }
    if (connectionStatus === 'CONNECTED') return;

    let trace = [];

    // 1. Send HTTP Upgrade
    trace.push({
      log: 'Client sends HTTP GET request with "Upgrade: websocket" and "Connection: Upgrade" headers.',
      status: 'HTTP_HANDSHAKE',
      activeNode: 'Client',
      activeEdge: 'Handshake-Request',
      packet: { text: 'GET /chat (Upgrade)', x: 120, y: 100 },
      messages: [...messages]
    });

    // 2. Server Switching Protocols
    trace.push({
      log: 'Server validates handshake headers and returns HTTP 101 Switching Protocols response.',
      status: 'HTTP_HANDSHAKE',
      activeNode: 'Server',
      activeEdge: 'Handshake-Response',
      packet: { text: '101 Switching Protocols', x: 230, y: 100 },
      messages: [...messages]
    });

    // 3. Persistent TCP Open
    trace.push({
      log: 'HTTP connection upgraded to a persistent, full-duplex TCP WebSocket tunnel. Bidirectional streams open.',
      status: 'CONNECTED',
      activeNode: 'Tunnel',
      activeEdge: 'Websocket-Tunnel',
      packet: null,
      messages: [...messages]
    });

    setConnectionStatus('CONNECTED');
    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleSendMessage = (sender = 'Client') => {
    let trace = [];
    const textMsg = sender === 'Client' ? 'Hello Server!' : 'Alert: New Activity!';
    const updatedMessages = [...messages, `${sender}: ${textMsg}`];

    if (connectionMode === 'POLLING') {
      // HTTP Polling flow: Client has to request first
      trace.push({
        log: 'HTTP Polling: Client sends periodic GET request (polling) to check for new messages.',
        status: 'DISCONNECTED',
        activeNode: 'Client',
        activeEdge: 'Polling-Req',
        packet: { text: 'GET /messages', x: 120, y: 80 },
        messages: [...messages]
      });

      trace.push({
        log: `Server processes polling request and returns new message: "${textMsg}". HTTP 200 OK.`,
        status: 'DISCONNECTED',
        activeNode: 'Server',
        activeEdge: 'Polling-Res',
        packet: { text: '200 OK JSON', x: 230, y: 80 },
        messages: updatedMessages
      });
    } else {
      // WEBSOCKET flow
      if (connectionStatus !== 'CONNECTED') {
        alert('WebSocket is disconnected. Click Connect Handshake first!');
        return;
      }

      if (sender === 'Client') {
        trace.push({
          log: `WebSocket: Client pushes message payload frame ("${textMsg}") directly down the open TCP tunnel. Low header overhead (2-10 bytes).`,
          status: 'CONNECTED',
          activeNode: 'Client',
          activeEdge: 'Websocket-Tunnel',
          packet: { text: textMsg, x: 120, y: 100 },
          messages: [...messages]
        });
      } else {
        trace.push({
          log: `WebSocket: Server pushes notification frame ("${textMsg}") to Client instantly without waiting for a request.`,
          status: 'CONNECTED',
          activeNode: 'Server',
          activeEdge: 'Websocket-Tunnel',
          packet: { text: textMsg, x: 230, y: 100 },
          messages: [...messages]
        });
      }

      trace.push({
        log: 'Message successfully delivered and rendered by connection endpoint.',
        status: 'CONNECTED',
        activeNode: 'Tunnel',
        activeEdge: 'Websocket-Tunnel',
        packet: null,
        messages: updatedMessages
      });
    }

    setMessages(updatedMessages);
    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setConnectionStatus('DISCONNECTED');
    const initM = ['Welcome to Chat!'];
    setMessages(initM);
    setSteps([
      {
        log: 'WebSockets/Polling system reset.',
        status: 'DISCONNECTED',
        activeNode: null,
        activeEdge: null,
        packet: null,
        messages: initM
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];
  const activeMsgs = activeStep.messages;

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Protocol Mode:</span>
      <select
        value={connectionMode}
        onChange={(e) => {
          setConnectionMode(e.target.value);
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
        <option value="WEBSOCKET">WebSocket (Persistent Handshake)</option>
        <option value="POLLING">Short HTTP Polling (Stateless Requests)</option>
      </select>

      {connectionMode === 'WEBSOCKET' && connectionStatus !== 'CONNECTED' && (
        <button className="btn-viz-action btn-add" onClick={handleConnect}>
          Establish Upgrade Handshake
        </button>
      )}

      <button className="btn-viz-action btn-add" onClick={() => handleSendMessage('Client')}>
        Client Sends: "Hello Server"
      </button>

      {connectionMode === 'WEBSOCKET' && (
        <button className="btn-viz-action" style={{ backgroundColor: '#a855f7', borderColor: '#a855f7' }} onClick={() => handleSendMessage('Server')}>
          Server Pushes Event
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
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Active Chat Stream</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.7rem',
          maxHeight: '90px',
          overflowY: 'auto'
        }}>
          {activeMsgs.map((m, index) => (
            <div key={index} style={{ marginBottom: '0.15rem' }}>
              {m}
            </div>
          ))}
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Protocol Metrics</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Connection: <strong style={{ color: activeStep.status === 'CONNECTED' ? '#10b981' : '#ef4444' }}>{activeStep.status}</strong></div>
          <div>Header Size: <span style={{ color: connectionMode === 'WEBSOCKET' ? '#10b981' : '#f59e0b' }}>
            {connectionMode === 'WEBSOCKET' ? '2-10 Bytes (Frames)' : '500-1000 Bytes (HTTP Headers)'}
          </span></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>WebSockets</strong> provide a persistent, full-duplex communication channel over a single TCP connection, ideal for real-time applications:</p>
      <ul>
        <li><strong>HTTP Upgrade Handshake:</strong> Begins as a standard HTTP GET request containing headers <code>Upgrade: websocket</code>. The server replies with <code>101 Switching Protocols</code>, shifting the socket to a TCP tunnel.</li>
        <li><strong>Full-Duplex:</strong> Both client and server can transmit data frame packets concurrently without waiting for requests.</li>
        <li><strong>Stateless Polling Overhead:</strong> In contrast, HTTP polling requires clients to repeatedly query HTTP endpoints to check for updates. Each polling check includes large HTTP header overhead (cookies, user-agents) and returns empty responses (HTTP 204) most of the time.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of WebSockets vs Polling as **a Telephone Call vs sending Mail**:</p>
      <ul>
        <li><strong>HTTP Polling (Mailbox checks):</strong> Walking out to the mailbox every 5 minutes to check if your friend sent a letter. Most trips are empty (overhead waste).</li>
        <li><strong>WebSockets (Telephone Call):</strong> Calling your friend. Once the line connects (Handshake), both of you can speak and listen in real-time continuously until either hangs up.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>No Heartbeat Ping/Pong:</strong> Persistent connections can be terminated silently by firewalls or routers during inactivity. <em>Fix: Implement periodic heartbeat ping/pong messages to keep connections alive.</em></li>
      <li><strong>Infinite Scale expectations:</strong> WebSockets hold active TCP connections on host servers. Unlike stateless HTTP APIs that scale easily, WebSockets consume server socket ports, requiring specialized horizontal load balancers.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Detail the steps of a WebSocket upgrade handshake.',
      a: 'The client sends an HTTP GET request containing "Upgrade: websocket" and "Connection: Upgrade" headers. The server verifies the request and returns an HTTP 101 Switching Protocols status code. The TCP socket remains open and transitions into a full-duplex WebSocket framing channel.'
    },
    {
      q: 'How does WebSocket scaling differ from REST API scaling?',
      a: 'REST API requests are stateless and short-lived, allowing any load balancer to route traffic to any server. WebSockets are stateful, persistent TCP connections. Servers must hold connection states, requiring sticky routing, Redis Pub/Sub backplanes to sync messages, and custom load balancers.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which HTTP status code is returned by a server indicating a successful upgrade handshake connection?',
      options: [
        'HTTP 100 Continue',
        'HTTP 101 Switching Protocols',
        'HTTP 200 OK',
        'HTTP 426 Upgrade Required'
      ],
      correctIdx: 1,
      explanation: 'HTTP 101 informs the client browser that the server is switching protocols as requested in the handshake header.'
    },
    {
      question: 'What is a drawback of Short HTTP Polling compared to WebSockets for real-time chat?',
      options: [
        'It requires local storage buffers',
        'It generates high network overhead and server CPU usage due to repeated empty HTTP request/response loops',
        'It is highly insecure',
        'It does not support JSON responses'
      ],
      correctIdx: 1,
      explanation: 'Polling creates hundreds of empty HTTP requests containing heavy cookies and header data, wasting server threads and network bandwidth.'
    }
  ];

  return (
    <VisualizerShell
      title="WebSockets vs HTTP Polling"
      subtitle="Establish Upgrade handshakes (HTTP 101). Contrast full-duplex TCP tunnels with stateless HTTP polling loops."
      timeComplexity="O(1) frame transfers"
      spaceComplexity="O(C) active client socket connections"
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
        
        <svg width="450" height="180" style={{ overflow: 'visible' }}>
          {/* Main transmission paths */}
          {connectionMode === 'POLLING' ? (
            <g>
              <line x1="50" y1="80" x2="350" y2="80" stroke={activeStep.activeEdge === 'Polling-Req' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
              <line x1="350" y1="100" x2="50" y2="100" stroke={activeStep.activeEdge === 'Polling-Res' ? '#10b981' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
            </g>
          ) : (
            <g>
              {/* Websocket Tunnel Visual box */}
              <rect
                x="80"
                y="80"
                width="240"
                height="30"
                fill={activeStep.status === 'CONNECTED' ? 'rgba(36,224,217,0.06)' : 'transparent'}
                stroke={activeStep.status === 'CONNECTED' ? 'var(--brand-cyan)' : 'var(--bg-tertiary)'}
                strokeWidth="1.5"
                strokeDasharray={activeStep.status === 'CONNECTED' ? '0' : '4 4'}
                rx="3"
              />
              <text x="200" y="98" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.45rem">
                {activeStep.status === 'CONNECTED' ? 'PERSISTENT TCP TUNNEL' : 'NO WS TUNNEL'}
              </text>

              {/* Handshake line references */}
              {activeStep.status === 'HTTP_HANDSHAKE' && (
                <line x1="50" y1="95" x2="350" y2="95" stroke="#f59e0b" strokeWidth="2" />
              )}
            </g>
          )}

          {/* Client Node */}
          <g>
            <circle cx="35" cy="95" r="16" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="35" y="98" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Client</text>
          </g>

          {/* Web Server */}
          <g>
            <rect x="350" y="75" width="70" height="40" fill="var(--bg-secondary)" stroke="#1591DC" strokeWidth="2.5" rx="3" />
            <text x="385" y="98" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Web Server</text>
          </g>

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

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '15px', height: '8px', border: '1.5px solid var(--brand-cyan)', backgroundColor: 'rgba(36,224,217,0.06)' }}></div> WS TCP Connection (Duplex)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '15px', height: '8px', border: '1.5px solid var(--bg-tertiary)', backgroundColor: 'transparent' }}></div> Stateless HTTP Path
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
