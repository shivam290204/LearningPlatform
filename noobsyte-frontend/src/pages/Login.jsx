import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

function Login({ onSwitchScreen, onLoginSuccess }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in all credentials fields.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="login-card-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to resume your programming and DSA learning tracks.</p>
        </div>

        {errorMsg && (
          <div className="auth-error-banner">
            <i className="fa-solid fa-circle-exclamation"></i> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter secure password"
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
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button className="auth-link-btn" onClick={() => onSwitchScreen('register')}>
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
