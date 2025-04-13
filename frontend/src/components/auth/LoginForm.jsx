import React, { useState } from 'react';
import FormInput from '../common/FormInput';
import FormButton from '../common/FormButton';

const LoginForm = ({ setAuthView, setToken, setUser, setIsAuthenticated, setUserId, setError, setMessage, resetAlerts }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetAlerts();

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.status === 403 && data.error === 'Email not verified') {
        setUserId(data.userId);
        setAuthView('verify-email');
        setMessage('Please verify your email to continue');
        return;
      }

      if (!response.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      setEmail('');
      setPassword('');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <FormInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

      <div className="text-right text-sm">
        <span onClick={() => setAuthView('forgot-password')} className="text-blue-600 hover:underline cursor-pointer">
          Forgot Password?
        </span>
      </div>

      <FormButton text="Login" />

      <p className="text-center text-sm">
        Don't have an account?{' '}
        <span onClick={() => setAuthView('register')} className="text-blue-600 hover:underline cursor-pointer">
          Register here
        </span>
      </p>
    </form>
  );
};

export default LoginForm;
