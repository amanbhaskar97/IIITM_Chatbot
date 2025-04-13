import React, { useState } from 'react';
import FormInput from '../common/FormInput';
import FormButton from '../common/FormButton';

const ResetPasswordForm = ({ setAuthView, userId, setError, setMessage, resetAlerts }) => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetAlerts();

    try {
      if (newPassword !== confirmPassword) throw new Error('Passwords do not match');
      if (newPassword.length < 6) throw new Error('Password must be at least 6 characters long');

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp, newPassword })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Password reset failed');

      setAuthView('login');
      setMessage(data.message);
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput label="OTP Code" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="6-digit code" />
      <FormInput label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
      <FormInput label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
      <FormButton text="Reset Password" />

      <p className="text-center text-sm">
        <span onClick={() => setAuthView('login')} className="text-blue-600 hover:underline cursor-pointer">
          Back to login
        </span>
      </p>
    </form>
  );
};

export default ResetPasswordForm;
