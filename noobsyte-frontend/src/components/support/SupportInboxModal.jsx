// noobsyte-frontend/src/components/support/SupportInboxModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SupportInboxModal.css';

export default function SupportInboxModal({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/v1/contact`);
      if (response.data.success) {
        setMessages(response.data.data || []);
      }
    } catch (err) {
      setError('Unable to load support messages. Ensure backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="inbox-modal-backdrop" onClick={onClose}>
      <div className="inbox-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="inbox-modal-header">
          <div className="inbox-title-wrapper">
            <i className="fa-solid fa-inbox inbox-header-icon"></i>
            <h3>Support Messages Inbox</h3>
            <span className="inbox-count-badge">{messages.length} Total</span>
          </div>
          <button className="inbox-close-btn" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        {/* Filter Search Bar */}
        <div className="inbox-search-bar">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Filter by sender name, email, or message keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="inbox-refresh-btn" onClick={fetchMessages} title="Refresh Inbox">
            <i className="fa-solid fa-rotate-right"></i> Refresh
          </button>
        </div>

        {/* Messages Body */}
        <div className="inbox-messages-list">
          {loading ? (
            <div className="inbox-state-msg">
              <span className="inbox-spinner"></span>
              <p>Loading contact messages...</p>
            </div>
          ) : error ? (
            <div className="inbox-state-msg error">
              <i className="fa-solid fa-circle-exclamation"></i>
              <p>{error}</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="inbox-state-msg">
              <i className="fa-solid fa-envelope-open"></i>
              <p>
                {messages.length === 0
                  ? 'No contact messages received yet.'
                  : 'No messages match your search filter.'}
              </p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div key={msg._id} className="message-card">
                <div className="message-card-header">
                  <div className="sender-info">
                    <span className="sender-name">{msg.name}</span>
                    <span className="sender-email">({msg.email})</span>
                  </div>
                  <span className="message-date">
                    {new Date(msg.createdAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <p className="message-body">{msg.message}</p>

                <div className="message-card-actions">
                  <a
                    href={`mailto:${msg.email}?subject=Re: Your message to NoobSyte Support`}
                    className="btn-reply-email"
                  >
                    <i className="fa-solid fa-reply"></i> Reply via Email
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
