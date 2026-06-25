import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function DbIndexingVisualizer() {
  const [indexMode, setIndexMode] = useState('TABLE_SCAN'); // 'TABLE_SCAN' or 'INDEX_SCAN'
  const [targetAge, setTargetAge] = useState(32);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [pagesRead, setPagesRead] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [log, setLog] = useState('Indexing simulator ready. Choose scan type and trigger query.');

  const tableData = [
    { id: 1, name: 'Alice', age: 24, ptr: '0x001' },
    { id: 2, name: 'Bob', age: 29, ptr: '0x002' },
    { id: 3, name: 'Charlie', age: 19, ptr: '0x003' },
    { id: 4, name: 'David', age: 35, ptr: '0x004' },
    { id: 5, name: 'Eve', age: 32, ptr: '0x005' },
    { id: 6, name: 'Frank', age: 27, ptr: '0x006' },
    { id: 7, name: 'Grace', age: 41, ptr: '0x007' }
  ];

  const runSearch = () => {
    setIsPlaying(true);
    setPagesRead(0);
    setCurrentIndex(-1);
    setLog(`Starting query: SELECT * FROM Users WHERE age = ${targetAge}...`);

    if (indexMode === 'TABLE_SCAN') {
      let scanIdx = 0;
      const interval = setInterval(() => {
        if (scanIdx < tableData.length) {
          setCurrentIndex(scanIdx);
          setPagesRead(prev => prev + 1);
          const row = tableData[scanIdx];
          
          if (row.age === targetAge) {
            clearInterval(interval);
            setIsPlaying(false);
            setLog(`[Full Table Scan] Match found at row ID ${row.id} (pointer ${row.ptr}). Scanned ${scanIdx + 1} records.`);
          } else {
            setLog(`Scanning record index ${scanIdx}: Age ${row.age} != ${targetAge}. Proceeding...`);
            scanIdx++;
          }
        } else {
          clearInterval(interval);
          setIsPlaying(false);
          setLog(`[Full Table Scan] Finished. Target age not found. Scanned all ${tableData.length} records.`);
        }
      }, 700);
    } else {
      // INDEX_SCAN
      setLog('Query Optimizer: Checking Index on "age" column...');
      setTimeout(() => {
        // Jump directly to index
        const indexMatch = tableData.findIndex(r => r.age === targetAge);
        if (indexMatch !== -1) {
          setCurrentIndex(indexMatch);
          setPagesRead(1);
          setIsPlaying(false);
          const matchedRow = tableData[indexMatch];
          setLog(`[Index Scan] Checked B+ Tree index page for age: ${targetAge}. Found reference matching pointer ${matchedRow.ptr}. Jumped directly to Row ID ${matchedRow.id} in 1 page read!`);
        } else {
          setPagesRead(1);
          setIsPlaying(false);
          setLog(`[Index Scan] B+ Tree index lookup returned empty. Age ${targetAge} does not exist in table.`);
        }
      }, 1000);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(-1);
    setPagesRead(0);
    setLog('Simulator reset.');
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Execution Strategy:</span>
      <select
        value={indexMode}
        onChange={(e) => {
          setIndexMode(e.target.value);
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
        <option value="TABLE_SCAN">Full Table Scan (No Index)</option>
        <option value="INDEX_SCAN">Index Seek / Scan (With Index)</option>
      </select>

      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Target Age:</span>
      <select
        value={targetAge}
        onChange={(e) => {
          setTargetAge(parseInt(e.target.value, 10));
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
        <option value={32}>32 (Eve - Row 5)</option>
        <option value={19}>19 (Charlie - Row 3)</option>
        <option value={41}>41 (Grace - Row 7)</option>
      </select>

      <button className="btn-viz-action btn-add" onClick={runSearch} disabled={isPlaying}>
        Execute SELECT
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Query Plan Stats</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Execution Type: <strong style={{ color: '#1591DC' }}>{indexMode}</strong></div>
          <div>Disk Pages Read: <strong style={{ color: '#1591DC' }}>{pagesRead}</strong></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>B+ Tree Index Registry</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.7rem'
        }}>
          {indexMode === 'INDEX_SCAN' ? (
            <div>
              <div>Index (Key {'->'} Ptr)</div>
              <div>• 19 {'->'} 0x003</div>
              <div>• 24 {'->'} 0x001</div>
              <div>• 32 {'->'} 0x005</div>
              <div>• 35 {'->'} 0x004</div>
            </div>
          ) : (
            <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No index defined.</span>
          )}
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>Database Index</strong> is a data structure (typically a B+ Tree) that improves the speed of data retrieval operations on a table at the cost of additional storage space and slower writes:</p>
      <ul>
        <li><strong>Full Table Scan (Seq Scan):</strong> The database engine reads every single page block and row in the table from disk to verify search criteria. (Time complexity is O(N)).</li>
        <li><strong>Index Seek:</strong> The engine traverses a sorted index key list, finds the memory pointer associated with the row, and jumps directly to that specific block. (Time complexity is O(log N)).</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Database Indexing as **finding a recipe in a cookbook**:</p>
      <ul>
        <li><strong>Without Index (Table Scan):</strong> You flip through every single page from page 1 to the end, reading every recipe name until you find "Chocolate Cake."</li>
        <li><strong>With Index (Index Scan):</strong> You open the index at the back of the book, locate "Chocolate Cake" under 'C,' see it is on Page 84, and flip directly to page 84.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Indexing Every Column:</strong> Indiscriminately index columns. Indexes must be updated on every write (INSERT, UPDATE, DELETE), so too many indices significantly slow down writes.</li>
      <li><strong>Low Cardinality Indexes:</strong> Creating an index on a boolean column (e.g. "is_active"). Databases will ignore the index and perform a full table scan anyway because half of the rows match.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is the trade-off of creating a database index?',
      a: 'Creating an index improves read query performance (SELECT) from O(N) to O(log N). However, it consumes extra disk space and slows down write operations (INSERT, UPDATE, DELETE) because the index tree must be updated and re-balanced.'
    },
    {
      q: 'When does a database query optimizer decide to ignore an index?',
      a: 'If the column has low cardinality (few unique values, like boolean flags), or if the query filters out the majority of the table anyway. In these cases, performing a sequential scan is faster than jumping back and forth between index and disk pages.'
    }
  ];

  const quizQuestions = [
    {
      question: 'What is the time complexity of searching a record on a non-indexed column in a table of N rows?',
      options: [
        'O(1)',
        'O(log N)',
        'O(N)',
        'O(N log N)'
      ],
      correctIdx: 2,
      explanation: 'A non-indexed column lookup forces a sequential Full Table Scan, examining all N records in the worst case.'
    },
    {
      question: 'Why do indexes slow down database writes?',
      options: [
        'Because they locks the CPU',
        'Because the B+ Tree index structure must be updated and balanced on writes',
        'Because they delete the tables data',
        'Because they create extra connections'
      ],
      correctIdx: 1,
      explanation: 'Every write requires the database to update the corresponding index entries, inserting nodes and performing tree rotations/splits if necessary.'
    }
  ];

  return (
    <VisualizerShell
      title="Database Indexing"
      subtitle="Contrast expensive Full Table scans with optimized Index lookups. Measure page read statistics."
      timeComplexity="Table Scan: O(N); Index: O(log N)"
      spaceComplexity="O(I) index structure allocation"
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
        <svg width="450" height="220" style={{ overflow: 'visible' }}>
          {/* Index Sidebar (Renders if in INDEX mode) */}
          {indexMode === 'INDEX_SCAN' ? (
            <g>
              <rect x="10" y="20" width="110" height="180" fill="#000000" stroke="#1591DC" strokeWidth="2.5" rx="3" />
              <text x="65" y="35" textAnchor="middle" fill="#1591DC" fontSize="0.5rem" fontWeight="bold">Index Tree (Age)</text>
              
              {/* Highlight Index Seek Row */}
              <rect x="15" y="110" width="100" height="20" fill="rgba(21, 145, 220, 0.15)" stroke="#1591DC" rx="2" />
              <text x="65" y="123" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Key: 32 {'->'} Ptr: 0x005</text>
              
              <text x="65" y="70" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.4rem">19 {'->'} 0x003</text>
              <text x="65" y="90" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.4rem">29 {'->'} 0x002</text>
              <text x="65" y="150" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.4rem">35 {'->'} 0x004</text>

              {/* Direct arrow from Index to Table Row */}
              <line x1="115" y1="120" x2="230" y2="135" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3,3" />
            </g>
          ) : (
            <g>
              <rect x="10" y="20" width="110" height="180" fill="#000000" stroke="var(--bg-tertiary)" strokeWidth="1" strokeDasharray="3,3" rx="3" />
              <text x="65" y="100" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.5rem">No Index Available</text>
            </g>
          )}

          {/* Users Table */}
          <g>
            <rect x="230" y="20" width="200" height="180" fill="#000000" stroke="#1591DC" strokeWidth="2" rx="3" />
            <text x="330" y="35" textAnchor="middle" fill="#1591DC" fontSize="0.55rem" fontWeight="bold">Users Heap File (Disk Pages)</text>

            {tableData.map((row, idx) => {
              const isCurrent = currentIndex === idx;
              const matchesTarget = row.age === targetAge && isCurrent;

              let borderCol = 'var(--bg-tertiary)';
              let bgCol = '#000000';

              if (isCurrent) {
                borderCol = '#1591DC';
                bgCol = 'rgba(21, 145, 220, 0.1)';
              }
              if (matchesTarget) {
                borderCol = '#FFFFFF';
                bgCol = 'rgba(21, 145, 220, 0.3)';
              }

              return (
                <g key={row.id}>
                  <rect
                    x="240"
                    y={48 + idx * 20}
                    width="180"
                    height="17"
                    fill={bgCol}
                    stroke={borderCol}
                    strokeWidth={isCurrent ? '2' : '1'}
                    rx="1"
                  />
                  <text x="330" y="60 + idx * 20" textAnchor="middle" fill="#FFFFFF" fontSize="0.4rem">
                    Ptr: {row.ptr} | ID: {row.id} | {row.name} | Age: {row.age}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </VisualizerShell>
  );
}
