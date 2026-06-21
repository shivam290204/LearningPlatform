import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function MessageQueueVisualizer() {
  const [queue, setQueue] = useState(['SMS Task', 'Email Task']);
  const [worker3Active, setWorker3Active] = useState(false);
  const [workersStatus, setWorkersStatus] = useState({
    1: 'IDLE',
    2: 'IDLE',
    3: 'INACTIVE'
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  
  const [steps, setSteps] = useState([
    {
      log: 'Message Queue initialized with 2 buffer tasks. Click Produce Task or scale Workers.',
      queue: ['SMS Task', 'Email Task'],
      workersStatus: { 1: 'IDLE', 2: 'IDLE', 3: 'INACTIVE' },
      packet: null
    }
  ]);

  const generateSteps = (actionType, taskName = '') => {
    let trace = [];
    let currentQueue = [...queue];
    let currentWorkers = { ...workersStatus };
    currentWorkers[3] = worker3Active ? 'IDLE' : 'INACTIVE';

    if (actionType === 'produce') {
      trace.push({
        log: `Producer generated task "${taskName}". Publishing to Queue Broker.`,
        queue: [...currentQueue],
        workersStatus: { ...currentWorkers },
        packet: { text: taskName, x: 70, y: 70 }
      });

      currentQueue.push(taskName);

      trace.push({
        log: `Queue Broker appended "${taskName}" to buffer buffer stack. Queue length: ${currentQueue.length}.`,
        queue: [...currentQueue],
        workersStatus: { ...currentWorkers },
        packet: null
      });
      setQueue(currentQueue);
    } else if (actionType === 'consume') {
      if (currentQueue.length === 0) {
        alert('Queue is empty. Nothing to consume!');
        return;
      }

      // Find first idle worker
      let assignedWorker = null;
      const workerList = worker3Active ? [1, 2, 3] : [1, 2];
      for (let w of workerList) {
        if (currentWorkers[w] === 'IDLE') {
          assignedWorker = w;
          break;
        }
      }

      if (!assignedWorker) {
        trace.push({
          log: 'Backpressure: All workers are currently busy processing tasks! Queue remains buffered.',
          queue: [...currentQueue],
          workersStatus: { ...currentWorkers },
          packet: null
        });
      } else {
        const nextTask = currentQueue.shift();
        
        trace.push({
          log: `Queue Broker dispatches "${nextTask}" to Worker ${assignedWorker}.`,
          queue: [nextTask, ...currentQueue], // Show task departing
          workersStatus: { ...currentWorkers },
          packet: { text: nextTask, x: 200, y: 70 }
        });

        currentWorkers[assignedWorker] = `PROCESSING: ${nextTask}`;

        trace.push({
          log: `Worker ${assignedWorker} starts processing "${nextTask}" asynchronously. Queue length reduced to ${currentQueue.length}.`,
          queue: [...currentQueue],
          workersStatus: { ...currentWorkers },
          packet: null
        });

        setQueue(currentQueue);
        setWorkersStatus(currentWorkers);

        // Simulate task completion shortly after
        setTimeout(() => {
          setWorkersStatus(prev => {
            let updated = { ...prev };
            if (updated[assignedWorker] && updated[assignedWorker].startsWith('PROCESSING')) {
              updated[assignedWorker] = 'IDLE';
            }
            return updated;
          });
        }, 3000);
      }
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
            setQueue(steps[nextStep].queue);
            setWorkersStatus(steps[nextStep].workersStatus);
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
      setQueue(steps[nextStep].queue);
      setWorkersStatus(steps[nextStep].workersStatus);
      setCurrentStep(nextStep);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setQueue(steps[prevStep].queue);
      setWorkersStatus(steps[prevStep].workersStatus);
      setCurrentStep(prevStep);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    const initialQ = ['SMS Task', 'Email Task'];
    const initialWorkers = { 1: 'IDLE', 2: 'IDLE', 3: 'INACTIVE' };
    setQueue(initialQ);
    setWorkersStatus(initialWorkers);
    setSteps([
      {
        log: 'Message Queue reset with 2 buffer tasks.',
        queue: initialQ,
        workersStatus: initialWorkers,
        packet: null
      }
    ]);
  };

  const activeStep = steps[currentStep] || steps[0];
  const activeQ = activeStep.queue;
  const activeWorkers = activeStep.workersStatus;

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <button className="btn-viz-action btn-add" onClick={() => generateSteps('produce', 'Resize Img')}>
        Produce: Resize Image
      </button>
      <button className="btn-viz-action btn-add" onClick={() => generateSteps('produce', 'Send Email')}>
        Produce: Send Email
      </button>
      <button className="btn-viz-action" onClick={() => generateSteps('consume')}>
        Consume Next Task
      </button>
      <button
        className="btn-viz-action btn-clear"
        onClick={() => {
          setWorker3Active(prev => !prev);
          setWorkersStatus(old => {
            let updated = { ...old };
            updated[3] = !worker3Active ? 'IDLE' : 'INACTIVE';
            return updated;
          });
          handleReset();
        }}
      >
        Toggle Worker 3: {worker3Active ? 'ON' : 'OFF'} (Scale)
      </button>
      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Active Tasks in Broker Queue</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          color: 'var(--brand-cyan)'
        }}>
          {activeQ.length > 0 ? (
            activeQ.map((task, idx) => (
              <div key={idx}>
                [{idx}] {task}
              </div>
            ))
          ) : (
            <span style={{ color: 'var(--text-tertiary)' }}>Queue is empty</span>
          )}
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Consumer Workers Status</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          {Object.keys(activeWorkers).map(id => {
            const status = activeWorkers[id];
            let color = 'var(--text-tertiary)';
            if (status === 'IDLE') color = '#10b981';
            if (status.startsWith('PROCESSING')) color = '#f59e0b';
            return (
              <div key={id} style={{ marginBottom: '0.2rem' }}>
                Worker {id}: <strong style={{ color }}>{status}</strong>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>Message Queue</strong> is a form of asynchronous service-to-service communication used in serverless and microservices architectures:</p>
      <ul>
        <li><strong>Producers:</strong> Applications that generate messages/tasks and post them to the queue without waiting for responses.</li>
        <li><strong>Message Broker (Queue):</strong> The buffer buffer (e.g. RabbitMQ, ActiveMQ, Amazon SQS) that holds tasks in FIFO sequence until consumers are ready.</li>
        <li><strong>Consumers:</strong> Background worker services that poll the queue, fetch messages, process them, and send acknowledgements.</li>
        <li><strong>Asynchronous Decoupling:</strong> Protects servers from getting overloaded. If traffic spikes, tasks simply build up in the queue rather than crashing the servers.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of a Message Queue as a **Post Office Mailbox System**:</p>
      <ul>
        <li><strong>Producers:</strong> People dropping letters (Tasks) into the blue mailbox on the street. They don't wait at the mailbox for the recipient to read it.</li>
        <li><strong>Queue Broker:</strong> The mailbox holding all letters securely in a stack.</li>
        <li><strong>Consumers (Workers):</strong> The mail carriers who arrive, empty the mailbox, load letters into their bags, and deliver/process them one by one.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Missing Message Acknowledgements (ACK):</strong> If a consumer crashes midway through processing a task without sending an ACK, the task is lost forever unless the broker re-queues it.</li>
      <li><strong>Infinite Poison Pills:</strong> A corrupted task that fails repeatedly, crashing consumers. When the consumer crashes, the broker re-queues the task, crashing the next worker, looping infinitely. <em>Fix: Use Dead Letter Queues (DLQ).</em></li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is a Dead Letter Queue (DLQ) and what is it used for?',
      a: 'A DLQ is a secondary message queue where the broker isolates corrupted or repeatedly failing messages (Poison Pills) after a set number of retries, preventing them from blocking or crashing consumer workers.'
    },
    {
      q: 'When should you use a Message Queue vs an API call (REST/gRPC)?',
      a: 'Use API calls for synchronous operations requiring immediate feedback (e.g., credit card validations, user logins). Use Message Queues for asynchronous, long-running tasks that can run in the background (e.g., resizing profile pictures, sending confirmation emails, generating PDF reports).'
    }
  ];

  const quizQuestions = [
    {
      question: 'What happens to incoming requests during a massive traffic spike in a system using a Message Queue?',
      options: [
        'They are rejected immediately with HTTP 500 errors',
        'They are buffered safely in the queue to be processed sequentially',
        'They crash the background database',
        'They bypass the consumers'
      ],
      correctIdx: 1,
      explanation: 'The message queue acts as a buffer. During spikes, tasks simply accumulate in the queue, protecting backend workers from getting overwhelmed.'
    },
    {
      question: 'What is the purpose of a Message Acknowledgement (ACK)?',
      options: [
        'To encrypt the packet body',
        'To confirm to the broker that the consumer has successfully processed the task, allowing it to be deleted from the queue',
        'To notify client browsers that the request failed',
        'To scale up the servers'
      ],
      correctIdx: 1,
      explanation: 'An ACK notifies the message broker that a task was completed, indicating it is safe to delete. If no ACK is received, the broker re-allocates the task.'
    }
  ];

  return (
    <VisualizerShell
      title="Message Queue Simulator"
      subtitle="Interact with Producers, job buffer buffers, Consumer polling, and horizontal auto-scalings."
      timeComplexity="O(1) enqueue/dequeue"
      spaceComplexity="O(M) message backlog capacity"
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
          <line x1="50" y1="75" x2="160" y2="75" stroke="var(--bg-tertiary)" strokeWidth="1.5" />
          <line x1="200" y1="75" x2="310" y2="30" stroke="var(--bg-tertiary)" strokeWidth="1.5" />
          <line x1="200" y1="75" x2="310" y2="75" stroke="var(--bg-tertiary)" strokeWidth="1.5" />
          {worker3Active && <line x1="200" y1="75" x2="310" y2="120" stroke="var(--bg-tertiary)" strokeWidth="1.5" />}

          {/* Producers Node */}
          <g>
            <rect x="10" y="55" width="55" height="40" fill="var(--bg-secondary)" stroke="var(--bg-tertiary)" strokeWidth="2" rx="4" />
            <text x="37" y="79" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem" fontWeight="bold">Producers</text>
          </g>

          {/* Message Queue Broker Node */}
          <g>
            <rect x="145" y="45" width="60" height="60" fill="rgba(21, 145, 220, 0.15)" stroke="#1591DC" strokeWidth="2.5" rx="3" />
            <text x="175" y="79" textAnchor="middle" fill="#1591DC" fontSize="0.65rem" fontWeight="bold">Queue</text>
            <text x="175" y="90" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.45rem">({activeQ.length} jobs)</text>
          </g>

          {/* Worker 1 */}
          <g>
            <rect x="310" y="15" width="65" height="26" fill="var(--bg-secondary)" stroke={activeWorkers[1].startsWith('PROCESSING') ? '#f59e0b' : 'var(--bg-tertiary)'} strokeWidth="2" rx="3" />
            <text x="342" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">Worker 1</text>
          </g>

          {/* Worker 2 */}
          <g>
            <rect x="310" y="60" width="65" height="26" fill="var(--bg-secondary)" stroke={activeWorkers[2].startsWith('PROCESSING') ? '#f59e0b' : 'var(--bg-tertiary)'} strokeWidth="2" rx="3" />
            <text x="342" y="77" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">Worker 2</text>
          </g>

          {/* Worker 3 */}
          {worker3Active && (
            <g>
              <rect x="310" y="105" width="65" height="26" fill="var(--bg-secondary)" stroke={activeWorkers[3].startsWith('PROCESSING') ? '#f59e0b' : '#10b981'} strokeWidth="2" rx="3" />
              <text x="342" y="122" textAnchor="middle" fill="#10b981" fontSize="0.65rem">Worker 3</text>
            </g>
          )}

          {/* Animated Packet */}
          {activeStep.packet && (
            <g style={{ transition: 'all 0.3s' }}>
              <rect
                x={activeStep.packet.x - 26}
                y={activeStep.packet.y - 12}
                width="52"
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
