import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function PrimaryKeyVisualizer() {
  const [tableData, setTableData] = useState([
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
    { id: 3, name: 'User 3' }
  ]);
  const [selectedCase, setSelectedCase] = useState('VALID'); // 'VALID', 'DUPLICATE', 'NULL'
  const [log, setLog] = useState('Select an operation type and trigger the visual check.');
  const [animationStep, setAnimationStep] = useState(null); // 'SCANNING', 'BLOCKED', 'SUCCESS', null
  const [scanIdx, setScanIdx] = useState(-1);

  const runSimulation = () => {
    setLog('Simulating Primary Key validation check...');
    setAnimationStep('SCANNING');
    setScanIdx(-1);

    if (selectedCase === 'NULL') {
      // Null is rejected immediately by the parser
      setTimeout(() => {
        setAnimationStep('BLOCKED');
        setLog('Validation Failed: Primary Key cannot be NULL (Not Null Constraint). Request rejected.');
      }, 800);
      return;
    }

    let currentScan = 0;
    const interval = setInterval(() => {
      if (currentScan < tableData.length) {
        setScanIdx(currentScan);
        setLog(`Scanning index. Checking row ID: ${tableData[currentScan].id}...`);
        currentScan++;
      } else {
        clearInterval(interval);
        setScanIdx(-1);

        if (selectedCase === 'DUPLICATE') {
          setAnimationStep('BLOCKED');
          setLog('Validation Failed: ID 2 already exists in the table. Duplicate Key Rejection!');
        } else {
          setAnimationStep('SUCCESS');
          setTableData([...tableData, { id: 4, name: 'User 4' }]);
          setLog('Validation Passed: ID 4 is unique and not null. Appended row successfully.');
        }
      }
    }, 600);
  };

  const handleReset = () => {
    setTableData([
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
      { id: 3, name: 'User 3' }
    ]);
    setAnimationStep(null);
    setScanIdx(-1);
    setLog('Simulator reset.');
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Test Scenario:</span>
      <select
        value={selectedCase}
        onChange={(e) => setSelectedCase(e.target.value)}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        <option value="VALID">Insert ID: 4 (Unique & Valid)</option>
        <option value="DUPLICATE">Insert ID: 2 (Duplicate Check)</option>
        <option value="NULL">Insert ID: NULL (Not Null Check)</option>
      </select>

      <button className="btn-viz-action btn-add" onClick={runSimulation} disabled={animationStep === 'SCANNING'}>
        Run Constraint Check
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset Table
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Validation Status</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Engine State: <strong style={{ color: '#1591DC' }}>{animationStep || 'IDLE'}</strong></div>
          <div>Constraint Rule: <span>UNIQUE &amp; NOT NULL</span></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>The <strong>Primary Key Constraint</strong> guarantees absolute uniqueness for records in a database table:</p>
      <ul>
        <li><strong>Unique Indexing:</strong> The database automatically builds a unique index (typically a B+ Tree) to scan and check for existing values efficiently.</li>
        <li><strong>Not-Null Constraint:</strong> The primary key column acts as the absolute entity identifier. Therefore, empty or null inputs are blocked before parsing.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Primary Keys as **Government Passport Numbers**:</p>
      <ul>
        <li>Every citizen must possess a passport number (Not Null).</li>
        <li>No two citizens can ever be assigned the same passport number (Unique).</li>
        <li>If a clerk tries to register a new citizen using an existing passport number, the registration system flags it as duplicate.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Inserting NULL:</strong> Beginners often attempt to save dynamic foreign relations before creating the primary key, triggering a NOT NULL constraint breach.</li>
      <li><strong>Non-indexed PKs:</strong> Relational databases automatically index the Primary Key. Do not create secondary indices on the primary key, as it causes performance overhead.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Can a Primary Key contain NULL values?',
      a: 'No. By definition, a primary key represents a Not-Null Unique constraint. Allowing a NULL key would mean that multiple rows could contain NULL, violating both uniqueness and identifiable properties.'
    },
    {
      q: 'What is a Surrogate Key vs Natural Key?',
      a: 'A Natural Key is a primary key composed of real-world attributes (e.g. Email or SSN). A Surrogate Key is an artificially generated unique identifier (e.g., auto-incrementing ID or UUID) with no business meaning.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which index structure is automatically created on a Primary Key column by most database engines?',
      options: [
        'Hash Index',
        'B+ Tree Index',
        'Inverted Index',
        'Bitmap Index'
      ],
      correctIdx: 1,
      explanation: 'B+ Tree indexes are automatically built for Primary Keys to ensure O(log N) lookups and enforce uniqueness.'
    },
    {
      question: 'What constraints are combinationally verified in a Primary Key?',
      options: [
        'Foreign Key & Unique',
        'Not Null & Unique',
        'Default & Cascade',
        'Check & Default'
      ],
      correctIdx: 1,
      explanation: 'Primary keys are combinationally defined as NOT NULL and UNIQUE.'
    }
  ];

  return (
    <VisualizerShell
      title="Primary Key Constraints"
      subtitle="Examine unique validation checks. Observe how duplicate key insertions and NULL key values are rejected."
      timeComplexity="O(log N) Index scan"
      spaceComplexity="O(1) temporary allocation"
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
          {/* Input Packet */}
          {animationStep && (
            <g style={{ transition: 'all 0.35s ease' }}>
              <rect x="25" y="10" width="70" height="25" fill="#000000" stroke="#1591DC" strokeWidth="1.5" rx="3" />
              <text x="60" y="27" textAnchor="middle" fill="#1591DC" fontSize="0.55rem" fontWeight="bold">
                {selectedCase === 'NULL' ? 'ID: NULL' : (selectedCase === 'DUPLICATE' ? 'ID: 2' : 'ID: 4')}
              </text>
            </g>
          )}

          {/* Engine Parser Node */}
          <g>
            <rect x="150" y="5" width="80" height="35" fill="#000000" stroke={animationStep === 'BLOCKED' ? '#FFFFFF' : '#1591DC'} strokeWidth="2.5" rx="3" />
            <text x="190" y="23" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Constraint Parser</text>
            <text x="190" y="34" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.38rem">SQL Engine</text>
          </g>

          {/* Connection Lines to table indices */}
          {tableData.map((row, idx) => {
            const isScanning = scanIdx === idx;
            return (
              <line
                key={`line-${idx}`}
                x1="190"
                y1="40"
                x2="310"
                y2={70 + idx * 40}
                stroke={isScanning ? '#1591DC' : 'var(--bg-tertiary)'}
                strokeWidth={isScanning ? '2.5' : '1'}
                strokeDasharray={isScanning ? 'none' : '3,3'}
              />
            );
          })}

          {/* Database Table */}
          <g>
            <rect x="310" y="45" width="120" height="140" fill="#000000" stroke="#1591DC" strokeWidth="2" rx="3" />
            <text x="370" y="60" textAnchor="middle" fill="#1591DC" fontSize="0.55rem" fontWeight="bold">Users Table</text>

            {tableData.map((row, idx) => {
              const isScanning = scanIdx === idx;
              const isTargetedDuplicate = selectedCase === 'DUPLICATE' && row.id === 2 && animationStep === 'BLOCKED';
              
              let rowStroke = 'var(--bg-tertiary)';
              if (isScanning) rowStroke = '#1591DC';
              if (isTargetedDuplicate) rowStroke = '#FFFFFF';

              return (
                <g key={row.id}>
                  <rect
                    x="320"
                    y={70 + idx * 40}
                    width="100"
                    height="28"
                    fill="#000000"
                    stroke={rowStroke}
                    strokeWidth={isScanning || isTargetedDuplicate ? '2.5' : '1'}
                    rx="2"
                  />
                  <text x="370" y={87 + idx * 40} textAnchor="middle" fill="#FFFFFF" fontSize="0.48rem">
                    ID: {row.id} | {row.name}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Blocked/Success overlays */}
          {animationStep === 'BLOCKED' && (
            <g>
              <rect x="130" y="80" width="130" height="50" fill="#000000" stroke="#FFFFFF" strokeWidth="2" rx="3" />
              <text x="195" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">✕ REJECTED</text>
              <text x="195" y="118" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.42rem">Constraint violation</text>
            </g>
          )}

          {animationStep === 'SUCCESS' && (
            <g>
              <rect x="130" y="80" width="130" height="50" fill="#000000" stroke="#1591DC" strokeWidth="2" rx="3" />
              <text x="195" y="103" textAnchor="middle" fill="#1591DC" fontSize="0.55rem" fontWeight="bold">✓ COMMITTED</text>
              <text x="195" y="118" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.42rem">Valid Primary Key</text>
            </g>
          )}
        </svg>
      </div>
    </VisualizerShell>
  );
}
