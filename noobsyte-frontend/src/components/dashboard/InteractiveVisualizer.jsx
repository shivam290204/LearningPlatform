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
        `🚨 Threshold reached! Triggering internal array resizing...`,
        ...prev
      ]);

      setTimeout(() => {
        const oldCapacity = arrayCapacity;
        const newCapacity = oldCapacity * 2;
        setArrayLogs(prev => [
          `⚡ Doubled capacity from ${oldCapacity} to ${newCapacity} & copied old elements.`,
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
      setListLogs(prev => ['⚠️ Visualizer limit of 6 nodes reached.', ...prev]);
      return;
    }
    const val = Math.floor(Math.random() * 80 + 10);
    const newId = Date.now();
    setLinkedNodes(prev => [{ id: newId, val }, ...prev]);
    setListLogs(prev => [`Inserted Node(${val}) at the head. Pointer update: Head -> ${val}.`, ...prev]);
  };

  const handleListInsertTail = () => {
    if (linkedNodes.length >= 6) {
      setListLogs(prev => ['⚠️ Visualizer limit of 6 nodes reached.', ...prev]);
      return;
    }
    const val = Math.floor(Math.random() * 80 + 10);
    const newId = Date.now();
    setLinkedNodes(prev => [...prev, { id: newId, val }]);
    setListLogs(prev => [`Inserted Node(${val}) at the tail. Old tail now points to new Node.`, ...prev]);
  };

  const handleListDeleteTail = () => {
    if (linkedNodes.length === 0) {
      setListLogs(prev => ['⚠️ Underflow: List is empty.', ...prev]);
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
      setStackLogs(prev => ['❌ StackOverflowError! Stack limit (5 items) reached.', ...prev]);
      return;
    }
    const val = Math.floor(Math.random() * 80 + 10);
    setStackItems(prev => [...prev, val]);
    setStackLogs(prev => [`push(${val}): Pushed value on top. Top pointer moved to index ${stackItems.length}.`, ...prev]);
  };

  const handleStackPop = () => {
    if (stackItems.length === 0) {
      setStackLogs(prev => ['❌ EmptyStackException! Pop operation underflow.', ...prev]);
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
      setQueueLogs(prev => ['❌ Queue Full (Overflow)! Cannot add element.', ...prev]);
      return;
    }
    const val = Math.floor(Math.random() * 80 + 10);
    setQueueItems(prev => [...prev, val]);
    setQueueLogs(prev => [`enqueue(${val}): Added element to Rear. Rear pointer updated.`, ...prev]);
  };

  const handleQueueDequeue = () => {
    if (queueItems.length === 0) {
      setQueueLogs(prev => ['❌ Queue Empty (Underflow)! Cannot remove element.', ...prev]);
      return;
    }
    const dequeued = queueItems[0];
    setQueueItems(prev => prev.slice(1));
    setQueueLogs(prev => [`dequeue() -> Removed ${dequeued} from Front. All elements shifted forward.`, ...prev]);
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

      </div>

    </div>
  );
}
