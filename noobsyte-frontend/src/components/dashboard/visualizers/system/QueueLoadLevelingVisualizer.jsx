import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function QueueLoadLevelingVisualizer() {
  const [levelingEnabled, setLevelingEnabled] = useState(true);
  const [queue, setQueue] = useState([]);
  const [dbLoad, setDbLoad] = useState(15); // Database CPU utilization %
  const [dbStatus, setDbStatus] = useState('ONLINE'); // 'ONLINE', 'OVERLOADED'

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const [steps, setSteps] = useState([
    {
      log: 'Queue Load Leveling active. Simulate a Traffic Spike to check database stress.',
      queue: [],
      dbLoad: 15,
      dbStatus: 'ONLINE',
      activeNode: null,
      activeEdge: null,
      packet: null
    }
  ]);

  // Database worker polling queue in Load Leveling mode
  useEffect(() => {
    let interval = null;
    if (levelingEnabled) {
      interval = setInterval(() => {
        setQueue(prevQ => {
          if (prevQ.length > 0) {
            setDbLoad(55); // Moderate stable processing load
            setDbStatus('ONLINE');
            return prevQ.slice(1); // Dequeues 1 task
          } else {
            setDbLoad(15); // Idle load
            return prevQ;
          }
        });
      }, 2500); // DB processes 1 task every 2.5 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [levelingEnabled]);

  const handleTrafficSpike = () => {
    let trace = [];
    const spikeCount = 6;

    if (!levelingEnabled) {
      // Direct writes crash database
      trace.push({
        log: `Client generates traffic spike of ${spikeCount} concurrent writes. Requests routed directly to Database.`,
        queue: [],
        dbLoad: dbLoad,
        dbStatus: 'ONLINE',
        activeNode: 'App',
        activeEdge: 'App-DB',
        packet: { text: `${spikeCount} Writes`, x: 100, y: 100 }
      });

      trace.push({
        log: `CRITICAL OVERLOAD: Database flooded with ${spikeCount} write connections. Thread pool exhausted. CPU: 100%.`,
        queue: [],
        dbLoad: 100,
        dbStatus: 'OVERLOADED',
        activeNode: 'DB',
        activeEdge: null,
        packet: null
      });

      setDbLoad(100);
      setDbStatus('OVERLOADED');
    } else {
      // Level writes using Queue
      trace.push({
        log: `Client generates traffic spike of ${spikeCount} writes. Routing requests to buffer queue.`,
        queue: [...queue],
        dbLoad: dbLoad,
        dbStatus: 'ONLINE',
        activeNode: 'App',
        activeEdge: 'App-Queue',
        packet: { text: `${spikeCount} Tasks`, x: 100, y: 50 }
      });

      const updatedQueue = [...queue, ...Array.from({ length: spikeCount }).map((_, i) => `Task_${i + 1}`)];
      trace.push({
        log: `Queue Broker holds ${spikeCount} tasks in memory. Database is shielded from traffic spike, maintaining O(1) ingestion.`,
        queue: updatedQueue,
        dbLoad: 35, // Database is still processing but not overloaded
        dbStatus: 'ONLINE',
        activeNode: 'Queue',
        activeEdge: 'Queue-DB',
        packet: { text: 'FIFO Buffer', x: 250, y: 50 }
      });

      setQueue(updatedQueue);
      setDbLoad(35);
      setDbStatus('ONLINE');
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
    setQueue([]);
    setDbLoad(15);
    setDbStatus('ONLINE');
    setSteps([
      {
        log: 'Queue Load Leveling system reset.',
        queue: [],
        dbLoad: 15,
        dbStatus: 'ONLINE',
        activeNode: null,
        activeEdge: null,
        packet: null
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];
  const activeQ = activeStep.queue;

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>System Architecture:</span>
      <select
        value={levelingEnabled ? 'BUFFERED' : 'DIRECT'}
        onChange={(e) => {
          setLevelingEnabled(e.target.value === 'BUFFERED');
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
        <option value="BUFFERED">Queue Load Leveling (Buffered)</option>
        <option value="DIRECT">Unbuffered Writes (Direct to Database)</option>
      </select>

      <button className="btn-viz-action btn-clear" style={{ color: '#f59e0b', borderColor: '#f59e0b' }} onClick={handleTrafficSpike}>
        Trigger Traffic Spike (6 Writes)
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Queue Broker Buffer</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          {levelingEnabled ? (
            <div>Tasks in Queue: <strong style={{ color: activeQ.length > 3 ? '#f59e0b' : '#10b981' }}>{activeQ.length} active</strong></div>
          ) : (
            <div style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Queue disabled (Direct Writes bypass buffer)</div>
          )}
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Database Stress Metrics</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>DB Status: <strong style={{ color: activeStep.dbStatus === 'ONLINE' ? '#10b981' : '#ef4444' }}>{activeStep.dbStatus}</strong></div>
          <div>Database CPU: <strong style={{ color: activeStep.dbLoad > 80 ? '#ef4444' : '#10b981' }}>{activeStep.dbLoad}%</strong></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>Queue Load Leveling</strong> uses a message queue as a buffer between client requests and a database to smooth out high-traffic spikes:</p>
      <ul>
        <li><strong>Unbuffered Writes:</strong> High traffic spikes map directly to database write queries, consuming database connections, locking tables, and exhausting CPU resources, which leads to database crashes.</li>
        <li><strong>Leveling Writes:</strong> Requests are published to a queue broker (e.g. SQS, RabbitMQ) at high speed. The database worker processes pull tasks from the queue at a steady, manageable rate, shielding the database from overload.</li>
        <li><strong>Consistency:</strong> The system maintains eventual consistency. Updates might delay slightly during traffic spikes, but writes are never lost.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Queue Load Leveling as **a Mailroom in a Large Office**:</p>
      <ul>
        <li><strong>Unbuffered Writes:</strong> Couriers running straight to the CEO's desk to drop off letters. If 50 couriers arrive at once, the CEO gets overwhelmed, stops working, and the office freezes (Crash).</li>
        <li><strong>Load Leveling:</strong> Couriers drop letters in the mailroom mailbox (Queue). The CEO retrieves letters from their inbox one by one at a steady, constant speed, ensuring productivity never halts.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Slow User Feedback:</strong> Forcing clients to block and wait synchronous replies when their write goes to a queue. Writes should be treated asynchronously, letting users know their request was received and is being processed in the background.</li>
      <li><strong>Queue Overflow:</strong> Underestimating queue capacity, causing the message broker to run out of memory during massive multi-hour spikes.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is the primary benefit of Queue Load Leveling in database scaling?',
      a: 'It shields databases from traffic spikes, smoothing out unpredictable bursts of write traffic into a steady, constant processing flow. This prevents resource starvation and database crashes.'
    },
    {
      q: 'How does Queue Load Leveling affect client request latency?',
      a: 'It decouples the write operation. The client receives an immediate receipt confirmation (low latency). However, the actual database update is eventual, depending on queue backlog depth.'
    }
  ];

  const quizQuestions = [
    {
      question: 'What happens to the database CPU load during traffic spikes when Queue Load Leveling is enabled?',
      options: [
        'It jumps immediately to 100% and crashes',
        'It remains stable at a moderate, controlled level because the queue regulates write speeds',
        'It falls to 0%',
        'The database bypasses the CPU'
      ],
      correctIdx: 1,
      explanation: 'The queue buffers writes, letting workers poll and process tasks sequentially, keeping DB load in a safe range.'
    },
    {
      question: 'Which message broker is commonly used for buffering task queues in load leveling setups?',
      options: [
        'Amazon Web Services S3',
        'Apache Kafka, RabbitMQ, or Amazon SQS',
        'JSON routers',
        'CDN cache edge servers'
      ],
      correctIdx: 1,
      explanation: 'Kafka, RabbitMQ, and SQS are robust message brokers designed to queue and buffer asynchronous data streams.'
    }
  ];

  return (
    <VisualizerShell
      title="Queue Load Leveling"
      subtitle="Shield databases from spikes. Compare unbuffered crashes with queue-regulated write execution."
      timeComplexity="O(1) queue buffer insertion"
      spaceComplexity="O(M) queue buffer backlog capacity"
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
          {/* Direct Write Path */}
          {!levelingEnabled && (
            <line x1="50" y1="110" x2="350" y2="110" stroke={activeStep.activeEdge === 'App-DB' ? '#ef4444' : 'var(--bg-tertiary)'} strokeWidth="2" />
          )}

          {/* Buffered Queue Path */}
          {levelingEnabled && (
            <g>
              <line x1="50" y1="60" x2="160" y2="60" stroke={activeStep.activeEdge === 'App-Queue' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
              <line x1="220" y1="60" x2="350" y2="110" stroke={activeStep.activeEdge === 'Queue-DB' ? '#10b981' : 'var(--bg-tertiary)'} strokeWidth="1.5" strokeDasharray="3" />
            </g>
          )}

          {/* App Client Node */}
          <g>
            <circle cx="35" cy="85" r="16" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="35" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">App Srv</text>
          </g>

          {/* Queue Node (Only rendered if levelingEnabled) */}
          {levelingEnabled && (
            <g>
              <rect x="150" y="30" width="70" height="50" fill="var(--bg-secondary)" stroke="#1591DC" strokeWidth="2" rx="3" />
              <text x="185" y="48" textAnchor="middle" fill="#1591DC" fontSize="0.55rem" fontWeight="bold">Queue</text>
              <text x="185" y="60" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.45rem">Buffer</text>
              <text x="185" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="0.4rem">({activeQ.length} tasks)</text>
            </g>
          )}

          {/* Database Server */}
          <g>
            <rect
              x="350"
              y="85"
              width="75"
              height="45"
              fill={activeStep.dbStatus === 'OVERLOADED' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-secondary)'}
              stroke={activeStep.dbStatus === 'OVERLOADED' ? '#ef4444' : '#10b981'}
              strokeWidth="2.5"
              rx="4"
            />
            <text x="387" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Database</text>
            <text
              x="387"
              y="118"
              textAnchor="middle"
              fill={activeStep.dbStatus === 'OVERLOADED' ? '#ef4444' : '#10b981'}
              fontSize="0.45rem"
            >
              {activeStep.dbStatus === 'OVERLOADED' ? 'OVERLOADED' : `CPU: ${activeStep.dbLoad}%`}
            </text>
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
            <div style={{ width: '15px', height: '8px', border: '1.5px solid #ef4444', backgroundColor: 'transparent' }}></div> Overloaded Path
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '15px', height: '8px', border: '1.5px solid #10b981', backgroundColor: 'transparent' }}></div> Leveled Path
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
