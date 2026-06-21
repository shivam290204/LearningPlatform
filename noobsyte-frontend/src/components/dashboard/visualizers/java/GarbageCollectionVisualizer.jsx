import React, { useState, useEffect, useRef } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function GarbageCollectionVisualizer() {
  const [eden, setEden] = useState([]);
  const [s0, setS0] = useState([]);
  const [s1, setS1] = useState([]);
  const [tenured, setTenured] = useState([]);
  const [logs, setLogs] = useState(['JVM heap initialized. Eden, Survivor (S0/S1), and Tenured spaces are empty.']);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [objectIdCounter, setObjectIdCounter] = useState(1);
  const [gcState, setGcState] = useState('normal'); // 'normal', 'minor-gc', 'major-gc'

  const playTimerRef = useRef(null);

  // Stop playback on unmount
  useEffect(() => {
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, []);

  // Handle Play/Pause timer
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        allocateObject();
      }, speed);
    } else {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
        playTimerRef.current = null;
      }
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, speed, eden, s0, s1, tenured, objectIdCounter, gcState]);

  // Core actions
  const allocateObject = () => {
    if (gcState !== 'normal') return;

    // Check if Eden is full (cap = 4)
    if (eden.length >= 4) {
      triggerMinorGC();
      return;
    }

    const nextId = objectIdCounter;
    setObjectIdCounter(prev => prev + 1);

    // Randomly decide if object is "live" (will survive GC) or "dead" (unreferenced)
    const isLive = Math.random() > 0.35; 
    const newObj = { id: nextId, age: 0, isLive };

    setEden(prev => [...prev, newObj]);
    setLogs(prev => [
      `Allocated Obj#${nextId} in Eden Space (${isLive ? 'Referenced' : 'Unreferenced/Dead'}).`,
      ...prev
    ]);
  };

  const triggerMinorGC = () => {
    setGcState('minor-gc');
    setLogs(prev => [
      '⚠️ Eden Space full! Triggering MINOR GC (Copying live objects to Survivor Space)...',
      ...prev
    ]);

    setTimeout(() => {
      // Find all live objects in Eden and active Survivor
      const liveEden = eden.filter(obj => obj.isLive);
      const activeSurvivor = s0.length > 0 ? s0 : s1;
      const liveSurvivor = activeSurvivor.filter(obj => obj.isLive);

      // Increment age of all survivors
      const agedEden = liveEden.map(obj => ({ ...obj, age: obj.age + 1 }));
      const agedSurvivor = liveSurvivor.map(obj => ({ ...obj, age: obj.age + 1 }));

      const allSurvivors = [...agedEden, ...agedSurvivor];

      // Check if any survivors exceed age threshold (age >= 3) to promote to Tenured
      const toPromote = allSurvivors.filter(obj => obj.age >= 3);
      const remainingSurvivors = allSurvivors.filter(obj => obj.age < 3);

      // Survivor copy target: alternate S0 and S1
      const isS0Target = s0.length === 0;

      if (isS0Target) {
        setS0(remainingSurvivors);
        setS1([]);
      } else {
        setS1(remainingSurvivors);
        setS0([]);
      }

      // Promote to Tenured (cap = 6)
      if (toPromote.length > 0) {
        setTenured(prev => {
          const updated = [...prev, ...toPromote];
          if (updated.length >= 6) {
            // Trigger Major GC in next tick
            setTimeout(() => {
              triggerMajorGC();
            }, 600);
          }
          return updated;
        });

        setLogs(prev => [
          `Promoted ${toPromote.length} objects (Obj#${toPromote.map(o => o.id).join(',Obj#')}) to Tenured Space (Age >= 3).`,
          ...prev
        ]);
      }

      setEden([]);
      setGcState('normal');
      setLogs(prev => [
        `Minor GC Completed. Live survivors moved to ${isS0Target ? 'S0' : 'S1'}. Dead objects swept.`,
        ...prev
      ]);
    }, 800);
  };

  const triggerMajorGC = () => {
    setGcState('major-gc');
    setIsPlaying(false); // Stop simulation auto-play during major GC
    setLogs(prev => [
      '🚨 Tenured Space full! Triggering MAJOR GC (Stop-The-World full compaction sweep)...',
      ...prev
    ]);

    setTimeout(() => {
      // Sweep Tenured (Only keep live references)
      setTenured(prev => {
        const liveTenured = prev.filter(obj => obj.isLive);
        setLogs(prevLogs => [
          `Major GC Completed. Reclaimed ${prev.length - liveTenured.length} dead objects from Tenured Space.`,
          ...prevLogs
        ]);
        return liveTenured;
      });
      setGcState('normal');
    }, 1200);
  };

  const handleReset = () => {
    setEden([]);
    setS0([]);
    setS1([]);
    setTenured([]);
    setObjectIdCounter(1);
    setGcState('normal');
    setIsPlaying(false);
    setLogs(['JVM heap reset. Ready for new allocations.']);
  };

  const controls = (
    <>
      <button 
        className="btn-viz-action btn-add" 
        onClick={allocateObject} 
        disabled={gcState !== 'normal'}
      >
        <i className="fa-solid fa-plus"></i> Allocate Object
      </button>
      <button 
        className="btn-viz-action" 
        onClick={triggerMinorGC} 
        disabled={gcState !== 'normal' || eden.length === 0}
      >
        <i className="fa-solid fa-broom"></i> Run Minor GC
      </button>
      <button 
        className="btn-viz-action btn-clear" 
        onClick={triggerMajorGC} 
        disabled={gcState !== 'normal' || tenured.length === 0}
      >
        <i className="fa-solid fa-circle-radiation"></i> Run Full Major GC
      </button>
    </>
  );

  const stateInspector = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
      <div>Active Generation Stage: <strong style={{ color: gcState === 'normal' ? '#10b981' : '#ef4444', textTransform: 'uppercase' }}>{gcState}</strong></div>
      <div>Eden Usage: <strong style={{ color: '#FFFFFF' }}>{eden.length} / 4 objects</strong></div>
      <div>Survivor S0: <strong style={{ color: '#FFFFFF' }}>{s0.length} objects</strong> | S1: <strong style={{ color: '#FFFFFF' }}>{s1.length} objects</strong></div>
      <div>Tenured Space: <strong style={{ color: '#FFFFFF' }}>{tenured.length} / 6 objects</strong></div>
    </div>
  );

  const theory = (
    <div>
      <p>Java's **Generational Garbage Collection** splits the heap into spaces based on object age (lifespan) to optimize cleanup times:</p>
      <ul>
        <li><strong>Young Generation:</strong>
          <ul>
            <li><strong>Eden Space:</strong> New objects are allocated here first.</li>
            <li><strong>Survivor Spaces (S0 / S1):</strong> Live objects surviving Eden collections copy between S0/S1. One survivor space is always empty.</li>
          </ul>
        </li>
        <li><strong>Old Generation (Tenured):</strong> Stores long-lived objects. Objects copy here after surviving a threshold age (e.g. 3 collections).</li>
        <li><strong>Minor GC:</strong> Reclaims dead objects in the Young Gen. Fast and frequent.</li>
        <li><strong>Major GC:</strong> Reclaims dead objects in Tenured. Slow, full sweep, triggering "Stop-the-world" pauses.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Garbage Collection as **workspaces at a busy office desk**:</p>
      <ul>
        <li><strong>Eden Space:</strong> Your immediate workspace table where you take quick notes. Most notes are trash and gets crumpled quickly.</li>
        <li><strong>Survivor Spaces (S0/S1):</strong> Folders on your desk. Important notes you didn't throw away are placed in folder S0. Tomorrow, you clean the desk, review S0, and move the remaining live notes to Folder S1, throwing out dead ones.</li>
        <li><strong>Tenured Space:</strong> The archiving cabinet. If a note stays relevant for weeks (crosses age threshold), you file it permanently in the archive cabinet.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Memory Leaks:</strong> Keeping active references to unused objects (e.g. inserting elements in static lists without clearing). The collector sees the reference and never reclaims them, leading to OutOfMemoryErrors.</li>
      <li><strong>System.gc() abuse:</strong> Calling <code>System.gc()</code> manually. It suggests a full major garbage collection, triggering performance pauses. Let the JVM handle collections.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is the "Stop-the-World" (STW) phase in Garbage Collection?',
      a: 'STW is the phase during which the JVM suspends all application threads, allowing the collector to run. This prevents applications from modifying heap states during address relocations.'
    },
    {
      q: 'What determines when an object is promoted to the Tenured (Old) space?',
      a: 'The JVM maintains a "tenuring threshold" (max age). Each time an object survives a Minor GC in the survivor spaces, its age is incremented. When age exceeds the threshold (default is 15, we simulate 3 here), it promotes.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which area of the JVM heap is memory allocated to first when creating a new object?',
      options: [
        'Tenured Space',
        'Survivor Space S0',
        'Eden Space',
        'Method Area'
      ],
      correctIdx: 2,
      explanation: 'All new objects instantiated via the "new" keyword are allocated memory space inside the Eden Space first.'
    },
    {
      question: 'Why are there two Survivor Spaces (S0 and S1) instead of one?',
      options: [
        'To double the memory size of the young generation',
        'To prevent memory fragmentation by copying survivors back and forth, leaving one space completely empty',
        'To let one run on Stack and the other on Heap',
        'One is for static variables, the other for local variables'
      ],
      correctIdx: 1,
      explanation: 'Using two spaces allows GC to copy live objects from Eden and the occupied survivor space to the empty survivor space, compacting references. This eliminates memory fragmentation without expensive page-defrag passes.'
    }
  ];

  return (
    <VisualizerShell
      title="JVM Generational Garbage Collection (GC)"
      subtitle="Simulate memory pressures, minor collections, survivor copy cycles, and promotions to the Tenured pool."
      timeComplexity="Minor GC: O(Live Objects), Major GC: O(Heap Size)"
      spaceComplexity="O(N)"
      theoryContent={theory}
      analogyContent={analogy}
      mistakesContent={mistakes}
      interviewQuestions={interviewQuestions}
      quizQuestions={quizQuestions}
      controls={controls}
      logs={logs}
      stateInspector={stateInspector}
      playbackProps={{
        play: () => setIsPlaying(true),
        pause: () => setIsPlaying(false),
        stepForward: allocateObject,
        stepBackward: () => {}, // Not applicable for live allocation pressure
        reset: handleReset,
        isPlaying,
        speed,
        setSpeed,
        currentStep: eden.length + s0.length + s1.length + tenured.length,
        totalSteps: 16 // capacity cap
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', minHeight: '300px' }}>
        
        {/* Dynamic status panel */}
        {gcState !== 'normal' && (
          <div style={{
            backgroundColor: gcState === 'minor-gc' ? 'rgba(21, 145, 220, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: gcState === 'minor-gc' ? '1px dashed #1591DC' : '1px dashed #ef4444',
            color: '#FFFFFF',
            padding: '0.75rem',
            textAlign: 'center',
            fontSize: '0.9rem',
            fontWeight: '700',
            borderRadius: '4px',
            animation: 'pulse-resize-cell 1s infinite alternate'
          }}>
            {gcState === 'minor-gc' ? '⚡ MINOR GC RUNNING (Cleaning Young Gen)...' : '🚨 MAJOR GC RUNNING - STOP-THE-WORLD EVENT!'}
          </div>
        )}

        {/* JVM Spaces Grid Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          width: '100%'
        }}>
          {/* Eden Space */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--bg-tertiary)',
            borderRadius: 'var(--border-radius-md)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: '0.4rem' }}>
              <strong style={{ fontSize: '0.8rem', color: '#1591DC' }}>EDEN SPACE</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{eden.length} / 4</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', minHeight: '60px', flexWrap: 'wrap', alignItems: 'center' }}>
              {eden.length === 0 ? (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Empty</span>
              ) : (
                eden.map(obj => (
                  <div key={obj.id} style={{
                    width: '40px',
                    height: '40px',
                    border: obj.isLive ? '2px solid #10b981' : '1px dashed #ef4444',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: obj.isLive ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.02)',
                    fontSize: '0.65rem'
                  }}>
                    <span style={{ fontWeight: '700', color: '#FFFFFF' }}>#{obj.id}</span>
                    <span style={{ fontSize: '0.55rem', color: 'var(--text-tertiary)' }}>A:{obj.age}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Survivor S0 Space */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--bg-tertiary)',
            borderRadius: 'var(--border-radius-md)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: '0.4rem' }}>
              <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>SURVIVOR S0</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{s0.length}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', minHeight: '60px', flexWrap: 'wrap', alignItems: 'center' }}>
              {s0.length === 0 ? (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Inactive (Empty)</span>
              ) : (
                s0.map(obj => (
                  <div key={obj.id} style={{
                    width: '40px',
                    height: '40px',
                    border: '2px solid #10b981',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                    fontSize: '0.65rem'
                  }}>
                    <span style={{ fontWeight: '700', color: '#FFFFFF' }}>#{obj.id}</span>
                    <span style={{ fontSize: '0.55rem', color: 'var(--text-tertiary)' }}>A:{obj.age}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Survivor S1 Space */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--bg-tertiary)',
            borderRadius: 'var(--border-radius-md)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: '0.4rem' }}>
              <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>SURVIVOR S1</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{s1.length}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', minHeight: '60px', flexWrap: 'wrap', alignItems: 'center' }}>
              {s1.length === 0 ? (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Inactive (Empty)</span>
              ) : (
                s1.map(obj => (
                  <div key={obj.id} style={{
                    width: '40px',
                    height: '40px',
                    border: '2px solid #10b981',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                    fontSize: '0.65rem'
                  }}>
                    <span style={{ fontWeight: '700', color: '#FFFFFF' }}>#{obj.id}</span>
                    <span style={{ fontSize: '0.55rem', color: 'var(--text-tertiary)' }}>A:{obj.age}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tenured Space */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--bg-tertiary)',
            borderRadius: 'var(--border-radius-md)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: '0.4rem' }}>
              <strong style={{ fontSize: '0.8rem', color: '#ef4444' }}>TENURED SPACE (OLD GEN)</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{tenured.length} / 6</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', minHeight: '60px', flexWrap: 'wrap', alignItems: 'center' }}>
              {tenured.length === 0 ? (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Empty</span>
              ) : (
                tenured.map(obj => (
                  <div key={obj.id} style={{
                    width: '40px',
                    height: '40px',
                    border: '2px solid #ef4444',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    fontSize: '0.65rem'
                  }}>
                    <span style={{ fontWeight: '700', color: '#FFFFFF' }}>#{obj.id}</span>
                    <span style={{ fontSize: '0.55rem', color: 'var(--text-tertiary)' }}>A:{obj.age}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
