const API_URL = process.env.REACT_APP_BACKEND_URL;
// Authentication services
export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    return await response.json();
  },
  
  register: async (username, email, password) => {
    const response = await fetch(`${API_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password })
    });
    
    return await response.json();
  },
  
  verifyEmail: async (userId, otp) => {
    const response = await fetch(`${API_URL}/api/users/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, otp })
    });
    
    return await response.json();
  },
  
  resendVerification: async (email) => {
    const response = await fetch(`${API_URL}/api/users/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });
    
    return await response.json();
  },
  
  forgotPassword: async (email) => {
    const response = await fetch(`${API_URL}/api/users/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });
    
    return await response.json();
  },
  
  resetPassword: async (userId, otp, newPassword) => {
    const response = await fetch(`${API_URL}/api/users/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, otp, newPassword })
    });
    
    return await response.json();
  },
  
  getUserProfile: async (token) => {
    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return await response.json();
  }
};
// Chat service
export const chatService = {
  sendMessage: async (token, messages) => {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ messages })
    });
    
    return await response.json();
  }
};
export default {
  authService,
  chatService
};