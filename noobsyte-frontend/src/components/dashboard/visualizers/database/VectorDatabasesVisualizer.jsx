import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function VectorDatabasesVisualizer() {
  const [docVectors] = useState([
    { id: 1, label: 'SQL Index Seek', x: 0.3, y: 0.8, text: 'Database indexes optimize SELECT queries.' },
    { id: 2, label: 'RDBMS ACID Joins', x: 0.35, y: 0.72, text: 'Relational locks handle transactional ACID properties.' },
    { id: 3, label: 'Baking Apple Pies', x: 0.8, y: 0.25, text: 'Baking apple pie requires flour, sugar, and oven heat.' },
    { id: 4, label: 'Cake Sweet Recipes', x: 0.88, y: 0.18, text: 'Sweet chocolate cake recipes with cream frosting.' }
  ]);

  const [queryVector, setQueryVector] = useState({ x: 0.5, y: 0.5 });
  const [distanceResults, setDistanceResults] = useState([]);
  const [distanceMetric, setDistanceMetric] = useState('COSINE'); // 'COSINE' or 'EUCLIDEAN'
  const [isPlaying, setIsPlaying] = useState(false);
  const [log, setLog] = useState('Vector database ready. Click anywhere in the vector coordinate grid space to issue a query vector.');

  const handleCanvasClick = (e) => {
    if (isPlaying) return;
    const rect = e.currentTarget.getBoundingClientRect();
    // Convert physical pixel click coordinates to normalized 0.0 - 1.0 floats
    const clickX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    // SVG coordinates have 0,0 at top, so invert Y to map standard cartesian coordinate charts
    const clickY = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));

    const roundedX = parseFloat(clickX.toFixed(2));
    const roundedY = parseFloat(clickY.toFixed(2));

    setQueryVector({ x: roundedX, y: roundedY });
    setLog(`[Query Plotted] Generated query vector embeddings: [${roundedX}, ${roundedY}]. Calculating distances...`);
    computeDistances(roundedX, roundedY);
  };

  const forcePresetQuery = (type) => {
    const qVec = type === 'TECH' ? { x: 0.32, y: 0.78 } : { x: 0.84, y: 0.21 };
    setQueryVector(qVec);
    setLog(`[Preset Query] Semantic target: ${type === 'TECH' ? 'DB Systems' : 'Baking Foods'}. Set vector to [${qVec.x}, ${qVec.y}]. Calculating nearest neighbors...`);
    computeDistances(qVec.x, qVec.y);
  };

  const computeDistances = (qx, qy) => {
    setIsPlaying(true);
    const results = docVectors.map(doc => {
      let score = 0;
      if (distanceMetric === 'COSINE') {
        // Cosine Similarity: (A . B) / (||A|| * ||B||)
        const dotProduct = (doc.x * qx) + (doc.y * qy);
        const magnitudeDoc = Math.sqrt((doc.x * doc.x) + (doc.y * doc.y));
        const magnitudeQuery = Math.sqrt((qx * qx) + (qy * qy));
        score = dotProduct / (magnitudeDoc * magnitudeQuery);
      } else {
        // Euclidean Distance: sqrt((x2-x1)^2 + (y2-y1)^2)
        const dx = doc.x - qx;
        const dy = doc.y - qy;
        score = Math.sqrt((dx * dx) + (dy * dy));
      }
      return { id: doc.id, label: doc.label, score: parseFloat(score.toFixed(4)) };
    });

    // Sort: Cosine similarity seeks closest to 1.0 (descending); Euclidean seeks smallest distance (ascending)
    const sorted = [...results].sort((a, b) => {
      return distanceMetric === 'COSINE' ? b.score - a.score : a.score - b.score;
    });

    setTimeout(() => {
      setDistanceResults(sorted);
      setIsPlaying(false);
      const topHit = sorted[0];
      setLog(`[KNN Search Completed] Nearest Neighbor matches: Top Hit is "${topHit.label}" with similarity score of ${topHit.score}.`);
    }, 1000);
  };

  const handleReset = () => {
    setQueryVector({ x: 0.5, y: 0.5 });
    setDistanceResults([]);
    setIsPlaying(false);
    setLog('Vector space reset.');
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <button className="btn-viz-action btn-add" onClick={() => forcePresetQuery('TECH')} disabled={isPlaying}>
        Query: "SQL Databases"
      </button>

      <button className="btn-viz-action btn-add" onClick={() => forcePresetQuery('FOOD')} disabled={isPlaying}>
        Query: "Baking Recipes"
      </button>

      <button className="btn-viz-action" onClick={handleReset} disabled={isPlaying}>
        Reset
      </button>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>Distance Metric:</span>
        <select
          value={distanceMetric}
          onChange={(e) => {
            setDistanceMetric(e.target.value);
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
          <option value="COSINE">Cosine Similarity (Angle)</option>
          <option value="EUCLIDEAN">Euclidean Distance (Straight Line)</option>
        </select>
      </div>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Nearest Neighbor Matches (KNN Ranking)</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          height: '110px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.68rem'
        }}>
          {distanceResults.length === 0 ? (
            <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Compute vector coordinate distance to display KNN rankings.</span>
          ) : (
            distanceResults.map((res, index) => (
              <div key={res.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.15rem 0', color: index === 0 ? '#1591DC' : '#FFFFFF', fontWeight: index === 0 ? 'bold' : 'normal' }}>
                <span>{index + 1}. {res.label}</span>
                <span>{distanceMetric === 'COSINE' ? 'Sim' : 'Dist'}: {res.score}</span>
              </div>
            ))
          )}
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Vector Embeddings Context</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          <div>Query Vector: <strong style={{ color: '#1591DC' }}>[{queryVector.x}, {queryVector.y}]</strong></div>
          <div>Index Algorithm: <strong>Flat / HNSW Indexing</strong></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>Vector Database</strong> indexes and queries high-dimensional vector embeddings (typically arrays of floating-point numbers generated by machine learning models):</p>
      <ul>
        <li><strong>Vector Embeddings:</strong> Represent semantic meaning. Words or documents with similar concepts (e.g. "cooking" and "recipe") are mapped close together in coordinate vector spaces.</li>
        <li><strong>Distance Metrics:</strong>
          <ul>
            <li><strong>Cosine Similarity:</strong> Measures the cosine of the angle between two vectors. Focuses on direction rather than magnitude (value ranges from -1.0 to 1.0).</li>
            <li><strong>Euclidean Distance:</strong> Measures the geometric straight-line distance between coordinate points.</li>
          </ul>
        </li>
        <li><strong>ANN Searches:</strong> Querying millions of vectors with exact scans is too slow. Vector databases build indices like Hierarchical Navigable Small World (HNSW) graphs to find Approximate Nearest Neighbors (ANN) in log time.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Vector Databases as **a library organized by semantic flavor profiles**:</p>
      <ul>
        <li>Standard DBs catalog books by exact matches (genres, titles). A Vector database catalogs books by coordinates representing attributes (e.g., sweetness, spice, complexity). A book about chocolate cake and a book about apple pie sit next to each other in the "baking coordinate drawer" because their mathematical ingredients overlap.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Standard index queries on vector fields:</strong> Trying to index vector floats using relational B+ Tree searches, which can only perform simple single-dimensional inequality range checks.</li>
      <li><strong>Mismatching distance models:</strong> Training an AI model using Cosine distance, but configuring your vector database index (e.g. Pinecone) to query via Dot Product, leading to corrupt semantic matches.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Why are traditional database indexes (like B+ Trees) useless for vector searches?',
      a: 'B+ Trees are designed for one-dimensional scalar sorting (numbers or strings). Vectors are high-dimensional arrays (typically 1536+ dimensions). To search vectors, databases use specialized spatial algorithms (like KD-Trees or HNSW graph traversals) to find nearest neighbors.'
    },
    {
      q: 'How does Cosine Similarity differ from Euclidean Distance?',
      a: 'Euclidean distance measures the physical straight-line distance between two points in coordinate space. Cosine similarity measures the angle difference between two vector directions. Cosine similarity ignores vector length magnitude, making it ideal for comparing documents of varying lengths.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which metric measures the angle direction between two vector embedding arrays, ignoring their magnitude scale?',
      options: [
        'Euclidean distance',
        'Cosine similarity',
        'B+ Tree search range',
        'TF-IDF token post index'
      ],
      correctIdx: 1,
      explanation: 'Cosine similarity calculates the cosine of the angle between two vectors, rendering it scale-invariant and ideal for semantic comparisons.'
    },
    {
      question: 'Which indexing algorithm is commonly used in vector databases to speed up nearest-neighbor queries?',
      options: [
        'Write-Ahead Log files',
        'Hierarchical Navigable Small World (HNSW) graphs',
        'Venn diagram schemas',
        'BCNF relational divisions'
      ],
      correctIdx: 1,
      explanation: 'HNSW builds multi-layered proximity graphs, allowing the engine to traverse vector spaces quickly to find approximate nearest neighbors.'
    }
  ];

  return (
    <VisualizerShell
      title="Vector Databases"
      subtitle="Examine vector coordinate space plots, compare Cosine vs Euclidean distances, and execute KNN searches."
      timeComplexity="Exact Search: O(N * Dim); HNSW: O(log N)"
      spaceComplexity="O(N * Dim) floating point memory"
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
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', width: '100%' }} className="visualizer-grid-layout">
          
          {/* Interactive 2D Vector coordinate chart */}
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem', textAlign: 'center' }}>
              Vector Embedding Cartesian Space (2D Projection)
            </span>
            <div style={{
              border: '2px solid var(--bg-tertiary)',
              borderRadius: '6px',
              backgroundColor: '#000000',
              padding: '0.5rem',
              display: 'flex',
              justifyContent: 'center',
              cursor: 'crosshair',
              position: 'relative'
            }}>
              {/* Plot canvas */}
              <div 
                onClick={handleCanvasClick}
                style={{
                  width: '240px',
                  height: '240px',
                  borderLeft: '2px solid #FFFFFF',
                  borderBottom: '2px solid #FFFFFF',
                  position: 'relative',
                  backgroundColor: 'rgba(255,255,255,0.02)'
                }}
              >
                {/* Axis Labels */}
                <span style={{ fontSize: '0.5rem', color: 'var(--text-tertiary)', position: 'absolute', bottom: '-15px', right: '0' }}>Tech Dimension (X)</span>
                <span style={{ fontSize: '0.5rem', color: 'var(--text-tertiary)', position: 'absolute', left: '-20px', top: '0', transform: 'rotate(-90deg)', transformOrigin: 'left top' }}>Food (Y)</span>

                {/* Doc vectors coordinates */}
                {docVectors.map(doc => {
                  const left = `${doc.x * 100}%`;
                  const bottom = `${doc.y * 100}%`;
                  return (
                    <div 
                      key={doc.id}
                      style={{
                        position: 'absolute',
                        left: left,
                        bottom: bottom,
                        transform: 'translate(-50%, 50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 5
                      }}
                    >
                      <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" style={{ stroke: '#000000', strokeWidth: 1 }} />
                      <span style={{
                        fontSize: '0.45rem',
                        color: '#FFFFFF',
                        backgroundColor: '#000000',
                        border: '1px solid var(--bg-tertiary)',
                        borderRadius: '2px',
                        padding: '0.05rem 0.15rem',
                        whiteSpace: 'nowrap',
                        marginTop: '2px'
                      }}>
                        {doc.label}
                      </span>
                    </div>
                  );
                })}

                {/* Query Vector */}
                <div style={{
                  position: 'absolute',
                  left: `${queryVector.x * 100}%`,
                  bottom: `${queryVector.y * 100}%`,
                  transform: 'translate(-50%, 50%)',
                  zIndex: 10
                }}>
                  <circle cx="0" cy="0" r="6" fill="#1591DC" style={{ stroke: '#FFFFFF', strokeWidth: 1.5 }} />
                  <span style={{
                    fontSize: '0.45rem',
                    color: '#FFFFFF',
                    backgroundColor: '#1591DC',
                    borderRadius: '2px',
                    padding: '0.05rem 0.2rem',
                    whiteSpace: 'nowrap',
                    fontWeight: 'bold',
                    position: 'absolute',
                    top: '-15px',
                    left: '8px'
                  }}>
                    Query
                  </span>
                </div>

                {/* Draw distance connection paths if calculated */}
                {!isPlaying && distanceResults.length > 0 && docVectors.map(doc => {
                  return (
                    <svg key={doc.id} style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
                      <line 
                        x1={`${queryVector.x * 100}%`}
                        y1={`${(1 - queryVector.y) * 100}%`}
                        x2={`${doc.x * 100}%`}
                        y2={`${(1 - doc.y) * 100}%`}
                        stroke="#1591DC"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                      />
                    </svg>
                  );
                })}

              </div>
            </div>
          </div>

          {/* Details list of vectors */}
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Vector Database Catalog Entries
            </span>
            <div style={{
              border: '1.5px solid var(--bg-tertiary)',
              borderRadius: '6px',
              backgroundColor: '#000000',
              padding: '0.4rem',
              height: '240px',
              overflowY: 'auto'
            }}>
              {docVectors.map(doc => {
                const isClosest = distanceResults.length > 0 && distanceResults[0].id === doc.id;
                return (
                  <div key={doc.id} style={{
                    fontSize: '0.62rem',
                    padding: '0.35rem',
                    border: isClosest ? '1.5px solid #1591DC' : '1px solid var(--bg-tertiary)',
                    borderRadius: '4px',
                    marginBottom: '0.4rem',
                    backgroundColor: isClosest ? 'rgba(21, 145, 220, 0.1)' : 'none',
                    color: '#FFFFFF'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                      <span>{doc.label}</span>
                      <span style={{ color: '#1591DC' }}>Coords: [{doc.x}, {doc.y}]</span>
                    </div>
                    <div style={{ fontSize: '0.58rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {doc.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </VisualizerShell>
  );
}
