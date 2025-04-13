import React, { useState } from 'react';
import FormInput from '../common/FormInput';
import FormButton from '../common/FormButton';

const VerifyEmailForm = ({ setAuthView, userId, email, setToken, setUser, setIsAuthenticated, setError, setMessage, resetAlerts }) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetAlerts();

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Verification failed');

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      setOtp('');
    } catch (error) {
      setError(error.message);
    }
  };

  const resendVerification = async () => {
    resetAlerts();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to resend verification code');

      setMessage('Verification code resent successfully');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput label="Verification Code" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="6-digit code" />
      <FormButton text="Verify Email" />

      <p className="text-center text-sm">
        <span onClick={resendVerification} className="text-blue-600 hover:underline cursor-pointer">
          Resend verification code
        </span>
      </p>

      <p className="text-center text-sm">
        <span onClick={() => setAuthView('login')} className="text-blue-600 hover:underline cursor-pointer">
          Back to login
        </span>
      </p>
    </form>
  );
};

export default VerifyEmailForm;
