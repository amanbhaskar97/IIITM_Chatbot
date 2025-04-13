import React, { useState } from 'react';
import FormInput from '../common/FormInput';
import FormButton from '../common/FormButton';

const RegisterForm = ({ setAuthView, setUserId, setError, setMessage, resetAlerts, setEmail: setParentEmail }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetAlerts();

    try {
      if (password.length < 6) throw new Error('Password must be at least 6 characters long');

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');

      setUserId(data.userId);
      setParentEmail(email);
      setAuthView('verify-email');
      setMessage(data.message);
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <FormInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />

      <FormButton text="Register" />

      <p className="text-center text-sm">
        Already have an account?{' '}
        <span onClick={() => setAuthView('login')} className="text-blue-600 hover:underline cursor-pointer">
          Login here
        </span>
      </p>
    </form>
  );
};

export default RegisterForm;
