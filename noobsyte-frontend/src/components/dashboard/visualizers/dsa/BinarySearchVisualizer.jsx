import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function BinarySearchVisualizer() {
  const [array] = useState([12, 18, 25, 33, 40, 40, 40, 52, 60, 72, 85, 99]);
  const [searchTarget, setSearchTarget] = useState('40');
  const [searchMode, setSearchMode] = useState('standard'); // 'standard', 'lower_bound', 'upper_bound'
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [steps, setSteps] = useState([
    { low: 0, high: 11, mid: null, log: 'Enter a target and click Search to trace binary search steps.', activeIndex: null, isFound: false }
  ]);

  // Generate trace steps dynamically on Search click
  const generateSteps = () => {
    const target = Number(searchTarget);
    if (isNaN(target)) {
      alert('Please enter a valid numeric target.');
      return;
    }

    let trace = [];
    let low = 0;
    let high = array.length - 1;
    let ans = -1;

    trace.push({
      low,
      high,
      mid: null,
      log: `Initialize: low = 0, high = 11. Search Target: ${target}. Mode: ${searchMode.replace('_', ' ').toUpperCase()}`,
      activeIndex: null,
      isFound: false
    });

    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      let val = array[mid];

      if (searchMode === 'standard') {
        trace.push({
          low,
          high,
          mid,
          log: `Check mid index [${mid}] = ${val}. Compare with target ${target}.`,
          activeIndex: mid,
          isFound: false
        });

        if (val === target) {
          trace.push({
            low,
            high,
            mid,
            log: `Target ${target} found at index [${mid}]! Search completed.`,
            activeIndex: mid,
            isFound: true
          });
          ans = mid;
          break;
        } else if (val < target) {
          low = mid + 1;
          trace.push({
            low,
            high,
            mid,
            log: `Since array[${mid}] = ${val} < target ${target}, search right half. low = mid + 1 = ${low}`,
            activeIndex: mid,
            isFound: false
          });
        } else {
          high = mid - 1;
          trace.push({
            low,
            high,
            mid,
            log: `Since array[${mid}] = ${val} > target ${target}, search left half. high = mid - 1 = ${high}`,
            activeIndex: mid,
            isFound: false
          });
        }
      } else if (searchMode === 'lower_bound') {
        // First index where val >= target
        trace.push({
          low,
          high,
          mid,
          log: `Check mid index [${mid}] = ${val}. Compare with target ${target}. (Lower Bound: val >= target?)`,
          activeIndex: mid,
          isFound: false
        });

        if (val >= target) {
          ans = mid;
          high = mid - 1;
          trace.push({
            low,
            high,
            mid,
            log: `Since array[${mid}] = ${val} >= target ${target}, this is a candidate answer (${mid}). Search left half. high = mid - 1 = ${high}`,
            activeIndex: mid,
            isFound: false
          });
        } else {
          low = mid + 1;
          trace.push({
            low,
            high,
            mid,
            log: `Since array[${mid}] = ${val} < target ${target}, search right half. low = mid + 1 = ${low}`,
            activeIndex: mid,
            isFound: false
          });
        }
      } else {
        // Upper Bound: First index where val > target
        trace.push({
          low,
          high,
          mid,
          log: `Check mid index [${mid}] = ${val}. Compare with target ${target}. (Upper Bound: val > target?)`,
          activeIndex: mid,
          isFound: false
        });

        if (val > target) {
          ans = mid;
          high = mid - 1;
          trace.push({
            low,
            high,
            mid,
            log: `Since array[${mid}] = ${val} > target ${target}, this is a candidate answer (${mid}). Search left half. high = mid - 1 = ${high}`,
            activeIndex: mid,
            isFound: false
          });
        } else {
          low = mid + 1;
          trace.push({
            low,
            high,
            mid,
            log: `Since array[${mid}] = ${val} <= target ${target}, search right half. low = mid + 1 = ${low}`,
            activeIndex: mid,
            isFound: false
          });
        }
      }
    }

    if (ans === -1 && searchMode === 'standard') {
      trace.push({
        low,
        high,
        mid: null,
        log: `Search finished. Target ${target} is not in the array.`,
        activeIndex: null,
        isFound: false
      });
    } else {
      const finalIndex = (searchMode === 'standard') ? ans : (ans !== -1 ? ans : array.length);
      trace.push({
        low,
        high,
        mid: null,
        log: `${searchMode.replace('_', ' ').toUpperCase()} result resolved: Index [${finalIndex}] (Value: ${finalIndex < array.length ? array[finalIndex] : 'OUT_OF_BOUNDS'}).`,
        activeIndex: finalIndex < array.length ? finalIndex : null,
        isFound: true
      });
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
    setCurrentStep(0);
    setIsPlaying(false);
    setSteps([{ low: 0, high: 11, mid: null, log: 'Enter a target and click Search to trace binary search steps.', activeIndex: null, isFound: false }]);
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Target:</span>
      <input 
        type="text" 
        value={searchTarget} 
        onChange={(e) => setSearchTarget(e.target.value)}
        style={{
          width: '60px',
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem',
          textAlign: 'center'
        }}
      />
      
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Mode:</span>
      <select 
        value={searchMode} 
        onChange={(e) => setSearchMode(e.target.value)}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        <option value="standard">Standard Search</option>
        <option value="lower_bound">Lower Bound (x &gt;= target)</option>
        <option value="upper_bound">Upper Bound (x &gt; target)</option>
      </select>

      <button className="btn-viz-action btn-add" onClick={generateSteps}>
        Search Trace
      </button>
      
      <button className="btn-viz-action btn-clear" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const activeStepData = steps[currentStep] || steps[0];

  const stateInspector = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
      <div>Active Range: <span style={{ fontFamily: 'monospace', color: '#FFFFFF' }}>[low: {activeStepData.low}, high: {activeStepData.high}]</span></div>
      <div>Active Midpoint: <span style={{ fontFamily: 'monospace', color: 'var(--brand-cyan)' }}>{activeStepData.mid !== null ? `Index [${activeStepData.mid}] (Value: ${array[activeStepData.mid]})` : 'N/A'}</span></div>
      <div>Result Index: <strong style={{ color: activeStepData.isFound ? '#10b981' : '#f59e0b' }}>{activeStepData.isFound ? 'RESOLVED' : 'SEARCHING'}</strong></div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>Binary Search</strong> is an extremely efficient search algorithm on a **sorted array** that runs in logarithmic time:</p>
      <ul>
        <li><strong>Halving Search Range:</strong> At each step, it compares the target with the midpoint. If target matches mid, it returns. If target is larger, it discards the left half; if smaller, it discards the right half.</li>
        <li><strong>Lower Bound:</strong> Finds the first index where element is <code>&gt;= target</code>.</li>
        <li><strong>Upper Bound:</strong> Finds the first index where element is <code>&gt; target</code>.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Binary Search as **searching for a word in a printed paper dictionary**:</p>
      <ul>
        <li>You don't start at page 1 and read line-by-line (Linear Search, O(N)).</li>
        <li>You open the dictionary exactly in the middle. If the word you want (e.g. <em>"Java"</em>) comes alphabetically after the middle page word (e.g. <em>"Elephant"</em>), you rip the left half of the dictionary in half and discard it.</li>
        <li>You repeat this halving process, finding your word in seconds out of 100,000 entries.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Unsorted Arrays:</strong> Trying to run binary search on an unsorted array. <em>The array must be sorted beforehand.</em></li>
      <li><strong>Integer Overflow:</strong> Calculating midpoint as <code>mid = (low + high) / 2</code>. If low and high are very large, their sum can overflow. <em>Fix: Use `mid = low + (high - low) / 2`.</em></li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Why is Binary Search O(log N) runtime complexity?',
      a: 'At each execution step, the search space is divided in half. The number of steps required to contract N items down to 1 item is log2(N), making the worst-case runtime O(log N).'
    },
    {
      q: 'What are Lower Bound and Upper Bound algorithms used for?',
      a: 'They are critical for range queries (e.g., finding how many times value X appears in a sorted array: count = upperBound(X) - lowerBound(X)), finding search inserts, and solving bounds search limits.'
    }
  ];

  const quizQuestions = [
    {
      question: 'What is the maximum number of comparisons needed to binary search an element in an array of size 1024?',
      options: [
        '10',
        '32',
        '512',
        '1024'
      ],
      correctIdx: 0,
      explanation: 'Since log2(1024) = 10, binary search takes at most 10 iterations to locate the element.'
    },
    {
      question: 'Given array [2, 5, 5, 5, 8], what is the Lower Bound index for target 5?',
      options: [
        'Index 1',
        'Index 2',
        'Index 3',
        'Index 4'
      ],
      correctIdx: 0,
      explanation: 'Lower Bound finds the first index where element >= target. Since index 1 has value 5, Lower Bound index is 1.'
    }
  ];

  return (
    <VisualizerShell
      title="Binary Search & Bounds Visualizer"
      subtitle="Step through sorted array halving paths, midpoint calculations, and lower/upper bound limits."
      timeComplexity="O(log N)"
      spaceComplexity="O(1)"
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
        
        {/* Array representation */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
          {array.map((val, idx) => {
            const isInside = idx >= activeStepData.low && idx <= activeStepData.high;
            const isMid = idx === activeStepData.mid;
            const isTargetResolved = activeStepData.isFound && activeStepData.activeIndex === idx;
            
            let bg = 'var(--bg-secondary)';
            let border = '1px solid var(--bg-tertiary)';
            let color = 'var(--text-secondary)';
            
            if (isInside) {
              color = '#FFFFFF';
              border = '1.5px solid var(--bg-tertiary)';
            } else {
              // Discarded range is darkened
              opacity: 0.3;
              color = 'var(--text-tertiary)';
            }

            if (isMid) {
              bg = 'rgba(21, 145, 220, 0.15)';
              border = '2px solid #1591DC';
              color = '#1591DC';
            }

            if (isTargetResolved) {
              bg = 'rgba(16, 185, 129, 0.15)';
              border = '2px solid #10b981';
              color = '#10b981';
            }

            return (
              <div
                key={idx}
                style={{
                  width: '46px',
                  height: '46px',
                  backgroundColor: bg,
                  border,
                  opacity: isInside ? 1 : 0.3,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.35rem',
                  borderRadius: 'var(--border-radius-sm)',
                  position: 'relative',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '0.55rem', color: 'var(--text-tertiary)' }}>{idx}</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '800', color }}>{val}</span>
                
                {/* Pointer markers under cell */}
                {idx === activeStepData.low && (
                  <span style={{ position: 'absolute', bottom: '-16px', fontSize: '0.5rem', color: '#FFFFFF', fontWeight: '700' }}>L</span>
                )}
                {idx === activeStepData.high && (
                  <span style={{ position: 'absolute', bottom: '-16px', fontSize: '0.5rem', color: '#FFFFFF', fontWeight: '700' }}>H</span>
                )}
                {isMid && (
                  <span style={{ position: 'absolute', top: '-16px', fontSize: '0.55rem', color: '#1591DC', fontWeight: '700' }}>MID</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: '#1591DC' }}></div> Midpoint
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: '#10b981' }}></div> Result Found
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--bg-secondary)', opacity: 0.3 }}></div> Discarded
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
