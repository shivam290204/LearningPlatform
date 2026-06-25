import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function JvmArchitectureVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const steps = [
    {
      action: '1. Class Loading',
      log: 'ClassLoader subsystem loads MyProgram.class from disk. Bootstrap classloader delegates to Extension, then Application classloader.',
      highlightZone: 'classloader',
      subHighlight: 'loading',
      pcRegister: 'N/A',
      stack: 'Empty',
      methodArea: 'Loading MyProgram...',
      executionMode: 'Idle'
    },
    {
      action: '2. Bytecode Linking',
      log: 'Linking phase: 1) Verify bytecode syntax. 2) Prepare static variables with default values. 3) Resolve symbolic references to direct memory addresses.',
      highlightZone: 'classloader',
      subHighlight: 'linking',
      pcRegister: 'N/A',
      stack: 'Empty',
      methodArea: 'MyProgram [Loaded, Prepared]',
      executionMode: 'Idle'
    },
    {
      action: '3. Class Initialization',
      log: 'Initialization phase: Static initializers run and static variables are initialized with their defined values.',
      highlightZone: 'classloader',
      subHighlight: 'initialization',
      pcRegister: 'N/A',
      stack: 'Empty',
      methodArea: 'MyProgram [Static Init Complete]',
      executionMode: 'Idle'
    },
    {
      action: '4. main() Invocation',
      log: 'Runtime Data Areas allocation: main() thread starts. A new stack frame is pushed on the JVM Stack. PC Register points to bytecode index 0.',
      highlightZone: 'memory',
      subHighlight: 'stack',
      pcRegister: '0: iconst_0',
      stack: 'main() Frame [LocalVar: int i=0]',
      methodArea: 'MyProgram.class',
      executionMode: 'Interpreter active'
    },
    {
      action: '5. Loop Execution',
      log: 'Execution Engine: Interpreter executes instructions line-by-line. i increments from 0 to 1, 2, 3... in a loop.',
      highlightZone: 'engine',
      subHighlight: 'interpreter',
      pcRegister: '4: iinc 1, 1',
      stack: 'main() Frame [LocalVar: int i=50]',
      methodArea: 'MyProgram.class',
      executionMode: 'Interpreter (Executing loop)'
    },
    {
      action: '6. JIT Compilation',
      log: 'JIT Compiler: Loop count exceeds threshold (hotspot code). JIT compiles loop bytecode into native machine code to bypass interpreter overhead.',
      highlightZone: 'engine',
      subHighlight: 'jit',
      pcRegister: 'Native Address',
      stack: 'main() Frame [LocalVar: int i=10000]',
      methodArea: 'MyProgram.class [Optimized]',
      executionMode: 'JIT Compiler (Native Execution)'
    },
    {
      action: '7. Garbage Collection',
      log: 'Garbage Collector runs concurrently in the background, scanning the Heap to sweep dead objects.',
      highlightZone: 'engine',
      subHighlight: 'gc',
      pcRegister: 'Native Address',
      stack: 'main() Frame',
      methodArea: 'MyProgram.class',
      executionMode: 'GC Sweep Active'
    },
    {
      action: '8. Execution Finished',
      log: 'main() stack frame is popped. JVM exits. Resources are released back to the OS.',
      highlightZone: 'memory',
      subHighlight: 'pc',
      pcRegister: 'Exited',
      stack: 'Empty',
      methodArea: 'Unloaded',
      executionMode: 'Completed'
    }
  ];

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

  const stateInspector = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
      <div>Active PC Register: <strong style={{ color: '#FFFFFF', fontFamily: 'monospace' }}>{steps[currentStep].pcRegister}</strong></div>
      <div>JVM Stack State: <strong style={{ color: '#FFFFFF' }}>{steps[currentStep].stack}</strong></div>
      <div>Method Area Index: <strong style={{ color: '#FFFFFF' }}>{steps[currentStep].methodArea}</strong></div>
      <div>Execution Mode: <strong style={{ color: '#1591DC' }}>{steps[currentStep].executionMode}</strong></div>
    </div>
  );

  const theory = (
    <div>
      <p>The **Java Virtual Machine (JVM)** architecture consists of three main subsystems:</p>
      <ul>
        <li><strong>ClassLoader Subsystem:</strong> Responsible for Loading class files, Linking (Verification check, binary layout prep, reference resolution), and Initialization (running static blocks).</li>
        <li><strong>Runtime Data Areas:</strong> Memory structures including **Method Area** (metadata/templates), **Heap** (objects), **JVM Stacks** (local variables/frames), **PC Registers** (current address), and **Native Method Stacks**.</li>
        <li><strong>Execution Engine:</strong> Translates bytecode to machine instructions using the **Interpreter** (line-by-line) and **JIT Compiler** (native optimization of hot loops), and runs **Garbage Collection**.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of JVM Architecture as a **large automated manufacturing factory**:</p>
      <ul>
        <li><strong>ClassLoader Subsystem:</strong> The reception desk that receives blueprinted folders (class files), checks their authenticity (Linking), and prepares raw materials (Initialization).</li>
        <li><strong>Runtime Data Areas:</strong> The physical factory rooms. Method Area is the blueprint archives; Heap is the central warehouse storage for products; JVM Stacks are individual assembly desks for workers.</li>
        <li><strong>Execution Engine:</strong> The factory machines. The Interpreter is a worker translating blueprints one page at a time. The JIT Compiler is an automated machine that takes over when a part is needed 10,000 times, manufacturing it instantly.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>NoClassDefFoundError vs ClassNotFoundException:</strong> <code>ClassNotFoundException</code> is a checked exception occurring at runtime when application tries to load a class by name (e.g. <code>Class.forName()</code>) but cannot find it. <code>NoClassDefFoundError</code> is a critical error occurring when a class was available at compile-time but cannot be found at runtime during loading.</li>
      <li><strong>Assuming Method Area is distinct from Heap:</strong> In modern Java (Java 8+), PermGen is replaced by Metaspace, which resides in local native memory, preventing permgen memory crash exceptions.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is the role of the JIT Compiler in the JVM?',
      a: 'The Just-In-Time (JIT) Compiler improves performance by compiling bytecode into native machine instructions at runtime. It monitors code execution counts and compiles frequently executed "hot" methods/loops to eliminate interpreter overhead.'
    },
    {
      q: 'What is the difference between Metaspace and PermGen?',
      a: 'PermGen was part of the JVM heap memory with a fixed size limit, often causing OutOfMemoryErrors. Metaspace (introduced in Java 8) uses native OS memory directly and resizes automatically, avoiding fixed capacity constraints.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which Runtime Data Area is created per thread and holds local variables?',
      options: [
        'Method Area',
        'Heap',
        'JVM Stack',
        'PC Register'
      ],
      correctIdx: 2,
      explanation: 'Every thread has its own private JVM Stack containing execution stack frames, local variables, and call structures.'
    },
    {
      question: 'What are the three steps in the ClassLoader Linking phase?',
      options: [
        'Load, Link, Initialize',
        'Verify, Prepare, Resolve',
        'Compile, Interpret, Execute',
        'Bootstrap, Extension, Application'
      ],
      correctIdx: 1,
      explanation: 'Linking consists of Verification (bytecode check), Preparation (allocating static default variables), and Resolution (replacing symbolic references).'
    }
  ];

  const isZoneActive = (zoneName) => steps[currentStep].highlightZone === zoneName;
  const isSubActive = (subName) => steps[currentStep].subHighlight === subName;

  return (
    <VisualizerShell
      title="JVM Subsystem Architecture"
      subtitle="Observe classloading, memory allocation, interpreter loops, and JIT optimizations."
      timeComplexity="Dynamic dispatch: O(1)"
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
      <div style={{ display: 'flex', gap: '1rem', width: '100%', minHeight: '300px', flexDirection: 'column' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.3fr 1fr',
          gap: '1rem',
          width: '100%'
        }} className="visualizer-grid-layout">
          
          {/* Column 1: ClassLoader */}
          <div style={{
            border: isZoneActive('classloader') ? '2px solid #1591DC' : '1px solid var(--bg-tertiary)',
            backgroundColor: isZoneActive('classloader') ? 'rgba(21, 145, 220, 0.03)' : 'transparent',
            borderRadius: 'var(--border-radius-md)',
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}>
            <strong style={{ fontSize: '0.75rem', color: '#1591DC', textAlign: 'center' }}>CLASSLOADER SUBSYSTEM</strong>
            <div style={{
              padding: '0.5rem',
              backgroundColor: isSubActive('loading') ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)',
              border: isSubActive('loading') ? '1.5px solid #1591DC' : '1px solid var(--bg-tertiary)',
              borderRadius: '4px',
              fontSize: '0.75rem',
              textAlign: 'center',
              fontWeight: isSubActive('loading') ? '700' : 'normal'
            }}>
              Loading (Bootstrap/Ext/App)
            </div>
            <div style={{
              padding: '0.5rem',
              backgroundColor: isSubActive('linking') ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)',
              border: isSubActive('linking') ? '1.5px solid #1591DC' : '1px solid var(--bg-tertiary)',
              borderRadius: '4px',
              fontSize: '0.75rem',
              textAlign: 'center',
              fontWeight: isSubActive('linking') ? '700' : 'normal'
            }}>
              Linking (Verify/Prep/Resolve)
            </div>
            <div style={{
              padding: '0.5rem',
              backgroundColor: isSubActive('initialization') ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)',
              border: isSubActive('initialization') ? '1.5px solid #1591DC' : '1px solid var(--bg-tertiary)',
              borderRadius: '4px',
              fontSize: '0.75rem',
              textAlign: 'center',
              fontWeight: isSubActive('initialization') ? '700' : 'normal'
            }}>
              Initialization
            </div>
          </div>

          {/* Column 2: Runtime Areas */}
          <div style={{
            border: isZoneActive('memory') ? '2px solid #1591DC' : '1px solid var(--bg-tertiary)',
            backgroundColor: isZoneActive('memory') ? 'rgba(21, 145, 220, 0.03)' : 'transparent',
            borderRadius: 'var(--border-radius-md)',
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}>
            <strong style={{ fontSize: '0.75rem', color: '#FFFFFF', textAlign: 'center' }}>RUNTIME DATA AREAS</strong>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div style={{
                padding: '0.5rem',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--bg-tertiary)',
                borderRadius: '4px',
                fontSize: '0.7rem'
              }}>
                <span style={{ fontSize: '0.55rem', display: 'block', color: 'var(--text-tertiary)' }}>METHOD AREA</span>
                <span style={{ fontWeight: '700' }}>{steps[currentStep].methodArea}</span>
              </div>
              <div style={{
                padding: '0.5rem',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--bg-tertiary)',
                borderRadius: '4px',
                fontSize: '0.7rem'
              }}>
                <span style={{ fontSize: '0.55rem', display: 'block', color: 'var(--text-tertiary)' }}>HEAP SPACE</span>
                <span style={{ fontWeight: '700' }}>Objects & Arrays</span>
              </div>
            </div>

            <div style={{
              padding: '0.5rem',
              backgroundColor: isSubActive('stack') ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)',
              border: isSubActive('stack') ? '1.5px solid #1591DC' : '1px solid var(--bg-tertiary)',
              borderRadius: '4px',
              fontSize: '0.7rem'
            }}>
              <span style={{ fontSize: '0.55rem', display: 'block', color: 'var(--text-tertiary)' }}>JVM THREAD STACKS</span>
              <span style={{ fontWeight: '700', fontFamily: 'monospace' }}>{steps[currentStep].stack}</span>
            </div>

            <div style={{
              padding: '0.5rem',
              backgroundColor: isSubActive('pc') ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)',
              border: isSubActive('pc') ? '1.5px solid #1591DC' : '1px solid var(--bg-tertiary)',
              borderRadius: '4px',
              fontSize: '0.7rem'
            }}>
              <span style={{ fontSize: '0.55rem', display: 'block', color: 'var(--text-tertiary)' }}>PC REGISTERS</span>
              <span style={{ fontWeight: '700', fontFamily: 'monospace' }}>{steps[currentStep].pcRegister}</span>
            </div>
          </div>

          {/* Column 3: Execution Engine */}
          <div style={{
            border: isZoneActive('engine') ? '2px solid #1591DC' : '1px solid var(--bg-tertiary)',
            backgroundColor: isZoneActive('engine') ? 'rgba(21, 145, 220, 0.03)' : 'transparent',
            borderRadius: 'var(--border-radius-md)',
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}>
            <strong style={{ fontSize: '0.75rem', color: '#ef4444', textAlign: 'center' }}>EXECUTION ENGINE</strong>
            <div style={{
              padding: '0.5rem',
              backgroundColor: isSubActive('interpreter') ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)',
              border: isSubActive('interpreter') ? '1.5px solid #1591DC' : '1px solid var(--bg-tertiary)',
              borderRadius: '4px',
              fontSize: '0.75rem',
              textAlign: 'center',
              fontWeight: isSubActive('interpreter') ? '700' : 'normal'
            }}>
              Interpreter
            </div>
            <div style={{
              padding: '0.5rem',
              backgroundColor: isSubActive('jit') ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)',
              border: isSubActive('jit') ? '1.5px solid #1591DC' : '1px solid var(--bg-tertiary)',
              borderRadius: '4px',
              fontSize: '0.75rem',
              textAlign: 'center',
              fontWeight: isSubActive('jit') ? '700' : 'normal'
            }}>
              JIT Compiler
            </div>
            <div style={{
              padding: '0.5rem',
              backgroundColor: isSubActive('gc') ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)',
              border: isSubActive('gc') ? '1.5px solid #1591DC' : '1px solid var(--bg-tertiary)',
              borderRadius: '4px',
              fontSize: '0.75rem',
              textAlign: 'center',
              fontWeight: isSubActive('gc') ? '700' : 'normal'
            }}>
              Garbage Collector
            </div>
          </div>

        </div>
      </div>
    </VisualizerShell>
  );
}
