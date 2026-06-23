import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function PostgresInternalsVisualizer() {
  const [tuples, setTuples] = useState([
    { id: 101, val: 'Alice', xmin: 50, xmax: 0, status: 'ACTIVE' }
  ]);

  const [bufferFrames, setBufferFrames] = useState([
    { frameId: 1, pageId: 'Page_101', status: 'CLEAN' },
    { frameId: 2, pageId: 'Free', status: 'EMPTY' }
  ]);

  const [activeTxId, setActiveTxId] = useState(55);
  const [log, setLog] = useState('PostgreSQL Engine initialized. Shared Buffer Pool and MVCC page slots active.');

  const runInsert = () => {
    const nextTx = activeTxId + 1;
    setActiveTxId(nextTx);

    const nextId = 101 + tuples.length;
    const newVal = nextId === 102 ? 'Bob' : nextId === 103 ? 'Charlie' : 'David';
    
    // 1. Add tuple with xmin = nextTx, xmax = 0
    setTuples(prev => [...prev, { id: nextId, val: newVal, xmin: nextTx, xmax: 0, status: 'ACTIVE' }]);

    // 2. Mark buffer frame dirty
    setBufferFrames(prev => prev.map(f => f.frameId === 1 ? { ...f, status: 'DIRTY' } : f));
    setLog(`[Transaction ${nextTx}] INSERT completed. Created row tuple in memory page buffer. Set xmin header to ${nextTx}. Buffer marked DIRTY.`);
  };

  const runUpdate = () => {
    const activeIdx = tuples.findIndex(t => t.status === 'ACTIVE');
    if (activeIdx === -1) {
      setLog('No active tuples available to update. Run INSERT or VACUUM first.');
      return;
    }

    const nextTx = activeTxId + 1;
    setActiveTxId(nextTx);

    const targetTuple = tuples[activeIdx];
    
    setTuples(prev => {
      const copy = [...prev];
      // 1. Mark existing tuple as deleted by setting its xmax = nextTx
      copy[activeIdx] = { ...targetTuple, xmax: nextTx, status: 'DEAD' };
      // 2. Append new tuple version with xmin = nextTx, xmax = 0
      copy.push({ id: targetTuple.id, val: `${targetTuple.val} (v2)`, xmin: nextTx, xmax: 0, status: 'ACTIVE' });
      return copy;
    });

    // 3. Mark buffer frame dirty
    setBufferFrames(prev => prev.map(f => f.frameId === 1 ? { ...f, status: 'DIRTY' } : f));
    setLog(`[Transaction ${nextTx}] UPDATE completed. Deprecated old row version by setting xmax = ${nextTx}. Wrote new tuple version on disk block. Buffer marked DIRTY.`);
  };

  const flushBuffers = () => {
    setBufferFrames(prev => prev.map(f => f.status === 'DIRTY' ? { ...f, status: 'CLEAN' } : f));
    setLog('[Background Writer] Flushed dirty shared buffer memory page cache blocks sequentially to disk storage blocks.');
  };

  const runVacuum = () => {
    // Vacuum sweeps pages, deleting dead tuples completely
    const healthyTuples = tuples.filter(t => t.status === 'ACTIVE');
    const deadCount = tuples.length - healthyTuples.length;

    if (deadCount === 0) {
      setLog('VACUUM: Swept page blocks. Zero dead tuples found. Free Space Map updated.');
      return;
    }

    setTuples(healthyTuples);
    setLog(`[VACUUM Cleanup] Garbage sweeper executed! Scanned pages, removed ${deadCount} dead/deprecated tuple records, and freed disk space blocks.`);
  };

  const handleReset = () => {
    setTuples([{ id: 101, val: 'Alice', xmin: 50, xmax: 0, status: 'ACTIVE' }]);
    setBufferFrames([
      { frameId: 1, pageId: 'Page_101', status: 'CLEAN' },
      { frameId: 2, pageId: 'Free', status: 'EMPTY' }
    ]);
    setActiveTxId(55);
    setLog('PostgreSQL internal state reset.');
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <button className="btn-viz-action btn-add" onClick={runInsert}>
        INSERT Record
      </button>

      <button className="btn-viz-action btn-add" onClick={runUpdate}>
        UPDATE Active Record
      </button>

      <button className="btn-viz-action" onClick={flushBuffers}>
        Flush Buffers
      </button>

      <button className="btn-viz-action" onClick={runVacuum}>
        Run VACUUM
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>PostgreSQL Shared Buffer Cache Pool</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          {bufferFrames.map(f => (
            <div key={f.frameId} style={{ display: 'flex', justifyContent: 'space-between', color: f.status === 'DIRTY' ? '#1591DC' : '#FFFFFF' }}>
              <span>Frame {f.frameId}: {f.pageId}</span>
              <span>{f.status}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Visibility Details</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          <div>Oldest Active TxId: <strong style={{ color: '#1591DC' }}>{activeTxId}</strong></div>
          <div>Total Table Rows: <strong style={{ color: '#1591DC' }}>{tuples.length}</strong></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>PostgreSQL Internals</strong> rely on specialized memory buffer caches and MVCC models to guarantee concurrent transaction safety:</p>
      <ul>
        <li><strong>Shared Buffer Pool:</strong> An in-memory cache mapping active disk pages. Reads load pages into buffers. Writes modify buffers, flagging them as **DIRTY** until a background writer flushes them to disk.</li>
        <li><strong>MVCC (Multi-Version Concurrency Control):</strong> Relational row updates do not overwrite data in-place. PostgreSQL writes a brand new version of the row. Each tuple contains headers:
          <ul>
            <li>`xmin`: The Transaction ID that inserted/created the row version.</li>
            <li>`xmax`: The Transaction ID that deleted or updated the row version (0 if active).</li>
          </ul>
        </li>
        <li><strong>VACUUM:</strong> Because old row versions are left behind as dead space (bloat) when updated, a background `VACUUM` worker sweeps pages to remove dead tuples and reclaim space.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of PostgreSQL MVCC and Vacuuming as **drafting revisions in a notebook**:</p>
      <ul>
        <li>Instead of erasing a line to edit it, you cross it out with a pen (setting `xmax` ID) and write the corrected version on a new line below (new tuple with `xmin` ID). The crossed-out lines take up space. Periodically, you run a cleanup sweep (VACUUM) to erase all crossed-out lines and clean the pages.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Disabling Autovacuum:</strong> Turning off background vacuum processes to save CPU. This leads to massive table bloat, consuming disk space and slowing down table scans.</li>
      <li><strong>Long-running Transactions:</strong> Keeping a transaction open for hours. This prevents Autovacuum from cleaning dead tuples because their `xmax` transactions are still younger than the oldest active query transaction.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'How does PostgreSQL implement MVCC row visibility?',
      a: 'Postgres appends `xmin` (creator transaction ID) and `xmax` (destroyer transaction ID) fields to every row header. When a query runs, it compares its own transaction ID against these headers to determine if a row version was committed and is visible to its snapshot.'
    },
    {
      q: 'What is database bloat, and how does VACUUM resolve it?',
      a: 'Bloat is the unused disk space occupied by deleted or updated row versions (dead tuples) that are no longer visible to any active transaction. The `VACUUM` command scans table pages, marks the space of dead tuples as reusable in the Free Space Map, and prevents table size inflation.'
    }
  ];

  const quizQuestions = [
    {
      question: 'In PostgreSQL MVCC tuple headers, what does a non-zero "xmax" value indicate?',
      options: [
        'The row is currently locked for query indexing scans',
        'The transaction ID that deleted or updated this row version',
        'The primary key constraint offset',
        'The buffer pool dirty frame index'
      ],
      correctIdx: 1,
      explanation: 'A non-zero xmax indicates that a transaction has deleted or updated this row version. If that transaction commits, the version becomes dead.'
    },
    {
      question: 'What is the danger of disabling the Postgres Autovacuum background worker?',
      options: [
        'Relational join operations stop working entirely',
        'Dead tuples remain on disk, causing table bloat and slowing down query scans',
        'Unique primary key constraints are bypassed',
        'Write-Ahead Log files are deleted'
      ],
      correctIdx: 1,
      explanation: 'Without VACUUM sweeps, old crossed-out row versions remain on disk pages, causing database size inflation and slowing down scans.'
    }
  ];

  return (
    <VisualizerShell
      title="PostgreSQL Internals"
      subtitle="Interact with shared buffer pages, MVCC xmin/xmax version headers, and table VACUUM sweeps."
      timeComplexity="Vacuum Sweep: O(Pages); Buffer Seek: O(1)"
      spaceComplexity="O(N) tuple storage overhead"
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem', width: '100%' }} className="visualizer-grid-layout">
          
          {/* Shared Buffer Pool representation */}
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: '#1591DC', display: 'block', marginBottom: '0.35rem', textAlign: 'center' }}>
              Shared Buffer Cache Pool
            </span>
            <div style={{
              border: '2px solid #1591DC',
              borderRadius: '6px',
              backgroundColor: '#000000',
              padding: '0.5rem',
              height: '160px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              {bufferFrames.map(f => {
                const isDirty = f.status === 'DIRTY';
                return (
                  <div key={f.frameId} style={{
                    border: isDirty ? '2px solid #1591DC' : '1px solid var(--bg-tertiary)',
                    borderRadius: '4px',
                    padding: '0.35rem',
                    backgroundColor: isDirty ? 'rgba(21, 145, 220, 0.1)' : 'none',
                    fontSize: '0.62rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: '#FFFFFF'
                  }}>
                    <span>Frame {f.frameId}: {f.pageId}</span>
                    <span style={{
                      fontSize: '0.5rem',
                      fontWeight: 'bold',
                      color: isDirty ? '#1591DC' : 'var(--text-tertiary)',
                      textTransform: 'uppercase'
                    }}>
                      {f.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Physical Heap Page Slots */}
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem', textAlign: 'center' }}>
              Physical Disk Heap Page (Tuple Blocks)
            </span>
            <div style={{
              border: '1.5px solid var(--bg-tertiary)',
              borderRadius: '6px',
              backgroundColor: '#000000',
              padding: '0.4rem',
              height: '160px',
              overflowY: 'auto'
            }}>
              {tuples.map((t, idx) => {
                const isDead = t.status === 'DEAD';
                let borderStyle = '1px solid var(--bg-tertiary)';
                let opacity = 1.0;
                
                if (isDead) {
                  borderStyle = '1px dashed rgba(255,255,255,0.2)';
                  opacity = 0.5;
                }

                return (
                  <div key={idx} style={{
                    fontSize: '0.6rem',
                    padding: '0.25rem',
                    border: borderStyle,
                    borderRadius: '4px',
                    marginBottom: '0.3rem',
                    backgroundColor: isDead ? 'none' : 'rgba(255,255,255,0.02)',
                    color: '#FFFFFF',
                    opacity: opacity,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <strong>ID: {t.id} | Value: "{t.val}"</strong>
                      <div style={{ fontSize: '0.5rem', opacity: 0.8 }}>
                        xmin: {t.xmin} | xmax: {t.xmax}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.5rem',
                      fontWeight: 'bold',
                      color: isDead ? '#FFFFFF' : '#1591DC'
                    }}>
                      {t.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </VisualizerShell>
  );
}
