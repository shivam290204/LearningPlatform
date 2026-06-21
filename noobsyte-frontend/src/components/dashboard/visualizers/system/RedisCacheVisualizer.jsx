import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function RedisCacheVisualizer() {
  const [targetKey, setTargetKey] = useState('user:10');
  // Redis state: key-value storage
  const [redisStore, setRedisStore] = useState({
    'user:10': '{"name": "Arjun", "score": 90}'
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  
  const [steps, setSteps] = useState([
    {
      log: 'Click Send Request to search for data in Redis Cache and Database.',
      activeNode: null,
      activeEdge: null,
      packet: null,
      cacheResult: '',
      latency: 0,
      redisStore: { 'user:10': '{"name": "Arjun", "score": 90}' }
    }
  ]);

  const generateSteps = () => {
    let trace = [];
    const isHit = redisStore[targetKey] !== undefined;

    // Step 1: Request arrives at server
    trace.push({
      log: `Client requests data for key "${targetKey}". Web Server intercepts request.`,
      activeNode: 'Server',
      activeEdge: null,
      packet: { text: `GET ${targetKey}`, x: 80, y: 75 },
      cacheResult: 'PENDING',
      latency: 0,
      redisStore: { ...redisStore }
    });

    // Step 2: Check Redis
    trace.push({
      log: `Server checks Redis cache for key "${targetKey}"...`,
      activeNode: 'Redis',
      activeEdge: 'Server-Redis',
      packet: { text: `Lookup`, x: 195, y: 35 },
      cacheResult: 'PENDING',
      latency: 5,
      redisStore: { ...redisStore }
    });

    if (isHit) {
      // Cache Hit
      trace.push({
        log: `Cache HIT! Key "${targetKey}" found in Redis. Fetching value: ${redisStore[targetKey]}`,
        activeNode: 'Redis',
        activeEdge: null,
        packet: null,
        cacheResult: 'HIT',
        latency: 5,
        redisStore: { ...redisStore }
      });

      trace.push({
        log: `Server immediately returns cached data back to Client. Total transaction latency: 5ms.`,
        activeNode: 'Client',
        activeEdge: 'Client-Server',
        packet: { text: 'JSON Data', x: 80, y: 75 },
        cacheResult: 'HIT',
        latency: 5,
        redisStore: { ...redisStore }
      });
    } else {
      // Cache Miss
      trace.push({
        log: `Cache MISS! Key "${targetKey}" not found in Redis. Querying backing Database...`,
        activeNode: 'Redis',
        activeEdge: null,
        packet: null,
        cacheResult: 'MISS',
        latency: 5,
        redisStore: { ...redisStore }
      });

      trace.push({
        log: `Database executing index scan for "${targetKey}" (disk I/O). Latency adds +100ms.`,
        activeNode: 'Database',
        activeEdge: 'Server-DB',
        packet: { text: 'SQL Read', x: 290, y: 75 },
        cacheResult: 'MISS',
        latency: 105,
        redisStore: { ...redisStore }
      });

      // DB returns data, Server writes to Redis
      const dbValue = targetKey === 'user:20' 
        ? '{"name": "Siddharth", "score": 85}' 
        : '{"name": "Guest User", "score": 50}';

      let updatedRedis = { ...redisStore };
      updatedRedis[targetKey] = dbValue;

      trace.push({
        log: `Database returned record. Server writes new key-value pair back to Redis to cache future queries.`,
        activeNode: 'Redis',
        activeEdge: 'Server-Redis',
        packet: { text: 'Write Cache', x: 195, y: 35 },
        cacheResult: 'MISS',
        latency: 110,
        redisStore: updatedRedis
      });

      trace.push({
        log: `Server returns retrieved data to Client. Total transaction latency: 110ms.`,
        activeNode: 'Client',
        activeEdge: 'Client-Server',
        packet: { text: 'JSON Data', x: 80, y: 75 },
        cacheResult: 'MISS',
        latency: 110,
        redisStore: updatedRedis
      });
      
      setRedisStore(updatedRedis);
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
            const nextStep = prev + 1;
            setRedisStore(steps[nextStep].redisStore);
            return nextStep;
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
      const nextStep = currentStep + 1;
      setRedisStore(steps[nextStep].redisStore);
      setCurrentStep(nextStep);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setRedisStore(steps[prevStep].redisStore);
      setCurrentStep(prevStep);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    const resetRedis = { 'user:10': '{"name": "Arjun", "score": 90}' };
    setRedisStore(resetRedis);
    setSteps([
      {
        log: 'Click Send Request to search for data in Redis Cache and Database.',
        activeNode: null,
        activeEdge: null,
        packet: null,
        cacheResult: '',
        latency: 0,
        redisStore: resetRedis
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];
  const activeRedis = activeStep.redisStore;

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Target Key:</span>
      <select
        value={targetKey}
        onChange={(e) => setTargetKey(e.target.value)}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        <option value="user:10">user:10 (In Cache - Hit)</option>
        <option value="user:20">user:20 (Not In Cache - Miss)</option>
        <option value="user:30">user:30 (Not In Cache - Miss)</option>
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
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Redis Key-Value Cache Store</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          color: 'var(--brand-cyan)'
        }}>
          {Object.keys(activeRedis).length > 0 ? (
            Object.keys(activeRedis).map(k => (
              <div key={k} style={{ marginBottom: '0.2rem' }}>
                <strong>{k}</strong>: {activeRedis[k]}
              </div>
            ))
          ) : (
            <span style={{ color: 'var(--text-tertiary)' }}>Empty Cache</span>
          )}
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Transaction Telemetry</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace'
        }}>
          <div>
            Cache Status: {' '}
            <strong style={{
              color: activeStep.cacheResult === 'HIT' ? '#10b981' : (activeStep.cacheResult === 'MISS' ? '#ef4444' : 'var(--text-secondary)')
            }}>
              {activeStep.cacheResult || 'PENDING'}
            </strong>
          </div>
          <div style={{ marginTop: '0.25rem' }}>
            Total Latency: <strong style={{ color: '#f59e0b' }}>{activeStep.latency} ms</strong>
          </div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>Cache</strong> is a high-speed memory layer that stores copies of active database query results to reduce response latency:</p>
      <ul>
        <li><strong>Redis (Remote Dictionary Server):</strong> An open-source, in-memory key-value data store used as a database, cache, and message broker.</li>
        <li><strong>Cache Read Path (Cache-Aside):</strong>
          <ol>
            <li>Check Cache. If key is present (Cache Hit), return instantly.</li>
            <li>If key is absent (Cache Miss), query database, write retrieved data back to Cache, and return.</li>
          </ol>
        </li>
        <li><strong>Latency Differentials:</strong> Reading from RAM (Cache) typically takes less than 5ms, while reading from disk (Database) can take over 100ms.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Caching as a **Librarian\'s Desk**:</p>
      <ul>
        <li>A customer asks for a popular book. If the librarian has a copy sitting right on their desk (Cache Hit), they hand it to the customer in 2 seconds.</li>
        <li>If it is not on the desk (Cache Miss), the librarian must walk deep into the back archives, search the shelves (Database Query - 2 minutes), retrieve it, put a duplicate copy on the desk for next time, and hand the book over.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Missing Time-To-Live (TTL):</strong> Storing cache data indefinitely. If the database updates, the cache continues to serve stale, outdated records.</li>
      <li><strong>Cache Stampede (Thundering Herd):</strong> When a hot key expires and thousands of concurrent clients hit the database simultaneously to fetch it, crashing the DB.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What are the three main cache write strategies?',
      a: '1. Cache-Aside: Server checks cache, writes manually on miss. 2. Write-Through: Server writes to cache, which immediately writes to database synchronously. 3. Write-Back (Write-Behind): Server writes to cache, which updates the database asynchronously (high speed, data-loss risk).'
    },
    {
      q: 'What is Cache Eviction and what are common eviction policies?',
      a: 'When cache memory is full, the server must discard old keys to save new ones. Common policies include LRU (Least Recently Used), LFU (Least Frequently Used), and FIFO (First In First Out).'
    }
  ];

  const quizQuestions = [
    {
      question: 'What is a Cache Miss?',
      options: [
        'When the database fails to execute a query',
        'When the requested key is not found in the cache, forcing a database lookup',
        'When the cache server crashes due to memory overflow',
        'When cookies expire'
      ],
      correctIdx: 1,
      explanation: 'A cache miss occurs when key lookups return null in the cache, requiring the application to fetch the data from the slower primary database.'
    },
    {
      question: 'Which Cache Eviction policy discards the key that has not been accessed for the longest duration?',
      options: [
        'LFU (Least Frequently Used)',
        'FIFO (First In First Out)',
        'LRU (Least Recently Used)',
        'Random Eviction'
      ],
      correctIdx: 2,
      explanation: 'LRU (Least Recently Used) keeps track of read timestamps and evicts keys that have gone the longest without being read.'
    }
  ];

  return (
    <VisualizerShell
      title="Redis Cache Workflows Simulator"
      subtitle="Witness the performance difference between Cache Hits (RAM) and Cache Misses (Disk Database)."
      timeComplexity="O(1) memory lookup"
      spaceComplexity="O(K) key database capacity"
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
          {/* Edge lines */}
          <line x1="50" y1="75" x2="200" y2="75" stroke="var(--bg-tertiary)" strokeWidth="1.5" />
          <line x1="200" y1="75" x2="200" y2="30" stroke={activeStep.activeEdge === 'Server-Redis' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
          <line x1="200" y1="75" x2="350" y2="75" stroke={activeStep.activeEdge === 'Server-DB' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth="1.5" />

          {/* Client Node */}
          <g>
            <rect x="15" y="50" width="50" height="40" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" rx="4" />
            <text x="40" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="0.75rem" fontWeight="bold">Client</text>
          </g>

          {/* Web Server Node */}
          <g>
            <rect x="175" y="50" width="50" height="40" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" rx="4" />
            <text x="200" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="0.75rem" fontWeight="bold">Server</text>
          </g>

          {/* Redis Cache Node */}
          <g>
            <rect
              x="170"
              y="5"
              width="60"
              height="25"
              fill={activeStep.cacheResult === 'HIT' ? 'rgba(16, 185, 129, 0.15)' : (activeStep.cacheResult === 'MISS' ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-secondary)')}
              stroke={activeStep.cacheResult === 'HIT' ? '#10b981' : (activeStep.cacheResult === 'MISS' ? '#ef4444' : 'var(--bg-tertiary)')}
              strokeWidth="2"
              rx="3"
            />
            <text x="200" y="21" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem" fontWeight="bold">Redis Cache</text>
          </g>

          {/* Database Node */}
          <g>
            <rect x="325" y="50" width="50" height="40" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" rx="4" />
            <text x="350" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="0.75rem" fontWeight="bold">Database</text>
          </g>

          {/* Animated Packet */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.3s' }}>
              <rect
                x={activeStep.packet.x - 30}
                y={activeStep.packet.y - 12}
                width="60"
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
