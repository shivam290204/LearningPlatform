import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function WrapperClassesVisualizer() {
  const [cacheVars, setCacheVars] = useState({
    a: null, // Holds address
    b: null,
    c: null,
    d: null
  });
  const [logs, setLogs] = useState(['Wrapper cache initialized. Boxed references are empty (null).']);
  const [activeComparison, setActiveComparison] = useState(null);

  const handleBox = (testType) => {
    if (testType === 'cache') {
      // 127 Test
      setCacheVars(prev => ({
        ...prev,
        a: '0xCACHE_127',
        b: '0xCACHE_127'
      }));
      setLogs(prev => [
        'Integer a = 127; Integer b = 127; executed.',
        'Value 127 falls within IntegerCache [-128, 127].',
        'Both variables a and b point to the SAME cached JVM object at address 0xCACHE_127.',
        ...prev
      ]);
    } else {
      // 128 Test
      setCacheVars(prev => ({
        ...prev,
        c: '0xHEAP_128_C',
        d: '0xHEAP_128_D'
      }));
      setLogs(prev => [
        'Integer c = 128; Integer d = 128; executed.',
        'Value 128 is OUTSIDE the IntegerCache range.',
        'JVM allocated two separate Heap objects: c at 0xHEAP_128_C and d at 0xHEAP_128_D.',
        ...prev
      ]);
    }
    setActiveComparison(null);
  };

  const handleCompare = (varA, varB, type) => {
    const addrA = cacheVars[varA];
    const addrB = cacheVars[varB];

    if (!addrA || !addrB) {
      alert(`Please box the variables ${varA} and ${varB} first.`);
      return;
    }

    let result = false;
    let desc = '';

    if (type === '==') {
      result = addrA === addrB;
      desc = `Comparison (${varA} == ${varB}): Compares references. Address ${addrA} === ${addrB} -> Result is ${result.toString().toUpperCase()}.`;
    } else {
      // equals()
      result = true; // Both are 127 or 128
      desc = `Comparison (${varA}.equals(${varB})): Compares values inside the objects. ${varA} value === ${varB} value -> Result is TRUE.`;
    }

    setActiveComparison({ type, varA, varB, result });
    setLogs(prev => [desc, ...prev]);
  };

  const handleReset = () => {
    setCacheVars({ a: null, b: null, c: null, d: null });
    setActiveComparison(null);
    setLogs(['Visualizer reset. Variables cleared.']);
  };

  const controls = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button className="btn-viz-action btn-add" onClick={() => handleBox('cache')}>
          Run Cache Test (Value = 127)
        </button>
        <button className="btn-viz-action btn-add" onClick={() => handleBox('heap')}>
          Run Heap Test (Value = 128)
        </button>
        <button className="btn-viz-action btn-clear" onClick={handleReset}>
          Reset
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--bg-tertiary)', paddingTop: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>Comparisons:</span>
        <button className="btn-viz-action" onClick={() => handleCompare('a', 'b', '==')} disabled={!cacheVars.a}>
          a == b (127)
        </button>
        <button className="btn-viz-action" onClick={() => handleCompare('c', 'd', '==')} disabled={!cacheVars.c}>
          c == d (128)
        </button>
        <button className="btn-viz-action" onClick={() => handleCompare('c', 'd', 'equals')} disabled={!cacheVars.c}>
          c.equals(d)
        </button>
      </div>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
      <div>Variables:</div>
      <div style={{ fontFamily: 'monospace', paddingLeft: '0.5rem' }}>
        <div>a (Integer: 127) = <span style={{ color: cacheVars.a ? 'var(--brand-cyan)' : 'var(--text-tertiary)' }}>{cacheVars.a || 'null'}</span></div>
        <div>b (Integer: 127) = <span style={{ color: cacheVars.b ? 'var(--brand-cyan)' : 'var(--text-tertiary)' }}>{cacheVars.b || 'null'}</span></div>
        <div>c (Integer: 128) = <span style={{ color: cacheVars.c ? '#ef4444' : 'var(--text-tertiary)' }}>{cacheVars.c || 'null'}</span></div>
        <div>d (Integer: 128) = <span style={{ color: cacheVars.d ? '#ef4444' : 'var(--text-tertiary)' }}>{cacheVars.d || 'null'}</span></div>
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
          Result: <strong>{activeComparison.result ? 'TRUE' : 'FALSE'}</strong>
        </div>
      )}
    </div>
  );

  const theory = (
    <div>
      <p>Java supports **Autoboxing** (converting primitive types to wrapper objects, e.g., <code>int</code> to <code>Integer</code>) and **Auto-unboxing**:</p>
      <ul>
        <li><strong>Autoboxing syntax:</strong> <code>Integer a = 10;</code> is translated to <code>Integer.valueOf(10)</code> under the hood.</li>
        <li><strong>Integer Cache:</strong> To save memory, the JVM maintains an internal cache of Integer objects for values in the range <strong>-128 to 127</strong>. Calling <code>valueOf()</code> in this range retrieves the pre-existing cached instance.</li>
        <li><strong>Out of Cache range:</strong> Values greater than 127 or less than -128 bypass cache checks, creating a new heap instance with a unique memory address on every invocation.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of the Integer Cache as **printed numeric coupons at a store**:</p>
      <ul>
        <li>The store prints coupons for values $1 to $127 and keeps them in a drawer.</li>
        <li>If Customer A and Customer B both ask for a "$127 coupon", the store clerk hands them photocopies of the identical $127 coupon design (reused reference).</li>
        <li>If they ask for a "$128 coupon", the clerk does not have pre-printed coupons for that. The clerk goes to a print machine and makes a unique, custom $128 coupon for Customer A, and another custom one for Customer B. They are different sheets of paper (heap objects).</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Comparing Objects with ==:</strong> Thinking <code>==</code> is safe for Integer wrappers. It works for 127 because of caching, but silently fails for 128, leading to bugs. <em>Always use equals() to compare values.</em></li>
      <li><strong>NullPointerException:</strong> Unboxing an Integer that is null (e.g. <code>Integer a = null; int b = a;</code>). This triggers <code>a.intValue()</code> on a null object, crashing the code.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Why does "Integer a = 127; Integer b = 127; System.out.println(a == b);" print true, but changes to 128 print false?',
      a: 'This is due to Java\'s Integer Cache. The JVM caches Integer objects for values between -128 and 127. For 127, valueOf() returns the same cached reference. For 128, a new object is allocated on the heap on each call.'
    },
    {
      q: 'Can we change the bounds of the Integer Cache?',
      a: 'Yes, the upper bound (127) can be adjusted using the JVM launch parameter: -XX:AutoBoxCacheMax=<size>. The lower bound (-128) is fixed.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which of the following comparisons will evaluate to FALSE?',
      options: [
        'Integer.valueOf(100) == Integer.valueOf(100)',
        'Integer.valueOf(200) == Integer.valueOf(200)',
        'Integer.valueOf(200).equals(Integer.valueOf(200))',
        'Integer.valueOf(-128) == Integer.valueOf(-128)'
      ],
      correctIdx: 1,
      explanation: '200 is outside the default cache range [-128, 127], so valueOf(200) creates two distinct heap objects with different memory addresses, making "==" false.'
    }
  ];

  return (
    <VisualizerShell
      title="Wrapper Classes & Integer Cache Trap"
      subtitle="Observe autoboxing references and witness when JVM reuses cached instances vs allocating new heap objects."
      timeComplexity="O(1)"
      spaceComplexity="O(1)"
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
          
          {/* Stack Pointers */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--bg-tertiary)',
            borderRadius: 'var(--border-radius-md)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: '0.4rem' }}>JVM STACK SLOTS</span>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ padding: '0.4rem', border: '1px solid var(--bg-tertiary)', borderRadius: '4px', backgroundColor: 'var(--bg-primary)', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace' }}>
                <span>a = 127</span>
                <span style={{ color: cacheVars.a ? 'var(--brand-cyan)' : 'var(--text-tertiary)' }}>{cacheVars.a || 'null'}</span>
              </div>
              <div style={{ padding: '0.4rem', border: '1px solid var(--bg-tertiary)', borderRadius: '4px', backgroundColor: 'var(--bg-primary)', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace' }}>
                <span>b = 127</span>
                <span style={{ color: cacheVars.b ? 'var(--brand-cyan)' : 'var(--text-tertiary)' }}>{cacheVars.b || 'null'}</span>
              </div>
              <div style={{ padding: '0.4rem', border: '1px solid var(--bg-tertiary)', borderRadius: '4px', backgroundColor: 'var(--bg-primary)', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace' }}>
                <span>c = 128</span>
                <span style={{ color: cacheVars.c ? '#ef4444' : 'var(--text-tertiary)' }}>{cacheVars.c || 'null'}</span>
              </div>
              <div style={{ padding: '0.4rem', border: '1px solid var(--bg-tertiary)', borderRadius: '4px', backgroundColor: 'var(--bg-primary)', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace' }}>
                <span>d = 128</span>
                <span style={{ color: cacheVars.d ? '#ef4444' : 'var(--text-tertiary)' }}>{cacheVars.d || 'null'}</span>
              </div>
            </div>
          </div>

          {/* Paths */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)', gap: '0.5rem' }}>
            <span>Cache vs Heap</span>
            <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--bg-tertiary)' }}></div>
          </div>

          {/* JVM memory areas */}
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
            
            {/* Out of cache allocations */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {cacheVars.c && (
                <div style={{
                  padding: '0.5rem',
                  border: '1.5px solid #ef4444',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-secondary)',
                  fontSize: '0.7rem',
                  animation: 'pop-heap 0.3s forwards'
                }}>
                  <span style={{ display: 'block', color: '#ef4444', fontSize: '0.55rem' }}>0xHEAP_128_C</span>
                  <strong>Integer(128)</strong>
                </div>
              )}
              {cacheVars.d && (
                <div style={{
                  padding: '0.5rem',
                  border: '1.5px solid #ef4444',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-secondary)',
                  fontSize: '0.7rem',
                  animation: 'pop-heap 0.3s forwards'
                }}>
                  <span style={{ display: 'block', color: '#ef4444', fontSize: '0.55rem' }}>0xHEAP_128_D</span>
                  <strong>Integer(128)</strong>
                </div>
              )}
            </div>

            {/* Integer Cache pool */}
            <div style={{
              border: '2px dashed var(--brand-cyan)',
              borderRadius: 'var(--border-radius-sm)',
              padding: '1rem',
              backgroundColor: 'rgba(36, 224, 217, 0.02)',
              marginTop: 'auto'
            }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--brand-cyan)', display: 'block', marginBottom: '0.5rem' }}>INTEGER CACHE POOL (-128 to 127)</span>
              
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', opacity: cacheVars.a ? 1 : 0.4 }}>
                <div style={{
                  padding: '0.4rem 0.75rem',
                  border: '1.5px solid var(--brand-cyan)',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-primary)',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  fontWeight: '700'
                }}>
                  <span style={{ display: 'block', fontSize: '0.55rem', color: 'var(--text-tertiary)' }}>0xCACHE_127</span>
                  Integer(127)
                </div>
                <div style={{
                  padding: '0.4rem 0.75rem',
                  border: '1px solid var(--bg-tertiary)',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-primary)',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  color: 'var(--text-tertiary)'
                }}>
                  ...
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </VisualizerShell>
  );
}
