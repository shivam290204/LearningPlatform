import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function StringPoolVisualizer() {
  const [allocations, setAllocations] = useState({
    s1: null, // Holds address e.g. '0xPOOL_CAT'
    s2: null,
    s3: null,
    s4: null
  });
  const [logs, setLogs] = useState(['String Pool initialized. Stack references are null.']);
  const [activeComparison, setActiveComparison] = useState(null); // { type: '==', varA: 's1', varB: 's2', result: true }

  const handleAllocate = (varName, type, val) => {
    let address = '';
    let updatedLogs = [];
    
    if (type === 'literal') {
      address = val === 'cat' ? '0xPOOL_CAT' : '0xPOOL_DOG';
      updatedLogs = [
        `${varName} = "${val}": Checked String Pool. ${val === 'cat' ? 'Literal "cat" found/created at pool address 0xPOOL_CAT.' : 'Literal "dog" found/created at pool address 0xPOOL_DOG.'}`,
        `${varName} reference set to ${address}.`
      ];
    } else {
      // new String()
      address = varName === 's3' ? '0xHEAP_STR_3' : '0xHEAP_STR_4';
      updatedLogs = [
        `${varName} = new String("${val}"): Explicitly allocated a new String object on the general Heap at address ${address}.`,
        `The heap object internal char array points to pool literal "cat" (0xPOOL_CAT).`,
        `${varName} reference set to Heap address ${address}.`
      ];
    }

    setAllocations(prev => ({ ...prev, [varName]: address }));
    setLogs(prev => [...updatedLogs, ...prev]);
    setActiveComparison(null);
  };

  const handleCompare = (varA, varB, compType) => {
    const addrA = allocations[varA];
    const addrB = allocations[varB];

    if (!addrA || !addrB) {
      alert(`Please allocate both ${varA} and ${varB} first before comparing.`);
      return;
    }

    let result = false;
    let logMsg = '';

    if (compType === '==') {
      result = addrA === addrB;
      logMsg = `Comparison (${varA} == ${varB}): Compares reference pointers. ${addrA} === ${addrB} -> Result is ${result.toString().toUpperCase()}.`;
    } else {
      // equals()
      // s1, s2, s3 all resolve to 'cat'. s4 is 'dog'.
      const valA = (varA === 's4') ? 'dog' : 'cat';
      const valB = (varB === 's4') ? 'dog' : 'cat';
      result = valA === valB;
      logMsg = `Comparison (${varA}.equals(${varB})): Compares character values. "${valA}" equals "${valB}" -> Result is ${result.toString().toUpperCase()}.`;
    }

    setActiveComparison({ type: compType, varA, varB, result });
    setLogs(prev => [logMsg, ...prev]);
  };

  const handleReset = () => {
    setAllocations({ s1: null, s2: null, s3: null, s4: null });
    setActiveComparison(null);
    setLogs(['String Pool visualizer reset. References cleared.']);
  };

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      {/* Allocation Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button 
          className="btn-viz-action btn-add" 
          onClick={() => handleAllocate('s1', 'literal', 'cat')}
          disabled={allocations.s1 !== null}
        >
          s1 = "cat"
        </button>
        <button 
          className="btn-viz-action btn-add" 
          onClick={() => handleAllocate('s2', 'literal', 'cat')}
          disabled={allocations.s2 !== null}
        >
          s2 = "cat"
        </button>
        <button 
          className="btn-viz-action btn-add" 
          onClick={() => handleAllocate('s3', 'heap', 'cat')}
          disabled={allocations.s3 !== null}
        >
          s3 = new String("cat")
        </button>
        <button 
          className="btn-viz-action btn-add" 
          onClick={() => handleAllocate('s4', 'literal', 'dog')}
          disabled={allocations.s4 !== null}
        >
          s4 = "dog"
        </button>
        <button className="btn-viz-action btn-clear" onClick={handleReset}>
          Reset
        </button>
      </div>

      {/* Comparison Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--bg-tertiary)', paddingTop: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>Comparisons:</span>
        <button className="btn-viz-action" onClick={() => handleCompare('s1', 's2', '==')}>
          s1 == s2
        </button>
        <button className="btn-viz-action" onClick={() => handleCompare('s1', 's3', '==')}>
          s1 == s3
        </button>
        <button className="btn-viz-action" onClick={() => handleCompare('s1', 's3', 'equals')}>
          s1.equals(s3)
        </button>
        <button className="btn-viz-action" onClick={() => handleCompare('s1', 's4', 'equals')}>
          s1.equals(s4)
        </button>
      </div>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
      <div>Reference pointers in local stack frame:</div>
      <div style={{ fontFamily: 'monospace', paddingLeft: '0.5rem' }}>
        <div>s1 = <span style={{ color: allocations.s1 ? '#1591DC' : 'var(--text-tertiary)' }}>{allocations.s1 || 'null'}</span></div>
        <div>s2 = <span style={{ color: allocations.s2 ? '#1591DC' : 'var(--text-tertiary)' }}>{allocations.s2 || 'null'}</span></div>
        <div>s3 = <span style={{ color: allocations.s3 ? '#ef4444' : 'var(--text-tertiary)' }}>{allocations.s3 || 'null'}</span></div>
        <div>s4 = <span style={{ color: allocations.s4 ? '#1591DC' : 'var(--text-tertiary)' }}>{allocations.s4 || 'null'}</span></div>
      </div>
      {activeComparison && (
        <div style={{
          marginTop: '0.5rem',
          padding: '0.5rem',
          backgroundColor: activeComparison.result ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
          border: activeComparison.result ? '1px solid #10b981' : '1px solid #ef4444',
          borderRadius: '4px',
          fontSize: '0.8rem',
          textAlign: 'center'
        }}>
          Comparison Result: <strong>{activeComparison.result ? 'TRUE' : 'FALSE'}</strong>
        </div>
      )}
    </div>
  );

  const theory = (
    <div>
      <p>Java optimizes memory consumption of String objects using the **String Constant Pool**:</p>
      <ul>
        <li><strong>String Constant Pool:</strong> A special storage region inside the Heap. When you declare a literal like <code>String s1 = "cat";</code>, the JVM checks the pool first. If the string already exists, it reuses the reference, saving heap space.</li>
        <li><strong>new String() Allocation:</strong> Forcefully creates a new, distinct String object in the general heap area. The pointers differ, even if their inner values match.</li>
        <li><strong>== vs equals():</strong> The <code>==</code> operator compares memory addresses (pointers). <code>equals()</code> compares actual string content character-by-character.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of String allocations as **stamping letters on cardboards**:</p>
      <ul>
        <li><strong>String Pool:</strong> A shared library table of stamps. Declaring <code>s1 = "cat";</code> is like picking up the existing card labeled "cat" on the library desk. <code>s2 = "cat";</code> grabs the same card. You both share the identical cardboard.</li>
        <li><strong>new String():</strong> Creating your own duplicate card at home. It says "cat" too, but it is a completely separate piece of cardboard in a different house.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Comparing strings with ==:</strong> Since <code>==</code> checks pointer addresses, using it to compare values can cause silent, intermittent bugs (e.g. it works for pool literals but fails for runtime dynamic strings). <em>Always use equals() to compare values.</em></li>
      <li><strong>String Immature concats:</strong> Strings are immutable. Concatenating strings in loops (e.g. <code>str += "a"</code>) creates a new String object each loop. Use <code>StringBuilder</code> for loop appends.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'How many String objects are created by: String s = new String("hello")?',
      a: 'Two objects are created. One is the string literal "hello" in the String Constant Pool (if not already present), and the other is the new String object in the general Heap.'
    },
    {
      q: 'What is String.intern()?',
      a: 'The intern() method searches the String Constant Pool for a string equal in value to this string object. If found, it returns the reference from the pool; otherwise, it adds this string to the pool and returns its reference.'
    }
  ];

  const quizQuestions = [
    {
      question: 'What is the outcome of: String s1 = "xyz"; String s2 = new String("xyz"); System.out.println(s1 == s2);',
      options: [
        'true',
        'false',
        'NullPointerException',
        'Compile error'
      ],
      correctIdx: 1,
      explanation: 's1 points to the pool address, while s2 points to a general Heap address. Since their pointers differ, s1 == s2 is false.'
    },
    {
      question: 'Which method compares the actual content of String characters?',
      options: [
        '==',
        'equals()',
        'hashCode()',
        'intern()'
      ],
      correctIdx: 1,
      explanation: 'equals() is overridden in the String class to compare characters in the underlying array one by one.'
    }
  ];

  const getPointerColor = (varName) => {
    if (!allocations[varName]) return 'transparent';
    return allocations[varName].includes('POOL') ? 'var(--brand-cyan)' : '#ef4444';
  };

  return (
    <VisualizerShell
      title="String Constant Pool vs General Heap"
      subtitle="Analyze literal reference sharing and watch general Heap allocations vs pool lookups."
      timeComplexity="O(1) pool resolution"
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', minHeight: '260px', padding: '1rem 0' }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1.5fr',
          gap: '1.5rem',
          width: '100%',
          alignItems: 'center'
        }} className="visualizer-grid-layout">
          
          {/* Stack references */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--bg-tertiary)',
            borderRadius: 'var(--border-radius-md)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: '0.4rem' }}>JVM STACK REFERENCES</span>
            
            {['s1', 's2', 's3', 's4'].map(v => (
              <div key={v} style={{
                padding: '0.5rem',
                border: activeComparison && (activeComparison.varA === v || activeComparison.varB === v) ? '2px solid #f59e0b' : '1px solid var(--bg-tertiary)',
                borderRadius: '4px',
                backgroundColor: 'var(--bg-primary)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                fontFamily: 'monospace'
              }}>
                <span>{v}</span>
                <span style={{ color: getPointerColor(v) }}>{allocations[v] || 'null'}</span>
              </div>
            ))}
          </div>

          {/* Pointer indicator */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)', gap: '0.5rem' }}>
            <span>Pointer Paths</span>
            <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--bg-tertiary)' }}></div>
          </div>

          {/* Heap Space + String Constant Pool */}
          <div style={{
            border: '2px solid var(--bg-tertiary)',
            borderRadius: 'var(--border-radius-md)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: 'rgba(255,255,255,0.01)',
            minHeight: '220px'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ef4444', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: '0.4rem' }}>JVM HEAP SPACE</span>
            
            {/* General Heap String Objects */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {allocations.s3 && (
                <div style={{
                  padding: '0.5rem',
                  border: '1.5px solid #ef4444',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-secondary)',
                  fontSize: '0.7rem',
                  animation: 'pop-heap 0.3s forwards'
                }}>
                  <span style={{ display: 'block', color: '#ef4444', fontSize: '0.55rem' }}>Addr: 0xHEAP_STR_3</span>
                  <strong>new String("cat")</strong>
                </div>
              )}
            </div>

            {/* String Constant Pool nested within Heap */}
            <div style={{
              border: '2px dashed var(--brand-cyan)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '1rem',
              backgroundColor: 'rgba(36, 224, 217, 0.02)',
              marginTop: 'auto'
            }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--brand-cyan)', display: 'block', marginBottom: '0.5rem' }}>STRING CONSTANT POOL</span>
              
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                { (allocations.s1 || allocations.s2 || allocations.s3) && (
                  <div style={{
                    padding: '0.4rem 0.75rem',
                    border: '1.5px solid var(--brand-cyan)',
                    borderRadius: '4px',
                    backgroundColor: 'var(--bg-primary)',
                    fontSize: '0.8rem',
                    fontFamily: 'monospace',
                    fontWeight: '700'
                  }}>
                    <span style={{ display: 'block', fontSize: '0.55rem', color: 'var(--text-tertiary)' }}>0xPOOL_CAT</span>
                    "cat"
                  </div>
                )}

                { allocations.s4 && (
                  <div style={{
                    padding: '0.4rem 0.75rem',
                    border: '1.5px solid var(--brand-cyan)',
                    borderRadius: '4px',
                    backgroundColor: 'var(--bg-primary)',
                    fontSize: '0.8rem',
                    fontFamily: 'monospace',
                    fontWeight: '700'
                  }}>
                    <span style={{ display: 'block', fontSize: '0.55rem', color: 'var(--text-tertiary)' }}>0xPOOL_DOG</span>
                    "dog"
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </VisualizerShell>
  );
}
