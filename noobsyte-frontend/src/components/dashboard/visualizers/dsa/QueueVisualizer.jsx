import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function QueueVisualizer() {
  const [queueItems, setQueueItems] = useState([8, 16, 32]);
  const [logs, setLogs] = useState(['Queue initialized. Front points to 8, Rear points to 32.']);

  const handleEnqueue = () => {
    if (queueItems.length >= 5) {
      setLogs(prev => ['QueueOverflow! Max capacity (5 items) reached in simulator.', ...prev]);
      return;
    }
    const val = Math.floor(Math.random() * 80 + 10);
    setQueueItems(prev => [...prev, val]);
    setLogs(prev => [`enqueue(${val}): Appended element at the REAR pointer.`, ...prev]);
  };

  const handleDequeue = () => {
    if (queueItems.length === 0) {
      setLogs(prev => ['QueueUnderflow! Cannot dequeue from empty queue.', ...prev]);
      return;
    }
    const dequeuedVal = queueItems[0];
    setQueueItems(prev => prev.slice(1));
    setLogs(prev => [`dequeue() -> Returned element from FRONT: ${dequeuedVal}. Front pointer shifted.`, ...prev]);
  };

  const controls = (
    <>
      <button className="btn-viz-action btn-add" onClick={handleEnqueue}>
        Enqueue Element
      </button>
      <button className="btn-viz-action btn-clear" onClick={handleDequeue}>
        Dequeue Element
      </button>
    </>
  );

  const stateInspector = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
      <div>Front Value: <strong style={{ color: '#FFFFFF' }}>{queueItems.length > 0 ? queueItems[0] : 'null'}</strong></div>
      <div>Rear Value: <strong style={{ color: '#FFFFFF' }}>{queueItems.length > 0 ? queueItems[queueItems.length - 1] : 'null'}</strong></div>
      <div>Queue Length (Size): <strong style={{ color: '#FFFFFF' }}>{queueItems.length}</strong></div>
      <div>Circular Buffer Index: <span style={{ color: '#FFFFFF', fontFamily: 'monospace' }}>Front: 0, Rear: {queueItems.length - 1}</span></div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>Queue</strong> is a linear data structure that follows the <strong>First-In, First-Out (FIFO)</strong> principle:</p>
      <ul>
        <li><strong>FIFO Property:</strong> The first element added is the first one to be removed.</li>
        <li><strong>Key Operations:</strong> <code>enqueue(x)</code> to append at the Rear, and <code>dequeue()</code> to remove from the Front. Both run in O(1) time.</li>
        <li><strong>Implementations:</strong> In Java, Queue is an interface. Standard implementations include <code>LinkedList</code> and <code>ArrayDeque</code>.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of a Queue as a **line of customers waiting at a movie ticket counter**:</p>
      <ul>
        <li>New customers join the line at the very back (enqueue).</li>
        <li>The ticket agent serves the customer at the very front of the line first (dequeue).</li>
        <li>No cutting is allowed! Fairness is strictly maintained in FIFO.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>O(N) Dequeue on Simple Arrays:</strong> Implementing a queue on a simple array and shifting all elements left on dequeue creates a major O(N) performance bottleneck. <em>Fix: Use a circular array buffer or linked nodes to keep operations O(1).</em></li>
      <li><strong>Queue Overflow/Underflow:</strong> Dequeuing from an empty queue.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'How do you implement a Queue using two Stacks?',
      a: 'Maintain two stacks: instack and outstack. For enqueue, push onto instack. For dequeue, if outstack is empty, pop all elements from instack and push them onto outstack, then pop from outstack.'
    },
    {
      q: 'What is a Deque and how is it different from a standard Queue?',
      a: 'A Deque (Double-Ended Queue) allows insertions and deletions at both the Front and the Rear ends, functioning as both a queue and a stack.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which scheduling policy matches a Queue structure?',
      options: [
        'LIFO (Last-In, First-Out)',
        'FIFO (First-In, First-Out)',
        'Priority-based preemption',
        'Random access lookup'
      ],
      correctIdx: 1,
      explanation: 'Queues maintain insertion order strictly, matching the First-In, First-Out (FIFO) scheduling policy.'
    },
    {
      question: 'If you enqueue 5, enqueue 10, dequeue, and enqueue 15, what does the queue contain?',
      options: [
        '[5, 10, 15]',
        '[10, 15]',
        '[5, 15]',
        '[15]'
      ],
      correctIdx: 1,
      explanation: 'Enqueue 5 and 10 results in [5, 10]. Dequeue removes the first element (5), leaving [10]. Enqueue 15 adds to the end, resulting in [10, 15].'
    }
  ];

  return (
    <VisualizerShell
      title="Queue (FIFO) Visualization"
      subtitle="Observe FIFO data structures managing elements at Front and Rear pointers."
      timeComplexity="O(1) enqueue/dequeue"
      spaceComplexity="O(N)"
      theoryContent={theory}
      analogyContent={analogy}
      mistakesContent={mistakes}
      interviewQuestions={interviewQuestions}
      quizQuestions={quizQuestions}
      controls={controls}
      logs={logs}
      stateInspector={stateInspector}
    >
      <div className="queue-elements-row" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minHeight: '130px', justifyContent: 'center', width: '100%' }}>
        {queueItems.length === 0 ? (
          <span className="empty-queue-tag" style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Queue is Empty</span>
        ) : (
          <>
            <div className="rear-ptr-marker" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '0.5rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-secondary)' }}>REAR</span>
              <span className="rear-arrow" style={{ color: 'var(--brand-cyan)' }}>▶</span>
            </div>

            {queueItems.map((item, index) => {
              const isFront = index === 0;
              const isRear = index === queueItems.length - 1;

              return (
                <div
                  key={index}
                  className={`queue-item-box ${isFront ? 'highlight-front' : ''}`}
                  style={{
                    width: '80px',
                    height: '52px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: isFront ? '2px solid var(--brand-cyan)' : '2px solid var(--bg-tertiary)',
                    borderRadius: 'var(--border-radius-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <span className="queue-cell-val" style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFFFFF' }}>{item}</span>
                  <div className="queue-cell-ptrs" style={{ position: 'absolute', bottom: '-20px', display: 'flex', gap: '0.2rem' }}>
                    {isFront && <span className="ptr-badge front-tag" style={{ fontSize: '0.55rem', padding: '0.1rem 0.3rem', border: '1px solid var(--brand-cyan)', color: 'var(--brand-cyan)', backgroundColor: 'var(--brand-cyan-muted)' }}>FRONT</span>}
                    {isRear && <span className="ptr-badge rear-tag" style={{ fontSize: '0.55rem', padding: '0.1rem 0.3rem', border: '1px solid var(--bg-tertiary)', color: 'var(--text-secondary)', backgroundColor: 'rgba(255,255,255,0.05)' }}>REAR</span>}
                  </div>
                </div>
              );
            })}

            <div className="front-ptr-marker" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '0.5rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-secondary)' }}>FRONT</span>
              <span className="front-arrow" style={{ color: 'var(--brand-cyan)' }}>▶</span>
            </div>
          </>
        )}
      </div>
    </VisualizerShell>
  );
}
