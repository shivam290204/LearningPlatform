import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function CqrsVisualizer() {
  const [writeDb, setWriteDb] = useState({ id: 101, name: 'Alice', email: 'alice@domain.com', age: 24 });
  const [readDb, setReadDb] = useState({ id: 101, name: 'Alice', email: 'alice@domain.com', age: 24 });
  const [syncState, setSyncState] = useState('SYNCED'); // 'SYNCED', 'SYNCING'
  const [inputAge, setInputAge] = useState(25);
  const [log, setLog] = useState('CQRS pipeline active. Write commands update the Write DB; queries fetch from Read DB.');

  const handleUpdate = () => {
    setSyncState('SYNCING');
    const updatedUser = { ...writeDb, age: inputAge };
    setWriteDb(updatedUser);
    setLog(`[Command Executed] UPDATE Users SET age = ${inputAge} WHERE id = 101. Write DB updated instantly! Dispatching async event...`);

    // Async sync with delay
    setTimeout(() => {
      setReadDb(updatedUser);
      setSyncState('SYNCED');
      setLog('[Async Message Bus] Event processed: synced new user details to read-optimized projection cache.');
    }, 2000);
  };

  const runQuery = () => {
    setLog(`[Query Executed] SELECT name, age FROM read_users_summary WHERE id = 101. Returned name: "${readDb.name}", age: ${readDb.age}. Read completed in <1ms! ${syncState === 'SYNCING' ? 'Note: returned eventual stale consistency.' : ''}`);
  };

  const handleReset = () => {
    setWriteDb({ id: 101, name: 'Alice', email: 'alice@domain.com', age: 24 });
    setReadDb({ id: 101, name: 'Alice', email: 'alice@domain.com', age: 24 });
    setInputAge(25);
    setSyncState('SYNCED');
    setLog('CQRS visualizer reset.');
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Set Age:</span>
      <input
        type="number"
        value={inputAge}
        onChange={(e) => setInputAge(parseInt(e.target.value, 10))}
        style={{
          width: '50px',
          padding: '0.35rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      />
      
      <button className="btn-viz-action btn-add" onClick={handleUpdate} disabled={syncState === 'SYNCING'}>
        Send Write Command
      </button>

      <button className="btn-viz-action btn-add" onClick={runQuery}>
        Send Read Query
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Pipeline Synchronization</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          <div>Sync pipeline status: <strong style={{ color: '#1591DC' }}>{syncState}</strong></div>
          <div>Consistency Model: <strong style={{ color: '#1591DC' }}>Eventual Consistency</strong></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Access Pattern Optimization</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          <div>Write Operations: <strong style={{ color: '#1591DC' }}>Normalized (3NF)</strong></div>
          <div>Read Operations: <strong style={{ color: '#1591DC' }}>Denormalized (Views/Cache)</strong></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>CQRS (Command Query Responsibility Segregation)</strong> is an architecture pattern that separates read queries from write commands into different data models:</p>
      <ul>
        <li><strong>Command Model (Writes):</strong> Validates business domain logic, handles transactions, and writes to a normalized relational database.</li>
        <li><strong>Query Model (Reads):</strong> Reads pre-aggregated, read-optimized tables or caching views (e.g. Elasticsearch, Redis) designed for low-latency searches.</li>
        <li><strong>Asynchronous Sync:</strong> Committing a write publishes an event to a message broker, which propagates changes to the Read database. This creates an **eventual consistency** lag.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of CQRS as **the menu system in a restaurant**:</p>
      <ul>
        <li><strong>Write Command (Kitchen):</strong> Preparing food requires a highly complex workflow (cooking, cleaning, sanitizing) optimized for safety (ACID).</li>
        <li><strong>Read Query (Customer menu):</strong> Customers read a flat, pre-computed menu listing prices. They do not query the chef directly on how to cook; they read the pre-printed menu for sub-millisecond choices.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Assuming Immediate Consistency:</strong> Reading from the query cache immediately after a write command. The read model can be stale for a few milliseconds/seconds due to replication delay.</li>
      <li><strong>Applying CQRS to Simple CRUD:</strong> Implementing complex command/query segregations on simple apps with low query loads, adding excessive architecture overhead.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Why would you use CQRS?',
      a: 'To optimize databases with asymmetric workloads (e.g., millions of read queries and few write updates). Separating models allows scaling read infrastructure independently, applying specialized indexing, and avoiding performance bottlenecks.'
    },
    {
      q: 'What is eventual consistency in CQRS?',
      a: 'Because read and write databases are decoupled, updates to the write model are synced to the read database asynchronously. During this delay, queries to the read model will return older (stale) data until replication completes.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which operation type in CQRS is responsible for validating business rules and modifying database records?',
      options: [
        'Query Model (Reads)',
        'Command Model (Writes)',
        'Index Scan Model',
        'Materialized View Parser'
      ],
      correctIdx: 1,
      explanation: 'Command Models receive actions (commands), validate logic, and execute state changes on the primary database.'
    },
    {
      question: 'What is a drawback of using CQRS?',
      options: [
        'Slower read queries due to simpler tables',
        'Architecture complexity and the challenge of handling eventual consistency lag',
        'It disables primary key unique constraints',
        'It prevents database backups'
      ],
      correctIdx: 1,
      explanation: 'Decoupling reads and writes introduces message buses, syncing code, and eventual consistency lag, requiring extra application-level checks.'
    }
  ];

  return (
    <VisualizerShell
      title="CQRS Pattern"
      subtitle="Segregate transactional Writes (Commands) from read-optimized Query views. Model sync delays."
      timeComplexity="Command Write: O(1) lock; Query Read: O(1) cache lookup"
      spaceComplexity="O(D_write + D_read) dual model storage size"
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
          
          {/* Write DB Column */}
          <div style={{
            border: '2px solid #1591DC',
            borderRadius: '6px',
            padding: '0.75rem',
            backgroundColor: '#000000',
            width: '180px',
            textAlign: 'center'
          }}>
            <i className="fa-solid fa-pen-to-square" style={{ color: '#1591DC', fontSize: '1.2rem', marginBottom: '0.4rem' }}></i>
            <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#FFFFFF' }}>Write Database (OLTP)</div>
            <div style={{ fontSize: '0.55rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Command Target</div>
            
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--bg-tertiary)',
              padding: '0.4rem',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.62rem',
              textAlign: 'left',
              color: '#FFFFFF'
            }}>
              <div>ID: {writeDb.id}</div>
              <div>Name: {writeDb.name}</div>
              <div>Age: <strong style={{ color: '#1591DC' }}>{writeDb.age}</strong></div>
              <div>Mode: ACID Normalized</div>
            </div>
          </div>

          {/* Sync Connector */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '60px' }}>
            <span style={{ fontSize: '0.45rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Replication</span>
            <i className="fa-solid fa-arrows-spin fa-spin" style={{ color: syncState === 'SYNCING' ? '#1591DC' : 'var(--text-tertiary)', fontSize: '1.4rem' }}></i>
            <span style={{
              fontSize: '0.52rem',
              fontWeight: 'bold',
              color: syncState === 'SYNCING' ? '#FFFFFF' : '#1591DC',
              marginTop: '0.3rem'
            }}>
              {syncState}
            </span>
          </div>

          {/* Read DB Column */}
          <div style={{
            border: syncState === 'SYNCING' ? '1.5px dashed rgba(255,255,255,0.3)' : '2px solid #FFFFFF',
            borderRadius: '6px',
            padding: '0.75rem',
            backgroundColor: '#000000',
            width: '180px',
            textAlign: 'center',
            transition: 'all 0.3s'
          }}>
            <i className="fa-solid fa-magnifying-glass" style={{ color: '#FFFFFF', fontSize: '1.2rem', marginBottom: '0.4rem' }}></i>
            <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#FFFFFF' }}>Read Database (Denorm)</div>
            <div style={{ fontSize: '0.55rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Query Target</div>
            
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--bg-tertiary)',
              padding: '0.4rem',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.62rem',
              textAlign: 'left',
              color: syncState === 'SYNCING' ? 'rgba(255,255,255,0.6)' : '#FFFFFF'
            }}>
              <div>ID: {readDb.id}</div>
              <div>Name: {readDb.name}</div>
              <div>Age: <strong style={{ color: syncState === 'SYNCING' ? '#FFFFFF' : '#1591DC' }}>{readDb.age}</strong></div>
              <div>Mode: Read-Optimized</div>
            </div>
          </div>

        </div>
      </div>
    </VisualizerShell>
  );
}
