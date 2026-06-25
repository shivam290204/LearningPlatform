import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function HashMapVisualizer() {
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
  const [logs, setLogs] = useState(['HashMap initialized with 8 empty buckets.']);

  const getDeterministicHash = (str) => {
    if (!str) return 0;
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
      sum += str.charCodeAt(i);
    }
    return sum;
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleInsert = async () => {
    if (!hashInputKey.trim() || !hashInputValue.trim()) {
      alert('Please enter both a key and a value.');
      return;
    }
    const key = hashInputKey.trim();
    const val = hashInputValue.trim();
    
    setLogs(prev => [`Starting insert for (${key} -> ${val})...`, ...prev]);
    
    // Step 1: Hashing
    setHashStage('hashing');
    const hash = getDeterministicHash(key);
    setActiveHashVal(hash);
    setHashStepDesc(`Calculating hash: hashCode("${key}") = ${hash}`);
    await delay(1000);

    // Step 2: Modulo Compression
    setHashStage('compressing');
    const bucketIdx = hash % 8;
    setActiveBucketIdx(bucketIdx);
    setHashStepDesc(`Compressing index: hash % capacity = ${hash} % 8 = Bucket [${bucketIdx}]`);
    await delay(1000);

    // Step 3: Traverse & Modify
    setHashStage('traversing');
    const currentBucket = [...mapBuckets[bucketIdx]];
    let foundIdx = -1;
    
    for (let i = 0; i < currentBucket.length; i++) {
      setActiveNodeIdx(i);
      setHashStepDesc(`Checking node: key "${currentBucket[i].key}" matches insert key "${key}"?`);
      await delay(700);
      if (currentBucket[i].key === key) {
        foundIdx = i;
        break;
      }
    }

    setHashStage('modifying');
    let updatedBuckets = [...mapBuckets];
    if (foundIdx !== -1) {
      setHashStepDesc(`Key match found! Updating value from "${currentBucket[foundIdx].val}" to "${val}".`);
      currentBucket[foundIdx] = { key, val };
    } else {
      setHashStepDesc(`No key match! Appending new node (${key} -> ${val}) at tail of chain.`);
      currentBucket.push({ key, val });
    }
    
    updatedBuckets[bucketIdx] = currentBucket;
    setMapBuckets(updatedBuckets);
    await delay(800);

    // Done
    setHashStage('idle');
    setActiveHashVal(null);
    setActiveBucketIdx(null);
    setActiveNodeIdx(null);
    setHashStepDesc(`Successfully inserted (${key} -> ${val}) into Bucket [${bucketIdx}].`);
    setLogs(prev => [`Inserted (${key} -> ${val}) in bucket [${bucketIdx}].`, ...prev]);
    setHashInputKey('');
    setHashInputValue('');
  };

  const handleSearch = async () => {
    if (!hashSearchKey.trim()) {
      alert('Please enter a key to search.');
      return;
    }
    const key = hashSearchKey.trim();
    setLogs(prev => [`Searching for key "${key}"...`, ...prev]);

    setHashStage('hashing');
    const hash = getDeterministicHash(key);
    setActiveHashVal(hash);
    setHashStepDesc(`Calculating search hash: hashCode("${key}") = ${hash}`);
    await delay(1000);

    setHashStage('compressing');
    const bucketIdx = hash % 8;
    setActiveBucketIdx(bucketIdx);
    setHashStepDesc(`Search compressed index: ${hash} % 8 = Bucket [${bucketIdx}]`);
    await delay(1000);

    setHashStage('traversing');
    const currentBucket = mapBuckets[bucketIdx];
    let foundVal = null;
    
    if (currentBucket.length === 0) {
      setHashStepDesc(`Bucket [${bucketIdx}] is empty. Search failed.`);
      setLogs(prev => [`Search key "${key}" NOT found in bucket [${bucketIdx}].`, ...prev]);
    } else {
      for (let i = 0; i < currentBucket.length; i++) {
        setActiveNodeIdx(i);
        setHashStepDesc(`Comparing key: "${currentBucket[i].key}" === "${key}"?`);
        await delay(700);
        if (currentBucket[i].key === key) {
          foundVal = currentBucket[i].val;
          break;
        }
      }

      if (foundVal !== null) {
        setHashStepDesc(`Key match found! Value is "${foundVal}".`);
        setLogs(prev => [`Search match: Key "${key}" contains value "${foundVal}" inside bucket [${bucketIdx}].`, ...prev]);
      } else {
        setHashStepDesc(`Reached end of chain. Key "${key}" not found.`);
        setLogs(prev => [`Search mismatch: Key "${key}" not found inside bucket [${bucketIdx}].`, ...prev]);
      }
    }

    await delay(1200);
    setHashStage('idle');
    setActiveHashVal(null);
    setActiveBucketIdx(null);
    setActiveNodeIdx(null);
    setHashSearchKey('');
  };

  const handleDelete = async () => {
    if (!hashDeleteKey.trim()) {
      alert('Please enter a key to delete.');
      return;
    }
    const key = hashDeleteKey.trim();
    setLogs(prev => [`Attempting to delete key "${key}"...`, ...prev]);

    setHashStage('hashing');
    const hash = getDeterministicHash(key);
    setActiveHashVal(hash);
    setHashStepDesc(`Calculating delete hash: hashCode("${key}") = ${hash}`);
    await delay(1000);

    setHashStage('compressing');
    const bucketIdx = hash % 8;
    setActiveBucketIdx(bucketIdx);
    setHashStepDesc(`Delete compressed index: ${hash} % 8 = Bucket [${bucketIdx}]`);
    await delay(1000);

    setHashStage('traversing');
    const currentBucket = mapBuckets[bucketIdx];
    let deleteIdx = -1;

    for (let i = 0; i < currentBucket.length; i++) {
      setActiveNodeIdx(i);
      setHashStepDesc(`Comparing key: "${currentBucket[i].key}" === "${key}"?`);
      await delay(700);
      if (currentBucket[i].key === key) {
        deleteIdx = i;
        break;
      }
    }

    if (deleteIdx !== -1) {
      setHashStage('modifying');
      setHashStepDesc(`Key match found! Unlinking node at index [${deleteIdx}] in chain.`);
      const updatedBucket = currentBucket.filter((_, idx) => idx !== deleteIdx);
      let updatedBuckets = [...mapBuckets];
      updatedBuckets[bucketIdx] = updatedBucket;
      setMapBuckets(updatedBuckets);
      setLogs(prev => [`Deleted Key "${key}" from bucket [${bucketIdx}].`, ...prev]);
    } else {
      setHashStepDesc(`Key "${key}" not found. Delete operation complete with no changes.`);
      setLogs(prev => [`Delete failed: Key "${key}" not found inside bucket [${bucketIdx}].`, ...prev]);
    }

    await delay(1200);
    setHashStage('idle');
    setActiveHashVal(null);
    setActiveBucketIdx(null);
    setActiveNodeIdx(null);
    setHashDeleteKey('');
  };

  const handleClear = () => {
    setMapBuckets(Array.from({ length: 8 }, () => []));
    setHashStepDesc('HashMap cleared. All 8 buckets are empty.');
    setLogs(['HashMap cleared. Size = 0.']);
  };

  const controls = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%' }}>
      {/* Insert */}
      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Key" 
          value={hashInputKey} 
          onChange={(e) => setHashInputKey(e.target.value)}
          disabled={hashStage !== 'idle'}
          style={{ width: '80px', padding: '0.45rem', borderRadius: '4px', border: '1px solid var(--bg-tertiary)', backgroundColor: 'var(--bg-primary)', color: '#FFFFFF', fontSize: '0.85rem' }}
        />
        <input 
          type="text" 
          placeholder="Val" 
          value={hashInputValue} 
          onChange={(e) => setHashInputValue(e.target.value)}
          disabled={hashStage !== 'idle'}
          style={{ width: '80px', padding: '0.45rem', borderRadius: '4px', border: '1px solid var(--bg-tertiary)', backgroundColor: 'var(--bg-primary)', color: '#FFFFFF', fontSize: '0.85rem' }}
        />
        <button className="btn-viz-action btn-add" onClick={handleInsert} disabled={hashStage !== 'idle'} style={{ whiteSpace: 'nowrap' }}>
          Insert
        </button>
      </div>

      {/* Search & Delete */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search Key" 
            value={hashSearchKey} 
            onChange={(e) => setHashSearchKey(e.target.value)}
            disabled={hashStage !== 'idle'}
            style={{ width: '90px', padding: '0.45rem', borderRadius: '4px', border: '1px solid var(--bg-tertiary)', backgroundColor: 'var(--bg-primary)', color: '#FFFFFF', fontSize: '0.85rem' }}
          />
          <button className="btn-viz-action" onClick={handleSearch} disabled={hashStage !== 'idle'}>
            Search
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Delete Key" 
            value={hashDeleteKey} 
            onChange={(e) => setHashDeleteKey(e.target.value)}
            disabled={hashStage !== 'idle'}
            style={{ width: '90px', padding: '0.45rem', borderRadius: '4px', border: '1px solid var(--bg-tertiary)', backgroundColor: 'var(--bg-primary)', color: '#FFFFFF', fontSize: '0.85rem' }}
          />
          <button className="btn-viz-action btn-clear" onClick={handleDelete} disabled={hashStage !== 'idle'}>
            Delete
          </button>
        </div>

        <button className="btn-viz-action btn-clear" onClick={handleClear} disabled={hashStage !== 'idle'}>
          Clear
        </button>
      </div>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
      <div>Active Simulation Step: <strong style={{ color: 'var(--brand-cyan)' }}>{hashStepDesc}</strong></div>
      <div>Active Stage: <span style={{ textTransform: 'uppercase', color: '#FFFFFF' }}>{hashStage}</span></div>
      <div>Calculated Hash Value: <span style={{ fontFamily: 'monospace', color: '#FFFFFF' }}>{activeHashVal !== null ? activeHashVal : 'N/A'}</span></div>
      <div>Compressed Index (bucket): <span style={{ fontFamily: 'monospace', color: '#FFFFFF' }}>{activeBucketIdx !== null ? activeBucketIdx : 'N/A'}</span></div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>HashMap</strong> stores key-value pairs using a hash function to map keys to bucket indices, providing O(1) average lookups:</p>
      <ul>
        <li><strong>HashCode:</strong> Converts key to an integer. We use the sum of char codes as a deterministic hash function: <code>sum(charCodes)</code>.</li>
        <li><strong>Modulo Compression:</strong> Fits the raw hash code inside array limits: <code>index = hashCode % capacity</code>.</li>
        <li><strong>Separate Chaining (Collision Resolution):</strong> Multiple keys hashing to the same bucket index are stored in a Linked List linked chain.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of a HashMap as an **organizational folder cabinet** with 8 drawers:</p>
      <ul>
        <li>You want to store a document labeled <em>"Alice"</em>.</li>
        <li>You compute the drawer index: take the name's length, e.g. 5 % 8 = Drawer 5.</li>
        <li>You open Drawer 5. If documents are already there, you attach your new document to the bottom of the pile in that drawer (chaining).</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Poor hashCode():</strong> If <code>hashCode()</code> returns the same constant for all keys, lookups degrade to O(N) because all items collide in a single bucket.</li>
      <li><strong>equals() mismatch:</strong> Failing to override <code>equals()</code> when custom objects are keys causes search fetches to fail.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is the default load factor of a HashMap in Java, and when does rehashing occur?',
      a: 'The default load factor is 0.75. When elements exceed 75% of capacity, HashMap allocates a new backing bucket array (double size) and rehashes all entry indices.'
    },
    {
      q: 'How does Java 8 optimize HashMaps under high collision rates?',
      a: 'If a bucket linked list size exceeds 8 and overall capacity is 64+, Java converts the list into a self-balancing Red-Black Tree, improving lookup times from O(N) to O(log N).'
    }
  ];

  const quizQuestions = [
    {
      question: 'What is the worst-case lookup complexity in Java 8 for a HashMap with high key collisions?',
      options: [
        'O(1)',
        'O(log N)',
        'O(N)',
        'O(N log N)'
      ],
      correctIdx: 1,
      explanation: "Java 8 converts linked list chains to self-balancing Red-Black trees when bucket size exceeds 8, reducing lookup time to O(log N) in the worst case."
    }
  ];

  return (
    <VisualizerShell
      title="HashMap Internal Working Simulator"
      subtitle="Step through key hash computations, index compressions, and separate chaining collision resolutions."
      timeComplexity="Average O(1), Worst O(log N)"
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', minHeight: '300px' }}>
        
        {/* Engine Dashboard */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: 'var(--border-radius-md)',
          padding: '1rem',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Active Operation Stage</span>
            <div style={{
              marginTop: '0.25rem',
              color: hashStage !== 'idle' ? 'var(--brand-cyan)' : 'var(--text-secondary)',
              fontWeight: '700',
              textTransform: 'uppercase',
              fontSize: '0.85rem'
            }}>
              {hashStage === 'idle' ? '● IDLE' : `● ${hashStage}`}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Raw Hash Code</span>
            <div style={{
              marginTop: '0.25rem',
              fontFamily: 'monospace',
              color: activeHashVal !== null ? '#1591DC' : 'var(--text-secondary)',
              fontWeight: '700'
            }}>
              {activeHashVal !== null ? activeHashVal : 'N/A'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Target Bucket</span>
            <div style={{
              marginTop: '0.25rem',
              color: activeBucketIdx !== null ? '#1591DC' : 'var(--text-secondary)',
              fontWeight: '700'
            }}>
              {activeBucketIdx !== null ? `Bucket [${activeBucketIdx}]` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Bucket grid and chain visualizer */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          width: '100%'
        }}>
          {mapBuckets.map((bucket, bIdx) => {
            const isTarget = activeBucketIdx === bIdx;
            
            return (
              <div
                key={bIdx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: isTarget ? 'rgba(21, 145, 220, 0.03)' : 'transparent',
                  border: isTarget ? '1px solid #1591DC' : '1px solid var(--bg-tertiary)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '0.75rem',
                  gap: '0.5rem',
                  transition: 'all 0.3s'
                }}
              >
                {/* Bucket tag */}
                <div style={{
                  width: '42px',
                  height: '42px',
                  backgroundColor: isTarget ? '#1591DC' : 'var(--bg-secondary)',
                  borderRadius: 'var(--border-radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  color: isTarget ? '#000000' : 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  flexShrink: 0
                }}>
                  [{bIdx}]
                </div>

                {/* Arrow */}
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>▶</span>

                {/* Chain linked nodes */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {bucket.length === 0 ? (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>null</span>
                  ) : (
                    bucket.map((node, nIdx) => {
                      const isNodeActive = isTarget && activeNodeIdx === nIdx;
                      return (
                        <React.Fragment key={nIdx}>
                          <div style={{
                            padding: '0.35rem 0.55rem',
                            backgroundColor: isNodeActive ? 'rgba(21, 145, 220, 0.15)' : 'var(--bg-primary)',
                            border: isNodeActive ? '1px solid #1591DC' : '1px solid var(--bg-tertiary)',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.1rem',
                            transition: 'all 0.2s',
                            boxShadow: isNodeActive ? '0 0 10px rgba(21, 145, 220, 0.25)' : 'none'
                          }}>
                            <span style={{ fontWeight: '700', color: '#FFFFFF' }}>K: {node.key}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>V: {node.val}</span>
                          </div>
                          {nIdx < bucket.length - 1 && (
                            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>→</span>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </VisualizerShell>
  );
}
