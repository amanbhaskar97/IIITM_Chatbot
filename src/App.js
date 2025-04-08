import React, { useState, useCallback, useEffect, useRef } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login', 'register', 'verify-email', 'forgot-password', 'reset-password'
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // OTP and verification states
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Check if token exists on mount
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        // Token might be expired or invalid
        logout();
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      logout();
    }
  };

  const login = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
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

  const register = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
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

  const verifyEmail = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
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
    setError('');
    setMessage('');
    
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

  const forgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
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

  const resetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
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

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setIsAuthenticated(false);
    setMessages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const systemContext = {
      role: 'system',
      content: "You are EmonerY, a friendly and empathetic chatbot inspired by ELIZA. You should respond in a way that shows genuine interest in the user's feelings and experiences, often reflecting their statements back to them or asking probing questions. Keep your responses concise and focused on understanding the user's emotional state. Always maintain a supportive and non-judgmental tone."
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: [systemContext, ...messages, userMessage]
        })
      });

      if (!response.ok) {
        // Check if authentication error
        if (response.status === 401) {
          logout();
          throw new Error('Authentication required, please login again');
        }
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setIsTyping(false);
      
      const assistantMessage = {
        role: 'assistant',
        content: data.content
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Could you try again?"
      }]);
    }
  };

  // Render form alert (error or message)
  const renderAlert = () => {
    if (error) {
      return (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          {error}
        </div>
      );
    }
    
    if (message) {
      return (
        <div style={{
          padding: '10px',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          {message}
        </div>
      );
    }
    
    return null;
  };

  // Render login form
  const renderLoginForm = () => {
    return (
      <div style={{
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
        
        {renderAlert()}
        
        <form onSubmit={login}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ced4da',
                fontSize: '16px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ced4da',
                fontSize: '16px'
              }}
            />
          </div>
          
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
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Login
          </button>
        </form>
        
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
      </div>
    );
  };

  // Render registration form
  const renderRegisterForm = () => {
    return (
      <div style={{
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Register</h2>
        
        {renderAlert()}
        
        <form onSubmit={register}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ced4da',
                fontSize: '16px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ced4da',
                fontSize: '16px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ced4da',
                fontSize: '16px'
              }}
            />
          </div>
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Register
          </button>
        </form>
        
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
      </div>
    );
  };

  // Render email verification form
  const renderVerifyEmailForm = () => {
    return (
      <div style={{
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Verify Email</h2>
        
        {renderAlert()}
        
        <form onSubmit={verifyEmail}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Enter the verification code sent to your email:
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="6-digit code"
              style={{
                width: '100%',
                padding: '10px',
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ced4da',
                fontSize: '16px'
              }}
            />
          </div>
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              marginBottom: '10px'
            }}
          >
            Verify Email
          </button>
          
          <div style={{ textAlign: 'center' }}>
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
        </form>
        
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
      </div>
    );
  };

  // Render forgot password form
  const renderForgotPasswordForm = () => {
    return (
      <div style={{
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Forgot Password</h2>
        
        {renderAlert()}
        
        <form onSubmit={forgotPassword}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your registered email"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ced4da',
                fontSize: '16px'
              }}
            />
          </div>
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Send Reset Code
          </button>
        </form>
        
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
      </div>
    );
  };

  // Render reset password form
  const renderResetPasswordForm = () => {
    return (
      <div style={{
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Reset Password</h2>
        
        {renderAlert()}
        
        <form onSubmit={resetPassword}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Enter the reset code sent to your email:
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="6-digit code"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ced4da',
                fontSize: '16px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="6"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ced4da',
                fontSize: '16px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ced4da',
                fontSize: '16px'
              }}
            />
          </div>
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Reset Password
          </button>
        </form>
        
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
      </div>
    );
  };

  // Render the appropriate authentication form based on authView
  const renderAuthForm = () => {
    switch (authView) {
      case 'login':
        return renderLoginForm();
      case 'register':
        return renderRegisterForm();
      case 'verify-email':
        return renderVerifyEmailForm();
      case 'forgot-password':
        return renderForgotPasswordForm();
      case 'reset-password':
        return renderResetPasswordForm();
      default:
        return renderLoginForm();
    }
  };

  // Add some basic CSS for the typing indicator
  const typingIndicatorStyle = `
    .typing-indicator {
      display: flex;
      align-items: center;
    }
    .typing-indicator span {
      height: 8px;
      width: 8px;
      margin: 0 2px;
      background-color: #6c757d;
      display: block;
      border-radius: 50%;
      opacity: 0.4;
      animation: typing 1s infinite ease-in-out;
    }
    .typing-indicator span:nth-child(1) {
      animation-delay: 0s;
    }
    .typing-indicator span:nth-child(2) {
      animation-delay: 0.2s;
    }
    .typing-indicator span:nth-child(3) {
      animation-delay: 0.4s;
    }
    @keyframes typing {
      0% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.2); }
      100% { opacity: 0.4; transform: scale(1); }
    }
  `;

  // Render chat app or auth forms based on authentication state
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <style>{typingIndicatorStyle}</style>
      
      {isAuthenticated ? (
        // Chat UI when authenticated
        <>
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h1 style={{
              color: '#2c3e50',
              fontSize: '2em'
            }}>EmonerY Chat</h1>
            
            <div>
              <span style={{ marginRight: '10px' }}>Hi, {user?.username}</span>
              <button
                onClick={logout}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            backgroundColor: '#f8f9fa'
          }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#6c757d', marginTop: '20px' }}>
                <p>Start a conversation with EmonerY!</p>
                <p style={{ fontSize: '0.9em' }}>EmonerY is here to chat and help you explore your thoughts and feelings.</p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '15px',
                  textAlign: message.role === 'user' ? 'right' : 'left'
                }}
              >
                <div style={{
                  display: 'inline-block',
                  maxWidth: '70%',
                  padding: '10px 15px',
                  borderRadius: '15px',
                  backgroundColor: message.role === 'user' ? '#007bff' : '#e9ecef',
                  color: message.role === 'user' ? 'white' : 'black'
                }}>
                  {message.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{
                marginBottom: '15px',
                textAlign: 'left'
              }}>
                <div style={{
                  display: 'inline-block',
                  padding: '10px 15px',
                  borderRadius: '15px',
                  backgroundColor: '#e9ecef',
                }}>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            gap: '10px'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ced4da',
                fontSize: '16px'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Send
            </button>
          </form>
        </>
      ) : (
        // Auth forms when not authenticated
        <>
          <div style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <h1 style={{
              color: '#2c3e50',
              fontSize: '2em'
            }}>Welcome to EmonerY Chat</h1>
            <p style={{
              color: '#7f8c8d'
            }}>Please login or register to start chatting</p>
          </div>
          
          {renderAuthForm()}
        </>
      )}
    </div>
  );
}

export default App;