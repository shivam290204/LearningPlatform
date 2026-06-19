import React, { useState } from 'react';
import './QuizWidget.css';

function QuizWidget({ quiz, onQuizPassed, onSubmitAnswer }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Local state for answers returned by server if not pre-provided (stripped in API)
  const activeQuestion = quiz ? quiz.questions[0] : null;
  const [correctIdx, setCorrectIdx] = useState(activeQuestion ? activeQuestion.correctAnswerIndex : null);
  const [explanationText, setExplanationText] = useState(activeQuestion ? activeQuestion.explanation : '');
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="empty-quiz-panel">
        <p><i className="fa-solid fa-circle-info" style={{ marginRight: '0.5rem' }}></i> No self-assessment quizzes are currently configured for this lesson.</p>
      </div>
    );
  }

  const { questionText, options } = activeQuestion;

  const handleOptionSelect = (idx) => {
    if (isAnswered) return; // Prevent multiple selection locks
    setSelectedIdx(idx);
  };

  const handleCheckAnswer = async () => {
    if (selectedIdx === null || isAnswered) return;

    if (onSubmitAnswer) {
      // Server-side validation flow
      const result = await onSubmitAnswer(selectedIdx);
      if (result && result.success) {
        setCorrectIdx(result.correctAnswerIndex);
        setExplanationText(result.explanation);
        setIsCorrectAnswer(result.isCorrect);
        setIsAnswered(true);
        setShowExplanation(true);
        if (result.isCorrect && onQuizPassed) {
          onQuizPassed(true); // server-synced pass
        }
      } else {
        alert('Failed to submit answer. Please try again.');
      }
    } else {
      // Local fallback validation (offline/guest mode)
      const localCorrectIdx = activeQuestion.correctAnswerIndex;
      const localExplanation = activeQuestion.explanation;
      const isCorrect = selectedIdx === localCorrectIdx;

      setCorrectIdx(localCorrectIdx);
      setExplanationText(localExplanation);
      setIsCorrectAnswer(isCorrect);
      setIsAnswered(true);
      setShowExplanation(true);
      if (isCorrect && onQuizPassed) {
        onQuizPassed(false); // local-only pass
      }
    }
  };

  const handleReset = () => {
    setSelectedIdx(null);
    setIsAnswered(false);
    setShowExplanation(false);
    setIsCorrectAnswer(false);
    setCorrectIdx(activeQuestion ? activeQuestion.correctAnswerIndex : null);
    setExplanationText(activeQuestion ? activeQuestion.explanation : '');
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
            const isCorrect = idx === correctIdx;
            
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
        <div className={`explanation-card ${isCorrectAnswer ? 'passed' : 'failed'}`}>
          <h5 className="explanation-title">
            {isCorrectAnswer ? (
              <><i className="fa-solid fa-circle-check" style={{ marginRight: '0.5rem' }}></i> Excellent! Correct Answer.</>
            ) : (
              <><i className="fa-solid fa-circle-xmark" style={{ marginRight: '0.5rem' }}></i> Oops! Incorrect Answer.</>
            )}
          </h5>
          <p className="explanation-text">{explanationText}</p>
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
