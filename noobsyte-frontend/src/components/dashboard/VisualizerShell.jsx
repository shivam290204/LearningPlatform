import React, { useState } from 'react';
import './InteractiveVisualizer.css';

export default function VisualizerShell({
  title,
  subtitle,
  timeComplexity = 'O(1)',
  spaceComplexity = 'O(1)',
  theoryContent,
  analogyContent,
  mistakesContent,
  interviewQuestions = [],
  quizQuestions = [],
  controls,
  logs = [],
  stateInspector,
  playbackProps,
  children
}) {
  const [activeTab, setActiveTab] = useState('theory'); // 'theory', 'mistakes', 'interview', 'quiz'
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const handleQuizAnswer = (idx) => {
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === quizQuestions[activeQuestionIdx].correctIdx) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleQuizNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (activeQuestionIdx < quizQuestions.length - 1) {
      setActiveQuestionIdx(prev => prev + 1);
    } else {
      setActiveQuestionIdx(0);
      setQuizScore(0);
    }
  };

  return (
    <div className="viz-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Header with Complexity Badges */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid var(--bg-tertiary)',
        paddingBottom: '1rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h4 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>{title}</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem', margin: 0 }}>{subtitle}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{
            backgroundColor: 'rgba(21, 145, 220, 0.1)',
            border: '1px solid #1591DC',
            borderRadius: 'var(--border-radius-sm)',
            padding: '0.4rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: '700',
            color: '#1591DC'
          }}>
            Time: {timeComplexity}
          </div>
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid #10b981',
            borderRadius: 'var(--border-radius-sm)',
            padding: '0.4rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: '700',
            color: '#10b981'
          }}>
            Space: {spaceComplexity}
          </div>
        </div>
      </div>

      {/* Grid container: Left (simulation) & Right (educational content) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: '1.5rem',
        alignItems: 'start'
      }} className="visualizer-grid-layout">
        
        {/* LEFT COLUMN: Controls, Canvas, Logs, State Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Controls Bar */}
          <div className="viz-action-controls" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Visualizer-specific controls */}
            {controls && <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', width: '100%' }}>{controls}</div>}
            
            {/* Standard Playback controls */}
            {playbackProps && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: controls ? '1px solid var(--bg-tertiary)' : 'none',
                paddingTop: controls ? '0.75rem' : 0,
                flexWrap: 'wrap',
                gap: '0.75rem',
                width: '100%'
              }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    className="btn-viz-action"
                    onClick={playbackProps.stepBackward}
                    disabled={playbackProps.currentStep === 0}
                    title="Previous Step"
                    style={{ padding: '0.5rem 0.75rem' }}
                  >
                    <i className="fa-solid fa-backward-step"></i>
                  </button>
                  
                  {playbackProps.isPlaying ? (
                    <button
                      className="btn-viz-action"
                      onClick={playbackProps.pause}
                      title="Pause"
                      style={{ padding: '0.5rem 1rem' }}
                    >
                      <i className="fa-solid fa-pause"></i> Pause
                    </button>
                  ) : (
                    <button
                      className="btn-viz-action btn-add"
                      onClick={playbackProps.play}
                      title="Play"
                      style={{ padding: '0.5rem 1rem' }}
                    >
                      <i className="fa-solid fa-play"></i> Play
                    </button>
                  )}
                  
                  <button
                    className="btn-viz-action"
                    onClick={playbackProps.stepForward}
                    disabled={playbackProps.currentStep >= playbackProps.totalSteps - 1}
                    title="Next Step"
                    style={{ padding: '0.5rem 0.75rem' }}
                  >
                    <i className="fa-solid fa-forward-step"></i>
                  </button>

                  <button
                    className="btn-viz-action btn-clear"
                    onClick={playbackProps.reset}
                    title="Reset Simulation"
                    style={{ padding: '0.5rem 0.75rem' }}
                  >
                    <i className="fa-solid fa-rotate-left"></i>
                  </button>
                </div>

                {/* Speed Slider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Speed:</span>
                  <input
                    type="range"
                    min="200"
                    max="2000"
                    step="100"
                    value={playbackProps.speed}
                    onChange={(e) => playbackProps.setSpeed(Number(e.target.value))}
                    style={{
                      accentColor: '#1591DC',
                      cursor: 'pointer',
                      width: '100px'
                    }}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'monospace', width: '30px' }}>
                    {Math.round(1000 / playbackProps.speed)}x
                  </span>
                </div>

                {/* Step indicator */}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                  Step: <strong>{playbackProps.currentStep + 1}</strong> / {playbackProps.totalSteps}
                </div>
              </div>
            )}
          </div>

          {/* Simulator Canvas */}
          <div className="viz-simulator-canvas" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {children}
          </div>

          {/* Logs Panel */}
          {logs && logs.length > 0 && (
            <div className="viz-terminal-log-panel">
              <div className="log-panel-header">Execution Trace Log</div>
              <div className="logs-body">
                {logs.map((log, index) => (
                  <div className="log-item-line" key={index}>
                    <span className="log-bullet">▶</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Memory / State Inspector */}
          {stateInspector && (
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--bg-tertiary)',
              borderRadius: 'var(--border-radius-md)',
              padding: '1.25rem'
            }}>
              <h5 style={{ color: 'var(--text-primary)', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fa-solid fa-microchip"></i> Internal State Inspector
              </h5>
              {stateInspector}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Educational Content Panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Tabs header */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--bg-tertiary)',
            borderRadius: 'var(--border-radius-md)',
            padding: '0.35rem'
          }}>
            <button
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                background: activeTab === 'theory' ? 'rgba(21, 145, 220, 0.1)' : 'transparent',
                color: activeTab === 'theory' ? '#1591DC' : 'var(--text-secondary)',
                fontWeight: activeTab === 'theory' ? '700' : '500',
                borderRadius: 'var(--border-radius-sm)',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('theory')}
            >
              Theory & Analogy
            </button>
            <button
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                background: activeTab === 'mistakes' ? 'rgba(21, 145, 220, 0.1)' : 'transparent',
                color: activeTab === 'mistakes' ? '#1591DC' : 'var(--text-secondary)',
                fontWeight: activeTab === 'mistakes' ? '700' : '500',
                borderRadius: 'var(--border-radius-sm)',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('mistakes')}
            >
              Mistakes
            </button>
            <button
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                background: activeTab === 'interview' ? 'rgba(21, 145, 220, 0.1)' : 'transparent',
                color: activeTab === 'interview' ? '#1591DC' : 'var(--text-secondary)',
                fontWeight: activeTab === 'interview' ? '700' : '500',
                borderRadius: 'var(--border-radius-sm)',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('interview')}
            >
              Interview Prep
            </button>
            {quizQuestions.length > 0 && (
              <button
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: 'none',
                  background: activeTab === 'quiz' ? 'rgba(21, 145, 220, 0.1)' : 'transparent',
                  color: activeTab === 'quiz' ? '#1591DC' : 'var(--text-secondary)',
                  fontWeight: activeTab === 'quiz' ? '700' : '500',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveTab('quiz')}
              >
                Quiz
              </button>
            )}
          </div>

          {/* Active Tab Panel Body */}
          <div style={{ minHeight: '350px' }}>
            
            {activeTab === 'theory' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--bg-tertiary)',
                  borderRadius: 'var(--border-radius-md)',
                  padding: '1.25rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  lineHeight: '1.5'
                }}>
                  <h5 style={{ color: '#FFFFFF', fontWeight: '700', marginBottom: '0.75rem' }}>
                    <i className="fa-solid fa-book-open" style={{ color: '#1591DC' }}></i> Theoretical Foundations
                  </h5>
                  {theoryContent}
                </div>

                <div style={{
                  backgroundColor: 'rgba(21, 145, 220, 0.02)',
                  border: '1px dashed rgba(21, 145, 220, 0.3)',
                  borderRadius: 'var(--border-radius-md)',
                  padding: '1.25rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  lineHeight: '1.5'
                }}>
                  <h5 style={{ color: '#FFFFFF', fontWeight: '700', marginBottom: '0.75rem' }}>
                    <i className="fa-solid fa-lightbulb" style={{ color: '#1591DC' }}></i> Real-World Analogy
                  </h5>
                  {analogyContent}
                </div>
              </div>
            )}

            {activeTab === 'mistakes' && (
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--bg-tertiary)',
                borderRadius: 'var(--border-radius-md)',
                padding: '1.25rem',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                lineHeight: '1.5'
              }}>
                <h5 style={{ color: '#FFFFFF', fontWeight: '700', marginBottom: '0.75rem' }}>
                  <i className="fa-solid fa-triangle-exclamation" style={{ color: '#ef4444' }}></i> Common Pitfalls & Mistakes
                </h5>
                {mistakesContent}
              </div>
            )}

            {activeTab === 'interview' && (
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--bg-tertiary)',
                borderRadius: 'var(--border-radius-md)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <h5 style={{ color: '#FFFFFF', fontWeight: '700', marginBottom: '0.25rem' }}>
                  <i className="fa-solid fa-briefcase" style={{ color: '#10b981' }}></i> High-Yield Interview Q&A
                </h5>
                {interviewQuestions.map((qa, index) => (
                  <div key={index} style={{
                    borderBottom: index < interviewQuestions.length - 1 ? '1px solid var(--bg-tertiary)' : 'none',
                    paddingBottom: index < interviewQuestions.length - 1 ? '0.75rem' : 0,
                    fontSize: '0.85rem'
                  }}>
                    <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '0.25rem' }}>Q: {qa.q}</strong>
                    <span style={{ color: 'var(--text-secondary)', display: 'block', lineHeight: '1.4' }}>A: {qa.a}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'quiz' && quizQuestions.length > 0 && (
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--bg-tertiary)',
                borderRadius: 'var(--border-radius-md)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <h5 style={{ color: '#1591DC', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <i className="fa-solid fa-graduation-cap"></i> Concept Checking Quiz
                </h5>

                <div style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--bg-tertiary)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Question {activeQuestionIdx + 1} of {quizQuestions.length}
                  </span>
                  
                  <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#FFFFFF', margin: 0, lineHeight: '1.4' }}>
                    {quizQuestions[activeQuestionIdx].question}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {quizQuestions[activeQuestionIdx].options.map((opt, oIdx) => {
                      const isCorrect = oIdx === quizQuestions[activeQuestionIdx].correctIdx;
                      const isSelected = selectedAnswer === oIdx;
                      
                      let borderStyle = '1px solid var(--bg-tertiary)';
                      let bgStyle = 'transparent';
                      if (showExplanation) {
                        if (isCorrect) {
                          borderStyle = '1px solid #10b981';
                          bgStyle = 'rgba(16, 185, 129, 0.05)';
                        } else if (isSelected) {
                          borderStyle = '1px solid #ef4444';
                          bgStyle = 'rgba(239, 68, 68, 0.05)';
                        }
                      } else if (isSelected) {
                        borderStyle = '1px solid #1591DC';
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => !showExplanation && handleQuizAnswer(oIdx)}
                          style={{
                            border: borderStyle,
                            backgroundColor: bgStyle,
                            color: isSelected && !showExplanation ? '#1591DC' : 'var(--text-secondary)',
                            padding: '0.65rem 0.85rem',
                            borderRadius: 'var(--border-radius-sm)',
                            fontSize: '0.8rem',
                            textAlign: 'left',
                            cursor: showExplanation ? 'default' : 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center',
                            width: '100%',
                            background: 'none'
                          }}
                        >
                          <span style={{ fontWeight: '700' }}>{String.fromCharCode(65 + oIdx)}.</span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {showExplanation && (
                    <div style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px dashed var(--bg-tertiary)',
                      borderRadius: 'var(--border-radius-sm)',
                      padding: '0.75rem',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.4',
                      marginTop: '0.5rem'
                    }}>
                      <span style={{
                        fontWeight: '700',
                        color: selectedAnswer === quizQuestions[activeQuestionIdx].correctIdx ? '#10b981' : '#ef4444',
                        display: 'block',
                        marginBottom: '0.25rem'
                      }}>
                        {selectedAnswer === quizQuestions[activeQuestionIdx].correctIdx ? '✓ Correct Answer!' : '✗ Incorrect Answer!'}
                      </span>
                      {quizQuestions[activeQuestionIdx].explanation}
                    </div>
                  )}

                  {showExplanation && (
                    <button
                      className="btn-viz-action btn-add"
                      onClick={handleQuizNext}
                      style={{ marginTop: '0.5rem', alignSelf: 'flex-end', cursor: 'pointer' }}
                    >
                      {activeQuestionIdx < quizQuestions.length - 1 ? 'Next Question ➔' : 'Restart Quiz ↺'}
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>Score: <strong>{quizScore}</strong> / {quizQuestions.length}</span>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
