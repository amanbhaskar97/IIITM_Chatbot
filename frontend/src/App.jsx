import React, { useState, useEffect } from 'react';
import AuthContainer from './components/auth/AuthContainer';
import ChatContainer from './components/chat/ChatContainer';
import { ThemeProvider } from './theme/ThemeContext';
import ThemeToggle from './theme/ThemeToggle';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

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
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          {isAuthenticated ? (
            <ChatContainer user={user} token={token} logout={logout} />
          ) : (
            <AuthContainer 
              setToken={setToken} 
              setUser={setUser} 
              setIsAuthenticated={setIsAuthenticated} 
            />
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
