import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function TrieVisualizer() {
  const [nodes, setNodes] = useState({
    root: { id: 'root', char: '*', children: ['c', 'd'], isEnd: false },
    c: { id: 'c', char: 'C', children: ['ca'], isEnd: false },
    ca: { id: 'ca', char: 'A', children: ['cat', 'car'], isEnd: false },
    cat: { id: 'cat', char: 'T', children: [], isEnd: true },
    car: { id: 'car', char: 'R', children: [], isEnd: true },
    d: { id: 'd', char: 'D', children: ['do'], isEnd: false },
    do: { id: 'do', char: 'O', children: ['dog'], isEnd: false },
    dog: { id: 'dog', char: 'G', children: [], isEnd: true }
  });
  
  const [inputWord, setInputWord] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  // Playback states
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [steps, setSteps] = useState([
    {
      nodes: {
        root: { id: 'root', char: '*', children: ['c', 'd'], isEnd: false },
        c: { id: 'c', char: 'C', children: ['ca'], isEnd: false },
        ca: { id: 'ca', char: 'A', children: ['cat', 'car'], isEnd: false },
        cat: { id: 'cat', char: 'T', children: [], isEnd: true },
        car: { id: 'car', char: 'R', children: [], isEnd: true },
        d: { id: 'd', char: 'D', children: ['do'], isEnd: false },
        do: { id: 'do', char: 'O', children: ['dog'], isEnd: false },
        dog: { id: 'dog', char: 'G', children: [], isEnd: true }
      },
      log: 'Trie initialized with sample words: CAT, CAR, DOG.',
      highlightNodeId: null,
      activePath: []
    }
  ]);

  const cloneNodes = (trieNodes) => JSON.parse(JSON.stringify(trieNodes));

  // Word insertion trace generator
  const handleInsert = () => {
    const word = inputWord.trim().toUpperCase();
    if (!word || !/^[A-Z]+$/.test(word)) {
      alert('Please enter a word containing only alphabetical letters.');
      return;
    }
    if (word.length > 5) {
      alert('Keep words short (max 5 letters) for visual clarity.');
      return;
    }

    let trace = [];
    let treeNodes = cloneNodes(nodes);

    trace.push({
      nodes: cloneNodes(treeNodes),
      log: `Prepare to insert word "${word}". Start at root node '*'.`,
      highlightNodeId: 'root',
      activePath: ['root']
    });

    let currId = 'root';
    let path = ['root'];

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      // Generate ID based on accumulated prefix to prevent duplicates
      const prefix = word.substring(0, i + 1).toLowerCase();
      
      const isExist = treeNodes[currId].children.includes(prefix);

      if (isExist) {
        currId = prefix;
        path.push(currId);
        trace.push({
          nodes: cloneNodes(treeNodes),
          log: `Character "${char}" already exists. Traverse to node [${currId.toUpperCase()}].`,
          highlightNodeId: currId,
          activePath: [...path]
        });
      } else {
        // Create new node
        treeNodes[prefix] = {
          id: prefix,
          char,
          children: [],
          isEnd: false
        };
        treeNodes[currId].children.push(prefix);

        trace.push({
          nodes: cloneNodes(treeNodes),
          log: `Character "${char}" not found. Create node [${prefix.toUpperCase()}].`,
          highlightNodeId: prefix,
          activePath: [...path]
        });

        currId = prefix;
        path.push(currId);
      }
    }

    // Mark end of word
    treeNodes[currId].isEnd = true;
    trace.push({
      nodes: cloneNodes(treeNodes),
      log: `Successfully marked node [${currId.toUpperCase()}] as word terminator (end of "${word}").`,
      highlightNodeId: currId,
      activePath: [...path]
    });

    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
    setInputWord('');
    setNodes(treeNodes);
    setSuggestions([]);
    setSelectedNode(null);
  };

  // Search prefix/word trace generator
  const handleSearch = (mode = 'word') => {
    const target = searchWord.trim().toUpperCase();
    if (!target || !/^[A-Z]+$/.test(target)) {
      alert('Please enter letters to search.');
      return;
    }

    let trace = [];
    let currId = 'root';
    let path = ['root'];
    let success = true;

    trace.push({
      nodes: cloneNodes(nodes),
      log: `Searching for prefix "${target}". Start at root node '*'.`,
      highlightNodeId: 'root',
      activePath: ['root']
    });

    for (let i = 0; i < target.length; i++) {
      const char = target[i];
      const prefix = target.substring(0, i + 1).toLowerCase();

      if (nodes[currId].children.includes(prefix)) {
        currId = prefix;
        path.push(currId);
        trace.push({
          nodes: cloneNodes(nodes),
          log: `Found character "${char}" -> Traverse to node [${currId.toUpperCase()}].`,
          highlightNodeId: currId,
          activePath: [...path]
        });
      } else {
        success = false;
        trace.push({
          nodes: cloneNodes(nodes),
          log: `Character "${char}" not found at index ${i}. Search failed!`,
          highlightNodeId: currId,
          activePath: [...path]
        });
        break;
      }
    }

    if (success) {
      if (mode === 'word') {
        const isEndNode = nodes[currId].isEnd;
        if (isEndNode) {
          trace.push({
            nodes: cloneNodes(nodes),
            log: `Word "${target}" is in the Trie! Node has isEndOfWord = true.`,
            highlightNodeId: currId,
            activePath: [...path]
          });
        } else {
          trace.push({
            nodes: cloneNodes(nodes),
            log: `Prefix "${target}" exists, but complete word "${target}" is NOT in the Trie.`,
            highlightNodeId: currId,
            activePath: [...path]
          });
        }
      } else {
        trace.push({
          nodes: cloneNodes(nodes),
          log: `Prefix "${target}" found in the Trie!`,
          highlightNodeId: currId,
          activePath: [...path]
        });
      }
    }

    setSteps(trace);
    setCurrentStep(0);
    setIsPlaying(false);
    setSearchWord('');
  };

  // Find autocomplete words starting from a node
  const handleAutocomplete = (nodeId) => {
    if (!nodes[nodeId]) return;
    
    let words = [];
    const collectWords = (id, currentWord) => {
      const node = nodes[id];
      const newWord = id === 'root' ? '' : currentWord + node.char;
      if (node.isEnd) {
        words.push(newWord);
      }
      node.children.forEach(childId => {
        collectWords(childId, newWord);
      });
    };

    collectWords(nodeId, '');
    setSuggestions(words);
    setSelectedNode(nodeId);
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
      setCurrentStep(nextStep);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setNodes(steps[prevStep].nodes);
      setCurrentStep(prevStep);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    const initialNodes = {
      root: { id: 'root', char: '*', children: ['c', 'd'], isEnd: false },
      c: { id: 'c', char: 'C', children: ['ca'], isEnd: false },
      ca: { id: 'ca', char: 'A', children: ['cat', 'car'], isEnd: false },
      cat: { id: 'cat', char: 'T', children: [], isEnd: true },
      car: { id: 'car', char: 'R', children: [], isEnd: true },
      d: { id: 'd', char: 'D', children: ['do'], isEnd: false },
      do: { id: 'do', char: 'O', children: ['dog'], isEnd: false },
      dog: { id: 'dog', char: 'G', children: [], isEnd: true }
    };
    setNodes(initialNodes);
    setSuggestions([]);
    setSelectedNode(null);
    setSteps([
      {
        nodes: initialNodes,
        log: 'Trie reset to sample words (CAT, CAR, DOG).',
        highlightNodeId: null,
        activePath: []
      }
    ]);
  };

  const handleClear = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    const cleared = { root: { id: 'root', char: '*', children: [], isEnd: false } };
    setNodes(cleared);
    setSuggestions([]);
    setSelectedNode(null);
    setSteps([
      {
        nodes: cleared,
        log: 'Trie cleared. Insert words to begin.',
        highlightNodeId: null,
        activePath: []
      }
    ]);
  };

  // Coordinates Layout Calculation
  const activeStepData = steps[currentStep] || steps[0];
  const activeNodes = activeStepData.nodes;
  const nodeCoords = {};

  const assignCoords = (id, depth, minX, maxX) => {
    if (!id || !activeNodes[id]) return;
    const x = (minX + maxX) / 2;
    const y = 25 + depth * 45;
    nodeCoords[id] = { x, y };

    const children = activeNodes[id].children;
    if (children.length === 0) return;

    const step = (maxX - minX) / children.length;
    children.forEach((childId, i) => {
      assignCoords(childId, depth + 1, minX + i * step, minX + (i + 1) * step);
    });
  };

  assignCoords('root', 0, 10, 390);

  // Collect links
  const links = [];
  Object.keys(nodeCoords).forEach(id => {
    const node = activeNodes[id];
    if (!node) return;
    node.children.forEach(childId => {
      if (nodeCoords[childId]) {
        links.push({
          id: `link-${id}-${childId}`,
          x1: nodeCoords[id].x,
          y1: nodeCoords[id].y,
          x2: nodeCoords[childId].x,
          y2: nodeCoords[childId].y
        });
      }
    });
  });

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <input
        type="text"
        placeholder="e.g. CAT"
        value={inputWord}
        onChange={(e) => setInputWord(e.target.value)}
        style={{
          width: '90px',
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
        Insert Word
      </button>

      <input
        type="text"
        placeholder="e.g. CA"
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
        style={{
          width: '90px',
          padding: '0.45rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem',
          textAlign: 'center'
        }}
      />
      <button className="btn-viz-action" onClick={() => handleSearch('word')}>
        Search Word
      </button>
      <button className="btn-viz-action" onClick={() => handleSearch('prefix')}>
        Search Prefix
      </button>
      
      <button className="btn-viz-action btn-clear" onClick={handleClear}>
        Clear
      </button>
      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
      <div>Total Node Count: <strong style={{ color: '#FFFFFF' }}>{Object.keys(activeNodes).length}</strong></div>
      <div>Selected for Autocomplete: <span style={{ color: 'var(--brand-cyan)' }}>{selectedNode ? `Node [${selectedNode.toUpperCase()}]` : 'None. Click a node to view suggestions.'}</span></div>
      {suggestions.length > 0 && (
        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
          Suggestions: {suggestions.map((w, idx) => (
            <span key={idx} style={{
              backgroundColor: 'rgba(21, 145, 220, 0.1)',
              border: '1px solid #1591DC',
              color: '#1591DC',
              padding: '0.1rem 0.4rem',
              borderRadius: '2px',
              fontSize: '0.75rem'
            }}>
              {w}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>Trie</strong> (derived from "retrieval"), or **Prefix Tree**, is a specialized search tree used to store associative arrays where keys are strings:</p>
      <ul>
        <li><strong>Character Nodes:</strong> Unlike standard binary search trees, no node in the Trie stores the key itself. Instead, its position in the tree defines the key it is associated with.</li>
        <li><strong>Common Prefix Sharing:</strong> All descendants of a node share a common string prefix. For instance, "CAT" and "CAR" share the prefix node chain <code>C - A</code>.</li>
        <li><strong>Word Endings:</strong> A Boolean flag <code>isEndOfWord</code> specifies whether a complete word finishes at that node.</li>
        <li><strong>Time Complexity:</strong> Lookups and insertions run in <code>O(K)</code> time, where <code>K</code> is the length of the word, completely independent of the size of the dictionary!</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of a Trie as a **Smartphone Predictive Text Keyboard**:</p>
      <ul>
        <li>When you type <code>D</code>, the system locates the <code>D</code> node and instantly scans all child characters branching from it.</li>
        <li>If you then type <code>O</code>, it follows the link to <code>O</code>, showing completions like <code>DOG</code>, <code>DOOR</code>, and <code>DOUBLE</code>.</li>
        <li>It doesn't scan the entire dictionary; it just walks down the prefix path and returns the leaves!</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Prefix Confusions:</strong> Forgetting to mark the final node as <code>isEndOfWord = true</code>, which causes search lookups to report that a word doesn't exist.</li>
      <li><strong>Memory Overhead:</strong> Each node might contain up to 26 child pointers (for A-Z). If not managed, this creates sparse trees. <em>Solution: Use HashMaps or Compressed Tries (Patricia Tries).</em></li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Why is a Trie faster than a HashMap for auto-complete search engines?',
      a: 'A HashMap can check word existence in O(1) average time, but it cannot perform prefix-matching operations. Finding all words starting with "CA" in a HashMap requires scanning every key, O(N). In a Trie, we simply walk to node "CA" and DFS its children, which is O(K + M) where M is the matching results.'
    },
    {
      q: 'How does a Compressed Trie differ from a Standard Trie?',
      a: 'A Compressed Trie (or Radix Tree) collapses single-child node sequences into a single edge (e.g. nodes "c" -> "a" -> "r" are merged into a single node "car" if there are no other branching paths). This saves memory.'
    }
  ];

  const quizQuestions = [
    {
      question: 'If you insert words "CAR", "CART", and "CAT" into an empty Trie, how many nodes (including root) will be created?',
      options: [
        '5 nodes',
        '6 nodes',
        '7 nodes',
        '8 nodes'
      ],
      correctIdx: 1,
      explanation: 'Root (*) node: 1. Letter C: 1. Letter A: 1. From A, we branch to R (which has child T) and T. That creates: C, A, R, RT (R -> T), T. Total: root (1) + C (1) + A (1) + R (1) + T (from R, 1) + T (from A, 1) = 6 nodes.'
    },
    {
      question: 'What is the search time complexity to check if a word of length L is present in a Trie?',
      options: [
        'O(1)',
        'O(L)',
        'O(log N)',
        'O(N)'
      ],
      correctIdx: 1,
      explanation: 'We perform exactly L node comparisons to reach the final character node. Thus, the search time is O(L), completely independent of the size of the database.'
    }
  ];

  return (
    <VisualizerShell
      title="Trie (Prefix Tree) Simulator"
      subtitle="Insert strings, search paths, and explore interactive autocomplete suggestion networks."
      timeComplexity="O(K)"
      spaceComplexity="O(ALPHABET_SIZE * K * N)"
      theoryContent={theory}
      analogyContent={analogy}
      mistakesContent={mistakes}
      interviewQuestions={interviewQuestions}
      quizQuestions={quizQuestions}
      controls={controls}
      logs={[activeStepData.log]}
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
        
        {Object.keys(nodeCoords).length > 0 ? (
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
              if (!node) return null;
              const coords = nodeCoords[id];
              const isActive = activeStepData.highlightNodeId === id;
              const isPath = activeStepData.activePath.includes(id);

              let bg = 'var(--bg-secondary)';
              let stroke = 'var(--bg-tertiary)';
              let color = '#FFFFFF';

              if (isActive) {
                bg = 'rgba(21, 145, 220, 0.15)';
                stroke = '#1591DC';
                color = '#1591DC';
              } else if (isPath) {
                bg = 'rgba(16, 185, 129, 0.05)';
                stroke = '#10b981';
                color = '#10b981';
              }

              return (
                <g 
                  key={id} 
                  onClick={() => handleAutocomplete(id)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r="11"
                    fill={bg}
                    stroke={stroke}
                    strokeWidth="2"
                  />
                  <text
                    x={coords.x}
                    y={coords.y + 3.5}
                    textAnchor="middle"
                    fill={color}
                    style={{ fontSize: '0.65rem', fontWeight: '800', fontFamily: 'sans-serif' }}
                  >
                    {node.char}
                  </text>
                  
                  {/* End of Word indicator dot */}
                  {node.isEnd && (
                    <circle
                      cx={coords.x + 9}
                      cy={coords.y - 9}
                      r="3.5"
                      fill="#10b981"
                      stroke="var(--bg-primary)"
                      strokeWidth="1"
                      title="End of Word"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        ) : (
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginTop: '3rem' }}>
            Trie is empty. Insert a word to begin.
          </div>
        )}

        {/* Legend */}
        {Object.keys(nodeCoords).length > 0 && (
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(21, 145, 220, 0.15)', border: '1.5px solid #1591DC' }}></div> Selected
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1.5px solid #10b981' }}></div> Active Path
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></div> Word Terminator
            </div>
          </div>
        )}

      </div>
    </VisualizerShell>
  );
}
