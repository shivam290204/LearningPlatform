import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function DbLockingVisualizer() {
  const [scenario, setScenario] = useState('SHARED_COMPATIBLE'); // 'SHARED_COMPATIBLE', 'EXCLUSIVE_CONFLICT', 'DEADLOCK'
  const [log, setLog] = useState('Locking Simulator ready. Select a scenario and run validation.');
  const [lockStates, setLockStates] = useState({
    row1: { lockedBy: [], type: null },
    row2: { lockedBy: [], type: null }
  });
  const [txStates, setTxStates] = useState({
    txA: 'IDLE',
    txB: 'IDLE'
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const runLockScenario = () => {
    setIsAnimating(true);
    setLog('Initializing transaction threads...');

    if (scenario === 'SHARED_COMPATIBLE') {
      setTxStates({ txA: 'ACQUIRING_S', txB: 'ACQUIRING_S' });
      setLog('Transaction A and B both requesting Shared Locks (S) on Row 1.');

      setTimeout(() => {
        setLockStates({
          row1: { lockedBy: ['Tx A', 'Tx B'], type: 'Shared (S)' },
          row2: { lockedBy: [], type: null }
        });
        setTxStates({ txA: 'HOLDING_S', txB: 'HOLDING_S' });
        setLog('Validation Success: Shared Locks are compatible. Both transactions hold read access concurrently.');
        setIsAnimating(false);
      }, 1200);
    } else if (scenario === 'EXCLUSIVE_CONFLICT') {
      setTxStates({ txA: 'ACQUIRING_S', txB: 'IDLE' });
      setLog('Transaction A requests and acquires Shared Lock (S) on Row 1.');

      setTimeout(() => {
        setLockStates({
          row1: { lockedBy: ['Tx A'], type: 'Shared (S)' },
          row2: { lockedBy: [], type: null }
        });
        setTxStates({ txA: 'HOLDING_S', txB: 'ACQUIRING_X' });
        setLog('Transaction B requests Exclusive Write Lock (X) on Row 1. Checking compatibility matrix...');

        setTimeout(() => {
          setTxStates({ txA: 'HOLDING_S', txB: 'WAITING' });
          setLog('Lock Conflict: Exclusive Lock (X) is incompatible with active Shared Lock (S). Transaction B blocked, entering WAIT state.');
          setIsAnimating(false);
        }, 1200);

      }, 1000);
    } else if (scenario === 'DEADLOCK') {
      setTxStates({ txA: 'HOLDING_ROW1', txB: 'HOLDING_ROW2' });
      setLockStates({
        row1: { lockedBy: ['Tx A'], type: 'Exclusive (X)' },
        row2: { lockedBy: ['Tx B'], type: 'Exclusive (X)' }
      });
      setLog('Tx A locks Row 1 (X). Tx B locks Row 2 (X). Both run concurrently...');

      setTimeout(() => {
        setTxStates({ txA: 'WAITING_ROW2', txB: 'WAITING_ROW1' });
        setLog('Deadlock state: Tx A requests Row 2 (blocked by Tx B). Tx B requests Row 1 (blocked by Tx A). Circular dependency detected!');

        setTimeout(() => {
          setLog('Deadlock Detector Active: Identifying victim transaction. Aborting Transaction B...');
          
          setTimeout(() => {
            setLockStates({
              row1: { lockedBy: ['Tx A'], type: 'Exclusive (X)' },
              row2: { lockedBy: [], type: null }
            });
            setTxStates({ txA: 'COMPLETED', txB: 'ABORTED' });
            setLog('Resolution: Tx B aborted (locks released). Tx A acquired Row 2, completed, and committed safely.');
            setIsAnimating(false);
          }, 1500);

        }, 1500);

      }, 1200);
    }
  };

  const handleReset = () => {
    setIsAnimating(false);
    setLockStates({
      row1: { lockedBy: [], type: null },
      row2: { lockedBy: [], type: null }
    });
    setTxStates({ txA: 'IDLE', txB: 'IDLE' });
    setLog('Lock simulator reset.');
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Lock Scenario:</span>
      <select
        value={scenario}
        onChange={(e) => {
          setScenario(e.target.value);
          handleReset();
        }}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        <option value="SHARED_COMPATIBLE">Shared vs Shared (Compatible Read)</option>
        <option value="EXCLUSIVE_CONFLICT">Shared vs Exclusive (Block Write)</option>
        <option value="DEADLOCK">Deadlock Cycle (Detect &amp; Resolve)</option>
      </select>

      <button className="btn-viz-action btn-add" onClick={runLockScenario} disabled={isAnimating}>
        Execute Scenario
      </button>

      <button className="btn-viz-action" onClick={handleReset} disabled={isAnimating}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Transaction Threads</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          <div>Tx Thread A: <strong style={{ color: '#1591DC' }}>{txStates.txA}</strong></div>
          <div>Tx Thread B: <strong style={{ color: '#1591DC' }}>{txStates.txB}</strong></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Database Locks Registry</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          <div>Row 1 Lock: <span>{lockStates.row1.type || 'None'} {lockStates.row1.lockedBy.length > 0 ? `(${lockStates.row1.lockedBy.join(', ')})` : ''}</span></div>
          <div>Row 2 Lock: <span>{lockStates.row2.type || 'None'} {lockStates.row2.lockedBy.length > 0 ? `(${lockStates.row2.lockedBy.join(', ')})` : ''}</span></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>Concurrency control mechanisms protect database records from race conditions and state inconsistencies during concurrent executions:</p>
      <ul>
        <li><strong>Shared Lock (S - Read Lock):</strong> Multiple transactions can hold Shared locks on the same record concurrently. No writes are allowed while reads are active.</li>
        <li><strong>Exclusive Lock (X - Write Lock):</strong> Only one transaction can hold an Exclusive lock. It blocks all other read or write operations.</li>
        <li><strong>Deadlock:</strong> A cyclic block condition where Transaction 1 holds Resource A and waits for Resource B, while Transaction 2 holds Resource B and waits for Resource A.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of locks as **booking a shared office meeting room**:</p>
      <ul>
        <li><strong>Shared Lock:</strong> Multiple coworkers enter the room to read a projected slideshow. It is compatible.</li>
        <li><strong>Exclusive Lock:</strong> One coworker locks the door to rewrite the whiteboard presentations. Everyone else must wait outside.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Long-running Transactions:</strong> Keeping transactions open while performing slow network operations, which locks database rows and starves other client threads.</li>
      <li><strong>Locking in Inconsistent Order:</strong> If query scripts lock tables in different order pathways (Tx A locks T1 then T2; Tx B locks T2 then T1), deadlocks will occur frequently.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is a Shared Lock vs Exclusive Lock?',
      a: 'A Shared Lock (S) allows transactions to read a resource and is compatible with other shared locks. An Exclusive Lock (X) is acquired for write modifications and blocks all other locks of any type on that resource.'
    },
    {
      q: 'How do databases detect and resolve Deadlocks?',
      a: 'Databases maintain a directed "Wait-For Graph" where nodes are transactions and edges represent resource waits. If a cycle is detected, the engine aborts a "victim" transaction, rolls back its modifications, releases its locks, and allows the remaining transactions to complete.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which lock combinations are compatible on a single row?',
      options: [
        'Shared Lock and Shared Lock',
        'Shared Lock and Exclusive Lock',
        'Exclusive Lock and Exclusive Lock',
        'None are compatible'
      ],
      correctIdx: 0,
      explanation: 'Multiple shared locks are compatible, allowing concurrent read operations. Exclusive locks block all other access.'
    },
    {
      question: 'What happens to a deadlock cycle when the database engine identifies a victim transaction?',
      options: [
        'It increases its priority',
        'It aborts and rolls back the victim transaction, releasing its locks',
        'It locks all database tables',
        'It restarts the database server'
      ],
      correctIdx: 1,
      explanation: 'The database aborts one of the blocking transactions to break the deadlock cycle and release its locks.'
    }
  ];

  return (
    <VisualizerShell
      title="Concurrency & Locking"
      subtitle="Examine lock compatibility. Observe how Exclusive locks block readers, and how deadlock detectors break circular locks."
      timeComplexity="O(V + E) Wait-For Cycle check"
      spaceComplexity="O(L) locks overhead"
      theoryContent={theory}
      analogyContent={analogy}
      mistakesContent={mistakes}
      interviewQuestions={interviewQuestions}
      quizQuestions={quizQuestions}
      controls={controls}
      logs={[log]}
      stateInspector={stateInspector}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%', minHeight: '235px', padding: '1rem 0' }}>
        <svg width="450" height="200" style={{ overflow: 'visible' }}>
          {/* Thread A Box */}
          <g>
            <rect x="20" y="30" width="80" height="40" fill="#000000" stroke="#1591DC" strokeWidth="2" rx="3" />
            <text x="60" y="50" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Tx A Thread</text>
            <text x="60" y="62" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.38rem">State: {txStates.txA}</text>
          </g>

          {/* Thread B Box */}
          <g>
            <rect x="20" y="130" width="80" height="40" fill="#000000" stroke="#1591DC" strokeWidth="2" rx="3" />
            <text x="60" y="150" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Tx B Thread</text>
            <text x="60" y="162" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.38rem">State: {txStates.txB}</text>
          </g>

          {/* Lock Lines */}
          <line x1="100" y1="50" x2="230" y2="70" stroke={txStates.txA.startsWith('WAITING') ? '#FFFFFF' : '#1591DC'} strokeWidth="1.5" />
          <line x1="100" y1="150" x2="230" y2="130" stroke={txStates.txB.startsWith('WAITING') ? '#FFFFFF' : '#1591DC'} strokeWidth="1.5" />

          {/* Row 1 Record Box */}
          <g>
            <rect x="230" y="45" width="100" height="40" fill="#000000" stroke="#1591DC" strokeWidth="2.5" rx="3" />
            <text x="280" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Row 1 (Users)</text>
            <text x="280" y="76" textAnchor="middle" fill="#1591DC" fontSize="0.45rem">Lock: {lockStates.row1.type || 'Unlocked'}</text>
          </g>

          {/* Row 2 Record Box */}
          <g>
            <rect x="230" y="115" width="100" height="40" fill="#000000" stroke="#1591DC" strokeWidth="2.5" rx="3" />
            <text x="280" y="132" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Row 2 (Accounts)</text>
            <text x="280" y="146" textAnchor="middle" fill="#1591DC" fontSize="0.45rem">Lock: {lockStates.row2.type || 'Unlocked'}</text>
          </g>
        </svg>
      </div>
    </VisualizerShell>
  );
}
