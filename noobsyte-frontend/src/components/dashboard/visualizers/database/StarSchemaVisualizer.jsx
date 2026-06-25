import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function StarSchemaVisualizer() {
  const [activeQuery, setActiveQuery] = useState(false);
  const [pagesAccessed, setPagesAccessed] = useState(0);
  const [activeJoinPath, setActiveJoinPath] = useState(null); // 'NONE', 'PRODUCT', 'STORE'
  const [log, setLog] = useState('Star Schema loaded. Run aggregation queries to observe single-hop joins.');

  const runQuery = (path) => {
    setActiveQuery(true);
    setActiveJoinPath(path);
    setPagesAccessed(0);

    if (path === 'PRODUCT') {
      setLog('Query: SELECT SUM(amount), category_name FROM Fact_Sales JOIN Dim_Product GROUP BY category_name...');
      setTimeout(() => {
        setPagesAccessed(2);
        setLog('[Star Join] Scanned Fact_Sales -> Joined Dim_Product directly on product_id. Resolved category_name with 1 JOIN! 2 tables accessed.');
        setActiveQuery(false);
      }, 1200);
    } else {
      setLog('Query: SELECT SUM(amount), region_name FROM Fact_Sales JOIN Dim_Store GROUP BY region_name...');
      setTimeout(() => {
        setPagesAccessed(2);
        setLog('[Star Join] Scanned Fact_Sales -> Joined Dim_Store directly on store_id. Resolved region_name with 1 JOIN! 2 tables accessed.');
        setActiveQuery(false);
      }, 1200);
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
      <button className="btn-viz-action btn-add" onClick={() => runQuery('PRODUCT')} disabled={activeQuery}>
        Query Sales by Category
      </button>

      <button className="btn-viz-action btn-add" onClick={() => runQuery('STORE')} disabled={activeQuery}>
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
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Schema Denormalization Details</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          <div>Dimension Style: <strong style={{ color: '#1591DC' }}>Denormalized (Wide)</strong></div>
          <div>Redundancy Rate: <strong style={{ color: '#1591DC' }}>High (Text duplicated)</strong></div>
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
          <div>Join Overhead: <strong style={{ color: '#1591DC' }}>Low (Single-hop joins)</strong></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>Star Schema</strong> is a multidimensional database layout where a central Fact table connects directly to flattened, denormalized Dimension tables:</p>
      <ul>
        <li><strong>Fact Table:</strong> Stores numerical metrics (keys, sales, amounts) representing transactional measurements.</li>
        <li><strong>Denormalized Dimensions:</strong> Dimension tables (like Product) are kept flat and wide, containing redundant descriptive fields (like category names and supplier details) in single tables.</li>
        <li><strong>Read Performance:</strong> Since dimensions are flat, analytical queries require only a single join to fetch descriptive attributes, reducing database CPU work.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of the Star Schema as a **supermarket item tagging policy**:</p>
      <ul>
        <li>Every single shirt in the store has a tag that explicitly lists the Brand Name, Supplier Phone Number, and Address printed on it. This duplicates writing details on every single tag (wasteful of label paper), but checking the brand details requires reading only one tag instantly.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Normalizing columns in Star schemas:</strong> Trying to split product categories into separate lookup files, turning the schema back into a Snowflake design and degrading read speed.</li>
      <li><strong>Treating Star as OLTP transactional:</strong> Running frequent, atomic row writes (updates/deletes) on wide, denormalized tables, creating massive file writing locks.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Why does a Star Schema perform faster than a Snowflake Schema for analytical queries?',
      a: 'A Star Schema keeps all dimension attributes in a single, flat table. Resolving queries requires only one join per dimension (e.g., Fact -> Product) instead of multi-level joins (e.g., Fact -> Product -> Subcategory -> Category), minimizing execution tree depths.'
    },
    {
      q: 'What is the main drawback of a Star Schema?',
      a: 'High data redundancy. Descriptive text attributes (like product categories) are repeated across millions of dimension rows, consuming significantly more disk storage and complicating batch updates.'
    }
  ];

  const quizQuestions = [
    {
      question: 'How are dimension tables organized in a Star Schema?',
      options: [
        'They are normalized into multiple parent-child relations',
        'They are denormalized into single, flat tables containing descriptive text',
        'They are saved as index-only files in memory',
        'They bypass primary key checks'
      ],
      correctIdx: 1,
      explanation: 'In a Star Schema, dimension tables are denormalized and flat, storing descriptive attributes directly in the same row.'
    },
    {
      question: 'Which metric is optimized when choosing a Star Schema for a data warehouse database?',
      options: [
        'Write transactional throughput',
        'Read query performance and simplicity of joins',
        'Disk storage footprint space reduction',
        'Referential cascading constraints speed'
      ],
      correctIdx: 1,
      explanation: 'Flattened dimensions minimize join complexities, yielding fast aggregates and simplified SQL queries.'
    }
  ];

  return (
    <VisualizerShell
      title="Star Schema"
      subtitle="Understand denormalized layouts, single-join query mappings, and read performance advantages."
      timeComplexity="Query Join: O(N) single-hop"
      spaceComplexity="O(N * C) duplicated storage footprint"
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

            {/* Left Branch: Product (Flat/Denormalized) */}
            <g>
              {/* Join line Fact -> Product */}
              <line 
                x1="175" 
                y1="100" 
                x2="95" 
                y2="100" 
                stroke={activeJoinPath === 'PRODUCT' ? '#1591DC' : 'rgba(255,255,255,0.4)'} 
                strokeWidth={activeJoinPath === 'PRODUCT' ? '3' : '1.5'} 
              />
              <rect x="5" y="65" width="90" height="70" rx="2" fill="#000000" stroke={activeJoinPath === 'PRODUCT' ? '#1591DC' : 'rgba(255,255,255,0.4)'} strokeWidth="1.5" />
              <text x="50" y="80" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem" fontWeight="bold">Dim_Product</text>
              <text x="50" y="95" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.38rem">product_id (PK)</text>
              <text x="50" y="110" textAnchor="middle" fill="#FFFFFF" fontSize="0.38rem">product_name</text>
              <text x="50" y="125" textAnchor="middle" fill="#1591DC" fontSize="0.38rem">category_name</text>
            </g>

            {/* Right Branch: Store (Flat/Denormalized) */}
            <g>
              {/* Join line Fact -> Store */}
              <line 
                x1="275" 
                y1="100" 
                x2="355" 
                y2="100" 
                stroke={activeJoinPath === 'STORE' ? '#1591DC' : 'rgba(255,255,255,0.4)'} 
                strokeWidth={activeJoinPath === 'STORE' ? '3' : '1.5'} 
              />
              <rect x="355" y="65" width="90" height="70" rx="2" fill="#000000" stroke={activeJoinPath === 'STORE' ? '#1591DC' : 'rgba(255,255,255,0.4)'} strokeWidth="1.5" />
              <text x="400" y="80" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem" fontWeight="bold">Dim_Store</text>
              <text x="400" y="95" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.38rem">store_id (PK)</text>
              <text x="400" y="110" textAnchor="middle" fill="#FFFFFF" fontSize="0.38rem">store_name</text>
              <text x="400" y="125" textAnchor="middle" fill="#1591DC" fontSize="0.38rem">region_name</text>
            </g>

          </svg>
        </div>
      </div>
    </VisualizerShell>
  );
}
