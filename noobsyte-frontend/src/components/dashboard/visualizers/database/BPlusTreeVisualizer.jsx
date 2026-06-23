import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function BPlusTreeVisualizer() {
  const [nodes, setNodes] = useState({
    root: { keys: [40], children: ['left', 'right'] },
    left: { keys: [20], children: ['leaf1', 'leaf2'] },
    right: { keys: [60], children: ['leaf3', 'leaf4'] },
    leaf1: { keys: [10, 15], next: 'leaf2' },
    leaf2: { keys: [20, 30], next: 'leaf3' },
    leaf3: { keys: [40, 50], next: 'leaf4' },
    leaf4: { keys: [60, 70], next: null }
  });
  const [searchVal, setSearchVal] = useState('');
  const [log, setLog] = useState('B+ Tree Index loaded. Try searching or inserting a key.');
  const [activeNodes, setActiveNodes] = useState([]); // Nodes highlighted in search path

  const handleSearch = () => {
    const val = parseInt(searchVal, 10);
    if (isNaN(val)) {
      setLog('Error: Please enter a valid integer to search.');
      return;
    }

    setLog(`Initiating O(log N) search traversal for key ${val}...`);
    setActiveNodes(['root']);

    // Step 1: Check root
    setTimeout(() => {
      let nextNode = '';
      if (val < 40) {
        nextNode = 'left';
        setActiveNodes(['root', 'left']);
        setLog(`Traversing Left: ${val} < 40. Checking internal node...`);
      } else {
        nextNode = 'right';
        setActiveNodes(['root', 'right']);
        setLog(`Traversing Right: ${val} >= 40. Checking internal node...`);
      }

      // Step 2: Check internal node
      setTimeout(() => {
        let leafNode = '';
        if (nextNode === 'left') {
          if (val < 20) {
            leafNode = 'leaf1';
          } else {
            leafNode = 'leaf2';
          }
        } else {
          if (val < 60) {
            leafNode = 'leaf3';
          } else {
            leafNode = 'leaf4';
          }
        }
        setActiveNodes(['root', nextNode, leafNode]);
        setLog(`Traversing to Leaf: Checking leaf node ${leafNode}...`);

        // Step 3: Check leaf values
        setTimeout(() => {
          const found = nodes[leafNode].keys.includes(val);
          if (found) {
            setLog(`Success! Found key ${val} inside leaf node ${leafNode}.`);
          } else {
            setLog(`Search Finished: Key ${val} is not present in the B+ Tree index.`);
          }
        }, 800);

      }, 800);

    }, 800);
  };

  const handleInsert = () => {
    setLog('Simulating Node Split: Inserting key 25 into Leaf 2 [20, 30]. Leaf capacity exceeded! Splitting node and promoting median key 25 to parent...');
    setActiveNodes(['leaf2', 'left']);
    
    setTimeout(() => {
      const updated = {
        ...nodes,
        left: { keys: [20, 25], children: ['leaf1', 'leaf2_split', 'leaf2'] },
        leaf2_split: { keys: [20], next: 'leaf2' },
        leaf2: { keys: [25, 30], next: 'leaf3' }
      };
      setNodes(updated);
      setActiveNodes([]);
      setLog('Node Split Complete: Re-balanced tree levels successfully. Leaf linked list sequence maintained.');
    }, 1500);
  };

  const handleReset = () => {
    setNodes({
      root: { keys: [40], children: ['left', 'right'] },
      left: { keys: [20], children: ['leaf1', 'leaf2'] },
      right: { keys: [60], children: ['leaf3', 'leaf4'] },
      leaf1: { keys: [10, 15], next: 'leaf2' },
      leaf2: { keys: [20, 30], next: 'leaf3' },
      leaf3: { keys: [40, 50], next: 'leaf4' },
      leaf4: { keys: [60, 70], next: null }
    });
    setActiveNodes([]);
    setSearchVal('');
    setLog('Tree reset to initial state.');
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <input
        type="text"
        placeholder="Key to Search"
        value={searchVal}
        onChange={(e) => setSearchVal(e.target.value)}
        style={{
          padding: '0.4rem 0.6rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem',
          width: '120px'
        }}
      />
      <button className="btn-viz-action btn-add" onClick={handleSearch}>
        Search Key
      </button>

      <button className="btn-viz-action btn-add" onClick={handleInsert}>
        Insert 25 (Split Demo)
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset Tree
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>B+ Tree Metadata</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Fan-out Factor (M): <strong>3</strong> (Max keys per node = 2)</div>
          <div>Depth of Tree: <span>3 Levels</span></div>
          <div>Leaf Traversal Pointer: <strong style={{ color: '#1591DC' }}>Enabled (Linked List)</strong></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>B+ Tree</strong> is a self-balancing N-ary tree data structure that keeps data sorted and allows searches, sequential access, insertions, and deletions in logarithmic time:</p>
      <ul>
        <li><strong>Structural Rules:</strong>
          <ul>
            <li>Internal nodes only store keys and child pointers; they do not contain actual row data.</li>
            <li>Leaf nodes store all actual keys alongside row data/pointers.</li>
            <li>Leaf nodes are linked sequentially in a doubly/singly linked list to optimize range scans.</li>
          </ul>
        </li>
        <li><strong>Node Splitting:</strong> When a node exceeds the maximum capacity (M-1 keys), it splits in half, and the median key is promoted to the parent node.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of a B+ Tree index as **a Department Store Directory Board**:</p>
      <ul>
        <li><strong>Root Directory:</strong> Points you to either "Floor 1-3" or "Floor 4-6."</li>
        <li><strong>Internal Nodes (Floor Directory):</strong> Points you to specific aisles (e.g. "Aisles 10-15").</li>
        <li><strong>Leaf Nodes (Aisle Shelves):</strong> Contain the actual products. The shelves are linked sequentially so you can browse all items side-by-side without walking back to the lobby map directory.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Confusing B-Trees and B+ Trees:</strong> In a standard B-Tree, actual data is stored in both internal and leaf nodes, which prevents sequential leaf link scans. B+ Trees store all data at the leaf level for fast range querying.</li>
      <li><strong>Small Fan-out Factors:</strong> Setting too small a fan-out factor leads to a taller tree, increasing disk seek times. Production databases set page block sizes to load hundreds of keys per node.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Why are B+ Trees preferred over Binary Search Trees (BST) in Database indexing?',
      a: 'BSTs have a fan-out of 2, making them very tall for large datasets, which requires many disk reads. B+ Trees have a high fan-out (hundreds of keys per node), resulting in a short, flat tree that minimizes slow disk I/O operations.'
    },
    {
      q: 'How does the B+ Tree optimize range queries (e.g. WHERE age BETWEEN 20 AND 40)?',
      a: 'It uses the leaf-level sequential linked list. The database engine traverses down to find the starting key (20) in a leaf node, then simply scans the linked leaf nodes sequentially until it reaches key 40, avoiding root-traversal hops.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Where is actual data / row pointers stored in a B+ Tree index?',
      options: [
        'Only in internal nodes',
        'Only in leaf nodes',
        'In both internal and leaf nodes',
        'In the root node only'
      ],
      correctIdx: 1,
      explanation: 'In B+ Trees, internal nodes only store keys and child pointers; actual data records/pointers are stored exclusively at the leaf level.'
    },
    {
      question: 'What is the primary benefit of linking leaf nodes sequentially in a B+ Tree?',
      options: [
        'To speed up key insertions',
        'To support faster range query scans',
        'To save memory space',
        'To encrypt data'
      ],
      correctIdx: 1,
      explanation: 'Linking leaf nodes sequentially avoids traversing the root hierarchy repeatedly for range queries, allowing linear scans.'
    }
  ];

  const getStroke = (id) => {
    return activeNodes.includes(id) ? '#1591DC' : 'var(--bg-tertiary)';
  };

  const getWidth = (id) => {
    return activeNodes.includes(id) ? '2.5' : '1.5';
  };

  return (
    <VisualizerShell
      title="B+ Tree Indexing"
      subtitle="Examine tree traversals, internal vs leaf node structures, and node splitting actions."
      timeComplexity="O(log N) search/insert"
      spaceComplexity="O(N) index node allocation"
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
          
          {/* Level 1: Root Node */}
          <g>
            <rect x="195" y="10" width="60" height="25" fill="#000000" stroke={getStroke('root')} strokeWidth={getWidth('root')} rx="3" />
            <text x="225" y="27" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Root: {nodes.root.keys.join(', ')}</text>
          </g>

          {/* Level 1 to Level 2 Lines */}
          <line x1="210" y1="35" x2="110" y2="70" stroke="var(--bg-tertiary)" strokeWidth="1" />
          <line x1="240" y1="35" x2="340" y2="70" stroke="var(--bg-tertiary)" strokeWidth="1" />

          {/* Level 2: Internal Nodes */}
          {/* Left Internal */}
          <g>
            <rect x="70" y="70" width="80" height="25" fill="#000000" stroke={getStroke('left')} strokeWidth={getWidth('left')} rx="3" />
            <text x="110" y="87" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Keys: {nodes.left.keys.join(', ')}</text>
          </g>

          {/* Right Internal */}
          <g>
            <rect x="300" y="70" width="80" height="25" fill="#000000" stroke={getStroke('right')} strokeWidth={getWidth('right')} rx="3" />
            <text x="340" y="87" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Keys: {nodes.right.keys.join(', ')}</text>
          </g>

          {/* Level 2 to Level 3 Lines */}
          {nodes.left.children.length === 3 ? (
            <>
              <line x1="90" y1="95" x2="45" y2="135" stroke="var(--bg-tertiary)" strokeWidth="1" />
              <line x1="110" y1="95" x2="115" y2="135" stroke="var(--bg-tertiary)" strokeWidth="1" />
              <line x1="130" y1="95" x2="195" y2="135" stroke="var(--bg-tertiary)" strokeWidth="1" />
            </>
          ) : (
            <>
              <line x1="95" y1="95" x2="45" y2="135" stroke="var(--bg-tertiary)" strokeWidth="1" />
              <line x1="125" y1="95" x2="135" y2="135" stroke="var(--bg-tertiary)" strokeWidth="1" />
            </>
          )}
          <line x1="320" y1="95" x2="265" y2="135" stroke="var(--bg-tertiary)" strokeWidth="1" />
          <line x1="360" y1="95" x2="385" y2="135" stroke="var(--bg-tertiary)" strokeWidth="1" />

          {/* Level 3: Leaf Nodes */}
          {/* Leaf 1 */}
          <g>
            <rect x="10" y="135" width="70" height="30" fill="#000000" stroke={getStroke('leaf1')} strokeWidth={getWidth('leaf1')} rx="3" />
            <text x="45" y="153" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Leaf: {nodes.leaf1.keys.join(', ')}</text>
          </g>

          {/* Leaf 2 Split Demo if active */}
          {nodes.left.children.length === 3 && (
            <g>
              <rect x="90" y="135" width="70" height="30" fill="#000000" stroke={getStroke('leaf2_split')} strokeWidth={getWidth('leaf2_split')} rx="3" />
              <text x="125" y="153" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Leaf: {nodes.leaf2_split.keys.join(', ')}</text>
            </g>
          )}

          {/* Leaf 2 */}
          <g>
            <rect x="170" y="135" width="70" height="30" fill="#000000" stroke={getStroke('leaf2')} strokeWidth={getWidth('leaf2')} rx="3" />
            <text x="205" y="153" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Leaf: {nodes.leaf2.keys.join(', ')}</text>
          </g>

          {/* Leaf 3 */}
          <g>
            <rect x="250" y="135" width="70" height="30" fill="#000000" stroke={getStroke('leaf3')} strokeWidth={getWidth('leaf3')} rx="3" />
            <text x="285" y="153" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Leaf: {nodes.leaf3.keys.join(', ')}</text>
          </g>

          {/* Leaf 4 */}
          <g>
            <rect x="370" y="135" width="70" height="30" fill="#000000" stroke={getStroke('leaf4')} strokeWidth={getWidth('leaf4')} rx="3" />
            <text x="405" y="153" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Leaf: {nodes.leaf4.keys.join(', ')}</text>
          </g>

          {/* Leaf level sequential linked list links */}
          <path d="M 80 150 L 90 150" stroke="#1591DC" strokeWidth="1.5" markerEnd="url(#arrow)" />
          {nodes.left.children.length === 3 ? (
            <>
              <path d="M 160 150 L 170 150" stroke="#1591DC" strokeWidth="1.5" />
              <path d="M 240 150 L 250 150" stroke="#1591DC" strokeWidth="1.5" />
            </>
          ) : (
            <path d="M 240 150 L 250 150" stroke="#1591DC" strokeWidth="1.5" />
          )}
          <path d="M 320 150 L 370 150" stroke="#1591DC" strokeWidth="1.5" />
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '15px', height: '8px', border: '1.5px solid #1591DC', backgroundColor: 'transparent' }}></div> Active Search Node
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '15px', height: '1.5px', backgroundColor: '#1591DC' }}></div> Leaf sequential list pointers
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
