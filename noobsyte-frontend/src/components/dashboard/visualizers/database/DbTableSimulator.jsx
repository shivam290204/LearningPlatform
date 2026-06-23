import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function DbTableSimulator() {
  const [tableRows, setTableRows] = useState([
    { id: 1, name: 'Alice', age: 24 },
    { id: 2, name: 'Bob', age: 29 },
    { id: 3, name: 'Charlie', age: 22 }
  ]);
  const [inputId, setInputId] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputAge, setInputAge] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [log, setLog] = useState('Table Simulator ready. Add, update, or delete rows.');
  const [highlightedRowId, setHighlightedRowId] = useState(null);

  const handleAddRow = () => {
    if (!inputId || !inputName || !inputAge) {
      setLog('Error: All columns (ID, Name, Age) must be filled.');
      return;
    }
    const numId = parseInt(inputId, 10);
    const numAge = parseInt(inputAge, 10);

    if (isNaN(numId) || isNaN(numAge)) {
      setLog('Error: ID and Age must be numeric values.');
      return;
    }

    // Primary Key unique validation check
    const duplicate = tableRows.find(row => row.id === numId);
    if (duplicate) {
      setLog(`Primary Key Constraint Violation: Duplicate ID ${numId} rejected. IDs must be unique.`);
      setHighlightedRowId(numId);
      setTimeout(() => setHighlightedRowId(null), 1500);
      return;
    }

    setTableRows([...tableRows, { id: numId, name: inputName, age: numAge }]);
    setLog(`Inserted row: (${numId}, "${inputName}", ${numAge}) successfully.`);
    setInputId('');
    setInputName('');
    setInputAge('');
  };

  const handleDeleteRow = (id) => {
    setTableRows(tableRows.filter(row => row.id !== id));
    setLog(`Deleted row with ID ${id}.`);
    if (editingId === id) {
      setEditingId(null);
      setInputId('');
      setInputName('');
      setInputAge('');
    }
  };

  const handleStartEdit = (row) => {
    setEditingId(row.id);
    setInputId(row.id.toString());
    setInputName(row.name);
    setInputAge(row.age.toString());
    setLog(`Editing row ID ${row.id}. Update values and click Save.`);
  };

  const handleSaveEdit = () => {
    const numId = parseInt(inputId, 10);
    const numAge = parseInt(inputAge, 10);

    if (isNaN(numId) || isNaN(numAge)) {
      setLog('Error: ID and Age must be numeric values.');
      return;
    }

    // If ID changed, ensure it is unique
    if (numId !== editingId) {
      const duplicate = tableRows.find(row => row.id === numId);
      if (duplicate) {
        setLog(`Primary Key Constraint Violation: Duplicate ID ${numId} rejected.`);
        setHighlightedRowId(numId);
        setTimeout(() => setHighlightedRowId(null), 1500);
        return;
      }
    }

    setTableRows(tableRows.map(row => 
      row.id === editingId ? { id: numId, name: inputName, age: numAge } : row
    ));
    setLog(`Updated row ID ${editingId} to: (${numId}, "${inputName}", ${numAge}).`);
    setEditingId(null);
    setInputId('');
    setInputName('');
    setInputAge('');
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <input
        type="text"
        placeholder="ID (Primary Key)"
        value={inputId}
        disabled={editingId !== null}
        onChange={(e) => setInputId(e.target.value)}
        style={{
          padding: '0.4rem 0.6rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem',
          width: '130px'
        }}
      />
      <input
        type="text"
        placeholder="Name"
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
        style={{
          padding: '0.4rem 0.6rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem',
          width: '130px'
        }}
      />
      <input
        type="text"
        placeholder="Age"
        value={inputAge}
        onChange={(e) => setInputAge(e.target.value)}
        style={{
          padding: '0.4rem 0.6rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem',
          width: '80px'
        }}
      />

      {editingId !== null ? (
        <button className="btn-viz-action btn-add" onClick={handleSaveEdit}>
          Save Updates
        </button>
      ) : (
        <button className="btn-viz-action btn-add" onClick={handleAddRow}>
          Insert Row
        </button>
      )}

      {editingId !== null && (
        <button className="btn-viz-action btn-clear" onClick={() => {
          setEditingId(null);
          setInputId('');
          setInputName('');
          setInputAge('');
          setLog('Edit cancelled.');
        }}>
          Cancel
        </button>
      )}
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Table Metadata</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Table Name: <strong style={{ color: '#1591DC' }}>Users</strong></div>
          <div>Total Rows: <span>{tableRows.length}</span></div>
          <div>Primary Key: <strong style={{ color: '#1591DC' }}>id (INT)</strong></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>Database Table</strong> is a collection of related data entries structured in a grid layout of columns and rows:</p>
      <ul>
        <li><strong>Columns (Fields):</strong> Define the schema attribute categories (e.g. ID, Name, Age).</li>
        <li><strong>Rows (Records/Tuples):</strong> Represent individual data entries.</li>
        <li><strong>Primary Key (PK):</strong> A column (or set of columns) that uniquely identifies each row. It must be unique and cannot contain NULL values.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of a Database Table as **a Spreadsheet of Student Enrollments**:</p>
      <ul>
        <li>The columns are "Roll Number," "Full Name," and "Class."</li>
        <li>Each row is an individual student.</li>
        <li>The **Roll Number** acts as the Primary Key. No two students can have the same roll number, and every student must have one.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Missing Primary Key:</strong> Building tables without a primary key makes it extremely slow to delete or update specific records.</li>
      <li><strong>Violating PK Constraints:</strong> Trying to insert a record with an existing ID, which crashes the database transaction.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is a Primary Key and what constraints does it enforce?',
      a: 'A Primary Key is a column or group of columns that uniquely identifies a row in a table. It implicitly enforces two constraints: UNIQUE (no two rows can have the same key) and NOT NULL (the key cannot be empty).'
    },
    {
      q: 'Can a database table have multiple Primary Keys?',
      a: 'No. A table can have only one Primary Key. However, a Primary Key can consist of multiple columns, which is called a Composite Primary Key.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which of the following is true for a Primary Key?',
      options: [
        'It can contain duplicate values',
        'It can contain NULL values',
        'It must be unique and cannot be NULL',
        'It must be a foreign key'
      ],
      correctIdx: 2,
      explanation: 'A primary key uniquely identifies records and cannot be NULL.'
    },
    {
      question: 'What error occurs if you try to insert an ID that already exists in the primary key column?',
      options: [
        'Foreign Key violation',
        'Primary Key constraint violation',
        'Data truncation error',
        'Out of memory error'
      ],
      correctIdx: 1,
      explanation: 'The database rejects the write with a Unique Key constraint violation (duplicate key rejected).'
    }
  ];

  return (
    <VisualizerShell
      title="Database Table Simulator"
      subtitle="Interact with rows, verify primary key constraint unique checks, and manage table structures."
      timeComplexity="O(1) PK Lookup"
      spaceComplexity="O(R * C) records"
      theoryContent={theory}
      analogyContent={analogy}
      mistakesContent={mistakes}
      interviewQuestions={interviewQuestions}
      quizQuestions={quizQuestions}
      controls={controls}
      logs={[log]}
      stateInspector={stateInspector}
    >
      <div style={{ padding: '1rem 0', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <table style={{
          width: '100%',
          maxWidth: '450px',
          borderCollapse: 'collapse',
          fontSize: '0.85rem',
          backgroundColor: '#000000',
          border: '1px solid #1591DC'
        }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #1591DC', backgroundColor: '#000000' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left', color: '#1591DC' }}>id (PK)</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', color: '#FFFFFF' }}>name</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', color: '#FFFFFF' }}>age</th>
              <th style={{ padding: '0.5rem', textAlign: 'center', color: '#1591DC' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map(row => {
              const isHighlighted = highlightedRowId === row.id;
              return (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: '1px solid #1591DC',
                    backgroundColor: isHighlighted ? 'rgba(21, 145, 220, 0.2)' : 'transparent',
                    transition: 'background-color 0.3s ease'
                  }}
                >
                  <td style={{ padding: '0.5rem', fontWeight: 'bold', color: '#1591DC' }}>{row.id}</td>
                  <td style={{ padding: '0.5rem', color: '#FFFFFF' }}>{row.name}</td>
                  <td style={{ padding: '0.5rem', color: '#FFFFFF' }}>{row.age}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                    <button
                      onClick={() => handleStartEdit(row)}
                      style={{
                        marginRight: '0.5rem',
                        backgroundColor: 'transparent',
                        border: '1px solid #1591DC',
                        color: '#1591DC',
                        borderRadius: '3px',
                        padding: '2px 6px',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRow(row.id)}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #FFFFFF',
                        color: '#FFFFFF',
                        borderRadius: '3px',
                        padding: '2px 6px',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </VisualizerShell>
  );
}
