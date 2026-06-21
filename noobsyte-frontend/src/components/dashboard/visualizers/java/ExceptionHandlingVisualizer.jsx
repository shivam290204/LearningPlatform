import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function ExceptionHandlingVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1300);

  const steps = [
    {
      action: '1. Normal Execution',
      log: 'main() called methodA(), which called methodB(). Active call stack has 3 frames. Executing code normally.',
      stack: ['main()', 'methodA()', 'methodB()'],
      activeFrame: 'methodB()',
      codeHighlight: 'methodB: int result = 10 / divisor;',
      divisor: 0,
      consoleOutput: 'Starting program...'
    },
    {
      action: '2. Exception Thrown',
      log: 'ArithmeticException (division by zero) thrown inside methodB(). Execution is suspended.',
      stack: ['main()', 'methodA()', 'methodB()'],
      activeFrame: 'methodB()',
      codeHighlight: 'methodB: throw new ArithmeticException();',
      divisor: 0,
      consoleOutput: 'Starting program...'
    },
    {
      action: '3. Inspecting methodB()',
      log: 'JVM searches methodB() stack frame for a try-catch block matching ArithmeticException. None found.',
      stack: ['main()', 'methodA()', 'methodB()'],
      activeFrame: 'methodB()',
      codeHighlight: 'methodB: [No Catch Block]',
      divisor: 0,
      consoleOutput: 'Starting program...'
    },
    {
      action: '4. Unwinding methodB()',
      log: 'Unwinding: methodB() frame is popped from the stack and destroyed. Control returns to caller methodA().',
      stack: ['main()', 'methodA()'],
      activeFrame: 'methodA()',
      codeHighlight: 'methodA: methodB(0);',
      divisor: 0,
      consoleOutput: 'Starting program...'
    },
    {
      action: '5. Inspecting methodA()',
      log: 'JVM searches methodA() stack frame for a try-catch block. None found.',
      stack: ['main()', 'methodA()'],
      activeFrame: 'methodA()',
      codeHighlight: 'methodA: [No Catch Block]',
      divisor: 0,
      consoleOutput: 'Starting program...'
    },
    {
      action: '6. Unwinding methodA()',
      log: 'Unwinding: methodA() frame is popped from the stack and destroyed. Control returns to caller main().',
      stack: ['main()'],
      activeFrame: 'main()',
      codeHighlight: 'main: methodA();',
      divisor: 0,
      consoleOutput: 'Starting program...'
    },
    {
      action: '7. Catch Found in main()',
      log: 'JVM inspects main() stack frame. A matching try-catch block for ArithmeticException is found! Execution jumps to the catch block.',
      stack: ['main()'],
      activeFrame: 'main()',
      codeHighlight: 'main: catch (ArithmeticException e) { ... }',
      divisor: 0,
      consoleOutput: 'Console: Caught ArithmeticException: / by zero'
    },
    {
      action: '8. finally Block Execution',
      log: 'JVM executes the finally block in main() to clean up resources, regardless of exception status.',
      stack: ['main()'],
      activeFrame: 'main()',
      codeHighlight: 'main: finally { System.out.println("Cleaned!"); }',
      divisor: 0,
      consoleOutput: 'Console: Cleaned!'
    },
    {
      action: '9. Completed',
      log: 'Exception handled. The program resumes normal execution lines past the try-catch block in main().',
      stack: ['main()'],
      activeFrame: 'main()',
      codeHighlight: 'main: // Continue execution...',
      divisor: 0,
      consoleOutput: 'Console: Program completed successfully.'
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
      <div>Active Thread Call Stack Depth: <strong style={{ color: '#FFFFFF' }}>{steps[currentStep].stack.length} frames</strong></div>
      <div>Active Executing Method: <strong style={{ color: '#1591DC' }}>{steps[currentStep].activeFrame}</strong></div>
      <div>Active Exception Pointer: <span style={{ color: currentStep >= 1 && currentStep <= 7 ? '#ef4444' : 'var(--text-tertiary)' }}>
        {currentStep >= 1 && currentStep <= 7 ? 'ArithmeticException object (0xEX_ARITH)' : 'None'}
      </span></div>
    </div>
  );

  const theory = (
    <div>
      <p>When an Exception is thrown in Java, the runtime searches the call stack for an exception handler (catch block):</p>
      <ul>
        <li><strong>Call Stack:</strong> A list of active method execution frames. Each method call pushes a new frame onto the stack.</li>
        <li><strong>Stack Unwinding:</strong> If a method throws an exception but does not contain a matching catch block, its stack frame is instantly popped (destroyed), and the exception is propagated to the caller method.</li>
        <li><strong>Try-Catch-Finally:</strong>
          <ul>
            <li><code>try</code>: Encloses code that might throw an exception.</li>
            <li><code>catch</code>: Contains code to handle specific exceptions.</li>
            <li><code>finally</code>: Executed regardless of whether an exception is thrown or caught (used for resource cleanups).</li>
          </ul>
        </li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Exception Stack Unwinding as **delegating a task at work**:</p>
      <ul>
        <li>The Director (<code>main</code>) asks the Manager (<code>methodA</code>) to resolve a client issue, who then asks the Intern (<code>methodB</code>) to execute it.</li>
        <li>An emergency occurs (Exception thrown). The Intern checks their handbook but doesn't know how to handle it. The Intern quits immediately, throwing the problem up to the Manager (Unwind Intern frame).</li>
        <li>The Manager checks their folder, has no solution either, and throws the problem up to the Director (Unwind Manager frame).</li>
        <li>The Director has an emergency plan (Catch block) in their drawer. The Director executes the plan, and then shuts down the computer safely (Finally cleanup).</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Catching Generic Throwable/Exception:</strong> Catching <code>Exception</code> or <code>Throwable</code> globally hiding underlying bugs. Catch specific exceptions instead to ensure correct responses.</li>
      <li><strong>Swallowing Exceptions:</strong> Empty catch blocks (e.g. <code>catch(Exception e) {}</code>). This makes debugging nearly impossible because errors are silenced without logging.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is the difference between Checked and Unchecked exceptions?',
      a: 'Checked exceptions (inherit from Exception but not RuntimeException) are checked at compile-time; the compiler forces you to handle them (try-catch or throws). Unchecked exceptions (inherit from RuntimeException) are verified at runtime (programming bugs like NullPointerException or ArithmeticException) and do not require compiler checks.'
    },
    {
      q: 'Will the finally block execute if a method returns a value inside the try block?',
      a: 'Yes, the finally block will always execute. The JVM schedules the finally block to execute right after the return value is evaluated, but before the method actually returns control back to the caller.'
    }
  ];

  const quizQuestions = [
    {
      question: 'What happens if a thrown Exception propagates all the way out of the main() method without being caught?',
      options: [
        'The program silently restarts',
        'The JVM ignores the exception and continues execution',
        'The thread terminates, printing the exception stack trace to the console',
        'The computer crashes'
      ],
      correctIdx: 2,
      explanation: 'Uncaught exceptions reach the default thread exception handler, terminating that thread and logging the stack trace output.'
    },
    {
      question: 'Which block is guaranteed to execute even if a catch block throws another exception?',
      options: [
        'try block',
        'catch block',
        'finally block',
        'static initializer'
      ],
      correctIdx: 2,
      explanation: 'The finally block is guaranteed to run after try/catch execution, even if a catch block throws a new exception or returns a value.'
    }
  ];

  return (
    <VisualizerShell
      title="Exception Stack Unwinding & Try-Catch"
      subtitle="Observe call stack frames popped (unwound) during exceptions until catch/finally handlers are resolved."
      timeComplexity="Propagations: O(Stack Depth)"
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
          gridTemplateColumns: '1.2fr 1.5fr',
          gap: '1.5rem',
          width: '100%'
        }} className="visualizer-grid-layout">
          
          {/* Active Call Stack */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--bg-tertiary)',
            borderRadius: 'var(--border-radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            justifyContent: 'flex-end',
            minHeight: '240px'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: '0.4rem', width: '100%', textAlign: 'center' }}>JVM CALL STACK</span>
            
            {steps[currentStep].stack.map((frame, index) => {
              const isActive = steps[currentStep].activeFrame === frame;
              const hasException = currentStep >= 1 && currentStep <= 6 && frame === 'methodB()';

              return (
                <div
                  key={frame}
                  style={{
                    width: '180px',
                    padding: '0.65rem',
                    border: hasException ? '2px solid #ef4444' : isActive ? '2px solid #1591DC' : '1.5px solid var(--bg-tertiary)',
                    borderRadius: '4px',
                    backgroundColor: hasException ? 'rgba(239, 68, 68, 0.05)' : isActive ? 'rgba(21, 145, 220, 0.05)' : 'var(--bg-primary)',
                    color: hasException ? '#ef4444' : isActive ? '#1591DC' : '#FFFFFF',
                    fontWeight: '700',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    boxShadow: hasException ? '0 0 10px rgba(239, 68, 68, 0.25)' : isActive ? '0 0 10px rgba(21, 145, 220, 0.2)' : 'none',
                    transition: 'all 0.3s'
                  }}
                >
                  {frame}
                  {hasException && <span style={{ display: 'block', fontSize: '0.55rem', color: '#ef4444', marginTop: '0.15rem' }}>🔥 ArithmeticException</span>}
                </div>
              );
            })}
          </div>

          {/* Code Viewer & Output */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Code Block */}
            <div style={{
              backgroundColor: '#08090d',
              border: '1px solid var(--bg-tertiary)',
              borderRadius: 'var(--border-radius-md)',
              padding: '1rem',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: '#a6accd',
              lineHeight: '1.5'
            }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.5rem', fontFamily: 'sans-serif' }}>CODE TRACE REFERENCE</span>
              
              <div style={{ color: '#546e7a' }}>// Class Call Sequence</div>
              <div>
                <span style={{ color: '#c792ea' }}>void</span> <span style={{ color: '#82aaff' }}>main</span>() {'{'}
                <div style={{ paddingLeft: '1rem', backgroundColor: steps[currentStep].codeHighlight.includes('main') ? 'rgba(21, 145, 220, 0.15)' : 'transparent', color: steps[currentStep].codeHighlight.includes('main') ? '#FFFFFF' : 'inherit' }}>
                  <span style={{ color: '#c792ea' }}>try</span> {'{'} methodA(); {'}'}
                  <div style={{ color: steps[currentStep].codeHighlight.includes('catch') ? '#f59e0b' : '#c792ea' }}>catch (ArithmeticException e) {'{'} ... {'}'}</div>
                  <div style={{ color: steps[currentStep].codeHighlight.includes('finally') ? '#10b981' : '#c792ea' }}>finally {'{'} System.out.println("Cleaned!"); {'}'}</div>
                </div>
                {'}'}
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ color: '#c792ea' }}>void</span> <span style={{ color: '#82aaff' }}>methodA</span>() {'{'}
                <div style={{ paddingLeft: '1rem', backgroundColor: steps[currentStep].codeHighlight.includes('methodA') ? 'rgba(21, 145, 220, 0.15)' : 'transparent', color: steps[currentStep].codeHighlight.includes('methodA') ? '#FFFFFF' : 'inherit' }}>
                  methodB(<span style={{ color: '#f78c6c' }}>0</span>);
                </div>
                {'}'}
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ color: '#c792ea' }}>void</span> <span style={{ color: '#82aaff' }}>methodB</span>(<span style={{ color: '#c792ea' }}>int</span> divisor) {'{'}
                <div style={{ paddingLeft: '1rem', backgroundColor: steps[currentStep].codeHighlight.includes('methodB') ? 'rgba(239, 68, 68, 0.15)' : 'transparent', color: steps[currentStep].codeHighlight.includes('methodB') ? '#FFFFFF' : 'inherit' }}>
                  <span style={{ color: '#c792ea' }}>int</span> res = <span style={{ color: '#f78c6c' }}>10</span> / divisor; <span style={{ color: '#546e7a' }}>// divisor is 0!</span>
                </div>
                {'}'}
              </div>
            </div>

            {/* Console Output */}
            <div style={{
              backgroundColor: '#000000',
              border: '1px solid #10b981',
              borderRadius: 'var(--border-radius-md)',
              padding: '0.85rem 1.25rem',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              color: '#10b981'
            }}>
              <span style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-tertiary)', fontFamily: 'sans-serif', marginBottom: '0.25rem' }}>CONSOLE LOGGER</span>
              {steps[currentStep].consoleOutput}
            </div>
          </div>

        </div>

      </div>
    </VisualizerShell>
  );
}
