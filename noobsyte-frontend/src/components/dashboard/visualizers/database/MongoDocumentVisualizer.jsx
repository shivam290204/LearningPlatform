import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function MongoDocumentVisualizer() {
  const [selectedDoc, setSelectedDoc] = useState('PROFILE'); // 'PROFILE' or 'ORDER'
  const [activeHighlight, setActiveHighlight] = useState(null); // 'BASIC', 'NESTED', 'ARRAY'
  const [log, setLog] = useState('MongoDB Document Visualizer loaded. Hover over schema sections to highlight key BSON structures.');

  const profileJson = {
    _id: "ObjectId('65f12ab34')",
    name: "Alice Smith",
    contact: {
      email: "alice@example.com",
      phone: "+1-555-0199"
    },
    interests: ["coding", "database", "cycling"]
  };

  const orderJson = {
    _id: "ObjectId('65f88bc99')",
    order_no: "ORD-9921",
    customer_id: "ObjectId('65f12ab34')",
    items: [
      { prod: "Laptop", qty: 1, price: 1200 },
      { prod: "Mouse", qty: 2, price: 25 }
    ]
  };

  const getLogMessage = (sect) => {
    switch (sect) {
      case 'BASIC':
        return 'Highlight: Root Primitive attributes (ObjectId, Strings, Numbers). Stored as top-level BSON elements.';
      case 'NESTED':
        return 'Highlight: Embedded Sub-Document. Encourages denormalized data storage by nesting relations inside a single document block.';
      case 'ARRAY':
        return 'Highlight: BSON Array. Stores ordered list data elements directly inside the parent document, avoiding secondary table joins.';
      default:
        return 'Hover or click keys in the visualizer to explore document structure.';
    }
  };

  const handleHover = (sect) => {
    setActiveHighlight(sect);
    setLog(getLogMessage(sect));
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select Document Type:</span>
      <button
        className="btn-viz-action"
        onClick={() => { setSelectedDoc('PROFILE'); handleHover(null); }}
        style={{
          border: selectedDoc === 'PROFILE' ? '1px solid #1591DC' : '1px solid var(--bg-tertiary)',
          backgroundColor: selectedDoc === 'PROFILE' ? 'rgba(21, 145, 220, 0.1)' : 'var(--bg-primary)',
          color: selectedDoc === 'PROFILE' ? '#1591DC' : '#FFFFFF'
        }}
      >
        User Profile BSON
      </button>
      <button
        className="btn-viz-action"
        onClick={() => { setSelectedDoc('ORDER'); handleHover(null); }}
        style={{
          border: selectedDoc === 'ORDER' ? '1px solid #1591DC' : '1px solid var(--bg-tertiary)',
          backgroundColor: selectedDoc === 'ORDER' ? 'rgba(21, 145, 220, 0.1)' : 'var(--bg-primary)',
          color: selectedDoc === 'ORDER' ? '#1591DC' : '#FFFFFF'
        }}
      >
        E-commerce Order BSON
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Document Structure Info</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Storage Engine: <strong style={{ color: '#1591DC' }}>WiredTiger BSON</strong></div>
          <div>Primary Key: <strong style={{ color: '#1591DC' }}>_id (ObjectId)</strong></div>
          <div>Relations: <span>Denormalized (Embedded Objects)</span></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>MongoDB is a <strong>Document-oriented NoSQL database</strong> that stores data in flexible, JSON-like document structures called BSON (Binary JSON):</p>
      <ul>
        <li><strong>Collection:</strong> A grouping of MongoDB documents, analogous to a relational table. Collections do not enforce a strict schema.</li>
        <li><strong>Embedded Documents:</strong> You can nest sub-documents inside parent records to maintain one-to-many relationships without joins.</li>
        <li><strong>Arrays:</strong> Native support for lists of values or objects inside a single document attribute.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of MongoDB Document storage as **sending a complete package in a single shipping box**:</p>
      <ul>
        <li><strong>Relational DB (SQL):</strong> To ship an order, you put the receipt in envelope 1, the item list in envelope 2, and the customer details in envelope 3, requiring the mailman to stitch them together (JOIN) at delivery.</li>
        <li><strong>NoSQL (MongoDB):</strong> You place the receipt, the items, and the customer details all inside a single box. The recipient opens the box and has all records immediately (no stitching/joins needed).</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Infinite Document Growth:</strong> Nesting arrays that grow unbounded (e.g. storing every log comment inside a single post document). MongoDB has a strict 16MB document size limit. For unbounded relationships, use reference links instead.</li>
      <li><strong>Forgetting Indexing:</strong> Assuming NoSQL means you do not need indexes. Queries on non-indexed document attributes still require full collection scans.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Explain the difference between Reference and Embedded document patterns.',
      a: 'Embedding stores the child data directly inside the parent document (ideal for one-to-few bounded relations). Referencing stores only the ID pointer of the child document (analogous to foreign keys), ideal for one-to-many unbounded relationships to keep document sizes below 16MB.'
    },
    {
      q: 'What is BSON and how does it differ from JSON?',
      a: 'BSON (Binary JSON) is the binary-encoded serialization format used by MongoDB to store documents. It extends JSON by providing support for additional data types (like Date, Binary Data, and ObjectId) and is optimized for speed and space efficiency.'
    }
  ];

  const quizQuestions = [
    {
      question: 'What is the maximum document size limit in MongoDB?',
      options: [
        '4MB',
        '8MB',
        '16MB',
        'No limit'
      ],
      correctIdx: 2,
      explanation: 'MongoDB restricts single BSON documents to 16MB to ensure optimal memory buffer performance and prevent excessive disk reads.'
    },
    {
      question: 'Which design pattern is best suited for storing a customer profile along with their static shipping addresses in MongoDB?',
      options: [
        'Referencing',
        'Embedding',
        'Database sharding',
        'Relational splitting'
      ],
      correctIdx: 1,
      explanation: 'Since shipping addresses are closely tied to the user and bounded in quantity, embedding them as sub-documents is optimal.'
    }
  ];

  return (
    <VisualizerShell
      title="MongoDB Document Visualizer"
      subtitle="Examine document boundaries, embedded sub-documents, and array structures in NoSQL BSON formats."
      timeComplexity="O(1) document read"
      spaceComplexity="Max 16MB per document"
      theoryContent={theory}
      analogyContent={analogy}
      mistakesContent={mistakes}
      interviewQuestions={interviewQuestions}
      quizQuestions={quizQuestions}
      controls={controls}
      logs={[log]}
      stateInspector={stateInspector}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', width: '100%', padding: '1rem 0' }} className="visualizer-grid-layout">
        
        {/* Left Side: Code Block Representation */}
        <div style={{
          backgroundColor: '#000000',
          border: '1px solid #1591DC',
          borderRadius: '4px',
          padding: '1rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          color: '#FFFFFF',
          minHeight: '200px'
        }}>
          <span style={{ color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.5rem' }}>// BSON Document JSON</span>
          {selectedDoc === 'PROFILE' ? (
            <div>
              <div>{`{`}</div>
              <div
                style={{ paddingLeft: '1rem', cursor: 'pointer', backgroundColor: activeHighlight === 'BASIC' ? 'rgba(21, 145, 220, 0.15)' : 'transparent' }}
                onMouseEnter={() => handleHover('BASIC')}
              >
                <span style={{ color: '#1591DC' }}>"_id"</span>: "{profileJson._id}",
              </div>
              <div
                style={{ paddingLeft: '1rem', cursor: 'pointer', backgroundColor: activeHighlight === 'BASIC' ? 'rgba(21, 145, 220, 0.15)' : 'transparent' }}
                onMouseEnter={() => handleHover('BASIC')}
              >
                <span style={{ color: '#1591DC' }}>"name"</span>: "{profileJson.name}",
              </div>
              <div
                style={{ paddingLeft: '1rem', cursor: 'pointer', backgroundColor: activeHighlight === 'NESTED' ? 'rgba(21, 145, 220, 0.15)' : 'transparent' }}
                onMouseEnter={() => handleHover('NESTED')}
              >
                <span style={{ color: '#1591DC' }}>"contact"</span>: {`{`}
                <div style={{ paddingLeft: '1rem' }}><span style={{ color: '#1591DC' }}>"email"</span>: "{profileJson.contact.email}",</div>
                <div style={{ paddingLeft: '1rem' }}><span style={{ color: '#1591DC' }}>"phone"</span>: "{profileJson.contact.phone}"</div>
                {`},`}
              </div>
              <div
                style={{ paddingLeft: '1rem', cursor: 'pointer', backgroundColor: activeHighlight === 'ARRAY' ? 'rgba(21, 145, 220, 0.15)' : 'transparent' }}
                onMouseEnter={() => handleHover('ARRAY')}
              >
                <span style={{ color: '#1591DC' }}>"interests"</span>: [
                <div style={{ paddingLeft: '1rem' }}>"coding", "database", "cycling"</div>
                ]
              </div>
              <div>{`}`}</div>
            </div>
          ) : (
            <div>
              <div>{`{`}</div>
              <div
                style={{ paddingLeft: '1rem', cursor: 'pointer', backgroundColor: activeHighlight === 'BASIC' ? 'rgba(21, 145, 220, 0.15)' : 'transparent' }}
                onMouseEnter={() => handleHover('BASIC')}
              >
                <span style={{ color: '#1591DC' }}>"_id"</span>: "{orderJson._id}",
              </div>
              <div
                style={{ paddingLeft: '1rem', cursor: 'pointer', backgroundColor: activeHighlight === 'BASIC' ? 'rgba(21, 145, 220, 0.15)' : 'transparent' }}
                onMouseEnter={() => handleHover('BASIC')}
              >
                <span style={{ color: '#1591DC' }}>"order_no"</span>: "{orderJson.order_no}",
              </div>
              <div
                style={{ paddingLeft: '1rem', cursor: 'pointer', backgroundColor: activeHighlight === 'ARRAY' ? 'rgba(21, 145, 220, 0.15)' : 'transparent' }}
                onMouseEnter={() => handleHover('ARRAY')}
              >
                <span style={{ color: '#1591DC' }}>"items"</span>: [
                <div style={{ paddingLeft: '1rem' }}>{`{`} prod: "Laptop", qty: 1, price: 1200 {`},`}</div>
                <div style={{ paddingLeft: '1rem' }}>{`{`} prod: "Mouse", qty: 2, price: 25 {`}`}</div>
                ]
              </div>
              <div>{`}`}</div>
            </div>
          )}
        </div>

        {/* Right Side: Visual Canvas Layout */}
        <div style={{
          backgroundColor: '#000000',
          border: '1px solid #1591DC',
          borderRadius: '4px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px'
        }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Visual BSON Boundaries
          </span>
          <svg width="200" height="150" style={{ overflow: 'visible' }}>
            {/* Outer DB Document boundary */}
            <rect x="10" y="10" width="180" height="130" fill="none" stroke="#FFFFFF" strokeWidth="2" />
            <text x="20" y="25" fill="#FFFFFF" fontSize="0.45rem" fontWeight="bold">BSON Document Block</text>

            {selectedDoc === 'PROFILE' ? (
              <>
                {/* ID & Name (Basic) */}
                <rect
                  x="20"
                  y="35"
                  width="160"
                  height="22"
                  fill={activeHighlight === 'BASIC' ? 'rgba(21, 145, 220, 0.15)' : 'none'}
                  stroke={activeHighlight === 'BASIC' ? '#1591DC' : 'var(--bg-tertiary)'}
                  strokeWidth="1.5"
                  onMouseEnter={() => handleHover('BASIC')}
                />
                <text x="28" y="48" fill="#FFFFFF" fontSize="0.4rem">Primitives (ID &amp; Name)</text>

                {/* Embedded Object */}
                <rect
                  x="20"
                  y="65"
                  width="160"
                  height="34"
                  fill={activeHighlight === 'NESTED' ? 'rgba(21, 145, 220, 0.15)' : 'none'}
                  stroke={activeHighlight === 'NESTED' ? '#1591DC' : 'var(--bg-tertiary)'}
                  strokeWidth="1.5"
                  onMouseEnter={() => handleHover('NESTED')}
                />
                <text x="28" y="77" fill="#FFFFFF" fontSize="0.4rem">Contact Embedded Doc</text>
                <text x="28" y="88" fill="var(--text-secondary)" fontSize="0.32rem">email / phone attributes</text>

                {/* Array Block */}
                <rect
                  x="20"
                  y="107"
                  width="160"
                  height="22"
                  fill={activeHighlight === 'ARRAY' ? 'rgba(21, 145, 220, 0.15)' : 'none'}
                  stroke={activeHighlight === 'ARRAY' ? '#1591DC' : 'var(--bg-tertiary)'}
                  strokeWidth="1.5"
                  onMouseEnter={() => handleHover('ARRAY')}
                />
                <text x="28" y="120" fill="#FFFFFF" fontSize="0.4rem">Interests Array [ 3 items ]</text>
              </>
            ) : (
              <>
                {/* ID & OrderNo */}
                <rect
                  x="20"
                  y="35"
                  width="160"
                  height="22"
                  fill={activeHighlight === 'BASIC' ? 'rgba(21, 145, 220, 0.15)' : 'none'}
                  stroke={activeHighlight === 'BASIC' ? '#1591DC' : 'var(--bg-tertiary)'}
                  strokeWidth="1.5"
                  onMouseEnter={() => handleHover('BASIC')}
                />
                <text x="28" y="48" fill="#FFFFFF" fontSize="0.4rem">Primitives (ID &amp; Order No)</text>

                {/* Array of objects */}
                <rect
                  x="20"
                  y="70"
                  width="160"
                  height="50"
                  fill={activeHighlight === 'ARRAY' ? 'rgba(21, 145, 220, 0.15)' : 'none'}
                  stroke={activeHighlight === 'ARRAY' ? '#1591DC' : 'var(--bg-tertiary)'}
                  strokeWidth="1.5"
                  onMouseEnter={() => handleHover('ARRAY')}
                />
                <text x="28" y="85" fill="#FFFFFF" fontSize="0.4rem">Items Array of Docs</text>
                <text x="28" y="98" fill="var(--text-secondary)" fontSize="0.32rem">Item 1: Laptop (Qty 1)</text>
                <text x="28" y="108" fill="var(--text-secondary)" fontSize="0.32rem">Item 2: Mouse (Qty 2)</text>
              </>
            )}
          </svg>
        </div>

      </div>
    </VisualizerShell>
  );
}
