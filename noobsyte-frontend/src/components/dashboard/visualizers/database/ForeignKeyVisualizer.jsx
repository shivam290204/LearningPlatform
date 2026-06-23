import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function ForeignKeyVisualizer() {
  const [parentTable, setParentTable] = useState([
    { id: 1, name: 'HR' },
    { id: 2, name: 'TECH' }
  ]);
  const [childTable, setChildTable] = useState([
    { id: 101, name: 'Alice', deptId: 1 },
    { id: 102, name: 'Bob', deptId: 2 },
    { id: 103, name: 'Charlie', deptId: 1 }
  ]);
  const [fkPolicy, setFkPolicy] = useState('CASCADE'); // 'CASCADE', 'RESTRICT', 'SET_NULL'
  const [log, setLog] = useState('Foreign Key Simulator ready. Try deleting Parent Department 1.');
  const [animationStep, setAnimationStep] = useState(null); // 'SCANNING', 'BLOCKED', 'DELETING_CHILDREN', null
  const [activeEdge, setActiveEdge] = useState(null);

  const handleDeleteParent = () => {
    setLog('Foreign Key Check: Scanning child table for active references...');
    setAnimationStep('SCANNING');

    setTimeout(() => {
      const references = childTable.filter(c => c.deptId === 1);
      
      if (references.length > 0) {
        if (fkPolicy === 'RESTRICT') {
          setAnimationStep('BLOCKED');
          setLog('Constraint Error: Cannot delete Department 1. Active employee records reference it. Request Restricted!');
        } else if (fkPolicy === 'CASCADE') {
          setAnimationStep('DELETING_CHILDREN');
          setLog('Cascade Rule Triggered: Deleting referencing employee records (Alice, Charlie) automatically.');
          
          setTimeout(() => {
            setParentTable(parentTable.filter(p => p.id !== 1));
            setChildTable(childTable.filter(c => c.deptId !== 1));
            setAnimationStep(null);
            setLog('Cascade Delete Complete: Department 1 and its dependent employee records deleted.');
          }, 1200);
        } else if (fkPolicy === 'SET_NULL') {
          setAnimationStep('DELETING_CHILDREN');
          setLog('Set Null Rule Triggered: Setting referenced Dept IDs to NULL.');
          
          setTimeout(() => {
            setParentTable(parentTable.filter(p => p.id !== 1));
            setChildTable(childTable.map(c => c.deptId === 1 ? { ...c, deptId: null } : c));
            setAnimationStep(null);
            setLog('Set Null Complete: Department 1 deleted. Dependent employee Dept IDs set to NULL.');
          }, 1200);
        }
      } else {
        // No references
        setParentTable(parentTable.filter(p => p.id !== 1));
        setAnimationStep(null);
        setLog('Deleted Department 1. No child references found.');
      }
    }, 800);
  };

  const handleReset = () => {
    setParentTable([
      { id: 1, name: 'HR' },
      { id: 2, name: 'TECH' }
    ]);
    setChildTable([
      { id: 101, name: 'Alice', deptId: 1 },
      { id: 102, name: 'Bob', deptId: 2 },
      { id: 103, name: 'Charlie', deptId: 1 }
    ]);
    setAnimationStep(null);
    setLog('Simulator reset to initial state.');
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>FK Delete Policy:</span>
      <select
        value={fkPolicy}
        onChange={(e) => {
          setFkPolicy(e.target.value);
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
        <option value="CASCADE">ON DELETE CASCADE (Delete Dependent Rows)</option>
        <option value="RESTRICT">ON DELETE RESTRICT (Block Delete if References Exist)</option>
        <option value="SET_NULL">ON DELETE SET NULL (Set Foreign Key to NULL)</option>
      </select>

      <button
        className="btn-viz-action btn-clear"
        onClick={handleDeleteParent}
        disabled={animationStep !== null || !parentTable.some(p => p.id === 1)}
      >
        Delete Department 1 (HR)
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset Tables
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Referential Integrity Stats</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>FK Constraint: <strong style={{ color: '#1591DC' }}>employees.dept_id {'->'} departments.id</strong></div>
          <div>Referencing Rows: <span>{childTable.filter(c => c.deptId === 1).length} pointing to Dept 1</span></div>
          <div>Active Policy: <strong style={{ color: '#1591DC' }}>{fkPolicy}</strong></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>Foreign Key (FK)</strong> is a column or set of columns in one table that references the Primary Key of another table, establishing a link between them:</p>
      <ul>
        <li><strong>Referential Integrity:</strong> Ensures that child records cannot point to non-existent parent rows.</li>
        <li><strong>On Delete Constraints:</strong> Specifies what happens when a referenced parent row is deleted:
          <ul>
            <li><strong>CASCADE:</strong> Automatically deletes corresponding rows in the child table.</li>
            <li><strong>RESTRICT / NO ACTION:</strong> Rejects the delete operation on the parent table if dependent rows exist.</li>
            <li><strong>SET NULL:</strong> Deletes the parent row and sets the foreign key values in the child table to NULL.</li>
          </ul>
        </li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Foreign Keys as **a Library Book Borrowing System**:</p>
      <ul>
        <li><strong>Parent Table (Books):</strong> Contains Book ID and Title.</li>
        <li><strong>Child Table (Borrow Records):</strong> Links Book ID to Borrower Name.</li>
        <li>If a book is active in borrow records:
          <ul>
            <li><strong>RESTRICT:</strong> You cannot delete the book from the catalog until it is returned.</li>
            <li><strong>CASCADE:</strong> Throwing away the catalog entry automatically deletes all history files.</li>
          </ul>
        </li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Orphaned Child Rows:</strong> Disabling constraints or using RAW deletes without specifying a policy, leading to row entries that point to non-existent parent IDs.</li>
      <li><strong>Mismatched Schema Types:</strong> Setting the parent key to `INT` and the child foreign key column to `VARCHAR`, causing severe parsing and link-indexing errors.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is Referential Integrity?',
      a: 'Referential Integrity is a relational database rule ensuring that foreign keys in child tables always point to valid, existing primary keys in parent tables, preventing orphaned data records.'
    },
    {
      q: 'What happens during a Delete operation if "RESTRICT" is configured?',
      a: 'If dependent records exist in the child table, the database rejects the delete operation on the parent table and returns a foreign key constraint violation error.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which foreign key delete policy sets child foreign key columns to empty values when the parent is deleted?',
      options: [
        'CASCADE',
        'RESTRICT',
        'SET NULL',
        'SET DEFAULT'
      ],
      correctIdx: 2,
      explanation: 'ON DELETE SET NULL resets the child table\'s referencing foreign key column value to NULL upon parent deletion.'
    },
    {
      question: 'What does CASCADE do when a parent row is deleted?',
      options: [
        'Blocks the delete operation',
        'Automatically deletes referencing child rows',
        'Sets child columns to zero',
        'Replicates the parent table'
      ],
      correctIdx: 1,
      explanation: 'CASCADE triggers a recursive deletion, wiping out any child rows containing foreign keys pointing to the deleted parent.'
    }
  ];

  return (
    <VisualizerShell
      title="Foreign Key Constraints"
      subtitle="Analyze parent-child table linkages. Observe CASCADE, RESTRICT, and SET NULL deletion behavior."
      timeComplexity="O(log N) lookup check"
      spaceComplexity="O(N + M) relation records"
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
          {/* Parent Table: Departments */}
          <g>
            <rect x="20" y="45" width="130" height="110" fill="#000000" stroke="#1591DC" strokeWidth="2" rx="3" />
            <text x="85" y="60" textAnchor="middle" fill="#1591DC" fontSize="0.52rem" fontWeight="bold">Parent: Departments</text>

            {parentTable.map((p, idx) => {
              const isDeleting = animationStep === 'DELETING_CHILDREN' && p.id === 1;
              return (
                <g key={p.id}>
                  <rect
                    x="30"
                    y={75 + idx * 35}
                    width="110"
                    height="24"
                    fill="#000000"
                    stroke={isDeleting ? '#FFFFFF' : 'var(--bg-tertiary)'}
                    strokeWidth={isDeleting ? '2.5' : '1'}
                    rx="2"
                  />
                  <text x="85" y="91 + idx * 35" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">
                    ID: {p.id} | {p.name}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Child Table: Employees */}
          <g>
            <rect x="290" y="30" width="140" height="145" fill="#000000" stroke="#1591DC" strokeWidth="2" rx="3" />
            <text x="360" y="45" textAnchor="middle" fill="#1591DC" fontSize="0.52rem" fontWeight="bold">Child: Employees</text>

            {childTable.map((c, idx) => {
              const isScanning = animationStep === 'SCANNING' && c.deptId === 1;
              const isTargeted = animationStep === 'DELETING_CHILDREN' && c.deptId === 1;
              let strokeCol = 'var(--bg-tertiary)';
              if (isScanning) strokeCol = '#1591DC';
              if (isTargeted) strokeCol = '#FFFFFF';

              return (
                <g key={c.id}>
                  <rect
                    x="300"
                    y={60 + idx * 32}
                    width="120"
                    height="24"
                    fill="#000000"
                    stroke={strokeCol}
                    strokeWidth={isScanning || isTargeted ? '2' : '1'}
                    rx="2"
                  />
                  <text x="360" y="76 + idx * 32" textAnchor="middle" fill="#FFFFFF" fontSize="0.4rem">
                    ID: {c.id} | {c.name} | Dept_ID: {c.deptId === null ? 'NULL' : c.deptId}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Relationship Connection Lines */}
          {childTable.map((c, idx) => {
            if (c.deptId === null) return null;
            const parentIdx = parentTable.findIndex(p => p.id === c.deptId);
            if (parentIdx === -1) return null;
            
            const startY = 87 + parentIdx * 35;
            const endY = 72 + idx * 32;
            const isScanning = animationStep === 'SCANNING' && c.deptId === 1;
            const isTargeted = animationStep === 'DELETING_CHILDREN' && c.deptId === 1;

            let strokeColor = '#1591DC';
            if (isScanning) strokeColor = '#1591DC';
            if (isTargeted) strokeColor = '#FFFFFF';

            return (
              <line
                key={`rel-${c.id}`}
                x1="140"
                y1={startY}
                x2="300"
                y2={endY}
                stroke={strokeColor}
                strokeWidth={isScanning || isTargeted ? '2' : '1'}
                strokeDasharray={isTargeted ? '4,4' : 'none'}
              />
            );
          })}

          {/* Constraint check popup */}
          {animationStep === 'BLOCKED' && (
            <g>
              <rect x="155" y="80" width="130" height="50" fill="#000000" stroke="#FFFFFF" strokeWidth="2" rx="3" />
              <text x="220" y="103" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">✕ RESTRICTED</text>
              <text x="220" y="118" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.4rem">Delete Blocked</text>
            </g>
          )}
        </svg>
      </div>
    </VisualizerShell>
  );
}
