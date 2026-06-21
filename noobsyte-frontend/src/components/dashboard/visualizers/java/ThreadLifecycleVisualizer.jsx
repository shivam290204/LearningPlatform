import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function ThreadLifecycleVisualizer() {
  const [threadState, setThreadState] = useState('NEW');
  const [logs, setLogs] = useState(['Thread object created: Thread t = new Thread(). State: NEW']);

  const transitionTo = (newState, actionDesc, logMsg) => {
    setThreadState(newState);
    setLogs(prev => [`[${actionDesc}] -> Transitioned to ${newState}. ${logMsg}`, ...prev]);
  };

  const controls = (
    <>
      <button 
        className="btn-viz-action btn-add" 
        onClick={() => transitionTo('RUNNABLE', 'start()', 'Thread added to CPU ready queue.')}
        disabled={threadState !== 'NEW'}
      >
        t.start()
      </button>
      <button 
        className="btn-viz-action" 
        onClick={() => transitionTo('RUNNING', 'Dispatch', 'CPU allocated execution timeslice.')}
        disabled={threadState !== 'RUNNABLE'}
      >
        CPU Dispatch
      </button>
      <button 
        className="btn-viz-action" 
        onClick={() => transitionTo('RUNNABLE', 'yield()', 'Thread voluntarily gives up CPU timeslice.')}
        disabled={threadState !== 'RUNNING'}
      >
        Thread.yield()
      </button>
      <button 
        className="btn-viz-action btn-clear" 
        onClick={() => transitionTo('BLOCKED', 'Lock Block', 'Thread requests locked monitor resource.')}
        disabled={threadState !== 'RUNNING'}
      >
        Enter synchronized Block
      </button>
      <button 
        className="btn-viz-action btn-add" 
        onClick={() => transitionTo('RUNNABLE', 'Lock Acquired', 'Lock acquired. Thread ready to execute.')}
        disabled={threadState !== 'BLOCKED'}
      >
        Acquire Lock
      </button>
      <button 
        className="btn-viz-action btn-clear" 
        onClick={() => transitionTo('WAITING', 'wait()', 'Thread waits indefinitely for notification.')}
        disabled={threadState !== 'RUNNING'}
      >
        t.wait() / t.join()
      </button>
      <button 
        className="btn-viz-action btn-add" 
        onClick={() => transitionTo('RUNNABLE', 'notify()', 'Woken up by lock monitor.')}
        disabled={threadState !== 'WAITING'}
      >
        obj.notify() / notifyAll()
      </button>
      <button 
        className="btn-viz-action btn-clear" 
        onClick={() => transitionTo('TERMINATED', 'Exit', 'run() method completes execution.')}
        disabled={threadState !== 'RUNNING'}
      >
        Exit run()
      </button>
    </>
  );

  const stateInspector = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
      <div>Active Thread State: <strong style={{ color: '#1591DC' }}>{threadState}</strong></div>
      <div>Thread Priority: <span style={{ color: '#FFFFFF' }}>5 (NORM_PRIORITY)</span></div>
      <div>Daemon Thread: <span style={{ color: '#FFFFFF' }}>false</span></div>
      <div>Is Alive: <strong style={{ color: (threadState !== 'NEW' && threadState !== 'TERMINATED') ? '#10b981' : '#ef4444' }}>
        {(threadState !== 'NEW' && threadState !== 'TERMINATED') ? 'TRUE' : 'FALSE'}
      </strong></div>
    </div>
  );

  const theory = (
    <div>
      <p>A Java thread moves through various states managed by the JVM and CPU schedulers during its lifecycle:</p>
      <ul>
        <li><strong>NEW:</strong> A Thread object is created but <code>start()</code> has not been called.</li>
        <li><strong>RUNNABLE:</strong> Thread is executing or ready to execute in the CPU queue.</li>
        <li><strong>RUNNING:</strong> The CPU scheduler allocates a timeslice to run instructions.</li>
        <li><strong>BLOCKED:</strong> Thread waits to acquire an object monitor lock (e.g. entering a <code>synchronized</code> method).</li>
        <li><strong>WAITING:</strong> Thread waits indefinitely for another thread to notify or signal (e.g. via <code>wait()</code> or <code>join()</code>).</li>
        <li><strong>TERMINATED:</strong> The thread completes execution or throws an unhandled exception. It cannot be restarted.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of the Thread Lifecycle as a **chef in a restaurant kitchen**:</p>
      <ul>
        <li><strong>NEW:</strong> The chef is hired and stands at the kitchen door (Thread created).</li>
        <li><strong>RUNNABLE:</strong> The chef is at their cooking station, ready to chop vegetables but waiting for a clean knife (in the CPU ready queue).</li>
        <li><strong>RUNNING:</strong> The chef is actively chopping onions (CPU allocated).</li>
        <li><strong>BLOCKED:</strong> The chef needs the microwave, but another chef is using it. They must wait until the lock is released (Blocked for resource).</li>
        <li><strong>WAITING:</strong> The chef is waiting for the water to boil. They sit on a chair and sleep until a bell rings (wait/notify).</li>
        <li><strong>TERMINATED:</strong> The shift ends and the chef goes home (run completes).</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Calling run() instead of start():</strong> Calling <code>t.run()</code> executes the code synchronously in the <em>current calling thread</em> instead of creating a new concurrent call stack. Always call <code>t.start()</code>.</li>
      <li><strong>Restarting a Thread:</strong> Once a thread is TERMINATED, calling <code>start()</code> again throws an <code>IllegalThreadStateException</code>.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is the difference between wait() and sleep()?',
      a: 'wait() is a method of Object class that releases the object lock during waiting, requiring a notify() to wake up. sleep() is a static method of Thread class that keeps the monitor lock during execution, waking up automatically after a timer expires.'
    },
    {
      q: 'What is a deadlock and how does it happen?',
      a: 'A deadlock occurs when two or more threads are blocked indefinitely, each waiting for a lock held by the other (e.g., Thread 1 holds Lock A and waits for Lock B, while Thread 2 holds Lock B and waits for Lock A).'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which exception is thrown if you attempt to call start() on an already running Thread?',
      options: [
        'NullPointerException',
        'IllegalThreadStateException',
        'InterruptedException',
        'RuntimeException'
      ],
      correctIdx: 1,
      explanation: 'JVM throws an IllegalThreadStateException if a thread has already been started or terminated and start() is called again.'
    },
    {
      question: 'Which state does a thread enter when it calls wait() on an object?',
      options: [
        'BLOCKED',
        'WAITING',
        'TERMINATED',
        'RUNNABLE'
      ],
      correctIdx: 1,
      explanation: 'Calling wait() puts the thread in the WAITING state. It will only return to RUNNABLE once notify() or notifyAll() is invoked on that monitor object.'
    }
  ];

  // Helper to get CSS classes or styles for states
  const getStateStyle = (stateName) => {
    const isActive = threadState === stateName;
    return {
      border: isActive ? '3px solid #1591DC' : '2px solid var(--bg-tertiary)',
      backgroundColor: isActive ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-secondary)',
      color: isActive ? '#1591DC' : 'var(--text-secondary)',
      boxShadow: isActive ? '0 0 15px rgba(21, 145, 220, 0.4)' : 'none',
      fontWeight: isActive ? '800' : '600',
      padding: '0.75rem 1rem',
      borderRadius: '25px',
      fontSize: '0.85rem',
      width: '120px',
      textAlign: 'center',
      transition: 'all 0.3s'
    };
  };

  return (
    <VisualizerShell
      title="Java Thread Lifecycle State Machine"
      subtitle="Interact with triggers to witness thread transitions between ready, blocked, waiting, and executing pools."
      timeComplexity="State changes: O(1)"
      spaceComplexity="O(1)"
      theoryContent={theory}
      analogyContent={analogy}
      mistakesContent={mistakes}
      interviewQuestions={interviewQuestions}
      quizQuestions={quizQuestions}
      controls={controls}
      logs={logs}
      stateInspector={stateInspector}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', width: '100%', minHeight: '260px', padding: '1rem 0' }}>
        
        {/* Flowchart Layout */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          width: '100%'
        }}>
          {/* Row 1: NEW & TERMINATED */}
          <div style={{ display: 'flex', gap: '8rem', justifyContent: 'center', width: '100%', alignItems: 'center' }}>
            <div style={getStateStyle('NEW')}>NEW</div>
            <div style={getStateStyle('TERMINATED')}>TERMINATED</div>
          </div>

          {/* Row 2: RUNNABLE & RUNNING */}
          <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', width: '100%', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={getStateStyle('RUNNABLE')}>RUNNABLE</div>
            
            {/* Double arrow indicator */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
              <span>◀ yield()</span>
              <span>dispatch ▶</span>
            </div>

            <div style={getStateStyle('RUNNING')}>RUNNING</div>
          </div>

          {/* Row 3: BLOCKED & WAITING */}
          <div style={{ display: 'flex', gap: '8rem', justifyContent: 'center', width: '100%', alignItems: 'center' }}>
            <div style={getStateStyle('BLOCKED')}>BLOCKED</div>
            <div style={getStateStyle('WAITING')}>WAITING</div>
          </div>
        </div>

        {/* State description banner */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px dashed var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.75rem 1.25rem',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <strong>Current State Description:</strong>{' '}
          {threadState === 'NEW' && 'Thread object exists in memory but t.start() has not been called. CPU is not aware of it.'}
          {threadState === 'RUNNABLE' && 'Thread is registered with the OS scheduler. It is ready to run and waiting for its CPU slice.'}
          {threadState === 'RUNNING' && 'Thread is currently occupying a CPU core and executing instructions in its run() method.'}
          {threadState === 'BLOCKED' && 'Thread is blocked waiting to enter a synchronized block because another thread holds the lock.'}
          {threadState === 'WAITING' && 'Thread called t.wait() or t.join() and is parked until another thread issues t.notify().'}
          {threadState === 'TERMINATED' && 'Thread has finished executing its run() method. All execution call stacks are destroyed.'}
        </div>

      </div>
    </VisualizerShell>
  );
}
