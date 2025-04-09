import React, { useState } from 'react';
import FormButton from '../common/FormButton';
import FormInput from '../common/FormInput';

const ResetPasswordForm = ({ 
  setAuthView, 
  userId, 
  setError, 
  setMessage, 
  resetAlerts 
}) => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetAlerts();
    
    try {
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, otp, newPassword })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Password reset failed');
      }

      // Show login screen after successful reset
      setAuthView('login');
      setMessage(data.message);
      
      // Reset fields
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError(error.message);
      console.error('Reset password error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Enter the reset code sent to your email:
        </label>
        <FormInput
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          placeholder="6-digit code"
        />
      </div>
      
      <FormInput
        label="New Password:"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        minLength="6"
      />
      
      <FormInput
        label="Confirm Password:"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        minLength="6"
      />
      
      <FormButton type="submit" text="Reset Password" />
      
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

export default ResetPasswordForm;