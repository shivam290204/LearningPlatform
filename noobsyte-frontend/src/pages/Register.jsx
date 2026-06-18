import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Login.css'; // Leverage shared visual styles

function Register({ onSwitchScreen, onRegisterSuccess }) {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg('Please fill in all registration parameters.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    const result = await register(name, email, password);
    setIsSubmitting(false);

    if (result.success) {
      if (onRegisterSuccess) onRegisterSuccess();
    } else {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="login-card-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join NoobSyte today and master Java & DSA visually.</p>
        </div>

        {errorMsg && (
          <div className="auth-error-banner">
            <i className="fa-solid fa-circle-exclamation"></i> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="e.g. Arjun Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="e.g. arjun@noobsyte.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password (Min 8 chars)</label>
            <input
              type="password"
              id="password"
              placeholder="Create strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button className="auth-link-btn" onClick={() => onSwitchScreen('login')}>
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
