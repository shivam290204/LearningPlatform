import React, { useState, useEffect } from 'react';
import './QuizWidget.css';

function QuizWidget({ quiz, onQuizPassed, onSubmitAnswer }) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Local state for answers returned by server if not pre-provided (stripped in API)
  const [correctIdx, setCorrectIdx] = useState(null);
  const [explanationText, setExplanationText] = useState('');
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // Sync state when quiz resets or changes
  useEffect(() => {
    setCurrentQuestionIdx(0);
    setCorrectCount(0);
    setIsQuizCompleted(false);
    setSelectedIdx(null);
    setIsAnswered(false);
    setShowExplanation(false);
    setIsCorrectAnswer(false);

    if (quiz && quiz.questions && quiz.questions[0]) {
      const q = quiz.questions[0];
      setCorrectIdx(q.correctAnswerIndex !== undefined ? q.correctAnswerIndex : null);
      setExplanationText(q.explanation || '');
    }
  }, [quiz]);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="empty-quiz-panel">
        <p><i className="fa-solid fa-circle-info" style={{ marginRight: '0.5rem' }}></i> No self-assessment quizzes are currently configured for this lesson.</p>
      </div>
    );
  }

  const activeQuestion = quiz.questions[currentQuestionIdx] || quiz.questions[0];
  const { questionText, options } = activeQuestion;

  const handleOptionSelect = (idx) => {
    if (isAnswered) return; // Prevent multiple selection locks
    setSelectedIdx(idx);
  };

  const handleCheckAnswer = async () => {
    if (selectedIdx === null || isAnswered) return;

    if (onSubmitAnswer) {
      // Server-side validation flow
      const result = await onSubmitAnswer(selectedIdx, currentQuestionIdx);
      if (result && result.success) {
        setCorrectIdx(result.correctAnswerIndex);
        setExplanationText(result.explanation);
        setIsCorrectAnswer(result.isCorrect);
        setIsAnswered(true);
        setShowExplanation(true);
        if (result.isCorrect) {
          setCorrectCount((prev) => prev + 1);
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
      if (isCorrect) {
        setCorrectCount((prev) => prev + 1);
      }
    }
  };

  const handleNext = () => {
    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx < quiz.questions.length) {
      setCurrentQuestionIdx(nextIdx);
      setSelectedIdx(null);
      setIsAnswered(false);
      setShowExplanation(false);
      setIsCorrectAnswer(false);

      const nextQ = quiz.questions[nextIdx];
      setCorrectIdx(nextQ.correctAnswerIndex !== undefined ? nextQ.correctAnswerIndex : null);
      setExplanationText(nextQ.explanation || '');
    }
  };

  const handleFinish = () => {
    setIsQuizCompleted(true);
    const totalQ = quiz.questions.length;
    const passingThreshold = Math.ceil(totalQ * 0.6);
    if (correctCount >= passingThreshold) {
      if (onQuizPassed) {
        onQuizPassed(!!onSubmitAnswer);
      }
    }
  };

  const handleReset = () => {
    setCurrentQuestionIdx(0);
    setCorrectCount(0);
    setIsQuizCompleted(false);
    setSelectedIdx(null);
    setIsAnswered(false);
    setShowExplanation(false);
    setIsCorrectAnswer(false);

    if (quiz && quiz.questions && quiz.questions[0]) {
      const q = quiz.questions[0];
      setCorrectIdx(q.correctAnswerIndex !== undefined ? q.correctAnswerIndex : null);
      setExplanationText(q.explanation || '');
    }
  };

  if (isQuizCompleted) {
    const totalQ = quiz.questions.length;
    const percent = Math.round((correctCount / totalQ) * 100);
    const passed = correctCount >= Math.ceil(totalQ * 0.6);

    return (
      <div className="quiz-card-container">
        <div className="quiz-card-header">
          <h4>
            <i className="fa-solid fa-square-poll-vertical" style={{ color: 'var(--brand-cyan)', marginRight: '0.5rem' }}></i>
            Assessment Results
          </h4>
          <span className="quiz-badge">{passed ? 'Passed' : 'Failed'}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '2rem 1rem', textAlign: 'center' }}>
          {/* Circular Score Gauge */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: `conic-gradient(var(--brand-cyan) ${percent}%, var(--bg-primary) ${percent}%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(21, 145, 220, 0.25)',
            position: 'relative'
          }}>
            {/* Inner cutout */}
            <div style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-secondary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{correctCount}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>out of {totalQ}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: passed ? 'var(--brand-cyan)' : 'var(--text-primary)' }}>
              {passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto', fontSize: '0.95rem', lineHeight: '1.5' }}>
              {passed 
                ? `You've successfully cleared the assessment with a score of ${percent}% and unlocked +50 XP!`
                : `You scored ${percent}%. You need at least 60% (${Math.ceil(totalQ * 0.6)} correct answers) to pass and unlock XP.`}
            </p>
          </div>
        </div>

        <div className="quiz-controls-row" style={{ borderTop: '1px solid var(--bg-tertiary)', paddingTop: '1.5rem' }}>
          <button className="btn-retry" onClick={handleReset} style={{ width: '100%' }}>
            {passed ? 'Retake Assessment' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-card-container">
      <div className="quiz-card-header">
        <h4><i className="fa-solid fa-circle-question" style={{ color: 'var(--brand-cyan)', marginRight: '0.5rem' }}></i> Quick Knowledge Check</h4>
        <span className="quiz-badge">{quiz.questions.length} Questions</span>
      </div>

      <div className="quiz-question-box">
        <p className="question-text">
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Question {currentQuestionIdx + 1} of {quiz.questions.length}
          </span>
          {questionText}
        </p>

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
      <div className="quiz-controls-row" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        {!isAnswered ? (
          <button
            className="btn-check-answer"
            onClick={handleCheckAnswer}
            disabled={selectedIdx === null}
          >
            Check Answer
          </button>
        ) : (
          currentQuestionIdx < quiz.questions.length - 1 ? (
            <button className="btn-check-answer" onClick={handleNext}>
              Next Question <i className="fa-solid fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
            </button>
          ) : (
            <button className="btn-check-answer" onClick={handleFinish}>
              Finish Quiz <i className="fa-solid fa-circle-check" style={{ marginLeft: '0.5rem' }}></i>
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default QuizWidget;
