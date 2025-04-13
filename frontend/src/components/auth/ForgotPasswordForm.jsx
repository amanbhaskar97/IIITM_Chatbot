import React, { useState } from 'react';
import FormInput from '../common/FormInput';
import FormButton from '../common/FormButton';

const ForgotPasswordForm = ({ setAuthView, setUserId, setError, setMessage, resetAlerts }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetAlerts();

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to process request');

      setUserId(data.userId);
      setAuthView('reset-password');
      setMessage(data.message);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <FormButton text="Send Reset Code" />

      <p className="text-center text-sm">
        <span onClick={() => setAuthView('login')} className="text-blue-600 hover:underline cursor-pointer">
          Back to login
        </span>
      </p>
    </form>
  );
};

export default ForgotPasswordForm;
