import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function QuickSortVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  // Pre-calculated trace steps of Lomuto Partition Quick Sort on [38, 27, 43, 3, 9, 82, 10, 19]
  const steps = [
    {
      action: 'Initial Array',
      log: 'Initial unsorted array loaded. Active search range: Index [0] to [7].',
      array: [38, 27, 43, 3, 9, 82, 10, 19],
      low: 0,
      high: 7,
      pivotIdx: 7,
      iIdx: -1,
      jIdx: 0,
      sortedIndices: []
    },
    {
      action: 'Compare 38 vs Pivot 19',
      log: 'Compare array[j] (38) vs pivot (19). Since 38 > 19, do not swap. Advance j.',
      array: [38, 27, 43, 3, 9, 82, 10, 19],
      low: 0,
      high: 7,
      pivotIdx: 7,
      iIdx: -1,
      jIdx: 0,
      sortedIndices: []
    },
    {
      action: 'Compare 27 vs Pivot 19',
      log: 'Compare array[j] (27) vs pivot (19). Since 27 > 19, do not swap. Advance j.',
      array: [38, 27, 43, 3, 9, 82, 10, 19],
      low: 0,
      high: 7,
      pivotIdx: 7,
      iIdx: -1,
      jIdx: 1,
      sortedIndices: []
    },
    {
      action: 'Compare 43 vs Pivot 19',
      log: 'Compare array[j] (43) vs pivot (19). Since 43 > 19, do not swap. Advance j.',
      array: [38, 27, 43, 3, 9, 82, 10, 19],
      low: 0,
      high: 7,
      pivotIdx: 7,
      iIdx: -1,
      jIdx: 2,
      sortedIndices: []
    },
    {
      action: 'Compare 3 vs Pivot 19',
      log: 'Compare array[j] (3) vs pivot (19). Since 3 <= 19, increment i (to index 0) and swap array[i] (38) with array[j] (3).',
      array: [3, 27, 43, 38, 9, 82, 10, 19],
      low: 0,
      high: 7,
      pivotIdx: 7,
      iIdx: 0,
      jIdx: 3,
      sortedIndices: []
    },
    {
      action: 'Compare 9 vs Pivot 19',
      log: 'Compare array[j] (9) vs pivot (19). Since 9 <= 19, increment i (to index 1) and swap array[i] (27) with array[j] (9).',
      array: [3, 9, 43, 38, 27, 82, 10, 19],
      low: 0,
      high: 7,
      pivotIdx: 7,
      iIdx: 1,
      jIdx: 4,
      sortedIndices: []
    },
    {
      action: 'Compare 82 vs Pivot 19',
      log: 'Compare array[j] (82) vs pivot (19). Since 82 > 19, do not swap. Advance j.',
      array: [3, 9, 43, 38, 27, 82, 10, 19],
      low: 0,
      high: 7,
      pivotIdx: 7,
      iIdx: 1,
      jIdx: 5,
      sortedIndices: []
    },
    {
      action: 'Compare 10 vs Pivot 19',
      log: 'Compare array[j] (10) vs pivot (19). Since 10 <= 19, increment i (to index 2) and swap array[i] (43) with array[j] (10).',
      array: [3, 9, 10, 38, 27, 82, 43, 19],
      low: 0,
      high: 7,
      pivotIdx: 7,
      iIdx: 2,
      jIdx: 6,
      sortedIndices: []
    },
    {
      action: 'Place Pivot In Final Position',
      log: 'End of partition loop. Swap pivot array[high] (19) with array[i+1] (38) to place pivot in its final sorted index [3].',
      array: [3, 9, 10, 19, 27, 82, 43, 38],
      low: 0,
      high: 7,
      pivotIdx: 3,
      iIdx: 2,
      jIdx: 7,
      sortedIndices: [3]
    },
    {
      action: 'Recurse Left Sub-array [3, 9, 10]',
      log: 'Recurse on left partition (indices 0 to 2). Choose new pivot: array[2] = 10.',
      array: [3, 9, 10, 19, 27, 82, 43, 38],
      low: 0,
      high: 2,
      pivotIdx: 2,
      iIdx: -1,
      jIdx: 0,
      sortedIndices: [3]
    },
    {
      action: 'Partition Left Sub-array',
      log: 'Trace left partition: 3 < 10 (swap with index 0), 9 < 10 (swap with index 1). Pivot 10 is already at index 2 (sorted).',
      array: [3, 9, 10, 19, 27, 82, 43, 38],
      low: 0,
      high: 2,
      pivotIdx: 2,
      iIdx: 1,
      jIdx: 2,
      sortedIndices: [0, 1, 2, 3]
    },
    {
      action: 'Recurse Right Sub-array [27, 82, 43, 38]',
      log: 'Recurse on right partition (indices 4 to 7). Choose new pivot: array[7] = 38.',
      array: [3, 9, 10, 19, 27, 82, 43, 38],
      low: 4,
      high: 7,
      pivotIdx: 7,
      iIdx: 3,
      jIdx: 4,
      sortedIndices: [0, 1, 2, 3]
    },
    {
      action: 'Compare 27 vs Pivot 38',
      log: 'Compare array[j] (27) vs pivot (38). Since 27 <= 38, increment i (to 4) and swap (no-op since i === j).',
      array: [3, 9, 10, 19, 27, 82, 43, 38],
      low: 4,
      high: 7,
      pivotIdx: 7,
      iIdx: 4,
      jIdx: 4,
      sortedIndices: [0, 1, 2, 3]
    },
    {
      action: 'Compare 82 and 43 vs Pivot 38',
      log: '82 > 38 and 43 > 38. Do not swap. Partition ends.',
      array: [3, 9, 10, 19, 27, 82, 43, 38],
      low: 4,
      high: 7,
      pivotIdx: 7,
      iIdx: 4,
      jIdx: 6,
      sortedIndices: [0, 1, 2, 3]
    },
    {
      action: 'Place Right Pivot',
      log: 'Swap pivot array[7] (38) with array[i+1] (82) to place pivot in sorted index [5].',
      array: [3, 9, 10, 19, 27, 38, 43, 82],
      low: 4,
      high: 7,
      pivotIdx: 5,
      iIdx: 4,
      jIdx: 7,
      sortedIndices: [0, 1, 2, 3, 5]
    },
    {
      action: 'Final Recursion Steps',
      log: 'Recurse on base cases. Array is fully sorted!',
      array: [3, 9, 10, 19, 27, 38, 43, 82],
      low: 6,
      high: 7,
      pivotIdx: 7,
      iIdx: 6,
      jIdx: 7,
      sortedIndices: [0, 1, 2, 3, 4, 5, 6, 7]
    }
  ];

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
  }, [isPlaying, speed]);

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
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const activeStepData = steps[currentStep] || steps[0];

  const stateInspector = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
      <div>Active Pivot Index: <strong style={{ color: 'var(--brand-cyan)' }}>{activeStepData.pivotIdx !== null ? `Index [${activeStepData.pivotIdx}] (Value: ${activeStepData.array[activeStepData.pivotIdx]})` : 'N/A'}</strong></div>
      <div>Scanner j index: <span style={{ fontFamily: 'monospace', color: '#FFFFFF' }}>{activeStepData.jIdx !== null ? activeStepData.jIdx : 'N/A'}</span></div>
      <div>Pointer i index: <span style={{ fontFamily: 'monospace', color: '#FFFFFF' }}>{activeStepData.iIdx}</span></div>
      <div>Partition limits: <span style={{ fontFamily: 'monospace', color: '#FFFFFF' }}>[low: {activeStepData.low}, high: {activeStepData.high}]</span></div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>Quick Sort</strong> is an extremely efficient, in-place **Divide and Conquer** sorting algorithm:</p>
      <ul>
        <li><strong>Pivot Selection:</strong> Chooses a target element as the <em>pivot</em>. We use **Lomuto Partitioning**, selecting the last element in the active range as pivot.</li>
        <li><strong>Partitioning:</strong> Rearranges the array so that all elements smaller than the pivot are placed to its left, and all elements larger are placed to its right.</li>
        <li><strong>Recursion:</strong> Recursively partitions the left and right halves.</li>
        <li><strong>Complexity:</strong> Average O(N log N) time, but worst-case O(N^2) if the pivot splits the array highly unevenly (e.g. sorted array).</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Quick Sort as **sorting children by height in a classroom line**:</p>
      <ul>
        <li>The teacher picks one child (e.g. the last child in line) to stand in the middle as the height marker (Pivot).</li>
        <li>The teacher walks down the line. If a child is shorter than the pivot, they are swapped to the left side of the room. If taller, they are directed to stand on the right.</li>
        <li>Once everyone is partitioned, the height marker child stands exactly in the middle. The teacher then repeats this process independently for the left and right groups.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Poor Pivot Choice:</strong> Using the first or last element as pivot on an already sorted or nearly sorted array. This results in highly skewed partitions and degrades runtime to worst-case O(N^2). <em>Fix: Use a randomized pivot or Median-of-Three strategy.</em></li>
      <li><strong>StackOverflow:</strong> Deep recursion on huge arrays if base cases are missed.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Why is Quick Sort usually faster than Merge Sort in practice, even though both have O(N log N) average times?',
      a: 'Quick Sort is an in-place sort, meaning it does not require memory allocations or copying elements to auxiliary arrays, avoiding heap overheads. It also has excellent CPU cache locality because it traverses elements sequentially.'
    },
    {
      q: 'How can you avoid the worst-case O(N^2) time complexity of Quick Sort?',
      a: 'Avoid choosing the boundary elements (first/last) as pivot. Choosing a randomized pivot index, or selecting the median of the first, middle, and last elements (Median-of-Three), guarantees average O(N log N) times.'
    }
  ];

  const quizQuestions = [
    {
      question: 'What is the time complexity of Quick Sort in the worst-case scenario?',
      options: [
        'O(N)',
        'O(N log N)',
        'O(N^2)',
        'O(2^N)'
      ],
      correctIdx: 2,
      explanation: 'The worst case is O(N^2) when the pivot splits the array in the most unbalanced way possible (e.g. sorted array with first/last element chosen as pivot).'
    },
    {
      question: 'Which partitioning scheme uses two pointers starting from both ends of the array and moving towards each other?',
      options: [
        'Lomuto Partitioning',
        'Hoare Partitioning',
        'Merge Partitioning',
        'Radix Partitioning'
      ],
      correctIdx: 1,
      explanation: 'Hoare Partitioning uses two pointers that start from both ends and sweep inwards, swapping elements until they cross. Lomuto uses a single direction scan (which we visualize here).'
    }
  ];

  return (
    <VisualizerShell
      title="Quick Sort (Lomuto Partition) Simulator"
      subtitle="Interact with partition divisions, pivot selections, and pointer swaps in-place."
      timeComplexity="Average O(N log N), Worst O(N^2)"
      spaceComplexity="O(log N) stack space"
      theoryContent={theory}
      analogyContent={analogy}
      mistakesContent={mistakes}
      interviewQuestions={interviewQuestions}
      quizQuestions={quizQuestions}
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', width: '100%', minHeight: '180px', padding: '1rem 0' }}>
        
        {/* Array bars */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-end', height: '120px', justifyContent: 'center', width: '100%' }}>
          {activeStepData.array.map((val, idx) => {
            const isInsideRange = idx >= activeStepData.low && idx <= activeStepData.high;
            const isPivot = idx === activeStepData.pivotIdx;
            const isJ = idx === activeStepData.jIdx;
            const isI = idx === activeStepData.iIdx;
            const isSorted = activeStepData.sortedIndices.includes(idx);

            let bg = 'var(--bg-secondary)';
            let border = '1px solid var(--bg-tertiary)';
            let color = '#FFFFFF';
            let height = `${val * 1.1 + 20}px`;

            if (isInsideRange) {
              border = '1.5px solid var(--text-secondary)';
            } else {
              // Dim elements out of current partition scope
              border = '1px dashed var(--bg-tertiary)';
            }

            if (isJ) {
              bg = 'rgba(245, 158, 11, 0.15)';
              border = '2px solid #f59e0b';
              color = '#f59e0b';
            }

            if (isI) {
              bg = 'rgba(16, 185, 129, 0.08)';
              border = '2px dashed #10b981';
            }

            if (isPivot) {
              bg = 'rgba(21, 145, 220, 0.15)';
              border = '2px solid #1591DC';
              color = '#1591DC';
            }

            if (isSorted) {
              bg = 'rgba(16, 185, 129, 0.15)';
              border = '2.5px solid #10b981';
              color = '#10b981';
            }

            return (
              <div
                key={idx}
                style={{
                  width: '36px',
                  height,
                  backgroundColor: bg,
                  border,
                  opacity: isInsideRange || isSorted ? 1 : 0.25,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.25rem 0',
                  borderRadius: 'var(--border-radius-sm)',
                  position: 'relative',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color }}>{val}</span>
                <span style={{ fontSize: '0.55rem', color: 'var(--text-tertiary)' }}>{idx}</span>

                {/* Pointer tags */}
                {isPivot && (
                  <span style={{ position: 'absolute', bottom: '-16px', fontSize: '0.45rem', color: '#1591DC', fontWeight: '700' }}>PIVOT</span>
                )}
                {isJ && !isPivot && (
                  <span style={{ position: 'absolute', bottom: '-16px', fontSize: '0.45rem', color: '#f59e0b', fontWeight: '700' }}>j</span>
                )}
                {isI && (
                  <span style={{ position: 'absolute', top: '-16px', fontSize: '0.45rem', color: '#10b981', fontWeight: '700' }}>i</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: '#1591DC' }}></div> Pivot
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: '#f59e0b' }}></div> Scanner j
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', border: '1px dashed #10b981' }}></div> Pointer i (left wall)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: '#10b981' }}></div> Sorted
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
