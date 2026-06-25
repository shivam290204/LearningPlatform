import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function EventSourcingVisualizer() {
  const [events, setEvents] = useState([
    { id: 1, type: 'OPEN_ACCOUNT', amount: 100, text: 'Account opened with $100 deposit.' },
    { id: 2, type: 'DEPOSIT', amount: 50, text: 'Deposited $50 cash.' },
    { id: 3, type: 'WITHDRAW', amount: 30, text: 'Withdrew $30 cash.' }
  ]);

  const [activePlaybackIndex, setActivePlaybackIndex] = useState(2); // index of events replayed
  const [currentBalance, setCurrentBalance] = useState(120);
  const [isReplaying, setIsReplaying] = useState(false);
  const [snapshot, setSnapshot] = useState(null); // { index, balance }
  const [log, setLog] = useState('Event Ledger initialized. Append transaction events or replay ledger.');

  const appendEvent = (type, amount) => {
    const nextId = events.length + 1;
    const text = type === 'DEPOSIT' 
      ? `Deposited $${amount} cash.` 
      : `Withdrew $${amount} cash.`;
    
    const newEvent = { id: nextId, type, amount, text };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    
    // Auto sync state for display
    setActivePlaybackIndex(updatedEvents.length - 1);
    setCurrentBalance(prev => type === 'DEPOSIT' ? prev + amount : prev - amount);
    setLog(`[Append Event] Appended "${type}" event of $${amount} to the immutable ledger. Current state synced.`);
  };

  const runReplay = () => {
    setIsReplaying(true);
    setLog('Starting replay: Reconstructing state from chronological event ledger stream...');
    
    let tempBalance = snapshot ? snapshot.balance : 0;
    let startIndex = snapshot ? snapshot.index + 1 : 0;
    
    setActivePlaybackIndex(startIndex - 1);
    setCurrentBalance(tempBalance);

    let idx = startIndex;
    const interval = setInterval(() => {
      if (idx < events.length) {
        const ev = events[idx];
        if (ev.type === 'OPEN_ACCOUNT' || ev.type === 'DEPOSIT') {
          tempBalance += ev.amount;
        } else {
          tempBalance -= ev.amount;
        }
        setActivePlaybackIndex(idx);
        setCurrentBalance(tempBalance);
        setLog(`Replaying Event ID ${ev.id}: ${ev.text} -> Balance updated to $${tempBalance}.`);
        idx++;
      } else {
        clearInterval(interval);
        setIsReplaying(false);
        setLog(`Replay complete. Reconstructed current state balance: $${tempBalance}.`);
      }
    }, 1000);
  };

  const takeSnapshot = () => {
    setSnapshot({
      index: events.length - 1,
      balance: currentBalance
    });
    setLog(`[Snapshot Captured] Saved checkpoint at Event ID ${events.length} with balance $${currentBalance}. Future replays will fast-forward to this index!`);
  };

  const handleReset = () => {
    setEvents([
      { id: 1, type: 'OPEN_ACCOUNT', amount: 100, text: 'Account opened with $100 deposit.' },
      { id: 2, type: 'DEPOSIT', amount: 50, text: 'Deposited $50 cash.' },
      { id: 3, type: 'WITHDRAW', amount: 30, text: 'Withdrew $30 cash.' }
    ]);
    setActivePlaybackIndex(2);
    setCurrentBalance(120);
    setSnapshot(null);
    setIsReplaying(false);
    setLog('Event Ledger reset to initial state.');
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <button className="btn-viz-action btn-add" onClick={() => appendEvent('DEPOSIT', 50)} disabled={isReplaying}>
        Append Deposit ($50)
      </button>

      <button className="btn-viz-action btn-add" onClick={() => appendEvent('WITHDRAW', 20)} disabled={isReplaying}>
        Append Withdraw ($20)
      </button>

      <button className="btn-viz-action" onClick={runReplay} disabled={isReplaying}>
        Replay Events
      </button>

      <button className="btn-viz-action" onClick={takeSnapshot} disabled={isReplaying}>
        Take Snapshot
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Projected Account State</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          <div>Current Balance: <strong style={{ color: '#1591DC', fontSize: '0.9rem' }}>${currentBalance}</strong></div>
          <div>Playback Index: <strong>Event ID {activePlaybackIndex + 1}</strong></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Snapshot Checkpoint</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          {snapshot ? (
            <div>
              <div>Checkpoint Index: <strong style={{ color: '#1591DC' }}>Event ID {snapshot.index + 1}</strong></div>
              <div>Checkpoint Balance: <strong style={{ color: '#1591DC' }}>${snapshot.balance}</strong></div>
            </div>
          ) : (
            <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No snapshot stored. Replays start from ID 1.</span>
          )}
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>Event Sourcing</strong> is an architecture pattern where state modifications are stored as an immutable, chronological sequence of events:</p>
      <ul>
        <li><strong>Immutable Ledger:</strong> Instead of updating values in place, every state-changing action is appended to the log. The database is write-only.</li>
        <li><strong>State Reconstruction:</strong> The current system state is derived dynamically by reading events from the beginning and replaying them in order.</li>
        <li><strong>Snapshots:</strong> Replaying thousands of historical records is slow. We optimize by taking periodic snapshots (checkpoints) of the state, then replaying only subsequent events.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Event Sourcing as **your bank statement vs. your bank balance**:</p>
      <ul>
        <li><strong>Standard Database:</strong> Renders only the balance number (e.g. `$120`). You do not know how you got that amount.</li>
        <li><strong>Event Sourcing:</strong> Renders the entire transaction statement list. Replaying the statement from `$0` calculates your final balance. You also get an absolute historical audit trail.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Modifying Event History:</strong> Trying to delete or edit past event rows. Events are immutable historical facts. To correct mistakes, you must append a new compensating event (e.g., a refund).</li>
      <li><strong>Failing to capture Snapshots:</strong> Forcing the database to replay millions of clicks or events on every load, leading to extreme startup latency.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Why are events in Event Sourcing immutable?',
      a: 'Events represent historical facts that occurred in the past. Modifying past events corrupts the system\'s audit trail and breaks state reconstruction. Corrections require appending new reversing events instead of editing existing ones.'
    },
    {
      q: 'How does Event Sourcing pair with the CQRS pattern?',
      a: 'Event Sourcing is write-only and is highly inefficient for complex query lookups. In a CQRS design, the Write database appends events. These events are consumed asynchronously to build read-optimized views in a separate Read database.'
    }
  ];

  const quizQuestions = [
    {
      question: 'How does an Event Sourcing database resolve errors in past records?',
      options: [
        'By modifying the record in place using UPDATE',
        'By appending a new compensating transaction event (e.g., reverse/refund)',
        'By deleting the corresponding log file',
        'By restarting the consensus term'
      ],
      correctIdx: 1,
      explanation: 'Past events are immutable. Errors are corrected by appending new offsetting events (like a debit to offset a credit).'
    },
    {
      question: 'What is the purpose of taking snapshots in Event Sourcing?',
      options: [
        'To lock the database from future writes',
        'To prevent having to replay millions of historical events from the beginning of time',
        'To clean up and delete older events from the ledger log',
        'To test query parser AST validation rules'
      ],
      correctIdx: 1,
      explanation: 'Snapshots store the state at a checkpoint. Replays can start from the snapshot balance and index, bypassing thousands of older event loops.'
    }
  ];

  return (
    <VisualizerShell
      title="Event Sourcing"
      subtitle="Reconstruct database state by replaying append-only logs. Capture state snapshot checkpoints."
      timeComplexity="State Replay: O(E) events; Optimized: O(E - Snapshot)"
      spaceComplexity="O(E) append-only events list size"
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
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', width: '100%' }} className="visualizer-grid-layout">
          
          {/* Append-only Event Ledger */}
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Immutable Append-Only Event Ledger
            </span>
            <div style={{
              border: '1.5px solid var(--bg-tertiary)',
              borderRadius: '6px',
              backgroundColor: '#000000',
              padding: '0.5rem',
              height: '160px',
              overflowY: 'auto'
            }}>
              {events.map((ev, idx) => {
                const isActive = idx <= activePlaybackIndex;
                const isCurrent = idx === activePlaybackIndex;
                const isSnapshotted = snapshot && idx <= snapshot.index;

                let borderStyle = '1px solid var(--bg-tertiary)';
                let color = 'rgba(255, 255, 255, 0.4)';
                if (isActive) {
                  borderStyle = '1px solid rgba(255, 255, 255, 0.6)';
                  color = '#FFFFFF';
                }
                if (isCurrent) {
                  borderStyle = '1.5px solid #1591DC';
                }
                if (isSnapshotted) {
                  borderStyle = '1.5px dashed #1591DC';
                }

                return (
                  <div key={ev.id} style={{
                    fontSize: '0.62rem',
                    padding: '0.3rem',
                    border: borderStyle,
                    borderRadius: '4px',
                    marginBottom: '0.35rem',
                    backgroundColor: isCurrent ? 'rgba(21, 145, 220, 0.1)' : 'none',
                    color: color,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <strong>ID {ev.id}: {ev.type}</strong>
                      <div style={{ fontSize: '0.55rem', opacity: 0.8 }}>{ev.text}</div>
                    </div>
                    <span style={{ color: '#1591DC', fontWeight: 'bold' }}>
                      {ev.type === 'WITHDRAW' ? `-$${ev.amount}` : `+$${ev.amount}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current State Display */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
              border: '2px solid #1591DC',
              borderRadius: '50%',
              width: '120px',
              height: '120px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#000000',
              boxShadow: '0 0 10px rgba(21, 145, 220, 0.2)'
            }}>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>State Balance</span>
              <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#FFFFFF' }}>${currentBalance}</span>
            </div>
            {snapshot && (
              <div style={{ fontSize: '0.55rem', color: '#1591DC', marginTop: '0.5rem', fontWeight: 'bold' }}>
                Snapshot saved at Event ID {snapshot.index + 1}
              </div>
            )}
          </div>

        </div>
      </div>
    </VisualizerShell>
  );
}
