import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function HeapVisualizer() {
  const [array, setArray] = useState([10, 20, 30, 45, 50, 60, 70, 99]);
  const [heapType, setHeapType] = useState('min'); // 'min' or 'max'
  const [inputVal, setInputVal] = useState('');
  
  // Playback state
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [steps, setSteps] = useState([
    {
      array: [10, 20, 30, 45, 50, 60, 70, 99],
      log: 'Heap initialized (Min-Heap format). Insert elements or extract root.',
      highlightIdxs: [],
      comparingIdxs: []
    }
  ]);

  const cloneArray = (arr) => [...arr];

  // Perform heap insertion and log trace steps
  const handleInsert = () => {
    const val = Number(inputVal);
    if (isNaN(val) || val < 1 || val > 99) {
      alert('Please enter an integer between 1 and 99.');
      return;
    }
    if (array.length >= 15) {
      alert('Visualizer size limit reached (max 15 elements).');
      return;
    }

    let trace = [];
    let currentHeap = cloneArray(array);
    
    // Step 0: show current state
    trace.push({
      array: cloneArray(currentHeap),
      log: `Prepare to insert ${val}.`,
      highlightIdxs: [],
      comparingIdxs: []
    });

    // Step 1: append to end
    currentHeap.push(val);
    let curr = currentHeap.length - 1;
    trace.push({
      array: cloneArray(currentHeap),
      log: `Appended ${val} at the end of the array (index ${curr}).`,
      highlightIdxs: [curr],
      comparingIdxs: []
    });

    // Bubble up heapify-up
    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);
      const isViolation = heapType === 'min' 
        ? currentHeap[curr] < currentHeap[parent]
        : currentHeap[curr] > currentHeap[parent];

      trace.push({
        array: cloneArray(currentHeap),
        log: `Compare index ${curr} (${currentHeap[curr]}) with parent index ${parent} (${currentHeap[parent]}).`,
        highlightIdxs: [],
        comparingIdxs: [curr, parent]
      });

      if (isViolation) {
        // Swap
        const temp = currentHeap[curr];
        currentHeap[curr] = currentHeap[parent];
        currentHeap[parent] = temp;
        
        trace.push({
          array: cloneArray(currentHeap),
          log: `Violation! Swap index ${curr} and parent index ${parent}.`,
          highlightIdxs: [curr, parent],
          comparingIdxs: []
        });

        curr = parent;
      } else {
        break;
      }
    }

    trace.push({
      array: cloneArray(currentHeap),
      log: `Insertion of ${val} completed. Heap property satisfied.`,
      highlightIdxs: [curr],
      comparingIdxs: []
    });

    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
    setInputVal('');
    setArray(currentHeap);
  };

  // Perform heap extraction and log trace steps
  const handleExtract = () => {
    if (array.length === 0) {
      alert('Heap is empty.');
      return;
    }

    let trace = [];
    let currentHeap = cloneArray(array);

    if (currentHeap.length === 1) {
      const removed = currentHeap.pop();
      trace.push({
        array: [],
        log: `Extracted last remaining element ${removed}. Heap is now empty.`,
        highlightIdxs: [],
        comparingIdxs: []
      });
      setSteps(trace);
      setCurrentStep(0);
      setIsPlaying(false);
      setArray([]);
      return;
    }

    const originalRoot = currentHeap[0];
    const lastVal = currentHeap[currentHeap.length - 1];

    trace.push({
      array: cloneArray(currentHeap),
      log: `Prepare to extract root element (${originalRoot}). Swap it with last element (${lastVal}).`,
      highlightIdxs: [0, currentHeap.length - 1],
      comparingIdxs: []
    });

    // Swap root with last
    currentHeap[0] = lastVal;
    currentHeap[currentHeap.length - 1] = originalRoot;

    trace.push({
      array: cloneArray(currentHeap),
      log: `Swapped root with last element. Now removing ${originalRoot} from the end.`,
      highlightIdxs: [currentHeap.length - 1],
      comparingIdxs: []
    });

    currentHeap.pop(); // Remove the last element (which is the old root)
    
    trace.push({
      array: cloneArray(currentHeap),
      log: `Removed old root. New root value is ${currentHeap[0]}. Starting heapify-down...`,
      highlightIdxs: [0],
      comparingIdxs: []
    });

    // Bubble down heapify-down
    let curr = 0;
    const len = currentHeap.length;

    while (2 * curr + 1 < len) {
      const leftChild = 2 * curr + 1;
      const rightChild = 2 * curr + 2;
      let targetChild = leftChild;

      if (rightChild < len) {
        const checkRightBetter = heapType === 'min'
          ? currentHeap[rightChild] < currentHeap[leftChild]
          : currentHeap[rightChild] > currentHeap[leftChild];
        if (checkRightBetter) {
          targetChild = rightChild;
        }
      }

      trace.push({
        array: cloneArray(currentHeap),
        log: `Compare parent index ${curr} (${currentHeap[curr]}) with best child index ${targetChild} (${currentHeap[targetChild]}).`,
        highlightIdxs: [],
        comparingIdxs: [curr, targetChild]
      });

      const isViolation = heapType === 'min'
        ? currentHeap[curr] > currentHeap[targetChild]
        : currentHeap[curr] < currentHeap[targetChild];

      if (isViolation) {
        const temp = currentHeap[curr];
        currentHeap[curr] = currentHeap[targetChild];
        currentHeap[targetChild] = temp;

        trace.push({
          array: cloneArray(currentHeap),
          log: `Violation! Swap parent index ${curr} and child index ${targetChild}.`,
          highlightIdxs: [curr, targetChild],
          comparingIdxs: []
        });

        curr = targetChild;
      } else {
        break;
      }
    }

    trace.push({
      array: cloneArray(currentHeap),
      log: `Extraction complete. Extracted root value was ${originalRoot}. Heap balance restored.`,
      highlightIdxs: [curr],
      comparingIdxs: []
    });

    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
    setArray(currentHeap);
  };

  // Convert current array into heap representation
  const handleHeapifyAll = (type = heapType) => {
    let trace = [];
    let currentHeap = cloneArray(array);

    trace.push({
      array: cloneArray(currentHeap),
      log: `Starting full buildHeap in ${type.toUpperCase()}-Heap mode.`,
      highlightIdxs: [],
      comparingIdxs: []
    });

    const len = currentHeap.length;
    // Start from last non-leaf node: Math.floor(len / 2) - 1 down to 0
    for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
      let curr = i;
      while (2 * curr + 1 < len) {
        const leftChild = 2 * curr + 1;
        const rightChild = 2 * curr + 2;
        let targetChild = leftChild;

        if (rightChild < len) {
          const checkRightBetter = type === 'min'
            ? currentHeap[rightChild] < currentHeap[leftChild]
            : currentHeap[rightChild] > currentHeap[leftChild];
          if (checkRightBetter) {
            targetChild = rightChild;
          }
        }

        const isViolation = type === 'min'
          ? currentHeap[curr] > currentHeap[targetChild]
          : currentHeap[curr] < currentHeap[targetChild];

        if (isViolation) {
          const temp = currentHeap[curr];
          currentHeap[curr] = currentHeap[targetChild];
          currentHeap[targetChild] = temp;

          trace.push({
            array: cloneArray(currentHeap),
            log: `Heapify at sub-root ${i}: Swapped index ${curr} and index ${targetChild}.`,
            highlightIdxs: [curr, targetChild],
            comparingIdxs: []
          });
          curr = targetChild;
        } else {
          break;
        }
      }
    }

    trace.push({
      array: cloneArray(currentHeap),
      log: `Full buildHeap complete. Heapified to ${type.toUpperCase()}-Heap!`,
      highlightIdxs: [],
      comparingIdxs: []
    });

    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
    setArray(currentHeap);
  };

  const handleToggleHeapType = (e) => {
    const selected = e.target.value;
    setHeapType(selected);
    handleHeapifyAll(selected);
  };

  // Playback timer
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < steps.length - 1) {
            const nextStep = prev + 1;
            setArray(steps[nextStep].array);
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
      setArray(steps[nextStep].array);
      setCurrentStep(nextStep);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setArray(steps[prevStep].array);
      setCurrentStep(prevStep);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    const initialArr = [10, 20, 30, 45, 50, 60, 70, 99];
    setArray(initialArr);
    setSteps([
      {
        array: initialArr,
        log: 'Heap reset. Min-Heap active.',
        highlightIdxs: [],
        comparingIdxs: []
      }
    ]);
  };

  const handleClear = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setArray([]);
    setSteps([
      {
        array: [],
        log: 'Heap cleared. Insert elements to build the heap.',
        highlightIdxs: [],
        comparingIdxs: []
      }
    ]);
  };

  const activeStepData = steps[currentStep] || steps[0];
  const activeArr = activeStepData.array;

  // Complete binary tree SVG coordinates layout
  const treeCoords = [
    { x: 200, y: 25 }, // Index 0
    { x: 100, y: 70 }, // Index 1
    { x: 300, y: 70 }, // Index 2
    { x: 50, y: 115 },  // Index 3
    { x: 150, y: 115 }, // Index 4
    { x: 250, y: 115 }, // Index 5
    { x: 350, y: 115 }, // Index 6
    { x: 25, y: 160 },  // Index 7
    { x: 75, y: 160 },  // Index 8
    { x: 125, y: 160 }, // Index 9
    { x: 175, y: 160 }, // Index 10
    { x: 225, y: 160 }, // Index 11
    { x: 275, y: 160 }, // Index 12
    { x: 325, y: 160 }, // Index 13
    { x: 375, y: 160 }  // Index 14
  ];

  const links = [];
  activeArr.forEach((val, idx) => {
    const left = 2 * idx + 1;
    const right = 2 * idx + 2;
    if (left < activeArr.length) {
      links.push({ id: `link-${idx}-${left}`, x1: treeCoords[idx].x, y1: treeCoords[idx].y, x2: treeCoords[left].x, y2: treeCoords[left].y });
    }
    if (right < activeArr.length) {
      links.push({ id: `link-${idx}-${right}`, x1: treeCoords[idx].x, y1: treeCoords[idx].y, x2: treeCoords[right].x, y2: treeCoords[right].y });
    }
  });

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <input
        type="text"
        placeholder="Key (1-99)"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        style={{
          width: '80px',
          padding: '0.45rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem',
          textAlign: 'center'
        }}
      />
      <button className="btn-viz-action btn-add" onClick={handleInsert}>
        Insert
      </button>
      <button className="btn-viz-action" onClick={handleExtract}>
        Extract Root
      </button>
      
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Type:</span>
      <select 
        value={heapType} 
        onChange={handleToggleHeapType}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        <option value="min">Min-Heap</option>
        <option value="max">Max-Heap</option>
      </select>

      <button className="btn-viz-action btn-clear" onClick={handleClear}>
        Clear
      </button>
      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
      <div>Backing Array Size: <strong style={{ color: '#FFFFFF' }}>{activeArr.length}</strong></div>
      <div>Comparing Pointers: <span style={{ color: 'var(--brand-cyan)' }}>{activeStepData.comparingIdxs.length > 0 ? `Indices [${activeStepData.comparingIdxs.join(', ')}]` : 'None'}</span></div>
      <div>Active Swap Indices: <span style={{ color: '#10b981' }}>{activeStepData.highlightIdxs.length > 0 ? `Indices [${activeStepData.highlightIdxs.join(', ')}]` : 'None'}</span></div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>Binary Heap</strong> is a complete binary tree that satisfies the **Heap Property**:</p>
      <ul>
        <li><strong>Completeness:</strong> Every level of the tree is completely filled, except possibly the bottom level, which is filled from left to right. This guarantees a height of <code>O(log N)</code>.</li>
        <li><strong>Heap Property:</strong>
          <ul>
            <li><strong>Min-Heap:</strong> The value of each node is greater than or equal to the value of its parent (root is the minimum).</li>
            <li><strong>Max-Heap:</strong> The value of each node is less than or equal to the value of its parent (root is the maximum).</li>
          </ul>
        </li>
        <li><strong>Backing Array Representation:</strong>
          <ul>
            <li>Left child of index <code>i</code> is at index <code>2*i + 1</code>.</li>
            <li>Right child is at index <code>2*i + 2</code>.</li>
            <li>Parent is at index <code>floor((i-1)/2)</code>.</li>
          </ul>
        </li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of a Binary Heap as an **Office Priority Escalation Desk**:</p>
      <ul>
        <li>The company assigns ticket priority values. Under a Min-Heap system, the ticket with the lowest priority number (e.g. priority 1, meaning most critical) is ALWAYS at the desk of the main supervisor (the Root).</li>
        <li>When a new ticket is submitted, it is assigned to the lowest junior analyst. If its priority is higher than the analyst's supervisor, they trade tasks (bubble-up) until the task settles at the correct hierarchy level!</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Index Mapping Errors:</strong> Forgetting that arrays are 0-indexed. Using 1-indexed formulas <code>2*i</code> instead of <code>2*i + 1</code>.</li>
      <li><strong>Heapify Boundary Violations:</strong> Attempting to compare children index pointers that exceed the active array length.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is the time complexity of building a heap from an unsorted array of size N?',
      a: 'Building a heap (buildHeap/heapifyAll) takes O(N) time. While individual insertions are O(log N), heapifying from the bottom-up allows elements closer to the leaves to traverse smaller distances, resulting in O(N) total work.'
    },
    {
      q: 'Why are heaps preferred over sorted arrays for implementing Priority Queues?',
      a: 'Inserting an element into a sorted array takes O(N) worst-case time (due to shifts), whereas a Binary Heap performs insertion and deletion in O(log N) time.'
    }
  ];

  const quizQuestions = [
    {
      question: 'In a Min-Heap represented by array [12, 15, 30, 40, 50, 90], what is the index of the parent of element 40?',
      options: [
        'Index 0 (Value 12)',
        'Index 1 (Value 15)',
        'Index 2 (Value 30)',
        'Index 3 (Value 40)'
      ],
      correctIdx: 1,
      explanation: 'Element 40 is at index 3. Its parent is located at floor((3-1)/2) = index 1, which contains value 15.'
    },
    {
      question: 'What is the runtime complexity of extracting the root element from a binary heap of size N?',
      options: [
        'O(1)',
        'O(log N)',
        'O(N)',
        'O(N log N)'
      ],
      correctIdx: 1,
      explanation: 'Extracting the root element involves swapping the root with the last leaf node, which is O(1), followed by a heapify-down operation which traverses at most the height of the tree, O(log N).'
    }
  ];

  return (
    <VisualizerShell
      title="Binary Heap Simulator"
      subtitle="Interact with heapify-up and heapify-down algorithms on physical arrays vs logical complete trees."
      timeComplexity="O(log N)"
      spaceComplexity="O(N)"
      theoryContent={theory}
      analogyContent={analogy}
      mistakesContent={mistakes}
      interviewQuestions={interviewQuestions}
      quizQuestions={quizQuestions}
      controls={controls}
      logs={[activeStepData.log]}
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
        
        {/* Array Visualization */}
        {activeArr.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Physical Memory Representation (Array)</span>
            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {activeArr.map((val, idx) => {
                const isComparing = activeStepData.comparingIdxs.includes(idx);
                const isSwapping = activeStepData.highlightIdxs.includes(idx);
                
                let bg = 'var(--bg-secondary)';
                let border = '1px solid var(--bg-tertiary)';
                let color = '#FFFFFF';

                if (isComparing) {
                  bg = 'rgba(21, 145, 220, 0.15)';
                  border = '2px solid #1591DC';
                  color = '#1591DC';
                }
                if (isSwapping) {
                  bg = 'rgba(16, 185, 129, 0.15)';
                  border = '2px solid #10b981';
                  color = '#10b981';
                }

                return (
                  <div
                    key={idx}
                    style={{
                      width: '42px',
                      height: '42px',
                      backgroundColor: bg,
                      border,
                      borderRadius: 'var(--border-radius-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.25rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontSize: '0.55rem', color: 'var(--text-tertiary)' }}>[{idx}]</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color }}>{val}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', textAlign: 'center', marginTop: '1rem' }}>
            Heap is empty. Insert a value to begin.
          </div>
        )}

        {/* Tree Visualization */}
        {activeArr.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Logical Structure (Complete Binary Tree)</span>
            <svg width="400" height="180" style={{ overflow: 'visible' }}>
              {/* Draw Links */}
              {links.map(link => (
                <line
                  key={link.id}
                  x1={link.x1}
                  y1={link.y1}
                  x2={link.x2}
                  y2={link.y2}
                  stroke="var(--bg-tertiary)"
                  strokeWidth="2"
                />
              ))}

              {/* Draw Nodes */}
              {activeArr.map((val, idx) => {
                const coords = treeCoords[idx];
                const isComparing = activeStepData.comparingIdxs.includes(idx);
                const isSwapping = activeStepData.highlightIdxs.includes(idx);

                let bg = 'var(--bg-secondary)';
                let stroke = 'var(--bg-tertiary)';
                let color = '#FFFFFF';

                if (isComparing) {
                  bg = 'rgba(21, 145, 220, 0.15)';
                  stroke = '#1591DC';
                  color = '#1591DC';
                }
                if (isSwapping) {
                  bg = 'rgba(16, 185, 129, 0.15)';
                  stroke = '#10b981';
                  color = '#10b981';
                }

                return (
                  <g key={idx}>
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r="12"
                      fill={bg}
                      stroke={stroke}
                      strokeWidth="2.5"
                    />
                    <text
                      x={coords.x}
                      y={coords.y + 4}
                      textAnchor="middle"
                      fill={color}
                      style={{ fontSize: '0.7rem', fontWeight: '800', fontFamily: 'sans-serif' }}
                    >
                      {val}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* Legend */}
        {activeArr.length > 0 && (
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '10px', height: '10px', border: '1.5px solid #1591DC', backgroundColor: 'rgba(21, 145, 220, 0.15)' }}></div> Comparing
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '10px', height: '10px', border: '1.5px solid #10b981', backgroundColor: 'rgba(16, 185, 129, 0.15)' }}></div> Swapping
            </div>
          </div>
        )}

      </div>
    </VisualizerShell>
  );
}
