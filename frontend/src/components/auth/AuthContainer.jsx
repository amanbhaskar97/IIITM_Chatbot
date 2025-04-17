import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import VerifyEmailForm from './VerifyEmailForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import ResetPasswordForm from './ResetPasswordForm';
import AlertMessage from '../common/AlertMessage';
// Import your logo
import logo from '../../assets/images/iiitm-logo.png';

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
    <div className="w-full max-w-md mx-auto pt-8">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="IIITM Logo" className="h-16 w-auto" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">IIITM Virtual Assist</h1>
        <p className="text-muted-foreground text-sm mt-1">Your personal academic assistant</p>
      </div>

      <div className="bg-background rounded-xl shadow-lg p-6 border border-border">
        <h2 className="text-lg font-medium text-center mb-4 text-foreground capitalize">
          {authView.replace('-', ' ')}
        </h2>
        <AlertMessage error={error} message={message} />
        {renderAuthForm()}
      </div>
    </div>
  );
};

export default AuthContainer;