import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function DnsSystemVisualizer() {
  const [selectedDomain, setSelectedDomain] = useState('noobsyte.dev');
  const [localCache, setLocalCache] = useState({}); // { 'google.com': '142.250.190.46' }
  const [activeQueryNode, setActiveQueryNode] = useState(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const [steps, setSteps] = useState([
    {
      log: 'DNS Resolver active. Select a domain and click Resolve to trace lookups.',
      activeNode: null,
      activeEdge: null,
      packet: null,
      cacheState: {}
    }
  ]);

  const dnsRecords = {
    'noobsyte.dev': { ip: '104.244.42.1', tld: '.dev TLD', auth: 'noobsyte.dev NS' },
    'google.com': { ip: '142.250.190.46', tld: '.com TLD', auth: 'google.com NS' },
    'wikipedia.org': { ip: '198.35.26.96', tld: '.org TLD', auth: 'wikipedia.org NS' }
  };

  const handleResolve = () => {
    let trace = [];
    const domain = selectedDomain;
    const records = dnsRecords[domain];

    // Check Local Cache
    if (localCache[domain]) {
      trace.push({
        log: `LOCAL CACHE HIT: Domain "${domain}" found in local browser DNS cache. IP: ${localCache[domain]}. Latency: 0ms.`,
        activeNode: 'Client',
        activeEdge: null,
        packet: { text: `Cached IP: ${localCache[domain]}`, x: 45, y: 100 },
        cacheState: { ...localCache }
      });
      setSteps(trace);
      setCurrentStep(0);
      setIsPlaying(false);
      return;
    }

    // 1. Send to Local Resolver
    trace.push({
      log: `Local Cache Miss. Requesting Recursive Resolver to resolve domain "${domain}".`,
      activeNode: 'Resolver',
      activeEdge: 'Client-Resolver',
      packet: { text: `Query: ${domain}`, x: 80, y: 100 },
      cacheState: { ...localCache }
    });

    // 2. Query Root Server
    trace.push({
      log: `Recursive Resolver queries Root Nameserver (".") for TLD authority pointer.`,
      activeNode: 'RootDNS',
      activeEdge: 'Resolver-Root',
      packet: { text: 'Query Root', x: 250, y: 35 },
      cacheState: { ...localCache }
    });

    // 3. Root Responds with TLD
    trace.push({
      log: `Root Server returns pointer mapping: Refer to TLD Nameserver for "${records.tld}".`,
      activeNode: 'Resolver',
      activeEdge: 'Resolver-Root',
      packet: { text: records.tld, x: 250, y: 35 },
      cacheState: { ...localCache }
    });

    // 4. Query TLD Server
    trace.push({
      log: `Recursive Resolver queries TLD Nameserver ("${records.tld}") for authoritative DNS pointer.`,
      activeNode: 'TldDNS',
      activeEdge: 'Resolver-TLD',
      packet: { text: 'Query TLD', x: 250, y: 100 },
      cacheState: { ...localCache }
    });

    // 5. TLD Responds
    trace.push({
      log: `TLD Server returns pointer mapping: Refer to Authoritative Nameserver "${records.auth}".`,
      activeNode: 'Resolver',
      activeEdge: 'Resolver-TLD',
      packet: { text: records.auth, x: 250, y: 100 },
      cacheState: { ...localCache }
    });

    // 6. Query Authoritative Server
    trace.push({
      log: `Recursive Resolver queries Authoritative Nameserver ("${records.auth}") for A (IP) record.`,
      activeNode: 'AuthDNS',
      activeEdge: 'Resolver-Auth',
      packet: { text: 'Query Auth', x: 250, y: 165 },
      cacheState: { ...localCache }
    });

    // 7. Auth Responds with IP
    let updatedCache = { ...localCache, [domain]: records.ip };
    trace.push({
      log: `Authoritative DNS returns A record: "${domain}" -> IP: ${records.ip}. Resolver stores result in cache with TTL.`,
      activeNode: 'Resolver',
      activeEdge: 'Resolver-Auth',
      packet: { text: `IP: ${records.ip}`, x: 250, y: 165 },
      cacheState: updatedCache
    });

    // 8. Return to Client
    trace.push({
      log: `Recursive Resolver returns IP address ${records.ip} back to Client Browser. TCP Handshake can now begin.`,
      activeNode: 'Client',
      activeEdge: 'Client-Resolver',
      packet: { text: `IP: ${records.ip}`, x: 80, y: 100 },
      cacheState: updatedCache
    });

    setLocalCache(updatedCache);
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
    setLocalCache({});
    setSteps([
      {
        log: 'DNS Resolver reset. Caches cleared.',
        activeNode: null,
        activeEdge: null,
        packet: null,
        cacheState: {}
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];
  const activeCache = activeStep.cacheState;

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Domain Target:</span>
      <select
        value={selectedDomain}
        onChange={(e) => setSelectedDomain(e.target.value)}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        <option value="noobsyte.dev">noobsyte.dev (Brand Domain)</option>
        <option value="google.com">google.com (.com TLD)</option>
        <option value="wikipedia.org">wikipedia.org (.org TLD)</option>
      </select>

      <button className="btn-viz-action btn-add" onClick={handleResolve}>
        Resolve Domain
      </button>

      <button className="btn-viz-action btn-clear" onClick={handleReset}>
        Flush DNS Cache
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Browser DNS Cache</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          {Object.keys(activeCache).length > 0 ? (
            Object.keys(activeCache).map(d => (
              <div key={d}>{d} {'->'} <span style={{ color: 'var(--brand-cyan)' }}>{activeCache[d]}</span></div>
            ))
          ) : (
            <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Local Cache is empty</span>
          )}
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Query Metadata</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Domain: <span>{selectedDomain}</span></div>
          <div>Record: <span style={{ color: 'var(--brand-cyan)' }}>A (IPv4)</span></div>
          <div>Nameserver: <span>BIND9 Root Server</span></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>The <strong>Domain Name System (DNS)</strong> resolves human-readable domain names (like <code>noobsyte.dev</code>) into machine-readable IP addresses (like <code>104.244.42.1</code>):</p>
      <ul>
        <li><strong>Local Cache:</strong> Browser and OS search internal databases first (latency: ~0ms). If not found, they contact a recursive resolver.</li>
        <li><strong>Recursive Resolver:</strong> Typically operated by your ISP or Cloudflare (1.1.1.1). Performs recursive lookups down the hierarchy if needed.</li>
        <li><strong>Root Nameservers ("."):</strong> The top of the hierarchy. Directs the resolver to the appropriate Top-Level Domain (TLD) server (e.g. .com, .net, .dev).</li>
        <li><strong>TLD Nameservers:</strong> Manages domain registries. Directs the resolver to the domain's Authoritative Nameserver.</li>
        <li><strong>Authoritative Nameservers:</strong> The final authority. Holds the official DNS records (like A records mapping domain to IPv4 addresses).</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of the DNS Resolution Flow as **looking up a book in a massive library**:</p>
      <ul>
        <li><strong>Client (Reader):</strong> You want to read a specific book (e.g. "Google Recipes").</li>
        <li><strong>Recursive Resolver (Librarian):</strong> You ask the librarian to find it. They do the searching for you.</li>
        <li><strong>Root DNS (Info Desk):</strong> The desk clerk tells the librarian, "Look in Room Com for commercial books."</li>
        <li><strong>TLD DNS (Room Com Desk):</strong> The room clerk says, "Go to shelf Google on row 12."</li>
        <li><strong>Authoritative DNS (Shelf index):</strong> The index on row 12 gives the exact box location (IP address).</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Long TTL intervals:</strong> Setting high Time-to-Live (TTL) durations on DNS records. When you switch hosting IPs, client resolvers continue routing users to the offline IP until the TTL cache expires.</li>
      <li><strong>Missing DNS Redundancies:</strong> Hosting authoritative records on a single nameserver provider without backup nameservers, crashing the site globally if that provider experiences a outage.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Detail the steps taken by a Recursive DNS Resolver when a cache miss occurs.',
      a: 'The resolver queries the Root Nameserver to get the TLD server address (e.g. .com). It then queries the TLD server to get the Authoritative Nameserver address for the domain. Finally, it queries the Authoritative Nameserver to get the specific record IP, caching it locally before returning it.'
    },
    {
      q: 'What are A, CNAME, and MX records in DNS databases?',
      a: 'A Record: Maps a domain directly to an IPv4 address.\nCNAME Record: Maps a domain alias to another domain name.\nMX Record: Directs email traffic to the domain\'s mail exchange servers.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which nameserver acts as the final official registry holding the IPv4 address records for a specific domain?',
      options: [
        'Root Nameserver',
        'TLD Nameserver',
        'Authoritative Nameserver',
        'Local DNS Cache'
      ],
      correctIdx: 2,
      explanation: 'The Authoritative Nameserver holds the master record files for the domain and returns the physical IP address.'
    },
    {
      question: 'What is the purpose of Time-To-Live (TTL) in a DNS record configuration?',
      options: [
        'To count active visitors on the server',
        'To specify how long recursive resolvers should cache the record before fetching updates',
        'To limit the speed of query packets',
        'To translate domain names to binary values'
      ],
      correctIdx: 1,
      explanation: 'TTL dictates the duration (in seconds) that resolvers and browsers can cache a resolved IP address before querying nameservers again.'
    }
  ];

  return (
    <VisualizerShell
      title="DNS Resolver Flow"
      subtitle="Witness recursive DNS searches. Trace queries down Root, TLD, and Authoritative nameservers."
      timeComplexity="O(N) lookup hops"
      spaceComplexity="O(K) DNS records size"
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
          {/* Hops connections */}
          <line x1="50" y1="100" x2="150" y2="100" stroke={activeStep.activeEdge === 'Client-Resolver' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
          <line x1="180" y1="100" x2="310" y2="35" stroke={activeStep.activeEdge === 'Resolver-Root' ? '#f59e0b' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
          <line x1="180" y1="100" x2="310" y2="100" stroke={activeStep.activeEdge === 'Resolver-TLD' ? '#f59e0b' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
          <line x1="180" y1="100" x2="310" y2="165" stroke={activeStep.activeEdge === 'Resolver-Auth' ? '#f59e0b' : 'var(--bg-tertiary)'} strokeWidth="1.5" />

          {/* Client Node */}
          <g>
            <circle cx="35" cy="100" r="16" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="35" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Client</text>
          </g>

          {/* Recursive Resolver */}
          <g>
            <rect
              x="130"
              y="80"
              width="50"
              height="40"
              fill={activeStep.activeNode === 'Resolver' ? 'rgba(21,145,220,0.15)' : 'var(--bg-secondary)'}
              stroke="#1591DC"
              strokeWidth="2.5"
              rx="3"
            />
            <text x="155" y="98" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Resolver</text>
            <text x="155" y="110" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.38rem">(ISP DNS)</text>
          </g>

          {/* Root Nameserver */}
          <g>
            <circle cx="330" cy="35" r="15" fill={activeStep.activeNode === 'RootDNS' ? 'rgba(245,158,11,0.15)' : 'var(--bg-secondary)'} stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="330" y="38" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem" fontWeight="bold">Root DNS (".")</text>
          </g>

          {/* TLD Nameserver */}
          <g>
            <circle cx="330" cy="100" r="15" fill={activeStep.activeNode === 'TldDNS' ? 'rgba(245,158,11,0.15)' : 'var(--bg-secondary)'} stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="330" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem" fontWeight="bold">TLD DNS</text>
          </g>

          {/* Authoritative Nameserver */}
          <g>
            <circle cx="330" cy="165" r="15" fill={activeStep.activeNode === 'AuthDNS' ? 'rgba(245,158,11,0.15)' : 'var(--bg-secondary)'} stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="330" y="168" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem" fontWeight="bold">Auth DNS</text>
          </g>

          {/* Animated Packet */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.35s ease' }}>
              <rect x={activeStep.packet.x - 28} y={activeStep.packet.y - 10} width="56" height="15" fill="var(--bg-primary)" stroke="#f59e0b" strokeWidth="1.2" rx="2" />
              <text x={activeStep.packet.x} y={activeStep.packet.y + 1} textAnchor="middle" fill="#f59e0b" fontSize="0.38rem" fontWeight="bold">
                {activeStep.packet.text}
              </text>
            </g>
          )}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#1591DC' }}></div> Client Resolver
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', border: '1.5px solid var(--bg-tertiary)' }}></div> Nameserver Node
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
