import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function BstVisualizer() {
  // Tree representation (fixed positions for max depth = 3 to prevent overlap)
  // keys: 'root', 'left', 'right', 'leftLeft', 'leftRight', 'rightLeft', 'rightRight'
  const [tree, setTree] = useState({
    root: 50,
    left: 30,
    right: 70,
    leftLeft: 20,
    leftRight: 40,
    rightLeft: 60,
    rightRight: 80
  });

  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState(['Binary Search Tree initialized with 7 nodes (balanced).']);
  const [activeHighlightNode, setActiveHighlightNode] = useState(null); // Key being traversed
  const [searchPath, setSearchPath] = useState([]); // List of node keys traversed in search
  const [traversalSequence, setTraversalSequence] = useState([]); // List of node keys for traversal
  const [traversalStep, setTraversalStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  // Playback timer for animated traversals
  useEffect(() => {
    let interval = null;
    if (isPlaying && traversalSequence.length > 0) {
      interval = setInterval(() => {
        setTraversalStep(prev => {
          if (prev < traversalSequence.length - 1) {
            const nextIdx = prev + 1;
            setActiveHighlightNode(traversalSequence[nextIdx]);
            setLogs(old => [`Visited node: ${tree[traversalSequence[nextIdx]]}`, ...old]);
            return nextIdx;
          } else {
            setIsPlaying(false);
            setActiveHighlightNode(null);
            return prev;
          }
        });
      }, speed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, traversalSequence, speed, tree]);

  // Insert key
  const handleInsert = () => {
    const val = Number(inputVal);
    if (isNaN(val) || val < 1 || val > 99) {
      alert('Please enter a valid integer between 1 and 99.');
      return;
    }

    let updatedTree = { ...tree };
    let path = [];
    let logMsg = '';

    if (!updatedTree.root) {
      updatedTree.root = val;
      logMsg = `Inserted root node: ${val}`;
    } else {
      let currKey = 'root';
      while (currKey) {
        path.push(currKey);
        const currVal = updatedTree[currKey];
        if (val === currVal) {
          alert('Duplicate keys not allowed in this BST.');
          return;
        }

        if (val < currVal) {
          // Go left
          if (currKey === 'root') {
            if (!updatedTree.left) { updatedTree.left = val; logMsg = `Inserted ${val} left of ${currVal}`; break; }
            currKey = 'left';
          } else if (currKey === 'left') {
            if (!updatedTree.leftLeft) { updatedTree.leftLeft = val; logMsg = `Inserted ${val} left of ${currVal}`; break; }
            currKey = 'leftLeft';
          } else if (currKey === 'right') {
            if (!updatedTree.rightLeft) { updatedTree.rightLeft = val; logMsg = `Inserted ${val} left of ${currVal}`; break; }
            currKey = 'rightLeft';
          } else {
            alert('Visualizer depth limit (3 levels) reached.');
            return;
          }
        } else {
          // Go right
          if (currKey === 'root') {
            if (!updatedTree.right) { updatedTree.right = val; logMsg = `Inserted ${val} right of ${currVal}`; break; }
            currKey = 'right';
          } else if (currKey === 'left') {
            if (!updatedTree.leftRight) { updatedTree.leftRight = val; logMsg = `Inserted ${val} right of ${currVal}`; break; }
            currKey = 'leftRight';
          } else if (currKey === 'right') {
            if (!updatedTree.rightRight) { updatedTree.rightRight = val; logMsg = `Inserted ${val} right of ${currVal}`; break; }
            currKey = 'rightRight';
          } else {
            alert('Visualizer depth limit (3 levels) reached.');
            return;
          }
        }
      }
    }

    setTree(updatedTree);
    setLogs(prev => [logMsg, ...prev]);
    setInputVal('');
    // Trigger quick path highlight animation
    animateSearchPath(path);
  };

  // Search key
  const handleSearch = () => {
    const val = Number(inputVal);
    if (isNaN(val)) {
      alert('Please enter a valid target integer.');
      return;
    }

    let path = [];
    let currKey = 'root';
    let found = false;

    while (currKey && tree[currKey]) {
      path.push(currKey);
      const currVal = tree[currKey];
      if (val === currVal) {
        found = true;
        break;
      }
      if (val < currVal) {
        if (currKey === 'root') currKey = 'left';
        else if (currKey === 'left') currKey = 'leftLeft';
        else if (currKey === 'right') currKey = 'rightLeft';
        else currKey = null;
      } else {
        if (currKey === 'root') currKey = 'right';
        else if (currKey === 'left') currKey = 'leftRight';
        else if (currKey === 'right') currKey = 'rightRight';
        else currKey = null;
      }
    }

    animateSearchPath(path);
    setLogs(prev => [
      found ? `Search Successful: Key "${val}" found at node [${path[path.length - 1]}].` : `Search Failed: Key "${val}" is not in the tree.`,
      ...prev
    ]);
    setInputVal('');
  };

  // Helper to animate node path
  const animateSearchPath = async (pathKeys) => {
    setSearchPath(pathKeys);
    for (let k of pathKeys) {
      setActiveHighlightNode(k);
      await new Promise(r => setTimeout(r, 450));
    }
    setActiveHighlightNode(null);
    setSearchPath([]);
  };

  // Trigger Traversals
  const triggerTraversal = (type) => {
    let sequence = [];
    
    // In-order traversal: Left -> Root -> Right
    const inorder = ['leftLeft', 'left', 'leftRight', 'root', 'rightLeft', 'right', 'rightRight'];
    // Pre-order: Root -> Left -> Right
    const preorder = ['root', 'left', 'leftLeft', 'leftRight', 'right', 'rightLeft', 'rightRight'];
    // Post-order: Left -> Right -> Root
    const postorder = ['leftLeft', 'leftRight', 'left', 'rightLeft', 'rightRight', 'right', 'root'];

    if (type === 'inorder') sequence = inorder;
    else if (type === 'preorder') sequence = preorder;
    else sequence = postorder;

    // Filter nodes that actually exist in the tree
    const activeSequence = sequence.filter(k => tree[k] !== undefined && tree[k] !== null);
    
    setTraversalSequence(activeSequence);
    setTraversalStep(0);
    setActiveHighlightNode(activeSequence[0]);
    setIsPlaying(true);
    setLogs(old => [`Starting ${type.toUpperCase()} traversal: [${activeSequence.map(k => tree[k]).join(', ')}]`, ...old]);
  };

  const handleClear = () => {
    setTree({ root: null });
    setLogs(['Tree cleared. Insert new root node to begin.']);
    setActiveHighlightNode(null);
    setIsPlaying(false);
  };

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Key (1-99)"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          style={{
            width: '80px',
            padding: '0.45rem',
            borderRadius: '4px',
            border: '1px solid var(--bg-tertiary)',
            backgroundColor: 'var(--bg-primary)',
            color: '#FFFFFF',
            fontSize: '0.85rem',
            textAlign: 'center'
          }}
        />
        <button className="btn-viz-action btn-add" onClick={handleInsert}>
          Insert Key
        </button>
        <button className="btn-viz-action" onClick={handleSearch}>
          Search Key
        </button>
        <button className="btn-viz-action btn-clear" onClick={handleClear}>
          Clear Tree
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--bg-tertiary)', paddingTop: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>Traversals:</span>
        <button className="btn-viz-action" onClick={() => triggerTraversal('inorder')}>
          In-order (LNR)
        </button>
        <button className="btn-viz-action" onClick={() => triggerTraversal('preorder')}>
          Pre-order (NLR)
        </button>
        <button className="btn-viz-action" onClick={() => triggerTraversal('postorder')}>
          Post-order (LRN)
        </button>
      </div>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
      <div>Root Value: <strong style={{ color: '#FFFFFF' }}>{tree.root || 'null'}</strong></div>
      <div>Active Node Highlight: <span style={{ color: '#1591DC' }}>{activeHighlightNode ? `${activeHighlightNode} (${tree[activeHighlightNode]})` : 'None'}</span></div>
      <div>Traversals Step: <span style={{ fontFamily: 'monospace', color: '#FFFFFF' }}>{isPlaying ? `${traversalStep + 1} / ${traversalSequence.length}` : 'Idle'}</span></div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>Binary Search Tree (BST)</strong> is a hierarchical node structure where each node satisfies the search ordering property:</p>
      <ul>
        <li><strong>Ordering:</strong> For any node, all keys in its **left subtree** must be smaller than its key, and all keys in its **right subtree** must be larger.</li>
        <li><strong>Complexity:</strong> Searching, inserting, and deleting run in O(log N) average time. However, if keys are inserted in sorted order, the tree degrades into a straight line (skewed tree), making operations O(N).</li>
        <li><strong>Traversals:</strong>
          <ul>
            <li>In-order (LNR): Left {'->'} Node {'->'} Right. <em>Guarantees visited nodes are in sorted ascending order.</em></li>
            <li>Pre-order (NLR): Node {'->'} Left {'->'} Right.</li>
            <li>Post-order (LRN): Left {'->'} Right {'->'} Node.</li>
          </ul>
        </li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of a BST as an **interactive highway sorting checkpoint**:</p>
      <ul>
        <li>Cars arrive labeled with speed limits.</li>
        <li>The main gate says "50". If your speed limit is less than 50, you are directed to take the left exit lane. If greater, you take the right exit lane.</li>
        <li>At the next lane, another gate checks you and directs you further. By checking at most 3 gates, you find your parking slot out of many slots!</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Skewed Tree Degradation:</strong> Inserting sorted inputs (e.g. 10, 20, 30, 40) directly into a BST. This creates a linked-list structure, defeating the O(log N) balance advantage. <em>Fix: Use self-balancing trees like AVL or Red-Black trees.</em></li>
      <li><strong>Duplicate nodes:</strong> Failing to define duplicate key strategies (most standard BSTs reject duplicates or store counters).</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Which traversal of a BST yields elements in sorted ascending order?',
      a: 'The In-order traversal (Left, Node, Right) always prints BST keys in sorted ascending order because of the left < node < right property.'
    },
    {
      q: 'What is the worst-case time complexity of BST insertions and how is it resolved?',
      a: 'The worst-case is O(N) when elements are inserted in a sorted order (creating a skewed tree). This is resolved by self-balancing trees (AVL or Red-Black) which perform rotations during insertion to keep height balanced at O(log N).'
    }
  ];

  const quizQuestions = [
    {
      question: 'What is the in-order successor of a node in a BST?',
      options: [
        'The leftmost node of its right subtree',
        'The rightmost node of its left subtree',
        'Its parent node',
        'Its left child'
      ],
      correctIdx: 0,
      explanation: 'The in-order successor is the next node in ascending sorted order, which corresponds to the smallest (leftmost) element in its right subtree.'
    }
  ];

  // SVG Coordinates for nodes
  const nodeCoords = {
    root: { x: 150, y: 25 },
    left: { x: 80, y: 65 },
    right: { x: 220, y: 65 },
    leftLeft: { x: 40, y: 110 },
    leftRight: { x: 120, y: 110 },
    rightLeft: { x: 180, y: 110 },
    rightRight: { x: 260, y: 110 }
  };

  const renderNode = (key) => {
    const val = tree[key];
    if (val === undefined || val === null) return null;

    const coords = nodeCoords[key];
    const isActive = activeHighlightNode === key;
    const isSearchPath = searchPath.includes(key);

    let border = '2px solid var(--bg-tertiary)';
    let bg = 'var(--bg-secondary)';
    let color = '#FFFFFF';

    if (isActive) {
      border = '2.5px solid #f59e0b';
      bg = 'rgba(245,158,11,0.2)';
      color = '#f59e0b';
    } else if (isSearchPath) {
      border = '2px solid #1591DC';
      bg = 'rgba(21,145,220,0.1)';
      color = '#1591DC';
    }

    return (
      <g key={key}>
        <circle
          cx={coords.x}
          cy={coords.y}
          r="14"
          fill={bg}
          stroke={isActive ? '#f59e0b' : isSearchPath ? '#1591DC' : 'var(--bg-tertiary)'}
          strokeWidth="2.5"
          style={{ transition: 'all 0.3s' }}
        />
        <text
          x={coords.x}
          y={coords.y + 4}
          textAnchor="middle"
          fill={color}
          style={{ fontSize: '0.75rem', fontWeight: '800', fontFamily: 'sans-serif' }}
        >
          {val}
        </text>
      </g>
    );
  };

  return (
    <VisualizerShell
      title="Binary Search Tree (BST) Simulator"
      subtitle="Insert keys, search pathways, and run animated traversals across binary hierarchies."
      timeComplexity="Average O(log N), Worst O(N)"
      spaceComplexity="O(N)"
      theoryContent={theory}
      analogyContent={analogy}
      mistakesContent={mistakes}
      interviewQuestions={interviewQuestions}
      quizQuestions={quizQuestions}
      controls={controls}
      logs={logs}
      stateInspector={stateInspector}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%', minHeight: '180px' }}>
        
        {/* SVG Tree */}
        <svg width="300" height="135" style={{ overflow: 'visible' }}>
          {/* Draw Link Lines */}
          {tree.root && tree.left && <line x1="140" y1="32" x2="90" y2="58" stroke="var(--bg-tertiary)" strokeWidth="2" />}
          {tree.root && tree.right && <line x1="160" y1="32" x2="210" y2="58" stroke="var(--bg-tertiary)" strokeWidth="2" />}
          
          {tree.left && tree.leftLeft && <line x1="72" y1="72" x2="48" y2="102" stroke="var(--bg-tertiary)" strokeWidth="2" />}
          {tree.left && tree.leftRight && <line x1="88" y1="72" x2="112" y2="102" stroke="var(--bg-tertiary)" strokeWidth="2" />}
          
          {tree.right && tree.rightLeft && <line x1="212" y1="72" x2="188" y2="102" stroke="var(--bg-tertiary)" strokeWidth="2" />}
          {tree.right && tree.rightRight && <line x1="228" y1="72" x2="252" y2="102" stroke="var(--bg-tertiary)" strokeWidth="2" />}

          {/* Draw Nodes */}
          {Object.keys(nodeCoords).map(k => renderNode(k))}
        </svg>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '1.5px solid #1591DC' }}></div> Search Path
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '1.5px solid #f59e0b', backgroundColor: 'rgba(245,158,11,0.2)' }}></div> Active Traverser
          </div>
        </div>

      </div>
    </VisualizerShell>
  );
}
