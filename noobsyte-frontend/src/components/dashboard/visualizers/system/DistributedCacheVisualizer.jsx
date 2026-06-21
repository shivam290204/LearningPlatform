import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function DistributedCacheVisualizer() {
  const [cache, setCache] = useState({
    A: { key1: 'value1' },
    B: { key2: 'value2' },
    C: {}
  });
  const [db, setDb] = useState({
    key1: 'value1',
    key2: 'value2',
    key3: 'value3'
  });

  const [writeMode, setWriteMode] = useState('WRITE_THROUGH'); // 'WRITE_THROUGH' or 'WRITE_BACK'
  const [inputKey, setInputKey] = useState('key3');
  const [inputVal, setInputVal] = useState('newValue');

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const [steps, setSteps] = useState([
    {
      log: 'Distributed Cache cluster active. Perform a Read or Write to trace latency pathways.',
      cache: { A: { key1: 'value1' }, B: { key2: 'value2' }, C: {} },
      db: { key1: 'value1', key2: 'value2', key3: 'value3' },
      activeNode: null,
      activeEdge: null,
      packet: null,
      latency: 0
    }
  ]);

  const handleRead = () => {
    let trace = [];
    const k = inputKey.trim();
    if (!k) {
      alert('Enter a valid key to query.');
      return;
    }

    // Determine target cache node based on key
    const targetNode = k === 'key1' ? 'A' : (k === 'key2' ? 'B' : 'C');
    const isHit = cache[targetNode] && cache[targetNode][k] !== undefined;

    // 1. Check Cache
    trace.push({
      log: `App checks Cache Node ${targetNode} for key "${k}".`,
      cache: { ...cache },
      db: { ...db },
      activeNode: `Cache-${targetNode}`,
      activeEdge: 'App-Cache',
      packet: { text: `GET ${k}`, x: 120, y: 50 },
      latency: 5
    });

    if (isHit) {
      // Cache Hit
      trace.push({
        log: `CACHE HIT: Key "${k}" resolved in cache memory of Node ${targetNode}. Value: "${cache[targetNode][k]}". Latency: 5ms.`,
        cache: { ...cache },
        db: { ...db },
        activeNode: 'App',
        activeEdge: null,
        packet: { text: `Data: ${cache[targetNode][k]}`, x: 120, y: 50 },
        latency: 5
      });
    } else {
      // Cache Miss
      trace.push({
        log: `CACHE MISS: Key "${k}" not resolved in Node ${targetNode} memory. Querying backing Database.`,
        cache: { ...cache },
        db: { ...db },
        activeNode: 'DB',
        activeEdge: 'Cache-DB',
        packet: { text: `SELECT ${k}`, x: 300, y: 110 },
        latency: 105
      });

      const dbVal = db[k];
      const hasDbVal = dbVal !== undefined;
      const finalVal = hasDbVal ? dbVal : 'NULL';

      // Load value to Cache Node
      let updatedCache = { ...cache };
      if (hasDbVal) {
        updatedCache[targetNode] = { ...updatedCache[targetNode], [k]: dbVal };
      }

      trace.push({
        log: hasDbVal
          ? `DB returned value "${dbVal}". Populating Cache Node ${targetNode} and returning. Latency: 105ms.`
          : `DB returned NULL. Cache remains empty. Latency: 105ms.`,
        cache: updatedCache,
        db: { ...db },
        activeNode: 'App',
        activeEdge: null,
        packet: { text: `Return: ${finalVal}`, x: 120, y: 50 },
        latency: 105
      });
      setCache(updatedCache);
    }

    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleWrite = () => {
    const k = inputKey.trim();
    const v = inputVal.trim();
    if (!k || !v) {
      alert('Enter valid key and value parameters.');
      return;
    }

    const targetNode = k === 'key1' ? 'A' : (k === 'key2' ? 'B' : 'C');
    let trace = [];

    // 1. App sends write to Cache
    trace.push({
      log: `App sends WRITE request (key: "${k}", val: "${v}") to target Cache Node ${targetNode}.`,
      cache: { ...cache },
      db: { ...db },
      activeNode: `Cache-${targetNode}`,
      activeEdge: 'App-Cache',
      packet: { text: `SET ${k}`, x: 120, y: 50 },
      latency: writeMode === 'WRITE_THROUGH' ? 105 : 5
    });

    let middleCache = { ...cache };
    middleCache[targetNode] = { ...middleCache[targetNode], [k]: v };

    if (writeMode === 'WRITE_THROUGH') {
      // Synchronous write to DB
      trace.push({
        log: `Write-Through Mode: Cache Node ${targetNode} commits to database synchronously before confirming write success.`,
        cache: middleCache,
        db: { ...db },
        activeNode: 'DB',
        activeEdge: 'Cache-DB',
        packet: { text: `INSERT ${k}`, x: 300, y: 110 },
        latency: 105
      });

      let finalDb = { ...db, [k]: v };
      trace.push({
        log: `Database committed successfully. Cache and DB are fully synchronized. Write complete. Latency: 105ms.`,
        cache: middleCache,
        db: finalDb,
        activeNode: 'App',
        activeEdge: null,
        packet: { text: 'Success (WT)', x: 120, y: 50 },
        latency: 105
      });
      setCache(middleCache);
      setDb(finalDb);
    } else {
      // Write-Back: async write to DB
      trace.push({
        log: `Write-Back Mode: Cache Node ${targetNode} updates local cache memory and confirms SUCCESS to Client immediately. Latency: 5ms.`,
        cache: middleCache,
        db: { ...db },
        activeNode: 'App',
        activeEdge: null,
        packet: { text: 'Success (WB)', x: 120, y: 50 },
        latency: 5
      });

      // Background write step
      let finalDb = { ...db, [k]: v };
      trace.push({
        log: `Background process: Async thread pushes queued cache update to database server. Cache and DB eventually sync.`,
        cache: middleCache,
        db: finalDb,
        activeNode: 'DB',
        activeEdge: 'Cache-DB',
        packet: { text: 'Async Flush', x: 300, y: 110 },
        latency: 5
      });
      setCache(middleCache);
      setDb(finalDb);
    }

    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleEvict = () => {
    let cleared = { A: {}, B: {}, C: {} };
    setCache(cleared);
    setSteps([
      {
        log: 'Cache Eviction executed. All keys removed from cache cluster memory. Subsequent queries will trigger cache misses.',
        cache: cleared,
        db: { ...db },
        activeNode: null,
        activeEdge: null,
        packet: null,
        latency: 0
      }
    ]);
    setCurrentStep(0);
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
    const initC = { A: { key1: 'value1' }, B: { key2: 'value2' }, C: {} };
    const initD = { key1: 'value1', key2: 'value2', key3: 'value3' };
    setCache(initC);
    setDb(initD);
    setSteps([
      {
        log: 'Distributed Cache cluster active. Perform a Read or Write to trace latency pathways.',
        cache: initC,
        db: initD,
        activeNode: null,
        activeEdge: null,
        packet: null,
        latency: 0
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];
  const activeCache = activeStep.cache;
  const activeDb = activeStep.db;

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cache Key:</span>
      <input
        type="text"
        value={inputKey}
        onChange={(e) => setInputKey(e.target.value)}
        style={{
          width: '60px',
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      />

      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Value:</span>
      <input
        type="text"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        style={{
          width: '70px',
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      />

      <button className="btn-viz-action" onClick={handleRead}>
        Read Key
      </button>

      <button className="btn-viz-action btn-add" onClick={handleWrite}>
        Write Key
      </button>

      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Write Policy:</span>
      <select
        value={writeMode}
        onChange={(e) => setWriteMode(e.target.value)}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        <option value="WRITE_THROUGH">Write-Through (Sync)</option>
        <option value="WRITE_BACK">Write-Back (Async)</option>
      </select>

      <button className="btn-viz-action btn-clear" onClick={handleEvict}>
        Clear Cache
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Cache Nodes Content</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          <div>Node A: <span style={{ color: 'var(--brand-cyan)' }}>{JSON.stringify(activeCache.A)}</span></div>
          <div>Node B: <span style={{ color: 'var(--brand-cyan)' }}>{JSON.stringify(activeCache.B)}</span></div>
          <div>Node C: <span style={{ color: 'var(--brand-cyan)' }}>{JSON.stringify(activeCache.C)}</span></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Latency Diagnostics</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Operation Latency: <strong style={{ color: activeStep.latency > 80 ? '#ef4444' : '#10b981' }}>{activeStep.latency} ms</strong></div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
            {activeStep.latency === 5 ? 'Resolved from Memory Cache' : (activeStep.latency > 5 ? 'Hit backing disk DB storage' : 'No query run')}
          </div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>Distributed Caching</strong> places a high-performance in-memory layer (like Redis or Memcached) above physical databases to lower retrieval latencies:</p>
      <ul>
        <li><strong>Cache Hit:</strong> The application requests a key, finds it in memory, and returns it immediately (latency: ~5ms).</li>
        <li><strong>Cache Miss:</strong> The key does not exist in memory. The server queries the database (latency: ~100ms) and saves the returned record in cache.</li>
        <li><strong>Write-Through:</strong> The server writes data to both the cache and the backing database synchronously. Guarantees strong consistency but adds write latency.</li>
        <li><strong>Write-Back (Write-Behind):</strong> The server writes data to the cache, returns success immediately, and asynchronously updates the database. Achieves low write latency but risks data loss if the cache server crashes before flushing to disk.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Distributed Caching as **a Chef's Preparation Station**:</p>
      <ul>
        <li><strong>Cache (Chef's Prep Counter):</strong> Where chopped onions and spices are kept right next to the cutting board (Cache Hit - instant access).</li>
        <li><strong>Database (Pantry/Cellar):</strong> The cellar downstairs holding large storage sacks. If the chef needs an ingredient not on the prep counter (Cache Miss), they walk downstairs to get it, place it on the counter (Cache population), and continue cooking.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Cache Stampede:</strong> When a popular cached key expires, and thousands of concurrent requests attempt to query the database simultaneously, overloading it.</li>
      <li><strong>Missing Eviction Policies:</strong> Setting no memory constraints on the cache. As keys grow, the server runs out of RAM and crashes. <em>Fix: Use Least Recently Used (LRU) eviction.</em></li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Explain the difference between Write-Through and Write-Back caching policies.',
      a: 'Write-Through writes synchronously to both the cache and the database before confirming success, ensuring data consistency at the expense of higher write latency. Write-Back writes only to the cache and returns success instantly, queuing writes to the database in the background, which yields high performance but introduces data loss risk if the cache fails.'
    },
    {
      q: 'How do you handle Cache Invalidation?',
      a: 'Through Time-to-Live (TTL) expiration windows, explicit invalidation APIs called during data updates, or memory eviction policies like Least Recently Used (LRU) and Least Frequently Used (LFU).'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which caching write policy yields the lowest write latency for client applications?',
      options: [
        'Write-Through',
        'Write-Back (Write-Behind)',
        'Cache Eviction',
        'Bypass Cache'
      ],
      correctIdx: 1,
      explanation: 'Write-back returns success immediately after updating the memory cache, performing database persistence operations asynchronously.'
    },
    {
      question: 'What is a Cache Stampede?',
      options: [
        'A crash of all cache servers due to hardware fire',
        'Simultaneous queries overloading the backing database when a popular cached key expires',
        'The process of clearing cache manually',
        'Consistent hashing ring resizing errors'
      ],
      correctIdx: 1,
      explanation: 'Cache stampede happens when high-traffic keys expire, forcing concurrent requests to bypass the cache and hit the database at once.'
    }
  ];

  return (
    <VisualizerShell
      title="Distributed Caching Workflows"
      subtitle="Analyze Cache Hits vs Misses. Contrast synchronous Write-Through policies with asynchronous Write-Back pipelines."
      timeComplexity="O(1) memory lookup"
      spaceComplexity="O(N) cache node cluster capacity"
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
          {/* Edge links from App Server to Cache Nodes */}
          <line x1="50" y1="50" x2="160" y2="50" stroke={activeStep.activeEdge === 'App-Cache' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth={activeStep.activeEdge === 'App-Cache' ? '2.5' : '1.5'} />
          <line x1="50" y1="50" x2="260" y2="50" stroke={activeStep.activeEdge === 'App-Cache' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth={activeStep.activeEdge === 'App-Cache' ? '2.5' : '1.5'} />
          <line x1="50" y1="50" x2="360" y2="50" stroke={activeStep.activeEdge === 'App-Cache' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth={activeStep.activeEdge === 'App-Cache' ? '2.5' : '1.5'} />

          {/* Links from Cache nodes to DB */}
          <line x1="210" y1="70" x2="225" y2="150" stroke={activeStep.activeEdge === 'Cache-DB' ? '#10b981' : 'var(--bg-tertiary)'} strokeWidth={activeStep.activeEdge === 'Cache-DB' ? '2' : '1'} strokeDasharray="3" />

          {/* App Server Node */}
          <g>
            <circle cx="45" cy="50" r="18" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="45" y="53" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">App</text>
          </g>

          {/* Cache Cluster Box */}
          <g>
            {/* Cache Node A */}
            <rect x="160" y="30" width="60" height="35" fill={activeStep.activeNode === 'Cache-A' ? 'rgba(21,145,220,0.15)' : 'var(--bg-secondary)'} stroke="#1591DC" strokeWidth="2" rx="3" />
            <text x="190" y="45" textAnchor="middle" fill="#FFFFFF" fontSize="0.52rem">Node A</text>
            <text x="190" y="58" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.38rem">Keys: {Object.keys(activeCache.A).length}</text>

            {/* Cache Node B */}
            <rect x="250" y="30" width="60" height="35" fill={activeStep.activeNode === 'Cache-B' ? 'rgba(21,145,220,0.15)' : 'var(--bg-secondary)'} stroke="#1591DC" strokeWidth="2" rx="3" />
            <text x="280" y="45" textAnchor="middle" fill="#FFFFFF" fontSize="0.52rem">Node B</text>
            <text x="280" y="58" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.38rem">Keys: {Object.keys(activeCache.B).length}</text>

            {/* Cache Node C */}
            <rect x="340" y="30" width="60" height="35" fill={activeStep.activeNode === 'Cache-C' ? 'rgba(21,145,220,0.15)' : 'var(--bg-secondary)'} stroke="#1591DC" strokeWidth="2" rx="3" />
            <text x="370" y="45" textAnchor="middle" fill="#FFFFFF" fontSize="0.52rem">Node C</text>
            <text x="370" y="58" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.38rem">Keys: {Object.keys(activeCache.C).length}</text>
          </g>

          {/* Database Server */}
          <g>
            <rect
              x="185"
              y="145"
              width="80"
              height="40"
              fill={activeStep.activeNode === 'DB' ? 'rgba(16,185,129,0.15)' : 'var(--bg-secondary)'}
              stroke="#10b981"
              strokeWidth="2.5"
              rx="4"
            />
            <text x="225" y="162" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Backing DB</text>
            <text x="225" y="174" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.45rem">Keys: {Object.keys(activeDb).length}</text>
          </g>

          {/* Animated Packet */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.35s ease' }}>
              <rect x={activeStep.packet.x - 28} y={activeStep.packet.y - 10} width="56" height="15" fill="var(--bg-primary)" stroke="#f59e0b" strokeWidth="1.2" rx="2" />
              <text x={activeStep.packet.x} y={activeStep.packet.y + 1} textAnchor="middle" fill="#f59e0b" fontSize="0.4rem" fontWeight="bold">
                {activeStep.packet.text}
              </text>
            </g>
          )}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--bg-secondary)', border: '1.5px solid #1591DC' }}></div> Cache Node (In-Memory)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--bg-secondary)', border: '1.5px solid #10b981' }}></div> Database (Disk)
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
