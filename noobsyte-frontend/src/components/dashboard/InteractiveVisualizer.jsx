import React, { useState } from 'react';
import { VISUALIZER_REGISTRY } from './visualizers/visualizerRegistry';
import './InteractiveVisualizer.css';

// SVG Schematics for Roadmaps
function PreviewDiagram({ type }) {
  switch (type) {
    case 'avl':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <circle cx="110" cy="25" r="14" fill="none" stroke="#1591DC" strokeWidth="2" />
          <text x="110" y="29" textAnchor="middle" fill="#FFFFFF" fontSize="0.7rem">50</text>
          
          <line x1="100" y1="35" x2="70" y2="65" stroke="var(--bg-tertiary)" strokeWidth="2" />
          <circle cx="65" cy="75" r="14" fill="none" stroke="#1591DC" strokeWidth="2" />
          <text x="65" y="79" textAnchor="middle" fill="#FFFFFF" fontSize="0.7rem">30</text>
          
          <line x1="120" y1="35" x2="150" y2="65" stroke="var(--bg-tertiary)" strokeWidth="2" />
          <circle cx="155" cy="75" r="14" fill="none" stroke="#1591DC" strokeWidth="2" />
          <text x="155" y="79" textAnchor="middle" fill="#FFFFFF" fontSize="0.7rem">70</text>
          
          {/* Rotation curve */}
          <path d="M 175 75 A 30 30 0 0 1 125 15" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />
          <text x="165" y="40" fill="#f59e0b" fontSize="0.55rem">Rotate</text>
        </svg>
      );
    case 'heap':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <circle cx="110" cy="20" r="12" fill="none" stroke="#1591DC" strokeWidth="2" />
          <text x="110" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">10</text>
          
          <line x1="102" y1="28" x2="73" y2="52" stroke="var(--bg-tertiary)" strokeWidth="2" />
          <circle cx="65" cy="60" r="12" fill="none" stroke="#1591DC" strokeWidth="2" />
          <text x="65" y="64" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">15</text>
          
          <line x1="118" y1="28" x2="147" y2="52" stroke="var(--bg-tertiary)" strokeWidth="2" />
          <circle cx="155" cy="60" r="12" fill="none" stroke="#1591DC" strokeWidth="2" />
          <text x="155" y="64" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">30</text>
          
          <line x1="58" y1="68" x2="37" y2="92" stroke="var(--bg-tertiary)" strokeWidth="2" />
          <circle cx="30" cy="100" r="12" fill="none" stroke="#10b981" strokeWidth="2" />
          <text x="30" y="104" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">40</text>
          
          {/* Swap action */}
          <path d="M 38 95 A 15 15 0 0 1 57 68" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="50" y="85" fill="#f59e0b" fontSize="0.55rem">Heapify</text>
        </svg>
      );
    case 'trie':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <circle cx="110" cy="15" r="10" fill="none" stroke="var(--bg-tertiary)" strokeWidth="2" />
          <text x="110" y="19" textAnchor="middle" fill="#FFFFFF" fontSize="0.6rem">root</text>
          
          <line x1="104" y1="23" x2="76" y2="47" stroke="#1591DC" strokeWidth="2" />
          <circle cx="70" cy="55" r="10" fill="none" stroke="#1591DC" strokeWidth="2" />
          <text x="70" y="59" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">c</text>
          
          <line x1="70" y1="65" x2="70" y2="85" stroke="#1591DC" strokeWidth="2" />
          <circle cx="70" cy="95" r="10" fill="none" stroke="#1591DC" strokeWidth="2" />
          <text x="70" y="99" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">a</text>
          
          <line x1="70" y1="105" x2="90" y2="105" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2,2" />
          <text x="102" y="108" fill="#10b981" fontSize="0.55rem">t (word)</text>
        </svg>
      );
    case 'dijkstra':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <circle cx="50" cy="60" r="12" fill="none" stroke="#10b981" strokeWidth="2" />
          <text x="50" y="64" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">A</text>
          
          <line x1="62" y1="55" x2="138" y2="25" stroke="#10b981" strokeWidth="2" />
          <text x="100" y="32" fill="#10b981" fontSize="0.6rem">2</text>
          <circle cx="150" cy="20" r="12" fill="none" stroke="#10b981" strokeWidth="2" />
          <text x="150" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">B</text>
          
          <line x1="62" y1="65" x2="138" y2="95" stroke="var(--bg-tertiary)" strokeWidth="2" />
          <text x="100" y="90" fill="var(--text-secondary)" fontSize="0.6rem">6</text>
          <circle cx="150" cy="100" r="12" fill="none" stroke="var(--bg-tertiary)" strokeWidth="2" />
          <text x="150" y="104" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">C</text>
        </svg>
      );
    case 'topo':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="20" y="45" width="40" height="24" fill="none" stroke="#1591DC" strokeWidth="1.5" rx="3" />
          <text x="40" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">Task A</text>
          
          <line x1="60" y1="57" x2="95" y2="57" stroke="var(--bg-tertiary)" strokeWidth="2" />
          <polygon points="95,54 101,57 95,60" fill="var(--bg-tertiary)" />
          
          <rect x="105" y="45" width="40" height="24" fill="none" stroke="#1591DC" strokeWidth="1.5" rx="3" />
          <text x="125" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">Task B</text>
          
          <line x1="145" y1="57" x2="180" y2="57" stroke="var(--bg-tertiary)" strokeWidth="2" />
          <polygon points="180,54 186,57 180,60" fill="var(--bg-tertiary)" />
          
          <rect x="190" y="45" width="40" height="24" fill="none" stroke="#10b981" strokeWidth="1.5" rx="3" />
          <text x="210" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">Task C</text>
        </svg>
      );
    default:
      // Generic flowchart schematic
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="10" y="45" width="50" height="30" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1.5" rx="4" />
          <text x="35" y="64" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.65rem">Client</text>
          
          <line x1="60" y1="55" x2="155" y2="55" stroke="#1591DC" strokeWidth="1.5" strokeDasharray="3,3" />
          <text x="110" y="47" fill="#1591DC" fontSize="0.55rem">Request</text>
          
          <line x1="155" y1="65" x2="60" y2="65" stroke="#10b981" strokeWidth="1.5" />
          <text x="110" y="80" fill="#10b981" fontSize="0.55rem">Response</text>
          
          <rect x="160" y="45" width="50" height="30" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1.5" rx="4" />
          <text x="185" y="64" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.65rem">Server</text>
        </svg>
      );
  }
}

export default function InteractiveVisualizer() {
  const [activeCategory, setActiveCategory] = useState('DSA');
  const [activeTopicId, setActiveTopicId] = useState('arraylist');

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
                  color: 'var(--text-tertiary)',
                  backgroundColor: 'rgba(255,255,255,0.02)'
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
            /* Render Dynamic Roadmap Card Blueprint */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                borderBottom: '1px solid var(--bg-tertiary)',
                paddingBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className={activeTopic.icon} style={{ color: '#1591DC' }}></i> {activeTopic.name}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem', margin: 0 }}>
                    {activeTopic.description}
                  </p>
                </div>
                {/* Roadmap Badges */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '3px',
                    border: '1px solid #f59e0b',
                    color: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.05)'
                  }}>
                    Diff: {activeTopic.difficulty || 'Intermediate'}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '3px',
                    border: '1px solid #ef4444',
                    color: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)'
                  }}>
                    Freq: {activeTopic.frequency || 'High'}
                  </span>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '1.5rem',
                alignItems: 'start'
              }} className="visualizer-grid-layout">
                
                {/* Left side: Interactive mockup diagram */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="viz-simulator-canvas" style={{
                    minHeight: '230px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px dashed var(--bg-tertiary)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '1.5rem'
                  }}>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
                      Visual Blueprint Mockup
                    </span>
                    <PreviewDiagram type={activeTopic.previewType} />
                  </div>

                  <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--bg-tertiary)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '1.25rem'
                  }}>
                    <h5 style={{ color: '#FFFFFF', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fa-solid fa-map" style={{ color: '#1591DC' }}></i> Learning Objective
                    </h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                      {activeTopic.objective}
                    </p>
                  </div>
                </div>

                {/* Right side: Planned features checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--bg-tertiary)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '1.25rem'
                  }}>
                    <h5 style={{ color: '#FFFFFF', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fa-solid fa-list-check" style={{ color: '#10b981' }}></i> Planned Simulation Features
                    </h5>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {(activeTopic.features || []).map((feat, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          <span style={{ color: '#10b981', fontWeight: '700' }}>✓</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: 'rgba(21, 145, 220, 0.02)',
                    border: '1px dashed rgba(21, 145, 220, 0.3)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '1rem 1.25rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.4'
                  }}>
                    <strong>Release Roadmap:</strong> This simulation is scheduled for final integration. Clicking its selector highlights its planned controls, allowing you to preview the curriculum scope.
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
