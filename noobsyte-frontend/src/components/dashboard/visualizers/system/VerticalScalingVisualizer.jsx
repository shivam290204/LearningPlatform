import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function VerticalScalingVisualizer() {
  const [scaleLevel, setScaleLevel] = useState(1); // 1 to 5: Micro, Small, Medium, Large, Huge
  const [trafficLoad, setTrafficLoad] = useState('NORMAL'); // 'NORMAL', 'SPIKE', 'SLASH_SALE'
  const [serverState, setServerState] = useState({
    cpu: 15,
    ram: 20,
    status: 'ONLINE',
    log: 'Server online. Drag slider to upgrade hardware resources.'
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const levelDetails = {
    1: { name: 'Micro (t2.micro)', cpu: '1 vCPU', ram: '1 GB', maxRps: 50, scaleX: 1.0 },
    2: { name: 'Small (t2.small)', cpu: '2 vCPU', ram: '2 GB', maxRps: 150, scaleX: 1.15 },
    3: { name: 'Medium (t2.medium)', cpu: '4 vCPU', ram: '8 GB', maxRps: 500, scaleX: 1.3 },
    4: { name: 'Large (m5.large)', cpu: '8 vCPU', ram: '32 GB', maxRps: 2000, scaleX: 1.5 },
    5: { name: 'Huge (m5.24xlarge)', cpu: '96 vCPU', ram: '384 GB', maxRps: 10000, scaleX: 1.75 }
  };

  const [steps, setSteps] = useState([
    {
      log: 'Server online. Micro resources active (1 vCPU, 1 GB RAM). Click Send Requests.',
      cpu: 15,
      ram: 20,
      status: 'ONLINE',
      packet: null
    }
  ]);

  const handleSendTraffic = () => {
    let trace = [];
    const lvl = levelDetails[scaleLevel];
    let requestCount = 50;
    if (trafficLoad === 'SPIKE') requestCount = 400;
    if (trafficLoad === 'SLASH_SALE') requestCount = 15000; // Physical network crash threshold

    // 1. Send Request
    trace.push({
      log: `Client fires traffic load of ${requestCount} RPS (Request packets per second).`,
      cpu: serverState.cpu,
      ram: serverState.ram,
      status: serverState.status,
      packet: { text: `${requestCount} RPS`, x: 80, y: 100 }
    });

    // Calculate load response
    let finalCpu = 10;
    let finalRam = 15;
    let finalStatus = 'ONLINE';
    let detailLog = '';

    if (requestCount <= lvl.maxRps) {
      // Server handles load comfortably
      finalCpu = Math.min(90, Math.round((requestCount / lvl.maxRps) * 60) + 15);
      finalRam = Math.min(85, Math.round((requestCount / lvl.maxRps) * 35) + 20);
      detailLog = `Server successfully handles load. CPU utilization: ${finalCpu}%, Memory: ${finalRam}%. Response code: HTTP 200 OK.`;
    } else {
      // Resource exhaustion
      finalCpu = 100;
      finalRam = 100;
      finalStatus = 'CRASHED';
      detailLog = `Exceeded max capacity of ${lvl.maxRps} RPS! Server runs out of memory (OOM) and crashes. HTTP 503 Service Unavailable returned.`;
    }

    // 2. Processing State
    trace.push({
      log: `Server intercepts traffic. ` + detailLog,
      cpu: finalCpu,
      ram: finalRam,
      status: finalStatus,
      packet: null
    });

    // 3. Response State
    trace.push({
      log: finalStatus === 'CRASHED' ? 'Single Point of Failure: No redundant server exists to pick up the load. Users experience complete outage.' : 'Server resolves request queue and returns response payload.',
      cpu: finalCpu,
      ram: finalRam,
      status: finalStatus,
      packet: { text: finalStatus === 'CRASHED' ? '503 Service Unavailable' : '200 OK Response', x: 80, y: 100 }
    });

    setServerState({ cpu: finalCpu, ram: finalRam, status: finalStatus, log: detailLog });
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
    setScaleLevel(1);
    setTrafficLoad('NORMAL');
    setServerState({
      cpu: 15,
      ram: 20,
      status: 'ONLINE',
      log: 'Server online. Drag slider to upgrade hardware resources.'
    });
    setSteps([
      {
        log: 'Server online. Micro resources active (1 vCPU, 1 GB RAM). Click Send Requests.',
        cpu: 15,
        ram: 20,
        status: 'ONLINE',
        packet: null
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];
  const activeLvl = levelDetails[scaleLevel];

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Server Size: {activeLvl.name}</span>
        <input
          type="range"
          min="1"
          max="5"
          value={scaleLevel}
          onChange={(e) => {
            setScaleLevel(parseInt(e.target.value));
            handleReset();
          }}
          style={{ width: '180px', accentColor: 'var(--brand-cyan)' }}
        />
      </div>

      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Traffic Load:</span>
      <select
        value={trafficLoad}
        onChange={(e) => setTrafficLoad(e.target.value)}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        <option value="NORMAL">Normal Workload (50 RPS)</option>
        <option value="SPIKE">Heavy Traffic Spike (400 RPS)</option>
        <option value="SLASH_SALE">Massive Slash Sale (15,000 RPS)</option>
      </select>

      <button className="btn-viz-action btn-add" onClick={handleSendTraffic}>
        Send Requests
      </button>

      <button className="btn-viz-action btn-clear" onClick={handleReset}>
        Reset Server
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Hardware Inventory</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Server Size: <strong style={{ color: 'var(--brand-cyan)' }}>{activeLvl.name}</strong></div>
          <div>CPU capacity: <span>{activeLvl.cpu}</span></div>
          <div>RAM capacity: <span>{activeLvl.ram}</span></div>
          <div>Max Capacity: <span>{activeLvl.maxRps} RPS</span></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Telemetry Monitors</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Status: <strong style={{ color: activeStep.status === 'ONLINE' ? '#10b981' : '#ef4444' }}>{activeStep.status}</strong></div>
          <div>CPU Util: <span style={{ color: activeStep.cpu > 80 ? '#ef4444' : '#10b981' }}>{activeStep.cpu}%</span></div>
          <div>RAM Util: <span style={{ color: activeStep.ram > 80 ? '#ef4444' : '#10b981' }}>{activeStep.ram}%</span></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>Vertical Scaling</strong> (Scale Up) means adding more power (CPU, RAM, Storage, Network adapters) to an existing single server instance:</p>
      <ul>
        <li><strong>Simplicity:</strong> No complex load balancer setups or stateless application rewrites required. It is as simple as clicking upgrade on your cloud provider panel.</li>
        <li><strong>Physical Limits:</strong> Eventually, you hit a "hard wall" where you cannot purchase larger hardware. Network cards, motherboard buses, and OS structures have throughput limits.</li>
        <li><strong>Single Point of Failure:</strong> Since all traffic sits on a single physical box, if it crashes (OOM, database freeze, hardware fault), your entire service is knocked offline instantly.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Vertical Scaling as upgrading a **Truck for Cargo Delivery**:</p>
      <ul>
        <li><strong>Vertical Scaling:</strong> Upgrading from a small postal motorcycle to a large semi-truck. You can carry way more boxes (data requests) in one trip. But if the engine fails, no deliveries happen. Additionally, you can't buy a truck bigger than the highway lane (physical limit).</li>
        <li><strong>Horizontal Scaling:</strong> Hiring a fleet of 50 small postal delivery vans. If one van gets a flat tire, the remaining 49 continue delivering cargo.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Cost Inefficiencies:</strong> Doubling server size in vertical scaling often yields an exponential price curve, whereas horizontal scaling uses cheap, commodity hardware.</li>
      <li><strong>No Redundancy:</strong> Believing a 96-core server is immune to database deadlocks or hardware errors. When it halts, the entire application fails.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What are the main limits of Vertical Scaling (Scale Up)?',
      a: 'The physical hardware limits of a single machine (CPU sockets, RAM slots, PCIe lanes, network bandwidth), increased price-performance ratio under larger sizes, and a single point of failure (no redundant backup node).'
    },
    {
      q: 'When is it appropriate to use Vertical Scaling instead of Horizontal Scaling?',
      a: 'Appropriate for low-traffic applications, database nodes requiring high sequential performance, prototypes, or early-stage startups where development speed and system simplicity are more critical than redundancy.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which of the following describes the single point of failure risk in Vertical Scaling?',
      options: [
        'Queries are load balanced too quickly',
        'If the upgraded server crashes, the entire system goes offline immediately',
        'Redis caches require too many network connections',
        'CPU cores cannot process integer conversions'
      ],
      correctIdx: 1,
      explanation: 'Without multiple nodes, vertical scaling concentrates risk on a single system. If it crashes, all users experience downtime.'
    },
    {
      question: 'Why does vertical scaling eventually fail under massive global workloads (e.g. Google Search)?',
      options: [
        'Because Google does not support virtual machines',
        'Because single servers have hard physical limitations for network card I/O and CPU memory bus speed',
        'Because horizontal scaling is cheaper for single user logins',
        'Because it is restricted by database indexes'
      ],
      correctIdx: 1,
      explanation: 'Motherboard architectures, PCI lanes, and network cards have physical boundaries. Under millions of requests, no single box can process the electrical throughput.'
    }
  ];

  return (
    <VisualizerShell
      title="Vertical Scaling Simulator"
      subtitle="Slide server sizes to allocate CPU/RAM. Observe system limits under spikes and slash sales."
      timeComplexity="O(1) capacity threshold"
      spaceComplexity="O(1) system metrics"
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%', minHeight: '230px', padding: '1rem 0' }}>
        
        <svg width="450" height="180" style={{ overflow: 'visible' }}>
          {/* Traffic Path */}
          <line
            x1="50"
            y1="90"
            x2="200"
            y2="90"
            stroke={activeStep.packet ? '#1591DC' : 'var(--bg-tertiary)'}
            strokeWidth={activeStep.packet ? '2.5' : '1.5'}
          />

          {/* Client Node */}
          <g>
            <circle cx="40" cy="90" r="16" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="40" y="93" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Client</text>
          </g>

          {/* Server Box (Whose dimensions scale with level) */}
          <g style={{ transition: 'transform 0.3s' }}>
            <rect
              x={(260 - (activeLvl.scaleX * 15)).toString()}
              y={(90 - (activeLvl.scaleX * 30)).toString()}
              width={(activeLvl.scaleX * 70).toString()}
              height={(activeLvl.scaleX * 60).toString()}
              fill={activeStep.status === 'CRASHED' ? 'rgba(239,68,68,0.1)' : 'rgba(21,145,220,0.08)'}
              stroke={activeStep.status === 'CRASHED' ? '#ef4444' : '#1591DC'}
              strokeWidth="2.5"
              rx="4"
            />
            <text
              x="290"
              y={(85 - (activeLvl.scaleX * 10)).toString()}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="0.55rem"
              fontWeight="bold"
            >
              Single Server
            </text>
            <text
              x="290"
              y={(98 - (activeLvl.scaleX * 5)).toString()}
              textAnchor="middle"
              fill="var(--text-tertiary)"
              fontSize="0.45rem"
            >
              {activeLvl.cpu} | {activeLvl.ram}
            </text>

            {/* Simulated hardware metrics charts inside the server */}
            <rect x={(260 - (activeLvl.scaleX * 5)).toString()} y="110" width="60" height="12" fill="var(--bg-primary)" stroke="var(--bg-tertiary)" strokeWidth="0.8" rx="1" />
            <rect
              x={(260 - (activeLvl.scaleX * 5)).toString()}
              y="110"
              width={(60 * (activeStep.cpu / 100)).toString()}
              height="12"
              fill={activeStep.cpu > 80 ? '#ef4444' : '#10b981'}
              rx="1"
            />
            <text x="290" y="118" textAnchor="middle" fill="#FFFFFF" fontSize="0.38rem">CPU: {activeStep.cpu}%</text>
          </g>

          {/* Animated Traffic Packet */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.35s ease' }}>
              <rect x={activeStep.packet.x - 22} y={activeStep.packet.y - 10} width="44" height="16" fill="var(--bg-primary)" stroke="#f59e0b" strokeWidth="1.2" rx="2" />
              <text x={activeStep.packet.x} y={activeStep.packet.y + 1} textAnchor="middle" fill="#f59e0b" fontSize="0.4rem" fontWeight="bold">
                {activeStep.packet.text}
              </text>
            </g>
          )}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '15px', height: '10px', backgroundColor: 'rgba(21,145,220,0.08)', border: '1.5px solid #1591DC' }}></div> Online Host
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '15px', height: '10px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1.5px solid #ef4444' }}></div> Exhausted (Crashed)
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
