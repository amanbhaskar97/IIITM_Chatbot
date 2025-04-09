import React, { useState } from 'react';
import FormButton from '../common/FormButton';
import FormInput from '../common/FormInput';

const ForgotPasswordForm = ({ 
  setAuthView, 
  setUserId, 
  setError, 
  setMessage, 
  resetAlerts 
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetAlerts();
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process request');
      }

      // Show reset password screen
      setUserId(data.userId);
      setAuthView('reset-password');
      setMessage(data.message);
    } catch (error) {
      setError(error.message);
      console.error('Forgot password error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Email:"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Enter your registered email"
      />
      
      <FormButton type="submit" text="Send Reset Code" />
      
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

export default ForgotPasswordForm;