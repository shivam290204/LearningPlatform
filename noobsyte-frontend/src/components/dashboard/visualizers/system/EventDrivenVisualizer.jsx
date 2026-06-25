import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function EventDrivenVisualizer() {
  const [topicOffset, setTopicOffset] = useState(0);
  const [eventsList, setEventsList] = useState([]); // Array of event IDs/names
  const [consumerStatus, setConsumerStatus] = useState({
    Inventory: 'IDLE',
    Notification: 'IDLE',
    Logistics: 'IDLE'
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const [steps, setSteps] = useState([
    {
      log: 'Event Bus active. Trigger a Order Created event to witness decoupled execution streams.',
      events: [],
      consumers: { Inventory: 'IDLE', Notification: 'IDLE', Logistics: 'IDLE' },
      activeNode: null,
      activeEdge: null,
      packet: null
    }
  ]);

  const handlePublishOrder = () => {
    let trace = [];
    const eventId = `Order_${topicOffset + 1}`;
    const nextOffset = topicOffset + 1;
    setTopicOffset(nextOffset);

    // 1. Publish to Broker
    trace.push({
      log: `Producer generates event "${eventId}" and writes it to Kafka Topic 'order-events'. Producer returns instantly.`,
      events: [...eventsList],
      consumers: { ...consumerStatus },
      activeNode: 'Producer',
      activeEdge: 'Producer-Broker',
      packet: { text: eventId, x: 70, y: 100 }
    });

    const updatedEvents = [...eventsList, eventId];

    // 2. Broker commits offset
    trace.push({
      log: `Event Broker appends "${eventId}" to partition log at offset: ${nextOffset}. Message committed to disk.`,
      events: updatedEvents,
      consumers: { ...consumerStatus },
      activeNode: 'Broker',
      activeEdge: null,
      packet: null
    });

    // 3. Consumers poll and process
    let busyConsumers = {
      Inventory: `PROCESSING: ${eventId}`,
      Notification: `PROCESSING: ${eventId}`,
      Logistics: `PROCESSING: ${eventId}`
    };

    trace.push({
      log: `Asynchronous Consumers (Inventory, Notification, Logistics) poll new events concurrently. Decoupled routines execute.`,
      events: updatedEvents,
      consumers: busyConsumers,
      activeNode: 'Broker',
      activeEdge: 'Broker-Consumers',
      packet: { text: 'Sync Event', x: 230, y: 100 }
    });

    setEventsList(updatedEvents);
    setConsumerStatus(busyConsumers);
    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);

    // Simulate consumers returning to IDLE after a short delay
    setTimeout(() => {
      setConsumerStatus({
        Inventory: 'IDLE',
        Notification: 'IDLE',
        Logistics: 'IDLE'
      });
    }, 3500);
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
    setTopicOffset(0);
    setEventsList([]);
    setConsumerStatus({
      Inventory: 'IDLE',
      Notification: 'IDLE',
      Logistics: 'IDLE'
    });
    setSteps([
      {
        log: 'Event Bus reset. All topics empty.',
        events: [],
        consumers: { Inventory: 'IDLE', Notification: 'IDLE', Logistics: 'IDLE' },
        activeNode: null,
        activeEdge: null,
        packet: null
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];
  const activeEvts = activeStep.events;
  const activeCons = activeStep.consumers;

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <button className="btn-viz-action btn-add" onClick={handlePublishOrder}>
        Publish Event: OrderPlaced
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset Event Bus
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Kafka Topic: order-events</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          maxHeight: '90px',
          overflowY: 'auto'
        }}>
          {activeEvts.length > 0 ? (
            activeEvts.map((e, idx) => (
              <div key={idx}>Offset {idx + 1}: <span style={{ color: 'var(--brand-cyan)' }}>{e}</span></div>
            ))
          ) : (
            <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Topic is empty</span>
          )}
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Asynchronous Consumers</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Inventory Svc: <strong style={{ color: activeCons.Inventory === 'IDLE' ? '#10b981' : '#f59e0b' }}>{activeCons.Inventory}</strong></div>
          <div>Notification Svc: <strong style={{ color: activeCons.Notification === 'IDLE' ? '#10b981' : '#f59e0b' }}>{activeCons.Notification}</strong></div>
          <div>Logistics Svc: <strong style={{ color: activeCons.Logistics === 'IDLE' ? '#10b981' : '#f59e0b' }}>{activeCons.Logistics}</strong></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>An <strong>Event-Driven Architecture (EDA)</strong> executes operations asynchronously using event triggers instead of direct, blocking API requests:</p>
      <ul>
        <li><strong>Events:</strong> A record indicating that something happened in the system (e.g. "OrderPlaced"). Events are immutable logs of the past.</li>
        <li><strong>Event Broker (Message Bus):</strong> A high-throughput logs partition engine (like Apache Kafka) that stores event streams sequentially by offsets.</li>
        <li><strong>Asynchronous Decoupling:</strong> Producers publish events without waiting. Multiple consumers subscribe to the topic and pull messages at their own speed. If a consumer crashes, the broker retains the logs, allowing the service to catch up upon recovery.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Event-Driven systems as **a Wedding Registry Service**:</p>
      <ul>
        <li><strong>Producer (Bride/Groom):</strong> They register gifts on a public registry (Broker Topic). They don't wait for guests to purchase them.</li>
        <li><strong>Event Broker (Registry list):</strong> The list of items. It tracks which items have been purchased.</li>
        <li><strong>Consumers (Guests):</strong> Guests check the registry list and purchase gifts at their own pace. If a guest is busy (offline service), they read the list later without interrupting other guests.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Synchronous Blocking:</strong> Designing event handlers that call other microservices synchronously, creating chains of network blocks.</li>
      <li><strong>Ignoring Idempotency:</strong> Since networks can drop replies, events can be delivered multiple times. Handlers must be idempotent (processing the same event twice should yield identical results).</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Explain the difference between Message Queues and Event Streaming (e.g. Kafka).',
      a: 'In a traditional Message Queue, once a consumer processes a message, it is deleted from the queue. In Event Streaming (Kafka), events are appended to a persistent disk log at incremental offsets. Multiple independent consumer groups can read the same log from different offsets without deleting messages.'
    },
    {
      q: 'What is Idempotency and why is it critical in event-driven systems?',
      a: 'Idempotency is the property where an operation can be applied multiple times without changing the outcome. Since event delivery guarantees are typically "at-least-once," consumers can receive duplicate events. Handlers must track processed event IDs to ignore duplicates.'
    }
  ];

  const quizQuestions = [
    {
      question: 'What happens to events committed to a Kafka broker after they are read by a consumer?',
      options: [
        'They are deleted immediately',
        'They remain written on the disk log at their respective offsets, allowing other consumers to read them',
        'They are sent back to the producer',
        'They are locked'
      ],
      correctIdx: 1,
      explanation: 'Kafka maintains persistent logs. Consuming a message does not delete it, enabling multiple services to read the same stream.'
    },
    {
      question: 'Why does event-driven architecture improve system resilience?',
      options: [
        'Because it makes all databases synchronous',
        'Because if a consumer crashes, the broker buffers events on disk, preventing data loss until the consumer recovers',
        'Because it does not use network connections',
        'Because it scales hardware CPU automatically'
      ],
      correctIdx: 1,
      explanation: 'Decoupling producers and consumers through a broker log guarantees that downstream failures do not drop active writes.'
    }
  ];

  return (
    <VisualizerShell
      title="Event-Driven Architecture"
      subtitle="Publish immutable event streams to Kafka topics. Watch parallel, decoupled consumer processing."
      timeComplexity="O(1) append write speed"
      spaceComplexity="O(M) committed log offset capacity"
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
          {/* Producer to Broker line */}
          <line x1="50" y1="100" x2="150" y2="100" stroke={activeStep.activeEdge === 'Producer-Broker' ? '#f59e0b' : 'var(--bg-tertiary)'} strokeWidth="2" />

          {/* Broker to Consumers lines */}
          <line x1="220" y1="100" x2="330" y2="40" stroke={activeStep.activeEdge === 'Broker-Consumers' ? '#10b981' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
          <line x1="220" y1="100" x2="330" y2="100" stroke={activeStep.activeEdge === 'Broker-Consumers' ? '#10b981' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
          <line x1="220" y1="100" x2="330" y2="160" stroke={activeStep.activeEdge === 'Broker-Consumers' ? '#10b981' : 'var(--bg-tertiary)'} strokeWidth="1.5" />

          {/* Event Producer Node */}
          <g>
            <circle cx="35" cy="100" r="16" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="35" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Producer</text>
          </g>

          {/* Event Broker (Kafka Cluster block) */}
          <g>
            <rect x="150" y="55" width="70" height="90" fill="var(--bg-secondary)" stroke="#1591DC" strokeWidth="2.5" rx="3" />
            <text x="185" y="72" textAnchor="middle" fill="#1591DC" fontSize="0.55rem" fontWeight="bold">Event Bus</text>
            <text x="185" y="83" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.38rem">(Kafka)</text>
            
            {/* Draw offsets slots visual */}
            <rect x="160" y="94" width="50" height="12" fill="var(--bg-primary)" stroke="var(--bg-tertiary)" rx="1" />
            <text x="185" y="102" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.38rem">Offset: {topicOffset}</text>
          </g>

          {/* Decoupled Consumers */}
          {/* Consumer 1 */}
          <g>
            <rect
              x="330"
              y="25"
              width="90"
              height="30"
              fill={activeCons.Inventory.startsWith('PROCESSING') ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-secondary)'}
              stroke={activeCons.Inventory.startsWith('PROCESSING') ? '#f59e0b' : 'var(--bg-tertiary)'}
              strokeWidth="2"
              rx="3"
            />
            <text x="375" y="43" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Inventory Svc</text>
          </g>

          {/* Consumer 2 */}
          <g>
            <rect
              x="330"
              y="85"
              width="90"
              height="30"
              fill={activeCons.Notification.startsWith('PROCESSING') ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-secondary)'}
              stroke={activeCons.Notification.startsWith('PROCESSING') ? '#f59e0b' : 'var(--bg-tertiary)'}
              strokeWidth="2"
              rx="3"
            />
            <text x="375" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Notification Svc</text>
          </g>

          {/* Consumer 3 */}
          <g>
            <rect
              x="330"
              y="145"
              width="90"
              height="30"
              fill={activeCons.Logistics.startsWith('PROCESSING') ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-secondary)'}
              stroke={activeCons.Logistics.startsWith('PROCESSING') ? '#f59e0b' : 'var(--bg-tertiary)'}
              strokeWidth="2"
              rx="3"
            />
            <text x="375" y="163" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Logistics Svc</text>
          </g>

          {/* Animated Packet */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.35s ease' }}>
              <rect x={activeStep.packet.x - 26} y={activeStep.packet.y - 10} width="52" height="15" fill="var(--bg-primary)" stroke="#f59e0b" strokeWidth="1.2" rx="2" />
              <text x={activeStep.packet.x} y={activeStep.packet.y + 1} textAnchor="middle" fill="#f59e0b" fontSize="0.35rem" fontWeight="bold">
                {activeStep.packet.text}
              </text>
            </g>
          )}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--bg-secondary)', border: '1.5px solid #f59e0b' }}></div> Active event log
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '15px', height: '8px', border: '1.5px solid #10b981', backgroundColor: 'transparent' }}></div> Consumer poll path
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
