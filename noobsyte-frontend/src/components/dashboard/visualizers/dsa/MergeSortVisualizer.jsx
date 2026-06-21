import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function MergeSortVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  // Trace steps of Merge Sort on [38, 27, 43, 3, 9, 82, 10, 19]
  const steps = [
    {
      action: 'Initial Array',
      log: 'Initial unsorted array of 8 integers loaded.',
      levels: {
        0: [[38, 27, 43, 3, 9, 82, 10, 19]],
        1: [[], []],
        2: [[], [], [], []],
        3: [[], [], [], [], [], [], [], []]
      },
      highlight: { level: 0, index: 0 }
    },
    {
      action: 'Split Left Half',
      log: 'Divide: Split array into left half (indices 0 to 3).',
      levels: {
        0: [[38, 27, 43, 3, 9, 82, 10, 19]],
        1: [[38, 27, 43, 3], []],
        2: [[], [], [], []],
        3: [[], [], [], [], [], [], [], []]
      },
      highlight: { level: 1, index: 0 }
    },
    {
      action: 'Split Left-Left',
      log: 'Divide: Split left half into sub-array [38, 27] (indices 0 to 1).',
      levels: {
        0: [[38, 27, 43, 3, 9, 82, 10, 19]],
        1: [[38, 27, 43, 3], []],
        2: [[38, 27], [], [], []],
        3: [[], [], [], [], [], [], [], []]
      },
      highlight: { level: 2, index: 0 }
    },
    {
      action: 'Split Base Nodes',
      log: 'Divide: Split sub-array into single elements [38] and [27]. Base cases reached.',
      levels: {
        0: [[38, 27, 43, 3, 9, 82, 10, 19]],
        1: [[38, 27, 43, 3], []],
        2: [[38, 27], [], [], []],
        3: [[38], [27], [], [], [], [], [], []]
      },
      highlight: { level: 3, index: 0 }
    },
    {
      action: 'Compare & Merge',
      log: 'Conquer: Compare 38 vs 27. Since 27 < 38, merge them sorted back to Level 2.',
      levels: {
        0: [[38, 27, 43, 3, 9, 82, 10, 19]],
        1: [[38, 27, 43, 3], []],
        2: [[27, 38], [], [], []],
        3: [[38], [27], [], [], [], [], [], []]
      },
      highlight: { level: 2, index: 0 }
    },
    {
      action: 'Split Left-Right',
      log: 'Divide: Split other left half into sub-array [43, 3] (indices 2 to 3).',
      levels: {
        0: [[38, 27, 43, 3, 9, 82, 10, 19]],
        1: [[38, 27, 43, 3], []],
        2: [[27, 38], [43, 3], [], []],
        3: [[38], [27], [], [], [], [], [], []]
      },
      highlight: { level: 2, index: 1 }
    },
    {
      action: 'Split Base Nodes',
      log: 'Divide: Split sub-array into single elements [43] and [3]. Base cases reached.',
      levels: {
        0: [[38, 27, 43, 3, 9, 82, 10, 19]],
        1: [[38, 27, 43, 3], []],
        2: [[27, 38], [43, 3], [], []],
        3: [[38], [27], [43], [3], [], [], [], []]
      },
      highlight: { level: 3, index: 2 }
    },
    {
      action: 'Compare & Merge',
      log: 'Conquer: Compare 43 vs 3. Since 3 < 43, merge them sorted back to Level 2.',
      levels: {
        0: [[38, 27, 43, 3, 9, 82, 10, 19]],
        1: [[38, 27, 43, 3], []],
        2: [[27, 38], [3, 43], [], []],
        3: [[38], [27], [43], [3], [], [], [], []]
      },
      highlight: { level: 2, index: 1 }
    },
    {
      action: 'Merge Left halves',
      log: 'Conquer: Merge [27, 38] and [3, 43] using temporary pointers. Result: [3, 27, 38, 43].',
      levels: {
        0: [[38, 27, 43, 3, 9, 82, 10, 19]],
        1: [[3, 27, 38, 43], []],
        2: [[27, 38], [3, 43], [], []],
        3: [[38], [27], [43], [3], [], [], [], []]
      },
      highlight: { level: 1, index: 0 }
    },
    {
      action: 'Split Right Half',
      log: 'Divide: Split right half of root array (indices 4 to 7) into [9, 82, 10, 19].',
      levels: {
        0: [[38, 27, 43, 3, 9, 82, 10, 19]],
        1: [[3, 27, 38, 43], [9, 82, 10, 19]],
        2: [[27, 38], [3, 43], [], []],
        3: [[38], [27], [43], [3], [], [], [], []]
      },
      highlight: { level: 1, index: 1 }
    },
    {
      action: 'Split Right-Left',
      log: 'Divide: Split right half into sub-array [9, 82] (indices 4 to 5).',
      levels: {
        0: [[38, 27, 43, 3, 9, 82, 10, 19]],
        1: [[3, 27, 38, 43], [9, 82, 10, 19]],
        2: [[27, 38], [3, 43], [9, 82], []],
        3: [[38], [27], [43], [3], [], [], [], []]
      },
      highlight: { level: 2, index: 2 }
    },
    {
      action: 'Split Base Nodes',
      log: 'Divide: Split sub-array into single elements [9] and [82]. Base cases reached.',
      levels: {
        0: [[38, 27, 43, 3, 9, 82, 10, 19]],
        1: [[3, 27, 38, 43], [9, 82, 10, 19]],
        2: [[27, 38], [3, 43], [9, 82], []],
        3: [[38], [27], [43], [3], [9], [82], [], []]
      },
      highlight: { level: 3, index: 4 }
    },
    {
      action: 'Compare & Merge',
      log: 'Conquer: Compare 9 vs 82. Since 9 < 82, merge them sorted back to Level 2.',
      levels: {
        0: [[38, 27, 43, 3, 9, 82, 10, 19]],
        1: [[3, 27, 38, 43], [9, 82, 10, 19]],
        2: [[27, 38], [3, 43], [9, 82], []],
        3: [[38], [27], [43], [3], [9], [82], [], []]
      },
      highlight: { level: 2, index: 2 }
    },
    {
      action: 'Split Right-Right',
      log: 'Divide: Split right half into sub-array [10, 19] (indices 6 to 7).',
      levels: {
        0: [[38, 27, 43, 3, 9, 82, 10, 19]],
        1: [[3, 27, 38, 43], [9, 82, 10, 19]],
        2: [[27, 38], [3, 43], [9, 82], [10, 19]],
        3: [[38], [27], [43], [3], [9], [82], [], []]
      },
      highlight: { level: 2, index: 3 }
    },
    {
      action: 'Split Base Nodes',
      log: 'Divide: Split sub-array into single elements [10] and [19]. Base cases reached.',
      levels: {
        0: [[38, 27, 43, 3, 9, 82, 10, 19]],
        1: [[3, 27, 38, 43], [9, 82, 10, 19]],
        2: [[27, 38], [3, 43], [9, 82], [10, 19]],
        3: [[38], [27], [43], [3], [9], [82], [10], [19]]
      },
      highlight: { level: 3, index: 6 }
    },
    {
      action: 'Compare & Merge',
      log: 'Conquer: Compare 10 vs 19. Since 10 < 19, merge them sorted back to Level 2.',
      levels: {
        0: [[38, 27, 43, 3, 9, 82, 10, 19]],
        1: [[3, 27, 38, 43], [9, 82, 10, 19]],
        2: [[27, 38], [3, 43], [9, 82], [10, 19]],
        3: [[38], [27], [43], [3], [9], [82], [10], [19]]
      },
      highlight: { level: 2, index: 3 }
    },
    {
      action: 'Merge Right halves',
      log: 'Conquer: Merge [9, 82] and [10, 19] using temporary pointers. Result: [9, 10, 19, 82].',
      levels: {
        0: [[38, 27, 43, 3, 9, 82, 10, 19]],
        1: [[3, 27, 38, 43], [9, 10, 19, 82]],
        2: [[27, 38], [3, 43], [9, 82], [10, 19]],
        3: [[38], [27], [43], [3], [9], [82], [10], [19]]
      },
      highlight: { level: 1, index: 1 }
    },
    {
      action: 'Final Dynamic Merge',
      log: 'Conquer: Perform final merge of left half [3, 27, 38, 43] and right half [9, 10, 19, 82] back into the main array.',
      levels: {
        0: [[3, 9, 10, 19, 27, 38, 43, 82]],
        1: [[3, 27, 38, 43], [9, 10, 19, 82]],
        2: [[27, 38], [3, 43], [9, 82], [10, 19]],
        3: [[38], [27], [43], [3], [9], [82], [10], [19]]
      },
      highlight: { level: 0, index: 0 }
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

  const stateInspector = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
      <div>Sub-array operation: <strong style={{ color: '#1591DC' }}>{steps[currentStep].action}</strong></div>
      <div>Current Depth Level: <span style={{ color: '#FFFFFF' }}>{steps[currentStep].highlight.level}</span></div>
      <div>Active Index scope: <span style={{ color: '#FFFFFF' }}>{steps[currentStep].highlight.index}</span></div>
      <div>Complexity Status: <span style={{ color: '#10b981' }}>Recursion Depth: O(log N)</span></div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>Merge Sort</strong> is a classic **Divide and Conquer** sorting algorithm:</p>
      <ul>
        <li><strong>Divide:</strong> Splits the unsorted list into <em>N</em> sub-lists, each containing 1 element (base case of recursion, since a list of 1 element is inherently sorted).</li>
        <li><strong>Conquer:</strong> Repeatedly merges sub-lists back together in a sorted order to produce new sorted sub-lists.</li>
        <li><strong>Performance:</strong> Guaranteeing O(N log N) runtime complexity in all cases (best, average, worst) but requiring O(N) auxiliary space.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Merge Sort as a **teacher grading a large stack of exam sheets**:</p>
      <ul>
        <li>Instead of sorting all 100 sheets alone, the head teacher divides the stack in half and hands it to 2 assistants.</li>
        <li>The assistants split their stacks in half again and hand them to 4 student helpers, repeating until each helper has exactly 1 sheet (trivially sorted).</li>
        <li>The helpers then merge their single sheets sorted into pairs. The assistants merge the sorted pairs into stacks of 50. Finally, the head teacher merges the 2 sorted stacks of 50 together by comparing the top sheet of each stack.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Space overhead:</strong> Forgetting that standard Merge Sort requires O(N) auxiliary array space, unlike in-place algorithms like Quick Sort or Heap Sort.</li>
      <li><strong>StackOverflow on arrays:</strong> If the base case check is missing, the recursive tree splits infinitely, triggering a call stack overflow.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Why is Merge Sort preferred for sorting Linked Lists?',
      a: 'Linked Lists are not contiguous in memory, so random access is slow. Unlike Quick Sort which relies on random index swaps, Merge Sort can merge lists by adjusting pointer nodes in O(1) space, making it highly efficient.'
    },
    {
      q: 'Is Merge Sort a stable sorting algorithm?',
      a: 'Yes, it is stable. During the merge step, if two elements are equal, the element from the left sub-array is chosen first, preserving their original relative order.'
    }
  ];

  const quizQuestions = [
    {
      question: 'What is the time complexity of Merge Sort in the best-case scenario (already sorted array)?',
      options: [
        'O(N)',
        'O(N log N)',
        'O(N^2)',
        'O(log N)'
      ],
      correctIdx: 1,
      explanation: 'Merge Sort always splits the array completely and merges elements back regardless of initial sorting. It executes O(N log N) operations in all cases.'
    },
    {
      question: 'Which of the following is a major disadvantage of Merge Sort compared to Quick Sort?',
      options: [
        'It has a worst-case time complexity of O(N^2)',
        'It is unstable',
        'It requires O(N) additional auxiliary memory space',
        'It cannot sort strings'
      ],
      correctIdx: 2,
      explanation: 'Merge Sort is not an in-place sort; it requires copying elements into temporary arrays during the merge step, leading to O(N) auxiliary space consumption.'
    }
  ];

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

  // Helper to render nodes at a specific level
  const renderLevelNodes = (levelIdx) => {
    const levelData = steps[currentStep].levels[levelIdx];
    const highlight = steps[currentStep].highlight;

    return (
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', width: '100%' }}>
        {levelData.map((arr, arrIdx) => {
          const isHighlighted = highlight.level === levelIdx && highlight.index === arrIdx;
          if (arr.length === 0) return null;

          return (
            <div
              key={arrIdx}
              style={{
                display: 'flex',
                gap: '0.2rem',
                border: isHighlighted ? '2px solid #1591DC' : '1px solid var(--bg-tertiary)',
                borderRadius: '4px',
                padding: '0.25rem',
                backgroundColor: isHighlighted ? 'rgba(21, 145, 220, 0.05)' : 'rgba(255,255,255,0.01)',
                boxShadow: isHighlighted ? '0 0 10px rgba(21, 145, 220, 0.15)' : 'none',
                transition: 'all 0.3s'
              }}
            >
              {arr.map((val, idx) => (
                <div
                  key={idx}
                  style={{
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '2px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: '#FFFFFF'
                  }}
                >
                  {val}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <VisualizerShell
      title="Merge Sort Tree Visualization"
      subtitle="Interact with the divide-and-conquer steps showing recursive node splits and sorted merging operations."
      timeComplexity="O(N log N) in all cases"
      spaceComplexity="O(N)"
      theoryContent={theory}
      analogyContent={analogy}
      mistakesContent={mistakes}
      interviewQuestions={interviewQuestions}
      quizQuestions={quizQuestions}
      logs={[steps[currentStep].log]}
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', width: '100%', minHeight: '280px', padding: '1rem 0' }}>
        
        {/* Render the levels of the sorting tree */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', alignItems: 'center' }}>
          {/* Level 0 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Depth 0: Original Array</span>
            {renderLevelNodes(0)}
          </div>

          {/* Level 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Depth 1: Sub-arrays (N/2)</span>
            {renderLevelNodes(1)}
          </div>

          {/* Level 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Depth 2: Sub-arrays (N/4)</span>
            {renderLevelNodes(2)}
          </div>

          {/* Level 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Depth 3: Unary Base Cases</span>
            {renderLevelNodes(3)}
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
