import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function AcidTransactionsVisualizer() {
  const [balanceA, setBalanceA] = useState(5000);
  const [balanceB, setBalanceB] = useState(2000);
  const [transitVal, setTransitVal] = useState(null);
  const [log, setLog] = useState('ACID Transaction Simulator ready. Select a transaction type.');
  const [animationStep, setAnimationStep] = useState(null); // 'DEBITING', 'IN_TRANSIT', 'CRASHING', 'ROLLBACK', 'COMMITTED', null
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStartTransaction = (type) => {
    setIsPlaying(true);
    setAnimationStep('DEBITING');
    setLog('Transaction started: Attempting to transfer ₹1000 from Account A to Account B.');
    
    // Step 1: Debit Account A
    setTimeout(() => {
      setBalanceA(prev => prev - 1000);
      setTransitVal(1000);
      setAnimationStep('IN_TRANSIT');
      setLog('Atomicity Step 1: ₹1000 debited from Account A and stored in memory buffer block. Account B is not yet credited.');

      // Step 2: Commit or Fail
      setTimeout(() => {
        if (type === 'SUCCESS') {
          setBalanceB(prev => prev + 1000);
          setTransitVal(null);
          setAnimationStep('COMMITTED');
          setLog('Commit Successful! ₹1000 credited to Account B. Atomicity & Durability satisfied: both balances updated and flushed to disk.');
          setIsPlaying(false);
        } else {
          setAnimationStep('CRASHING');
          setLog('ERROR: System connection lost during transfer! Simulating transaction abort...');
          
          // Step 3: Rollback
          setTimeout(() => {
            setBalanceA(5000); // Rollback
            setTransitVal(null);
            setAnimationStep('ROLLBACK');
            setLog('Transaction Aborted: Rollback executed. Account A balance restored to ₹5000. Consistency maintained: no partial updates committed.');
            setIsPlaying(false);
          }, 1500);
        }
      }, 1500);

    }, 1200);
  };

  const handleReset = () => {
    setBalanceA(5000);
    setBalanceB(2000);
    setTransitVal(null);
    setAnimationStep(null);
    setIsPlaying(false);
    setLog('Simulator reset to initial state.');
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <button
        className="btn-viz-action btn-add"
        onClick={() => handleStartTransaction('SUCCESS')}
        disabled={isPlaying}
      >
        Transfer ₹1000 (Commit Success)
      </button>

      <button
        className="btn-viz-action btn-clear"
        onClick={() => handleStartTransaction('FAIL')}
        disabled={isPlaying}
      >
        Transfer ₹1000 (Simulate Crash/Rollback)
      </button>

      <button className="btn-viz-action" onClick={handleReset} disabled={isPlaying}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Active Balances</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Account A: <strong style={{ color: '#1591DC' }}>₹{balanceA}</strong></div>
          <div>Account B: <strong style={{ color: '#1591DC' }}>₹{balanceB}</strong></div>
          <div style={{ borderTop: '1px solid var(--bg-tertiary)', marginTop: '0.25rem', paddingTop: '0.25rem' }}>
            Total Sum: <strong>₹{balanceA + balanceB + (transitVal || 0)}</strong>
          </div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>ACID Compliance check</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.7rem'
        }}>
          <div>Atomicity: <strong style={{ color: '#1591DC' }}>
            {animationStep === 'ROLLBACK' ? 'Aborted (0/2 Done)' : animationStep === 'COMMITTED' ? 'Committed (2/2 Done)' : 'Processing'}
          </strong></div>
          <div>Consistency: <strong style={{ color: '#1591DC' }}>
            {balanceA + balanceB + (transitVal || 0) === 7000 ? 'Verified (Sum = ₹7000)' : 'Violated!'}
          </strong></div>
          <div>Isolation: <span>Reads blocked until Commit</span></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>A database transaction is a sequence of one or more SQL operations treated as a single logical unit of work. <strong>ACID</strong> guarantees reliability:</p>
      <ul>
        <li><strong>Atomicity:</strong> "All or nothing." If a transaction fails mid-way, all changes are rolled back, leaving the database unchanged.</li>
        <li><strong>Consistency:</strong> Transactions transition the database from one valid state to another, maintaining all integrity rules and constraints.</li>
        <li><strong>Isolation:</strong> Concurrent transactions run independently without reading intermediate, uncommitted states of other transactions.</li>
        <li><strong>Durability:</strong> Once a transaction commits, its updates are permanently written to non-volatile disk storage, persisting through system crashes.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of ACID transactions as **sending a package through registered post**:</p>
      <ul>
        <li><strong>Atomicity:</strong> The package is either delivered safely to the recipient, or returned directly to your house. It cannot float in permanent postal limbo.</li>
        <li><strong>Consistency:</strong> The total number of items you sent must equal the number of items received or returned.</li>
        <li><strong>Isolation:</strong> Other people sorting mail do not peek inside or edit your package contents mid-transit.</li>
        <li><strong>Durability:</strong> Once marked "Delivered" in the ledger, the catalog history remains forever.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Dirty Reads:</strong> Reading uncommitted transaction data. If the transaction aborts and rolls back, the data you read becomes invalid ("dirty").</li>
      <li><strong>Missing Rollback Blocks:</strong> Forgetting to handle SQL exceptions in application code, which leaves database connections partially modified without a rollback commit check.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Explain the difference between COMMIT and ROLLBACK.',
      a: 'COMMIT saves all changes made during the current transaction permanently to disk, making them visible to other connections. ROLLBACK discards all modifications made during the transaction, restoring the database to its pre-transaction state.'
    },
    {
      q: 'What is a Dirty Read?',
      a: 'A dirty read occurs when Transaction A reads modifications made by Transaction B that have not yet been committed. If Transaction B subsequently aborts and executes a rollback, the data read by Transaction A is stale and incorrect.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which ACID property guarantees that a transaction is executed completely or not at all?',
      options: [
        'Atomicity',
        'Consistency',
        'Isolation',
        'Durability'
      ],
      correctIdx: 0,
      explanation: 'Atomicity ensures that all database operations in a transaction succeed or the entire transaction is rolled back.'
    },
    {
      question: 'Where are committed transaction writes stored to satisfy the Durability property?',
      options: [
        'CPU registers',
        'Main RAM memory buffer',
        'Non-volatile disk storage (SSD/HDD)',
        'Network cache'
      ],
      correctIdx: 2,
      explanation: 'Durability requires updates to be saved in non-volatile, persistent disk storage to survive hardware power failures.'
    }
  ];

  return (
    <VisualizerShell
      title="ACID Transactions Simulator"
      subtitle="Transfer funds, simulate connection crashes, and examine rollback actions enforcing consistency."
      timeComplexity="O(1) memory update"
      spaceComplexity="O(L) WAL write-ahead log size"
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
          
          {/* Account A */}
          <g>
            <circle cx="80" cy="100" r="30" fill="#000000" stroke="#1591DC" strokeWidth="2.5" />
            <text x="80" y="96" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Account A</text>
            <text x="80" y="112" textAnchor="middle" fill="#1591DC" fontSize="0.5rem">₹{balanceA}</text>
          </g>

          {/* Transfer Channel line */}
          <line
            x1="110"
            y1="100"
            x2="340"
            y2="100"
            stroke="var(--bg-tertiary)"
            strokeWidth="3"
            strokeDasharray={animationStep === 'SCANNING' || animationStep === 'IN_TRANSIT' ? 'none' : '4,4'}
          />

          {/* intermediate/transit package */}
          {transitVal !== null && (
            <g style={{ transition: 'all 0.35s ease' }}>
              <rect x="185" y="85" width="80" height="30" fill="#000000" stroke="#1591DC" strokeWidth="2" rx="2" />
              <text x="225" y="103" textAnchor="middle" fill="#1591DC" fontSize="0.45rem" fontWeight="bold">
                {animationStep === 'CRASHING' ? 'CRASHED!' : 'Transit: ₹1000'}
              </text>
            </g>
          )}

          {/* Account B */}
          <g>
            <circle cx="370" cy="100" r="30" fill="#000000" stroke="#1591DC" strokeWidth="2.5" />
            <text x="370" y="96" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Account B</text>
            <text x="370" y="112" textAnchor="middle" fill="#1591DC" fontSize="0.5rem">₹{balanceB}</text>
          </g>

          {/* Commit Disk Indicator */}
          <g>
            <rect x="200" y="10" width="50" height="30" fill="#000000" stroke={animationStep === 'COMMITTED' ? '#FFFFFF' : 'var(--bg-tertiary)'} strokeWidth="1.5" rx="2" />
            <text x="225" y="27" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">WAL Disk</text>
            {animationStep === 'COMMITTED' && (
              <line x1="225" y1="10" x2="225" y2="40" stroke="#1591DC" strokeWidth="2" />
            )}
          </g>

          {/* Status overlay banner */}
          {animationStep === 'COMMITTED' && (
            <g>
              <rect x="135" y="150" width="180" height="30" fill="#000000" stroke="#FFFFFF" strokeWidth="1.5" rx="3" />
              <text x="225" y="169" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">✓ Transaction Committed</text>
            </g>
          )}
          {animationStep === 'ROLLBACK' && (
            <g>
              <rect x="135" y="150" width="180" height="30" fill="#000000" stroke="#1591DC" strokeWidth="1.5" rx="3" />
              <text x="225" y="169" textAnchor="middle" fill="#1591DC" fontSize="0.5rem" fontWeight="bold">✕ Rolled Back &amp; Restored</text>
            </g>
          )}
        </svg>
      </div>
    </VisualizerShell>
  );
}
