import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function PubSubVisualizer() {
  const [activeTopic, setActiveTopic] = useState('TECH'); // 'TECH' or 'SPORTS'
  const [subscribers, setSubscribers] = useState([
    { id: 1, name: 'Sub A', topics: ['TECH'] },
    { id: 2, name: 'Sub B', topics: ['TECH', 'SPORTS'] },
    { id: 3, name: 'Sub C', topics: ['SPORTS'] }
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const [steps, setSteps] = useState([
    {
      log: 'Publish-Subscribe environment loaded. Try publishing a message or changing subscribers\' topics.',
      activeNode: null,
      activeEdge: null,
      packet: null,
      subscribersList: [
        { id: 1, name: 'Sub A', topics: ['TECH'] },
        { id: 2, name: 'Sub B', topics: ['TECH', 'SPORTS'] },
        { id: 3, name: 'Sub C', topics: ['SPORTS'] }
      ]
    }
  ]);

  const handlePublish = () => {
    const msgId = `Msg_${Math.floor(Math.random() * 900) + 100}`;
    const targetTopic = activeTopic;
    let trace = [];

    // Step 1: Publisher sends to Broker Topic
    trace.push({
      log: `Publisher broadcasts ${msgId} to topic: "${targetTopic}".`,
      activeNode: `Pub-${targetTopic}`,
      activeEdge: `Pub-${targetTopic}-Broker`,
      packet: { text: msgId, x: 80, y: targetTopic === 'TECH' ? 60 : 140 },
      subscribersList: [...subscribers]
    });

    // Step 2: Broker receives and identifies matches
    const matchedSubs = subscribers.filter(sub => sub.topics.includes(targetTopic));
    const matchedNames = matchedSubs.map(s => s.name).join(', ');

    trace.push({
      log: `Broker Topic "${targetTopic}" processes message. Identified ${matchedSubs.length} subscribers: [${matchedNames}].`,
      activeNode: `Topic-${targetTopic}`,
      activeEdge: null,
      packet: null,
      subscribersList: [...subscribers]
    });

    // Step 3: Fan out to matched subscribers
    if (matchedSubs.length > 0) {
      trace.push({
        log: `Broker fans out ${msgId} asynchronously to all registered subscribers.`,
        activeNode: 'Broker',
        activeEdge: 'Broker-Subs',
        packet: { text: msgId, type: 'FANOUT', topic: targetTopic },
        subscribersList: [...subscribers]
      });
    } else {
      trace.push({
        log: `No active subscribers for topic "${targetTopic}". Message discarded.`,
        activeNode: 'Broker',
        activeEdge: null,
        packet: null,
        subscribersList: [...subscribers]
      });
    }

    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleToggleSubscription = (subId, topic) => {
    const updated = subscribers.map(sub => {
      if (sub.id === subId) {
        const hasTopic = sub.topics.includes(topic);
        const nextTopics = hasTopic
          ? sub.topics.filter(t => t !== topic)
          : [...sub.topics, topic];
        return { ...sub, topics: nextTopics };
      }
      return sub;
    });

    setSubscribers(updated);
    setSteps([
      {
        log: `Updated subscriptions for Sub ${subId}. Current: [${updated.find(s => s.id === subId).topics.join(', ')}]`,
        activeNode: null,
        activeEdge: null,
        packet: null,
        subscribersList: updated
      }
    ]);
    setCurrentStep(0);
  };

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
    const initialSubs = [
      { id: 1, name: 'Sub A', topics: ['TECH'] },
      { id: 2, name: 'Sub B', topics: ['TECH', 'SPORTS'] },
      { id: 3, name: 'Sub C', topics: ['SPORTS'] }
    ];
    setSubscribers(initialSubs);
    setSteps([
      {
        log: 'Pub/Sub system reset to initial state.',
        activeNode: null,
        activeEdge: null,
        packet: null,
        subscribersList: initialSubs
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];
  const activeSubs = activeStep.subscribersList || subscribers;

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Publish Topic:</span>
      <select
        value={activeTopic}
        onChange={(e) => setActiveTopic(e.target.value)}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        <option value="TECH">TECH</option>
        <option value="SPORTS">SPORTS</option>
      </select>

      <button className="btn-viz-action btn-add" onClick={handlePublish}>
        Publish Message
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Broker Channels (Topics)</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Topic TECH: <span style={{ color: 'var(--brand-cyan)' }}>Active</span></div>
          <div>Topic SPORTS: <span style={{ color: 'var(--brand-cyan)' }}>Active</span></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Subscriber Registry</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          {activeSubs.map(sub => (
            <div key={sub.id} style={{ marginBottom: '0.25rem' }}>
              <strong>{sub.name}</strong>: {sub.topics.length > 0 ? sub.topics.join(', ') : 'None'}
              <div style={{ marginTop: '0.1rem', display: 'flex', gap: '0.35rem' }}>
                <button
                  onClick={() => handleToggleSubscription(sub.id, 'TECH')}
                  style={{
                    fontSize: '0.65rem',
                    backgroundColor: sub.topics.includes('TECH') ? 'var(--bg-tertiary)' : 'transparent',
                    border: '1px solid var(--bg-tertiary)',
                    borderRadius: '2px',
                    color: '#fff',
                    cursor: 'pointer',
                    padding: '1px 3px'
                  }}
                >
                  toggle TECH
                </button>
                <button
                  onClick={() => handleToggleSubscription(sub.id, 'SPORTS')}
                  style={{
                    fontSize: '0.65rem',
                    backgroundColor: sub.topics.includes('SPORTS') ? 'var(--bg-tertiary)' : 'transparent',
                    border: '1px solid var(--bg-tertiary)',
                    borderRadius: '2px',
                    color: '#fff',
                    cursor: 'pointer',
                    padding: '1px 3px'
                  }}
                >
                  toggle SPORTS
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>The <strong>Publish-Subscribe Pattern</strong> is an asynchronous messaging model where senders (publishers) do not program the messages to be sent directly to specific receivers (subscribers):</p>
      <ul>
        <li><strong>Publishers:</strong> Categorize published messages into specific channels or topics without knowing which subscribers exist.</li>
        <li><strong>Topics:</strong> Logical routing filters inside the message broker.</li>
        <li><strong>Subscribers:</strong> Express interest in one or more topics. The broker automatically forwards incoming messages matching the subscriptions.</li>
        <li><strong>Decoupling:</strong> Total decoupling in space (publishers/subscribers do not need to know each other\'s IP addresses) and time (asynchronous delivery).</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Pub/Sub as **Newspaper Subscriptions**:</p>
      <ul>
        <li><strong>Publishers (Journalists):</strong> Write articles and publish them to either the "Sports" or "Tech" sections. They have no idea who reads them.</li>
        <li><strong>Broker (Delivery Service):</strong> Sorts newspapers by topic and delivers them to the houses of subscribers who signed up for those specific topics.</li>
        <li><strong>Subscribers (Readers):</strong> Read sections they like without knowing the individual journalists.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Topic Overloading:</strong> Creating a single topic for all event types, which forces every subscriber to filter out irrelevant messages.</li>
      <li><strong>Missing Message Schema Versioning:</strong> Modifying the structure of messages published to a topic, breaking downstream consumers that were expecting old properties.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is the main difference between Pub/Sub and Point-to-Point message queues?',
      a: 'In a Point-to-Point queue, a message is consumed by exactly one worker, then removed. In Pub/Sub, a message is copied (fanned out) to all subscribers currently registered to that topic.'
    },
    {
      q: 'How does Pub/Sub handle subscriber failures?',
      a: 'Brokers typically offer durable subscriptions. If a subscriber goes offline, the broker tracks its offset or buffers its messages on disk. Once the subscriber recovers, it catches up with the backlog.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which of the following is true in a Pub/Sub system?',
      options: [
        'Publishers must establish direct connections with all subscribers',
        'Subscribers must poll the publisher periodically',
        'Publishers are completely decoupled from subscribers and only target logical topics',
        'Each topic can support at most one subscriber'
      ],
      correctIdx: 2,
      explanation: 'Publishers only send messages to the broker\'s topics. Senders are unaware of how many (or which) subscribers consume the messages.'
    },
    {
      question: 'What is the "fan-out" pattern in Pub/Sub?',
      options: [
        'Shutting down idle connections to save power',
        'Broadcasting a single message to multiple queues/subscribers concurrently',
        'Routing messages based on geographic distance',
        'Splitting a message into smaller pieces'
      ],
      correctIdx: 1,
      explanation: 'Fan-out refers to replicating a single incoming topic event to all subscribed queues/endpoints simultaneously.'
    }
  ];

  const getSubY = (subId) => {
    if (subId === 1) return 40;
    if (subId === 2) return 100;
    return 160;
  };

  return (
    <VisualizerShell
      title="Pub/Sub Architecture"
      subtitle="Publish messages to dedicated topic channels and watch broker fanouts broadcast data to registered subscribers."
      timeComplexity="O(S) fan-out overhead"
      spaceComplexity="O(T + S) registry space"
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
          <line x1="50" y1="60" x2="160" y2="70" stroke={activeStep.activeEdge === 'Pub-TECH-Broker' ? '#f59e0b' : 'var(--bg-tertiary)'} strokeWidth="1.5" />
          <line x1="50" y1="140" x2="160" y2="130" stroke={activeStep.activeEdge === 'Pub-SPORTS-Broker' ? '#f59e0b' : 'var(--bg-tertiary)'} strokeWidth="1.5" />

          {activeSubs.map(sub => {
            const hasTech = sub.topics.includes('TECH');
            const hasSports = sub.topics.includes('SPORTS');
            const y = getSubY(sub.id);
            const isTargeted = activeStep.packet && activeStep.packet.type === 'FANOUT' && 
                               ((activeStep.packet.topic === 'TECH' && hasTech) || (activeStep.packet.topic === 'SPORTS' && hasSports));

            return (
              <g key={sub.id}>
                {hasTech && (
                  <line
                    x1="220"
                    y1="70"
                    x2="330"
                    y2={y}
                    stroke={isTargeted && activeStep.packet.topic === 'TECH' ? '#10b981' : 'var(--bg-tertiary)'}
                    strokeWidth="1.5"
                    strokeDasharray={isTargeted ? 'none' : '3,3'}
                  />
                )}
                {hasSports && (
                  <line
                    x1="220"
                    y1="130"
                    x2="330"
                    y2={y}
                    stroke={isTargeted && activeStep.packet.topic === 'SPORTS' ? '#10b981' : 'var(--bg-tertiary)'}
                    strokeWidth="1.5"
                    strokeDasharray={isTargeted ? 'none' : '3,3'}
                  />
                )}
              </g>
            );
          })}

          <g>
            <circle cx="35" cy="60" r="15" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="35" y="63" textAnchor="middle" fill="#FFFFFF" fontSize="0.4rem" fontWeight="bold">Pub Tech</text>
          </g>
          <g>
            <circle cx="35" cy="140" r="15" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" />
            <text x="35" y="143" textAnchor="middle" fill="#FFFFFF" fontSize="0.4rem" fontWeight="bold">Pub Sports</text>
          </g>

          <g>
            <rect x="160" y="55" width="60" height="30" fill="var(--bg-secondary)" stroke="#1591DC" strokeWidth="2" rx="3" />
            <text x="190" y="73" textAnchor="middle" fill="#1591DC" fontSize="0.45rem" fontWeight="bold">Topic: TECH</text>
          </g>
          <g>
            <rect x="160" y="125" width="60" height="30" fill="var(--bg-secondary)" stroke="#1591DC" strokeWidth="2" rx="3" />
            <text x="190" y="133" textAnchor="middle" fill="#1591DC" fontSize="0.45rem" fontWeight="bold">Topic: SPORTS</text>
          </g>

          {activeSubs.map(sub => {
            const y = getSubY(sub.id);
            return (
              <g key={sub.id}>
                <rect x="330" y={y - 15} width="85" height="30" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" rx="3" />
                <text x="372" y={y - 3} textAnchor="middle" fill="#FFFFFF" fontSize="0.48rem" fontWeight="bold">{sub.name}</text>
                <text x="372" y={y + 8} textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.38rem">
                  {sub.topics.length > 0 ? sub.topics.join(', ') : 'No topics'}
                </text>
              </g>
            );
          })}

          {activeStep.packet && activeStep.packet.type !== 'FANOUT' && (
            <g style={{ transition: 'all 0.35s ease' }}>
              <rect x={activeStep.packet.x - 22} y={activeStep.packet.y - 8} width="44" height="13" fill="var(--bg-primary)" stroke="#f59e0b" strokeWidth="1.2" rx="2" />
              <text x={activeStep.packet.x} y={activeStep.packet.y + 1} textAnchor="middle" fill="#f59e0b" fontSize="0.35rem" fontWeight="bold">
                {activeStep.packet.text}
              </text>
            </g>
          )}

          {activeStep.packet && activeStep.packet.type === 'FANOUT' && activeSubs.map(sub => {
            const hasTech = sub.topics.includes('TECH');
            const hasSports = sub.topics.includes('SPORTS');
            const targetY = getSubY(sub.id);
            const topic = activeStep.packet.topic;

            if ((topic === 'TECH' && hasTech) || (topic === 'SPORTS' && hasSports)) {
              return (
                <g key={`fan-${sub.id}`} style={{ transition: 'all 0.35s ease' }}>
                  <rect x="255" y={((topic === 'TECH' ? 70 : 130) + targetY) / 2 - 6} width="40" height="12" fill="var(--bg-primary)" stroke="#10b981" strokeWidth="1.2" rx="2" />
                  <text x="275" y={((topic === 'TECH' ? 70 : 130) + targetY) / 2 + 2} textAnchor="middle" fill="#10b981" fontSize="0.3rem" fontWeight="bold">
                    {activeStep.packet.text}
                  </text>
                </g>
              );
            }
            return null;
          })}
        </svg>
      </div>
    </VisualizerShell>
  );
}
