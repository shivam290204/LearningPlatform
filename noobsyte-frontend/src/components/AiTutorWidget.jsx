import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './AiTutorWidget.css';

function AiTutorWidget() {
  const { user, token } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hi! I'm your NoobSyte Learning Assistant. 🤖\n\nI can help you understand programming concepts (Java, Python, C++), explain Data Structures & Algorithms, or debug your code! What are you studying today?"
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Automatically scroll messages list to the bottom when new message arrives
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputVal.trim();
    if (!text) return;

    if (!textToSend) {
      setInputVal('');
    }

    // Add user message to UI
    const newUserMsg = { sender: 'user', text };
    setMessages(prev => [...prev, newUserMsg]);
    setLoading(true);

    try {
      // Format chat history for Gemini (excluding the initial greeting)
      const history = [];
      // We skip the first AI greeting message to avoid cluttering history
      for (let i = 1; i < messages.length; i++) {
        const msg = messages[i];
        history.push({
          role: msg.sender === 'ai' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        });
      }

      const response = await axios.post(
        `${API_URL}/api/v1/tutor/chat`,
        { message: text, history },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const replyText = response.data.data.reply;
      setMessages(prev => [...prev, { sender: 'ai', text: replyText }]);
    } catch (err) {
      console.error('Error contacting AI tutor:', err.message);
      const errMsg = err.response?.data?.message || 'Failed to connect to tutoring server. Please try again.';
      setMessages(prev => [...prev, { sender: 'ai', text: `⚠️ Error: ${errMsg}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (prompt) => {
    handleSendMessage(prompt);
  };

  // Helper formatter for text and code blocks
  const formatMessage = (text) => {
    if (!text) return '';
    // Match code blocks fenced with ```
    const parts = text.split(/(```[a-zA-Z]*\n[\s\S]*?\n```)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('```')) {
        const lines = part.split('\n');
        const lang = lines[0].replace('```', '').trim() || 'java';
        const code = lines.slice(1, lines.length - 1).join('\n');
        return (
          <div key={idx} className="chat-code-block-container">
            <div className="chat-code-header">
              <span>{lang.toUpperCase()}</span>
              <button
                className="chat-code-copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  alert('Code copied to clipboard!');
                }}
              >
                Copy <i className="fa-regular fa-copy"></i>
              </button>
            </div>
            <pre className="chat-code-pre">
              <code className={`language-${lang}`}>{code}</code>
            </pre>
          </div>
        );
      } else {
        // Replace inline code ticks like `foo` with custom styled inline code
        const textParts = part.split(/(`[^`]+`)/g);
        return (
          <span key={idx}>
            {textParts.map((tPart, tIdx) => {
              if (tPart.startsWith('`') && tPart.endsWith('`')) {
                return (
                  <code key={tIdx} className="chat-inline-code">
                    {tPart.slice(1, -1)}
                  </code>
                );
              }
              // Format standard linebreaks to <br/>
              return tPart.split('\n').map((line, lineIdx, array) => (
                <React.Fragment key={lineIdx}>
                  {line}
                  {lineIdx < array.length - 1 && <br />}
                </React.Fragment>
              ));
            })}
          </span>
        );
      }
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        className={`ai-tutor-fab ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? 'Close Chat' : 'Chat with AI Tutor'}
      >
        {isOpen ? '×' : <i className="fa-solid fa-robot"></i>}
      </button>

      {/* Slide-out Chat Panel */}
      <div className={`ai-tutor-drawer ${isOpen ? 'visible' : ''}`}>
        <div className="ai-tutor-header">
          <h4>
            <i className="fa-solid fa-graduation-cap" style={{ color: 'var(--brand-cyan)' }}></i> NoobSyte AI Assistant
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="ai-tutor-status">ONLINE</span>
            <button className="btn-close-drawer" onClick={() => setIsOpen(false)}>×</button>
          </div>
        </div>

        {/* Auth check verification overlay inside chat panel */}
        {!user ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', gap: '1.25rem' }}>
            <i className="fa-solid fa-lock" style={{ fontSize: '2.5rem', color: 'var(--text-tertiary)' }}></i>
            <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>AI Assistant Locked</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Please sign in or register for a free account to unlock our AI Placement Tutor and get personalized help!
            </p>
          </div>
        ) : (
          <>
            <div className="ai-tutor-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`ai-tutor-msg-row ${msg.sender === 'user' ? 'user' : 'ai'}`}>
                  <div className="ai-tutor-bubble">
                    {formatMessage(msg.text)}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="ai-tutor-messages ai">
                  <div className="ai-tutor-bubble">
                    <div className="chat-loading-container">
                      <div className="chat-dot"></div>
                      <div className="chat-dot"></div>
                      <div className="chat-dot"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestions Panel (Rendered only on start/reset) */}
              {messages.length === 1 && !loading && (
                <div className="ai-tutor-suggestions">
                  <span>SUGGESTIONS</span>
                  <button 
                    className="ai-tutor-suggestion-btn" 
                    onClick={() => handleSuggestionClick('Explain the difference between Stack and Heap memory models')}
                  >
                    Explain Stack vs Heap 🧠 <i className="fa-solid fa-chevron-right"></i>
                  </button>
                  <button 
                    className="ai-tutor-suggestion-btn" 
                    onClick={() => handleSuggestionClick('What is the difference between mutable and immutable objects in Python?')}
                  >
                    Python Mutability 📦 <i className="fa-solid fa-chevron-right"></i>
                  </button>
                  <button 
                    className="ai-tutor-suggestion-btn" 
                    onClick={() => handleSuggestionClick('Can you explain pointers and memory addresses in C++?')}
                  >
                    Pointers & References 🐞 <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Box */}
            <form
              className="ai-tutor-input-box"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input
                type="text"
                className="ai-tutor-input"
                placeholder="Ask tutor about coding or DSA..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={loading}
              />
              <button 
                type="submit" 
                className="btn-ai-tutor-send"
                disabled={loading || !inputVal.trim()}
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}

export default AiTutorWidget;
