import React, { useState } from 'react';
import './QuizWidget.css';

function QuizWidget({ quiz, onQuizPassed }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="empty-quiz-panel">
        <p><i className="fa-solid fa-circle-info" style={{ marginRight: '0.5rem' }}></i> No self-assessment quizzes are currently configured for this lesson.</p>
      </div>
    );
  }

  // Support first question in list for simple inline assessments
  const activeQuestion = quiz.questions[0];
  const { questionText, options, correctAnswerIndex, explanation } = activeQuestion;

  const handleOptionSelect = (idx) => {
    if (isAnswered) return; // Prevent multiple selection locks
    setSelectedIdx(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedIdx === null || isAnswered) return;
    setIsAnswered(true);
    setShowExplanation(true);

    const isCorrect = selectedIdx === correctAnswerIndex;
    if (isCorrect && onQuizPassed) {
      onQuizPassed();
    }
  };

  const handleReset = () => {
    setSelectedIdx(null);
    setIsAnswered(false);
    setShowExplanation(false);
  };

  return (
    <div className="quiz-card-container">
      <div className="quiz-card-header">
        <h4><i className="fa-solid fa-circle-question" style={{ color: 'var(--brand-cyan)', marginRight: '0.5rem' }}></i> Quick Knowledge Check</h4>
        <span className="quiz-badge">1 Question</span>
      </div>

      <div className="quiz-question-box">
        <p className="question-text">{questionText}</p>

        <div className="quiz-options-list">
          {options.map((option, idx) => {
            const isSelected = selectedIdx === idx;
            const isCorrect = idx === correctAnswerIndex;
            
            let cardClass = '';
            if (isSelected) cardClass = 'selected';
            if (isAnswered) {
              if (isCorrect) cardClass = 'correct';
              else if (isSelected) cardClass = 'incorrect';
              else cardClass = 'disabled';
            }

            return (
              <button
                key={idx}
                className={`option-card ${cardClass}`}
                onClick={() => handleOptionSelect(idx)}
                disabled={isAnswered}
              >
                <div className="option-check-dot">
                  {isAnswered && isCorrect && <i className="fa-solid fa-check"></i>}
                  {isAnswered && isSelected && !isCorrect && <i className="fa-solid fa-xmark"></i>}
                </div>
                <span className={option.isCode ? 'option-code-text' : ''}>
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logic explanation banner */}
      {showExplanation && (
        <div className={`explanation-card ${selectedIdx === correctAnswerIndex ? 'passed' : 'failed'}`}>
          <h5 className="explanation-title">
            {selectedIdx === correctAnswerIndex ? (
              <><i className="fa-solid fa-circle-check" style={{ marginRight: '0.5rem' }}></i> Excellent! Correct Answer.</>
            ) : (
              <><i className="fa-solid fa-circle-xmark" style={{ marginRight: '0.5rem' }}></i> Oops! Incorrect Answer.</>
            )}
          </h5>
          <p className="explanation-text">{explanation}</p>
        </div>
      )}

      {/* Interaction Controls */}
      <div className="quiz-controls-row">
        {!isAnswered ? (
          <button
            className="btn-check-answer"
            onClick={handleCheckAnswer}
            disabled={selectedIdx === null}
          >
            Check Answer
          </button>
        ) : (
          <button className="btn-retry" onClick={handleReset}>
            Retry Assessment
          </button>
        )}
      </div>
    </div>
  );
}

export default QuizWidget;
