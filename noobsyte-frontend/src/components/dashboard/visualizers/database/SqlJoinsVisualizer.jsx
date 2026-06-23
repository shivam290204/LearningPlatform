import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function SqlJoinsVisualizer() {
  const [joinType, setJoinType] = useState('INNER'); // 'INNER', 'LEFT', 'RIGHT', 'FULL', 'CROSS', 'SELF'

  const tableA = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ];

  const tableB = [
    { userId: 2, item: 'Laptop' },
    { userId: 3, item: 'Phone' },
    { userId: 4, item: 'Book' }
  ];

  const getJoinResults = () => {
    switch (joinType) {
      case 'INNER':
        return [
          { id: 2, name: 'Bob', item: 'Laptop' },
          { id: 3, name: 'Charlie', item: 'Phone' }
        ];
      case 'LEFT':
        return [
          { id: 1, name: 'Alice', item: 'NULL' },
          { id: 2, name: 'Bob', item: 'Laptop' },
          { id: 3, name: 'Charlie', item: 'Phone' }
        ];
      case 'RIGHT':
        return [
          { id: 2, name: 'Bob', item: 'Laptop' },
          { id: 3, name: 'Charlie', item: 'Phone' },
          { id: 4, name: 'NULL', item: 'Book' }
        ];
      case 'FULL':
        return [
          { id: 1, name: 'Alice', item: 'NULL' },
          { id: 2, name: 'Bob', item: 'Laptop' },
          { id: 3, name: 'Charlie', item: 'Phone' },
          { id: 4, name: 'NULL', item: 'Book' }
        ];
      case 'CROSS':
        // Cartesian product
        const res = [];
        tableA.forEach(a => {
          tableB.forEach(b => {
            res.push({ id: a.id, name: a.name, item: b.item });
          });
        });
        return res;
      case 'SELF':
        // Match users with same ID (dummy example mapping)
        return [
          { id: 1, name: 'Alice', manager: 'Bob (ID: 2)' },
          { id: 2, name: 'Bob', manager: 'Charlie (ID: 3)' },
          { id: 3, name: 'Charlie', manager: 'NULL' }
        ];
      default:
        return [];
    }
  };

  const results = getJoinResults();

  const getSqlQuery = () => {
    switch (joinType) {
      case 'INNER':
        return 'SELECT A.name, B.item\nFROM Users A\nINNER JOIN Orders B ON A.id = B.user_id;';
      case 'LEFT':
        return 'SELECT A.name, B.item\nFROM Users A\nLEFT JOIN Orders B ON A.id = B.user_id;';
      case 'RIGHT':
        return 'SELECT A.name, B.item\nFROM Users A\nRIGHT JOIN Orders B ON A.id = B.user_id;';
      case 'FULL':
        return 'SELECT A.name, B.item\nFROM Users A\nFULL OUTER JOIN Orders B ON A.id = B.user_id;';
      case 'CROSS':
        return 'SELECT A.name, B.item\nFROM Users A\nCROSS JOIN Orders B;';
      case 'SELF':
        return 'SELECT A.name AS Employee, B.name AS Manager\nFROM Employees A\nLEFT JOIN Employees B ON A.manager_id = B.id;';
      default:
        return '';
    }
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select Join Type:</span>
      {['INNER', 'LEFT', 'RIGHT', 'FULL', 'CROSS', 'SELF'].map(type => (
        <button
          key={type}
          onClick={() => setJoinType(type)}
          style={{
            padding: '0.4rem 0.8rem',
            border: joinType === type ? '1px solid #1591DC' : '1px solid var(--bg-tertiary)',
            backgroundColor: joinType === type ? 'rgba(21, 145, 220, 0.1)' : 'var(--bg-primary)',
            color: joinType === type ? '#1591DC' : '#FFFFFF',
            borderRadius: '4px',
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          {type}
        </button>
      ))}
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Generated SQL Query</span>
        <pre style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.6rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem',
          color: '#1591DC',
          margin: 0,
          whiteSpace: 'pre-wrap'
        }}>
          {getSqlQuery()}
        </pre>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>An <strong>SQL JOIN</strong> clause is used to combine rows from two or more tables, based on a related column between them:</p>
      <ul>
        <li><strong>INNER JOIN:</strong> Returns records that have matching values in both tables.</li>
        <li><strong>LEFT JOIN:</strong> Returns all records from the left table, and matching records from the right table. (Unmatched right records return NULL).</li>
        <li><strong>RIGHT JOIN:</strong> Returns all records from the right table, and matching records from the left table.</li>
        <li><strong>FULL JOIN:</strong> Returns all records when there is a match in either left or right table.</li>
        <li><strong>CROSS JOIN:</strong> Returns the Cartesian product of records from the two tables.</li>
        <li><strong>SELF JOIN:</strong> A regular join operation, but the table is joined with itself.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Joins as **matching two ticket stubs at a movie theater**:</p>
      <ul>
        <li>Table A is the Guest Ticket list. Table B is the Movie Ticket list.</li>
        <li><strong>INNER JOIN:</strong> Only show people who successfully bought a ticket and sat in their assigned seat.</li>
        <li><strong>LEFT JOIN:</strong> Show all guests, listing their movies. If a guest bought no ticket, list their movie as NULL.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Missing ON Condition:</strong> Forgetting the `ON` matching join condition, which turns an inner join into an expensive cross join (Cartesian product).</li>
      <li><strong>Comparing Mismatched Types:</strong> Joining integer keys with string fields, leading to slow conversions and index lookup failures.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Explain the difference between LEFT JOIN and INNER JOIN.',
      a: 'INNER JOIN returns rows only if the join condition is satisfied in both tables. LEFT JOIN returns all rows from the left table, plus matched rows from the right. If no match exists, the right columns contain NULL values.'
    },
    {
      q: 'What is a CROSS JOIN?',
      a: 'A CROSS JOIN returns the Cartesian product of the two tables, pairing every row of the first table with every row of the second table.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which join type returns all records from Table A, even if there are no matches in Table B?',
      options: [
        'INNER JOIN',
        'LEFT JOIN',
        'RIGHT JOIN',
        'CROSS JOIN'
      ],
      correctIdx: 1,
      explanation: 'LEFT JOIN returns all records from the left table (A) along with matching entries from the right table (B).'
    },
    {
      question: 'How many rows are returned by a CROSS JOIN between a table with 3 rows and a table with 4 rows?',
      options: [
        '3 rows',
        '4 rows',
        '7 rows',
        '12 rows'
      ],
      correctIdx: 3,
      explanation: 'A CROSS JOIN produces a Cartesian product (3 * 4 = 12 rows).'
    }
  ];

  return (
    <VisualizerShell
      title="SQL Joins Visualizer"
      subtitle="Select join types and analyze the corresponding Venn diagrams, query builders, and resulting matches."
      timeComplexity="O(N + M) hash join"
      spaceComplexity="O(N + M) output size"
      theoryContent={theory}
      analogyContent={analogy}
      mistakesContent={mistakes}
      interviewQuestions={interviewQuestions}
      quizQuestions={quizQuestions}
      controls={controls}
      logs={[`Selected Join Type: ${joinType}`]}
      stateInspector={stateInspector}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', padding: '1rem 0' }}>
        
        {/* Venn Diagram Row */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <svg width="240" height="120" style={{ overflow: 'visible' }}>
            {/* Left Circle */}
            <circle
              cx="95"
              cy="60"
              r="40"
              fill={
                joinType === 'LEFT' || joinType === 'FULL'
                  ? 'rgba(21, 145, 220, 0.15)'
                  : joinType === 'CROSS'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'none'
              }
              stroke="#1591DC"
              strokeWidth="2.5"
            />
            <text x="70" y="64" textAnchor="middle" fill="#1591DC" fontSize="0.75rem" fontWeight="bold">Users A</text>

            {/* Right Circle */}
            <circle
              cx="145"
              cy="60"
              r="40"
              fill={
                joinType === 'RIGHT' || joinType === 'FULL'
                  ? 'rgba(21, 145, 220, 0.15)'
                  : joinType === 'CROSS'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'none'
              }
              stroke="#1591DC"
              strokeWidth="2.5"
            />
            <text x="170" y="64" textAnchor="middle" fill="#1591DC" fontSize="0.75rem" fontWeight="bold">Orders B</text>

            {/* Overlap Shading */}
            {(joinType === 'INNER' || joinType === 'LEFT' || joinType === 'RIGHT' || joinType === 'FULL') && (
              <path
                d="M 120 26.5 A 40 40 0 0 1 120 93.5 A 40 40 0 0 1 120 26.5"
                fill="rgba(21, 145, 220, 0.35)"
              />
            )}
          </svg>
        </div>

        {/* Input Tables Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="visualizer-grid-layout">
          <div>
            <span style={{ fontWeight: '700', color: '#1591DC', display: 'block', marginBottom: '0.25rem', fontSize: '0.78rem' }}>Table A: Users</span>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', border: '1px solid var(--bg-tertiary)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1591DC', backgroundColor: 'var(--bg-primary)' }}>
                  <th style={{ padding: '0.35rem', color: '#1591DC', textAlign: 'left' }}>id</th>
                  <th style={{ padding: '0.35rem', color: '#FFFFFF', textAlign: 'left' }}>name</th>
                </tr>
              </thead>
              <tbody>
                {tableA.map(row => (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--bg-tertiary)' }}>
                    <td style={{ padding: '0.35rem', color: '#1591DC', fontWeight: 'bold' }}>{row.id}</td>
                    <td style={{ padding: '0.35rem', color: '#FFFFFF' }}>{row.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <span style={{ fontWeight: '700', color: '#1591DC', display: 'block', marginBottom: '0.25rem', fontSize: '0.78rem' }}>Table B: Orders</span>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', border: '1px solid var(--bg-tertiary)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1591DC', backgroundColor: 'var(--bg-primary)' }}>
                  <th style={{ padding: '0.35rem', color: '#1591DC', textAlign: 'left' }}>user_id</th>
                  <th style={{ padding: '0.35rem', color: '#FFFFFF', textAlign: 'left' }}>item</th>
                </tr>
              </thead>
              <tbody>
                {tableB.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--bg-tertiary)' }}>
                    <td style={{ padding: '0.35rem', color: '#1591DC', fontWeight: 'bold' }}>{row.userId}</td>
                    <td style={{ padding: '0.35rem', color: '#FFFFFF' }}>{row.item}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Table */}
        <div>
          <span style={{ fontWeight: '700', color: '#1591DC', display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Resulting Join Table</span>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', border: '1px solid #1591DC' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #1591DC', backgroundColor: 'var(--bg-primary)' }}>
                <th style={{ padding: '0.4rem', color: '#1591DC', textAlign: 'left' }}>id / employee</th>
                <th style={{ padding: '0.4rem', color: '#FFFFFF', textAlign: 'left' }}>name</th>
                <th style={{ padding: '0.4rem', color: '#FFFFFF', textAlign: 'left' }}>{joinType === 'SELF' ? 'manager' : 'item'}</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #1591DC' }}>
                  <td style={{ padding: '0.4rem', color: '#1591DC', fontWeight: 'bold' }}>{row.id}</td>
                  <td style={{ padding: '0.4rem', color: '#FFFFFF' }}>{row.name}</td>
                  <td style={{ padding: '0.4rem', color: row.item === 'NULL' || row.manager === 'NULL' ? '#FFFFFF' : '#1591DC' }}>
                    {joinType === 'SELF' ? row.manager : row.item}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </VisualizerShell>
  );
}
