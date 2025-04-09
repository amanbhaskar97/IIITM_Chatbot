import React, { useState } from 'react';
import FormButton from '../common/FormButton';
import FormInput from '../common/FormInput';

const VerifyEmailForm = ({ 
  setAuthView, 
  userId, 
  email,
  setToken, 
  setUser, 
  setIsAuthenticated, 
  setError, 
  setMessage, 
  resetAlerts 
}) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetAlerts();
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, otp })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      // Set authentication after successful verification
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      
      // Reset OTP field
      setOtp('');
    } catch (error) {
      setError(error.message);
      console.error('Verification error:', error);
    }
  };

  const resendVerification = async () => {
    resetAlerts();
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification code');
      }

      setMessage('Verification code resent successfully');
    } catch (error) {
      setError(error.message);
      console.error('Resend verification error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Enter the verification code sent to your email:
        </label>
        <FormInput
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          placeholder="6-digit code"
        />
      </div>
      
      <FormButton type="submit" text="Verify Email" />
      
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <span
          onClick={resendVerification}
          style={{
            color: '#007bff',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '14px'
          }}
        >
          Resend verification code
        </span>
      </div>
      
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <p>
          <span
            onClick={() => setAuthView('login')}
            style={{
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Back to login
          </span>
        </p>
      </div>
    </form>
  );
};

export default VerifyEmailForm;