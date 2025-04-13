import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import VerifyEmailForm from './VerifyEmailForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import ResetPasswordForm from './ResetPasswordForm';
import AlertMessage from '../common/AlertMessage';

const AuthContainer = ({ setToken, setUser, setIsAuthenticated }) => {
  const [authView, setAuthView] = useState('login');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const resetAlerts = () => {
    setError('');
    setMessage('');
  };

  const renderAuthForm = () => {
    switch (authView) {
      case 'login':
        return <LoginForm {...{ setAuthView, setToken, setUser, setIsAuthenticated, setUserId, setError, setMessage, resetAlerts }} />;
      case 'register':
        return <RegisterForm {...{ setAuthView, setUserId, setError, setMessage, resetAlerts, setEmail }} />;
      case 'verify-email':
        return <VerifyEmailForm {...{ setAuthView, userId, email, setToken, setUser, setIsAuthenticated, setError, setMessage, resetAlerts }} />;
      case 'forgot-password':
        return <ForgotPasswordForm {...{ setAuthView, setUserId, setError, setMessage, resetAlerts }} />;
      case 'reset-password':
        return <ResetPasswordForm {...{ setAuthView, userId, setError, setMessage, resetAlerts }} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Welcome to EmonerY Chat</h1>
        <p className="text-muted-foreground">Please login or register to start chatting</p>
      </div>

      <div className="border rounded-xl bg-background shadow-lg p-6">
        <h2 className="text-xl font-semibold text-center mb-4 capitalize">
          {authView.replace('-', ' ')}
        </h2>
        <AlertMessage error={error} message={message} />
        {renderAuthForm()}
      </div>
    </div>
  );
};

export default AuthContainer;
