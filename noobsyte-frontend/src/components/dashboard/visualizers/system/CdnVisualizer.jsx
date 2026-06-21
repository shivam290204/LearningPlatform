import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function CdnVisualizer() {
  const [userLocation, setUserLocation] = useState('Tokyo'); // 'Tokyo' or 'London'
  const [assetName, setAssetName] = useState('logo.png');

  // CDN cache state
  const [cdnCache, setCdnCache] = useState({
    'Tokyo:logo.png': true
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  
  const [steps, setSteps] = useState([
    {
      log: 'Select User Location and Asset, and click Fetch Asset.',
      activeNode: null,
      activeEdge: null,
      packet: null,
      cdnStatus: '',
      latency: 0,
      cdnCache: { 'Tokyo:logo.png': true }
    }
  ]);

  const generateSteps = () => {
    let trace = [];
    const cacheKey = `${userLocation}:${assetName}`;
    const isHit = cdnCache[cacheKey] === true;

    // Step 1: User requests asset
    const clientX = userLocation === 'Tokyo' ? 50 : 50;
    const clientY = userLocation === 'Tokyo' ? 40 : 110;
    const edgeY = userLocation === 'Tokyo' ? 40 : 110;

    trace.push({
      log: `Client in ${userLocation} requests static asset "${assetName}" from localized CDN Edge server.`,
      activeNode: `Client-${userLocation}`,
      activeEdge: null,
      packet: { text: `GET ${assetName}`, x: clientX + 30, y: clientY },
      cdnStatus: 'PENDING',
      latency: 0,
      cdnCache: { ...cdnCache }
    });

    // Step 2: Check Edge cache
    trace.push({
      log: `CDN Edge server in ${userLocation} checks local SSD cache memory...`,
      activeNode: `Edge-${userLocation}`,
      activeEdge: `Client-Edge-${userLocation}`,
      packet: null,
      cdnStatus: 'PENDING',
      latency: 10,
      cdnCache: { ...cdnCache }
    });

    if (isHit) {
      // Cache Hit
      trace.push({
        log: `CDN Hit! Asset "${assetName}" found in ${userLocation} Edge server.`,
        activeNode: `Edge-${userLocation}`,
        activeEdge: null,
        packet: null,
        cdnStatus: 'HIT',
        latency: 10,
        cdnCache: { ...cdnCache }
      });

      trace.push({
        log: `Edge server returns asset immediately to Client. Low latency: 10ms.`,
        activeNode: `Client-${userLocation}`,
        activeEdge: `Client-Edge-${userLocation}`,
        packet: { text: 'Asset payload', x: clientX + 30, y: clientY },
        cdnStatus: 'HIT',
        latency: 10,
        cdnCache: { ...cdnCache }
      });
    } else {
      // Cache Miss
      trace.push({
        log: `CDN Miss! Asset "${assetName}" is not cached in ${userLocation} Edge server. Routing request to US-East Origin Server...`,
        activeNode: `Edge-${userLocation}`,
        activeEdge: null,
        cdnStatus: 'MISS',
        latency: 10,
        cdnCache: { ...cdnCache }
      });

      // Travel to Origin (US-East, x: 350, y: 75)
      trace.push({
        log: `Request packet traveling across oceans to US-East Origin Server. Hops add +240ms network transit latency.`,
        activeNode: 'Origin',
        activeEdge: `Edge-Origin-${userLocation}`,
        packet: { text: `Pull Origin`, x: 260, y: (edgeY + 75) / 2 },
        cdnStatus: 'MISS',
        latency: 250,
        cdnCache: { ...cdnCache }
      });

      // Save to Edge
      let updatedCache = { ...cdnCache };
      updatedCache[cacheKey] = true;

      trace.push({
        log: `Origin Server returns original file. ${userLocation} Edge server saves a copy into local SSD storage.`,
        activeNode: `Edge-${userLocation}`,
        activeEdge: `Edge-Origin-${userLocation}`,
        packet: { text: 'Asset file', x: 260, y: (edgeY + 75) / 2 },
        cdnStatus: 'MISS',
        latency: 255,
        cdnCache: updatedCache
      });

      trace.push({
        log: `Edge Server returns asset to Client. Total transaction latency: 255ms.`,
        activeNode: `Client-${userLocation}`,
        activeEdge: `Client-Edge-${userLocation}`,
        packet: { text: 'Asset payload', x: clientX + 30, y: clientY },
        cdnStatus: 'MISS',
        latency: 255,
        cdnCache: updatedCache
      });

      setCdnCache(updatedCache);
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
            setCdnCache(steps[nextStep].cdnCache);
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
      setCdnCache(steps[nextStep].cdnCache);
      setCurrentStep(nextStep);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCdnCache(steps[prevStep].cdnCache);
      setCurrentStep(prevStep);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    const resetCdn = { 'Tokyo:logo.png': true };
    setCdnCache(resetCdn);
    setSteps([
      {
        log: 'Select User Location and Asset, and click Fetch Asset.',
        activeNode: null,
        activeEdge: null,
        packet: null,
        cdnStatus: '',
        latency: 0,
        cdnCache: resetCdn
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];
  const activeCdn = activeStep.cdnCache;

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>User Location:</span>
      <select
        value={userLocation}
        onChange={(e) => setUserLocation(e.target.value)}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        <option value="Tokyo">Tokyo (Japan Client)</option>
        <option value="London">London (UK Client)</option>
      </select>

      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Static Asset:</span>
      <select
        value={assetName}
        onChange={(e) => setAssetName(e.target.value)}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        <option value="logo.png">logo.png</option>
        <option value="styles.css">styles.css</option>
      </select>

      <button className="btn-viz-action btn-add" onClick={generateSteps}>
        Fetch Asset
      </button>
      <button className="btn-viz-action btn-clear" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>CDN Active Edge Cache Store</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          color: 'var(--brand-cyan)'
        }}>
          {Object.keys(activeCdn).map(k => (
            <div key={k}>
              <strong>{k}</strong>: Cached (SSD)
            </div>
          ))}
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Network Latency Inspector</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace'
        }}>
          <div>
            Edge Status: {' '}
            <strong style={{
              color: activeStep.cdnStatus === 'HIT' ? '#10b981' : (activeStep.cdnStatus === 'MISS' ? '#ef4444' : 'var(--text-secondary)')
            }}>
              {activeStep.cdnStatus || 'IDLE'}
            </strong>
          </div>
          <div style={{ marginTop: '0.25rem' }}>
            Round-Trip Latency: <strong style={{ color: '#f59e0b' }}>{activeStep.latency} ms</strong>
          </div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>Content Delivery Network (CDN)</strong> is a geographically distributed group of proxy servers designed to deliver static assets (like images, videos, HTML, and CSS) with high speed and low latency:</p>
      <ul>
        <li><strong>Edge Servers:</strong> Proxy server nodes located globally close to the end-users. They cache static files.</li>
        <li><strong>Origin Server:</strong> The main backing application server hosting the master copies of your files (e.g. AWS S3 bucket in US-East).</li>
        <li><strong>Static Caching Advantage:</strong> Instead of Japanese clients fetching media files from Virginia (US) over high-latency ocean cables (+250ms), they retrieve them from a Tokyo Edge Server (+10ms).</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of a CDN as a **Global Chain of Bookstore Outlets**:</p>
      <ul>
        <li>The publisher's printing press (Origin Server) is located in New York.</li>
        <li>Instead of making a reader in Tokyo order a book and wait 2 weeks for shipping (Origin Fetch), the publisher stocks copies at a local Tokyo Bookstore Outlet (CDN Edge).</li>
        <li>The reader walks in and buys it in 5 minutes (CDN Hit). If the local bookstore runs out (CDN Miss), they call New York (Origin Pull) to restock it.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Incorrect Cache Invalidation:</strong> Changing a file on the Origin server but failing to clear the CDN cache. Clients will continue to load the stale old version until TTL expires. <em>Fix: Use URL Cache Busting (e.g., logo-v2.png).</em></li>
      <li><strong>Caching Dynamic JSON API Requests:</strong> Accidentally caching user-profile API data on public edge nodes, exposing private records to other local users.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'How does an Edge Server know when to update its cache?',
      a: 'Through Cache-Control headers (like TTL / Time-to-Live settings) specified by the Origin Server. Once TTL expires, the Edge Server treats subsequent requests as a miss and pulls the fresh copy from Origin.'
    },
    {
      q: 'What is Anycast Routing and how does it relate to CDNs?',
      a: 'Anycast is a network routing technique where multiple physical servers share the exact same IP address. Routers automatically send the client\'s packets to the physically nearest server hosting that IP, routing users to the nearest CDN Edge automatically.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which type of files are MOST suited for CDN caching?',
      options: [
        'User account settings JSON records',
        'Database write transaction queries',
        'Static media assets (Images, Videos, CSS styles)',
        'Server-side session maps'
      ],
      correctIdx: 2,
      explanation: 'CDNs are optimized for caching static, immutable assets like image assets, video clips, and CSS stylesheets, which are shared across all users.'
    },
    {
      question: 'What is the primary benefit of Anycast in CDN architectures?',
      options: [
        'It encrypts browser payloads automatically',
        'It routes client requests to the geographically closest Edge server sharing a single IP address',
        'It performs database migrations',
        'It prevents SQL injection vulnerabilities'
      ],
      correctIdx: 1,
      explanation: 'Anycast routes user packets to the geographically closest edge node that advertises the shared IP address, minimizing network latency.'
    }
  ];

  return (
    <VisualizerShell
      title="CDN System Simulator"
      subtitle="Deliver static media assets using localized edge server caching to eliminate ocean cable routing latencies."
      timeComplexity="O(1) proxy read"
      spaceComplexity="O(N) global cache size"
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%', minHeight: '190px', padding: '1rem 0' }}>
        
        <svg width="400" height="150" style={{ overflow: 'visible' }}>
          {/* Edge lines */}
          <line x1="50" y1="40" x2="160" y2="40" stroke="var(--bg-tertiary)" strokeWidth="1.5" />
          <line x1="50" y1="110" x2="160" y2="110" stroke="var(--bg-tertiary)" strokeWidth="1.5" />
          <line x1="160" y1="40" x2="330" y2="75" stroke={activeStep.activeEdge === 'Edge-Origin-Tokyo' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
          <line x1="160" y1="110" x2="330" y2="75" stroke={activeStep.activeEdge === 'Edge-Origin-London' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth="1.5" />

          {/* Tokyo Client Node */}
          <g>
            <circle cx="50" cy="40" r="12" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="50" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Client Tokyo</text>
          </g>

          {/* London Client Node */}
          <g>
            <circle cx="50" cy="110" r="12" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="50" y="135" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Client London</text>
          </g>

          {/* Tokyo CDN Edge Node */}
          <g>
            <rect
              x="145"
              y="25"
              width="30"
              height="30"
              fill={activeStep.activeNode === 'Edge-Tokyo' ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)'}
              stroke={activeStep.activeNode === 'Edge-Tokyo' ? '#1591DC' : 'var(--bg-tertiary)'}
              strokeWidth="2.5"
              rx="3"
            />
            <text x="160" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Tokyo Edge</text>
          </g>

          {/* London CDN Edge Node */}
          <g>
            <rect
              x="145"
              y="95"
              width="30"
              height="30"
              fill={activeStep.activeNode === 'Edge-London' ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)'}
              stroke={activeStep.activeNode === 'Edge-London' ? '#1591DC' : 'var(--bg-tertiary)'}
              strokeWidth="2.5"
              rx="3"
            />
            <text x="160" y="140" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">London Edge</text>
          </g>

          {/* US Origin Server Node */}
          <g>
            <rect
              x="320"
              y="55"
              width="50"
              height="40"
              fill={activeStep.activeNode === 'Origin' ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)'}
              stroke={activeStep.activeNode === 'Origin' ? '#1591DC' : 'var(--bg-tertiary)'}
              strokeWidth="2.5"
              rx="4"
            />
            <text x="345" y="79" textAnchor="middle" fill="#FFFFFF" fontSize="0.6rem" fontWeight="bold">US Origin</text>
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
                strokeWidth="1"
                rx="2"
              />
              <text
                x={activeStep.packet.x}
                y={activeStep.packet.y.toString()}
                textAnchor="middle"
                fill="#f59e0b"
                style={{ fontSize: '0.45rem', fontWeight: 'bold', fontFamily: 'monospace' }}
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
