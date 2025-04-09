import React, { useState } from 'react';
import FormButton from '../common/FormButton';
import FormInput from '../common/FormInput';

const RegisterForm = ({ 
  setAuthView, 
  setUserId, 
  setError, 
  setMessage, 
  resetAlerts,
  setEmail: setParentEmail
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetAlerts();
    
    try {
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Show verification screen
      setUserId(data.userId);
      setParentEmail(email);
      setAuthView('verify-email');
      setMessage(data.message);
      
      // Reset form fields
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setError(error.message);
      console.error('Registration error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Username:"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      
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
        minLength="6"
      />
      
      <FormButton type="submit" text="Register" />
      
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <p>
          Already have an account?{' '}
          <span
            onClick={() => setAuthView('login')}
            style={{
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Login here
          </span>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;