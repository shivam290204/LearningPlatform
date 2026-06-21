import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function LoadBalancerVisualizer() {
  const [algorithm, setAlgorithm] = useState('round-robin'); // 'round-robin', 'least-conn', 'ip-hash'
  const [serverBHealthy, setServerBHealthy] = useState(true);
  
  // Servers state: [activeConnections, CPU, label, isHealthy]
  const [servers, setServers] = useState({
    A: { active: 1, cpu: 20, isHealthy: true, label: 'Server A' },
    B: { active: 3, cpu: 85, isHealthy: true, label: 'Server B' },
    C: { active: 0, cpu: 10, isHealthy: true, label: 'Server C' }
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [steps, setSteps] = useState([
    {
      log: 'Click Send Request to distribute incoming requests across backend servers.',
      servers: {
        A: { active: 1, cpu: 20, isHealthy: true, label: 'Server A' },
        B: { active: 3, cpu: 85, isHealthy: true, label: 'Server B' },
        C: { active: 0, cpu: 10, isHealthy: true, label: 'Server C' }
      },
      packet: null,
      activeServer: null
    }
  ]);

  // Round robin state tracker
  const [lastServerIdx, setLastServerIdx] = useState(0); // A=0, B=1, C=2

  const generateSteps = () => {
    let trace = [];
    let currentServers = JSON.parse(JSON.stringify(servers));
    currentServers.B.isHealthy = serverBHealthy;

    // Reset connections if overloaded
    Object.keys(currentServers).forEach(k => {
      if (currentServers[k].active > 5) {
        currentServers[k].active = 0;
        currentServers[k].cpu = 10;
      }
    });

    trace.push({
      log: `Client request arrives at Load Balancer. Algorithm active: ${algorithm.toUpperCase()}.`,
      servers: JSON.parse(JSON.stringify(currentServers)),
      packet: { x: 75, y: 70 },
      activeServer: null
    });

    let selectedServer = 'A';

    if (algorithm === 'round-robin') {
      const candidates = ['A', 'B', 'C'];
      let idx = lastServerIdx;
      
      // Look for next healthy server
      let found = false;
      for (let k = 0; k < 3; k++) {
        idx = (idx + 1) % 3;
        const s = candidates[idx];
        if (currentServers[s].isHealthy) {
          selectedServer = s;
          setLastServerIdx(idx);
          found = true;
          break;
        }
      }
      if (!found) {
        alert('All servers are crashed!');
        return;
      }
      trace.push({
        log: `Round Robin: Selecting next server in cyclic order -> ${selectedServer}.`,
        servers: JSON.parse(JSON.stringify(currentServers)),
        packet: { x: 190, y: 70 },
        activeServer: null
      });
    } else if (algorithm === 'least-conn') {
      // Find healthy server with minimum active connections
      let minConns = Infinity;
      let target = null;
      ['A', 'B', 'C'].forEach(s => {
        const sData = currentServers[s];
        if (sData.isHealthy && sData.active < minConns) {
          minConns = sData.active;
          target = s;
        }
      });
      if (!target) {
        alert('All servers are crashed!');
        return;
      }
      selectedServer = target;
      trace.push({
        log: `Least Connections: Selecting healthy server with fewest connections -> ${selectedServer} (${minConns} active).`,
        servers: JSON.parse(JSON.stringify(currentServers)),
        packet: { x: 190, y: 70 },
        activeServer: null
      });
    } else {
      // IP Hash simulation
      const mockIps = ['192.168.1.5', '203.0.113.1', '104.244.42.1'];
      const randomIp = mockIps[Math.floor(Math.random() * mockIps.length)];
      // Hash IP to A or C (B gets excluded if crashed or consistently maps to A/C)
      let hash = 0;
      for (let i = 0; i < randomIp.length; i++) {
        hash += randomIp.charCodeAt(i);
      }
      const serversList = ['A', 'B', 'C'].filter(s => currentServers[s].isHealthy);
      if (serversList.length === 0) {
        alert('All servers are crashed!');
        return;
      }
      selectedServer = serversList[hash % serversList.length];
      trace.push({
        log: `IP Hash: Hashed Client IP "${randomIp}" to server -> ${selectedServer}.`,
        servers: JSON.parse(JSON.stringify(currentServers)),
        packet: { x: 190, y: 70 },
        activeServer: null
      });
    }

    // Allocate request to selected server
    currentServers[selectedServer].active++;
    currentServers[selectedServer].cpu = Math.min(99, currentServers[selectedServer].cpu + 15);

    let serverY = 30;
    if (selectedServer === 'B') serverY = 70;
    if (selectedServer === 'C') serverY = 110;

    trace.push({
      log: `Routing packet to ${currentServers[selectedServer].label}. Active connections increased to ${currentServers[selectedServer].active}.`,
      servers: JSON.parse(JSON.stringify(currentServers)),
      packet: { x: 290, y: serverY },
      activeServer: selectedServer
    });

    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
    setServers(currentServers);
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
    const resetSrvs = {
      A: { active: 1, cpu: 20, isHealthy: true, label: 'Server A' },
      B: { active: 3, cpu: 85, isHealthy: true, label: 'Server B' },
      C: { active: 0, cpu: 10, isHealthy: true, label: 'Server C' }
    };
    setServers(resetSrvs);
    setLastServerIdx(0);
    setSteps([
      {
        log: 'Click Send Request to distribute incoming requests across backend servers.',
        servers: resetSrvs,
        packet: null,
        activeServer: null
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];
  const activeSrvs = activeStep.servers;

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Algorithm:</span>
      <select
        value={algorithm}
        onChange={(e) => setAlgorithm(e.target.value)}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        <option value="round-robin">Round Robin (Cyclic)</option>
        <option value="least-conn">Least Connections</option>
        <option value="ip-hash">IP Hash (Sticky Session)</option>
      </select>

      <button
        className="btn-viz-action btn-clear"
        onClick={() => {
          setServerBHealthy(prev => !prev);
          let updated = JSON.parse(JSON.stringify(servers));
          updated.B.isHealthy = !serverBHealthy;
          if (!serverBHealthy) {
            updated.B.active = 3;
            updated.B.cpu = 85;
          } else {
            updated.B.active = 0;
            updated.B.cpu = 0;
          }
          setServers(updated);
          handleReset();
        }}
      >
        Toggle Server B: {serverBHealthy ? 'HEALTHY' : 'CRASHED'}
      </button>

      <button className="btn-viz-action btn-add" onClick={generateSteps}>
        Send Request
      </button>
      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', fontSize: '0.85rem' }}>
      {Object.keys(activeSrvs).map(k => {
        const s = activeSrvs[k];
        return (
          <div key={k} style={{
            backgroundColor: 'var(--bg-primary)',
            border: `1.5px solid ${s.isHealthy ? (activeStep.activeServer === k ? '#1591DC' : 'var(--bg-tertiary)') : '#ef4444'}`,
            borderRadius: '4px',
            padding: '0.5rem',
            fontFamily: 'monospace'
          }}>
            <strong style={{ color: '#FFFFFF', display: 'block', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: '0.2rem' }}>
              {s.label}
            </strong>
            <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
              Status: <span style={{ color: s.isHealthy ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>{s.isHealthy ? 'HEALTHY' : 'CRASHED'}</span>
            </div>
            <div style={{ fontSize: '0.75rem' }}>
              Active Conns: <span style={{ color: '#FFFFFF' }}>{s.active}</span>
            </div>
            <div style={{ fontSize: '0.75rem' }}>
              CPU Load: <span style={{ color: s.cpu > 80 ? '#ef4444' : '#FFFFFF' }}>{s.cpu}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>Load Balancer</strong> is a reverse proxy device designed to distribute client workloads dynamically across multiple backend application servers:</p>
      <ul>
        <li><strong>Distribution Algorithms:</strong>
          <ul>
            <li><strong>Round Robin:</strong> Cycles through servers sequentially. Best when servers are of equal hardware capacity.</li>
            <li><strong>Least Connections:</strong> Routes traffic to the server with the fewest active requests. Ideal for long-running, CPU-heavy tasks.</li>
            <li><strong>IP Hash:</strong> Computes a hash of the client\'s IP to assign a dedicated server. Guarantees "Sticky Sessions" (client always hits the same server).</li>
          </ul>
        </li>
        <li><strong>Health Checks:</strong> Regularly pings server endpoints. If a server crashes, the Load Balancer automatically isolates it, routing around failures.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of a Load Balancer as a **Hostess at a Busy Dinner Restaurant**:</p>
      <ul>
        <li>A line of hungry guests (Requests) arrives at the lobby door.</li>
        <li>Instead of letting everyone run in and crowd Server A\'s section, the Hostess assigns tables sequentially (Round Robin) or checks which waiter has the fewest tables to serve (Least Connections).</li>
        <li>If Waiter B falls ill (Server Crash), the Hostess immediately stops sending tables to B\'s section.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Missing Health Probe Timings:</strong> Setting health checks too slow (e.g. every 30s). If a server crashes, clients will experience errors for up to 30 seconds before the balancer isolates it.</li>
      <li><strong>Hashing Behind Proxy:</strong> Hash calculation using proxy server IPs instead of the original client IP (requires checking the <code>X-Forwarded-For</code> header).</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is the difference between Layer 4 and Layer 7 Load Balancing?',
      a: 'Layer 4 Load Balancers operate at the Transport level (TCP/UDP), routing packets purely by IP and Port numbers without reading content. Layer 7 balancers operate at the Application level (HTTP/HTTPS), parsing HTTP headers, cookies, and URLs to make intelligent routing decisions (e.g. routing video requests to media servers).'
    },
    {
      q: 'How does a Load Balancer handle Sticky Sessions and what are the trade-offs?',
      a: 'Sticky Sessions link a client to a specific server (e.g. using IP Hash or Session Cookies) so local session caches are preserved. The trade-off is poor load distribution: if one sticky client generates massive traffic, their assigned server will overload while others sit idle.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which load balancing algorithm guarantees that a specific client always connects to the exact same server?',
      options: [
        'Round Robin',
        'Least Connections',
        'IP Hash',
        'Random Selection'
      ],
      correctIdx: 2,
      explanation: 'IP Hash maps a client\'s IP address consistently to a specific server node, ensuring session persistency (stickiness).'
    },
    {
      question: 'If Server A has 2 active connections, Server B has 5 connections, and Server C has 1 connection, where will the Least Connections algorithm route the next request?',
      options: [
        'Server A',
        'Server B',
        'Server C',
        'Server A and C split'
      ],
      correctIdx: 2,
      explanation: 'Least Connections selects the server with the absolute minimum connection count. Since Server C has only 1 active connection, it receives the request.'
    }
  ];

  return (
    <VisualizerShell
      title="Load Balancer Simulator"
      subtitle="Interact with Round Robin, Least Connections, and IP Hash load distributions, and witness crash failovers."
      timeComplexity="O(1) routing decision"
      spaceComplexity="O(S) server pool registry size"
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', minHeight: '200px', padding: '1rem 0' }}>
        
        <svg width="420" height="150" style={{ overflow: 'visible' }}>
          {/* Edge lines */}
          <line x1="50" y1="70" x2="190" y2="70" stroke="var(--bg-tertiary)" strokeWidth="1.5" />
          <line x1="190" y1="70" x2="310" y2="30" stroke={activeStep.activeServer === 'A' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
          <line x1="190" y1="70" x2="310" y2="70" stroke={activeStep.activeServer === 'B' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
          <line x1="190" y1="70" x2="310" y2="110" stroke={activeStep.activeServer === 'C' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth="1.5" />

          {/* Client Node */}
          <g>
            <rect x="15" y="55" width="50" height="30" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" rx="4" />
            <text x="40" y="74" textAnchor="middle" fill="#FFFFFF" fontSize="0.7rem" fontWeight="bold">Client Pool</text>
          </g>

          {/* Load Balancer Node */}
          <g>
            <circle
              cx="190"
              cy="70"
              r="15"
              fill="rgba(21, 145, 220, 0.15)"
              stroke="#1591DC"
              strokeWidth="2.5"
            />
            <text x="190" y="98" textAnchor="middle" fill="#1591DC" style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>Load Balancer</text>
          </g>

          {/* Server Nodes */}
          {/* Server A */}
          <g>
            <rect x="310" y="15" width="65" height="26" fill="var(--bg-secondary)" stroke={activeStep.activeServer === 'A' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth="2" rx="3" />
            <text x="342" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">Server A</text>
          </g>

          {/* Server B */}
          <g>
            <rect x="310" y="55" width="65" height="26" fill="var(--bg-secondary)" stroke={activeSrvs.B.isHealthy ? (activeStep.activeServer === 'B' ? '#1591DC' : 'var(--bg-tertiary)') : '#ef4444'} strokeWidth="2" rx="3" />
            <text x="342" y="72" textAnchor="middle" fill={activeSrvs.B.isHealthy ? '#FFFFFF' : '#ef4444'} fontSize="0.65rem">
              {activeSrvs.B.isHealthy ? 'Server B' : 'B (DEAD)'}
            </text>
          </g>

          {/* Server C */}
          <g>
            <rect x="310" y="95" width="65" height="26" fill="var(--bg-secondary)" stroke={activeStep.activeServer === 'C' ? '#1591DC' : 'var(--bg-tertiary)'} strokeWidth="2" rx="3" />
            <text x="342" y="112" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">Server C</text>
          </g>

          {/* Animated Packet */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.3s' }}>
              <circle cx={activeStep.packet.x} cy={activeStep.packet.y} r="5" fill="#f59e0b" />
            </g>
          )}
        </svg>

      </div>
    </VisualizerShell>
  );
}
