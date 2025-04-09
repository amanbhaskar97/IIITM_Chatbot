import React, { useState } from 'react';
import FormButton from '../common/FormButton';
import FormInput from '../common/FormInput';

const LoginForm = ({ 
  setAuthView, 
  setToken, 
  setUser, 
  setIsAuthenticated, 
  setUserId, 
  setError, 
  setMessage, 
  resetAlerts 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetAlerts();
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (response.status === 403 && data.error === 'Email not verified') {
        // Email not verified, show verification screen
        setUserId(data.userId);
        setAuthView('verify-email');
        setMessage('Please verify your email to continue');
        return;
      }
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      
      // Reset form fields
      setEmail('');
      setPassword('');
    } catch (error) {
      setError(error.message);
      console.error('Login error:', error);
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
      />
      
      <FormInput
        label="Password:"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <div style={{ textAlign: 'right', marginBottom: '15px' }}>
        <span
          onClick={() => setAuthView('forgot-password')}
          style={{
            color: '#007bff',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '14px'
          }}
        >
          Forgot Password?
        </span>
      </div>
      
      <FormButton type="submit" text="Login" />
      
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <p>
          Don't have an account?{' '}
          <span
            onClick={() => setAuthView('register')}
            style={{
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Register here
          </span>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;