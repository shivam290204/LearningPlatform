import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function JvmMemoryVisualizer() {
  const [jvmStep, setJvmStep] = useState('declare'); // 'declare' or 'allocate'
  const [logs, setLogs] = useState(['JVM Stack initialized. myCar reference variable is not yet declared.']);

  const handleStep = (step) => {
    setJvmStep(step);
    if (step === 'declare') {
      setLogs([
        'myCar reference variable declared on Stack.',
        'No object created on the Heap. myCar contains null.',
        'Address: 0x00A1 -> null'
      ]);
    } else {
      setLogs([
        'new Car("RoyalBlue") instantiated on the Heap.',
        'Memory block allocated at Heap address 0x7A3F.',
        'Stack reference myCar updated with value 0x7A3F.',
        'Address: 0x00A1 -> points to 0x7A3F'
      ]);
    }
  };

  const controls = (
    <>
      <button 
        className={`btn-viz-action ${jvmStep === 'declare' ? 'selected' : ''}`}
        onClick={() => handleStep('declare')}
      >
        Car myCar; (Declare Reference)
      </button>
      <button 
        className={`btn-viz-action ${jvmStep === 'allocate' ? 'selected' : ''}`}
        onClick={() => handleStep('allocate')}
      >
        myCar = new Car("RoyalBlue"); (Allocate Object)
      </button>
    </>
  );

  const stateInspector = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
      <div>Stack Frames count: <strong style={{ color: '#FFFFFF' }}>1 (main)</strong></div>
      <div>Local variables: <span style={{ color: '#FFFFFF', fontFamily: 'monospace' }}>myCar = {jvmStep === 'declare' ? 'null' : '0x7A3F'}</span></div>
      <div>Heap allocations: <span style={{ color: '#FFFFFF', fontFamily: 'monospace' }}>{jvmStep === 'declare' ? 'None' : 'Car Object (size: 24 bytes)'}</span></div>
    </div>
  );

  const theory = (
    <div>
      <p>Java divides runtime memory into several data areas, most notably the <strong>JVM Stack</strong> and the <strong>Heap</strong>:</p>
      <ul>
        <li><strong>JVM Stack:</strong> Stores frame data, primitive values, and object reference pointers. Every thread has its own private Stack. Memory allocation is fast and follows LIFO ordering.</li>
        <li><strong>Heap:</strong> Stores all class instances (objects) and arrays. It is shared across all threads and managed by the Garbage Collector.</li>
      </ul>
      <p>Declaring a reference variable like <code>Car myCar;</code> only creates a slot on the stack holding <code>null</code>. The object is only spawned on the Heap when the <code>new</code> keyword is parsed.</p>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of the <strong>Stack</strong> as a <strong>Directory Book</strong> containing names and addresses, and the <strong>Heap</strong> as a large <strong>Housing estate</strong> where houses actually stand:</p>
      <ul>
        <li>Declaring <code>Car myCar;</code> is like writing the label <em>"myCar"</em> in your directory, but leaving the address field blank (representing <code>null</code>).</li>
        <li>Executing <code>myCar = new Car();</code> is like building a physical house at Plot <code>0x7A3F</code> in the estate, and then writing the address <code>0x7A3F</code> next to the <em>"myCar"</em> label in your book.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>NullPointerException (NPE):</strong> Trying to call a method on a reference that is null (e.g., <code>myCar.drive()</code> before heap allocation). The stack reference has no address pointing to a heap object.</li>
      <li><strong>Assuming Stack holds objects:</strong> In Java, non-primitive objects are <em>always</em> allocated on the Heap. Only their reference addresses reside in local stack frame variables.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is the main difference between Stack and Heap memory in Java?',
      a: 'Stack is used for execution thread frames and local variables with LIFO access, while Heap is used for dynamic object allocations shared globally. Stack is automatically reclaimed when method calls return, while Heap objects are cleaned by the Garbage Collector.'
    },
    {
      q: 'Does Java pass objects by reference or by value?',
      a: 'Java is strictly pass-by-value. For objects, Java passes the value of the reference (the memory address) on the stack by value, not the object itself.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Where does an instance variable of a class reside if it is declared inside a class definition?',
      options: [
        'On the Stack Frame',
        'Inside the object on the Heap',
        'In the Method Area',
        'It depends on whether it is a primitive or object type'
      ],
      correctIdx: 1,
      explanation: 'All variables that belong to an object instance (instance variables) are stored inside the object structure on the Heap, regardless of whether they are primitive values or reference types.'
    },
    {
      question: 'What happens when a stack reference is assigned "null"?',
      options: [
        'The object on the heap is instantly deleted from memory',
        'The pointer is set to point to address 0x0000 (null), leaving the heap object orphaned until GC clean',
        'The program crashes with a NullPointerException',
        'The stack frame is destroyed'
      ],
      correctIdx: 1,
      explanation: 'Setting a reference to null simply clears the address reference on the stack. The heap object remains in memory until the Garbage Collector detects that there are no active references pointing to it.'
    }
  ];

  return (
    <VisualizerShell
      title="JVM Stack vs Heap Allocation"
      subtitle="Understand stack frames and object instance pointers on the Heap."
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
      <div className="jvm-canvas" style={{ display: 'flex', gap: '3rem', justifyContent: 'center', alignItems: 'center', minHeight: '180px', width: '100%' }}>
        {/* Stack block */}
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

        {/* Pointer connector */}
        {jvmStep === 'allocate' && (
          <div className="jvm-pointer-line-wrap" style={{ position: 'relative', left: '0', display: 'flex', alignItems: 'center' }}>
            <div className="jvm-pointer-line" style={{ width: '80px', height: '2px', backgroundColor: 'var(--brand-cyan)' }}></div>
            <div className="jvm-arrow-head">▶</div>
          </div>
        )}

        {/* Heap space */}
        <div className="jvm-block jvm-heap">
          <span className="block-label">JVM HEAP SPACE</span>
          {jvmStep === 'declare' ? (
            <div className="empty-state-box">Stack reference exists, Heap is empty (null).</div>
          ) : (
            <div className="heap-object-box-sim" style={{ animation: 'pop-heap 0.3s forwards' }}>
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
    </VisualizerShell>
  );
}
