import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function SnowflakeSchemaVisualizer() {
  const [activeQuery, setActiveQuery] = useState(false);
  const [pagesAccessed, setPagesAccessed] = useState(0);
  const [activeJoinPath, setActiveJoinPath] = useState(null); // 'NONE', 'PROD_CAT', 'STORE_REG'
  const [log, setLog] = useState('Snowflake Schema loaded. Trigger query to analyze join paths.');

  const runQuery = (path) => {
    setActiveQuery(true);
    setActiveJoinPath(path);
    setPagesAccessed(0);

    if (path === 'PROD_CAT') {
      setLog('Query: SELECT SUM(amount), category_name FROM Fact_Sales JOIN Dim_Product JOIN Dim_Category...');
      setTimeout(() => {
        setPagesAccessed(3);
        setLog('[Snowflake Join] Scanned Fact_Sales -> Joined Dim_Product on product_id -> Joined Dim_Category on category_id. Success! 3 table pages accessed.');
        setActiveQuery(false);
      }, 1500);
    } else {
      setLog('Query: SELECT SUM(amount), region_name FROM Fact_Sales JOIN Dim_Store JOIN Dim_Region...');
      setTimeout(() => {
        setPagesAccessed(3);
        setLog('[Snowflake Join] Scanned Fact_Sales -> Joined Dim_Store on store_id -> Joined Dim_Region on region_id. Success! 3 table pages accessed.');
        setActiveQuery(false);
      }, 1500);
    }
  };

  const handleReset = () => {
    setActiveQuery(false);
    setActiveJoinPath(null);
    setPagesAccessed(0);
    setLog('Plan reset.');
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <button className="btn-viz-action btn-add" onClick={() => runQuery('PROD_CAT')} disabled={activeQuery}>
        Query Sales by Category
      </button>

      <button className="btn-viz-action btn-add" onClick={() => runQuery('STORE_REG')} disabled={activeQuery}>
        Query Sales by Region
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Schema Normalization Details</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          <div>Dimension Style: <strong style={{ color: '#1591DC' }}>Normalized (3NF)</strong></div>
          <div>Redundancy Rate: <strong style={{ color: '#1591DC' }}>Min (No text duplicates)</strong></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Performance Indicators</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          <div>Tables Accessed: <strong style={{ color: '#1591DC' }}>{pagesAccessed}</strong></div>
          <div>Join Overhead: <strong style={{ color: '#1591DC' }}>High (Multi-level joins)</strong></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>Snowflake Schema</strong> is a multidimensional database design where dimension tables are normalized into further lookup tables:</p>
      <ul>
        <li><strong>Normalized Dimensions:</strong> Splitting wide tables (like Product details) into separate tables (like Product and Category) removes string duplicates and saves disk space.</li>
        <li><strong>Snowflake Shape:</strong> The schema branches out from a central Fact table, resembling a snowflake.</li>
        <li><strong>Join Penalty:</strong> Querying details requires executing multi-level joins (<code>{'Fact -> Product -> Category'}</code>), which increases query overhead compared to denormalized schemas.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of the Snowflake Schema as a **well-organized department store system**:</p>
      <ul>
        <li>Instead of writing the brand\'s phone number on every clothing tag, the tag has a Brand ID. That Brand ID points to a Brand Book, which contains the Phone number. This saves space on tags, but you must look in two catalogs to find the phone number.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Over-normalizing simple attributes:</strong> Creating separate lookup tables for basic attributes like "is_active" or "gender", causing unnecessary joins.</li>
      <li><strong>Failing to partition fact tables:</strong> Querying normalized Snowflake relations without time ranges, causing database engines to load billions of rows over join pipelines.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Contrast Star Schema and Snowflake Schema.',
      a: 'A Star Schema keeps dimensions completely denormalized (flat, single-join table layouts, faster reads but duplicate strings). A Snowflake Schema normalizes dimension tables into nested sub-lookup tables (saves storage space, but requires complex multi-join queries).'
    },
    {
      q: 'When should you choose a Snowflake Schema?',
      a: 'When storage space optimization is critical, or when dimension attributes form hierarchies that are frequently queried independently (e.g. searching categories without loading product names).'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which of the following is an advantage of a Snowflake Schema over a Star Schema?',
      options: [
        'Faster query execution speed due to fewer joins',
        'Minimal data redundancy and smaller storage footprint',
        'Simpler query writing syntax',
        'No primary key indexes required'
      ],
      correctIdx: 1,
      explanation: 'Normalization splits duplicate textual categories and attributes into separate tables, minimizing redundancy and storage size.'
    },
    {
      question: 'What is the performance penalty of a Snowflake Schema?',
      options: [
        'It requires multi-level join operations to retrieve aggregated dimension details',
        'It disables write-ahead log files',
        'It increases row-level locks on tables',
        'It bypasses database memory pools'
      ],
      correctIdx: 0,
      explanation: 'Since dimension hierarchies are split, the query engine must join multiple tables (e.g., Fact -> Product -> Category) to resolve fields, adding CPU overhead.'
    }
  ];

  return (
    <VisualizerShell
      title="Snowflake Schema"
      subtitle="Observe normalized dimension hierarchies and multi-join analytical query executions."
      timeComplexity="Query Join traversal: O(J * N)"
      spaceComplexity="O(N) normalized storage"
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
            
            {/* Center: Fact Sales Table */}
            <g>
              <rect x="175" y="75" width="100" height="50" rx="3" fill="#000000" stroke="#1591DC" strokeWidth="2.5" />
              <text x="225" y="93" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Fact_Sales</text>
              <text x="225" y="105" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.38rem">product_id, store_id</text>
              <text x="225" y="117" textAnchor="middle" fill="#1591DC" fontSize="0.42rem" fontWeight="bold">Amount: $K</text>
            </g>

            {/* Left Branch: Product (Normalized) */}
            <g>
              {/* Join line Fact -> Product */}
              <line 
                x1="175" 
                y1="100" 
                x2="115" 
                y2="70" 
                stroke={activeJoinPath === 'PROD_CAT' ? '#1591DC' : 'rgba(255,255,255,0.4)'} 
                strokeWidth={activeJoinPath === 'PROD_CAT' ? '2.5' : '1.5'} 
              />
              <rect x="25" y="50" width="90" height="35" rx="2" fill="#000000" stroke={activeJoinPath === 'PROD_CAT' ? '#1591DC' : 'rgba(255,255,255,0.4)'} strokeWidth="1.5" />
              <text x="70" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem" fontWeight="bold">Dim_Product</text>
              <text x="70" y="77" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.38rem">id, name, cat_id</text>

              {/* Join line Product -> Category */}
              <line 
                x1="25" 
                y1="67" 
                x2="10" 
                y2="125" 
                stroke={activeJoinPath === 'PROD_CAT' ? '#1591DC' : 'rgba(255,255,255,0.3)'} 
                strokeWidth={activeJoinPath === 'PROD_CAT' ? '2' : '1'} 
                strokeDasharray="2,2"
              />
              <rect x="2" y="125" width="80" height="35" rx="2" fill="#000000" stroke={activeJoinPath === 'PROD_CAT' ? '#1591DC' : 'rgba(255,255,255,0.3)'} strokeWidth="1.2" />
              <text x="42" y="140" textAnchor="middle" fill={activeJoinPath === 'PROD_CAT' ? '#1591DC' : '#FFFFFF'} fontSize="0.42rem" fontWeight="bold">Dim_Category</text>
              <text x="42" y="152" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.35rem">cat_id, cat_name</text>
            </g>

            {/* Right Branch: Store (Normalized) */}
            <g>
              {/* Join line Fact -> Store */}
              <line 
                x1="275" 
                y1="100" 
                x2="335" 
                y2="70" 
                stroke={activeJoinPath === 'STORE_REG' ? '#1591DC' : 'rgba(255,255,255,0.4)'} 
                strokeWidth={activeJoinPath === 'STORE_REG' ? '2.5' : '1.5'} 
              />
              <rect x="335" y="50" width="90" height="35" rx="2" fill="#000000" stroke={activeJoinPath === 'STORE_REG' ? '#1591DC' : 'rgba(255,255,255,0.4)'} strokeWidth="1.5" />
              <text x="380" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem" fontWeight="bold">Dim_Store</text>
              <text x="380" y="77" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.38rem">id, name, reg_id</text>

              {/* Join line Store -> Region */}
              <line 
                x1="425" 
                y1="67" 
                x2="440" 
                y2="125" 
                stroke={activeJoinPath === 'STORE_REG' ? '#1591DC' : 'rgba(255,255,255,0.3)'} 
                strokeWidth={activeJoinPath === 'STORE_REG' ? '2' : '1'} 
                strokeDasharray="2,2"
              />
              <rect x="368" y="125" width="80" height="35" rx="2" fill="#000000" stroke={activeJoinPath === 'STORE_REG' ? '#1591DC' : 'rgba(255,255,255,0.3)'} strokeWidth="1.2" />
              <text x="408" y="140" textAnchor="middle" fill={activeJoinPath === 'STORE_REG' ? '#1591DC' : '#FFFFFF'} fontSize="0.42rem" fontWeight="bold">Dim_Region</text>
              <text x="408" y="152" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.35rem">reg_id, reg_name</text>
            </g>

          </svg>
        </div>
      </div>
    </VisualizerShell>
  );
}
