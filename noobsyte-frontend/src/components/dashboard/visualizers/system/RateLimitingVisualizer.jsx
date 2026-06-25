import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function RateLimitingVisualizer() {
  const [algo, setAlgo] = useState('TOKEN_BUCKET'); // 'TOKEN_BUCKET' or 'LEAKY_BUCKET'
  const [tokenCount, setTokenCount] = useState(4); // max 5
  const [leakyQueue, setLeakyQueue] = useState([]); // max 5 items
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const [steps, setSteps] = useState([
    {
      log: 'Rate Limiter active. Send individual or burst requests to test algorithms.',
      tokens: 4,
      queue: [],
      activeNode: null,
      activeEdge: null,
      packet: null
    }
  ]);

  // Token Refiller (Interval refilling tokens up to 5)
  useEffect(() => {
    let interval = null;
    if (algo === 'TOKEN_BUCKET') {
      interval = setInterval(() => {
        setTokenCount(prev => {
          if (prev < 5) return prev + 1;
          return prev;
        });
      }, 3000); // 1 token every 3 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [algo]);

  // Leaky Bucket Processor (Interval processing queued water packets)
  useEffect(() => {
    let interval = null;
    if (algo === 'LEAKY_BUCKET') {
      interval = setInterval(() => {
        setLeakyQueue(prev => {
          if (prev.length > 0) {
            return prev.slice(1); // Leaks 1 packet out
          }
          return prev;
        });
      }, 2000); // Process 1 request every 2 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [algo]);

  const handleSendRequest = (isBurst = false) => {
    let trace = [];
    const count = isBurst ? 4 : 1;

    if (algo === 'TOKEN_BUCKET') {
      let currentTokens = tokenCount;

      trace.push({
        log: `Client sends ${count} HTTP request(s) to the server. Evaluating token availability.`,
        tokens: currentTokens,
        queue: [],
        activeNode: 'Client',
        activeEdge: 'Client-Limiter',
        packet: { text: isBurst ? 'Burst 4x' : 'GET req', x: 70, y: 100 }
      });

      let allowedCount = 0;
      let blockedCount = 0;

      for (let i = 0; i < count; i++) {
        if (currentTokens > 0) {
          currentTokens -= 1;
          allowedCount++;
        } else {
          blockedCount++;
        }
      }

      const resultLog = blockedCount > 0
        ? `Token Bucket: Allowed ${allowedCount} request(s), but blocked ${blockedCount} with HTTP 429 Too Many Requests (Token empty).`
        : `Token Bucket: Allowed all ${allowedCount} request(s). Remaining tokens: ${currentTokens}/5.`;

      trace.push({
        log: resultLog,
        tokens: currentTokens,
        queue: [],
        activeNode: blockedCount > 0 ? 'Limiter-Reject' : 'Server',
        activeEdge: blockedCount > 0 ? 'Limiter-Client' : 'Limiter-Server',
        packet: { text: blockedCount > 0 ? '429 Blocked' : '200 OK', x: 230, y: 100 }
      });

      setTokenCount(currentTokens);
    } else {
      // LEAKY_BUCKET
      let currentQueue = [...leakyQueue];
      
      trace.push({
        log: `Client sends ${count} request(s). Checking Leaky Bucket queue capacity.`,
        tokens: 0,
        queue: [...currentQueue],
        activeNode: 'Client',
        activeEdge: 'Client-Limiter',
        packet: { text: isBurst ? 'Burst 4x' : 'GET req', x: 70, y: 100 }
      });

      let allowedCount = 0;
      let blockedCount = 0;

      for (let i = 0; i < count; i++) {
        if (currentQueue.length < 5) {
          currentQueue.push(`Req_${Math.random().toString(36).substr(2, 3)}`);
          allowedCount++;
        } else {
          blockedCount++;
        }
      }

      const resultLog = blockedCount > 0
        ? `Leaky Bucket: Queued ${allowedCount} request(s). Dropped ${blockedCount} requests due to bucket buffer overflow (HTTP 429).`
        : `Leaky Bucket: Buffered ${allowedCount} request(s) in queue. Current queue length: ${currentQueue.length}/5.`;

      trace.push({
        log: resultLog,
        tokens: 0,
        queue: [...currentQueue],
        activeNode: blockedCount > 0 ? 'Limiter-Reject' : 'Server',
        activeEdge: blockedCount > 0 ? 'Limiter-Client' : 'Limiter-Server',
        packet: { text: blockedCount > 0 ? 'Queue Full' : 'Buffered', x: 230, y: 100 }
      });

      setLeakyQueue(currentQueue);
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
    setTokenCount(4);
    setLeakyQueue([]);
    setSteps([
      {
        log: 'Rate Limiter reset. Refilled token bucket and cleared leaky queues.',
        tokens: 4,
        queue: [],
        activeNode: null,
        activeEdge: null,
        packet: null
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];
  const activeTokens = activeStep.tokens;
  const activeQueue = activeStep.queue;

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Algorithm:</span>
      <select
        value={algo}
        onChange={(e) => {
          setAlgo(e.target.value);
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
        <option value="TOKEN_BUCKET">Token Bucket (Refills over time)</option>
        <option value="LEAKY_BUCKET">Leaky Bucket (Constant processing flow)</option>
      </select>

      <button className="btn-viz-action btn-add" onClick={() => handleSendRequest(false)}>
        Send 1 Request
      </button>

      <button className="btn-viz-action btn-clear" onClick={() => handleSendRequest(true)}>
        Send Burst (4 Requests)
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Limiter Internals</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          {algo === 'TOKEN_BUCKET' ? (
            <div>Tokens Remaining: <strong style={{ color: activeTokens === 0 ? '#ef4444' : '#10b981' }}>{activeTokens} / 5</strong></div>
          ) : (
            <div>Queue Utilization: <strong style={{ color: activeQueue.length >= 5 ? '#ef4444' : '#10b981' }}>{activeQueue.length} / 5</strong></div>
          )}
          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
            {algo === 'TOKEN_BUCKET' ? 'Refill Rate: 1 token / 3s' : 'Leaking Rate: 1 packet / 2s'}
          </div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>HTTP Responses</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Last Operation: <span>{activeStep.packet ? activeStep.packet.text : 'Idle'}</span></div>
          <div>Result status: <strong style={{ color: activeStep.log.includes('blocked') || activeStep.log.includes('Dropped') ? '#ef4444' : '#10b981' }}>
            {activeStep.log.includes('blocked') || activeStep.log.includes('Dropped') ? '429 Too Many Requests' : '200 OK'}
          </strong></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>Rate Limiting</strong> restricts the number of requests a user or client can make to a server in a given timeframe to prevent abuse, resource starvation, and DDoS attacks:</p>
      <ul>
        <li><strong>Token Bucket:</strong> A bucket holds up to N tokens, refilled at a constant rate. Each incoming request consumes 1 token. If the bucket is empty, requests are rejected. Supports handling bursts of traffic.</li>
        <li><strong>Leaky Bucket:</strong> Requests enter a FIFO queue (the bucket). The queue releases requests to the server at a constant, steady rate (leaks out). If the queue is full, new requests overflow and are discarded. Smoothes out traffic spikes.</li>
        <li><strong>HTTP 429:</strong> The standard response status code indicating the user has sent too many requests in a given amount of time.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Rate Limiting algorithms as **Admissions at an Amusement Park Ride**:</p>
      <ul>
        <li><strong>Token Bucket (Fast-Pass Tickets):</strong> A dispatcher hands out up to 5 fast-pass tickets every minute. If tickets are available, clients grab them and ride immediately (traffic bursts). If tickets run out, you must wait for the next ticket print.</li>
        <li><strong>Leaky Bucket (Waiting Line):</strong> A line holds a max of 5 people. People join the queue, and every 2 seconds, 1 person is allowed onto the ride. If the line grows longer than 5 people, the gate closes and additional arrivals are turned away.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Local Rate Limiting on Scaled Servers:</strong> Enforcing rates in local server memory. If a client distributes requests across 5 servers, they can bypass limits. <em>Fix: Use centralized rate limiting inside Redis or an API Gateway.</em></li>
      <li><strong>Too Strict Thresholds:</strong> Setting rate limits too low, blocking legitimate search indexing bots, API clients, or fast-clicking users.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Contrast the Token Bucket and Leaky Bucket algorithms.',
      a: 'Token Bucket allows bursts of traffic up to the maximum bucket capacity and refills at a steady rate. Leaky Bucket buffers incoming requests in a queue and processes them at a strict, uniform rate, smoothing spikes but introducing processing delays for traffic bursts.'
    },
    {
      q: 'How would you implement a distributed rate limiter across a server cluster?',
      a: 'By storing rate limit counters in a shared high-performance cache (like Redis) using sorted sets or sliding window logs to track timestamps of user requests globally.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which rate limiting algorithm is best suited for systems that must process requests at a strict, steady, and constant speed?',
      options: [
        'Token Bucket',
        'Leaky Bucket',
        'Random Drop',
        'Write-Back Caching'
      ],
      correctIdx: 1,
      explanation: 'Leaky Bucket forces a constant execution output flow rate by queuing requests and letting them "leak" to servers at a fixed speed.'
    },
    {
      question: 'What is the standard HTTP response status code for a client that has exceeded its rate limit?',
      options: [
        'HTTP 401 Unauthorized',
        'HTTP 403 Forbidden',
        'HTTP 429 Too Many Requests',
        'HTTP 503 Service Unavailable'
      ],
      correctIdx: 2,
      explanation: 'HTTP 429 is the dedicated status code for client request limit exhaustions.'
    }
  ];

  return (
    <VisualizerShell
      title="Rate Limiter Simulator"
      subtitle="Analyze Token Bucket and Leaky Bucket algorithms under bursts. Observe HTTP 429 rejections."
      timeComplexity="O(1) checks"
      spaceComplexity="O(1) tracking size"
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
          {/* Client to Limiter line */}
          <line x1="50" y1="100" x2="160" y2="100" stroke={activeStep.activeEdge === 'Client-Limiter' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
          {/* Limiter to Server line */}
          <line x1="220" y1="100" x2="350" y2="100" stroke={activeStep.activeEdge === 'Limiter-Server' ? '#10b981' : 'var(--bg-tertiary)'} strokeWidth="1.5" />

          {/* Client Node */}
          <g>
            <circle cx="35" cy="100" r="16" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="35" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Client</text>
          </g>

          {/* Limiter Box (Changing visually based on algo) */}
          <g>
            <rect x="150" y="55" width="80" height="90" fill="var(--bg-secondary)" stroke="#1591DC" strokeWidth="2.5" rx="4" />
            <text x="190" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Rate Limiter</text>
            
            {algo === 'TOKEN_BUCKET' ? (
              // Draw tokens inside
              <g>
                <circle cx="190" cy="100" r="15" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1.5" />
                {Array.from({ length: Math.min(5, tokenCount) }).map((_, i) => (
                  <circle key={i} cx={(178 + i * 6).toString()} cy="100" r="2.5" fill="#f59e0b" />
                ))}
                <text x="190" y="128" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.4rem">Tokens: {tokenCount}</text>
              </g>
            ) : (
              // Draw leaky queue slots
              <g>
                <rect x="165" y="85" width="50" height="30" fill="var(--bg-primary)" stroke="var(--bg-tertiary)" strokeWidth="1" />
                {activeQueue.map((_, i) => (
                  <rect key={i} x={(168 + i * 9).toString()} y="90" width="6" height="20" fill="#f59e0b" />
                ))}
                <text x="190" y="130" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.4rem">Queue: {activeQueue.length}/5</text>
              </g>
            )}
          </g>

          {/* Target Web Server */}
          <g>
            <rect x="350" y="80" width="65" height="40" fill="var(--bg-secondary)" stroke="#10b981" strokeWidth="2.5" rx="3" />
            <text x="382" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">API Server</text>
          </g>

          {/* Animated Packet */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.35s ease' }}>
              <rect x={activeStep.packet.x - 26} y={activeStep.packet.y - 10} width="52" height="15" fill="var(--bg-primary)" stroke="#f59e0b" strokeWidth="1.2" rx="2" />
              <text x={activeStep.packet.x} y={activeStep.packet.y + 1} textAnchor="middle" fill="#f59e0b" fontSize="0.38rem" fontWeight="bold">
                {activeStep.packet.text}
              </text>
            </g>
          )}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div> Active Token / Buffered Request
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '15px', height: '8px', border: '1.5px solid #1591DC', backgroundColor: 'transparent' }}></div> Limiter Block
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
