import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContacts } from '../../context/ContactContext';
import {
  FiMail,
  FiLock,
  FiUser,
  FiArrowRight,
  FiCheckCircle,
  FiShield,
  FiRefreshCw,
  FiDatabase,
  FiAlertCircle
} from 'react-icons/fi';
import './Auth.css';

// Google Multicolor SVG
const GoogleIcon = () => (
  <svg className="social-svg-icon" viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

// Apple SVG
const AppleIcon = () => (
  <svg className="social-svg-icon" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.56.65-1.05 1.71-.92 2.74 1.01.08 2.03-.5 2.62-1.24z" />
  </svg>
);

export const Auth = () => {
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authLoadingProvider, setAuthLoadingProvider] = useState(null); // 'google' | 'apple' | 'email' | null
  const [errorMessage, setErrorMessage] = useState('');

  const { loginWithGoogle, loginWithApple, loginWithEmail, signupWithEmail, showToast } = useContacts();
  const navigate = useNavigate();

  // Handle Real Google OAuth Login
  const handleGoogleClick = async () => {
    setErrorMessage('');
    setAuthLoadingProvider('google');
    try {
      const success = await loginWithGoogle();
      if (success) {
        navigate('/');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Google authentication failed');
    } finally {
      setAuthLoadingProvider(null);
    }
  };

  // Handle Real Apple Sign In
  const handleAppleClick = async () => {
    setErrorMessage('');
    setAuthLoadingProvider('apple');
    try {
      const success = await loginWithApple();
      if (success) {
        navigate('/');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Apple Sign-In failed');
    } finally {
      setAuthLoadingProvider(null);
    }
  };

  // Handle Direct Email Submit
  const handleEmailFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setAuthLoadingProvider('email');
    try {
      if (authTab === 'signup') {
        const success = await signupWithEmail({
          email,
          password,
          name: fullName
        });
        if (success) navigate('/');
      } else {
        const success = await loginWithEmail(email, password);
        if (success) navigate('/');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication error');
    } finally {
      setAuthLoadingProvider(null);
    }
  };

  return (
    <div className="auth-page-container animate-fade-in">
      {/* Background Glow */}
      <div className="auth-glow-sphere sphere-1"></div>
      <div className="auth-glow-sphere sphere-2"></div>

      <div className="auth-card-wrap">
        {/* Left Brand Banner */}
        <div className="auth-brand-banner">
          <div>
            <div className="auth-badge-pill">
              <span className="auth-pulse-dot"></span>
              <span>Production Cloud Directory</span>
            </div>

            <h1 className="auth-main-headline">
              Smart Contacts, <br />
              <span className="text-emerald-gradient">Cloud-Synced &amp; Isolated.</span>
            </h1>

            <p className="auth-banner-desc">
              Connect with your verified Google, Apple, or Email credentials. Each user account is cryptographically isolated in a secure database.
            </p>
          </div>

          <div className="auth-features-list">
            <div className="auth-feature-item">
              <div className="feature-icon-wrap">
                <FiDatabase />
              </div>
              <div className="feature-text">
                <strong>Real User Database Isolation</strong>
                <span>Contacts belong exclusively to your verified authenticated ID.</span>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="feature-icon-wrap">
                <FiRefreshCw />
              </div>
              <div className="feature-text">
                <strong>Google &amp; Apple OAuth</strong>
                <span>Real OAuth identity integration with zero mock accounts or demo data.</span>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="feature-icon-wrap">
                <FiShield />
              </div>
              <div className="feature-text">
                <strong>Row-Level Security (RLS)</strong>
                <span>Database policies enforce zero cross-user visibility.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Auth Panel */}
        <div className="auth-form-panel">
          <div className="social-auth-header">
            <div className="auth-brand-mini-logo">C</div>
            <h2 className="auth-social-title">
              {authTab === 'login' ? 'Sign in to Connect.' : 'Create your account.'}
            </h2>
            <p className="auth-social-subtitle">
              {authTab === 'login'
                ? 'Authenticate to access your private cloud contact vault.'
                : 'Sign up for a secure, isolated cloud directory.'}
            </p>
          </div>

          {errorMessage && (
            <div className="auth-error-banner animate-slide-down">
              <FiAlertCircle className="error-banner-icon" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Social Sign In Buttons */}
          <div className="social-buttons-container">
            <button
              type="button"
              className="social-sign-btn google-sign-btn"
              onClick={handleGoogleClick}
              disabled={Boolean(authLoadingProvider)}
            >
              {authLoadingProvider === 'google' ? (
                <span className="btn-loading-spinner text-slate"></span>
              ) : (
                <GoogleIcon />
              )}
              <span>
                {authLoadingProvider === 'google' ? 'Connecting to Google...' : 'Continue with Google'}
              </span>
            </button>

            <button
              type="button"
              className="social-sign-btn apple-sign-btn"
              onClick={handleAppleClick}
              disabled={Boolean(authLoadingProvider)}
            >
              {authLoadingProvider === 'apple' ? (
                <span className="btn-loading-spinner text-white"></span>
              ) : (
                <AppleIcon />
              )}
              <span>
                {authLoadingProvider === 'apple' ? 'Connecting to Apple...' : 'Continue with Apple'}
              </span>
            </button>
          </div>

          {/* OR Divider */}
          <div className="auth-or-divider">
            <span className="or-line"></span>
            <span className="or-text">or with email</span>
            <span className="or-line"></span>
          </div>

          {/* Email / Password Form */}
          <form className="quick-email-form" onSubmit={handleEmailFormSubmit}>
            {authTab === 'signup' && (
              <div className="auth-field-group">
                <label>Full Name</label>
                <div className="auth-input-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="auth-field-group">
              <label>Email Address</label>
              <div className="auth-input-wrapper">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field-group">
              <label>{authTab === 'signup' ? 'Create Password' : 'Password (optional)'}</label>
              <div className="auth-input-wrapper">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={authTab === 'signup' ? 6 : undefined}
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={Boolean(authLoadingProvider)}
            >
              {authLoadingProvider === 'email' ? (
                <span className="btn-loading-spinner"></span>
              ) : (
                <>
                  <span>{authTab === 'login' ? 'Sign In with Email' : 'Create Account'}</span>
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Login and Sign Up */}
          <div className="auth-toggle-row">
            {authTab === 'login' ? (
              <span>
                Need a new account?{' '}
                <button
                  type="button"
                  className="auth-toggle-link"
                  onClick={() => {
                    setAuthTab('signup');
                    setErrorMessage('');
                  }}
                >
                  Create an account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  className="auth-toggle-link"
                  onClick={() => {
                    setAuthTab('login');
                    setErrorMessage('');
                  }}
                >
                  Sign in
                </button>
              </span>
            )}
          </div>

          {/* Security Footer Note */}
          <div className="auth-panel-footer">
            <FiCheckCircle className="footer-check-icon" />
            <span>
              Real Cloud Database • User Isolation • AES-256 Encrypted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
