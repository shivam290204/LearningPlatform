import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function CdcPatternVisualizer() {
  const [dbTable, setDbTable] = useState([
    { id: 101, name: 'Alice', age: 24 }
  ]);
  const [walLog, setWalLog] = useState([
    { offset: 1001, op: 'INSERT', data: 'ID: 101, name: "Alice"' }
  ]);
  const [cdcEngineActive, setCdcEngineActive] = useState('IDLE'); // 'IDLE', 'TAILING_WAL', 'QUEUE_BROKER', 'SYNCED'
  const [searchIndex, setSearchIndex] = useState([
    { key: 'Alice', docId: 101 }
  ]);
  const [log, setLog] = useState('CDC Pipeline active. Operations write to RDBMS & append to WAL log.');

  const runInsert = () => {
    setCdcEngineActive('TAILING_WAL');
    const newId = 101 + dbTable.length;
    const newName = dbTable.length === 1 ? 'Bob' : dbTable.length === 2 ? 'Charlie' : 'David';
    const newAge = 25 + dbTable.length;

    // 1. Write to DB table
    setDbTable(prev => [...prev, { id: newId, name: newName, age: newAge }]);
    
    // 2. Append to WAL Log
    const newOffset = 1001 + walLog.length;
    const newWalEntry = { offset: newOffset, op: 'INSERT', data: `ID: ${newId}, name: "${newName}"` };
    setWalLog(prev => [...prev, newWalEntry]);
    
    setLog(`[RDBMS Write] Inserted row ID ${newId} ('${newName}'). WAL log appended offset ${newOffset}. CDC Engine tailing log...`);

    // 3. CDC Engine tails WAL -> streams to Broker
    setTimeout(() => {
      setCdcEngineActive('QUEUE_BROKER');
      setLog(`[CDC Debezium] Tailed WAL Offset ${newOffset}. Emitting row mutation event schema to Message Broker topic...`);
      
      // 4. Broker triggers downstream search index sync
      setTimeout(() => {
        setSearchIndex(prev => [...prev, { key: newName, docId: newId }]);
        setCdcEngineActive('SYNCED');
        setLog(`[Downstream Index Sync] Elasticsearch consumer read event stream. Synced search index pointer matching '${newName}' to Doc ID ${newId}!`);
      }, 1500);
    }, 1500);
  };

  const handleReset = () => {
    setDbTable([{ id: 101, name: 'Alice', age: 24 }]);
    setWalLog([{ offset: 1001, op: 'INSERT', data: 'ID: 101, name: "Alice"' }]);
    setSearchIndex([{ key: 'Alice', docId: 101 }]);
    setCdcEngineActive('IDLE');
    setLog('Change Data Capture simulator reset.');
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <button className="btn-viz-action btn-add" onClick={runInsert} disabled={cdcEngineActive === 'TAILING_WAL' || cdcEngineActive === 'QUEUE_BROKER'}>
        Insert New User
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Change Capture Registry</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          <div>CDC Agent: <strong style={{ color: '#1591DC' }}>Debezium Log Tailer</strong></div>
          <div>WAL Log Length: <strong style={{ color: '#1591DC' }}>{walLog.length} entries</strong></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Index Synchronization</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          <div>Index Sink: <strong style={{ color: '#1591DC' }}>Elasticsearch</strong></div>
          <div>Sync pipeline state: <strong style={{ color: '#1591DC' }}>{cdcEngineActive}</strong></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>CDC (Change Data Capture)</strong> is a design pattern that captures database row mutations (inserts, updates, deletes) in real-time and streams them to external services:</p>
      <ul>
        <li><strong>Log-Based CDC (Recommended):</strong> Instead of scanning tables using polling queries, a CDC agent (e.g., Debezium) tails the database transaction **Write-Ahead Log (WAL)**. This adds zero overhead to operational query runtimes.</li>
        <li><strong>Event Streaming:</strong> WAL logs are converted into JSON/Avro event schemas and published to a message bus (like Apache Kafka).</li>
        <li><strong>Sink Sync:</strong> Downstream consumers read events to update Elasticsearch search indexes, sync caches, or feed analytical data lakes.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Change Data Capture as **a news reporter tailing a captain\'s ship log**:</p>
      <ul>
        <li><strong>Standard Query:</strong> You call the ship captain every 5 seconds to ask what has changed. This wastes his time and attention.</li>
        <li><strong>CDC:</strong> A reporter sits in the corner, reading the ship\'s logbook (WAL) directly as entries are written, and instantly broadcasts updates to the news channel (Kafka) for listeners to hear.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Trigger-Based CDC:</strong> Creating RDBMS triggers to log changes to separate tables. This requires locking rows, which significantly degrades primary transaction write speeds.</li>
      <li><strong>Out-of-Order Processing:</strong> Failing to maintain message ordering in message partitions. If an UPDATE event is processed before the corresponding INSERT event, the sync will fail.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Why is log-based CDC superior to query-based polling?',
      a: 'Query-based polling requires running periodic `SELECT` scans, consuming CPU/Memory and missing intermediate updates (e.g. if a row is updated twice between polls). Log-based CDC tails the binary transaction logs (WAL) on disk, adding zero transactional load and capturing every single state transition.'
    },
    {
      q: 'Explain the role of Kafka in a CDC architecture.',
      a: 'Kafka acts as an asynchronous, ordered event broker buffer. The CDC agent publishes mutation logs to Kafka topics, decoupling the database writes from downstream index sync consumers and avoiding system bottleneck failures.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which source file does a log-based CDC engine parse to detect database mutations?',
      options: [
        'The query parser AST cache',
        'The database Write-Ahead Log (WAL) or transaction log on disk',
        'The primary key indexes registry file',
        'The browser LocalStorage token'
      ],
      correctIdx: 1,
      explanation: 'Log-based CDC directly tails the append-only binary transaction log (WAL) generated by database commits.'
    },
    {
      question: 'What is a primary benefit of syncing Elasticsearch indexes via CDC?',
      options: [
        'It speeds up transaction writes on the relational database',
        'It decouples primary writes from search index logic, preventing write failures if Elasticsearch crashes',
        'It normalizes tables to BCNF automatically',
        'It eliminates the need for primary keys'
      ],
      correctIdx: 1,
      explanation: 'Using an event broker buffer ensures that an Elasticsearch outage does not crash primary write transactions. Once restored, the index consumer catches up.'
    }
  ];

  return (
    <VisualizerShell
      title="Change Data Capture (CDC)"
      subtitle="Tail transaction log files (WAL) in real-time, stream events, and synchronize search indexes."
      timeComplexity="Capture Lag: O(Replication Delay)"
      spaceComplexity="O(Log Size) binary log allocation"
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
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', width: '100%', flexWrap: 'wrap' }}>
          
          {/* RDBMS Table + WAL */}
          <div style={{
            border: '1.5px solid var(--bg-tertiary)',
            borderRadius: '6px',
            padding: '0.5rem',
            backgroundColor: '#000000',
            width: '140px',
            height: '170px',
            overflowY: 'auto'
          }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#FFFFFF', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: '0.2rem', marginBottom: '0.3rem', textAlign: 'center' }}>
              Base Table & WAL
            </div>
            
            {/* Table Representation */}
            <div style={{ fontSize: '0.55rem', color: '#FFFFFF', marginBottom: '0.4rem' }}>
              <div style={{ fontWeight: 'bold', color: '#1591DC' }}>Users Table:</div>
              {dbTable.map(u => (
                <div key={u.id}>• {u.name} (id: {u.id})</div>
              ))}
            </div>

            {/* WAL Representation */}
            <div style={{ fontSize: '0.55rem', color: '#FFFFFF' }}>
              <div style={{ fontWeight: 'bold', color: '#1591DC' }}>WAL Logs:</div>
              {walLog.map(w => (
                <div key={w.offset} style={{ fontSize: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  Offset {w.offset}: {w.op}
                </div>
              ))}
            </div>
          </div>

          {/* CDC Engine */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '70px' }}>
            <span style={{ fontSize: '0.45rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>WAL Tailer</span>
            <div style={{
              border: cdcEngineActive === 'TAILING_WAL' ? '2px solid #1591DC' : '1.5px solid var(--bg-tertiary)',
              borderRadius: '4px',
              padding: '0.35rem',
              backgroundColor: '#000000',
              fontSize: '0.55rem',
              color: cdcEngineActive === 'TAILING_WAL' ? '#1591DC' : 'var(--text-secondary)',
              fontWeight: 'bold',
              textAlign: 'center',
              transition: 'all 0.3s'
            }}>
              Debezium
            </div>
            <i className="fa-solid fa-arrow-right" style={{ color: cdcEngineActive === 'QUEUE_BROKER' || cdcEngineActive === 'SYNCED' ? '#1591DC' : 'var(--text-tertiary)', fontSize: '1rem', marginTop: '0.35rem' }}></i>
          </div>

          {/* Message Broker (Queue) */}
          <div style={{
            border: cdcEngineActive === 'QUEUE_BROKER' ? '2px solid #1591DC' : '1.5px solid var(--bg-tertiary)',
            borderRadius: '6px',
            padding: '0.5rem',
            backgroundColor: '#000000',
            width: '90px',
            height: '170px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'all 0.3s'
          }}>
            <i className="fa-solid fa-envelope-open-text" style={{ fontSize: '1.2rem', color: cdcEngineActive === 'QUEUE_BROKER' ? '#1591DC' : 'var(--text-tertiary)', marginBottom: '0.4rem' }}></i>
            <span style={{ fontSize: '0.58rem', fontWeight: 'bold', color: '#FFFFFF' }}>Kafka Topic</span>
            <span style={{ fontSize: '0.45rem', color: 'var(--text-tertiary)' }}>Ordered Logs</span>
            {cdcEngineActive === 'QUEUE_BROKER' && (
              <span style={{ fontSize: '0.5rem', color: '#1591DC', marginTop: '0.4rem', fontWeight: 'bold' }}>EVENT_SENT</span>
            )}
          </div>

          {/* Consumer Sync Arrow */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '20px' }}>
            <i className="fa-solid fa-arrow-right" style={{ color: cdcEngineActive === 'SYNCED' ? '#1591DC' : 'var(--text-tertiary)', fontSize: '1rem' }}></i>
          </div>

          {/* Elasticsearch Target */}
          <div style={{
            border: cdcEngineActive === 'SYNCED' ? '2px solid #1591DC' : '1.5px solid var(--bg-tertiary)',
            borderRadius: '6px',
            padding: '0.5rem',
            backgroundColor: '#000000',
            width: '110px',
            height: '170px',
            overflowY: 'auto',
            transition: 'all 0.3s'
          }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#FFFFFF', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: '0.2rem', marginBottom: '0.4rem', textAlign: 'center' }}>
              Search Index
            </div>
            <div style={{ fontSize: '0.5rem', color: '#FFFFFF' }}>
              <div style={{ color: '#1591DC', fontWeight: 'bold', marginBottom: '0.25rem' }}>Inverted Terms:</div>
              {searchIndex.map((entry, idx) => (
                <div key={idx} style={{ padding: '0.15rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  "{entry.key}" {'->'} Doc:{entry.docId}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </VisualizerShell>
  );
}
