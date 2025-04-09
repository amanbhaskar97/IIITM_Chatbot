import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import VerifyEmailForm from './VerifyEmailForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import ResetPasswordForm from './ResetPasswordForm';
import AlertMessage from '../common/AlertMessage';

const AuthContainer = ({ setToken, setUser, setIsAuthenticated }) => {
  const [authView, setAuthView] = useState('login'); // 'login', 'register', 'verify-email', 'forgot-password', 'reset-password'
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Reset all alert messages
  const resetAlerts = () => {
    setError('');
    setMessage('');
  };

  // Render the appropriate authentication form based on authView
  const renderAuthForm = () => {
    switch (authView) {
      case 'login':
        return (
          <LoginForm 
            setAuthView={setAuthView}
            setToken={setToken}
            setUser={setUser}
            setIsAuthenticated={setIsAuthenticated}
            setUserId={setUserId}
            setError={setError}
            setMessage={setMessage}
            resetAlerts={resetAlerts}
          />
        );
      case 'register':
        return (
          <RegisterForm 
            setAuthView={setAuthView}
            setUserId={setUserId}
            setError={setError}
            setMessage={setMessage}
            resetAlerts={resetAlerts}
            setEmail={setEmail}
          />
        );
      case 'verify-email':
        return (
          <VerifyEmailForm 
            setAuthView={setAuthView}
            userId={userId}
            email={email}
            setToken={setToken}
            setUser={setUser}
            setIsAuthenticated={setIsAuthenticated}
            setError={setError}
            setMessage={setMessage}
            resetAlerts={resetAlerts}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm 
            setAuthView={setAuthView}
            setUserId={setUserId}
            setError={setError}
            setMessage={setMessage}
            resetAlerts={resetAlerts}
          />
        );
      case 'reset-password':
        return (
          <ResetPasswordForm 
            setAuthView={setAuthView}
            userId={userId}
            setError={setError}
            setMessage={setMessage}
            resetAlerts={resetAlerts}
          />
        );
      default:
        return (
          <LoginForm 
            setAuthView={setAuthView}
            setToken={setToken}
            setUser={setUser}
            setIsAuthenticated={setIsAuthenticated}
            setUserId={setUserId}
            setError={setError}
            setMessage={setMessage}
            resetAlerts={resetAlerts}
          />
        );
    }
  };

  return (
    <>
      <div style={{
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{
          color: '#2c3e50',
          fontSize: '2em'
        }}>Welcome to EmonerY Chat</h1>
        <p style={{
          color: '#7f8c8d'
        }}>Please login or register to start chatting</p>
      </div>
      
      <div style={{
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          {authView === 'login' ? 'Login' : 
           authView === 'register' ? 'Register' : 
           authView === 'verify-email' ? 'Verify Email' : 
           authView === 'forgot-password' ? 'Forgot Password' : 'Reset Password'}
        </h2>
        
        <AlertMessage error={error} message={message} />
        
        {renderAuthForm()}
      </div>
    </>
  );
};

export default AuthContainer;