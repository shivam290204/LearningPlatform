import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function NormalizationVisualizer() {
  const [selectedDb, setSelectedDb] = useState('STUDENT'); // 'STUDENT', 'ORDER', 'EMPLOYEE'
  const [normalForm, setNormalForm] = useState('UNNORMALIZED'); // 'UNNORMALIZED', '1NF', '2NF', '3NF'
  const [log, setLog] = useState('Select database scenario and normalization level to inspect schema transformation.');

  const handleLevelChange = (level) => {
    setNormalForm(level);
    switch (level) {
      case 'UNNORMALIZED':
        setLog('Displaying original, raw denormalized table with massive redundancy and update anomalies.');
        break;
      case '1NF':
        setLog('1NF Applied: Ensured all columns contain atomic, single-valued attributes. No repeating groups.');
        break;
      case '2NF':
        setLog('2NF Applied: Met 1NF requirements + removed all partial dependencies. Split composite key tables.');
        break;
      case '3NF':
        setLog('3NF Applied: Met 2NF requirements + removed all transitive dependencies. Non-key columns only depend on Primary Key.');
        break;
      default:
        break;
    }
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Scenario:</span>
      <select
        value={selectedDb}
        onChange={(e) => {
          setSelectedDb(e.target.value);
          handleLevelChange('UNNORMALIZED');
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
        <option value="STUDENT">Student Database</option>
        <option value="ORDER">Order Database</option>
        <option value="EMPLOYEE">Employee Database</option>
      </select>

      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Normal Form:</span>
      {['UNNORMALIZED', '1NF', '2NF', '3NF'].map(level => (
        <button
          key={level}
          onClick={() => handleLevelChange(level)}
          style={{
            padding: '0.4rem 0.6rem',
            border: normalForm === level ? '1px solid #1591DC' : '1px solid var(--bg-tertiary)',
            backgroundColor: normalForm === level ? 'rgba(21, 145, 220, 0.1)' : 'var(--bg-primary)',
            color: normalForm === level ? '#1591DC' : '#FFFFFF',
            borderRadius: '4px',
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          {level}
        </button>
      ))}
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Schema Analysis Metrics</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Redundancy Level: <strong style={{ color: normalForm === '3NF' ? '#FFFFFF' : '#1591DC' }}>
            {normalForm === 'UNNORMALIZED' ? 'Critical' : normalForm === '1NF' ? 'High' : normalForm === '2NF' ? 'Medium' : 'Zero (Normalized)'}
          </strong></div>
          <div>Dependency Issues: <span>
            {normalForm === 'UNNORMALIZED' ? 'Partial & Transitive' : normalForm === '1NF' ? 'Partial & Transitive' : normalForm === '2NF' ? 'Transitive' : 'None'}
          </span></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p><strong>Database Normalization</strong> is the process of structuring a relational database schema to reduce data redundancy and improve data integrity:</p>
      <ul>
        <li><strong>First Normal Form (1NF):</strong> All table attributes must contain atomic (indivisible) values. No multi-valued attributes or repeating groups.</li>
        <li><strong>Second Normal Form (2NF):</strong> Met 1NF requirements, and all non-key columns must depend on the *entire* primary key (eliminating partial dependencies).</li>
        <li><strong>Third Normal Form (3NF):</strong> Met 2NF requirements, and no non-key columns can depend on other non-key columns (eliminating transitive dependencies).</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Normalization as **cleaning and organizing a cluttered toolbox**:</p>
      <ul>
        <li><strong>Unnormalized:</strong> Toss all screws, hammers, blueprints, and vendor receipts into one single bucket. Trying to update a screw type requires sorting through everything.</li>
        <li><strong>1NF:</strong> Separate screws from hammers (make fields atomic).</li>
        <li><strong>2NF:</strong> Put screws in one drawer, blueprints in a filing cabinet, and receipts in another folder, categorized by department.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Over-normalizing:</strong> Splitting tables into dozens of tiny relations when they are always queried together. This forces complex multi-table joins that degrade query speed.</li>
      <li><strong>Ignoring Null constraints:</strong> Forgetting that decomposing tables might require defining foreign key null behaviors.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is a Transitive Dependency?',
      a: 'A transitive dependency occurs in a relation when a non-key column depends on another non-key column, which in turn depends on the primary key (e.g. A -> B and B -> C, therefore C transitively depends on A). It is eliminated in 3NF.'
    },
    {
      q: 'When would you deliberately De-normalize a database?',
      a: 'Denormalization is used in high-read environments or data warehouses (OLAP) to minimize expensive JOIN queries and speed up SELECT reports by storing pre-computed redundant fields.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which normal form is violated if a "Student" table has a composite primary key (Student_ID, Course_ID) and a column "Course_Fees" that depends only on Course_ID?',
      options: [
        '1NF',
        '2NF',
        '3NF',
        'BCNF'
      ],
      correctIdx: 1,
      explanation: 'Since "Course_Fees" depends on only part of the composite primary key (Course_ID), it is a partial dependency, violating 2NF.'
    },
    {
      question: 'What dependency type is eliminated when transitioning from 2NF to 3NF?',
      options: [
        'Partial dependency',
        'Transitive dependency',
        'Trivial dependency',
        'Multivalued dependency'
      ],
      correctIdx: 1,
      explanation: '3NF removes transitive dependencies where non-key attributes depend on other non-key attributes.'
    }
  ];

  // Helper to render columns and tables based on selected state
  const renderDbSchema = () => {
    if (selectedDb === 'STUDENT') {
      if (normalForm === 'UNNORMALIZED' || normalForm === '1NF') {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#1591DC', fontWeight: 'bold' }}>Single Denormalized Table: Students_Courses</span>
            <table style={{ width: '100%', maxWidth: '440px', borderCollapse: 'collapse', fontSize: '0.75rem', border: '1px solid #1591DC', backgroundColor: '#000000' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #1591DC', backgroundColor: 'rgba(21, 145, 220, 0.05)' }}>
                  <th style={{ padding: '0.4rem', color: '#1591DC' }}>student_id (PK)</th>
                  <th style={{ padding: '0.4rem', color: '#FFFFFF' }}>name</th>
                  <th style={{ padding: '0.4rem', color: '#FFFFFF' }}>course_id (PK)</th>
                  <th style={{ padding: '0.4rem', color: '#FFFFFF' }}>course_name</th>
                  <th style={{ padding: '0.4rem', color: '#FFFFFF' }}>dept_name</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--bg-tertiary)' }}>
                  <td style={{ padding: '0.4rem', color: '#1591DC', fontWeight: 'bold' }}>1</td>
                  <td style={{ padding: '0.4rem', color: '#FFFFFF' }}>Alice</td>
                  <td style={{ padding: '0.4rem', color: '#FFFFFF' }}>CS101</td>
                  <td style={{ padding: '0.4rem', color: '#FFFFFF' }}>Intro CS</td>
                  <td style={{ padding: '0.4rem', color: '#1591DC' }}>Computer Science</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--bg-tertiary)' }}>
                  <td style={{ padding: '0.4rem', color: '#1591DC', fontWeight: 'bold' }}>1</td>
                  <td style={{ padding: '0.4rem', color: '#FFFFFF' }}>Alice</td>
                  <td style={{ padding: '0.4rem', color: '#FFFFFF' }}>CS102</td>
                  <td style={{ padding: '0.4rem', color: '#FFFFFF' }}>Data Structures</td>
                  <td style={{ padding: '0.4rem', color: '#1591DC' }}>Computer Science</td>
                </tr>
              </tbody>
            </table>
            {normalForm === 'UNNORMALIZED' && (
              <div style={{ color: '#1591DC', fontSize: '0.7rem', marginTop: '0.35rem' }}>
                Note: multi-valued course lists would violate 1NF.
              </div>
            )}
          </div>
        );
      } else if (normalForm === '2NF') {
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '100%', justifyContent: 'center' }}>
            {/* Table 1: Students */}
            <div style={{ minWidth: '200px' }}>
              <span style={{ fontSize: '0.72rem', color: '#1591DC', fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>Table 1: Students</span>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem', border: '1px solid #1591DC', backgroundColor: '#000000' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #1591DC' }}>
                    <th style={{ padding: '0.3rem', color: '#1591DC' }}>student_id (PK)</th>
                    <th style={{ padding: '0.3rem', color: '#FFFFFF' }}>name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '0.3rem', fontWeight: 'bold', color: '#1591DC' }}>1</td>
                    <td style={{ padding: '0.3rem', color: '#FFFFFF' }}>Alice</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Table 2: Courses */}
            <div style={{ minWidth: '220px' }}>
              <span style={{ fontSize: '0.72rem', color: '#1591DC', fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>Table 2: Courses_Enrollment</span>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem', border: '1px solid #1591DC', backgroundColor: '#000000' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #1591DC' }}>
                    <th style={{ padding: '0.3rem', color: '#1591DC' }}>student_id (FK)</th>
                    <th style={{ padding: '0.3rem', color: '#FFFFFF' }}>course_id</th>
                    <th style={{ padding: '0.3rem', color: '#FFFFFF' }}>course_name</th>
                    <th style={{ padding: '0.3rem', color: '#FFFFFF' }}>dept_name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '0.3rem', fontWeight: 'bold', color: '#1591DC' }}>1</td>
                    <td style={{ padding: '0.3rem', color: '#FFFFFF' }}>CS101</td>
                    <td style={{ padding: '0.3rem', color: '#FFFFFF' }}>Intro CS</td>
                    <td style={{ padding: '0.3rem', color: '#1591DC' }}>Computer Science</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ color: '#1591DC', fontSize: '0.65rem', marginTop: '0.25rem' }}>
                Anomaly remaining: dept_name depends transitively on course_id (violating 3NF).
              </div>
            </div>
          </div>
        );
      } else {
        // 3NF
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '100%', justifyContent: 'center' }}>
            <div style={{ minWidth: '130px' }}>
              <span style={{ fontSize: '0.72rem', color: '#1591DC', fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>Table 1: Students</span>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem', border: '1px solid #1591DC', backgroundColor: '#000000' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #1591DC' }}>
                    <th style={{ padding: '0.3rem', color: '#1591DC' }}>student_id (PK)</th>
                    <th style={{ padding: '0.3rem', color: '#FFFFFF' }}>name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '0.3rem', fontWeight: 'bold', color: '#1591DC' }}>1</td>
                    <td style={{ padding: '0.3rem', color: '#FFFFFF' }}>Alice</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ minWidth: '150px' }}>
              <span style={{ fontSize: '0.72rem', color: '#1591DC', fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>Table 2: Enrollment</span>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem', border: '1px solid #1591DC', backgroundColor: '#000000' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #1591DC' }}>
                    <th style={{ padding: '0.3rem', color: '#1591DC' }}>student_id</th>
                    <th style={{ padding: '0.3rem', color: '#FFFFFF' }}>course_id</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '0.3rem', fontWeight: 'bold', color: '#1591DC' }}>1</td>
                    <td style={{ padding: '0.3rem', color: '#FFFFFF' }}>CS101</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ minWidth: '180px' }}>
              <span style={{ fontSize: '0.72rem', color: '#1591DC', fontWeight: 'bold', display: 'block', marginBottom: '0.2rem' }}>Table 3: Courses</span>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem', border: '1px solid #1591DC', backgroundColor: '#000000' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid #1591DC' }}>
                    <th style={{ padding: '0.3rem', color: '#1591DC' }}>course_id (PK)</th>
                    <th style={{ padding: '0.3rem', color: '#FFFFFF' }}>course_name</th>
                    <th style={{ padding: '0.3rem', color: '#FFFFFF' }}>dept_name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '0.3rem', fontWeight: 'bold', color: '#1591DC' }}>CS101</td>
                    <td style={{ padding: '0.3rem', color: '#FFFFFF' }}>Intro CS</td>
                    <td style={{ padding: '0.3rem', color: '#FFFFFF' }}>Computer Science</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      }
    } else {
      // ORDER or EMPLOYEE mockups follow standard structure
      return (
        <div style={{ color: '#FFFFFF', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center', width: '100%' }}>
          Database schema decomposed matching {selectedDb} rules. Select Student Database to trace full grid columns.
        </div>
      );
    }
  };

  return (
    <VisualizerShell
      title="Normalization Lab"
      subtitle="Analyze table decompositions from Unnormalized states down to 3NF. Observe dependency resolutions."
      timeComplexity="O(N * M) decomposition split"
      spaceComplexity="O(R * C) dynamic table space"
      theoryContent={theory}
      analogyContent={analogy}
      mistakesContent={mistakes}
      interviewQuestions={interviewQuestions}
      quizQuestions={quizQuestions}
      controls={controls}
      logs={[log]}
      stateInspector={stateInspector}
    >
      <div style={{ padding: '1rem 0', width: '100%', minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {renderDbSchema()}
      </div>
    </VisualizerShell>
  );
}
