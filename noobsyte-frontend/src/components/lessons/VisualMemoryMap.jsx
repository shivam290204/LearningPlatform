import React, { useState, useEffect } from 'react';
import './VisualMemoryMap.css';

function VisualMemoryMap({ visualizations }) {
  const [activeStep, setActiveStep] = useState(0);

  // Reset steps on lesson load
  useEffect(() => {
    setActiveStep(0);
  }, [visualizations]);

  if (!visualizations || visualizations.length === 0) {
    return (
      <div className="empty-visuals-panel">
        <p><i className="fa-solid fa-circle-info" style={{ marginRight: '0.5rem' }}></i> No interactive memory blueprints are configured for this introductory lesson.</p>
      </div>
    );
  }

  const currentSnapshot = visualizations[activeStep];
  const { stack, heap } = currentSnapshot.memorySnapshot;

  return (
    <div className="memory-map-container">
      <div className="memory-map-header">
        <h4><i className="fa-solid fa-bolt" style={{ color: 'var(--brand-cyan)', marginRight: '0.5rem' }}></i> JVM Memory Layout Simulator</h4>
        <span className="step-badge">Step {activeStep + 1} of {visualizations.length}</span>
      </div>

      {/* Interactive Visualizer Canvas Grid */}
      <div className="visualizer-canvas">
        {/* Stack Frame Column */}
        <div className="canvas-column stack-column">
          <div className="column-label">JVM STACK FRAME (Local Scope)</div>
          <div className="stack-frame-box">
            {stack && stack.length > 0 ? (
              stack.map((v, i) => (
                <div key={i} className="stack-variable-card">
                  <span className="var-name">{v.variable}</span>
                  <span className="var-separator">→</span>
                  <span className={`var-val ${v.value.startsWith('0x') ? 'pointer-address' : ''}`}>
                    {v.value}
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-frame-msg">Stack scope is empty.</div>
            )}
          </div>
        </div>

        {/* Pointers direction connector indicators (Visual cue) */}
        <div className="pointers-connector">
          <span>⇄</span>
        </div>

        {/* Object Heap Column */}
        <div className="canvas-column heap-column">
          <div className="column-label">JVM HEAP SPACE (Objects)</div>
          <div className="heap-frame-box">
            {heap && heap.length > 0 ? (
              heap.map((h, i) => (
                <div key={i} className="heap-object-card">
                  <div className="object-address">{h.address}</div>
                  <div className="object-details">
                    <div className="object-type">{h.objectType} Object</div>
                    <div className="object-fields">
                      {h.fields && typeof h.fields === 'object' ? (
                        Object.entries(h.fields).map(([k, v]) => (
                          <div key={k} className="field-row">
                            <span className="field-key">{k}:</span>
                            <span className="field-val">"{v}"</span>
                          </div>
                        ))
                      ) : (
                        <span className="field-val">{String(h.fields)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-frame-msg">Heap is empty. (Objects unallocated)</div>
            )}
          </div>
        </div>
      </div>

      {/* Logical Step Explanation */}
      <div className="step-explanation-banner">
        <p><strong>JVM Mechanics:</strong> {currentSnapshot.label}</p>
      </div>

      {/* Visual Navigation controls */}
      <div className="visualizer-controls">
        <button
          className="btn-control"
          onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
          disabled={activeStep === 0}
        >
          ← Prev Step
        </button>
        <button
          className="btn-control"
          onClick={() => setActiveStep(prev => Math.min(visualizations.length - 1, prev + 1))}
          disabled={activeStep === visualizations.length - 1}
        >
          Next Step →
        </button>
      </div>
    </div>
  );
}

export default VisualMemoryMap;
