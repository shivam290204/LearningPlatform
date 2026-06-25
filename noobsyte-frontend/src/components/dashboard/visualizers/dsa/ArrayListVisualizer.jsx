import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function ArrayListVisualizer() {
  const [arrayItems, setArrayItems] = useState([15, 30, 45]);
  const [arrayCapacity, setArrayCapacity] = useState(4);
  const [logs, setLogs] = useState(['ArrayList initialized with size = 3, capacity = 4.']);
  const [isResizing, setIsResizing] = useState(false);

  const handleAdd = () => {
    if (isResizing) return;
    const val = Math.floor(Math.random() * 80 + 10);

    if (arrayItems.length < arrayCapacity) {
      setArrayItems(prev => [...prev, val]);
      setLogs(prev => [
        `Added element ${val} at index ${arrayItems.length}.`,
        ...prev
      ]);
    } else {
      setIsResizing(true);
      setLogs(prev => [
        `Capacity limit (${arrayCapacity}) reached! Triggering internal buffer resizing...`,
        ...prev
      ]);

      setTimeout(() => {
        const oldCapacity = arrayCapacity;
        const newCapacity = oldCapacity * 2;
        setLogs(prev => [
          `Doubled backing array capacity from ${oldCapacity} to ${newCapacity} & copied elements.`,
          ...prev
        ]);
        setArrayCapacity(newCapacity);

        setTimeout(() => {
          setArrayItems(prev => [...prev, val]);
          setLogs(prev => [
            `Added element ${val} at index ${arrayItems.length} inside the newly expanded buffer.`,
            ...prev
          ]);
          setIsResizing(false);
        }, 600);
      }, 900);
    }
  };

  const handleClear = () => {
    setArrayItems([]);
    setArrayCapacity(4);
    setLogs(['ArrayList cleared. Size = 0, capacity = 4.']);
    setIsResizing(false);
  };

  const controls = (
    <>
      <button className="btn-viz-action btn-add" onClick={handleAdd} disabled={isResizing}>
        <i className="fa-solid fa-plus"></i> add() Element
      </button>
      <button className="btn-viz-action btn-clear" onClick={handleClear} disabled={isResizing}>
        <i className="fa-solid fa-trash"></i> Reset Array
      </button>
    </>
  );

  const stateInspector = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
      <div>Active Size: <strong style={{ color: '#FFFFFF' }}>{arrayItems.length}</strong></div>
      <div>Backing Capacity: <strong style={{ color: '#FFFFFF' }}>{arrayCapacity}</strong></div>
      <div>Resizing In Progress: <strong style={{ color: isResizing ? '#ef4444' : '#10b981' }}>{isResizing ? 'TRUE' : 'FALSE'}</strong></div>
      <div>Load Factor: <strong style={{ color: '#FFFFFF' }}>{((arrayItems.length / arrayCapacity) * 100).toFixed(0)}%</strong></div>
    </div>
  );

  const theory = (
    <div>
      <p>An <strong>ArrayList</strong> in Java is a dynamically resizing array structure built on top of a primitive array. It provides O(1) random access lookup times, but insertions can take up to O(N) when the backing array must resize:</p>
      <ul>
        <li><strong>Backing Array:</strong> The items are placed in a fixed-size internal primitive array.</li>
        <li><strong>Resizing Trigger:</strong> When size equals capacity (100% capacity in Java's default implementation), Java allocates a new backing array.</li>
        <li><strong>Growth Factor:</strong> Java ArrayLists increase their capacity by <strong>50%</strong> (newCapacity = oldCapacity + (oldCapacity &gt;&gt; 1)). We simulate <strong>100% (2x)</strong> here for visual simplicity.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of an ArrayList as a **bus with folding seat rows**:</p>
      <ul>
        <li>As long as there are empty seats, passengers can hop in immediately and take a seat index (O(1) insertion).</li>
        <li>Once the bus is completely full, a new passenger triggers an operation: we buy a new double-sized bus, move all existing passengers over (copying overhead O(N)), and then let the new passenger board.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Frequent Resizing Overhead:</strong> Inserting thousands of items without declaring an initial capacity causes multiple internal resizes, severely degrading performance. <em>Fix: Specify initial capacity in constructors when total size is known.</em></li>
      <li><strong>Deleting Elements:</strong> Deleting elements from the middle of an ArrayList requires shifting subsequent items left (O(N) operation).</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is the default capacity of an empty ArrayList in Java, and how does it resize?',
      a: 'The default capacity is 10. When the capacity is reached, it dynamically resizes by allocating a new array that is 1.5 times the original capacity, and copies all elements to the new array.'
    },
    {
      q: 'Why does adding an element to an ArrayList have an amortized O(1) time complexity?',
      a: 'Although copying elements during resizing takes O(N) time, resizing occurs infrequently (exponentially). The cost is spread out over many O(1) insertions, making the average (amortized) cost O(1).'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which of the following operations is slowest on a very large ArrayList?',
      options: [
        'Fetching an item at a specific index',
        'Adding an item at the end (assuming capacity is available)',
        'Inserting an item at index 0',
        'Checking if the list is empty'
      ],
      correctIdx: 2,
      explanation: 'Inserting at index 0 requires shifting all existing elements in the array one index to the right, which takes O(N) time. The others are O(1).'
    },
    {
      question: 'How can you optimize ArrayList performance if you already know you will insert 10,000 items?',
      options: [
        'Call list.trimToSize() after every insertion',
        'Construct it using "new ArrayList<>(10000)" to pre-allocate capacity',
        'Use a LinkedList instead',
        'No optimization is needed as Java resizes arrays instantly'
      ],
      correctIdx: 1,
      explanation: 'Initializing the ArrayList with the expected size allocates a backing array of 10,000 slots immediately, preventing the runtime overhead of repeated resizing and array copy operations.'
    }
  ];

  return (
    <VisualizerShell
      title="ArrayList Resizing & Buffer Allocation"
      subtitle="Observe backing primitive arrays double in size when capacity is exceeded."
      timeComplexity="Amortized O(1)"
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
      <div className="arraylist-buffer-container" style={{ width: '100%', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <span className="column-label-small">Backing Array Buffer</span>
        <div className="arraylist-cells-row" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {Array.from({ length: arrayCapacity }).map((_, idx) => {
            const hasItem = idx < arrayItems.length;
            const item = hasItem ? arrayItems[idx] : null;
            const isHighlight = isResizing && idx >= arrayCapacity / 2;

            return (
              <div
                key={idx}
                className={`arraylist-cell ${hasItem ? 'filled' : 'empty'} ${isHighlight ? 'highlight-resize' : ''}`}
                style={{
                  width: '60px',
                  height: '60px',
                  border: hasItem ? '2px solid var(--brand-cyan)' : '1px dashed var(--bg-tertiary)',
                  backgroundColor: isHighlight ? 'rgba(36, 224, 217, 0.05)' : hasItem ? 'var(--bg-secondary)' : 'transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.4rem',
                  borderRadius: 'var(--border-radius-sm)',
                  transition: 'all 0.3s'
                }}
              >
                <span className="cell-index" style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>[{idx}]</span>
                <span className="cell-value" style={{ fontSize: '1.1rem', fontWeight: '800', color: hasItem ? '#FFFFFF' : 'transparent' }}>
                  {hasItem ? item : '-'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </VisualizerShell>
  );
}
