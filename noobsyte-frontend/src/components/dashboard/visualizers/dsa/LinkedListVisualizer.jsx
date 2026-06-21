import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function LinkedListVisualizer() {
  const [linkedNodes, setLinkedNodes] = useState([
    { id: 1, val: 12 },
    { id: 2, val: 45 },
    { id: 3, val: 78 }
  ]);
  const [logs, setLogs] = useState(['Singly Linked List initialized with 3 nodes.']);

  const handleInsertHead = () => {
    if (linkedNodes.length >= 5) {
      setLogs(prev => ['Visualizer limit of 5 nodes reached to prevent clutter.', ...prev]);
      return;
    }
    const val = Math.floor(Math.random() * 80 + 10);
    const newId = Date.now();
    setLinkedNodes(prev => [{ id: newId, val }, ...prev]);
    setLogs(prev => [`Inserted Node(${val}) at Head. Reference update: Head now points to new Node.`, ...prev]);
  };

  const handleInsertTail = () => {
    if (linkedNodes.length >= 5) {
      setLogs(prev => ['Visualizer limit of 5 nodes reached to prevent clutter.', ...prev]);
      return;
    }
    const val = Math.floor(Math.random() * 80 + 10);
    const newId = Date.now();
    setLinkedNodes(prev => [...prev, { id: newId, val }]);
    setLogs(prev => [`Inserted Node(${val}) at Tail. Old tail next reference updated to point to new Node.`, ...prev]);
  };

  const handleDeleteTail = () => {
    if (linkedNodes.length === 0) {
      setLogs(prev => ['Underflow: Linked List is empty.', ...prev]);
      return;
    }
    const removedVal = linkedNodes[linkedNodes.length - 1].val;
    setLinkedNodes(prev => prev.slice(0, -1));
    setLogs(prev => [`Deleted tail Node(${removedVal}). Penultimate node next reference updated to null.`, ...prev]);
  };

  const controls = (
    <>
      <button className="btn-viz-action btn-add" onClick={handleInsertHead}>
        Insert Head
      </button>
      <button className="btn-viz-action btn-add" onClick={handleInsertTail}>
        Insert Tail
      </button>
      <button className="btn-viz-action btn-clear" onClick={handleDeleteTail}>
        Delete Tail
      </button>
    </>
  );

  const stateInspector = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
      <div>Head Node Value: <strong style={{ color: '#FFFFFF' }}>{linkedNodes.length > 0 ? linkedNodes[0].val : 'null'}</strong></div>
      <div>Tail Node Value: <strong style={{ color: '#FFFFFF' }}>{linkedNodes.length > 0 ? linkedNodes[linkedNodes.length - 1].val : 'null'}</strong></div>
      <div>Total Nodes (Size): <strong style={{ color: '#FFFFFF' }}>{linkedNodes.length}</strong></div>
      <div>Structure: <span style={{ color: '#FFFFFF', fontFamily: 'monospace' }}>
        {linkedNodes.map(n => n.val).join(' -> ')} {linkedNodes.length > 0 ? '-> null' : 'null'}
      </span></div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>Singly Linked List</strong> is a linear collection of nodes where each node points to the next one in memory:</p>
      <ul>
        <li><strong>Node Composition:</strong> Each node contains <code>data</code> and a <code>next</code> reference/pointer.</li>
        <li><strong>Memory Layout:</strong> Nodes are not stored contiguously in memory; they are scattered. Finding a node requires sequential traversal.</li>
        <li><strong>Efficiency:</strong> Inserting or deleting elements at the head takes O(1) time. Finding a node at index <em>i</em> or deleting the tail node (without a tail pointer) takes O(N) time.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of a Linked List as a **scavenger hunt**:</p>
      <ul>
        <li>You only know where the first clue is (Head).</li>
        <li>Each clue gives you the coordinates to find the next clue. You cannot jump directly to Clue 4; you must visit Clue 1, Clue 2, and Clue 3 in order.</li>
        <li>The final clue points to nothing (null), signaling the end of the hunt.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Pointer Loss:</strong> Reassigning node pointer references out of order when inserting or deleting elements, causing the remaining list to be cut off and garbage collected.</li>
      <li><strong>Traversal Boundary:</strong> Off-by-one errors while traversing, resulting in dereferencing `null` (NullPointerExceptions).</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Why is deleting a tail node in a Singly Linked List O(N) even if you maintain a tail pointer?',
      a: 'Even with a tail pointer, you need to find the node immediately preceding the tail to set its next pointer to null. Finding this node requires traversing from the head, which takes O(N) time.'
    },
    {
      q: 'How do you detect a cycle in a linked list?',
      a: "Use Floyd's Cycle-Finding Algorithm (Tortoise and Hare). Run two pointers at different speeds: one moving 1 node at a time (slow) and another moving 2 nodes at a time (fast). If they meet, a cycle exists."
    }
  ];

  const quizQuestions = [
    {
      question: 'What is the time complexity to insert a new node at the middle (index size/2) of a Singly Linked List?',
      options: [
        'O(1)',
        'O(log N)',
        'O(N)',
        'O(N log N)'
      ],
      correctIdx: 2,
      explanation: 'To insert at the middle, you must first traverse from the head node to the insertion index, which takes O(N) traversal operations.'
    },
    {
      question: 'Which node pointer operation correctly deletes the node AFTER node "temp"?',
      options: [
        'temp.next = temp.next.next',
        'temp = temp.next',
        'temp.next = null',
        'temp.next.next = temp'
      ],
      correctIdx: 0,
      explanation: 'By setting temp.next to temp.next.next, we bypass the middle node, causing its reference count to fall to 0 and reclaiming its memory.'
    }
  ];

  return (
    <VisualizerShell
      title="Singly Linked List Visualization"
      subtitle="Observe nodes scattered in memory linked together by next pointer references."
      timeComplexity="O(N) search, O(1) insert at Head"
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
      <div className="list-scrollable-canvas" style={{ display: 'flex', alignItems: 'center', width: '100%', overflowX: 'auto', minHeight: '140px', padding: '1rem 0' }}>
        {linkedNodes.length === 0 ? (
          <span className="empty-list-tag" style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Linked List is Empty (null)</span>
        ) : (
          <div className="linked-list-nodes-row" style={{ display: 'flex', alignItems: 'center' }}>
            <div className="head-ptr-tag" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '0.75rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--brand-cyan)' }}>HEAD</span>
              <span style={{ color: 'var(--brand-cyan)', fontSize: '0.85rem' }}>▶</span>
            </div>

            {linkedNodes.map((node, index) => {
              const isLast = index === linkedNodes.length - 1;
              return (
                <React.Fragment key={node.id}>
                  {/* Node Box */}
                  <div
                    className="linked-node-box"
                    style={{
                      display: 'flex',
                      width: '90px',
                      height: '46px',
                      border: '2px solid var(--brand-cyan)',
                      borderRadius: 'var(--border-radius-sm)',
                      backgroundColor: 'var(--bg-secondary)',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      className="node-val-sect"
                      style={{
                        flex: 1.2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                        fontWeight: '800',
                        color: '#FFFFFF',
                        borderRight: '2px solid var(--brand-cyan)'
                      }}
                    >
                      {node.val}
                    </div>
                    <div
                      className="node-next-ptr"
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.2rem',
                        fontSize: '0.55rem',
                        color: 'var(--text-tertiary)',
                        backgroundColor: 'rgba(0,0,0,0.2)'
                      }}
                    >
                      <span>NEXT</span>
                      <span className="pointer-dot" style={{ color: 'var(--brand-cyan)', fontWeight: '700' }}>●</span>
                    </div>
                  </div>

                  {/* Connector or Null */}
                  {!isLast ? (
                    <div className="node-connector-arrow" style={{ display: 'flex', alignItems: 'center', width: '40px' }}>
                      <div className="connector-line" style={{ flexGrow: 1, height: '2px', backgroundColor: 'var(--brand-cyan)' }}></div>
                      <span className="connector-tip" style={{ color: 'var(--brand-cyan)', marginLeft: '-4px', fontSize: '0.8rem' }}>▶</span>
                    </div>
                  ) : (
                    <div className="node-connector-arrow" style={{ display: 'flex', alignItems: 'center', width: '35px' }}>
                      <div className="connector-line" style={{ flexGrow: 1, height: '2px', backgroundColor: 'var(--brand-cyan)' }}></div>
                      <span className="connector-tip" style={{ color: 'var(--brand-cyan)', marginLeft: '-4px', fontSize: '0.8rem' }}>▶</span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
            <div className="null-ptr-box" style={{
              border: '1px dashed var(--bg-tertiary)',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--border-radius-sm)',
              fontSize: '0.7rem',
              fontWeight: '700',
              color: 'var(--text-tertiary)',
              backgroundColor: 'rgba(255,255,255,0.02)'
            }}>
              NULL
            </div>
          </div>
        )}
      </div>
    </VisualizerShell>
  );
}
