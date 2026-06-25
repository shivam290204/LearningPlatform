import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function DbCacheVisualizer() {
  const [cache, setCache] = useState([
    { key: 'user:1', val: 'Alice', ttl: 30 }
  ]);
  const [log, setLog] = useState('Cache Simulator ready. Query User 1 (Hit) or User 2 (Miss).');
  const [animationStep, setAnimationStep] = useState(null); // 'CHECKING_CACHE', 'CACHE_HIT', 'CACHE_MISS', 'FETCHING_DB', 'WRITING_CACHE', null
  const [activeEdge, setActiveEdge] = useState(null);
  const [latency, setLatency] = useState('0ms');

  // Simulate TTL decrements
  useEffect(() => {
    const timer = setInterval(() => {
      setCache(prev => 
        prev.map(c => ({ ...c, ttl: Math.max(0, c.ttl - 1) })).filter(c => c.ttl > 0)
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuery = (key, val) => {
    setLog(`Querying key "${key}"...`);
    setAnimationStep('CHECKING_CACHE');
    setActiveEdge('Client-Redis');
    setLatency('Analyzing...');

    setTimeout(() => {
      const hit = cache.find(c => c.key === key);

      if (hit) {
        setAnimationStep('CACHE_HIT');
        setActiveEdge('Redis-Client');
        setLatency('2ms');
        setLog(`Cache Hit! Found "${key}" in Redis: "${hit.val}". Retained latency is 2ms.`);
        
        setTimeout(() => {
          setAnimationStep(null);
          setActiveEdge(null);
        }, 1200);
      } else {
        setAnimationStep('CACHE_MISS');
        setActiveEdge('Redis-DB');
        setLog(`Cache Miss: Key "${key}" not found in Redis. Routing request to SQL Database...`);
        
        setTimeout(() => {
          setAnimationStep('FETCHING_DB');
          setLog(`Database Query executed: Fetched record "${val}" from disk. (Time: 85ms).`);
          
          setTimeout(() => {
            setAnimationStep('WRITING_CACHE');
            setActiveEdge('DB-Redis');
            setLog(`Cache Populate: Writing "${key}" to Redis with a TTL of 30 seconds.`);
            
            // Add to cache
            setCache(prev => {
              if (prev.some(c => c.key === key)) return prev;
              return [...prev, { key, val, ttl: 30 }];
            });

            setTimeout(() => {
              setAnimationStep(null);
              setActiveEdge(null);
              setLatency('87ms');
              setLog(`Query finished. Returned data to client. Total roundtrip latency: 87ms.`);
            }, 1200);

          }, 1200);

        }, 1200);
      }
    }, 800);
  };

  const handleTriggerTtl = () => {
    setCache([]);
    setLog('Simulated instant TTL expiration: All Redis cache entries invalidated.');
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <button className="btn-viz-action btn-add" onClick={() => handleQuery('user:1', 'Alice')}>
        Query User 1 (Cache Hit)
      </button>

      <button className="btn-viz-action btn-add" onClick={() => handleQuery('user:2', 'Bob')}>
        Query User 2 (Cache Miss)
      </button>

      <button className="btn-viz-action btn-clear" onClick={handleTriggerTtl}>
        Expire TTLs
      </button>

      <button className="btn-viz-action" onClick={() => setCache([{ key: 'user:1', val: 'Alice', ttl: 30 }])}>
        Reset Cache
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Latency Monitor</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Operation Latency: <strong style={{ color: '#1591DC' }}>{latency}</strong></div>
          <div>Redis Access: <span>2ms</span></div>
          <div>SQL Disk Access: <span>85ms</span></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Redis In-Memory Key Registry</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.7rem'
        }}>
          {cache.length > 0 ? (
            cache.map(c => (
              <div key={c.key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                <span>{c.key} ({c.val})</span>
                <span style={{ color: '#1591DC', fontWeight: 'bold' }}>TTL: {c.ttl}s</span>
              </div>
            ))
          ) : (
            <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Redis is empty (All cache evicted)</span>
          )}
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>Database Caching</strong> stores high-frequency read results in rapid, volatile in-memory storage (like Redis) to avoid slow disk lookups:</p>
      <ul>
        <li><strong>Cache Hit:</strong> The requested key is found in the cache. Returns instantly (~2ms), avoiding relational database query operations.</li>
        <li><strong>Cache Miss:</strong> The key is missing. The system queries the main SQL database, writes the result to the cache for future queries, and returns.</li>
        <li><strong>TTL (Time-To-Live):</strong> An expiry timer that automatically evicts keys from the cache to prevent stale data retention.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Database Caching as **a Librarian\'s Desk vs the Book Stacks**:</p>
      <ul>
        <li><strong>Redis Cache (Librarian\'s Desk):</strong> The librarian keeps the 5 most popular textbooks right on the desk next to them. If a student asks for one, they hand it over in 2 seconds (Cache Hit).</li>
        <li><strong>SQL Database (Book Stacks):</strong> If a student asks for an obscure book, the librarian must walk deep into the back archives (disk page read), retrieve it (85ms), copy it to the desk for future askers, and deliver it (Cache Miss).</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Missing TTLs:</strong> Storing cache data indefinitely. If updates occur in the main DB, the cache remains stale forever.</li>
      <li><strong>Cache Stampede:</strong> When a hot key expires and thousands of requests miss concurrently, slamming the core database at the same instant. Use mutex locks or pre-warm caches.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Explain the Write-Through vs Write-Behind (Write-Back) caching strategy.',
      a: 'Write-Through writes updates concurrently to both the cache and the database (high integrity, slower writes). Write-Behind writes changes immediately to the cache and syncs to the database asynchronously in background batches (extremely fast writes, risk of data loss if cache fails).'
    },
    {
      q: 'Detail "Cache Penetration" and how to mitigate it.',
      a: 'Cache Penetration is when clients repeatedly request non-existent keys (causing database misses). It is mitigated by caching empty/null results with short TTLs or utilizing Bloom Filters to filter out non-existent keys before querying Redis.'
    }
  ];

  const quizQuestions = [
    {
      question: 'What is the primary performance benefit of database caching?',
      options: [
        'Decreases storage size requirements',
        'Decreases query read latency by avoiding disk lookups',
        'Encrypts SQL tables data',
        'Automatically balances database clusters'
      ],
      correctIdx: 1,
      explanation: 'Caching returns hot data from fast main memory buffers, avoiding slow disk reads.'
    },
    {
      question: 'Which parameter automatically controls cache eviction based on time elapsed?',
      options: [
        'WAL logs',
        'FIFO queue',
        'TTL (Time-To-Live)',
        'SSL certificate'
      ],
      correctIdx: 2,
      explanation: 'TTL specifies the active time window of a cache entry. After it expires, Redis evicts the key to prevent stale reads.'
    }
  ];

  return (
    <VisualizerShell
      title="Cache Workflows"
      subtitle="Examine Redis in-memory hit/miss pipelines, TTL expiries, and write-back database refresh patterns."
      timeComplexity="Redis: O(1); SQL: O(log N)"
      spaceComplexity="O(K) in-memory key storage"
      theoryContent={theory}
      analogyContent={analogy}
      mistakesContent={mistakes}
      interviewQuestions={interviewQuestions}
      quizQuestions={quizQuestions}
      controls={controls}
      logs={[log]}
      stateInspector={stateInspector}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%', minHeight: '235px', padding: '1rem 0' }}>
        <svg width="450" height="200" style={{ overflow: 'visible' }}>
          {/* Connection Lines */}
          <line
            x1="50"
            y1="100"
            x2="160"
            y2="50"
            stroke={activeEdge === 'Client-Redis' || activeEdge === 'Redis-Client' ? '#1591DC' : 'var(--bg-tertiary)'}
            strokeWidth="1.5"
          />
          <line
            x1="50"
            y1="100"
            x2="330"
            y2="150"
            stroke={activeEdge === 'Client-DB' ? '#1591DC' : 'var(--bg-tertiary)'}
            strokeWidth="1.5"
            strokeDasharray="2,2"
          />
          <line
            x1="220"
            y1="50"
            x2="330"
            y2="150"
            stroke={activeEdge === 'Redis-DB' || activeEdge === 'DB-Redis' ? '#1591DC' : 'var(--bg-tertiary)'}
            strokeWidth="1.5"
          />

          {/* Client App */}
          <g>
            <circle cx="35" cy="100" r="16" fill="#000000" stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="35" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Client</text>
          </g>

          {/* Redis Cache Box */}
          <g>
            <rect x="160" y="20" width="80" height="55" fill="#000000" stroke="#1591DC" strokeWidth="2.5" rx="3" />
            <text x="200" y="38" textAnchor="middle" fill="#1591DC" fontSize="0.55rem" fontWeight="bold">Redis Cache</text>
            <text x="200" y="49" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.38rem">In-Memory</text>
            <text x="200" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="0.35rem">
              Keys: {cache.length}
            </text>
          </g>

          {/* SQL Database Heap File */}
          <g>
            <rect x="320" y="125" width="90" height="50" fill="#000000" stroke="var(--bg-tertiary)" strokeWidth="2" rx="3" />
            <text x="365" y="145" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">SQL DB</text>
            <text x="365" y="157" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.38rem">Disk Storage</text>
          </g>

          {/* Status Overlay */}
          {animationStep === 'CACHE_HIT' && (
            <g>
              <rect x="120" y="90" width="90" height="24" fill="#000000" stroke="#FFFFFF" strokeWidth="1.5" rx="2" />
              <text x="165" y="105" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem" fontWeight="bold">✓ Cache Hit</text>
            </g>
          )}

          {animationStep === 'CACHE_MISS' && (
            <g>
              <rect x="120" y="90" width="90" height="24" fill="#000000" stroke="#1591DC" strokeWidth="1.5" rx="2" />
              <text x="165" y="105" textAnchor="middle" fill="#1591DC" fontSize="0.45rem" fontWeight="bold">✕ Cache Miss</text>
            </g>
          )}
        </svg>
      </div>
    </VisualizerShell>
  );
}
