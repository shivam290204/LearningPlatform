import React, { useState } from 'react';
import { VISUALIZER_REGISTRY } from './visualizers/visualizerRegistry';
import './InteractiveVisualizer.css';

export default function InteractiveVisualizer() {
  const [activeCategory, setActiveCategory] = useState('JAVA');
  const [activeTopicId, setActiveTopicId] = useState('jvm-memory');

  // Find active topic object
  const categoryTopics = VISUALIZER_REGISTRY[activeCategory] || [];
  let activeTopic = categoryTopics.find(t => t.id === activeTopicId);
  
  // Fallback if activeTopicId is not in the current category
  if (!activeTopic && categoryTopics.length > 0) {
    activeTopic = categoryTopics[0];
  }

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    const firstTopic = VISUALIZER_REGISTRY[cat]?.[0];
    if (firstTopic) {
      setActiveTopicId(firstTopic.id);
    }
  };

  return (
    <div className="visualizer-tab-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      
      {/* Category Tabs Header (JAVA, DSA, SYSTEM DESIGN, DATABASE) */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--bg-tertiary)',
        paddingBottom: '0.5rem',
        gap: '1rem',
        overflowX: 'auto'
      }}>
        {Object.keys(VISUALIZER_REGISTRY).map(catKey => {
          const isActive = activeCategory === catKey;
          return (
            <button
              key={catKey}
              onClick={() => handleCategoryChange(catKey)}
              style={{
                background: 'none',
                border: 'none',
                color: isActive ? '#1591DC' : 'var(--text-secondary)',
                borderBottom: isActive ? '2.5px solid #1591DC' : '2.5px solid transparent',
                padding: '0.6rem 1.25rem',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {catKey.replace('_', ' ')}
            </button>
          );
        })}
      </div>

      {/* Sub-Topics selection row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.6rem',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--bg-tertiary)',
        padding: '0.75rem',
        borderRadius: 'var(--border-radius-md)'
      }}>
        {categoryTopics.map(topic => {
          const isActive = activeTopicId === topic.id;
          return (
            <button
              key={topic.id}
              onClick={() => setActiveTopicId(topic.id)}
              className={`viz-select-btn ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 1rem',
                fontSize: '0.8rem',
                background: isActive ? '#1591DC' : 'none',
                color: isActive ? '#000000' : 'var(--text-secondary)',
                border: isActive ? '1px solid #1591DC' : '1px solid var(--bg-tertiary)',
                borderRadius: 'var(--border-radius-sm)',
                fontWeight: isActive ? '700' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <i className={topic.icon}></i> {topic.name}
              {topic.isPlaceholder && (
                <span style={{
                  fontSize: '0.55rem',
                  padding: '0.1rem 0.25rem',
                  border: '1px solid var(--bg-tertiary)',
                  borderRadius: '2px',
                  marginLeft: '0.25rem',
                  color: 'var(--text-tertiary)'
                }}>
                  Coming Soon
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Display Board for active visualizer */}
      <div className="visualizer-display-board">
        {activeTopic ? (
          activeTopic.isPlaceholder ? (
            /* Render Blueprint/Roadmap Placeholder Card */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                borderBottom: '1px solid var(--bg-tertiary)',
                paddingBottom: '1rem'
              }}>
                <h4 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
                  <i className={activeTopic.icon} style={{ color: '#1591DC', marginRight: '0.5rem' }}></i> {activeTopic.name}
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem', margin: 0 }}>
                  {activeTopic.description}
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '1.5rem',
                alignItems: 'start'
              }} className="visualizer-grid-layout">
                
                {/* Blueprint details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="viz-simulator-canvas" style={{
                    minHeight: '260px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px dashed var(--bg-tertiary)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '2rem',
                    textAlign: 'center'
                  }}>
                    <i className="fa-solid fa-compass-drafting" style={{ fontSize: '3rem', color: '#1591DC', marginBottom: '1rem', opacity: 0.8 }}></i>
                    <h5 style={{ color: '#FFFFFF', fontWeight: '700', margin: '0 0 0.5rem 0' }}>Interactive Simulation Sandbox Blueprint</h5>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: '1.4', margin: 0 }}>
                      Our engineers are polishing the animations for this simulator. Below is the theoretical outline and interview prep checklist.
                    </p>
                  </div>

                  <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--bg-tertiary)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '1.25rem'
                  }}>
                    <h5 style={{ color: '#FFFFFF', fontWeight: '700', marginBottom: '0.75rem' }}>
                      <i className="fa-solid fa-map" style={{ color: '#1591DC' }}></i> Visual Roadmap Blueprint
                    </h5>
                    <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.6' }}>
                      <li><strong>Learning Objective:</strong> Master the underlying machine layouts, pointer mappings, or topology lifecycles.</li>
                      <li><strong>Interactive Sandbox:</strong> Play, Pause, Step-Forward, and adjust execution speed of simulation states.</li>
                      <li><strong>Interview Focus:</strong> Focus on complexity bounds, algorithmic stability, memory pressure edge cases, and pitfalls.</li>
                    </ul>
                  </div>
                </div>

                {/* Theoretical outlines and interview targets */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--bg-tertiary)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '1.25rem'
                  }}>
                    <h5 style={{ color: '#FFFFFF', fontWeight: '700', marginBottom: '0.5rem' }}>
                      <i className="fa-solid fa-bullseye" style={{ color: '#10b981' }}></i> High-Yield Interview Notes
                    </h5>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                      Candidates are frequently grilled on worst-case bounds, performance traps, cache locality issues, and concurrency safety. When this simulator goes live, you will be able to trace resource blocks, thread deadlocks, or index compression algorithms step-by-step.
                    </p>
                  </div>

                  <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--bg-tertiary)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '1.25rem'
                  }}>
                    <h5 style={{ color: '#FFFFFF', fontWeight: '700', marginBottom: '0.5rem' }}>
                      <i className="fa-solid fa-lightbulb" style={{ color: '#1591DC' }}></i> Real-Life Analogy
                    </h5>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                      Every system design layout or algorithm matches a real-world system. By visualizing caching networks, client-server handshake rings, or tree balance rotations visually, complex backend topics become intuitive.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* Render fully implemented visualizer component */
            <activeTopic.component />
          )
        ) : (
          <div style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>
            No visualizer selected. Select a category and sub-topic above to begin.
          </div>
        )}
      </div>
    </div>
  );
}
