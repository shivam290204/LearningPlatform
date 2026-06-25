import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function CircuitBreakerVisualizer() {
  const [breakerState, setBreakerState] = useState('CLOSED'); // 'CLOSED', 'OPEN', 'HALF_OPEN'
  const [serviceStatus, setServiceStatus] = useState('CRASHED'); // 'HEALTHY', 'CRASHED'
  const [failureCount, setFailureCount] = useState(0); // Max 3
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const [steps, setSteps] = useState([
    {
      log: 'Circuit Breaker initialized in CLOSED state. Downstream service is currently CRASHED.',
      breakerState: 'CLOSED',
      failureCount: 0,
      activeNode: null,
      activeEdge: null,
      packet: null
    }
  ]);

  // Cooldown countdown timer when breaker is OPEN
  useEffect(() => {
    let timer = null;
    if (breakerState === 'OPEN' && cooldownRemaining > 0) {
      timer = setInterval(() => {
        setCooldownRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setBreakerState('HALF_OPEN');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [breakerState, cooldownRemaining]);

  const handleSendRequest = () => {
    let trace = [];

    // Scenario 1: CLOSED state
    if (breakerState === 'CLOSED') {
      trace.push({
        log: 'CLOSED State: Client request passes directly through the breaker to downstream API.',
        breakerState: 'CLOSED',
        failureCount,
        activeNode: 'Breaker',
        activeEdge: 'Client-Breaker',
        packet: { text: 'API Req', x: 80, y: 100 }
      });

      if (serviceStatus === 'CRASHED') {
        const nextFailCount = failureCount + 1;
        setFailureCount(nextFailCount);

        if (nextFailCount >= 3) {
          // Trip the breaker
          trace.push({
            log: `Downstream service failed. Total consecutive failures: ${nextFailCount}/3. Tripping circuit to OPEN.`,
            breakerState: 'OPEN',
            failureCount: nextFailCount,
            activeNode: 'Breaker',
            activeEdge: 'Breaker-Service',
            packet: { text: 'Timeout Err', x: 250, y: 100 }
          });

          setBreakerState('OPEN');
          setCooldownRemaining(8); // 8 seconds cooldown
        } else {
          trace.push({
            log: `Downstream service failed (Timeout). Incrementing failure counter (${nextFailCount}/3).`,
            breakerState: 'CLOSED',
            failureCount: nextFailCount,
            activeNode: 'Breaker',
            activeEdge: 'Breaker-Service',
            packet: { text: 'Timeout Err', x: 250, y: 100 }
          });
        }
      } else {
        // Healthy request
        setFailureCount(0);
        trace.push({
          log: 'Downstream service responded successfully. Failure counter reset to 0.',
          breakerState: 'CLOSED',
          failureCount: 0,
          activeNode: 'Service',
          activeEdge: 'Breaker-Service',
          packet: { text: '200 OK JSON', x: 250, y: 100 }
        });
      }
    } 
    // Scenario 2: OPEN state
    else if (breakerState === 'OPEN') {
      trace.push({
        log: 'OPEN State: Breaker short-circuits request immediately! No traffic reaches the down service.',
        breakerState: 'OPEN',
        failureCount,
        activeNode: 'Breaker',
        activeEdge: 'Client-Breaker',
        packet: { text: 'Fast Fail', x: 80, y: 100 }
      });

      trace.push({
        log: 'Breaker returns fallback cached data (static profile placeholder) to Client. Latency: 1ms.',
        breakerState: 'OPEN',
        failureCount,
        activeNode: 'Breaker',
        activeEdge: 'Breaker-Client',
        packet: { text: 'Fallback Data', x: 80, y: 100 }
      });
    } 
    // Scenario 3: HALF_OPEN state
    else if (breakerState === 'HALF_OPEN') {
      trace.push({
        log: 'HALF-OPEN State: Breaker permits a single trial request to test service recovery.',
        breakerState: 'HALF_OPEN',
        failureCount: 0,
        activeNode: 'Breaker',
        activeEdge: 'Client-Breaker',
        packet: { text: 'Test Req', x: 80, y: 100 }
      });

      if (serviceStatus === 'CRASHED') {
        // Failed trial, trip back to open
        trace.push({
          log: 'Trial request failed! Downstream service still unhealthy. Tripping circuit back to OPEN and resetting cooldown timer.',
          breakerState: 'OPEN',
          failureCount: 3,
          activeNode: 'Breaker',
          activeEdge: 'Breaker-Service',
          packet: { text: 'Crash Err', x: 250, y: 100 }
        });
        setBreakerState('OPEN');
        setFailureCount(3);
        setCooldownRemaining(8);
      } else {
        // Recovered
        trace.push({
          log: 'Trial request succeeded! Service has fully recovered. Closing the circuit breaker.',
          breakerState: 'CLOSED',
          failureCount: 0,
          activeNode: 'Service',
          activeEdge: 'Breaker-Service',
          packet: { text: '200 OK JSON', x: 250, y: 100 }
        });
        setBreakerState('CLOSED');
        setFailureCount(0);
      }
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
    setBreakerState('CLOSED');
    setServiceStatus('CRASHED');
    setFailureCount(0);
    setCooldownRemaining(0);
    setSteps([
      {
        log: 'Circuit Breaker initialized in CLOSED state. Downstream service is currently CRASHED.',
        breakerState: 'CLOSED',
        failureCount: 0,
        activeNode: null,
        activeEdge: null,
        packet: null
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];
  const activeState = activeStep.breakerState;
  const activeFails = activeStep.failureCount;

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Downstream API Health:</span>
      <select
        value={serviceStatus}
        onChange={(e) => setServiceStatus(e.target.value)}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        <option value="CRASHED">Unhealthy / Timed Out (crashed)</option>
        <option value="HEALTHY">Healthy / Fast Responses</option>
      </select>

      <button className="btn-viz-action btn-add" onClick={handleSendRequest}>
        Send Client Request
      </button>

      {breakerState === 'OPEN' && (
        <button className="btn-viz-action btn-clear" onClick={() => setCooldownRemaining(0)}>
          Fast-Forward Cooldown Clock (Trigger Half-Open)
        </button>
      )}

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Breaker Diagnostics</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>State: <strong style={{
            color: activeState === 'CLOSED' ? '#10b981' : (activeState === 'OPEN' ? '#ef4444' : '#f59e0b')
          }}>{activeState}</strong></div>
          <div>Failure Counter: <span>{activeFails} / 3</span></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Failsafe Telemetry</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Cooldown Timer: <strong style={{ color: cooldownRemaining > 0 ? '#f59e0b' : '#10b981' }}>{cooldownRemaining}s</strong></div>
          <div>Response Type: <span>{activeState === 'OPEN' ? 'Cached Static Fallback' : 'Real Downstream Hop'}</span></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>The <strong>Circuit Breaker Pattern</strong> prevents cascading service failures in microservice architectures by stopping requests to unhealthy downstream APIs:</p>
      <ul>
        <li><strong>CLOSED State:</strong> Normal operation. All requests pass through. If failures exceed a set threshold, the circuit trips to OPEN.</li>
        <li><strong>OPEN State:</strong> Requests fail fast immediately without hitting the downstream server. This protects overloaded dependencies and gives them time to recover, while clients receive instant fallback responses.</li>
        <li><strong>HALF-OPEN State:</strong> After a cooldown timer, the breaker allows a single test request through. If it succeeds, the circuit closes (recovered). If it fails, the breaker trips back to OPEN (resets timer).</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of a Circuit Breaker as **an electrical fuse in your house**:</p>
      <ul>
        <li><strong>CLOSED (Normal Fuse):</strong> Electricity flows to your toaster. You can toast bread safely.</li>
        <li><strong>Tripping (OPEN Fuse):</strong> If there is a massive short circuit (service crash), the fuse blows (trips to OPEN), cutting off power. This prevents your house from catching fire (cascading server overload).</li>
        <li><strong>Reset (HALF-OPEN Fuse):</strong> You switch the fuse box lever halfway to test if the short circuit is fixed. If the toaster still sparks, the fuse trips open again immediately.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>No Fallback Options:</strong> Tripping to OPEN but simply returning 500 errors to clients. Circuit breakers should always return stale cache data or static client-side placeholders to maintain a clean user experience.</li>
      <li><strong>Mismatched Timeouts:</strong> Setting circuit breaker fail thresholds higher than HTTP timeouts, causing client threads to hang indefinitely before the breaker can trip.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Detail the three main states of a Circuit Breaker.',
      a: 'CLOSED: Normal traffic flow. Requests reach the downstream service. Failure count is monitored.\nOPEN: The service is failing. Requests fail fast immediately, bypass the downstream server, and return static fallbacks.\nHALF-OPEN: Test state after a cooldown timer. Permits a single trial request. If successful, the circuit closes; if it fails, it return to the OPEN state.'
    },
    {
      q: 'How does a Circuit Breaker prevent cascading failures in microservices?',
      a: 'When a downstream microservice crashes or slows down, parent services waiting on synchronous network responses can exhaust their own thread pools. By failing fast immediately, the circuit breaker prevents these threads from locking up, isolating the crash.'
    }
  ];

  const quizQuestions = [
    {
      question: 'In which state does a Circuit Breaker block requests immediately and return cached static data?',
      options: [
        'CLOSED',
        'OPEN',
        'HALF-OPEN',
        'UNLOCKED'
      ],
      correctIdx: 1,
      explanation: 'In the OPEN state, the breaker prevents requests from traveling downstream, returning a fallback response instantly.'
    },
    {
      question: 'What triggers a transition from CLOSED to OPEN in a Circuit Breaker system?',
      options: [
        'A single successful request',
        'The expiration of the cooldown timer',
        'Consecutive request failures exceeding the threshold limit',
        'A change in database replication status'
      ],
      correctIdx: 2,
      explanation: 'The circuit breaker trips to OPEN when failures exceed the threshold (e.g. 3 consecutive timeouts) to protect downstream nodes.'
    }
  ];

  return (
    <VisualizerShell
      title="Circuit Breaker Pattern"
      subtitle="Analyze state loops (Closed -> Open -> Half-Open). Monitor failure limits and test fallback caches."
      timeComplexity="O(1) state lookup"
      spaceComplexity="O(1) counter storage"
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
          {/* Edge lines */}
          <line x1="50" y1="90" x2="180" y2="90" stroke={activeStep.activeEdge === 'Client-Breaker' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth="2" />
          <line
            x1="220"
            y1="90"
            x2="350"
            y2="90"
            stroke={activeStep.activeEdge === 'Breaker-Service' ? (serviceStatus === 'HEALTHY' ? '#10b981' : '#ef4444') : 'var(--bg-tertiary)'}
            strokeWidth="2"
            strokeDasharray={activeState === 'OPEN' ? '4 4' : '0'}
          />

          {/* Client Node */}
          <g>
            <circle cx="35" cy="90" r="16" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="35" y="93" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Client</text>
          </g>

          {/* Circuit Breaker Node */}
          <g>
            <circle
              cx="200"
              cy="90"
              r="24"
              fill={activeState === 'CLOSED' ? 'rgba(16,185,129,0.1)' : (activeState === 'OPEN' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)')}
              stroke={activeState === 'CLOSED' ? '#10b981' : (activeState === 'OPEN' ? '#ef4444' : '#f59e0b')}
              strokeWidth="3.5"
            />
            <text x="200" y="93" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">FUSE</text>
            <text
              x="200"
              y="126"
              textAnchor="middle"
              fill={activeState === 'CLOSED' ? '#10b981' : (activeState === 'OPEN' ? '#ef4444' : '#f59e0b')}
              fontSize="0.55rem"
              fontWeight="bold"
            >
              {activeState}
            </text>
          </g>

          {/* Downstream Service */}
          <g>
            <rect
              x="350"
              y="70"
              width="70"
              height="40"
              fill={serviceStatus === 'HEALTHY' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}
              stroke={serviceStatus === 'HEALTHY' ? '#10b981' : '#ef4444'}
              strokeWidth="2.5"
              rx="3"
            />
            <text x="385" y="90" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Target API</text>
            <text
              x="385"
              y="102"
              textAnchor="middle"
              fill={serviceStatus === 'HEALTHY' ? '#10b981' : '#ef4444'}
              fontSize="0.45rem"
            >
              {serviceStatus}
            </text>
          </g>

          {/* Cooldown timer overlay floating text */}
          {breakerState === 'OPEN' && cooldownRemaining > 0 && (
            <text x="200" y="50" textAnchor="middle" fill="#f59e0b" fontSize="0.6rem" fontWeight="bold">
              Cooldown: {cooldownRemaining}s
            </text>
          )}

          {/* Animated Packet */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.35s ease' }}>
              <rect x={activeStep.packet.x - 30} y={activeStep.packet.y - 10} width="60" height="15" fill="var(--bg-primary)" stroke="#f59e0b" strokeWidth="1.2" rx="2" />
              <text x={activeStep.packet.x} y={activeStep.packet.y + 1} textAnchor="middle" fill="#f59e0b" fontSize="0.38rem" fontWeight="bold">
                {activeStep.packet.text}
              </text>
            </g>
          )}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></div> Closed (Healthy)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div> Open (Short-Circuited)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div> Half-Open (Test Trial)
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
