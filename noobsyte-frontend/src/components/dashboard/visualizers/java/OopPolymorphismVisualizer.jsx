import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function OopPolymorphismVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const steps = [
    {
      action: '1. Reference Declaration',
      log: 'Animal myPet; declared. Compiler registers the variable on the Stack of reference type Animal. It holds null.',
      highlight: 'stack',
      stackVal: 'null',
      stackType: 'Animal',
      heapObj: null,
      vtableLookup: 'None',
      compilerStatus: 'Registered myPet of type Animal',
      jvmAction: 'Created null stack reference'
    },
    {
      action: '2. Object Instantiation',
      log: 'myPet = new Dog(); executed. Heap allocates memory for a new Dog object. Stack reference updated to Heap address 0x77DD.',
      highlight: 'heap',
      stackVal: '0x77DD',
      stackType: 'Animal',
      heapObj: { type: 'Dog', addr: '0x77DD' },
      vtableLookup: 'None',
      compilerStatus: 'Instance created',
      jvmAction: 'Allocated Dog object on Heap'
    },
    {
      action: '3. Compile-Time Checking',
      log: 'Compiler parses myPet.makeSound(). It checks the reference type (Animal) to see if makeSound() is declared. Verification passes!',
      highlight: 'compiler',
      stackVal: '0x77DD',
      stackType: 'Animal',
      heapObj: { type: 'Dog', addr: '0x77DD' },
      vtableLookup: 'None',
      compilerStatus: '✓ Animal.makeSound() exists. Compile success!',
      jvmAction: 'Waiting for bytecode execution'
    },
    {
      action: '4. Runtime vtable Lookup',
      log: 'JVM executes bytecode. It inspects Heap object at 0x77DD, identifying it as Dog. JVM opens Dog class Virtual Method Table (vtable).',
      highlight: 'vtable',
      stackVal: '0x77DD',
      stackType: 'Animal',
      heapObj: { type: 'Dog', addr: '0x77DD' },
      vtableLookup: 'Dog vtable -> makeSound() maps to Dog.makeSound()',
      compilerStatus: 'N/A (Runtime)',
      jvmAction: 'Inspecting vtable of runtime class Dog'
    },
    {
      action: '5. Dynamic Dispatch Execution',
      log: 'Dynamic Dispatch: JVM invokes Dog.makeSound() from the resolved vtable pointer. Output: "Woof! Woof!" printed.',
      highlight: 'execution',
      stackVal: '0x77DD',
      stackType: 'Animal',
      heapObj: { type: 'Dog', addr: '0x77DD' },
      vtableLookup: 'Invoked Dog.makeSound() [woof!]',
      compilerStatus: 'N/A (Runtime)',
      jvmAction: 'Executed overridden method'
    }
  ];

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
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
  }, [isPlaying, speed]);

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const stateInspector = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
      <div>Compiler Reference: <strong style={{ color: '#FFFFFF' }}>{steps[currentStep].stackType} myPet</strong></div>
      <div>Runtime Heap Type: <strong style={{ color: '#FFFFFF' }}>{steps[currentStep].heapObj ? steps[currentStep].heapObj.type : 'None'}</strong></div>
      <div>Compiler Verification: <span style={{ color: '#10b981' }}>{steps[currentStep].compilerStatus}</span></div>
      <div>Active VTable Mapping: <span style={{ color: 'var(--brand-cyan)', fontFamily: 'monospace' }}>{steps[currentStep].vtableLookup}</span></div>
    </div>
  );

  const theory = (
    <div>
      <p>Polymorphism allows a reference of a parent type to point to an object of a child type, enabling **Dynamic Method Dispatch**:</p>
      <ul>
        <li><strong>Compile-Time vs Runtime Type:</strong> For <code>Animal a = new Dog();</code>, the compiler only sees the reference type (Animal) and checks if the method exists in Animal. At runtime, the JVM looks at the actual object type on the Heap (Dog).</li>
        <li><strong>Virtual Method Table (vtable):</strong> Each class has a vtable in the method area listing memory addresses for its methods. Overridden methods are mapped to the child class implementations.</li>
        <li><strong>Dynamic Dispatch:</strong> The JVM dynamically resolves which overridden method to call at runtime by looking up the vtable of the active object on the Heap.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Dynamic Method Dispatch as **calling phone extensions in an office**:</p>
      <ul>
        <li>You call the central receptionist desk (parent type Animal) and ask for the "Security Manager" (method <code>makeSound()</code>). The operator checks the directory database and confirms that the factory indeed has a Security Manager (Compile-time verification).</li>
        <li>However, the receptionist doesn't answer the question themselves. They transfer your call to the active person currently sitting at that desk (the runtime object Dog). When the phone rings, it is the Dog who picks up and barks "Woof!" (Dynamic dispatch execution).</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Assuming variables are polymorphic:</strong> In Java, methods are overridden, but variables (instance fields) are not. Accessing fields uses compile-time reference type resolution. E.g. <code>Animal a = new Dog(); System.out.println(a.name);</code> resolves to Animal's name field, not Dog's.</li>
      <li><strong>Missing method in Parent reference:</strong> Trying to call child-only methods on a parent reference (e.g. <code>myPet.bark()</code> if <code>bark()</code> is only in Dog and not in Animal). The compiler will raise a compilation error because it doesn't know about Dog yet.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is Dynamic Method Dispatch and how does JVM resolve it?',
      a: 'Dynamic Method Dispatch is the mechanism by which a call to an overridden method is resolved at runtime rather than compile-time. The JVM achieves this using Class structures and Virtual Method Tables (vtables) to locate the overridden method of the runtime object.'
    },
    {
      q: 'Can we override private or static methods in Java?',
      a: 'No, private and static methods cannot be overridden. Private methods are not visible to child classes, and static methods are resolved at compile-time (method hiding), not dynamically at runtime.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Consider classes: Animal (has makeSound()) and Dog extends Animal (overrides makeSound()). What is the result of executing: Animal a = new Dog(); a.makeSound();',
      options: [
        'Compilation fails',
        'Invokes Animal.makeSound()',
        'Invokes Dog.makeSound()',
        'Throws Runtime Exception'
      ],
      correctIdx: 2,
      explanation: 'The compiler confirms makeSound() exists in Animal, and the JVM resolves the reference at runtime to invoke the overridden makeSound() in Dog.'
    },
    {
      question: 'Which of the following is bound at compile-time (Static Polymorphism)?',
      options: [
        'Method Overriding',
        'Method Overloading',
        'Dynamic Method Dispatch',
        'Interface implementations'
      ],
      correctIdx: 1,
      explanation: 'Method Overloading (methods with same name but different signatures in same class) is resolved at compile-time by the compiler, based on argument types.'
    }
  ];

  const isHighlighted = (name) => steps[currentStep].highlight === name;

  return (
    <VisualizerShell
      title="Dynamic Method Dispatch (OOP Polymorphism)"
      subtitle="Witness reference compile-time checks vs runtime Virtual Method Table (vtable) lookups."
      timeComplexity="O(1) table lookup"
      spaceComplexity="O(N)"
      theoryContent={theory}
      analogyContent={analogy}
      mistakesContent={mistakes}
      interviewQuestions={interviewQuestions}
      quizQuestions={quizQuestions}
      logs={[steps[currentStep].log]}
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
      <div style={{ display: 'flex', gap: '1rem', width: '100%', minHeight: '300px', flexDirection: 'column' }}>
        
        {/* Compiler Box vs JVM Runtime */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.3fr 1fr',
          gap: '1.25rem',
          width: '100%'
        }} className="visualizer-grid-layout">
          
          {/* Stack Frame */}
          <div style={{
            border: isHighlighted('stack') ? '2px solid #1591DC' : '1px solid var(--bg-tertiary)',
            backgroundColor: isHighlighted('stack') ? 'rgba(21, 145, 220, 0.03)' : 'transparent',
            borderRadius: 'var(--border-radius-md)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: '0.4rem', textAlign: 'center' }}>JVM STACK FRAME</span>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', borderRadius: '4px', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '0.55rem', color: 'var(--text-tertiary)' }}>Reference Type: {steps[currentStep].stackType}</span>
              <strong style={{ fontSize: '0.85rem' }}>myPet</strong>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#1591DC', marginTop: '0.25rem', fontFamily: 'monospace' }}>val: {steps[currentStep].stackVal}</span>
            </div>
          </div>

          {/* JVM Heap Object & VTable */}
          <div style={{
            border: isHighlighted('heap') || isHighlighted('vtable') ? '2px solid #1591DC' : '1px solid var(--bg-tertiary)',
            backgroundColor: isHighlighted('heap') || isHighlighted('vtable') ? 'rgba(21, 145, 220, 0.03)' : 'transparent',
            borderRadius: 'var(--border-radius-md)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#ef4444', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: '0.4rem', textAlign: 'center' }}>JVM HEAP OBJECT</span>
            
            {steps[currentStep].heapObj ? (
              <div style={{
                padding: '0.75rem',
                border: '1.5px solid #ef4444',
                borderRadius: '4px',
                backgroundColor: 'var(--bg-secondary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                animation: 'pop-heap 0.3s forwards'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#ef4444', fontFamily: 'monospace' }}>{steps[currentStep].heapObj.addr}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>Class: {steps[currentStep].heapObj.type}</span>
                </div>
                
                {/* VTable nested inside Class Metadata pointer */}
                <div style={{
                  border: isHighlighted('vtable') ? '2px solid var(--brand-cyan)' : '1px dashed var(--bg-tertiary)',
                  padding: '0.4rem',
                  borderRadius: '2px',
                  backgroundColor: 'rgba(36,224,217,0.02)',
                  fontSize: '0.65rem'
                }}>
                  <strong style={{ color: 'var(--brand-cyan)' }}>Dog.class vtable:</strong>
                  <div style={{ fontFamily: 'monospace', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    makeSound() → Dog.makeSound()
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', textAlign: 'center', margin: 'auto', fontSize: '0.8rem' }}>
                Heap is Empty (null pointer)
              </div>
            )}
          </div>

          {/* Compiler Checker & Execution Output */}
          <div style={{
            border: isHighlighted('compiler') || isHighlighted('execution') ? '2px solid #10b981' : '1px solid var(--bg-tertiary)',
            backgroundColor: isHighlighted('compiler') || isHighlighted('execution') ? 'rgba(16, 185, 129, 0.03)' : 'transparent',
            borderRadius: 'var(--border-radius-md)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#10b981', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: '0.4rem', textAlign: 'center' }}>COMPILER & CONSOLE</span>
            
            <div style={{
              padding: '0.5rem',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--bg-tertiary)',
              borderRadius: '4px',
              fontSize: '0.7rem',
              lineHeight: '1.4'
            }}>
              <span style={{ fontSize: '0.55rem', display: 'block', color: 'var(--text-tertiary)' }}>COMPILE STATUS</span>
              <strong>{steps[currentStep].compilerStatus}</strong>
            </div>

            <div style={{
              padding: '0.5rem',
              backgroundColor: '#08090d',
              border: '1.5px solid #10b981',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              color: '#10b981',
              textAlign: 'center',
              fontWeight: '700'
            }}>
              <span style={{ display: 'block', fontSize: '0.55rem', color: 'var(--text-tertiary)', fontWeight: 'normal', fontFamily: 'sans-serif' }}>CONSOLE OUTPUT</span>
              {currentStep === 4 ? '"Woof! Woof!"' : '-'}
            </div>
          </div>

        </div>

      </div>
    </VisualizerShell>
  );
}
