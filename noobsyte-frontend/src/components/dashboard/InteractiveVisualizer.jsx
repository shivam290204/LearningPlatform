import React, { useState } from 'react';
import './InteractiveVisualizer.css';

export default function InteractiveVisualizer() {
  const [activeTopic, setActiveTopic] = useState('jvm');

  // ==========================================
  // 1. JVM Memory Simulation State & Actions
  // ==========================================
  const [jvmStep, setJvmStep] = useState('declare'); // 'declare' or 'allocate'

  // ==========================================
  // 2. ArrayList Simulation State & Actions
  // ==========================================
  const [arrayItems, setArrayItems] = useState([15, 30, 45]);
  const [arrayCapacity, setArrayCapacity] = useState(4);
  const [arrayLogs, setArrayLogs] = useState(['ArrayList initialized with size = 3, capacity = 4.']);
  const [isResizing, setIsResizing] = useState(false);

  const handleArrayListAdd = () => {
    if (isResizing) return;
    const val = Math.floor(Math.random() * 80 + 10);

    if (arrayItems.length < arrayCapacity) {
      setArrayItems(prev => [...prev, val]);
      setArrayLogs(prev => [
        `Added item ${val} at index ${arrayItems.length}.`,
        ...prev
      ]);
    } else {
      // Threshold reached, double size!
      setIsResizing(true);
      setArrayLogs(prev => [
        `Threshold reached! Triggering internal array resizing...`,
        ...prev
      ]);

      setTimeout(() => {
        const oldCapacity = arrayCapacity;
        const newCapacity = oldCapacity * 2;
        setArrayLogs(prev => [
          `Doubled capacity from ${oldCapacity} to ${newCapacity} & copied old elements.`,
          ...prev
        ]);
        setArrayCapacity(newCapacity);

        setTimeout(() => {
          setArrayItems(prev => [...prev, val]);
          setArrayLogs(prev => [
            `Added item ${val} at index ${arrayItems.length} inside the new expanded buffer.`,
            ...prev
          ]);
          setIsResizing(false);
        }, 600);
      }, 900);
    }
  };

  const handleArrayListClear = () => {
    setArrayItems([]);
    setArrayCapacity(4);
    setArrayLogs(['ArrayList cleared. Size = 0, capacity = 4.']);
    setIsResizing(false);
  };

  // ==========================================
  // 3. Singly Linked List State & Actions
  // ==========================================
  const [linkedNodes, setLinkedNodes] = useState([
    { id: 1, val: 12 },
    { id: 2, val: 45 },
    { id: 3, val: 78 }
  ]);
  const [listLogs, setListLogs] = useState(['Singly Linked List initialized with 3 nodes.']);

  const handleListInsertHead = () => {
    if (linkedNodes.length >= 6) {
      setListLogs(prev => ['Visualizer limit of 6 nodes reached.', ...prev]);
      return;
    }
    const val = Math.floor(Math.random() * 80 + 10);
    const newId = Date.now();
    setLinkedNodes(prev => [{ id: newId, val }, ...prev]);
    setListLogs(prev => [`Inserted Node(${val}) at the head. Pointer update: Head -> ${val}.`, ...prev]);
  };

  const handleListInsertTail = () => {
    if (linkedNodes.length >= 6) {
      setListLogs(prev => ['Visualizer limit of 6 nodes reached.', ...prev]);
      return;
    }
    const val = Math.floor(Math.random() * 80 + 10);
    const newId = Date.now();
    setLinkedNodes(prev => [...prev, { id: newId, val }]);
    setListLogs(prev => [`Inserted Node(${val}) at the tail. Old tail now points to new Node.`, ...prev]);
  };

  const handleListDeleteTail = () => {
    if (linkedNodes.length === 0) {
      setListLogs(prev => ['Underflow: List is empty.', ...prev]);
      return;
    }
    const removedVal = linkedNodes[linkedNodes.length - 1].val;
    setLinkedNodes(prev => prev.slice(0, -1));
    setListLogs(prev => [`Deleted tail Node(${removedVal}). Second-to-last node now points to null.`, ...prev]);
  };

  // ==========================================
  // 4. Stack State & Actions
  // ==========================================
  const [stackItems, setStackItems] = useState([12, 24, 48]);
  const [stackLogs, setStackLogs] = useState(['Stack initialized. Top points to index 2.']);

  const handleStackPush = () => {
    if (stackItems.length >= 5) {
      setStackLogs(prev => ['StackOverflowError! Stack limit (5 items) reached.', ...prev]);
      return;
    }
    const val = Math.floor(Math.random() * 80 + 10);
    setStackItems(prev => [...prev, val]);
    setStackLogs(prev => [`push(${val}): Pushed value on top. Top pointer moved to index ${stackItems.length}.`, ...prev]);
  };

  const handleStackPop = () => {
    if (stackItems.length === 0) {
      setStackLogs(prev => ['EmptyStackException! Pop operation underflow.', ...prev]);
      return;
    }
    const popped = stackItems[stackItems.length - 1];
    setStackItems(prev => prev.slice(0, -1));
    setStackLogs(prev => [`pop() -> Returned ${popped}. Top pointer moved to index ${stackItems.length - 2}.`, ...prev]);
  };

  // ==========================================
  // 5. Queue State & Actions
  // ==========================================
  const [queueItems, setQueueItems] = useState([8, 16, 32]);
  const [queueLogs, setQueueLogs] = useState(['Queue initialized. Front points to 8, Rear points to 32.']);

  const handleQueueEnqueue = () => {
    if (queueItems.length >= 5) {
      setQueueLogs(prev => ['Queue Full (Overflow)! Cannot add element.', ...prev]);
      return;
    }
    const val = Math.floor(Math.random() * 80 + 10);
    setQueueItems(prev => [...prev, val]);
    setQueueLogs(prev => [`enqueue(${val}): Added element to Rear. Rear pointer updated.`, ...prev]);
  };

  const handleQueueDequeue = () => {
    if (queueItems.length === 0) {
      setQueueLogs(prev => ['Queue Empty (Underflow)! Cannot remove element.', ...prev]);
      return;
    }
    const dequeued = queueItems[0];
    setQueueItems(prev => prev.slice(1));
    setQueueLogs(prev => [`dequeue() -> Removed ${dequeued} from Front. All elements shifted forward.`, ...prev]);
  };

  // ==========================================
  // 6. HashMap Simulation State & Actions
  // ==========================================
  const [mapBuckets, setMapBuckets] = useState(
    Array.from({ length: 8 }, () => [])
  );
  const [hashInputKey, setHashInputKey] = useState('');
  const [hashInputValue, setHashInputValue] = useState('');
  const [hashSearchKey, setHashSearchKey] = useState('');
  const [hashDeleteKey, setHashDeleteKey] = useState('');
  
  // Animation tracking
  const [hashStepDesc, setHashStepDesc] = useState('Idle. Enter a key-value pair and click Insert.');
  const [hashStage, setHashStage] = useState('idle'); // 'idle', 'hashing', 'compressing', 'traversing', 'modifying', 'done'
  const [activeHashVal, setActiveHashVal] = useState(null);
  const [activeBucketIdx, setActiveBucketIdx] = useState(null);
  const [activeNodeIdx, setActiveNodeIdx] = useState(null);
  const [hashLogs, setHashLogs] = useState(['HashMap initialized with 8 empty buckets.']);

  // Quiz State
  const [activeHashMapQuestion, setActiveHashMapQuestion] = useState(0);
  const [selectedHashMapAnswer, setSelectedHashMapAnswer] = useState(null);
  const [showHashMapExplanation, setShowHashMapExplanation] = useState(false);
  const [hashMapQuizScore, setHashMapQuizScore] = useState(0);

  const getDeterministicHash = (str) => {
    if (!str) return 0;
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
      sum += str.charCodeAt(i);
    }
    return sum;
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleHashMapInsert = async () => {
    if (!hashInputKey.trim() || !hashInputValue.trim()) {
      alert('Please enter both a key and a value.');
      return;
    }
    const key = hashInputKey.trim();
    const val = hashInputValue.trim();
    setHashInputKey('');
    setHashInputValue('');

    setHashStage('hashing');
    setHashStepDesc(`Calculating hashCode() for "${key}"...`);
    const hash = getDeterministicHash(key);
    setActiveHashVal(hash);
    setHashLogs(prev => [`Calculating hashCode("${key}") -> ${hash}`, ...prev]);
    await delay(1000);

    setHashStage('compressing');
    const bucketIdx = hash % 8;
    setHashStepDesc(`Compressing hash to bucket index: ${hash} % 8 = ${bucketIdx}`);
    setActiveBucketIdx(bucketIdx);
    setHashLogs(prev => [`Modulo compression: ${hash} % 8 = Bucket [${bucketIdx}]`, ...prev]);
    await delay(1000);

    setHashStage('traversing');
    const bucket = mapBuckets[bucketIdx];
    let nodeIndex = -1;
    let foundNode = false;

    setHashLogs(prev => [`Scanning Bucket [${bucketIdx}] (currently holds ${bucket.length} nodes)`, ...prev]);

    for (let i = 0; i < bucket.length; i++) {
      setActiveNodeIdx(i);
      setHashStepDesc(`Comparing key "${key}" with existing node key "${bucket[i].key}"...`);
      await delay(800);
      if (bucket[i].key === key) {
        nodeIndex = i;
        foundNode = true;
        break;
      }
    }

    setHashStage('modifying');
    if (foundNode) {
      setHashStepDesc(`Key match found! Overwriting value at index ${nodeIndex} with "${val}".`);
      setMapBuckets(prev => {
        const newBuckets = [...prev];
        const newBucket = [...newBuckets[bucketIdx]];
        newBucket[nodeIndex] = { ...newBucket[nodeIndex], value: val };
        newBuckets[bucketIdx] = newBucket;
        return newBuckets;
      });
      setHashLogs(prev => [`Updated Key "${key}" -> Value "${val}" in Bucket [${bucketIdx}]`, ...prev]);
    } else {
      setHashStepDesc(`Key not found. Appending new Node("${key}", "${val}") to the bucket.`);
      setMapBuckets(prev => {
        const newBuckets = [...prev];
        newBuckets[bucketIdx] = [...newBuckets[bucketIdx], { key, value: val, hash, next: null }];
        return newBuckets;
      });
      setHashLogs(prev => [`Inserted new Node("${key}", "${val}", hash=${hash}) into Bucket [${bucketIdx}]`, ...prev]);
    }
    await delay(1000);

    setHashStage('done');
    setHashStepDesc('Insert operation complete.');
    setActiveHashVal(null);
    setActiveBucketIdx(null);
    setActiveNodeIdx(null);
  };

  const handleHashMapSearch = async () => {
    if (!hashSearchKey.trim()) {
      alert('Please enter a key to search.');
      return;
    }
    const key = hashSearchKey.trim();
    setHashSearchKey('');

    setHashStage('hashing');
    setHashStepDesc(`Searching: Calculating hashCode() for "${key}"...`);
    const hash = getDeterministicHash(key);
    setActiveHashVal(hash);
    setHashLogs(prev => [`Search request: hashCode("${key}") -> ${hash}`, ...prev]);
    await delay(1000);

    setHashStage('compressing');
    const bucketIdx = hash % 8;
    setHashStepDesc(`Searching: Compressing hash to bucket index: ${hash} % 8 = ${bucketIdx}`);
    setActiveBucketIdx(bucketIdx);
    setHashLogs(prev => [`Search routing: index = ${hash} % 8 = Bucket [${bucketIdx}]`, ...prev]);
    await delay(1000);

    setHashStage('traversing');
    const bucket = mapBuckets[bucketIdx];
    let nodeIndex = -1;
    let foundNode = false;

    setHashLogs(prev => [`Search scanning Bucket [${bucketIdx}]...`, ...prev]);

    for (let i = 0; i < bucket.length; i++) {
      setActiveNodeIdx(i);
      setHashStepDesc(`Comparing search key "${key}" with node key "${bucket[i].key}"...`);
      await delay(800);
      if (bucket[i].key === key) {
        nodeIndex = i;
        foundNode = true;
        break;
      }
    }

    setHashStage('done');
    if (foundNode) {
      setHashStepDesc(`Match found! Key "${key}" maps to Value "${bucket[nodeIndex].value}" in Bucket [${bucketIdx}], Node [${nodeIndex}].`);
      setHashLogs(prev => [`FOUND: "${key}" -> "${bucket[nodeIndex].value}"`, ...prev]);
    } else {
      setHashStepDesc(`Match not found. Key "${key}" does not exist in the HashMap.`);
      setHashLogs(prev => [`NOT FOUND: Key "${key}"`, ...prev]);
    }
    setActiveHashVal(null);
    setActiveBucketIdx(null);
    setActiveNodeIdx(null);
  };

  const handleHashMapDelete = async () => {
    if (!hashDeleteKey.trim()) {
      alert('Please enter a key to delete.');
      return;
    }
    const key = hashDeleteKey.trim();
    setHashDeleteKey('');

    setHashStage('hashing');
    setHashStepDesc(`Deleting: Calculating hashCode() for "${key}"...`);
    const hash = getDeterministicHash(key);
    setActiveHashVal(hash);
    setHashLogs(prev => [`Delete request: hashCode("${key}") -> ${hash}`, ...prev]);
    await delay(1000);

    setHashStage('compressing');
    const bucketIdx = hash % 8;
    setHashStepDesc(`Deleting: Compressing hash to bucket index: ${hash} % 8 = ${bucketIdx}`);
    setActiveBucketIdx(bucketIdx);
    setHashLogs(prev => [`Delete routing: index = ${hash} % 8 = Bucket [${bucketIdx}]`, ...prev]);
    await delay(1000);

    setHashStage('traversing');
    const bucket = mapBuckets[bucketIdx];
    let nodeIndex = -1;
    let foundNode = false;

    setHashLogs(prev => [`Delete scanning Bucket [${bucketIdx}]...`, ...prev]);

    for (let i = 0; i < bucket.length; i++) {
      setActiveNodeIdx(i);
      setHashStepDesc(`Comparing key "${key}" with node key "${bucket[i].key}"...`);
      await delay(800);
      if (bucket[i].key === key) {
        nodeIndex = i;
        foundNode = true;
        break;
      }
    }

    setHashStage('modifying');
    if (foundNode) {
      setHashStepDesc(`Key match found! Deleting Node("${key}") and updating pointers.`);
      setMapBuckets(prev => {
        const newBuckets = [...prev];
        newBuckets[bucketIdx] = newBuckets[bucketIdx].filter((_, idx) => idx !== nodeIndex);
        return newBuckets;
      });
      setHashLogs(prev => [`DELETED: Key "${key}" from Bucket [${bucketIdx}]`, ...prev]);
    } else {
      setHashStepDesc(`Key "${key}" not found. No deletion performed.`);
      setHashLogs(prev => [`DELETE IGNORED: Key "${key}" not found`, ...prev]);
    }
    await delay(1000);

    setHashStage('done');
    setActiveHashVal(null);
    setActiveBucketIdx(null);
    setActiveNodeIdx(null);
  };

  const handleHashMapClear = () => {
    setMapBuckets(Array.from({ length: 8 }, () => []));
    setHashStepDesc('HashMap cleared. All buckets are empty.');
    setHashStage('idle');
    setActiveHashVal(null);
    setActiveBucketIdx(null);
    setActiveNodeIdx(null);
    setHashLogs(['HashMap cleared.']);
  };

  const hashMapQuizQuestions = [
    {
      question: "If two keys produce the same bucket index (e.g. hash % 8 = 1), how does HashMap handle it internally?",
      options: [
        "It overwrites the old key's value instantly.",
        "It stores them in a linked node chain (or tree) under that same index bucket.",
        "It throws a KeyCollisionException and crashes."
      ],
      correctIdx: 1,
      explanation: "Java's HashMap handles index collisions using Separate Chaining. It stores multiple entries resolving to the same index inside a linked node list (or balances them to a Red-Black tree if the threshold is crossed)."
    },
    {
      question: "What is the primary role of the hashCode() method when inserting a key into a HashMap?",
      options: [
        "To calculate a unique integer representation of the key object to locate its bucket index.",
        "To check if the key is equal to other keys.",
        "To serialize the key to a database string."
      ],
      correctIdx: 0,
      explanation: "The hashCode() method calculates an integer value for the key object. The HashMap then applies compression math (index = hash & (capacity - 1)) to map this hash to a specific bucket slot."
    },
    {
      question: "What is the time complexity of searching an element in a HashMap in the absolute worst-case scenario (with heavy collisions)?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N) for Linked List / O(log N) for Treeified buckets"
      ],
      correctIdx: 2,
      explanation: "In the worst-case scenario where all keys collide into the same bucket, lookups take O(N) if stored in a linked list, or O(log N) if Java 8's treeification (Red-Black tree conversion) is triggered."
    }
  ];

  const handleHashMapQuizAnswer = (idx) => {
    setSelectedHashMapAnswer(idx);
    setShowHashMapExplanation(true);
    if (idx === hashMapQuizQuestions[activeHashMapQuestion].correctIdx) {
      setHashMapQuizScore(prev => prev + 1);
    }
  };

  const handleHashMapQuizNext = () => {
    setSelectedHashMapAnswer(null);
    setShowHashMapExplanation(false);
    if (activeHashMapQuestion < hashMapQuizQuestions.length - 1) {
      setActiveHashMapQuestion(prev => prev + 1);
    } else {
      setActiveHashMapQuestion(0);
      setHashMapQuizScore(0);
    }
  };

  return (
    <div className="visualizer-tab-wrapper">
      
      {/* Visualizer Category Selection Row */}
      <div className="visualizer-selection-header">
        <button
          className={`viz-select-btn ${activeTopic === 'jvm' ? 'active' : ''}`}
          onClick={() => setActiveTopic('jvm')}
        >
          <i className="fa-solid fa-layer-group"></i> JVM Memory
        </button>
        <button
          className={`viz-select-btn ${activeTopic === 'arraylist' ? 'active' : ''}`}
          onClick={() => setActiveTopic('arraylist')}
        >
          <i className="fa-solid fa-table-cells"></i> ArrayList
        </button>
        <button
          className={`viz-select-btn ${activeTopic === 'linkedlist' ? 'active' : ''}`}
          onClick={() => setActiveTopic('linkedlist')}
        >
          <i className="fa-solid fa-link"></i> Linked List
        </button>
        <button
          className={`viz-select-btn ${activeTopic === 'stack' ? 'active' : ''}`}
          onClick={() => setActiveTopic('stack')}
        >
          <i className="fa-solid fa-cubes"></i> Stack
        </button>
        <button
          className={`viz-select-btn ${activeTopic === 'queue' ? 'active' : ''}`}
          onClick={() => setActiveTopic('queue')}
        >
          <i className="fa-solid fa-arrow-right-left"></i> Queue
        </button>
        <button
          className={`viz-select-btn ${activeTopic === 'hashmap' ? 'active' : ''}`}
          onClick={() => setActiveTopic('hashmap')}
        >
          <i className="fa-solid fa-network-wired"></i> HashMap
        </button>
      </div>

      {/* RENDER TOPIC PANEL */}
      <div className="visualizer-display-board">

        {/* 1. JVM VISUALIZER PANEL */}
        {activeTopic === 'jvm' && (
          <div className="viz-panel">
            <div className="viz-panel-header">
              <h4>JVM Stack & Heap Allocations</h4>
              <p>Observe how references are created on the stack and objects reside on the heap.</p>
            </div>
            
            <div className="viz-action-controls">
              <button 
                className={`btn-viz-action ${jvmStep === 'declare' ? 'selected' : ''}`}
                onClick={() => setJvmStep('declare')}
              >
                Car myCar; (Declare Reference)
              </button>
              <button 
                className={`btn-viz-action ${jvmStep === 'allocate' ? 'selected' : ''}`}
                onClick={() => setJvmStep('allocate')}
              >
                myCar = new Car("RoyalBlue"); (Allocate Heap Object)
              </button>
            </div>

            <div className="viz-simulator-canvas jvm-canvas">
              {/* JVM Stack Frame */}
              <div className="jvm-block jvm-stack">
                <span className="block-label">JVM STACK FRAME</span>
                <div className="memory-address-slot">
                  <span className="addr-tag">0x00A1</span>
                  <div className={`slot-box ${jvmStep === 'allocate' ? 'pointed' : ''}`}>
                    <span className="slot-name">myCar</span>
                    <span className="slot-val">{jvmStep === 'declare' ? 'null' : '0x7A3F'}</span>
                  </div>
                </div>
              </div>

              {/* Connector pointer line */}
              {jvmStep === 'allocate' && (
                <div className="jvm-pointer-line-wrap">
                  <div className="jvm-pointer-line"></div>
                  <div className="jvm-arrow-head">▶</div>
                </div>
              )}

              {/* JVM Heap Space */}
              <div className="jvm-block jvm-heap">
                <span className="block-label">JVM HEAP SPACE</span>
                {jvmStep === 'declare' ? (
                  <div className="empty-state-box">Stack reference exists but Heap is empty (null).</div>
                ) : (
                  <div className="heap-object-box-sim">
                    <span className="heap-addr">Address: 0x7A3F</span>
                    <h5>Class: Car</h5>
                    <div className="heap-props">
                      <span><strong>color:</strong> "RoyalBlue"</span>
                      <span><strong>speed:</strong> 0 km/h</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="viz-conceptual-banner">
              <p>
                <strong>JVM Concept:</strong> {jvmStep === 'declare' 
                  ? 'Declaring "Car myCar;" reserves a pointer variable on the stack containing "null". No heap space is consumed yet.' 
                  : 'The "new" keyword allocates a block in the shared Heap, assigns class properties, and writes its address address pointer ("0x7A3F") to "myCar" variable on the stack.'}
              </p>
            </div>
          </div>
        )}

        {/* 2. ARRAYLIST VISUALIZER PANEL */}
        {activeTopic === 'arraylist' && (
          <div className="viz-panel">
            <div className="viz-panel-header">
              <h4>ArrayList Resizing & Buffer Allocation</h4>
              <p>ArrayList uses a backing primitive array. When size reaches capacity, it doubles capacity and copies items.</p>
            </div>

            <div className="viz-action-controls">
              <button className="btn-viz-action btn-add" onClick={handleArrayListAdd} disabled={isResizing}>
                <i className="fa-solid fa-plus"></i> add() Element
              </button>
              <button className="btn-viz-action btn-clear" onClick={handleArrayListClear} disabled={isResizing}>
                <i className="fa-solid fa-trash"></i> Reset Array
              </button>
            </div>

            <div className="viz-simulator-canvas flex-col">
              {/* Backing Array representation */}
              <div className="arraylist-buffer-container">
                <span className="column-label-small">ArrayList Backing Buffer (Capacity: {arrayCapacity})</span>
                <div className="arraylist-cells-row">
                  {Array.from({ length: arrayCapacity }).map((_, idx) => {
                    const hasItem = idx < arrayItems.length;
                    return (
                      <div 
                        key={idx} 
                        className={`arraylist-cell ${hasItem ? 'filled' : 'empty'} ${isResizing && idx >= arrayItems.length ? 'highlight-resize' : ''}`}
                      >
                        <div className="cell-index">[{idx}]</div>
                        <div className="cell-value">{hasItem ? arrayItems[idx] : ''}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status statistics */}
              <div className="arraylist-metrics-dashboard">
                <div className="metric-cell-val">Size: <span className="text-cyan">{arrayItems.length}</span></div>
                <div className="metric-cell-val">Capacity: <span className="text-cyan">{arrayCapacity}</span></div>
                <div className="metric-cell-val">Usage: <span className="text-cyan">{Math.round((arrayItems.length / arrayCapacity) * 100)}%</span></div>
              </div>
            </div>

            {/* Live Terminal Log logs */}
            <div className="viz-terminal-log-panel">
              <div className="log-panel-header">Execution logs</div>
              <div className="logs-body">
                {arrayLogs.map((log, idx) => (
                  <div key={idx} className="log-item-line">
                    <span className="log-bullet">&gt;</span> {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. LINKED LIST VISUALIZER PANEL */}
        {activeTopic === 'linkedlist' && (
          <div className="viz-panel">
            <div className="viz-panel-header">
              <h4>Singly Linked List Nodes & References</h4>
              <p>Linked List nodes are allocated disjointly in memory and are connected together using pointer addresses.</p>
            </div>

            <div className="viz-action-controls">
              <button className="btn-viz-action" onClick={handleListInsertHead}>
                <i className="fa-solid fa-plus"></i> insertHead()
              </button>
              <button className="btn-viz-action" onClick={handleListInsertTail}>
                <i className="fa-solid fa-plus"></i> insertTail()
              </button>
              <button className="btn-viz-action btn-clear" onClick={handleListDeleteTail}>
                <i className="fa-solid fa-minus"></i> deleteTail()
              </button>
            </div>

            <div className="viz-simulator-canvas list-scrollable-canvas">
              {/* Linked Nodes row representation */}
              <div className="linked-list-nodes-row">
                <div className="head-ptr-tag">
                  <span>Head</span>
                  <span className="head-arrow">➔</span>
                </div>

                {linkedNodes.length === 0 ? (
                  <div className="empty-list-tag">Empty List (Head points to null)</div>
                ) : (
                  linkedNodes.map((node, idx) => {
                    const isLast = idx === linkedNodes.length - 1;
                    return (
                      <React.Fragment key={node.id}>
                        <div className="linked-node-box">
                          <div className="node-val-sect">{node.val}</div>
                          <div className="node-next-ptr">
                            <span className="next-addr-label">next</span>
                            <span className="pointer-dot">●</span>
                          </div>
                        </div>
                        
                        <div className="node-connector-arrow">
                          <span className="connector-line"></span>
                          <span className="connector-tip">➔</span>
                        </div>
                      </React.Fragment>
                    );
                  })
                )}

                <div className="null-ptr-box">
                  <span>null</span>
                </div>
              </div>
            </div>

            {/* List logs */}
            <div className="viz-terminal-log-panel">
              <div className="log-panel-header">Linked List Pointer Logs</div>
              <div className="logs-body">
                {listLogs.map((log, idx) => (
                  <div key={idx} className="log-item-line">
                    <span className="log-bullet">&gt;</span> {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. STACK VISUALIZER PANEL */}
        {activeTopic === 'stack' && (
          <div className="viz-panel">
            <div className="viz-panel-header">
              <h4>Stack (Last In, First Out - LIFO)</h4>
              <p>Elements are pushed onto the top of the stack and popped from the top of the stack.</p>
            </div>

            <div className="viz-action-controls">
              <button className="btn-viz-action" onClick={handleStackPush}>
                <i className="fa-solid fa-plus"></i> push()
              </button>
              <button className="btn-viz-action btn-clear" onClick={handleStackPop}>
                <i className="fa-solid fa-minus"></i> pop()
              </button>
            </div>

            <div className="viz-simulator-canvas stack-visual-canvas">
              {/* Stack Frame Stacked Box Items */}
              <div className="stack-visual-column">
                <div className="stack-limit-tag">Stack Limit (Cap: 5)</div>

                {stackItems.length === 0 ? (
                  <div className="empty-stack-tag">Stack Empty</div>
                ) : (
                  stackItems.slice().reverse().map((item, revIdx) => {
                    const idx = stackItems.length - 1 - revIdx;
                    const isTop = idx === stackItems.length - 1;
                    return (
                      <div key={idx} className={`stack-item-box ${isTop ? 'highlight-top' : ''}`}>
                        <span className="stack-idx">[{idx}]</span>
                        <span className="stack-val-text">{item}</span>
                        {isTop && (
                          <div className="top-ptr-indicator">
                            <span className="pointer-arrow-left">◀</span>
                            <span className="top-ptr-label">TOP</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                
                <div className="stack-base-floor"></div>
              </div>
            </div>

            {/* Stack Logs */}
            <div className="viz-terminal-log-panel">
              <div className="log-panel-header">LIFO Stack Logs</div>
              <div className="logs-body">
                {stackLogs.map((log, idx) => (
                  <div key={idx} className="log-item-line">
                    <span className="log-bullet">&gt;</span> {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. QUEUE VISUALIZER PANEL */}
        {activeTopic === 'queue' && (
          <div className="viz-panel">
            <div className="viz-panel-header">
              <h4>Queue (First In, First Out - FIFO)</h4>
              <p>Elements are added (enqueue) at the Rear and removed (dequeue) from the Front.</p>
            </div>

            <div className="viz-action-controls">
              <button className="btn-viz-action" onClick={handleQueueEnqueue}>
                <i className="fa-solid fa-plus"></i> enqueue()
              </button>
              <button className="btn-viz-action btn-clear" onClick={handleQueueDequeue}>
                <i className="fa-solid fa-minus"></i> dequeue()
              </button>
            </div>

            <div className="viz-simulator-canvas queue-visual-canvas">
              {/* Queue Line representation */}
              <div className="queue-elements-row">
                
                <div className="rear-ptr-marker">
                  <span>Rear (In)</span>
                  <span className="rear-arrow">➔</span>
                </div>

                {queueItems.length === 0 ? (
                  <div className="empty-queue-tag">Queue Empty</div>
                ) : (
                  queueItems.map((item, idx) => {
                    const isFront = idx === 0;
                    const isRear = idx === queueItems.length - 1;
                    return (
                      <div 
                        key={idx} 
                        className={`queue-item-box ${isFront ? 'highlight-front' : ''} ${isRear ? 'highlight-rear' : ''}`}
                      >
                        <div className="queue-cell-val">{item}</div>
                        <div className="queue-cell-ptrs">
                          {isFront && <span className="ptr-badge front-tag">FRONT</span>}
                          {isRear && <span className="ptr-badge rear-tag">REAR</span>}
                        </div>
                      </div>
                    );
                  })
                )}

                <div className="front-ptr-marker">
                  <span className="front-arrow">➔</span>
                  <span>Front (Out)</span>
                </div>

              </div>
            </div>

            {/* Queue Logs */}
            <div className="viz-terminal-log-panel">
              <div className="log-panel-header">FIFO Queue Logs</div>
              <div className="logs-body">
                {queueLogs.map((log, idx) => (
                  <div key={idx} className="log-item-line">
                    <span className="log-bullet">&gt;</span> {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. HASHMAP VISUALIZER PANEL */}
        {activeTopic === 'hashmap' && (
          <div className="viz-panel hashmap-viz-panel">
            <div className="viz-panel-header">
              <h4>HashMap Internal Working Simulator</h4>
              <p>Visualize how hashCode() generates keys, routes them to specific buckets, and chains nodes on collisions.</p>
            </div>

            {/* Theory Header Card */}
            <div className="viz-conceptual-banner" style={{ backgroundColor: 'rgba(21, 145, 220, 0.05)', borderColor: 'var(--brand-cyan)' }}>
              <h5 style={{ color: 'var(--brand-cyan)', marginBottom: '0.25rem', fontWeight: '700' }}>HashMap Core Concepts</h5>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>
                HashMap uses <strong>Separate Chaining</strong>. When a key is inserted, its <code>hashCode()</code> is computed and compressed (<code>hash % capacity</code>) to map to a bucket index (0-7). If multiple keys map to the same bucket index, they are chained together in a Linked List.
              </p>
            </div>

            {/* Inputs & Actions Controls */}
            <div className="viz-action-controls">
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Key (e.g. Alice)"
                  value={hashInputKey}
                  onChange={(e) => setHashInputKey(e.target.value)}
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--bg-tertiary)',
                    color: '#FFFFFF',
                    padding: '0.5rem',
                    borderRadius: 'var(--border-radius-sm)',
                    fontSize: '0.85rem',
                    width: '120px'
                  }}
                  disabled={hashStage !== 'idle' && hashStage !== 'done'}
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 95)"
                  value={hashInputValue}
                  onChange={(e) => setHashInputValue(e.target.value)}
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--bg-tertiary)',
                    color: '#FFFFFF',
                    padding: '0.5rem',
                    borderRadius: 'var(--border-radius-sm)',
                    fontSize: '0.85rem',
                    width: '100px'
                  }}
                  disabled={hashStage !== 'idle' && hashStage !== 'done'}
                />
                <button className="btn-viz-action btn-add" onClick={handleHashMapInsert} disabled={hashStage !== 'idle' && hashStage !== 'done'}>
                  <i className="fa-solid fa-plus"></i> insert()
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Search Key"
                  value={hashSearchKey}
                  onChange={(e) => setHashSearchKey(e.target.value)}
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--bg-tertiary)',
                    color: '#FFFFFF',
                    padding: '0.5rem',
                    borderRadius: 'var(--border-radius-sm)',
                    fontSize: '0.85rem',
                    width: '110px'
                  }}
                  disabled={hashStage !== 'idle' && hashStage !== 'done'}
                />
                <button className="btn-viz-action" onClick={handleHashMapSearch} disabled={hashStage !== 'idle' && hashStage !== 'done'}>
                  <i className="fa-solid fa-magnifying-glass"></i> search()
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Delete Key"
                  value={hashDeleteKey}
                  onChange={(e) => setHashDeleteKey(e.target.value)}
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--bg-tertiary)',
                    color: '#FFFFFF',
                    padding: '0.5rem',
                    borderRadius: 'var(--border-radius-sm)',
                    fontSize: '0.85rem',
                    width: '110px'
                  }}
                  disabled={hashStage !== 'idle' && hashStage !== 'done'}
                />
                <button className="btn-viz-action btn-clear" onClick={handleHashMapDelete} disabled={hashStage !== 'idle' && hashStage !== 'done'}>
                  <i className="fa-solid fa-trash"></i> delete()
                </button>
              </div>

              <button className="btn-viz-action btn-clear" onClick={handleHashMapClear} disabled={hashStage !== 'idle' && hashStage !== 'done'}>
                Clear Map
              </button>
            </div>

            {/* Interactive Visualizer Area */}
            <div className="viz-simulator-canvas hashmap-canvas" style={{ display: 'flex', gap: '2rem', minHeight: '380px', padding: '2rem 1.5rem', alignItems: 'stretch' }}>
              
              {/* Left Column: Hash Calculation Engine */}
              <div style={{
                flex: '1',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--bg-tertiary)',
                borderRadius: 'var(--border-radius-md)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <span className="block-label" style={{ width: '100%' }}>HASH FUNCTION ENGINE</span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', alignItems: 'center' }}>
                  {/* Step 1: Input key */}
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Active Key: <span style={{ fontFamily: 'var(--font-family-mono)', color: 'var(--brand-cyan)', fontWeight: '700' }}>{activeHashVal !== null ? 'Calculating...' : 'None'}</span>
                  </div>

                  {/* Dynamic Hashing Box */}
                  <div style={{
                    border: hashStage === 'hashing' ? '2px solid var(--brand-cyan)' : '1px solid var(--bg-tertiary)',
                    backgroundColor: hashStage === 'hashing' ? 'rgba(21, 145, 220, 0.05)' : 'var(--bg-primary)',
                    padding: '0.75rem',
                    borderRadius: 'var(--border-radius-sm)',
                    width: '100%',
                    maxWidth: '220px',
                    fontFamily: 'var(--font-family-mono)',
                    fontSize: '0.8rem',
                    color: hashStage === 'hashing' ? 'var(--brand-cyan)' : 'var(--text-secondary)',
                    transition: 'all 0.3s'
                  }}>
                    <div>hashCode() Engine</div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', marginTop: '0.25rem' }}>
                      {activeHashVal !== null ? activeHashVal : '---'}
                    </div>
                  </div>

                  {/* Down Arrow */}
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>▼</div>

                  {/* Step 2: Index Compression Box */}
                  <div style={{
                    border: hashStage === 'compressing' ? '2px solid var(--brand-cyan)' : '1px solid var(--bg-tertiary)',
                    backgroundColor: hashStage === 'compressing' ? 'rgba(21, 145, 220, 0.05)' : 'var(--bg-primary)',
                    padding: '0.75rem',
                    borderRadius: 'var(--border-radius-sm)',
                    width: '100%',
                    maxWidth: '220px',
                    fontFamily: 'var(--font-family-mono)',
                    fontSize: '0.8rem',
                    color: hashStage === 'compressing' ? 'var(--brand-cyan)' : 'var(--text-secondary)',
                    transition: 'all 0.3s'
                  }}>
                    <div>Compression: index = hash % 8</div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', marginTop: '0.25rem' }}>
                      {activeBucketIdx !== null ? `Index: ${activeBucketIdx}` : '---'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Buckets Track and Linked Node Chains */}
              <div style={{
                flex: '2',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--bg-tertiary)',
                borderRadius: 'var(--border-radius-md)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                overflowY: 'auto'
              }}>
                <span className="block-label">BUCKET INDEX TRACK</span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1, justifyContent: 'center' }}>
                  {mapBuckets.map((bucket, bIdx) => {
                    const isActiveBucket = activeBucketIdx === bIdx;
                    return (
                      <div key={bIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {/* Bucket index cell */}
                        <div style={{
                          width: '75px',
                          height: '34px',
                          backgroundColor: isActiveBucket ? 'var(--brand-cyan-muted)' : 'var(--bg-primary)',
                          border: isActiveBucket ? '2px solid var(--brand-cyan)' : '1px solid var(--bg-tertiary)',
                          borderRadius: 'var(--border-radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-family-mono)',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          color: isActiveBucket ? 'var(--brand-cyan)' : 'var(--text-secondary)',
                          transition: 'all 0.3s'
                        }}>
                          Bucket [{bIdx}]
                        </div>

                        {/* Connection arrow to nodes */}
                        <div style={{ color: isActiveBucket ? 'var(--brand-cyan)' : 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                          ➔
                        </div>

                        {/* Nodes chain */}
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          {bucket.length === 0 ? (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>null</span>
                          ) : (
                            bucket.map((node, nIdx) => {
                              const isActiveNode = isActiveBucket && activeNodeIdx === nIdx;
                              return (
                                <React.Fragment key={nIdx}>
                                  {/* Node box */}
                                  <div style={{
                                    display: 'flex',
                                    border: isActiveNode ? '2px solid var(--brand-cyan)' : '1px solid var(--bg-tertiary)',
                                    backgroundColor: isActiveNode ? 'rgba(21, 145, 220, 0.08)' : 'var(--bg-primary)',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    height: '34px',
                                    overflow: 'hidden',
                                    minWidth: '150px',
                                    boxShadow: isActiveNode ? '0 0 10px rgba(36, 224, 217, 0.2)' : 'none',
                                    transition: 'all 0.2s'
                                  }}>
                                    {/* Key part */}
                                    <div style={{
                                      padding: '0.5rem',
                                      borderRight: '1px solid var(--bg-tertiary)',
                                      fontWeight: '700',
                                      color: '#FFFFFF',
                                      backgroundColor: 'rgba(255,255,255,0.01)',
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}>
                                      {node.key}
                                    </div>
                                    {/* Value part */}
                                    <div style={{
                                      padding: '0.5rem',
                                      color: 'var(--brand-cyan)',
                                      fontWeight: '600',
                                      display: 'flex',
                                      alignItems: 'center',
                                      flexGrow: 1
                                    }}>
                                      {node.value}
                                    </div>
                                  </div>
                                  
                                  {/* Arrow between nodes */}
                                  <span style={{ color: 'var(--brand-cyan)', fontSize: '0.7rem' }}>➔</span>
                                </React.Fragment>
                              );
                            })
                          )}
                          {bucket.length > 0 && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>null</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* Current Step Description Panel */}
            <div className="viz-conceptual-banner" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--brand-cyan)' }}>Active Step Tracing</span>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#FFFFFF', fontWeight: '600' }}>
                {hashStepDesc}
              </p>
            </div>

            {/* Execution terminal logs */}
            <div className="viz-terminal-log-panel">
              <div className="log-panel-header">HashMap Operation Logs</div>
              <div className="logs-body">
                {hashLogs.map((log, idx) => (
                  <div key={idx} className="log-item-line">
                    <span className="log-bullet">&gt;</span> {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Standard layout sub-panels */}
            <div className="hashmap-educational-decks" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
              
              {/* Deck 1: Analogy & Interview Questions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Real-Life Analogy */}
                <div style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--bg-tertiary)',
                  borderRadius: 'var(--border-radius-md)',
                  padding: '1.25rem'
                }}>
                  <h5 style={{ color: 'var(--brand-cyan)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <i className="fa-solid fa-lightbulb"></i> Real-Life Analogy: The Mail Sorting Bins
                  </h5>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                    Think of a post office with 8 sorting bins. When mail arrives, the postmaster computes a category number from the recipient's name (hashCode). The letter is tossed into the matching bin. If a bin gets multiple letters, they are stacked sequentially (Separate Chaining). When looking up a letter, the postmaster runs the same name checks, goes straight to the correct bin, and searches only that stack.
                  </p>
                </div>

                {/* Common Mistakes */}
                <div style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--bg-tertiary)',
                  borderRadius: 'var(--border-radius-md)',
                  padding: '1.25rem'
                }}>
                  <h5 style={{ color: '#ef4444', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <i className="fa-solid fa-triangle-exclamation"></i> Common Beginner Mistakes
                  </h5>
                  <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', lineHeight: '1.5' }}>
                    <li><strong>Mutable keys:</strong> Changing a key's fields after insertion changes its hash code, making it unretrievable.</li>
                    <li><strong>Implementing hashCode() without equals():</strong> If two keys produce the same hash but `equals()` is not defined, search lookups fail to distinguish between them.</li>
                    <li><strong>Forgetting index compression:</strong> A raw `hashCode()` is usually a very large integer. You must compress it via `hash & (n-1)` before indexing.</li>
                  </ul>
                </div>

                {/* Interview Questions */}
                <div style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--bg-tertiary)',
                  borderRadius: 'var(--border-radius-md)',
                  padding: '1.25rem'
                }}>
                  <h5 style={{ color: 'var(--text-primary)', fontWeight: '700', marginBottom: '0.5rem' }}>
                    <i className="fa-solid fa-circle-question"></i> Top Interview Questions
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <div>
                      <strong style={{ color: '#FFFFFF' }}>Q1: What is the load factor and when does rehashing occur?</strong>
                      <div style={{ marginTop: '0.2rem' }}>Default load factor is 0.75. When elements exceed 75% of capacity, HashMap doubles bucket size and recalculates indices for all entries (rehashing) to avoid long collision chains.</div>
                    </div>
                    <div>
                      <strong style={{ color: '#FFFFFF' }}>Q2: How does Java 8 optimize HashMaps under high collision rates?</strong>
                      <div style={{ marginTop: '0.2rem' }}>If a bucket's linked list size crosses 8 and map capacity is 64+, Java converts the list into a self-balancing Red-Black Tree, reducing worst-case lookups from O(N) to O(log N).</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Deck 2: Quiz Panel */}
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--bg-tertiary)',
                borderRadius: 'var(--border-radius-md)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <h5 style={{ color: 'var(--brand-cyan)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-graduation-cap"></i> Interactive HashMap Quiz
                </h5>

                <div style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--bg-tertiary)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Question {activeHashMapQuestion + 1} of {hashMapQuizQuestions.length}
                  </span>
                  
                  <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#FFFFFF', margin: 0, lineHeight: '1.4' }}>
                    {hashMapQuizQuestions[activeHashMapQuestion].question}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {hashMapQuizQuestions[activeHashMapQuestion].options.map((opt, oIdx) => {
                      const isCorrect = oIdx === hashMapQuizQuestions[activeHashMapQuestion].correctIdx;
                      const isSelected = selectedHashMapAnswer === oIdx;
                      
                      let borderStyle = '1px solid var(--bg-tertiary)';
                      let bgStyle = 'transparent';
                      if (showHashMapExplanation) {
                        if (isCorrect) {
                          borderStyle = '1px solid #10b981';
                          bgStyle = 'rgba(16, 185, 129, 0.05)';
                        } else if (isSelected) {
                          borderStyle = '1px solid #ef4444';
                          bgStyle = 'rgba(239, 68, 68, 0.05)';
                        }
                      } else if (isSelected) {
                        borderStyle = '1px solid var(--brand-cyan)';
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => !showHashMapExplanation && handleHashMapQuizAnswer(oIdx)}
                          style={{
                            border: borderStyle,
                            backgroundColor: bgStyle,
                            color: isSelected && !showHashMapExplanation ? 'var(--brand-cyan)' : 'var(--text-secondary)',
                            padding: '0.65rem 0.85rem',
                            borderRadius: 'var(--border-radius-sm)',
                            fontSize: '0.8rem',
                            textAlign: 'left',
                            cursor: showHashMapExplanation ? 'default' : 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center'
                          }}
                        >
                          <span style={{ fontWeight: '700' }}>{String.fromCharCode(65 + oIdx)}.</span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {showHashMapExplanation && (
                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px dashed var(--bg-tertiary)',
                      borderRadius: 'var(--border-radius-sm)',
                      padding: '0.75rem',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.4',
                      marginTop: '0.5rem'
                    }}>
                      <span style={{
                        fontWeight: '700',
                        color: selectedHashMapAnswer === hashMapQuizQuestions[activeHashMapQuestion].correctIdx ? '#10b981' : '#ef4444',
                        display: 'block',
                        marginBottom: '0.25rem'
                      }}>
                        {selectedHashMapAnswer === hashMapQuizQuestions[activeHashMapQuestion].correctIdx ? '✓ Correct Answer!' : '✗ Incorrect Answer!'}
                      </span>
                      {hashMapQuizQuestions[activeHashMapQuestion].explanation}
                    </div>
                  )}

                  {showHashMapExplanation && (
                    <button
                      className="btn-viz-action btn-add"
                      onClick={handleHashMapQuizNext}
                      style={{ marginTop: '0.5rem', alignSelf: 'flex-end' }}
                    >
                      {activeHashMapQuestion < hashMapQuizQuestions.length - 1 ? 'Next Question ➔' : 'Restart Quiz ↺'}
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>Score: <strong>{hashMapQuizScore}</strong> / {hashMapQuizQuestions.length}</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
