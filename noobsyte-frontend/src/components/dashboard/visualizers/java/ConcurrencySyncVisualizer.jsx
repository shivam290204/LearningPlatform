import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function ConcurrencySyncVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1300);

  const steps = [
    {
      action: '1. Unlocked State',
      log: 'Thread-1 and Thread-2 running concurrently. Monitor Lock A and Lock B are free.',
      t1State: 'RUNNABLE',
      t2State: 'RUNNABLE',
      lockAOwner: null,
      lockBOwner: null,
      t1Requests: null,
      t2Requests: null,
      status: 'normal'
    },
    {
      action: '2. Thread-1 acquires Lock A',
      log: 'Thread-1 enters synchronized block for Lock A. Lock A is locked by Thread-1.',
      t1State: 'RUNNING',
      t2State: 'RUNNABLE',
      lockAOwner: 'Thread-1',
      lockBOwner: null,
      t1Requests: null,
      t2Requests: null,
      status: 'normal'
    },
    {
      action: '3. Thread-2 acquires Lock B',
      log: 'Thread-2 enters synchronized block for Lock B. Lock B is locked by Thread-2.',
      t1State: 'RUNNING',
      t2State: 'RUNNING',
      lockAOwner: 'Thread-1',
      lockBOwner: 'Thread-2',
      t1Requests: null,
      t2Requests: null,
      status: 'normal'
    },
    {
      action: '4. Thread-1 requests Lock B',
      log: 'Thread-1 requests Lock B, but Lock B is held by Thread-2. Thread-1 blocks (WAITING).',
      t1State: 'BLOCKED (Waiting for Lock B)',
      t2State: 'RUNNING',
      lockAOwner: 'Thread-1',
      lockBOwner: 'Thread-2',
      t1Requests: 'Lock B',
      t2Requests: null,
      status: 'normal'
    },
    {
      action: '5. Thread-2 requests Lock A',
      log: 'Thread-2 requests Lock A, but Lock A is held by Thread-1. Thread-2 blocks (WAITING).',
      t1State: 'BLOCKED (Waiting for Lock B)',
      t2State: 'BLOCKED (Waiting for Lock A)',
      lockAOwner: 'Thread-1',
      lockBOwner: 'Thread-2',
      t1Requests: 'Lock B',
      t2Requests: 'Lock A',
      status: 'deadlock'
    },
    {
      action: '6. Deadlock Cycle Formed',
      log: '🚨 DEADLOCK DETECTED! Thread-1 waits for Thread-2 to release Lock B. Thread-2 waits for Thread-1 to release Lock A. Circular wait frozen.',
      t1State: 'DEADLOCKED',
      t2State: 'DEADLOCKED',
      lockAOwner: 'Thread-1',
      lockBOwner: 'Thread-2',
      t1Requests: 'Lock B',
      t2Requests: 'Lock A',
      status: 'deadlock'
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
      <div>Thread-1 status: <strong style={{ color: steps[currentStep].t1State.includes('DEAD') || steps[currentStep].t1State.includes('BLOCK') ? '#ef4444' : '#10b981' }}>{steps[currentStep].t1State}</strong></div>
      <div>Thread-2 status: <strong style={{ color: steps[currentStep].t2State.includes('DEAD') || steps[currentStep].t2State.includes('BLOCK') ? '#ef4444' : '#10b981' }}>{steps[currentStep].t2State}</strong></div>
      <div>Lock A Owner: <strong style={{ color: '#FFFFFF' }}>{steps[currentStep].lockAOwner || 'Free'}</strong></div>
      <div>Lock B Owner: <strong style={{ color: '#FFFFFF' }}>{steps[currentStep].lockBOwner || 'Free'}</strong></div>
    </div>
  );

  const theory = (
    <div>
      <p>Multi-threaded programs use **Monitors** and **Locks** to synchronize shared mutable state, but this exposes risks of deadlocks:</p>
      <ul>
        <li><strong>Synchronization:</strong> In Java, the <code>synchronized</code> keyword locks an object monitor, permitting only one thread to execute that block. Other threads block until it releases.</li>
        <li><strong>Deadlock Conditions (Coffman Conditions):</strong>
          <ol>
            <li>Mutual Exclusion (exclusive access).</li>
            <li>Hold and Wait (holding a lock while waiting for another).</li>
            <li>No Preemption (locks cannot be forced away).</li>
            <li>Circular Wait (Thread 1 waits for Thread 2, who waits for Thread 1).</li>
          </ol>
        </li>
        <li><strong>Prevention:</strong> Always acquire resources in a strict, global order (e.g. acquire Lock A first, then Lock B).</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Synchronization and Deadlocks as **two kids eating noodles with chopsticks**:</p>
      <ul>
        <li>There are only 2 chopsticks on the table (Chopstick A and Chopstick B). To eat, a kid needs both chopsticks.</li>
        <li>Kid 1 grabs Chopstick A (Lock A). Kid 2 grabs Chopstick B (Lock B).</li>
        <li>Now, Kid 1 holds A and waits for B to be put down (Hold and Wait). Kid 2 holds B and waits for A (Circular Wait). Neither can eat, and they sit staring at each other forever (Deadlock!).</li>
        <li><strong>Solution:</strong> The parent tells them: "You must always pick up Chopstick A first, then Chopstick B." Now Kid 1 picks up A. Kid 2 tries to pick up B but cannot because the rule says they must pick up A first (which is held). Kid 1 grabs B, eats, puts both down, and then Kid 2 can eat. No deadlock!</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Locking unnecessarily:</strong> Placing large blocks of code under <code>synchronized</code> tags. This reduces concurrency, making the application run synchronously (slow performance). Keep synchronized blocks as small as possible.</li>
      <li><strong>Inconsistent Lock ordering:</strong> Acquiring locks in different orders in different classes (e.g., Service A locks User then Account, while Service B locks Account then User). This guarantees deadlocks under high load.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'How do you detect a deadlock in a running Java application?',
      a: 'Use diagnostic tools like "jstack <pid>" to extract a thread dump, which automatically analyzes lock monitors and prints deadlock threads. Alternatively, use JConsole or programmatically via ThreadMXBean.findDeadlockedThreads().'
    },
    {
      q: 'What is the difference between synchronized method and Lock interface in Java?',
      a: 'synchronized blocks are implicit and scoped (automatically unlock when block exits). java.util.concurrent.locks.Lock provides explicit lock/unlock controls, support for non-blocking locks (tryLock), timeouts, and fair lock queues.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which of the following is NOT one of the Coffman conditions required for a deadlock to occur?',
      options: [
        'Mutual Exclusion',
        'Hold and Wait',
        'Preemption of lock owners by force',
        'Circular Wait'
      ],
      correctIdx: 2,
      explanation: 'No Preemption is a Coffman condition (locks cannot be taken away by force). If preemption is allowed, a deadlock is broken.'
    },
    {
      question: 'What is a reliable way to prevent deadlocks when acquiring multiple locks?',
      options: [
        'Run threads at different speeds',
        'Always acquire locks in a globally consistent order across all threads',
        'Avoid using the synchronized keyword',
        'Use volatile variables'
      ],
      correctIdx: 1,
      explanation: 'Establishing a strict global locking hierarchy (e.g., always locking Lock A before Lock B) breaks the Circular Wait condition, making deadlocks impossible.'
    }
  ];

  return (
    <VisualizerShell
      title="Synchronization & Deadlock Simulation"
      subtitle="Witness thread monitor acquisitions and circular wait deadlocks."
      timeComplexity="Acquire: O(1)"
      spaceComplexity="O(1)"
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', minHeight: '280px' }}>
        
        {steps[currentStep].status === 'deadlock' && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px dashed #ef4444',
            color: '#FFFFFF',
            padding: '0.6rem',
            textAlign: 'center',
            fontSize: '0.85rem',
            fontWeight: '700',
            borderRadius: '4px',
            animation: 'pulse-resize-cell 1s infinite alternate'
          }}>
            🚨 DEADLOCK DETECTED! Threads frozen in circular wait.
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1rem',
          width: '100%',
          alignItems: 'center'
        }} className="visualizer-grid-layout">
          
          {/* Thread 1 Node */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: steps[currentStep].t1State.includes('DEAD') ? '2.5px solid #ef4444' : '1px solid var(--bg-tertiary)',
            borderRadius: 'var(--border-radius-md)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)' }}>THREAD ID 1</span>
            <strong style={{ fontSize: '0.9rem' }}>Thread-1</strong>
            <span style={{
              fontSize: '0.75rem',
              padding: '0.2rem 0.4rem',
              borderRadius: '2px',
              backgroundColor: steps[currentStep].t1State.includes('BLOCKED') || steps[currentStep].t1State.includes('DEAD') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              color: steps[currentStep].t1State.includes('BLOCKED') || steps[currentStep].t1State.includes('DEAD') ? '#ef4444' : '#10b981',
              fontWeight: '700'
            }}>
              {steps[currentStep].t1State}
            </span>
          </div>

          {/* Locks Middle Area */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center'
          }}>
            {/* Lock A */}
            <div style={{
              padding: '0.75rem 1rem',
              border: steps[currentStep].lockAOwner ? '2px solid #ef4444' : '2px solid #10b981',
              borderRadius: '4px',
              backgroundColor: steps[currentStep].lockAOwner ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)',
              textAlign: 'center',
              width: '120px',
              transition: 'all 0.3s'
            }}>
              <strong style={{ fontSize: '0.8rem', display: 'block', color: '#FFFFFF' }}>Lock Monitor A</strong>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                {steps[currentStep].lockAOwner ? `Held by: ${steps[currentStep].lockAOwner}` : 'Status: FREE'}
              </span>
            </div>

            {/* Lock B */}
            <div style={{
              padding: '0.75rem 1rem',
              border: steps[currentStep].lockBOwner ? '2px solid #ef4444' : '2px solid #10b981',
              borderRadius: '4px',
              backgroundColor: steps[currentStep].lockBOwner ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)',
              textAlign: 'center',
              width: '120px',
              transition: 'all 0.3s'
            }}>
              <strong style={{ fontSize: '0.8rem', display: 'block', color: '#FFFFFF' }}>Lock Monitor B</strong>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                {steps[currentStep].lockBOwner ? `Held by: ${steps[currentStep].lockBOwner}` : 'Status: FREE'}
              </span>
            </div>
          </div>

          {/* Thread 2 Node */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: steps[currentStep].t2State.includes('DEAD') ? '2.5px solid #ef4444' : '1px solid var(--bg-tertiary)',
            borderRadius: 'var(--border-radius-md)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)' }}>THREAD ID 2</span>
            <strong style={{ fontSize: '0.9rem' }}>Thread-2</strong>
            <span style={{
              fontSize: '0.75rem',
              padding: '0.2rem 0.4rem',
              borderRadius: '2px',
              backgroundColor: steps[currentStep].t2State.includes('BLOCKED') || steps[currentStep].t2State.includes('DEAD') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              color: steps[currentStep].t2State.includes('BLOCKED') || steps[currentStep].t2State.includes('DEAD') ? '#ef4444' : '#10b981',
              fontWeight: '700'
            }}>
              {steps[currentStep].t2State}
            </span>
          </div>

        </div>

        {/* Request Path Trace Arrows */}
        {(steps[currentStep].t1Requests || steps[currentStep].t2Requests) && (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px dashed var(--bg-tertiary)',
            borderRadius: '4px',
            padding: '0.75rem',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            textAlign: 'center'
          }}>
            <strong>Lock Requests:</strong>{' '}
            {steps[currentStep].t1Requests && `Thread-1 is requesting [${steps[currentStep].t1Requests}]. `}
            {steps[currentStep].t2Requests && `Thread-2 is requesting [${steps[currentStep].t2Requests}].`}
          </div>
        )}

      </div>
    </VisualizerShell>
  );
}
