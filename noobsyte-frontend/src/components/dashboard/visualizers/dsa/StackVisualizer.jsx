import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function StackVisualizer() {
  const [stackItems, setStackItems] = useState([12, 24, 48]);
  const [logs, setLogs] = useState(['Stack initialized. Top points to index 2 (value: 48).']);

  const handlePush = () => {
    if (stackItems.length >= 5) {
      setLogs(prev => ['StackOverflowError! Stack limit (5 items) reached in simulator.', ...prev]);
      return;
    }
    const val = Math.floor(Math.random() * 80 + 10);
    setStackItems(prev => [...prev, val]);
    setLogs(prev => [`push(${val}): Pushed value on top of the Stack. Top pointer moved to index ${stackItems.length}.`, ...prev]);
  };

  const handlePop = () => {
    if (stackItems.length === 0) {
      setLogs(prev => ['EmptyStackException! Pop operation underflow.', ...prev]);
      return;
    }
    const popped = stackItems[stackItems.length - 1];
    setStackItems(prev => prev.slice(0, -1));
    setLogs(prev => [`pop() -> Returned ${popped}. Top pointer moved to index ${stackItems.length - 2}.`, ...prev]);
  };

  const controls = (
    <>
      <button className="btn-viz-action btn-add" onClick={handlePush}>
        Push Value
      </button>
      <button className="btn-viz-action btn-clear" onClick={handlePop}>
        Pop Value
      </button>
    </>
  );

  const stateInspector = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
      <div>Top Pointer Index: <strong style={{ color: '#FFFFFF' }}>{stackItems.length - 1}</strong></div>
      <div>Top Element Value: <strong style={{ color: '#FFFFFF' }}>{stackItems.length > 0 ? stackItems[stackItems.length - 1] : 'null'}</strong></div>
      <div>Stack Depth (Size): <strong style={{ color: '#FFFFFF' }}>{stackItems.length}</strong></div>
      <div>Status: <strong style={{ color: stackItems.length >= 5 ? '#ef4444' : '#10b981' }}>
        {stackItems.length === 0 ? 'EMPTY (UNDERFLOW)' : stackItems.length >= 5 ? 'FULL (OVERFLOW)' : 'OPERATIONAL'}
      </strong></div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>Stack</strong> is a linear data structure that follows the <strong>Last-In, First-Out (LIFO)</strong> principle:</p>
      <ul>
        <li><strong>LIFO Property:</strong> The last element inserted is the first one to be removed.</li>
        <li><strong>Key Operations:</strong> <code>push(x)</code> to add an element to the top, and <code>pop()</code> to remove and return the top element. Both execute in O(1) time.</li>
        <li><strong>Memory Allocations:</strong> In JVM stack frames, methods are pushed onto the call stack when invoked and popped off when they return.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of a Stack as a **pile of dinner plates** in a cafeteria:</p>
      <ul>
        <li>You can only place a new plate on the top of the pile (push).</li>
        <li>You can only take the top plate off the pile (pop).</li>
        <li>If you try to pull a plate from the middle, you risk breaking the entire stack!</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>StackOverflowError:</strong> Triggered when recursion depth is too high. The system stack frame runs out of memory because too many frames are pushed without being popped.</li>
      <li><strong>EmptyStackException:</strong> Calling <code>pop()</code> or <code>peek()</code> on an empty stack (underflow).</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'How can you implement a Stack using two Queues?',
      a: 'Keep one queue active. During a push, insert the element to the second queue, then dequeue all elements from the first queue and enqueue them in the second queue. Swap the queues. Popping is then a simple dequeue from the active queue.'
    },
    {
      q: 'What is the difference between push() and peek() operations on a Stack?',
      a: 'push() inserts a new element on the top, increasing the size by 1. peek() returns the value of the top element without removing it, leaving the size unchanged.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which of the following scenarios is NOT a practical application of a Stack?',
      options: [
        'Undo/Redo operations in text editors',
        'Balanced parenthesis checking in compilers',
        'Job printing queue scheduling',
        'Back button navigation history in web browsers'
      ],
      correctIdx: 2,
      explanation: 'A job printing queue scheduling uses a Queue (First-In, First-Out) because the first print job sent should be the first one printed. Undo, parenthesis matching, and browser navigation histories all use LIFO stacks.'
    },
    {
      question: 'What is the result of pushing 10, pushing 20, popping once, and then calling peek()?',
      options: [
        '10',
        '20',
        'null',
        'An Exception'
      ],
      correctIdx: 0,
      explanation: 'Pushing 10 then 20 creates stack [10, 20]. Popping once removes 20, leaving [10]. Calling peek() looks at the top element, which is 10.'
    }
  ];

  return (
    <VisualizerShell
      title="Stack (LIFO) Visualization"
      subtitle="Interact with Stack structures showing push/pop operations at the top pointer."
      timeComplexity="O(1) push/pop"
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
      <div className="stack-visual-column" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px', minHeight: '220px', position: 'relative' }}>
        <span className="stack-limit-tag" style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Stack Cap: 5 Items</span>
        
        {/* Render stack items in reverse order (top is first visually) */}
        {stackItems.length === 0 ? (
          <div className="empty-stack-tag" style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', padding: '3rem 0' }}>Stack is Empty</div>
        ) : (
          [...stackItems].reverse().map((item, index) => {
            const actualIdx = stackItems.length - 1 - index;
            const isTop = index === 0;

            return (
              <div
                key={actualIdx}
                className={`stack-item-box ${isTop ? 'highlight-top' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '140px',
                  height: '38px',
                  backgroundColor: isTop ? 'rgba(21, 145, 220, 0.05)' : 'var(--bg-secondary)',
                  border: isTop ? '2px solid var(--brand-cyan)' : '2px solid var(--bg-tertiary)',
                  borderBottom: 'none',
                  position: 'relative',
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#FFFFFF'
                }}
              >
                <span className="stack-idx" style={{ position: 'absolute', left: '10px', fontSize: '0.65rem', color: isTop ? 'var(--brand-cyan)' : 'var(--text-tertiary)' }}>[{actualIdx}]</span>
                <span>{item}</span>

                {isTop && (
                  <div className="top-ptr-indicator" style={{ position: 'absolute', right: '-65px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <span className="pointer-arrow-left" style={{ color: 'var(--brand-cyan)' }}>◀</span>
                    <span className="top-ptr-label" style={{ fontSize: '0.6rem', color: 'var(--brand-cyan)', fontWeight: '700' }}>TOP</span>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div className="stack-base-floor" style={{ width: '160px', height: '4px', backgroundColor: '#FFFFFF', borderRadius: '2px' }}></div>
      </div>
    </VisualizerShell>
  );
}
