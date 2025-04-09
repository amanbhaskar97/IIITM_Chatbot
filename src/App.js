import React, { useState, useEffect } from 'react';
import AuthContainer from './components/auth/AuthContainer';
import ChatContainer from './components/chat/ChatContainer';

function App() {
  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  
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

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {isAuthenticated ? (
        <ChatContainer 
          user={user} 
          token={token} 
          logout={logout} 
        />
      ) : (
        <AuthContainer 
          setToken={setToken} 
          setUser={setUser} 
          setIsAuthenticated={setIsAuthenticated} 
        />
      )}
    </div>
  );
}

export default App;