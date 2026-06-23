import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function MaterializedViewsVisualizer() {
  const [sales, setSales] = useState([
    { id: 1, category: 'Electronics', amount: 120 },
    { id: 2, category: 'Apparel', amount: 45 },
    { id: 3, category: 'Electronics', amount: 80 }
  ]);

  const [refreshMode, setRefreshMode] = useState('ON_COMMIT'); // 'ON_COMMIT' or 'MANUAL'
  const [isStale, setIsStale] = useState(false);
  const [lastQuerySource, setLastQuerySource] = useState(null); // 'TABLE' or 'VIEW'
  const [pagesScanned, setPagesScanned] = useState(0);
  const [log, setLog] = useState('Materialized View initialized. Add records to trace sync events.');

  // Pre-calculated materialized storage
  const [mvStorage, setMvStorage] = useState([
    { category: 'Electronics', total: 200 },
    { category: 'Apparel', total: 45 }
  ]);

  const addSale = (category, amount) => {
    const newId = sales.length + 1;
    const newSale = { id: newId, category, amount };
    const updatedSales = [...sales, newSale];
    setSales(updatedSales);

    if (refreshMode === 'ON_COMMIT') {
      // Recompute and update MV immediately
      const newMv = recomputeMv(updatedSales);
      setMvStorage(newMv);
      setIsStale(false);
      setLog(`[Transaction Write] Added sale ID ${newId} ($${amount}). Immediate Refresh triggered: Materialized View updated instantly.`);
    } else {
      // Deferred refresh: Mark view stale, do not update MV
      setIsStale(true);
      setLog(`[Transaction Write] Added sale ID ${newId} ($${amount}). Deferred Refresh (Manual): Write committed to Base Table, but Materialized View is now STALE.`);
    }
  };

  const recomputeMv = (salesList) => {
    const acc = {};
    salesList.forEach(s => {
      acc[s.category] = (acc[s.category] || 0) + s.amount;
    });
    return Object.keys(acc).map(cat => ({ category: cat, total: acc[cat] }));
  };

  const triggerManualRefresh = () => {
    if (refreshMode !== 'MANUAL') return;
    const refreshedMv = recomputeMv(sales);
    setMvStorage(refreshedMv);
    setIsStale(false);
    setLog('[Manual Refresh] Materialized View scan triggered. Read WAL logs to update aggregate records to disk.');
  };

  const runQuery = (source) => {
    setLastQuerySource(source);
    if (source === 'TABLE') {
      // Query raw table: Scan all rows
      setPagesScanned(sales.length);
      setLog(`[SQL Query] SELECT category, SUM(amount) FROM Sales GROUP BY category. Scanned raw table: read all ${sales.length} rows.`);
    } else {
      // Query MV: Read MV pages directly (1 per category)
      setPagesScanned(mvStorage.length);
      setLog(isStale
        ? `[SQL Query] SELECT * FROM mv_sales_summary. Warning: read ${mvStorage.length} pre-calculated rows, but data is STALE!`
        : `[SQL Query] SELECT * FROM mv_sales_summary. Fast lookup: read ${mvStorage.length} pre-calculated rows directly in O(1) time!`
      );
    }
  };

  const handleReset = () => {
    setSales([
      { id: 1, category: 'Electronics', amount: 120 },
      { id: 2, category: 'Apparel', amount: 45 },
      { id: 3, category: 'Electronics', amount: 80 }
    ]);
    setMvStorage([
      { category: 'Electronics', total: 200 },
      { category: 'Apparel', total: 45 }
    ]);
    setIsStale(false);
    setLastQuerySource(null);
    setPagesScanned(0);
    setLog('Simulator reset.');
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <button className="btn-viz-action btn-add" onClick={() => addSale('Electronics', 100)}>
        Add Electronics ($100)
      </button>

      <button className="btn-viz-action btn-add" onClick={() => addSale('Apparel', 50)}>
        Add Apparel ($50)
      </button>

      <button className="btn-viz-action" onClick={triggerManualRefresh} disabled={refreshMode !== 'MANUAL' || !isStale}>
        Refresh View Manually
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Refresh Strategy:</span>
        <select
          value={refreshMode}
          onChange={(e) => {
            setRefreshMode(e.target.value);
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
          <option value="ON_COMMIT">On Write (Immediate)</option>
          <option value="MANUAL">Deferred (Manual Refresh)</option>
        </select>
      </div>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Compare Query Execution</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-viz-action" onClick={() => runQuery('TABLE')} style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}>
            Query Raw Table
          </button>
          <button className="btn-viz-action" onClick={() => runQuery('VIEW')} style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}>
            Query Mat. View
          </button>
        </div>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          marginTop: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          <div>Last Query Target: <strong style={{ color: '#1591DC' }}>{lastQuerySource === 'TABLE' ? 'Base Table (Aggregation)' : lastQuerySource === 'VIEW' ? 'mv_sales_summary' : 'None'}</strong></div>
          <div>Records/Pages Scanned: <strong style={{ color: '#1591DC' }}>{pagesScanned}</strong></div>
          <div>View Consistency Status: <strong style={{ color: '#1591DC' }}>{isStale ? 'STALE / DIRTY' : 'CONSISTENT'}</strong></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Storage Configurations</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          <div>Base Table rows: <strong>{sales.length}</strong></div>
          <div>Pre-computed MV rows: <strong>{mvStorage.length}</strong></div>
          <div>Write Penalty: <strong>{refreshMode === 'ON_COMMIT' ? 'High (Update index/MV)' : 'Zero (Table append only)'}</strong></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>Materialized View</strong> is a database object that stores the results of a query on disk (unlike a standard virtual view, which runs its query on every access):</p>
      <ul>
        <li><strong>Query Cache:</strong> By pre-computing complex aggregates (joins, sum groups), reads drop from O(N) scans to O(1) table seeks.</li>
        <li><strong>On Write (Immediate):</strong> Updates the view dynamically during write transactions. This slows down write operations but guarantees absolute data consistency.</li>
        <li><strong>Deferred (Manual):</strong> Keeps the view separate from write transaction commits. The view becomes stale until a manual `REFRESH MATERIALIZED VIEW` command is executed.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Materialized Views as **checking a store\'s ledger balance**:</p>
      <ul>
        <li><strong>Standard View (Query Raw):</strong> The accountant reads every single receipt in the drawer from scratch to compute the current total profit.</li>
        <li><strong>Materialized View:</strong> The accountant writes the daily total in a summary box on the wall. When someone asks for the balance, they read the wall instantly instead of counting receipts.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Querying Stale Views:</strong> Relying on deferred materialized views for real-time financial balances where stale records could lead to overdrafts.</li>
      <li><strong>Over-indexing Views:</strong> Adding too many materialized views to tables with high-frequency insert spikes, causing write pipeline deadlocks.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is the difference between a standard View and a Materialized View?',
      a: 'A standard View is a virtual saved query; it executes its underlying SQL from scratch on every reference. A Materialized View computes the query results once and physically persists them to disk, drastically speeding up queries at the cost of disk space and data staleness.'
    },
    {
      q: 'How do you keep a Materialized View up to date?',
      a: 'Through immediate refreshing (syncing during transactions), incremental syncing (updating only modified rows via CDC), or deferred refreshing (executing standard scheduled triggers or cron REFRESH queries).'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which refresh strategy makes database writes slower but keeps the Materialized View perfectly consistent?',
      options: [
        'Deferred manual refresh',
        'Immediate refresh on commit / write',
        'Asynchronous cron schedule re-seeding',
        'Lazy index scans'
      ],
      correctIdx: 1,
      explanation: 'Immediate refresh updates the materialized disk table in the same transaction block as the write, adding a CPU/IO penalty to the write operation.'
    },
    {
      question: 'Under what condition should you prefer a Materialized View over running a raw query?',
      options: [
        'When write transactions occur 1000s of times a second and require real-time accuracy',
        'When data updates are relatively infrequent and reading aggregates is a bottleneck',
        'When you want to save storage space',
        'When you are deleting the primary key constraints'
      ],
      correctIdx: 1,
      explanation: 'PERSISTED aggregates are ideal for read-heavy workloads where minor data staleness is tolerable.'
    }
  ];

  return (
    <VisualizerShell
      title="Materialized Views"
      subtitle="Examine pre-computed queries, immediate write-syncing, deferred stale states, and table scan savings."
      timeComplexity="Raw Aggregate Scan: O(N); MV Seek: O(1)"
      spaceComplexity="O(MV) disk persistent storage"
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
        <div style={{ display: 'flex', gap: '1.5rem', width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
          
          {/* Base Sales Table */}
          <div style={{ flex: 1, minWidth: '190px', maxWidth: '210px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem', textAlign: 'center' }}>
              Base Sales Table (RDBMS)
            </span>
            <div style={{
              border: '1px solid var(--bg-tertiary)',
              borderRadius: '4px',
              backgroundColor: '#000000',
              padding: '0.4rem',
              height: '160px',
              overflowY: 'auto'
            }}>
              {sales.map(s => (
                <div key={s.id} style={{
                  fontSize: '0.65rem',
                  padding: '0.25rem',
                  borderBottom: '1px solid var(--bg-tertiary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#FFFFFF'
                }}>
                  <span>ID: {s.id} | {s.category}</span>
                  <span style={{ color: '#1591DC' }}>${s.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sync Engine and status */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyItems: 'center', justifyContent: 'center', alignItems: 'center', width: '40px' }}>
            <i className="fa-solid fa-arrow-right" style={{ color: isStale ? 'var(--text-tertiary)' : '#1591DC', fontSize: '1.2rem', marginBottom: '0.25rem' }}></i>
            <span style={{
              fontSize: '0.55rem',
              fontWeight: 'bold',
              padding: '0.15rem 0.3rem',
              borderRadius: '3px',
              border: isStale ? '1px solid #FFFFFF' : '1px solid #1591DC',
              color: isStale ? '#FFFFFF' : '#1591DC',
              textAlign: 'center',
              textTransform: 'uppercase'
            }}>
              {isStale ? 'Stale' : 'Synced'}
            </span>
          </div>

          {/* Materialized View Summary Table */}
          <div style={{ flex: 1, minWidth: '190px', maxWidth: '210px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#1591DC', display: 'block', marginBottom: '0.25rem', textAlign: 'center' }}>
              mv_sales_summary (Disk View)
            </span>
            <div style={{
              border: isStale ? '1px dashed #FFFFFF' : '1.5px solid #1591DC',
              borderRadius: '4px',
              backgroundColor: '#000000',
              padding: '0.4rem',
              height: '160px',
              overflowY: 'auto',
              transition: 'all 0.3s'
            }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: '0.2rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Category</span>
                <span>Sum_Amount (Cached)</span>
              </div>
              {mvStorage.map((mv, idx) => (
                <div key={idx} style={{
                  fontSize: '0.68rem',
                  padding: '0.3rem 0',
                  borderBottom: '1px solid var(--bg-tertiary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: isStale ? 'rgba(255,255,255,0.7)' : '#FFFFFF',
                  fontWeight: 'bold'
                }}>
                  <span>{mv.category}</span>
                  <span style={{ color: isStale ? '#FFFFFF' : '#1591DC' }}>${mv.total}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </VisualizerShell>
  );
}
