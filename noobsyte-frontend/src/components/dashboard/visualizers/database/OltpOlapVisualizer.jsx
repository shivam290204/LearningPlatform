import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function OltpOlapVisualizer() {
  const [engineType, setEngineType] = useState('ROW_STORE'); // 'ROW_STORE' (OLTP) or 'COLUMN_STORE' (OLAP)
  const [activeQuery, setActiveQuery] = useState(null); // 'WRITE' or 'ANALYTIC'
  const [scannedBlocks, setScannedBlocks] = useState(0);
  const [diskIos, setDiskIos] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [log, setLog] = useState('Select an engine architecture and run queries.');

  const dbRows = [
    { id: 1, name: 'Alice', age: 24, salary: 80 },
    { id: 2, name: 'Bob', age: 31, salary: 120 },
    { id: 3, name: 'Charlie', age: 28, salary: 95 },
    { id: 4, name: 'David', age: 42, salary: 150 }
  ];

  const runQuery = (type) => {
    setIsPlaying(true);
    setActiveQuery(type);
    setScannedBlocks(0);
    setDiskIos(0);

    if (type === 'WRITE') {
      setLog(`Executing INSERT INTO Users VALUES (5, 'Eve', 35, 110)...`);
      setTimeout(() => {
        setIsPlaying(false);
        if (engineType === 'ROW_STORE') {
          // OLTP write: append one row block
          setDiskIos(1);
          setLog(`[OLTP Row Store] INSERT complete. Appended 1 sequential row page block (ID, Name, Age, Salary) to disk. Fast O(1) single-page write!`);
        } else {
          // OLAP column write: write across multiple separate column files
          setDiskIos(4);
          setLog(`[OLAP Column Store] INSERT complete. Wrote data across 4 separate column files (IDs file, Names file, Ages file, Salaries file). High overhead: 4 separate disk IOs required.`);
        }
      }, 1200);
    } else {
      // ANALYTIC: SELECT AVG(salary) FROM Users
      setLog('Executing SELECT AVG(salary) FROM Users...');
      setTimeout(() => {
        setIsPlaying(false);
        if (engineType === 'ROW_STORE') {
          // OLTP: read all columns of all rows
          setScannedBlocks(16); // 4 rows * 4 values
          setLog(`[OLTP Row Store] Aggregate complete. Scanned all 4 rows, reading ID, Name, and Age columns along with Salary. Total 16 data values read from disk.`);
        } else {
          // OLAP: read only the salary column
          setScannedBlocks(4); // 1 column * 4 values
          setLog(`[OLAP Column Store] Aggregate complete. Jumped directly to the "salary" column file. Read only the 4 salary values, skipping ID, Name, and Age files. Scalable O(1) column scan!`);
        }
      }, 1200);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveQuery(null);
    setScannedBlocks(0);
    setDiskIos(0);
    setLog('Simulator reset.');
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <button className="btn-viz-action btn-add" onClick={() => runQuery('WRITE')} disabled={isPlaying}>
        Run INSERT Query
      </button>

      <button className="btn-viz-action btn-add" onClick={() => runQuery('ANALYTIC')} disabled={isPlaying}>
        Run AVG(Salary) Query
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Storage Engine:</span>
        <select
          value={engineType}
          onChange={(e) => {
            setEngineType(e.target.value);
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
          <option value="ROW_STORE">Row-Store (OLTP - e.g. Postgres)</option>
          <option value="COLUMN_STORE">Col-Store (OLAP - e.g. Snowflake)</option>
        </select>
      </div>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Storage Architecture Detail</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          <div>Layout Mode: <strong style={{ color: '#1591DC' }}>{engineType}</strong></div>
          <div>Primary Goal: <strong style={{ color: '#1591DC' }}>{engineType === 'ROW_STORE' ? 'Transactional (Writes)' : 'Analytical (Reads)'}</strong></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Disk I/O Costs</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          <div>Data Cells Scanned: <strong style={{ color: '#1591DC' }}>{scannedBlocks}</strong></div>
          <div>Separate Disk IOs: <strong style={{ color: '#1591DC' }}>{diskIos}</strong></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>Databases optimize their binary layout based on access patterns:</p>
      <ul>
        <li><strong>Row-Oriented (OLTP):</strong> Stores complete row data sequentially. (`[ID1, Name1, Age1, Sal1, ID2, Name2...]`). Perfect for Online Transaction Processing (OLTP) involving frequent single-record updates.</li>
        <li><strong>Column-Oriented (OLAP):</strong> Stores all values of a single column together on disk. (`[ID1, ID2...], [Sal1, Sal2...]`). Essential for Online Analytical Processing (OLAP) aggregating data over billions of rows. Columns can also compress highly due to uniform data types.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Row vs Column stores as **organizing employee files**:</p>
      <ul>
        <li><strong>Row Store:</strong> You put each employee\'s files into a single envelope. Finding one employee (ID, Name, Salary) is instant, but finding the average salary of all employees requires opening every single envelope.</li>
        <li><strong>Column Store:</strong> You keep a spreadsheet with a column for Salaries. Finding the average salary is instant (one list), but inserting a new employee requires writing in separate sheets.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>OLTP queries on OLAP stores:</strong> Running low-latency, point lookup SELECTs or high-frequency INSERTs on column stores like Snowflake, leading to massive write latency locks.</li>
      <li><strong>OLAP queries on OLTP stores:</strong> Running heavy analytic grouping reports on primary production RDBMS servers, scanning massive tables and locking transactions.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Why are columnar databases highly compressible?',
      a: 'Since columnar stores group values of the same data type together (e.g. all integer salaries, all state strings), databases can apply algorithms like Run-Length Encoding (RLE) or dictionary compression very effectively compared to heterogeneous rows.'
    },
    {
      q: 'Explain the write penalty in OLAP Columnar stores.',
      a: 'Inserting a single row in a columnar database requires appending the values to separate files/locations on disk (one file for each column). This results in multiple write operations and locks, rather than a single sequential append.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which engine is most appropriate for a banking platform tracking thousands of real-time account balances and money transfers?',
      options: [
        'Columnar Store (OLAP)',
        'Row-oriented Store (OLTP)',
        'Inverted Index Document Store',
        'Graph Database'
      ],
      correctIdx: 1,
      explanation: 'Banking transfers involve transaction commits on individual account rows. OLTP Row-Stores handle point updates with ACID safety and sub-millisecond writes.'
    },
    {
      question: 'Why does calculating SELECT AVG(salary) execute faster in a Columnar Store?',
      options: [
        'It calculates the average using math approximations',
        'It loads only the salary column file into memory, bypassing irrelevant files like names and ages',
        'It deletes the index registry',
        'It runs the query on replica nodes only'
      ],
      correctIdx: 1,
      explanation: 'Column-Stores skip all other column files entirely, minimizing Disk I/O scans and maximizing aggregation efficiency.'
    }
  ];

  return (
    <VisualizerShell
      title="OLTP vs OLAP Storage"
      subtitle="Contrast horizontal row layout blocks with vertical columnar layouts under query workloads."
      timeComplexity="Row Scan: O(N * Cols); Column Scan: O(N)"
      spaceComplexity="O(N) storage layout allocation"
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
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <svg width="450" height="200" style={{ overflow: 'visible' }}>
            
            {/* Header label */}
            <text x="225" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">
              Disk Layout Visualization ({engineType === 'ROW_STORE' ? 'Row Store' : 'Column Store'})
            </text>

            {/* Row Store representation */}
            {engineType === 'ROW_STORE' ? (
              <g>
                {/* Horizontal Rows */}
                {dbRows.map((row, rIdx) => {
                  const isScanning = activeQuery === 'ANALYTIC' && isPlaying;
                  const isWriting = activeQuery === 'WRITE' && isPlaying;

                  return (
                    <g key={row.id}>
                      {/* Outer row bounding box */}
                      <rect 
                        x="20" 
                        y={35 + rIdx * 35} 
                        width="410" 
                        height="26" 
                        fill="#000000" 
                        stroke={isScanning ? '#1591DC' : isWriting ? '#FFFFFF' : 'var(--bg-tertiary)'} 
                        strokeWidth="1.5" 
                        rx="2"
                      />
                      
                      {/* Cells within the row */}
                      <rect x="25" y="38" width="40" height="20" fill="none" stroke="var(--bg-tertiary)" />
                      <text x="45" y="52" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">ID: {row.id}</text>

                      <rect x="70" y="38" width="90" height="20" fill="none" stroke="var(--bg-tertiary)" />
                      <text x="115" y="52" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Name: {row.name}</text>

                      <rect x="165" y="38" width="60" height="20" fill="none" stroke="var(--bg-tertiary)" />
                      <text x="195" y="52" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Age: {row.age}</text>

                      {/* Salary Cell */}
                      <rect 
                        x="230" 
                        y={38 + rIdx * 35} 
                        width="80" 
                        height="20" 
                        fill={isScanning ? 'rgba(21, 145, 220, 0.2)' : 'none'} 
                        stroke={isScanning ? '#1591DC' : 'var(--bg-tertiary)'} 
                      />
                      <text x="270" y="52 + rIdx * 35" textAnchor="middle" fill={isScanning ? '#1591DC' : '#FFFFFF'} fontSize="0.45rem">Salary: ${row.salary}K</text>
                      
                      <text x="325" y="52 + rIdx * 35" fill="var(--text-tertiary)" fontSize="0.4rem">Row Block {row.id}</text>
                    </g>
                  );
                })}
                {/* Write append visualization */}
                {activeQuery === 'WRITE' && isPlaying && (
                  <g>
                    <rect x="20" y="175" width="410" height="26" fill="rgba(255,255,255,0.05)" stroke="#FFFFFF" strokeDasharray="3,3" rx="2" />
                    <text x="225" y="192" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Appending: ID: 5 | Eve | Age: 35 | Salary: $110K (Single write location)</text>
                  </g>
                )}
              </g>
            ) : (
              // Column Store representation
              <g>
                {/* 4 Separate Columns */}
                {/* COLUMN 1: IDs */}
                <g>
                  <rect x="20" y="35" width="70" height="135" fill="#000000" stroke="var(--bg-tertiary)" strokeWidth="1" rx="2" />
                  <text x="55" y="50" textAnchor="middle" fill="#FFFFFF" fontSize="0.48rem" fontWeight="bold">IDs File</text>
                  {dbRows.map((row, rIdx) => (
                    <text key={row.id} x="55" y="70 + rIdx * 20" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.45rem">{row.id}</text>
                  ))}
                  {activeQuery === 'WRITE' && isPlaying && (
                    <text x="55" y="150" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">5 (W)</text>
                  )}
                </g>

                {/* COLUMN 2: Names */}
                <g>
                  <rect x="105" y="35" width="90" height="135" fill="#000000" stroke="var(--bg-tertiary)" strokeWidth="1" rx="2" />
                  <text x="150" y="50" textAnchor="middle" fill="#FFFFFF" fontSize="0.48rem" fontWeight="bold">Names File</text>
                  {dbRows.map((row, rIdx) => (
                    <text key={row.id} x="150" y="70 + rIdx * 20" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.45rem">{row.name}</text>
                  ))}
                  {activeQuery === 'WRITE' && isPlaying && (
                    <text x="150" y="150" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">'Eve' (W)</text>
                  )}
                </g>

                {/* COLUMN 3: Ages */}
                <g>
                  <rect x="210" y="35" width="70" height="135" fill="#000000" stroke="var(--bg-tertiary)" strokeWidth="1" rx="2" />
                  <text x="245" y="50" textAnchor="middle" fill="#FFFFFF" fontSize="0.48rem" fontWeight="bold">Ages File</text>
                  {dbRows.map((row, rIdx) => (
                    <text key={row.id} x="245" y="70 + rIdx * 20" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.45rem">{row.age}</text>
                  ))}
                  {activeQuery === 'WRITE' && isPlaying && (
                    <text x="245" y="150" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">35 (W)</text>
                  )}
                </g>

                {/* COLUMN 4: Salaries */}
                <g>
                  {/* Highlight Salary column during analytical queries */}
                  {activeQuery === 'ANALYTIC' && isPlaying ? (
                    <rect x="295" y="35" width="110" height="135" fill="rgba(21, 145, 220, 0.15)" stroke="#1591DC" strokeWidth="2.5" rx="2" />
                  ) : (
                    <rect x="295" y="35" width="110" height="135" fill="#000000" stroke="var(--bg-tertiary)" strokeWidth="1" rx="2" />
                  )}
                  <text x="350" y="50" textAnchor="middle" fill={activeQuery === 'ANALYTIC' && isPlaying ? '#1591DC' : '#FFFFFF'} fontSize="0.48rem" fontWeight="bold">Salaries File</text>
                  {dbRows.map((row, rIdx) => (
                    <text key={row.id} x="350" y="70 + rIdx * 20" textAnchor="middle" fill={activeQuery === 'ANALYTIC' && isPlaying ? '#1591DC' : 'var(--text-secondary)'} fontSize="0.48rem" fontWeight="bold">
                      ${row.salary}K
                    </text>
                  ))}
                  {activeQuery === 'WRITE' && isPlaying && (
                    <text x="350" y="150" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">$110K (W)</text>
                  )}
                </g>
              </g>
            )}

          </svg>
        </div>
      </div>
    </VisualizerShell>
  );
}
