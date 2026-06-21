import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function AvlVisualizer() {
  // Tree state stored as map of node ID to node object
  // node: { id, val, left, right, height }
  const [nodes, setNodes] = useState({
    50: { id: 50, val: 50, left: 30, right: 70, height: 3 },
    30: { id: 30, val: 30, left: 20, right: 40, height: 2 },
    70: { id: 70, val: 70, left: 60, right: 80, height: 2 },
    20: { id: 20, val: 20, left: null, right: null, height: 1 },
    40: { id: 40, val: 40, left: null, right: null, height: 1 },
    60: { id: 60, val: 60, left: null, right: null, height: 1 },
    80: { id: 80, val: 80, left: null, right: null, height: 1 }
  });
  const [rootId, setRootId] = useState(50);
  const [inputVal, setInputVal] = useState('');
  
  // Playback steps
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);
  const [steps, setSteps] = useState([
    {
      nodes: {
        50: { id: 50, val: 50, left: 30, right: 70, height: 3 },
        30: { id: 30, val: 30, left: 20, right: 40, height: 2 },
        70: { id: 70, val: 70, left: 60, right: 80, height: 2 },
        20: { id: 20, val: 20, left: null, right: null, height: 1 },
        40: { id: 40, val: 40, left: null, right: null, height: 1 },
        60: { id: 60, val: 60, left: null, right: null, height: 1 },
        80: { id: 80, val: 80, left: null, right: null, height: 1 }
      },
      rootId: 50,
      log: 'AVL Tree initialized. Insert a key to trace insertion and rotations.',
      highlightNodeId: null,
      balanceFactors: { 50: 0, 30: 0, 70: 0, 20: 0, 40: 0, 60: 0, 80: 0 }
    }
  ]);

  // Helper getters
  const getHeight = (id, treeNodes) => {
    if (!id || !treeNodes[id]) return 0;
    return treeNodes[id].height;
  };

  const getBalance = (id, treeNodes) => {
    if (!id || !treeNodes[id]) return 0;
    return getHeight(treeNodes[id].left, treeNodes) - getHeight(treeNodes[id].right, treeNodes);
  };

  const updateHeight = (id, treeNodes) => {
    if (!id || !treeNodes[id]) return;
    treeNodes[id].height = 1 + Math.max(getHeight(treeNodes[id].left, treeNodes), getHeight(treeNodes[id].right, treeNodes));
  };

  const cloneNodes = (treeNodes) => JSON.parse(JSON.stringify(treeNodes));

  const getAllBalanceFactors = (treeNodes) => {
    const bfs = {};
    Object.keys(treeNodes).forEach(id => {
      bfs[id] = getBalance(Number(id), treeNodes);
    });
    return bfs;
  };

  // Generate trace for AVL insertion
  const handleInsert = () => {
    const val = Number(inputVal);
    if (isNaN(val) || val < 1 || val > 99) {
      alert('Please enter an integer between 1 and 99.');
      return;
    }
    if (nodes[val]) {
      alert('Duplicate keys not allowed.');
      return;
    }

    let trace = [];
    let treeNodes = cloneNodes(nodes);
    let currRoot = rootId;

    // Phase 1: BST Insertion
    trace.push({
      nodes: cloneNodes(treeNodes),
      rootId: currRoot,
      log: `Starting insertion of key ${val}. Traversing tree...`,
      highlightNodeId: currRoot,
      balanceFactors: getAllBalanceFactors(treeNodes)
    });

    const insertNode = (root, key) => {
      if (!root) {
        treeNodes[key] = { id: key, val: key, left: null, right: null, height: 1 };
        return key;
      }

      trace.push({
        nodes: cloneNodes(treeNodes),
        rootId: currRoot,
        log: `Comparing new key ${key} with node ${root}...`,
        highlightNodeId: root,
        balanceFactors: getAllBalanceFactors(treeNodes)
      });

      if (key < root) {
        const nextLeft = treeNodes[root].left;
        treeNodes[root].left = insertNode(nextLeft, key);
      } else {
        const nextRight = treeNodes[root].right;
        treeNodes[root].right = insertNode(nextRight, key);
      }

      updateHeight(root, treeNodes);
      return root;
    };

    currRoot = insertNode(currRoot, val);

    trace.push({
      nodes: cloneNodes(treeNodes),
      rootId: currRoot,
      log: `Inserted key ${val} as leaf node. Checking balance factors upwards...`,
      highlightNodeId: val,
      balanceFactors: getAllBalanceFactors(treeNodes)
    });

    // Phase 2: Balancing and Rotations
    // We backtrack from the inserted node to the root.
    // For trace simplicity, we can simulate the checks on nodes up the path.
    const findPathToRoot = (root, target, path = []) => {
      if (!root) return null;
      path.push(root);
      if (root === target) return path;
      if (target < root) return findPathToRoot(treeNodes[root].left, target, path);
      return findPathToRoot(treeNodes[root].right, target, path);
    };

    const path = findPathToRoot(currRoot, val) || [];
    path.reverse(); // Now from leaf to root

    let rotationDone = false;

    // Helper functions for rotation inside insertion trace
    const rightRotate = (y) => {
      const x = treeNodes[y].left;
      const T2 = treeNodes[x].right;
      treeNodes[x].right = y;
      treeNodes[y].left = T2;
      updateHeight(y, treeNodes);
      updateHeight(x, treeNodes);
      return x;
    };

    const leftRotate = (x) => {
      const y = treeNodes[x].right;
      const T2 = treeNodes[y].left;
      treeNodes[y].left = x;
      treeNodes[x].right = T2;
      updateHeight(x, treeNodes);
      updateHeight(y, treeNodes);
      return y;
    };

    // Reconstruct the parent pointers after rotation
    const updateParentPointer = (oldSubRoot, newSubRoot, checkRoot) => {
      if (checkRoot === oldSubRoot) {
        currRoot = newSubRoot;
        return;
      }
      Object.keys(treeNodes).forEach(id => {
        const node = treeNodes[id];
        if (node.left === oldSubRoot) node.left = newSubRoot;
        if (node.right === oldSubRoot) node.right = newSubRoot;
      });
    };

    for (let i = 0; i < path.length; i++) {
      const nodeId = path[i];
      updateHeight(nodeId, treeNodes);
      const balance = getBalance(nodeId, treeNodes);

      trace.push({
        nodes: cloneNodes(treeNodes),
        rootId: currRoot,
        log: `Checking Balance Factor at node ${nodeId}. Height: ${treeNodes[nodeId].height}, BF: ${balance}`,
        highlightNodeId: nodeId,
        balanceFactors: getAllBalanceFactors(treeNodes)
      });

      // LL Imbalance
      if (balance > 1 && val < treeNodes[nodeId].left) {
        trace.push({
          nodes: cloneNodes(treeNodes),
          rootId: currRoot,
          log: `Left-Left (LL) imbalance detected at node ${nodeId} (BF: ${balance}). Initiating Single Right Rotation...`,
          highlightNodeId: nodeId,
          balanceFactors: getAllBalanceFactors(treeNodes)
        });
        const newSubRoot = rightRotate(nodeId);
        updateParentPointer(nodeId, newSubRoot, currRoot);
        rotationDone = true;
        trace.push({
          nodes: cloneNodes(treeNodes),
          rootId: currRoot,
          log: `Right Rotation complete around node ${nodeId}. New sub-root is ${newSubRoot}. Balance restored.`,
          highlightNodeId: newSubRoot,
          balanceFactors: getAllBalanceFactors(treeNodes)
        });
        break;
      }

      // RR Imbalance
      if (balance < -1 && val > treeNodes[nodeId].right) {
        trace.push({
          nodes: cloneNodes(treeNodes),
          rootId: currRoot,
          log: `Right-Right (RR) imbalance detected at node ${nodeId} (BF: ${balance}). Initiating Single Left Rotation...`,
          highlightNodeId: nodeId,
          balanceFactors: getAllBalanceFactors(treeNodes)
        });
        const newSubRoot = leftRotate(nodeId);
        updateParentPointer(nodeId, newSubRoot, currRoot);
        rotationDone = true;
        trace.push({
          nodes: cloneNodes(treeNodes),
          rootId: currRoot,
          log: `Left Rotation complete around node ${nodeId}. New sub-root is ${newSubRoot}. Balance restored.`,
          highlightNodeId: newSubRoot,
          balanceFactors: getAllBalanceFactors(treeNodes)
        });
        break;
      }

      // LR Imbalance
      if (balance > 1 && val > treeNodes[nodeId].left) {
        const leftChild = treeNodes[nodeId].left;
        trace.push({
          nodes: cloneNodes(treeNodes),
          rootId: currRoot,
          log: `Left-Right (LR) imbalance at node ${nodeId} (BF: ${balance}). Step 1: Left Rotate child node ${leftChild}...`,
          highlightNodeId: leftChild,
          balanceFactors: getAllBalanceFactors(treeNodes)
        });
        
        const rotatedChild = leftRotate(leftChild);
        treeNodes[nodeId].left = rotatedChild;
        
        trace.push({
          nodes: cloneNodes(treeNodes),
          rootId: currRoot,
          log: `Step 1 complete. Left child is now ${rotatedChild}. Step 2: Right Rotate node ${nodeId}...`,
          highlightNodeId: nodeId,
          balanceFactors: getAllBalanceFactors(treeNodes)
        });

        const newSubRoot = rightRotate(nodeId);
        updateParentPointer(nodeId, newSubRoot, currRoot);
        rotationDone = true;
        
        trace.push({
          nodes: cloneNodes(treeNodes),
          rootId: currRoot,
          log: `Double rotation complete. New sub-root is ${newSubRoot}. Balance restored.`,
          highlightNodeId: newSubRoot,
          balanceFactors: getAllBalanceFactors(treeNodes)
        });
        break;
      }

      // RL Imbalance
      if (balance < -1 && val < treeNodes[nodeId].right) {
        const rightChild = treeNodes[nodeId].right;
        trace.push({
          nodes: cloneNodes(treeNodes),
          rootId: currRoot,
          log: `Right-Left (RL) imbalance at node ${nodeId} (BF: ${balance}). Step 1: Right Rotate child node ${rightChild}...`,
          highlightNodeId: rightChild,
          balanceFactors: getAllBalanceFactors(treeNodes)
        });
        
        const rotatedChild = rightRotate(rightChild);
        treeNodes[nodeId].right = rotatedChild;
        
        trace.push({
          nodes: cloneNodes(treeNodes),
          rootId: currRoot,
          log: `Step 1 complete. Right child is now ${rotatedChild}. Step 2: Left Rotate node ${nodeId}...`,
          highlightNodeId: nodeId,
          balanceFactors: getAllBalanceFactors(treeNodes)
        });

        const newSubRoot = leftRotate(nodeId);
        updateParentPointer(nodeId, newSubRoot, currRoot);
        rotationDone = true;

        trace.push({
          nodes: cloneNodes(treeNodes),
          rootId: currRoot,
          log: `Double rotation complete. New sub-root is ${newSubRoot}. Balance restored.`,
          highlightNodeId: newSubRoot,
          balanceFactors: getAllBalanceFactors(treeNodes)
        });
        break;
      }
    }

    if (!rotationDone) {
      trace.push({
        nodes: cloneNodes(treeNodes),
        rootId: currRoot,
        log: `Key ${val} successfully inserted. No balancing rotations required!`,
        highlightNodeId: null,
        balanceFactors: getAllBalanceFactors(treeNodes)
      });
    }

    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
    setInputVal('');
    // Apply final state immediately to state (or it updates during play)
    setNodes(treeNodes);
    setRootId(currRoot);
  };

  // Playback timer
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < steps.length - 1) {
            const nextStep = prev + 1;
            setNodes(steps[nextStep].nodes);
            setRootId(steps[nextStep].rootId);
            return nextStep;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, speed, steps]);

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setNodes(steps[nextStep].nodes);
      setRootId(steps[nextStep].rootId);
      setCurrentStep(nextStep);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setNodes(steps[prevStep].nodes);
      setRootId(steps[prevStep].rootId);
      setCurrentStep(prevStep);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    const initialNodes = {
      50: { id: 50, val: 50, left: 30, right: 70, height: 3 },
      30: { id: 30, val: 30, left: 20, right: 40, height: 2 },
      70: { id: 70, val: 70, left: 60, right: 80, height: 2 },
      20: { id: 20, val: 20, left: null, right: null, height: 1 },
      40: { id: 40, val: 40, left: null, right: null, height: 1 },
      60: { id: 60, val: 60, left: null, right: null, height: 1 },
      80: { id: 80, val: 80, left: null, right: null, height: 1 }
    };
    setNodes(initialNodes);
    setRootId(50);
    setSteps([
      {
        nodes: initialNodes,
        rootId: 50,
        log: 'AVL Tree initialized. Insert a key to trace insertion and rotations.',
        highlightNodeId: null,
        balanceFactors: { 50: 0, 30: 0, 70: 0, 20: 0, 40: 0, 60: 0, 80: 0 }
      }
    ]);
  };

  const handleClear = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setNodes({});
    setRootId(null);
    setSteps([
      {
        nodes: {},
        rootId: null,
        log: 'Tree cleared. Insert a new root node to begin.',
        highlightNodeId: null,
        balanceFactors: {}
      }
    ]);
  };

  // Node layout coordinator calculation
  const nodeCoords = {};
  const activeStep = steps[currentStep] || steps[0];
  const activeNodes = activeStep.nodes;
  const activeRoot = activeStep.rootId;

  const assignCoords = (id, depth, minX, maxX) => {
    if (!id || !activeNodes[id]) return;
    const x = (minX + maxX) / 2;
    const y = 30 + depth * 55;
    nodeCoords[id] = { x, y };
    assignCoords(activeNodes[id].left, depth + 1, minX, x);
    assignCoords(activeNodes[id].right, depth + 1, x, maxX);
  };

  if (activeRoot) {
    assignCoords(activeRoot, 0, 10, 390);
  }

  // Draw lines
  const links = [];
  const computeLinks = (id) => {
    if (!id || !activeNodes[id]) return;
    const node = activeNodes[id];
    if (node.left && activeNodes[node.left]) {
      links.push({
        id: `${id}-${node.left}`,
        x1: nodeCoords[id].x,
        y1: nodeCoords[id].y,
        x2: nodeCoords[node.left].x,
        y2: nodeCoords[node.left].y
      });
      computeLinks(node.left);
    }
    if (node.right && activeNodes[node.right]) {
      links.push({
        id: `${id}-${node.right}`,
        x1: nodeCoords[id].x,
        y1: nodeCoords[id].y,
        x2: nodeCoords[node.right].x,
        y2: nodeCoords[node.right].y
      });
      computeLinks(node.right);
    }
  };
  if (activeRoot) {
    computeLinks(activeRoot);
  }

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
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
        Insert & Balance
      </button>
      <button className="btn-viz-action btn-clear" onClick={handleClear}>
        Clear Tree
      </button>
      <button className="btn-viz-action" onClick={handleReset}>
        Reset Balanced
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
      <div>Root Node: <strong style={{ color: '#FFFFFF' }}>{activeRoot || 'null'}</strong></div>
      <div>High-priority Check: <span style={{ color: '#1591DC' }}>{activeStep.highlightNodeId ? `Verifying node ${activeStep.highlightNodeId}` : 'None'}</span></div>
      <div>Total Nodes: <span style={{ color: '#FFFFFF' }}>{Object.keys(activeNodes).length}</span></div>
    </div>
  );

  const theory = (
    <div>
      <p>An <strong>AVL Tree</strong> is a self-balancing Binary Search Tree (BST) named after inventors <strong>Adelson-Velsky and Landis</strong>. It maintains height balance by enforcing the balance condition:</p>
      <ul>
        <li><strong>Balance Factor (BF):</strong> For any node, the difference between the height of its left and right subtrees must be at most 1: <code>BF = Height(Left) - Height(Right)</code>.</li>
        <li><strong>Self-Balancing:</strong> If an insertion or deletion causes BF to become &gt; 1 or &lt; -1, rotation algorithms are executed:
          <ul>
            <li><strong>Single Rotations:</strong> Left-Left (LL) triggers a Right Rotation; Right-Right (RR) triggers a Left Rotation.</li>
            <li><strong>Double Rotations:</strong> Left-Right (LR) triggers Left Rotate on child then Right Rotate on parent; Right-Left (RL) triggers Right Rotate on child then Left Rotate on parent.</li>
          </ul>
        </li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of an AVL Tree as a **balanced scale hanging system**:</p>
      <ul>
        <li>When you add ornaments to a hanging mobile sculpture, it will tip over if one side becomes too heavy.</li>
        <li>To restore balance, you shift the support hooks or reorganize the elements. That shift is the **rotation** that brings the center of gravity back to the middle!</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Incorrect Height Computation:</strong> Forgetting that a leaf node has a height of 1, and an empty pointer has a height of 0.</li>
      <li><strong>Wrong Rotation Direction:</strong> Mixing up left and right pivots. Remember: Right rotation shifts nodes clockwise; Left rotation shifts counter-clockwise.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is the maximum height of an AVL tree with N nodes?',
      a: 'The maximum height is approximately 1.44 * log2(N), which guarantees that lookups, insertions, and deletions remain strictly O(log N) in the worst case.'
    },
    {
      q: 'When does a double rotation (LR or RL) become necessary?',
      a: 'A double rotation is required when the insertion happens in the "inner" grandchild subtree (e.g. left child\'s right subtree, or right child\'s left subtree).'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which rotation is performed to fix a Right-Left (RL) imbalance?',
      options: [
        'Right rotation on child, then Left rotation on parent',
        'Left rotation on child, then Right rotation on parent',
        'Single Left rotation',
        'Single Right rotation'
      ],
      correctIdx: 0,
      explanation: 'An RL imbalance requires a Right rotation on the right child first to convert it to an RR imbalance, followed by a Left rotation on the parent.'
    },
    {
      question: 'What is the balance factor of a node whose left subtree has height 3 and right subtree has height 1?',
      options: [
        '2 (unbalanced)',
        '-2 (unbalanced)',
        '1 (balanced)',
        '0 (balanced)'
      ],
      correctIdx: 0,
      explanation: 'BF = Height(Left) - Height(Right) = 3 - 1 = 2. Since the absolute value is > 1, the node is unbalanced.'
    }
  ];

  return (
    <VisualizerShell
      title="AVL Tree self-balancing Simulator"
      subtitle="Watch LL, RR, LR, and RL rotations restore perfect height balance."
      timeComplexity="O(log N)"
      spaceComplexity="O(N)"
      theoryContent={theory}
      analogyContent={analogy}
      mistakesContent={mistakes}
      interviewQuestions={interviewQuestions}
      quizQuestions={quizQuestions}
      controls={controls}
      logs={[activeStep.log]}
      stateInspector={stateInspector}
      playbackProps={{
        play: () => setIsPlaying(true),
        pause: () => setIsPlaying(false),
        stepForward: handleStepForward,
        stepBackward: handleStepBackward,
        reset: handleReset,
        isPlaying,
        speed,
        setSpeed,
        currentStep,
        totalSteps: steps.length
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%', minHeight: '230px', padding: '1rem 0' }}>
        
        {activeRoot ? (
          <svg width="400" height="200" style={{ overflow: 'visible' }}>
            {/* Draw Links */}
            {links.map(link => (
              <line
                key={link.id}
                x1={link.x1}
                y1={link.y1}
                x2={link.x2}
                y2={link.y2}
                stroke="var(--bg-tertiary)"
                strokeWidth="2"
              />
            ))}

            {/* Draw Nodes */}
            {Object.keys(nodeCoords).map(id => {
              const node = activeNodes[id];
              const coords = nodeCoords[id];
              const isActive = activeStep.highlightNodeId === Number(id);
              const bf = activeStep.balanceFactors[id] !== undefined ? activeStep.balanceFactors[id] : 0;
              const isUnbalanced = Math.abs(bf) > 1;

              let bg = 'var(--bg-secondary)';
              let stroke = 'var(--bg-tertiary)';
              let color = '#FFFFFF';

              if (isActive) {
                bg = 'rgba(21, 145, 220, 0.15)';
                stroke = '#1591DC';
                color = '#1591DC';
              } else if (isUnbalanced) {
                bg = 'rgba(239, 68, 68, 0.15)';
                stroke = '#ef4444';
              }

              return (
                <g key={id}>
                  {/* Balance Factor Label above node */}
                  <text
                    x={coords.x}
                    y={coords.y - 18}
                    textAnchor="middle"
                    fill={isUnbalanced ? '#ef4444' : 'var(--text-secondary)'}
                    style={{ fontSize: '0.65rem', fontWeight: 'bold', fontFamily: 'monospace' }}
                  >
                    BF: {bf}
                  </text>
                  
                  {/* Node Circle */}
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r="13"
                    fill={bg}
                    stroke={stroke}
                    strokeWidth="2.5"
                    style={{ transition: 'all 0.3s' }}
                  />
                  
                  {/* Node Value */}
                  <text
                    x={coords.x}
                    y={coords.y + 4}
                    textAnchor="middle"
                    fill={color}
                    style={{ fontSize: '0.75rem', fontWeight: '800', fontFamily: 'sans-serif' }}
                  >
                    {node.val}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : (
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginTop: '3rem' }}>
            Tree is empty. Insert a value to start.
          </div>
        )}

        {/* Legend */}
        {activeRoot && (
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '1.5px solid #1591DC', backgroundColor: 'rgba(21, 145, 220, 0.15)' }}></div> Selected
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '1.5px solid #ef4444', backgroundColor: 'rgba(239, 68, 68, 0.15)' }}></div> Unbalanced Node (|BF| &gt; 1)
            </div>
          </div>
        )}

      </div>
    </VisualizerShell>
  );
}
